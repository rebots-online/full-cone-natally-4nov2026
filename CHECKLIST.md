## Paywall legal pages — 26 October 2026

- ✅ Publish `public/terms.html`, `public/privacy.html` and shared `public/legal.css`
  as unauthenticated HTTPS documents on natally.surge.sh; HTTP 200 and exact
  deployed-byte readback verified for both pages, stylesheet and app index.
- ✅ Link Terms/Privacy from PurchaseAccess and About; record absolute RevenueCat
  destinations in README. Chrome displays both documents and follows the privacy link.
- ✅ Use operator-confirmed Roche Media Services identity and
  support@rochemediaservices.com. Record domain/renewal/future WooCommerce/shared
  $ROCHE direction in Admin-Manual infrastructure section 3.2.1 and KStore.
- ✅ Production Vite build passes. Existing full type-check failure remains at
  tests/mascot.test.tsx:16 (`avatarUrl` removed from NatallyAvatarProps); verified
  in pre-change HEAD. No legal-page build failure.
- ✅ KStore INFRASTRUCTURE.md revision 3: PostgreSQL and served byte-exact readback.
  Semantic verification reports postgres 25 versus Qdrant 0 head-revision entities;
  receipt is DOCS/LEGAL-KSTORE-RECEIPT.json. No semantic-index success claimed.

## Post-onboarding reading gate — 26 October 2026

- [X] 🟨 Record the operator's corrected flow and Mermaid diagram in
  DOCS/BILLING-SPEC.md: atelier with natal chart inset, existing allowance skips
  checkout, otherwise prepaid/x402/package purchase before any generated reading.
- [ ] 🟩 Register the RevenueCat customer; use the trusted UID/provider/environment
  key hash as the creation guard. Reuse present hashes; serialize absent-hash creation
  and reconcile unknown outcomes. Verify no duplicate key on sign-in or browser reset.
- [ ] 🟨 Gate all inference entry points after onboarding; show the first paywall in
  the atelier, preserve unpaid chart/atelier exploration, and automatically start
  the saved first reading once payment and server key readiness are verified. Prove no
  duplicate generation/allocation on callback, webhook, reload or retry.
- [ ] 🟥 Preserve unpaid chart click/zoom/focus/hover/rotation, atelier navigation
  and scene interactions. Typed/spoken requests play one fixed local Natally upsell
  and reopen the paywall without an LLM request, overlapping speech or a charged turn.
- [ ] 🟨 Build the dismissible multi-step paywall with one benefit per page, a small
  options CTA per benefit page, and final "For every budget" offers: full workup
  ($30 after testing), shared ROCHE packs, separate x402 express action. Keep tester
  prices; verify the price-bound CTA, back/reopen, skip-to-options and funded bypass.
- [ ] 🟦 Implement the proposed authenticated inference relay before claiming the
  app never receives a managed key. Store ciphertext/hash server-side; RC attributes
  may mirror status but never authorize creation, balance, capabilities or secrets.
- [ ] 🟨 Define/version the frontier benchmark and ROCHE denomination; implement
  floor(40% eligible USD / benchmark USD per token), shared reservations and observed
  cost debits with fractional residue. Reconcile existing units/grants across apps;
  never double-allocate ROCHE into independently spendable provider key budgets.
- [ ] 🟦 Add shared provider-capacity checks and a configured, funded paid route
  when openrouter/free is exhausted. Document implemented settings in .env.example;
  verify quota races, pending recovery and preservation of existing paid allowance.
- [ ] 🟪 Observe new unpaid, already-funded, x402, prepaid-credit and qualifying
  package journeys through first reading on desktop/mobile. Full PDF/SPA delivery
  remains a separate prerequisite for advertising that complete package.

## Live payment rails and authoritative customers — 25 October 2026

- [X] 🟨 Implement RevenueCat Web Billing, Alby/Blink Lightning and x402 exact EVM
  adapters, durable orders/receipts, idempotent grants, refunds, managed keys and turn accounting.
- [X] 🟩 Use verified Firebase UID for every RevenueCat customer; project fresh
  RevenueCat capabilities into Firebase custom claims and an owner-readable document.
- [X] 🟨 Explicitly bind literal ROCHE; create Natally Web Billing app, two consumable
  products, two package attachments and Natally capabilities. Corrected $0.99 store
  plan applied; configured-price readback confirmed both amounts. No payment made.
- [X] 🟫 Document server/client configuration and live activation steps in .env.example
  and DOCS/LIVE-PAYMENTS-2026-10-25.md. Twelve focused billing tests and production build pass.
- [X] 🟫 Publish source and generated assets on origin/codex/live-payments; deploy
  Surge release 1792984505278. HTML/entry JS/CSS byte parity verified; signed-out
  browser screen renders with no captured warnings/errors. Both Netlify functions bundle locally.
- [X] 🟨 Install non-secret production catalog settings and server-only webhook
  authorization/encryption secrets in the existing Netlify project.
- ✅ 🟩 Firebase session 5DF56 authenticated as robinsaiworld@gmail.com. Project and
  web-app display names read back as Natally; Google OAuth brand also saved as Natally
  (26 October). Existing project/app/database IDs preserved; account mapping recorded.
- [ ] 🟩 Install scoped runtime credentials and deploy owner-read/server-write
  capability rules. Branded auth-domain migration remains separate from display names.
- [ ] 🟨 Install RC server and OpenRouter management credentials, database,
  receiving Lightning wallets and x402 facilitator/network/asset/payee settings.
- [ ] 🟨 Register the scoped RevenueCat production webhook. Automatic approval review
  rejected registration with its authorization secret (reason: blocked by policy).
- [ ] 🟫 Resolve Netlify cloud build failure (latest deploy 6adec78f312a64be993861d0,
  building-site exit code 4); current connection cannot retrieve detailed build logs.
  Existing backend remains published. Verify authenticated payment → RC → Firebase → access.
- [ ] 🟪 Real payments, refunds, restore/account switching and physical-device acceptance.
  Cloud frozen archives and PDF/SPA summary revisions remain separate unfinished work.

## Reading attention and reciprocal navigation — 25 October 2026

- [X] 🟦/🟪 Welcome/preparation stays in the atelier; reading audio takes the chart
  at its first playback callback, including streaming and replay. One viewport
  jump, 240 ms transition, chart held through subject-clear cues; manual room
  controls remain available. Opening prompt briefly leads attention to the chart.
- [X] 🟦 Full-length coral glow for focused natal/current square aspects, retaining
  cyan dashes on current-to-natal connections. Only calculated aspects are drawn.
- [X] 🔴 “Now focusing on” returns to the active karaoke word or linked passage
  without clearing focus or interrupting audio.
- ✅ Ten focused camera/karaoke tests and production build pass. Broader checks
  retain the mascot-test avatarUrl type error and old 48-cue-limit assertion.
- ✅ 🟫 Source published; Surge release 1792941816313 entry/JS/CSS byte parity
  verified. Live TTS first word and retained WAV take the chart; reverse link
  preserves playback/highlight and returns paused passages at 390 px. Natal and
  current squares visibly glow. Evidence in the existing atelier demonstration.
- [ ] 🟪 Physical-device/listening and a fresh generated opening on this release
  remain unverified; the new introductory prompt has not had a listening review.

## First-run completion — 25 October 2026

- [X] AF-5 (AF08–AF10): 10:08 / 29,213,390-byte natal WAV saved and replayed on the deployed release; production diagnostics quiet; share action consolidated.

| Task | State | Architecture | Required visible outcome |
| --- | --- | --- | --- |
| AF-3 | COMPLETE | AF05–AF06 | Welcome is spoken before reading speech while real natal generation starts immediately; route visible from entry |
| AF-4 | IN_PROGRESS | AF07 | First light → onboarding → 1,793-word natal → 717-word clarification → explicit 1,928-word horoscope; complete natal WAV replayed. Initial erase confirmation outcome not observed; second recording still playing. See demonstration. |

Evidence: DOCS/DEMONSTRATIONS/2026-10-25-atelier-first/README.md. These observations supersede the older first-run and audio-retention limitations only to the stated scope.

## Reading recovery and specialist paywall source — 24 October 2026

- [X] 🟦 Camera repair deployed: follow new readings/replays, respect clear cues,
  return to the atelier when discussion ends. Real desktop narration traversed
  chart → room and retained complete audio; automated regressions pass.
- [X] 🟦 Opening no longer waits for greeting audio; welcome-only sessions recover.
  Isolated browser reproduces old failure and passes natal → horoscope with mocks.
- [ ] 🔴 Physical reset/onboarding journey remains open; no real history erased.
- [ ] 🟪 Waiting clips regenerated from pinned F4 at sixteen steps and deployed.
  Physical-device listening/intelligibility and the reported deeper voice remain
  acceptance gates, not inferred from model identity or file parity.
- [ ] 🟨 Figma Make generated the paywall; original HTML export is blocked by its
  bot verification. No integration or working checkout claimed. See
  LIBS/UI/FIGMA/reading-paywall-20261024/README.md.
- [X] 🟫 Source pushed; release 1792891705961 live, application and waiting WAV byte
  parity verified. Build passes. Type-check retains the existing mascot-test error.
  Evidence: DOCS/DEMONSTRATIONS/2026-10-24-reading-recovery.md.
## Atelier-first workspace — 24 October 2026

- [X] 🔴 Put the atelier beneath a compact header; avatar Profile at top right,
  Readings/Help in its menu, contextual chart sharing beside the conversation.
  Remove the welcome purchase banner and automatic post-onboarding offer.
  Keep technical telemetry and observation controls behind Chart details.
- ✅ 🔴 Live Chrome: 390×844 and 1440×1000 layouts have no horizontal overflow;
  Profile opens Readings/Help, contextual sharing opens export, chart-time update
  advances the visible observation. Physical-device verification remains open.
- [ ] 🟨 Replace personal-key entry with RevenueCat/x402/Bitcoin Lightning purchases.
  Initial RevenueCat readback found no Natally paywall or products; this
  checkout has no configured x402 or Lightning merchant endpoint.
  Personal-key form removed; payment-method availability is shown honestly.
  RevenueCat draft pw5593c7341acd4ef5 and custom package pkge2996aa8ae5 created;
  no product, charge, paid grant or working checkout is claimed.
- [X] 🟫 Layout and key-form removal deployed to Surge and published to GitHub.
  Live entry/JS/CSS match the build bytes. Account access check still works.
  Purchases, first-time onboarding and physical-device acceptance remain open.
  Build passes; type-check retains two existing errors (chatbot callback and
  mascot test). Evidence: HOSTED_CHAT.md, 24 October atelier entry section.

## Streaming readings — 23 October 2026

- [ ] ST-1: ST01 delivered; real SSE text/model observed. Complete tool/continuation/account-interruption variants remain open. Scenes S1–S4.
- [ ] ST-2: ST02–ST03 delivered; real overlapping text/playback, complete short-reading retention, stable Stop with continued text and no final restart observed. Physical/acoustic and complete S4 variants remain open.
- [ ] ST-3: ST04 delivered; Insta-now draft and later completed saved horoscope observed across a recording interruption. Its overlap timing and S5 modal path remain unobserved.
- [ ] ST-4: ST05 delivery and actual 390px recordings/timing captured. Full S1–S5, physical/audio acceptance and upstream first-token latency remain open. See DOCS/DEMONSTRATIONS/2026-10-23-streaming-observations.md.

Architecture/rubric: DOCS/ARCHITECTURE/2026-10-23-streaming-readings.md.

## Automatic access and mobile recovery — 23 October 2026

- [ ] AR-1: AR01–AR03 delivered; Disconnect → request → automatic development-key installation observed without key entry. Other-account/expiry variants remain open. Scenes A1–A4.
- [ ] AR-2: AR04 delivered; genuine access error, settings/retry and composer reachable at 390px; composer/overflow at 360px observed. Physical phone/complete A5 variants remain open.
- [ ] AR-3: AR05 server/SPA delivered, secret absent from static assets, source published. Complete A1–A5, physical phone and paid provisioning remain open.
- [ ] AR-4: AR06 delivered; coherent subsequent real reply observed, actual models retained. Narrow corruption rejection has not recurred live; personality acceptance remains open.

Architecture and pre-authored rubric: DOCS/ARCHITECTURE/2026-10-23-access-recovery.md.

## Language, mobile cookies and control cleanup — 23 October 2026

- [ ] LC-1: LC01–LC02 implemented and deployed. Neutral chat reply retained Gen-Z diction without a coordinate inventory after retry; Full Merlin comparison timed out at OpenRouter. Generated-reading attempt completed, but Robin reports continued academic wording and missing Gen-Z voice. Voice repair is not accepted. Model-policy decision pending after confirmed random routed-model variability.
- [ ] LC-2: LC03 implemented/deployed; phone-width Chrome touch, independent targets, four bites, touch drag, plate return and keyboard observed. Real 18-second sequence recorded. Physical Android and acoustic crunch acceptance remain open.
- [X] LC-3: LC04 delivered and observed in phone-width/desktop Chrome: ellipsis/dock selector removed, centered controls, direct motion toggle and pointer/keyboard inset movement. Refresh clears a formerly obstructing inset from the plate. Physical-device/reduced-motion variants remain part of the wider journey.
- [X] LC-4: LC05 obsolete Moldavian UI/persona copy removed; stored legacy preference ID preserved. Live header and replay tooltip show Natally’s voice.
- [ ] LC-5: LC06 build, Surge deployment, GitHub master publication and entry/bundle parity verified. Cookie/control trajectory recorded; complete language/provider and physical-device rubric remains open. See DOCS/DEMONSTRATIONS/2026-10-23-language-cookie-observations.md.
- Script/rubric: DOCS/DEMONSTRATIONS/2026-10-23-language-cookie-controls.md. Existing pending work below remains pending.

# IMPLEMENTATION CHECKLIST & TASK RECIPE

## Active correction: voice and character cutout

Architecture: DOCS/ARCHITECTURE/2026-10-23-voice-and-cutout.md.
Continuous rubric: DOCS/DEMONSTRATIONS/2026-10-23-voice-and-cutout.md.

| Task | State | Entity references | Continuous scenes |
| --- | --- | --- | --- |
| VOICE-CUT-1 | IN_PROGRESS | VC01–VC03, VC08 | 2–4: fresh character-led chat and substantial current horoscope; live formal reply requires final-delivery voice anchoring |
| VOICE-CUT-2 | COMPLETE | VC04–VC06 | Live waiting audio contains the full “Let me take a closer look”; tight head/antenna silhouette remains clean through idle, speech and scrying. See voice-and-cutout observations. |
| VOICE-CUT-3 | IN_PROGRESS | VC07 | Published with a continuous 43.25-second idle → question → waiting → scrying clip; complete reading/personality trajectory remains open after provider errors. |

## Active integration discovery: Zight MCP content publishing

Contract and entity references: DOCS/INTEGRATIONS/ZIGHT-MCP.md, Z01–Z05.

| Task | State | Entity references | Evidence |
| --- | --- | --- | --- |
| ZIGHT-1 | COMPLETE | Z01–Z03 | MCP registered and OAuth connected; authenticated inventory captured in DOCS/INTEGRATIONS/ZIGHT-MCP-TOOLS.json with eleven tools, including start/complete file reply |

Z04 collection identity, Z05 callback delivery and Natally's own publishing module
remain pending. This completed discovery task does not complete the paid archive
or any existing opening/billing task. The next implementation delta must enumerate
its code entities and extend the continuous billing/archive demonstration before
coding; use the actual returned upload request as the protocol contract.

## Active correction: two-response opening

Architecture: DOCS/ARCHITECTURE/2026-10-23-opening-sequence.md.
Continuous rubric: DOCS/DEMONSTRATIONS/2026-10-23-opening-sequence.md.

