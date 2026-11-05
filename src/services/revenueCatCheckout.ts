import { Purchases, PurchasesError, ErrorCode } from '@revenuecat/purchases-js';
import type { CustomerInfo, Package, PurchaseResult } from '@revenuecat/purchases-js';
import { auth } from './firebase';
import type { PurchaseKind } from './purchaseIntent';

const DEFAULT_PUBLIC_KEY = 'rcb_VytrEQiAklKDYKCxYRERngGnqcSo';
const TERMS_URL = 'https://natally.robin.mba/terms.html';
const OFFERING_IDENTIFIER = 'Natally';
const QUOTE_TTL_MS = 2 * 60 * 1000;

const MAPPING: Record<PurchaseKind, { packageIdentifier: string; productIdentifier: string }> = {
  reading: { packageIdentifier: 'natally_reading_test', productIdentifier: 'natally_reading_test_v3' },
  conversation: { packageIdentifier: 'natally_roche_test', productIdentifier: 'natally_roche_test_v3' },
};

function resolvePublicKey(): string {
  const raw = import.meta.env?.VITE_REVENUECAT_PUBLIC_KEY as string | undefined;
  const key = raw && raw.length > 0 ? raw : DEFAULT_PUBLIC_KEY;
  if (!key.startsWith('rcb_')) {
    throw new Error('RevenueCat public SDK key must start with "rcb_". Refusing to use the configured key.');
  }
  return key;
}

export type CheckoutOffer = {
  readonly kind: PurchaseKind;
  readonly ownerUid: string;
  readonly quoteId: string;
  readonly packageIdentifier: string;
  readonly productIdentifier: string;
  readonly formattedPrice: string;
  readonly amountMicros: number;
  readonly currency: string;
  readonly expiresAt: number;
};

export type CheckoutPurchaseOutcome =
  | { state: 'purchased'; customerInfo: CustomerInfo }
  | { state: 'cancelled' };

type CachedQuote = {
  kind: PurchaseKind;
  ownerUid: string;
  quoteId: string;
  packageIdentifier: string;
  productIdentifier: string;
  formattedPrice: string;
  amountMicros: number;
  currency: string;
  expiresAt: number;
  rcPackage: Package;
  offer: CheckoutOffer;
};

class CheckoutError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'CheckoutError';
    if (options?.cause !== undefined) {
      (this as { cause?: unknown }).cause = options.cause;
    }
  }
}

const quoteCache = new Map<string, CachedQuote>();

let operationsTail: Promise<unknown> = Promise.resolve();
let purchaseInFlight = false;
let authGeneration = 0;
let authListenerInstalled = false;
let lastSeenUid: string | null = null;
let lastSeenUidInitialized = false;

function installAuthListener(): void {
  if (authListenerInstalled) {
    return;
  }
  authListenerInstalled = true;
  auth.onAuthStateChanged((user) => {
    const uid = user?.uid ?? null;
    if (!lastSeenUidInitialized) {
      lastSeenUidInitialized = true;
      lastSeenUid = uid;
      return;
    }
    if (uid === lastSeenUid) {
      return;
    }
    lastSeenUid = uid;
    authGeneration += 1;
    quoteCache.clear();
  });
}

function serialize<T>(operation: () => Promise<T>): Promise<T> {
  const run = operationsTail.then(operation, operation);
  operationsTail = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function assertGeneration(entryGeneration: number): void {
  if (authGeneration !== entryGeneration) {
    throw new CheckoutError('The signed-in account changed during checkout; please retry.');
  }
}

function currentUid(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new CheckoutError('A signed-in account is required for card checkout; anonymous checkout is not supported.');
  }
  return uid;
}

function validateKind(kind: unknown): PurchaseKind {
  if (typeof kind !== 'string' || !Object.prototype.hasOwnProperty.call(MAPPING, kind)) {
    throw new CheckoutError(`Unknown purchase kind "${String(kind)}"; refusing to build a checkout offer.`);
  }
  return kind as PurchaseKind;
}

async function ensureSdkForOwner(uid: string): Promise<Purchases> {
  if (!Purchases.isConfigured()) {
    return Purchases.configure({ apiKey: resolvePublicKey(), appUserId: uid });
  }
  const purchases = Purchases.getSharedInstance();
  if (purchases.getAppUserId() !== uid) {
    quoteCache.clear();
    await purchases.changeUser(uid);
  }
  return purchases;
}

