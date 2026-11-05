# Paid binding readiness — 30 October 2026

Read-only readiness evidence for the existing approved paid-experience work.
`CHECKLIST.md` and `DOCS/RESUME.md` were read first. This report records the
effective project configuration and a bounded canonical lookup; it does not
establish that credentials are absent elsewhere in KStore/Admin-Manual.

## Effective project bindings

The existing `scripts/environment.mjs` parser, credential-reference validator and
KStore client were used for exactly these five names, applying `.env.local`
overrides to `.env` in the helper's existing order. All five effective assignments
were present but empty, so none supplied a configured pointer to resolve.

| Binding | Observed effective state |
| --- | --- |
| `REVENUECAT_SECRET_API_KEY` | Configured empty; unresolved |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Configured empty; unresolved |
| `REVENUECAT_WEBHOOK_AUTH` | Configured empty; unresolved |
| `VITE_BILLING_API_URL` | Configured empty; unresolved |
| `BILLING_INCLUDED_INFERENCE_USD` | Configured empty; unresolved |

Empty project configuration is not evidence that the corresponding canonical
credential or configuration value does not exist elsewhere.

## Bounded canonical lookup

The helper-declared RevenueCat destination was read through the existing
KStore/Admin-Manual client. Its readback was exact, revision 1. It contained only
the two public SDK binding names shown below, and none of the five requested
binding names.

| Entry path | Observed result |
| --- | --- |
| `CREDENTIALS/RevenueCat/Natally/credentials.env` | Exact readback, revision 1; `VITE_REVENUECAT_ANDROID_PUBLIC_KEY` and `VITE_REVENUECAT_PUBLIC_KEY` only |
| `CREDENTIALS/Natally/credentials.env` | Confirmed HTTP 404 / `KSTORE_NOT_FOUND` |
| `CREDENTIALS/RevenueCat/credentials.env` | Attempted path returned confirmed HTTP 404 / `KSTORE_NOT_FOUND` |
| `CREDENTIALS/Firebase/credentials.env` | Attempted path returned confirmed HTTP 404 / `KSTORE_NOT_FOUND` |

The first two destinations come from the existing helper/configuration contract.
The latter two were attempted paths, not verified global entry mappings. Path
guessing stopped after these bounded reads. **Canonical absence elsewhere is NOT
established.** No usable private credential, backend endpoint or inference
allocation was established by this lookup; no endpoint or allocation was invented.

## Existing helper limitations and evidence boundary

- `resolveEnvironment` resolves all effective configured pointers. The targeted
  probe used its exported parser, pointer validator and KStore client instead of
  retrieving unrelated configured credentials.
- The current Python KStore client's public read surface exposes
  `read_document(path, rev, source_type)`; it does not expose a search/list method
  for discovering differently named canonical entries. A missing guessed path
  cannot establish that a credential is absent from the whole Admin-Manual.
- The supported project reference syntax remains
  `kstore://admin-manual/<document-path>#<ENV_FRAGMENT>`. A repair needs the actual
  canonical entry and fragment; this report does not supply an invented pointer.
- No credential values were printed or recorded. No shell-history search,
  provider credential probe, credential mutation, environment rewrite, build,
  deployment or paid-customer transaction was performed.

## Existing approved next action

The remaining [SK-BIND checklist action](../../CHECKLIST.md#sk-bind--bind-existing-customerkey-helpers)
is:

> Wire the authenticated adapter and client lifecycle using the established
> configuration and operation boundary; demonstrate actual purchases and refresh.
> Pure helper fixtures do not satisfy this final integration task.

[CP-T04 — Real purchase, preload and top-up](../../CHECKLIST.md#cp-t04--real-purchase-preload-and-top-up)
defines the paid result: verified ownership and settlement grant the selected SKU
once through RevenueCat, and the usable purchased balance is preloaded before
resuming the saved request. Preserve the existing allowance, usage and key on
top-up; a callback is a lookup hint rather than payment authority.

For configuration readiness, obtain the exact existing canonical entry paths and
fragments for the missing project bindings, then apply them through the existing
annotated pointer workflow. This bounded report does not authorize new hosting,
storage, a ledger, a provider or an allocation policy.

The status correction at the top of
[the retained session-adapter design](../SESSION-ADAPTER-INTEGRATION.md)
explicitly says its Netlify dependency is not established as approved. That
retained design must not authorize introducing or retaining that dependency as a
substitute for the approved implementation boundary.
