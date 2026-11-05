# Billing chain end-to-end — 2026-11-01

Redemption -> per-user OpenRouter key with spend limit -> real natal chart reading.

- Firebase test user W5Pe0l9aeGMBY3LSpWkxAhDvsZw2 (natally-e2e-20261101@robin.mba)
- POST /billing/redeem (code + requestId e2e-fbwallet-0002): 200, state ready,
  creditBalance 10,000,000 ROCHE = $10, receipt b1def6eb44cf1903683783c4c78ff3eb6d004d0ccd0e56be39e91348bc997efe
- Managed key provisioned: sk-or-v1-…f6bf11, provider limit exactly $10, 1h expiry, generation 1
- Reading THROUGH the key: openrouter/free (nvidia/nemotron router), 2,574 chars
  grounded in the Aurelia chart facts — reading-through-managed-key.txt
- Idempotency: identical requestId re-redeem returns the same receipt, same
  balance, no double grant, key generation unchanged
- Wallet: billing/firebase-wallet.mjs (BILLING_CREDIT_BALANCE_STORE=firebase per
  billing/credit-policy.mjs); ledger on the app's own Firestore
  (gen-lang-client-0714568880, named database)
- Not yet exercised: the deployed backend path (Cloud Run frozen per the
  cost-gating ruling; portable runtime proven locally), the purchase
  (RevenueCat/Stripe) grant path, and the 4000bps top-up increment on a live
  purchase — wallet arithmetic for top-ups is unit-level identical to the
  redemption SET path proven here.
