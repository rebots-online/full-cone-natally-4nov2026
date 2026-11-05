# Account and billing: supervising semantic review

Architecture8ec29399; recipee5c2f65e. Recording remains held in this chat.
This record initially covers source review, not runtime/subscription acceptance.

| Requirement | Reviewed implementation |
| --- | --- |
| ACCOUNT-01 | Profile action opens a current-UID-keyed AccountBillingDialog in the independent marketing shell, without account/onboarding navigation. Auth observer clears the dialog UID and stale owner content. |
| ACCOUNT-02 | Actual User displayName/email/phone only. Existing owner-checked credit state/loadCredits and Top Up intent passed as props; no second balance or guessed zero. Generic error copy hides internal currency/SKU/provider names. |
| ACCOUNT-03 | Optional nullable CheckoutCustomer.managementUrl projects actual web CustomerInfo.managementURL; native normalization unchanged. HTTPS URL validated in dialog; null is not interpreted as absent ownership. Actual portal link kept only in memory. |
| ACCOUNT-04 | Existing getCheckoutCustomer and restoreCheckoutCustomer serialized SDK reads, returned owner checked. Restore refreshes existing Credits independently. Status says purchase records refreshed, not newly funded/fulfilled. Product count deduplicates actual returned product IDs and labels distinct products; no raw IDs rendered. |
| ACCOUNT-05 | Native showModal, heading focus/label, Escape/Close, inert background, root scroll lock, responsive maximum height/overflow and return focus. Late async results gated by active/generation/current UID. Same-coder correction resets actionInFlight during cleanup so setup can restart after invalidation. Existing room/inset/voice controls unchanged. |

No dependency/backend/provider/catalog/credential/configuration changes. Parent
publishes source before running lint or the existing web-only coordinator.
## Actual first deployment and correction

Web1.19.88941, source6cefed2b, invocationd8b5da5c-9a9e-4349-9b09-7f2cbbb23b89,
coordinator terminal exit0. Both hosts92/92 served-byte checks passed (184total),
all3web outputs verified,9native pending, sourceInputsMatch:true.
Report: build/deploy-1.19.88941-d8b5da5c-9a9e-4349-9b09-7f2cbbb23b89/run-2026-10-30T05-05-47-825Z-34620/deployment-report.json,
SHA-2560c373c25d97ea1bb116b5b7902cc5a0a4d743a4d59d0aa8ba370fe679dc72aef.

Actual canonical-domain session: Profile opens Account & billing without
navigation. Name/email are the real signed-in account. SDK returned0distinct
products and actual credit reader0; Restore purchases completed a real provider
record refresh and independently refreshed Credits. No payment/inference occurred.
No management URL was returned for this account; active-subscriber portal-link
navigation remains unobserved, with no fabricated subscription or URL.

Desktop and actual390x844 dialog were readable/contained; mobile bounds
left17/right373/top126/bottom718, no inner scroll overflow. Close restored focus
to Account & billing and released document scroll lock. Temporary viewport changes
were cleared; restored1920x855. Private screenshots retained in Windows Temp.

Tab sequence initially reached Close/Refresh credits/Top Up/Restore purchases,
then browser/body focus. Parent returned this ACCOUNT-05 deficiency to the same
coder. The correction explicitly wraps Tab/ShiftTab using current visible enabled
controls, including initial heading and empty-control cases. Semantic review
passed; publish before execution and repeat actual keyboard acceptance.
Account-switch/subscriber branches remain unobserved. Recording remains held.

## Corrected live acceptance

1.20.88950 source74771175, invocation28d7fc5c-c084-401e-926e-060859372340;
coordinator exit0,184/184 checks,3web verified,9native pending,
sourceInputsMatch:true. Report SHA-256
75d7abdba7816e4eaf8c2012c35b0c36cf78bc1720488b7d8e8c8003cd62a8ac.
Normal canonical-domain reload served20. Actual keyboard sequence
Close→Refresh credits→Top Up→Restore→Close; reverse Close→Restore. Every observed
focus remained in the dialog. Escape restored Account & billing focus and page
scroll. Actual Restore again completed at390x844; actual fetched zeros remained
unchanged, with truthful independent status. Dialog bounds17..373/100..744.
Viewport was restored1920x855. No recording, paid inference, charge or seeded
subscriber. Only active-subscription/account-switch branches remain unobserved.
