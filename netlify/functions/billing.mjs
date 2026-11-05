/**
 * Natally billing on Netlify: the same function mechanism as blink-checkout,
 * replacing the development relay (reading-access.mjs, which handed one
 * personal OpenRouter key to one email) and the Cloud Run service (cost
 * gating: no per-request-billed hosting before revenue).
 *
 * billing/runtime.mjs is already a Web `Request → Response` handler, so this
 * wraps it unchanged. RevenueCat is the authoritative account store: deploy
 * with BILLING_CREDIT_BALANCE_STORE=revenuecat. At inference the app calls
 * /billing/access; the runtime debits the previous key's actual usage from
 * the RevenueCat balance and issues a short-lived OpenRouter key whose limit
 * is the remaining balance. Required environment (Netlify site settings,
 * values from KStore): OPENROUTER_ADMIN_KEY, BILLING_KEY_ENCRYPTION_KEY,
 * FIREBASE_SERVICE_ACCOUNT_JSON, REVENUECAT_SECRET_API_KEY,
 * REVENUECAT_PROJECT_ID, REVENUECAT_WEBHOOK_AUTH, BILLING_ALLOWED_ORIGIN,
 * BILLING_CREDIT_BALANCE_STORE, BILLING_CREDIT_UNITS_PER_USD,
 * BILLING_TOPUP_ALLOCATION_BPS and the remaining BILLING_* / REVENUECAT_*
 * values listed in scripts/deploy-billing-runtime.mjs.
 */
import { createBillingRuntime } from '../../billing/runtime.mjs';

let handle;
export default async function billing(request) {
  handle ||= createBillingRuntime(process.env);
  return handle(request);
}

// Explicit routes (not /billing/*) so /billing/blink/* stays with blink-checkout.
export const config = {
  path: [
    '/billing/health', '/billing/access', '/billing/reconcile', '/billing/logout',
    '/billing/redeem', '/billing/checkout', '/billing/checkout-start', '/billing/checkout-cancel',
    '/billing/history', '/billing/invoices/*', '/billing/webhook',
  ],
};