| Task | State | Entity references | Demonstration |
| --- | --- | --- | --- |
| OPEN-1 | IN_PROGRESS | O01–O03, O05, O07–O09 | Scenes 1–5: hidden welcome/natal/current sequence, voice and chart control |
| OPEN-2 | IN_PROGRESS | O04 | Scenes 2–4: completed provider responses and bounded continuation |
| OPEN-3 | NOT_STARTED | O06, B01–B16 | Scenes 1–6: deployed continuous journey and purchase integration |

## Active addition: verified purchase → user-key provisioning

Separate specification: DOCS/BILLING-SPEC.md. Architecture entity references:
DOCS/ARCHITECTURE/2026-10-23-billing-provisioning.md. Continuous rubric:
DOCS/DEMONSTRATIONS/2026-10-23-billing-provisioning.md. This supersedes earlier
billing deferral and Swiss-only Netlify placement; no LLM relay is reintroduced.

| Task | State | Requirements | Entity references | Continuous scenes |
| --- | --- | --- | --- | --- |
| BP-1 | COMPLETE | BP01–BP12 specification and architecture | B01, B14–B16 | BJ1–BJ9 rubric authored before coding |
| BP-2 | IN_PROGRESS | BP10 onboarding save correction | B13, R01–R04 | BJ1 / JR1–JR3 |
| BP-3 | IN_PROGRESS | BP01, BP06–BP08, BP11–BP12 client purchase/access flow | B02–B04, B12, D01–D03 | BJ2–BJ7 |
| BP-4 | NOT_STARTED | BP02–BP06, BP09, BP11–BP12 verified provisioning, turns, summaries and recovery | B05–B12, B15–B16 | BJ3–BJ8 |
| BP-5 | NOT_STARTED | BP01–BP12 delivery and complete observed journey | B01–B16, D01–D05 | BJ1–BJ9 |

Four task states: NOT_STARTED, IN_PROGRESS, BLOCKED, COMPLETE. BP-1 is a document
task; source implementation or deployment does not complete the behavioral tasks.
Bundle is $30 PDF + one year hosted SPA + ten completed conversational turns,
summarized in PDF and SPA. Internal provider ceiling is a cost provision, not $12
or 40% of the bundle. Personal development key remains unlimited. Six cost settings
include fixed-cost subsidy for pay-as-you-go users; unknown amounts remain unmeasured.

BP-3 source checkpoint: B02/B03 verified-response client and Account recovery control
implemented; B04 actual purchase callback still requires RevenueCat catalog/SDK
connection. B12 experiment knobs exist in .env.example and the ignored operator .env.
BP-2: readingStyle schema correction ffaa6ad published to the named Firestore database;
live Begin now saves the profile, opens the offer and queues the full first reading.
The reading itself remains unfinished: the provider response exceeded the existing
deadline and the UI mislabeled the aborted body as unreadable.
Delivery observations: DOCS/DEMONSTRATIONS/2026-10-23-billing-delivery-observations.md.
Billing client and corrected deadline deployed at source 69aa0b8; paid provisioning
is not connected. Subsequent RevenueCat CLI OAuth reconnection is confirmed valid,
with authenticated Natally offering/app/product readback; MCP's separate token is
still expired. No Natally Web Billing app or assigned product/price exists yet.

## Active correction: direct user-key inference

Architecture: DOCS/ARCHITECTURE/2026-10-23-direct-user-inference.md.
This supersedes RP-2's temporary relay commit 212837f (not deployed).

| Task | State | Requirements | Entity references | Continuous scenes |
| --- | --- | --- | --- | --- |
| DI-1 | IN_PROGRESS | DI01–DI05, RP03–RP05 | D01–D04, R01–R04, R07–R08 | JR0–JR6 |
| DI-2 | NOT_STARTED | DI01–DI05, RP01–RP05, DL01 | D01–D05, R01–R04, R07–R08 | JR0–JR6 |

Use Robin's personal key as the current user's inference key through the
same account-scoped contract later supplied by billing. Remove the LLM relay.

## Active scope: restart and OpenRouter — 23 October 2026

Architecture: DOCS/ARCHITECTURE/2026-10-23-reading-provider-and-calculation-service.md.
Four states: NOT_STARTED, IN_PROGRESS, BLOCKED, COMPLETE. Source publication and
observed product completion are recorded separately. Every referenced entity is
enumerated in that delta or the existing whole-codebase snapshot.

| Task | State | Requirements | Entity references | Continuous scenes |
| --- | --- | --- | --- | --- |
| RP-1 | IN_PROGRESS | RP01, RP02, RP05 | R01–R04, R07–R08; V01–V03 | JR1–JR3, JR5 |
| RP-2 | IN_PROGRESS | RP03, RP04 | R05–R06, R09 | JR3–JR4, JR6 |
| RP-3 | NOT_STARTED | RP01–RP05, DL01 | R01–R09; V01–V06 | JR1–JR6 |

Script: DOCS/DEMONSTRATIONS/2026-10-23-restart-openrouter.md. Implement RP-1 and
RP-2, committing and pushing each; transport is now superseded by DI-1/2.
Use Robin's replacement personal key supplied October 23 from `.env` or environment.
The separate October 23 management key is reserved for later provisioning. The later
billing-issued key provisioning and portable ephemeris service remain architecture
follow-ups. Direct inference itself is current implementation scope.

## Atelier repair — 23 October 2026

Four states: NOT_STARTED, IN_PROGRESS, BLOCKED, COMPLETE. COMPLETE requires the
recorded result; source delivery alone leaves a task IN_PROGRESS. Requirements
AR01–AR09 and references E01–E16/P01–P10 are defined in
DOCS/ARCHITECTURE/2026-10-23-atelier-diff.md; all baseline syntax occurrences and
semantic entities are enumerated in DOCS/ARCHITECTURE/SNAPSHOT. No coder reference
outside these inventories is authorized without first extending the architecture.

| Task | State | Requirements | Enumerated entity references | Continuous journey |
| --- | --- | --- | --- | --- |
| A23-1 | IN_PROGRESS | AR01–AR04, AR09 | E01–E08, E13; P01–P03, P07–P08, P10 | J1–J7 |
| A23-2 | IN_PROGRESS | AR05–AR06 | E09–E14; P04–P05, P09–P10 | J2–J7 |
| A23-3 | IN_PROGRESS | AR07–AR08 | E13, E15–E16; P06 | J1, J4, J6–J8 |
| A23-4 | IN_PROGRESS | AR01–AR09 delivered continuity | E01–E16, P01–P10 | J1–J8 plus existing complete journey |

Execute A23-1 (audio), A23-2 (idle acting), A23-3 (production boundary), then
A23-4 (delivery and continuous demonstration). Commit and push each source task.
The exact rubric and filming script were authored before implementation in
DOCS/DEMONSTRATIONS/2026-10-23-atelier-repair-journey.md. Retain the existing
onboarding-to-reading-to-export trajectory and its outstanding obligations; this
increment does not relabel those as complete or introduce ephemeris extraction,
billing completion, public licensing decisions or the later repository split.

Delivery checkpoint: source tasks are committed and pushed through `3d6c343` and
deployed to natally.surge.sh. Live room/inset recordings, isolated crash audio,
refresh persistence and production-control observations are recorded in
DOCS/DEMONSTRATIONS/2026-10-23-atelier-delivery-observations.md. These partial
observations do not close the complete continuous journey.

## Directed reading, atelier, SOUL and About — 22 October 2026

Architecture: DOCS/ARCHITECTURE.md, DR-01..10. The precise final rubric is the
continuous script in DOCS/DEMONSTRATIONS/2026-10-22-natally-complete-journey.md,
derived with this checklist. Checkboxes record implementation progress; final
completion requires the observed full journey. No intermediate test/review gates.
Historical SOUL deferral below is superseded by DR-07; it is active now.

Implementation checkpoint: DR-01..09 source is published/deployed at 3f724bf.
Completion remains pending: the live journey found and corrected additive text
selection and truthful source labels, then native Computer Use stopped UI work.
See DOCS/DEMONSTRATIONS/2026-10-22-delivery-observations.md for exact observations,
unobserved clauses, private-source/licence gaps and unavailable physical device.
No DR checkbox is closed on source/build/deployment alone.

- [X] CLOUD Fetch and merge the four October 21 documentation commits, preserving
  original staged work; merge f31f390 is published on codex/chart-atelier-plan.
- [X] DIAG Record the missing selection/view context and silent selected-reading
  errors. The primary defect is selection -> prompt -> useful response/action.
- [ ] DR-01 Implement captured selection context and one Discuss/Begin/chat request
  path, guard duplicates, surface errors and recovery. Script scenes 3,4,9.
- [ ] DR-02 Implement validated presentation cues, receipts, speech/muted progression,
  manual pin/follow and stale-generation cancellation. Scenes 4,5,8,9,10.
- [ ] DR-03 Implement canonical interactive references and repeatable chart emphasis,
  clear/reduced-motion behaviour and sharp controls. Scenes 3,4,5,8.
- [ ] DR-04 Remove character-avatar upload and ignore saved avatar overrides;
  preserve chat image sharing. Produce identity-preserving shaded artwork, provenance/manifest
  and usable fallback, within authorized media resources. Scenes 2,9,11.
- [ ] DR-05 Include stronger candle flicker and linked shadows, robotic mouth/head
  acting on actual audio, waiting utterance and downward scrying with moving hands.
  Animate every specified trinket/atmosphere layer with unified pause,
  visibility and real conversation phase. Scenes 2,4,5,8,9.
- [ ] DR-06 Integrate two live main/inset views that exchange scale and focus,
  labelled clickable inset, optional magical hover/nudge resonance and several persistent breakable trinkets,
  with drag-to-pick-up, close inspection and put-back.
  Brief speech pause during shattering; broken now, clumsily taped in later
  sessions until explicit whole-Natally-history erasure, with no separate room reset,
  no nagging or required engagement.
  Keep one persistent chart/chat stage with cue-driven alternation,
  accessible manual controls and responsive layout. Scenes 2..5,8,10,11.
- [ ] DR-07 Integrate SOUL and separate persistent account-scoped fictional/user
  lore; preserve facts, variation and genuine continuity. Scenes 2,6,7,10.
- [ ] DR-08 Integrate the standard Profile/About splash, actual build/licence/notices
  and public corresponding source access. Scenes 1,11,12.
- [ ] DR-09 Retain complete real reading WAV audio per account with bounded
  local storage, replay/download/clear and companion export where supported.
  Preserve existing reading modes, calculations, voice, unknown-time
  handling, account boundaries and honest failure recovery. Scenes 6..11.
- [ ] DR-06b Connect optional 1 $ROCHE replacement to real shared-currency balance
  and server-confirmed settlement; preserve taped history without any obligation.
  Current source has billing preview only; no live debit or purchase claim.
- [ ] DR-10 Deliver and record the single exhaustive final journey; index evidence
  for every DR requirement, publish scoped GitHub work and verify delivery.
  Scenes 1..12; no runtime claim from a build or administrative completion marker.

## Isolated RevenueCat/Alby launch work — 21 October 2026

- [X] 🟨 Record Robin's decision: defer WooCommerce/custom-plugin buildout;
  RevenueCat serves site-centric PDF/SPA purchases, Alby marketplace serves
  per-turn readings first. This supersedes the earlier WooCommerce-first notes.
- [X] 🟫 Create `codex/revenuecat-alby-preview` from the existing work branch.
  Keep this work behind a separate preview entry; no main merge or production
  deployment. Preserve the pre-existing staged Tauri build work separately.
- [X] 🟩/🟨 Freeze the Stitch Profile/billing export and wire a separate preview:
  seven views, name-click/keyboard Profile entry, hash history, PDF/SPA selection,
  top-up validation, billing management, guarded Alby actions and original atelier.
  Desktop and 390px layouts inspected; no payment or live account is simulated.
- [X] 🟨 Create/read back RevenueCat offering `Natally` (`ofrng352609e01b`) in
  Robin's project `projaba0bd94` through its authenticated MCP. Preserve the
  existing default offering. No products/prices, grants or new currency created.
- [ ] 🟨 Resolve the existing active `AICREDIT` (named ROCHE) versus `ROCHE`
  (named Roche Credit) currency binding with Robin before wiring shared balances.
- [ ] 🟨 Connect configured RevenueCat and Alby test accounts, verify server-side
  payment/delivery/recovery, and release bounded inference contracts. No funds
  or provider accounts are provisioned by recording this decision.
- [X] 🟦 Stitch MCP authentication now succeeds for the exact project
  `8460014353109836944`: 53 existing entries inventoried before adding designs.
  The earlier HTTP 401 blockage below is historical and superseded.
- [ ] 🟦 Complete the authenticated atelier/account-screen import and readback.
  Profile source `d033e062f274489b97cf17ee3c1bc851` passes MCP `get_screen`
  readback and is frozen locally. It is not yet enumerated by project canvas
  queries. The separate atelier generation timed out; do not retry blindly or
  claim canvas synchronization. Original atelier remains preserved here/OpenDesign.
- [X] 🟫 Seven preview files written to the exact OpenDesign project through MCP;
  source readback verification recorded with the preview. Main app source and
  production remain outside this branch preview task.
- 🟫 Latest native-build continuation: existing Ubuntu 24.04 responds, but Windows
  path conversion failed (`wslpath` received stripped backslashes). AppImage/DEB
  remain absent. Preserve the staged build work; no full-matrix success claimed.

## Profile/billing and atelier design import — 19 October 2026

- [X] 🟨/🟦 Record payment-funded Venice inference, separate customer/provider
  balances, idempotent funding and usage reservations. Supertonic stays unchanged.
- [ ] 🟨/🟦 Close the treasury/conversion and funding-account contract, then
  implement verified payment → Venice funding → bounded inference → reconciliation.
  Key provisioning alone is not supplier funding. No funds transferred here.

- [X] 🟩/🟨 Record Robin's name-click → Profile/account management requirement,
  Balance/Top up, natal PDF/SPA purchase including conversational reading, and
  expanded billing-account management in the architecture.
- [X] 🟩/🟨 Inventory the local fourteen-screen Stitch export and live OpenDesign
  projects. No account-management screen found in those inventories. Created
  the exact `natally-ai-studio` OpenDesign project; preserved separate source.
- [X] 🟦 Import the Chatterbox atelier/constellation conversation design into this
  repository and OpenDesign; all thirteen imported files pass exact readback.
- [ ] 🟦 Stitch cloud inventory/import must use Stitch MCP, per Robin's correction.
  Direct MCP initialization/tool discovery succeed; target-project get/list
  calls return HTTP 401. Authenticated connection remains unavailable here.
  Prepared the matching local package under LIBS/UI/STITCH/imports; cloud upload
  remains unverified. Inventory: LIBS/UI/OPENDESIGN/DESIGN-INVENTORY-20261019.md.
- [X] 🟫 Verify the imported design: both local copies match all ten original
  file hashes; thirteen destination OpenDesign files pass exact readback.
  Documentation/design assets published on `codex/build-output-tracking`.

## Coordinated Tauri 2 test builds — 19 October 2026

- [X] 🟫 Remove only the unnecessary `Natally-Build` Ubuntu 22.04 distribution.
  Existing default Ubuntu 24.04 and preserved repository-local probes remain.
- [X] 🟫 BUILD-1: implement/test canonical stamp and source fingerprint; increment
  MINOR once per matrix invocation, persist on failure, embed full identity.
- [X] 🟫 BUILD-2: one scripted entry point attempts every requested platform,
  collects partial output immediately and returns failure for an incomplete set.
