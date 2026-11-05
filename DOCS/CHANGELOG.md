# Session changelog — 27 October 2026

GitHub publication only. This is a line-accounted history of this session, including
reverted and superseded changes; presence here is not deployment or acceptance.
New commit subjects use the applicable canonical `vMAJOR.MINOR.BUILD` prefix.
Earlier nonconforming subjects are retained verbatim below; shared history was not rewritten.

Baseline before session changes: `7b20e31f00547b5a0bcdfa6f444fe3fe0496182f`.
Coverage through source/document commit: `e94f8d22e8450035595b362652cadccee865fb1c`.
Commits covered: 31. Line/binary records: 5252 (5091 added, 153 removed, 8 binary).
Each text record contains commit, canonical version at that commit, file, change,
old/new line number and exact changed text. Each binary record contains old/new
Git blob identity. Added and removed counts were reconciled against Git for every file.

[Per-line ledger](SESSION-CHANGES-2026-10-27.jsonl)
Ledger SHA-256: `d71c23b77c5218786bb1e2aa17871e82206b6ed487f3d5c64260aedef29b4388`.

The ledger is a snapshot through the commit above. This audit publication is
identified by its own Git commit; its generated ledger does not recursively
include itself. Subsequent source changes require refreshed coverage.

## v0.9.84736 — 8a9db5e5e633

