# Credit configuration and selector checkpoint

Operator's settled customer balance is Firebase credits approximately corresponding
to tokens. Earlier ROCHE customer-balance requirements are superseded. No numerical
conversion is invented here. `.env` and `.env.example` now agree on
BILLING_CREDIT_UNIT=approximate_token and BILLING_CREDIT_BALANCE_STORE=firebase.
The existing helper preserved every prior live value and comment. Live env SHA256
66a1ab533f760b34ceb12a2be61b2f27d7f8342568de626f665d45fcde46bae5.
No BILLING_CREDITS_PER_TOKEN was added. Credential values were not changed.

Pack selector source accepts documented tier1, reads the annotated public default
tier5 and shares selection between checkoutCatalog and PurchaseAccess. Source
review confirms monthly configured tier then same-tier one-time, no automatic
substitution when absent, and preserved explicit selection/owner/expiry guards.
Coder ran tsc successfully and actual helper-resolved catalog checks: both
platforms currently have zero configured packs; automatic selection is null and
implicit checkout rejects without provider calls. This is not purchase acceptance.

The preexisting synthetic checkout test harness lacks the new shared-module import
and default binding. It was not used to claim runtime success; compatibility work
remains. No new synthetic scenarios are included. This pushed checkpoint preserves
source/configuration; no build or deployment of these changes has occurred.

Next: align actual Firebase purchase crediting and OpenRouter session provisioning
with the existing configured allocation, then verify real fulfillment before the
prescribed all-platform build. Recording remains held.

Canonical current-head corrections were written with exact readback, preserving
the full previous bodies under superseded-history notices:
- PROJECTS/Natally/ARCHITECTURE/billing-governing.md revision/head2,
  SHA256fbe87a1856fa90acdd455a892b5003a021f5a24eb44a29268d86a3c028b594bc.
- PROJECTS/Natally/INFRA/revenuecat-paid-fulfillment.md revision/head5,
  SHA256c88260696231e357674c970cd0e15d34ee2c4879e9cd57e67c3c5355416ed0ff.
These contain the exact governing correction/flow, not a runtime success claim.

## 30 October redemption continuation evidence

Credit policy source d300e511 was semantically reviewed and pushed. Live annotated
.env synchronization preserves all values/pointers; SHA256
fd8fca4960654e5fb3b9b00e9234226c8d1849afcd3a8300be323fd85b82c9f3.
Repeated synchronization is byte-identical; .env.local remains absent.

Firebase CLI login:list succeeded with one authenticated account. Explicit
functions:list for gen-lang-client-0714568880 failed HTTP403: Cloud Functions API
disabled/not previously used. This is not evidence of an empty function inventory.
No firebase.json/.firebaserc/functions source was established. Canonical
checkout-and-play-binding-28oct2026.md rev8 and SESSION-ADAPTER-INTEGRATION.md
explicitly do not authorize the historical Netlify host as the replacement.
Operator decision requested for enabling Functions in the existing Firebase project.

Server default model prices were read from actual OpenRouter catalog: the configured
fallbacks are free. No paid USD equivalent for a million tokens follows from zero
prices. Requested explicit redemption USD ceiling; million-credit quantity is fixed
by operator request and is not being reopened. No runtime deployment or actual grant
has occurred. Educational wording and recording remain held.

## Redemption policy and Analytics source review

Published architecture41e5f830 and recipedd7f1a6f preceded the two coder tasks.
Supervisor reviewed exact case-sensitive matching, positive safe integer credits,
BigInt decimal USD conversion and no I/O in redemption-policy.mjs. Actual live
configuration contains the requested code/campaign and 1000000 credits; allowance
is blank and the reader rejects that named binding. No grant was performed.
Live .env SHA256 edd06921c519cfab8b2531d5718d3310e4b4a914c9fac1ca0522dd8ab72d29e9;
all prior values/comments/pointers preserved; repeated synchronization identical.

Analytics exports restoreRedemptionAnalytics and trackRedemptionCompleted take
actual receipt facts only; completion requires a durable grant plus usable access.
Supervisor reviewed same-receipt pending event preservation, per-session dedupe,
clearing on null/different account receipt and preservation of other user properties.
Only campaign and credit count enter the new event, not code/key/UID/receipt ID.
Caller integration and actual collection remain unimplemented/unverified.
node --check and tsc --noEmit passed; git diff --check passed. No build/deployment
or screencast was performed for these changes. Existing full goal remains active.

## Firebase grant store and session binding — 30 October continuation

Architecture515f74bf/recipee79de304 precede the real Firestore grant store;
session binding architecturef0d6acd0/recipe219949d6 precede sourceeac4ad19.
Supervisor reviewed shared OAuth extraction against original Blink code: scope,
project/database checks, timeout, errors and Blink operational methods preserved.
Credit store uses one atomic receipt-create and account-CAS commit, exact source
identity, safe BigInt addition, immutable receipt comparison and bounded rereads.
Existing receipt plus missing/malformed account rejects instead of recreating it.
Session adapter now consumes Firebase account allowance, not RevenueCat currency.

All three store/auth modules passed syntax and import checks. No factory was
invoked and no live grants/provider calls were performed. Actual authentication,
settlement, usage debiting and runtime integration still require acceptance.

Scoped canonical credential reads found no usable FIREBASE_SERVICE_ACCOUNT_JSON:
CREDENTIALS/Natally/credentials.env is absent; two recorded environment checkpoints
lack that binding; PROJECTS/Natally/INFRA/blink-lightning.md rev2 declares it but
contains no value/pointer. This is scoped evidence, not a claim about other vaults.
Runtime enabling and redemption USD ceiling questions remain pending.

## Operator USD correction applied

The redemption is USD10, not a million-credit grant. Live
BILLING_REDEMPTION_ALLOWANCE_USD="10.00" and BILLING_REDEMPTION_CREDITS="".
Only these two live values changed; existing code/campaign/pointers preserved.
Exact pre-edit checkpoint retained; updated live SHA256
77c1514da0122f1e0eb84b385b57a52f1bc26aff0e5eff862075a29b51c99838.
Portable example has blank installation values and annotated10.00 example.
Synchronization validation passed and repeated execution is byte-identical.
Current policy still requires a configured credit quantity; monetary redemption
integration is not yet functional and no substitute quantity is claimed.

Authenticated project listing resolves the operator's infrastructure project to
rochemediaservices-infra (RocheMediaServices-Infra). Its Functions inventory returned
SERVICE_DISABLED; this is not an empty inventory. Natally auth/named database remain
in gen-lang-client-0714568880. No services or project configuration were changed.
