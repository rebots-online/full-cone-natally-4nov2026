# Natally Directed Reading Implementation Plan

> **Execution rule:** The longstanding global Admin-Manual rule, authoritative through KStore, requires no test-writing, automated test runs or intermediate review/acceptance gates. Execute the implementation tasks directly. Completion has one final gate: screenshots/screencasts demonstrate every requirement in the comprehensive rubric defined during architecting. Build/package only as needed to run and deliver the app; build success is not acceptance. Commits preserve work and are not review gates.

**Goal:** Make selected chart entities explicit in Natally's prompt and turn her presentation instructions into visible, reliable application behaviour.

**Architecture:** App owns a typed presentation reducer and passes a snapshot into the existing chat path. Validated cues drive React state and Three.js focus; user selection, narration focus and view override remain distinct. Selected readings share chat request/error handling.

**Tech Stack:** Existing React 19, TypeScript, Three.js and Vite; no added runtime package.

**Spec:** `DOCS/SPECS/2026-10-22-directed-reading-atelier.md` (directed-reading increment); execution rubric `DOCS/TEST_RUBRIC.md#nat-dir--directed-reading-and-atelier`.

## Global Constraints

- Product name: Natally; "studio" refers only to Gemini AI Studio.
- Existing Supertonic and Swiss Ephemeris remain unchanged.
- No new runtime dependency, provider, paid service, billing configuration, or hosting migration.
- Preserve independent manual selection, account boundaries, conversation history, calculation provenance, and keyboard/touch navigation.
- No arbitrary HTML, JavaScript, CSS selectors, URLs, or DOM evaluation from model output.
- Unknown birth time excludes houses/angles; never present transit or partner positions as displayed natal positions.
- One final completion gate: actual requirements demonstrated by comprehensive rubric screenshots/screencasts; build and Git publication are delivery operations.
- SOUL/two-lore is active under Robin's 22 October instruction; integrate the companion plan for SOUL and About/source access.

## Architecture-to-checklist demonstration

Use the single continuous script in DOCS/DEMONSTRATIONS/2026-10-22-natally-complete-journey.md. Its scenes map every DR architecture requirement to CHECKLIST.md tasks. Do not replace it with sampled behaviours or independent mini-gates.

---

## File structure and shared interfaces

- `src/services/chartTargets.ts` (new): inventory, canonical lookup and chart fingerprint, extracted from natallyChat without changing calculation facts.
- `src/services/presentation.ts` (new): action validation, reducer, snapshots, receipts and cue types. No DOM access.
- `src/services/natallyChat.ts`: prompt, clean-text cue parsing, persistence validation and hosted request context.
- `src/components/NatallyChatbot.tsx`: request lifecycle, cue progression, passage controls and selected-reading submission.
- `src/App.tsx`: single presentation owner and wiring; remove independent silent selected-reading request.
- `src/components/ChartSelectionDetails.tsx` (new): calculated placement and explicit Discuss action.
- `src/components/RichText.tsx`: canonical interactive names across inline formatting.
- `src/services/chartFocusVisuals.ts` (new): pure focus style/time calculation; Astrolabe3D applies results without rebuilding geometry per animation frame.

All new APIs below are contracts, not existing exports. Import `NatalChartResult` from `ephemeris.ts`.

### Task 1: Canonical target and presentation contracts

**Files:** Create `src/services/chartTargets.ts`, `src/services/presentation.ts`; modify `src/services/natallyChat.ts:149`, `src/components/RichText.tsx:25`.

**Interfaces:** `chartTargets(chart: NatalChartResult): string[]`, `chartFocusKey(chart: NatalChartResult): string`, `resolveChartTarget(raw: string, chart: NatalChartResult): string | null`.

Export `PresentationView = 'chart' | 'atelier'`, `PresentationPanel = 'selection' | 'conversation'`; `PresentationAction = {type:'focus';targets:string[]} | {type:'clear'} | {type:'view';view:PresentationView} | {type:'panel';panel:PresentationPanel}`; `PresentationCue = {offset:number;action:PresentationAction}`; `PresentationReceipt = {sequence:number;chartKey:string;action:PresentationAction;status:'applied'|'rejected'}`; `PresentationState = {chartKey:string;selectedTargets:string[];focusTargets:string[];view:PresentationView;panel:PresentationPanel;follow:boolean;sequence:number;lastReceipt:PresentationReceipt|null}`.

