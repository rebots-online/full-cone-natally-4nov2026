// Customer-scoped OpenRouter session key binding for Natally.
//
// Resolves (or creates) a RevenueCat V2 customer whose id equals the Firebase
// UID, reconciles the customer's OpenRouter provisioning key against its
// stored key/hash association, funds it from the customer's current Firebase
// credit account allowance, and persists the association.
//
// This module owns NO persistence, NO concurrency control, and NO conversion
// default. Every provider/customer operation runs inside the caller-supplied
// withCustomerOperation(uid, asyncOperation) boundary, which is also
// responsible for recovering interrupted key issuance.

import {
  readCustomer,
  createCustomer,
  readCustomerKey,
  saveCustomerKey,
} from "./revenuecat-customer.mjs";
import { reconcileManagedKey, disableManagedKey } from "./openrouter.mjs";

function assertNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function assertSyncOptions(uid, options, { requireLimit = false } = {}) {
  assertNonEmptyString(uid, "uid");
  if (typeof options?.withCustomerOperation !== "function") {
    throw new Error("withCustomerOperation must be a function");
  }
  if (requireLimit && typeof options.firebaseCredits?.readAccount !== "function") {
    throw new Error("firebaseCredits.readAccount must be a function");
  }
}

function assertCreditAccount(account, uid) {
  if (account === null) return;
  if (typeof account !== "object" || Array.isArray(account) ||
      ![Object.prototype, null].includes(Object.getPrototypeOf(account)) || account.uid !== uid ||
      !Number.isSafeInteger(account.creditBalance) || account.creditBalance < 0 ||
      !Number.isSafeInteger(account.providerAllowanceUsdMicros) || account.providerAllowanceUsdMicros < 0) {
    throw new Error("Firebase credit account must match the user and contain nonnegative safe-integer balance and allowance");
  }
}

export async function syncCustomerSessionKey(uid, options) {
  assertSyncOptions(uid, options, { requireLimit: true });
  return options.withCustomerOperation(uid, async () => {
    try {
      await readCustomer(uid, options.revenueCat);
    } catch (error) {
      if (error?.status !== 404) throw error;
      await createCustomer(uid, options.revenueCat);
    }

    const association = await readCustomerKey(uid, options.revenueCat);
    const existingKeyHash = association === null ? null : association.hash;
    const existingKey = association === null ? null : association.key;

    let snapshot = null;
    let limitUsd = null;
    const readLimitUsd = async () => {
      snapshot = await options.firebaseCredits.readAccount(uid);
      assertCreditAccount(snapshot, uid);
      limitUsd = snapshot !== null && snapshot.creditBalance > 0
        ? snapshot.providerAllowanceUsdMicros / 1000000
        : 0;
      return limitUsd;
    };

    const resolved = await reconcileManagedKey(
      { existingKeyHash, existingKey, name: `Natally ${uid}`, readLimitUsd },
      options.openRouter,
    );

    await saveCustomerKey(
      uid,
      { key: resolved.key, hash: resolved.hash },
      options.revenueCat,
    );

    return {
      state: limitUsd > 0 ? "ready" : "unfunded",
      customerId: uid,
      credits: snapshot === null ? 0 : snapshot.creditBalance,
      providerAllowanceUsdMicros: snapshot === null ? 0 : snapshot.providerAllowanceUsdMicros,
      limitUsd,
      key: resolved.key,
      hash: resolved.hash,
      keyState: resolved.state,
      data: resolved.data,
    };
  });
}

export async function deactivateCustomerSessionKey(uid, expectedHash, options) {
  assertSyncOptions(uid, options);
  assertNonEmptyString(expectedHash, "expectedHash");
  return options.withCustomerOperation(uid, async () => {
    const association = await readCustomerKey(uid, options.revenueCat);
    if (association === null || association.hash !== expectedHash) {
      return { deactivated: false };
    }
    await disableManagedKey(association.hash, options.openRouter);
    return { deactivated: true };
  });
}
