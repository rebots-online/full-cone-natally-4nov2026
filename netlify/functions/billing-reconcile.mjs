import { configuration } from '../lib/billing-config.mjs';
import { nextAccount, withAccount } from '../lib/billing-store.mjs';
import { firebase, RevenueCat, projectCapabilities } from '../lib/billing-identity.mjs';
import { reconcilePayments } from '../lib/billing-commerce.mjs';
import { managedAccess } from '../lib/billing-access.mjs';

/** Scheduled recovery also picks up paid Lightning invoices after a browser closes. */
export default async function reconcile() {
  const env=name=>globalThis.Netlify?.env.get(name)||process.env[name]||'';
  if (!env('REVENUECAT_SECRET_API_KEY')) return;
  const cfg=configuration(env),uid=await nextAccount(env);
  if (!uid) return;
  await withAccount(env,uid,async store=>{
    const state=await store.account();state.lastAttemptAt=Date.now();await store.saveAccount(state);
    const user=await firebase(env).auth.getUser(uid);
    const rc=new RevenueCat(env,cfg);await rc.ensure({uid,email:user.email,email_verified:user.emailVerified});
    await reconcilePayments(env,cfg,store,rc);
    const snapshot=await rc.snapshot(uid);await projectCapabilities(env,uid,snapshot);
    await managedAccess(env,store,snapshot);
  });
}
export const config={schedule:'* * * * *'};
