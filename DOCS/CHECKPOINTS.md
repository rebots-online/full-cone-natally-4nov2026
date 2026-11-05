# Decision checkpoints

| Decision | Initial fork | Preserved alternative | Continuation |
|---|---|---|---|
| Account-key/purchase execution location | d6008048e9318840d5cc54b1c3c5484c2860a8bc | ec99b908be8f75cfe2278463002e3adb97184dc6 on checkpoint/2026-10-28-fulfillment-alternatives | Existing thin provisioning adapter; RevenueCat remains commercial authority; no new host or duplicate commercial store |
| PWA automatic-update proposal | 406e84a9002d6bfec838bf2dab3a2aa118161b78 | d408c60b028fc1d3204ea0f879eb98ff0a43675c on checkpoint/2026-10-28-pwa-update-proposal preserves the unapproved draft; its parent d6008048 contains the corrected authority claim | Optional proposal only; installed/offline PWA requirement remains; no CC16-derived release gate |

## Execution-location assumption

The operator directed continuation using documented assumptions and recoverable
checkpoints instead of stopping the project over this unresolved choice. Choose
the already existing adapter for the specified account-key creation/reuse and
purchase-funding operations because it reuses an existing integration. Rejected
alternatives: new hosting (unnecessary dependency), competing commercial ledger
(conflicts with RevenueCat authority), and continuing to wait (operator-directed
continuation supersedes that handling). This is an implementation assumption,
not a claim that funding is implemented or verified.

The preserved branch includes all seven held fulfillment/status drafts. It was
created with a separate Git index, so the main working tree and its index were
not reset. It preserves the incompatible inference-store approach without
adopting or deploying it.

## Navigation and recovery

Inspect the original decision with `git show d6008048`; inspect the alternative
with `git show ec99b908`; compare with
`git diff d6008048 ec99b908`. Create a separate recovery checkout with
`git worktree add <new-path> checkpoint/2026-10-28-fulfillment-alternatives`.
Do not reset the active checkout to recover an alternative. Each later decision
row must link its parent fork and pushed continuation commit.