[v0.9.84736: Add RevenueCat Web SDK for the checkout contract in 5e88ac7](https://github.com/rebots-online/natally-ai-studio/commit/8a9db5e5e633987d3fc471a9c30458342abff627)

Full commit: `8a9db5e5e633987d3fc471a9c30458342abff627`. Text changes: +31 / -1.

| File | Added lines | Removed lines |
| --- | ---: | ---: |
| `DOCS/CARD-CHECKOUT-INTEGRATION.md` | 22 | 0 |
| `package-lock.json` | 7 | 0 |
| `package.json` | 2 | 1 |

## v0.9.84736 — 5e88ac763a08

[Define provider-verified card checkout and durable receipt recovery](https://github.com/rebots-online/natally-ai-studio/commit/5e88ac763a08bbce21f560d7417783935de278ea)

Full commit: `5e88ac763a08bbce21f560d7417783935de278ea`. Text changes: +42 / -0.

| File | Added lines | Removed lines |
| --- | ---: | ---: |
| `CHECKLIST.md` | 6 | 0 |
| `DOCS/ARCHITECTURE.md` | 36 | 0 |

## v0.9.84736 — 357aff00b758

[Carry product-specific USP purchase intents into the original paywall](https://github.com/rebots-online/natally-ai-studio/commit/357aff00b758878a29f889d98f9cda00b4c778f2)

Full commit: `357aff00b758878a29f889d98f9cda00b4c778f2`. Text changes: +52 / -6.

| File | Added lines | Removed lines |
| --- | ---: | ---: |
| `src/components/FigmaPaywall.tsx` | 6 | 0 |
| `src/components/LearnAndPayments.tsx` | 5 | 0 |
| `src/components/PurchaseAccess.css` | 4 | 0 |
| `src/components/PurchaseAccess.tsx` | 21 | 5 |
| `src/services/downloadAccess.ts` | 2 | 1 |
| `src/services/purchaseIntent.ts` | 14 | 0 |

## v0.9.84736 — 6a3a85a47d29

[Specify selected-product presentation and separate upfront intent from download ownership](https://github.com/rebots-online/natally-ai-studio/commit/6a3a85a47d29a89c4febbb0547d25317c6d5f1cf)

Full commit: `6a3a85a47d29a89c4febbb0547d25317c6d5f1cf`. Text changes: +10 / -0.

| File | Added lines | Removed lines |
| --- | ---: | ---: |
| `DOCS/ARCHITECTURE.md` | 10 | 0 |

## v0.9.84736 — 8292ffa9d71e

[Restore required USP purchase CTAs to architecture and acceptance contract](https://github.com/rebots-online/natally-ai-studio/commit/8292ffa9d71eeb83eed7a5c9cd57bf4a1bed2256)

Full commit: `8292ffa9d71eeb83eed7a5c9cd57bf4a1bed2256`. Text changes: +114 / -0.

| File | Added lines | Removed lines |
| --- | ---: | ---: |
| `CHECKLIST.md` | 12 | 0 |
| `DOCS/ARCHITECTURE.md` | 34 | 0 |
| `DOCS/PRD.md` | 34 | 0 |
| `DOCS/TEST_RUBRIC.md` | 34 | 0 |

## v0.9.84736 — 39997c382368

[Record actual local sign-in limit without claiming paywall acceptance](https://github.com/rebots-online/natally-ai-studio/commit/39997c38236893f610a32104d38a973a6f4174d9)

Full commit: `39997c38236893f610a32104d38a973a6f4174d9`. Text changes: +13 / -0.

| File | Added lines | Removed lines |
| --- | ---: | ---: |
| `DOCS/DEMONSTRATIONS/2026-10-27-prepaid-purchase-screencast.md` | 13 | 0 |

## v0.9.84736 — 74193ee5a605

[Mount original Figma paywall with account-bound quote adapter](https://github.com/rebots-online/natally-ai-studio/commit/74193ee5a6059ece6f062ce94ceb55ebd5b81c19)

Full commit: `74193ee5a6059ece6f062ce94ceb55ebd5b81c19`. Text changes: +165 / -24.

| File | Added lines | Removed lines |
| --- | ---: | ---: |
| `CHECKLIST.md` | 6 | 0 |
| `DOCS/ARCHITECTURE.md` | 11 | 0 |
| `public/paywall/natally-original.webp` | - | - |
| `src/components/FigmaPaywall.tsx` | 133 | 0 |
| `src/components/PurchaseAccess.css` | 6 | 0 |
| `src/components/PurchaseAccess.tsx` | 8 | 23 |
| `tsconfig.json` | 1 | 1 |

## v0.9.84736 — 83bb5eb7a798

[Specify original paywall iframe lifecycle and verified quote bindings](https://github.com/rebots-online/natally-ai-studio/commit/83bb5eb7a798c3f17999c129097e4c62a79bba82)

Full commit: `83bb5eb7a798c3f17999c129097e4c62a79bba82`. Text changes: +45 / -3.

| File | Added lines | Removed lines |
| --- | ---: | ---: |
| `CHECKLIST.md` | 4 | 1 |
| `DOCS/ARCHITECTURE.md` | 41 | 2 |

## v0.9.84736 — 6a3dfac29667

[Bind recovered paywall source to account-scoped quote and checkout adapter](https://github.com/rebots-online/natally-ai-studio/commit/6a3dfac296674b546b65ec223446e4df29066648)

Full commit: `6a3dfac296674b546b65ec223446e4df29066648`. Text changes: +8 / -0.

| File | Added lines | Removed lines |
| --- | ---: | ---: |
| `LIBS/UI/FIGMA/reading-paywall-20261024/README.md` | 7 | 0 |
| `LIBS/UI/FIGMA/reading-paywall-20261024/original/.gitattributes` | 1 | 0 |

## v0.9.84736 — 51d56313b0e1

[Recover and preserve original Figma paywall export and host contract](https://github.com/rebots-online/natally-ai-studio/commit/51d56313b0e19611bb60e8c7e3e90cc39063653b)

Full commit: `51d56313b0e19611bb60e8c7e3e90cc39063653b`. Text changes: +1057 / -1.

| File | Added lines | Removed lines |
| --- | ---: | ---: |
| `LIBS/UI/FIGMA/reading-paywall-20261024/README.md` | 22 | 1 |
| `LIBS/UI/FIGMA/reading-paywall-20261024/SOURCE-MANIFEST.json` | 18 | 0 |
| `LIBS/UI/FIGMA/reading-paywall-20261024/original/index.html` | 16 | 0 |
| `LIBS/UI/FIGMA/reading-paywall-20261024/original/package.json` | 27 | 0 |
| `LIBS/UI/FIGMA/reading-paywall-20261024/original/public/favicon.svg` | 4 | 0 |
| `LIBS/UI/FIGMA/reading-paywall-20261024/original/public/paywall.html` | 465 | 0 |
| `LIBS/UI/FIGMA/reading-paywall-20261024/original/src/App.tsx` | 9 | 0 |
| `LIBS/UI/FIGMA/reading-paywall-20261024/original/src/index.css` | 11 | 0 |
| `LIBS/UI/FIGMA/reading-paywall-20261024/original/src/main.tsx` | 10 | 0 |
| `LIBS/UI/FIGMA/reading-paywall-20261024/original/src/vite-env.d.ts` | 1 | 0 |
| `LIBS/UI/FIGMA/reading-paywall-20261024/original/tsconfig.json` | 23 | 0 |
| `LIBS/UI/FIGMA/reading-paywall-20261024/original/vite.config.ts` | 451 | 0 |

## v0.9.84736 — 20a63719d1cf

[Map individual product baseline requirements to continuous recording evidence](https://github.com/rebots-online/natally-ai-studio/commit/20a63719d1cf3c7194f8c315b4330323a1c8993f)

Full commit: `20a63719d1cf3c7194f8c315b4330323a1c8993f`. Text changes: +174 / -0.

| File | Added lines | Removed lines |
| --- | ---: | ---: |
| `CHECKLIST.md` | 15 | 0 |
| `DOCS/ARCHITECTURE.md` | 45 | 0 |
| `DOCS/DEMONSTRATIONS/2026-10-27-prepaid-purchase-screencast.md` | 24 | 0 |
| `DOCS/PRD.md` | 45 | 0 |
| `DOCS/TEST_RUBRIC.md` | 45 | 0 |

## v0.9.84736 — ddd6ececf960

[Implement architected canonical stamp display across app and dialogs](https://github.com/rebots-online/natally-ai-studio/commit/ddd6ececf9607487411eb464d8a0d69f56f32155)

Full commit: `ddd6ececf9607487411eb464d8a0d69f56f32155`. Text changes: +86 / -12.

| File | Added lines | Removed lines |
| --- | ---: | ---: |
| `src/components/AboutDialog.tsx` | 4 | 5 |
| `src/components/BuildStamp.css` | 19 | 0 |
| `src/components/BuildStamp.tsx` | 34 | 0 |
| `src/main.tsx` | 2 | 1 |
| `src/services/buildIdentity.ts` | 14 | 0 |
| `vite.config.ts` | 13 | 6 |

## v0.9.84736 — 9465eabec968

[Specify single canonical build display and dialog visibility bindings](https://github.com/rebots-online/natally-ai-studio/commit/9465eabec9681ce583a46b67581dd73e0479cc3f)

Full commit: `9465eabec9681ce583a46b67581dd73e0479cc3f`. Text changes: +28 / -1.

| File | Added lines | Removed lines |
| --- | ---: | ---: |
| `CHECKLIST.md` | 5 | 0 |
| `DOCS/ARCHITECTURE.md` | 23 | 1 |

## v0.9.84736 — 56b6144c3603

[Record full-spec screencast goal and preserve settled decisions](https://github.com/rebots-online/natally-ai-studio/commit/56b6144c36030c2ba358280989782c8687078ee0)

Full commit: `56b6144c36030c2ba358280989782c8687078ee0`. Text changes: +87 / -33.

| File | Added lines | Removed lines |
| --- | ---: | ---: |
| `CHECKLIST.md` | 14 | 5 |
| `DOCS/ARCHITECTURE.md` | 47 | 28 |
| `DOCS/PRD.md` | 21 | 0 |
| `DOCS/TEST_RUBRIC.md` | 5 | 0 |

## v0.9.84736 — 84ee6dee563c

[Architect corrective version and prepaid-purchase journey before implementation](https://github.com/rebots-online/natally-ai-studio/commit/84ee6dee563c054362c420e66b9c00d5f067a5c1)

Full commit: `84ee6dee563c054362c420e66b9c00d5f067a5c1`. Text changes: +495 / -1.

| File | Added lines | Removed lines |
| --- | ---: | ---: |
| `CHECKLIST.md` | 145 | 0 |
| `DOCS/ARCHITECTURE.md` | 219 | 0 |
| `DOCS/BILLING-SPEC.md` | 15 | 0 |
| `DOCS/DEMONSTRATIONS/2026-10-27-prepaid-purchase-screencast.md` | 78 | 0 |
| `DOCS/TEST_RUBRIC.md` | 34 | 0 |
| `README.md` | 4 | 1 |

## v0.9.84736 — 5dd5922fd360

[Revert version-display implementation pending architecture-first correction](https://github.com/rebots-online/natally-ai-studio/commit/5dd5922fd360946237279adec7422ec8f85cb9a6)

Full commit: `5dd5922fd360946237279adec7422ec8f85cb9a6`. Text changes: +4 / -5.

| File | Added lines | Removed lines |
| --- | ---: | ---: |
| `vite.config.ts` | 4 | 5 |

## v0.9.84736 — 515c1026514a

[Record coordinator stamp v0.9.84736 and ordinary artifact retention](https://github.com/rebots-online/natally-ai-studio/commit/515c1026514a7e2df0a03c0d99ac951c25a5af12)

Full commit: `515c1026514a7e2df0a03c0d99ac951c25a5af12`. Text changes: +17 / -17.

| File | Added lines | Removed lines |
| --- | ---: | ---: |
| `README.md` | 1 | 1 |
| `package-lock.json` | 2 | 2 |
| `package.json` | 1 | 1 |
| `src-tauri/Cargo.lock` | 1 | 1 |
| `src-tauri/Cargo.toml` | 1 | 1 |
| `src-tauri/tauri.conf.json` | 4 | 4 |
| `version.json` | 6 | 6 |
| `version.txt` | 1 | 1 |

## v0.8.83688 — 68c4c5455584

[Move original AppImage artifacts to operator-requested external outbox](https://github.com/rebots-online/natally-ai-studio/commit/68c4c5455584f512a5ebab429ad5392a2a5502a3)

Full commit: `68c4c5455584f512a5ebab429ad5392a2a5502a3`. Text changes: +0 / -0.

| File | Added lines | Removed lines |
| --- | ---: | ---: |
| `dist/natally-ai-studio-v0.7.83657-linux-amd64.AppImage` | - | - |
| `dist/natally-ai-studio-v0.8.83688-linux-amd64.AppImage` | - | - |

## v0.8.83688 — 214e96596f30

[Store complete AppImage bytes directly in Git](https://github.com/rebots-online/natally-ai-studio/commit/214e96596f30822f9d8b70f236fd013a862abfa7)

Full commit: `214e96596f30822f9d8b70f236fd013a862abfa7`. Text changes: +1 / -1.

| File | Added lines | Removed lines |
| --- | ---: | ---: |
| `.gitattributes` | 1 | 1 |

## v0.8.83688 — 15974e307345

[fix: render canonical build stamp at bottom right](https://github.com/rebots-online/natally-ai-studio/commit/15974e307345d55d3440ae838096a27c1b7179a1)

Full commit: `15974e307345d55d3440ae838096a27c1b7179a1`. Text changes: +5 / -4.

| File | Added lines | Removed lines |
| --- | ---: | ---: |
| `vite.config.ts` | 5 | 4 |

## Restart documentation — 27 October 2026

Added `DOCS/RESUME.md` as the self-contained continuation guide and a minimal
`AGENTS.md` pointer that preserves KStore as sole Admin-Manual authority. The
current-state checklist now leads with the four allowed states and the remaining
work basis. These additions are not yet committed or included in the existing
per-line ledger. Rebuild the ledger after the final session commit set and update
its SHA-256 here before publication.

## External design assignment and provenance — 27 October 2026

Design decisions are assigned to the operator-specified external design tools,
through MCP. The shared source is
`STANDARDIZED-NATALLY-ASSETS/atelier/DESIGN.md`; its existing reading-room scope
is retained while the external designer addresses the requested marketing and
purchase surfaces against the full PRD and architecture. Export and use HTML;
record every produced artifact URL/UUID, local export and final-used designation.

Open Design project: `natally-ai-studio`. MCP start_run accepted request
`862d97cb-268d-4f5c-87b7-524e06e8506c`, run
`d6fb45ea-6e35-4c95-9f29-afe09721ea53`, conversation
`cc598f90-41ed-40b3-b171-c796987012af`. Exact brief and response are in
`DOCS/EXTERNAL-DESIGN-RUN.json`. DESIGN.md, PRD.md and ARCHITECTURE.md were supplied
through MCP into `natally-completion-20261027/` in that project. Artifact URL/UUID:
not yet returned. Final used artifact: none. These identifiers establish a
commissioned run, not a completed design or accepted application.

The operator additionally requested a reasoning-enabled worker to determine
OpenUI readiness for the actual design handoff. `/root/openui_readiness` uses
GPT-6-Luna with high reasoning for that bounded investigation. It is not the
mechanical coder. Mechanical coding remains assigned to GLM-4.7 through Crush
with reasoning disabled; the route has not yet been verified or invoked.

KStore Admin-Manual report published and exact readback verified:
`SPEC_CONVENTIONS/exposure-reporting-no-unsolicited-hardening.md`, revision 1,
UUID `01a17d1b-e022-8001-aee3-69785c59a0f4`, SHA-256
`6ffe205b5802e6d23fb4fc2daa7e4773c180ba37375046d0684b5c3268f1564d`.
No credential values are included in the report or this documentation.

## v0.9.84736 — ab2f358da2e0097ef2a840374b5c99f891ea474b

[Record external design handoff and audit changes through 8a9db5e](https://github.com/rebots-online/natally-ai-studio/commit/ab2f358da2e0097ef2a840374b5c99f891ea474b)
was pushed and GitHub branch readback matched the full hash. This commit publishes
all eight documentation/instruction files in that unit (3,118 additions and five
removals), including the per-line historical ledger. Git's commit diff is the
exact per-line accounting for the ledger's own publication, avoiding recursive
inclusion of the ledger in itself. No application build or acceptance is claimed.

OpenUI readiness is documented in `DOCS/OPENUI-READINESS.md`. The worker found no
installed MCP/export interface and no running OpenUI app. No OpenUI artifact
URL/UUID exists for this investigation, and no OpenUI artifact has been selected.

## CTA prerequisite correction

The operator made the RevenueCat paywall CTA repair a prerequisite to further
OpenUI design work. CHECKLIST, RESUME, ARCHITECTURE and OPENUI-READINESS now record
that dependency and its IN_PROGRESS state. Corrected the runtime finding in
[e24903f0827242d44bf2e06eca7205a0396d4552](https://github.com/rebots-online/natally-ai-studio/commit/e24903f0827242d44bf2e06eca7205a0396d4552):
Node 24 is installed in WSL; the first shell lacked its PATH. Dependencies and
MCP/export integration remain unfinished. This correction does not claim the
CTA repair or design is complete.

## Screen-specific purchase CTA acceptance correction

The operator rejected the small shared pill and the generic selected-product
replacement. Every relevant screen requires a large, prominent, unmistakable
purchase button with consistent padding, fully visible in the initial phone
viewport and unobscured by sticky content. Its action opens the offer matching
that screen's unique selling proposition directly, with selection retained. A
link to another page containing CTAs does not satisfy this requirement. A shared
reading action on a conversation-benefit screen is noncompliant.

First-encounter customer copy must explain the benefit in plain language, without
introducing unexplained ROCHE terminology. The conversation purchase action uses
plain-language conversation wording. Internal product identifiers and commercial
authority remain unchanged. No final visual acceptance or purchase is recorded.

RevenueCat paywall `pw5593c7341acd4ef5` is being corrected in editor session
`d31d7c52-be52-47e8-a15c-c434a6ffd0d6`. Builder:
https://app.revenuecat.com/projects/aba0bd94/paywalls/pw5593c7341acd4ef5/builder
Changes remain draft. The editor reports an explicit `natally_roche_test` package
binding for the conversation-specific button; readback and full journey remain
required. Its standalone scope does not establish the other workflow screens.
The workflow-list request lacked `project_configuration:workflows:read` scope;
request ID `8e87504c-2ba5-419e-b868-c362c8915812`. Do not claim whole-flow repair.

## External export provenance and further CTA rejection

Open Design run UUID `d6fb45ea-6e35-4c95-9f29-afe09721ea53` completed.
MCP exports are preserved in `LIBS/UI/OPEN-DESIGN/natally-completion-20261027/`.
Artifact IDs and source URLs:
- `natally-marketing-landing`: http://127.0.0.1:7456/api/projects/natally-ai-studio/raw/natally-completion-20261027/marketing-landing.html
- `natally-purchase-states`: http://127.0.0.1:7456/api/projects/natally-ai-studio/raw/natally-completion-20261027/purchase-states.html
- `natally-design-integration`: http://127.0.0.1:7456/api/projects/natally-ai-studio/raw/natally-completion-20261027/DESIGN-DECISIONS-AND-INTEGRATION.md
These IDs are designer-assigned, not UUIDs. URLs require the local daemon.
Final used artifact: none; exports are preserved, not accepted or integrated.
Both HTML files and all three original assets now match the external manifest
hashes byte-for-byte. The initial export write translated LF to CRLF; this
correction preserves original LF and adds an artifact-directory attribute.

Commit `75ef9933f7f293a270a945727ae5cf74ed74ca5d` published the exports and
RevenueCat draft revision 16 evidence. The attempted hash check stopped before
its provenance paragraph was written; this entry supplies that missing record.
GitHub branch readback confirmed the commit. Its exact changes are in its diff.

The operator rejected the draft's multiple priced cards, unclear categories,
duplicate purchase controls and unexplained atelier/turn terminology. The
conversation screen must present one understandable conversation offer, one
price and one prominent purchase button. Explain the actual ten conversational
turns in customer language. Remove unrelated reading choices from this screen
without deleting catalog products or altering prices. External editor session
`d31d7c52-be52-47e8-a15c-c434a6ffd0d6` is applying this correction. The saved
revision 16 evidence is rejected intermediate output, not an acceptance artifact.
CTA prerequisite remains IN_PROGRESS; nothing has been published to customers.

## Latest operator correction: three-screen bifurcated paywall

State: IN_PROGRESS. The operator specified three paywall screens because the two
offers are opposite. Do not reduce the entire flow to one offer. Each dedicated
offer card must put the offer first in large, heavy type, list its inclusions in
point form, and present the prominent purchase CTA matching that screen's USP.
Do not restore multiple ambiguous priced cards or sell generic chatbot-message
quotas as the principal value. Do not introduce unexplained internal terminology.

The exact distinction between the two opposing offers is awaiting the existing
clarification question. The coordinator's proposed first-screen branching layout
is an interpretation awaiting that distinction, not a settled user specification.
Do not assume reading versus conversation, change product bindings, or commission
another dependent design revision while that information is missing. Current
RevenueCat draft revision 18 is an intermediate artifact, not approved design.
No publication or successful checkout is claimed. The full product goal remains.

Previous publication: `e5cbe90c6fe66e1e2c30199f531eb43e77305113` preserved
external artifact bytes and documented the rejected draft; GitHub readback
matched that hash. The current correction supersedes the whole-flow single-offer
interpretation without changing catalog terms.

## Operator-selected offer-page structure

Reference: https://productdyno.com/proplus-jvz/ (JVZoo one-time upgrade page).
The operator explicitly identified its focused structure: one theme, one clearly
defined offer, one obvious purchase button, and a clear explanation of what the
customer receives. Apply that structure independently to each Natally offer
screen. The offer card starts with the offer in large, bold type, followed by
plain-language point-form inclusions and its price. The purchase button opens
that matching offer directly; a secondary decline action continues the flow.
Do not copy the reference's product claims, pricing or urgency into Natally.
This clarifies presentation; it does not identify the two opposing offers or
approve the current RevenueCat draft. The existing distinction question remains.

## Crush route readiness

Crush v0.90.0 completed a bounded invocation with explicit `zai/glm-4.7` for
both model slots, using the existing Z.ai coding endpoint. Configuration sent
`extra_body.thinking.type=disabled`, with `think=false`; the task requested only
READY and disabled file/execution tools. Observed output: READY; exit status 0.
No source implementation or design was delegated in this check. This establishes
that the requested Crush route answered, not provider-internal reasoning
attestation. A provider-generated inference ID was not returned in this output.
The credential remains outside the repository and is referenced by environment
variable in the isolated local configuration.

Prior commit `d27021b7eaf22cfd303681b7042bb9ca46fd0d89` published the
three-screen correction and pending distinction; GitHub readback matched it.

## RevenueCat revision 18 preservation

Latest readback is saved under `DOCS/EVIDENCE/2026-10-27-cta-single-offer/`
with provider JSON, rendered preview and a hash manifest. Builder URL:
https://app.revenuecat.com/projects/aba0bd94/paywalls/pw5593c7341acd4ef5/builder
Editor session UUID: `d31d7c52-be52-47e8-a15c-c434a6ffd0d6`.
Final edit trace: `c1708940ab7d2f9cb9fa92317b240ff9`.
Readback finds one purchase button, `e369ce6e27`, with `in_app_checkout` action,
inside the `natally_roche_test` package. Its displayed offer is not accepted:
Get my chart reading may imply the separate reading entitlement. Resolve against
the operator's two opposing offers before further dependent changes. This is an
unpublished intermediate draft, not the final used artifact or three-screen flow.
The preview cannot establish checkout, purchase, grant or inference success.

Prior commit `4d7dcf63dc9ee910f68d2115c29a44bbcdbc0b2b` published the selected
JVZoo offer-page structure and bounded Crush readiness evidence. GitHub readback
matched it. No application source or deployment completion follows from that.

## Resolved offer distinction and sequence

The operator defined screen 1 as the $30 full workup and souvenirs, screen 2 as
experience-focused micropayment/prepaid access, and screen 3 as side-by-side
comparison of both cards. Updated PRD, architecture, rubric, checklist and resume
instructions; exact external-designer brief is PAYWALL-THREE-SCREEN-BRIEF.md.
This resolves the missing distinction. No purchased or deployed outcome is claimed.
Previous evidence preservation commit: `2efb4396ded7cff936382fada128a6f1a47a17c1`,
verified on GitHub. Existing standalone draft is superseded as a whole-flow design.

## Offer motivation clarification

Updated the three-screen brief, PRD, architecture, rubric, checklist and resume
record with the operator's artifact-versus-guided-experience framing. The first
appeals through the mahogany-framed motorized rotating natal-chart award; the
second through exploration alongside a guru. No income/spend segmentation.
Preceding commit 25f5a600a717e0b46dcf5cdfe6147a103c494758 defined the sequence;
local and GitHub readback matched that hash. No design or purchase acceptance.

## v0.9.84736 — Resume and session accounting, 27 October 2026

Refreshed the line ledger through e94f8d22e8450035595b362652cadccee865fb1c
(offer motivation clarification), whose GitHub readback matched local HEAD.
The snapshot includes 31 commits, 5,244 changed text lines and 8 binary records.
New records were reconciled with Git numstat from the same zero-context diff.
The ledger excludes its own generated publication; Git commit diffs account for
those lines without recursively embedding prior ledger contents. The summary JSON
records the snapshot boundary and hash. This publication's own diff remains the
account for its changes until the next snapshot.

RevenueCat flow read failed with missing project_configuration:workflows:read,
request 803efb13-390a-47fb-baf6-ee8bd649c507. Started OAuth renewal; no flow edit
or publish occurred. The Natally Web Billing app still identifies the existing
Stripe account. Product and package metadata reads do not establish current
store prices. No design generation, build, purchase or acceptance was completed.


## v0.9.84736 — Confirm ended authorization process

Previous commit c0bca90832114b5039ab45c2e5553f83067eb8c6 published the session
ledger refresh and authorization checkpoint; local and GitHub readback matched.
Corrected CHECKLIST.md and RESUME.md: login session 15612 has ended, exit 1,
with a five-minute browser-authorization timeout. A fresh RevenueCat flow read
still requires project_configuration:workflows:read. No new login, design,
source build or deployment was started. The exact changed lines in this
checkpoint are its Git diff; ledger snapshot coverage remains through e94f8d2.


## v0.9.84736 — 15:09 UTC resume checkpoint

Previous commit 0a32b9342f68f81cac1c4df06a20db13c0f92634 recorded the ended
OAuth process; its local and GitHub hashes matched. Updated RESUME.md with the
fresh RevenueCat authorization rejection and unchanged next action. This commit's
Git diff accounts for every added documentation line; no application lines changed.

16:12 UTC: refreshed the existing RESUME checkpoint after GitHub readback of
6024edf25a97945251458122ffa5e0219f7df126. Flow authorization remains unavailable;
no new login or product changes. This commit diff accounts for the documentation lines.

17:08 UTC: GitHub matched acb3a020b7d03f03a5571062146f285abc22255d.
Updated the existing resume checkpoint with the unchanged authorization rejection.
No product changes; this commit diff accounts for all changed documentation lines.

18:07 UTC: GitHub matched 2e7d0172db0c43059bbeac605ed64885febfa70d.
Refreshed RESUME.md with the unchanged workflow permission rejection. No product
changes; this commit diff accounts for every changed documentation line.

19:17 UTC: GitHub matched 357e976fd5c4c5ebe17d39fdeb7d2272407c3f7b.
Refreshed the resume checkpoint; RevenueCat workflow permission remains missing.
No product changes; this commit diff accounts for every changed documentation line.

20:18 UTC: GitHub matched bed3494f1bb2a1cafd37c2ca258f6fbe8e4bad48.
Updated the existing resume checkpoint with the unchanged flow-access rejection.
No product changes; this commit diff accounts for every changed documentation line.

21:18 UTC: GitHub matched 29c2ad9f6f9054251f8cf5b48da20a2f7cf1e4c9.
Refreshed RESUME.md with unchanged workflow authorization failure. No product
changes; this commit diff accounts for all changed documentation lines.

22:16 UTC: verified GitHub 9410a2eef5a4bfd8e89d16829f38e1a50b560b12;
recorded concurrent implementation in the same checkout and superseded the stale
authorization-only resume view. This checkpoint changes documentation only; its
Git diff accounts for each line. Other working changes are preserved uncommitted.

23:22 UTC: verified GitHub b0607407ff5ee42644be26eabf354712606c914c;
recorded active shared-checkout implementation and completed process handles in
RESUME.md. This checkpoint only changes documentation; exact lines are in its
Git diff. Other source changes remain with the active implementation task.

00:23 UTC, 28 October: GitHub matched 84938c5c4883203e8c31b732b556b88d5a6b1e67.
Recorded the other implementation task interruption and its pending execution-location
question in RESUME.md. Preserved its source drafts. This documentation commit diff
accounts for every changed line; no product or acceptance changes were made.

01:26 UTC: verified 05e3d1949aa0351de90b963657e693a36d636807 on GitHub and
recorded unchanged interrupted-task state in RESUME.md. Documentation only; this
commit diff accounts for all added lines. Other source drafts remain untouched.

02:28 UTC: GitHub matched 25c77e43a0276165377412842765c4c743106ed0.
Refreshed the existing resume check; interrupted-task and pending-decision state
are unchanged. Documentation lines are accounted by this commit diff.

03:26 UTC: GitHub matched a025a10e9ac8ecb6426da35ca8dd7fa3fb808e00.
Updated the existing resume check; interruption and pending execution-location
decision remain unchanged. This commit diff accounts for documentation lines.

04:25 UTC: verified 060a7733d2f8f48bd8d049bdc43e96a9a612bc7e on GitHub.
Deleted the redundant hourly polling automation after repeated unchanged checks;
recorded its confirmed deletion and explicit continuation requirements in RESUME.md.
No product completion claimed. This commit diff accounts for documentation lines.
