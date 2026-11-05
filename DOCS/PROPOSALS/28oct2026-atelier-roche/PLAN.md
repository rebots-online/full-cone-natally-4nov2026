# Atelier-first ROCHE and keepsake proposal

Status: PROPOSED FOR OPERATOR DISCUSSION. No product implementation or provider
configuration is authorized by this document. The operator requested this plan
and rendered PlantUML first; incorporation into DOCS/ARCHITECTURE.md follows
sign-off, then the architecture delta becomes CHECKLIST.md recipes.

Prepared 28 October 2026, America/Toronto. Source inspection baseline:
`0e9dcd8c8cab3cfdc5624a40e012928f3ac658bd` on `master`, plus the existing dirty
working tree. Existing staged documents and unstaged source are preserved.
This is a proposed AST delta, not a statement that the proposed symbols exist.

## Review artifacts and authority

- [AST delta source](AST-DELTA.puml) / [render](AST-DELTA.svg).
- [Customer journey source](JOURNEY.puml) / [render](JOURNEY.svg).
- [Payment costs, HST and references](PRICING-HST.md).
- Governing user input: the 28 October request beginning "ok i'm baack at this
  desktop", including its explicit plan -> sign-off -> architecture -> checklist
  order. Follow-up explicitly reconfirms Google Play Billing as a primary,
  longstanding specification to architect in, not an optional new product idea.
- KStore Admin-Manual manually retrieved, not injected reminders:
  `SPEC_CONVENTIONS/architecture-checklist-continuous-demonstration.md`, rev 3,
  SHA256 `e37201a77247d1b69d34ab5b2e00eff473c16f1b7d577e31efcfaed2fd787ba4`;
  `GLOBAL/RULES/structured-architecture-representations.md`, rev 1,
  SHA256 `1fb92c9be34f157970f926c284abe1a5f804e03b2ad7c75d1d86306f7f62a945`.
- Preserve `DOCS/SESSION-KEY-ARCHITECTURE.md`, RevenueCat commercial authority,
  Firebase operational records, and `DOCS/INTEGRATIONS/ZIGHT-MCP.md` unless an
  explicitly identified change is approved. No additional hosting, commercial
  database, separate wallet, or new WordPress service is proposed here.

## What exists, and what has not been demonstrated

| Question | Current source evidence | Completion finding |
| --- | --- | --- |
| RevenueCat screens cleaned up? | `PurchaseAccessProvider` still renders `FigmaPaywall`; mappings use earlier reading/conversation products. Live editor was not inspected this turn. | Cannot claim cleanup or publication. Replace old presentation/mappings only after the approved migration. |
| Confirmation and proper routing? | `PurchaseAccess.tsx:startPurchase` displays payment-confirmed and access-pending messages; `finishAfterAccess` either resumes a download or closes. `revenueCatCheckout.ts` uses Web SDK and `skipSuccessPage: true`. | Partial implementation exists; complete paid return route and native flow are not demonstrated. |
| Google Play IAP? | Android app Gradle dependencies inspected contain no RevenueCat Android SDK or BillingClient dependency; the inspected purchase service imports `@revenuecat/purchases-js`. | Required native integration remains to be completed, including receipt handling and restores. |
| Marketing hero animated like atelier? | `marketing.html` hero is an `img`; `src/marketing.tsx` mounts `MarketingNatalChart`, not the hero atelier. `DOCS/MARKETING-ATELIER.md` says implementation has not started. | Not implemented in this inspected source. |
| Direct onboarding to atelier? | `App.handleOnboarded` calls `maybeAutoShowOfferJourney`, which dispatches `natally:show-offers`. | Remove the automatic interjection and select atelier presentation. |
| Free authored voice and personality? | `authoredChartExplanations.ts`, `NatallyChatbot`, `voiceService.ts`, `soul.ts`, and root `SOUL.md` already exist. | Reuse and extend these; do not invent a second persona or inference service. |

These are source observations, not deployed/device acceptance. No purchases,
account changes, app rebuild, live paywall publication or deployment took place
for this proposal. Existing paid fulfillment and Windows login acceptance remain
unfinished release work, not implicitly satisfied by this new proposal.

