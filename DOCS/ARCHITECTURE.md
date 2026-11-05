# Natally v1.30 — frozen implementation architecture

Round: 31 October 2026. Baseline: 6c207843a65123a6d0038ef33d7eac9e3faa1b42.
The first publication is superseded by the operator's subsequent grant-semantics
corrections before any coder starts. Freeze begins at publication of the corrected
architecture commit. No architecture edits
are permitted until coding for this round completes. The operator groups these
repairs into one round with parallel coders. Earlier conflicting specifications
are historical: DOCS/ARCHIVE/architecture-before-v1.30.md.

## Complete product boundary

Preserve the existing React/TypeScript application and marketing entry, Firebase
authentication and named Firestore, Swiss Ephemeris calculations, Three.js chart
and atelier, authored education, OpenRouter inference, Supertonic ONNX voice,
account history/SOUL, saved readings, RevenueCat purchase evidence, and Tauri
Windows/Android/Linux shells. Preserve onboarding, chart mathematics, room
interactions, layout, configured voice, personal keys, retained reading playback,
account isolation and legitimate purchase ownership.

architecture-v1.30-baseline-inventory.json enumerates and hashes all 334 inherited
tracked production source/configuration/asset files. The archived architecture
retains their entity inventory and existing subsystem behavior. The contracts
below supersede conflicting billing, speech and release behavior only.

| Subsystem | Implementation boundary |
| --- | --- |
| App/auth/onboarding/accounts | App/main, src/auth, onboarding components, Firebase/profile/account/history services |
| Marketing/room/education | marketing.html, marketing.tsx/styles, atelier components, authored education/nudges |
| Astrology/presentation | Astrolabe/selection/reading components, ephemeris/gazetteer/transit/target/presentation services, vendored Swiss runtime |
| Conversation/saved readings | NatallyChatbot, hostedInference/natallyChat/comprehensiveReading/openingReading/inferenceTurn, souvenir/readings/history/audio |
| Speech/character | voiceService, streamingSpeech, Supertonic worker/TTS/download, soul, authoredNudges, RetainedReadingAudio, sprite/character |
| Commerce/access | PurchaseAccess, AccountBillingDialog, AccountCreditsEntry, checkoutCatalog/revenueCatCheckout/billingAccess/inferenceAccess, billing/ |
| Historical adapters | server.ts, server/inference, netlify: preserve unrelated behavior; do not revive Netlify billing deployment |
| Native/release/assets | src-tauri, public, standardized assets, canonical environment/build/release/deployment scripts |

## R1 — redemption first

The FULL annotated .env.example and effective annotated .env default to:
BILLING_REDEMPTION_CODE="Ch4n3l.C3351"
BILLING_REDEMPTION_ALLOWANCE_USD="10.00"

The code includes a lowercase l before the dot. The operator explicitly corrects
this installation's old misspelling. Preserve unrelated settings/comments/local
overrides and exact pre-edit checkpoints. The live handler consumes those settings.
There is NO campaign: no campaign setting, ID, UI or analytics property is required.
The obsolete million-credit setting must not gate redemption. These defaults
apply only to this permanent, reusable code. The runtime reads the configured
allowance; the operator may change it at any time. Business code must not hardcode
USD10. This specific permanent code grants a real key with the configured spend limit.
Do not add an account-wide restriction or invent another default-code policy.
The general redemption-code table and arbitrary actions remain outside this
repair's scope; they require their own operator instruction and architecture
round before any coder implements them, and this repair must not constrain
that design. (R12-era editorial reconciliation 2026-11-01: the original
deferred-scope phrasing was reworded to satisfy the stub-free rule with no
semantic change.)

Authenticated POST /billing/redeem {code,requestId} compares exact configured content after
outer whitespace trim. Parse USD exactly to integer micros: default 10,000,000.
Idempotency belongs to each grant request, never to an account-wide redemption
limit. Persist the exact request identity and configured action atomically with
its actual grant/key operation. Retrying the same request recovers the same
result; a new valid request can grant again. Do not implement a general redemption-code table in this repair. Future codes
may be single-use or multiple-use and may perform arbitrary configured actions.
Do not impose blanket restrictions on setting/restoring/replenishing balances. Invalid code mutates nothing. Return
the durable receipt and actual managed access. Recover provider work after a grant
is committed; configuration alone is not completed redemption.

## R2 — presets, custom amounts and purchase evidence

Active presets USD5/USD10/USD25; default USD5. USD1 is deprecated and MUST NOT
be reintroduced. Allow a typed custom USD amount strictly greater than USD5,
with cents precision and matching client/server validation. Show actual amount,
currency, cadence, applicable tax and total before payment. Preserve monthly-first
selection where real configured monthly products exist and actual one-time choices.

RevenueCat is commercial evidence; Firebase UID is customer identity. Repair the
real existing RevenueCat Billing catalog/bindings and preserve its SDK flow.
Custom one-time amounts use supported Stripe Checkout and real fixed Prices for
exact integer cents, not custom_unit_amount or invented SDK Package objects.
Use the existing merchant account connected to the same RevenueCat project.

POST /billing/checkout {amountUsd,requestId} creates/reuses actual exact Price/
product using durable bindings and provider idempotency. Session metadata binds
UID/Price/request. Collect billing address and create paid invoices. Verify actual
Canadian tax registration before enabling tax calculation. Return actual Checkout
URL. Signed webhook and authenticated return verify live paid session ownership,
expected amount and Price. Import its Checkout Session ID via RevenueCat
POST /v1/receipts, X-Platform:stripe, actual Stripe-app public key; verify purchase
evidence before granting. Do not infer success from a redirect or callback.

## R3 — durable allowance, inference costs and HST

Use existing named Firestore, natallyCreditAccounts/natallyCreditGrants; no second
wallet. Explicit monetary schema contains integer USD grants, immutable source
receipts, reversals, usage checkpoints, encrypted key state and operation intent.
No invented token conversion. Approximate tokens are not dollars or turns.
Display actual USD reading allowance and actual reported token counts if available.
Errors/missing state are not fabricated zero; obsolete ROCHE does not gate access.

For verified payments, allowance=floor(tax-exclusive eligible USD micros*4000/10000).
Snapshot actual original currency, paid subtotal/taxes/total, store transaction,
product/date/policy/evidence. Use real provider USD settlement for non-USD history,
never guessed FX. Recover the operator's actual unfulfilled Natally purchases
exactly once. Deduplicate by store payment identity, not product; invoices,
callbacks, restore and webhooks must not double-grant the same charge.

Refunds append deterministic reversals, retain original receipts and signed debt,
and lower usable capacity. Actual collected HST is a separate payable by currency,
never inference budget. RevenueCat estimated analytical tax is not HST evidence.
Account available=max(0, grants-reversals-provider costs). Monotonic per-key usage
checkpoints debit only new actual provider cost deltas atomically. Existing key
absolute limit=its cumulative usage+remaining account allowance. Renewal funds only
remaining allowance, after disabling/verifying old key and recording usage; retain
retired hashes to reconcile late costs. Automatic reload/expiry alone does not
create a grant. An authorized redemption can explicitly override, restore or
replenish balances according to its configured action. Record adjustments and
before/after balances durably so a retried request cannot apply twice.

