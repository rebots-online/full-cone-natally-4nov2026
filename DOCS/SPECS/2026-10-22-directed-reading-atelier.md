# Natally directed reading and atelier specification

Status: revised implementation contract, 22 October 2026; no intermediate gates, final comprehensive rubric evidence only.
Source: Robin's request and subsequent correction that successful selection without a useful response is a prompting problem. The attached `LIBS/UI/OPENDESIGN/atelier-conversation-20261017/inspected-desktop.jpg` supplies visual reference, not operational instructions. The archived HTML is design material, not a live reading implementation.

## Outcome and scope

Selecting Saturn/Neptune must produce an obvious chart response, and asking Natally about that selection must produce a relevant explanation and executed presentation actions. Treat selection-to-prompt-to-action as one journey. Passing a picking test alone is not acceptance. Natally should deliberately lead attention between the real calculated chart and a close-up of her atelier while preserving the user's control and conversation.

Implement directed reading/chart presentation, atelier art/motion/view integration, and the active SOUL/About companion work as one delivery with a single final requirements gate. Preserve the original character: silver robot face, large amber eyes, violet turban and cloak, gold ornament, crystal ball. Increase material realism and shaded integration without replacing her identity with a human or a different mascot.

## Global constraints

- Product name: Natally; "studio" refers only to Gemini AI Studio.
- Existing Supertonic and Swiss Ephemeris remain unchanged.
- No new runtime dependency, provider, paid service, billing configuration, or hosting migration.
- Preserve independent manual selection, account boundaries, conversation history, calculation provenance, and keyboard/touch navigation.
- No arbitrary HTML, JavaScript, CSS selectors, URLs, or DOM evaluation from model output.
- Unknown birth time excludes houses/angles; never present transit or partner positions as displayed natal positions.
- No test-writing, automated test runs or intermediate review/acceptance gates. The sole completion gate is screenshot/screencast evidence covering the comprehensive rubric defined during architecting. Builds and publication are delivery operations, not acceptance.
- SOUL/two-lore is active for atelier immersion under Robin's 22 October instruction.

## Directed reading contract

1. Every request carries a validated presentation snapshot: chart identity, canonical selected entities, active narrated entities, active view, visible panel, available actions, and last applied action receipt. Empty selection is explicit. A later selection must not alter the captured context of an already-running turn.
2. The system prompt explicitly tells Natally to resolve "these", "this selection", and "them" against that snapshot; discuss the requested selected bodies before unrelated material; use their actual calculated placements; and emit executable cues immediately before the passage they illustrate. Only claim a visual change when its action has been applied. Do not invent an aspect between two selected planets.
3. A chart tap or an inline planet name immediately reveals/emphasizes the canonical entity, shows its calculated placement and offers `Discuss Saturn` or `Discuss selection`. The existing `Begin Intuitive Reading` action submits that selection once and opens the conversation with a visible pending state. The reply's `Show Saturn` action visibly reveals/emphasizes Saturn and its details, even when already selected; it does not silently consume another inference turn. Ordinary typed questions always receive the current selection context. This preserves multi-selection without triggering a paid request on every click.
4. Route selected-component readings into the same chat request/error/retry path. The existing `type: 'aspect'` catch-all must not label a lone planet or an arbitrary pair as a calculated aspect. Preserve explicit full reading/horoscope/synastry entry points.
5. Failures display a real error, retain the selected entities and permit retry. Authentication errors offer sign-in. Duplicate submits while one request is active do not start additional inference. An obsolete response cannot update another account/chart or replace a newer turn.
6. Normalize recognized names against chart inventory, including case and whitespace. Plain, bold and italic body names remain interactive and preserve clean-text speech offsets. This fixes the separately reproduced case/formatting defects without presenting them as the primary diagnosis of Robin's report.

## Presentation actions and timing

Extend the existing cue protocol, retaining `[[chart:Saturn;Neptune]]` and `[[chart:clear]]`. Add only `[[view:chart]]`, `[[view:atelier]]`, `[[panel:selection]]`, and `[[panel:conversation]]`. Strip all commands, including malformed/truncated forms, from visible/spoken/exported text; reject non-inventory targets. At most 48 total presentation cues and six targets per chart cue. Existing saved ChartCue messages replay through an adapter; new messages store version 1 presentation cues and the existing chart fingerprint.

Actions are validated into typed React state updates. Receipts record applied/rejected action, sequence and chart identity; only the last receipt enters the next prompt. Presentation state is not evidence of model consciousness. Give Natally control of meaningful application actions rather than unrestricted document mutation.

