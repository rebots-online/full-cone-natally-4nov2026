# Pricing and HST worksheet — proposal, 28 October 2026

This is a cost model for discussion, not a claim about the operator's negotiated
provider rates, tax registration, live product prices or final tax classification.
Amounts below are Canadian dollars; native storefronts must show localized real
prices. Existing USD-priced products are not silently relabelled CAD.

Latest operator update, 28 October: **$5 minimum across the board**. Implement
monthly **$5, $10 and $25** packs and one-off packs with the same minimum.
Monthly subscriptions are primary; one-offs have a less preferential
ROCHE-per-dollar rate. Historical $1 calculations below remain a comparison,
not an active launch offer. **Do not add Stripe Tax API**;
use existing transaction records for our own accounting and remittance. The
optional Tax API cases below explain a rejected cost, not a chosen integration.
This supersedes the intervening request to include $1. The operator confirms
merchant setup and Google reduced-fee enrollment are not yet completed.

ITC eligibility and allocation of expenses among businesses/projects are the
operator's accounting decisions. The payment-provider fee does not include
deciding those ITCs or assigning those allocations. Stripe Tax calculates tax
on customer transactions from configured tax facts; that is a different task.
Automation may retain invoices, export records and perform arithmetic on
operator-approved classifications, but must not approve eligibility or allocation.
[Stripe Tax scope](https://docs.stripe.com/tax/how-tax-works).

## Provider rates and calculation basis

- Canadian domestic online card: Stripe Payments 2.9% + CA$0.30. International
  cards add 0.8%; required currency conversion adds 2%. Stripe Billing is a
  separate 0.7% service if used. [Stripe Canada pricing](https://stripe.com/en-ca/pricing).
- RevenueCat is free up to its US$2,500 monthly tracked revenue threshold, then
  charges 1% of tracked revenue. The worksheet deliberately uses the full 1%
  requested. MTR is before store fees and taxes, so the tax-inclusive example
  budgets RC against the whole customer payment. Its monthly charge/rounding
  can differ from a per-sale allocation. [Pricing](https://www.revenuecat.com/pricing),
  [account billing basis](https://www.revenuecat.com/docs/welcome/set-up-revenuecat/account-management).
- RevenueCat Billing uses Stripe as processor; it does not require adding
  Stripe Billing's 0.7%. RevenueCat documents a separate fixed Stripe Tax API
  fee if that tax provider is enabled, not the 0.5% no-code checkout rate.
  [RevenueCat web fee comparison](https://www.revenuecat.com/docs/web/overview).
  The Canadian API tariff is CA$0.50 per taxable transaction, including ten
  calculation calls; additional calls are CA$0.05. [Stripe Canada pricing](https://stripe.com/en-ca/pricing).

## Requested $1, $5 and $10 amounts

First, treating the requested amount as the **whole card charge**, with no
customer tax added and no Tax API service: fee = `0.039 * charge + 0.30`.

| Whole charge | Stripe | RC at 1% | Combined fees | Effective fee | Remaining before inference |
| ---: | ---: | ---: | ---: | ---: | ---: |
| $1.00 | $0.329 | $0.010 | $0.339 (~$0.34) | 33.90% | $0.661 |
| $5.00 | $0.445 | $0.050 | $0.495 (~$0.50) | 9.90% | $4.505 |
| $10.00 | $0.590 | $0.100 | $0.690 ($0.69) | 6.90% | $9.310 |
| $25.00 | $1.025 | $0.250 | $1.275 (~$1.28) | 5.10% | $23.725 |

Then, the fuller **Ontario taxable prepaid-service illustration**: requested
amount is the pre-tax price; 13% HST is added; RevenueCat Billing + Stripe
Payments + Stripe Tax API are enabled. HST itself is collected for remittance,
not revenue available to fund tokens. Actual provider rounding may vary by cents.

`C = round(price * 1.13, 2)`

`payment_and_RC_fees = 0.039 * C + 0.30`

`fees_with_tax_service = payment_and_RC_fees + 0.50`

`available_before_inference = price - fees_with_tax_service`

| Pre-tax price | HST | Customer pays | Stripe + RC | Including Tax API | Remaining after HST/fees | 40% inference budget | Remainder after that budget |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| $1.00 | $0.13 | $1.13 | $0.3441 | $0.8441 | $0.1559 | $0.40 | **-$0.2441** |
| $5.00 | $0.65 | $5.65 | $0.5204 | $1.0204 | $3.9796 | $2.00 | $1.9796 |
| $10.00 | $1.30 | $11.30 | $0.7407 | $1.2407 | $8.7593 | $4.00 | $4.7593 |
| $25.00 | $3.25 | $28.25 | $1.4018 | $1.9018 | $23.0982 | $10.00 | $13.0982 |

The CA$9.99 keepsake would cost an Ontario customer CA$11.29 under these tax
assumptions. Approximate provider fees including Tax API are CA$1.2403; remaining
sale revenue after customer HST and those fees is CA$8.7497 before fulfillment.
The proposed 40% inference allocation applies to credit packs, not automatically
to this artifact add-on.

These totals include the named transaction services, not unverified tax on
provider invoices, foreign-exchange charges, extra tax API calls, dispute/refund
costs, or an optional billing product. Applicable tax on service fees and input
tax credits depend on the actual account and invoices. Therefore they are
explicit scenarios, not a falsely precise universal all-in quote. If Tax API is
not used, remove $0.50 per transaction; no substitute tax provider is authorized.

Recommendation for discussion: default CA$10/month and normal CA$5 top-up floor.
A routine CA$1 taxable purchase with this fixed Tax API fee cannot cover the
minimum 40% allocation. No live SKU has been changed by this recommendation.

## Native Google Play costs

### Four amounts and current enrollment status

The following illustration excludes customer tax and assumes full-rate 1%
RevenueCat. Monthly subscriptions use the standard 15% Play fee. Since the
operator says reduced-fee enrollment is unfinished, budget 30% for Canadian one-offs
until actual eligibility/enrollment is confirmed. The live Play payments page
was inspected on 28 October and still offers enrollment, requiring an account
group and acceptance of service-fee terms. There is no fixed Stripe
payment fee or Stripe Tax API fee on this Play route.

| Pre-tax sale | Monthly Play fee 15% | RC 1% | Monthly net before inference | One-off Play fee 30% | One-off net before inference |
| ---: | ---: | ---: | ---: | ---: | ---: |
| $1 | $0.15 | $0.01 | $0.84 | $0.30 | $0.69 |
| $5 | $0.75 | $0.05 | $4.20 | $1.50 | $3.45 |
| $10 | $1.50 | $0.10 | $8.40 | $3.00 | $6.90 |
| $25 | $3.75 | $0.25 | $21.00 | $7.50 | $17.25 |

At a 40% inference allocation, monthly amounts remaining before other expenses
are $0.44, $2.20, $4.40 and $11.00 respectively. Adding Ontario HST to the sale
and budgeting RC on that gross payment changes the monthly pre-inference nets
to approximately $0.84, $4.19, $8.39 and $20.97. Actual receipts/settlements
determine invoice rounding and final tax deductions; these are estimates.

### Why the rejected Stripe Tax API tariff matters: two cases

1. **A $1 top-up on web, Ontario HST added.** Customer pays $1.13; $0.13 is
   customer tax. Stripe Payments plus RC cost approximately $0.3441. Without
   Stripe Tax API, $0.6559 remains before inference. Adding its $0.50 tariff
   would reduce that to $0.1559, leaving a $0.2441 loss after the proposed $0.40
   inference allocation. The extra tariff alone consumes 50% of the pre-tax sale.
2. **A $25 monthly web charge, same assumptions.** Customer pays $28.25,
   including $3.25 HST. Payments plus RC cost approximately $1.4018, leaving
   $23.5982 before inference. Stripe Tax API would reduce that to $23.0982.
   The tariff is 2% of the pre-tax sale and recurs on each monthly taxable charge.

The tariff would also affect other apps using RevenueCat Billing with Stripe
Tax enabled, qualifying one-off web keepsakes, and subscription renewals in
registered tax jurisdictions. It does not apply merely because an app uses
RevenueCat, nor to Play purchases or our own bookkeeping. Stripe's 0.5% no-code
Tax tariff is a different integration path, not the API tariff RevenueCat lists.
Gift-code issuance/redemption must use the applicable tax point, not charge tax
twice. The actual Canadian account tariff must be checked against invoices;
the reference to 50 American cents in RC's guide is its US pricing example.

### Our records and remittance

Keep the customer receipt, transaction ID, pre-tax amount, tax jurisdiction/rate,
tax amount, provider deductions, refunds, settlement and RevenueCat grant linked
for reconciliation. Report HST collected and eligible input tax credits separately.
Net GST/HST may be zero or refundable, but income-tax profit and GST/HST net tax
are different calculations. Provider fee invoices determine any eligible ITCs;
do not assume every business expense carries recoverable tax. Do not purchase an
automatic tax service to perform this bookkeeping. Operator registration status
and marketplace tax responsibility still determine actual collection/remittance.

For the standard Canadian auto-renewing subscription schedule, budget 15% Play
service fee plus full-rate 1% RevenueCat, with no Stripe card or Tax API fee for
the Play transaction. One-time top-ups use the applicable Play IAP tier: the
15% tier requires enrollment and has a US$1m threshold, with the applicable
higher rate beyond it. On 28 October the live account still offered enrollment;
its account-group and terms steps were not completed. [Play service fees](https://support.google.com/googleplay/android-developer/answer/112622).

Current official schedule rechecked 28 October 2026: the new regional schedule
already applies to the US/EEA/UK from 30 June and Australia/Japan from 30 September.
In those regions, Play-billed subscriptions total 15% (10% service plus 5% billing).
Standard one-offs total 25% for new installs or 30% for existing installs; the
first-US$1m/program rates depend on eligibility. Thus 30% is not a universal
one-off rate. Canada's existing subscription rate remains 15%; the rest-of-world
change is scheduled for 30 September 2027 and its billing fee is not yet specified.
[Current Play fee table](https://support.google.com/googleplay/android-developer/answer/112622),
[rollout dates and install definitions](https://support.google.com/googleplay/android-developer/answer/16954621).

### Ontario monthly receipt illustration, verified arithmetic

This worksheet assumes a taxable monthly service, prices before 13% Ontario HST,
Play fee of 15% of that pre-tax price, and full RevenueCat fee of 1% of the gross
customer charge. RevenueCat's current account guidance explicitly measures MTR
before store commission and taxes. Tax on provider invoices, refunds and foreign
exchange are excluded until the actual invoices establish them. Values retain
four decimals to expose the calculation, not to predict provider cent rounding.

| Pre-tax monthly price | Customer pays | Customer HST | Play fee | RC at 1% gross | After customer HST and named fees | 40% inference allocation | After that allocation |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| $1.00 (historical comparison) | $1.13 | $0.13 | $0.15 | $0.0113 | $0.8387 | $0.40 | $0.4387 |
| $5.00 | $5.65 | $0.65 | $0.75 | $0.0565 | $4.1935 | $2.00 | $2.1935 |
| $10.00 | $11.30 | $1.30 | $1.50 | $0.1130 | $8.3870 | $4.00 | $4.3870 |
| $25.00 | $28.25 | $3.25 | $3.75 | $0.2825 | $20.9675 | $10.00 | $10.9675 |

`net = P - 0.15P - 0.01(1.13P) = 0.8387P`.
The allocation column is a CAD cost allocation, not an invented ROCHE quantity
or an OpenRouter USD conversion. Configure those only from the agreed policy.

If the Canadian operator is not regularly GST/HST registered, Google says it
also charges GST/HST on its service fee. For an Ontario operator, applying 13%
to the assumed Play fee would add $0.0195/$0.0975/$0.1950/$0.4875 respectively,
reducing the four pre-inference amounts to $0.8192/$4.0960/$8.1920/$20.4800.
This is a separate scenario; do not infer registration from an empty form or
claim a refundable ITC for an unregistered operator.
[Google's Canadian tax treatment](https://support.google.com/googleplay/android-developer/answer/138000?hl=en).

Google Play's virtual-currency rule limits purchased currency to its app/game
title. That is a material conflict with unrestricted use of Play-purchased ROCHE
across unrelated apps, not with restoring the same Natally account on another
device. Preserve RevenueCat as authority; resolve distribution eligibility and
currency spending scope explicitly before product activation. Do not quietly
introduce a separate wallet. [Google Play Payments policy](https://support.google.com/googleplay/android-developer/answer/9858738?hl=en).

## HST and related Canadian taxes

1. **Registration is operator-wide.** The normal small-supplier test considers
   worldwide taxable supplies across the sole proprietor's businesses, including
   relevant associates, not just Natally or one trade name. The ordinary threshold
   is $30,000 in a single calendar quarter or the preceding four consecutive
   quarters; the timing rules differ. Voluntary registration also creates
   collection obligations. This turn did not establish Roche Media Services'
   GST/HST registration when first drafted. Subsequent live inspection on
   28 October found accepted Canadian tax information with a GST/HST registration
   number in the existing Google Play payments profile (submitted 24 March 2026,
   Individual). This establishes what Google currently has on file, not an
   independent CRA registration lookup. The number is not needed in this public
   cost worksheet. [CRA registration rules](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/when-register-charge.html).
2. **Apply the customer's relevant place of supply.** Ontario HST is 13%; Nova
   Scotia is 14% since April 2025; New Brunswick, Newfoundland and Labrador, and
   PEI are 15%. Other provinces/territories have 5% federal GST, with separate
   provincial taxes potentially relevant. Do not hardcode Ontario HST globally.
   [CRA rates](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate/calculator.html),
   [place-of-supply rules](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-place-supply.html).
3. **Credits are not automatically tax-free gift cards.** A qualifying gift
   certificate is generally not taxed when issued; applicable tax arises on its
   redemption. A limited service subscription/prepayment and a true monetary
   gift certificate are not interchangeable labels. Confirm ROCHE's actual
   contractual classification and tax point before adopting the illustration
   as configuration. Do not charge twice at purchase and redemption. [CRA gift
   certificates](https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/p-202/gift-certificates.html).
4. **Play does not always take over Canadian HST.** Google's guidance says a
   developer located in Canada who provides its GST/HST ID is responsible for
   determining, charging and remitting GST/HST. Handling differs without that
   registration and for provincial taxes. Configure the actual payments profile
   and preserve tax receipts; do not assume Play remits everything. [Google's
   Canadian tax rules](https://support.google.com/googleplay/android-developer/answer/138000?hl=en).

### Observed account and bookkeeping boundary

The existing developer account is `5081294861182355482`, accessed through
`robin.realtor416@gmail.com`. On 28 October its live payments UI showed a Canadian
individual payments profile, accepted Canadian tax information including a
GST/HST registration number, no transactions, CA$0 earnings, and no payout method
yet added. Reduced-fee enrollment was offered but unfinished. No form was saved,
banking information supplied, enrollment accepted, or tax record changed.

On Google's stated rule, the supplied GST/HST ID places this account in its
Canadian-registered-developer treatment, subject to the correctness of that
existing record. Retain customer tax as a separate payable and reconcile the
Play settlement; it is not inference revenue. Under the regular method, net
GST/HST is tax collected or collectible minus eligible ITCs and applicable
adjustments. An expected nil balance or refund does not by itself remove the
collection/reporting obligation. The operator decides ITC eligibility and
business/project allocation; automation only calculates approved amounts.
[CRA regular-method calculation](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/calculate-prepare-report/calculate-net-gst-hst.html).

## ROCHE quantity calculation to approve

Let `P` be the actual discounted package price excluding customer tax, `a >= 0.40`
the approved allocation, `f` the configured CAD-to-USD conversion, and `c` the
approved maximum USD cost per billed token across permitted models/token types.

`inference_budget_USD = P * a * f`

`guaranteed_token_grant = floor(inference_budget_USD / c)`

Using the maximum supported unit cost prevents a pack of output tokens exceeding
its budget; cheaper usage leaves margin that can fund a more generous published
grant after explicit approval. One ROCHE per billed token requires this declared
model/rate envelope. Cross-app reward issuers must honor the same unit economics;
changing existing shared currency units requires an explicit migration decision.
An OpenRouter USD key limit is an access ceiling, not the ROCHE balance. Final
usage debits occur only in RevenueCat; invoice costs and session operation state
do not become competing spendable balances. No exact token count is invented in
this proposal while the approved model/rate and current currency semantics remain
to be reconciled.
