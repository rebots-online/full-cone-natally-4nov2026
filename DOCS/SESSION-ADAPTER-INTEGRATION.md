# Existing session adapter integration contract

> Status correction, 28 October 2026: retaining Netlify below does not satisfy
> the operator's dependency-removal direction and is not established as approved.
> This document is retained as evidence of that unresolved design; it must not
> authorize implementation of a Netlify dependency or a substitute host.

28 October 2026. Architecture/research only. No application source, credentials, provider state, services or deployment were changed. The design preserves the existing Netlify adapter, existing Firebase operational database, RevenueCat commercial authority, one-hour OpenRouter user keys and direct client inference.

## Decision

Call the approved `syncCustomerSessionKey` from the existing authenticated adapter, with a Firestore-backed per-customer operation boundary and explicit configured ROCHE conversion. Reuse the existing store's conditional-write mechanism. Add narrow durable checkpoints around the helper's external mutations; an outer lock alone cannot recover interrupted issuance. Do not silently substitute an in-memory map, create a new host/database, or use Firebase to grant or debit currency.

Normal requests can be automated end to end. Ambiguous external writes must remain durable pending operations until their outcomes can be reconciled. No lease timeout, aborted fetch or single readback can prove a delayed external write will never arrive. Where terminal evidence is unavailable, return `needs_attention` with the existing operation reference rather than create another funded key or overwrite a newer association. This is an explicit recovery limit, not successful fulfillment.

## Current evidence and bindings

Read `fulfillment-handoff.md`, `DOCS/SESSION-KEY-ARCHITECTURE.md`, and current CodeGraph source for `billing/customer-session.mjs`, `billing/openrouter.mjs`, `billing/revenuecat-customer.mjs`, `netlify/lib/blink-store.mjs`, `netlify/functions/reading-access.mjs`, `src/services/billingAccess.ts` and `src/services/inferenceAccess.ts`.

The handoff reports exact KStore authority reads for the existing-adapter decision, caller-supplied conversion and serialization, one-hour session contract, and direct client inference. These are inherited read results, not fresh KStore reads by this reviewer. Current source was inspected independently.

| Binding | Established state | Required integration |
|---|---|---|
| Existing adapter | Handoff identifies `https://natally-hosted-chat.netlify.app`; `netlify.toml` uses `netlify/functions` | Extend existing `reading-access.mjs`; no new host |
| Firebase project | Repository config: `gen-lang-client-0714568880` | Keep the existing project |
| Firestore database | Repository config: `ai-studio-remixastrosphere-1ee57c33-6487-411a-a872-59fbf4cbfc63` | Keep this named database, not an assumed `(default)` database |
| Server Firebase binding | `createBlinkStore` requires `FIREBASE_SERVICE_ACCOUNT_JSON`, checks project match, and obtains a datastore OAuth token | Supply this existing runtime binding with access to the existing database |
| Existing operational store | `natallyBlinkOperations`, SHA-256-shaped IDs, `get`, create-if-absent, replace-if-updateTime | Reuse via a small session-operation wrapper with namespaced IDs and payload kind |
| RevenueCat | Helpers accept explicit `{apiKey, projectId}`; `.env.example` contains project candidate `projaba0bd94` and empty `REVENUECAT_SECRET_API_KEY` | Bind verified project and its real server API credential; example is not runtime verification |
| OpenRouter | Helper requires explicit `adminKey`. On 28 October the process `OPENROUTER_API_KEY` also returned 401 from the management endpoint `/api/v1/keys`. `OPENROUTER_ADMIN_KEY` was absent from the current process and project `.env`. | The available inference-named credential is unusable. The separately documented management credential has not been located or tested; do not claim it was tested and failed. See `TEST-RESULTS/openrouter-management-binding-28oct2026.json`. |
| App endpoint | Client reads `VITE_BILLING_API_URL`; absent in inspected process | Bind existing adapter base in the prescribed build inputs |
| Origin | Existing exact origin default is historical Surge; handoff observed current Robin origin rejected | Bind approved deployed web/native origins to the same authenticated adapter; do not infer native behavior from desktop |

