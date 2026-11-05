# ARCHITECTURE SNAPSHOT: Natally Conversational Intelligence & Astrological Reasoning Engine

## Profile and billing design amendment — Robin, 19 October 2026

### Payment-funded Venice inference

Robin specifies Venice AI for scalable hosted LLM inference in place of reliance
on the current GLM serving arrangement. Audio remains this repository's existing
Supertonic implementation. Verify the changed design, funding and request paths;
do not expand this task into unrelated audio/device acceptance work.

Add a server-owned funding worker behind WooCommerce/custom plugin: verified
settled payment → durable customer credit entry → bounded provider allocation →
confirmed available Venice capacity → inference cost reservation → actual usage
reconciliation. Customer balances and the operator's Venice balance are distinct
ledgers. Every funding attempt is bound to a settled order and idempotency key;
persist pending/confirmed/failed/uncertain states and provider payment/transaction
IDs. Reconcile uncertain outcomes before retrying to avoid paying Venice twice.
Refunds and chargebacks must account for already consumed inference.

Venice's current documented programmatic funding route is `/api/v1/x402/top-up`,
which discovers accepted USDC settlement options on Base/Solana and returns a
provider credit receipt. This is separate from `/api/v1/api_keys`, which creates
restricted keys without adding funds. The x402-funded wallet path uses wallet
authentication for inference; do not assume it credits an unrelated bearer-key
account. A Lightning/card customer payment therefore needs an explicitly chosen
treasury/conversion bridge to the supported provider rail, or a verified funded
operator account with replenishment controls. No conversion service, wallet,
fee, custody arrangement or live transfer is selected or performed by this note.

Bound provider allocations by settled net receipts, fees and an explicit reserve
policy. Use atomic per-customer/per-order reservations, a shared global exposure
ceiling, concurrency/rate-limit queue and bounded retries. Check actual provider
balance/rate limits before dispatch. Never create a new provider allowance when
retrying or switching models. Keep management keys and treasury signing outside
browser/model context; never route wallet-send tools through the conversation.
Integrate with the actual hosted request path, not only the Express development
registry. Model/tool/streaming compatibility and capacity still need measured
verification; choosing Venice alone does not establish throughput.

Primary sources checked 19 October 2026:
- https://docs.venice.ai/api-reference/endpoint/x402/top-up
- https://docs.venice.ai/api-reference/endpoint/api_keys/create
- https://docs.venice.ai/api-reference/rate-limiting

The signed-in user's displayed name opens the Profile section. Profile contains
an account-management area with Balance and Top up actions, a Buy natal chart
action covering PDF and SPA (including the interactive conversational reading),
and a link that expands into full billing account management. WooCommerce and
the custom plugin remain the single server authority for purchased access,
credits, usage, orders, payment verification, refunds and recovery. A displayed
balance is server-derived; frontend state must never grant purchased access.
No prices, free credit allowance or recurring terms are invented by this design.

Required screen inventory: signed-in name entry, Profile/account overview,
balance/usage detail, top-up selection and quote, payment pending/success/failure
and resume, natal PDF/SPA purchase with conversational inclusion, delivery and
interactive-reading entry, and expanded billing management with orders/receipts,
purchase history and recovery/refund states. Enumerate existing screens before
creating missing ones. Preserve the existing prepaid funnel and free signup.

Design assets must belong explicitly to `rebots-online/natally-ai-studio`.
Import the requested large-character conversation/atelier/constellation work
from `rebots-online/natally-chatterbox` as attributed design material into this
repository and its OpenDesign/Stitch project. This does not import Chatterbox
voice code or change this repository's existing Supertonic runtime. OpenDesign
and Stitch inventories record actual project IDs, screen IDs, provenance and
which account-management screens exist. Imported simulations remain labelled
as design prototypes until wired to real account/billing/reading services.

## Tauri 2 coordinated test builds — 19 October 2026

