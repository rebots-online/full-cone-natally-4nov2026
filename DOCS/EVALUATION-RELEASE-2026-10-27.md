# Ordinary-user evaluation release

Status: IN_PROGRESS. Operator corrections on 27 October 2026 govern older
conflicting copy. This is a requirement record, not release acceptance.

## Settled purchase journey

- ER01 / ER-T01: Three screens: souvenir reading; experiential interaction
  bundle; both offers side by side. Each dedicated screen has one large
  actionable card containing short feature bullets, actual price and an explicit
  purchase label. Clicking selects that exact offer and opens its checkout;
  authentication preserves the selection. Secondary navigation offers the other
  screen without requiring it. Comparison retains both matching purchase actions.
- ER02 / ER-T01: Evaluation uses the existing small tester prices, explicitly
  identified as tester pricing, for ordinary accounts without admin privileges.
  The intended full-price souvenir offer is USD 30; do not show USD 30 as the
  current charge while the SKU charges USD 0.99. Both evaluation paths must work.
- ER03 / ER-T02: Reading-package delivery is the assembled natal chart, personal
  reading, PDF and interactive SPA vignette of the exploration. Ten exploratory
  questions of the user's choice help create the reading and souvenirs. Preserve
  at least one year of hosted replay, chart mouseovers/clicks, exploration summary
  and Natally voice playback. Interaction credits purchase personal exploration
  without implicitly including the souvenir package.
- ER04 / ER-T02: Firebase owns identity; RevenueCat owns purchases, entitlements
  and commercial allowance. No administrator grant, fixture, provider personal
  key, URL return flag or parallel ledger substitutes for purchased access.
  Cancellation, retry, restoration, account switching, refunds, exhausted
  allowance and provider failures must retain correct account boundaries.

## Free experience

- ER05 / ER-T03: Declining all offers leaves the assembled chart and interactive
  atelier available, including existing playful/breakable objects. No generated
  personal reading or open-ended LLM conversation is granted for free.
- ER06 / ER-T03: Chart selections choose comprehensive PREWRITTEN educational
  text: identity of the selected object, significance in astrological tradition,
  and the background of that interpretation. Insert the user's name naturally.
  Synthesize speech in real time using the existing approved Natally voice engine.
  The operator explicitly corrected the earlier prerecorded/cached-name plan.
  No LLM inference occurs on this free path. Do not replace Natally's voice.
- ER07 / ER-T03: Each explanation ends with a relevant leading question and a
  clear purchase invitation. Unpaid chat uses authored closing/offer text, not a
  paid inference call. Clicking an offer retains its identity into checkout.

## Public infrastructure

- ER08 / ER-T04: Public marketing homepage at https://natally.robin.mba/ is
  accessible without login, describes the actual product and links Terms,
  Privacy, support and app entry. Integrate the existing externally authored
  landing source; never deploy its mock purchase-state navigation as checkout.
- ER09 / ER-T04: Serve Google's existing ownership verification file and finish
  Search Console verification, then resolve Google OAuth branding issues.
  Preserve required native/web callbacks. Domain-count cleanup is not ownership
  verification or proof of successful sign-in.
- ER10 / ER-T04: Server is unplugged. Use the explicit Namecheap Natally CNAME
  to Surge, preserving wildcard and all unrelated zone records. No nginx route
  is required while the server is offline. Record verified configuration in
  DOCS/INFRA and KStore Admin-Manual under the Natally project. KStore is sole
  authority for infrastructure credential locations; do not recover credentials
  from conversations or other sources when it is unavailable.

## Continuous demonstration additions

Extend the existing complete release script; do not replace its other scenes.
All actual recording IDs and timecodes below remain NOT RECORDED.

| Scene | Entry and action | Required visible result | Requirements |
| --- | --- | --- | --- |
| ER-S01 | Fresh ordinary browser, open public custom domain, inspect legal links and enter app | Public marketing, correct brand, no login required to read homepage/legal pages | ER08, ER09, ER10 |
| ER-S02 | New ordinary account, visit all three offer screens at desktop and narrow viewport | Full text, one clear card per dedicated screen, actual tester price, side-by-side contrast with accessible responsive treatment | ER01, ER02 |
| ER-S03 | Decline offers, click chart targets and interact with atelier; submit unpaid chat | Existing interactions remain; comprehensive authored speech in Natally's voice with name, closing question and offer; no LLM request | ER05, ER06, ER07 |
| ER-S04 | Buy souvenir tester from first card, completing real provider checkout | Exact SKU/price, verified purchase, supporting ten questions, reading, downloadable PDF and interactive vignette | ER01, ER02, ER03, ER04 |
| ER-S05 | Return as same user on fresh session and reopen vignette | Ownership restored; saved chart, summary and voice replay work; no repurchase | ER03, ER04 |
| ER-S06 | Ordinary second account selects experiential card, cancels once, then purchases | Cancellation safe, retry preserves offer, real credits/allowance and paid inference, no souvenir rights inferred | ER01, ER02, ER04 |
| ER-S07 | Exercise comparison purchases, exhaustion, account switch and recoverable provider failure | Matching offer actions, no cross-account leakage, no unearned access or lost purchase | ER01, ER04, ER07 |
| ER-S08 | Installed Windows build signs in and restores same account's access | Branded supported authentication, same purchase authority and usable experience | ER04, ER09 |

Record the exact source/build, deployed URLs, continuous recording, provider
receipt correlations, timecodes and remaining defects. No scene has passed yet.
