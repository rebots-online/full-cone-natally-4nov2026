## Settled customer and ROCHE architecture — 27 October 2026

The operator has answered the architecture question. This supersedes the prior
pending-approval text and suggestion to add Hugging Face hosting. Do not add
hosting services or expand the rejected Netlify drafts.

RevenueCat owns the customer account, purchases, entitlements and shared balance,
enumerated and displayed as ROCHE. Other apps may award ROCHE that customers can
spend in Natally. Rewards, gift-code grants and purchases feed the same authoritative
customer balance; do not create a separate Natally-only commercial ledger.
Firebase holds operational data, including conversations, keyed or linked to the
RevenueCat customer identity. Preserve the existing authentication integration.

On account creation, reuse the customer's existing OpenRouter key if present;
otherwise provision one using the administrative OpenRouter API
with zero spending allowance. Purchase allocation increases its spend allowance
using the percentage configured in .env. Credit purchases grant ROCHE; a souvenir
purchase provides sufficient ROCHE for at least ten exploratory turns in addition
to its reading and souvenir deliverables. Customer/key association belongs with
the RevenueCat customer; the operator prefers a customer-record field for the key.
Verify provider field/API behavior before claiming that storage is implemented.

The optional field remains "Have a code?" with an "Apply" action. Support single-use
redemption codes (including configured partner/AppSumo codes), gift codes granting
ROCHE without a purchase, code benefits alongside a purchase, and percentage offers
such as 25% off. Enforce the actual code's redemption and combination rules. A
percentage offer changes the payable price; a ROCHE gift grants currency. Repeated
submission must not grant a single-use benefit twice. Display actual authoritative
ROCHE balance and actual checkout price, never an invented successful redemption.

Status: requirements confirmed; implementation and live purchase/redemption,
cross-app balance and allowance synchronization still need verification.

## Issued-code attribution rule

Gift and percentage-off codes default to individually issued, single-use codes
validated against the issued-code list. Do not assume discounts are reusable.
Each code retains its campaign and intended marketing target; successful redemption
records the RevenueCat customer and redemption outcome against that attribution.
Keep intended target and actual redeemer distinguishable for campaign analytics.
Enforce any explicit recipient restriction without assuming every target is an
email address. Reusable or shareable codes require an explicit campaign exception;
they are not the default. Duplicate/retried redemption must not grant benefits
again. The code is a mutually beneficial attributed marketing instrument, not
an anonymous generic coupon. Implementation and live verification remain pending.

## Component and authority model

These diagrams specify the required behavior. They do not assert that the missing
provisioning and redemption operations have been implemented or deployed. No new
hosting provider is part of this model.

```mermaid
flowchart LR
  APP["Natally web / Windows / Android"] -->|customer, purchases, entitlements, ROCHE| RC["RevenueCat: commercial authority"]
  APPS["Other Roche apps"] -->|rewards and spends for same customer| RC
  APP -->|operational data linked to RC customer| FB["Firebase: auth and operational data"]
  APP -->|user inference key| OR["OpenRouter: inference and allowance"]
  RC -->|verified commercial events| OPS["Provisioning / redemption operations: implementation incomplete"]
  OPS -->|admin API: create zero-limit key or update limit| OR
  OPS -->|customer key association and ROCHE transactions| RC
  APP --> LOCAL["Local chart, PDF, authored voice and frozen exploration"]
```

## Account, payment and code flows

```mermaid
flowchart TD
  SIGNUP["Authenticated account"] --> CUSTOMER["Resolve same RevenueCat customer"]
  CUSTOMER --> HASKEY{"Existing user OpenRouter key?"}
  HASKEY -->|yes| REUSE["Reuse key"]
  HASKEY -->|no| EMPTY["Provision key with zero allowance"]
  EMPTY --> LINK["Associate key with RC customer"]
  REUSE --> LINK
  PAYMENT["Verified purchase"] --> KIND{"Purchase kind"}
  KIND -->|credits| ALLOC["Allocate configured percentage of paid amount"]
  KIND -->|souvenir| TEN["Fund at least ten exploratory turns plus reading deliverables"]
  ALLOC --> GRANT["Grant ROCHE in RevenueCat"]
  TEN --> GRANT
  REWARD["Reward from another app"] --> GRANT
  GRANT --> SYNC["Update OpenRouter allowance without duplicate grants"]
  SYNC --> DISPLAY["Refresh and display authoritative ROCHE balance"]
  CODE["Have a code? / Apply"] --> LOOKUP["Look up issued code and campaign target"]
  LOOKUP --> VALID{"Valid, eligible, unused?"}
  VALID -->|no| REJECT["Explain rejection; grant nothing"]
  VALID -->|yes| BENEFIT{"Code benefit"}
  BENEFIT -->|ROCHE gift| ONCE["Redeem once, attribute actual customer"]
  ONCE --> GRANT
  BENEFIT -->|percentage offer| PRICE["Apply offer to actual checkout price"]
  PRICE --> PAYMENT
  PAYMENT --> ATTR["Record redemption and campaign attribution once"]
```

## Paid exploration and preserved content

```mermaid
flowchart TD
  ACTION{"Customer action"} -->|new inference| CHECK["Check RC ROCHE and user-key allowance"]
  CHECK --> ENOUGH{"Funded access?"}
  ENOUGH -->|no| OFFERS["Show direct purchase offers"]
  ENOUGH -->|yes| INFER["OpenRouter via customer key"]
  INFER --> USAGE["Apply actual usage to authoritative ROCHE"]
  USAGE --> SAVE["Save operational conversation in Firebase"]
  ACTION -->|existing souvenir| OWN["Verify RC souvenir entitlement"]
  OWN --> REPLAY["Open preserved interactive encyclopedia / PDF / voice"]
  ACTION -->|free chart exploration| AUTHORED["Calculated chart and prewritten text via existing voice engine"]
```

Brainstormer executable import compatibility is not asserted; these are structured
Mermaid source diagrams. No Brainstormer investigation is required for this record.
