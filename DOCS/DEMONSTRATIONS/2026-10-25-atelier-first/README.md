# Atelier-first layout and real opening journey

## Released

Source 24bfe51 moves the atelier directly beneath a compact brand/account header,
removes the repeated visible stage heading, and moves room/chart controls below
the scene. Existing chart details stay available below the chart view.

Source 35ba7ec restores welcome-before-reading speech while provider generation
and streamed text proceed independently. Source 66a6fa7 removes an arbitrary
welcome-start timer, expands whole-reading audio retention to 64 MiB per reading /
192 MiB per account, moves sharing into the controls, and keeps ONNX diagnostics
out of production narration. Retained build commit 22db4fd corresponds to Surge
release 1792903406639, application app-Hk08_ehc.js.

## Actual browser trajectory

- Used the existing Chrome connection on this computer, natally.surge.sh.
- User explicitly approved whole-history erasure and repeat onboarding. The
  conversation-only native confirmation stalled browser control; no erasure
  completion is inferred from that dialog. A fresh same-browser tab opened at
  First light. Continued the real onboarding UI there.
- Entered Robin, 1975-11-10, Ottawa CA, 16:17, Toronto CA. Gazetteer accepted the
  full city label and displayed 45.41 N / 75.70 W, America/Toronto.
- Begin automatically generated the natal interpretation; no application prompt
  appeared as a user message. Provider: dots-studio/dots-3-note-preview:free.
  Complete natal text: 1,793 words, with an invitation to explore before proceeding.
- Actual voice performance events began with every word of the existing welcome,
  then reading narration. These are playback-event evidence, not a claim of
  independent acoustic listening. Natal chart targets visibly follow narration.
- At 924x827 the scene begins around y=80 and the complete atelier fits above its
  controls. At 390x844 there is no horizontal overflow; entire scene fits above
  the controls. At 1440x900 chart/atelier and conversation occupy adjacent columns.
- The earliest screenshots precede the final sharing/diagnostics refinement.

Journey continuation and final replay evidence are recorded below.
No automated tests, lint or type-check commands were run for this task. Vite was
used only to produce the deployed application.

## Continuation on the final release

- Asked a real exploratory question about the Sun–Moon square. The 717-word
  response preserved the Explore stop and Continue to my horoscope action.
- Replayed all 1,793 words on app-Hk08_ehc.js. Recording completed, with visible
  saved-audio controls: 608.611375 seconds, 29,213,390 bytes, 56 captured segments.
  This exceeds the former 24 MiB limit. IndexedDB record has complete=true and
  its WAV Blob size matches. Played the saved audio and observed time advance
  past 4.95 seconds, then paused it to continue the journey.
- Selected Continue to my horoscope. Real provider generation produced a separate
  1,928-word now-stage reading, saved in history; route advanced to Right now.
  No internal prompt appeared as a user turn. Same provider model as the natal.
- Current-sky narration continues while the completed text is available. This
  record does not assert that the entire second recording has finished saving.
- Expanded Chart details and observed the natal/archived-current relationship
  chooser and observation-time control, then returned to the atelier during
  narration. No speech interruption was required.
- Final-release images: 924-final-atelier.png, 924-final.png,
  1440-final-atelier.png, 390-final.png, chart-details.png,
  saved-natal-audio.png, horoscope-complete.png. The narrow viewport measured
  innerWidth=390 and document scrollWidth=385 (no horizontal overflow).

## Scope of evidence

The live onboarding, automatic natal, clarification, explicit horoscope and
complete natal recording/replay were exercised. The initial whole-history
confirmation outcome was not observed; do not describe it as a proven erase.
No physical Android, independent acoustic listening, completed purchase, or
complete second-recording retention is claimed by this demonstration. Personality
and interpretive accuracy are not certified by successful generation or playback.

## Reading attention follow-up — 25 October 2026

Source 7018cc1 / 9c0a257, deployed release 1792941816313. The latest entry,
app--Ar15QOX.js, rolldown-runtime-hePW80VL.js and app-DWRghDPp.css all returned
HTTP 200 and matched the local release bytes. App SHA-256:
e15b5fde539b4e17a9c4533c3c8dce69b913d3be750b67fb0642a15b2c670a83.

- Returning-session entry was the atelier. Selected Reading room before actual
  natal TTS replay: room remained during preparation; playback started and the
  first word appeared with view=chart and chart viewport top=0. Subsequent words
  did not repeatedly scroll the page. The existing saved reading was used, so
  this does not verify the newly authored opening prompt's generated wording.
- During real narration, the focus caption was Scorpio; clicking it focused the
  currently spoken word, and Stop voice remained available with speech advancing.
  Chart focus remained Scorpio. No seek, restart or clear was invoked by the link.
- At 390×844, selected the Sun–Moon square, then followed the caption back to the
  paused natal passage: keyboard focus landed on the word at source offset 2358.
  The square remained selected; no horizontal overflow was measured. Browser
  viewport was reset after this check.
- Sun–Moon natal square and archived Neptune–Mars current-to-natal square both
  visibly displayed full-length coral connections/glow and endpoint labels.
  Current-to-natal squares retain cyan dashes over the red connection.
- Native saved-WAV playback also switched atelier → chart and reached 11.49 s
  with chart viewport top=0. Paused after verification. No complete audio or
  conversation was erased. Browser error log was empty on final release.
- Local private image: `.tmp/reading-recovery/reading-focus-square-live.png`.
  No personal screenshot, reading history or recording was added to the release.
- Ten focused camera/karaoke tests pass; Vite build passes. Type-check still
  reports the pre-existing mascot-test avatarUrl prop mismatch. The broader
  parser suite passes 4/5: its obsolete 48-cue-limit assertion fails identically
  with the pre-change presentation implementation (60 versus 48).

This follow-up does not claim a newly completed first-run onboarding, live
streamed-generation journey, physical Android or independent acoustic review.
Streaming and new-opening paths share the updated camera/start handlers; their
full first-run acceptance remains distinct from the observed replay paths.
