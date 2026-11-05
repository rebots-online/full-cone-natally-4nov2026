# Natally SOUL and About implementation

Execution authorized. Read DOCS/ARCHITECTURE.md DR-07/08 and the continuous
DOCS/DEMONSTRATIONS/2026-10-22-natally-complete-journey.md script. KStore's latest
Admin-Manual is authoritative. No tests, synthetic fixtures, intermediate review,
lint/typecheck gates. Build only to run/deliver; completion is the final journey.

## SOUL and lore contracts

Create SOUL.md as the shared character definition and src/services/soul.ts as
the account-scoped persistence/prompt adapter. Import shared Markdown as raw text
using existing Vite support (or a generated checked-in text representation with
explicit provenance if the server import path cannot support raw). Preserve the
previous NATALLY_SYSTEM_PROMPT in historical source/documentation.

Character: young robo-psychic graduate, quit a hotline after one hour, warm,
lightly world-weary, occasional fitting Gen-Z language and harmless overshare.
No dependency/guilt or fabricated user facts. Character fiction cannot override
calculated placements. Never claim timbre changed from prose instructions.

Define separate versioned account keys for character lore and user-disclosed
facts/shared history using existing accountStorage. Seed fictional variation
once per real account; subsequent updates preserve it. No new database/provider.
Explicitly distinguish lore type/source in model context. User facts can only be
persisted from actual user-authored disclosures or a clearly visible confirmed
memory flow; do not silently promote model guesses. Keep bounded history,
structured schema validation and storage failure notices. A null account gets no
shared durable store. Returning to an account reloads its own state, not another
account's in-memory object. Discard stale updates using current session identity.

Expose typed load/prompt/update functions with documented signatures for the
chat integration owner. Integrate into the real request path and persist genuine
character developments without rerolling. Keep narrative metadata out of displayed
and spoken response and exports. Use the existing history boundary; avoid another
hidden inference or independent request. Agent must coordinate exact integration
API with directed-reading owner before editing any shared file.

## Standard Profile/About

Inspect existing repository licence, notices, source/build metadata and KStore
standard About requirements. Do not guess xGPL variant or copyright ownership.
Create a keyboard-accessible About splash reachable from Profile. Display Natally,
actual version/revision where available, existing copyright/licence notices,
Swiss Ephemeris obligations, public GitHub source and appropriate corresponding
source revision. Reuse current Profile/account entry instead of adding a menubar.
Returning from About restores focus; narrow-screen access remains usable.

Own SOUL.md, src/services/soul.ts, About component and notice assets/documentation.
The directed-reading coding owner integrates these into App/chat and is the sole
editor of those shared files. Send exact interfaces and integration snippets early.
Commit only owned files; do not stage others' work or push concurrently. Parent
coordinates publication. Do not mark requirements completed from implementation
alone; the final recorded trajectory includes scenes 1,2,6,7,10,11,12.