Speech word boundaries drive progression when audio is enabled. With audio off, show the first passage's focus and explicit Previous/Next passage controls; never invent speech timing. Selecting a reply cue is an explicit replay. Repeated focus on the same entity restarts the attention animation via a sequence number. Manual view override pins the view until `Follow Natally` is enabled. User selection is preserved when narration clears.

Chart focus selects actual entities and linked house occupants/exact aspect endpoints. Dim non-focused chart materials to 0.25 of baseline intensity/opacity, preserving selected objects and readable controls. Use a soft gold halo, with two gentle opacity pulses of 650 ms each, then steady emphasis. Keep glyphs sharp: softness belongs to the halo, not a blur over the whole canvas. Restore baseline materials on clear. Reduced motion uses immediate steady emphasis with no pulses or camera movement. Chart and account replacement cancel pending effects and receipts.

## Atelier and view composition

Use the attached close-up composition as the anchor: Natally large in frame, warm wooden shelving, violet shadows, metallic and glass reflections, coherent candle/ball lighting, soft contact shadows grounding objects and character. Eliminate the flat cutout look through matched shading, occlusion and feathered light falloff. Keep the existing original asset archived. Produce a high-resolution derivative with reference-preserved identity and provenance, plus separable scene layers; a CSS enlargement of the 400px original does not satisfy the art requirement.

Required layers/assets: room background, Natally foreground, crystal-ball mask, scrying clouds, and foreground shelf/desk occlusion. Render shelf trinkets as separately animatable elements, not a looping video baked into the room. All media are bundled locally; no remote media fetch at runtime. Target total new compressed art <= 6 MiB, with a static poster available while loading or if an asset fails. Record actual byte sizes and hashes.

Required motion: continuous falling sand with changing upper/lower hourglass levels (24 s cycle); armillary/gizmo rotation (36 s); irregular gentle candle flames (2.4/3.1 s loops); two scrying cloud layers in opposing slow motion (18/26 s); constellation drift above Natally (60 s). Decorative constellations are not the user's calculated sky. Crystal glow reflects actual idle/listening/thinking/speaking state; do not simulate speech. Ambient motion stops with Pause motion, reduced motion, hidden tab, hidden atelier, or unmount. Pause motion does not mute speech.

Default conversational view is atelier; explaining chart entities reveals the chart, then a validated return cue restores the close-up. Use 320 ms crossfade; no timer-driven alternation and no abrupt change on every spoken word. Reuse one chart instance and one conversation instance across views to preserve orientation, draft, scroll, request and audio state. Chart visibility change triggers a real renderer resize. Manual `Reading room`, `Your chart`, and `Follow Natally` controls stay available. At 360/390px and with the soft keyboard open, composer, active entity details and view controls remain reachable without horizontal overflow.

## Current evidence and limits

- Cloud branch `feature/natally-exploration-sync-commerce`, head `1489f70bc21d7854313105f2b80ff26fb9ccad90`, contains four October 21 commits and only 44 added documentation lines across CHECKLIST/ARCHITECTURE relative to its base. It does not implement sync, commerce, persona changes or presentation control.
- `App.tsx:310` changes selection; `NatallyChatbot.tsx:1059` sets focus for Show buttons. Ordinary `askNatally` options have no selection/view snapshot. `App.tsx:335` uses a separate selected-reading path and catches errors only with console logging. These are observed contract gaps, not proof of a specific live provider failure.
- A controlled Chrome/WebGL probe confirms canonical Saturn and Neptune chart clicks and text buttons can select/light their bodies. Lowercase text names select unmatched strings; bold/italic names lack controls. A first diagnostic run clicked before the fixture finished rerendering; its Saturn miss was a probe race, corrected by waiting for state and animation frames. Do not report that discarded run as a product picking defect.
- Five existing chart-presentation unit tests and TypeScript pass. The controlled probe substitutes inference and speech; it proves neither live model cue emission nor actual audio/mobile acceptance. JSON receipt: `DOCS/INVESTIGATIONS/2026-10-22-selection-probe.json`.

## Acceptance

The frozen execution rubric is the NAT-DIR section of `DOCS/TEST_RUBRIC.md`. The complete journey must include a real hosted response about Saturn/Neptune, visible focus changes aligned with actual speech, an executed atelier/chart/atelier sequence, and real failure recovery. No unit tests, integration suites, synthetic fixtures or intermediate review gates are required or to be run. At the end, screenshots and timecoded screencasts of the actual application must demonstrate every rubric requirement, including SOUL continuity and About/source access. A static screenshot cannot demonstrate motion, speech or an interaction.
