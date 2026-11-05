# Paid fulfillment implementation and live configuration — 27 October 2026

Status: IN_PROGRESS. This note binds CP03/CP07/CP10 and ER04 to RevenueCat's
existing project. It does not establish successful payment or delivery.

## Authority and configuration

Project `projaba0bd94`; Web Billing app `app941a60bf95`. Both evaluation products
remain consumables at their existing small tester prices:

- Souvenir: `proda88125bed7` / `natally_reading_test_v3`.
- Experiential: `prod2f046e3b64` / `natally_roche_test_v3`.

Live readback found the Natally entitlement product lists empty. Corrected and
read back `natally_reading` (`entlbc6dd8a62a`) and `natally_downloads`
(`entl2ef69e9c03`) to the souvenir tester only. The experiential product was
briefly attached to `natally_reading`, then detached during semantic review;
final state does not grant it souvenir reading/download rights.

## Ten-turn implementation decision

The operator required RevenueCat to be the authoritative commercial record and
ten completed exploratory questions per tester purchase. The coordinating agent
approved representing that finite allowance using RevenueCat currency `NATALTURN`
(27 October), separate from shared `ROCHE`. This is an internal meter; customer
copy remains ten exploratory questions, never another payment currency.

Created `NATALTURN`, display name `Natally exploration turns`, with one product
grant of 10 for both tester product IDs; trial amount zero; no cycle expiration.
Creation and subsequent GET readback matched. No customer balance was manually
granted. This configuration applies RevenueCat's purchase-grant mechanism.
Server accounting must reserve an exchange under the approved Firebase operational
boundary, decrement once for a completed exchange, and retain ambiguous outcomes
for recovery. Tool calls, retries, voice synthesis and replay do not consume another
turn. This accounting/relay is not yet implemented in this branch.

The intended separate one-promotional-ROCHE grant remains incomplete. The existing
ROCHE currency has an unrelated legacy grant with amount zero/trial amount 100.
Updating the complete list while preserving it was rejected by the current API:
`0 is less than the minimum of 1` (request d2d11125-0c61-42e1-81d5-da1695c3d76f).
No currency update succeeded and existing grants were not modified. Do not remove
or change unrelated grants merely to force the Natally addition through.

## Read-only authority adapter binding

`netlify/lib/revenuecat-access.mjs`: `readRevenueCatAccess(uid, {apiKey,
fetchImpl,now})` reads production purchases, active entitlements and balances
from the existing RevenueCat project. It validates account, status, exact product,
expiry, bounded same-resource pagination and integer balances; returns only an
expiring projection. It does not mint rights, persist a commercial ledger, expose
provider keys or claim inference readiness.

Result: accountUid, environment, observedAt, expiresAt, remainingTurns, rocheUnits,
entitlementIds, hasReadingPurchase, hasExperiencePurchase, readingPurchaseIds,
experiencePurchaseIds. The server must verify Firebase identity before passing UID.
Only the souvenir purchase permits Natally reading/download entitlement flags.

## Still required before release

- Bind the existing server secret and authenticated Firebase operational substrate.
- Replace development-key access with server-only custody and durable per-request
  accounting, observing actual purchased allowance before inference.
- Complete shared ROCHE promotional grant without altering unrelated products.
- Authenticate owned artifact/resource authorization, generate PDF and hosted
  vignette with shared summary revision and promised retention.
- Record ER-S04 through ER-S08 in the prescribed continuous real journey.

KStore's Admin-Manual registry contains `revenuecat/ROBINS-AI-WORLD-CATALOG.md`,
which points to `CREDENTIALS/RevenueCat/credentials.env`; the referenced credential
file is not itself in the document registry. No Firebase credential/custody binding
was found in that registry. The Netlify connector requires reauthentication; no
new provider, database or persistence service was created as a workaround.

## UI readiness gate and environment boundary

`src/services/billingAccess.ts` now also exports
`readPaidConversationAccess(accountUid): Promise<{canInfer:boolean}>`. It only
returns true for an owner-bound, fresh server response with `state=ready`,
`transport=server`, a positive integer `remainingTurns` and no `apiKey`. Failure
returns false. It does not install a key or treat SDK purchase success as a grant.
Existing legacy access functions remain for migration; this helper intentionally
rejects the current development-key response. Root integration must replace that
endpoint before a paid conversation can become ready.

RevenueCat currencies are shared customer balances, not independently isolated
production/sandbox balances. Official docs allow sandbox grants according to the
project's General sandbox-access setting. Production-filtered purchases alone do
not prove every balance unit arose from production. Before server spending opens,
verify the configured sandbox policy and existing mixed balances; preserve other
apps on this shared project. Never silently change a global setting or subtract
an invented local ledger to paper over this boundary. See
https://www.revenuecat.com/docs/projects/sandbox-access and
https://www.revenuecat.com/docs/offerings/virtual-currency.

Source inspection corrected pagination origin/path checks, account encoding,
clock injection, missing entitlement-expiry handling and safe-integer balances.
No integrated payment, inference, artifact delivery or build/deployment observation
is claimed by these source changes. The helper/module are integration inputs.

## Latest offer clarification — common experience

Operator clarification relayed during this work: both offers provide the same
interactive experience. The souvenir purchase adds the extensive PDF with a
chapter for each planet (general educational background plus personal reading)
and the customer's saved atelier for rereading with Natally voice. Both customers
use credits for additional daily horoscope, synastry and other exploration.
Credit/x402 customers may purchase one-off souvenirs later. Therefore NATALTURN
is common to both tester products; `natally_reading` is not the general inference
gate. Only souvenir deliverables depend on souvenir purchase/entitlements.
The later one-off delivery purchase and expanded PDF remain implementation work.

## Handler connection checkpoint

`netlify/functions/reading-access.mjs` now calls the named authority adapter after
its existing Firebase verification. `REVENUECAT_SECRET_API_KEY` is the server-only
binding named by the canonical catalog. Missing binding returns unavailable;
verified purchased allowance returns pending with `fulfillment_provisioning`.
No branch returns ready and no developer/provider bearer is returned. This
supersedes the earlier description of the source handler returning a key; deployed
behavior has not yet been changed or observed. The client legacy installer remains
until relay migration; the new gate rejects a key-bearing response.

CORS permits exact Natally custom/Surge origins and an optional validated HTTPS
origin from BILLING_ALLOWED_ORIGIN. Native requests without Origin still require
verified Firebase identity. Provided unapproved origins fail. Both GET access and
POST reconcile are read-only RevenueCat observations; no callback creates rights.
Named import/call and source boundary were inspected after mechanical correction.