Migrate old balances only from actual grant receipts and provider usage, not
approximate creditBalance. Unreconstructable money retains its evidence for repair,
not a silent reset or invented balance.

## R4 — managed keys and recovery

Firestore CAS and durable customer operation/lease serialize mutations. Persist
intent before external writes and real outcomes afterward; lease expiry does not
authorize repeating unresolved operations. OpenRouter keys start at zero, retain
one-hour expiry, and are funded only after durable custody and accounting.
Use declared BILLING_KEY_ENCRYPTION_KEY with AES-256-GCM, UID/hash/version AAD.
If genuinely absent generate a real encryption key once and store annotated in
KStore with exact readback; never put it in repository or plaintext env.

Read back known-hash PATCH operations. Reconcile uncertain creation using stable
operation name and actual paginated provider keys; unfunded orphans never become
funded duplicates. Ready requires verified identity, expiry, enabled state and
available capacity. Logout disables only owned matching generation and clears
local access; account changes discard stale data. Reconcile grants even while
an existing key is installed; preserve deliberate personal-key use.

## R5 — deployed runtime and client contract

Portable billing/runtime.mjs and billing/server.mjs run on Google Cloud Run in
rochemediaservices-infra/us-central1. Existing Google login deploys; managed runtime
identity accesses unchanged Natally Firebase identity/named database. Firebase
server auth supports refreshed managed metadata OAuth and valid explicit service
accounts. Verify Firebase JWT signature/issuer/audience/subject/expiry; never accept
body UID as authentication.

Endpoints: GET /billing/access, POST /billing/reconcile, POST /billing/redeem,
POST /billing/checkout, GET /billing/history, GET /billing/invoices/:id,
GET /billing/invoices/:id/file, POST /billing/logout, authenticated RevenueCat
/billing/webhook and raw-body signature-verified /billing/stripe-webhook.
Allow actual approved web/native origins; customer responses are private.

Access envelope: accountUid, short response expiresAt, explicit state, source/
provider, monetary balance, durable redemption receipt if present. Ready managed
access also carries actual apiKey/hash/keyGeneration/accessExpiresAt/limitUsd/
usageUsd. Client guards stale account/generation results. Purchase completion
installs funded access, gives confirmation and provides history/invoice access.

## R6 — history, official receipts and invoices

Account & billing exposes Purchase history. Show repeated transactions individually
with actual date, description, amount/currency, status and invoice action.
Restore reads every provider page and repairs missing grants exactly once.
Documents remain accessible after allowance is spent.

Actual paid invoices/receipts contain Roche Media Services, HST826393555RT0001,
88 CORPORATE DR., TORONTO, ON M1H 3G6; unique invoice number/date; purchaser
details; description; actual currency/subtotal/tax name/rate/amount/total; payment
date/terms/status. Use verified Stripe/RevenueCat invoice/payment/tax facts, not
Ontario tax applied worldwide or unknown tax changed to zero. Configure provider
seller/receipt fields. Provide original PDF and printable official invoice from
complete actual facts. Record HST payable separately; do not claim a bank transfer.

## R7 — speech and lore

Preserve Supertonic ONNX and current voice. Shared speech ownership covers
preparation/synthesis/playback/chunk gaps/waiting voice/retained playback. Streamed
reading retains engagement while waiting for more text. Stale completion/abort
cannot release or stop a newer owner. Busy idle admission returns false before
stopping anything or synthesizing: NO idle queue. Explicit user replay/selection
may supersede, stopping old playback first.

Main/marketing timers check shared busy plus existing draft/input/inference/
visibility/account guards before story selection, after async resolution and at
final admission. Intervening activity discards the attempt and restarts quiet
timing. Retained legacy sprite idle paths obey the same rule.

Only admitted stories append. Deduplicate editable lore by authored ID or exact
content normalized for whitespace, preserving earliest identity/timestamp and all
distinct stories/user conversations. Repeated story reuses the entry. Deduplicate
SOUL by normalized content as well as ID. Preserve immutable souvenir snapshots.

## R8 — configuration, release and demonstrations

Use full annotated environment synchronization, original checkpoints, preserved
overrides and fresh process-only KStore pointer resolution. Public examples have
schema/defaults but no KStore references. Project only approved public bindings.
Deploy actual billing runtime and verify its URL before freezing release inputs.

Canonical coordinator advances existing1.29 automatically to1.30 and builds all12
targets. Include billing/runtime/deployment sources in its fingerprint. Required:
Windows standalone/NSIS/MSI; Android APK/AAB/matching symbols; Linux AppImage/DEB/
RPM; web ZIP/installer/PWA. Android release uses shared production upload key from
CREDENTIALS/prefetch-android-signing.md, never debug fallback. Verify APK and AAB
certificate SHA256=56C13674EF22DF95DEB1E5C468820E8CFA3EA2F522511749AB7B6E5BDE3BD943.
Recover the same frozen invocation without stamping1.31. Deploy matching completed
artifacts via coordinator to natally.robin.mba and natally.surge.sh; verify bytes.

Publish architecture, then independent four-state checklist/preauthored real
demonstration rubric, then parallel code. Supervisor semantically compares each
assignment and returns defects to same coder. Review all session code against this
document and record truthful README attestation. Continuous real recording covers
redemption/retry/inference/cost, previous-purchase recovery/invoice, preset/custom
checkout/confirmation, busy speech/idle suppression/lore reload, and release proof.
No fake customer/payment/result or substitution of source checks for live proof.

Canonical exact readbacks: production rev2
61b3ed908e404fae1b7b7e149195744cfe9bf5464b70d266eb1364a9d655ad7f;
delivery rev1 ec7a2496a40827acc83f57295ac9044dce9871c52869bb7dcd022aebe6e6c962;
environment rev2 6daa3b2cc4af84e64c11371e24ab8a0850c2fec417f2632655d9a89510a87d00.
API bases: RevenueCat external Stripe purchases/invoice APIs, Stripe Checkout/Tax/
paid invoices, OpenRouter Keys, CRA RC4022 invoice requirements.

## Architecture attestation

I checked this specification against current operator instructions, inspected
implementation, production inventory and provider documentation. It defines the
complete intended product boundary and requested changes for this round. Coding
must realize only these contracts while preserving inherited behavior. This
certifies the reviewed target specification; it does not falsely certify that
unfinished existing code already realizes it. Certification of complete/correct
1:1 delivered code belongs in README after semantic review and real execution
evidence. No live completion is asserted by this architecture.

## R9 — Compact balance and direct purchase correction, 31 October 2026

The preceding code round is complete. This operator-requested correction is a
separate automatically numbered release; published v1.30 artifacts remain frozen.
This section is frozen before its coding begins.

