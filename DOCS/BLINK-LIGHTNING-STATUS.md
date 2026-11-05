# Blink Lightning integration status

Updated 2026-10-27. Source implementation and provider configuration inspection; no live invoice/payment/receipt acceptance has been observed.

## Decision and authority

The user requested Blink.sv Lightning POS and intends to supply a wallet key. RevenueCat remains the only commercial authority. Firebase remains identity and the approved operational substrate. A Blink payment is verified settlement evidence that is sent to RevenueCat; it never directly grants local credits or entitlements. No new database/provider beyond the explicitly requested Blink rail is introduced.

## Implemented source

- `netlify/lib/blink-lightning.mjs`: server configuration, configured USD wallet lookup, USD Lightning invoice creation, status lookup, and configured-wallet settlement verification.
- `netlify/lib/blink-revenuecat.mjs`: official one-time external receipt submission with stable purchase/payment identifiers and original provider settlement timestamp.
- `netlify/lib/blink-store.mjs`: existing named Firestore database operational quote/invoice/settlement associations with atomic creation and conditional update.
- `netlify/functions/blink-checkout.mjs`: authenticated `POST /billing/blink/invoice` and `POST /billing/blink/status`.

Both routes require Firebase Bearer auth and JSON `{requestId, kind}`, where kind is reading or experience and requestId is 16–100 letters/digits/underscores/hyphens. The caller preserves requestId across retry and account-bound UI operations. Invoice reply includes paymentRequest, paymentHash, amountMinor, USD currency and expiresAt. Status returns pending/expired or paid with fulfillmentState pending. Only RevenueCat readback can confirm the purchase; server inference/artifact capability readiness remains a separate step.

Invoice creation accepts only configured server catalog prices, reserves the operation before calling Blink, and persists its association before exposing BOLT11. Record ID is SHA-256 of UID plus request ID, preventing another account from selecting it. Duplicate create replays the retained invoice. Ambiguous creation returns recovery-required and never automatically creates another chargeable invoice; externalId is correlation, not documented Blink idempotency. An administrator can recover an uncertain operation using provider evidence; no destructive retry is built in.

Settlement verification requires the recorded invoice hash and BOLT11 plus exactly one transaction in the configured USD wallet, with SUCCESS status, RECEIVE direction, the exact quoted USD cents, a valid provider transaction ID, matching correlation when supplied, and plausible provider timestamp. No preimage, payment secret, wallet key, or service account key leaves the server. This adapter uses USD-cent prices and does not implement a one-satoshi BTC product.

## Firebase operational settings

Project: `gen-lang-client-0714568880`.
Named Firestore database: `ai-studio-remixastrosphere-1ee57c33-6487-411a-a872-59fbf4cbfc63`, taken from existing firebase-applet-config.json.
Collection: `natallyBlinkOperations`.

This is an operational reservation/correlation store, not a commercial ledger or balance authority. It retains immutable quote, invoice and settlement associations for recovery. Existing root Firestore rules deny client access to the collection. Server access uses service-account IAM and the Google OAuth datastore scope. Conditional writes prevent concurrent creation/settlement overwrite. No Firestore database or role was created by this implementation.

## Required server bindings

- `BLINK_API_KEY`: server-only Blink API credential with the required receive/read scope.
- `BLINK_USD_WALLET_ID`: exact receiving USD wallet.
- `FIREBASE_SERVICE_ACCOUNT_JSON`: service account for the configured Firebase project with access to the existing operational database.
- `REVENUECAT_EXTERNAL_API_KEY`: app-specific secret external key, not a Web Billing public key.
- `REVENUECAT_SECRET_API_KEY`: authoritative customer readback.
- `BLINK_PRODUCT_CATALOG_JSON`: object with reading and experience entries, each `{amountMinor, productId, sourceProductId}`. Values must match the configured RevenueCat external catalog. Browser amounts are ignored.
- Optional `BILLING_ALLOWED_ORIGIN`: one validated HTTPS origin, in addition to natally.robin.mba and natally.surge.sh.

No secret value is recorded here or committed. Missing configuration fails before invoice creation. Endpoints are fixed to mainnet Blink, Google OAuth/Firestore, and RevenueCat; redirects are rejected. Quotes expire within five minutes, and provider requests have bounded timeouts.

## RevenueCat integration and actual configuration result

Official External Purchases API accepts `external_purchase` and `external_purchase_payment` at `POST https://api.revenuecat.com/v1/receipts/external`. Purchase customer_id is the authenticated Firebase UID; source_purchase_identifier is blink:paymentHash; payment_identifier is blink:providerTransactionId. Product comes from the immutable server quote mapping. The original provider paidAt is reused for updated_at/processed_at on every retry; changing it can duplicate one-time access transactions. Receipt submission alone is not a grant. The handler reads the authoritative customer record back and confirms the matching production non-subscription purchase before reporting revenuecat_purchase_confirmed.

The current project has no External Source app. Actual v2 app creation response was `parameter_error: 'external' is not one of ['amazon', 'app_store', 'mac_app_store', 'play_store', 'stripe', 'rc_billing', 'roku', 'paddle']`. The authenticated dashboard Apps page explicitly displayed `You don't have permission to add app configurations.` No External Source app/key was created. This is observed API/role evidence; private-beta documentation alone was not treated as a blocker.

Required provider setup is an eligible External Source app, exact product mappings and their rights/NATALTURN grants, and its app-specific secret. Verify actual currency-grant behavior for this app; do not assume ingestion automatically grants NATALTURN. Keep shared ROCHE semantics intact. Refund processing must update RevenueCat; a local entitlement patch is not a substitute.

## Release evidence and remaining work

Generated through the prescribed GLM mechanical coder and source-reviewed. Correction review covers Firestore resource names, conditional-write failure classification, token lifetime, provider transaction-ID shape, and production receipt flag. No build, tests, commit or deploy performed by this subagent.

Missing observed bindings/configuration: Blink wallet key/id, Firebase server service-account binding, RevenueCat External Source app/key/catalog configuration. Root integration must connect invoice display/polling and paid inference/artifact provisioning, deploy the functions, and demonstrate an ordinary-user payment and resulting RevenueCat rights. Source presence is not deployed payment acceptance.

## Primary references

- [Blink USD Lightning receive](https://dev.blink.sv/api/usd-ln-receive)
- [Blink GraphQL reference](https://dev.blink.sv/public-api-reference.html)
- [Blink authentication](https://dev.blink.sv/api/auth)
- [RevenueCat External Purchases API](https://www.revenuecat.com/docs/external-purchases-api-beta)
- [Firestore REST authentication](https://firebase.google.com/docs/firestore/use-rest-api)

Canonical KStore Admin-Manual mirror: `PROJECTS/Natally/INFRA/blink-lightning.md`.
