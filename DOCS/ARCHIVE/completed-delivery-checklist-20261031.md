# Restored complete carry-forward task list

## Active next-release correction — R9

| ID | Assignment | State | Closure |
| --- | --- | --- | --- |
| CR-DISPLAY | Shared formatter emits compact Cr from annotated public denomination100; preserve all underlying money and provider limits. | 🟦 IN_PROGRESS | All balance amounts use Cr; USD4 displays400 Cr; no top-line credits caption. |
| TOPLINE-CODE | Make top-line control font sizes/family, alignment, spacing and wrapping consistent on app and landing. | 🟦 IN_PROGRESS | Original actions retained; balanced desktop/narrow deployed presentation. |
| DIRECT-PRESET | Make5/10/25 preset taps directly open their exact real checkout; retain custom submit and all retry/owner guards. | 🟦 IN_PROGRESS | One tap per preset; no second selection-confirm button. |
| R9-REVIEW | Compare each coder output with the frozen R9 assignments; same-coder corrections; publish README attestation before build. | 🟨 NOT_STARTED | Requirement-to-source mapping published before coordinator invocation. |
| R9-RELEASE | Automatic new version/build; deploy and inspect actual top line and direct-preset behavior in vivo. | 🟨 NOT_STARTED | Actual release and visible result recorded; no reuse of published1.30 identity. |

Cold coder boundaries: root owns billingApi formatter and annotated env; top-line
coder owns App/header CSS, AccountCreditsEntry and landing header styling; direct
preset coder owns CreditActions only. CodeGraph supplies source context. Preserve
concurrent changes. No speculative review, fixture data or unrelated product work.
The in-vivo rubric is: observe the actual balance denomination; inspect desktop
and narrow header alignment/wrapping; activate each preset to its exact hosted
checkout without submitting a charge; confirm custom field still requires>5.
This recipe completely implements R9 and adds no other behavior.

Four states only: 🟨 NOT_STARTED, 🟦 IN_PROGRESS, 🟥 BLOCKED, 🟩 COMPLETE.
Surface this list every turn. No assignment disappears when a new repair starts.
Tasks1 and2 stay hidden at the operator's earlier direction. The historical task
states below retain their dated evidence; the current delivery table and latest
operator instructions supersede obsolete prices, currencies, recording holds,
redemption campaigns/account restrictions and credential-discovery requests.
Implementation-status questions use CodeGraph only. No additional source review
is underway. Review for the current release is COMPLETE.

The full earlier task recipes are retained in
[the pre-v1.30 checklist](DOCS/ARCHIVE/checklist-before-v1.30.md), including all
landing, account, inset, education, analytics, purchase, signage and native tasks.
The active delivery recipe remains below this restored register.