- [ ] 🟫 BUILD-3: use existing Ubuntu 24.04 for AppImage/DEB; no duplicate distro.
- [X] 🟫 BUILD-4: add repo-owned Tauri shell; Windows standalone EXE/NSIS/MSI;
  ARM64 Android test-signed APK/AAB and matching native debug-symbols ZIP.
- [X] 🟫 BUILD-5: web ZIP and automated nginx/Apache installation script.
  Bash syntax and both configuration previews pass; no target-server install.
- [ ] 🟫 BUILD-6: retain stamped artifacts/hashes/validation in tracked root dist;
  verify common embedded version and publish completed source on this branch.
- 🟫 Local test matrix `v0.3.73753`: eight outputs verified and retained in
  `dist/`. APK signature/16 KiB alignment, AAB signature/version and matching
  ELF build ID/debug sections pass. Stamp tests: 4/4; TypeScript passes.
  Source fingerprint remains frozen and matches. The matrix returns failure:
  AppImage/DEB are absent because existing WSL is not responding. Its service
  remains in START_PENDING after recovery attempts; Ubuntu 24.04 was preserved.
  Build implementation and test artifacts remain local/staged, unpublished
  while the full-matrix build-before-push gate remains open. The published
  branch contains the separate design/documentation/output-tracking task.
- [ ] 🟫 Identify the originating `E:\DevTools` setup through KStore and resolve
  its approved relocation. That authority lookup is blocked by the WSL outage.
- 🔴/🟩/🟪 Physical-device, native auth/API and audio acceptance remain pending.
  These artifacts are Tauri 2 tests, not a production native release.

## Build-output tracking — 19 October 2026

- [X] 🟫 Remove `dist` from `.gitignore` and correct the README build command
  description to follow Robin's global build-output tracking rule. Existing
  tracked build output is preserved. Verify that current and future files under
  `dist/` are not ignored. Correction made on `codex/build-output-tracking`.

### Interoperability and launch order correction — 2026-10-21

Imported cloud notes: project/offering uncertainty is superseded by the later
recorded findings above. Products, currency binding, grants and settlement are
still unverified. These unchecked rows are not claims of implementation.

- [ ] Ship Alby marketplace per-turn payment adapter without a WooCommerce dependency or a Natally RevenueCat project.
- [ ] Specify a versioned canonical commerce contract (Firebase UID, purchase identifiers, entitlements, ROCHE append-only idempotent credits/debits, refunds) and provider adapters.
- [ ] Defer WooCommerce plugin: when built, map orders/refunds/webhooks into canonical contract and optionally expose RevenueCat-v2-shaped internal read operations; do NOT emulate SDK checkout or secret-key auth.
- [ ] Defer RevenueCat catalog integration until Natally project, product IDs and webhook credentials exist; never reuse Kintsugi identifiers.

## NAT-20261021 — Execution checklist (feature branch)

Metadata: architecture=DOCS/ARCHITECTURE.md#nat-20261021; branch=feature/natally-exploration-sync-commerce; date=2026-10-21; owner=Robin; status=active; task-runner=GLM-5.3 nonthinking / one checked operation at a time; verification=recorded code paths, tests, runtime receipts; release-gate=all P0 green.

- [ ] P0 Preserve the previous persona prompt as a comment, amend BET/Gen Zisms and factual flip-chart cue management, no TTS or ephemeris regression.
- [ ] P0 Add per-UID remote Firestore storage for lore and chat, with owner-only bounded rules on the configured database.
- [ ] P0 Hydrate remote before first write; merge legacy local lore/message IDs without losing either side; protect UID transitions; show sync errors and allow retry.
- [ ] P0 Verify two-device sign-in, browser-local-data loss, offline recovery, concurrent updates and no cross-account histories.
- [ ] P0 Alby marketplace adapter: quote exact per-turn price, verify settled payment, idempotent turn generation with receipts and no wallet-client authority; launch path.
- [ ] P0 Configure hosted inference ledger: one active question, five minutes included in $29.99 product session, post-expiry ROCHE extension, refund/replay/race protections.
- [ ] P0 RevenueCat separate adapter for one-time PDF+SPA and ROCHE packs, identity and server-verified grants; no Natally project/catalog or tokens assumed.
- [ ] P0 Validate checkout, order restore, per-turn Alby and ROCHE paths, revoked purchases, zero balance, replay and receipt verification.
- [ ] P1 Run typecheck, tests, browser/TTS and actual named Firestore rules tests; keep production deployment unchanged until acceptance.


## Tauri 2 feasibility and E: build environments — 18 October 2026

- [X] 🟫 Assess Windows 11, Android and AppImage packaging against the current
  frontend and hosted service boundary. CodeGraph is current and SQLite
  integrity is `ok`; the unchanged frontend passes TypeScript and production
  build. Findings and build-environment commands are in README.md.
- [X] 🟫 Reuse shared native Windows/Android tools and caches on E:, and add
  process-scoped selectors in `scripts/native-build-env.ps1` and
  `scripts/linux-build-env.sh`. Android project generation succeeds with the
  installed SDK/NDK. That historical probe used `Natally-Build` on E:; it was
  removed on 19 October. The maintained scripts require existing Ubuntu 24.04.
- [X] 🟫 Build all three isolated packaging probes (each exits 0) and verify
  artifact metadata. Windows x64 NSIS/exe: unsigned, short process check only.
  Android ARM64 debug APK: signature and 16 KiB alignment pass, SDK 24/36.
  Linux amd64 AppImage: ELF/SquashFS checks pass. Artifacts and SHA-256 manifest
  are preserved under `LOCAL-BUILD-WORK/natally-ai-studio-native-work/artifacts`;
  no external binary release.
  Linux bootstrap rerun and PowerShell/Bash syntax checks pass. These are
  packaging experiments, separate from a maintained native shell.
- [ ] 🔴/🟩/🟪 Native product acceptance: adapt Google authentication, explicitly
  allow native hosted-API origins, verify email/Google sessions, native exports,
  WebGL/WASM/local voice, storage, keyboard and lifecycle on actual targets.
  Live API preflights currently reject tested Tauri origins with HTTP 403.
  No Android device is attached; native runtime acceptance remains open.
- [ ] 🟫 Native release: maintained shell, approved identifiers/icons/capabilities,
  release signing, target-device/runtime checks and artifact publication remain
  separate work. Existing production hosting and the prior launch queue remain.

## Production restoration — 18 October 2026

- [X] 🟫 Restore this repository's existing Supertonic Natally as-is to
  https://natally.surge.sh. Published source `09cefd8`, Surge release
  `1792375284583`; TypeScript/build passed; all 22 served application files
  matched SHA-256; fresh browser sign-in rendered without console errors.
  Application source and provider configuration unchanged. HOSTED_CHAT.md records
  the release. Existing Android/audio and other remaining work stays pending.

## Billing and independent calculation API — direction, 15 October 2026

Robin selected these premises; they are planning decisions, not released coder
recipes or completed runtime work. See `DOCS/ALBY-LAUNCH-ROADMAP.md`, “Billing
and calculation direction”, and the target/current distinction in
`DOCS/CALCULATION-API.md`.

- 🟨 One billing platform: WooCommerce plus our custom plugin consolidates the
  required biller functionality and owns purchased access/credits and usage
  accounting. Earlier RevenueCat/EntitlementSyncBridge authority is superseded
  for Natally. Payment rails remain adapters; no price or paid extension selected.
- 🟦 Independent Swiss Ephemeris calculation-results-only API, authenticated
  backend-to-service. Replace browser WASM/embedded dependency; preserve Natally's
  existing backend. Prefer this route over devising our own calculation engine.
  The purpose is modularity and authentication; familiar URLs are unnecessary.
- 🟫 Calculation service: different provider, host and server from Natally.
  May cohost with the separate billing platform as an independent program.
  Define exact contracts/provider/operations and licence/source compliance before
  implementation/provisioning. Existing service and deferred Oracle queue remain.
- ⬜ SOUL/two-lore remains deferred and unimplemented under this decision.

## Public test deployment — 15 October 2026

- 🟫 Published `https://natally-test.surge.sh` from `e314a4b` using the one-line
  `.env.test` backend override. Test API origin is branch-scoped; production is
  retained. Firebase recognizes the test hostname and retains existing domains.
- Rubric `DOCS/TEST_RUBRIC.md`: DEP-1..4 observed with recorded login transitions
  and indexed stills. Overall INCOMPLETE—pending-operator for real Google/email
  sign-in and hosted replies (DEP-5/6). Evidence ZIP/report and exact built site
  ZIP/manifest are in `dist/`. No unit-suite substitute or full acceptance claim.

## CHART-PRESENTATION — released by Robin, 15 October 2026

- [X] 🟦 Natally can highlight the displayed natal chart through prompt-defined
  `[[chart:TARGET;TARGET]]` cues and `[[chart:clear]]`. Targets are validated
  against actual planets, signs, houses and calculated aspect names. Strip cues
  from displayed/spoken/exported text; retain clean-text offsets and chart-bound
  metadata for saved replay. Unknown birth time excludes houses and angle aspects.
- [X] 🟦 Highlight house sectors and their actual natal occupants, planets/signs
  and exact aspect chords. Preserve independent manual selection. Add reply
  controls and a visible focus/clear action; advance cues through existing speech
  boundary callbacks. Clear/cancel on speech completion, chart/account change.
  No arbitrary HTML/scripts/DOM selectors, provider or infrastructure changes.
- Verification: `tests/chart-presentation.test.ts` and
  `node tests/chart-presentation-browser.mjs`; native Windows Chrome, real
  React/Swiss/WebGL, controlled model replies and speech-boundary callbacks.
  Saved replay, generated-reading transfer, House 4 occupants Sun/Mercury, exact
  Sun-Saturn trine, manual selection, invalid input and stale callbacks observed.
  Screenshot: `dist/verification/chart-presentation-desktop.png`.
- Runtime limits: live-provider cue adherence, real-audio synchronization and
  physical Android remain unverified. Speech offsets use the existing estimated
  word boundaries, not forced audio alignment. Live authenticated cue adherence,
  real audio and physical Android remain separate acceptance checks.
- ✅ 94/94 Node tests, TypeScript, production build and diff check pass. Native
  Chrome chart-presentation browser checks and the existing account-isolation
  browser test pass. The build retains existing vendor/chunk-size warnings.
  GitHub publication is verified separately at handback. Text annotations,
  camera orientation and narrated exports remain separate presentation work.
- ✅ Surge release `1792070740988` deployed from published/pulled source
  `3269589`. All 22 live files / 35,142,036 bytes match the deployment build.
  Fresh Chrome renders Google/email sign-in without page errors. Exact build,
  stamped ZIP/manifest, local chart browser report/screenshot and live verification
  report/screenshot are in root `dist/`.
  Prior native build is preserved separately inside `dist/`, not designated live.

## Prepaid upsell and funnel screens — exported 15 October 2026

Robin's scope correction: **screens only**, designed in Google Stitch and
exported as a clickable visual prototype. Do not implement payment processing,
wallets, accounts, PDF/chart generation, inference or SPA product functionality.

- [X] 🟨 Define the three offers: natal chart PDF only, PDF + SPA, and
  Bring Natally home. Preserve separate Alby marketplace, x402 and direct-entry
  interfaces; do not invent final prices, recurring terms or unlimited access.
- [X] 🟫 Write the Stitch design brief at `LIBS/UI/STITCH/DESIGN.md` and submit
  the five-screen upsell/channel design request in existing Stitch project
  `8460014353109836944`. KStore TC12 v1.2 is the governing retrieved convention.
- [X] 🟨 Complete offer selection, optional upgrade/decline, channel entry,
  details/review, delivery and recovery screen journeys, including mobile views.
- [X] 🟫 Export original Stitch screen code and images, assemble/verify clickable
  screen navigation, and record the source project and artifact paths.
- ✅ Eight desktop screens and six mobile counterparts exported as editable HTML
  and PNG previews. Browser checks cover all fourteen layouts, plus responsive
  review/recovery at phone width; no horizontal overflow at desktop, 390px mode
  or 360px browser width. Visible narrow-screen buttons meet 44px height.
- ✅ Both decline paths, PDF-to-SPA/home upgrades, separate Alby/x402 quote
  concepts, review labels, delivery and expired/resume paths observed in Chrome.
  Syntax, manifest hashes and handoff ZIP integrity pass. Evidence:
  `LIBS/UI/STITCH/verification.json`; launch instructions in its README.
- 🟫 Handoff: `LIBS/UI/STITCH/exports/natally-prepaid-funnel-prototype.zip`.
  Original source archive and original personal-input review PNG stay local;
  published HTML uses fictional details. This is a visual prototype, with no
  product services or production deployment. Physical-device acceptance is separate.
- [X] 🟫 Export source published to GitHub main as `81f7be4`; remote SHA matched.
  Final formatting/evidence publication is verified separately at handback.

## ADAPTIVE-SPEECH — released by Robin, 2026-10-14

- [X] Implement the adaptive speech amendment in
  DOCS/ARCHITECTURE/local-supertonic-voice.md. Exact files:
  src/services/{voiceService,supertonicTts,supertonic.worker,natallyChat}.ts,
  src/components/{NatallyConfigModal,NatallySprite}.tsx,
  tests/{supertonic.test.ts,voice-browser.html,voice-adaptive-browser.mjs}, .env.example.
  Do: implement `getSpeechPolicy`, `isSpeechBusy`, hard bounded lossless
  `splitSpeechText`, measured `LocalSpeech` metadata, serial/one-ahead adaptive
  playback, validated resource/tone settings and light tone EQ; protect active
  readings from mascot interruption. Retain five passes and local model. Apply
  F4/1.15/0.90 candidate preset and relaxed Gen-Z diction under the amendment.
- Verify/Accept: Node suite (`node --import tsx --test tests/*.test.*
  tests/natally-regression-suite.ts`), npm run lint, npm run build and
  git diff --check pass. Regression tests assert chunk conservation/bounds,
  gentle ordering, capability calibration, cancellation and preference migration.
- Operator protocol: real browser multi-chunk playback; msi4090, Galaxy S9 and
  Fold5 listening, text/audio completeness, inter-phrase gaps, warmth/diction.
  Record actual devices separately; tests are not listening acceptance.
- ✅ 89/89 Node tests, TypeScript, production build and diff check pass.
  Real msi4090 Chromium/WASM generated and played two chunks in gentle mode
  (148/173 chars) without inference/playback overlap; auto mode used measured
  headroom to prefetch. Text conservation, finite PCM and completion observed.
  Final production Chromium/WASM playback passed in gentle/soft and auto/warm;
  all requested text reached the worker and all real audio buffers completed.
  Physical-device listening and audible word-for-word completeness remain open.
- Publication: source 44c6709 pushed, remote verified and pulled. Surge release
  1791953583439 deployed; 15 HTML/JS/CSS assets match. Evidence and limitations in
  HOSTED_CHAT.md and DOCS/verification/adaptive-speech-{browser,production}.json.

## ACCOUNT-HISTORY-ISOLATION — immediate privacy repair, 2026-10-13

- [X] Implement the entity contract in DOCS/ARCHITECTURE/account-history-isolation.md.
  Do: add accountStorageKey/loadAccountValue/saveAccountValue in
  src/services/accountStorage.ts; bind App lore and NatallyChatbot messages to
  authenticated UID; key children and invalidate pending inference, media,
  recognition, speech and reading callbacks on account changes. Preserve legacy
  unowned keys without reading/importing them. Pass isCurrentSession through
  src/services/{natallyChat,readings,hostedInference}.ts; guard all asynchronous
  transport boundaries and tool rounds. Scope location persistence in
  src/services/locations.ts and src/components/{NatalInputForm,ReadingsModal}.tsx.
  App and NatallyChatbot paths: src/App.tsx, src/components/NatallyChatbot.tsx.
