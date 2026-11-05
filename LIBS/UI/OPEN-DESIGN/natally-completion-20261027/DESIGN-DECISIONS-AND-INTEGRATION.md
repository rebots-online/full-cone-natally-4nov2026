# Natally public entry and purchase presentations: design decisions and integration contract

Date: 27 October 2026. Designer-of-record for these surfaces: this Open Design run (assigned by the coordinating agent).
Inputs read in full or by section: `DESIGN.md`, `PRD.md`, `ARCHITECTURE.md` (AD-20261027, CP-T03, CTA-20261027, CTA/CP04 bindings, OFFER-1/2, LEARN-1), the approved Figma Make paywall `qaDnpIyfhFmqa7E5fRDIwY` (`public/paywall.html`), and the existing project assets.

**Evidence boundary.** These are design artifacts. They do not authenticate, quote, charge, settle, grant, preload or infer. Nothing here is runtime, payment or acceptance evidence for any CP, CTA or PB row. All of those rows stay `NOT RECORDED`.

---

## 1. Deliverables

| ID | Path | Role |
| --- | --- | --- |
| `natally-marketing-landing` | `natally-completion-20261027/marketing-landing.html` | **Proposed final HTML artifact**: public entry (PB30, CTA01). |
| `natally-purchase-states` | `natally-completion-20261027/purchase-states.html` | Sixteen purchase/access presentations (CTA02–05, CP04–CP14 presentation). Spec board; the frames are the components. |
| `natally-design-integration` | `natally-completion-20261027/DESIGN-DECISIONS-AND-INTEGRATION.md` | This document. |
| `natally-artifact-manifest` | `natally-completion-20261027/artifact-manifest.json` | Identifiers, paths, hashes, preview URLs. |

Assets in `natally-completion-20261027/assets/` are byte-identical copies; no originals were edited or moved:

| File | SHA-256 | Intrinsic size | Origin |
| --- | --- | --- | --- |
| `natally-paywall-original.webp` | `8766fb9ed3c23e4571c864e9b433366e643a066743e43418062e0b2f0dc6ae95` | 1586 × 992 | Art referenced by the approved paywall. Same hash as the repo's `public/paywall/natally-original.webp`. |
| `natally-still.webp` | `05f7b2fc0f4fb160d85a8bd7a8cf4e27eedb48e3c70fac5607eab1cbed42f5db` | 400 × 400 | `atelier-conversation-20261017/assets/` |
| `natally-mascot.webp` | `a40780bad977525afdd6c7f92ed47a4b0ba090b1453921a0ad4248208301f873` | 400 × 400, animated | `atelier-conversation-20261017/assets/` (carried for completeness; not referenced by the pages) |

In production, reference the repo's existing files. Do not add duplicate copies.

---

## 2. Design decisions (settled, for the integrator to apply, not revisit)

**D1. One visual source.** All new surfaces use `DESIGN.md` tokens verbatim: `--bg --surface --fg --muted --border --accent --violet --violet-light --deep --success --error`, Georgia display and Segoe UI body. There are no font downloads or remote images. `DESIGN.md`'s "not a landing page" sentence describes the reading-room screen. The marketing scope comes from PB30/CTA01 and applies the same tokens. It does not introduce a second identity.

**D2. The approved paywall is preserved, not redrawn.** Production continues to render the original `paywall.html` bytes in `FigmaPaywall.tsx`'s iframe. Its fonts (Instrument Serif/Manrope) and hex palette belong to that approved source and stay as they are. Frames 2–4 in `purchase-states.html` show what the adapter writes into it. They are not a replacement.

**D3. Host panels share the paywall's geometry.** States after "Continue" (frames 1 and 5–16) are host-rendered panels that replace the iframe inside the same `PurchaseAccessProvider` dialog. They use the paywall's 980 px max width, 24 px radius, `.9fr / 1.1fr` art-and-content columns, artwork with the same right fade, and the same ≤720 px stacked layout. This keeps one continuous surface while using DESIGN.md tokens.

**D4. Artwork.** The original Natally art appears unaltered. The landing hero shows it full-frame at `aspect-ratio:1586/992`. Dialog art columns use the paywall's own approved `object-fit:cover; object-position:52% center` crop (50% 43% on mobile). The 400 × 400 still is the brand emblem and the attention-section portrait. No generated or substitute character art is used.

