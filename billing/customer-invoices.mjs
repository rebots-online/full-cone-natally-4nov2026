import firebaseConfig from '../firebase-applet-config.json' with { type: 'json' };

const ORIGIN = 'https://api.revenuecat.com';
const timeout = () => AbortSignal.timeout(15000);
const nonblank = value => typeof value === 'string' && value.trim().length > 0;
const timestamp = value => Number.isSafeInteger(value) && Number.isFinite(new Date(value).getTime());

export function invoiceConfiguration(env) {
  const apiKey = env.REVENUECAT_SECRET_API_KEY?.trim();
  const projectId = env.REVENUECAT_PROJECT_ID?.trim();
  const origins = String(env.BILLING_INVOICE_ALLOWED_ORIGINS || '').split(',').map(value => value.trim()).filter(Boolean);
  if (!nonblank(apiKey) || /^(rcb_|goog_|appl_)/.test(apiKey) || !nonblank(projectId) || !origins.length) {
    throw new Error('Invoice service is not configured.');
  }
  for (const origin of origins) {
    if (origin === 'http://tauri.localhost' || origin === 'tauri://localhost') continue;
    const url = new URL(origin);
    if (url.protocol !== 'https:' || url.origin !== origin || url.username || url.password) throw new Error('Invoice origins are not configured correctly.');
  }
  return { apiKey, projectId, origins };
}

export function validateInvoicePage(value, path) {
  const url = new URL(value, ORIGIN);
  if (url.origin !== ORIGIN || url.pathname !== path || url.username || url.password || url.hash) throw new Error('Unexpected invoice pagination URL.');
  return url;
}

/** Google verifies the bearer before its UID/project/revocation claims are used.
 * Matches the existing billing authenticate contract; never trusts decoded claims alone. */
export async function authenticateInvoiceOwner(authorization, fetchImpl = fetch) {
  const token = /^Bearer (\S+)$/.exec(authorization || '')?.[1];
  if (!token) return null;
  const response = await fetchImpl('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + firebaseConfig.apiKey, {
    method:'POST', headers:{'Content-Type':'application/json'}, redirect:'error',
    body:JSON.stringify({idToken:token}), signal:timeout(),
  });
  if (!response.ok) return null;
  const { users } = await response.json();
  const user = users?.length === 1 ? users[0] : null;
  let claims;
  try { claims = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8')); } catch { return null; }
  if (!nonblank(user?.localId) || user.disabled || claims.sub !== user.localId || claims.aud !== firebaseConfig.projectId ||
      claims.iss !== 'https://securetoken.google.com/' + firebaseConfig.projectId || !(claims.exp * 1000 > Date.now()) ||
      !(claims.auth_time >= Number(user.validSince || 0))) return null;
  return user.localId;
}

function customerPath(projectId, uid) {
  if (!nonblank(projectId) || !nonblank(uid)) throw new Error('Invoice owner is required.');
  return `/v2/projects/${encodeURIComponent(projectId)}/customers/${encodeURIComponent(uid)}/invoices`;
}
function headers(apiKey) { return {Authorization:`Bearer ${apiKey}`,Accept:'application/json'}; }
function invoiceRecord(value, path) {
  const money = value?.total_amount;
  if (value?.object !== 'invoice' || !nonblank(value.id) || value.id.length > 255 || !timestamp(value.issued_at) ||
      !(value.paid_at === null || timestamp(value.paid_at)) || !Array.isArray(value.line_items) ||
      !money || typeof money.currency !== 'string' || !/^[A-Z]{3}$/.test(money.currency) ||
      !Number.isFinite(money.gross) || !Number.isFinite(money.tax)) throw new Error('Invalid provider invoice.');
  const products = value.line_items.map(item => {
    if (!nonblank(item.product_identifier) || !(item.product_display_name === null || typeof item.product_display_name === 'string') ||
        !Number.isSafeInteger(item.quantity) || item.quantity < 0) throw new Error('Invalid provider invoice item.');
    return {productIdentifier:item.product_identifier,displayName:item.product_display_name,quantity:item.quantity};
  });
  if (value.invoice_url !== null) validateInvoicePage(value.invoice_url, `${path}/${encodeURIComponent(value.id)}/file`);
  return {id:value.id,issuedAt:value.issued_at,paidAt:value.paid_at,currency:money.currency,
    providerGross:money.gross,providerTax:money.tax,products,hasFile:value.invoice_url !== null};
}

