# Paywall integration execution — 27 October 2026

State: IN_PROGRESS. ER01/ER02 and the purchase journey remain unaccepted until
observed in the actual deployed ordinary-user journey.

## Presentation boundary

The RevenueCat workflow currently has four screens. Its earlier-screen component
menu does not expose Package/Purchase. The dashboard AI explicitly refused the
requested direct purchase card on an early screen; no changes from that request
were saved or published. The official product documentation describes the offer
on the final screen. CLI workflow read separately failed with missing
`project_configuration:workflows:read`, request
`6f04c4a4-051d-4ad3-b31f-f711fda46cd4`.

The coordinator selected app-owned three-screen presentation with RevenueCat Web
SDK checkout. RevenueCat continues to own customers, purchases, entitlements and
commercial allowance; Firebase UID is the customer identity. This resolves the
presentation limitation without changing payment providers or adding a ledger.

Figma Make externally authored the working three-screen source in existing file
`qaDnpIyfhFmqa7E5fRDIwY`. The source and export provenance are under
`LIBS/UI/FIGMA/three-screen-offers-20261027/`. All three cards retain exact purchase
kind into checkout; the comparison screen follows the two dedicated offers.

## Runtime contracts being connected

- `showOffers()` and `natally:show-offers`: display the journey; no charge.
- `?offers=1`: after authentication, show first screen.
- `showOffer(resourceId, selection)` and `?offer=reading|conversation`: explicit
  purchase intent, retained through authentication and sent to matching checkout.
- Actual prices originate from the RevenueCat offering `Natally`; no invented
  discount, fixed preview amount, or default-offering fallback.
- The native dialog must close while the SDK payment overlay is open so the
  browser top layer cannot obscure the payment form.
- Purchased and ready are separate. SDK purchase success triggers server access
  confirmation; only authoritative readiness enables the purchased experience.
- Cancellation reloads a fresh owner-bound quote; account change invalidates the
  previous presentation and quote. Closing presentation does not release an
  in-flight purchase lock.

## Optional code entry

`revenueCatCheckout.ts` enables the actual RevenueCat checkout's code field using
`showDiscountCodeField: true`. Its installed 1.73.1 runtime supports the localized
`labelsOverride.en['discount_input.label'] = 'Have a code?'` setting. That override
is omitted from public SDK typings, so the adapter uses a narrow typed extension;
this behavior requires checking after SDK upgrades. Provider Apply, eligibility,
errors and adjusted checkout total remain provider-owned. No local discount math
or access grant is performed. No successful redemption has been observed; no
AppSumo license service is configured by this change.

## Evidence boundaries

Source authoring/export, local integration, rendered browser observation,
checkout/payment, server fulfillment and deployed ordinary-account acceptance
are separate. All ER scene timecodes remain NOT RECORDED at this checkpoint.
The RevenueCat multi-step editor itself remains unchanged. The replacement app
journey must be evaluated in the actual application.

## Implementation handoff

The actual source files are now integrated (not merely temporary designs):
`src/components/PurchaseAccess.tsx`, `src/components/FigmaPaywall.tsx`,
`src/services/revenueCatCheckout.ts`, and the adapted external HTML named above.
The original Figma export is frozen. The provider exposes `showOffers()` and
`natally:show-offers`; `?offers=1` opens the three-screen journey after identity,
while explicit `?offer=reading|conversation` launches the selected checkout.
No checkout result directly grants access. Confirmed payment is shown separately
from server-ready access; pending/error suppresses another purchase while restore
remains available. Cancellation releases the lock before fetching a fresh quote.
Auth-generation guards prevent A→B→A stale callbacks from granting UI success.

The native SDK optional code field is enabled and its pinned SDK label override
is 'Have a code?'. RevenueCat itself handles Apply, eligibility and revised totals;
no local code grant or price calculation exists. No live campaign was configured
at this handoff, so successful code redemption is not claimed.

Source review was performed, not a test suite or deployed acceptance. Parent owns
actual Vite/authenticated checkout observation, ordinary-user purchase, fulfillment,
deployment, commit/push and readback. RevenueCat dashboard workflow remains
unchanged; it is not falsely reported as repaired/published.