**D5. USP-to-product mapping.** Each USP section has exactly one buy button for its matching product, inside an "offer plate" that names the product, shows the price and lists its real benefits:

| Section ID (`data-usp`, element `id`) | Heading | Intent | Button label | `data-od-id` |
| --- | --- | --- | --- | --- |
| `usp-hero` | Your birth chart, read aloud by Natally. | `reading` | Start my first reading | `cta-hero-reading` |
| `usp-precision` | Every placement comes from the ephemeris. | `reading` | Get my calculated reading | `cta-precision-reading` |
| `usp-attention` | As she speaks, the wheel follows her. | `reading` | Hear my reading | `cta-attention-reading` |
| `usp-conversation` | Ten more questions, whenever you want them. | `conversation` | Add ten more turns | `cta-conversation` |
| `offer-scope` (reading column) | First reading · tester | `reading` | Buy first reading | `cta-scope-reading` |
| `offer-scope` (conversation column) | More conversation · tester | `conversation` | Buy ten more turns (outlined) | `cta-scope-conversation` |
| `app-exhausted` (in-app, frame 15) | You've used all your turns | `conversation` | Add ten more turns | — |

Free exploration ("Explore the room free first") and "Sign in" are text links with no intent. They are not purchase actions.

**D6. Tester products are separate from the full workup.** Only the two configured tester SKUs are sold. The full workup (planned USD 30: keepsake PDF, one year of the frozen interactive reading, ten summarised follow-up turns) appears once, in a dashed "After testing · not on sale" column with no buy button. It carries the line: "Not included in either tester purchase." The paywall's original "A one-time keepsake" eyebrow and its keepsake benefit list are replaced by text for the selected tester SKU (see §5.2). That way a tester purchase never implies archive delivery.

**D7. Prices.**
- Inside the app, the only displayed price is `quote.formatted` from the verified owner-bound quote.
- The public landing page has no quote, because quotes are owner-bound. It shows the configured tester policy v3 value `USD 0.99` with the caption "Your quote confirms the price before you pay". If the configured policy value is unavailable at build time, remove the price text and keep that caption.
- No other prices, discounts, testimonials, counts or ratings appear anywhere.

**D8. One click, with no repeated selection.** A buy click is the product choice. Google sign-in and RevenueCat's final card checkout are the only steps in between, and both keep the selection visible. The payment method is still an explicit tap on the paywall (architecture: CTA clicks select the product, not rail consent).

**D9. Primary-action economy.** Each dialog state has at most one solid gold button. Recovery states that must never imply a new payment (pending, reconciling) use an outlined "Check again" button, so a gold button never sits next to "please don't pay again".

**D10. Honest motion.** Live-state pills and the restore spinner animate only under `prefers-reduced-motion: no-preference`. The landing wheel's halo pulses twice and then holds steady, the same "two gentle pulses then steady" grammar as DR-03. There is no progress percentage anywhere.

---

## 3. Closed product binding (from ARCHITECTURE; do not change)

| `PurchaseIntent.product` | RevenueCat package (offering `Natally`, `ofrng352609e01b`, read as `offerings.all.Natally`) | Store product ID / RC ID | Policy v3 benefits (display text) |
| --- | --- | --- | --- |
| `reading` | `natally_reading_test` | `natally_reading_test_v3` / `proda88125bed7` | Ten completed conversation turns · Downloads of your selected reading · One promotional $ROCHE credit |
| `conversation` | `natally_roche_test` | `natally_roche_test_v3` / `prod2f046e3b64` | Ten further completed conversation turns · One promotional $ROCHE credit |

- Firebase UID is the RevenueCat App User ID.
- Stripe merchant `acct_1R8zDSRwvqSUF8qm` is reached only through RevenueCat Web Billing.
- Do not add a Stripe checkout, a merchant, a provider, a currency or storage.

---

## 4. Client-side intent contract (non-authoritative)

```ts
// src/services/purchaseIntent.ts — extend the existing closed type; do not widen `product`.
export type PurchaseProduct = 'reading' | 'conversation';
export type PurchaseSourceSection =
  | 'usp-hero' | 'usp-precision' | 'usp-attention' | 'usp-conversation' | 'offer-scope'
  | 'app-exhausted'
  | ExistingInAppSectionId;            // keep the IDs already used by LearnAndPayments call sites
export interface StoredPurchaseIntent {
  v: 1;
  product: PurchaseProduct;
  sourceSection: PurchaseSourceSection;
  returnPath: string;                  // e.g. "/#usp-precision" (landing) or in-app route
  createdAt: string;                   // ISO-8601
  intentId: string;                    // crypto.randomUUID()
}
export const PURCHASE_INTENT_KEY = 'natally.purchaseIntent.v1'; // sessionStorage
```