Export `initialPresentation(chartKey: string): PresentationState` (empty targets, chart view until atelier installed, conversation panel, follow true, sequence 0), `validatePresentationAction(value: unknown, chart: NatalChartResult): PresentationAction | null`, `reducePresentation(state: PresentationState, action: PresentationAction, chart: NatalChartResult): PresentationState`. Callers validate first; mismatched chart identity rejects. View actions while follow=false record rejection and preserve view. Every accepted focus increments sequence, including identical targets. Reducer never erases selectedTargets on narration clear.

- [ ] **Step 1: Implement the named contracts.** Extract existing inventory/fingerprint, normalize lookup by trimmed collapsed whitespace and case only. Add `resolveTarget?: (raw:string)=>string|null` to RichText; use it in both formatted/unformatted branches, preserving displayed spelling and speech offsets. Non-target text remains plain.
- [ ] **Step 2: Commit only named files.** Stage only the named implementation files; `git commit -m "feat: define validated reading presentation state"` (prefix with the current repository version per publication convention).

### Task 2: Selection-aware prompt, executable cues and one request path

**Files:** Modify `src/services/natallyChat.ts`, `src/services/readings.ts`, `src/components/NatallyChatbot.tsx`, `src/App.tsx`, `src/components/SelectedComponentsBar.tsx`; create `src/components/ChartSelectionDetails.tsx`.

**Consumes:** Task 1 contracts.
**Produces:** `buildPresentationContext(state: PresentationState, chart: NatalChartResult): string`; add `presentation?: PresentationState` to askNatally options and `presentation?: PresentationState` to ReadingRequest. Extend ChatMessage/NatallyChatResult/ReadingResponse with optional `presentationVersion:1` and `presentationCues:PresentationCue[]`. Add `validatePresentationCues(value:unknown,text:string,key:unknown,chart:NatalChartResult):PresentationCue[]` and `presentationActionsAt(cues:PresentationCue[],from:number,to:number):PresentationAction[]` (ordered cues with from < offset <= to; initial from=-1).

Chatbot gains `presentation:PresentationState`, `onPresentationAction:(action:PresentationAction,sourceChart:NatalChartResult)=>void`, and `selectionRequest?:{id:string;targets:string[]}` plus `onSelectionRequestConsumed:(id:string)=>void`. Existing chart-cue callback adapts to focus/clear until all callers migrate. `ChartSelectionDetails({chart,targets,onDiscuss}: {chart:NatalChartResult;targets:string[];onDiscuss:(targets:string[])=>void}): React.JSX.Element|null`.

- [ ] **Step 1: Implement context and prompt.** Preserve historical persona prompt in a source comment. Add the spec's explicit selected-subject instruction and exact supported cue grammar to both ordinary and generated-reading requests. Serialize validated snapshot as data, not freeform instructions. Capture selection once per request. Extend parser in a single text pass so offsets remain correct when multiple cue types share an offset; invalid/truncated commands are stripped and rejected. New cues are stored; legacy chart cues map to focus/clear. No extra paid retry solely to obtain missing presentation cues: selected intent applies an immediate local focus while the response is pending, with its receipt truthfully marked as local state.
- [ ] **Step 2: Implement request and action wiring.** App's Begin/Discuss handlers issue selectionRequest with unique id, open chat and immediately reveal selected details. Chatbot consumes each id once through handleSendMessage, using the fixed prompt `Explain the selected chart components using their calculated placements, and show each as you discuss it.` Single in-flight guard covers every entry, including retry/external requests. Keep current error handling and selection visible. Action callbacks verify current session/chart/generation. Speech uses crossed cue offsets; muted replay uses passage controls. Manual view choice disables follow; explicit Follow restores it. A Show button applies focus/panel/view locally and increments sequence without inference.
- [ ] **Step 3: Commit named files.** Stage only this task's files; version-prefixed message `feat: connect selected subjects to Natally prompt and presentation`.

### Task 3: Active chart emphasis and release evidence

