// Shared server-only authentication for the existing named Firestore database.
import { createSign } from 'node:crypto';
import firebaseConfig from '../firebase-applet-config.json' with { type: 'json' };

const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const OAUTH_SCOPE = 'https://www.googleapis.com/auth/datastore';
export const FIREBASE_REQUEST_TIMEOUT_MS = 12000;

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  throw error;
}
function readEnvValue(env, name) {
  if (typeof env === 'function') return env(name);
  if (env && typeof env === 'object') return env[name];
  return undefined;
}
function base64url(input) {
  return Buffer.from(input).toString('base64url');
}
async function fetchAccessToken(serviceAccount, fetchImpl) {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(JSON.stringify({
    iss: serviceAccount.client_email,
    aud: TOKEN_ENDPOINT,
    iat: nowSeconds,
    exp: nowSeconds + 3600,
    scope: OAUTH_SCOPE,
  }));
  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claims}`);
  const signature = signer.sign(serviceAccount.private_key);
  const assertion = `${header}.${claims}.${signature.toString('base64url')}`;
  let response;
  try {
    response = await fetchImpl(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      redirect: 'error',
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion,
      }).toString(),
      signal: AbortSignal.timeout(FIREBASE_REQUEST_TIMEOUT_MS),
    });
  } catch {
    fail('STORE_NETWORK', 'Store authentication failed');
  }
  if (!response.ok) fail('STORE_AUTH', 'Store authentication failed');
  let body;
  try { body = await response.json(); }
  catch { fail('STORE_RESPONSE', 'Store authentication failed'); }
  if (!body || typeof body !== 'object' || typeof body.access_token !== 'string' || body.access_token.length === 0) {
    fail('STORE_RESPONSE', 'Store authentication failed');
  }
  return body.access_token;
}

export async function createFirebaseAuth(env, { fetchImpl = fetch } = {}) {
  const raw = readEnvValue(env, 'FIREBASE_SERVICE_ACCOUNT_JSON');
  let serviceAccount = null;
  if (typeof raw === 'string' && raw.trim()) {
    try { serviceAccount = JSON.parse(raw); }
    catch { fail('STORE_UNCONFIGURED', 'FIREBASE_SERVICE_ACCOUNT_JSON is invalid'); }
    if (!serviceAccount || typeof serviceAccount !== 'object' || Array.isArray(serviceAccount) ||
        typeof serviceAccount.client_email !== 'string' || !serviceAccount.client_email ||
        typeof serviceAccount.private_key !== 'string' || !serviceAccount.private_key.includes('BEGIN PRIVATE KEY')) {
      fail('STORE_UNCONFIGURED', 'FIREBASE_SERVICE_ACCOUNT_JSON is invalid');
    }
  }
  const databaseId = firebaseConfig.firestoreDatabaseId;
  if (typeof databaseId !== 'string' || databaseId.length === 0) fail('STORE_UNCONFIGURED', 'Store is not configured');
  const documentsPath = `projects/${encodeURIComponent(firebaseConfig.projectId)}` +
    `/databases/${encodeURIComponent(databaseId)}/documents`;
  let accessToken = null, tokenExpiresAt = 0;
  async function getAuthHeaders() {
    if (!accessToken || tokenExpiresAt < Date.now() + 60000) {
      if (serviceAccount) {
        accessToken = await fetchAccessToken(serviceAccount, fetchImpl);
        tokenExpiresAt = Date.now() + 3500000;
      } else {
        let response;
        try { response = await fetchImpl('http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token', {
          headers: { 'Metadata-Flavor': 'Google' }, redirect: 'error', signal: AbortSignal.timeout(FIREBASE_REQUEST_TIMEOUT_MS),
        }); } catch { fail('STORE_AUTH', 'Managed Firebase authentication could not be obtained'); }
        if (!response.ok) fail('STORE_AUTH', 'Managed Firebase authentication failed');
        const token = await response.json();
        if (typeof token.access_token !== 'string' || !token.access_token || !Number.isFinite(token.expires_in) || token.expires_in <= 60) {
          fail('STORE_AUTH', 'Managed Firebase authentication returned invalid token metadata');
        }
        accessToken = token.access_token;
        tokenExpiresAt = Date.now() + token.expires_in * 1000;
      }
    }
    return { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
  }
  return {
    firestoreBase: 'https://firestore.googleapis.com/v1/',
    documentsPath,
    authHeaders: await getAuthHeaders(), getAuthHeaders,
  };
}