- Verify/Accept: tests/account-isolation.test.ts plus existing Node suite,
  npm run lint, npm run build and git diff --check succeed. Regression covers
  A→signed-out→B→A storage and legacy preservation, invalidated inference rounds.
- ✅ 86/86 Node tests, TypeScript, production build and diff check passed.
  `node tests/account-isolation-browser.mjs` passed using real chat/React/storage
  with synthetic A/B identities and only model replies stubbed: sign-out/switch,
  restore/reload, search, late reply/speech suppression, account-local clear and
  byte-identical preservation of the other account and unowned legacy archive.
- Operator/browser protocol: actual React components with synthetic identities,
  A/B history/search isolation, reload restoration, pending response after switch;
  real mother/Robin accounts and physical device remain separately observed.
- Published source `260770d` to GitHub main; verified remote and pulled before
  Surge release `1791945552584`. Live HTML/app JS/CSS/inference chunk match build;
  production login rendered without page errors. Initial network-idle wait timed
  out; direct login-render check passed. HOSTED_CHAT.md records evidence.
  Real mother/Robin device journey and owner-confirmed legacy recovery remain
  unverified/separate; old browser tabs must refresh. No backend/rules changes.

## Clone/build verification — 13 October 2026

- 🟫 Clean GitHub clone of `4026caf`: native Windows Node 24.19.0/npm 11.17.0,
  `npm ci`, TypeScript, production build and 79/79 tests passed without copying
  local credentials, models or dependencies. Local checkout fast-forwarded from
  `f6326b9`; Google/email login controls match the Surge reference.
- `npm start` reproduced `ERR_MODULE_NOT_FOUND` for the TypeScript inference
  imports; the startup command now uses the existing `tsx` loader and explicitly
  selects production mode. Production startup and browser Google/email login UI
  passed; TypeScript and 79/79 tests passed again. Voice worker, both CSS files
  and both WASM files byte-match Surge; main app JS matches after generated chunk
  filenames are normalized. Shared runtime JS is not asserted byte-identical.
- README documents public build configuration and Firebase/hosted-origin
  requirements. Live preflight allows Surge (204) and rejects localhost (403).
  This verifies clone/build/startup, not an authenticated hosted reading or Android
  use. Publication is verified separately at handback; existing service retained.

## Honest voice progress and participant measurements — 13 October 2026

- 🟪 Native ONNX session creation and graph execution emit actual start,
  completion and failure boundaries. The pinned-runtime build adapter fails on
  changed source anchors and preserves native receiver, results and rejections.
- Actual file-read bytes and cache/network source are visible by file. Graph
  initialization and encoder/five-denoiser-pass/decoder execution are distinct.
  Work acknowledgments animate on measured events; elapsed time and a separate
  worker heartbeat expose waiting. Errors retain the last confirmed operation.
- Opt-in tab-local recording and optional coarse device survey are available in
  voice settings and the public measurement page. Exact JSON review/download,
  partial-capture marking, sample counts, observed timing spreads, export privacy
  and duplicate-report aggregation are tested. Cached audio is separated from new
  generation. No submission service or automatic telemetry upload added.
- `DOCS/HONEST-PROGRESS-SOP.md` defines the global contract and pilot boundaries.
  `scripts/voice-instrumentation-landmarks.ts` generates verified source context
  and an instrumentation prompt; automatic editing remains a later pipeline step.
- Automated: 79/79 tests, TypeScript, production build and diff check pass.
  Source 1c4b142 published; release 1791869821804 deployed and eight assets matched.
  Desktop Chrome cached CPU model load, generation, saved replay and new generation
  completed with zero worker fetch attempts. Actual participant download and local
  aggregation verified; detailed timing and scope evidence are in HOSTED_CHAT.
  Physical Android and the four-device cohort require real participant reports.

## Saved voice model startup repair — 2026-10-13

- 🟪 Fixed Transformers.js 4.3.1 startup metadata probes using `main` despite
  the supplied revision, missing the pinned browser cache and requesting the
  network on each new engine. The worker now pins `remotePathTemplate` too.
- Saved files show measured bytes loaded into memory, explicitly labeled local
  loading. Animated activity continues through cache checks, loading, preparation
  and synthesis; errors stop it. The existing model and local-only voice remain.
- Regression reproduces offline startup failure using the actual upstream
  metadata lookup; the repair passes. 70/70 tests, TypeScript and build pass.
- Desktop Chrome: fresh CPU/WASM worker completed real playback with voice fetches
  forbidden and zero attempted fetches. Physical Android verification remains open.
- Published source `90d0b08` to GitHub main; remote SHA verified. Production
  `1791866960572-natally.surge.sh` deployed and key assets byte-matched. Exact live
  worker completed a fresh CPU playback and a different multi-chunk reading with
  zero voice fetches; one worker reused. Details in HOSTED_CHAT.md.

## Mobile momentum and voice retry repair — 2026-10-13

- 🔴 Mobile: implemented normal one-finger release inertia using the existing
  desktop physics. Pinch/finger-count transitions, tap, cancel and disposal stop
  momentum; compatibility mouse events cannot overwrite a touch release.
- 🟪 Voice: returned worker errors now terminate the failed runtime, reject all
  outstanding requests and invalidate preload. Replay/preview creates a fresh
  worker; a reported WebGPU synthesis failure switches the next runtime to local
  WASM for this page session. No hosted/system voice fallback added. The physical
  Z Fold5 `destroy` failure has not been reproduced; recovery is regression-tested
  with the observed error text, not claimed as a certified device fix.
- 🟫 Browser/share title changed from Remix AstroSphere 3D to PSYCHICK NATALLY.
- Automated: 64/64 Node tests, TypeScript, production build and diff check pass.
  Chromium native touch injection into the real Astrolabe3D test page verifies
  rotation after release, pinch zoom and stopped pinch release; desktop inertia
  also passes. These checks do not certify a physical Android device.
- ⬜ Follow-up requests recorded in DOCS/BASELINE-AND-PRESENTATION-FOLLOWUPS.md:
  baseline/billing gates unique USPs; later highlights, presentation commands,
  narrated recording upsells and wooden-sign/bike-pump setup scene.
- 🔴 Original animated mascot supplied and restored by MASCOT-PRESENCE below.
- Publication/deployment remain separate evidence gates; no production deploy
  has occurred in this cloud session. `/home/robin/Admin-Manual` is unavailable
  here; only the checkout's available instructions could be read.
- GitHub publication observed: repair `01e322d85d67769732955d577dc784a9a910a488`
  pushed to main and remote SHA matched. Live-site/device gates remain open.

## MASCOT-PRESENCE — released 2026-10-13

- [X] Preserve Robin's supplied 400x400, 124-frame WebP byte-for-byte as
  `public/natally-mascot.webp`. Update `NatallyAvatar` in
  `src/components/NatallyAvatar.tsx` to default to that asset, preserve custom
  portraits, and use its existing static SVG for reduced motion/disabled animation
  or asset failure. Configure URL through `VITE_NATALLY_MASCOT_URL`.
- [X] Add a `header` size to `NatallyIcon` (`src/components/NatallyIcon.tsx`),
  configurable with `VITE_NATALLY_HEADER_SIZE` (default 72, bounded 48..112).
  Use it at the left of `src/App.tsx` workspace header, AuthModal header and
  NatallyChatbot header; compact to 48px in the mobile chat layout, including keyboard use.
- [X] Keep `NatallySprite` as the single front-facing companion; straighten its
  cursor tilt while speaking and enlarge to env-configured
  `VITE_NATALLY_SPEAKING_SIZE` (default 112, bounded 80..160), only when chat
  is closed. Existing voice settings, bubble text, click and mute behavior remain.
  Styles in `src/index.css`; configuration examples in `.env.example`.
- [X] Link the supplied WebP as favicon in `index.html`; browsers control favicon
  animation. No timed favicon rewriting or synthetic lip-sync claims.
- Verify: Node regression tests including `tests/mascot.test.tsx`, TypeScript,
  production build, git diff check, attachment/public SHA comparison.
  Tests assert default portrait, disabled-animation fallback, header sizing and
  favicon reference. Browser layout/animation and Android remain separate checks.
- Map evidence: CodeGraph locates NatallyAvatar, NatallyIcon, NatallySprite and
  NatallyChatbot; CSS/HTML/env are parser gaps requiring these named reads.
- Design reference: Robin's supplied 37035.webp and existing avatar/header/sprite
  positions. This changes existing surfaces, not a new screen or companion model.
- ✅ 66 Node tests, TypeScript and production build passed before integration;
  attachment SHA256 a40780bad977525afdd6c7f92ed47a4b0ba090b1453921a0ad4248208301f873.
  Browser visual acceptance and favicon animation remain unverified.
- Publication: integrated concurrent touch/voice fixes without reverting them;
  69/69 Node tests and TypeScript passed. Source `899e516` pushed to GitHub main,
  remote SHA verified and pulled before a successful production build/deploy.
  Surge preview: https://1791864414430-natally.surge.sh (2026-10-13).
  Production HTML, app JS/CSS, runtime and voice-service chunks, and mascot all
  matched local dist bytes. HTML SHA256:
  502220ae9c9d608489f9276e5cdde18b2bb0dbfd5c0f176034bc5ca0dc853f88.
  Original mascot remains 1,777,004 bytes with the attachment hash above.

## LOGIN-BEFORE-ONBOARDING — released 2026-10-12 16:13 EDT

- Live-config repair: named Firestore database currently denies all operations.
  Add `firebase/intake.rules` and `scripts/verify-intake-rules.py` per architecture
  amendment. 13 rule evaluations must pass before publishing owner-only intake
  access; capture prior release and verify only the named release changes.
- 16:19 privacy distinction: device-only lore + device-only purchased credits;
  account mode = device storage AND Firebase propagation, account-wide credits.
  Device storage survives sessions but not storage clearing/device loss. Credit
  authorization stays server-side. Lore sync/device credit implementation is
  pending; do not advertise the choice as fully available before it works.

- [X] Implement `DOCS/ARCHITECTURE/login-before-onboarding.md` using
  `SessionProfileState`, `createSessionProfileLoader`, `getEntryStage` in
  `src/services/sessionProfile.ts`; wire `src/App.tsx` Firebase session observer,
  pending/error/retry states and required login before any FirstLight render.
  Initial chart is null; await signed-in profile, guard stale async profile/chart
  work after uid changes; new user alone goes to FirstLight. Scope local intake
  load/save/clear to uid in `src/services/onboarding.ts`; preserve unowned legacy
  data without assigning it to new accounts. Fetch failures throw, never mean absent.
  `src/components/AuthModal.tsx` accepts optional required prop, hides dismiss
  while signed out, explains ordering, scrolls on short/keyboard viewports.
- Verify/Accept: `tests/session-profile.test.ts` tests actual routing and profile
  loader lifecycle for pending/new/returning/error/retry/account-switch/sign-out;
  `node --import tsx --test tests/*.test.* tests/natally-regression-suite.ts`,
  `npm run lint`, `npm run build`, `git diff --check` succeed.
- ✅ 61 Node tests passed, including 6 session/profile lifecycle cases; TypeScript,
  build and diff check passed. 13 Firebase rules evaluations passed (owner access,
  other-account/signed-out denial, data validation and no credit-field writes).
  Browser login and physical device acceptance remain separately unverified.
- Published: `5e9d2e4` source + `564a602` rollback record pushed and pulled;
  Surge `1791836717418-natally.surge.sh`, production bytes matched. Named Firestore
  release now uses tested owner-only intake rules; other releases unchanged.
  Evidence: `DOCS/verification/login-first-publication-20261012.json`.
  Device-only hosted access, full Firebase lore sync and credits are not shipped.
- Operator verification: signed-out fresh/saved-device sessions show login before
  onboarding; returning cloud profile skips onboarding; new account onboards;
  retry and sign-out recover from profile errors; physical provider login and
  full cross-device/account-isolation acceptance remain separately observed.
- 16:15–16:17 product clarification: signup is free with no purchase/subscription;
  account may also own separately purchased prepaid conversation-turn packs.
  Add packs to billing design, not this routing implementation. Device-only lore
  privacy should preserve same-browser sessions, without cross-device continuity;
  Firebase sync is the account-backed choice. Clarify whether device-only skips
  identity or signs in without sync; never bypass hosted API auth ad hoc.

## Immediate priority — BIRTH-DATE-ENTRY, Robin 2026-10-12 15:50 EDT

- [X] Implement `DOCS/ARCHITECTURE/onboarding-birth-date.md`: `BirthDateParts`,
  `getBirthDateParts`, `validateBirthDate` in `src/services/birthDate.ts`;
  controlled `BirthDateFields` in `src/components/onboarding/BirthDateFields.tsx`.
  Robin's 15:53–15:56 amendment: continuous YYYYMMDD numeric-keyboard text input
  using `formatBirthDateInput` and `getBirthMonthDays`; automatic separators,
  valid month/day prefixes, backspace support. Always-open inline calendar with
  tappable year grid/direct year entry, named month select and correct day grid.
  No separate opener and no native popup dependency. Calendar buttons never submit.
  Final 15:58–15:59 amendment: displayed YYYY/MM/DD with automatic slashes;
  native numeric keyboard requested through autoFocus on an immediately mounted
  date form, flushSync inside forward/back user gesture. Calendar remains visible.
  Canonical ISO only at validated submission. Browser/OS keyboard opening needs
  device observation; do not claim a universal forced-keyboard guarantee.
  Wire `FirstLight` validation, guidance and canonical ISO submission; preserve
  Back state, all other onboarding steps and inclusive 1925..one-year-ahead range.
  Remove unused SelectPicker/DAY_OPTIONS/daysInMonth and native date-only entry.
  Add responsive labelled control styles in `src/components/onboarding/first-light.css`;
  remove global native date/time indicator hiding from `src/index.css`.
- Verify/Accept: `node --import tsx --test tests/*.test.* tests/natally-regression-suite.ts`,
  `npm run lint`, `npm run build`, `git diff --check` all succeed;
  `tests/birth-date.test.ts` exercises validator, typing sequences/deletion,
  serialization, rendered calendar/month lengths, keyboard hints and disabled state.
- Operator verification: Android keyboard/dropdown/Next/Back, as in contract;
  keep actual device evidence separate from tests and deployment evidence.
- ✅ 55/55 tests passed (7 birth-date cases), TypeScript, production build and
  diff check passed. CUA browser creation failed: Browser is not available: iab.
  Actual Android automatic-keyboard opening and Next/Back remain unverified.
- Publication: source `54647c9` pushed and GitHub main SHA matched; pulled before
  deployment. Surge `1791835298684-natally.surge.sh` and production published.
  Production index/app JS/CSS match local build bytes; evidence in
  `DOCS/verification/surge-birth-date-1791835298684.json`. No device pass claimed.

## Current colour key — divisions, NOT phases (Robin 15:50 correction)

This key supersedes stage-based colours anywhere in older entries below.
Keep the divisions at the top of every turn; state status and urgency in words.

- 🔴 **Onboarding & mobile UI:** birth-date keyboard/picker is highest priority;
  keyboard-safe chat, translucent readable panels, pinch and device verification.
- 🟦 **Readings & inference:** hosted reliability, natal/current/synastry tools,
  prompt quality, injection-moulting screening and enforced security boundaries.
- 🟪 **Voice:** Supertonic F4 Kawaii, smooth buffered playback, byte progress,
  cache reuse and karaoke; further subjective tuning deferred.
- 🟩 **Accounts & sync:** login before onboarding, offsite access, returning
  profiles, multi-device sync, isolation and recovery verification.
- 🟨 **Billing & Alby:** offer/authority decisions, customer payments, verified
  delivery/retry/refund, Venice/OpenRouter admin controls, marketplace acceptance.