Rules:
1. On a buy click, write the intent to `sessionStorage[PURCHASE_INTENT_KEY]`. A newer click replaces the older one. If an operation for the older intent is in flight, invalidate it (existing `showOffer` replacement rule).
2. If the stored value fails validation (unknown `product` or `sourceSection`, `v !== 1`, or older than 30 minutes), discard it and show no paywall.
3. The intent never carries price, benefits, quote, UID or amount. The server derives everything from `product` (existing `DownloadRequest` transport).
4. Clear the key when the purchase reaches `ready` or the user explicitly closes the paywall. A cancel or failure keeps the key (frames 9/10 keep the selection).

### 4.1 Landing page hook (already in `marketing-landing.html`)

```js
// Click handler on [data-buy]; data-buy = product, data-source = section ID.
// 1) sessionStorage.setItem('natally.purchaseIntent.v1', JSON.stringify(intent))
// 2) if (window.NatallyEntry?.startPurchase) window.NatallyEntry.startPurchase(intent)   // same-origin app bundle
//    else location.href = APP_ROOT + '?intent=' + product + '&source=' + section        // replace the design-preview URL
```

- **Same-origin bundle present:** `NatallyEntry.startPurchase(intent)` runs inside the click gesture. It must call Firebase `signInWithPopup` immediately when signed out, then `showOffer(intent)`. Frame 1 is shown only if the popup is blocked.
- **Navigation path:** at bootstrap the app runs `readIntentFromUrl()`. It validates `intent` ∈ closed products and `source` ∈ section IDs, writes the stored intent, then calls `history.replaceState` to remove the query. If signed out it shows frame 1, where one tap on "Continue with Google" is the necessary authentication.
- Replace the design-preview fallback `purchase-states.html?...#auth-handoff` with `APP_ROOT`. `APP_ROOT`, the landing path, the Terms/Privacy URLs (CR04) and the "About and source" target are existing deployment values. Bind them; do not invent them.

### 4.2 Return to origin (CTA05)

- **Landing origin:** navigate to `LANDING_PATH?purchase=<cancelled|failed>&source=<section>&product=<product>#<section>`. The landing script reveals that section's `[data-notice-for]` notice (on `offer-scope`, the one matching `data-notice-product`), scrolls to it without `scrollIntoView`, and focuses its buy button. Notice copy is fixed in the script.
- **In-app origin:** close the dialog, keep the conversation, draft and chart state, and return focus to the originating CTA element.

---

## 5. Paywall adapter (frames 2–4; original `paywall.html` unchanged)

### 5.1 Calls, in order, per iframe load

1. Wait for `natally:paywall:ready` (`apiVersion: 1`) on the iframe document. Bind `choice`, `checkout`, `restore` and `close` once. Ignore the parent-window duplicate events.
2. Apply the offer text (§5.3).
3. `NatallyPaywall.setMethods({card:false, crypto:false, lightning:false})`, then `setState('loading')`.
4. `POST /billing/quotes` with the existing body carrying `{intent: product, resource}`. On response, verify all of: `quote.ownerUid === uid`, `quote.productId` equals the store product in §3, `currency === 'USD'`, `expiresAt > now`, and `loginGeneration` unchanged. Then:
   - `setVerifiedPrice({quoteId: quote.quoteId, formatted: quote.formatted})`
   - `setMethods({card:true, crypto:<x402 configured per CR04>, lightning:<Lightning configured per CR04>})`
   - `setState('ready')`
5. On any failure, or before the quote coordinator exists, call `setState('unavailable', "Purchasing isn't available right now. Your choice is kept; nothing has been charged.")`. Do not start checkout.
6. `choice {method}`: if `method !== 'card'` and that rail is not configured, ignore it. Selecting a different method clears the price (`setVerifiedPrice(null)`) before requesting that rail's quote.
7. `checkout {method, quoteId}`: repeat the step-4 checks, then go to §6.
8. `restore` goes to frame 11. `close {reason}` follows §4.2. Neither grants anything.

