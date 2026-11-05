# UX-PLAY-1 native bridge bindings

This names the implementation of the existing UX-PLAY-1 platform commerce
contract before source integration. It does not change the exported Figma
presentation, introduce a provider, or establish an accepted native purchase.
The completed v1.12.86707 matrix predates this bridge.

## Entities and caller contract

| Entity | Exact responsibility |
| --- | --- |
| `src/services/nativeRevenueCat.ts` / `NativeBillingSession` | `{ownerUid,generation}` accompanies every native command and response; responses are checked before use. |
| `isNativeAndroid` | Tauri `isTauri` plus `native_billing_platform`; no user-agent guessing or fallback to web after an Android bridge error. |
| `configureNativeOwner`, `quoteNativeOffer`, `purchaseNativeOffer`, `getNativeCustomer`, `getNativeRocheBalance`, `logoutNativeOwner` | Existing configure/quote/purchase/customer/restore/balance/logout operations through the app-local bridge. |
| `CheckoutCustomer` | `{ownerUid,activeEntitlementIds,entitlementExpirations,purchasedProductIds}`; expiration values are epoch milliseconds or actual unlimited `null`. Web and native SDK results are projected explicitly. |
| `getCheckoutCustomer` | Passive current-customer read; native `FETCH_CURRENT`, never `restorePurchases`. |
| `restoreCheckoutCustomer` | Explicit customer Restore action; native `restorePurchases`. |
| `configuredCheckoutProductIds` | Configured web/native purchase identifiers for existing auto-offer purchase-history suppression. |
| `CheckoutOffer` | Retains existing quote fields and adds actual `productType` (`subscription` or `one_time`), `billingPeriod` (ISO 8601 or null), and `productTitle`. |
| `CheckoutPurchaseOutcome` | Provider-confirmed `purchased` with `CheckoutCustomer`, `cancelled`, or `pending`; pending requires recovery, never a second purchase invitation. |
| `src-tauri/src/native_billing.rs` / `init`, `native_billing_platform`, `native_billing` | Registers the app-local `natally-billing` plugin with the configured package and routes the seven allowlisted commands through Tauri 2.12.4. |
| `NatallyBillingPlugin`, `BillingArgs` | Android SDK ownership queue, owner/generation validation before and after callbacks, retained native Package quotes, exact provider results and no local grants. |
| `App.maybeAutoShowOfferJourney` | Passive customer projection preserves known-product and active-entitlement suppression. |
| `downloadAccess.checkDownloadAccess` | Passive customer projection preserves configured download entitlement expiry and short-lived access result. |

The client generation starts from the current epoch milliseconds and increments
on identity changes, allowing a reloaded webview to supersede prior native calls.
The native queue serializes SDK operations. Desired identity changes invalidate
old callbacks immediately; SDK login/logout follows queue ordering. Logout for an
old owner cannot log out a newer owner. Both native and client quotes expire after
two minutes and are consumed once. Actual native package references stay native.

## Configuration

All these named public values originate in `.env`, with no Natally fallback:

- `VITE_REVENUECAT_PUBLIC_KEY`, `VITE_REVENUECAT_ANDROID_PUBLIC_KEY`
- `VITE_REVENUECAT_OFFERING_ID`
- `VITE_REVENUECAT_READING_PACKAGE_ID`, `VITE_REVENUECAT_CONVERSATION_PACKAGE_ID`
- `VITE_REVENUECAT_READING_PRODUCT_ID`, `VITE_REVENUECAT_CONVERSATION_PRODUCT_ID`
- `VITE_REVENUECAT_ANDROID_READING_PRODUCT_ID`, `VITE_REVENUECAT_ANDROID_CONVERSATION_PRODUCT_ID`
- `VITE_REVENUECAT_READING_ENTITLEMENT_ID`, `VITE_REVENUECAT_DOWNLOAD_ENTITLEMENT_ID`
- `VITE_REVENUECAT_TERMS_URL`

Only bindings required by the selected operation/platform are demanded. Missing
Play products prevent a Play quote without preventing configured web checkout or
native customer/balance refresh. Product IDs and recurring terms must match the
actual catalog. The initial bridge did not include pack selection; the authorized
extension below completes that source path without inventing provider products.

## SDK evidence and packaging

RevenueCat Android is pinned to 11.0.0, Kotlin to 2.2.21; compileSdk 36, JVM 21 and
signing remain as already configured. Official tag sources inspected:

