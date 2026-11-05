# Card checkout integration — v0.9.84736

The configured existing RevenueCat Web Billing app is `app941a60bf95`, project
`projaba0bd94`, Stripe merchant `acct_1R8zDSRwvqSUF8qm`. Live catalog reads on
27 October 2026 confirm USD 0.99 for `proda88125bed7` and `prod2f046e3b64`.
The public SDK key is available through the existing authenticated CLI; no new
merchant, secret, product, subscription or persistence service was created.

`package.json` and `package-lock.json` now include `@revenuecat/purchases-js`
1.73.1 for the adapter specified in ARCHITECTURE.md's CTA/CP04 bindings. npm's
resolved dependency installation completed. No payment was attempted and no
purchase or prepaid readiness is implied by dependency installation.

Provider reference: https://github.com/RevenueCat/purchases-js and
https://revenuecat.github.io/codelabs/guides/web-sdk-quickstart.html .

Publication policy for this session: GitHub origin only. Every new commit subject
begins with the applicable canonical version (`v0.9.84736` currently). Historical
published subjects remain recorded verbatim in the session changelog, without
silently rewriting shared history. The per-line session ledger records each
textual addition/removal with source commit, path and old/new line number;
binary changes are recorded by blob identity rather than invented text lines.

## Evaluation checkout adapter source

`src/services/revenueCatCheckout.ts` now implements the installed RevenueCat Web
SDK boundary for the existing Natally tester packages. GLM-4.7 through Crush
produced the mechanical implementation with reasoning disabled. Account-bound
quotes use the live SDK price, expire after two minutes, and cannot switch to the
ecosystem default offering. Purchase cancellation is explicit; the service never
grants allowance or exposes an inference provider credential. Auth changes
invalidate quotes, and purchase/identity operations are serialized.

This module is not yet mounted by the paywall. Backend fulfillment, actual
checkout, cancellation, restoration, native handoff and paid inference remain
unobserved. Do not activate charges before the delivery path is connected.