### Live NATALTURN incident and Android priority, same-turn follow-up

The operator supplied a RevenueCat event screenshot showing +10 NATALTURN on
28 October 2026 at 08:31 UTC and reports having paid. The operator then explicitly
prioritized native Google Play Billing as Android's primary payment method.
Required implementation order after sign-off: enumerate/freeze the native
purchase and correct ROCHE grant contracts, then implement that path first.
Do not wait for marketing animation to begin the approved billing work.

One read-only subagent inspected `GET /projects/projaba0bd94/virtual_currencies`:

| Natally product | Current automatic NATALTURN grant | Current ROCHE grant |
| --- | ---: | --- |
| `proda88125bed7` / `natally_reading_test_v3` | 10 | None |
| `prod2f046e3b64` / `natally_roche_test_v3` | 10 | None |

The coordinating agent previously authorized the separate currency, contrary to
the operator's established ROCHE requirement. `DOCS/PAID-FULFILLMENT-STATUS.md`
records the creation and the later documentation correction that did not change
live grants. RevenueCat applied those configured grants on purchase. No provider
mutation or correction has been performed by this proposal or its audit.

Literal ROCHE exists and retains unrelated legacy product grants. Preserve them.
`DOCS/BILLING-SPEC.md:34`, `CHECKLIST.md:37` and
`DOCS/SESSION-ADAPTER-INTEGRATION.md:125` leave the numeric grant/conversion
unresolved. Neither 10 NATALTURN -> 10 ROCHE nor a one-ROCHE goodwill grant is
an approved conversion. Before activation, record the explicit package grant,
correct both mappings, verify provider readback, and reconcile affected paid
transactions to their promised ROCHE benefit without requiring another purchase.
Retain the original transaction history and identify the correction separately.
Changing to Google Play alone does not correct this configuration.

No agent-created implementation decision may amend the frozen architecture or
checklist. Proposed new entities in this package remain unapproved until the
operator signs off and they are enumerated in the canonical contract.

## Proposed product contract

