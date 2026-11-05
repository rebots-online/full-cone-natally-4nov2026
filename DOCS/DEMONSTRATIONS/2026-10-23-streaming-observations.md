# Delivered streaming and access observations

Actual signed-in Chrome journey on natally.surge.sh, 23 October 2026. Native
Windows host; 390 × 844 and 360 × 740 responsive viewports. This is browser
evidence, not physical Android or an acoustic/listening recording.

## Access / mobile recovery (AR01–AR06, A1–A6)

The old browser-local-key-only path reproduced the phone failure. The client now
calls the authenticated billing access contract automatically before inference
when no key is installed. The Netlify reading-access function validates the
Firebase token and verified development account, then supplies the operator's
personal inference key from a protected production secret. Its temporary grant
is explicitly development access with expiry, without paid allowance claims.
Personal/manual keys keep precedence; future managed billing access may replace
a temporary development key. No LLM relay is introduced.

The environment tool initially reported an upsert without creating the variables:
the site's plan does not allow a Functions-only scope. The personal key was saved
through Netlify's UI as a secret with a value in production only. The plan assigns
Builds/Functions/Runtime to secrets; the deploy staging contains only the access
function, public Firebase configuration, minimal package and static service page.
The other grant settings were then created with supported scopes and read back.
Netlify deployment 6adbdb5e89b16d5b513c5315 is the configured access deployment.

Through ordinary live UI: Disconnect → Not connected → close settings → retry the
preserved question. No key entry occurred. Account settings then showed Connected
and Temporary development access. The actual provider returned text. The initial
response was visibly corrupt; playback was stopped. The delivered correction
lowers default temperature to 0.8, rejects three or more Unicode replacement
markers before final save/speech, and excludes such historical assistant text
from subsequent context without erasing history. A subsequent real answer was
coherent, but language/personality and factual quality are not accepted by this
observation. The corruption rejection branch itself has not recurred live.

The genuine access error was fully visible and scrollable, with Check reading
access and Retry reading reachable above the composer. Check reading access opened
the account dialog. At 360px the composer remained inside the card, without
horizontal overflow. Selection/error content now shares the message scroller;
the composer no longer competes with fixed-height error/selection panels.

Missing observations: physical phone reconnection, another account's denial,
grant expiry/revocation, and the complete paid purchase/provisioning pipeline.
BP-4/BP-5 remain unfinished; this temporary personal-key grant does not close them.

## Streaming (ST01–ST05, S1–S5)

All direct completion requests now request SSE. The live chat draft grows before
completion; complete spoken units enter a bounded local synthesis queue with one
unit preparing ahead. First speech starts without awaiting final generation.
Incomplete chart/provenance commands and reasoning/tool JSON are not passed to
the draft speech path. Existing tool validation, free continuation and key/account
guards remain in the client. Source guards are not observations of every branch.

Measured from real UI actions and DOM samples in actual screencasts (sampling
about 350–550ms; playback indication follows AudioBufferSource.start):

| Live request | Actual routed model | First visible text | Playback while still streaming | Final text |
| --- | --- | --- | --- | --- |
| Venus, a few sentences | nvidia/nemotron-3-ultra-550b-a55b:free | 5.819s | Not established on this short generation | 8.423s |
| Venus/Mars friendship | recursive/flint-v1.0:free | 48.080s | 49.564s, about 1.48s after text | Subsequently completed |
| Mars/disagreement, final Stop repair | nvidia/nemotron-3-ultra-550b-a55b:free | 5.519s | 6.982s, about 1.46s after text | 15.804s |

The first Venus response retained complete 1:06 audio after all chunks played.
The later room reload showed that recording and the saved reply. No whole-answer
playback restart was observed on completion. A continuous 49.89s capture covers
the short request; a 50s capture establishes actual Flint text/speech overlap.
These are screen recordings; audible quality and device listening remain open.

An Insta-now request showed the progressive draft but emitted no answer text in
its first 50s. The following capture was interrupted by browser control. A fresh
tab later restored the completed saved horoscope (54 passage positions), establishing
completion/persistence but not first-token time or speech overlap for that route.
The recording gap is not a continuous successful S2 demonstration.

The original moving replay button failed to silence playback during the recorded
S3 attempt. The delivered repair adds stable Stop voice in the composer and
invalidates pending presentation callbacks while continuing to accept stream text.
In the final 54s recording, Stop was pressed at 6.982s with 753 displayed characters
and active playback. Text grew to 4,839 characters, completed at 15.804s and remained
silent through the 53.899s sample. No restart occurred at completion. Interrupted
speech is not represented as a complete retained recording.

The 48s first-word delay remains unresolved. Streaming removes the full-response
barrier but cannot display or synthesize words that the routed provider has not
emitted. The configured openrouter/free policy still chooses different models;
the earlier fixed-free-model versus random-router decision is still pending.
Plain English / sustained Gen-Z voice acceptance (LC-1) remains open.

S4 mid-stream provider error, fragmented tool/length continuation in a fully
observed recording, sign-out during generation, S5 modal preview/share, physical
Android and acoustic/listening variants are unobserved. Their requirements stay
open. Partial drafts are not saved as completed readings. Existing history is kept.

## Private evidence and delivery

Ignored directory: .tmp/language-cookie-20261023/. Key evidence:
stream-timing.json, stream-overlap-timing.json, stream-stop-final-timing.json,
stream-live-frames/, stream-overlap-frames/, stream-stop-final-frames/ and their
derived WebP recordings retain actual frame timestamps. access-mobile-error.png
shows reachable recovery/composer. streaming-speaking-observed.jpg is one actual
recording frame. Earlier access recordings were accidentally scaled to 390×174;
their limited legibility is not full-resolution phone evidence. Later streaming
captures are native 390×844. Private account/history/recordings remain outside
Git and the static deployment. Exact final bundle/publication readback is appended
after delivery below.

Final delivery: Surge release 1792795214464, entry /assets/app-D5qgJsVw.js,
CSS /assets/app-ChI7FM5J.css, source cdfa9eb (including the small post-recording
correction that labels a stopped capture as discarded). Build and entry readback
are delivery evidence; the timing/Stop recordings above were observed on the
immediately preceding streaming release. No personal or management key was found
in static text assets. Source and retained build are published to GitHub master
and codex/language-cookie-controls; remote revision is recorded in the handoff.
