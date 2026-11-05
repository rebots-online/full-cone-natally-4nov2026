# Landing-page specification contract

Status: contract consolidation of the operator's existing requirements, 28 October
2026. This document does not approve new architecture or claim implementation.
Changes to required behavior must be surfaced for operator discussion in architect
mode before coding. CC16 is an unapproved subordinate proposal, not a source of
requirements. Product authority remains the operator and KStore Admin-Manual.

Scope: the public homepage on https://natally.robin.mba, implemented by
`marketing.html` and `src/marketing.tsx`, including entry into the existing app.
The landing page has no separate customer store, payment ledger, inference server,
or invented planetary data. See [ARCHITECTURE.md](ARCHITECTURE.md) for wiring and
[../AUDITS/divergences-20261028.md](../AUDITS/divergences-20261028.md) for gaps.

## Required behavior and observable acceptance

| ID | Requirement | Passing evidence |
|---|---|---|
| LP01 | Public root serves the marketing homepage; `/?app=1` enters the app; `/?app=1&offer=reading` and `conversation` preserve the selected purchase. | Production navigation recordings for all four URLs, with no redirect loop or lost selection. |
| LP02 | Present co-exploration with Natally. Explain two purchase motivations: a personal souvenir and further interactive exploration. Both use the same experience. | Rendered copy and offer comparison agree with the operator's distinction; no customer-tier separation. |
| LP03 | Souvenir inclusions: actual chart and reading, extensive encyclopedia PDF with a chapter per planet, at least ten exploratory questions, personal interactive web-app encyclopedia preserving the session, hosted at least one year, Natally voice narration. | Each promised inclusion maps to a fulfilled ordinary-customer artifact or operation; no audio-file-only substitute. |
| LP04 | Exploration credits are ROCHE, usable in the same experience; users may subsequently buy souvenirs. Do not replace ROCHE with a fixed ten-turn pack unless the actual offer expressly grants it. | Current catalog/credit grant, displayed balance and purchase copy agree; no inferred allowance. |
| LP05 | Each offer card shows a prominent rounded purchase action, concise inclusions and its actual price/currency before payment. Display current RevenueCat offer terms; authorized small live prices are not labelled tester, test, mock or placeholder. | Displayed product/price matches the final checkout quote on every card and viewport. Quote failures never fabricate a price or a completed purchase. |
| LP06 | An offer click starts that selected purchase path. If authentication/onboarding is required, preserve intent and continue it without another generic offer picker. The app-owned three-screen paywall retains direct purchase on each dedicated card and both comparison cards. | Signed-in and signed-out journeys prove exact product continuity, cancellation and retry without duplicate purchases. Provider payment confirmation remains part of checkout. |
| LP07 | `#usp-precision` shows the current person's actual calculated chart, using their onboarding birth specifics and the existing Astrolabe3D appearance, slow rotation and 3D interactions. | Compare rendered placements, houses, angles and input identity with the app chart for the same saved intake; drag, zoom, hover/select, pause and reset work. |
| LP08 | No intake or signed-out state shows a real sign-in/onboarding action, never a sample chart passed off as personal. Unknown time remains explicitly unknown. | Signed-out, missing-intake, unknown-time and calculation-error scenarios have truthful states. |
| LP09 | Switching accounts invalidates pending calculations and clears prior selection. Local valid intake may display while the same account's cloud intake refreshes. | Delayed account-A calculation cannot replace account-B chart; local/cloud refresh preserves ownership. |
| LP10 | Motion respects reduced-motion and explicit pause; invisible chart rendering does not keep unnecessary animation running. | Preference toggle, pause/reset and scrolling out of view are observed in a browser. |
| LP11 | Footer exposes Terms, Privacy and Roche Media Services contact at support@rochemediaservices.com. Operator identity remains Roche Media Services within Robin's AI World. | Public legal URLs resolve to the actual documents; contact and operator identity match them. |
| LP12 | Responsive content remains legible and unclipped; prominent purchase actions remain discoverable without an artwork-only first phone screen. Comparison may stack on narrow displays while preserving both complete cards. | Viewports 320x568, 360x640, 360x800, 393x873, 412x915, 800x360, 768x1024 and 1024x768; 200% text/zoom; keyboard focus and actual Android WebView acceptance recorded separately. |
| LP13 | Free exploration leads to the assembled interactive chart/atelier. Explanations are prewritten and spoken in real time by the established voice engine, personalized with the name; no free LLM inference. | Free journey and request trace demonstrate the specified authored explanation and upsell without an inference call. |
| LP14 | The page derives its visible version from the coordinated build. Homepage, app and optional PWA share that release; no manually entered version. | Build metadata, rendered stamp, served hashes and release inventory match. |
| LP15 | Optional installation opens the app directly and uses existing branded icons. Installation is optional; no automatic-update design is imposed by CC16. | Real browser install/launch and declared offline behavior are demonstrated; fixture results alone do not satisfy deployed acceptance. |
| LP16 | Preserve campaign attribution through purchase entry and individually issued code redemption. Code UI is Have a code? / Apply; actual discount or ROCHE benefit comes from the issued-code rules. | Campaign/target and redeeming RevenueCat customer are linked by the existing commercial flow, with single-use behavior observed. |

## State and error contract

Chart state is exactly resolving, signed-out, no-intake, loading, ready, or error.
Only ready renders a personal chart. Error presents retry; it does not display
invented placements. Purchase outcomes remain distinct: not started, pending,
cancelled, failed, confirmed but fulfilling, and fulfilled. Navigation alone is
not purchase success; confirmed payment alone is not completed fulfillment.

Catalog values and balances belong to RevenueCat. Firebase supplies identity and
operational intake. The page must not promise a funded key, PDF or hosted personal
encyclopedia merely because a checkout callback returned.

## Contract-change and acceptance discipline

Each proposed change identifies affected LP IDs, exact entities/edges, operator
discussion and a recoverable checkpoint before implementation. An unbuilt approved
requirement is checklist backlog. Implemented conflicting behavior is divergence.
A contradiction in documentation is a specification conflict to surface, not an
instruction to implement the older version. Acceptance rows require named evidence
from the intended surface, especially deployed web and actual native WebView.