## Previously assigned product tasks — retained in full
| IDs | Division and remaining work | State and evidence |
| --- | --- | --- |
| 3 | Readings My Horoscope / Synastry controls | 🟦 IN_PROGRESS; source and semantic review complete at 61ac7e54; deployed recording held. |
| 4–7 | Configured pricing/packs, separate souvenir, comprehensive synastry | 🟦 IN_PROGRESS; latest souvenir direction 29.99 supersedes 9.99; default entry pack 5. Configuration/catalog implementation outstanding; no invented allowance. |
| 8–9 | Actual Credits / Top Up and reactive profile header | 🟦 IN_PROGRESS; source/review published7e4c5494/035c507d. Actual1.17 signed-in account on both domains shows Profile, Credits:0 and Top Up with its own chart. Completed purchase/top-up fulfillment remains S2. |
| 10–14 | Real high-resolution atelier, sticky window, inset swap, educational toroid, play/break trinkets | 🟦 IN_PROGRESS; live1.17 real room/chart. Mouse rotation, click/tap foregrounding, independent handle drag and cookie clearance observed;390x844 no overflow, popup contained. Full narration/nudge/scroll acceptance remains separate; see deployed review. |
| 15–18 | Authored vignettes, single professional voice, jargon tooltips, meaningful user lore | 🟦 IN_PROGRESS in requirements; implementation/retrieval selection outstanding. |
| 19–21 | Smooth section navigation/Education, matching purchase buttons, plain customer payment copy | 🟦 IN_PROGRESS; five section links/Education and eased scrolling source published; deprecated voice choice and processor/card reassurance removed. Full navigation timing/button parity acceptance pending. |
| 22 | PDF flipbook with animation and optional sound | 🟨 NOT_STARTED. |
| 23 | Pricing research Word report | 🟩 COMPLETE; four-page DOCX and generator pushed at e3518ff4, all pages rendered/inspected. |
| 24 | Web deployment first, native packaging after operator evaluation | 🟦 IN_PROGRESS; latest1.22.88969 both hosts, coordinator exit0,3web outputs verified and184/184 served checks passed. Native9pending, packaging/recording held. Offline worker acceptance remains43. |
| 25 | Remove landing chart Pause/Reset controls | 🟩 COMPLETE for web; actual22 landing control inventory has no Pause/Reset/Stop. Recording held. |
| 26 | Readable public fragment names | 🟩 COMPLETE for web; actual22 header uses your-chart/reading-aloud/talk-with-natally/prices/education. Source0a31fff0; recording held. |
| 27 | Static personalized frozen atelier with live add-on handoff | 🟦 IN_PROGRESS architecture KEEP-01..05; exact hosting/snapshot/template/handoff coding recipe outstanding. |
| 28 | Plane, periodic marquee, carnival and souvenir verbal closes | 🟦 IN_PROGRESS architecture KEEP-06..13; implementation and exact burst/repeat timings outstanding. |
| 29 | Free authored education / paid personal interpretation; varied 2..4 answer invitation | 🟦 IN_PROGRESS architecture KEEP-14..16; no last free question, no free personalized-inference allowance. |
| 30 | Per-turn relevant lore retrieval | 🟦 IN_PROGRESS discussion; current notes/SOUL context exists, vector retrieval not established or installed. |
| 31 | Equivalent authored phrases and repetition avoidance | 🟦 IN_PROGRESS architecture KEEP-17; phrase-bank execution not implemented. |
| 32 | GA4 usage and upsell/cross-sell measurement | 🟦 IN_PROGRESS; existing property561516754/stream16232442825. Real scene/education wiring deployed1.25.89030; actual marketing/app collection204 and Realtime events confirmed. Hidden-return timing, commercial outcomes and report dimensions remain outstanding. See interaction-analytics-review-20261030.md. |
| 33 | Natural spoken paid disclosure, prices in Top Up | 🟦 IN_PROGRESS architecture GA; say purchase credits / personal reading using credits without reciting numeric prices. Top Up menus show prices and terms. Source implementation pending. |
| 34 | Restore Natally's periodic Madlib story nudges | 🟦 IN_PROGRESS; source and supervising semantic review 🟩 COMPLETE, including same-coder continuity correction. Six stable school/hotline stories, actual room reminiscence, configurable90–150sec scheduler and owned voice cancellation implemented. Live/example values preserved. Real N1–N5 voice/deployed recording remains held/unobserved. |
| 35 | High contrast inset chart without blocking signage and with full3D control | 🟦 IN_PROGRESS;1.17 mouse/finger rotation remains inset, pinch leaves page scale1, deliberate mouse click and touch tap foreground. Handle drag works independently; hidden inset signs preserved. Prior1.16 retained-audio follow/manual-return proof remains; recording held. |
| 36 | Seasonal availability configured in env | 🟦 IN_PROGRESS; source/review9f812456, flags false for Halloween AND Christmas. Actual1.17 choices only Candlelit atelier on app/landing; stored disabled seasonal preference normalizes to candlelit while modules/assets remain. Recording held. |
| 37 | Saved current location and date-aware observation timezone | 🟦 IN_PROGRESS; parallel ScopeC correcting existing consumers; birth details remain natal, current onboarding fields preserved. |
| 38 | Root landing and genuine-session entry | 🟦 IN_PROGRESS; ScopeA makes root anonymous landing, returning genuine account app/atelier, new/no-intake onboarding; explicit marketing remains inspectable. |
| 39 | Primary landing CTA Start my reading now! | 🟦 IN_PROGRESS; ScopeA all primary story actions, preserving separate explicit purchases/upsells. |
| 40 | Remove ambiguous landing Stop | 🟩 COMPLETE source and deployed observation22: separate Stop absent; explicit Sound On/Off and lesson replay retained. Recording held. |
| 41 | Clear click-to-learn chart instruction | 🟩 COMPLETE source and deployed observation1.17: exact operator text appears outside chart geometry after foregrounding by mouse or touch. Recording held. |
| 42 | Reuse cookie sign for one-turn souvenir marquee | 🟨 NOT_STARTED source; contract recorded after restored inset handle proof. Exact Ask how to Keep THIS Reading as an INTERACTIVE SOUVENIR! then free-cookie sign next actual turn until next configured invitation. |
| 43 | Existing browser cache delivers the published release | 🟨 NOT_STARTED repair; actual normal navigation served1.13/1.16 after1.17 publication, while cache-bypassing reload showed1.17. Root anonymous/automatic-update acceptance remains incomplete; preserve actual account data during correction. |
| S1 | Native/web sign-in and Google branding | 🟦 IN_PROGRESS; 29 October readiness: Windows browser-return source present, installed login unverified; Android excluded from native auth and its provider adapter absent. Explicit-project `apps:list ANDROID --project gen-lang-client-0714568880 --json --non-interactive` returned `{"status":"success","result":[]}`: no registered Firebase Android app or matching mba.robin.natally package; separate Google Cloud OAuth inventory not inspected. Actual 28 October Google chooser showed Natally, not current native proof. Firebase helper domain is distinct; custom helper endpoints returned 404. Full actual command in WINDOWS-AUTH-STATUS.md; actual Android/Windows/web completion remains required. |
| S2 | Google Play primary billing, one-offs/subscriptions, restore, actual shared-currency fulfillment and per-user keys | 🟦 IN_PROGRESS; native bridge compilation recorded in resume; current actual purchase-to-usable-chat acceptance unfinished. Historical server-only proposal is not the current approved direct-client direction. |
| S3 | Fees/HST and analytics insertion points | 🟦 IN_PROGRESS for accounting documentation; analytics implementation 🟨 NOT_STARTED per checklist. No new tax automation approved. |

