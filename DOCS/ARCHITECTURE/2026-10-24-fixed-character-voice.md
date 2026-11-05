# Natally's voice is her brand

Operator instruction: remove the voice choice; Natally's voice is her branding
even more than her visual, and visitors must not dilute it. This bounded repair
extends the content-authenticity audit; other unfinished requirements remain.

## Requirements and checklist mapping

- BV01 / BV-A: Remove consumer voice-speaker, pitch, tone and replacement-preset
  choices. Retain the configured Natally voice, pitch and tone at load/save and
  playback boundaries so old stored alternatives do not survive the UI removal.
  Keep read-aloud on/off and reading pace as listening/accessibility controls.
- BV02 / BV-B: Remove obsolete Gemini/provider comparison copy. Describe local
  speech accurately without implying the inference conversation stays local.
- BV03 / BV-C: Remove character-style/intensity and sprite-movement controls:
  source inspection shows they only write preferences with no current consumer.
  Fix the reset handler's undefined customAvatar reference; persist actual reset.
- BV04 / BV-D: Keep working Auto/Gentle resource settings and opt-in measurement
  functionality; group technical material as optional details. Preserve streaming.
- BV05 / BV-E: Deliver source/build and verify the actual settings panel at
  desktop and phone widths, including persistence and close/reset behavior.

## Pre-authored continuous observation

On the existing signed-in live account, retain chart/history and record the
settings journey without sending new inference or erasing user data.
S1: open reading settings from the chat; inspect the single Natally identity,
absence of speaker/pitch/tone/personality/movement choices, correct speech copy,
and accessible modal name/close. S2: adjust reading pace then reset; observe the
configured value returning and no reset exception. Toggle read-aloud off/on,
close and reopen; retain original read-aloud preference. Expand technical details
and observe Auto/Gentle and the opt-in measurement panel without opting in.
S3: at 390x844, open settings and inspect readable controls and reachable close;
restore desktop, reload and reopen to observe persistence. Capture named stills
within the recording. S4: identify live build and Git commit.

Source inspection establishes brand-setting normalization, not acoustic identity
or physical Android acceptance. No claim of listening verification without
actual listening. Full product content/composition audit, cloud memory, story
continuity, commerce and earlier incomplete scenes remain open.

## Delivered behavior and observation, 2026-10-24

The listening dialog is portaled to document.body. The first phone-width
observation exposed the page header painting over the dialog inside the chat's
stacking context; the portal removed that obstruction in the delivered build.

Live Chrome observations at 390x844: the single voice panel has no speaker,
pitch, tone, character or movement choices; expanded technical details show
accurate local speech copy, Auto/Gentle, and opt-in measurement. Close and Done
remain reachable. Pace changed from 0.90 to 0.95; Restore defaults visibly
returned it to 0.90. Read-aloud off persisted through closing/reopening; it was
restored to on. After restoring the desktop viewport and reloading, the dialog
showed On and 0.90. Private stills are in
`.tmp/fixed-character-voice-20261024/` (phone.png, phone-expanded.png, desktop.png).

Build completed and Surge release 1792824926513 was published. The live document
loads `/assets/app-DVtgbDPj.js`, matching the final build. No new reading was
submitted. Existing history was retained.

The continuous screencast was interrupted by the browser recorder twice; the
second interruption reported raw CDP unavailable during a paused document
response. These fragmented captures are not a complete continuous demonstration.
BV-E therefore remains open for that evidence requirement. The observations above
are UI/runtime evidence, not listening or physical Android acceptance. Legacy
voice normalization is implemented at load/save/speech and streaming boundaries;
the old-choice migration was inspected in source, not demonstrated acoustically.
