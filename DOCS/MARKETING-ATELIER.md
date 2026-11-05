# Interactive marketing atelier — 28 October 2026

Current execution contract: root ARCHITECTURE.md MFRAME-01..06 and landing-page
architecture/spec supersede conflicting historical text below. In particular,
there is no example chart for signed-out visitors, no pending provider permission
or old build hold for this implementation, and no static hero substitute. The
operator authorizes building the current round; recording alone remains held.

Status: IN_PROGRESS. User request: replace the still marketing hero with the real
animated, interactive, mysterious-sounding atelier, without conversational or
paid reading inference. Retain hover identification and authored spoken lessons
on the natal toroid. This increment preserves the existing marketing layout and
approved artwork; it wires existing working components into its hero-art slot.

## Source and authority

UI source: marketing.html [data-od-id=hero-art], #natal-chart-root;
src/components/atelier/{AtelierScene,AtelierCharacter,AtelierTrinkets,
AtelierSeason,AtelierThemeSelector,AtelierAmbience}; Astrolabe3D.
Original reusable artwork: STANDARDIZED-NATALLY-ASSETS/atelier.
KStore manually retrieved: architecture-checklist-continuous-demonstration rev 3
(e37201a77247d1b69d34ab5b2e00eff473c16f1b7d577e31efcfaed2fd787ba4),
stitch-first-ui-elucidation rev 1. No injected reminders were visible.
The user explicitly selects the existing real atelier and toroid as the UI.
No new screen design is required. Mechanical integration uses GLM-4.7/Crush.

## Requirements, tasks and wiring

| Requirement / task | Contract | Continuous scene |
| --- | --- | --- |
| MA01 / MT01 | Mount actual AtelierScene in hero-art; preserve mobile-first artwork placement and original fallback. Idle blink/gesture, pointer nudge/wobble, drag/drop/break, crystal ripples and seasonal cookie eating use original components. | MS01, MS02 |
| MA02 / MT02 | Mount existing soundscape, duck while speaking; explicit sound and speech controls; visibility/viewport pause; reduced motion honored. | MS01, MS04 |
| MA03 / MT03 | Fixed playful upsell scripts, local branded speakNatallyText, existing word/performance mouth events. First explicit audio interaction unlocks; sparse 60–100 second visible-room intervals, no overlap or interruption of chart lessons, no hidden-page speech. Stop/mute cancels pending speech. No microphone, chatbot, askNatally, paid access, provisioning or reading generation mounted. | MS03, MS04 |
| MA04 / MT04 | Astrolabe3D keeps actual hover/raycast and click controls. getAuthoredChartExplanation supplies meaning, history and reading role for bodies/signs/houses/aspects; readable full text, replay and stop. Rapid selection cancels obsolete speech. Chart speech wins over upsell. | MS05 |
| MA05 / MT05 | Signed-in chart remains calculated from real intake. Signed-out/no-intake visitors get a clearly labeled calculated example chart and create-own-chart link; never label example as their birth chart. Auth changes clear lesson, selection and speech. | MS05, MS06 |
| MA06 / MT06 | Guest marketing room uses its own local identity namespace; saved app/account room belongings and themes are not overwritten. Season defaults to Halloween in October, Christmas in December, otherwise candlelit; preserve saved selection. | MS02, MS06 |
| MA07 / MT07 | Preserve original offers/links and payment terms. Build only through scripts/build-all-platforms.ps1, publish source with LFS disabled and read back exact GitHub SHA. Deploy only coordinated artifact and verify named live page. | MS07 |

## Continuous demonstration script and rubric

One recording, carrying state through these scenes; observations/timecodes remain
NOT RECORDED until executed. Source/build/publication are separate evidence.

1. MS01: Open marketing.html signed out at desktop width, then mobile width.
   Observe real layered room and idle sequence. Activate sound; hear mysterious
   ambience and foley. Confirm no overflow or controls masking important objects.
2. MS02: Hover/nudge a trinket, drag it to a shelf then off shelf until it breaks;
   observe shards and Natally reaction. Touch crystal for visible ripple and sound.
   Pick up and eat cookie to crumbs. Change seasonal room; observe themed cookies.
3. MS03: Start a scripted Natally invitation; observe audible branded speech and
   changing mouth shapes synchronized with playback, complete readable text and
   existing matching offer link. Stay in room through an automatic invitation.
4. MS04: Stop during preparation/playback, mute, hide tab, scroll room away, then
   return. Observe cancellation/no surprise restart; explicitly replay. Exercise
   reduced motion and keyboard controls. Voice failure leaves text and retry.
5. MS05: Scroll to toroid. Confirm example label signed out. Hover actual planet,
   sign, house and aspect. Click each; hear authored explanation/history/reading
   role with visible text. Rapidly choose another and stop/replay. Confirm no
   overlapping upsell, no conversational/paid inference request in network.
6. MS06: Reload and confirm room persistence; sign in to an existing intake when
   operator session is available. Confirm real chart replaces example, no stale
   lesson/audio, and own app room state is separate. Unknown birth time retains
   existing approximate-placement semantics. Sign out clears personal content.
7. MS07: Open coordinated deployed marketing page and repeat core room/chart
   sequence. Inspect matching product links without initiating a charge. Record
   version, URL, recording ID and exact timecodes beside all requirements.

Unfinished broader billing, fulfillment, native-device and purchase acceptance
remain on CHECKLIST.md and are not completion criteria silently claimed here.

## Execution checkpoint

Implementation has not started. The scoped GLM-4.7/Crush task was prepared at
.tmp/marketing-crush/task.txt with thinking disabled. The sandboxed invocation
could not connect; automatic approval review rejected the network-enabled
invocation because sharing repository content with Z.ai requires explicit user
authorization. A pending user choice requests that authorization or local Codex
implementation. No alternate provider or indirect invocation was attempted.

Vite started at http://127.0.0.1:5173/marketing.html. The browser tool returned
"Local browser use is disabled in Work settings". No rendered, interaction,
audio/listening or recording observation has been obtained. No build stamp was
changed and no deployment was performed. Existing release remains v1.10.86133.

Publication is also pending: automatic approval review rejected commit/push to
master without explicit user authorization. Five task documentation files were
staged selectively; unrelated concurrent changes remain unstaged and preserved.
No commit or push occurred for this increment.