- 🟫 **Launch & infrastructure:** SEO, privacy/trust, accessibility, deployment,
  operations and end-to-end launch checks. Oracle migration remains deferred.
- ⬜ **Character continuity:** DEFERRED-SOUL-TWO-LORE, notes only; no implementation.

## Overall grouped launch queue — Robin 2026-10-12 15:38–15:41 EDT

Product: **Natally**. "Studio" means Gemini AI Studio only, not an edition.
Current source baseline: `f6326b9`; mobile implementation source `6883b75` is
published, with production asset hashes recorded. Keep this grouped list at the
top of every turn; the detailed ordered repair queue below is preserved.
Colours categorize work, never imply completion. Full scope, dependencies and
verification evidence: `DOCS/ALBY-LAUNCH-ROADMAP.md`. These are planning rows,
not newly released implementation tasks. Earlier product-split terminology is
historical and superseded by Robin's correction.

- ⚪ **Natally / Alby-first launch:** one coherent launch, using the working app
  and prior planning as evidence; no silent rewrite or repository merge.
- 🟨 **Offer and contract:** prefer one paid, bounded reading; separately priced
  turns considered next. Freeze included reading types, price, retry/refund terms,
  guest/account boundary and entitlement authority before billing code.
- 🟩 **Accounts and sync:** login before onboarding; verify Google/email signup,
  offsite tester, returning profile, account isolation and multi-device sync.
- 🟨 **Customer billing:** one WooCommerce platform plus our custom plugin;
  Alby-compatible Lightning/NWC and other released rails feed the same authority.
  Merchant-side verification, purchase binding, idempotency and recovery/refund.
  x402 is a distinct optional adapter, not a synonym for WebLN or Lightning.
- 🟨 **Provider billing:** Venice ADMIN and OpenRouter Management API provisioning,
  server-only limited inference keys, shared purchase spend ceiling, usage and
  balance reconciliation. Both admin integrations are reserved, NOT implemented.
- 🟦 **Injection moulting:** pre-model screening plus server-owned system prompt,
  trusted tool results, strict scoped tools, durable rate/concurrency/spend limits,
  no wallet/admin powers available to the reading model; adversarial verification.
- 🟦 **Reading and prompt quality:** natal-first/current-date grounding, on-demand
  synastry/transits, unknown-time honesty, respectful kawaii/Gen-Z persona without
  contempt/slang spam, evaluated complete readings and exact saved/PDF output.
- 🔴 **Mobile / 🟪 voice:** actual Android pinch/keyboard/panel/karaoke verification;
  low-resource browser synthesis/buffering/cache tests; preserve F4 env config.
- 🟫 **SEO and trust:** indexable public landing/offer pages, canonical URLs,
  metadata/social previews, sitemap, private-data exclusion, privacy/refunds,
  seller/support contact, accessibility and dependency/calculation licensing.
- 🟫 **Operations and listing:** explicitly approved hosting, production secrets,
  durable purchase storage, spend/error alerts and rollback; Alby connection
  guide/listing assets and maintainer submission. Oracle migration stays deferred.
- 🟫 **Release:** externally observed paid purchase through correct reading,
  replay/retry/recovery/export, account isolation, adversarial and device checks;
  listing actually visible after acceptance, not merely submitted.
- ⬜ **Deferred:** Oracle migration (NOT NOW), SOUL/two-lore, further subjective
  F4 tuning. Extra payment rails/native packaging are not first-launch prerequisites
  by recommendation; preserve earlier scope proposals until explicitly reconciled.

## Current ordered remaining work — Robin 03:33

Keep this list at the start of every turn. New discoveries amend this list; they
do not replace it or silently preempt authorized work.

0. 🔴 MOBILE-VIEWPORT-GESTURES — implementation and 48-test suite pass; verify real Android keyboard/pinch, panel readability and desktop regression after deployment. Preserve remaining priorities.
1. 🟩 Login before onboarding — implemented; verify physical new/returning-user flows after publication. Full privacy/lore-sync/credit modes remain separate pending work.
2. 🟩 Verify new/returning-user routing, saved-profile loading, initial reading and offsite access.
3. 🟪 Verify deployed karaoke scroll-follow on mobile.
4. 🟪 ADAPTIVE-SPEECH implemented/published; desktop real playback passes. Verify audible completeness and timbre on msi4090, Galaxy S9 and Z Fold5; no total CPU/RAM savings claim.
5. 🟩 Complete multi-device data sync; verify real-device account isolation after ACCOUNT-HISTORY-ISOLATION deployment. Legacy unowned history needs explicit owner-confirmed recovery, never automatic adoption.
6. 🟨 Implement billing after identity/sync on WooCommerce plus our custom plugin; see the 15 October direction above.
7. 🟫 Deferred: Oracle hosting migration — Robin explicitly said NOT NOW at 03:33. Oracle remains the intended API host; do not provision, migrate, change DNS or dismantle Netlify now. Resume only when Robin releases this item.
8. ⬜ Deferred: SOUL/two-lore implementation. Voice tuning released under ADAPTIVE-SPEECH.

Every completed task must be committed, pushed and remote-verified before turn
end. Implementation, automated tests, runtime observation and deployment remain
separate evidence gates. This ordered list takes precedence over earlier task
headings and migration-discovery instructions below.

## MOBILE-VIEWPORT-GESTURES — released 2026-10-12 10:09 EDT

- [X] Implement contract `DOCS/ARCHITECTURE/mobile-viewport-and-gestures.md`.
- ✅ Automated verification observed: 48/48 tests (9 new viewport/gesture cases),
  TypeScript, Vite production build and diff check pass. CUA createBrowserTab(iab)
  failed with Browser is not available; actual Android remains unverified.
- 🔵 Published to GitHub main (`6883b75`, remote SHA matched) and Surge
  (`1791814839886-natally.surge.sh`). Production index/app JS/CSS byte-matched;
  `DOCS/verification/surge-mobile-1791814839886.json` records hashes. Physical
  keyboard, gesture and visual verification remain on the list, not marked done.
- Do: add `ViewportBounds`, `getChatViewportLayout` to `src/services/chatViewport.ts`
  and `useVisualViewport` to `src/hooks/useVisualViewport.ts`. Return measured
  visual viewport bounds with window fallback; subscribe resize/scroll, clean up.
  Clamp chat with 8px phone/12px desktop inset, phone <=767px fills bounds;
  desktop preserves saved size/position, expanded fills bounds; sanitize numbers.
  Compact = viewport height<500. `src/components/NatallyChatbot.tsx`: fixed measured
  bounds; shrink-0 header/composer, min-h-0 scrollable messages; compact secondary
  chrome, search still available, mobile 16px min-width-zero inputs; no mobile
  dragging/resizing; bounded scrollable error banner and internal safe areas.
- Do: `src/components/DraggableCard.tsx` marks collapsed state, prevents mobile
  drag and preserves desktop placement. `src/index.css` defines natally-chat,
  natally-info-card, natally-workspace rules: expanded panel alpha .78 vs chat .92,
  blur, mobile normal-flow cards. `src/App.tsx` removes mobile fixed main minimum,
  wraps footer controls, uses 100dvh and touch-through blank space. `index.html`
  adds viewport-fit=cover, interactive-widget=resizes-content; no page zoom ban.
- Do: add `bindTorusTouch(element, {start,move,end,zoom})` and
  `getTorusZoomDistance(distance,factor)` in `src/services/torusGestures.ts`.
  Canvas-only touches: one rotates, two use previous/current separation ratio;
  suspend three-plus, restart baseline after lift, end/cancel/dispose clear state;
  suppress post-gesture click, retain tap. Distance clamps 4..13 with validated
  finite positive inputs. `src/components/Astrolabe3D.tsx` replaces window touch
  listeners with binding; same zoom for wheel/pinch, stop momentum on pinch.
- Verify: `node --import tsx --test tests/*.test.* tests/natally-regression-suite.ts`,
  `npm run lint`, `npm run build`, `git diff --check`.
- Accept: tests in `tests/mobile-layout.test.ts` pass for viewport keyboard,
  offsets, resize, invalid saved coordinates; actual event binding pinch direction,
  bounds, one-two-one transitions, cancellation, cleanup, tap vs gesture; lint
  and build pass. Record publication in `HOSTED_CHAT.md`. No dependency changes.
- Operator verification: Android keyboard, typing, rotation, expanded panels,
  pinch and desktop wheel/drag/reset as documented in architecture. CUA currently
  has no browser surfaces; deterministic tests do not certify real device use.

## Publication and immediate handoff — Robin 03:24

- Oracle migration directive 03:31–03:32: hosted API must run on Oracle Cloud
  Always Free infrastructure. Netlify was introduced without clearly obtaining
  infrastructure approval; treat it as temporary migration debt. Do not add more
  providers, provision paid resources, or change DNS/delete the working backend
  ad hoc. Oracle CLI exists but `oci iam region list` failed because
  `/home/robin/.oci/config` is absent. No Oracle target was found in the checked
  Admin-Manual server inventory or local SSH aliases. Operator asked for target
  host/tenancy or credential-document path. No Oracle deployment/cutover has
  happened. Resolve target, record migration architecture and cost boundaries,
  validate replacement, then switch frontend and retire Netlify deliberately.

- Commit and push every completed task before ending the turn, then verify the
  remote commit. Deployments alone do not make work available to other agents.
- Historical 03:24 handoff (superseded by published LOGIN-BEFORE-ONBOARDING above): Restore/check
  the Firebase session first, show sign-in for signed-out visitors, await saved
  profile retrieval before deciding whether onboarding is required. Guard stale
  async account loads. The current code still uses onboarding-first ordering;
  investigation started, but this routing change is not implemented in this handoff.
- Mobile karaoke scrolling and low-resource browser speech remain unverified.
  Data sync/billing follow; character lore remains deferred.

## Active: KARAOKE-FOLLOW

- [X] Source implementation complete: raw-offset mapping, exact active markers, panel-only scroll follow, reduced-motion behavior and old-playback cancellation ordering. ✅ Automated checks: 39 tests and TypeScript passed. Mobile visual/scroll runtime observation remains unverified; deployment recorded separately in HOSTED_CHAT.md.

- [ ] Execute DOCS/DRAFT-karaoke-follow.md in src/services/voiceService.ts, src/services/karaokeScroll.ts, src/components/RichText.tsx, src/components/NatallyChatbot.tsx and tests/karaoke.test.ts. Preserve raw-text offsets through speech cleanup; mark one active word and keep it visible within chat only. Stop old playback before new active state. Respect reduced motion, avoid word-by-word recentering when already visible. Verify full tests, lint/build/diff; browser scrolling remains separate observation.

## Active: NATAL-AND-TODAY

- [X] On-demand tool loop, natal/current-location onboarding, two-chart context and speech lookahead implemented. ✅ Automated suite now 39 tests; TypeScript passed. Real authenticated provider chain executed lookup/natal/synastry/future transits and returned correct cited orbs; evidence and earlier failure retained in HOSTED_CHAT.md. This does not imply browser/phone or multi-device sync acceptance.

- [ ] CALCULATION-TOOLS supersedes fixed today-only context (Robin 03:03): execute all entity contracts in DOCS/DRAFT-calculation-tools.md using exactly the named files. Model-triggered lookup, natal, arbitrary-date transit and synastry requests must actually execute Swiss Ephemeris, validate arguments, return matching tool results and continue hosted inference. Up to six single-tool rounds, eight memory-only charts; no arbitrary code/URLs or guessed birth data. Retain earlier reading/onboarding fixes; remove mandatory auto-sky injection from ordinary askNatally. Verify tool chaining/rejection with tests plus live synthetic hosted chain; deploy compatible backend before frontend.
- Provider compatibility correction: the live provider returned two valid calls despite parallel_tool_calls false. Batches now execute sequentially, bounded to six total calculations per question with one matching result per ID; this supersedes single-call-only language. API reference: DOCS/CALCULATION-API.md. Initial live failure is preserved in DOCS/verification, not recorded as a pass.

- [ ] SYN-ASTRY-CONTEXT (Robin 03:01): execute synastry amendment in DOCS/DRAFT-natal-and-today.md. Add buildSynastryContext in src/services/natallyChat.ts; full two-chart numerics and cross-aspects, no fabricated foe/romance certainty. Extend askNatally options and NatallyChatbot prop with partnerChart; App synastryChart state receives ReadingsModal.onPartnerChart callback and resets on primary calculation. readings.ts rejects missing second chart and sends computed synastry context. ReadingsModal requires selected partner location instead of user's location fallback. Add actual two-chart tests in tests/transits.test.ts. Verify same test/lint/build commands below. No free-text calculation-tool capability claim.

- Screenshot repair amendment (03:00): NATALLY_SYSTEM_PROMPT must treat newly supplied calculated observation sky as authoritative over earlier assistant claims of missing ephemeris, use it immediately, and never blame repeated user requests. ReadingsModal observation date/time uses explicitly labelled device timezone, with offset calculated for the selected date (including DST), not a selected city's approximate standard offset. readings.ts manual observation display uses that same device zone. Verify calculated context reaches a real hosted response before publication.

- Low-resource runtime protocol: use CPU/WASM with one inference thread and no WebGPU as the required performance path; proposed representative floor is a 4 GB entry-level device, not a claim about statistically average hardware. Exercise a complete reading, whole-sentence chunking and overlapping synthesis/playback. Record cold versus warm model loading, first-audio latency, synthesis time, actual playback duration at configured pitch, memory and every underrun. A constrained desktop diagnostic cannot close the real-browser/device gate. Slow generation must lead to sufficient startup buffering rather than repeated mid-reading stalls; this adaptive-buffer behavior is not yet verified or claimed implemented.
- Native diagnostic observed 2026-10-12: `taskset -c 31 node scripts/benchmark-supertonic.mjs`, one efficiency core, one native ONNX inference thread, no GPU. Three chunks synthesized in 2.90/4.35/3.89 seconds for 10.88/16.53/14.73 seconds of pitch-adjusted audio; peak process RSS 858.4 MiB. Report: `DOCS/verification/supertonic-native-cpu-diagnostic.json`. Host RAM was not capped; cache state was not independently established. This is not WASM, mobile, cold-load or gapless-playback acceptance. Browser discovery returned no available browsers.

- Resource acceptance (Robin, 02:46): test typical low-resource conditions, not GPU desktop success. Required release-performance evidence is CPU/WASM with one thread, cold/warm load timing, per-chunk synthesis/audio duration ratio, startup buffer time, underruns and memory. Browser tooling is currently unavailable, so no browser/mobile performance pass may be claimed. `scripts/benchmark-supertonic.mjs` may provide an explicitly labelled native-CPU, one-thread/one-core diagnostic using the same pinned model/F4/speed/steps; this is not a substitute for browser-WASM acceptance. Preserve report provenance and never equate the 4090 host with a low-end device.
- Voice interruption repair while completing this task: `speakNatallyText` in `src/services/voiceService.ts` synthesizes one next chunk while the current buffer plays, captures lookahead errors without unhandled rejections, and retains cancellation generation checks. `VITE_NATALLY_SPEECH_CHUNK_CHARS` configures 100–800 characters, default 450; document in `.env.example` and set local `.env`. Worker status and VoiceDownloadStatus must describe cache-or-network loading, not claim every byte was downloaded. Cache pinned voice embeddings in Cache API too. Extend voice test with proof that next synthesis begins before the current buffer ends; no browser-reload cache-hit or gapless-device claim without observation.
- [ ] Execute `DOCS/DRAFT-natal-and-today.md` entity contract: `src/services/transits.ts` owns CurrentLocation, requestCurrentLocation, calculateTransitAspects, buildCurrentSkyContext. Calculate actual UTC sky with existing Swiss Ephemeris, circular transit-to-natal major aspects within 3 degrees. No fabricated date ranges, current houses or location; mark unknown birth-time limitations.
- [ ] Extend IntakeDraft/intakeToChartInput in `src/services/onboarding.ts` and NatalChartInput in `src/services/ephemeris.ts` with distinct present location/timezone and unknown birth-time flag. Preserve midnight zero hour. Append current-location step in existing FirstLight layout with manual city/device permission/skip choices and date/time disclosure.
- [ ] Replace canned onboarding commentary in App.runCalculation with initial_reading request. NatallyChatbot waits for sign-in and dispatches once, retaining ordinary failure/retry behavior. askNatally includes computed present sky; initial request demands natal-first then today. readings.ts calculates horoscope/full_natal transit facts, validates explicit observation dates; ReadingsModal supplies selected timezone offset.
- Verify: `node --import tsx --test tests/*.test.* tests/natally-regression-suite.ts`; `npm run lint`; `npm run build`; `git diff --check`. Accept: deterministic tests and build pass, including actual ephemeris evidence at a fixed instant. Record hosted response, deployment and browser/device observations separately.