| ID | Required behavior / proposed resolution |
| --- | --- |
| AR01 | Authenticate and finish onboarding; calculate the actual chart; enter the expanded atelier immediately. Returning accounts restore the same experience. No mandatory offer, checkout, generated reading or funded key is a prerequisite for free exploration. |
| AR02 | Free chart selections and supported typed intents use authored education plus the user's first name and actual calculated placements. Unsupported free questions receive an authored invitation to a real reading. There is no free LLM inference. Voice is rendered on demand through the existing voice engine. |
| AR03 | Curated Natally-isms cover greetings, chart elements, idle interactions, cookies, trinket mishaps, returning sessions and purchase thanks. Extend the existing SOUL.md and authored content together. Use structured slots, prevent immediately repeated variants, and never fabricate past user disclosures. Each completed free response ends with a varied invitation to a real reading; hover labels alone do not count as turns. |
| AR04 | A real reading means any paid conversation: natal interpretation, chart questions, horoscope, synastry or another supported exploration. One access tier, funded by ROCHE; no separate reading-access purchase required to chat. Synastry uses two actual chart inputs, not an invented second chart. |
| AR05 | Monthly recurring ROCHE packs are the default purchase. They grant a stated finite quantity on each successful charge. One-time top-ups remain available. Price, currency, cadence, grant and renewal terms are visible before confirmation. No unlimited-access wording. |
| AR06 | Proposed price choices: CA$10/month default and CA$5 normal top-up minimum. The $1 example is costed, not silently enabled. At least 40% of the paid, discounted, tax-exclusive package price funds inference, before processor deductions. Numeric token quantity requires the rate decision below. |
| AR07 | Google Play Billing is the primary Android payment path through the native RevenueCat Android SDK. Native checkout opens the Play purchase sheet with the monthly base plan selected. Restore after reinstall and signed-in customer continuity are mandatory. No web-card checkout masquerading as Android IAP. |
| AR08 | Web/Windows/Linux use the existing RevenueCat Billing engine with Stripe card default. Existing other authorized payment methods remain discoverable when operational. The proposal does not add a payment provider or claim unfinished methods work. |
| AR09 | The shelf LED sign displays the authoritative ROCHE balance and animates spend during a paid response. A visibly marked in-flight estimate may animate before settlement; only the confirmed RevenueCat result changes the authoritative amount. Missing connectivity shows last-updated/unavailable, never a fabricated zero. |
| AR10 | After every two completed paid user-question/answer pairs, append a brief keepsake invitation. Do not interrupt speech, open a modal automatically, or count retries, partial failures, replays or free lessons. A purchase resets the cadence; offer another edition only after new paid content exists. |
| AR11 | Keep the quiet, persistent keepsake button. Add a small table-menu-style shelf sign: "Ask me about my Souvenir Keepsake / Natally Chart / $9.99 + tax" using the actual localized price. Shrink cookie signage visually while retaining a usable pointer/touch target. Include "Expand atelier" / restore-view controls. |
| AR12 | Clicking the sign or asking about the keepsake opens its offer. This differs from accepting a clearly priced purchase button, which opens the provider confirmation directly. Ordinary free interaction or merely hearing an upsell never launches a purchase. |
| AR13 | Proposed keepsake price: CA$9.99 plus applicable tax, one-time per selected edition. It contains the extensive encyclopedia PDF, actual charts and readings, selected previous answers and a frozen interactive atelier webapp, hosted for at least one year. It is not an audio-file-only product. |
| AR14 | The frozen edition can speak previous answers using Natally's voice and retain chart interactions. New paid sessions continue from retained operational history. Buying a new edition includes the chosen cumulative history without overwriting earlier editions. A chart type appears only when actually calculated. Downloadable PDF/SPA artifacts remain usable after the hosting term. |
| AR15 | Generate artifacts locally, upload through the existing Zight contract, retain item IDs/content URLs in Firebase operational metadata linked to the RevenueCat customer and purchase. RevenueCat owns the purchase/access grant. Do not store the entire artifact as a new Firestore commercial/archive store. WordPress is a future discussion only. |
| AR16 | Marketing reuses the real AtelierScene, character, trinkets, ambience and authored voice. Preserve the existing aesthetic and actual onboarded chart; no fabricated personal chart for an unknown visitor. Signed-out visitors see the room and a create-your-chart action until a real chart is available. Reduced motion, mute, hidden-tab suspension and mobile interaction remain supported. |
| AR17 | Payment states are explicit: quoting, confirming, pending payment, paid/access pending, ready, cancelled, failed and refund/revocation. A confirmed charge with delayed grant must be recoverable without another payment. Resume the preserved conversation/view or requested keepsake when ready. |
| AR18 | Shared RevenueCat ROCHE, single-use attributed "Have a code?" redemption, account continuity, one-hour session-key lifecycle and cross-app updates remain requirements. No new ledger or hosting is introduced. The Play currency restriction below requires an explicit distribution resolution. |
| AR19 | Update terms, privacy, receipts and help for recurring limited credits, cancellation, history/voice replay, artifact hosting and actual tax handling. Keep real Terms and Privacy URLs in active paywalls. Preserve existing customer purchases and historical receipts during migration. |
| AR20 | Deliver via the existing build_all coordinator with platform/version parity, web/PWA and native artifacts. Record the complete real journey on deployed web and the relevant native devices; source inspection/build success do not establish purchase or voice acceptance. |

## Proposed purchase and return state contract

`OfferIntent` carries customer identity, product choice, source (spoken close,
shelf sign, balance top-up, persistent button or explicit link), session ID,
chart/history selection, return view and current draft message. Reading a sign
creates an offer intent, not authorization to buy. Legacy reading links map to
the keepsake offer with its full current description; they do not auto-buy.

