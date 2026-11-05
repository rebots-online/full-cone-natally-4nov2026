# Outstanding work

Product work is stopped on operator instruction; resume only when instructed.
Post this open list every turn. Remove an item when its outcome is complete.
Four states: 🟨 NOT_STARTED, 🟦 IN_PROGRESS, 🟥 BLOCKED, 🟩 COMPLETE (then remove).
Yellow refers to remaining work; existing partial implementation is retained.
Only named current assignments are marked in progress. The canonical build script
alone owns versions, build numbers and platform artifacts.

| State | Task | Remaining outcome |
| --- | --- | --- |
| 🟨 NOT_STARTED | STOP-HARM | Order 1 (Robin 2026-11-02). The live Cloud Run billing service still runs the pre-a1ad54d code: card purchases credit RevenueCat ROCHE while the reading limit reads the firebase wallet (Robin was charged US$1.98 for two $0.99 units and received no reading). Pause card checkout in RevenueCat Web Billing/Stripe until the fixed service is live; the $1.98 is already correctly recorded in RevenueCat ROCHE, the authoritative store (Robin 2026-11-02): deploy with BILLING_CREDIT_BALANCE_STORE=revenuecat so the key limit reads it, or refund. Dashboard actions are Robin's. |
| 🟦 IN_PROGRESS | BILLING-HOST | 2026-11-02: billing runs on the existing Netlify function mechanism (netlify/functions/billing.mjs wraps billing/runtime.mjs unchanged; Blink's /billing/blink/* untouched). The development relay netlify/functions/reading-access.mjs (one personal OpenRouter key for one email) is removed. Remaining (Robin): set the billing env vars in the Netlify site from KStore with BILLING_CREDIT_BALANCE_STORE=revenuecat; deploy; point VITE_BILLING_API_URL at the Netlify site and the RevenueCat webhook at /billing/webhook; verify /billing/health and a real purchase → reading; then retire Cloud Run. Note Netlify's synchronous function timeout (default 10 s) against access's sequential provider calls. |
| 🟨 NOT_STARTED | PLAY-CLOSED-TEST | Order 3 — top launch priority: the 14-day, 12-tester closed test is a fixed lead time; start it as soon as a build passes Robin's line ("if it can't give a reading but can take your crumbs, don't submit it"). v1.41.92153 is WITHHELD: its card checkout calls the live defective Cloud Run service. Submit the first build_all.sh build that includes a1ad54d and points at the new billing host (signed AAB + native-debug-symbols ZIP). Tester: Robin's established Fiverr tester. Upload/listing actions are Robin's. Provider funding and the Venice/OpenRouter split are on hold behind this. |
| 🟦 IN_PROGRESS | REDEMPTION-OUTCOME | Chain PROVEN end-to-end 2026-11-01 (DOCS/DEMONSTRATIONS/billing-e2e-20261101/): redemption 200 with the configured $10 allowance, per-user OpenRouter key provisioned at limit $10, real natal chart reading through the key, idempotent re-redeem. Firebase wallet (policy-mandated store) shipped. Remaining: serve the same runtime from an approved host (Cloud Run frozen per cost-gating; Oracle/Netlify ruling pending). |
| 🟨 NOT_STARTED | REDEMPTION-KINDS | Later (Robin 2026-11-02). Today only the .env admin code exists: it adds BILLING_REDEMPTION_ALLOWANCE_USD (US$4 = 400 credits, 1 credit = 1 cent) to the RevenueCat balance once per redemption. To design: gift certificates (add to the spend balance), coupon codes (e.g. 30% off at checkout), AppSumo-style single-use codes; RevenueCat stays authoritative. |
| 🟦 IN_PROGRESS | PURCHASE-OUTCOME | 2026-11-02: fixed card purchases crediting RevenueCat ROCHE while the key limit read the firebase wallet; all rails now credit the one runtime wallet (DOCS/ARCHITECTURE.md single-wallet rail amendment). Implementation + regression test done. Remaining: actual purchase on the deployed backend shows the correct balance, raised key limit, confirmation, official invoice and history. |
| 🟨 NOT_STARTED | MINIMAL-BILLING | Reuse Google name/email and existing actual billing facts; request only missing transaction-required information. Remove the mandatory full-address form for every top-up. |
| 🟨 NOT_STARTED | ZERO-BALANCE | Hide verified zero balance rather than displaying 0 Cr. Preserve a useful top-up action and truthful unknown/error states. |
| 🟨 NOT_STARTED | TOPUP-LANDING | Top Up opens the landing-page explanations before asking the customer to choose an amount. |
| 🟨 NOT_STARTED | INAPP-OFFER-CONTENT | After the landing handoff works, import the explanatory content into the app and restore native Google Play billing. |
| 🟨 NOT_STARTED | RESTORE-VALUE | Recover verified paid purchases idempotently; give an accurate result when value could not be recovered. |
| 🟨 NOT_STARTED | SERVICE-OFFERS | Complete the approved full-workup and guided-exploration offers, comparison and matching purchase/delivery paths. Lead with customer benefit. |
| 🟨 NOT_STARTED | ACCOUNT-ACTIONS | Put related retry and restore actions together on one compact row. |
| 🟨 NOT_STARTED | LC-02 | Complete the visible, scroll-aware inset and clearly identified anonymous example calculated by the real chart engine. |
| 🟨 NOT_STARTED | LC-04/05 | Complete the above-fold primary action and compelling plain-language opening. |
| 🟨 NOT_STARTED | LC-06 | Complete platform-aware installation entry. |
| 🟨 NOT_STARTED | AUTH | Complete remaining sign-in and branding integration. |
| 🟨 NOT_STARTED | PLAY | Complete Google Play purchase, subscription and restoration integration. |
| 🟨 NOT_STARTED | READING-FLOW | Finish Horoscope, comprehensive Synastry, personal reading/education flow and genuine-session entry (3-7,29,38-39). |
| 🟨 NOT_STARTED | NAVIGATION | Finish remaining header/top-up integration, matched actions, navigation and account-preserving updates (8-9,19-21,43). |
| 🟨 NOT_STARTED | ATELIER | Finish remaining scene, sticky window, swapping, interactive objects, chart controls and signage (10-14,35). |
| 🟨 NOT_STARTED | VOICE-STORIES | Finish remaining professional voice, authored vignettes/stories, phrase variation and repetition avoidance (15-18,31,34). |
| 🟨 NOT_STARTED | PREFAB-GENZ | Restore Natally's specified Gen Z lingo in the prefab free content. Correct the authored text paths as well as any persona instructions; preserve free availability, factual content and speech/lore safeguards. |
| 🟨 NOT_STARTED | LORE | Finish relevant customer-lore retrieval each turn (30). |
| 🟨 NOT_STARTED | SOUVENIR | Finish the distinct interactive souvenir, retained reading, add-on handoff and PDF flipbook (4-7,22,27). |
| 🟨 NOT_STARTED | SOUVENIR-OFFERS | Finish the airplane-towed offer, cookie marquee and coordinated spoken invitation (28,33,42). |
| 🟨 NOT_STARTED | SEASONAL | Finish configured seasonal availability (36). |
| 🟨 NOT_STARTED | LOCATION | Finish current-location/observation-timezone integration (37). |
| 🟨 NOT_STARTED | COST-STATS | Measure actual completed questions and costs, distinguish transfer pricing, and derive questions remaining. |
| 🟨 NOT_STARTED | ANALYTICS | Finish commercial measurements and the brAInstormer product/GA map with two-way UI instrumentation (32). |
| 🟨 NOT_STARTED | KSTORE-SEARCH | Fix KStore retrieval: semantic search for 'namecheap' returned activity noise instead of the ingested credential doc CREDENTIALS/global-infrastructure/namecheap.md (found only via direct Postgres query 2026-11-01). Investigate ranking/embedding of CREDENTIALS docs vs activity captures. |
| 🟥 BLOCKED | PLATFORM-RELEASE | Run the canonical automatic platform build/publication after web purchasing works. |
| 🟦 IN_PROGRESS | CROSS-PLATFORM-BUILD | 2026-11-02: build_all.sh restored at the repo root as the ONLY build entry (npm build scripts call it), from natally-ubuntu, after a Windows session had replaced the entries with powershell.exe-only calls. Auto-stamp (CC2), all platforms per run (CC11): Ubuntu builds Android aab/symbols/apk, Windows exe + NSIS via cargo-xwin, AppImage/deb/rpm, web+PWA (MSI pending); booted into Windows it hands off to build-all-platforms.ps1, which adds the Store MSI. --deploy-web publishes to natally.robin.mba + natally.surge.sh; deploy-surge.sh no longer requires npm.cmd. Also ported: host-aware KStore transport, workstation-agnostic caches, landing mount/re-entrancy/version-badge fixes, version continuity v1.41.92153. 2026-11-03: Windows-host canonical full matrix completed as v1.42.95682 after web publication; Android/Windows/Linux artifacts verified, both hosts passed 97 served-path checks. Evidence: DOCS/DEMONSTRATIONS/release-1.42.95682/. Remaining: first observed full matrix on the other real computer; retire natally-ubuntu. (INC-21) |
| 🟨 NOT_STARTED | DELIVERY-EVIDENCE | Finish continuous actual customer-journey recording and release evidence, including remaining landing/control observations. |

## Coder contracts

Frozen architecture: DOCS/ARCHITECTURE.md R12 (commit e9522ff2), which also
carries the R12.1 closed entry contract and the six environment keys. The R11
INSET-CALLOUTS and ACCOUNT-VALUE recipes, exact copy, preauthored demonstration
rubric and recipe attestation are retained verbatim in
DOCS/ARCHIVE/checklist-before-open-only-20261031.md and remain in force.
Completed phases stay in that record rather than cluttering this open list.

On resumption, select the highest-priority ready outcome from this list. Record
its architecture, independent recipe/rubric, assigned coder, source comparison,
publication and real outcome evidence. Latest authoritative state is in
DOCS/HANDOFF-20261031.md; use it rather than repeating completed phases.

Original landing and carried-forward recipes remain in
DOCS/ARCHIVE/checklist-before-v1.30.md. No completed feature is reimplemented merely
because its recording obligation remains open.

# R12 — frozen four-state coder tasklist (created 2026-11-01; HOLD before dispatch)

## Coder instructions — read before your task, then work ONLY your task

1. Canonical root: this repository, branch master. Single authority: your task
   block below. It restates everything you need. Do not open neighboring files
   beyond your scope list, do not explore the repo, do not "improve" anything
   outside the numbered requirements. If anything in your task seems wrong or
   blocked, STOP and return a blocker report — do not self-rescue, do not
   invent entities, do not bridge gaps.
2. You own ONLY the files in your task's Scope (closed set). You do not run
   builds, deploys, typecheck, lint, tests, recordings or Git. The parent owns
   Git, integration typecheck, build and publication. You author edits in place
   in the working tree and return your diff.
3. Preserve everything not named by a requirement. No new dependencies, no new
   providers, no new configuration, no placeholder or mock content, no customer-
   facing fakery. Reduced-motion, accessibility and existing guards are sacred.
4. Report format (mandatory): (a) unified diff of every file you touched;
   (b) a requirement→diff mapping table, one row per numbered requirement;
   (c) `RESOLVED: <task-id> → <file>:<line> [anchor=<name>]` lines for every
   block you added or moved, on success and on blocker alike; (d) any blocker
   with the exact line that blocked you.
5. Markers: flip nothing yourself except acknowledging assignment in your
   report. The orchestrator records `[/]`, you report completion for `[X]`, and
   the supervisor flips ✅ only after semantic comparison of your diff against
   this task text. Same coder corrects deficiencies; nobody else rewrites you.
6. The five tasks R12-A..R12-E own disjoint file sets and may run fully in
   parallel. Shared contracts you consume but do not own (environment keys,
   `getAuthoredUpsellClose`, `VITE_APP_NAMESPACE` prefixes) are frozen verbatim
   inside each task — code against the frozen signature, never against another
   task's implementation.

## Environment keys — frozen verbatim (consumed by A, C, E; defined by E)

| Key | Default |
| --- | --- |
| VITE_LANDING_PATH | /landing |
| VITE_LANDING_PATH_ALIAS | /landing.html |
| VITE_APP_PATH | /app.html |
| VITE_LEGACY_PATH_REDIRECTS | /marketing.html:/landing |
| VITE_APP_NAME | Natally |
| VITE_APP_NAMESPACE | natally |

Client code reads `import.meta.env.VITE_…` (typed accessor of your choice
inside your scope; must fall back to the frozen default when unset).

---

## Task R12-A — MARKETING-REPLICA (landing hero example-chart replica)

**Stage states:** formulated ✅ (e9522ff2) · assigned [/] · undertaken [X] · completed [X] · validated ✅ (2026-11-01 supervisor semantic pass; scope files published via WIP crash-checkpoints 5c6ef3d6..3f95e18a; integration tsc exit 0)

**Scope (closed):** `src/marketing.tsx`, `src/marketing.css`. Nothing else.

**Current code you are changing (verified anchors, 2026-11-01):**
- `src/marketing.tsx:45` `const GUEST_ROOM = '__marketing_guest__';`
- `:85` `voiceAllowedRef`; `:90` `educationSession` ref; `:94-95` `roomUid` / `ownedChart`;
  `:96` `automaticView`; `:97-100` `narratingChart`; `:101` `view` derivation;
  `:127` `insetKey = 'natally.marketing.inset-position.' + roomUid`;
  `:206` `speak(text, explicit, narrationTargets, entryPoint, idle, onAdmitted)`;
  `:249-296` `load(uid)`; `:441-458` `explain(target)`;
  `:502-545` sticky-frame JSX: room pane `:505-510`, chart pane `:512`
  (`hidden={!ownedChart}`, attrs `data-chart-callout-boundary` and
  `data-chart-inset={view!=='chart'}`), `Astrolabe3D` mount `:514-517`,
  inset handle `:520-532`, controls/select `:534-545`, text/caption/lesson `:547-564`.
- `src/services/ephemeris.ts:223` `calculateNatalChart(input: NatalChartInput):
  Promise<NatalChartResult>` — already imported at `marketing.tsx:15` area.

**Implement exactly:**

A1. Add frozen entities:
```ts
const EXAMPLE_CHART_INPUT: NatalChartInput = {
  name: 'Aurelia (example)', birthDate: '1997-11-08', birthTime: '19:05',
  placeName: 'Toronto, ON, Canada', latitude: 43.6532, longitude: -79.3832,
  timezoneOffset: -5, houseSystem: 'W',
};
async function loadExampleChart(): Promise<NatalChartResult> // calculateNatalChart(EXAMPLE_CHART_INPUT), computed at most once per visitor session, cached in a ref; never triggers network/auth/inference.
```
A2. Derive `displayedChart = ownedChart ?? exampleChart`. Replace the render
gates on `ownedChart`: chart pane `hidden` (`:512`), `Astrolabe3D` mount
(`:514`), inset handle (`:520`), placement selector (`:536`). Pass
`chart={displayedChart}`. `view` (`:101`) becomes:
`displayedChart ? manualView || (lessonChartActive ? 'chart' : automaticView) : 'atelier'`.
A3. New state `lessonChartActive: boolean` — true from the moment a lesson is
set in `explain()` until it settles (speech completed/stopped/failed, or panel
dismissed/replaced, or account/intake change); true even when voice was not
admitted (text-only lesson). The user's manual view choice during the lesson
overrides and cancels the auto-revert (existing `manualView` semantics).
A4. Captions (closed set):
- Signed-out, or signed-in without intake, while the example chart shows,
  exactly: `Example chart — Aurelia, an anonymous example born 8 Nov 1997,
  7:05 PM, Toronto. It is not your chart.` followed by a link
  `Create your natal chart ↗` → `${VITE_APP_PATH ?? '/app.html'}?app=1`.
- Owner `ready` phase keeps the existing owner caption unchanged.
- Never label the example as the visitor's chart.
A5. Guest education: key `educationSession` by `roomUid` (guest gets its own
`createAuthoredEducationSession(roomUid, …)`); `explain()` operates on
`displayedChart`; `speak()` must not require an authenticated owner for the
example path; voice still begins only after an explicit gesture
(`voiceAllowedRef` starts false — unchanged); no inference call anywhere.
A6. After every prefab lesson, append the frozen-contract close
`getAuthoredUpsellClose(displayedChart, 'default')` (signature below; the
R12-D coder owns its file) to the lesson panel text and the same spoken flow.
A7. Inset key becomes
`` `${import.meta.env.VITE_APP_NAMESPACE ?? 'natally'}.marketing.inset-position.${roomUid}` ``
— byte-identical to today's key under the canonical default.
A8. Keep: Phase machinery and generation guards (account/intake change clears
lesson/selection/speech for the example exactly as for an owner chart),
`GUEST_ROOM` room isolation, shelf-avoidance listener, spring scroll behavior,
R11 callout boundary attributes on the chart pane, drag/snap/keyboard handle
behavior, `AtelierAmbience`, and every existing control.

**Frozen contract you consume (do not implement):**
```ts
// src/services/authoredChartExplanations.ts (owned by R12-D)
export function getAuthoredUpsellClose(chart: NatalChartResult, variant: 'default' | 'souvenir'): string;
```

**Forbidden:** editing any file outside scope; changing `Astrolabe3D`
internals; wiring inference/LLM; altering billing; adding dependencies;
placeholder text; touching `.env` files (R12-E owns them).

**Accept (idempotent):** your returned diff contains every A1-A8 with nothing
extra; requirement→diff mapping is 1:1; parent typecheck after integration
exits 0; supervisor semantic comparison against A1-A8 flips ✅.

---

## Task R12-B — RENDERER-TWOPATH (two-path inset click; vivid-frame dimming)

**Stage states:** formulated ✅ (e9522ff2) · assigned [/] · undertaken [X] · completed [X] · validated ✅ (2026-11-01 supervisor semantic pass; scope files published via WIP crash-checkpoints; integration tsc exit 0)

**Scope (closed):** `src/components/Astrolabe3D.tsx`. Nothing else.

**Current code you are changing (verified anchors, 2026-11-01):**
- `:9-25` props interface (unchanged — no new props);
- `:252-320` static structure creation: torus bezels, floor disc, guide rings
  (the plum-and-metal frame), children of the tilted `wheelGroup`;
- `:531-584` `onClick` — today line `:549` `if (activateRef.current) {
  activateRef.current(); return; }` short-circuits EVERY inset click before
  raycasting;
- `:586-596` `onTouchActivate`;
- `:1313-1328` focus dim traverse — comment says "including the metal frame";
  `:1325` multiplies opacity by `CHART_FOCUS.dim` for every non-focused,
  non-`orientationAnchor` object;
- `:1330-1353` `applyHover` opacity variant (`:1350` same multiplication);
- `src/services/chartFocusVisuals.ts:2` `CHART_FOCUS` — DO NOT change this file.

**Implement exactly:**

B1. Two-path inset activation in `onClick`: while the chart is inset (detected
exactly as today via `container.closest('[data-chart-callout-boundary]')`'s
`data-chart-inset === 'true'`), raycast BEFORE the `activateRef` check:
- Object hit with `userData.selectable !== false` → call
  `activateRef.current?.()` first (when present), then DEFER the
  `onToggleComponent(componentId, isMulti)` call until the containing pane's
  CSS transition ends — reuse the existing `layoutKey`/`transitionend redraw
  path — or invoke immediately when `reducedMotion` is true. `componentId` and
  `isMulti` resolve exactly as the foreground path does today (`:557-582`),
  including the existing selection analytics.
- No object hit → `activateRef.current?.()` only (today's behavior).
- Foreground (`data-chart-inset` false): behavior byte-identical to today.
B2. New ref `pendingInsetSelectionRef` holds the deferred selection; clear it
on unmount, drag start, chart rebuild, and any new pointerdown; it must never
fire a stale selection. `onTouchActivate` follows the same two-path rule for
object taps.
B3. Vivid-frame exemption: at structure creation (`:252-320`) set
`userData.structureFrame = true` on every structural mesh (torus bezels, floor
disc, guide rings — and nothing else). In the dim traverse (`:1313-1328`) and
`applyHover` (`:1341-1352`), materials of `structureFrame` objects keep their
recorded `focusBaseOpacity` — never multiplied by `CHART_FOCUS.dim`. The frame
stays vivid at full opacity while non-focused representational elements
(planets/glyphs, sign baubles/cusp ticks, house spokes/badges/sector fills,
aspect lines/tubes, current-sky bodies) dim exactly as today. Replace the
`:1313` comment with one stating: structural frame meshes are exempt and stay
vivid; only non-focused representational elements dim.

**Preserve absolutely:** R11 outside-inset callout placement and dismissal,
endpoint-card suppression while inset, drag/momentum + 4px drag-click
suppression, occlusion `elementFromPoint` guard, wheel/pinch zoom clamps,
`baseSpin` slow rotation and hover-pause, selection halos and
`chartHaloOpacity`, annotation modes, per-renderer overlay ownership/cleanup,
`resetTrigger`, visibility/tab-hidden sleep, analytics events.

**Forbidden:** changing props interface or any file outside scope; camera
policy changes; new animations; dimming constant changes.

**Accept (idempotent):** diff implements B1-B3 with nothing extra; mapping
1:1; parent typecheck exits 0; supervisor semantic comparison (including that
`structureFrame` exempts frame-only meshes) flips ✅.

---

## Task R12-C — APP-EDUCATION (view choreography; paid extension; upsell branch)

**Stage states:** formulated ✅ (e9522ff2) · assigned [/] · undertaken [X] · completed [X] · validated ✅ (2026-11-01 supervisor semantic pass after same-coder correction; scope files published via WIP crash-checkpoints; integration tsc exit 0)

**Scope (closed):** `src/App.tsx`, `src/components/NatallyChatbot.tsx`,
`src/components/ReadingStage.tsx`. Nothing else.

**Current code (verified anchors, 2026-11-01):**
- `src/App.tsx:94-124` presentation/manual view state (`setManualView` :124);
  `:106` `setEducationalRequest`; `:459-470` `handleToggleComponent` (sets
  focus targets, selection, `panel:'selection'`, then `:469`
  `setEducationalRequest({id,target,sourceChart})`);
  `:657` ReadingStage render; `:715-722` Astrolabe3D mount with
  `onActivate={… setManualView('chart')}` when inset;
- `src/components/NatallyChatbot.tsx:43` imports
  `readPaidConversationAccess` from `../services/billingAccess`;
  `:842-877` unpaid authored fallback; `:1038-1075` `educationalRequest`
  pipeline (builds `model:'Authored guide'` message, `chartCues`,
  `onChartFocus`, `presentMessage`); `:105` `educationalRequest` prop type;
- `src/components/ReadingStage.tsx:29-31` inset persistence
  `'natally.inset-position.' + accountUid`;
- Frozen external contracts you consume (do not edit these files):
  `readPaidConversationAccess(uid): Promise<{canInfer: boolean;
  canOpenSouvenir: boolean}>` (`src/services/billingAccess.ts:47`);
  `withInferenceTurn` (`src/services/inferenceTurn.ts:4`);
  `requestHostedInference`/`completeHosted`
  (`src/services/hostedInference.ts:212/:96`);
  `getAuthoredUpsellClose(chart, variant)` (R12-D signature below).

**Implement exactly:**

C1. Inset-object lesson choreography: when an `educationalRequest` is created
from a selection that arrived while the chart was inset, set
`presentation.view` to `'chart'` through the existing presentation path
(respecting existing follow/manual-override semantics). Add prop
`onEducationalSettled?: () => void` to `NatallyChatbot`; fire it exactly once
per educational message when its playback completes, is stopped, or fails.
`App` wires it to revert the view to `'atelier'` UNLESS the user manually
chose a view during the lesson (manual choice cancels auto-revert).
C2. No new sprite machinery: while chart is focused, the room pane with
`AtelierCharacter` is the inset and stays visible and animated (existing
voice-performance mouth events); C1's revert returns it to main. Do not
blank the room inset.
C3. Paid extension: in the `educationalRequest` pipeline, after the authored
lesson message is posted, if `await readPaidConversationAccess(accountUid)`
yields `canInfer: true`, request a personalized interpretation of the lesson's
selected component(s) through the existing chat inference path
(`withInferenceTurn` + the same hosted request/completion flow the chat
pipeline already uses), with context = resolved target name(s), natal chart
facts, and `currentSky` facts; render it as the next assistant message with
the existing streaming speech; existing inference accounting applies
verbatim. `canInfer: false` → nothing beyond the prefab lesson. Rapid
reselection: existing `inFlight`/`consumedEducation` guards cancel the
pending extension (verify and state this in your mapping).
C4. Upsell close: after a prefab lesson (and after its paid extension when
one ran), append `getAuthoredUpsellClose(chart, variant)` as the closing
 authored line of that flow, where `variant === 'souvenir'` exactly when BOTH
 (a) the immediately preceding completed user-visible turn was a paid
 inferenced message (its message model metadata ≠ `'Authored guide'`), and
 (b) `readPaidConversationAccess` currently yields `canInfer: true`;
 otherwise `'default'`. No new offer/purchase UI.
C5. ReadingStage inset key becomes
`` `${import.meta.env.VITE_APP_NAMESPACE ?? 'natally'}.inset-position.${accountUid}` ``
— byte-identical under the canonical default.

**Forbidden:** files outside scope; inference without `canInfer`; changing
billing/accounting semantics; touching renderer click logic (R12-B owns it);
placeholder copy.

**Accept (idempotent):** diff implements C1-C5 with nothing extra; mapping
1:1 including the guard behaviors named; parent typecheck exits 0; supervisor
semantic comparison flips ✅.

---

## Task R12-D — PREFAB-CONTENT (regimes/evolution completion; upsell close)

**Stage states:** formulated ✅ (e9522ff2) · assigned [/] · undertaken [X] · completed [X] · validated ✅ (2026-11-01 supervisor semantic pass after same-coder correction: all 43 entries + general lesson carry non-boilerplate regimes/evolution; getAuthoredUpsellClose frozen; scope files published via WIP crash-checkpoints; integration tsc exit 0)

**Scope (closed):** `src/services/authoredChartExplanations.ts`,
`src/services/authoredEducationSession.ts`. Nothing else.

**Current code (verified anchors, 2026-11-01):**
`authoredChartExplanations.ts:8` `AuthoredExplanation`; `:10` `CONTEXT_LINE`;
`:21` `type LessonCore = { what; trad; why; q; ancient?; modern? }`;
`:23-119` `BODIES` (14 keys: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn,
Uranus, Neptune, Pluto, Chiron, TrueNode, Ascendant, Midheaven); `:123-136`
`HOUSE_CORES` (12); `:138-151` `SIGN_CORES` (12); `:153-159` `ASPECT_CORES`
(5: Conjunction, Opposition, Square, Trine, Sextile); `:161-167`
`GENERAL_LESSON`; `:184-200` `buildLesson`; `:241-292`
`getAuthoredChartExplanation`; `:294-303` `getAuthoredConversationClose`.
`authoredEducationSession.ts:13-18` `INVITATIONS`; `:57-89`
`createAuthoredEducationSession`.

**Implement exactly:**

D1. Extend `LessonCore` with required `regimes: string` and `evolution:
string`. Author REAL content for EVERY entry of all four tables (43 entries):
- `regimes` — how different astrological regimes and traditions regard this
  element (e.g. Hellenistic vs medieval vs modern psychological practice,
  where genuinely applicable; where traditions agree, say so plainly);
- `evolution` — how the element's meaning evolved over the ages (concrete
  historical arc, not filler).
`buildLesson` composes them after the `what` sentence. `GENERAL_LESSON` also
gains both passages. Keep the factual register and `CONTEXT_LINE`; do NOT
introduce Gen Z slang (separate open task PREFAB-GENZ); no placeholder or
repeated boilerplate text — each passage is specific to its element.
D2. Add beside `getAuthoredConversationClose`:
```ts
export function getAuthoredUpsellClose(chart: NatalChartResult, variant: 'default' | 'souvenir'): string
```
Two or three frozen authored lines per variant (light rotation in-file).
Tone: perfect-sales-technique assertiveness with a slight cheesiness of
self-awareness — never self-consciousness. The `default` variant invites a
personal reading with Cr; the `souvenir` variant invites the PDF plus the
persisted interactive "vignette frozen in time" re-experience atelier (keep
souvenir naming aligned with `src/services/souvenir.ts` terms; do not edit
that file). Pure functions — no network, no LLM, no audio.
D3. Compose the close after lessons without verbatim back-to-back repetition,
reusing the existing session rotation mechanics in
`authoredEducationSession.ts` (extend `INVITATIONS`/session state only as
needed for rotation bookkeeping).

**Forbidden:** files outside scope; changing lookup/resolution semantics of
`getAuthoredChartExplanation`; changing `chartTargets.ts`; placeholders;
Gen Z register; touching voice services.

**Accept (idempotent):** diff implements D1-D3; every one of the 43 entries +
`GENERAL_LESSON` carries non-boilerplate `regimes` and `evolution`; mapping
1:1; parent typecheck exits 0; supervisor reads the passages semantically and
flips ✅.

---

## Task R12-E — ENTRY-UNIFY (dispatcher, emission, env keys, identity config)

**Stage states:** formulated ✅ (e9522ff2) · assigned [/] · undertaken [X] · completed [X] · validated ✅ (2026-11-01 supervisor semantic pass; .env accept verified by direct read since the file is gitignored — exactly the six frozen keys appended at defaults, no other line changed; scope files published via WIP crash-checkpoints; integration tsc exit 0)

**Scope (closed):** `src/main.tsx`, `scripts/build-web.mjs`,
`scripts/stage-marketing-overlay.mjs`, `scripts/pwa-build.mjs`, `.env.example`,
plus ADDING ONLY the six new keys to the effective `.env` at their defaults
(touch no existing value or line).

**Current code (verified anchors, 2026-11-01):**
- `src/main.tsx:3-13`: `isNative` (`'__TAURI_INTERNALS__' in window`), `app=1`
  / `offer=reading|conversation` params, `isAppDocument` (`/app.html`), and
  the redirect of every other browser document to `/marketing.html`; `:14-45`
  mounts App in `#root` via dynamic imports.
- `scripts/build-web.mjs:7-15`: `currentDocument` mount/invocation checks;
  `:13` copy `index.html` → `app.html`; `:14` copy `marketing.html` →
  `index.html`.
- `scripts/stage-marketing-overlay.mjs:33-49`: redirect script injected into
  the staged index `<head>` sending `/` and `/index.html` to
  `/marketing.html`; `:7` staged-index hash pin.
- `scripts/pwa-build.mjs:4` `SHELL_FILES`; `:47` `SHELL_ROUTES` map
  (`/`,`/index.html`,`/app.html`,`/marketing.html`).
- Documents: repo `index.html` = app source (mount `#root`); repo
  `marketing.html` = landing source (mount `#marketing-experience-root`,
  `natally-version` badge).

**Implement exactly:**

E1. `.env.example` gains the six-key table (header note: per-build entry and
identity configuration; AGPL anti-impersonation rationale for NAME/NAMESPACE)
with the frozen defaults above. Effective `.env`: append only the six keys at
those defaults.
E2. `src/main.tsx` — new exported function:
```ts
export function resolveEntryExperience(
  pathname: string, search: URLSearchParams, native: boolean,
  authState: 'unresolved' | 'anonymous' | 'authenticated'
): 'app' | 'landing';
```
Rules (closed): `native` → 'app'; pathname equals the app path
(`${VITE_APP_PATH}` default `/app.html`) OR `?app=1` OR
`?offer=reading|conversation` → 'app'; pathname equals landing path or alias
(`/landing`, `/landing.html`) → 'landing'; otherwise 'authenticated' →
'app', 'anonymous'/'unresolved' → 'landing'.
E3. Dispatcher replaces the current redirect: dynamic-import `App.tsx`
(mount `#root`) for 'app'; dynamic-import `marketing.tsx` (its own mount) for
'landing'. On a bare-domain document (`/`, `/index.html`) await Firebase auth
resolution via the existing `src/services/firebase.ts` integration (do not
recreate auth): unresolved → render landing; authenticated → swap to app;
anonymous → landing. Auth listener active only on the bare-domain document.
Tauri `isNative` boots the app immediately (unchanged). Repo document roles
unchanged (index.html app source; marketing.html landing source).
E4. `scripts/build-web.mjs`: emit the unified app document as `index.html`
and byte-identical `app.html`; emit the landing document as `landing.html`;
emit `marketing.html` as a static generated redirect document to the landing
path preserving query and hash per `VITE_LEGACY_PATH_REDIRECTS`
(`/marketing.html:/landing`). Update `currentDocument` checks to the unified
and landing mounts, preserving invocation-id checks.
E5. `scripts/stage-marketing-overlay.mjs`: stop injecting the
`/`→`/marketing.html` head redirect (delete that injection); preserve
asset-copy and hash-verification duties with updated expected hashes.
E6. `scripts/pwa-build.mjs`: `SHELL_ROUTES` gains the landing path and alias
sourced from the env keys; manifest name and cache prefix derive from
`VITE_APP_NAME`/`VITE_APP_NAMESPACE` (canonical defaults keep today's
values). Node scripts resolve the six keys from the build environment with a
`.env` fallback; defaults identical to the frozen table; no other config
consumption changes.

**Forbidden:** files outside scope; changing any existing `.env` value;
routing literals where a key governs; touching `marketing.tsx` /
`Astrolabe3D.tsx` / app components (other tasks own them); new dependencies.

**Accept (idempotent):** diff implements E1-E6; `git diff` on `.env` shows
only six added lines; mapping 1:1; parent typecheck exits 0; supervisor
semantic comparison flips ✅.

---

## Round-level stages (orchestrator-owned)

| Stage | State | Evidence |
| --- | --- | --- |
| R12 architecture | 🟩 COMPLETE | e9522ff2 pushed and remote-verified 2026-11-01. |
| R12 tasklist (this document) | 🟩 COMPLETE | Published before dispatch; holds below. |
| R12 dispatch | 🟩 COMPLETE | 14 agents, 0 errors, 5/5 returned (2026-11-01); operator-authorized after crash reconciliation; partial crashed-session A/B absorbed idempotently. |
| R12 semantic validation | 🟩 COMPLETE | 5/5 supervisor semantic passes; R12-C and R12-D corrected by their own coders then passed re-verification; verdicts archived in SESSIONS/ workflow record. |
| R12 integration typecheck | 🟩 COMPLETE | `npx tsc --noEmit` exit 0 (2026-11-01) after `npm install --no-save` restored declared deps @tauri-apps/api and @revenuecat/purchases-js — environment restore, no new dependencies. |
| R12 source publication | 🟩 COMPLETE | Scope files crash-safed and pushed via WIP checkpoints 5c6ef3d6..3f95e18a; per-task validated markers 6952f4f3..7cba1f11 each pushed and remote-verified. |
| R12 canonical web build | 🟩 COMPLETE | natally-ubuntu repo build_all.sh: v1.36–v1.41 full matrices, web/web-installer/pwa verified each run; unified emission (index=app.html, landing.html, marketing.html redirect) proven live. |
| R12 real observation | 🟩 COMPLETE | 14/14 rubric rows PASS live on natally-ubuntu.surge.sh v1.41.92153 (scenarios 1–4, 6; scenario 5 chain verified layer-by-layer, wallet credential pending). Evidence: DOCS/DEMONSTRATIONS/r12-observation-20261101/. |

## Preauthored observation rubric (held; execute only on operator instruction)

1. Bare domain signed out: hero shows atelier main + draggable inset chart
   card with the example caption exactly as frozen; no sign-in wall before
   the chart; scroll through story sections swaps the pair.
2. Hover a planet, sign, house and aspect while inset: callout renders fully
   outside the inset card, extending into the atelier area; drag/scroll/resize
   re-place or dismiss it (R11 behavior intact).
3. Click the inset card's empty space: swap-zoom only. Click an object:
   swap-zoom completes FIRST, then the prefab lesson appears (meaning,
   regimes, evolution) with Natally's room — herself visible — as the inset;
   non-focused elements dim while the plum-and-metal frame stays vivid;
   completion returns the atelier to main.
4. Landing voice: no audio before an explicit gesture; after gesture the
   lesson + default close speak through the established voice; network trace
   shows zero inference calls.
5. Logged in with credits, app atelier: object click swaps and teaches, then
   the personalized hosted interpretation streams with Supertonic TTS and
   normal cost accounting; after that paid turn the next prefab close is the
   souvenir variant; credit-depleted account shows prefab lesson + default
   close only.
6. `/landing` and `/landing.html` force the landing for a signed-in user;
   bare domain signed-in opens the app; `/marketing.html` redirects to
   `/landing` preserving hash; version badge shows the current build at
   bottom right on every entry path; Tauri/dev boot the app unchanged.

R12 tasklist attestation: these five self-contained tasks and the round-level
stages completely operationalize frozen DOCS/ARCHITECTURE.md R12 with nothing
added to its scope and no omitted required behavior; each task restates every
contract its coder may use. Dispatch was authorized by the operator in the
2026-11-01 crash-recovery session; the observation rubric below remains held
for operator instruction.
