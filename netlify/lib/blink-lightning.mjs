/**
 * Official Blink GraphQL adapter for USD (stablesats) Lightning invoices.
 *
 * Mechanical adapter only: reads configuration, reads the configured USD
 * wallet, creates USD Lightning invoices, and reads invoice payment status.
 * It never grants access, persists records, introduces a ledger, or treats a
 * provider-confirmed PAID state as an access grant. Callers must ingest a real
 * external receipt into the payment authority (RevenueCat) and read back that
 * authority before any access is granted.
 *
 * Security invariants:
 * - The API key is server-only and never appears in results, errors, or logs.
 * - The endpoint is fixed to the production Blink GraphQL API; no untrusted
 *   endpoint is ever accepted from callers or the environment.
 * - Quotes are trusted server input. Callers must authenticate the account UID
 *   and load an immutable, persisted quote before calling. Product id and
 *   amount are never taken from untrusted browser input.
 * - externalId is a correlation marker only, not a documented idempotency
 *   guarantee. Callers must enforce single-invoice-per-quote and durable
 *   association/recovery in an approved operational store; invoice mutations
 *   are never retried (an ambiguous creation must be reconciled, never
 *   duplicated into a second chargeable invoice).
 */

const BLINK_ENDPOINT = 'https://api.blink.sv/graphql';
const TIMEOUT_MS = 12000;
const MAX_AMOUNT_MINOR = 100000000;
const MAX_EXPIRY_LEAD_MS = 15 * 60000;
const MAX_INVOICE_TTL_MINUTES = 5;
const MAX_PAYMENT_REQUEST_LENGTH = 20000;
const CREATED_AT_FUTURE_SLACK_MS = 60000;

const CODE_UNCONFIGURED = 'BLINK_UNCONFIGURED';

const PAYMENT_STATUSES = new Set(['PAID', 'PENDING', 'EXPIRED']);

const STATE_BY_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  EXPIRED: 'expired',
};

function sanitizeError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function fail(code, message) {
  throw sanitizeError(code, message);
}

function readEnvValue(env, name) {
  if (typeof env === 'function') return env(name);
  if (env && typeof env === 'object') return env[name];
  return undefined;
}

function requireTrimmedEnv(env, name, code) {
  const raw = readEnvValue(env, name);
  if (typeof raw !== 'string') {
    fail(code, `${name} is not configured`);
  }
  const value = raw.trim();
  if (value.length === 0) {
    fail(code, `${name} is not configured`);
  }
  return value;
}

/**
 * Read and validate the Blink adapter configuration from the environment.
 *
 * @param {NodeJS.ProcessEnv | Record<string, string> | ((name: string) => string | undefined)} [env]
 *   Environment source; defaults to process.env. May be an object or a getter
 *   function.
 * @returns {{ apiKey: string, walletId: string, network: 'mainnet', endpoint: string }}
 */
export function readBlinkConfig(env = process.env) {
  const apiKey = requireTrimmedEnv(env, 'BLINK_API_KEY', CODE_UNCONFIGURED);
  const walletId = requireTrimmedEnv(env, 'BLINK_USD_WALLET_ID', CODE_UNCONFIGURED);
  return {
    apiKey,
    walletId,
    network: 'mainnet',
    endpoint: BLINK_ENDPOINT,
  };
}