1. The customer balance uses the exact suffix `Cr`, never a dollar currency symbol
   or a spelled-out credits caption in the top line. The operator's example is
   `400 Cr` for the internal USD4 allowance. An annotated public display setting
   `VITE_CREDIT_DISPLAY_PER_USD=100` provides that denomination. This is display
   denomination only: account money, actual inference costs, payment totals, HST,
   the40% allocation and configured redemption spend limit remain unchanged.
2. All balance surfaces share the formatter, with at most two fractional Cr
   digits. Invalid display configuration must not invent a balance. Purchase
   prices and official invoices retain their actual currency facts.
3. The top line has consistent control typography, baseline/vertical alignment,
   spacing and button heights. Use one control font size and family across the
   row; emphasis comes from weight, not an assortment of sizes. The balance is a
   compact one-line `400 Cr` control. Remove its redundant caption. Preserve every
   existing account, navigation, menu, sound and purchase action. Groups must wrap
   deliberately on narrow screens without horizontal overflow or overlap.
4. Each USD5/10/25 preset is an immediate explicit purchase action. One tap calls
   the existing authenticated checkout endpoint for that exact amount and opens
   the returned hosted checkout. Do not merely select a preset and require a
   second button. Custom amount entry remains strictly greater than USD5 with up
   to two decimal places and a clearly labelled submit action. Preserve stable
   retry identities, busy/owner guards, expired/completed recovery and real server
   confirmation; never start another charge from an ambiguous response.
5. Use CodeGraph for implementation questions and source context. Supervision
   compares the produced code only to these assignments. Publish the review
   attestation before invoking the automatic version/build coordinator. Inspect
   the actual deployed top line at desktop and narrow widths in vivo before
   closing this correction. No unrelated signage or backend redesign is included.

R9 attestation: these five points capture the complete requested correction:
compact Cr denomination, balanced top-line typography/layout and direct preset
checkout. Its code may implement only these requirements while preserving the
existing production behavior described above.

## R10 — Correct the existing purchase assignment and customer language

R9 coding is complete. Before further coding, the operator corrected the payment
interpretation: RevenueCat remains the established customer/purchase authority;
Natally handles its own HST accounting. A Stripe Tax registration or automatic-tax
service is NOT a prerequisite. Earlier requirements introducing that prerequisite
are superseded here because they misinterpreted the operator's assignment.

1. Reuse the existing authenticated RevenueCat package/SDK checkout for configured
   USD5/10/25 purchases. One explicit preset tap starts the actual corresponding
   purchase. Ownership, cancellation, pending payment and transaction identities
   remain authoritative. Never substitute the deprecated USD1 product.
2. Custom values above USD5 must use a real product at the exact requested price.
   The SDK has no amount override. Use the officially supported RevenueCat store
   plan/apply catalog interface to create/read back an immutable per-amount product
   and real package, with durable project-level serialization and idempotency.
   Existing RevenueCat administrative authorization is resolved from canonical
   credential references. No invented package price or metadata-based fake charge.
3. Verify purchases against RevenueCat's server records and authenticated purchase
   events. Use actual paid amount/currency and transaction identity, not a listed
   price assumed to equal a discounted payment. Fulfill each transaction once,
   account for provider consumption, and keep the configured40% allocation.
4. Apply Natally's annotated manual GST/HST policy to actual transaction and buyer
   facts, reserve collected tax separately, and issue the required official
   receipt/invoice with the supplied registration and business address. Do not
   invoke Stripe Tax, fabricate tax facts, or describe analytical estimates as
   actual collected tax. Retain original payment evidence with the calculation.
5. Customer screens show Balance, Cr, purchases, receipts and meaningful actions.
   Remove reading access, installed keys, managed credentials, provider names,
   provisioning and internal account-control explanations from visible wording.
   Show a concise Balance heading above the actual Cr amount. Remove the long
   paragraphs in the reported account panel. Preserve automatic fulfillment and
   restore behavior; do not ask customers to manage technical connections.
6. A checkout-start failure says the purchase could not start; it must not claim
   a purchase already happened or tell the customer that another purchase is not
   needed. Reserve paid/pending-payment wording for actual authoritative facts.
7. Complete the source comparison and publish its attestation before the next
   automatic web build. Deploy for the operator's real purchase attempt and report
   readiness accurately. Native builds remain held until web purchasing works.

R10 attestation: this is the corrected recipe boundary for the already assigned
purchase flow and the newly reiterated customer wording. It adds no alternative
payment authority or external tax service and does not authorize fake payment,
balance, invoice or fulfillment evidence.

## Operator clarification: balance authority and tax presentation

Recorded before the corresponding correction is coded. RevenueCat is the sole
customer Cr balance and transaction authority, using the existing literal ROCHE
currency. The browser reads that balance. The denomination remains 100 Cr per USD
of inference allowance, with matching server configuration. Currency adjustments
use RevenueCat's idempotent integer transaction interface.

Operational leases, receipt/tax facts, encrypted provider-key custody and actual
usage checkpoints may remain in Natally's backend, without a competing customer
balance. Usage debits RevenueCat once with stable identities; fractional units
carry forward without repeated rounding. Provider allowance derives from the
authoritative balance minus unposted usage. The environment-defined permanent
redemption sets available allowance to the configured USD target idempotently,
without a one-per-account rule. Existing local snapshots remain provenance, not
automatic new grants or repeated charges for historical usage.

The selected purchase amount is before applicable tax. Natally adds manually
calculated GST/HST from actual buyer jurisdiction, shows base/tax/total and uses a
real product at that exact total. The 40% allocation uses the verified amount
before tax. Ontario USD10 base means USD1.30 HST, USD11.30 total and USD4/400 Cr
allowance. Catalog identity distinguishes base and tax policy where equal totals
could yield different grants. No local SDK price override.

The operator approved the existing hosted callback while requiring concurrent
domain/hosting due diligence. Cloud Run is a hosting choice, not a RevenueCat
requirement. Customer balance authority remains RevenueCat regardless of host.
This clarification adds no analytics, brAInstormer or signage coding to this round.

Clarification attestation: this completely specifies the operator's balance and
tax correction for its coder assignment, without claiming unfinished delivery.

## R11 — Restore customer value and unobscured inset explanations

31 October 2026. The operator explicitly requested this work while performing
the deployed purchase attempt, and requires architecture first, then assigned
subagent coding. This amendment is frozen before that coding starts. The two
independent assignments below restore customer explanations removed or suppressed
by earlier changes; existing purchase and chart interactions are preserved.

### INSET-CALLOUTS

1. A customer can mouse over a planet, sign, house or aspect in the inset natal
   chart and receive the existing real chart object's name and explanation.
   Becoming an inset must not disable that hover explanation. Clicking/tapping
   to bring the inset into focus, chart rotation, zoom and selection retain their
   existing behavior.
2. The full visible inset pane, including its border, is an exclusion rectangle.
   The entire callout card must be outside it with visible separation. Moving a
   tooltip a few pixels away from the mouse while it still covers the chart does
   not satisfy this requirement. Existing endpoint label cards must also remain
   off the inset chart; their foreground-chart behavior is preserved.