| State | Observation / action | Next state and return behavior |
| --- | --- | --- |
| quoting | Fetch native store/RevenueCat product, price, currency, monthly period and ROCHE grant. | Offer ready; unavailable products show retry and preserve atelier. |
| confirming | User presses price-bearing button; native Play or web card UI confirms. | Cancel -> atelier unchanged; error -> retryable offer; pending -> payment pending. |
| payment pending | Play/card payment has not completed. | No grant, no "payment confirmed" claim; resume at next provider/customer refresh. |
| paid/access pending | Provider accepted payment; await RevenueCat purchase and currency/access result. | Show confirmation and "activating" separately; retain recoverable purchase ID; never ask to pay again. |
| ready: credits | RevenueCat ROCHE refresh succeeds; existing session-key routine synchronizes allowance. | Return to same chart/conversation and restore draft. Do not auto-send an unsubmitted message. |
| ready: keepsake | RevenueCat confirms access to this edition; build/upload/link artifact. | Delivery progress; reopen original session; retry upload/build without rebuying. |
| renewal | RevenueCat records a successful monthly renewal and its currency grant. | Refresh ROCHE exactly once for that grant. A failed renewal adds no credits. |
| cancelled subscription | Renewal cancelled, not necessarily refunded. | Stop future renewal; proposed unspent purchased ROCHE persists; show actual provider dates. |
| refund / revoked | RevenueCat applies its currency/access outcome. | Refresh balance and key allowance; do not debit locally a second time. Preserve customer-visible transaction outcome. |
| reinstall / app switch | Authenticate same customer; restore native purchases and refresh RevenueCat. | Restore existing balance/access, not the original grant again; load history references from Firebase. |

Receipt handling, acknowledgement and consumable handling use the RevenueCat
native SDK's supported lifecycle. No second custom receipt validator or payment
database is introduced. A Play subscription is not a consumable purchase to be
consumed at renewal; one-time top-ups are separate consumable products. The
keepsake product is repeatable, with purchase identity linked to each edition.

## Scoped AST / entity change register

This table enumerates the proposed change surface, not the entire project. The
full-project enumeration is a separate mandatory post-sign-off deliverable.
`Existing` means observed source; `proposed` names are planned additions.