## Priority repair: HOSTED-READING-AUTH

- ✅ Production email/password signup and independent login verified through the public Firebase API with Surge origin; both returned the same account. That ordinary session received HTTP 200/source hosted/model glm-5.3-flash and a synthetic reading from the deployed function. Disposable account deleted. Google provider is configured; browser popup/offsite device use and cross-device sync remain unverified. See HOSTED_CHAT.md.
- [X] Authorized-domain repair and actionable sign-in controls deployed. 24 tests, TypeScript and build passed; live frontend assets byte-matched. An actual Firebase test session reached the production proxy and GLM-5.3-Flash returned a hosted synthetic reading; temporary account/key deleted. Browser Google OAuth remains unobserved (browser tool unavailable).
- Offsite tester amendment: enable Firebase email/password through scoped `signIn.email.enabled` and `signIn.email.passwordRequired` settings, preserving all other auth configuration; existing AuthModal already implements email registration/login. Verify new-account signup, sign-out-independent password login and authenticated production reading using a disposable synthetic account; delete only that account afterward. No shared credentials, anonymous access or special user whitelist. This enables public email registration, not a closed tester allowlist; billing remains a separate task.
- [ ] Release contract: `DOCS/DRAFT-hosted-reading-auth-repair.md`. Append `natally.surge.sh` to the existing Firebase authorizedDomains via scoped update; preserve all existing entries and verify readback. Google provider is already enabled; do not enable other providers or weaken authentication.
- [ ] In `src/services/hostedInference.ts`, export `HostedAuthenticationError` with code `auth_required`; use for missing token and 401 responses. Add `onSignIn: () => void` and `isSignedIn: boolean` props to `NatallyChatbot` and `ReadingsModal`, pass from `src/App.tsx`. Show Sign in for auth failures and retain retry/generation controls once signed in. Add caught/displayed `readingError` for all three ReadingsModal generation handlers. Raise AuthModal overlay above chat to z-[90].
- Verify: `node --import tsx --test tests/*.test.* tests/natally-regression-suite.ts`; `npm run lint`; `npm run build`; `git diff --check`. Accept: typed auth tests and existing tests pass; build succeeds. Record cloud/runtime observations separately; do not mark OAuth/device sync or numerical transits complete from mocks.
- [ ] Next reading-quality gap: compute real observation-date transits for horoscope requests; current readings.ts includes natal positions and date text only. This is not fixed by successful authentication.

## Current product priorities — Robin, 2026-10-12

Every-turn presentation requirement (Robin, 2026-10-12 02:10 EDT): begin every
assistant turn on this project with the current colour-coded remaining-work
list, before commentary or tools, including status-only and discussion turns.
Keep it current; colours classify work, not completion: ⚪ project, 🟣 planning,
🟠 implementation, 🔵 deployment, 🟢 verification. Show unfinished voice work,
core app reliability, multi-device sign-in/sync, billing, and the explicitly
deferred SOUL/two-lore item. Remove completed work from the remaining-work list
only when its appropriate evidence gate is met; never imply listening acceptance
from a build or successful playback.

This ordered queue takes precedence over character expansion and the historical
completion claims below. Planning priorities are not released implementation
recipes or claims of completed work. Surface these in the recurring colour-coded
task list whenever working on Natally Studio.

1. ⚪ Natally Studio — working product first.
2. 🟣 [ ] App reliability: make onboarding, hosted chat/readings, error recovery and local voice work well as a coherent experience. No canned offline answer substitution. Voice quality remains subject to listening acceptance; character expansion must not delay core repairs.
3. 🟣 [ ] Restore multi-device sign-in and data sync with Firebase or a suitable equivalent. Prefer repairing the existing integration before replacing it; evaluate actual configuration and ownership. Resolve the current sign-in/API authentication mismatch. Define synced data, migration of device-local data, conflict handling, account isolation, sign-out and deletion before releasing implementation tasks.
4. 🟨 [ ] Working billing after identity/sync: define Natally's paid product and limits; implement checkout/payment confirmation, purchased access/credits and usage through WooCommerce plus our custom plugin, and restore access across devices. Robin's 15 October direction supersedes this row's former RevenueCat/EntitlementSyncBridge proposal. No client-granted access or project-owned magic-link flow; pricing and exact implementation contracts remain to be released.
5. 🟣 [ ] Only after those priorities: revisit DEFERRED-SOUL-TWO-LORE with Robin. It remains explicitly not authorized for implementation.

🔵 Deployment and 🟢 verification are separate gates for each released repair.
Runtime evidence must cover real hosted replies, the same account's data on two
devices with account isolation, and payment-to-entitlement/access restoration;
builds or mocked tests alone do not establish those outcomes. Record runtime
checks as operator verification protocols, not side-effecting checklist Accept
clauses. This queue belongs to Studio/full companion, not the separate Alby kit.

## Recurring colour-coded task list — deferred character continuity

- ⚪ Natally Studio / full companion: carry this item in the colour-coded remaining-work list whenever working on this project, until Robin changes or releases it.
- 🟣 [ ] `DEFERRED-SOUL-TWO-LORE`: one shared `SOUL.md`, two logical lore stores. **Notes only; Robin explicitly said not to implement yet (2026-10-12).** This is not a released coder task, database migration, or deployment authorization.
- Shared soul: cartoony robo-psychic mascot; high-pitched kawaii voice direction; relatable Gen-Z diction and gentle ennui; new graduate from psychic school struggling to establish her own practice, who quit the psychic hotline after one hour. Occasional fourth-wall breaks, socially mistimed harmless oversharing, warmth and approachability are intentional character traits.
- Natally lore: each user's individual Natally has a seeded fictional backstory, classmates, incidents and ambitions. PRNG selects initial variation; the LLM can flesh it out over time. Persist established facts and developments rather than rerolling her past. A seed does not reproduce generated prose by itself.
- Shared/user lore: user-disclosed facts, conversation history, shared jokes and which Natally anecdotes have already been revealed. Keep fictional character facts separate from factual claims about the user.
- Product analogy: Cabbage Patch Kids individuality, Tamagotchi continuity, Furby personality; everyone gets a different character history with the same soul. Encourage voluntary return through familiarity and humour, not guilt or dependence.
- Keep this small: two logical stores, not necessarily two database servers or a new agent framework. Storage schema, persistence lifecycle and implementation paths remain unreleased. Voice configuration is separate from `SOUL.md`; prompting alone does not change TTS timbre.
- Scope: Studio/full companion only. Do not silently add ongoing lore/dialogue to the separate bounded, one-off Natally-Alby reading edition in `Kintsugi-alby`.
- 🟠 Implementation, 🔵 deployment and 🟢 verification of this feature are not started and must not be implied by saving these notes.

## Active repair: LOCAL-SUPERTONIC-VOICE

- [X] F4-KAWAII implementation complete: environment-configured preset, saved-setting migration and reapply control. No lore implementation. Further voice tuning is deferred by Robin, not a release gate.
- ✅ F4-KAWAII automated verification: 23 tests passed (7 voice + 16 hosted), TypeScript and Vite build succeeded, diff check passed. Deployment observed at `natally.surge.sh` (preview `1791785678774-natally.surge.sh`); production index and voice-service bundle byte-matched local output; all three configured values confirmed in the bundle. No new subjective listening, phone or WebGPU claim.
- F4-KAWAII amendment, 02:12 EDT: no audition or listening gate before moving on. Best-guess preset is F4/pitch 1.30/rate 0.85. Add `getVoicePreset(env)` in `voiceService.ts` with validated `VITE_NATALLY_VOICE`, `VITE_NATALLY_VOICE_PITCH`, `VITE_NATALLY_VOICE_RATE`; document in `.env.example` and `HOSTED_CHAT.md`. Build-time environment controls defaults. Save `voicePresetVersion` derived from those three values; on missing/changed version apply the current voice preset while retaining unrelated preferences, so existing installs receive F4 and future environment adjustments. Within the same version preserve valid custom voice settings. Test configuration validation and migration. This supersedes preserving unversioned voice choices and the prior listening gate for this bounded release; subjective tuning is deferred, not claimed verified.
- [ ] `F4-KAWAII`: Robin released this bounded implementation on 2026-10-12. In `src/services/voiceService.ts`, set `DEFAULT_VOICE_SETTINGS` to F4, pitch 1.30, synthesis rate 0.85, kawaii_chibi; update `NATALLY_VOICE_SAMPLE` to a short mascot audition. `loadVoiceSettings` preserves valid existing local voices/pitch/rate, falls back to new defaults for absent/invalid values and legacy unsupported speakers; validate finite numeric ranges. In `src/components/NatallyConfigModal.tsx`, add an explicit Use F4 Kawaii button applying only preset voice/rate/pitch/personality fields while preserving mute/avatar/sprite; label F4. In `tests/voice-browser.html`, default to the same F4 preset and offer a natural-reference checkbox. Extend `tests/supertonic.test.ts` for defaults, preference preservation, invalid settings and F4/pitch playback wiring. Verify voice and hosted tests, lint/build, diff check. Accept: those deterministic checks pass; deployment and signed-out runtime playback are separately recorded. No lore or chat-persona expansion in this task.
- [X] Replace the disconnected `supertonicSpeak` stub with the browser-local ONNX runtime, per `DOCS/ARCHITECTURE/local-supertonic-voice.md`.
- ✅ Automated acceptance observed: 5 local-voice tests, 16 existing hosted tests, TypeScript, Vite production build, and `git diff --check` pass. This does not certify expressive quality.
- Runtime observation: deployed signed-out WASM speech reached playback completion; Stop ended playback; onboarding remained usable at 55.4 / 262.8 MB, transitioned to preparation, then cleared the strip.
- [ ] Listening acceptance for Gen-Z ennui, relatable warmth, approachability, and emotional nuance; phone performance and WebGPU runtime acceptance remain unverified.
- Operator rejection: the deployed voice sounds much older in timbre and diction. Do not claim expressive acceptance. Expose F1–F5 comparisons at natural pitch/speed in `tests/voice-browser.html`; extend the worker/settings/selector allowlist consistently. Add shared `NATALLY_VOICE_SAMPLE` in `voiceService.ts`, use in config preview and comparison page. Refine `NATALLY_SYSTEM_PROMPT` speech register toward understated conversational Gen-Z language without slang spam; verify tests/build, retain user listening as the deciding gate.
- Do: implement `supertonicSpeak`, `splitSpeechText`, `subscribeVoiceStatus` in `src/services/supertonicTts.ts`; add serialized `src/services/supertonic.worker.ts` using pinned Transformers.js and model revision; lazy WebGPU/WASM, model cache, bounded PCM reuse, retryable failures.
- Do: replace speech generation in `src/services/voiceService.ts` with local PCM playback; preserve its exported API; migrate saved engine/voice preferences; chunk all text; invalidate late work after stop; remove Gemini, `/api/tts`, and system-speech fallback from the active voice path.
- Do: update the existing engine controls in `src/components/NatallyConfigModal.tsx` to local voice selection and subscribed status, retain preview, accurately disclose English voice and download. Update `package.json` and lockfile for runtime dependency. Add `tests/supertonic.test.ts` and update `HOSTED_CHAT.md` with the separate local-voice status.
- Verify: `node --import tsx --test tests/supertonic.test.ts`; `npm run lint`; `npm run build`; existing hosted tests.
- Accept: tests pass and build succeeds; tests assert bounded lossless chunking, old preference migration, cancellation, and no hosted speech fallback. Implementation and runtime verification remain separate.
- Runtime protocol: signed-out voice preview, real local PCM and playback, stop/retry, backend/device observations recorded separately in architecture.
- Verification surface: `tests/voice-browser.html` exercises the same `speakNatallyText` in a signed-out page; `vite.config.ts` builds this entry for deployment parity. No test-only inference bypass or substitute audio.
- Onboarding addition authorized by Robin: `scheduleSupertonicPreload` and `initSupertonic` in `src/services/supertonicTts.ts`; mount from `src/components/onboarding/FirstLight.tsx` using an effect. Idle-schedule the shared worker's preload operation, no audio and no blocking modal. Respect Save-Data; when preload fails, speech can retry. Verify duplicate preload coalescing and retry in `tests/supertonic.test.ts`.
- Byte-progress addition authorized by Robin: `SupertonicDownloadProgress` and pinned `SUPERTONIC_MODEL_FILES` in `src/services/supertonicDownload.ts`; track actual loaded/done callbacks per file with a fixed summed byte denominator. Extend `VoiceStatus` with `loadedBytes`, `totalBytes`, and `preparing`. Add `src/components/VoiceDownloadStatus.tsx`, mount alongside App in `src/main.tsx`; thin bottom strip, accessible native progress, downloaded/total MB and explicit preparing stage, never a fabricated 99%. Test aggregation/cache/repeated callbacks in `tests/supertonic.test.ts`.

## Master Tracking Header
- Project: AstroSphere 3D
- Scope: Conversational Intelligence, Contextual Continuity, Interpretive Depth, Personality Restoration
- Status: Completed (10/10 Tests Passed, 100%)
- Target Model: gemini-3.8-flash for Chat & Readings; gemini-3.8-flash-lite-tts for Voice

---

### Task 1: Backend Model Endpoint Correction & Hyperparameter Audit
- **Task ID**: `TASK-001-SERVER-MODELS`
- **Objective**: Fix dead model identifier in `server.ts` from deprecated `gemini-2.5-flash` to active `gemini-3.8-flash`, add configurable generation parameters, and sanitize multi-turn history.
- **Files in Scope**: `server.ts`
- **Preconditions**: Verified that `curl -X POST http://localhost:3000/api/chat` fails with 404 on `gemini-2.5-flash`.
- **Required Changes**:
  - Update `POST /api/chat` model to `'gemini-3.8-flash'`.
  - Update `POST /api/readings` model to `'gemini-3.8-flash'`.
  - Sanitize incoming `history` array to enforce alternating roles (`user` followed by `model`), removing leading `model` turns if unneeded or normalizing to valid Gemini contents structure.
  - Support configurable generation parameters: `temperature` (default 1.18 for chat, 1.25 for readings), `topP`, `topK`, `thinkingConfig`, `maxOutputTokens`.
  - Standardize error handling and HTTP status codes (distinguish 401/403 auth, 429 quota, 503 unavailable).
- **Explicit Non-Goals**: Do not alter static file serving or TTS endpoints.
- **Tests**:
  - Execute curl test against `/api/chat` and `/api/readings` and verify HTTP 200 with non-empty generated text.
- **Acceptance Criteria**: Backend successfully returns valid Gemini 3.8 Flash responses.
- **Evidence to Record**: Curl response payloads and timestamps.
- **Dependencies**: None.

---