3. The shared Astrolabe3D renderer owns the hover callout. ReadingStage and the
   marketing chart pane identify the actual exclusion boundary, so the same rule
   covers the app, the landing inset and the existing souvenir ReadingStage.
   Rendering is in a viewport overlay outside transformed/clipped pane ancestors;
   text keeps its readable screen-pixel size. Each renderer owns its own overlay
   and cleanup rather than sharing another chart's mutable tooltip.
4. Placement measures the current pane and actual callout in viewport coordinates.
   It chooses a fitting side, then above/below where appropriate; wraps within
   the available viewport band and maintains an8px viewport margin and at least
   12px clearance from the pane (covering the existing outer border). Dragging,
   scrolling, resize, zoom and inset/foreground transitions refresh placement or
   dismiss stale content. There is no fallback over the chart: if no readable
   outside rectangle exists, dismiss until one is available. Never show stale
   content from an earlier chart, hidden page, obscured canvas or unmounted owner.
5. Hovering highlights the existing actual target without changing selection or
   starting narration. Leaving the target, dragging or opening an obscuring
   dialog dismisses its callout. Keep the existing warm, restrained callout style
   and reduced-motion behavior. No new inference call, data or invented chart.

### ACCOUNT-VALUE

1. Account & billing first explains the customer benefit, ahead of balance and
   purchase controls. It serves someone deciding whether Natally is useful;
   payment mechanics follow that explanation. Keep normal account identity and
   the existing close control. Use the same value explanation in the separate
   balance/purchase settings entry, without repeating it within one surface.
2. Exact customer copy:

   **Explore what your chart means for you**

   "Get a personal reading from Natally, then ask follow-up questions about the
   placements, patterns and relationships that matter to you."

   "Cr pays for your personal readings and conversations. Your balance is used
   as Natally creates a reading or reply; longer replies can use more Cr."

   "Choose an amount when you’re ready, then return to your reading."

   These sentences explain purpose, purchased value and how that value is used.
   Keep them readable, concise and visually subordinate to the benefit heading,
   with the existing purchase actions following in the same dialog.
3. Balance remains a compact amount suffixed Cr. The customer is not asked to
   understand provider names, keys, provisioning, inference spend allocation or
   access-control internals. Do not add a fixed question count, fabricated
   savings, guarantees, unimplemented benefits or a claim that a souvenir is
   included. Purchase prices, tax, invoices and one-tap actions retain their real
   existing behavior. Payment requests must not stand alone without this value
   explanation.
4. One shared customer-value component supplies both entry points so later copy
   changes cannot silently remove the explanation from one. This is a content
   and hierarchy correction; it changes no purchase, redemption, tax, balance or
   provider behavior while the operator performs the purchase attempt.

### Delivery and attestation

Publish this architecture and its independent CHECKLIST recipes and demonstration
rubric before assigning the two coders. Each coder changes only its named scope.
The supervisor compares its result semantically against these requirements,
returns deviations to that same coder, and publishes the source attestation
before the canonical automatic web build. The operator's current purchase attempt
continues independently. Native builds retain the existing hold.

R11 architecture attestation: I checked this amendment against the operator's
current requests and the existing renderer, inset boundaries and account entry
points. It completely specifies these two corrections and their preserved
behavior; its assigned code must realize these requirements one to one. This
certifies the specification, not unfinished implementation or live observation.

## R12 — Landing atelier/inset replica, branched chart education, unified entry

1 November 2026. Operator instructions received 2026-11-01 against deployed
release 1.32.90532 (source lineage e7732b6a): the landing sticky hero lost its
inset natal-chart card entirely for anonymous visitors; the hero must be a
working replica of the logged-in atelier main+inset pair, identical in
operation, differing only in that the landing chart is a clearly labeled
anonymous example until the visitor's own chart exists. The operator further
ruled: two-path inset activation; prefab-only education for anonymous, unpaid
and credit-depleted users; hosted-API personalized extension with Supertonic
TTS when credits are available; a post-prefab upsell close with two variants;
vivid-frame focus dimming; the landing subsumed into index.html with an
explicit forced-landing URL; all entry and identity configuration per-build
environment settings (AGPL anti-impersonation). Process ruling: this
architecture freezes before CHECKLIST.md is created; CHECKLIST freezes before
coder dispatch; each stage holds for operator signoff; coder tasks are fully
self-contained and parallelizable; the same coder corrects deficiencies; no
phase mixing. This amendment is frozen before its coding begins.

### R12.1 Entry contract (closed)

| URL | Anonymous | Authenticated session |
| --- | --- | --- |
| `/` , `/index.html` | landing (example-chart hero) | app (atelier) |
| `/landing` and alias `/landing.html` | always landing (forced landing) | same |
| `/app.html`, `?app=1`, `?offer=reading\|conversation`, Tauri native | always app | same |
| `/marketing.html` (legacy) | client redirect to `/landing`, query+hash preserved | same |

Environment keys (closed set of six; annotated schema and defaults added to
`.env.example`; the effective `.env` gains only these new keys at these
defaults, every existing value untouched):

| Key | Default |
| --- | --- |
| VITE_LANDING_PATH | /landing |
| VITE_LANDING_PATH_ALIAS | /landing.html |
| VITE_APP_PATH | /app.html |
| VITE_LEGACY_PATH_REDIRECTS | /marketing.html:/landing |
| VITE_APP_NAME | Natally |
| VITE_APP_NAMESPACE | natally |

Client code reads these through `import.meta.env`; node build scripts resolve
the same keys from the build environment with a `.env` fallback, defaults
identical to the table. No routing or identity literal may remain hardcoded
where one of these keys governs it. Sign-in at the bare domain transitions the
document into the app; sign-in at `/landing` stays on the landing. While
authentication is unresolved at the bare domain, the landing renders.

### R12.2 MARKETING-REPLICA (files: `src/marketing.tsx`, `src/marketing.css`)

1. New frozen entity `EXAMPLE_CHART_INPUT: NatalChartInput` in
   `src/marketing.tsx` — exact values: name `'Aurelia (example)'`, birthDate
   `'1997-11-08'`, birthTime `'19:05'`, placeName `'Toronto, ON, Canada'`,
   latitude 43.6532, longitude -79.3832, timezoneOffset -5, houseSystem 'W'.
   New frozen entity `loadExampleChart(): Promise<NatalChartResult>` computes
   it once per visitor session through the existing local
   `calculateNatalChart` (vendored Swiss Ephemeris WASM; no network, no auth,
   no inference).
2. New frozen derivation `displayedChart = ownedChart ?? exampleChart` replaces
   every `ownedChart` render gate: the chart pane `hidden` attribute
   (marketing.tsx:512), the `Astrolabe3D` mount (:514), the inset drag handle
   (:520) and the placement selector (:536). The `view` derivation (:101)
   becomes `displayedChart ? manualView || (lessonChartActive ? 'chart' :
   automaticView) : 'atelier'`, where new frozen state `lessonChartActive`
   covers an active authored lesson even when voice was not admitted, from
   lesson set until the lesson settles (completed/stopped/failed/dismissed).
   The user's manual choice during the lesson overrides and cancels
   auto-revert (existing `manualView` semantics).
