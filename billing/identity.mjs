import { createPublicKey, verify } from 'node:crypto';
import firebaseConfig from '../firebase-applet-config.json' with { type: 'json' };

let certificates = null, certificatesUntil = 0;
export async function verifyFirebaseIdentity(authorization, fetchImpl = fetch) {
  if (typeof authorization !== 'string' || !authorization.startsWith('Bearer ')) throw Object.assign(new Error('Sign in to your account.'), { status: 401 });
  const token = authorization.slice(7);
  if (token.length > 16384) throw Object.assign(new Error('Invalid account token.'), { status: 401 });
  const parts = token.split('.');
  let header, claims;
  try { header = JSON.parse(Buffer.from(parts[0], 'base64url')); claims = JSON.parse(Buffer.from(parts[1], 'base64url')); }
  catch { throw Object.assign(new Error('Invalid account token.'), { status: 401 }); }
  const now = Math.floor(Date.now() / 1000);
  if (parts.length !== 3 || header.alg !== 'RS256' || typeof header.kid !== 'string' ||
      claims.aud !== firebaseConfig.projectId || claims.iss !== `https://securetoken.google.com/${firebaseConfig.projectId}` ||
      typeof claims.sub !== 'string' || !claims.sub || claims.sub.length > 128 ||
      !Number.isFinite(claims.exp) || claims.exp <= now || !Number.isFinite(claims.iat) || claims.iat > now + 60 ||
      !Number.isFinite(claims.auth_time) || claims.auth_time > now + 60) {
    throw Object.assign(new Error('Your account token has expired or is invalid. Sign in again.'), { status: 401 });
  }
  if (!certificates || certificatesUntil <= Date.now() || !Object.hasOwn(certificates, header.kid)) {
    const response = await fetchImpl('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com', {
      redirect: 'error', signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) throw new Error('Account verification is temporarily unavailable.');
    certificates = await response.json();
    const maxAge = /max-age=(\d+)/.exec(response.headers.get('cache-control') || '');
    certificatesUntil = Date.now() + Math.min(Number(maxAge?.[1] || 300), 3600) * 1000;
  }
  const certificate = certificates?.[header.kid];
  if (typeof certificate !== 'string' || !verify('RSA-SHA256', Buffer.from(`${parts[0]}.${parts[1]}`), createPublicKey(certificate), Buffer.from(parts[2], 'base64url'))) {
    throw Object.assign(new Error('Invalid account signature.'), { status: 401 });
  }
  return { uid: claims.sub, email: typeof claims.email === 'string' ? claims.email : null, name: typeof claims.name === 'string' ? claims.name : null };
}
