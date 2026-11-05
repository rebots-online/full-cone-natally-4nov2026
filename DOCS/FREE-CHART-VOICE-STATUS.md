# Free chart voice implementation — ER05–ER07

Status: source integrated and inspected; ER-S03 not recorded.

Chart selections retain their existing hover, focus and playful atelier behavior.
A separate educational request will choose authored text for the clicked target,
insert the person's name and the chart's calculated placement facts, and pass
it to the existing Natally real-time speech/presentation pipeline. It must never
use LLM generation or prerecorded replacement voice. Ancient visible-planet
tradition and modern outer-planet symbolism must be distinguished accurately.

Every authored lesson covers what the symbol is, its traditional meaning,
historical interpretive background and a reflective question. A purchase
invitation follows, with matching souvenir and experiential offer actions.
These are educational explanations, not a generated personal reading.

Before chatbot inference or an initial automatic reading, consult the new
readPaidConversationAccess(accountUid) server-backed, owner-bound gate. A false
or failed result must produce an authored response and retain the person's
unfulfilled question. It must not call askNatally, save fake generated content,
consume a paid turn, or classify pending backend custody as confirmed unpaid.
The backend remains the final authorization boundary.

Authored content background: Ptolemy's Tetrabiblos Book I chapters 4–24
(https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Ptolemy/Tetrabiblos/1B%2A.html)
and Vettius Valens' Anthologies (https://www.skyscript.co.uk/pdf/pubs/texts/valens/riley/docs/Vettius_Valens_Riley.pdf).
Use original explanatory language and cautious historical attribution; do not
copy translation passages or represent symbolic traditions as proven prediction.

Acceptance continues in ER-S03: decline both purchases, inspect and click
representative planets, signs, houses, aspects and dated current-sky targets;
observe comprehensive named Natally speech, full readable text, matching chart
focus, leading questions and usable offer actions. Submit unpaid chat, verify no
LLM call, then purchase and retry the retained question. Exercise rapid selection,
stop/mute, unknown birth time, chart/account switch and retained history. Stills
or source inspection cannot establish voice/motion/runtime acceptance.

Operator clarification during implementation: both purchase kinds use the same
interactive experience. Credits support new daily horoscope, synastry and personal
exploration; the souvenir purchase adds the personal reading, extensive chapter-
per-planet encyclopedia PDF and retained own atelier voice replay. A credit
customer can add the souvenir later. New inference checks paid turns, never a
souvenir-only entitlement. Replaying already retained content does not call the
LLM or consume another turn.

## Implemented source

- src/services/authoredChartExplanations.ts supplies deterministic original text
  for visible planets, outer planets, Chiron, lunar node, chart angles when known,
  twelve signs/houses and five aspects. Dated current-sky targets retain their
  observation and distinguish natal coordinates. Unknown birth time is explicitly
  approximate; it supplies no inferred houses/angles or precise natal Moon degree.
- App chart selection emits a separate educational request. NatallyChatbot uses
  its existing presentMessage/speakNatallyText path with canonical chart cues,
  readable text and ordinary Natally voice. Hover and atelier object code remains
  unchanged. A queued click waits until a paid response completes.
- Chat and quick current-sky generation check readPaidConversationAccess first.
  Denial/failure yields authored text and retains the unfulfilled prompt/media;
  it creates no generated reading and makes no askNatally call. Existing retained
  playback has no new access check or inference call.
- Authored responses carry Buy exploration credits and Add my keepsake actions
  with prominent existing button styling and exact purchaseIntent selection.
- Successful new onboarding checks live RevenueCat purchase history solely to
  suppress unnecessary offers. Existing matching purchases/active entitlements
  or lookup failure suppress automatic offers; per-account local seen state and
  an in-memory uid set prevent repeats. Explicit offer URLs take precedence.
  Only one natally:show-offers event is dispatched; it cannot autocharge.
- AuthModal's obsolete storage/credit roadmap is replaced by factual account,
  separate-purchase and legal-link copy. No customer-facing evaluation/test label
  was added; low-priced catalog entries retain their actual price.

Source review corrected a user-state declaration ordering error, invalid arrow
IIFE syntax (also observed by the coordinator in Vite), duplicate journey/direct-
checkout dispatch, paid-request lock release, lost pending chart speech and
historical/astronomical overclaims. These repairs are implementation evidence,
not completed ER-S03/ER-S08 runtime acceptance. The coordinated build/deployed
voice/account/purchase trajectory is still required.
## Saved-session replay hook — follow-on integration

The souvenir worker supplies an owner-authenticated immutable snapshot and a
viewer reusing the existing chart/reading stage. NatallyChatbot is receiving
initialMessages/readOnly support: a snapshot clones at mount, never writes live
chat history, never launches inference/automatic opening, and preserves explicit
speech/chart replay. The viewer must key by snapshot/account identity.

Original-recording retention remains a separate requirement. Existing on-device
recordings may replay; synthesizing the saved text again with the Natally engine
is not evidence that original audio was hosted or retained for a year. Snapshot
replay must not overwrite on-device recordings while synthesizing text anew.

Snapshot hook implementation is now present in NatallyChatbot and
RetainedReadingAudio. Both explicit readOnly and supplied initialMessages use
snapshot mode, clone once, and avoid live-history loading/writing. Mutation,
initial inference, automatic greeting and speech-recognition paths are guarded;
composer, clear/config/upsell controls are hidden. Explicit speech replay keeps
chart cues and karaoke but does not record over original audio. The retained-
audio component hides and guards its destructive clear action. Main's souvenir
route is held until the separate viewer/service source is available; no stub or
missing-module import is left in the normal app route.

## Included natal opening forwarding — 27 October 2026

The chatbot forwards `openingStage: natal | now` through `askNatally` to the hosted
inference request. Natal opening permits fresh server `canOpenSouvenir` or ordinary
paid-turn access; daily horoscope and other inference retain the paid-turn gate.
The server owns whether an actual RevenueCat souvenir purchase still has its included
initial reading. Client flags do not grant credit or fulfillment. Included initial
reading fulfillment and its separation from ten exploratory turns require actual
provider/runtime observation; this source change is not that evidence.