| IDs | Division and remaining work | State and evidence |
| --- | --- | --- |
| 44 | Profile Account and billing access | 🟩 COMPLETE for the previously recorded web scope. |
| 45 | Slimmer movable inset handle | 🟩 COMPLETE for the previously recorded web scope. |
| 46 | Compact placement and sound controls; remove single-choice room selector | 🟩 COMPLETE for the previously recorded web scope. |
| 47 | Prominent balance opens Account and billing | 🟩 COMPLETE for the previously recorded web scope; payment fulfillment is separate below. |
| 48 | Clear landing navigation and guest decluttering | 🟩 COMPLETE in web1.29; retained in1.30. |
| 49 | Permanent env-configured redemption Ch4n3l.C3351; configured USD10 available allowance, per-request idempotency | 🟦 IN_PROGRESS: source and runtime delivered; in vivo. This supersedes the old campaign/one-use interpretation; a future arbitrary-code table is not assigned. |
| LC-01 | Explicit Sound On / Sound Off action | 🟦 IN_PROGRESS in the retained original queue; do not silently drop. |
| LC-02 | Visible inset chart and scroll behavior | 🟦 IN_PROGRESS in the retained original queue; do not silently drop. |
| LC-03 | Omit single-choice room selector | 🟩 COMPLETE under task46. |
| LC-04 | Always-visible first-screen CTA | 🟨 NOT_STARTED in the retained original queue. |
| LC-05 | Opening curiosity hook and natal-chart explanation | 🟨 NOT_STARTED in the retained original queue. |
| LC-06 | Android Google Play badge and desktop PWA installation | 🟨 NOT_STARTED in the retained original queue. |
| PAST | Restore previously paid purchases | 🟨 NOT_STARTED: expressly deferred by the operator; two actual RevenueCat purchases located, no historical balance mutation. |
| DOWNLOADS | Publish newly built native downloads | 🟨 NOT_STARTED: Android and Windows files produced locally; hosted publication remains. |
| TOPLINE | Make the app's top line presentable: typography, spacing and layout | 🟨 NOT_STARTED: previously requested three times; not delivered by the balance/access wiring changes. Retain as an explicit independent assignment. |

