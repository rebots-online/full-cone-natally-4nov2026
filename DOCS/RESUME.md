## Settled customer and ROCHE architecture — 27 October 2026

The operator has answered the architecture question. This supersedes the prior
pending-approval text and suggestion to add Hugging Face hosting. Do not add
hosting services or expand the rejected Netlify drafts.

RevenueCat owns the customer account, purchases, entitlements and shared balance,
enumerated and displayed as ROCHE. Other apps may award ROCHE that customers can
spend in Natally. Rewards, gift-code grants and purchases feed the same authoritative
customer balance; do not create a separate Natally-only commercial ledger.
Firebase holds operational data, including conversations, keyed or linked to the
RevenueCat customer identity. Preserve the existing authentication integration.

On account creation, reuse the customer's existing OpenRouter key if present;
otherwise provision one using the existing administrative provisioning mechanism
with zero spending allowance. Purchase allocation increases its spend allowance
using the percentage configured in .env. Credit purchases grant ROCHE; a souvenir
purchase provides sufficient ROCHE for at least ten exploratory turns in addition
to its reading and souvenir deliverables. Customer/key association belongs with
the RevenueCat customer; the operator prefers a customer-record field for the key.
Verify provider field/API behavior before claiming that storage is implemented.

The optional field remains "Have a code?" with an "Apply" action. Support single-use
redemption codes (including configured partner/AppSumo codes), gift codes granting
ROCHE without a purchase, code benefits alongside a purchase, and percentage offers
such as 25% off. Enforce the actual code's redemption and combination rules. A
percentage offer changes the payable price; a ROCHE gift grants currency. Repeated
submission must not grant a single-use benefit twice. Display actual authoritative
ROCHE balance and actual checkout price, never an invented successful redemption.

Status: requirements confirmed; implementation and live purchase/redemption,
cross-app balance and allowance synchronization still need verification.


## Issued-code attribution rule

Gift and percentage-off codes default to individually issued, single-use codes
validated against the issued-code list. Do not assume discounts are reusable.
Each code retains its campaign and intended marketing target; successful redemption
records the RevenueCat customer and redemption outcome against that attribution.
Keep intended target and actual redeemer distinguishable for campaign analytics.
Enforce any explicit recipient restriction without assuming every target is an
email address. Reusable or shareable codes require an explicit campaign exception;
they are not the default. Duplicate/retried redemption must not grant benefits
again. The code is a mutually beneficial attributed marketing instrument, not
an anonymous generic coupon. Implementation and live verification remain pending.

## Direct purchase implementation decision — 27 October 2026

The live RevenueCat editor rejected purchase/price controls on intermediate
workflow screens; its multi-step workflow permits purchase on the final screen.
The operator's explicit requirement remains purchase on EACH dedicated offer
screen and both comparison cards. Therefore implement the approved external
three-screen presentation inside Natally with the RevenueCat Web SDK initiating
its matching checkout directly. RevenueCat retains commercial authority; Firebase
retains identity. No new provider or competing ledger is authorized or required.

This replaces the impossible editor-specific prerequisite below: verify the
actual app-owned purchase cards and selected-product checkout before calling
CTA repair complete. Do not claim the RevenueCat draft itself was repaired.
Preserve externally authored design and mechanical coder integration rules.
Actual ordinary-user purchase/fulfillment demonstration remains required.

## Latest execution checkpoint

Active goal: complete ordinary-user evaluation release. Google Search Console
confirmed ownership via DNS CNAME (see INFRA/natally-public-entry.md). Branding
domains saved at two; marketing homepage and branding review remain unfinished.
KStore recovered; project infrastructure entry exists at
PROJECTS/Natally/INFRA/public-entry.md with exact literal readback. Semantic
indexing was pending on last independent check; do not claim it complete.
RevenueCat SDK checkout service is being implemented via prescribed GLM-4.7
Crush route; it is not yet integrated, deployed or purchase-demonstrated.

## Current evaluation-release clarification — 27 October 2026

The operator explicitly retains small tester prices for ordinary non-admin
accounts. The current requirements, free real-time speech correction, three-screen
card purchases, fulfillment and continuous scenes are in
[EVALUATION-RELEASE-2026-10-27.md](EVALUATION-RELEASE-2026-10-27.md).
These corrections supersede conflicting pricing or prerecorded-audio wording.
ER-T01 through ER-T04 remain IN_PROGRESS; every ER-S01 through ER-S08 observation
is NOT RECORDED. Google/DNS observations are in [INFRA/natally-public-entry.md](INFRA/natally-public-entry.md).


