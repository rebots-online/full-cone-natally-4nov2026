# Public repository readiness — 28 October 2026

Audit snapshot: `520daf69a303d3f44dc87abb6f67f5ed9ea23324` on `master`.
GitHub visibility observed: **PRIVATE**. This audit did not change visibility,
rewrite history, remove files, or publish unfinished implementation.

## Findings

| Area | Evidence | Result / required publication action |
|---|---|---|
| Credential scan | Gitleaks 8.30.1, `git --log-opts=--all`, 320 commits, approximately 180 MB scanned, 198 findings | Reviewed findings are public Firebase configuration or false positives; no administrative/provisioning credential identified by this scan |
| Google findings | 63 occurrences resolve to one key matching `firebase-applet-config.json` | Browser Firebase configuration; not an administrative key |
| Sourcegraph findings | 116 matches are build revision strings; 48 unique revisions resolve to Git commits and the remaining revision appears in `dist/voice/waiting/provenance.json` | Rule matches bare 40-character hex strings in bundles; no `sgp_` token found in these lines |
| Generic findings | 19 matches: storage-key names, SHA256 inventory values, minified Firebase code and prose | Not credentials |
| Personal demonstration | Real operator birth/profile input, session narration and chart evidence in the directory listed below | Preserve privately and remove/redact public copies, including reachable history if the existing repository is made public |
| Private original Stitch input | Original review PNG and raw export ZIP are ignored and absent from all-ref path history | Not in the Git publication; tracked review HTML uses fictional data |
| Tracked prototype ZIP | 35 members; review portion contains corrected HTML only; no matched private-key/OpenRouter/Stripe/GitHub credential patterns in text entries | No issue identified in that archive inspection |
| Working tree | Unfinished implementation files and `.codex-remote-attachments/` remain outside committed source | Do not stage wholesale; root is preserving existing drafts and integrating selected source separately |

## Personal demonstration scope

Directory: `DOCS/DEMONSTRATIONS/2026-10-25-atelier-first/`.

Confirmed personal text/event data at the audited HEAD:

- `README.md`: explicitly records the actual operator's name and full birth date,
  birth time and birthplace. Do not reproduce those values in this report.
- `welcome-and-natal-voice.json`: personal narration/session events.
- `opening-observations.json`: personal opening/session data.
- `full-natal-replay-events.json`: personal reading/replay events.

`chart-details.png` was visually inspected and contains the named personal chart
and its reading. All 17 PNGs in this directory belong to the same documented real
session; preserve the directory as one private evidence package before preparing
public replacements. The other images were not all individually inspected, so
this report does not assert that each separately contains identifying text.
`onboarding.png` was inspected and shows only the selected city and UI.
`completed-journey.json` contains bundle/model, word-count and recording metrics;
no personal identity was found there.

The directory was introduced in `ee514e8c4959f4841cd1873dce2a1ac430ce0a7e`
and updated in `e7f7e9963852b0bdb8585d1caac4a53e1972f261`.
At audit time it is reachable through `origin/master`, both `origin/checkpoint/*`
branches, and `origin/codex/inference-relay`, `origin/codex/live-payments`,
`origin/codex/native-build-matrix`, and `origin/codex/session-archive`, as well as
local recovery/worktree branches. A new deletion commit alone does not remove
these old objects from reachable public history.

Business identity, public support contacts, Git authorship and general
infrastructure documentation are not classified for automatic deletion.
Unlinked date-format examples in tests are not treated as customer records.

## Recovery-preserving completion

1. Preserve the affected personal evidence and unfinished drafts outside the
   public repository, with hashes and the original commit identifiers.
2. Prepare public evidence replacements or omit that private session package;
   retain a factual evidence index without the personal inputs/transcripts.
3. Before making this existing repository public, account for every reachable
   branch/tag containing the personal package. History rewriting has not been
   performed or authorized by this audit; do not quietly destroy the operator's
   checkpoint navigation.
4. Recheck the final intended public tree and refs after root's implementation
   publication finishes. The parent task is actively adding source commits, so
   the audited HEAD is not a promise about subsequent commits.

## Limits

The scan covers locally available Git history and text diffs. It is not an
exhaustive extraction of native binaries, screenshots or every compressed object.
Sample image and prototype-archive inspection is recorded above. The raw redacted
scan report remains local at `.tmp/public-readiness/history-report.json`.
No credential values or personal birth inputs are included in this report.

## Verified private backup — 28 October 2026

Copied, without moving or deleting originals, to:
`C:/Users/Admin/Documents/Natally-private-publication-backup/20261028-015537/`.

- Sources: the complete `DOCS/DEMONSTRATIONS/2026-10-25-atelier-first/` directory
  and untracked `.codex-remote-attachments/` directory.
- 31 files, 3,720,203 bytes. Every copied file was compared with its source by
  SHA256; all matched.
- The archive's `manifest.json` records relative paths, sizes, hashes and source
  commit `7ab3646714721cb42b33be12452e99ac28d640a2`.
- Manifest SHA256:
  `C6A9E43D6CF32584CCD29CA31ECEE6A314D82F4462265A8531EA2BF34B6FDAD8`.

## Minimal cleanup scope for operator review

This is preparation, not an executed history change.

**Current tree:** remove the real personal session package
`DOCS/DEMONSTRATIONS/2026-10-25-atelier-first/` from the intended public tree after
retaining the private backup above. Replace it with a short evidence index that
records the tested behavior/build provenance and private archive manifest hash,
without birth inputs, named chart imagery or personal narration. The metrics-only
`completed-journey.json` may be retained. Other product screenshots, Figma paywall
rasters and fictional Stitch prototype exports are outside this cleanup scope.
Add `.codex-remote-attachments/` to local/publication ignore rules; the copied
attachments were never tracked and require no history rewrite.

**History:** the narrow path to omit from public history is the same complete
personal-session directory. Merely deleting its current files is insufficient.
If the existing repository itself is made public, every branch/tag retaining that
path needs the same coordinated transformation. Before any such operation,
preserve the existing Git graph privately, produce an old-to-new commit mapping,
and update checkpoint references so the operator's navigability requirement is
not silently lost. Do not rewrite unrelated files, business identity, public
contact details, author metadata, product implementation or unrelated evidence.
An alternative requiring operator direction is keeping the original history
private and exposing a separate cleaned public source repository for tools.
Neither alternative has been executed by this audit.
