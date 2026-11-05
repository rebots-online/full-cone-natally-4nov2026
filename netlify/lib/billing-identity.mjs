import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from '../../firebase-applet-config.json' with { type: 'json' };
import { BillingError, required } from './billing-config.mjs';

export function firebase(env) {
  const name = 'natally-billing';
  let app = getApps().find(value => value.name === name);
  if (!app) {
    const projectId = env('FIREBASE_PROJECT_ID') || firebaseConfig.projectId;
    if (projectId !== firebaseConfig.projectId) throw new BillingError('Firebase billing project does not match Natally.');
    const raw = env('FIREBASE_SERVICE_ACCOUNT_JSON');
    const credential = raw ? cert(JSON.parse(raw)) : applicationDefault();
    app = initializeApp({ projectId, credential }, name);
  }
  return { auth: getAuth(app), db: getFirestore(app, env('FIREBASE_DATABASE_ID') || firebaseConfig.firestoreDatabaseId) };
}
export async function authenticate(request, env) {
  const token = /^Bearer (\S+)$/.exec(request.headers.get('authorization') || '')?.[1];
  if (!token) throw new BillingError('Sign in to Natally to continue.', 401);
  try { return await firebase(env).auth.verifyIdToken(token, true); }
  catch { throw new BillingError('Sign in again to continue.', 401); }
}
export class RevenueCat {
  constructor(env, config, fetcher = fetch) { this.env = env; this.config = config; this.fetch = fetcher; this.base = '/v2/projects/' + encodeURIComponent(config.project); }
  customer(uid) { return this.base + '/customers/' + encodeURIComponent(uid); }
  async request(path, method = 'GET', body, idempotency) {
    if (!path.startsWith(this.base + '/')) throw new BillingError('Invalid RevenueCat resource.');
    const response = await this.fetch('https://api.revenuecat.com' + path, {
      method, headers: { Authorization: 'Bearer ' + required(this.env,'REVENUECAT_SECRET_API_KEY'), 'Content-Type':'application/json', ...(idempotency ? {'Idempotency-Key':idempotency} : {}) },
      ...(body === undefined ? {} : {body:JSON.stringify(body)}), signal:AbortSignal.timeout(12000), redirect:'error',
    });
    if (!response.ok) throw new BillingError('RevenueCat account synchronization is pending.', response.status === 404 || response.status === 409 ? response.status : 503);
    return response.status === 204 ? {} : response.json();
  }
  async list(path) {
    const items = [];
    for (let page = 0; path && page < 25; page++) {
      const result = await this.request(path);
      if (!Array.isArray(result.items)) throw new BillingError('RevenueCat returned an incomplete list.');
      items.push(...result.items); path = result.next_page;
    }
    if (path) throw new BillingError('RevenueCat account reconciliation needs another pass.');
    return items;
  }
  async ensure(user) {
    const attributes = [{name:'natally_firebase_uid',value:user.uid},{name:'natally_application',value:'Natally'}];
    if (user.email_verified && user.email) attributes.push({name:'$email',value:user.email});
    try { await this.request(this.customer(user.uid)); }
    catch (error) {
      if (error.status !== 404) throw error;
      try { await this.request(this.base + '/customers','POST',{id:user.uid,attributes}); }
      catch (createError) { if (createError.status !== 409) throw createError; }
    }
    await this.request(this.customer(user.uid) + '/attributes','POST',{attributes});
    return this.request(this.customer(user.uid));
  }
  purchases(uid) { return this.list(this.customer(uid) + '/purchases?limit=100'); }
  async snapshot(uid) {
    const [entitlements,balances] = await Promise.all([
      this.list(this.customer(uid) + '/active_entitlements?limit=100'),
      this.list(this.customer(uid) + '/virtual_currencies?limit=100'),
    ]);
    const capabilities = {};
    for (const [name,id] of Object.entries(this.config.capabilities)) {
      const entitlement = entitlements.find(item => item.entitlement_id === id && (item.expires_at === null || item.expires_at > Date.now()));
      if (entitlement) capabilities[name] = entitlement.expires_at === null ? 0 : Math.floor(entitlement.expires_at / 1000);
    }
    const roche = balances.find(item => item.currency?.code === 'ROCHE' || item.currency_code === 'ROCHE' || item.code === 'ROCHE');
    if (roche && !Number.isSafeInteger(roche.balance)) throw new BillingError('ROCHE balance is invalid.');
    return { capabilities, roche:roche?.balance ?? 0 };
  }
  adjust(uid, quantity, identity) {
    if (!quantity) return Promise.resolve();
    return this.request(this.customer(uid) + '/virtual_currencies/transactions','POST',{adjustments:{ROCHE:quantity},reference:identity}, identity);
  }
  grant(uid, id, expiry) { return this.request(this.customer(uid) + '/actions/grant_entitlement','POST',{entitlement_id:id,expires_at:expiry}); }
  revoke(uid,id) { return this.request(this.customer(uid) + '/actions/revoke_granted_entitlement','POST',{entitlement_id:id}); }
}

/** Called while the account lock is held. Only this namespace is replaced. */
export async function projectCapabilities(env, uid, snapshot) {
  const {auth,db} = firebase(env);
  const user = await auth.getUser(uid);
  const natally = { authority:'revenuecat', customerId:uid, capabilities:snapshot.capabilities, syncedAt:Math.floor(Date.now()/1000) };
  const claims = {...user.customClaims,natally};
  if (Buffer.byteLength(JSON.stringify(claims)) > 1000) throw new BillingError('Firebase capability claims exceed their size limit.');
  await auth.setCustomUserClaims(uid,claims);
  await db.doc(`users/${uid}/billing/capabilities`).set({...natally,roche:snapshot.roche});
  return natally;
}
