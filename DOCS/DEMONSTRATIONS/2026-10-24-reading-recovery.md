# Reading camera and opening recovery — 24 October 2026

## Released changes

- 5adb18c restores automatic camera following for each new reading/replay, respects
  explicit ends of chart discussion, returns to the atelier at the end, and clears
  the inset focus when the narrative leaves the chart.
- f650a75 starts natal inference without awaiting greeting audio. A session with
  only its welcome recovers the opening on mount. The natal → exploration →
  user-selected horoscope sequence remains intact.
- A provider with no answer-text progress for 90 seconds now aborts into the
  existing retry path; the overall five-minute ceiling remains. Waiting text
  updates at ten and thirty seconds instead of retaining one filler caption.
- Waiting clips v3 were freshly synthesized with pinned Supertonic F4, speed 0.9,
  sixteen steps. The previous closer-look file was copied from a five-step clip.
  The fixed application pitch still applies during playback. Old assets retained.
- Obsolete instructions to paste/reconnect a provider key were removed from
  inference errors. Account access reconciliation remains the recovery route.

## Evidence and limits

- node --import tsx --test tests/reading-camera.test.ts tests/reading-deadline.test.ts
  tests/voice-recovery.test.ts: six passed.
- All three new camera tests fail against the pre-repair presentation code.
- Browser fixture uses the real NatallyChatbot with simulated inference and a
  greeting speech promise that never resolves. At 5adb18c it never requests the
  natal reading; repaired code requests it once, renders it, and Continue to my
  horoscope renders the second answer. A welcome-only returning fixture also
  recovers. It does not exercise real authentication or paid access.
- Fixture builder: node scripts/build-opening-recovery-fixture.mjs
  Optional --baseline=5adb18c produces before.html. Files are under
  .tmp/reading-recovery and must be served locally, never deployed.
- Live signed-in Chrome, real question about natal Sun/Moon: the chart pane became
  active during narration, the room became active when finished, and a complete
  1:40 reading recording was retained. No user history was erased for this test.
- npm run build passes. Type-check still fails at the existing
  tests/mascot.test.tsx:16 avatarUrl prop; the chatbot callback error is repaired.
- Existing parser suite has one unchanged failure (expected 48 cues, actual 60),
  reproduced against the pre-repair baseline. Four other parser tests pass.
- Physical Android reset/onboarding, actual device listening, waiting-clip
  intelligibility/timbre and interruption variants remain unverified. This is not
  a claim that the reported phone journey has passed.

## Deployment

Surge release 1792891705961, https://natally.surge.sh/, app-BjGkRjAN.js.
Live HTTP 200 and byte parity confirmed for index, application JS and all three
v3 waiting WAVs. Reloaded Chrome loaded the new JS. At 390×844 the page width is
390 with no horizontal overflow. Source f650a75 was pushed and remotely read back.
Private browser screenshots remain under .tmp/reading-recovery (not published).

## Paywall remains open

Figma Make generated https://www.figma.com/make/qaDnpIyfhFmqa7E5fRDIwY/Untitled.
It reports public/paywall.html; get_design_context returned that resource link.
The resource reader returned Unknown resource. Browser export is blocked by
Figma bot verification after refresh. User handoff requested; no bypass attempted.
Brief/export queue: LIBS/UI/FIGMA/reading-paywall-20261024/README.md.
Generated source is not yet integrated. RevenueCat product/checkout, x402 merchant
quote/settlement, and Lightning merchant quote/settlement remain unconfigured.