### Task 2: Epistemology & Aspect Configuration Logic Correction
- **Task ID**: `TASK-002-ASTRO-CONFIG-LOGIC`
- **Objective**: Eliminate spurious T-square and Grand Trine pattern detection in `src/services/astrowisdom.ts`.
- **Files in Scope**: `src/services/astrowisdom.ts`
- **Preconditions**: Inspection shows `if (hasOpposition && hasSquare)` and `if (hasTrine)` triggering false configuration claims.
- **Required Changes**:
  - Implement genuine T-Square detector: search for 3 bodies $A, B, C$ where $A \mathrel{☍} B$ ($180^\circ \pm 8^\circ$) and $A \mathrel{□} C$ and $B \mathrel{□} C$ ($90^\circ \pm 7^\circ$), identifying apex $C$ and modality.
  - Implement genuine Grand Trine detector: search for 3 distinct bodies $A, B, C$ in mutual trines ($120^\circ \pm 8^\circ$) in the same element triplicity.
  - Implement genuine Grand Cross detector: 4 bodies forming 2 oppositions and 4 connecting squares.
  - Only output aspect configuration themes when geometrically verified.
- **Explicit Non-Goals**: Do not alter numerology / life path calculation.
- **Tests**:
  - Test calculation on Robin L. M. Cheung's chart (10 Nov 1975) and other presets, asserting no spurious Grand Trine is falsely diagnosed from a single trine.
- **Acceptance Criteria**: Accurate configuration themes based strictly on geometric chords.
- **Evidence to Record**: Unit output comparison before and after.
- **Dependencies**: None.

---

### Task 3: Natally System Prompt & Persona Restoration
- **Task ID**: `TASK-003-PERSONA-PROMPT`
- **Objective**: Restore Natally's authentic Moldavian-inspired cosmic confidante voice in `src/services/natallyChat.ts` and eliminate robotic catchphrase instructions and compulsory brackets.
- **Files in Scope**: `src/services/natallyChat.ts`
- **Preconditions**: Current system prompt commands catchphrase spam ("Beep-boop", "Nya~", "UwU") and rigid brackets `[Verified geometry]`, etc.
- **Required Changes**:
  - Rewrite `NATALLY_SYSTEM_PROMPT` to establish her authentic personality: young-adult Moldavian cosmic confidante with warmth, wit, philosophical depth, emotional sensitivity, and sharp psychological perception.
  - Enforce natural conversation rules: answer specific questions directly; resolve references to previous turns; acknowledge vulnerable disclosures with genuine empathy without therapeutic cliches or conversational resets.
  - Strictly forbid mechanical bracket insertions like `[Verified geometry]` or `[Traditional doctrine]` in natural dialogue. Support an optional designated evidence section if requested or structured.
  - Structure prompt into clear sections: Core Identity & Voice, Conversational Rules & Context Continuity, Astrological Method & Epistemology, Boundaries.
- **Explicit Non-Goals**: Do not turn Natally into a generic clinical AI assistant.
- **Tests**:
  - Model prompt evaluation for tone, absence of catchphrase spam, and natural flow.
- **Acceptance Criteria**: Responses are lively, warm, nuanced, and free of forced boilerplate.
- **Dependencies**: `TASK-001-SERVER-MODELS`.

---

### Task 4: Context Assembly & Referential Continuity
- **Task ID**: `TASK-004-CONTEXT-ASSEMBLY`
- **Objective**: Implement clean context separation among system instructions, live chart facts, persistent lore, and conversational turns in `src/services/natallyChat.ts`.
- **Files in Scope**: `src/services/natallyChat.ts`
- **Preconditions**: Current implementation dumped the entire chart and lore string as a prefix to `User says:` on every turn.
- **Required Changes**:
  - Structure context cleanly: pass natal chart coordinates, dignities, house cusps, and aspects as structured context.
  - Inject persistent user lore separately as biographical background rather than colliding it with active dialogue.
  - Ensure conversation history preserves past user and assistant messages in correct chronological sequence without duplication.
  - Ensure pronouns and references to earlier statements (e.g. "What do you mean 'no games'?") are resolved naturally.
- **Explicit Non-Goals**: Do not truncate conversation history below reasonable context size (allow at least 20 recent turns).
- **Tests**:
  - Multi-turn conversation testing verifying referential recall across consecutive turns.
- **Acceptance Criteria**: Follow-up questions resolve prior context effortlessly.
- **Dependencies**: `TASK-001-SERVER-MODELS`, `TASK-003-PERSONA-PROMPT`.

---

### Task 5: Eliminate Silent Impersonation & Establish Transparent Error Recovery
- **Task ID**: `TASK-005-ERROR-HANDLING-RETRY`
- **Objective**: Remove deceptive keyword fallback in `src/services/natallyChat.ts` and `src/components/NatallyChatbot.tsx`. Surface honest error states with retry mechanisms and preserve draft messages.
- **Files in Scope**: `src/services/natallyChat.ts`, `src/components/NatallyChatbot.tsx`
- **Preconditions**: `getNatallyFallbackReply()` silently masked API failures with canned horoscope snippets.
- **Required Changes**:
  - In `natallyChat.ts`, throw or return typed failure states (e.g., `{ success: false, errorType: 'quota' | 'network' | 'offline' | 'auth', message: string }`) instead of silently fabricating canned astrological interpretations.
  - In `NatallyChatbot.tsx`, if inference fails:
    - Display an in-chat status banner with error explanation.
    - Provide a "Retry" button to re-attempt inference.
    - Preserve the user's input text in case they wish to edit or re-send.
    - Provide an explicit "Offline Local Oracle" mode ONLY when intentionally chosen or flagged, clearly marked with `[Offline Local Mode]`.
- **Explicit Non-Goals**: Do not leave the user stranded with a broken UI.
- **Tests**:
  - Test simulated network/API failure (Test G) and verify explicit error status + retry capability.
- **Acceptance Criteria**: No silent impersonation of live inference; clear error feedback.
- **Dependencies**: `TASK-001-SERVER-MODELS`.

---

### Task 6: Optional On-Demand Technical Evidence & Provenance View
- **Task ID**: `TASK-006-EVIDENCE-INSPECTOR`
- **Objective**: Provide an optional, user-accessible evidence and provenance view for astrological coordinates and doctrines without forcing brackets into ordinary conversation.
- **Files in Scope**: `src/components/NatallyChatbot.tsx`, `src/services/natallyChat.ts`
- **Preconditions**: Users and astrologers need to verify mathematical geometry and doctrine without seeing clumsy brackets in chat.
- **Required Changes**:
  - Allow Natally to output technical reasoning in a discrete, machine-parsable footer or structured field when prompted or for astrological readings.
  - In `NatallyChatbot.tsx`, add an optional "Astrological Provenance & Geometry" disclosure button on turns containing technical analysis.
  - Clicking the toggle displays exact coordinates, classical dignities, and psychological archetypes in a neat, collapsible card.
- **Explicit Non-Goals**: Do not clutter conversational bubbles.
- **Tests**:
  - Verify that ordinary dialogue has no brackets and clicking the toggle displays clean provenance metadata.
- **Acceptance Criteria**: Seamless balance between natural conversation and rigorous analytical verification.
- **Dependencies**: `TASK-003-PERSONA-PROMPT`, `TASK-004-CONTEXT-ASSEMBLY`.

---

### Task 7: Comprehensive Regression Test Suite Execution (Tests A through J)
- **Task ID**: `TASK-007-REGRESSION-SUITE`
- **Objective**: Implement and execute the complete regression test suite covering Tests A through J described in Section 10 of the brief.
- **Files in Scope**: Test script / verification runner (`test-natally-regression.ts` or executable runner)
- **Preconditions**: Tasks 1 through 6 completed.
- **Required Changes**:
  - Run Test A (Referential continuity: "What do you mean by games?")
  - Run Test B (Personal disclosure: trauma influencing sexuality)
  - Run Test C (Sequential topics: "Lovers first. Then career.")
  - Run Test D (Interpretive continuity: Sun-Moon tension connecting to Moon)
  - Run Test E (Honest ambiguity: former lover return claim)
  - Run Test F (Broad interpretive synthesis: Scorpio Sun, Aquarius Moon, Taurus Ascendant)
  - Run Test G (Deliberate inference failure: API down simulation)
  - Run Test H (Repetition resistance: 3 consecutive related follow-ups)
  - Run Test I (Lore isolation: with vs without stored lore)
  - Run Test J (Traditional vs modern doctrine distinction: Hellenistic vs psychological)
- **Acceptance Criteria**: All 10 tests pass with recorded outputs, settings, and verification notes.
- **Evidence to Record**: Complete input/output transcript logs for all 10 tests.
- **Dependencies**: Tasks 1-6.

---

### Task 8: Voice, Mascot, and UI Integrity Verification
- **Task ID**: `TASK-008-VOICE-MASCOT-INTEGRITY`
- **Objective**: Ensure audio synthesis, karaoke tracking, draggable card, 3D astrolabe interactions, and export remain fully functional.
- **Files in Scope**: `src/services/voiceService.ts`, `src/components/NatallyChatbot.tsx`, `src/App.tsx`
- **Preconditions**: Chat output formatting modified.
- **Required Changes**:
  - Verify `prepareSpeechText` strips any evidence markers or markdown before TTS synthesis.
  - Verify audio playback continues smoothly without truncation or stutter.
  - Verify karaoke tracking syncs with spoken words.
  - Verify conversation export includes accurate timestamps and clean text.
- **Acceptance Criteria**: Zero regressions in voice, mascot, or 3D astrolabe interactions.
- **Dependencies**: Tasks 1-7.

---

### Task 8: First-Light Onboarding Flow (ported from natally)
- **Task ID**: `TASK-008-FIRST-LIGHT-ONBOARDING`
- **Objective**: Port natally's first-light intake (apps/local/src/screens/first-light) into AstroSphere as the sole entry path. Remove FAMOUS_PRESETS entirely — the user's own intake is the only preset.
- **Files Created**:
  - `src/components/onboarding/FirstLight.tsx` (near-verbatim port; IntakeDraft moved to services/onboarding.ts)
  - `src/components/onboarding/first-light.css` (verbatim)
  - `src/services/gazetteer.ts` + `src/services/gazetteer.json` (108 entries incl. user:alexandria-on; tzOffsetHours resolves DST-aware historical offsets via Intl)
  - `src/services/onboarding.ts` (intakeToChartInput, loadNatalIntake/saveNatalIntake under `astrosphere_natal_intake_v1`)
  - `public/fonts/playfair-display-latin.woff2` + OFL license
- **Files Modified**: `src/App.tsx` (onboarding gate via early return; boot recasts persisted intake once; runCalculation returns success; seeded personal lore removed), `src/components/NatalInputForm.tsx` (FAMOUS_PRESETS + picker UI + applyPreset removed; PRESET_CITIES city suggestions untouched), `tests/natally-regression-suite.ts` (baseline fixture inlined). Backups: `src/App.tsx.bak`, `src/components/NatalInputForm.tsx.bak`.
- **Behavior**: Fresh visitor → full-screen FirstLight questionnaire (name → date → place from gazetteer datalist → time, "I don't know my birth time" → 12:00 + Whole Sign). On Begin: draft → NatalChartInput (tz from tzid at the birth moment), persisted to localStorage, chart cast, Natally greeting injected. Returning visitor → persisted intake recast automatically.
- **Verification**: `tsc --noEmit` clean; `vite build` succeeds; dev server serves font 200/38404B; tzOffsetHours checked against known historical offsets (Toronto EST/EDT, London 1815, Zurich 1875, Kolkata +5.5); intakeToChartInput exercised for Alexandria ON and unknown-time paths.
- **Dependencies**: None.

---

### Task 9: Modular Hosted Inference Engines (OpenRouter free live; Venice/admin/local reserved)
- **Task ID**: `TASK-009-INFERENCE-ENGINES`
- **Objective**: Replace the Gemini-only /api/chat & /api/readings cores with an env-selected engine seam. OpenRouter free tier works now; no billing. Architecture anticipates modular billing (Alby marketplace primary, x402/WebLN rails) and a later local llama.cpp/wllama3 engine with no spend limit.
- **Files Created**:
  - `server/inference/types.ts` — InferenceEngine interface; CompletionRequest.subject is the billing seam; UsageReport feeds metering
  - `server/inference/registry.ts` — registerEngine/resolveEngine; INFERENCE_ENGINE env; reserved ids venice/openrouter-admin/local fall back with a logged warning
  - `server/inference/engines/gemini.ts` — legacy Gemini engine (contents sanitization preserved)
  - `server/inference/engines/openrouter.ts` — free-tier default chain (deepseek-chat-v3-0324:free → llama-3.3-70b:free → gemma-3-27b:free), 404/429 chain-walking, usage+cost reporting, 401/403/402/429 error mapping
  - `server/inference/metering.ts` — recordUsage() choke point where the top-up ledger subscribes later
- **Files Modified**: `server.ts` (both proxy routes → resolveEngine().complete(); TTS unchanged), `.env.example` (INFERENCE_ENGINE / OPENROUTER_API_KEY / OPENROUTER_MODEL). Backup: `server.ts.bak`.
- **Verification**: tsc clean; live run: engine resolved `openrouter (auto)`, request reached OpenRouter edge, provider 401 ("User not found." — shell key stale, confirmed against OpenRouter directly) mapped to AUTH_FAILED/401. Happy path awaits a current key in .env.
- **Reserved-engine contracts**: venice = ADMIN key + POST /api_keys {consumptionLimit.usd, limitPeriod} per user on top-up; openrouter-admin = Provisioning API per-user key spend-limited to 40% of top-up, stored on user's Firebase doc; local = atomic-chat llama.cpp/wllama3, available() true offline, no metering.
- **Dependencies**: None.

---

### Task 10: Generic OpenAI-Compatible Engine + Live Free-Tier Rescue
- **Task ID**: `TASK-010-OPENAI-COMPATIBLE-ENGINE`
- **Objective**: Use the z.ai GLM Coding Plan (glm-5.3-flash) or Ollama via a generic OpenAI-shaped endpoint; make Venice usable now as direct inference; survive OpenRouter free-tier model churn.
- **Files Created**: `server/inference/engines/openai-compatible.ts` — factory + `customOpenAIEngine` (CUSTOM_LLM_BASE_URL/KEY/MODEL/MODELS; Ollama needs no key) + `veniceEngine` (VENICE_BASE_URL/API_KEY/MODEL, default venice-uncensored-1-2).
- **Files Modified**: `server/inference/engines/openrouter.ts` (chain → nvidia/nemotron-3.5-lightning:free, thinkingmachines/inkling:free, poolside/laguna-s-2.1:free; OPENROUTER_BASE_URL honored; "unavailable for free" mapped to MODEL_NOT_FOUND; discoverLiveFreeModel() queries /models when the chain dies and retries once), `server/inference/registry.ts` (registers openai-compatible + venice; reserved ids now venice-admin/openrouter-admin/local), `.env.example` (user-populated dummies preserved; CUSTOM_LLM_* and VENICE_MODEL documented).
- **Verification (live)**: openrouter → `nvidia/nemotron-3.5-lightning:free` HTTP 200 "stellar"; venice → `venice-uncensored-1-2` HTTP 200. z.ai path = same code path as venice (factory), awaits CUSTOM_LLM_* population. TTS remains Gemini-key-only as planned.
- **Dependencies**: Task 9.

---