**Signage is still assigned:** task28 covers the airplane-towed offer, periodic
marquee/carnival and verbal closes; task42 covers the existing cookie sign's
one-turn souvenir invitation and return to the cookie wording. The existing
cookie prop is not completion of either upsell assignment.

---
# Natally v1.30 delivery checklist

## Current delivery state — 31 October 2026

This status supersedes the initial assignment states below. The implemented source
checkpoint is `f931ebcc79ee8aabbec4ff50f6fca7834eecaddf`; the frozen architecture
was finalized at `e392229b`, and its final recipe at `3e2379cb` before coding.

| Tasks | State | Current evidence |
| --- | --- | --- |
| A0, P0 | 🟩 COMPLETE | Frozen architecture and independent recipe published before coding. |
| S1, S2 | 🟩 COMPLETE | Shared speech ownership, idle discard, deduplication and admission-only persistence; source commits `6f466ed7`, `23ce1361`. |
| U1, U2 | 🟩 COMPLETE | Authenticated allowance/key UI, configured redemption, presets/custom amount, invoice/history, confirmation/retry; `91048d34`, `4f889395`, `21477dd2`. |
| B1, B2 | 🟦 IN_PROGRESS | Durable server grant/key/cost implementation published; runtime deployed. Customer operation is in vivo. |
| B3, B4 | 🟦 IN_PROGRESS | Forward purchase code deployed; required server bindings declared. Customer operation is in vivo; checkout requires complete fulfillment configuration. |
| E1 | 🟩 COMPLETE | Required annotated env variables and credential-reference resolution defined, as instructed. Values remain in canonical credential storage; no further requests for credential locations. |
| E2 | 🟩 COMPLETE | Production Android signing, complete source fingerprint, scripted matrix and deployment helper published at `f931ebcc`. |
| V1 | 🟩 COMPLETE | Assigned source semantically reviewed and same-coder corrections published before build; README review record published after build start, an acknowledged ordering error. |
| R1 | 🟦 IN_PROGRESS | v1.30.90390: web, Android and Windows artifacts produced; Linux building in original invocation 7beec5dd-2d59-46e3-a57f-b68e5a0821d3. |
| R2 | 🟩 COMPLETE | v1.30.90390 web deployed to natally.robin.mba and natally.surge.sh; native download publication remains separately pending. |
| D1 | 🟦 IN_PROGRESS | As instructed: in vivo. |
| G1 | 🟦 IN_PROGRESS | Completed source tasks pushed separately, remote SHA read back; final release publication pending. |

The operator explicitly deferred recovery of previous purchases. Two owned
RevenueCat purchases were found for the supplied account; no historical balances
were changed. The separate build-folder copy was stopped as instructed; this
release builds from the main workspace only. Newly proposed code changes require
discussion and planning with the operator.

Frozen architecture: DOCS/ARCHITECTURE.md finalized at e392229b; earlier architecture checkpoints below are historical.
Previous checklist retained in DOCS/ARCHIVE/checklist-before-v1.30.md.
Only four states: 🟨 NOT_STARTED, 🟦 IN_PROGRESS, 🟥 BLOCKED, 🟩 COMPLETE.
No architecture changes during coding. Each task is independently rerunnable:
inspect its actual state, preserve existing data, apply only missing work, verify
its closure conditions. A dependent API may be implemented before its caller;
never replace a missing live dependency with fake data or success.

