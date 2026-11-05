/**
 * RevenueCat external purchase receipt submission adapter for Blink Lightning
 * settlements.
 *
 * Mechanical adapter only: submits an already-verified Blink settlement into
 * RevenueCat as an external purchase receipt. This submission is NOT a grant
 * and NOT a readiness signal; access must only ever be granted after reading
 * back RevenueCat as the payment authority.
 *
 * Security invariants:
 * - The API key is server-only and never appears in results, errors, or logs.
 * - The endpoint is fixed to the production RevenueCat receipts API; no
 *   untrusted endpoint is ever accepted from callers or the environment.
 * - The settlement must come from readBlinkSettlement on the server side;
 *   it is never constructed from client input.
 * - Retry safety is the caller's responsibility: reuse the exact persisted
 *   paidAt, payment hash, and transaction id so the stable identity hashes
 *   are idempotent. This module performs no automatic retries.
 */

const RECEIPTS_ENDPOINT = 'https://api.revenuecat.com/v1/receipts/external';
const TIMEOUT_MS = 12000;
const MAX_AMOUNT_MINOR = 100000000;
const MAX_ACCOUNT_UID = 128;
const MAX_PRODUCT_ID = 255;

const CODE_UNCONFIGURED = 'REVENUECAT_UNCONFIGURED';

function sanitizeError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function fail(code, message) {
  throw sanitizeError(code, message);
}

function requireNonEmpty(value, code, message) {
  if (typeof value !== 'string' || value.length === 0) {
    fail(code, message);
  }
  return value;
}

/**
 * Submit a verified Blink settlement to RevenueCat as an external purchase
 * receipt.
 *
 * The settlement must be the exact object returned by readBlinkSettlement,
 * obtained server side. This call never grants access and never reads back
 * entitlements; callers must read RevenueCat as the payment authority before
 * granting anything. On failure, reuse the exact persisted paidAt, payment
 * hash, and transaction id for the retry so identity hashes stay stable.
 *
 * @param {{
 *   accountUid: string, quoteId: string, productId: string,
 *   paymentHash: string, transactionId: string, paidAt: string,
 *   currency: 'USD', amountMinor: number,
 * }} settlement Server-side settlement from readBlinkSettlement.
 * @param {{ apiKey: string, sourceProductId: string }} options.config
 *   App-specific external API key and the RevenueCat product id to report.
 * @param {{ fetchImpl?: typeof fetch }} [options]
 * @returns {Promise<{ submitted: true, purchaseIdentifier: string, paymentIdentifier: string }>}
 */
export async function submitBlinkReceipt(settlement, { apiKey, sourceProductId }, { fetchImpl = fetch } = {}) {
  if (!settlement || typeof settlement !== 'object') {
    fail('REVENUECAT_INPUT', 'Settlement is required');
  }
  if (settlement.currency !== 'USD') {
    fail('REVENUECAT_INPUT', 'Settlement currency is invalid');
  }
  const amountMinor = settlement.amountMinor;
  if (
    typeof amountMinor !== 'number' ||
    !Number.isSafeInteger(amountMinor) ||
    amountMinor <= 0 ||
    amountMinor > MAX_AMOUNT_MINOR
  ) {
    fail('REVENUECAT_INPUT', 'Settlement amount is invalid');
  }
  const accountUid = requireNonEmpty(settlement.accountUid, 'REVENUECAT_INPUT', 'Settlement account is invalid');
  if (accountUid.length > MAX_ACCOUNT_UID) {
    fail('REVENUECAT_INPUT', 'Settlement account is invalid');
  }
  const transactionId = settlement.transactionId;
  if (typeof transactionId !== 'string' || transactionId.length === 0 || transactionId.length > 255) {
    fail('REVENUECAT_INPUT', 'Settlement transaction is invalid');
  }
  const paymentHash = settlement.paymentHash;
  if (typeof paymentHash !== 'string' || !/^[0-9a-f]{64}$/.test(paymentHash)) {
    fail('REVENUECAT_INPUT', 'Settlement hash is invalid');
  }
  const paidAtMs = Date.parse(settlement.paidAt);
  if (typeof settlement.paidAt !== 'string' || Number.isNaN(paidAtMs)) {
    fail('REVENUECAT_INPUT', 'Settlement timestamp is invalid');
  }
  requireNonEmpty(apiKey, CODE_UNCONFIGURED, 'RevenueCat is not configured');
  const sourceProductIdValue = requireNonEmpty(sourceProductId, 'REVENUECAT_INPUT', 'RevenueCat product is invalid');
  if (sourceProductIdValue.length > MAX_PRODUCT_ID) {
    fail('REVENUECAT_INPUT', 'RevenueCat product is invalid');
  }

  const paidAt = settlement.paidAt;
  const sourcePurchaseIdentifier = `blink:${paymentHash}`;
  const paymentIdentifier = `blink:${settlement.transactionId}`;

  let response;
  try {
    response = await fetchImpl(RECEIPTS_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      redirect: 'error',
      body: JSON.stringify({
        purchase: {
          object: 'external_purchase',
          customer_id: accountUid,
          source_purchase_identifier: sourcePurchaseIdentifier,
          source_product_identifier: sourceProductId,
          updated_at: paidAt,
          status: 'owned',
          environment: 'production',
        },
        payment: {
          object: 'external_purchase_payment',
          source_purchase_identifier: sourcePurchaseIdentifier,
          payment_identifier: paymentIdentifier,
          processed_at: paidAt,
          amount_in_local_currency: {
            currency: 'USD',
            gross: amountMinor / 100,
          },
        },
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    fail('REVENUECAT_NETWORK', 'RevenueCat request failed');
  }
  if (!response.ok) {
    fail('REVENUECAT_HTTP', 'RevenueCat request failed');
  }

  return {
    submitted: true,
    purchaseIdentifier: sourcePurchaseIdentifier,
    paymentIdentifier,
  };
}