function findConfiguredPackage(
  offerings: Awaited<ReturnType<Purchases['getOfferings']>>,
  mapping: { packageIdentifier: string; productIdentifier: string },
): Package {
  const offering = offerings.all[OFFERING_IDENTIFIER];
  if (!offering) {
    throw new CheckoutError(
      `RevenueCat offering "${OFFERING_IDENTIFIER}" is not configured; refusing to use the current or default offering.`,
    );
  }
  const rcPackage: Package | undefined = offering.packagesById[mapping.packageIdentifier];
  if (!rcPackage) {
    throw new CheckoutError(
      `Package "${mapping.packageIdentifier}" is missing from offering "${OFFERING_IDENTIFIER}".`,
    );
  }
  if (rcPackage.product?.identifier !== mapping.productIdentifier) {
    throw new CheckoutError(
      `Package "${mapping.packageIdentifier}" maps to product "${rcPackage.product?.identifier}" instead of the expected "${mapping.productIdentifier}".`,
    );
  }
  return rcPackage;
}

function validatedPrice(rcPackage: Package): {
  formattedPrice: string;
  amountMicros: number;
  currency: string;
} {
  const price = rcPackage.product?.price;
  const amountMicros = price?.amountMicros;
  const currency = price?.currency;
  const formattedPrice = price?.formattedPrice;
  if (
    typeof amountMicros !== 'number' ||
    !Number.isSafeInteger(amountMicros) ||
    amountMicros <= 0 ||
    typeof currency !== 'string' ||
    !/^[A-Z]{3}$/.test(currency) ||
    typeof formattedPrice !== 'string' ||
    formattedPrice.length === 0
  ) {
    throw new CheckoutError(
      `Product "${rcPackage.product?.identifier}" returned no valid live price; refusing to fabricate one.`,
    );
  }
  return { formattedPrice, amountMicros, currency };
}

function randomQuoteId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function cachedOffer(cached: CachedQuote): CheckoutOffer {
  return cached.offer;
}

export function getCheckoutOffer(input: PurchaseKind): Promise<CheckoutOffer> {
  const kind = validateKind(input);
  if (purchaseInFlight) {
    return Promise.reject(
      new CheckoutError('Another card checkout is already in progress; wait for it to finish before starting a new one.'),
    );
  }
  return serialize(async () => {
    const entryGeneration = authGeneration;
    await auth.authStateReady();
    assertGeneration(entryGeneration);
    const ownerUid = currentUid();
    const purchases = await ensureSdkForOwner(ownerUid);
    assertGeneration(entryGeneration);
    if (purchases.getAppUserId() !== ownerUid || auth.currentUser?.uid !== ownerUid) {
      throw new CheckoutError('The RevenueCat SDK is not bound to the current signed-in account; please retry.');
    }
    const mapping = MAPPING[kind];
    const offerings = await purchases.getOfferings();
    assertGeneration(entryGeneration);
    if (purchases.getAppUserId() !== ownerUid || auth.currentUser?.uid !== ownerUid) {
      throw new CheckoutError('Signed-in account changed while loading the checkout offer; please retry.');
    }
    const rcPackage = findConfiguredPackage(offerings, mapping);
    const price = validatedPrice(rcPackage);
    const now = Date.now();
    const quoteId = randomQuoteId();
    const offer: CheckoutOffer = Object.freeze({
      kind,
      ownerUid,
      quoteId,
      packageIdentifier: mapping.packageIdentifier,
      productIdentifier: mapping.productIdentifier,
      formattedPrice: price.formattedPrice,
      amountMicros: price.amountMicros,
      currency: price.currency,
      expiresAt: now + QUOTE_TTL_MS,
    });
    const cached: CachedQuote = { ...offer, rcPackage, offer };
    quoteCache.set(quoteId, cached);
    for (const [id, entry] of quoteCache) {
      if (Date.now() >= entry.expiresAt) {
        quoteCache.delete(id);
      }
    }
    return offer;
  });
}

function isUserCancelled(error: unknown): boolean {
  return error instanceof PurchasesError && error.errorCode === ErrorCode.UserCancelledError;
}

