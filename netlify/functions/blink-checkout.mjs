/**
 * Blink Lightning checkout route: invoice creation and settlement status.
 *
 * This route is intentionally honest about incomplete capabilities: it never
 * grants access, never reads a local balance, and never marks a settled quote
 * as ready. RevenueCat remains the sole payment authority; this route only
 * creates invoices, records immutable operational associations in the approved
 * Firebase operational store, submits verified settlements as RevenueCat
 * external purchase receipts, and reads RevenueCat back to confirm those
 * receipts. Fulfillment readiness is a separate concern.
 *
 * Security invariants:
 * - Prices come only from the server-configured product catalog; browser
 *   amounts are never accepted.
 * - All provider keys are server-only and never echoed.
 * - Operational records are UID-bound and idempotent per requestId.
 */

import { createHash } from 'node:crypto';
import { readBlinkConfig, createBlinkUsdInvoice, readBlinkInvoiceStatus, readBlinkSettlement } from '../lib/blink-lightning.mjs';
import { submitBlinkReceipt } from '../lib/blink-revenuecat.mjs';
import { createBlinkStore } from '../lib/blink-store.mjs';
import firebaseConfig from '../../firebase-applet-config.json' with { type: 'json' };

const MAX_BODY_BYTES = 8192;
const MAX_AMOUNT_MINOR = 100000000;
const QUOTE_TTL_MINUTES = 5;
const REQUEST_ID_PATTERN = /^[A-Za-z0-9_-]{16,100}$/;
const KINDS = new Set(['reading', 'experience']);
const INVOICE_PATH = '/billing/blink/invoice';
const STATUS_PATH = '/billing/blink/status';
const SUBSCRIBERS_ENDPOINT = 'https://api.revenuecat.com/v1/subscribers';
const TIMEOUT_MS = 12000;

function fail(message) {
  const error = new Error(message);
  error.handled = true;
  throw error;
}

function response(json, status, headers) {
  return new Response(JSON.stringify(json), { status, headers });
}

function safeInvoiceResponse(accountUid, requestId, invoice) {
  return {
    accountUid,
    requestId,
    state: 'pending',
    paymentRequest: invoice.paymentRequest,
    paymentHash: invoice.paymentHash,
    amountMinor: invoice.amountMinor,
    currency: 'USD',
    expiresAt: invoice.expiresAt,
  };
}

function readCatalog(env) {
  const raw = env('BLINK_PRODUCT_CATALOG_JSON');
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    fail('Catalog is not configured');
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    fail('Catalog is not configured');
  }
  const keys = Object.keys(parsed);
  if (keys.length !== 2 || !keys.includes('reading') || !keys.includes('experience')) {
    fail('Catalog is not configured');
  }
  for (const kind of keys) {
    const entry = parsed[kind];
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      fail('Catalog is not configured');
    }
    if (
      typeof entry.amountMinor !== 'number' ||
      !Number.isSafeInteger(entry.amountMinor) ||
      entry.amountMinor <= 0 ||
      entry.amountMinor > MAX_AMOUNT_MINOR
    ) {
      fail('Catalog is not configured');
    }
    if (typeof entry.productId !== 'string' || entry.productId.length === 0 || entry.productId.length > 255) {
      fail('Catalog is not configured');
    }
    if (typeof entry.sourceProductId !== 'string' || entry.sourceProductId.length === 0 || entry.sourceProductId.length > 255) {
      fail('Catalog is not configured');
    }
  }
  return parsed;
}

