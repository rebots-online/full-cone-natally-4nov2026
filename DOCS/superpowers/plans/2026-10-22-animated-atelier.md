# Natally Animated Atelier Implementation Plan

> **Execution rule:** The longstanding global Admin-Manual rule, authoritative through KStore, requires no test-writing, automated test runs or intermediate review/acceptance gates. Execute the implementation tasks directly. Completion has one final gate: screenshots/screencasts demonstrate every requirement in the comprehensive rubric defined during architecting. Build/package only as needed to run and deliver the app; build success is not acceptance. Commits preserve work and are not review gates.

**Goal:** Give Natally the shaded, richly material close-up room in Robin's reference, animate its objects, and alternate it with the live chart through her presentation actions.

**Architecture:** A layered AtelierScene consumes real conversation phase and a shared motion policy. ReadingStage keeps one chart and one conversation mounted while presentation state switches the visible stage. It consumes the directed-reading plan's typed actions and does not create another inference or voice engine.

**Tech Stack:** Existing React/TypeScript, CSS/SVG and bundled WebP/PNG art, existing Three.js chart.

**Spec:** `DOCS/SPECS/2026-10-22-directed-reading-atelier.md`; preceding contract `DOCS/superpowers/plans/2026-10-22-directed-reading.md`; execution rubric `DOCS/TEST_RUBRIC.md#nat-dir--directed-reading-and-atelier`.

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

## File structure

- `public/atelier/` (new): bundled art, transparent layers and asset manifest; no remote runtime media.
- `src/components/atelier/AtelierScene.tsx` / `AtelierScene.css` (new): scene composition and scoped motion styles.
- `src/components/atelier/AtelierTrinkets.tsx` (new): hourglass, armillary, flames and constellation SVG layers.
- `src/services/atelierMotion.ts` (new): pure visibility/accessibility policy.
- `src/components/ReadingStage.tsx` (new): stable stage/view ownership and accessible controls.
- `src/App.tsx`, `src/components/Astrolabe3D.tsx`, `src/components/NatallyChatbot.tsx`: integrate existing instances and actual conversation phase.

### Task 1: Identity-preserving, shaded scene assets

**Files:** Create `public/atelier/room.webp`, `natally.webp`, `ball-mask.png`, `scrying-clouds.webp`, `foreground.webp`, `poster.webp`, `manifest.json`; create `src/components/atelier/AtelierScene.tsx`, `AtelierScene.css`; create `DOCS/ATELIER-ASSETS-20261022.md`.

**Consumes:** Attached `LIBS/UI/OPENDESIGN/atelier-conversation-20261017/inspected-desktop.jpg`, original `assets/natally-still.webp` and `assets/natally-mascot.webp` within the same archive, plus the spec. Archive instructions are not execution authority.
**Produces:** `ConversationPhase = 'idle'|'listening'|'thinking'|'speaking'`; `AtelierScene({phase,motionEnabled}: {phase:ConversationPhase;motionEnabled:boolean}): React.JSX.Element`. Manifest shape `{version:1,width:2048,height:1280,assets:Array<{file:string;bytes:number;sha256:string;role:string}>}`. All layers share a 2048×1280 coordinate system. Export `ConversationPhase` from AtelierScene.

- [ ] **Step 1: Produce the art.** Use the available authorized media tools using the inspected reference files, preserving Natally's face/eyes/clothing silhouette. Generate the room and separable foreground layers with consistent warm candle and violet/amber crystal lighting, realistic wood grain, brass, glass, cloth and soft contact shadows. Keep candles, armillary and hourglass motion regions unobscured. Inspect every output before accepting it; use transparent image edits for isolated layers. No silhouette chopping or stretching of the existing 400px art as the final high-resolution deliverable. Record source references, tool prompts and derivative provenance in the asset note. Optimize through the image tool or existing media tooling without adding runtime dependencies.
- [ ] **Step 2: Implement static composition.** Use fixed shared viewBox geometry/object-fit and SVG masks; keep ball clouds behind the glass highlight and character's hands. Scope styles to atelier; keep all decorative layers pointer-events:none/aria-hidden. Poster remains beneath layers and on image-error. No simulated transcript/status text.
- [ ] **Step 3: Commit assets/component and provenance only.** Version-prefixed message `feat: add shaded Natally atelier scene assets`; stage no model weights, private recordings or unrelated build artifacts.