### 5.2 Text replacement selectors in the original export

Use text nodes only (`textContent`), never `innerHTML`.

| Selector | `reading` | `conversation` |
| --- | --- | --- |
| `.eyebrow` | A one-time tester purchase | A one-time tester purchase |
| `#paywall-title` | Your first reading | Ten more turns |
| `.intro` | Natally reads your calculated chart aloud, with turns for your questions. | Keep talking with Natally about your chart and today's sky. |
| `.includes` (replace all `li`) | three benefit lines from §3 | two benefit lines from §3 |

Build each `li` exactly as the original does: `<li><span class="check">✓</span><span>{text}</span></li>`. Benefits displayed at runtime must be `quote.benefits` when the quote supplies them. The §3 strings are the fallback and the design reference, and they must match.

### 5.3 PaywallView fields

`PaywallView.offerTitle = #paywall-title text`, `offerDescription = .intro text`, `benefits = string[]`, plus `offerEyebrow = .eyebrow text`. The eyebrow change is this design's decision under D6.

---

## 6. Card checkout and the state-to-frame map

Endpoints and SDK calls are the existing ones (`purchaseCheckout.ts`). Steps:

1. `POST /billing/quotes/{quoteId}/start`.
2. Write `localStorage['natally.pendingPurchase.v1.' + uid] = {quoteId, product, sourceSection, startedAt}`. If this write fails, do not proceed: call `setState('error', "We couldn't save a recovery record on this device, so checkout didn't start. Nothing was charged.")`.
3. Show frame 5.
4. Call the RevenueCat Web Billing `purchase` for the exact `rcPackage` resolved from `offerings.all.Natally` that matches §3 and the quoted amount.

| Outcome / server state | Purchase state | Access state | Frame (`id` in `purchase-states.html`) | Callback after |
| --- | --- | --- | --- | --- |
| Popup blocked or redirect sign-in pending | — | `signed_out` | `auth-handoff` | `auth.google` → `signInWithPopup`, then step 3 of §5.1 |
| Quote requested | `quoted` (pending) | `purchase_required` | `paywall-loading` | — |
| Verified quote | `quoted` | `purchase_required` | `paywall-quoted` | `checkout` event → §6 steps 1–4 |
| No payable quote / coordinator missing | — | `purchase_required` | `paywall-unavailable` | close/restore only |
| SDK sheet open | `checkout_open` | `purchase_required` | `checkout-open` | `checkout.cancel` → `POST …/cancel` → `cancelled` |
| SDK resolved with `storeTransactionId` | `pending` | `payment_pending` | `payment-pending` | `POST …/receipt`, then `POST /billing/reconcile`; `purchase.reconcile` repeats the reconcile |
| Settlement verified | `settled` | `provisioning` | `provisioning` | poll `refreshCapabilities` with the existing backoff |
| Fresh allowance and credential | `settled` | `ready` | `ready-preloaded` | `ready.return` → clear both storage keys, close, resume `pendingRequestId` once |
| SDK user-cancel error | `cancelled` | unchanged | `cancelled` | `return.origin` (§4.2); `checkout.retry` → same quote if unexpired, else new quote, same product |
| SDK payment error / decline | `failed` | unchanged | `failed` | show `error.message` as text; `checkout.retry` as above |
| Restore started | — | `checking` | `restore-checking` | `restorePurchasedAccess()` → map the result through this table |
| Restore: nothing owned | — | `purchase_required` | `restore-none` | `paywall.open` with the carried or default `reading` product; `auth.switch` → sign out, then sign-in |
| Unknown or ambiguous status | `reconciliation_required` | `reconciliation_required` | `reconciliation-required` | `purchase.reconcile` |
| `loginGeneration` changed mid-operation | discard | per new account | `account-changed` | `paywall.open` → new quote, same product |
| No turns left | — | `exhausted` | `exhausted` | `cta.buy` with `{product:'conversation', sourceSection:'app-exhausted'}` |
| Provider unavailable | — | `unavailable` | `capacity-unavailable` | `inference.retry` |
| Refund processed | `refunded` | per server | no new frame; existing account/billing view | — |

**Invariants**
- Only a server `AccessSnapshot.state === 'ready'` shows frame 8. SDK success, a return URL or a client flag never does.
- Frames 6 and 13 never render a buy or pay button.
- Frame 8 values bind to `AccessSnapshot.remainingTurns` and `rocheUnits`. Hide each fact tile whose value is `null`.
- Discard any reply whose `uid` or `loginGeneration` differs from the current one.

