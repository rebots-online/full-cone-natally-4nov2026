# Coupon entry and product display names — 27 October 2026

Status: IN_PROGRESS. This is internal implementation/acceptance documentation,
not customer-facing content.

## Live product naming correction

Updated and independently read back RevenueCat product display names:

| Product | Customer-facing name | Preserved internal identifier |
| --- | --- | --- |
| proda88125bed7 | Souvenir reading | natally_reading_test_v3 |
| prod2f046e3b64 | Exploration credits | natally_roche_test_v3 |

No price, product identity, entitlement or currency grant was changed by this
rename. The historical internal identifier is not customer copy. Provider API
readback confirms names; a newly rendered completed checkout has not been observed.
No customer-facing tester/evaluation disclaimer should be rendered.

## Supported discount entry

RevenueCat Web Billing supports percentage discount codes for one-time products.
Its hosted checkout validates the code, product eligibility and customer
eligibility and presents the resulting price. The installed purchases-js 1.73.1
PurchaseParams exposes `showDiscountCodeField`, optional `discountCode`, and
`onDiscountCodeChanged`. Set `showDiscountCodeField: true` in the existing
purchase call to expose provider-owned input. No separate local coupon validation,
price calculation, credential API or commercial ledger is needed.

Implementation assigned to the paywall agent owning `revenueCatCheckout.ts`;
confirmation/rendered observation remains pending in this note until read back.
Keep the direct offer-to-checkout journey. A full checkout lets the customer enter
a code; express wallet checkout can skip that input. No code entry grants rights:
RevenueCat settlement and backend authorization remain necessary.

Official source: https://www.revenuecat.com/docs/web/web-billing/discounts
API: https://www.revenuecat.com/docs/api-v2/discount
Installed types: node_modules/@revenuecat/purchases-js/dist/Purchases.es.d.ts

Live API `GET /projects/projaba0bd94/discounts` returned an empty list with no next
page. There is no configured campaign/code to use for a successful redemption
observation. No percentage, code, eligibility policy or promotion was invented.
The requested input can be enabled independently of creating a commercial offer.

## AppSumo boundary

An AppSumo marketplace coupon is not automatically a Natally discount or a
Natally license. AppSumo's own documentation distinguishes partner code redemption
from partner OAuth/webhook licensing. Its purchased-code flow requires unique
issued codes and a redemption page; its licensing flow requires a real deal/tier
mapping and authenticated provider integration. A generic Web Billing promo field
cannot validate an arbitrary AppSumo receipt or purchased license.

No AppSumo campaign/deal/credential record was found in the KStore document
registry. No partner registration, license grant, arbitrary discount code, new
provider, or parallel balance record was created. Before activating that path,
recover the actual deal, issued codes or partner API configuration and specified
benefits; map confirmed rights to the same RevenueCat/Firebase customer and handle
refund/deactivation. Keep provider code validation separate from client text entry.

Official source: https://help.appsumo.com/article/93-how-do-i-set-up-my-redemption-flow

## Required observation

After provider input integration: open both offer checkouts and show the field;
invalid code must grant nothing and retain the selected product. Once a real
approved campaign exists, verify the actual discounted price and receipt,
customer binding, cancellation/retry and resulting RevenueCat rights. AppSumo
acceptance requires its actual partner flow, not a screenshot of a promo field.

## Checkout source confirmation

The paywall agent connected `showDiscountCodeField: true` in the existing SDK
purchase call and supplied the installed SDK label override
`en.discount_input.label = 'Have a code?'`. Readback of the integrated source
confirms both. The neutral wording is the operator's requested visible label;
provider Apply/error/price behavior remains authoritative. The override exists in
the installed runtime but is not in public typings; source uses a narrow typed
intersection. Rendered checkout and a successful valid-code redemption remain
unobserved. No campaign/code was created by this source change.
