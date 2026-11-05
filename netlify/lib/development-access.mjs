import firebaseConfig from '../../firebase-applet-config.json' with { type: 'json' };

/** Temporary account grant through the billing access contract; never a paid grant. */
export default async function readingAccess(request) {
  const env = name => Netlify.env.get(name) || '';
  const origin = request.headers.get('origin');
  const allowedOrigin = env('BILLING_ALLOWED_ORIGIN') || 'https://natally.surge.sh';
  const headers = {
    'Content-Type': 'application/json', 'Cache-Control': 'private, no-store, max-age=0',
    Pragma: 'no-cache', Vary: 'Origin', 'X-Content-Type-Options': 'nosniff',
    ...(origin === allowedOrigin ? {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    } : {}),
  };
  const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers });
  if (origin !== allowedOrigin) return reply({ error: 'Origin unavailable.' }, 403);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (!['GET', 'POST'].includes(request.method)) return reply({ error: 'Method unavailable.' }, 405);
  const token = /^Bearer (\S+)$/.exec(request.headers.get('authorization') || '')?.[1];
  if (!token) return reply({ error: 'Sign in to connect reading access.' }, 401);
  try {
    // Google verifies the bearer; unverified JWT claims never authorize a key.
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
    const base = { accountUid: user.localId, expiresAt: new Date(now + 60000).toISOString() };
    const email = env('NATALLY_DEV_ACCESS_EMAIL').trim().toLowerCase();
    const accessExpiresAt = Date.parse(env('NATALLY_DEV_ACCESS_EXPIRES_AT'));
    const key = env('NATALLY_DEV_OPENROUTER_KEY').trim();
    if (!email || !user.emailVerified || user.email?.toLowerCase() !== email || !key ||
        !(accessExpiresAt > now) || accessExpiresAt > now + 31 * 86400000) {
      return reply({ ...base, state: 'unavailable' });
    }
    return reply({ ...base, state: 'ready', provider: 'openrouter', source: 'development',
      apiKey: key, accessExpiresAt: new Date(accessExpiresAt).toISOString() });
  } catch {
    // Neither Firebase responses, tokens nor the personal key enter logs/errors.
    return reply({ error: 'Reading access could not be connected. Your question is kept; retry shortly.' }, 503);
  }
}
