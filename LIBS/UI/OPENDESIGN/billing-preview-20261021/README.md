# Natally — isolated RevenueCat/Alby preview

Branch: `codex/revenuecat-alby-preview`. This review entry does not replace the
main app. No application import, root entry change, production deployment, merge
to main, provider provisioning or payment is part of this preview.

Robin's 21 October decision defers WooCommerce/custom-plugin buildout. RevenueCat
serves site-centric PDF/SPA purchases; Alby marketplace serves per-turn readings
first. The Profile/name-click journey includes balance, top-up, natal PDF/SPA
purchase including interactive conversational reading, and expanded billing
management. Ownership of a PDF/SPA does not grant unlimited hosted inference.

Open `index.html` through a static HTTP server or the exact `natally-ai-studio`
OpenDesign project's `billing-preview-20261021/index.html` entry. The name button
opens Profile. Sidebar and in-content actions navigate seven addressable views;
Back/Forward and direct hash links work. The atelier link opens the original
imported source in an isolated wrapper, with a name link back to Profile.

## Source and wiring

The UI is the exported Stitch screen
`projects/8460014353109836944/screens/d033e062f274489b97cf17ee3c1bc851`.
Its unchanged HTML, screenshot, SHA-256 and design-system ID are frozen under
`LIBS/UI/STITCH/branch-preview-20261021/`. `index.html` derives directly from that
export with a relative stylesheet/controller reference appended. The controller
binds original character assets, adds hash/focus/ARIA navigation, removes automatic
paid selection, validates empty fields and replaces generated alert messages with
truthful visible unavailable states. It does not re-create the exported layout.

The original atelier remains unchanged at
`LIBS/UI/OPENDESIGN/atelier-conversation-20261017/index.html`, with its separate
source attribution and import hashes. It is a silent design study, not audio or
ephemeris acceptance. Existing Supertonic application code is untouched.

## Payment boundary

RevenueCat project `projaba0bd94` (Robin's AI World) now contains the requested
`Natally` offering, lookup key `Natally`, ID `ofrng352609e01b`. Creation and a
separate list readback succeeded through the authenticated RevenueCat MCP.
It is not the current offering; the ecosystem's existing default remains
`ofrngf3e410be57`. No products, prices, grants or new currency were created.
Nonsecret project bindings are in `revenuecat-project.json`.

The existing project has two active codes: `AICREDIT`, named ROCHE and documented
as the shared ecosystem currency with existing 50/200/1000 grants; and `ROCHE`,
named Roche Credit with a separate grant configuration. Operator clarification
is pending before balance/grant binding. Do not create a third currency or merge
balances. Cross-app sharing also requires the same verified ecosystem App User ID
and the same currency code; membership in one project alone does not establish
identity equivalence. Select `offerings.all.Natally` when later wiring the SDK
rather than changing the project's current/default offering for other apps.

This is a working screen/navigation preview. It does not implement authentication,
RevenueCat checkout/receipt verification, a balance ledger, Alby invoice settlement,
paid PDF delivery, live reading access or supplier funding. No success or funds
movement is fabricated. Payment is disabled without a verified quote. Natally's
products/prices, app configuration, verified account identity and Alby merchant
setup are still required for integration; keep private keys outside the repository.

The implementation contract must bind RevenueCat confirmation to an authenticated
customer and an idempotent delivery record, handle receipt recovery/refunds, and
bind each Alby invoice to one quoted bounded turn. Reconcile paid-but-undelivered
turns before requesting a second payment. Persist customer and provider balances
separately. No WooCommerce dependency is required for this launch route.

Reference: RevenueCat's Web Billing overview and Web Purchase Links documentation
support one-time products and identified customers. Use configured prices and
server verification rather than treating a return URL as proof of payment.

- https://www.revenuecat.com/docs/web/web-billing/overview
- https://www.revenuecat.com/docs/web/web-billing/web-purchase-links
- https://guides.getalby.com/developer-guide/developer-guide/nostr-wallet-connect-api/building-lightning-apps/nwc-js-sdk