export async function listCustomerInvoices(config, uid, fetchImpl = fetch) {
  const path = customerPath(config.projectId, uid);
  let url = new URL(path, ORIGIN); url.searchParams.set('limit','100');
  const seen = new Set(), ids = new Set(), invoices = [];
  while (url) {
    if (seen.has(url.href) || seen.size >= 50) throw new Error('Invoice pagination did not complete.');
    seen.add(url.href);
    const response = await fetchImpl(url.href, {headers:headers(config.apiKey),redirect:'error',signal:timeout()});
    if (!response.ok) throw new Error(`Invoice provider returned HTTP ${response.status}.`);
    const page = await response.json();
    if (page?.object !== 'list' || !Array.isArray(page.items)) throw new Error('Invalid provider invoice list.');
    for (const value of page.items) {
      const invoice = invoiceRecord(value,path);
      if (!ids.has(invoice.id)) { ids.add(invoice.id); invoices.push(invoice); }
    }
    url = page.next_page == null ? null : validateInvoicePage(page.next_page,path);
  }
  return invoices.sort((a,b) => b.issuedAt-a.issuedAt);
}

export async function customerInvoiceFile(config, uid, invoiceId, fetchImpl = fetch) {
  if (!nonblank(invoiceId) || invoiceId.length > 255 || /[\s/#?]/.test(invoiceId)) throw new Error('Invalid invoice identifier.');
  const path = `${customerPath(config.projectId,uid)}/${encodeURIComponent(invoiceId)}/file`;
  // The API authenticates this exact customer's file; never follow with its secret.
  const response = await fetchImpl(ORIGIN+path,{headers:headers(config.apiKey),redirect:'manual',signal:timeout()});
  if (response.status !== 302) throw new Error(`Invoice file returned HTTP ${response.status}.`);
  const location = response.headers.get('location');
  if (!location) throw new Error('Invoice file location is missing.');
  const url = new URL(location);
  if (url.protocol !== 'https:' || url.username || url.password || url.hash || url.origin === ORIGIN) throw new Error('Unsafe invoice file location.');
  return url.href;
}

/** Read-only Express handler, mounted on list and owner-scoped file routes. */
export function invoiceHandler(env = process.env, {fetchImpl = fetch} = {}) {
  return async (req, res) => {
    res.set({'Cache-Control':'private, no-store, max-age=0',Pragma:'no-cache',Vary:'Origin','X-Content-Type-Options':'nosniff'});
    let config;
    try { config = invoiceConfiguration(env); } catch { return res.status(503).json({error:'Invoice service is not configured.'}); }
    const origin = req.get('origin');
    if (origin && !config.origins.includes(origin)) return res.status(403).json({error:'Origin unavailable.'});
    if (origin) res.set({'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'Authorization','Access-Control-Allow-Methods':'GET, OPTIONS'});
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'GET') return res.status(405).json({error:'Method unavailable.'});
    try {
      const ownerUid = await authenticateInvoiceOwner(req.get('authorization'),fetchImpl);
      if (!ownerUid) return res.status(401).json({error:'Sign in again to view invoices.'});
      if (req.params.invoiceId) return res.json({ownerUid,url:await customerInvoiceFile(config,ownerUid,req.params.invoiceId,fetchImpl)});
      return res.json({ownerUid,invoices:await listCustomerInvoices(config,ownerUid,fetchImpl)});
    } catch { return res.status(502).json({error:'Invoice records could not be retrieved. Please retry.'}); }
  };
}