| ID | State | Independent assignment | Closure evidence |
| --- | --- | --- | --- |
| A0 | 🟩 COMPLETE | Inspect actual source, canonical rules, catalog contracts, production signing and runtime access; publish corrected architecture. | Remote architecture013429f5 verified. |
| P0 | 🟩 COMPLETE | Publish this complete coder recipe and real demonstration rubric before coding. | Recipe commit and remote SHA. |
| B1 | 🟦 IN_PROGRESS | Backend: implement environment-driven permanent default code and real authenticated redemption, idempotent per request, no additional redemption policy or code table. | Actual configured code produces durable receipt and usable configured-limit key; retry same request does not repeat; distinct authorized requests allowed. |
| B2 | 🟦 IN_PROGRESS | Backend: monetary account/grant schema, migration, usage/cap/expiry/top-up/refund reconciliation and durable key operation recovery. | Actual per-key cost delta checkpoint, reload/renew without accidental grant, authorized overrides honored, no ROCHE gate. |
| B3 | 🟦 IN_PROGRESS | Backend: verified payment settlement, all-page historical reconciliation, exact40% allocation, HST payable and authoritative invoice/history endpoints. | Actual old and new transaction identities credited once, source tax/payment facts retained, complete real invoices. |
| B4 | 🟦 IN_PROGRESS | Backend: actual custom amount Stripe Checkout and RevenueCat receipt import, provider webhook/return reconciliation. | Exact typed amount >5USD, actual quote/payment evidence, one allowance per paid transaction and customer confirmation. |
| U1 | 🟩 COMPLETE | Client: authenticated billing API, key installation/renewal, actual allowance display, purchase completion/recovery. | Existing managed key does not bypass reconcile; correct owner/key; confirmed purchase installs funded result. |
| U2 | 🟩 COMPLETE | Client: code form, request retry identity, purchase history/invoice actions, presets5/10/25 plus typed amount>5. | Real requests/results, keyboard/mobile controls, no1USD return, no campaign UI. |
| S1 | 🟩 COMPLETE | Speech: shared lifetime ownership and idle discard admission across synthesis/streaming/retained/waiting paths. | No overlap; busy idle never queues; stale callbacks cannot affect new speech. |
| S2 | 🟩 COMPLETE | Lore: admitted-story-only writes, content/stable-ID dedup and existing editable history cleanup. | Repeat/reload yields one entry per distinct story, user/history/snapshot preservation. |
| E1 | 🟩 COMPLETE | Release coder: annotated actual env defaults/pointers, live runtime deployment/IAM/secrets, actual provider catalog/tax/invoice binding configuration. | Exact readbacks, runtime URL and health/owner request, current default code+amount, existing production signing pointer. |
| E2 | 🟩 COMPLETE | Release coder: production Android signing and full source fingerprint coverage. | APK/AAB cert assertions; no debug fallback; billing included in frozen input fingerprint. |
| V1 | 🟩 COMPLETE | Supervisor: semantic review of each task; same-coder corrections; entire session diff versus architecture; truthful README attestation. | Requirement/file/behavior/evidence matrix, appropriate actual validation. |
| R1 | 🟦 IN_PROGRESS | Canonical coordinator all12 artifacts automatically v1.30; recover same invocation if needed. | Matrix complete, hashes, production Android signatures and matching symbols. |
| R2 | 🟩 COMPLETE | Deploy both hosts through canonical coordinator using completed inventory. | Domain release identity and served bytes match. |
| D1 | 🟦 IN_PROGRESS | Execute continuous real demonstration rubric and retain recording/timecodes. | Actual observable outcomes below, defects returned to same coder and re-recorded. |
| G1 | 🟦 IN_PROGRESS | Commit source/evidence boundaries and verify final remote SHA. | Remote master equals published commit; unrelated icon/dist/attachments preserved. |

## Backend cold-coder recipe — B1/B2/B3/B4

Owner files: billing/ production modules, including existing firebase-auth,
firebase-credits, redemption-policy, credit-policy, customer-session, openrouter,
revenuecat-customer, plus runtime.mjs/server.mjs and narrowly named supporting
billing modules. No frontend, .env, build scripts or architecture edits.
Read frozen R1–R6. Implement B1 FIRST, then notify supervisor with endpoint contract.
No invented account-wide redemption rule. Exact permanent default code comes from
.env, not hardcoded runtime; its allowance is configurable. There is NO campaign.
Same authenticated uid/requestId returns same action result. Do not constrain future valid grants. Implement only the specified permanent
environment-configured code and real configured-limit key operation now; do not
build the future general code table or invent additional policy.