Robin requests a scripted test-build matrix, not a production native release.
One invocation of `scripts/build-all-platforms.ps1` stamps once, persists an
unconditional MINOR increment even on failure, and builds Windows x64 application
EXE/NSIS/MSI, Linux amd64 AppImage/DEB, Android ARM64 APK/AAB/native-symbols ZIP,
and the web ZIP plus nginx/Apache installer. All consumers use the canonical
`version.json` identity; nested platform steps never stamp independently.
MAJOR starts at 0 for this test shell and remains an explicit operator choice.
BUILD is UTC epoch minutes modulo 100000. Android versionCode is MAJOR*100000+MINOR.
MSI numeric versions map MINOR into the second/third fields and BUILD modulo
65536 into the fourth field; display strings retain the full canonical version.
MSI upgrade ordering uses MINOR without wrapping, within its 8/8/16-bit limits.

`src-tauri/` is the repository-owned Tauri 2 shell around the existing frontend.
It introduces no privileged commands or remote capabilities. A visible full
version label is embedded in the generated web bundle and native window title.
Windows EXE/MSI/NSIS use native Windows tooling. Linux scripts enforce Ubuntu
24.04 and reuse the existing default WSL installation, Rust and Node runtimes.
No separate WSL distribution or application checkout is created. Shared Windows
tools remain external; compilation caches contain no separate application repo.

Build entities and their engaging checklist tasks:

| Entity | Responsibility | Task |
|---|---|---|
| `version.json`, `scripts/release-state.mjs` | canonical stamp, input fingerprint, derived identities, inventory and hashes | BUILD-1 |
| `scripts/build-all-platforms.ps1` | exclusive coordinated invocation, every target attempted, staged partial output, aggregate exit status | BUILD-2 |
| `scripts/build-linux.sh`, `scripts/linux-build-env.sh`, `scripts/setup-linux-build-env.sh` | Ubuntu 24.04 checks, extant tools, AppImage/DEB | BUILD-3 |
| `src-tauri/`, `scripts/native-build-env.ps1` | repository shell, Windows packages, Android release-profile test packages | BUILD-4 |
| `scripts/install-web.sh` | explicit server/destination/domain, validated nginx/Apache SPA configuration and reversible installation | BUILD-5 |
| `dist/natally-ai-studio-v<version>-*` | durable artifacts, manifests, build logs and actual validation results | BUILD-6 |

Web compilation uses disposable `dist-web/`; it must never empty root `dist/`.
Every available artifact is copied immediately to tracked `dist/`. Manifest
completion requires all requested artifacts and package checks; test-build
completion never asserts production signing, store acceptance or device runtime.
Android test packages use the local Android debug certificate with an explicit
test application identifier, not production credentials. No provider/production
deployment or store upload is part of this build. The web installer is delivered
and tested locally; running it on a production host is a separate action.

Authority: current KStore CC2/CC7/CC12/CC14/TC14, with Robin's explicit correction
that local builds are scripted and Ubuntu 24.04 is mandatory. Historical manual
environment selection and Ubuntu 22.04 probe instructions are superseded.

## Deferred amendment — mobile transfer cost and deployment URL, 15 October 2026

**Status: documentation only; implementation deferred by Robin.** The new
Chatterbox and potentially Qwen TTS work is operating as fully templated
repositories and may replace this checkout. Record the requirements here for
the retained application/template; do not change this application's code,
environment files, voice engine or deployment for this amendment. Replacement
of this repository or adoption of either TTS engine is not decided by this note.

This amendment takes precedence over the historical voice/deployment descriptions
below for these two concerns. It does not mark either issue as repaired.

### Repeated large transfers on reload

Robin reports that the application still reloads approximately 30 MB each time,
wasting mobile data. Treat this as an open defect. Earlier desktop cache or
offline-playback checks do not establish that the current mobile journey avoids
repeat transfers. The reported amount has not been attributed here to model
weights, the voice runtime/WASM, application assets, or a combination; this
documentation change does not diagnose the cause.

The eventual implementation must:

- Reuse unchanged, previously downloaded voice model and runtime assets across
  ordinary reloads and returning sessions. A new worker or inference session
  must not itself require another large network download.
- Give persistent assets stable, version-specific identities and verify cache
  reuse through the actual deployed origin. Ordinary releases must not invalidate
  unchanged large assets unnecessarily. Investigate cache lookup, response cache
  policy, URL/version churn and browser storage eviction before choosing a fix.
- Distinguish network transfer from reading cached bytes into memory and from
  initializing the inference engine. Progress labels and measurements must report
  those separately; loading a model into memory is not evidence of downloading it.