Bounded local credential discovery checked the named process variables, Windows user/machine environment presence, and the conventional gcloud ADC file. `FIREBASE_SERVICE_ACCOUNT_JSON`, `GOOGLE_APPLICATION_CREDENTIALS`, `REVENUECAT_SECRET_API_KEY`, `REVENUECAT_PROJECT_ID`, `OPENROUTER_ADMIN_KEY` and `OPENROUTER_MANAGEMENT_KEY` were absent; the conventional ADC file was absent. No credential values were printed. This does not prove credentials are absent from every connected account or vault. No broad filesystem or service search was performed.

Parent-supplied production-environment inventory contains only `BILLING_ALLOWED_ORIGIN`, `FIREBASE_API_KEY`, `FRONTEND_ORIGIN`, `NATALLY_DEV_*` and `ZAI_*`. It lacks the server bindings above. That inventory was supplied by the parent, not re-read remotely here. `FIREBASE_API_KEY` supports the existing authentication lookup; it is not the service-account binding expected by `blink-store`.

## Concrete durable operation boundary

Use the existing Firestore store without changing Blink's records or behavior. The session wrapper computes:

```text
recordId = sha256("natally:customer-session:v1\0" + revenueCatProjectId + "\0" + uid)
payload.kind = "natally-customer-session-v1"
```

Reject a record with the wrong kind or owner. One stable record per customer serializes start, renewal, reconciliation, balance-change work and logout; request IDs alone would permit two simultaneous requests for the same customer.

The operational payload records only orchestration and recovery:

```text
uid, projectId, operationId, operationKind, requestId
revision, ownerToken, acquiredAt, heartbeatAt
phase, expectedAssociationHash, candidateHash, candidateKeyExpiresAt
candidateKey (temporary only, until verified RevenueCat association or retirement)
effect: {sequence, kind, intent, status, startedAt, completedAt, outcome}
reconcileRequested, lastSafeReason, completedAt
```

`intent` contains the exact external mutation needed for recovery, including the absolute limit and input observation identifier/time when setting a limit. That is an operation receipt, not an authoritative wallet. A resumed operation always reads fresh ROCHE before a new allowance decision. Never use a recorded amount as a substitute for RevenueCat. Canonical key/customer association remains on RevenueCat; a transient candidate in Firebase exists only to survive process interruption before that association is saved.

Acquisition uses create-if-absent or `replace(recordId, next, observedUpdateTime)`. On a recognized conflict, re-read. On a store/network/authentication error, stop before provider mutation; do not reinterpret it as a free lock. A lost Firestore write response is resolved by reading back the exact operation/owner/revision before proceeding. These semantics are already available in `blink-store.mjs`; Firestore's `updateTime` precondition requires the exact last-update timestamp. [Firestore preconditions](https://firebase.google.com/docs/firestore/reference/rest/v1/Precondition).

Only the current owner may persist a mutation intent, and the intent must be durable before the network request starts. The owner must durably record the response before moving to the next external mutation. A competing request returns `pending` with the existing operation ID and an actionable retry interval; it does not invoke the callback.

