# CP — Continuous real purchase, prepaid preload and inference

Authored 27 October 2026 before replacement implementation. Status: NOT RUN.
Authority: AD-20261027 in `../ARCHITECTURE.md`; recipe: CP-T01–CP-T10 in
`../../CHECKLIST.md`; verdict: `../TEST_RUBRIC.md`. This is an external end-user
acceptance script, not evidence that any scene has passed.

## Recording envelope

Use the operator-authorized account, existing Stripe merchant and selected actual
product. Record environment, exact allowed amount, refund permission, approved
device(s), deployed URL, source commit, build invocation/version/time and recording
destination before purchase. CR01–CR05 must already be resolved. A test-mode
transaction is labelled test-mode and cannot satisfy real purchased acceptance.
Do not manufacture an authorization, customer balance, provider response or receipt.

Record one coherent session with sound, visible clock and preserved state. Protect
credentials outside the public capture without hiding purchase outcome or mixing
accounts. Resume at a documented timecode after an essential private step. Screen
capture, operator action and payment-provider observation are separate evidence
sources; record who performed each action. Record mobile/desktop transitions and
reuse the same funded account. Do not erase a real profile merely to obtain an
onboarding scene; use the expressly authorized fresh account/profile.

## Continuous scenes

| Scene | Entry state and carried state | Actual actions/inputs | Required observable result | Mapping / named evidence |
| --- | --- | --- | --- | --- |
| CP-S01 | Fresh browser on the delivered HTTPS app; no fabricated access | Start recording; show build artifact receipt, remote source identity, app bottom-right version and About; close About | Same canonical version/build timestamp as prescribed invocation, exactly one badge, real app and reachable account entry | CP01/02/19; T01/T09; `01-build-entry` |
| CP-S02 | Same app/account entry | Sign in with authorized Firebase account; complete approved onboarding or load its profile; observe RevenueCat customer correlation through redacted operator view | Correct UID mapping; Natally faces user in atelier with chart inset; first generated reading has not bypassed the purchase gate; funded returning account variant is explicitly recorded later | CP03/04; T02/T03; `02-account-atelier` |
| CP-S03 | Unfunded authorized account in atelier | Open paywall; navigate its pages; show quote, benefits, currency, legal links and restore; close it; explore chart/room; ask Natally for interpretation; exercise keyboard and narrow viewport | Exact approved paywall source; free exploration remains usable; canned voice invitation reopens same paywall without a generated answer; focus/close/back and badge remain accessible | CP02/04/05/18; T01/T03/T09; `03-paywall-and-exploration` |
| CP-S04 | Same customer and saved interpretation request | Select the authorized prepaid pack; show selected quote; cancel once and return; reopen and submit the permitted real card payment using protected credential entry | Cancel grants nothing; real checkout is linked to the configured Stripe merchant and correct product/currency/amount; show pending or confirmed outcome truthfully | CP05/06; T03/T04; `04-checkout` |
| CP-S05 | Same order after payment; no manual balance change | Follow return to Natally; show Stripe succeeded/settled transaction, matching RevenueCat purchase/grant, UID and access state through redacted provider views | One purchase/grant; purchased pack balance/turns visibly preloaded and backend-ready before consumption; same-account capability refresh and one server key hash; no provider bearer exposed | CP06/07/08; T04/T05; `05-paid-preload` |
| CP-S06 | Same funded account and saved first-reading request | Return to app and let first reading resume automatically; hear real Natally speech; observe chart focus/karaoke; ask one real follow-up; replay owned response | One first request despite callback/reload possibilities, actual provider-backed answer, actual audio/motion, correct turn/credit change; tools/TTS/replay do not add charges; record before/after values | CP02/09/10/18; T01/T05/T09; `06-paid-inference` |
| CP-S07 | Remaining purchased allowance and recorded usage | Buy one explicitly authorized top-up through same paywall; observe preparation/ready; ask a subsequent question | Previous remainder and usage preserved; one added allocation, same key hash/generation; exact per-SKU credit/turn rule and quote; no reset or duplicated allowance | CP08/10/11; T04/T05; `07-top-up-and-use` |
| CP-S08 | Same settled purchases and completed requests | Refresh; close/reopen; sign in again if needed; use Restore/Check access; follow real duplicate/delayed webhook recovery in provider view; interrupt network at the authorized point and recover | Funded user is not required to repurchase; same receipt/request identities, no duplicate grant/inference, preserved pending request and durable balance; no fabricated event counts | CP03/12; T02/T04/T06; `08-restore-recovery` |
| CP-S09 | Same browser with account A's paid work | Start an authorized pending access request; sign out and into authorized account B; return to A | B sees no A balance/reading/key/response; stale A reply is rejected; A restores its own purchase without new key or grant | CP03/08/13; T02/T05/T06; `09-account-isolation` |
| CP-S10 | Account A restored, remaining allowance known | Exercise authorized finite allowance exhaustion and real provider/network recovery; observe retry of the same interrupted request | Exact remaining units/turns, no overspend or second charge, clear exhausted/unavailable/reconciliation state; only confirmed failure releases reserved credit; no fake backend failure passes this scene | CP10/14; T05/T06; `10-exhaustion-recovery` |
| CP-S11 | Same operational journey with purchase references preserved | Exercise separately authorized refund and restore; each required configured Lightning/x402 payment; open purchased downloads and full-workup frozen SPA/PDF when included | One compensation, consumed usage retained, revocation survives restore; each rail settles against exact quote into same customer; owner-only deliverables match observation/summary and promised term. Missing permission/configuration/delivery leaves these clauses unfinished | CP15/16/17; T06/T07/T08; `11-reversal-rails-delivery` |
| CP-S12 | Return to funded authorized account and delivered app | Show final working reading/replay, balance and version on desktop/mobile; show remote commit/artifact receipt; finish recording and populate every row | All required states and effects observed; build/source/deployment identity agrees; no missing clauses; original media and redacted evidence index retained | CP01/02/18/19/20; T01/T09/T10; `12-final-state` |

