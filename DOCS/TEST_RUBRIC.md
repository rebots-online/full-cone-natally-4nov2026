## Current evaluation-release clarification — 27 October 2026

The operator explicitly retains small tester prices for ordinary non-admin
accounts. The current requirements, free real-time speech correction, three-screen
card purchases, fulfillment and continuous scenes are in
[EVALUATION-RELEASE-2026-10-27.md](EVALUATION-RELEASE-2026-10-27.md).
These corrections supersede conflicting pricing or prerecorded-audio wording.
ER-T01 through ER-T04 remain IN_PROGRESS; every ER-S01 through ER-S08 observation
is NOT RECORDED. Google/DNS observations are in [INFRA/natally-public-entry.md](INFRA/natally-public-entry.md).

# Public test deployment rubric

## CP — Purchased prepaid inference and canonical identity, 27 October 2026

Goal amendment: the final rubric must cover the full active PRD and architecture,
not just CP01–CP20. Each actual recording ID and observed start/end timecode must
also be written beside the corresponding requirement in both specification surfaces.
Until recorded, use NOT RECORDED; never substitute planned scene IDs for timecodes.

This is the active external acceptance rubric for AD-20261027 in
`DOCS/ARCHITECTURE.md` and CP-T01–CP-T10 in `CHECKLIST.md`. It is authored before
replacement implementation. The detailed continuous script is
[CP-S01–CP-S12](DEMONSTRATIONS/2026-10-27-prepaid-purchase-screencast.md).

**Success condition:** a screencast of a real authorized purchase through the
working Natally paywall and Stripe, the same account's purchased prepaid inference
pack visibly preloaded and server-ready, followed by actual paid inference and the
remaining mapped recovery/delivery behavior. No mock settlement, administrative
balance edit, personal-key bypass or prerecorded answer counts.

Each CP01–CP20 requirement must have its task, scene, actual time range, recording
reference, expected behavior, observed behavior and PASS/FAIL status. Before a run
the status is NOT RUN; partial observation is INCOMPLETE, never a final pass. A
completed full run has verdict SHIP-READY only if every required clause passes;
otherwise DEFECTIVE. Missing infrastructure or operator-only payment/refund action
leaves acceptance unfinished and must not be disguised as an application success.

Retain one continuous source recording with actual audio, named stills captured
from it, build/source identity, provider receipt correlations and a SHA-256 manifest.
Use `../outbox/natally-ai-studio/screencasts/<run-id>/` for original media and
`DOCS/DEMONSTRATIONS/<run-id>/REPORT.md` for the committed redacted index. If an
approved external recording host is used, record its immutable media reference too.
Do not publish secrets, raw tokens, card details or unrelated customer information.
Record authentication/capture transitions honestly; never stitch independent
successes into a claimed continuous transaction. Secret entry may be shielded,
but the resumed account/order identity and timeline must remain demonstrable.

Historical rubrics below retain their prior evidence only. This correction does
not inherit their PASS status or waive unpaid gating, exact ten-turn semantics,
server-side custody, real Stripe payment or the complete prepaid purchase journey.

## NAT-DIR — Directed reading and atelier

The precise rubric was derived during ARCHITECTURE -> CHECKLIST and is the
single continuous computer-use script in
[the complete journey](DEMONSTRATIONS/2026-10-22-natally-complete-journey.md).
It includes SOUL and About/source access and maps DR-01..10 to scenes and actual
recorded observations. It replaces the former sampled ten-row gate table.
All observations are pending until the complete application is recorded.
No unit/integration/synthetic test or intermediate reviewer gates apply.
The older deployment section below is historical evidence, not additional gates
for this increment or proof that the current work has been demonstrated.

## Existing public test deployment

Scope: publish the existing built Natally web app at
`https://natally-test.surge.sh` while retaining the working production site.
This is a test-deployment acceptance run, not whole-product release certification.
Build/source and device are pinned in the run report before recording.

Follow Admin-Manual SC4 and TC11. Drive the published built app in a real browser,
without mocked identity, provider replies or application state. Record the whole
driven session. Store the MP4, indexed report and media ZIP under
`dist/rubric-runs/`. Every PASS requires direct observation and a named recording
timecode/seek link. A pending operator row prevents a complete acceptance verdict.
Do not run a unit-test suite or substitute build output, logs or asset hashes for
the recorded observations. Credentials are entered by the operator outside the
public recording; do not commit account secrets or private sessions.

