import firebaseConfig from '../../firebase-applet-config.json' with { type: 'json' };
import { readRevenueCatAccess } from '../lib/revenuecat-access.mjs';

/** RevenueCat owner-bound commercial projection; fulfillment readiness is separate. */
export default async function readingAccess(request) {
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    } : {}),
  };
  const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers });
  if (origin && !allowList.includes(origin)) return reply({ error: 'Origin unavailable.' }, 403);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (!['GET', 'POST'].includes(request.method)) return reply({ error: 'Method unavailable.' }, 405);
  const token = /^Bearer (\S+)$/.exec(request.headers.get('authorization') || '')?.[1];
  if (!token) return reply({ error: 'Sign in to connect reading access.' }, 401);
  try {
    // Google verifies the bearer; unverified JWT claims never authorize access.
    const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + firebaseConfig.apiKey, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }), signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return reply({ error: 'Sign in again to connect reading access.' }, 401);
    const { users } = await response.json();
    const user = users?.length === 1 ? users[0] : null;
    const claims = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'));
    const now = Date.now();
    if (!user?.localId || user.disabled || claims.sub !== user.localId ||
        claims.aud !== firebaseConfig.projectId || claims.iss !== 'https://securetoken.google.com/' + firebaseConfig.projectId ||
        !(claims.exp * 1000 > now) || !(claims.auth_time >= Number(user.validSince || 0))) {
      return reply({ error: 'Sign in again to connect reading access.' }, 401);
    }
    const secretKey = env('REVENUECAT_SECRET_API_KEY').trim();
    if (!secretKey) {
      return reply({ accountUid: user.localId, expiresAt: new Date(now + 60000).toISOString(),
        state: 'unavailable', transport: 'server', code: 'commercial_service_unconfigured' });
    }
    const result = await readRevenueCatAccess(user.localId, { apiKey: secretKey, now });
    const pending = result.remainingTurns > 0 || result.hasReadingPurchase || result.hasExperiencePurchase;
    return reply({ ...result,
      state: pending ? 'pending' : 'unavailable',
      code: pending ? 'fulfillment_provisioning' : 'purchase_required',
      transport: 'server', source: 'managed' });
  } catch {
    // Neither Firebase responses, tokens nor provider secrets enter logs/errors.
    return reply({ error: 'Reading access could not be connected. Your question is kept; retry shortly.' }, 503);
  }
}

export const config = { path: ['/billing/access', '/billing/reconcile'] };