## PAYWALL-3 — Settled three-screen offer sequence

Operator clarification, 27 October 2026. State: IN_PROGRESS. This resolves the
previous question about the two opposing customer types and supersedes the
coordinator's proposed branch-first sequence and generic message-pack framing.

1. Full-workup screen: for customers seeking the complete reading and take-home
   souvenirs. One prominent offer card, headed by the $30 full workup and
   souvenir package, with plain-language point-form inclusions and one direct
   purchase CTA. The ten conversational turns support producing the thorough
   reading and substance for its souvenirs; they are not the principal product
   or a separate chatbot-message upsell. Preserve the specified PDF and saved
   interactive-reading deliverables and their existing terms.
2. Experiential screen: for customers seeking interactive personal exploration
   rather than the souvenir package. One prominent offer card for x402 or
   micropayment/prepaid conversational access, with point-form inclusions and
   one direct purchase CTA. Explain the experience and actual purchase terms;
   do not imply the $30 souvenir package or unlimited usage is included. Avoid
   unexplained internal currency names and generic chatbot-quota sales framing.
3. Comparison screen: reached if the customer continues past the two dedicated
   offers. Present both offer cards side by side as A/B alternatives so the
   contrast and customer fit are clear. Each card retains its own offer,
   inclusions, price/actual payment terms and direct matching purchase CTA.

The third screen compares; it does not precede the dedicated offers. Each
purchase action retains the exact selected offer through authentication and
checkout without a generic picker or another page of CTAs. The first two screens
must not force customers to reach the comparison screen before buying. Keep the
large bold offer heading, consistent card padding and prominent button; preserve
Natally's approved artwork and DESIGN.md direction. External tools own design.

The $30 offer must agree with the real catalog and checkout. Existing $0.99
tester products and the observed $2.99 legacy bundle are not evidence of a
working $30 purchase; do not relabel a mismatched checkout. RevenueCat remains
commercial authority and Firebase owns identity. Existing micropayment rails
retain their actual configured terms. No new provider or competing ledger.

Acceptance: record a direct full-workup purchase from screen 1 with its promised
reading/souvenir delivery and supporting conversation; record the experiential
purchase from screen 2 with prepaid allowance and actual inference; demonstrate
both matching actions and clear contrast on screen 3. Preserve account,
cancellation, restore, responsive and recording continuity. All observations
remain NOT RECORDED. CTA repair remains prerequisite to OpenUI design generation.


### Offer motivation — operator clarification

The distinction is not cheap versus rich or low versus high spending. Frame the
full-workup offer through the appeal of a wall-mounted, mahogany-framed,
motorized rotating natal-chart award: a personally meaningful object to keep
and display. Frame the experiential offer through exploring alongside a guru.
Lead each screen with its corresponding value, not chatbot-message quotas or
payment mechanics. The third screen contrasts those motivations with the two
cards side by side. Preserve the $30 full-workup terms and the supporting role
of its ten conversational turns. Do not invent physical fulfillment terms or
silently substitute a different souvenir; match displayed inclusions to the
specified and actually deliverable package.

This supersedes any rich/cheap customer segmentation and the generic
conversation-pack presentation in earlier drafts. It is the operator's framing,
not an invitation for the coordinator to choose a new design. All three screens
and their real purchase paths remain IN_PROGRESS / NOT RECORDED.

## Mandatory prerequisite: RevenueCat paywall CTA repair

Operator correction, 27 October 2026: the CTA repair is a prerequisite to further
OpenUI design work, not a follow-up or parallel unfinished item. Do not commission
or begin the OpenUI design task until the RevenueCat paywall purchase actions are
repaired. Readiness inspection alone is not design work and does not satisfy this
prerequisite.

Prerequisite state: IN_PROGRESS. Each relevant RevenueCat paywall screen must
provide a prominent purchase action for its advertised product, preserving that
selection into the real purchase flow without a mandatory read-more detour or
repeated selection. Preserve the approved design and settled commercial terms.
Verify the actual action configuration and resulting purchase path; metadata,
static artwork, guide buttons or a documentation entry cannot establish repair.
The full goal still requires the successful recorded purchase, prepaid allowance,
inference, recovery and delivery with requirement timecodes.