| ID | Entity / path | Status and exact role |
| --- | --- | --- |
| E01 | `src/App.tsx:App.handleOnboarded`, `maybeAutoShowOfferJourney` | Modify: remove automatic offers; select atelier after actual chart calculation. Keep explicit purchase intents. |
| E02 | `src/services/sessionProfile.ts`, `presentation.ts` | Modify entry/presentation selection and restoration; do not couple free entry to billing readiness. |
| E03 | `ReadingStage`, `AtelierScene`, `AtelierCharacter`, `AtelierTrinkets`, `AtelierAmbience` | Existing components reused for expanded room and marketing; preserve controls/events and artwork. |
| E04 | `src/components/atelier/AtelierCommerceSigns.tsx` | Proposed component with `RocheBalanceSign` and `KeepsakeSign`; props contain display data and explicit callbacks, not provider credentials. |
| E05 | `src/services/authoredChartExplanations.ts` | Extend `getAuthoredChartExplanation` and `getAuthoredConversationClose` with shared first-name/context variants. |
| E06 | `src/services/authoredAtelierDialogue.ts` | Proposed typed script records, deterministic intent/template selection and repeat suppression; no LLM call. |
| E07 | `SOUL.md`, `src/services/soul.ts` | Extend existing persona/content contract; preserve separate character lore and genuine user disclosures. |
| E08 | `NatallyChatbot`, `natallyChat.ts`, `readings.ts` | Route free authored responses versus paid chats, meter completed paid turns, preserve chart/history context. |
| E09 | `src/services/upsellPolicy.ts` | Proposed `nextInvitation` using completed-turn count, edition content cursor and current intent; free close every answer, paid keepsake invitation every two. |
| E10 | `src/services/voiceService.ts:speakNatallyText` and current TTS engine | Reuse for authored scripts, answers and replay; no new voice service. |
| E11 | `PurchaseAccessProvider`, `PurchaseCTA`, `FigmaPaywall`, their CSS | Replace old branching tour with contextual ROCHE/keepsake offers and explicit purchase states. Restore the saved return intent. |
| E12 | `src/services/purchaseIntent.ts` | Change legacy reading/conversation aliases into explicit credit/keepsake intent with cadence/return context; migration preserves existing links. |
| E13 | `src/services/checkoutPlatform.ts` | Proposed common contract `listOffers`, `purchase`, `restore`, `manageSubscription`; route by actual runtime/distribution, not user-agent substring. |
| E14 | `src/services/revenueCatCheckout.ts` | Existing web adapter, RevenueCat Billing with Stripe card. Extend product/cadence mapping and outcomes. |
| E15 | `src/services/nativeRevenueCat.ts` | Proposed TypeScript adapter invoking the declared Tauri Android plugin; same RevenueCat App User ID as web. |
| E16 | `src-tauri/tauri-plugin-natally-purchases/` | Proposed local mobile plugin: Rust registration/API plus Android Kotlin commands/listeners for configure/identify, offerings, purchase, restore, customer and virtual-currency updates. Enumerate every file/symbol before coding. |
| E17 | `src-tauri/Cargo.toml`, `src-tauri/src/lib.rs`, Android plugin Gradle manifest | Register the plugin and official RevenueCat Android SDK dependency (with its Play Billing integration); compatible pinned versions belong to approved build inputs. No guessed version in architecture. |
| E18 | RevenueCat Android app, Play service credentials/notifications, product/base-plan/offer IDs | Existing provider integration to finish/configure. Native account association and Play notification flow are part of the architecture, not a web fallback. |
| E19 | RevenueCat customer, ROCHE currency, offerings, subscriptions, transactions, edition access | Sole commercial authority. Configure monthly grants/top-ups; no NATALTURN replacement wallet. Retain old purchase history. |
| E20 | `src/services/rocheBalance.ts` | Proposed observable adapter over RevenueCat data: confirmed balance/version/time, in-flight estimate, refresh on usage, purchase, foreground and cross-app events. No persisted spendable balance. |
| E21 | `billing/customer-session.mjs`, existing session adapter contract and `billingAccess.ts` | Finish existing one-hour key routine and authorization; update limit on confirmed ROCHE changes. Do not redesign provider ownership. |
| E22 | Existing inference usage adapter plus proposed `RocheUsage` contract | Billed prompt/completion usage IDs -> one idempotent RevenueCat debit -> refresh. Concurrent sessions use existing serialized customer operations; no invented second ledger. |
| E23 | Firebase auth, `onboarding.ts`, account history/storage services | Identity/intake/conversation operational records linked to RC customer; session history and immutable edition references. |
| E24 | `souvenir.ts`, `SouvenirViewer`, `ExportModal`, retained audio, existing PDF generator | Align artifact flow to the Zight contract; versioned cumulative editions with original chart/time, interactive SPA and on-demand narration. Existing Firestore payload design is not adopted as authority. |
| E25 | Zight upload contract and Firebase edition-reference schema | Existing destination. Declare exact publishing adapter binding before code; store links and operational progress only, not a competing commercial record. |
| E26 | `marketing.html`, `src/marketing.tsx`, marketing CSS | Add shared hero atelier mount and correct product copy; actual personal chart only when available. |
| E27 | Terms/privacy HTML, help, README and Admin-Manual/KStore references | Revise actual commerce disclosures, legal URLs and documentation after approved product changes. |
| E28 | Existing build_all scripts, platform manifests, release evidence | Preserve build authority and version parity; no new build/publisher program. |

The PUML depicts containment/calls/contracts for these named nodes. Dashed edges
are proposed wiring. Its proposed Rust/Kotlin plugin is an explicit addition to
the client for the required Play integration, not a new hosting service. Native
plugin command/error/event types must be fully expanded in the canonical entity
table before any implementation. PUML is portable structured source; execution
or import in BrAIInstormer has not been claimed or investigated.

## Decisions presented for sign-off

