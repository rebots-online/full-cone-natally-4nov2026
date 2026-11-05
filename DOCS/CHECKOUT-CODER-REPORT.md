# CTA/CP04 checkout coder report

Date: 2026-10-27  
Base: `8a9db5e`

## Scope and result

No checkout source was changed. The required server contract is not present in
the repository, and the architecture explicitly says a payable quote cannot be
issued until fulfillment readiness is verified. Adding a client path that could
charge before that contract exists would violate the task's explicit payment
gate.

## Files changed

- `DOCS/CHECKOUT-CODER-REPORT.md` — this report only.

## Requirement mapping

- Checklist CTA/CP04 wiring calls for `purchaseCheckout.ts`, owner-bound
  callbacks, RevenueCat Web SDK, reload-safe pending receipts, restore, and the
  quote/start/receipt/cancel backend before any payment acceptance.
- Architecture's “CTA/CP04 card checkout implementation bindings” defines the
  endpoints, quote fields, five-minute/account binding, SDK package validation,
  operation ordering, receipt recovery, cancellation, reconciliation, and stale
  account behavior.
- `FigmaPaywall` already accepts owner-bound quote and action callbacks, but
  `PurchaseAccessProvider` currently passes no methods or quote and maps choice,
  checkout, and restore to an unavailable/access lookup flow. It does not call
  RevenueCat.
- `@revenuecat/purchases-js` 1.73.1 is already installed according to
  `DOCS/CARD-CHECKOUT-INTEGRATION.md` and package metadata. This is dependency
  availability only; no real checkout was attempted.

## Concrete blockers

1. Repository search found no implementation of `POST /billing/quotes`,
   `/billing/quotes/{quoteId}/start`, `/receipt`, or `/cancel`; the existing
   Netlify function only handles `/billing/access` and `/billing/reconcile`.
2. Architecture closure register CR02–CR05 is still open. In particular, exact
   SKU grant policy, durable operation storage/configuration, complete rail and
   delivery bindings, buyer/amount/refund authority and recording destination
   are not all pinned. The architecture says not to invent infrastructure or
   silently enable a rail before these are resolved.
3. No actual selected-product checkout/preload recording exists. Source wiring,
   catalog readback, and installed SDK do not satisfy that acceptance evidence.

## Validation

Read `CHECKLIST.md`, `DOCS/ARCHITECTURE.md` and
`DOCS/CARD-CHECKOUT-INTEGRATION.md`; queried CodeGraph for `PurchaseAccessProvider`,
`FigmaPaywall`, purchase intent and billing access call paths; inspected existing
billing API references. No build, test, lint, payment, or deployment was run.

## Next implementation boundary

Once the already-settled CR02–CR05 bindings are recovered and the existing hosted
backend has quote/start/receipt/cancel plus fulfillment-readiness behavior,
implement the client adapter strictly against those exact contracts. Until then,
the current unavailable UI remains the safe behavior and payment stays disabled.