- [Purchases API](https://github.com/RevenueCat/purchases-android/blob/11.0.0/purchases/src/defaults/kotlin/com/revenuecat/purchases/Purchases.kt): configuration, identity, customer refresh policy, explicit restore, virtual currency invalidation/read.
- [Callback adapters](https://github.com/RevenueCat/purchases-android/blob/11.0.0/purchases/src/defaults/kotlin/com/revenuecat/purchases/listenerConversions.kt): native Kotlin callbacks.
- [StoreProduct](https://github.com/RevenueCat/purchases-android/blob/11.0.0/purchases/src/main/kotlin/com/revenuecat/purchases/models/StoreProduct.kt): actual ID, price, type and period; Google subscription IDs can include base-plan suffixes.
- [Price](https://github.com/RevenueCat/purchases-android/blob/11.0.0/purchases/src/main/kotlin/com/revenuecat/purchases/models/Price.kt): formatted price, micros and currency code.
- [CustomerInfo](https://github.com/RevenueCat/purchases-android/blob/11.0.0/purchases/src/main/kotlin/com/revenuecat/purchases/CustomerInfo.kt): purchased product IDs and entitlement dates.
- [Tauri mobile plugins](https://v2.tauri.app/develop/plugins/develop-mobile/), verified against installed 2.12.4 `src/plugin/mobile.rs`: Android registration and `run_mobile_plugin_async`.
- Installed Web SDK 1.73.1 `dist/Purchases.es.d.ts`: `productType`, `normalPeriodDuration`, price and customer projection fields.

Android MainActivity uses `singleTop`, `adjustResize`, and actual system-bar/IME
insets while retaining its current introduction animation. Source/type checks
are separate from the next prescribed full matrix and from store-distributed
purchase, pending/cancelled recovery, account switch and restored-access evidence.

## UX-PLAY-1 monthly-first pack selection — 29 October 2026

The operator's latest correction restores $1 Google Play billing alongside
$5/$10/$25: monthly $1/$5/$10/$25 choices first, with matching one-off tiers
available when configured. This supersedes the earlier $5-only interpretation.
These are catalog tier slots, not permission
to manufacture localized prices, ROCHE amounts, grants or successful purchases.
Actual RevenueCat/Play bindings and the numeric ROCHE grant policy are configured
separately by the parent task; missing bindings leave the corresponding choice
unavailable. This extension reuses the existing provider, bridge, Figma document,
identity, quote expiry, purchase, recovery and Restore contracts above.

| Named entity | Implementation contract |
| --- | --- |
| `purchaseIntent.ts`: `PurchaseIntent`, `purchaseIntent` | Keep `kind` and `sourceSection`; replace unused hardcoded administrative `productId` with optional selected `offerId`. Kind-only conversation entry opens the chooser; only a chosen pack can initiate its purchase. Existing reading CTA retains its single-offer behavior. |
| `checkoutCatalog.ts`: `CheckoutPlatform`, `CheckoutTier`, `TIER_ORDER`, `CheckoutCatalogEntry`, `CheckoutPackBinding`, `checkoutEntries`, `checkoutEntry`, `configuredCheckoutProductIds`, `billingEnv`, `requireBillingEnv` | Parse explicit env bindings, validate unique cadence/tier slots and platform product mappings, order monthly then one-off with tiers 1/5/10/25, and resolve exact selected entries. Retain old configured product IDs only for passive purchase-history matching. No legacy conversation fallback in active offers. |
| `VITE_REVENUECAT_CONVERSATION_PACKS_JSON` | JSON array of `{cadence,tier,packageIdentifier,webProductIdentifier?,androidProductIdentifier?}`. `cadence` is `monthly` or `one_time`; `tier` is string `1`, `5`, `10` or `25`; IDs must be actual catalog values. The public example is blank. Omitted platform product means unavailable on that platform. An Android $1 binding never implies a Web product. No price or ROCHE value is accepted from this config. |
| `CheckoutCatalogEntry.offerId`, `CheckoutOffer.offerId` | Stable selection key `monthly-1`, `monthly-5`, `monthly-10`, `monthly-25`, `one_time-1`, `one_time-5`, `one_time-10`, `one_time-25`; reading uses `reading`. Keys are selector slots, never provider IDs. |
| `getCheckoutOffer(kind, offerId?)`, `getCheckoutOffers(kind)`, `assertOfferCadence` | Quote exact selected package and product using the existing platform route; keep actual title, localized price, currency and period. Monthly slots require actual subscription `P1M`; one-off slots require actual one-time product/null period. Failed or absent choices cannot substitute another product. Loading the catalog returns available verified quotes in configured order. |
| `PurchaseAccessProvider`: `packOffers`, `selectedOfferId`, `packQuotes`, `choosePack` | Load and retain the available conversation quotes, select the first monthly choice by default, preserve a still-valid explicit selection on refresh, and purchase only its quote. A kind-only conversation CTA does not auto-buy the default pack. Pending/confirmed recovery still prevents another purchase; cancellation/expiry refreshes without auto-launching. Clear all selection/quote state on account change. |
| `FigmaPaywall`: `OfferOption`, `Props.options`, `Props.selectedOfferId`, `Props.onSelect` | Pass verified option summaries and selection to the existing iframe adapter. Validate selection events against currently offered IDs/current account and ignore busy/stale events. Purchase events include the selected offer ID for conversation and must match current state. |
| Adapted Figma `NatallyOffers`: `packSelector`, `selectedOfferId`, `options` | Add an accessible native select before the existing conversation purchase card, grouped Monthly then One-off packs, using the existing typography/colors/card composition. Both dedicated and comparison screens share selection. Keep original artwork, navigation, Restore and purchase cards. Show provider text with textContent; no fabricated price/quantity or unlimited wording. |
| `tests/native-billing.test.mjs`, `tests/checkout-packs.test.mjs`, `tests/pack-selection.browser.mjs` | Controlled provider/IPC checks cover all eight configured slots, native-only $1 availability without Web inference, no legacy fallback, exact selected native package, mismatched cadence, owner/quote/recovery invariants; browser fixture exercises actual adapted Figma selector, dedicated/comparison selection and selected purchase event. |

Reading souvenir configuration and its existing benefits remain independent.
Conversation copy must not promise a numeric allowance or a better ROCHE rate
before authoritative grants exist. Monthly preference is ordering and initial
selection; customer consent still occurs through the selected purchase action
and the real provider checkout. No native SDK/API change is needed: the bridge
already quotes an exact package/product for `conversation`.

Verification uses fixtures to establish source behavior, then the prescribed
full coordinator. Provider product activation, actual prices/grants and live
store purchase/renewal/Restore remain distinct acceptance evidence. The observed
v1.13.86779 matrix compiled the initial bridge, not this extension.
