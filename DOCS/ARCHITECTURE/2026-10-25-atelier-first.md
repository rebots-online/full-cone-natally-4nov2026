# Atelier first

User's annotated screenshot identifies the stacked purchase notice, chart metadata,
repeated title and spacing as unnecessary obstacles to seeing the complete atelier.
Baseline: GitHub master 164c05a. Latest source already relocates purchase and chart
metadata; this delta removes the remaining repeated title and moves room controls
below the scene, retaining all interactions.

| ID | Enumerated entities | Contract |
| --- | --- | --- |
| AF01 | `src/App.tsx`: `App`, workspace wrapper, top header, chartResult stage wrapper | Compact outer padding and header; existing Profile exposes secondary actions |
| AF02 | `src/components/ReadingStage.tsx`: `ReadingStage`, `extraControls`, `chartTools`, `inRoom`, `onView`, `paused`, `onPause` | Remove repeated visible title/eyebrow; put existing control group after visual pane and before conversation in DOM; chart details below layout |
| AF03 | `src/components/ReadingStage.css`: `.reading-stage`, `__layout`, `__visual`, `__conversation`, `__controls` | Scene is first; desktop controls span both columns beneath them, stacked layout places controls between scene and conversation; viewport-aware desktop height |
| AF04 | `CHECKLIST.md`, this document | Final browser trajectory: reload at screenshot-like 924×827, observe entire scene without scrolling; switch chart, open details, return to atelier; resize 390×844 and 1440×900 and capture actual screens. No automated checks. Commit, push and deploy. |

## First-run journey correction

The user explicitly requires the complete first-run experience in this delivery.
The existing runOpening starts inference by skipping welcome audio. Restore the
welcome without putting network generation behind audio startup.

| ID | Enumerated entities | Contract |
| --- | --- | --- |
| AF05 | `src/components/NatallyChatbot.tsx`: `beginStreamingReply`, `handleSendMessage`, `runOpening`, `messagesRef`, `greetingAllowed`, `openingGeneration`, `failedOpeningStage`, reading-route navigation | Natal opening supplies its existing welcome as a speech prelude. Start provider request immediately, render incoming text immediately, queue reading speech after welcome. Failed greeting startup releases speech queue; no silent dependency on audio. Cancel/replay/account changes retain existing generation ownership. Show route from first opening onward, including failure/retry. |
| AF06 | `src/services/streamingSpeech.ts`: `createStreamingSpeech`, `callbacks.beforeSpeech`, `pump`, `prime`, `active` | Await optional prelude before draining speech queue, then recheck ownership; synthesis may prepare concurrently. Text updates and provider completion never wait for prelude. |
| AF07 | Live demonstration | With explicit reset permission: Profile whole-history erase → onboarding using Robin's existing details → automatic welcome and natal reading without sending a prompt → exploratory question → Continue to my horoscope → current/natal relationship highlights → saved audio/replay. Capture actual stages and provider result, fix observed defects; no fixture or mocked-response acceptance. |

Artwork and account identity remain unchanged. Whole-history erasure is the user's
explicitly approved live demonstration action, performed through product UI.

## Live-journey findings

The actual natal response is 1,793 words. At its observed narration rate it
outlasts the old 24 MiB WAV limit (about 8.7 minutes). Full readings must remain
saveable without asking people to shorten the interpretation.

| ID | Enumerated entities | Contract |
| --- | --- | --- |
| AF08 | `src/services/readingAudio.ts`: `MAX_RECORD_BYTES`, `MAX_ACCOUNT_BYTES`, `createReadingAudioCapture`; `src/components/RetainedReadingAudio.tsx`: retention description | Allow a 64 MiB complete reading (about 23 minutes at 24 kHz PCM16); retain up to six / 192 MiB per account, enough for the two long opening recordings and follow-up. Existing quota-error handling remains. |
| AF09 | `src/components/VoiceDownloadStatus.tsx`: `VoiceProgress`, `status`, `hasByteProgress` | Production shows useful initial voice preparation/download/error notices, not a flashing inference/ONNX diagnostic strip every spoken sentence. Detailed timers/files/graphs remain development-only. |
| AF10 | `src/App.tsx`: `ReadingStage.extraControls`, `conversation`, `setShowExportModal` | Share chart joins the existing controls row, removing a separate empty-height strip over conversation. |

AF05 refinement: no arbitrary welcome startup time limit. The welcome completion
or explicit speech cancellation releases the speech queue; model preparation does
not delay provider generation or reading text. Voice service already reports
synthesis failure and resolves its completion result.
