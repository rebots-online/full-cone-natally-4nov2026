# Natally learning and payment guide

Updated 2026-10-22. Product entry point: prominent **Learn & payments** header button. Implementation: `src/components/LearnAndPayments.tsx`, native modal dialog rendered through a portal. Interface: `{ open: boolean; onClose: () => void }`. Navigation: **Start here**, **Free lessons**, **Payments**. Native dialog handles modal keyboard focus; Escape and Close return to the application. Each article/payment topic expands independently.

## Free learning collection

These articles are available without a purchase or credit debit. Their body copy currently lives in the component's `lessons` collection. IDs are stable migration identifiers for a possible future LMS or public learning pages. No LMS, completion tracking, certificate, external marketing subscription or analytics service is provisioned by this change.

| Stable ID | Article | Learning objective | In-product activity |
| --- | --- | --- | --- |
| two-skies | Your birth chart and the sky now | Distinguish natal positions from a dated observation | Locate gold/cyan labels and the observation date |
| planets-signs | Planets and signs: a symbolic vocabulary | Separate calculated position from symbolic interpretation | Ask about Mercury, including which part is calculated |
| houses | Houses: areas of life | Understand houses and birth-time limitations | Discuss one house, with unknown birth time qualified |
| aspects | Aspects: follow both ends of the line | Recognize major aspect angles, orb, and current-to-natal endpoints | Hover/select a relationship and identify both labels |
| reflect | Make the reading a conversation | Use astrology reflectively without treating it as established prediction | Request a quick now reading and one specific follow-up |

Original concise educational copy uses conventional Western astrological vocabulary. It describes symbolic interpretation as such and does not represent it as scientifically established prediction. Further reading links: [Astrodienst introduction](https://www.astro.com/astrology/in_intro_e.htm) and [Faculty of Astrological Studies introduction](https://astrology.org.uk/wordpress/wp-content/uploads/IntroducingAstrology.pdf). Product-specific instructions describe Natally's intended current UI; final recorded journey must demonstrate those controls before completion is claimed.

## Offer and payment communication

The latest architecture amendment OFFER-1/2 supersedes older purchase-first exploration language. The guide explains upfront offer → **Explore free first** → generation and exploration → gentle offer at product download points. Verified prepaid access bypasses the offer for its covered download. Dismissal preserves conversation. No unlimited future usage, catalog price, recurring terms, credit exchange or active checkout is invented.

Current local integration status: checkout and verified purchase access are not connected. A RevenueCat offering design/identifier is not proof of purchasable products. Existing catalog investigation identified Natally offering `ofrng352609e01b` without confirmed attached products/price. `AICREDIT` versus `ROCHE` remains unresolved; the guide does not expose a spendable balance or conversion. These are implementation records, not consumer checkout instructions.

### Primary sources checked for the payment guide

- [RevenueCat entitlements](https://www.revenuecat.com/docs/getting-started/entitlements): products can grant access rights. The guide distinguishes downloadable-product access from conversational credits; it does not turn a prototype paywall into an active payment claim.
- [Alby Hub official repository](https://github.com/getAlby/hub): wallet connectivity through Nostr Wallet Connect. Connecting a wallet is not a Natally authentication flow or evidence of download ownership. A future per-turn quote needs to show what payment covers.
- [Blink point-of-sale guide](https://faq.blink.sv/blink-payment-methods/lightning-address/what-is-the-cash-register-in-blink): browser POS generates Lightning invoices for receiving Bitcoin payments. An invoice must be tied to a Natally order and its settlement verified before fulfillment; no merchant payment URL is published here.
- [Official x402 v2 specification](https://github.com/x402-foundation/x402/blob/main/specs/x402-specification-v2.md): payment requirements enumerate accepted mechanisms, networks, assets, amounts and recipients. Protocol availability does not establish which assets Natally accepts. Publish the exact configured catalog before presenting a payment choice.

The guide has no payment button, wallet-secret field, checkout link, or accepted-coin catalog. External links are documentation only. Payment sections explicitly state **No live checkout connected**.

### Legacy seam found during alignment

`src/services/x402Access.ts` contains an earlier custom WebLN challenge adapter with a hard-coded 2000-sat amount and client localStorage grant after `sendPayment`. This is not evidence of a verified server entitlement or standard x402 compatibility. The new guide deliberately does not promote that amount/flow. Integration must not treat this legacy flag as authorization for paid downloads; authenticated server verification remains required under OFFER-2. No changes to that service are part of this scoped content task.

## Continuous demonstration additions

In the full application journey, open the prominent guide; move through Start here, each free lesson, and Payments; expand every provider explanation; show availability wording and documentation links; close with Escape and return to the preserved reading. Repeat at mobile width to demonstrate readable text, reachable Close/navigation, and scrolling. Show lessons remain accessible without a paid download grant. This document records required evidence, not a claim that the tour has been recorded.
