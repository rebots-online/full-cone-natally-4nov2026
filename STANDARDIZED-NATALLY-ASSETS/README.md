# Standardized Natally assets and media

This is the reusable Natally brand baseline requested on 24 October 2026.
It preserves the original amber-eyed character, violet/gold atelier and crystal
ball from the existing exported reading room. It is not newly generated artwork.

## Open the baseline

- `atelier/baseline.html`: normalized, static idle scene. Reference canvas:
  **1600 × 1000**, device pixel ratio 1. Crystal ball present; no selected chart,
  personal information, conversation, simulated speech, text overlays or controls.
- `atelier/baseline-1600x1000.png`: browser-rendered reference of that HTML.
- `atelier/rehearsal.html`: preserved interactive source export, initially idle.
  Its conversation and audio events are explicitly simulated.
- `atelier/assets/natally-still.webp`: original 400 × 400 still derivative.
- `atelier/assets/natally-mascot.webp`: original 400 × 400 animated mascot.
- `brand.json`: common character and voice contract, imported by this app's
  speech service and Natally prompt. Version changes here are deliberate brand
  releases; modules and user preferences do not supply alternate voices.
- `manifest.json`: SHA-256 inventory and source provenance.

Serve the project locally and open
`/STANDARDIZED-NATALLY-ASSETS/atelier/baseline.html`, or open the file directly.
The baseline has no network dependencies, timers, model downloads or audio.
The exported SVG scene retains its original addressable parts and image pixels.
The reference PNG is a render at the standard canvas size, not new high-resolution
character art. The source raster remains 400 × 400.

`atelier/DESIGN.md` and `atelier/MOTION-CONTRACT.md` are copied historical source
notes. Their Chatterbox-era integration wording describes that rehearsal only;
the current application's voice is Supertonic, as recorded in `brand.json`.
The baseline is a visual asset, not evidence of a functioning inference, payment,
animation, mobile or voice integration.

## Recognizable character

Every Natally is a little febrile and oracular: intimate, electrically alert,
expectant, with clear observation under the atmosphere. When interpreting a
chart or horoscope, precision and symbolic resonance coexist. When she herself
overshares or goes off-chart, she can turn very sharp, dry, lucid and candid.
The edge belongs to her wit; it is not hostility toward a person confiding in her.
Brief asides do not invent autobiographical canon or supplant the user's reading.

Reading cadence example: “There is a restless thread here. Let's follow where
it actually leads.” Off-chart example: “I was about to make this about me.
Mercifully, Saturn has interrupted.” These demonstrate register, not catchphrases.

The existing F4 / pitch 1.15 / rate 0.9 / soft preset is preserved. No listening
acceptance of a newly produced performance is claimed. Wording steers cadence;
it does not give this speech engine an unsupported emotional-prosody control.
Mute, replay and device-resource preferences remain available. Voice, tone,
pitch, pace and persona selection have been removed from companion preferences.
Old saved custom voices are normalized on load, save and synthesis. Environment
voice overrides are retired so separate builds cannot accidentally dilute identity.

Other Natally projects should import/version this package and apply the same
normalization at their speech boundary. Only this checkout has been changed.

## Divination DLC proposal — not implemented

Recommended: one persistent atelier and one Natally, with independently entitled
ritual modules. A tarot subscription unlocks `natally.tarot`; monthly and annual
store products can grant the same entitlement. Future I Ching, Vedic astrology,
augury, scrying, tea-leaf and dowsing modules follow the same packaging contract.
A future collection subscription can grant several module entitlements without
changing their content identities. Prices and included reading allowances are
commercial decisions, not implied by this proposal.

The purchased experience: choose Tarot, purchase or restore, verify access,
download and verify its bundle, then enter Tarot in the current atelier. Natally
stashes her ball, brings out her deck, offers a spread, deals it, and references
the actual revealed cards as she speaks. Returning to Astrology restores the ball
and chart. A failed download leaves the current room usable and offers retry;
purchase success and content readiness are separate states. Reduced-motion mode
changes props immediately. No decorative animation blocks text or audio.

Use a signed, versioned bundle containing:

- Manifest: module ID, content version, host API version, required entitlement,
  brand contract version, locale, file sizes/digests, rights and provenance.
- Capability definitions: typed input/output records, named procedures, bounded
  conditionals/repetition, allowed host operations and deterministic session state.
- Tradition data: card IDs and meanings, spread slots, reversal rules, or the
  corresponding hexagrams, calculation conventions or observation vocabulary.
- Media: licensed card faces/backs, props, animations, audio effects and layouts.
  Natally's shared voice and character are references to the brand, not overrides.
- Compatibility and validation cases; no secrets, personal charts or model weights.

Illustrative procedure notation (not an existing executable language):

```text
procedure three_card_reading(question):
  require entitlement("natally.tarot")
  require bundle_ready("natally.tarot")
  scene.stash("crystal-ball")
  scene.present("tarot-deck")
  cards = ritual.draw_unique(deck, count=3, reversals=deck.reversal_policy)
  session.record(question, cards, spread="situation-tension-direction")
  scene.deal(cards, slots=spread.slots)
  reading.interpret(recorded_session, tradition=deck.tradition)
  presentation.follow(recorded_card_ids)
on exit:
  scene.restore("atelier.baseline")
```

Ship the interpreter and every executable operation in the application. The DLC
describes bounded compositions of those operations; it cannot run arbitrary
JavaScript, install binaries, write DOM selectors, access credentials, change
entitlements or replace Natally's system identity. New native capabilities ship
through an app update. This is a constrained ritual language, not a general
downloaded plugin runtime. Content classification still requires store review;
calling an executable payload “data” does not exempt it from platform rules.

RevenueCat supplies access state, not the DLC storage/delivery system. The existing
backend would verify access before authorizing protected downloads or new readings.
Use stable signed-in identity, restore purchases, idempotent webhook processing,
and entitlement refresh at purchase/restore/foreground/session start. Bundle bytes
on disk are not proof of current access. Install atomically only after signature,
hash, size, path and host-compatibility checks; retain the previous usable version.
Cached offline access needs a bounded, server-issued lease rather than trusting
the device clock. Exact duration remains a product decision.

Cancellation keeps access until the paid entitlement ends; expiry/refund/revocation
gates new readings without deleting saved spreads or transcripts. Preserve a
record's module/content version, random draw and reversal results so reopening
never silently redraws it. Hosted inference allowance is a separate meter from
module access; this proposal does not bind the unresolved AICREDIT/ROCHE balance.

Tarot needs a licensed complete deck and separate ball/hand/deck art. The current
character raster includes the ball, so a convincing stow/deal animation cannot be
obtained just by hiding an SVG glow. I Ching requires a declared casting method;
Vedic astrology requires explicit ayanamsa/calendar/calculation conventions;
observational traditions need declared user-supplied or simulated observations.
Scrying and dowsing must not imply real sensing that the device does not perform.

Alternatives: compiling every content update into the app is simpler but slows
content releases; unrestricted downloadable code is flexible but increases review,
compatibility and execution risks. The bounded content bundle is the recommended
middle ground. This is a discussion proposal, not a released architecture,
purchase catalog, paywall, bundle interpreter or verified payment journey.

Sources checked on 24 October 2026:
[RevenueCat entitlements](https://www.revenuecat.com/docs/getting-started/entitlements),
[subscription state](https://www.revenuecat.com/docs/customers/customer-info),
[Android dynamic-code guidance](https://developer.android.com/privacy-and-security/risks/dynamic-code-loading),
[Apple review guidelines](https://developer.apple.com/app-store/review/guidelines/).
