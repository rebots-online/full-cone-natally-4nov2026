# ARCHITECTURE SNAPSHOT: Natally Conversational Intelligence & Astrological Reasoning Engine

### Commerce interoperability amendment — 2026-10-21

WooCommerce is **not a launch dependency**. Its future Biddlr plugin should implement our versioned provider-neutral commerce contract with RevenueCat-v2-*shaped* server-side entities for customer identity, non-renewing purchases, active entitlements, refunds, and virtual-currency transactions. This is *semantic/adapter compatibility*, NOT spoofing RevenueCat's public API host, proprietary Web Billing SDK checkout, signed receipts, or private authorization flows. Do not claim drop-in RevenueCat SDK compatibility. Internal Firebase UID and our append-only idempotent ROCHE ledger remain authoritative for granting/revoking inference credits across Alby, RevenueCat and the future WooCommerce plugin. Platform-native store entitlements remain externally verified. Webhook ingestion must normalize provider IDs and deduplicate. Future WooCommerce order.completed/refunded events map to common purchase-granted/purchase-revoked events; RevenueCat webhook/API similarly maps to canonical events. Alby marketplace per-settled-turn route is the initial launch, and does not require RevenueCat or WooCommerce configuration. RevenueCat is optional for direct-store one-time PDF+SPA and ROCHE packs when Natally's own catalog exists. No work on WooCommerce needed now.


## NAT-20261021 — Exploration continuity and two-channel commerce

Metadata: project=Natally; repo=rebots-online/natally-ai-studio; branch=feature/natally-exploration-sync-commerce; owner=Robin; date=2026-10-21; blueprint-status=approved direction, release-unverified; precedence=this amendment supersedes older 15-minute/WooCommerce-only or per-turn-only statements where specified; execution=ARCHITECTURE -> CHECKLIST -> code; runner=GLM-5.3 nonthinking discrete deterministic steps; evidence=diff + tsc + browser + backend tests; deployment=prohibited until gates pass.

**Customer offer.** Approximately USD 29.99 buys durable natal PDF and interactive SPA, plus a five-minute free/included voice-paced exploration. Start timer on first accepted question, not purchase; accept one question/inference at a time and finish answers begun before expiry. Additional exploration by separately purchased ROCHE packs. USD price, ROCHE denomination/exchange, consumable mechanics and product identifiers remain pending explicit catalog configuration, not hard-coded assumptions. Do not conflate free included minutes with anonymous free usage.

**Initial distribution and marketplace.** Alby marketplace is launch channel, with *per completed turn* metering for its payment pathway rather than requiring up-front flat-chart purchase. Distinguish store product access from conversation usage. Generate per-turn quotes/invoices and independently verify settlement before expensive hosted inference; idempotent payment and consumption accounting in server ledger. Do not grant paid use from client localStorage, untrusted webhook or a wallet popup. Offer alternative on-site one-time PDF+SPA purchase without making Alby marketplace incompatible. Integrate behind a commerce adapter rather than fork chat, chart and persona. This feature branch is the integration lane; do not merge/publish until approved and tested.

**RevenueCat.** No confirmed Natally project or products; Kintsugi may be the sole project. Implement only independently configurable RevenueCat Web Billing adapter, not Kintsugi credentials nor assumed SKU. RevenueCat intended for one-time chart product and optional ROCHE packs; its receipts, refunds, pack grants and balance must be verified on server with idempotent processing. Android billing policy/Play Billing handled separately. No fake purchasable items; configure exact IDs and secrets externally.

**Synced account data.** Firebase UID is the identity. Chart birth input already syncs to users/{uid}/private/intake; derived chart can be recomputed. Lore and conversation currently only use UID-scoped localStorage. Firestore per-account document paths users/{uid}/private/lore and users/{uid}/private/conversation hold versioned snapshots; merge legacy local contents before first cloud write, by lore text and message ID. Account switches and late writes must not cross accounts; remote failure leaves local intact, with explicit visible sync state and retry. Never overwrite remote with an initial greeting. Restrictive Firestore rules for actual configured named database must be deployed and empirically verified separately.

**Persona and flip-chart.** Preserve historical NATALLY_SYSTEM_PROMPT in comments; add occasional context-fitting 'bet' / Gen Z verbal register, never repetition or stereotypes. Existing ChartCue offsets and chart focus callbacks are the flip-chart mechanism: cue a relevant calculated entity as spoken, clear focus on changing subject, don't claim visual changes unless emitted through actual cue pipeline. TTS determines normal turn pace, can be interrupted; no backend inference queued during ongoing answers. No change to Swiss Ephemeris's role as factual source.

**Delivery contract.** Docs first, task recipe second, code third. Preserve local cache; no production access or entitlements until authenticated server accounting, tests, live rules and catalog are demonstrated. Never reuse secrets from another product.


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