Do not run provider calls inside a Firestore transaction callback: such callbacks can be retried, and Firestore cannot atomically commit a provider side effect. Keep individual conditional writes short. [Firestore transactions](https://firebase.google.com/docs/firestore/manage-data/transactions).

### Lease and stale-worker rule

A heartbeat or lease is useful for detecting likely abandonment, not permission to start a second mutating callback. A monotonically increasing local revision fences Firestore writes only; RevenueCat and OpenRouter do not consume that revision.

- If no external mutation intent is open, a new owner may CAS-acquire recovery. Any old owner must fail its next CAS intent transition and stop.
- If an external mutation intent is unresolved, expiry permits read-only investigation and a pending/attention response. It does not permit a new allowance, association write or issuance sequence.
- A `finally` block must not reset unknown work to idle. Release to idle only after the result and absence of unresolved effects are durable.
- Existing callbacks must await every provider request and checkpoint; no detached work may outlive the operation boundary.
- All deployed writers of these key attributes and limits must use this boundary. A lock used only by this one handler cannot serialize another app's unrelated direct mutations. Currency changes elsewhere remain valid and trigger fresh reads; they are not alternate key writers.

The first implementation should be conservative: explicit `needs_attention` for unresolved cross-provider writes that cannot be conclusively closed. More aggressive automatic recovery would require evidence of provider idempotency, ordering or terminal request status; none was established here.

## Minimal helper integration, preserving the approved sequence

The current callback receives no operation checkpoints and closes over the full sequence. If it creates a key, funds it, then loses the process before `saveCustomerKey`, the outer wrapper does not know the new hash or plaintext. Production must not call this sequence with a lock-only implementation and claim recovery.

Retain `syncCustomerSessionKey(uid, options)` and `withCustomerOperation(uid, callback)`. Add an explicit operation context to the options, initialized by that boundary, with narrow methods:

```text
operation.perform(effectKind, intent, execute) -> durably recorded actual result
operation.readCandidate() -> unresolved issued candidate or null
operation.checkpointCandidate(actualCreatedKey) -> durable completion before funding
operation.keyName -> stable unique name for this issuance operation
```

These are proposed additions, not existing exports. The production path requires them. Tests may use an explicit deterministic operation implementation. They must not change the commercial sequence or fabricate provider responses. Prefer explicit seams over a transport wrapper that silently rewrites HTTP bodies or invents RevenueCat attribute reads.

Apply the context to customer creation, key creation, absolute-limit update, key deactivation and association write. Read methods remain real provider reads. Give effect failures typed statuses such as `not_sent`, `completed`, `unknown`; the existing generic exception strings are insufficient to drive reliable recovery. `not_sent` is only valid before dispatch or on a conclusively rejected request, never a network timeout.

For issuance, use a unique stable name containing a customer identifier and operation ID. Current `Natally ${uid}` is insufficient to distinguish multiple abandoned attempts. Persist the exact one-hour expiry before sending POST. Newly created keys remain zero-limit until their actual key/hash response has been checkpointed. Recovery of a captured candidate validates that candidate and continues funding/save; it must not blindly execute another create because RevenueCat still contains the preceding association.

This requires small changes at the real mutation seams in `billing/openrouter.mjs`, `billing/revenuecat-customer.mjs` and `billing/customer-session.mjs`, plus the adapter/operational wrapper. It is not a replacement billing implementation or new balance store.

## Recovery contract by failure point

| Point of interruption | Authoritative recovery | Result and prohibited shortcut |
|---|---|---|
| Firebase acquisition/write response lost | Read same document and confirm owner, operation and intended revision | Resume only confirmed owner; no provider call on unknown acquisition |
| RevenueCat customer creation ambiguous | Read the same UID; creation is not proof of entitlement or ROCHE | Continue only from verified customer; no alternate UID |
| Existing-key validation transient failure | Retry read; retain association and question | Pending; never treat network failure as an invalid key |
| Key POST outcome unknown, no captured plaintext | Inspect paginated provider key metadata for the exact operation name, including disabled keys; correlate creation time and expiry | Do not repeat POST on an empty first page or lost response. Locate/retire the zero-limit orphan if possible; no fabricated recovered plaintext |
| Key response captured but journal write uncertain | Read journal; if process still holds response, complete that same checkpoint under same owner | No funding before durable candidate. If candidate is lost, use the preceding unknown-create rule |
| Fresh ROCHE read fails or literal ROCHE absent | Retry RevenueCat; distinguish absent currency from actual numeric zero | Pending/attention, never assume zero or convert NATALTURN |
| Limit PATCH outcome unknown | Read the exact candidate/associated hash and compare intended absolute limit; retain unresolved request identity | Matching state is an observation, not proof no late request remains. Do not allow newer conflicting limits until the earlier effect is resolved or the affected key is permanently retired |
| Limit success, save not sent | Recover captured candidate, read fresh ROCHE, run verified limit/save continuation | Same candidate, not another funded key |
| Association POST/readback ambiguous | Read both RevenueCat attributes and exact provider hash; compare the expected pair | Preserve pending operation. Do not overwrite a different association or issue a replacement merely because a read is old |
| Save completed and readback verified, HTTP reply lost | Re-read authoritative association and current balance on retry | Same association can be reused; no replay of a stale ready response as current funding |
| Zero balance | Set zero and disable exact key, verify disabled; retain purchased ownership | Explicit unfunded only after actual zero and disable outcome are established |
| Logout | Under the same boundary, compare expectedHash against current RevenueCat hash, then disable only matching key and verify | Stale logout does not disable its replacement. A provider error is pending deactivation, not confirmed logout fulfillment |

OpenRouter's creation documentation states that the plaintext is returned only at creation, and its list endpoint supplies metadata and hashes rather than a recovery copy of that plaintext. The documented list API supports pagination and including disabled keys. It does not establish unique names or an idempotency key. [Create key](https://openrouter.ai/docs/api/api-reference/api-keys/create-keys), [List keys](https://openrouter.ai/docs/api/api-reference/api-keys/list).

For a lost create, automated investigation may retire identified zero-limit candidates. An empty listing alone is not terminal proof for an in-flight POST. A later attempt must not create a funded duplicate until the old issuance is conclusively retired or expired under verified provider behavior. If that cannot be established, expose `needs_attention`. The one-hour expiry bounds access, but does not magically recover the lost plaintext.

For uncertain funding on a known hash, permanent retirement is an available isolation strategy: disable the key and never re-enable it; current limit writes do not set `disabled:false`. It still requires verified provider state and resolution of any pending RevenueCat association write before publishing a replacement. A delayed attribute write can overwrite the shared association even after the old key is disabled. Do not claim the Firestore lease solves that cross-provider race. [OpenRouter key update fields](https://openrouter.ai/docs/api/api-reference/api-keys/update-keys).

## Key validity, renewal and financial semantics

Current `validateManagedKey` checks whether expiry is in the next hour. That does not prove the key was issued with a maximum one-hour lifetime: an older long-lived key could enter that window. Validate current user-key status plus management metadata for the same hash, including actual `created_at`, `expires_at` and disabled state. Require actual lifetime no greater than one hour. The provider current-key API exposes expiry and remaining capacity; management metadata supplies creation time. [Current key](https://openrouter.ai/docs/api/api-reference/api-keys/get-current-key), [List metadata](https://openrouter.ai/docs/api/api-reference/api-keys/list).

A pre-expiry refresh currently reuses the same still-valid key and does not extend expiry. Introduce an explicit renewal eligibility threshold (proposed operational default: 60 seconds remaining). Retire a still-live old key and verify that retirement before funding a replacement; do not leave two usable funded keys because the browser timer fired early. Use the same operation boundary and preserve the question. The threshold is an implementation default, not a change to the one-hour maximum.

`setManagedKeyLimit` writes an absolute provider cap. Its name must not be treated as proof of a fresh spendable allowance. Provider usage may already consume part of that cap. The pending numerical policy must specify the ROCHE-to-USD mapping, rounding and whether the authoritative result is an absolute cap or a desired remaining allowance. Do not add old limits, old balances or arbitrary usage adjustments to make an example pass. The existing specification requires the new limit to derive from current ROCHE, so a policy that requires otherwise needs explicit reconciliation with that specification.

The operator's pending ROCHE grant/conversion answer remains necessary. Historical 40% allocation and the other repository's USD-per-ROCHE constant do not resolve it. Grant size, conversion and actual usage/debit accounting are separate: this adapter must not invent RevenueCat debits or infer purchases from provider usage. Returning a working session also does not establish cross-app consumption reconciliation.

After limit/save, verify actual usable provider state. `syncCustomerSessionKey` currently reports ready solely from `limitUsd > 0`; the adapter must not return ready if the key is disabled, expired, out of remaining allowance, or if association readback is unresolved. Do not synthesize `usageUsd:0`, expiry or a positive remaining amount. A paid customer with unusable provider capacity needs reconciliation, not another purchase CTA.

## Adapter and client wire contract

Use the existing route family:

- `POST /billing/reconcile`: authenticated session start, renewal, restore and purchase recovery; invokes common session sync.
- `GET /billing/access`: authenticated read-only current status; never issues, funds or deactivates a key. Return pending with a reconciliation action when mutations are needed.
- `POST /billing/logout`: authenticated `{expectedHash, requestId}`; invokes matching-hash deactivation under the same customer operation boundary.

Derive UID from the existing verified Firebase token flow, never a body-supplied customer ID. A request ID deduplicates a transport retry; it is not evidence of payment. Purchase callbacks and currency events are triggers to read RevenueCat. Queue/coalesce further reconciliation intent while a customer's operation is running, and read current ROCHE rather than trusting webhook amounts.

Common response fields:

```text
accountUid, operationId, observedAt, expiresAt
state: ready | unfunded | pending | needs_attention | unavailable
reasonCode; retryAfterMs for actionable pending work
```

`expiresAt` is short response freshness, separate from key lifetime. A `ready` managed response adds only verified values:

```text
provider: openrouter
source: managed
apiKey, keyHash, keyCreatedAt, keyExpiresAt
currency: ROCHE, roche, limitUsd
usageUsd and remainingUsd when actually returned/verified
```

`unfunded` includes actual `roche:0` and confirmed deactivation; it contains no usable key. `pending` and `needs_attention` preserve the known purchase/recovery context and contain no invented balance. `unavailable` is a real runtime configuration or service state with a path to recovery; it must not be presented as ordinary product completion. Authentication failures retain their actual HTTP status. The client must parse structured recoverable responses even when a non-2xx status is appropriate.

Remove the client's unsupported mandatory `keyGeneration`; use actual hash and expiry for identity. If an operation revision is useful, give it its real operational meaning rather than pretending it is a provider key generation.

`inferenceAccess` must persist managed expiry/hash as well as source and owner, enforce managed expiration, and use the actual provider result. Every awaited completion checks the captured Firebase owner and client request generation. Retain the personal-key non-replacement rule. Managed invalid/near-expiry keys reenter common reconciliation; transient checks retain the question and recoverable context. A confirmed true zero differs from failed recovery. Logout captures old owner/hash before sign-out; failed teardown is reported as pending and cannot falsely claim remote deactivation.

## Minimal missing inputs and next work

1. Supply the existing adapter's Firebase service-account binding for the already selected project/database. No new Firebase project, database, IAM redesign or Netlify storage product is proposed.
2. Supply the actual RevenueCat server API credential and verify its project binding. Example project configuration alone is not a deployed secret binding.
3. Locate the separately documented `OPENROUTER_ADMIN_KEY` through KStore/Admin-Manual and verify its management endpoint before binding `adminKey`. The available process `OPENROUTER_API_KEY` returned HTTP 401 from both the earlier `/api/v1/key` probe and the later read-only `/api/v1/keys` probe. That result does not test the separately issued management credential. The retained adapter selection is subject to the status correction above.
4. Resolve the pending numerical ROCHE grant/conversion contract, including absolute-cap semantics and rounding. Keep actual paid-owner recovery tied to the existing transaction; do not initiate another purchase.
5. Bind the existing app endpoint and approved browser/native origins in actual release inputs. These are concrete configuration tasks, not a request to choose another host.

Independent implementation work can proceed on the operation wrapper, checkpoint seams, endpoint/client schema, account guards and recovery-state behavior with explicit injected test dependencies. Do not claim paid runtime fulfillment until the above bindings and conversion exist.

Focused verification should cover two independent handler instances contending on the same customer, different customers proceeding independently, crash before/after each checkpoint, lost Firestore writes, lost create plaintext, delayed provider PATCH/attribute writes, pending lock expiry, actual zero versus absent ROCHE, stale logout, pre-expiry rotation, and response loss after successful save. These are meaningful behavioral checks for the eventual concurrency implementation, not required tests performed by this architecture task.

Live acceptance remains separate: existing charged customer, literal ROCHE, management permissions, one-hour provider behavior, real installed key, direct inference, renewal/logout, retained souvenir access, and cross-app balance updates. This handoff completes the bounded integration design and identifies unavoidable ambiguous outcomes; it does not assert those live outcomes are complete.
