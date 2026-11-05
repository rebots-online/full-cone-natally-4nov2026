# Natally Google Analytics infrastructure

Created 29 October 2026 using browser control, as explicitly requested by the
operator. No suitable Google Analytics MCP was available. Confirmed the signed-in
Google account was robinsaiworld@gmail.com. Existing selected property
hello-word-missal was not changed. A Natally property and canonical web stream
were created under the existing Analytics account, without a new Google account.

| Setting | Actual value |
| --- | --- |
| Analytics account | 377011994 |
| Property name | Natally |
| Property ID | 561516754 |
| Web stream name | Natally Web |
| Stream ID | 16232442825 |
| Measurement ID | G-E3420JFKPB |
| Website | https://natally.robin.mba |
| Reporting time | Canada / Toronto |
| Reporting currency | USD; report convention, not a checkout currency change |
| Industry / business size | Arts & Entertainment / Small 1–10 |
| Selected objectives | Drive sales; View user engagement & retention |

Property: https://analytics.google.com/analytics/web/#/a377011994p561516754/reports/intelligenthome

Enhanced measurements retain page views, scrolls, outbound clicks, video engagement
and file downloads. Automatic site-search and form-interaction measurement were
disabled; the intended explicit events describe actions rather than customer
question/lore content. No Google Ads linkage or Measurement Protocol secret added.

## Verification and unfinished work

The UI explicitly confirmed successful property creation and showed the stream
URL, stream ID and measurement ID. Continue to Home opened the new property ID
above. The stream reported no data received: the app tag and semantic usage,
promotion, purchase and fulfillment hooks are not yet implemented/deployed.
Do not mistake property creation or the UI's possible collection delay for proof
that Natally is transmitting events. Actual real-event verification is required.

Root architecture GA defines the usage/upsell/cross-sell contract and spoken-cost
disclosure boundary. Follow architecture -> pushed checklist/rubric -> coder ->
semantic review -> publication, with recording still held by the operator.
Public measurement ID must enter through annotated environment configuration;
do not overwrite existing credentials or introduce a second analytics destination.