| ID | Requirement | Driver | Steps / PASS criteria | Severity |
|---|---|---|---|---|
| DEP-1 | Public test URL serves Natally | AUTO | Open the HTTPS test URL. Observe Natally branding, mascot and the sign-in dialog, with readable controls. | BLOCKER |
| DEP-2 | Google and email entry points precede onboarding | AUTO | Observe Continue with Google and email/password Log In. Switch to Sign Up and back to Email Log In. The selected form changes; onboarding does not appear while signed out. | HIGH |
| DEP-3 | Google sign-in can begin from the test domain | AUTO | Click Continue with Google. Observe the actual Google authorization/sign-in window; an unauthorized-domain error or blocked OAuth flow is a failure. Do not enter credentials. | HIGH |
| DEP-4 | Production remains available | AUTO | Open https://natally.surge.sh in a separate fresh tab. Observe the existing Natally sign-in dialog with Google/email entry points. | BLOCKER |
| DEP-5 | Real Google sign-in and hosted reading | OPERATOR | Sign in with an authorized account on the test URL. Complete or load the profile, send a question and observe an actual hosted answer. Record the post-authenticated sequence without showing credentials. | BLOCKER |
| DEP-6 | Real email sign-in and returning profile | OPERATOR | Sign in with an existing email account on the test URL. Observe its own saved profile and a hosted answer. No synthetic account/session or stored-token injection. | BLOCKER |

The backend-origin configuration is isolated to the test deploy context. The
frontend selects that backend using `.env.test`; deploy with Vite `--mode test`.
Firebase must include the exact test domain while preserving existing domains.
Configuration receipts support these requirements but do not grant UI PASS.

Attestation in the run report names the driver, build, device, date and overall
verdict, and states which observations support each PASS. Until DEP-5/6 are
observed, the verdict is INCOMPLETE—pending-operator. Failed automated rows are
reported as DEFECTIVE and retain their recording evidence.

## PB — Product-baseline observation matrix, 27 October 2026

This expands P1/P3/P4/P5 into individual observations; it does not complete the
remaining section 0–15 or architecture-increment enumeration. Existing CP rows
remain required. PB rows have the same IDs in PRD, ARCHITECTURE and TEST_RUBRIC.
Every observation is mapped to checklist task PB-T01 and the continuous PB scenes
in `DOCS/DEMONSTRATIONS/2026-10-27-prepaid-purchase-screencast.md`. Write the same
actual recording ID and start/end timecodes beside each row in all three documents.
Named scenes are planned positions, never evidence or substituted timestamps.
Numeric source readback supplements the rendered observation; neither proves the
other alone. Open scope and longitudinal criteria remain visible and unfinished.