Use existing named Firestore CAS; retain all actual history. Track grants, signed
adjustments/reversals, actual per-key usage and before/after balances. Money uses
integer micros. No invented approximate token rate. Code action may intentionally
restore balance; automatic key renewal itself is not a grant. Durable operation
intent and encrypted candidate precede provider funding. Use managed OAuth and
Firebase JWT verification. Actual default issued key has configured USD limit.
Do not log code/keys/tokens. Do not run synthetic/mock account/payment fixtures.

Implement authenticated endpoints frozen in architecture and communicate precise
types to client owner. Common access fields: accountUid,expiresAt,state,message,
provider,source,availableUsdMicros,spentUsdMicros; ready adds apiKey,hash,
keyGeneration,accessExpiresAt,limitUsd,usageUsd. Redemption receipt carries receiptId,
requestId,allowanceUsdMicros and persisted action/result (no campaign).
History items carry immutable id/sourceId/product/description/date/currency/subtotal/
tax/total/status/invoice availability. No forged zero tax or invoice fields.
Invoice access must verify owner and use actual provider data.

Use real provider pages (pagination) and canonical product/store identities.
For custom Stripe checkout use exact fixed Price and live Session, active tax
registration and invoice creation; import cs_ token to RevenueCat and verify.
Webhook is required. Verify refund/retry identity. Keep old purchase records.
Report syntax/import checks and live failures accurately; source is not live proof.

## Client cold-coder recipe — U1/U2

Owner: supervisor (primary coder). Files billingAccess.ts, inferenceAccess.ts,
interactionAnalytics.ts, AccountBillingDialog.tsx, AccountCreditsEntry.tsx,
InferenceAccessSettings.tsx, PurchaseAccess.tsx/CSS, checkoutCatalog and narrow
purchase/paywall bridges plus new billing API/client components. Coordinate
marketing.tsx edits with speech coder; never overwrite their work.

Read R1–R6. Replace obsolete ROCHE balance/access gate with actual server allowance.
Reconcile before returning existing managed key, handle expiry, preserve personal
keys, enforce account/generation guards, install confirmed funded access.
Keep requestId across ambiguous redemption/checkout retry; new intentional request
gets a new identity. Code and allowance are server configuration; client neither
hardcodes default code/10USD nor grants locally. Display durable result only.
Expose code redemption, history, invoices, restore and real purchase confirmation.
Preserve focus trap/Escape/return focus and narrow layouts. Preserve existing
deprecated1USD removal. Presets5/10/25/default5; custom field strictly>5 with cents.
Handle actual hosted checkout return via server verify, never grant from URL.
Update redemption analytics from authoritative receipt without campaign/raw code.
Use actual runtime/account/browser validation as available; no simulated customer.

## Speech cold-coder recipe — S1/S2

Owner: speech coder. Files voiceService.ts, streamingSpeech.ts, soul.ts,
NatallyChatbot.tsx, NatallySprite.tsx, RetainedReadingAudio.tsx as needed, and only
speech/nudge sections of marketing.tsx. Read frozen R7. Preserve Supertonic ONNX.
Shared owner spans preparation/chunks/gaps/waiting/external playback; streaming
engagement claim persists until completed/cancelled. Busy idle returns false
before stopping or scheduling anything. Explicit requested speech may replace
old owner safely. Old callback cannot stop/release new owner. Guard async story
selection at all admission boundaries; discard rather than queue stale idle.

Append only admitted story; dedup authored ID OR normalized exact whitespace text.
Retain earliest row identity/time, user messages and distinct content. Clean existing
editable account duplicates and SOUL without touching immutable souvenir snapshots.
Report actual engine/runtime findings, source/import/type checks, and unobserved
audible branches. No Chatterbox change. Coordinate marketing balance patch with root.