Next executable task: repair the configured RevenueCat paywall actions and their
required application connection, then verify the prerequisite before handing the
actual design task to OpenUI. Do not mark the prerequisite complete from the
already-added app guide buttons. No prerequisite satisfaction is currently claimed.

# Restart instructions — Natally completion

Updated 27 October 2026. This file is a self-contained handoff for a replacement
agent with any available capabilities. Start by checking `git status --short`, the
current branch and HEAD, then compare the branch with GitHub before relying on any
older session description. Do not assume a server, build, install, payment flow,
recording or automation woke up with the agent. The last observed checkout was on
`codex/native-build-matrix` at `8a9db5e5e633987d3fc471a9c30458342abff627`, matching
`origin/codex/native-build-matrix`; verify live state again. Earlier commits are
published to GitHub only and are not merged to master.

## Exact next task

State: IN_PROGRESS. Obtain externally authored Natally marketing and purchase
HTML designs through MCP using the existing
`STANDARDIZED-NATALLY-ASSETS/atelier/DESIGN.md`, full PRD and architecture.
Open Design run `d6fb45ea-6e35-4c95-9f29-afe09721ea53` is commissioned; poll its
existing run before deciding its outcome. Record every returned artifact URL,
UUID or durable reference, export path and the final artifact used in the
architecture and changelog. No artifact is selected or accepted yet.

The operator additionally assigned a reasoning-enabled readiness worker to
identify exactly what local WSL OpenUI requires for the actual design work.
Use that report to prepare the OpenUI handoff. Do not replace external design
with coordinator-authored HTML. Mechanical implementation belongs to GLM-4.7
through Crush with reasoning disabled, after a fully self-contained task defines
all inputs, edits, contracts and outputs. The previous abbreviated checkout task
is superseded as a coder assignment; its underlying checkout requirements remain.

## Authority and safety boundaries

- KStore is the sole authority for the Admin-Manual. No injected reminders were
  visible on the last check. The latest manual reads and provenance are described
  in `DOCS/ARCHITECTURE.md`; distinguish those manual reads from injected reminders.
- RevenueCat is the sole commercial authority for customer, purchases,
  entitlements and shared `ROCHE`. Firebase owns identity. Use Firebase UID as the
  RevenueCat customer ID. Never create a parallel entitlement ledger.
- Keep provider administrative keys server-side. Do not use mock payment or claim
  a successful payment from source code, a catalog response, a build, screenshot,
  receipt hint or test fixture.
- Preserve the approved original Figma source/artwork at
  `LIBS/UI/FIGMA/reading-paywall-20261024/original/`; `FigmaPaywall.tsx` is mounted.
  Product selection is represented by `src/services/purchaseIntent.ts` and guide
  call sites. This is partial source work, not checkout or acceptance.
- Purchases JS 1.73.1 was installed at last observation. Verify the lockfile and
  package state rather than installing again. The local development Firebase
  sign-in failure was `auth/unauthorized-domain`; no domain was changed.
- The version `v0.9.84736` is consumed. Never decrement or reuse it for changed
  build source. Build only through the prescribed `scripts/build-all-platforms.ps1`
  entry point. Original AppImages and interrupted artifacts are retained intact at
  `F:\DevProjects-2026\forgejo\outbox\natally-ai-studio`.

## State and evidence rules

Use exactly four states: `NOT_STARTED`, `IN_PROGRESS`, `BLOCKED`, `COMPLETE`.
Existing source work is `IN_PROGRESS`, never `NOT_STARTED`. `BLOCKED` means a
concrete external dependency prevents progress; document the dependency and useful
independent work. Do not call the overall goal blocked merely because work is
large or incomplete. A whole behavioral task can become `COMPLETE` only when the
specified continuous screencast supplies positive observations and its recording
ID, exact start/end timecodes and verdict are beside the requirement in PRD,
`DOCS/ARCHITECTURE.md` and `DOCS/TEST_RUBRIC.md`. Preserve distinct claims for
source, build, browser/runtime, physical device/listening, deployment, payment
acceptance, GitHub publication and remote readback. Do not mark whole-product
acceptance until every active PRD/architecture clause and referenced specification
has been reconciled and observed as required.

## Safe continuation checks

Run read-only state checks before resuming work:

```powershell
git status --short
git branch --show-current
git log -1 --format="%H %s"
git ls-remote origin refs/heads/codex/native-build-matrix
```

Check all relevant source paths and generated artifacts before starting a build or
service. Do not restart old sessions based on stale notes. For code changes, use
CodeGraph to inspect the complete call paths and update the architecture/checklist
before implementation. Apply the current KStore demonstration rules. The operator has authorized
completion, prescribed builds, deployment, commit and GitHub publication.

## GitHub publication and audit

All session changes must be published to GitHub with version-prefixed commit
subjects. Do not publish through another remote, rewrite published history, or
claim a merge without checking the actual branch state. The user requires per-line accounting for
every session change, with descriptive hashes in `DOCS/CHANGELOG.md` and commit
history. The current `DOCS/SESSION-CHANGES-2026-10-27.jsonl` snapshot covers the
session through `8a9db5e5e633987d3fc471a9c30458342abff627` (20 commits, 2,434 text
lines added, 109 removed, plus 3 binary records; 2,543 text change records plus
3 binary records = 2,546 records). Its SHA-256 is
`3b701033ac67060fe8a5ba10ac0271c14bb5da18aaeefa60421d292cbdfe934f`. Any new
commits/changed lines require regenerating and reconciling the per-line ledger and
updating the changelog hash. Publish reviewed audit artifacts with the corresponding documentation unit. Never claim publication
until `git ls-remote` confirms the exact pushed commit.

An hourly `resume-natally-completion` heartbeat automation was created at the
user's request and was active at last observation. It cannot guarantee waking a
powered-off host or app. Verify its state if available; do not promise automatic
startup.

Crush readiness check completed: explicit zai/glm-4.7 with thinking disabled in
request configuration returned READY (exit 0). No source task was run. See the
architecture entry for the evidence boundary. The offer distinction is resolved by PAYWALL-3 above; do not reopen that question.

Heartbeat readback: local and GitHub branch codex/native-build-matrix matched
25f5a600a717e0b46dcf5cdfe6147a103c494758 before this clarification update.
The offer distinction is resolved; do not ask it again or retain the old
awaiting-distinction condition. Current next work is the three-screen CTA repair
with the offer motivations above. OpenUI runtime setup was completed earlier;
revalidate its handle before using it. Do not restart a live job from old notes.


## Resume checkpoint — 27 October 2026, workflow authorization pending

Local and GitHub branch codex/native-build-matrix matched
`e94f8d22e8450035595b362652cadccee865fb1c` before this checkpoint commit.
Current next task: repair the settled three-screen RevenueCat paywall. Flow access
is BLOCKED by the active login missing project_configuration:workflows:read;
provider request ID 803efb13-390a-47fb-baf6-ee8bd649c507. OAuth renewal was started
with `npx.cmd --yes @revenuecat/cli auth login --oauth`; exec session 15612 ended with exit 1: timed out waiting for browser authorization
(5 min). This is a confirmed terminal result, not an observation timeout. Do not
poll that ended handle or automatically open another login on each heartbeat. Do not save OAuth tokens or callback URLs here.
The operator was asked to complete authorization. After successful renewal,
retry flows list once and use the actual returned flow before editing.

Open Design health returned version 0.24.1, PID 32964 alive. No restart or new
generation was performed. OpenUI generation remains gated on the CTA repair.
The existing RevenueCat revision 18 remains an unaccepted standalone draft;
no flow publication, purchase, prepaid inference, deployment or screencast was
observed this turn. Keep every acceptance timecode NOT RECORDED.

Session accounting now covers 31 commits through e94f8d2: 5,091 added lines,
153 removed lines and 8 binary records, excluding recursive ledger publication.
See SESSION-CHANGES-2026-10-27-summary.json for the exact boundary and SHA-256.
This checkpoint commit is accounted by its Git diff and the next snapshot.


### 2026-10-27 14:10 UTC heartbeat — authorization still required

Verified local and GitHub branch at c0bca90832114b5039ab45c2e5553f83067eb8c6.
Session 15612 returned its terminal authorization-timeout result. One fresh flow
read still returned missing project_configuration:workflows:read, request
fedbf04f-4e9d-4732-b026-1af10f627023. No login was restarted. When the operator
is available, complete `npx.cmd --yes @revenuecat/cli auth login --oauth`, then
retry the flow read and continue PAYWALL-3. No new design or implementation was
commissioned across the explicitly required CTA prerequisite. No payment,
deployment or screencast completion. KStore manual revision 3 was retrieved
again and unchanged. This checkpoint's exact lines are accounted by its Git diff.