### 6.1 Host panel `data-action` callbacks

| `data-action` | Handler |
| --- | --- |
| `auth.google` | `signInWithPopup(GoogleAuthProvider)` (existing Firebase boundary) |
| `return.origin` | §4.2 |
| `checkout.cancel` | close SDK checkout; `POST /billing/quotes/{quoteId}/cancel` |
| `checkout.retry` | reuse the unexpired quote, else `requestPurchaseQuote(sameIntent)`; then §6 |
| `purchase.reconcile` | `POST /billing/reconcile` for the stored `quoteId` |
| `ready.return` | close; focus the origin; resume the saved request exactly once |
| `paywall.open` | `showOffer(currentIntent)` |
| `auth.switch` | Firebase `signOut`, then `auth.google` |
| `cta.buy` | same as a landing buy click, with `data-intent` / `data-source` |
| `inference.retry` | re-submit the saved request ID (existing inference coordinator) |

---

## 7. Mechanical integration steps for the coder

Make no design decisions. Copy the copy strings verbatim from the HTML `data-od-id` regions.

1. **Landing.** Serve `marketing-landing.html` at the existing public entry path. Change only:
   - asset `src` values, to the repo's `public/paywall/natally-original.webp` and the existing still emblem;
   - the `href` of `[data-entry="sign-in"]` and `[data-entry="explore-free"]`, to `APP_ROOT`;
   - the fallback URL in `startPurchase`, to §4.1;
   - the `[data-legal]` hrefs, to the CR04 legal URLs;
   - `[data-entry="about"]`, to the About route.

   Replace `.version-badge` text with the build identity (CP02) or remove it so that `BuildStamp` supplies the single badge. Never show two.
2. **Intent.** Add the §4 types, storage key, `readIntentFromUrl()` and the 30-minute validation in `purchaseIntent.ts`.
3. **Paywall adapter.** In `FigmaPaywall.tsx`, add the §5.2 text replacement after `ready` and the §5.1 call order. Leave the original HTML untouched.
4. **Host panels.** Create `src/components/purchase/PurchaseStatePanel.tsx`, rendering one of the frame IDs from §6. Port the CSS from `purchase-states.html` starting at the comment `/* dialog geometry` through the end of the `<style>` element. Leave out the board chrome (`.board-head .legend .selection .toc .frames .frame-label`). Remove `.bind` dotted underlines and render real values.
5. **Provider wiring.** In `PurchaseAccessProvider`, map the purchase and access states to `PurchaseStatePanel` per the §6 table, and wire `data-action` per §6.1.
6. **In-app USP.** When `exhausted` is reached on submit, open frame `exhausted` with the conversation intent. Keep the composer draft.
7. **Check (not acceptance).** `npm run lint && npm run build`. Then manually click every `[data-buy]` at 390 px and 1440 px and confirm the stored intent matches the button's `data-buy` and `data-source`.

**Do not:** change prices, benefits, product IDs or packages; add providers, storage or a Stripe checkout; treat SDK success as a grant; remove the full-workup "not on sale" label; add testimonials or counts; edit `paywall.html`; or call `scrollIntoView`.

---

## 8. Static verification performed on these artifacts

- Both HTML files have closed tags and no `{{placeholder}}` text. Every image is project-local with declared intrinsic `width`/`height`.
- Only one solid gold primary button sits in each dialog frame and each landing section. The offer-scope conversation button is outlined, so the side-by-side tiers have different visual weights.
- Hover states lighten the gold fill and keep dark ink, or lift the dark surface with light text. No foreground moves toward the background. `:focus-visible` rings are on every control. Targets are at least 44 px; buy and primary buttons are 48 px.
- Text grid tracks use `minmax(0,…)`. Breakpoints are 1100/760/380 px on the landing page and 720 px on the dialogs. There is no horizontal page scroll; the state TOC scrolls on its own axis by design.
- Not performed: a rendered visual pass. The renderer was not available in this runtime. Browser and device checks remain integration work.

## 9. Open bindings (existing values to recover, not new decisions)

`APP_ROOT`, landing path, Terms/Privacy URLs, About target, and the x402/Lightning configuration flags (CR04). The landing price display depends on the configured policy v3 value being available at build time (D7).
