# Interaction analytics implementation evidence — 30 October 2026

Architecture92293c9c and recipeececfe36 were pushed before coding. Separate
coder ownership covers the shared adapter/app lifecycle and the chart/prop hooks.
Implementation and deployed acceptance are in progress, not yet complete.

Existing canonical setup readback: PROJECTS/Natally/INFRA/google-analytics.md
revision1 SHA25697a2e7472079e356a4a566ae820ba2c8fd9212c6dc987a7dba2048e34968ad87.
Actual browser Home also identified Natally property561516754/measurement
G-E3420JFKPB and displayed no website data received before this implementation.
No new property, Ads link, Measurement Protocol secret or collector was created.

Live annotated .env preserved in ignored build/env-checkpoints/30oct2026-analytics.env
before appending only @public VITE_GA_MEASUREMENT_ID with the existing stream ID.
No .env.local existed at this point; no credential binding was changed or printed.
Portable .env.example will retain an empty installation-specific measurement ID.

Google's actual tag event API/realtime guidance was read at
https://developers.google.com/analytics/devguides/collection/ga4/events .
Actual received events remain to be demonstrated; enqueueing is not receipt.
Recording and native packaging remain held.

## Implementation and deployed evidence

Both assigned coders returned scoped source maps. Supervisor reviewed the adapter,
entry/context boundaries and all three interactive component diffs. Corrections
were returned to the same coders: explicit unknown input, owner-matched positive
credit access, canonical from_view/to_view, actual TrueNode inventory, and action
source independent of preceding narration. Source0392d36e,373f7095,004036f3 and
b7b2dff4 were committed/pushed with exact remote readback. Combined tsc passed.

First coordinator preflight exited1 before stamping: template annotation and GA
binding mismatch. Preserved build/env-checkpoints/30oct2026-analytics-before-sync.env,
then used existing environment.mjs sync and set the real public ID in its template
slot. Check passed. Parsed comparison found no changed existing bindings and only
VITE_GA_MEASUREMENT_ID added. Credentials were not printed or modified.

Web1.24.89023 deployed successfully, then final correction release1.25.89030:
source b7b2dff4f6d9e52962733c03f253679500ba9a8b, code100025, invocation
3869a50f-595e-4be5-a80b-9f8ecfb8c32b. Coordinator exited0; both hosts92/92
HTTP200 and SHA matches (184/184);3web artifacts verified,9native pending.
Fingerprint a7621c6c5bacad7e62d99a39577797c62883c5fb5529ca95c342ccaafecf3315,
sourceInputsMatch true. Deployment report:
build/deploy-1.25.89030-3869a50f-595e-4be5-a80b-9f8ecfb8c32b/run-2026-10-30T06-32-44-370Z-26756/deployment-report.json
SHA256 b261d16b1f4ee2691c67cabf35361406b726b0da6529b483098aa66b8860c898.

Actual signed-in canonical-domain Chrome observations on1.24: Google tag200,
collection204 for marketing and authenticated app; location strips query/hash.
Sun selector produced one selection and one paired authored-answer episode.
Earth hover/leave then repeated hover/click produced separate two hover episodes
and one selection. User and automatic-scroll scene changes were distinct. Actual
hourglass pickup, keyboard movement left/right and set-down produced separate
pickup/drag/drop actions. Crystal keyboard pulse and pointer caress produced
paired durations (pointer caress2017ms). No prop was deliberately broken.
GA property561516754 Realtime showed1active user and actual trinket_interaction,
crystal_ball_interaction, education_answer, scene_view_change, world_transition
and world_interval names. This is received/report evidence, not only enqueueing.
Screenshot: C:/Users/Admin/AppData/Local/Temp/Natally-deployed-QA-20261030/analytics-realtime-v1.24.png.

1.25 normal reload visibly showed the final stamp and selecting TrueNode showed
its actual authored lesson. Final corrected event/replay checks follow below.
Commercial purchase/fulfillment outcomes, custom report dimensions, native stream,
actual break outcome and broader device/account variants remain unaccepted here.

Final1.25 actual collection204 contains planet_truenode selection and a single
paired education_answer with source user_action. Replay produced voice_playback
started/source narration/entry replay, visible UI reached Natally is speaking,
and no second education_answer was emitted. Sound Off ended the visible speech.
Attempted report-tab foreground switching did not establish an actual hidden
document, so hidden-return timing remains unobserved rather than claimed passed.
Final UI screenshot C:/Users/Admin/AppData/Local/Temp/Natally-deployed-QA-20261030/landing-controls-v1.25.png
shows Account & billing in Profile, compact handle and shared Sound/placement row.
Source/collection/report evidence does not complete the remaining paid/native goal.

Canonical readback after evidence publication e55d6f1b:
PROJECTS/Natally/ARCHITECTURE/interaction-analytics.md revision2/head2,
SHA256 8d8fb0340d002bd16b857c79c83ca5bc8f7cb071464cf60194e07480fa649429.
Prior architecture/recipes retained; receipt and current IGA states appended verbatim.

## Recipe checklist status reconciliation — 30 October 2026

Corrected the stale IGA recipes/rubric row from IN_PROGRESS to COMPLETE. The
published recipe is ececfe36d30ca40a91092a8e6795101192f83c3d, titled "Define
analytics coder ownership and real event acceptance rubric"; its commit changes
only CHECKLIST.md with 76 insertions. Git ancestry checks exited 0 for the recipe
preceding implementation commit 0392d36e and for its inclusion in current master.
Before this documentation correction, local HEAD and origin/master both resolved
to b089a9f8f676de4f6527084762407885caf8a492, confirming remote recipe reachability.
The existing 1.25.89030 deployment/collection/Realtime evidence above is retained;
this reconciliation adds no new runtime observation. Endpoint/property acceptance
remains IN_PROGRESS with the same unobserved hidden-return, break and broader
device/account branches. Recording/native holds and commercial/report work remain.

Parent-reported follow-up on the same 1.25 source: the native tool confirmed
Chrome's window was minimized, but the CDP collection observation did not capture
a hidden transition. Hidden-return remains unobserved; no lifecycle defect was
established. Page.bringToFront was requested afterward. A subsequent fresh native
AX state confirmed Chrome was restored; the delayed collection observation still
showed no hidden/return events.