## Release/environment cold-coder recipe — E1/E2

Owner: release coder. Files scripts/environment.mjs and new narrowly scoped
environment/runtime/provider deployment helpers, scripts/build-all-platforms.ps1,
configure-android.mjs, release-state.mjs, annotated .env.example/.env/.env.local,
required native build configuration only. No backend/client/architecture edits.
Resolve exact shared Android key from discovered canonical record; preserve other
working bindings. Default code Ch4n3l.C3351 and allowance10.00 in annotated env and
portable example; no campaign or obsolete creditQuantity dependency.
Use existing synchronized full environment and exact pre-edit checkpoints.

Recover only required declared provider credentials from canonical/current runtime.
Use real existing Firebase OAuth and managed runtime identity; no fabricated keys.
Deploy actual portable billing files to rochemediaservices-infra/us-central1 with
actual secrets and minimal necessary named-database access; frontend URL readback.
Configure actual catalog/Stripe/RevenueCat/tax/invoice bindings to frozen scope.
No mock prices/purchases. Do not submit a new customer charge without user action.

Android release requires resolved production signing fields, no debug fallback;
both APK/AAB fingerprints must equal configured expected fingerprint. Include billing
in source fingerprint. DO NOT start release before supervisor reviewed all code and
runtime bindings. Fresh full coordinator stamps1.30; Continue resumes same release.
No standalone version edit, no native artifacts via Git LFS. Preserve concurrent
icon changes and historical dist artifacts. Parent publishes source boundaries.

## Supervisor semantic review and release closure

For every task map each contract to actual source and observable behavior. Return
defects to its original coder, then review correction. Run lint/type/import and
meaningful real-data checks. Never claim tests passed if not run. Review entire
session diff against frozen architecture and baseline before README attestation.
Record honest remaining gaps instead of falsely certifying complete code/runtime.

Run only canonical all-platform coordinator; verify12 artifacts and expected signer.
Then coordinator DeployExisting to both domains; verify served release and bytes.
Recording requires actual continuous capture, not stitched screenshots.

## Preauthored continuous real demonstration rubric

| Scene | Requirement/tasks | Required observable evidence |
| --- | --- | --- |
| D01 | R1/B1/U2 | Actual signed-in account enters configured permanent code; durable receipt, usable configured-limit key, actual reading. Repeat SAME request has no duplicate effect; a NEW valid redemption remains allowed. |
| D02 | R3/R4/B2 | Provider usage and persisted delta agree; refresh/expiry recovery retains accounted funds; authorized redemption override/restoration works and is not prohibited. |
| D03 | R2/R3/B3/U1 | Retrieve operator's actual past transactions; recover missing credit once; repeated reconcile preserves same transaction receipts. |
| D04 | R6/B3/U2 | Purchase history button shows repeated real purchases; open/download actual invoice with seller/HST/address/currency/tax/payment facts. |
| D05 | R2/B4/U2 | Presets5/10/25, default5, no1; typed actual amount>5 reaches real exact checkout; user completes authorized real payment; confirmed40% tax-exclusive allowance and receipt. |
| D06 | R7/S1 | During actual reading, synthesis, chunk gaps, waiting and retained playback, idle story does not start/queue; after activity resumes, no stale non sequitur. |
| D07 | R7/S2 | Repeated same authored story and reload produce one lore entry; distinct story/user conversation retained. |
| D08 | R8/E2/R1/R2 | v1.30 both domains; all12 artifact identities and Android signer/symbol validation tied to source commit. |

Record capture path/hash, start/end, uninterrupted timecodes per scene, actual source/
release IDs and every limitation. Browser/device/provider proof are separate.
If an external control cannot be exercised, label that scene unobserved; keep the
task open, continue independent authorized work, and do not fabricate acceptance.

## Recipe attestation

I reviewed this recipe against frozen architecture013429f5 and the explicit
operator corrections recorded there. These independent assignments, interfaces,
dependencies and closure conditions cover the requested implementation and inherited
preservation boundary, nothing more and nothing less. Completion certification is
conditional on actual semantic review and recorded execution, not on this plan.