### 2026-10-27 21:18 UTC heartbeat — unchanged external dependency

Local and GitHub matched 29c2ad9f6f9054251f8cf5b48da20a2f7cf1e4c9.
Flow access still lacks project_configuration:workflows:read; request ID
33efe287-9e38-430d-9d07-6cf0d4e25cc8. Session 15612 is already terminal;
no replacement login was launched. KStore manual remains revision 3 with the
same recorded hash. Await operator-completed RevenueCat authorization before
retrying dependent workflow edits. All product acceptance states are unchanged.
This heartbeat made no source, design, build or deployment changes.


### 2026-10-27 22:16 UTC heartbeat — concurrent implementation detected

Local and GitHub matched 9410a2eef5a4bfd8e89d16829f38e1a50b560b12.
The active local thread "Add paywall terms and privacy" shares this checkout.
New source modifications and untracked implementation/status files are present;
do not overwrite, stage or commit that other thread's unfinished work. Its current
PAYWALL-INTEGRATION-STATUS.md records app-owned Figma three-screen presentation
with RevenueCat SDK checkout; the older authorization-only checkpoint is no longer
a complete account of project progress. Read that status and the latest authorized
specification before selecting work. Do not infer acceptance from these files.
CLI flow access still fails (request bbe17b00-15dd-4832-8cba-03e6b6ff1cf7), but
this heartbeat did not restart login or duplicate the active implementation.
Session 15612 remains terminal. No purchased-inference recording was verified.


### 2026-10-27 23:22 UTC heartbeat — active implementation continues

Local and GitHub matched b0607407ff5ee42644be26eabf354712606c914c.
"Add paywall terms and privacy" remains active in this same checkout; preserve
its modified handler and untracked fulfillment/souvenir files. Session 4281
completed successfully (exit 0), confirming checkpoint commit 5770d48.
The remote-read session 75557 also completed; neither needs restarting.
Current fulfillment notes describe pending provisioning, and souvenir notes list
unobserved purchase, persistence, device and narration acceptance. These are
implementation progress, not proof of completed deployed behavior. Defer overlapping
work while that task is active; resume from its latest status after it finishes.
KStore manual revision 3 is unchanged. No new purchase or screencast was verified.


### 2026-10-28 00:23 UTC heartbeat — implementation task interrupted

Local and GitHub matched 84938c5c4883203e8c31b732b556b88d5a6b1e67.
The shared-checkout task "Add paywall terms and privacy" is now notLoaded;
its latest turn is interrupted, not verified complete. Its preceding turn asks
which established execution location may run account-key and purchase operations,
because its older Netlify-adapter specification conflicts with a later instruction
against Netlify expansion. Do not infer an answer or deploy its unfinished drafts.
It reported Android recovery still packaging, but this heartbeat did not obtain a
current process handle or establish completion; do not launch a duplicate build.
Uncommitted fulfillment and souvenir files remain preserved. No payment, deployed
fulfillment or screencast acceptance was verified. The next continuation must
resolve the pending execution-location decision and recover the existing build
handle before operating on those parts. KStore manual revision 3 is unchanged.

03:26 UTC recheck: local and GitHub matched a025a10e9ac8ecb6426da35ca8dd7fa3fb808e00.
The implementation task remains notLoaded and its source drafts remain present.
The pending execution-location decision and unverified build/acceptance state above
are unchanged. No existing job was restarted and no deployment was attempted.


### 2026-10-28 04:25 UTC — redundant hourly polling ended

Local and GitHub matched 060a7733d2f8f48bd8d049bdc43e96a9a612bc7e.
The implementation thread remains notLoaded; source drafts and pending execution-
location decision are unchanged. Deleted automation resume-natally-completion
through the app after repeated unchanged checks produced only documentation commits.
Deletion was confirmed. The project is unfinished; this is not goal completion or
permission to deploy the pending drafts. On the next user continuation, resolve the
existing execution-location question, recover build handles, and resume the latest
implementation/checklist with all purchase and screencast acceptance intact.
Do not assume the former hourly automation will wake this thread.