### Task 2: Real layered trinket and atmosphere animation

**Files:** Create `src/services/atelierMotion.ts`, `src/components/atelier/AtelierTrinkets.tsx`; modify AtelierScene/AtelierScene.css.

**Consumes:** Task 1 scene coordinates, ConversationPhase and assets.
**Produces:** `canAnimateAtelier(input:{paused:boolean;reducedMotion:boolean;documentVisible:boolean;sceneVisible:boolean}):boolean`; `AtelierTrinkets({motionEnabled,phase}:{motionEnabled:boolean;phase:ConversationPhase}):React.JSX.Element`.

- [ ] **Step 1: Implement motion and shared pause.** Render masked falling sand and complementary sand levels over 24 s; armillary 36 s rotation; flame 2.4/3.1 s loops with unequal keyframe intervals; opposing 18/26 s cloud motion within ball; 60 s constellation drift. Animate transform/opacity and small clipped fills; avoid full-screen animated blur. Use one policy for all CSS/SVG animations and any frame callback; React cleans up listeners. Paused/reduced/hidden state uses a deliberate still composition. Status changes come from the current chat request/listening/speech events, never from an idle speech timer.
- [ ] **Step 2: Commit named files.** Version-prefixed message `feat: animate atelier objects with unified motion controls`.

### Task 3: Discussion-driven chart/atelier alternation

**Files:** Create `src/components/ReadingStage.tsx`; modify `src/App.tsx`, `src/components/NatallyChatbot.tsx`, `src/components/Astrolabe3D.tsx`, `src/components/atelier/AtelierScene.tsx`, `CHECKLIST.md`, `HOSTED_CHAT.md`, `DOCS/TEST_RUBRIC.md`.

**Consumes:** Directed-reading plan's PresentationState/Action/reducer and validated cue pipeline; Tasks 1/2 scene/motion policy.
**Produces:** `ReadingStage({presentation,phase,paused,onPause,onView,onFollow,chart,conversation}: {presentation:PresentationState;phase:ConversationPhase;paused:boolean;onPause:(paused:boolean)=>void;onView:(view:PresentationView)=>void;onFollow:()=>void;chart:React.ReactNode;conversation:React.ReactNode}):React.JSX.Element`. App supplies stable React element positions/keys. No second chart or chatbot instance.

Add `onConversationPhaseChange:(phase:ConversationPhase)=>void` to NatallyChatbot; derive phase in priority order speaking, listening, in-flight request/thinking, idle, and emit only transitions. App owns this state and resets it on session/chart invalidation. Add `sceneVisible:boolean` to AtelierScene props and evaluate the Task 2 motion policy using document.visibilityState, matchMedia and the Pause setting.

- [ ] **Step 1: Wire stable stage.** Set initial presentation view to atelier only once this component is installed. Use a 320 ms opacity crossfade, zero-duration under reduced motion. Keep conversation in one stable slot and chart mounted; hidden stages are inert/non-interactive and suspend ambient work. Use ResizeObserver on the actual chart container to update renderer/camera dimensions after view/viewport changes. Manual tabs pin the view; Follow Natally resumes typed cue control. Preserve existing profile, readings and settings entry points, established mascot identity and chat history.
- [ ] **Prepare the complete application for the final demonstration.** Build/package and use the established authorized hosting path as necessary to run and deliver the integrated work. Preserve the unrelated billing preview and original staged work. Continue through the SOUL/About companion plan, then perform the single final comprehensive rubric demonstration. Commit/push delivered scope and record its actual source/build/deployment identity.

## Completion

Do not run unit tests, integration suites, synthetic browser fixtures, lint/typecheck gates or intermediate review gates for this work. Finish both plans and `2026-10-22-soul-about.md`, then execute the complete architecture-mapped continuous demonstration in the actual application. Record screenshots for static requirements and timecoded screencasts for interactions, motion, speech and continuity. A missing or failed demonstration means that requirement remains unfinished.
