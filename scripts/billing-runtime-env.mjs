// The billing runtime's environment, shared by every deploy target (Netlify,
// Cloud Run) so they can never drift: which resolved KStore values the
// runtime receives, and which of them are secrets.
export const BILLING_SECRET_NAMES = ['OPENROUTER_ADMIN_KEY', 'BILLING_KEY_ENCRYPTION_KEY', 'REVENUECAT_SECRET_API_KEY',
  'REVENUECAT_CLI_PROFILE_JSON', 'REVENUECAT_WEBHOOK_AUTH', 'REVENUECAT_STRIPE_PUBLIC_KEY', 'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET', 'FIREBASE_SERVICE_ACCOUNT_JSON'];
const DEPLOY_ONLY = ['BILLING_DATABASE_URL', 'BILLING_GCP_PROJECT', 'BILLING_GCP_REGION', 'BILLING_GCP_SERVICE'];
const PLAIN_NAMES = ['REVENUECAT_PROJECT_ID', 'REVENUECAT_OFFERING_ID', 'REVENUECAT_OFFERING_IDENTIFIER', 'VITE_REVENUECAT_OFFERING_ID',
  'REVENUECAT_WEB_APP_ID', 'REVENUECAT_WEB_PUBLIC_KEY', 'VITE_REVENUECAT_PUBLIC_KEY', 'REVENUECAT_CLI_EXECUTABLE', 'OPENROUTER_BASE_URL'];

/** → { secrets: {name: value}, plain: {name: value} } for non-empty values only. */
export function selectBillingRuntimeEnv(env) {
  const secrets = {}, plain = {};
  for (const name of BILLING_SECRET_NAMES) if (env[name]) secrets[name] = env[name];
  for (const [name, value] of Object.entries(env)) {
    if (!value || BILLING_SECRET_NAMES.includes(name)) continue;
    if ((name.startsWith('BILLING_') && !DEPLOY_ONLY.includes(name)) || PLAIN_NAMES.includes(name)) plain[name] = value;
  }
  return { secrets, plain };
}