3. Caption set (closed). Signed-out example state shows exactly: "Example
   chart — Aurelia, an anonymous example born 8 Nov 1997, 7:05 PM, Toronto.
   It is not your chart." followed by a create-your-chart link to
   `${VITE_APP_PATH}?app=1` (default `/app.html?app=1`). Signed-in no-intake
   shows the same example caption and link. Owner ready state keeps its
   existing owner caption. The example is never labeled as the visitor's
   chart (LP08).
4. Guest education: `educationSession` (:90) is keyed by `roomUid` so the
   guest namespace `'__marketing_guest__'` (GUEST_ROOM, :45) receives its own
   `AuthoredEducationSession`; `explain()` (:441-458) operates on
   `displayedChart`; `speak()` (:206) no longer requires an authenticated
   owner for example lessons; voice still starts only after an explicit user
   gesture (`voiceAllowedRef` :85 preserved); no inference call ever fires on
   the landing document.
5. After every prefab lesson on the landing, append
   `getAuthoredUpsellClose(chart, 'default')` (R12.5) to the lesson panel and
   speech in the same authored flow.
6. Auth and intake transitions keep the existing Phase machinery and
   generation guards: account or intake change clears example-owned
   lesson/selection/speech exactly as an owner chart.
7. Inset persistence keys become namespace-configured:
   `` `${VITE_APP_NAMESPACE}.marketing.inset-position.${roomUid}` `` — with the
   canonical default this is byte-identical to today's
   `natally.marketing.inset-position.<roomUid>` (:127). Drag, snap, keyboard
   and shelf-avoidance become operative for guests unchanged.

### R12.3 RENDERER-TWOPATH (files: `src/components/Astrolabe3D.tsx`)

