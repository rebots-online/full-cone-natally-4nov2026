# Souvenir artifact implementation — 27 October 2026

Status: implementation in progress; hosted creation, playback, PDF and retention
have not yet been accepted through an ordinary purchased account.

The souvenir is an interactive personal web app preserving the calculated chart,
actual completed Natally conversation, and authored reference chapters. It is
not a WAV-only deliverable and does not generate a fabricated personal reading
from a generic template. The PDF is generated from the same snapshot with dynamic
pagination and chapter starts. Both purchase paths otherwise retain the same
live experience; credit purchasers can add the souvenir later.

## Authority and infrastructure

RevenueCat remains the sole authority for the purchase and live reading/download
entitlements. Firebase verifies identity. `/downloads/access` is an authenticated,
nonpersistent authorization projection. `/souvenir` verifies authority before
creating or serving the owner-only artifact. It does not grant commerce access.

The artifact payload is stored in the existing Firebase project's named Firestore
database from `firebase-applet-config.json`, collection `natallySouvenirs`. This
is operational user-content storage, not a competing entitlement/credit ledger.
Documents are create-only and keyed by a hash of owner UID and request ID. Existing
snapshots are never overwritten by later live exploration. Creation sets a server
time and retention through at least 366 days later; there is no expiry deletion
job in this implementation. Actual service retention still needs operational
verification and backup policy confirmation.

Server secrets: `FIREBASE_SERVICE_ACCOUNT_JSON` with datastore IAM on the named
database and matching project ID; `REVENUECAT_SECRET_API_KEY`. They are never sent
to the browser. Root Firestore rules deny direct client access to this collection.
No new provider or database is introduced.

## Frozen viewer and audio boundary

The private URL carries only its opaque artifact ID, `?app=1&souvenir=<id>`.
Firebase sign-in is required. The viewer composes existing ReadingStage,
Astrolabe3D and NatallyChatbot components with an immutable message source. It
never rewrites the active chat history or recalculates a current sky. Its room
interaction storage is isolated from the live atelier.

Spoken reread uses the preserved text and saved Natally voice settings through
the existing real-time engine. This is **not** a claim that the original generated
WAV is retained in cloud storage. Existing on-device audio remains separate;
copying that audio to durable storage has not been implemented or accepted.

## Acceptance still required

- Ordinary purchased account creates and opens an owner-bound snapshot.
- Another account cannot read it; signed-out visitor is required to sign in.
- Chart geometry, dated observations, cues, complete Q&A and settings survive
  storage and reload without mutation.
- PDF visually inspected for pagination, long names/locations and every body.
- Chart click, chapter narration, recorded conversation reread and animation.
- Fresh-device retrieval and later live exploration leave original untouched.
- Deployment secrets/IAM, actual Firestore write/read and retention verification.
