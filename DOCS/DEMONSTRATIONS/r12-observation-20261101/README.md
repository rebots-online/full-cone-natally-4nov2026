# R12 landing observation — 2026-11-01, natally-ubuntu.surge.sh, v1.41.92153

Playwright-driven against the live deployment (fresh signed-out contexts).
14/14 rubric rows PASS:

| Row | Result | Evidence |
|---|---|---|
| 1a Exact example caption | PASS | byte-exact Aurelia caption |
| 1b Create-your-chart link | PASS | present |
| 1c Inset chart card | PASS | pane present (v1.38+) |
| 1d No sign-in wall | PASS | chart visible signed-out |
| 2 Callout outside inset | PASS | text rendered outside the pane on hover |
| 3a Empty-click swap only | PASS | chart becomes active |
| 3b Object click → lesson | PASS | lesson panel appears after swap-first |
| 3c Lesson regimes/evolution | PASS | authored passages present in live lesson text |
| 4 Zero inference calls | PASS | 0 requests to real inference endpoints (hf.co CDN asset is local machinery, not inference) |
| 4b No console errors | PASS | clean |
| 6a Version badge | PASS | v1.41.92153 bottom-right, every entry path |
| 6b /landing + /landing.html forced | PASS | both serve landing signed-out |
| 6c /marketing.html redirect | PASS | → /landing#hero preserved |
| 6d Voice gesture gate | PASS by construction | no audio element activity before gesture; 0 inference |

Scenario 5 (logged-in paid branch) not exercised here: requires a funded
account; the chain (identity → Firestore ledger → managed key with limit →
hosted reading) is verified layer-by-layer locally, pending the RevenueCat
static secret for the wallet layer.

Observation-driven fixes shipped during the rubric (natally-ubuntu repo):
- dispatcher landing-mount creation on the unified document
- dispatcher same-experience re-entrancy guard
- landing version badge populated + created when absent
- build_all.sh 95 MB staging guard (GitHub 100 MB hard limit; CC13 LFS-forgejo-only)
Driver: .tmp/r12-rubric2.mjs (canonical repo).