| ID | Original clause | Positive observation required / explicit precedence | Scene | Recording ID; start–end; verdict |
| --- | --- | --- | --- | --- |
| PB01 | P3.0 | Google account entry precedes account-owned application content. | CP-S02 / PB-S01 | NOT RECORDED |
| PB02 | P3.1 | First Light asks name, birth date, birthplace and birth time in the prescribed sequence with typewriter presentation. | PB-S01 | NOT RECORDED |
| PB03 | P3.1 / P5 | Unknown-time intake is usable; successful onboarding persists per account across two devices. | PB-S01 / PB-S06 | NOT RECORDED |
| PB04 | P3.2 / section 15 | Birth-time repair: approximate/unknown-time calibration and rising-sign boundaries. Section 15 leaves roadmap scope open; no deferral or implementation acceptance is inferred. | PB-S02 | NOT RECORDED |
| PB05 | P3.3 | Main conversation retains Natally, rotating natal wheel, transit badges and natural-language composer. Paid-generation gating replaces the historic trial variant. | CP-S06 / PB-S03 | NOT RECORDED |
| PB06 | P3.3 / P1 | Dawn/evening and time-of-day presentation responds to the actual supported viewing context. | PB-S03 | NOT RECORDED |
| PB07 | P3.4 | Atlas Natal exposes planetary positions and chart details. | PB-S02 | NOT RECORDED |
| PB08 | P3.4 | Atlas Synastry presents two distinct profiles and their dual-chart relationship. | PB-S02 | NOT RECORDED |
| PB09 | P3.4 | Atlas Today shows dated current-sky transit telemetry. | PB-S02 | NOT RECORDED |
| PB10 | P3.5 | People retains distinct profiles, charts and synastry links. | PB-S02 / PB-S06 | NOT RECORDED |
| PB11 | P3.6 | Contextual glossary explains astrological mechanics from actual chart interaction. | PB-S02 | NOT RECORDED |
| PB12 | P3.7 | Settings exposes and applies house-system selection. | PB-S04 | NOT RECORDED |
| PB13 | P3.7 | Settings exposes and applies notification cadence. | PB-S04 | NOT RECORDED |
| PB14 | P3.7 | Settings exposes and applies timezone anchoring. | PB-S04 | NOT RECORDED |
| PB15 | P3.7 | Privacy controls perform their described action and explain local versus cloud effects. | PB-S04 | NOT RECORDED |
| PB16 | P3.8 | About exposes lineage, methodology and manifesto, plus the canonical build identity required by CP02. | CP-S01 / PB-S04 | NOT RECORDED |
| PB17 | P3.9 / current precedence | Profile and payment entry use RevenueCat-backed prepaid access. Historic patron/heirloom-code controls are superseded by CP03–CP07, not additional launch payment systems. | CP-S02–CP-S05 | NOT RECORDED |
| PB18 | P4 tokens | Rendered surfaces, brass, coral, blue and typography match the approved design tokens and approved later atelier source. The historical mascot prohibition is superseded by the approved Natally character. | PB-S05 | NOT RECORDED |
| PB19 | P4 geometry | Geocentric ecliptic longitude places the ascendant at nine oclock; displayed coordinates agree between wheel and data surfaces. | PB-S05 | NOT RECORDED |
| PB20 | P4 geometry | Torus major/minor radii are 1.95/0.22; markings sit on its surface without obstructing celestial bodies. Correlate rendered view with the delivered source parameters on camera. | PB-S05 | NOT RECORDED |
| PB21 | P4 geometry | Interior zodiac radius 1.75, houses 1.48, aspects 1.05–1.15 and open reticle radius 0.16 match the delivered source and rendered layout. | PB-S05 | NOT RECORDED |
| PB22 | P4 geometry | T-square tension is coral; trines and sextiles are blue and correspond to the selected astronomical relationships. | PB-S05 | NOT RECORDED |
| PB23 | P4 geometry | Raycasting opens the correct body tooltip; contemplative drift and hover micro-pause are observable. Source-correlated drift is 0.0001–0.0003 radians per frame. | PB-S05 | NOT RECORDED |
| PB24 | P4 laws / P1 | Known-time Placidus semi-arcs and houses are correct; unknown time uses honestly labelled Whole Sign rather than fabricated precision. | PB-S01 / PB-S05 | NOT RECORDED |
| PB25 | P4 laws / P5 | Degrees, minutes, houses and astronomical values agree across HUD, matrices and tooltips and remain readable on desktop and mobile. | PB-S05 | NOT RECORDED |
| PB26 | P1 / P5 | Dark presentation, readable starlight typography, calm motion and continuous Natally presence survive conversation and chart navigation. | CP-S06 / PB-S05 | NOT RECORDED |
| PB27 | P5 conversion / current precedence | The actual paid-access conversion succeeds through the current paywall and prepaid flow; historic trial-to-patron/heirloom wording is superseded by CP05–CP09. | CP-S03–CP-S06 | NOT RECORDED |
| PB28 | P5 engagement / section 12 | Daily conversation and the historical 30-day retention criterion require real longitudinal evidence. A single recording cannot establish those metrics; show the actual dated evidence on camera when available. No invented users or elapsed time. | PB-S07 | NOT RECORDED |
| PB29 | P1 precision | Exact Placidus, ecliptic positions, aspect orbs and ASC/MC/DSC/IC agree with the specified ephemeris for the recorded inputs. Show reference values with inputs/date and delivered chart. | PB-S05 | NOT RECORDED |
| PB30 | P3 / goal public entry | The actual marketing/public entry opens the intended delivered app and makes its stated offer, purchase and return navigation usable. Link the approved marketing specification before claiming coverage of its copy/layout. | PB-S00 | NOT RECORDED |

## CTA-20261027 — Required direct purchase action for every USP

This records an existing operator request from the prior evening, reiterated on
27 October; it is not new optional scope. Every discussed undertaking remains
required unless explicitly deferred or cancelled by the operator.

Each marketing/app USP section must expose a prominent matching purchase action.
One click carries the selected product and source section directly to the offer's
purchase step. No mandatory read-more page, generic product chooser or repeated
selection intervenes. Necessary authentication and final provider confirmation
remain; they preserve that selection. A button that merely opens an unavailable
or informational screen does not satisfy this requirement.

