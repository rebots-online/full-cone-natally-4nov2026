import firebaseConfig from '../../firebase-applet-config.json' with { type: 'json' };
import { readRevenueCatAccess } from '../lib/revenuecat-access.mjs';

const FORMATS = new Set(['wav', 'pdf', 'markdown', 'png', 'jpg', 'transcript']);
const READING_ENTITLEMENT_ID = 'entlbc6dd8a62a';
const DOWNLOADS_ENTITLEMENT_ID = 'entl2ef69e9c03';

function isValidResourceId(value) {
  if (typeof value !== 'string' || value.length === 0 || value.length > 2048) return false;
  for (const ch of value) {
    const code = ch.charCodeAt(0);
    if (code < 0x20 || code === 0x7f) return false;
  }
  return true;
}

/** RevenueCat owner-bound download authorization; account-owned content only. */
export default async function downloadAccess(request) {
  const env = name => Netlify.env.get(name) || '';
  const origin = request.headers.get('origin');
  const allowList = ['https://natally.robin.mba', 'https://natally.surge.sh'];
  const configuredOrigin = env('BILLING_ALLOWED_ORIGIN').trim();
  let allowedOrigin = null;
  if (/^https:\/\//.test(configuredOrigin)) {
    try {
      const parsed = new URL(configuredOrigin);
      if (parsed.protocol === 'https:' && parsed.origin === configuredOrigin &&
          !parsed.username && !parsed.password) allowedOrigin = configuredOrigin;
    } catch {
      allowedOrigin = null;
    }
  }
  if (allowedOrigin) allowList.push(allowedOrigin);
  const headers = {
    'Content-Type': 'application/json', 'Cache-Control': 'private, no-store, max-age=0',
    Pragma: 'no-cache', Vary: 'Origin', 'X-Content-Type-Options': 'nosniff',
    ...(allowList.includes(origin) ? {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    } : {}),
  };
  const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers });
  if (origin && !allowList.includes(origin)) return reply({ error: 'Origin unavailable.' }, 403);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') return reply({ error: 'Method unavailable.' }, 405);
  const token = /^Bearer (\S+)$/.exec(request.headers.get('authorization') || '')?.[1];
  if (!token) return reply({ error: 'Sign in to check a download purchase.' }, 401);
  let payload;
  try {
    const length = Number(request.headers.get('content-length') || 0);
    if (length > 8192) return reply({ error: 'Request is unavailable.' }, 413);
    const text = await request.text();
    if (text.length > 8192) return reply({ error: 'Request is unavailable.' }, 413);
    payload = JSON.parse(text);
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error();
  } catch {
    return reply({ error: 'Your purchase could not be checked. Please try again.' }, 400);
  }
  if (!isValidResourceId(payload.resourceId) || !FORMATS.has(payload.format)) {
    return reply({ error: 'Your purchase could not be checked. Please try again.' }, 400);
  }
  try {
    // Google verifies the bearer; unverified JWT claims never authorize access.
    const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + firebaseConfig.apiKey, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }), signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return reply({ error: 'Sign in again to check a download purchase.' }, 401);
    const { users } = await response.json();
    const user = users?.length === 1 ? users[0] : null;
    const claims = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'));
    const now = Date.now();
    if (!user?.localId || user.disabled || claims.sub !== user.localId ||
        claims.aud !== firebaseConfig.projectId || claims.iss !== 'https://securetoken.google.com/' + firebaseConfig.projectId ||
        !(claims.exp * 1000 > now) || !(claims.auth_time >= Number(user.validSince || 0))) {
      return reply({ error: 'Sign in again to check a download purchase.' }, 401);
    }
    const secretKey = env('REVENUECAT_SECRET_API_KEY').trim();
    if (!secretKey) return reply({ error: 'Download access is unavailable right now; retry shortly.' }, 503);
    const result = await readRevenueCatAccess(user.localId, { apiKey: secretKey, now });
    const relevantEntitlement = result.entitlementIds.includes(DOWNLOADS_ENTITLEMENT_ID) ||
      result.entitlementIds.includes(READING_ENTITLEMENT_ID);
    if (result.hasReadingPurchase && relevantEntitlement) {
      return reply({ state: 'owned', accountUid: user.localId, resourceId: payload.resourceId,
        format: payload.format, expiresAt: new Date(now + 60000).toISOString() });
    }
    return reply({ code: 'purchase_required' }, 403);
  } catch {
    // Neither Firebase responses, tokens nor provider secrets enter logs/errors.
    return reply({ error: 'Download access could not be connected. Retry shortly; no payment has been requested.' }, 503);
  }
}

export const config = { path: ['/downloads/access'] };
