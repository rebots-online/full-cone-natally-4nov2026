# Streaming readings and overlapping local speech

Operator correction: after the waiting phrase, expose text during generation and
begin TTS immediately from stable spoken units. Preserve AR01–AR06, LC01–LC06,
DI01–DI05 and the whole-product billing, recording and physical-device obligations.

| Requirement | Enumerated entities / implementation contract | Task / scene |
| --- | --- | --- |
| ST01 | `hostedInference.ts/HostedPayload.onProgress`, `readOpenRouterStream`: `stream:true`; incremental UTF-8/SSE framing across reads, comments, multiline data, usage, DONE, provider errors, terminal finish requirement, tool-call fragments by index and reasoning details. Six-tool budget, free continuations, model and account/key guards remain. Abort stale requests while waiting. | ST-1 / S1–S4 |
| ST02 | `natallyChat.ts/parseNatallyStream`, `askNatally` progress option; `NatallyChatbot.tsx/streamingMessage`, `beginStreamingReply`, renderer and manual request callbacks. Strip incomplete commands and provenance before display/speech. Stable draft ID, progressive text and chart cues; save only final response, no duplicate final playback. Partial failure stays labelled, prompt retryable. | ST-2 / S1–S4 |
| ST03 | `streamingSpeech.ts/createStreamingSpeech`: append stable complete sentences or bounded clause/word chunks; bounded lookahead synthesis while current chunk plays; use existing Supertonic/voice chain, word/source offsets, pitch/tone and segment capture. `voiceService.ts/NatallySpeechOptions.preparedAudio` reuses prefetched first chunk. Mute/Stop, new turn, navigation, erasure, account/key change cancel pending speech. Final audio retained only after generation and all speech complete; interrupted audio never marked complete. | ST-2 / S1–S4 |
| ST04 | `readings.ts/ReadingRequest.onProgress`; `App.tsx/externalReadingProgress` and existing injected reading `streamId`; Chatbot consumes progress and commits existing final injection under same ID. `ReadingsModal.tsx` shows incremental preview while generating, preserving explicit send/replay flow. Shared direct streaming transport for all generation routes. | ST-3 / S2–S4 |
| ST05 | Deliver SPA to Surge, publish source/build, measure actual click → first visible text → first speech → final text and chart/replay continuity in a recorded real journey. Separate upstream time to first token, TTS preparation and observed playback. No promise that streaming removes provider reasoning/queue delay. | ST-4 / S1–S5 |

## Continuous recording rubric, defined before implementation

S1: Live signed-in account, retain history and Plain English. At phone width ask
a neutral chart question, no style reminder. Record click, waiting phrase, first
visible text, growing text, first actual voice start before final generation,
word highlighting/chart focus and completion. Note exact timings and model when
available. No words from tool/reasoning/cue/provenance metadata may be spoken.

S2: In the same room request Insta-now through its normal control, swap room/chart
while text grows and speech plays. Observe no whole-answer restart on completion,
final text/observation/cues retained, complete audio available only after all units
play. Reload and replay the same saved reading without inference.

S3: Start another answer, stop speech during streaming; text keeps arriving and
voice remains stopped. Mute before another request: text streams without speech.
Restore voice and use final replay. Move to desktop then 360/390px portrait and
landscape, keep composer/recovery reachable, keyboard focus and scroll usable.

S4: On an actual provider error or disconnect retain labelled partial text, stop
speech/capture, preserve question and retry from normal control. Account sign-out
and sign-in during a request must not apply stale text or audio. Tool rounds and
length continuation must append once without exposing tool JSON. Observe these
branches only when real conditions occur; unavailable branches stay open.

S5: From Readings open an entity/horoscope request, observe progressive preview,
complete it and explicitly send to the conversation. Keep existing purchase/export
and retained recording flow. Record delivered bundle identity, actual timings and
gaps. Physical Android audio/listening and full paid provisioning remain separate
operator/device observations if unavailable.

Observed S3 correction, before repair: the message replay button moves as karaoke
scrolls. Its apparent click did not silence playback in the live recording. Add a
stable composer `Stop voice` control and `stopCurrentVoice` handler that cancels
the streaming queue, invalidates presentation callbacks and stops global playback,
while the separate stream identity continues accepting text. Repeat S3 through
that normal control and verify continued text with voice remaining stopped.