async function blinkRequest(config, query, variables, fetchImpl) {
  if (
    !config ||
    typeof config !== 'object' ||
    typeof config.apiKey !== 'string' ||
    config.apiKey.length === 0 ||
    typeof config.walletId !== 'string' ||
    config.walletId.length === 0
  ) {
    fail(CODE_UNCONFIGURED, 'Blink is not configured');
  }
  let response;
  try {
    response = await fetchImpl(BLINK_ENDPOINT, {
      method: 'POST',
      headers: {
        'X-API-KEY': config.apiKey,
        'Content-Type': 'application/json',
      },
      redirect: 'error',
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    fail('BLINK_NETWORK', 'Blink request failed');
  }
  if (!response.ok) {
    fail('BLINK_HTTP', 'Blink request failed');
  }
  let body;
  try {
    body = await response.json();
  } catch {
    fail('BLINK_RESPONSE', 'Blink response was invalid');
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    fail('BLINK_RESPONSE', 'Blink response was invalid');
  }
  if (Array.isArray(body.errors) && body.errors.length > 0) {
    fail('BLINK_GRAPHQL', 'Blink reported an error');
  }
  if (!body.data || typeof body.data !== 'object') {
    fail('BLINK_RESPONSE', 'Blink response was invalid');
  }
  return body.data;
}

/**
 * Read the configured USD wallet and verify it exists exactly once on the
 * account with USD currency.
 *
 * @param {ReturnType<typeof readBlinkConfig>} config
 * @param {{ fetchImpl?: typeof fetch }} [options]
 * @returns {Promise<{ walletId: string, walletCurrency: 'USD' }>}
 */
export async function readBlinkUsdWallet(config, { fetchImpl = fetch } = {}) {
  const data = await blinkRequest(
    config,
    `query NatallyBlinkWallet { me { defaultAccount { wallets { id walletCurrency } } } }`,
    {},
    fetchImpl,
  );
  const me = data.me;
  const wallets = me && me.defaultAccount && Array.isArray(me.defaultAccount.wallets)
    ? me.defaultAccount.wallets
    : null;
  if (!wallets) {
    fail('BLINK_RESPONSE', 'Blink wallet listing was invalid');
  }
  const matches = wallets.filter(
    (wallet) =>
      wallet &&
      wallet.id === config.walletId &&
      wallet.walletCurrency === 'USD',
  );
  if (matches.length !== 1) {
    fail('BLINK_CONFIG', 'Configured Blink USD wallet not found');
  }
  return { walletId: config.walletId, walletCurrency: 'USD' };
}

function validateQuote(quote, nowMs = Date.now()) {
  if (!quote || typeof quote !== 'object') {
    fail('BLINK_INPUT', 'Quote is required');
  }
  const accountUid = quote.accountUid;
  if (typeof accountUid !== 'string' || accountUid.length === 0 || accountUid.length > 128) {
    fail('BLINK_INPUT', 'Quote account is invalid');
  }
  if (typeof quote.quoteId !== 'string' || !/^[A-Za-z0-9_-]{1,100}$/.test(quote.quoteId)) {
    fail('BLINK_INPUT', 'Quote id is invalid');
  }
  const productId = quote.productId;
  if (typeof productId !== 'string' || productId.length === 0 || productId.length > 255) {
    fail('BLINK_INPUT', 'Quote product is invalid');
  }
  if (quote.currency !== 'USD') {
    fail('BLINK_INPUT', 'Quote currency is invalid');
  }
  const amountMinor = quote.amountMinor;
  if (
    typeof amountMinor !== 'number' ||
    !Number.isSafeInteger(amountMinor) ||
    amountMinor <= 0 ||
    amountMinor > MAX_AMOUNT_MINOR
  ) {
    fail('BLINK_INPUT', 'Quote amount is invalid');
  }
  const expiresAtMs = Date.parse(quote.expiresAt);
  if (
    typeof quote.expiresAt !== 'string' ||
    Number.isNaN(expiresAtMs) ||
    expiresAtMs <= nowMs ||
    expiresAtMs > nowMs + MAX_EXPIRY_LEAD_MS
  ) {
    fail('BLINK_INPUT', 'Quote expiry is invalid');
  }
}

function validateInvoiceObject(invoice, externalId, nowMs) {
  if (!invoice || typeof invoice !== 'object') {
    fail('BLINK_RESPONSE', 'Blink invoice was invalid');
  }
  if (
    typeof invoice.paymentRequest !== 'string' ||
    !/^lnbc/i.test(invoice.paymentRequest) ||
    invoice.paymentRequest.length === 0 ||
    invoice.paymentRequest.length > MAX_PAYMENT_REQUEST_LENGTH
  ) {
    fail('BLINK_RESPONSE', 'Blink invoice request was invalid');
  }
  if (typeof invoice.paymentHash !== 'string' || !/^[0-9a-fA-F]{64}$/.test(invoice.paymentHash)) {
    fail('BLINK_RESPONSE', 'Blink invoice hash was invalid');
  }
  if (
    typeof invoice.satoshis !== 'number' ||
    !Number.isSafeInteger(invoice.satoshis) ||
    invoice.satoshis <= 0
  ) {
    fail('BLINK_RESPONSE', 'Blink invoice amount was invalid');
  }
  const createdAtMs = invoice.createdAt * 1000;
  if (
    typeof invoice.createdAt !== 'number' ||
    !Number.isFinite(invoice.createdAt) ||
    invoice.createdAt <= 0 ||
    createdAtMs > nowMs + CREATED_AT_FUTURE_SLACK_MS
  ) {
    fail('BLINK_RESPONSE', 'Blink invoice timestamp was invalid');
  }
  if (
    invoice.externalId !== undefined &&
    invoice.externalId !== null &&
    invoice.externalId !== externalId
  ) {
    fail('BLINK_RESPONSE', 'Blink invoice correlation was invalid');
  }
  if (!PAYMENT_STATUSES.has(invoice.paymentStatus)) {
    fail('BLINK_RESPONSE', 'Blink invoice status was invalid');
  }
}

const INVOICE_MUTATION = `mutation NatallyBlinkInvoice($input: LnUsdInvoiceCreateInput!) {
  lnUsdInvoiceCreate(input: $input) {
    errors { message }
    invoice {
      paymentRequest
      paymentHash
      satoshis
      createdAt
      externalId
      paymentStatus
    }
  }
}`;

/**
 * Create a USD Lightning invoice for a trusted, server-loaded quote.
 *
 * The quote must already be authenticated and immutable on the server; this
 * function never derives product or amount from untrusted input. Creation is
 * not retried: an ambiguous outcome must be reconciled by the caller instead
 * of issuing a second chargeable invoice. A paid state here never grants
 * access.
 *
 * @param {{
 *   accountUid: string,
 *   quoteId: string,
 *   productId: string,
 *   currency: 'USD',
 *   amountMinor: number,
 *   expiresAt: string,
 * }} quote Trusted server-side quote.
 * @param {ReturnType<typeof readBlinkConfig>} config
 * @param {{ fetchImpl?: typeof fetch, now?: () => number }} [options]
 * @returns {Promise<{
 *   provider: 'blink', network: 'mainnet', accountUid: string, quoteId: string,
 *   productId: string, currency: 'USD', amountMinor: number, walletId: string,
 *   externalId: string, paymentRequest: string, paymentHash: string,
 *   satoshis: number, createdAt: string, expiresAt: string,
 *   state: 'paid' | 'pending' | 'expired',
 * }>}
 */
export async function createBlinkUsdInvoice(quote, config, { fetchImpl = fetch, now = Date.now } = {}) {
  const nowMs = now();
  validateQuote(quote, nowMs);

  await readBlinkUsdWallet(config, { fetchImpl });

  const minutes = Math.min(
    MAX_INVOICE_TTL_MINUTES,
    Math.floor((Date.parse(quote.expiresAt) - nowMs) / 60000),
  );
  if (minutes < 1) {
    fail('BLINK_EXPIRED', 'Quote has expired');
  }

  const externalId = `natally:${quote.quoteId}`;

  const data = await blinkRequest(
    config,
    INVOICE_MUTATION,
    {
      input: {
        amount: quote.amountMinor,
        walletId: config.walletId,
        expiresIn: minutes,
        externalId,
        memo: 'Natally purchase',
      },
    },
    fetchImpl,
  );

  const result = data.lnUsdInvoiceCreate;
  if (!result || typeof result !== 'object') {
    fail('BLINK_RESPONSE', 'Blink invoice response was invalid');
  }
  if (Array.isArray(result.errors) && result.errors.length > 0) {
    fail('BLINK_GRAPHQL', 'Blink invoice creation failed');
  }
  validateInvoiceObject(result.invoice, externalId, nowMs);
  const invoice = result.invoice;

  const paymentHash = invoice.paymentHash.toLowerCase();
  const createdAtMs = invoice.createdAt * 1000;
  const quoteExpiryMs = Date.parse(quote.expiresAt);
  const expiresAtMs = Math.min(quoteExpiryMs, createdAtMs + minutes * 60000);
  const state = STATE_BY_STATUS[invoice.paymentStatus];

  return {
    provider: 'blink',
    network: 'mainnet',
    accountUid: quote.accountUid,
    quoteId: quote.quoteId,
    productId: quote.productId,
    currency: 'USD',
    amountMinor: quote.amountMinor,
    walletId: config.walletId,
    externalId,
    paymentRequest: invoice.paymentRequest,
    paymentHash,
    satoshis: invoice.satoshis,
    createdAt: new Date(createdAtMs).toISOString(),
    expiresAt: new Date(expiresAtMs).toISOString(),
    state,
  };
}

const STATUS_QUERY = `query NatallyBlinkStatus($input: LnInvoicePaymentStatusByHashInput!) {
  lnInvoicePaymentStatusByHash(input: $input) {
    paymentHash
    paymentRequest
    status
  }
}`;

/**
 * Read the payment status of a previously created Blink invoice from the
 * trusted, server-persisted record.
 *
 * The record must come from the caller's own durable store (never from
 * arbitrary browser-supplied hashes). Only the provider's status is trusted:
 * PENDING remains pending even past expiry, and a PAID result is not an access
 * grant.
 *
 * @param {{
 *   provider: string, network: string, walletId: string, quoteId: string,
 *   accountUid: string, paymentHash: string, paymentRequest: string,
 *   amountMinor: number, currency: string, expiresAt: string,
 * }} record Trusted server-created invoice record.
 * @param {ReturnType<typeof readBlinkConfig>} config
 * @param {{ fetchImpl?: typeof fetch, now?: () => number }} [options]
 * @returns {Promise<{ quoteId: string, accountUid: string, paymentHash: string, state: 'paid' | 'pending' | 'expired', observedAt: string }>}
 */
export async function readBlinkInvoiceStatus(record, config, { fetchImpl = fetch, now = Date.now } = {}) {
  if (!record || typeof record !== 'object') {
    fail('BLINK_INPUT', 'Invoice record is required');
  }
  if (record.provider !== 'blink' || record.network !== 'mainnet' || record.walletId !== config.walletId) {
    fail('BLINK_INPUT', 'Invoice record is invalid');
  }
  if (typeof record.paymentHash !== 'string' || !/^[0-9a-f]{64}$/.test(record.paymentHash)) {
    fail('BLINK_INPUT', 'Invoice record hash is invalid');
  }
  if (
    typeof record.paymentRequest !== 'string' ||
    !/^lnbc/i.test(record.paymentRequest) ||
    record.paymentRequest.length === 0 ||
    record.paymentRequest.length > MAX_PAYMENT_REQUEST_LENGTH
  ) {
    fail('BLINK_INPUT', 'Invoice record request is invalid');
  }
  if (typeof record.quoteId !== 'string' || !/^[A-Za-z0-9_-]{1,100}$/.test(record.quoteId)) {
    fail('BLINK_INPUT', 'Invoice record quote is invalid');
  }
  if (typeof record.accountUid !== 'string' || record.accountUid.length === 0 || record.accountUid.length > 128) {
    fail('BLINK_INPUT', 'Invoice record account is invalid');
  }
  if (
    typeof record.amountMinor !== 'number' ||
    !Number.isSafeInteger(record.amountMinor) ||
    record.amountMinor <= 0 ||
    record.amountMinor > MAX_AMOUNT_MINOR ||
    record.currency !== 'USD'
  ) {
    fail('BLINK_INPUT', 'Invoice record amount is invalid');
  }
  const expiresAtMs = Date.parse(record.expiresAt);
  if (typeof record.expiresAt !== 'string' || Number.isNaN(expiresAtMs)) {
    fail('BLINK_INPUT', 'Invoice record expiry is invalid');
  }

  const data = await blinkRequest(
    config,
    STATUS_QUERY,
    { input: { paymentHash: record.paymentHash } },
    fetchImpl,
  );

  const status = data.lnInvoicePaymentStatusByHash;
  if (!status || typeof status !== 'object') {
    fail('BLINK_RESPONSE', 'Blink status response was invalid');
  }
  const responseHash = typeof status.paymentHash === 'string' ? status.paymentHash.toLowerCase() : null;
  if (responseHash !== record.paymentHash) {
    fail('BLINK_RESPONSE', 'Blink status hash did not match');
  }
  if (status.paymentRequest !== record.paymentRequest) {
    fail('BLINK_RESPONSE', 'Blink status request did not match');
  }
  if (!PAYMENT_STATUSES.has(status.status)) {
    fail('BLINK_RESPONSE', 'Blink status was unknown');
  }

  return {
    quoteId: record.quoteId,
    accountUid: record.accountUid,
    paymentHash: record.paymentHash,
    state: STATE_BY_STATUS[status.status],
    observedAt: new Date(now()).toISOString(),
  };
}

const SETTLEMENT_QUERY = `query NatallyBlinkSettlement($hash: PaymentHash!) {
  me {
    defaultAccount {
      wallets {
        id
        walletCurrency
        transactionsByPaymentHash(paymentHash: $hash) {
          id
          createdAt
          direction
          settlementAmount
          settlementCurrency
          status
          externalId
        }
      }
    }
  }
}`;

const TX_STATUSES = new Set(['SUCCESS', 'PENDING', 'FAILURE']);
const TX_DIRECTIONS = new Set(['RECEIVE', 'SEND']);

/**
 * Read and verify the on-ledger settlement for a previously created Blink
 * invoice from the trusted, server-persisted record.
 *
 * A paid invoice status alone is not sufficient: the actual USD wallet
 * transaction must exist, match the recorded amount, correlation id, and a
 * plausible settlement timestamp exactly once. A returned settlement is still
 * not an access grant; callers must ingest it into the payment authority.
 *
 * @param {{
 *   provider: string, network: string, walletId: string, quoteId: string,
 *   accountUid: string, productId: string, paymentHash: string,
 *   paymentRequest: string, externalId: string, amountMinor: number,
 *   currency: string, createdAt: string, expiresAt: string,
 * }} record Trusted server-created invoice record.
 * @param {ReturnType<typeof readBlinkConfig>} config
 * @param {{ fetchImpl?: typeof fetch, now?: () => number }} [options]
 * @returns {Promise<{
 *   accountUid: string, quoteId: string, productId: string,
 *   paymentHash: string, transactionId: string, paidAt: string,
 *   currency: 'USD', amountMinor: number,
 * } | null>} Settlement details, or null when the invoice is not yet paid.
 */
export async function readBlinkSettlement(record, config, { fetchImpl = fetch, now = Date.now } = {}) {
  if (!record || typeof record !== 'object') {
    fail('BLINK_INPUT', 'Invoice record is required');
  }

  const status = await readBlinkInvoiceStatus(record, config, { fetchImpl, now });
  if (status.state !== 'paid') {
    return null;
  }

  const nowMs = now();
  const createdAtMs = Date.parse(record.createdAt);
  if (typeof record.createdAt !== 'string' || Number.isNaN(createdAtMs)) {
    fail('BLINK_INPUT', 'Invoice record timestamp is invalid');
  }
  if (typeof record.externalId !== 'string' || record.externalId.length === 0) {
    fail('BLINK_INPUT', 'Invoice record correlation is invalid');
  }
  if (record.externalId !== `natally:${record.quoteId}`) {
    fail('BLINK_INPUT', 'Invoice record correlation is invalid');
  }

  const data = await blinkRequest(
    config,
    SETTLEMENT_QUERY,
    { hash: record.paymentHash },
    fetchImpl,
  );

  const me = data.me;
  const wallets = me && me.defaultAccount && Array.isArray(me.defaultAccount.wallets)
    ? me.defaultAccount.wallets
    : null;
  if (!wallets) {
    fail('BLINK_RESPONSE', 'Blink wallet listing was invalid');
  }
  const matches = wallets.filter(
    (wallet) =>
      wallet &&
      wallet.id === config.walletId &&
      wallet.walletCurrency === 'USD',
  );
  if (matches.length !== 1) {
    fail('BLINK_CONFIG', 'Configured Blink USD wallet not found');
  }

  const transactions = Array.isArray(matches[0].transactionsByPaymentHash)
    ? matches[0].transactionsByPaymentHash
    : null;
  if (!transactions || transactions.length !== 1) {
    fail('BLINK_RESPONSE', 'Blink settlement transaction was not unique');
  }
  const tx = transactions[0];
  if (!tx || typeof tx !== 'object') {
    fail('BLINK_RESPONSE', 'Blink settlement transaction was invalid');
  }
  if (!TX_STATUSES.has(tx.status) || !TX_DIRECTIONS.has(tx.direction)) {
    fail('BLINK_RESPONSE', 'Blink settlement transaction was invalid');
  }
  if (tx.status !== 'SUCCESS' || tx.direction !== 'RECEIVE') {
    fail('BLINK_RESPONSE', 'Blink settlement is not a completed receipt');
  }
  if (tx.settlementCurrency !== 'USD') {
    fail('BLINK_RESPONSE', 'Blink settlement currency was invalid');
  }
  if (
    typeof tx.settlementAmount !== 'number' ||
    !Number.isSafeInteger(tx.settlementAmount) ||
    tx.settlementAmount !== record.amountMinor
  ) {
    fail('BLINK_RESPONSE', 'Blink settlement amount did not match');
  }
  if (
    tx.externalId !== undefined &&
    tx.externalId !== null &&
    tx.externalId !== record.externalId
  ) {
    fail('BLINK_RESPONSE', 'Blink settlement correlation was invalid');
  }
  if (typeof tx.id !== 'string' || tx.id.length === 0 || tx.id.length > 255) {
    fail('BLINK_RESPONSE', 'Blink settlement transaction id was invalid');
  }
  if (
    typeof tx.createdAt !== 'number' ||
    !Number.isSafeInteger(tx.createdAt) ||
    tx.createdAt <= 0 ||
    tx.createdAt < createdAtMs / 1000 - 60 ||
    tx.createdAt > nowMs / 1000 + 60
  ) {
    fail('BLINK_RESPONSE', 'Blink settlement timestamp was invalid');
  }

  return {
    accountUid: record.accountUid,
    quoteId: record.quoteId,
    productId: record.productId,
    paymentHash: record.paymentHash,
    transactionId: tx.id,
    paidAt: new Date(tx.createdAt * 1000).toISOString(),
    currency: 'USD',
    amountMinor: record.amountMinor,
  };
}
