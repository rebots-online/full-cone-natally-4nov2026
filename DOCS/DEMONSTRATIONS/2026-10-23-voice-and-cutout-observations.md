# Voice and cutout: actual delivery observations

Delivered to https://natally.surge.sh/ in Surge release `1792783993362`.
Source: `8229344`, incorporating the separately published language/cookie work.
Entry bundle: `assets/app-CwZYN3uy.js`. Work used this computer and GitHub.

## What was observed

| Requirement | Result |
| --- | --- |
| Complete waiting phrase | The old `look.wav` recording itself omitted the word. `look-v2.wav` reuses the existing complete `closer.wav` take: “Let me take a closer look.” The runtime caption agrees. Actual browser WebAudio output was captured; transcription of the played cue includes every word. |
| Other waiting phrases | Versioned `moment-v2.wav` and `thread-v2.wav` contain “Give me a moment” and “Let me follow that thread.” Their preparation provenance records the settings. |
| Tight original-character cutout | Head and antenna SVG paths follow the source silhouette. Live inspection isolated the remaining rectangle to applying clipping and hand occlusion on the same image. An outer clipped group now contains the masked image. The rectangle is absent during observed idle, speaking and scrying animation; the original antenna/turban/face pixels remain. |
| Generated personality | Not accepted. A fresh Sun-square-Moon reply from `dots-studio/dots-3-note-preview:free` completed but remained too formal and definitive. The final change shortens the competing language policy and places SOUL's canonical example beside the current question. Two subsequent Venus requests both routed to `cohere/north-mini-code:free` and returned `finish_reason:error`, null visible content, and 3,283 / 8,703 reasoning tokens. Neither demonstrates the requested personality. Both used `max_tokens:16384`, temperature `1.45` and the requested `openrouter/free` route. |
| Wider continuous journey | Still open. The bounded clip below demonstrates the latest audio/cutout repairs; it does not complete the full new-reading, horoscope, replay, onboarding or billing trajectory. |

![Actual deployed head boundary](evidence/2026-10-23-head-cutout-live.png)

## Retained evidence

Private conversation/audio evidence stays outside Git and deployment in
`.tmp/voice-cutout-tour-20261023/` beneath the active Windows worktree
`C:/Users/Admin/.codex/worktrees/natally-chart-atelier-plan/natally-ai-studio`.

- `final-live/waiting-and-cutout-live.mp4`: one continuous 43.252-second browser
  segment, idle → ordinary Venus question → complete waiting utterance → scrying.
  Captured 686 compositor frames; encoded every third frame with its actual
  timestamps. Maximum source-frame gap 1.115 seconds during the UI action.
  Actual WebAudio output is aligned 3.231 seconds after the first frame.
- `final-live/frames.json`, `clip.json`, `audio-0.webm`, `audio-0.json`: raw
  recording/timing evidence. Later retry frames are retained separately in the
  same raw sequence; the published clip uses only the first uninterrupted segment.
- `delivered/waiting-played.wav`: the earlier live-output cue excerpt, transcribed
  as “let me take a closer look.” This is acoustic-output inspection, not a claim
  of subjective human listening approval.
- `final-live/room-after-retry.png`, `retry-outcome.json`: actual visible provider
  failure and its metadata. The original question remains available for retry.

Video SHA-256:
`2fbb7043a69d4d573f1bf5cde8951d6355b97f94c13d081fe416f5cb709dcc64`.
Versioned look WAV SHA-256:
`a23ef29ff3ed14f99e7521aec7e1ed097283fdd8b1814f49d92ce0b196143c45`.

No automated test, lint or typecheck was run. The delivery build succeeded;
acceptance above is based on the actual product observations, not the build.