| ID | Required observation | Task | Recording/timecode/verdict |
| --- | --- | --- | --- |
| CTA01 | Each public marketing USP has a visible, reachable matching purchase CTA on desktop and mobile. | CTA-T01 | NOT RECORDED |
| CTA02 | Each app USP/offer section has the matching reading or conversation purchase action, not a generic learn-more detour. | CTA-T01 | NOT RECORDED |
| CTA03 | One click preserves exact product and originating section through authentication to provider purchase confirmation, without repeated product selection. | CTA-T02 | NOT RECORDED |
| CTA04 | Price and actual SKU benefits agree with the selected offer; purchase/preload succeeds through the existing merchant and authority. | CTA-T02 / CP-T04 | NOT RECORDED |
| CTA05 | Cancellation returns to the originating screen with existing content preserved; switching account cannot reuse another customer's quote. | CTA-T02 / CP-T06 | NOT RECORDED |

Implementation bindings: `src/services/purchaseIntent.ts` defines the closed
`reading | conversation` intent and configured Natally RevenueCat product IDs;
`PurchaseCTA` in `PurchaseAccess.tsx` carries that intent plus a stable section ID.
`showOffer` retains the selected intent in its owner-bound operation; rapid CTA
changes replace/invalidate the older request rather than silently dropping the
new selection. `DownloadRequest` transports this selection as a non-authoritative
purchase request; the server validates it and supplies price/benefits/rights.
`LearnAndPayments` wires reading CTA at the atelier/reading section and lesson
application section, and distinct reading/conversation actions at their respective
payment explanations. Closing the guide occurs in the same click as opening the
selected purchase. Marketing and remaining app surfaces remain explicit inventory
work; these first call sites do not constitute coverage of every screen.

## PAYWALL-3 — Settled three-screen offer sequence

Operator clarification, 27 October 2026. State: IN_PROGRESS. This resolves the
previous question about the two opposing customer types and supersedes the
coordinator's proposed branch-first sequence and generic message-pack framing.

1. Full-workup screen: for customers seeking the complete reading and take-home
   souvenirs. One prominent offer card, headed by the $30 full workup and
   souvenir package, with plain-language point-form inclusions and one direct
   purchase CTA. The ten conversational turns support producing the thorough
   reading and substance for its souvenirs; they are not the principal product
   or a separate chatbot-message upsell. Preserve the specified PDF and saved
   interactive-reading deliverables and their existing terms.
2. Experiential screen: for customers seeking interactive personal exploration
   rather than the souvenir package. One prominent offer card for x402 or
   micropayment/prepaid conversational access, with point-form inclusions and
   one direct purchase CTA. Explain the experience and actual purchase terms;
   do not imply the $30 souvenir package or unlimited usage is included. Avoid
   unexplained internal currency names and generic chatbot-quota sales framing.
3. Comparison screen: reached if the customer continues past the two dedicated
   offers. Present both offer cards side by side as A/B alternatives so the
   contrast and customer fit are clear. Each card retains its own offer,
   inclusions, price/actual payment terms and direct matching purchase CTA.

The third screen compares; it does not precede the dedicated offers. Each
purchase action retains the exact selected offer through authentication and
checkout without a generic picker or another page of CTAs. The first two screens
must not force customers to reach the comparison screen before buying. Keep the
large bold offer heading, consistent card padding and prominent button; preserve
Natally's approved artwork and DESIGN.md direction. External tools own design.

The $30 offer must agree with the real catalog and checkout. Existing $0.99
tester products and the observed $2.99 legacy bundle are not evidence of a
working $30 purchase; do not relabel a mismatched checkout. RevenueCat remains
commercial authority and Firebase owns identity. Existing micropayment rails
retain their actual configured terms. No new provider or competing ledger.

Acceptance: record a direct full-workup purchase from screen 1 with its promised
reading/souvenir delivery and supporting conversation; record the experiential
purchase from screen 2 with prepaid allowance and actual inference; demonstrate
both matching actions and clear contrast on screen 3. Preserve account,
cancellation, restore, responsive and recording continuity. All observations
remain NOT RECORDED. CTA repair remains prerequisite to OpenUI design generation.

### Offer motivation — operator clarification

The distinction is not cheap versus rich or low versus high spending. Frame the
full-workup offer through the appeal of a wall-mounted, mahogany-framed,
motorized rotating natal-chart award: a personally meaningful object to keep
and display. Frame the experiential offer through exploring alongside a guru.
Lead each screen with its corresponding value, not chatbot-message quotas or
payment mechanics. The third screen contrasts those motivations with the two
cards side by side. Preserve the $30 full-workup terms and the supporting role
of its ten conversational turns. Do not invent physical fulfillment terms or
silently substitute a different souvenir; match displayed inclusions to the
specified and actually deliverable package.

This supersedes any rich/cheap customer segmentation and the generic
conversation-pack presentation in earlier drafts. It is the operator's framing,
not an invitation for the coordinator to choose a new design. All three screens
and their real purchase paths remain IN_PROGRESS / NOT RECORDED.