CP-S05's automatic transition into CP-S06 must remain captured; do not delay the
app artificially to stage screenshots. Provider readback can be shown in a second
recorded operator window with correlated transaction timestamps. The purchased
allowance must be observed before its first debit even if automatic inference
starts promptly. Background model prefetch cannot consume unpaid allowance.

## Imported product requirements remain accounted for

- The approved full onboarding, fixed Natally identity/voice, atelier interactions,
  chart navigation/attention, karaoke, replay, responsive behavior and About/source
  journey remains required in CP-S01/S02/S03/S06/S12; prior recordings are not new
  acceptance of the corrected release.
- The full-workup ten-turn PDF/SPA summary and one-year frozen observation contract
  remains in CP-S11. The tester SKU does not prove the full-workup deliverable.
- Literal ROCHE shared credits, account isolation, actual Stripe, existing
  Lightning and x402 rails and refund/recovery remain mapped. An unavailable rail
  or delivery surface is recorded as unfinished, not silently removed.
- Store publication, new infrastructure migrations and new provider choices are
  not authorized by this recording script. Existing unresolved decisions must be
  resolved during architecture closure rather than improvised on camera.

## Evidence report fields

For each CP01–CP20 clause record: `requirementId`, `taskIds`, `sceneIds`,
`recordingFile`, `startTimecode`, `endTimecode`, `stillFiles`, `expected`, `observed`,
`verdict`, `redactedReceiptReferences`, `defectOrOutstandingWork`. Also record
`runId`, UTC date, driver, device/browser, environment, deployment URL,
`sourceCommit`, `remoteCommit`, `version`, `invocationId`, artifact and media
SHA-256, authorized payment/refund scope and approval reference.

Every row begins NOT RUN. No placeholder timecode, screenshot of a static mock,
administrative grant, local assertion or catalog listing can become PASS. Preserve
failed observations. Repair actual defects without lowering the rubric, then
record the corrected coherent journey. Original media lives in the external
outbox; its non-secret index and architecture/checklist changes are committed and
remotely verified. The overall result remains unfinished until every required
observation exists and the complete recording meets the operator's success condition.

## PB — Product-baseline extension of the same continuous session

Interleave these observations with CP-S01–12 while preserving the account and
purchased state. Do not assemble independent successful clips. Each PB row gets
its own observed start/end range; one scene-wide range is valid only when it
actually contains the entire stated observation. PB-T01 governs all rows.

| Scene | Placement and real actions | Required observations |
| --- | --- | --- |
| PB-S00 | Before CP-S01, open the delivered marketing/public entry; read actual offer and follow app entry and return links. | PB30; record actual URL and approved source/specification binding. |
| PB-S01 | During CP-S02, complete authorized fresh-account intake, demonstrate the unknown-time path without deleting a real profile, then use the known-time recorded profile. | PB01–03, PB24; show sequence, time precision and actual labels. |
| PB-S02 | During free exploration, open Natal, Today, People and authorized second-profile Synastry; inspect tooltips/glossary and birth-time repair. | PB04, PB07–11; missing surfaces stay failed/unobserved, never bypassed. |
| PB-S03 | During CP-S06, show actual composer, reply, transit badges, wheel and supported time-of-day variants. | PB05–06, PB26; actual voice and motion remain captured. |
| PB-S04 | After owned reading, open Settings and About; change and restore each supported setting. Exercise privacy only on expressly disposable data. | PB12–16; show persisted effect, methodology, lineage, privacy boundary and canonical stamp. |
| PB-S05 | During chart exploration and CP-S12, compare ephemeris inputs/reference values with HUD/matrix/tooltips, inspect aspects and reticle, hover and resume motion, show delivered geometric parameters; repeat narrow and desktop views. | PB18–26, PB29; preserve real chart state and identify source/artifact. No source-only visual pass. |
| PB-S06 | During CP-S08/S09, reopen the same funded profile on the second approved device and switch accounts, preserving both profiles. | PB03, PB10 and CP12/13; no repeat onboarding or cross-account data. |
| PB-S07 | Near final evidence review, show actual dated engagement/retention evidence and actual purchase conversion. | PB17, PB27–28; absent longitudinal evidence remains unfinished. |

The original Figma Make export retrieval was attempted again on 27 October.
`get_design_context` returned source references including `public/paywall.html`,
but `resources/read` returned `Unknown resource`. `create_session` does not support
Make files. These are integration observations, not a rendered paywall pass or
permission to substitute a recreated design. Original integration remains open.

## Adapter development observation — 27 October 2026

Source `74193ee` mounts the recovered original paywall in PurchaseAccessProvider.
The development server was started through `npm run dev` on localhost:49418.
Chrome loaded the actual sign-in screen and canonical `v0.9.84736` badge. This is
the existing consumed stamp in development, not a newly stamped release.
Selecting Continue with Google returned `Firebase: Error (auth/unauthorized-domain)`.
No authenticated paywall, checkout or purchase was observed in this local run.
Firebase authorized-domain configuration was not changed. This observation is
unfinished runtime work and cannot fill any successful screencast timecode.
The original-source retrieval failure noted above was resolved through browser
Download code; its preserved source and hashes are in the Figma reference folder.