| ID | Proposed choice / unresolved fact | Why it must be explicit |
| --- | --- | --- |
| D01 | CA$10/month default; CA$5 normal top-up; no routine CA$1 card purchase with the fixed Tax API fee. Keep one feature tier. | Amounts were requested for cost comparison, not yet selected as live SKUs. See pricing worksheet. |
| D02 | At least 40% of actual discounted price excluding customer tax, before fees, allocated to inference. | Defines the numerator and avoids quietly making 40% mean net-after-fees. |
| D03 | One ROCHE = one provider-billed model token for a declared supported model/rate schedule, including billed input/output and any billed reasoning tokens, not one visible word. | Models, cached input, output and currency conversion have different costs. Exact monthly quantities and USD spend conversion must be derived from the existing approved model/rate policy; do not invent a number. A worst-case per-token budget must cover all allowed usage, or an explicit model-weighting change needs approval. |
| D04 | Unspent purchased ROCHE rolls over after renewal/cancellation; no new expiry policy. Keepsake is an add-on for already-produced content, with no new ten-turn grant by default. | The latter supersedes the former ten-turn bundle only if approved; the new request could otherwise be read as retaining that grant. |
| D05 | One complete keepsake edition at CA$9.99 + applicable tax, including broad encyclopedia chapters and selected cumulative sessions; at least one year of access from that edition's successful fulfillment, extending access for a newer edition without shortening older access. | Resolves $9.99 versus the illustrative $10 sign. Additional PDF completeness levels need a separate explicit deliverable/price matrix; none are silently invented. |
| D06 | Play is mandatory. Preserve shared RC ROCHE, but resolve the scope of Play-purchased credits against Google's app-title restriction before activating those grants. | Google forbids spending Play-purchased virtual currency outside the app/game title. Natally on multiple platforms is distinct from unrelated apps. Do not silently split the wallet, drop cross-app support, or claim that policy is already resolved. |
| D07 | Use existing RevenueCat Billing + Stripe Payments; retain existing Zight destination. Confirm operator GST/HST registration and how ROCHE is classified for tax. | Registration and prepaid-service versus qualifying gift-certificate treatment affect when tax is charged. WordPress migration is not included. |

D03 and D06 are bounded design decisions, not permission to alter unrelated
systems. The remainder of the proposal is complete for review while these facts
remain explicit. No privileged provider API key is added to a client bundle;
reuse the existing approved management-operation boundary and enumerate its
binding during canonical architecture reconciliation, without inventing a host.

## After sign-off: canonical architecture then independent recipes

1. Preserve the previous ARCHITECTURE.md byte-for-byte with a semantic timestamped
   backup and record its hash/commit. Read existing staged changes and reconcile
   them deliberately; do not discard them.
2. Merge only signed-off decisions into `DOCS/ARCHITECTURE.md`. Build the exhaustive
   whole-project entity table from the current CodeGraph/AST plus schemas,
   configuration, assets, providers, endpoints, build/package/deployment entities
   and generated boundaries. Group logically; assign stable IDs; distinguish
   existing compliant, existing divergent, changed, added, retired and external.
   Referenced integration documents must resolve to enumerated entities too.
3. Each entity row must name path/symbol or provider identity, responsibility,
   owner/authority, inputs, outputs, callers/callees, persistence, lifecycle,
   platform scope, requirement IDs and evidence. No "miscellaneous" bucket may
   hide executable entities. Every proposed helper/plugin command/field is
   enumerated before it can appear in code. Existing AST is evidence, not a way
   to authorize deviations. Preserve unresolved deviations as explicit findings.
4. Re-render PUML from the reconciled contract and keep narrative, table and
   diagrams consistent. No unapproved version stamp, provider or storage change
   enters the contract because it happens to exist in source.
5. Then append the approved delta as four-state `CHECKLIST.md` task recipes,
   using the authoritative Admin-Manual vocabulary retrieved at that step.
   This proposal does not claim to have converted the checklist yet. A lookup
   for `TOOLING_CONVENTIONS/conversation-task-list.md` returned 404; do not invent
   the global task-state syntax to conceal that. The rev-3 continuous-demonstration
   convention above was retrieved successfully and governs acceptance design.