- Explain any genuinely required initial/replacement download and its known size
  before starting it. A missing or evicted cache must not produce an unnoticed
  loop of repeated large downloads and retries on a mobile connection.

Acceptance requires recorded network bytes for a first load, same-tab reload,
returning session and a release that leaves the large assets unchanged, plus an
offline warm start and a cache-miss/eviction case. Warm loads with the required
assets still cached must transfer no model/runtime payload again. Separate
ordinary small requests from the approximately 30 MB complaint. Verify the real
mobile browser/device journey; cached-byte counters, a desktop run, or successful
audio playback alone do not prove mobile-data reuse.

### Footer URL follows the deployed environment

Robin reports that the bottom-right URL names a different address from the site
actually deployed. The application's public URL belongs in `.env` configuration,
with an override for each deployed environment. A proposed setting is
`VITE_PUBLIC_APP_URL`; this name is a design proposal, not an existing setting
introduced by this amendment.

The footer's displayed URL and link destination must use that same configured
public URL. Production, public test and local development must each resolve to
their own effective deployment address, without a hard-coded historical domain
or a silently substituted address. Deployment verification must check the
configured address, the address actually served, the visible bottom-right text
and its link destination together. Any intended alias/redirect must be explicit.

Carry both requirements into the chosen Chatterbox/Qwen TTS template if it
replaces this checkout. No implementation or deployment is authorized in the
current repository by this documentation-only request.

---

```yaml
Metadata:
  Project: "AstroSphere 3D"
  Repository: "ai-studio-remixastrosphere-1ee57c33-6487-411a-a872-59fbf4cbfc63"
  Branch: "main"
  Version: "2.4.0-restoration"
  Date: "2026-10-09"
  SourceCommit: "HEAD"
  Scope: "Conversational intelligence, context continuity, inference resilience, astrological doctrine synthesis, and voice/mascot integration"
  ArchitecturalOwner: "Principal AI Systems & Astrological Epistemology Engineer"
  RelatedDecisions:
    - "ADR-001: Upgrade server-side Gemini model routing to gemini-3.8-flash (deprecating dead gemini-2.5-flash endpoints)"
    - "ADR-002: Eliminate silent deterministic fallback impersonation; establish structured error classification and retry mechanisms"
    - "ADR-003: Decouple persistent lore, live chart coordinates, conversational history, and epistemological scaffolding"
    - "ADR-004: Rigorous geometric aspect configuration detection (genuine Grand Trine, T-Square, Grand Cross) adhering to strict orb criteria"
    - "ADR-005: Optional on-demand evidence and provenance inspector instead of conversational boilerplate insertion"
    - "ADR-006: Restore Natally's authentic Moldavian-inspired cosmic confidante persona (witty, empathetic, depth-psychological, zero catchphrase slop)"
  Dependencies:
    - "@google/genai: ^2.4.0"
    - "express: ^5.2.1"
    - "swisseph-wasm: ^0.1.0"
    - "three: ^0.174.0"
    - "react: ^19.0.1"
  AcceptanceCriteria:
    - "100% pass on Regression Tests A through J (referential continuity, personal disclosure, sequential topics, interpretive continuity, honest ambiguity, broad synthesis, deliberate failure handling, repetition resistance, lore isolation, doctrine distinction)"
    - "Zero silent fallback masking failed inference with canned responses"
    - "Zero unprompted analytical scaffolding tags (`[Verified geometry]`, etc.) in ordinary dialogue"
    - "Accurate aspect configuration detection (no false T-squares from unlinked squares/oppositions, no false Grand Trines from single trines)"
    - "Preservation of Moldavian audio synthesis, karaoke tracking, 3D astrolabe interactions, and persistent lore archive"
  ImplementationStatus: "Complete"
```

---

## 1. Executive Summary & Root Cause Analysis

### 1.1 The Primary Breakdown
The observed catastrophic regression in Natally's conversational intelligence was caused by a combination of critical infrastructural, architectural, and prompt design defects:

1. **Dead Model Endpoint Routing (`server.ts`)**:
   `/api/chat` and `/api/readings` were invoking `model: 'gemini-2.5-flash'`. The Google Gemini API returns HTTP 404:
   `"This model models/gemini-2.5-flash is no longer available to new users. Please update your code to use models/gemini-3.8-flash..."`
   Every single conversational request to the backend resulted in an unhandled 500 server error.

2. **Silent Deterministic Impersonation (`src/services/natallyChat.ts`)**:
   Instead of reporting the API failure or triggering a retryable state, `askNatally()` silently caught the failed HTTP request and invoked `getNatallyFallbackReply()`. This generator used crude regex matching on words like `"love"`, `"career"`, `"moon"`, `"hello"`:
   - Queries mentioning `"love"` or `"lovers"` (e.g. *"Do you see my twin flame or other love interest in my stars?"* and *"Lovers first. Then career."*) invariably returned the identical hardcoded Venus paragraph containing `"no shallow games allowed!"`.
   - Elliptical follow-up questions like *"What do you mean 'no games'?"* lacked the word `"love"` and fell through to a generic `"cosmic awakening"` canned template.
   - Significant personal disclosures (e.g., trauma affecting sexuality) failed keyword matching and produced canned greetings like `"Beep-boop! Salut bestie-chan!"`.

3. **Prompt Degradation & Catchphrase Inflation (`NATALLY_SYSTEM_PROMPT`)**:
   The system prompt explicitly instructed the model to be *"Overflowing with cute robot expressions: 'Beep-boop starlight! ✨', 'Nya~ 🌟', 'Salut bestie-chan! 💖', 'UwU ✨'"* and mandated mechanical reproduction of internal workflow blocks: `[Verified natal geometry]`, `[Traditional doctrine]`, `[Stable interpretive hypotheses]`, `[Independent observation]`.

4. **Context Collapsing & History Pollution**:
   Raw chart metadata was repeatedly dumped as a prefix into every user turn message rather than being maintained in the structured system instruction or conversation state. History turns were sliced without validation of role alternation or empty content.

5. **Spurious Astrological Configuration Logic (`src/services/astrowisdom.ts`)**:
   The pattern detection logic diagnosed a *"Dynamic Cardinal T-Square"* simply if `hasOpposition && hasSquare` were true, regardless of whether the planets were linked or cardinal. It diagnosed an *"Elemental Grand Trine"* whenever a single `hasTrine` existed!

---

## 2. Target Architecture & Execution Path

