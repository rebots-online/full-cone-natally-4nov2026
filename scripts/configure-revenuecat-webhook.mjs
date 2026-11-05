// Official schema: https://www.revenuecat.com/docs/api-v2/integration
// Configure only the selected Natally integration. Secrets stay in captured
// process memory and canonical storage; CLI request bodies travel over stdin.
import { existsSync, readFileSync } from 'node:fs';
import { createHash, randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { createKStoreClient, parseEnvironmentDocument, parseCredentialReference, serializeAssignment } from './environment.mjs';
import { updateBillingEnvironment } from './configure-billing-environment.mjs';

const binding = 'REVENUECAT_WEBHOOK_AUTH';
const credentialDocument = 'CREDENTIALS/RevenueCat/Natally/credentials.env';

async function webhookAuthorization(client) {
  const configured = Object.assign({}, ...['.env', '.env.local'].filter(existsSync)
    .map(file => parseEnvironmentDocument(readFileSync(file, 'utf8')).valueMap));
  if (configured[binding]) {
    const ref = parseCredentialReference(configured[binding], binding);
    const document = await client.read_document(ref.path);
    const value = parseEnvironmentDocument(document.content).valueMap[ref.fragment];
    if (!value || value.startsWith('kstore:')) throw Error(`${binding}: existing reference is unresolved`);
    return value;
  }
  let before = '';
  try { before = (await client.read_document(credentialDocument)).content; }
  catch (error) { if (error.code !== 'KSTORE_NOT_FOUND') throw error; }
  let value = parseEnvironmentDocument(before).valueMap[binding];
  if (!value) {
    value = `Bearer ${randomBytes(32).toString('base64url')}`;
    if (before) {
      const hash = createHash('sha256').update(before).digest('hex');
      await client.write_with_exact_readback(`CREDENTIALS/RevenueCat/Natally/before-webhook-${hash}.env`, before,
        { title: 'Exact RevenueCat credential document checkpoint before webhook configuration' });
    }
    const content = `${before.trimEnd()}\n\n# Complete Authorization header for Natally production RevenueCat webhooks.\n# Shared with the billing runtime; preserve this value when rerunning configuration.\n${serializeAssignment(binding, value)}\n`;
    await client.write_with_exact_readback(credentialDocument, content, { title: 'Natally RevenueCat credentials' });
  }
  await updateBillingEnvironment({ [binding]: `kstore://admin-manual/${credentialDocument}#${binding}` }, { checkpoint: 'revenuecat-webhook' });
  return value;
}

export async function configureRevenueCatWebhook({ cliPath, projectId, appId, webhookUrl, profile = 'default' }) {
  if (!cliPath || !existsSync(cliPath) || !projectId || !appId || !webhookUrl) throw Error('Webhook configuration requires the existing CLI, project, app and billing URL');
  const target = new URL(webhookUrl);
  if (target.protocol !== 'https:' || target.pathname !== '/billing/webhook' || target.search || target.hash) throw Error('Expected the production HTTPS /billing/webhook endpoint');
  const collection = `/projects/${encodeURIComponent(projectId)}/integrations/webhooks`;
  const api = (method, path, body) => {
    const result = spawnSync(process.execPath, [cliPath, 'api', method, path, '--profile', profile, '--json', '--no-input', '--yes',
      ...(body ? ['--body', '@-'] : [])], {
      encoding: 'utf8', windowsHide: true, input: body ? JSON.stringify(body) : undefined, timeout: 60_000,
    });
    if (result.error || result.status !== 0) throw Error(`RevenueCat webhook ${method} failed (exit ${result.status ?? 'unavailable'}); response suppressed`);
    try { const parsed = JSON.parse(result.stdout); return parsed.data ?? parsed; }
    catch { throw Error('RevenueCat webhook response was unreadable'); }
  };
  const integrations = [];
  let cursor = null;
  do {
    const page = api('GET', `${collection}?limit=100${cursor ? `&starting_after=${encodeURIComponent(cursor)}` : ''}`);
    if (!Array.isArray(page.items)) throw Error('RevenueCat webhook list was incomplete');
    integrations.push(...page.items);
    cursor = page.next_page ? page.items.at(-1)?.id : null;
    if (page.next_page && !cursor) throw Error('RevenueCat webhook pagination was incomplete');
  } while (cursor);
  const name = 'Natally production billing';
  const matching = integrations.filter(item => item.url === target.href || item.name === name);
  if (matching.length > 1 || matching.some(item => item.app_id && item.app_id !== appId)) throw Error('Natally webhook identity requires reconciliation');
  const authorization = await webhookAuthorization(createKStoreClient());
  const body = { name, url: target.href, authorization_header: authorization, environment: 'production', app_id: appId, event_types: null };
  const existing = matching[0];
  const saved = api('POST', existing ? `${collection}/${encodeURIComponent(existing.id)}` : collection, body);
  if (!saved.id) throw Error('RevenueCat did not return the configured webhook identity');
  const readback = api('GET', `${collection}/${encodeURIComponent(saved.id)}`);
  if (readback.id !== saved.id || readback.project_id !== projectId || readback.name !== name || readback.url !== target.href ||
      readback.environment !== 'production' || readback.app_id !== appId || (readback.event_types !== null && readback.event_types?.length !== 0)) {
    throw Error('RevenueCat webhook routing readback did not match the requested configuration');
  }
  return { id: readback.id, projectId, appId, url: readback.url, environment: readback.environment,
    events: 'all app production events', authorizationConfigured: true, routingReadback: true, created: !existing };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const [cliPath, projectId, appId, webhookUrl, profile] = process.argv.slice(2);
  configureRevenueCatWebhook({ cliPath, projectId, appId, webhookUrl, ...(profile ? { profile } : {}) })
    .then(result => console.log(JSON.stringify(result)))
    .catch(error => { console.error(error.message); process.exitCode = 1; });
}