export function purchaseCheckoutOffer(
  offer: CheckoutOffer,
  htmlTarget?: HTMLElement,
): Promise<CheckoutPurchaseOutcome> {
  if (purchaseInFlight) {
    return Promise.reject(
      new CheckoutError('Another card checkout is already in progress; wait for it to finish before starting a new one.'),
    );
  }
  purchaseInFlight = true;
  return serialize(async (): Promise<CheckoutPurchaseOutcome> => {
    try {
      const cached = quoteCache.get(offer.quoteId);
      quoteCache.delete(offer.quoteId);
      if (!cached || cached.quoteId !== offer.quoteId || cachedOffer(cached) !== offer) {
        throw new CheckoutError('This checkout offer is not recognized; fetch a fresh offer before purchasing.');
      }
      const entryGeneration = authGeneration;
      if (Date.now() >= cached.expiresAt) {
        throw new CheckoutError('This checkout offer has expired; fetch a fresh offer before purchasing.');
      }
      await auth.authStateReady();
      assertGeneration(entryGeneration);
      const ownerUid = currentUid();
      if (ownerUid !== cached.ownerUid) {
        throw new CheckoutError('This checkout offer belongs to a different signed-in account.');
      }
      const purchases = await ensureSdkForOwner(ownerUid);
      assertGeneration(entryGeneration);
      if (purchases.getAppUserId() !== ownerUid || auth.currentUser?.uid !== ownerUid) {
        throw new CheckoutError('The RevenueCat SDK is not bound to the current signed-in account; please retry.');
      }
      const mapping = MAPPING[cached.kind];
      if (
        cached.rcPackage.identifier !== mapping.packageIdentifier ||
        cached.rcPackage.product?.identifier !== mapping.productIdentifier
      ) {
        throw new CheckoutError('The cached offer no longer matches the configured package mapping.');
      }
      const customerEmail = auth.currentUser?.email ?? undefined;
      let result: PurchaseResult;
      try {
        // Native RevenueCat validates the discount code and shows the adjusted total itself;
        // labelsOverride is experimental on the pinned 1.73.1 SDK surface (typed locally since it is excluded from public types).
        const purchaseParams: Parameters<Purchases['purchase']>[0] & {
          labelsOverride: { en: { 'discount_input.label': string } };
        } = {
          rcPackage: cached.rcPackage,
          customerEmail,
          htmlTarget,
          termsAndConditionsUrl: TERMS_URL,
          skipSuccessPage: true,
          showDiscountCodeField: true,
          labelsOverride: { en: { 'discount_input.label': 'Have a code?' } },
        };
        result = await purchases.purchase(purchaseParams);
      } catch (error) {
        if (isUserCancelled(error)) {
          return { state: 'cancelled' };
        }
        throw new CheckoutError('The card checkout could not be completed.', { cause: error });
      }
      assertGeneration(entryGeneration);
      const uidAfter = auth.currentUser?.uid;
      if (uidAfter !== cached.ownerUid) {
        throw new CheckoutError(
          'The signed-in account changed during checkout; the completed payment must be reconciled by the provider for the paying account.',
          { cause: result },
        );
      }
      return { state: 'purchased', customerInfo: result.customerInfo };
    } finally {
      purchaseInFlight = false;
    }
  });
}

export function restoreCheckoutCustomer(): Promise<CustomerInfo> {
  if (purchaseInFlight) {
    return Promise.reject(
      new CheckoutError('Another card checkout is already in progress; wait for it to finish before restoring.'),
    );
  }
  return serialize(async () => {
    const entryGeneration = authGeneration;
    await auth.authStateReady();
    assertGeneration(entryGeneration);
    const ownerUid = currentUid();
    const purchases = await ensureSdkForOwner(ownerUid);
    assertGeneration(entryGeneration);
    if (purchases.getAppUserId() !== ownerUid || auth.currentUser?.uid !== ownerUid) {
      throw new CheckoutError('The RevenueCat SDK is not bound to the current signed-in account; please retry.');
    }
    const customerInfo = await purchases.getCustomerInfo();
    assertGeneration(entryGeneration);
    if (auth.currentUser?.uid !== ownerUid) {
      throw new CheckoutError('Signed-in account changed while restoring; please retry for the current account.');
    }
    return customerInfo;
  });
}

export type RocheBalance = {
  ownerUid: string;
  currency: 'ROCHE';
  balance: number;
  fetchedAt: number;
};

export function getRocheBalance(): Promise<RocheBalance> {
  if (purchaseInFlight) {
    return Promise.reject(
      new CheckoutError('Another card checkout is already in progress; wait for it to finish before starting a new one.'),
    );
  }
  return serialize(async () => {
    const entryGeneration = authGeneration;
    await auth.authStateReady();
    assertGeneration(entryGeneration);
    const ownerUid = currentUid();
    const purchases = await ensureSdkForOwner(ownerUid);
    assertGeneration(entryGeneration);
    if (purchases.getAppUserId() !== ownerUid || auth.currentUser?.uid !== ownerUid) {
      throw new CheckoutError('The RevenueCat SDK is not bound to the current signed-in account; please retry.');
    }
    await purchases.invalidateVirtualCurrenciesCache();
    const virtualCurrencies = await purchases.getVirtualCurrencies();
    assertGeneration(entryGeneration);
    if (purchases.getAppUserId() !== ownerUid || auth.currentUser?.uid !== ownerUid) {
      throw new CheckoutError('Signed-in account changed while loading the ROCHE balance; please retry.');
    }
    const roche = virtualCurrencies.all.ROCHE;
    const balance = roche?.balance;
    if (roche?.code !== 'ROCHE' || typeof balance !== 'number' || !Number.isSafeInteger(balance) || balance < 0) {
      throw new CheckoutError('Your ROCHE balance could not be loaded. Please try again.');
    }
    return { ownerUid, currency: 'ROCHE', balance, fetchedAt: Date.now() };
  });
}

installAuthListener();