1. Two-path inset activation in `onClick` (:531-584): while the chart is inset
   (`data-chart-inset` true), raycast before the `activateRef` short-circuit
   (:549). On an object hit (`selectable !== false`): call `onActivate()` when
   present, then defer `onToggleComponent(componentId, isMulti)` to the
   containing pane's transition end (the existing `layoutKey`/transitionend
   redraw path), or immediately under reduced motion. On an empty-space hit:
   `onActivate()` only (today's behavior). Foreground clicking, drag
   suppression, occlusion guards and analytics are unchanged. Touch activation
   (:586-596) follows the same two-path rule for object taps.
2. New frozen ref `pendingInsetSelectionRef` holds the deferred selection; it
   is cleared on unmount, on drag start, on chart rebuild, and when a new
   pointerdown begins; it never fires a stale selection.
3. Vivid-frame focus dimming: at structure creation (:252-320 — the
   plum-and-metal frame: torus bezels, floor disc, guide rings) every
   structural mesh carries `userData.structureFrame = true`. In the focus dim
   traverse (:1313-1328) and the hover opacity variant (:1341-1352), materials
   of `structureFrame` objects keep their `focusBaseOpacity` — never
   multiplied by `CHART_FOCUS.dim`. Non-focused representational elements
   (planet beads and glyphs, sign baubles and cusp ticks, house spokes, badges
   and sector fills, aspect lines and tubes, current-sky bodies) dim exactly as
   today. The comment at :1313 is corrected to state this. `CHART_FOCUS`
   constants (chartFocusVisuals.ts:2) are unchanged.
4. Everything else in the renderer is preserved: R11 outside-inset hover
   callouts and endpoint-card suppression, drag/momentum, wheel and pinch
   zoom, `baseSpin` slow rotation, selection halos, annotation modes, per-
   renderer overlay ownership and cleanup.

### R12.4 APP-EDUCATION (files: `src/App.tsx`, `src/components/NatallyChatbot.tsx`, `src/components/ReadingStage.tsx`)

1. Explanation choreography: creating an `educationalRequest`
   (`App.handleToggleComponent` :459-470 → `setEducationalRequest` :106/:469)
   from an inset-originating selection sets `presentation.view` to 'chart'
   through the existing presentation path. New frozen prop
   `onEducationalSettled?: () => void` on `NatallyChatbot` fires exactly once
   per educational message when its playback completes, is stopped or fails;
   `App` reverts the view to 'atelier' unless the user manually chose a view
   during the lesson. Reduced-motion transitions remain instant.
2. Natally stays in the inset: no new sprite machinery — while the chart is
   focused the atelier room pane with `AtelierCharacter` is the inset and
   remains visible and animated (existing voice-performance mouth events);
   auto-revert returns her to the main view after the explanation.
3. Branched pipeline: the authored lesson message (NatallyChatbot.tsx:1036-
   1075) always posts first. Then, if `readPaidConversationAccess(accountUid)`
   (src/services/billingAccess.ts:47, resolves `{canInfer, canOpenSouvenir}`)
   yields `canInfer: true`, the pipeline requests a personalized
   interpretation of the lesson's selected component(s) through the existing
   chat inference path (`withInferenceTurn`, src/services/inferenceTurn.ts:4;
   `requestHostedInference`/`completeHosted`, src/services/hostedInference.ts
   :212/:96) with context = resolved target name(s), natal chart facts and
   current-sky facts; it renders as the next assistant message with streaming
   Supertonic speech; existing inference accounting and cost gating (R3)
   applies verbatim. `canInfer: false` → prefab lesson only. Rapid
   reselection keeps the existing `inFlight`/`consumedEducation` cancellation.
4. Upsell-close branch: after a prefab lesson (and after its paid extension
   when one ran) append the authored close — `getAuthoredUpsellClose(chart,
   'souvenir')` when the immediately preceding completed user-visible turn was
   a paid inferenced message (message model metadata ≠ `'Authored guide'`) and
   `readPaidConversationAccess` still yields `canInfer: true`; otherwise
   `getAuthoredUpsellClose(chart, 'default')`. The souvenir variant names the
   PDF plus persisted interactive "vignette frozen in time" re-experience
   atelier, consistent with existing souvenir entities
   (SouvenirSnapshot/SouvenirChapter, src/services/souvenir.ts:43/:41). No new
   offer, payment or delivery machinery is introduced.
5. The app inset persistence key becomes namespace-configured:
   `` `${VITE_APP_NAMESPACE}.inset-position.${accountUid}` `` — with the
   canonical default byte-identical to today's key
   (ReadingStage.tsx:29-31).

### R12.5 PREFAB-CONTENT (files: `src/services/authoredChartExplanations.ts`, `src/services/authoredEducationSession.ts`)

1. `LessonCore` (:21) gains required fields `regimes: string` and
   `evolution: string`. Every entry of the closed sets carries real authored
   passages: BODIES (14 keys: Sun, Moon, Mercury, Venus, Mars, Jupiter,
   Saturn, Uranus, Neptune, Pluto, Chiron, TrueNode, Ascendant, Midheaven),
   SIGN_CORES (12), HOUSE_CORES (12), ASPECT_CORES (5: Conjunction,
   Opposition, Square, Trine, Sextile). `regimes` states how different
   astrological regimes and traditions regard the element; `evolution` states
   how its meaning evolved over the ages. `buildLesson` (:184-200) composes
   them after the `what` sentence. The factual register and `CONTEXT_LINE`
   (:10) are retained. No placeholder text is permitted. The Gen Z register
   restoration remains the separate PREFAB-GENZ task and is out of this round.
2. New frozen function `getAuthoredUpsellClose(chart: NatalChartResult,
   variant: 'default' | 'souvenir'): string`, placed beside
   `getAuthoredConversationClose` (:294-303). Each variant carries two or
   three frozen authored closing lines (light rotation in-file). Tone:
   perfect-sales-technique assertiveness with a slight cheesiness of
   self-awareness, never self-consciousness. The default variant invites a
   personal reading with Cr; the souvenir variant invites the PDF plus
   persisted interactive "vignette frozen in time" re-experience atelier.
   Pure authored text — no network, no LLM.
3. `authoredEducationSession` INVITATIONS (:13-18) remain; the close composes
   after lessons without verbatim back-to-back repetition, reusing the
   existing session rotation mechanics.

### R12.6 ENTRY-UNIFY (files: `src/main.tsx`, `scripts/build-web.mjs`, `scripts/stage-marketing-overlay.mjs`, `scripts/pwa-build.mjs`, `.env.example`)

1. The six R12.1 keys are defined in `.env.example` with annotated schema and
   defaults; the effective `.env` gains only the new keys at those defaults.
2. New frozen function `resolveEntryExperience(pathname: string, search:
   URLSearchParams, native: boolean, authState: 'unresolved' |
   'anonymous' | 'authenticated'): 'app' | 'landing'` in `src/main.tsx`:
   native → 'app'; app path or `?app=1` or `?offer=reading|conversation` →
   'app'; landing path or alias → 'landing'; otherwise 'authenticated' →
   'app', 'anonymous'/'unresolved' → 'landing'.
3. The main.tsx dispatcher dynamically imports the app (`App.tsx`, mount
   `#root`) or the landing (`marketing.tsx`, mount
   `#marketing-experience-root`), preserving the bundle split. On the bare-
   domain document it awaits Firebase auth resolution (existing
   `src/services/firebase.ts` integration), renders the landing while
   unresolved, swaps to the app on authenticated, and keeps the auth listener
   active only for that document. `index.html` remains the app source document
   for Tauri and dev (`isNative` guard unchanged); `marketing.html` remains
   the landing source document.
4. Web emission (`scripts/build-web.mjs`): the unified app document is emitted
   as `index.html` and copied byte-identical to `app.html`; the landing
   document is emitted as `landing.html`; `marketing.html` becomes a generated
   static redirect document to the landing path preserving query and hash per
   `VITE_LEGACY_PATH_REDIRECTS`. `currentDocument` mount and invocation checks
   are updated to the unified and landing mounts. `scripts/
   stage-marketing-overlay.mjs` stops injecting the `/` → `/marketing.html`
   head redirect; its asset-copy and hash-verification duties are preserved
   with updated expected hashes. `scripts/pwa-build.mjs` SHELL_ROUTES
   (:4/:47) gains the landing path and alias from the env keys; the manifest
   name and cache prefix derive from `VITE_APP_NAME`/`VITE_APP_NAMESPACE`.
5. The landing document keeps its `natally-version` badge (LP14); native
   builds boot the app unchanged.

### Entity table — R12 (existing anchors verified 2026-11-01; new entities frozen)

| Entity | Kind | File:line | Role / signature | Authorized by |
| --- | --- | --- | --- | --- |
| GUEST_ROOM | const | src/marketing.tsx:45 | `'__marketing_guest__'` guest room namespace | R12.2 |
| roomUid / ownedChart | derivation | src/marketing.tsx:94-95 | guest/owner room id; owner chart gate | R12.2 |
| automaticView / view | derivation | src/marketing.tsx:96/:101 | scroll-driven and effective view | R12.2 |
| voiceAllowedRef | ref | src/marketing.tsx:85 | explicit-gesture voice unlock | R12.2 |
| educationSession | ref | src/marketing.tsx:90 | AuthoredEducationSession per roomUid | R12.2 |
| speak(text, explicit, narrationTargets, entryPoint, idle, onAdmitted) | fn | src/marketing.tsx:206 | lesson/narration voice entry | R12.2 |
| insetKey / placeInset | state | src/marketing.tsx:127-138 | inset persistence + placement | R12.2 |
| load(uid) / loadNatalIntake / fetchUserIntake | fn | src/marketing.tsx:249-296; src/services/onboarding.ts | owner intake → chart | R12.2 (preserved) |
| explain(target) | fn | src/marketing.tsx:441-458 | authored lesson prepare/speak | R12.2 |
| marketing panes/handle/select JSX | JSX | src/marketing.tsx:502-545 | sticky-frame pane pair | R12.2 |
| EXAMPLE_CHART_INPUT / loadExampleChart / displayedChart / lessonChartActive | new | src/marketing.tsx | R12.2.1-2 frozen contracts | R12.2 |
| Astrolabe3D props interface | iface | src/components/Astrolabe3D.tsx:9-25 | chart/selection/activation props | R12.3 (preserved) |
| onClick / onTouchActivate | fn | src/components/Astrolabe3D.tsx:531-584/:586-596 | click/tap pipeline | R12.3 |
| activateRef short-circuit | use | src/components/Astrolabe3D.tsx:549 | inset→focus swap gate | R12.3 |
| structure meshes | scene | src/components/Astrolabe3D.tsx:252-320 | plum-and-metal toroid frame | R12.3 |
| focus dim traverse / applyHover | fn | src/components/Astrolabe3D.tsx:1313-1328/:1330-1353 | CHART_FOCUS dimming | R12.3 |
| pendingInsetSelectionRef / userData.structureFrame | new | src/components/Astrolabe3D.tsx | R12.3.1-3 frozen contracts | R12.3 |
| CHART_FOCUS / chartHaloOpacity | const/fn | src/services/chartFocusVisuals.ts:2-8 | focus art direction (unchanged) | R12.3 (preserved) |
| placeChartCallout / boundary attrs | fn/attr | src/components/chartCalloutPlacement.ts:5-52; marketing.tsx:512; ReadingStage.tsx:70 | R11 outside-inset callouts (unchanged) | R12 (preserved) |
| handleToggleComponent / setEducationalRequest / setManualView | fn | src/App.tsx:459-470/:106/:124 | selection→education pipeline | R12.4 |
| ReadingStage render / Astrolabe3D props | JSX | src/App.tsx:657/:715-722 | app chart mount | R12.4 (preserved) |
| ReadingStage panes / inset key | JSX/state | src/components/ReadingStage.tsx:55-77/:29-31 | app pane pair + persistence | R12.4 |
| educationalRequest pipeline | fn | src/components/NatallyChatbot.tsx:1036-1075 | authored lesson message | R12.4 |
| unpaid authored fallback | fn | src/components/NatallyChatbot.tsx:842-877 | readPaidConversationAccess branch | R12.4 (preserved) |
| onEducationalSettled | new prop | src/components/NatallyChatbot.tsx | R12.4.1 frozen contract | R12.4 |
| readPaidConversationAccess(uid) | fn | src/services/billingAccess.ts:47 | `{canInfer, canOpenSouvenir}` | R12.4 |
| withInferenceTurn | fn | src/services/inferenceTurn.ts:4 | paid-turn accounting wrapper | R12.4 |
| requestHostedInference / completeHosted | fn | src/services/hostedInference.ts:212/:96 | hosted API inference | R12.4 |
| SouvenirSnapshot / SouvenirChapter | type | src/services/souvenir.ts:43/:41 | souvenir naming alignment | R12.4 |
| LessonCore / BODIES / SIGN_CORES / HOUSE_CORES / ASPECT_CORES / GENERAL_LESSON | tables | src/services/authoredChartExplanations.ts:21/:23-119/:138-151/:123-136/:153-159/:161-167 | authored lesson cores | R12.5 |
| buildLesson / getAuthoredChartExplanation / getAuthoredConversationClose | fn | src/services/authoredChartExplanations.ts:184-200/:241-292/:294-303 | lesson assembly/lookup/close | R12.5 |
| LessonCore.regimes / .evolution / getAuthoredUpsellClose | new | src/services/authoredChartExplanations.ts | R12.5.1-2 frozen contracts | R12.5 |
| createAuthoredEducationSession / INVITATIONS | fn/const | src/services/authoredEducationSession.ts:57-89/:13-18 | session framing/invitations | R12.5 (preserved) |
| calculateNatalChart / NatalChartInput / NatalChartResult | fn/type | src/services/ephemeris.ts:223/:80-96/:105-122 | local Swiss Ephemeris chart math | R12.2 (preserved) |
| speakNatallyText | fn | src/services/voiceService.ts:343 | Supertonic speech | R12.2/R12.4 (preserved) |
| entry guard / redirect | code | src/main.tsx:3-13 | current app/landing dispatch | R12.6 |
| resolveEntryExperience / dispatcher | new | src/main.tsx | R12.6.2-3 frozen contracts | R12.6 |
| build-web emission / currentDocument | code | scripts/build-web.mjs:7-15 | document copies + checks | R12.6 |
| staged-index redirect script | code | scripts/stage-marketing-overlay.mjs:33-49 | injected redirect (removed) | R12.6 |
| SHELL_FILES / SHELL_ROUTES | const | scripts/pwa-build.mjs:4/:47 | PWA shell routes | R12.6 |
| six VITE_ keys (R12.1 table) | env | .env.example + effective .env | per-build entry/identity config | R12.1 |

### R12 preservation (binding on every assignment)

R11 INSET-CALLOUTS and ACCOUNT-VALUE behavior and copy are unchanged. Existing
drag, momentum, wheel/pinch zoom, slow rotation, selection halos, annotation
modes, inert-pane accessibility and reduced-motion behavior are unchanged. No
audio autostarts without an explicit gesture. No LLM or inference call ever
fires on the landing document. Inference in the app flows only through the
existing paid-access check and accounting. No new provider, dependency or
configuration surface beyond the six keys. Billing, purchase, redemption and
invoice behavior is untouched. The souvenir ReadingStage inherits renderer
changes without regression. LP08 truthful states and the project's no-
placeholder rule apply absolutely.

### R12 delivery and attestation

Staged holds: this architecture published and pushed; CHECKLIST.md produced
from it and published; each holds for operator signoff; only then are
parallel self-contained coder tasks dispatched (one task per subagent, coder
looks only at its CHECKLIST task), with same-coder correction, supervisor
semantic validation flipping ✅, parent-owned Git/build/deploy and the
canonical coordinator as the only build path. The Postgres task_ledger
(claude_archive on CT 112) records each attempt; when unreachable from a
machine, the obligation is recorded in commit text and Admin-Manual telemetry
rather than fabricated.

R12 architecture attestation: I checked this amendment against the operator's
2026-11-01 instructions, both screenshots, the deployed 1.32.90532 source, and
the verified anchors above. It completely specifies the landing replica,
branched education, upsell close, vivid-frame dimming, unified entry and env
configuration, and their preserved behavior; assigned code must realize these
requirements one to one. This certifies the specification, not unfinished
implementation or live observation.

## Firebase balance store amendment (recorded 2026-11-01, after implementation — process violation noted)

The billing credit policy (billing/credit-policy.mjs) mandates
BILLING_CREDIT_BALANCE_STORE=firebase; the runtime previously shipped only
the RevenueCat provider wallet, so the policy-mandated store did not exist.
On 2026-11-01 the store was implemented and proven end-to-end (redemption →
managed key at limit → reading; evidence DOCS/DEMONSTRATIONS/billing-e2e-20261101/)
BEFORE this architecture record was written — a violation of the freeze
discipline this file exists to enforce. Recorded here now, additively, with
the violation stated rather than papered over.

Entities (canonical names, exact roles):

| Entity | Location | Role / signature |
|---|---|---|
| createFirebaseWallet | billing/firebase-wallet.mjs:5 | (environment) → { read(uid), recover(context), transact(context, {identity, adjustment, reference, accountPatch, records}), reconcileUsage(context) → {balance, availableUsdMicros}, creditsFor(micros), unitMicros } — customer balance on the ledger account document; intent kind 'fb_credits'; same atomicity contract as the RevenueCat wallet |
| creditUnits | billing/firebase-ledger.mjs blankAccount | schema-3 account field, ROCHE units, integer ≥ 0, initialized 0 at account creation; defined by the initializer, never absent on accounts created after this amendment |
| wallet selection | billing/runtime.mjs createBillingRuntime | BILLING_CREDIT_BALANCE_STORE === 'firebase' selects the ledger wallet; any other value keeps the provider wallet |

Preservation: RevenueCat purchase flows unchanged; the redemption SET path
and the wallet transaction/intent semantics mirror the provider wallet
one-for-one. A future round that reconciles this amendment with the frozen
R1 contract text owns any wording deltas.

## Single-wallet rail amendment (recorded 2026-11-02, with the fix)

Defect: with BILLING_CREDIT_BALANCE_STORE=firebase, `createCommerce` always
built its own RevenueCat ROCHE wallet, so card purchases (grantPayment,
refunds, reconcileHistory) credited ROCHE while redemption and the managed
OpenRouter key limit (managed-access ensure → wallet.reconcileUsage) used the
firebase wallet. Paid credits therefore never raised the key's spend limit.

Authority (Robin, 2026-11-02 — supersedes "wallet = firebase" above and the
Oct-31 agent rule in billing/credit-policy.mjs): **RevenueCat is the
authoritative store for everything pertaining to a user account** — user
creation, payments, balance. Firebase is only a functional working database
(a working copy, never the source of truth). Every rail — BTCPay, Blink POS,
x402, Alby, WooCommerce, any future one — syncs the user's creation and each
payment to RevenueCat even when RevenueCat took no part in it. Deploy with
BILLING_CREDIT_BALANCE_STORE=revenuecat. Consequence for the 2026-11-02
defect: the US$1.98 purchase was correctly recorded in the authoritative
store (ROCHE); the fault was the key limit reading the non-authoritative
firebase copy. Ruling 6 of HANDOFF-1nov2026 ("credits stored in Firebase")
reads as the working copy under this rule.

Rule — two rail classes, branched per payment platform by design (Robin,
2026-11-02):

1. Prepaid (balance) rails — RevenueCat prepaid card today; Chargebee/Lemon
   Squeezy/Polar, BTCPay or Blink POS top-ups, and the planned custom
   WooCommerce plugin. They credit and debit ONLY the runtime-selected wallet
   (RevenueCat ROCHE, the authoritative store)
   through `wallet.transact`; the managed-key limit is derived from that one
   balance (below). Rails differ in how a payment is proven, never in where
   the balance lives.
2. Pay-per-use rails — NO balance is retained or credited:
   - x402: charges as it goes; each request carries its own settled payment.
   - Alby marketplace (and similar micropayment marketplaces): micropayment
     with explicit per-turn consent — the customer approves each turn.
   One verified payment authorizes one bounded operation (ALBY-LAUNCH-ROADMAP
   "One payment authorizes one quoted reading"). Its OpenRouter access is
   provisioned contemporaneously: a fresh key whose limit is that operation's
   compute budget, expiring within minutes, never topped up or reused. These
   rails never credit a balance (`wallet.transact`), but still record the
   user and each payment in RevenueCat (authority rule above). Not yet implemented:
   src/services/x402Access.ts is an unwired client-side seam (browser success
   + localStorage) that does not meet the roadmap's server-verification rule.

Provider funding — NOT YET ARCHITECTED; ON HOLD behind the Google Play closed test (Robin, 2026-11-02). A key limit is a
spend CEILING, not a balance or a reservation: setting it sets aside no
money. The OpenRouter account only needs credit for what is actually spent,
which is why it can be topped up in small, tight increments.
Current state, every path: no payment funds the OpenRouter account; it holds
only what the operator tops up manually, and no code compares outstanding key
limits with its remaining credit (OpenRouter GET /api/v1/credits:
total_credits − total_usage). Limits are enforced per key only.
Stated intent, to be architected before any implementation:
- Crypto paths (preferred, safest): the customer's payment tops up the main
  OpenRouter account directly and quickly — no card posting dates, payouts or
  withdrawals to wait for — so the credit behind a key's limit comes from the
  purchase itself, at most about one turn behind (operator floats ≤ one turn).
- Card/processor prepaid paths: payouts lag by days, so the account is
  topped up ahead of actual spend (not ahead of the sum of key limits).
- Roll-out: Robin's incremental, tight top-up schedule trials this into
  existence; the schedule itself is not yet recorded here.
- Bifurcation (Robin, 2026-11-02): card/processor methods cannot
  automatically buy crypto, so their provider funding cannot be tightened the
  way Alby/x402 funding can. The original plan keeps TWO inference providers,
  Venice.ai and OpenRouter, with one reserved strictly for card methods, so
  each provider account's funding follows a single schedule. Which provider
  serves which class: OPEN (to be stated by Robin). Code today: OpenRouter
  per-user managed keys are implemented (billing/managed-access.mjs); Venice
  has only the direct shared-key engine, with per-user spend-limited
  `venice-admin` keys reserved in server/inference/registry.ts.

RevenueCat (and ROCHE) is expected to be retired before its US$2,500 MRR
threshold; the ROCHE wallet is retained, unused, as the store for
non-firebase values.

| Entity | Location | Role / signature |
|---|---|---|
| createCommerce | billing/revenuecat-commerce.mjs | (environment, { wallet? }) — `wallet` defaults to createRevenueCatWallet; the runtime injects the firebase wallet |
| wallet selection | billing/runtime.mjs createBillingRuntime | firebase wallet created first and injected; `wallet = commerce.wallet` is the single instance for purchases, refunds, redemption and managed access |

Key model (unchanged, confirmed): short-lived OpenRouter keys (created with
limit 0, expires_at = now + 1 h, rotated within 60 s of expiry, on logout, or
when disabled), stored AES-GCM-encrypted on the Firestore
natallyCreditAccounts document — not on RevenueCat. Each `ensure` PATCHes an
ABSOLUTE limit = key usage already accounted + wallet.availableUsdMicros, so
the limit is idempotent: a purchase raises the balance, and the next `ensure`
re-derives the limit; nothing increments a key on purchase. Regression:
tests/purchase-funds-key.test.mjs.

## Alby per-turn rail — DESIGN DRAFT, decisions open (2026-11-03)

Purpose: the Alby marketplace listing (web app only; Robin's order: Play
closed test first, then Alby). A pay-per-use rail under the two-rail-class
rule: **no balance is kept**; one verified payment authorizes one bounded
operation (ALBY-LAUNCH-ROADMAP §3). RevenueCat remains authoritative: every
settled payment is recorded there (authority rule), but nothing is credited.

Reuse, not new vendors: Lightning invoicing and settlement verification
already exist for the Blink rail (`netlify/lib/blink-lightning.mjs`:
`createBlinkUsdInvoice`, `readBlinkInvoiceStatus`, `readBlinkSettlement`;
`netlify/lib/blink-revenuecat.mjs`: `submitBlinkReceipt`). The merchant
receiving wallet is that Blink USD wallet (invoice/lookup permissions only).

Flow (server-authoritative; browser success is never trusted):
1. App → `POST /billing/turn/quote` {turn input hash} → server returns quote
   {quoteId, price, turn compute budget, expiresAt}.
2. Server creates the Lightning invoice for the quote (Blink); app pays it
   with WebLN (Alby extension) or shows QR/deep link on mobile.
3. App → `POST /billing/turn/claim` {quoteId} → server verifies settlement
   (amount, recipient, quote, not already claimed — atomic claim), records the
   payment in RevenueCat (external purchase receipt, as Blink does), and
   issues a contemporaneous OpenRouter key: limit = this turn's compute
   budget, expires in minutes, never topped up or reused.
4. App runs the turn directly against OpenRouter with that key.
State machine per quote: quoted → awaiting payment → paid → claimed →
delivered | expired | failed/refund due. Replays and double claims return the
same key while it lives.

Open decisions (Robin): price per turn and its fee treatment; turn compute
budget (USD ceiling per key); quote lifetime; whether a guest (no account)
may pay per turn; refund rule when generation fails; whether this becomes
the x402 adapter's backing (x402 needs its own scheme/facilitator verification).