async function authenticate(request, env) {
  const token = /^Bearer (\S+)$/.exec(request.headers.get('authorization') || '')?.[1];
  if (!token) return null;
  const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + firebaseConfig.apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    redirect: 'error',
    body: JSON.stringify({ idToken: token }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) return null;
  const { users } = await response.json();
  const user = users?.length === 1 ? users[0] : null;
  let claims;
  try {
    claims = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  const now = Date.now();
  if (!user?.localId || user.disabled || claims.sub !== user.localId ||
      claims.aud !== firebaseConfig.projectId ||
      claims.iss !== 'https://securetoken.google.com/' + firebaseConfig.projectId ||
      !(claims.exp * 1000 > now) ||
      !(claims.auth_time >= Number(user.validSince || 0))) {
    return null;
  }
  return user.localId;
}

async function verifyRevenueCatReceipt(uid, sourceProductId, paymentHash, secretKey) {
  let response;
  try {
    response = await fetch(`${SUBSCRIBERS_ENDPOINT}/${encodeURIComponent(uid)}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${secretKey}` },
      redirect: 'error',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    return false;
  }
  if (!response.ok) return false;
  let body;
  try {
    body = await response.json();
  } catch {
    return false;
  }
  const subscriber = body && typeof body.subscriber === 'object' ? body.subscriber : null;
  const entries = subscriber && subscriber.non_subscriptions;
  const list = entries && typeof entries === 'object' ? entries[sourceProductId] : null;
  if (!Array.isArray(list)) return false;
  const expected = `blink:${paymentHash}`;
  return list.some((entry) =>
    entry &&
    typeof entry === 'object' &&
    entry.store_transaction_id === expected &&
    entry.is_sandbox === false,
  );
}

function getStore(env) {
  // A fresh store per call: OAuth tokens live about an hour and a cached
  // promise may hold a rejected result or an expired token forever.
  return createBlinkStore(env);
}

export default async function blinkCheckout(request) {
  const env = name => Netlify.env.get(name) || undefined;
  const origin = request.headers.get('origin');
  const allowList = ['https://natally.robin.mba', 'https://natally.surge.sh'];
  const configuredOrigin = (env('BILLING_ALLOWED_ORIGIN') || '').trim();
  if (/^https:\/\//.test(configuredOrigin)) {
    try {
      const parsed = new URL(configuredOrigin);
      if (parsed.protocol === 'https:' && parsed.origin === configuredOrigin &&
          !parsed.username && !parsed.password) allowList.push(configuredOrigin);
    } catch {
      // ignore invalid configured origin
    }
  }
  const headers = {
    'Content-Type': 'application/json', 'Cache-Control': 'no-store',
    Pragma: 'no-cache', Vary: 'Origin', 'X-Content-Type-Options': 'nosniff',
    ...(allowList.includes(origin) ? {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    } : {}),
  };
  const reply = (body, status = 200) => response(body, status, headers);
  if (origin && !allowList.includes(origin)) return reply({ error: 'Origin unavailable.' }, 403);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') return reply({ error: 'Method unavailable.' }, 405);

  const path = new URL(request.url).pathname;
  const action = path === INVOICE_PATH ? 'invoice' : path === STATUS_PATH ? 'status' : null;
  if (!action) return reply({ error: 'Request unavailable.' }, 404);

  const contentLength = Number(request.headers.get('content-length') || '0');
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return reply({ error: 'Request is invalid.' }, 413);
  }
  let text;
  try {
    text = await request.text();
  } catch {
    return reply({ error: 'Request is invalid.' }, 400);
  }
  if (Buffer.byteLength(text, 'utf8') > MAX_BODY_BYTES) {
    return reply({ error: 'Request is invalid.' }, 413);
  }
  let bodyRequest;
  let bodyKind;
  try {
    const body = JSON.parse(text);
    if (!body || typeof body !== 'object' || Array.isArray(body)) return reply({ error: 'Request is invalid.' }, 400);
    bodyRequest = body.requestId;
    bodyKind = body.kind;
  } catch {
    return reply({ error: 'Request is invalid.' }, 400);
  }
  if (typeof bodyRequest !== 'string' || !REQUEST_ID_PATTERN.test(bodyRequest)) {
    return reply({ error: 'Request is invalid.' }, 400);
  }
  if (typeof bodyKind !== 'string' || !KINDS.has(bodyKind)) {
    // Kind is required for both invoice and status so an operation is always
    // looked up and replayed under the same product kind.
    return reply({ error: 'Request is invalid.' }, 400);
  }

  let uid;
  try {
    uid = await authenticate(request, env);
  } catch {
    return reply({ error: 'Billing is temporarily unavailable. Retry shortly.' }, 503);
  }
  if (!uid) return reply({ error: 'Sign in to continue checkout.' }, 401);

  // All configuration is read and validated before any invoice work.
  let blinkConfig;
  let catalog;
  let externalKey;
  let secretKey;
  let store;
  try {
    blinkConfig = readBlinkConfig(env);
    externalKey = (env('REVENUECAT_EXTERNAL_API_KEY') || '').trim();
    secretKey = (env('REVENUECAT_SECRET_API_KEY') || '').trim();
    if (!externalKey) fail('Billing is not configured');
    if (!secretKey) fail('Billing is not configured');
    catalog = readCatalog(env);
    store = await getStore(env);
  } catch {
    return reply({ error: 'Billing is not configured.', code: 'payment_unconfigured' }, 503);
  }

  const catalogEntry = catalog[bodyKind];
  const opId = createHash('sha256').update(`${uid}\0${bodyRequest}`).digest('hex');
  const now = Date.now();
  const quote = {
    quoteId: opId,
    accountUid: uid,
    productId: catalogEntry.productId,
    amountMinor: catalogEntry.amountMinor,
    currency: 'USD',
    expiresAt: new Date(now + QUOTE_TTL_MINUTES * 60000).toISOString(),
  };

  try {
    let record;
    if (action === 'invoice') {
      const created = await store.create(opId, { quote, sourceProductId: catalogEntry.sourceProductId, kind: bodyKind, phase: 'creating' });
      if (created) {
        let invoice;
        try {
          invoice = await createBlinkUsdInvoice(quote, blinkConfig);
        } catch {
          // Ambiguous or failed creation: keep the creating record for
          // reconciliation; never delete, never auto-reissue.
          return reply({ error: 'Payment setup needs recovery.' }, 503);
        }
        const fresh = await store.get(opId);
        if (!fresh || !(await store.replace(opId, { ...fresh.payload, phase: 'invoiced', invoice }, fresh.updateTime))) {
          // The invoice exists at the provider but is not durably saved; never
          // hand out an unsaved invoice.
          return reply({ error: 'Payment setup needs recovery.' }, 503);
        }
        return reply(safeInvoiceResponse(uid, bodyRequest, invoice));
      }
      const existing = await store.get(opId);
      if (!existing) return reply({ error: 'Payment setup needs recovery.' }, 503);
      record = existing.payload;
      if (record.kind !== bodyKind || record.quote?.accountUid !== uid) {
        return reply({ error: 'Request does not match an existing operation.' }, 403);
      }
      if (record.phase === 'creating') {
        return reply({ error: 'Payment setup needs recovery.', code: 'invoice_recovery_required' }, 409);
      }
      if (record.phase === 'settled') {
        // Already paid: do not present an invoice again.
        return reply({ accountUid: uid, requestId: bodyRequest, state: 'paid', fulfillmentState: 'pending', code: 'receipt_pending' });
      }
      if (!record.invoice || record.phase !== 'invoiced') {
        return reply({ error: 'Payment setup needs recovery.', code: 'invoice_recovery_required' }, 409);
      }
      // Replay the retained invoice; never create a duplicate, even expired.
      return reply(safeInvoiceResponse(uid, bodyRequest, record.invoice));
    }

    // status action: UID-bound lookup only.
    const existing = await store.get(opId);
    if (!existing) return reply({ error: 'No payment found for this request.' }, 404);
    record = existing.payload;
    if (record.kind !== bodyKind || record.quote?.accountUid !== uid) {
      return reply({ error: 'Request does not match an existing operation.' }, 403);
    }
    if (!record.invoice) {
      return reply({ error: 'Payment setup needs recovery.', code: 'invoice_recovery_required' }, 409);
    }

    const settlement = await readBlinkSettlement(record.invoice, blinkConfig);
    if (!settlement) {
      const status = await readBlinkInvoiceStatus(record.invoice, blinkConfig);
      return reply({ accountUid: uid, requestId: bodyRequest, state: status.state });
    }

    let op = record;
    if (record.phase !== 'settled') {
      const persisted = await store.replace(opId, { ...record, phase: 'settled', settlement }, existing.updateTime);
      if (!persisted) {
        const reread = await store.get(opId);
        const other = reread?.payload;
        if (!other || other.phase !== 'settled' ||
            other.settlement?.transactionId !== settlement.transactionId ||
            other.settlement?.paymentHash !== settlement.paymentHash) {
          return reply({ error: 'Payment setup needs recovery.' }, 503);
        }
        op = other;
      } else {
        op = { ...record, phase: 'settled', settlement };
      }
    } else {
      op = record;
    }

    let submitted;
    try {
      submitted = await submitBlinkReceipt(op.settlement, {
        apiKey: externalKey,
        sourceProductId: op.sourceProductId,
      });
    } catch {
      // Settlement stays persisted for retry with identical identities.
      return reply({ error: 'Receipt processing is pending. Retry shortly.', code: 'receipt_pending' }, 503);
    }
    if (!submitted?.submitted) {
      return reply({ error: 'Receipt processing is pending. Retry shortly.', code: 'receipt_pending' }, 503);
    }

    const confirmed = await verifyRevenueCatReceipt(uid, op.sourceProductId, op.settlement.paymentHash, secretKey);
    return reply({
      accountUid: uid,
      requestId: bodyRequest,
      state: 'paid',
      fulfillmentState: 'pending',
      code: confirmed ? 'revenuecat_purchase_confirmed' : 'revenuecat_receipt_submitted',
    });
  } catch {
    return reply({ error: 'Payment processing is temporarily unavailable. Retry shortly.' }, 503);
  }
}

export const config = { path: [INVOICE_PATH, STATUS_PATH] };
