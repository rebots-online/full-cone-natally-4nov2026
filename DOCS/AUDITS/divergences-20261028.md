# Architecture and implementation divergences

Baseline: commit `f3470d4ffec6438582e643f6f2e7e542513676d1`, requested
2026-10-28 04:50:31 UTC. CodeGraph 1.6.2 indexed the isolated snapshot:
156 files, 2,715 nodes, 6,853 edges. Detailed evidence is in [the snapshot report](codegraph-architecture-20261028-045031.md).
The as-built PUML candidate is being generated.
Later deployment observations are labelled separately and do not change this baseline.

Desired result: only differences that are approved, not-yet-built checklist items.
Current result: that condition is NOT met; five distinct implemented/spec
contract discrepancy groups exist in addition to ordinary backlog.

| ID | Classification | Required / documented | Observed evidence | Resolution boundary |
|---|---|---|---|---|
| D01 | Stale documentation violates settled specification | RevenueCat owns commercial customer and ROCHE per DOCS/ROCHE-CUSTOMER-ARCHITECTURE.md:7–12 | Main DOCS/ARCHITECTURE.md:753 still describes an authoritative Firebase-UID-linked append-only ROCHE ledger | Correct stale documentation to the longstanding RevenueCat requirement; authority is not open for discussion |
| D02 | Implemented contract divergence | Main architecture:1347 names purchaseCheckout.ts and requestPurchaseQuote | That file/entity is absent; actual startPurchase calls purchaseCheckoutOffer in revenueCatCheckout.ts (CodeGraph edge 5005) | Correct the contract to actual approved ownership; do not add a redundant adapter to satisfy stale prose |
| D03 | Implemented contract gap | Exhaustive entity inventory should describe native-auth boundary | AuthModal:67/87 calls signInNative (edges 4490/4492); nativeAuth.ts:9 invokes native_sign_in, registered in lib.rs:8 and handled by native_auth.rs:96; exact symbols missing from architecture inventory | Add actual native boundary to the as-built candidate and discuss contract reconciliation |
| D04 | Expected unbuilt work | Signup reuses/creates empty OpenRouter key; purchase funds it | reconcileManagedKey at billing/openrouter.mjs:174 and setManagedKeyLimit:139 have no incoming graph calls/imports; creation only called by internal reconciliation | Complete existing approved lifecycle wiring; portable helper alone is not fulfillment |
| D05 | Expected unbuilt work | Shared ROCHE consumed for paid use, issued single-use gifts/discounts with attribution | Balance read is wired (edges 4580/5548); completeHosted returns text/model without ROCHE debit; no redeem/coupon/currency-write function nodes; checkout field only at revenueCatCheckout.ts:294–307 | Implement the settled commercial flows; no competing ledger |
| D06 | Aligned source; acceptance unverified | Personal souvenir snapshot, viewer and PDF | ExportModal:89–90 wires createSouvenir/downloadSouvenirPdf; SouvenirViewer:80 wires loadSouvenir (edges 4549/4550/5268) | Verify ordinary-user purchase and resulting hosted artifact; source wiring is not proof of one-year service |
| D07 | Implemented landing-copy discrepancy | Credits are ROCHE; souvenirs include at least ten exploratory questions | marketing.html:269/301 sells exploration as ten more turns; price nodes contain static USD 0.99, with no catalog binding in src/marketing.tsx | LP04/LP05 contract now specifies required meaning and actual quote consistency; change copy/wiring under settled requirements |
| D08 | Source aligned; personal-data runtime unverified | Actual onboarding chart with existing 3D renderer | src/marketing.tsx loads owner intake, calculateNatalChart, Astrolabe3D, rotation/pause/selection | LP07–LP10 require real-account, unknown-time and account-switch evidence |
| D09 | Deployment gap, observed after snapshot | Public marketing homepage and Windows auth helper | Live HTTPS check: /marketing.html and /auth/native.html return 404; root remains PSYCHICK NATALLY with old app asset; legal documents return 200 | Deploy coordinated compliant output and verify actual user journeys |
| D11 | Implemented entity inventory gap | Souvenir schema/functions must have closed ownership mappings | createSouvenir/loadSouvenir/downloadSouvenirPdf are wired but exact new functions/schema are not enumerated in main architecture (report G07) | Include actual artifact entities in as-built candidate; preserve acceptance gap |
| D12 | Build contract drift | Approved platform matrix and canonical version mechanism | Corrected code requires RPM/PWA and rejects major zero; canonical state still zero and older architecture matrix omits targets (report G09) | Reconcile build contract and version migration through prescribed script |
| D10 | Superseded proposal, not governing | Operator says CC16 was neither discussed nor approved | Later d600804 elevated it; b28fa10 removes authority claim; draft preserved on checkpoint/2026-10-28-pwa-update-proposal at d408c60 | Keep optional proposal subordinate; no CC16-derived release gate |

D01–D03, D11 and D12 are five distinct contract discrepancy groups, not merely unchecked implementation
items. D07 is additional observable mismatch with the operator's product wording.
D04/D05 remain ordinary unfinished work only insofar as the existing approved
requirements fully specify their implementation; no new architecture is inferred.

## Evidence preservation and next architectural artifact

Original baseline architecture remains in Git at f3470d4. Original and alternative
checkpoints are indexed in [../CHECKPOINTS.md](../CHECKPOINTS.md). The requested
as-built PUML is a candidate representation of the snapshot graph, not permission
to replace required behavior with current defects. Reconciliation must keep the
actual graph, intended contract, and unfinished checklist distinguishable.

Landing-page contracts: [specification](../LANDING-PAGE/SPEC.md) and
[architecture](../LANDING-PAGE/ARCHITECTURE.md). They consolidate existing operator
requirements and label gaps; they do not change application code.
