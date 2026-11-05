# Memory continuity and paid access: operator refinements

Status: source audit and proposed cloud architecture, 24 October 2026.
This extends the explanation-delivery work without closing its unfinished
observations or any whole-product billing/device obligations.

## Source truth

`soul.ts` persists user disclosures and fictional character developments in
separate account-scoped localStorage records using the same helper. Each retains
only the last 80 entries. Character developments are committed after the final
reply from explicit hidden lore metadata; an interrupted reply can therefore
lose its new anecdote even if part was spoken. Conversation, profile lore and
atelier state have other local stores. These are not vector embeddings or
semantic retrieval. Prompt construction includes retained text directly.

`SOUL.md` is a static build import. It is not an editable Firebase document and
Natally does not write to the repository. The account-derived initial character
seed is deterministic across devices, but subsequent developments are local and
can diverge. Firestore intake uses getDoc/setDoc; there is no lore onSnapshot or
upload path. Repository rules permit owner access to users/{uid}/lore, but that
permission alone is not an implemented sync mechanism. The intake code's private
subcollection is not covered by the checked-in rules; deployed rules have not
been audited in this work and intake success must not be inferred from source.

## M01: one memory system, explicit authorship

The operator wants fictional overshares such as an armillary incident or a
supervised-reinforcement-learning-camp episode to become revisitable canon.
SOUL defines that behavior; account memory supplies the evolving canon. Use one
authenticated cloud event store, subscription, migration and erasure lifecycle
for user disclosures, Natally fiction and atelier receipts. Distinguish event
kind/provenance, not persistence quality. User statements are quoted assertions;
fiction is not promoted to user biography. Actual room receipts decide damage.

Proposed event fields: accountUid, stable eventId, kind, text, sourceMessageId,
episode/entity IDs, author, client timestamp, server commit timestamp,
schemaVersion, revision/supersedes and deletion epoch. Original events remain
auditable; corrections supersede rather than silently mutate history. Repeated
imports use stable IDs. Concurrent updates cannot overwrite an entire array.
Use account-owner rules, size/type limits and server-owned receipt kinds.

Maintain a local cache/outbox for instant interaction. Subscribe to the account's
cloud memory while signed in; detach and invalidate callbacks on account change.
Show pending/offline/confirmed/failed status accurately. Do not call a pending
local write synchronized. Before a new reading, use the latest available merged
canon; if a needed episode is not cached and offline, admit uncertainty rather
than invent a contradictory version. Memory writes must not hold the speech
queue. Only disclosed fiction enters canon, never hidden reasoning content.

Local migration must preserve all existing stores, show upload status, and use
idempotent events. The last-80 prompt limit must not become cloud data deletion:
keep archive retention separate from contextual selection. Erasure requires a
server tombstone/epoch so an offline old browser cannot re-upload deleted data.
No bulk cloud upload or live rules deployment has occurred in this change.

## M02: rubric priorities and reasoning experiment

Immediate text and sentence speech outrank exhaustive educational coverage.
Missing historical detail is a refinement; incorrect calculated relations,
unsupported houses/timing and invented user biography are substantive defects.
No extra inference pass is introduced to grade, repair or fill the rubric before
speech. Fictional training memories are character stories, not actual training
records. Provider-exposed reasoning, if the operator chooses to experiment with
it, must remain optional and distinct from canon; a concise explanation of the
answer is preferable to claiming literal access to a mind. This experiment must
not turn reasoning back on for all readings or divert reasoning into TTS.

## P01: paid-before-inference policy

Remove public promises of free generated chat/readings/listening. Existing
static lessons can remain free. Preserve the authorized development grant.
Do not invent prices, active checkout, $ROCHE conversion or an accepted x402
asset. The model/payment report specifies proposed server responsibilities.
This wording correction is not an assertion that paid metering is complete.

## Observation plan before changes

- M-A: inspect the actual SOUL and prompt path; verify instruction changes are
  bundled. A future real reply must disclose a new fictional episode, retain it,
  and revisit it consistently. Do not seed a fabricated event as a test result.
- M-B (cloud implementation future): on two real clients of the same account,
  create user disclosure and character episode, observe server acknowledgment
  and arrival, reconnect offline edits, correct and erase; verify another
  account never receives them. No cross-device claim until observed.
- M-C: compare real explanation omissions with substantive errors, preserve
  the existing streaming observation; no rubric buffering introduced.
- P-A: inspect live purchase offer and guide: no free-inference promise, explicit
  unavailable checkout; closing keeps the reading. Observe successful paid
  provisioning/debit only after real commerce is connected.

Cloud persistence, paid provisioning and optional reasoning experiment remain
open requirements, not implementation claims.
