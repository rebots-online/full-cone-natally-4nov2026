# UX-PAY-1 payment recovery implementation task

State: IN_PROGRESS. Existing approved repair in DOCS/ARCHITECTURE.md, Paid customer
journey repair. This task implements that contract; it does not add a provider,
host, ledger, grant policy or key-management architecture.

## Inputs and ownership

Only edit `src/services/billingAccess.ts`,
`src/components/InferenceAccessSettings.tsx`, `src/components/LearnAndPayments.tsx`
and `src/components/PurchaseAccess.tsx`, plus focused verification evidence.
Wait for the running full build's source freeze to end. Preserve other changes.
The native billing worker owns `revenueCatCheckout.ts`, App and download consumers.

The native service exposes `getCheckoutCustomer()` for passive reads and
`restoreCheckoutCustomer()` for explicit Restore. Both return:
`{ownerUid, activeEntitlementIds, entitlementExpirations, purchasedProductIds}`.
Expiry values are epoch milliseconds or null. `getRocheBalance()` remains
`{ownerUid, currency:'ROCHE', balance, fetchedAt}`. Read all commercial state from
RevenueCat; a missing/failed currency read is unknown, never zero. Native purchase
outcome adds `pending` alongside purchased/cancelled. Quotes expose actual
`productType:'subscription'|'one_time'`, `billingPeriod:string|null` (ISO 8601),
and `productTitle`; do not describe subscriptions as one-time purchases.

## Required implementation

1. Replace static disabled payment cards and future-roadmap notices with real
   existing purchase actions and factual account/purchase recovery content.
   Preserve authored styles; do not advertise a functioning rail merely because
   an implementation exists. Google Play is the configured Android path; actual
   offer loading and native SDK results determine availability. Web/desktop use
   the existing card checkout. Do not replace absent native Play with web cards.
2. Read current RevenueCat customer and ROCHE independently of session-key
   provisioning. `readPaidConversationAccess` uses passive customer lookup and
   configured reading entitlement ID. A paid souvenir remains accessible after
   credits are spent. No passive read invokes native Restore.
3. All explicit Restore controls call the shared explicit restoration routine,
   validate owner, and preserve its factual purchase/entitlement/balance result
   before attempting session-key connection. Absence of `VITE_BILLING_API_URL`
   is not evidence that purchasing is disabled or payment failed. A failed key
   connection remains a distinct incomplete access state; do not claim ready,
   invent a key, silently grant access or imply a retry has been queued.
4. If a current account key is already installed, validate it and current ROCHE
   before reporting usable paid inference. Reuse existing validation. Existing
   personal-key rules are preserved. Otherwise preserve confirmed ownership and
   actual balance, and accurately report that reading access could not connect.
   Remove the literal "Purchasing is not connected yet" early return. The
   approved automatic key lifecycle remains separately unfinished; do not hide
   that fact behind a successful restore message.
5. A purchase `pending` result does not set `paymentConfirmed`, invoke fulfillment
   as if paid, or allow accidental immediate repeated purchase. Explain actual
   store pending state and allow explicit restore/recheck. Cancelled purchase
   grants nothing. Confirmed purchase remains confirmed through access errors;
   never advise the customer to buy again to repair delivery.
   Preserve the existing selected external purchase CTA: after its actual quote
   and account are ready, launch the selected checkout once per intent without
   adding a second selection click. Generic offer browsing never auto-launches;
   quote retries, cancellation and pending reopen cannot repeat a purchase.
6. Use explicit `.env` entitlement configuration, supplied by the native worker's
   config contract; no default product/account identity. Ensure the existing
   payment dialog receives actual recurring terms where it displays the price.
   Do not fabricate prices, credits or periods. Keep existing owner/session and
   stale-response guards in every asynchronous callback.

## Real billing terms binding (operator-authorized scope extension)

Also edit `src/components/FigmaPaywall.tsx` and
`LIBS/UI/FIGMA/three-screen-offers-20261027/adapted/paywall-three-screen.html`
only to bind actual billing terms; retain authored styles and layout.
`PurchaseAccess` supplies per-kind `terms` alongside `prices` from the loaded
`CheckoutOffer`: `{productType, billingPeriod, productTitle}` or `null` while
unloaded. `FigmaPaywall` forwards `terms` through both `NatallyOffers.setState`
calls. The adapted document renders each price label, billing sentence and
footer from that kind's real terms. Subscription periods come from the actual
ISO 8601 period; one-time products describe no renewal. Unloaded terms stay
blank, and missing subscription periods cannot invite a purchase. Do not retain
the generic all-card "One-time price" or "never renews" claims for subscriptions.
The reading souvenir remains its actual one-time product; this changes no
product semantics and adds no fallback product or billing period.

## Verification and handoff

Also remove the single obsolete `VITE_CHAT_API_URL` prerequisite from
`scripts/deploy-surge.sh`: current inference uses the existing direct client
contract. Retain `SURGE_TOKEN`, lint, the prescribed `npm run build`, full-matrix
assertion and current deployment command. This adds no hosting or build path.

Use focused type checking and meaningful behavioral checks for: RevenueCat read
success with unavailable key connection retaining ownership/balance; unknown
balance not converted to zero; account change rejecting stale results; native
pending never treated as paid; explicit restore distinct from passive lookup;
paid souvenir access retained with zero ROCHE. Source checks alone do not prove
live payment or provisioning. Report remaining unimplemented key connection and
Play Console prerequisites explicitly. Publish through the existing integrator,
one source line per commit/push as directed; no LFS or unrelated staging.