6. Each cold-start recipe carries: stable task/requirement/entity IDs; exact
   approved input snapshots and source paths; narrowly owned files; prerequisites
   and data contracts supplied in full; ordered transformations; concrete output
   and failure behavior; prescribed build command; rollback/checkpoint reference;
   demonstration scenes/rubric; evidence location; current state and reason.
   No "as discussed", hidden dependency, unspecified helper or assumption of
   another agent's context. True runtime prerequisites are named with completed
   inputs; independence does not mean pretending dependencies do not exist.

Proposed recipe groups: T01 entry/presentation (AR01); T02 authored persona/voice
(AR02-03); T03 paid dialogue and usage (AR04, AR09-10, AR18); T04 room signs
(AR09, AR11-12); T05 contextual offer and return states (AR05-06, AR12, AR17);
T06 native Play integration (AR07, AR17-18); T07 web subscription/catalog migration
(AR05-08, AR17-19); T08 cumulative keepsake and Zight fulfillment (AR13-15);
T09 marketing parity (AR16); T10 disclosures and provider lifecycle recovery
(AR17-19); T11 integrated delivery and demonstration (AR01-20). These are recipe
boundaries for discussion, not dispatched coding tasks.

## Continuous demonstration design for the later checklist

The final script must expand these scenes into exact account/data/device inputs
and timecoded observations before implementation. All scene evidence is currently
NOT RECORDED. Carry the same account/history forward; record device transitions.

| Scene | Required real observation | Requirements |
| --- | --- | --- |
| S01 | Deployed marketing: animated real room, trinket/cookie interactions, voice/mute/reduced motion; no personal chart invented before intake. | AR03, AR11, AR16 |
| S02 | Create/sign in, onboard actual birth data, enter atelier immediately, expand/restore, rotate and select actual chart; no offer interjection. | AR01, AR11 |
| S03 | Free first-name lessons for planets/signs/houses/aspects, unsupported typed query, repeated selections, Natally-isms, invitation each response; text/audio agree and no conversational inference call. | AR02-03, AR10 |
| S04 | Shelf sign and typed keepsake inquiry show the right offer; dismiss returns unchanged. Balance button shows finite monthly pack, taxes and Have a code. | AR05-06, AR09, AR11-12, AR18-19 |
| S05 | Android Play sheet with monthly plan, cancel, retry, pending payment, real completed purchase, confirmed RC grant and ready return to same conversation. | AR05, AR07, AR17 |
| S06 | Paid chart, horoscope and actual synastry conversation, visible spending and settled RC amount, two-turn keepsake close, draft preserved across checkout. | AR04, AR09-10, AR17-18 |
| S07 | Buy keepsake, generated encyclopedia PDF and interactive SPA, actual Zight delivery links; interrupt upload then resume without repurchase; speak prior answers. | AR12-15, AR17 |
| S08 | Later session/new paid question, earlier context available, purchase another cumulative edition; old edition unchanged and hosting dates correct. | AR10, AR13-15 |
| S09 | Restore after Android reinstall; same account on Windows; native login, card default, existing authorized alternative method, single-use code/gift redemption and retry attribution. | AR07-08, AR17-18 |
| S10 | Actual provider renewal/cancel/refund events and allowance updates; depleted credits, cross-app change under approved scope, one-hour expiry, logout and reconnect; no double grant/debit. | AR05, AR09, AR17-18 |
| S11 | Responsive 360/393/412 CSS-pixel Android widths, short landscape, tablet and desktop; keyboard/touch labels, text scaling, no clipping; offline authored content and downloaded keepsake still usable, paid calls show connection requirement. | AR01-20 |
| S12 | Coordinated deployed web/PWA/native artifacts, version/source provenance, legal links, all requirement -> task -> scene -> timecode mappings and actual outstanding observations. | AR19-20 |

Source, build, remote publication, provider acceptance, native-device observation,
voice listening and final deployment remain distinct evidence claims. A fixture
or static screenshot cannot stand in for the continuous working experience.