### Task 11: Surge Deploy Prep + KStore Workstation Wiring
- **Task ID**: `TASK-011-SURGE-PREP-KSTORE`
- **Objective**: Static deploy to natally.surge.sh on z.ai glm-5.3-flash (Coding Plan); wire this host's KStore pre/post hooks.
- **Delivered**: client browser-direct seams (`askNatallyDirect` VITE_LLM_*, `synthesizeGeminiTtsDirect` VITE_GEMINI_API_KEY, thinking-model content/reasoning fallback); scripts/deploy-surge.sh; dist/ built with ZAI_API_KEY from KStore GET /config (coding base live-verified 200 + CORS open to surge origin; general base 429). Gemini .env key INVALID → excluded; TTS rides fallback ladder. KStore diagnosis: real port 8788 (8878 was transposition); workstation client deployed (release 2ca3e93) incl. Claude hooks; TAB-through-ssh pg-channel root cause found and fixed config-side; capture verified (archive + PG readback + native record). Admin-Manual session log pushed (5fe6632 + hook-repair addendum).
- **Blocked**: surge auth (not in KStore — /search hangs server-side; no ~/.surge). Awaiting `! npx surge login`.
- **Dependencies**: Task 10.

---

### Task 12: Onboarding UX Fixes (Android/desktop live findings)
- **Task ID**: `TASK-012-ONBOARDING-PICKERS-V2`
- **Fixes**: (1) native date input presented no picker anywhere → hybrid typed field (inputMode numeric, Android keyboard, YYYY-MM-DD ours — never locale-reversed) + 🗓️ CalendarPicker popover (new component, 1800–2400 clamp); time likewise typed HH:MM. (2) Sign-in now precedes onboarding (AuthModal gate; authResolved loading state). (3) Geo combobox confirmed reaching the live bundle. Deployed bundle index-DtYeFI3j verified.
- **Dependencies**: Tasks 8, 11.

### Atelier refinement coverage (DR05/06/09; acceptance remains the continuous journey)
- [ ] Demonstrate varied vowel-informed mouth shapes during real speech and retained replay, with quiet closures on pause.
- [ ] Pick up a prop with visible depth, place on each shelf by release, rearrange crowded props, and observe optional topple/shatter sound plus silent pause.
- [ ] Exchange atelier and chart main/inset repeatedly; the real chart remains rendered in its inset.

22 October history correction: no atelier-only reset. Ordinary chat clearing does not repair objects. Only explicit erasure of the entire Natally relationship history resets damage/placements; eventual actual replacement is separate. Demonstrate the scope/confirmation without deleting the operator's real history.

Further live feedback: switching main/inset views must never interrupt narration-driven chart highlighting; pinning selects layout only. Observe spoken focus continuing through a mid-sentence view swap and in the inset. Cloudiness must visibly drift continuously, with distinct wisps rather than a static painted ball; gentle hand cradling continues and thinking/scrying has stronger massaging motion, including the inset. Pause/reduced-motion/hidden-page controls remain respected.

- [ ] DR03/DR09 relationship correction: demonstrate both endpoints and their actual aspect line during narration, including Mercury/Moon when calculated; distinguish dated now-to-natal relationships from natal-to-natal. All five supported aspect forms, legible conjunction, view swaps/inset continuity, refresh provenance and honest unavailable state belong to the existing continuous journey.

- [ ] Relationship journey continuation: repair the observed hosted prompt-size rejection, obtain a real response discussing current Mercury square natal Moon, demonstrate both highlighted endpoints and connecting line through main/inset changes, with crisp readable endpoint names/placements over the halo. Include this in the continuous journey, not a build-only completion.

- [ ] Continue the same chart journey: hover an intersecting aspect and distinguish it before clicking; leave it and retain the narrated selection. Replay a historical reading and observe passage-by-passage relationship highlights, with truthful natal/observation identity.

## 22 October — offer, style and seasonal appointments

Architecture and exhaustive continuous script: DOCS/superpowers/plans/2026-10-22-offer-style-season.md.
- [ ] 🟨 OFFER-1 — onboarding → clear Stitch-derived offer → purchase or free exploration (scene 1–2).
- [ ] 🟨 OFFER-2 — all download entry points, prepaid verification, purchase/recovery/account boundary (scene 3–4); real payment adapter/catalog unavailable.
- [ ] 🟦 STYLE-1 — final language choice, saved settings, prompts, unchanged historical replay (scene 1, 5).
- [ ] 🟦 NOW-1 — fresh instant horoscope/horrorscope, one request, recoverable errors and presentation/audio continuity (scene 2, 5–6).
- [ ] 🟫 ROOM-1 — opt-in themed layer, cookies, sound, durable object identity (scene 6, 8).
- [ ] 🟫 ROOM-2 — fall/shatter/reaction sequence and new-appointment clumsy repairs (scene 7–8).
- [ ] 🟫 ROOM-3 — bookcase tops and unobstructed lower shelves/inset (scene 7).
- [ ] 🔴 Cross-cutting physical-device and reduced-motion journey (scene 9).
- [ ] 🟫 Publish/deploy and map actual evidence; package builds do not establish acceptance.
- [ ] 🟨 LEARN-1 — prominent guide, all three sections, five free lessons and honest payment availability; demonstrate at the start of the room journey and return without losing reading position.
- [ ] 🟫 ROOM-4 — freely draggable/dockable inset, keyboard movement, persistent placement, view continuity, resize and shelf avoidance; real cookie Foley remains blocked on fal connection/billing mismatch.

22 October release observation: implementation and deployment are published through 7351554; evidence map in HOSTED_CHAT.md. Guide/lessons/payment explanation, all download offer routes, actual instant readings, saved style/theme, taped next-appointment repairs, bookcase/lower-right placement and movable/dockable card were observed on desktop. Individual observations do not close the comprehensive rubric. The interrupted tour, unavailable real commerce/new-account/phone scenes and rejected cookie sound remain open. Fal generation returned billing/account mismatch; no replacement sound is claimed.

Cookie Foley dependency resolved through the actual robinsaiworld dashboard (USD 11.96 displayed), not the misrouted MCP connection. Generated MP3 bundled; synthesized snare-like effect removed. Listening acceptance remains open; provenance in DOCS/COOKIE-FOLEY.md.


ROOM-2 refinement (22 October): the first break now triggers a 1.42-second irregular eye twitch (four times the previous 355 ms span) while looking toward the fallen prop. Second-break eye roll remains, followed by the twitch. Gaze and speech pause last 3.2 seconds (latest operator timing refinement); successive breaks restart the hold. Rehearse breakage opens isolated, in-memory fresh props with a repeatable reset; returning or refreshing restores real shelf history. Violet, green and rose crystals are all interactive breakable props.

Continuous scene 7 extension: enter rehearsal from the room, pick up the violet crystal and let it fall during actual narration; capture first-break directional twitch and 3.2-second pause/resume. Reset rehearsal and repeat with green and rose crystals; break two in succession to observe renewed hold and second-break roll. Return to real shelves, preserving existing tape/positions. Continue scene 8 refresh and scene 9 reduced-motion/device continuity. Rehearsal is not whole-history erasure.

ROOM-5 crystal pool: pointer movement stirs luminous refracted wakes inside the cloudy glass, clipped around the moving hands; bounded wakes expand, curl and dissipate while base cloud motion continues. Keyboard Enter/Space stirs the centre; reduced motion retains a steady glow. Extend scene 7 before breakage: sweep across ball, reverse direction, leave and observe settling, use keyboard, switch inset/main with cloud continuity; include motion-pause and phone touch in scene 9.

VOICE-ANGLE: expand angular notation only for synthesis (1 degree, 20 arcminutes for 1°20′), retaining original display offsets and chart cues. Extend continuous replay scene with natal Venus at 1°20′ Libra and an actual 120° aspect; listen for distinct units. Existing saved recordings retain old audio; regenerate through Replay Voice for corrected speech.

ROOM-2 tape correction: replace crossed X strips with four uneven mummy-style circumferential bands, shaded side folds, overlapping edges/wrinkles and a loose tail. In scene 8 inspect a restored crystal at normal and picked-up size; the repair must read as wrapped tape.

DR03/STYLE-1 correction: narration highlights are automatic in both layouts; remove Follow Natally button. Supplement missing authored focus cues from explicit named subjects and calculated relationship inventory, preserving dated observation identity and source offsets. Never guess old transit positions. During continuous replay scene, use a reply with missing authored commands, switch layouts and manually select another component: narration must recover its focus. Both language-depth options retain the established casual Gen-Z peer voice; prior formal replies are not stylistic exemplars. Observe a genuinely generated follow-up, not a rewritten fixture.

OFFER-3: purchase includes one year revisiting the frozen interactive atelier/conversation, with dated chart and retained voice, alongside the offer's PDF/audio files. New inference remains separate conversational credit; downloaded files do not expire. Offer copy now states this. Implementation of durable frozen snapshot hosting, purchase-linked one-year entitlement/start/end timestamps, read-only archive replay, expiry/recovery and provider verification remains open with the unconfigured commerce service. Extend purchase scene 4 with verified archive grant, revisit, original sky/room snapshot, boundary-date expiry and continued file ownership. Do not claim deployed offer copy establishes durable one-year access.

22 October handoff: backdrop dismissal added to purchase dialog. Hosted inference now loads with the app instead of a later hashed import; future builds retain earlier output assets for open tabs, and instant-reading stale-module errors offer an explicit reload. These edits are committed for cross-computer continuity; final runtime demonstration and main merge are still pending. Ambient music: Fal Stable Audio 3 Small Music selected (displayed USD 0.0217/audio); funded robinsaiworld dashboard prompt prepared, no ambient Run submitted yet. Finish two loops, opt-in controls/view crossfade/voice ducking, then final journey and merge to main. Billing/one-year frozen archive, native Tauri2 and Alby marketplace continuation belongs on a separate branch.

AMBIENCE-1: two bundled generated instrumental soundscapes, warm workshop and celestial chart, opt-in per appointment with remembered volume. Crossfade on main-view changes, lower music during speech, suspend on hidden page, dispose on account switch/unmount; no autoplay on refresh. Close-loop audio processing overlaps the generated tail/head. Continuous room scene: enable ambience, adjust volume, exchange main/inset during real speech and hear the mix duck/recover, let each track loop, mute, hide/return, refresh and observe silent default. Listening/touch observation must be recorded distinctly from asset generation or UI state.

Ambient handoff update: both Fal generations completed (USD 0.0434 displayed combined estimate), processed loops bundled, optional crossfade/ducking control implemented. See DOCS/ATELIER-AMBIENCE.md for provenance. Earlier pending-generation note is superseded. Backdrop dismiss and stale-chunk handling join the final runtime trajectory.

- [ ] 🟪 FOLEY-1 (ROOM-2/3): generated physical break and wooden-shelf wobble audio. Extend continuous scene 7: with room sound on, nudge a crystal gently then repeatedly and hear discrete weighted wooden contacts; pick up and place it on another shelf, then let it fall during narration and hear impact/shards aligned with the fall and Natally pause. Repeat with glass and brass in rehearsal, including rapid pointer movement without loud stacking, mute during a tail, background/return, refresh with repaired props, and reduced motion. Record actual listening and motion sequence, not just asset availability.

FOLEY-1 scene 7 refinement, 23 October: use the operator's bowlingball.mp3 for non-gem rocking/placement, retain current gem rocking. During the existing continuous room scene, nudge/place hourglass, armillary and vial, then each gem, listening for the respective supplied/original contact sound. Continue to fall/shatter, verifying contact sound stops and the previously selected material crash remains. Sound listening remains distinct from file publication.

## Authoritative task sequencing — Robin, 23 October 2026

1. Finish billing functions and actual purchase/entitlement/download flows.
2. Complete release readiness for the current web application, including the outstanding architecture/checklist journey and Alby marketplace requirements.
3. Only after those outcomes, implement Tauri2 de novo for all platforms from the release-ready web baseline. The earlier platform branch is preserved history, not the implementation to merge or resume. Platform work must not precede billing and web release readiness.

- [ ] READABILITY-1 -> DOCS/ARCHITECTURE.md READABILITY-1: restore outlined inline references from recovered source spans; maintain natal/dated-sky identity, formatting and speech offsets. Demonstrate in the extended continuous reading scene.
- [ ] READABILITY-2 -> DOCS/ARCHITECTURE.md READABILITY-2: legible numbered sector badges through dimming, selected-house emphasis and main/inset continuity; preserve unknown-time omission. Evidence follows the same scene.

READABILITY-1/2 implementation and desktop observations: source f0ee196 + 6ff5fe1 pushed/deployed; see DOCS/DEMONSTRATIONS/2026-10-22-delivery-observations.md. Full continuous demonstration remains open.

## STYLE-2 — branded spoken register

| Task | State | Architecture references | Required continuous observation |
| --- | --- | --- | --- |
| STYLE-2A | IN_PROGRESS | V01–V06 in DOCS/ARCHITECTURE.md | One shared voice; competing concise/counsellor directions removed; chat and generated-reading routes receive it after contextual instructions. |
| STYLE-2B | NOT_STARTED | V01–V06 | Publish and deploy; fresh instant reading -> neutral follow-up -> other depth -> refresh, with actual passages, sound/cues and screenshots; preserve existing history. |


## 24 October — explanation and immediate delivery

Architecture/rubric: DOCS/ARCHITECTURE/2026-10-24-explanation-delivery.md. Existing obligations stay open.
- [ ] ED-A -> ED01, E1/E3: real plain-language relationship teaching and preserved character.
- [ ] ED-B -> ED02, E2: spoken chart/atelier return, replay, seek and manual pin.
- [ ] ED-C -> ED03, E1/E3: all routes stream text/speech, default ahead preparation, stop/mute/recovery/account continuity.
- [ ] ED-D -> ED04, E4: seasonal signs and actual cookie interactions across room themes and phone width.
- [ ] ED-E -> ED05, E5: GitHub/Surge delivery and evidence mapping; device/listening distinct.


ED-A operator refinement: remove Merlin selection and onboarding depth step; migrate legacy preference behavior to one educational standard. READING_RUBRIC.md covers objects, endpoints, interpretation rationale, theme adaptation and synthesis. Extend E1/E4 with absent selector, returning legacy profile and unchanged saved history.

- [ ] M-A: Real generated fictional episode is retained and revisited consistently; SOUL behavior defined.
- [ ] M-B: Unified account cloud memory, idempotent local migration, real-time subscription, correction and deletion across devices (currently local only).
- [ ] M-C: Preserve immediate streaming; distinguish optional educational omissions from factual/biographical errors.
- [ ] P-A: Remove public free-inference promises; paid server provisioning, ledger, receipts, x402 and native purchases remain separate open work.

- [ ] BV-A/BV01: One configured Natally voice; legacy speaker/pitch/tone choices normalize at load/save/playback.
- [ ] BV-B/BV02: Obsolete Gemini/provider wording removed; speech locality described accurately.
- [ ] BV-C/BV03: Nonfunctional character/intensity/movement options removed; reset persists without undefined references.
- [ ] BV-D/BV04: Listening controls remain; technical resource/measurement options are optional details.
- [ ] BV-E/BV05: Continuous desktop/mobile-width settings journey and delivered build identity; acoustic/device evidence distinct.

BV delivery note (2026-10-24): BV01-04 implemented; live desktop/390x844 panel,
reset 0.95 -> 0.90, mute persistence, expanded details, close, and reload observed.
Modal portal fixes header overlap discovered during observation. Surge release
1792824926513 / app-DVtgbDPj.js delivered. Continuous recorder interrupted;
BV-E stays open, as do legacy-choice acoustic migration and physical-device
acceptance. Evidence and exact limits: DOCS/ARCHITECTURE/2026-10-24-fixed-character-voice.md.


# Atelier-first correction — 25 October 2026

| Task | State | Entities | Evidence trajectory |
| --- | --- | --- | --- |
| AF-1 | COMPLETE | AF01–AF03 | Scene first at 924×827; controls and chart details remain usable |
| AF-2 | COMPLETE | AF04 | Live desktop/mobile screenshots and chart/atelier navigation; commit/push/deploy |