**Files:** Create `src/services/chartFocusVisuals.ts`; modify `src/components/Astrolabe3D.tsx:37`, `src/components/Astrolabe3D.tsx:452`, `src/components/Astrolabe3D.tsx:504`, `DOCS/TEST_RUBRIC.md`, `HOSTED_CHAT.md`, `CHECKLIST.md`.

**Consumes:** PresentationState focusTargets/selectedTargets/sequence, actual chart inventory, existing scene renderer.
**Produces:** `focusVisualAt(active:boolean,hasFocus:boolean,elapsedMs:number,reducedMotion:boolean):{intensity:number;haloOpacity:number}`. Inactive while focused→0.25 intensity; active/unfocused→1. Use a continuous pulse from and back to the steady halo, at most twice. Opacity/duration are provisional design parameters, not empirically sourced standards; keep them centralized and explain their visible effect. Reduced motion uses the same steady endpoint. Astrolabe gains `focusSequence?:number`, `reducedMotion?:boolean`, `visible?:boolean` (defaults preserve current behaviour).

- [ ] **Step 1: Implement focus visuals.** Cache baseline material values and halo resources; animate material/scale only. Keep text/control contrast and target glyphs sharp. Derive reduced motion from matchMedia and cancel active pulses on preference changes. Respect visible=false, restore/resume and resize without replacing chart state.
- [ ] **Checkpoint the implementation.** Commit and push only completed scope with the current version prefix, preserving unrelated work. Continue into atelier and SOUL/About integration; the sole acceptance gate is the final comprehensive rubric after all work is implemented.


## Completion

Do not run unit tests, integration suites, synthetic browser fixtures, lint/typecheck gates or intermediate review gates for this work. Finish both plans and `2026-10-22-soul-about.md`, then execute the complete architecture-mapped continuous demonstration in the actual application. Record screenshots for static requirements and timecoded screencasts for interactions, motion, speech and continuity. A missing or failed demonstration means that requirement remains unfinished.

## Atelier refinement from live operator feedback

Extend DR05/06/09 in place, following the continuous journey script.

- `AtelierCharacter.tsx` consumes spoken text and duration in `NatallyVoicePerformance`, selecting closed/small/wide/round/spread mouth poses from letter groups; actual audio owns start/stop. `voiceService.ts` supplies live/waiting word windows. `RetainedReadingAudio.tsx` supplies approximate word windows from saved text and real segment playback. This is orthographic cartoon acting, not phoneme alignment.
- `AtelierTrinkets.tsx` and object CSS provide lifted perspective while held, shelf snapping on drop, crowding displacement/topple, and brief material sounds. `atelierMemories.ts` persists placement and damage.
- Chart inset receives an opaque chart backdrop so translucent focus geometry cannot dissolve into the room. Preserve the existing mounted chart and its state across exchanges.
- Remove standalone atelier reset. Add explicit whole-Natally-history erase scope/confirmation, cancel stale writers, erase retained conversation/lore/audio, then reset room memory. Chat-only clear leaves damage intact. Do not erase the operator's real account during demonstration.

Delivery remains GLM coding-plan inference and local voice; build only for deployment. Observe the integrated journey before marking requirement rows complete.

## Restore complete relationship highlighting and distinguish the dated sky

Extend DR03/09 using one calculated `currentSky` snapshot in the existing natal result. `transits.ts` owns snapshot positions, timestamped target IDs and computed transit-to-natal relationships; App attaches/refreshes it and shows provenance. `ephemeris.ts` retains all calculated natal major aspects including conjunction. `chartTargets.ts` inventories/resolves these identities and human-readable aliases; prior natal cues remain valid when their natal coordinates match, while old dated-current cues clear instead of moving to another observation.

`Astrolabe3D.tsx` expands relationship focus to both endpoints plus a thick connection, adds an explicitly labelled cyan outer Now ring and dashed transit links, and curves near-overlap conjunctions. Prompt instructions request full relationship cues across main/inset views. Chart selection details, reference links and inset labels preserve natal/current identity. Continue the comprehensive demonstration script through actual available aspect relationships and a real newly requested reading; no fabricated charts or intermediate test gates.
