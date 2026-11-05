# Atelier repair delivery observations — 23 October 2026

Live application: https://natally.surge.sh/
Source: `3d6c343ac7c41da455b439d9858e34424a298111`, published on GitHub `master`.
Surge release: `1792750775080`. Chrome on the current Windows host, approximately
1915 × 909 browser viewport. Existing authenticated account and 38-turn history
were retained. No other computer was accessed.

## Delivered changes

- `6c52932`: default-on ambience with persisted explicit preference and playback
  state; room Foley independent of narration mute; sound preparation/retry.
- `be7231d`: occasional shared idle blink, head tilt and crystal massage, including
  matching hand masks and interruption by existing conversation/mishap phases.
- `3d6c343`: development-only rehearsal UI and guarded rehearsal mutations.

Architecture and demonstration script preceded these source changes at `f17fb99`.

## Observed trajectory and its limits

Evidence is local, outside the published SPA and Git history, under
`C:/Users/Admin/.codex/worktrees/natally-chart-atelier-plan/natally-ai-studio/.tmp/atelier-live-20261023/`.
The browser frames came from the live tab through Computer Use. Audio is actual
Windows speaker-output loopback, not a microphone recording or a source asset.

| Script scene | Actual observation | Evidence and remaining scope |
| --- | --- | --- |
| J1 | Existing account entered the deployed room with Ambience on, volume 0.3, Room sounds on, and no rehearsal/reset controls. | `delivered-room.png`; this was an existing account, not a fresh onboarding or deliberately blocked-autoplay environment. |
| J2 | Recorded full-size idle room for 35.94 seconds, then inset idle room for 35.95 seconds. Head movement, changing hand position and continuously moving crystal clouds are present in the frames. | `idle-room.mp4`, `idle-inset.mp4`, each with contemporaneous output audio. These are separate clips; the gap while issuing the view change is not represented as a continuous film. Brief eyelid closure and exact hand-mask alignment remain to be reviewed closely in the full trajectory. |
| J3 | Switched to chart and back. Turned narration off using its normal button while Room sounds stayed on. | The interface reported Silent Mode independently of the room-sound control. No new hosted reading, speech ducking or narration-to-chart journey was completed in this observation. |
| J4 | Picked up the taped potion vial and let it fall; the UI changed to broken. Then turned music off, picked up the rose crystal and let it fall. | `broken-gem.png`, event time in `gem-drop.json`; `gem-crash-voice-and-music-off.wav` contains seven seconds of actual output around the crash, with nonzero crash output while both other audio controls were off. Audio peak 0.9850, RMS 0.0398. Raw room recording also covers the vial event. This proves captured output, not a subjective listening approval. |
| J5 | Music was explicitly turned off without disabling Room sounds; narration remained independently muted. Later restored music on, volume 0.3, and narration on. | Control-state observation and the isolated crash recording. Room-effects-off silence and volume changes still need their scripted observation. |
| J6 | Refreshed without clearing history. Ambience remained off, narration remained muted, and both newly broken objects returned taped together. All 38 turns remained. Picked up the hourglass and set it back down. Pause/Resume motion controls changed state and were returned to running. | `after-refresh.png`, `pause-motion.png`, `delivered-room.png`. The isolated audio capture ended before the hourglass contact; no acoustic claim is made for that event. Background/reduced-motion continuity remains unobserved. |
| J7 | No account switch, forced asset failure, mobile device or reduced-motion journey performed. | Pending. |
| J8 | Production exposed ordinary room controls and no rehearsal controls. Existing saved reading remained present after refresh. | Development rehearsal and replay/export continuation remain pending. Service guards are implemented but are not represented as a demonstrated development journey. |

The original capture attempt could not continue after its tool context ended.
Subsequent awaited capture loops produced the two usable idle clips. Raw frame
metadata preserves capture gaps; clips are explicitly partial evidence, not the
single complete acceptance film. No A23 task is marked COMPLETE on these clips.

## Live publication identity

HTTP downloads matched the local deployed files byte for byte:

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `index.html` | 4242 | `a1040a4a01f1a8e7470e873432a784854a2085b4e157806d5925994831d78c1c` |
| `assets/app-BOM-b-X3.js` | 2214842 | `35357d59a63522f9a5040726950e6f53447c71dd14eb70f97d1e98999a402cc5` |
| `assets/app-DCENH1sE.css` | 142342 | `b5c274ab340c04a3748b2f1afae14f47b8d65783dad837d28937107db26d2734` |

This establishes the checked entry and main bundle identity; it is not a claim
that every retained older hashed chunk was compared. The full onboarding through
reading, replay and export journey and its existing provider/device/billing
obligations remain open. Internal development status and the undecided Natally
licence are unchanged by this delivery.