```
+---------------------------------------------------------------------------------------------------+
|                                        BROWSER (CLIENT SPA)                                       |
|                                                                                                   |
|  +----------------------------+   +-----------------------------+   +--------------------------+  |
|  |     NatallyChatbot UI      |   |       Astrolabe3D / UI      |   |    ThemesAndWisdomBox    |  |
|  |  - Active conversation     |   |  - Real Swiss Ephemeris     |   |  - Life Path Engine      |  |
|  |  - Preserved unsent draft  |   |    Planetary Coordinates    |   |  - Verified Geometry     |  |
|  |  - Retry / Error banner    |   |  - Interactive Aspect Rims  |   |    Aspect Configs        |  |
|  |  - Evidence toggle / view  |   +--------------+--------------+   +-------------+------------+  |
|  +--------------+-------------+                  |                                |               |
|                 |                                v                                v               |
|                 |                   +-----------------------------------------------+             |
|                 |                   |       ephemeris.ts / astrowisdom.ts           |             |
|                 |                   |  - Rigorous Orb & Configuration Detectors     |             |
|                 |                   |  - True Grand Trine / T-Square / Grand Cross  |             |
|                 |                   +-----------------------+-----------------------+             |
|                 |                                           |                                     |
|                 v                                           v                                     |
|  +-----------------------------------------------------------------------------------------+      |
|  |                                  natallyChat.ts (Client Service)                        |      |
|  |  - Separates: System Persona, Natal Context, Persistent Lore, Clean Turn History        |      |
|  |  - Dispatches typed requests with configurable hyperparameters                          |      |
|  |  - Structured Error Classification: Quota / Auth / Network / Offline                    |      |
|  |  - Explicit Provenance & Evidence extraction (parsed from technical annotations)       |      |
|  +----------------------------------------------+------------------------------------------+      |
+-------------------------------------------------|-------------------------------------------------+
                                                  | HTTP POST /api/chat, /api/readings, /api/tts
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                    EXPRESS BACKEND (server.ts)                                    |
|                                                                                                   |
|  +-----------------------+  +--------------------------------+  +-------------------------------+ |
|  |     POST /api/chat    |  |       POST /api/readings       |  |          POST /api/tts        | |
|  | - gemini-3.8-flash    |  | - gemini-3.8-flash             |  | - gemini-3.8-flash-lite-tts   | |
|  | - System Instruction  |  | - Temperature: 1.25            |  | - Voice: Kore                 | |
|  | - Alternating Turns   |  | - Comprehensive synthesis      |  | - Web Audio + Karaoke sync    | |
|  | - Thinking Level Low  |  +---------------+----------------+  +---------------+---------------+ |
|  +-----------+-----------+                  |                                   |                 |
|              +------------------------------+-----------------------------------+                 |
|                                             |                                                     |
|                                             v                                                     |
|                           +-----------------------------------+                                   |
|                           |   @google/genai TypeScript SDK    |                                   |
|                           |   process.env.GEMINI_API_KEY      |                                   |
|                           +-----------------------------------+                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 3. Epistemological & Context Assembly Architecture

### 3.1 Five-Tier Context Isolation Strategy
To prevent undifferentiated prompt pollution, context is assembled into distinct tiers:

1. **System Persona (`systemInstruction`)**:
   Defines Natally's identity as a Moldavian-inspired celestial confidante with high psychological acuity, warmth, witty candor, and philosophical depth. Defines conversational rules: listen deeply, answer specific questions directly, track pronouns, acknowledge disclosures with empathy, speak naturally without catchphrase spam or exposed analytical brackets.

2. **Verified Natal Anchor (`natalContext`)**:
   Exact mathematical coordinates computed from Swiss Ephemeris: planetary longitudes, signs, houses, dignities, exact aspects, and detected major configurations. Provided as reference grounding so Natally never hallucinates planetary coordinates.

3. **Persistent Lore Memory (`userLore`)**:
   Long-term biographical facts and preferences stored across sessions (e.g. native's background, past topics). Injected as biographical memory, clearly marked as distinct from live conversational turns.

4. **Conversational Turn History (`history`)**:
   Strictly sequenced, alternating `user` and `model` turns. Sanitized to ensure valid role ordering, non-empty text, and preservation of verbatim utterances so that follow-up questions (e.g., *"What do you mean by games?"*) resolve naturally.

5. **Evidence & Provenance Metadata**:
   When technical analysis is performed, the model can optionally provide structured evidence citations (or a designated evidence footer `---EVIDENCE---`) that the frontend parses into an on-demand expandable "Cosmic Geometry & Provenance" inspector rather than cluttering ordinary conversational speech.

---

## 4. Geometric Aspect Configuration Invariants

Aspect patterns must adhere to mathematically rigorous celestial geometry:

- **T-Square**:
  Requires an Opposition between two bodies ($180^\circ \pm 8^\circ$) where BOTH bodies simultaneously form a Square ($90^\circ \pm 7^\circ$) to a third body (the apex). Must identify the apex planet and modal quality (Cardinal, Fixed, Mutable).
- **Grand Trine**:
  Requires THREE distinct celestial bodies in mutual Trine aspects ($120^\circ \pm 8^\circ$) forming a closed triangle, typically spanning the same astrological element (Fire, Earth, Air, Water).
- **Grand Cross**:
  Requires FOUR distinct celestial bodies forming two oppositions ($180^\circ \pm 8^\circ$) and four connected squares ($90^\circ \pm 7^\circ$).

---

## 5. Verification Boundaries & Invariants

1. **No Silent Fallbacks**: The system must never present a canned keyword-matched message as a successful reading. If an API call fails, the client must surface a clear status banner with a retry trigger and retain the user's uncommitted input.
2. **Deterministic Offline Mode**: If deliberate offline simulation is requested or during complete API unavailability, the fallback must be clearly watermarked as `[Offline Calibration Mode]` and must contextualize the conversation history rather than repeating identical static strings.
3. **Voice Compatibility**: Output formatting must be speech-friendly; the speech synthesis pipeline strips structural Markdown and technical brackets, while preserving expressive punctuation.
