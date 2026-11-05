# Natally endpoint ownership, hosting and information disclosure

31 October 2026. Public registry and authenticated Google Cloud metadata read at
approximately 06:22–06:24 UTC. No customer records or credential values are
included in this report.

## What is established

`run.app` is Google Cloud Run's hosting domain. The specific Natally endpoint is
`https://natally-billing-bd2e6ftjfq-uw.a.run.app`, in the existing
RocheMediaServices-Infra project. Google is the infrastructure provider and an
additional processor of transaction information sent there. Hosting the service
does not make Google the buyer or seller in a Natally customer transaction.

RevenueCat does **not** require Google Cloud Run, `run.app`, or a particular host.
There is no documentation establishing this as the only way. RevenueCat supports
customer balances and automatic purchase grants internally. Its documented spend
flow calls its currency transaction API from an application backend, which can
run on a different suitable host. Cloud Run was an implementation choice.
[RevenueCat balance authority](https://www.revenuecat.com/docs/offerings/virtual-currency/faq/balance-source-of-truth),
[currency transaction API](https://www.revenuecat.com/docs/api-v2/virtual-currency).

## Domain and infrastructure

| Item | Verified finding |
| --- | --- |
| Domain operator | Google's own documentation identifies `run.app` as Cloud Run's generated HTTPS endpoint domain. |
| Registrant evidence | Current authoritative RDAP redacts the registrant. A public WHOIS mirror reports Google LLC; that is corroboration, not an unredacted authoritative registration record. |
| Registrar | MarkMonitor Inc., IANA 292. |
| DNS | ns1.google.com, ns2.google.com, ns3.google.com, ns4.google.com. |
| Registration / expiration | 5 April 2018 / 5 April 2027. |
| Compute | Google Cloud Run, actual region us-west1 (Oregon, United States). |
| Persistent datastore | Existing named Firestore database in project gen-lang-client-0714568880, actual region us-west2 (Los Angeles, United States). |
| Transport | Google documents HTTPS on default run.app endpoints, TLS termination at its frontend and encrypted forwarding to the service. |

Sources: [Cloud Run endpoints](https://docs.cloud.google.com/run/docs/triggering/https-request),
[registry RDAP](https://pubapi.registry.google/rdap/domain/run.app),
[registrar RDAP](https://rdap.markmonitor.com/rdap/domain/run.app),
[WHOIS mirror](https://www.whois.com/whois/run.app),
[transport](https://docs.cloud.google.com/run/docs/securing/security),
[Google locations](https://cloud.google.com/about/locations).

## Who controls the Natally service

| Item | Live control-plane finding |
| --- | --- |
| Project | RocheMediaServices-Infra / rochemediaservices-infra / 115038895774; active, created 4 April 2025. |
| Project Owner role | rochemediaservices@gmail.com |
| Human Cloud Run administrators | rebots.online@gmail.com; robin.realtor416@gmail.com; robinsaiworld@gmail.com |
| Service creator / last modifier | robinsaiworld@gmail.com |
| Service / ready revision | natally-billing / natally-billing-00004-ngp at inspection |
| Runtime identity | natally-billing@rochemediaservices-infra.iam.gserviceaccount.com |
| Billing | Enabled; open linked account named Robin's AI World Billing A/C. |
| Reachability | allUsers invocation makes the endpoint publicly reachable. Application route authentication is separate. |
| Database permission | roles/datastore.user with a condition restricted to the existing named Natally database. |
| Existing credential configuration | OpenRouter administrator, encryption and RevenueCat public SDK bindings use Secret Manager references; no values printed. |

IAM establishes technical control, not legal ownership. This project-policy read
does not enumerate inherited organization/folder permissions. Control metadata
does not prove every application route's authorization or response behavior.

## Information disclosure

The approved callback is **RevenueCat → Natally's API on Google infrastructure**,
at `/billing/webhook`, scoped to production events for Natally's Web Billing app.
The documented payload can contain customer identifiers and aliases, transaction
and product identifiers, prices, currency, timestamps, country, purchase/refund
status, and configured subscriber attributes. This is a disclosure of transaction
information to the hosting infrastructure, not an empty notification.
[RevenueCat event fields](https://www.revenuecat.com/docs/integrations/webhooks/event-types-and-fields).

The dedicated authorization token goes to RevenueCat so it can authenticate
delivery to Natally's endpoint. It is not the merchant's RevenueCat administrator
credential, OpenRouter administrator credential, card number or banking
credential. Those credentials are not part of the callback configuration.
RevenueCat documents merchant-selected HTTPS destinations and the authorization
header in its [webhook instructions](https://www.revenuecat.com/docs/integrations/webhooks).

Natally's billing API separately processes authenticated requests for quotes,
redemption, provisioning, purchase history and invoices. The corrected customer
balance authority is RevenueCat. Operational receipt/tax records, request
identities, encrypted key custody and provider usage checkpoints are separate.
RevenueCat balance authority does not eliminate all processing by Natally's host.

The corrected implementation sends or retains the following information. This
table describes the assigned source and configured destinations, not an assertion
that a customer has already completed the newly corrected flow.

| Direction | Information and purpose |
| --- | --- |
| Customer browser → Natally API on Cloud Run | Firebase authentication token; selected amount and request identity; billing name, email and postal address for the quote, tax calculation and official invoice; submitted redemption code when that action is used. |
| RevenueCat → Natally callback on Cloud Run | Production purchase/refund event with the documented identifiers, amount/currency, timestamps and available attributes; checkout identity in transaction metadata. |
| Natally API → RevenueCat | Authenticated account identifiers, real product/package configuration, purchase-record queries and idempotent ROCHE balance adjustments. RevenueCat remains the balance authority. |
| Natally API → existing Google Firestore database | Operational request/transaction identities, original purchase-event evidence, receipt and tax facts including purchaser billing details, encrypted provider-key custody and usage checkpoints. |
| Natally API → Google Secret Manager | Retrieval of configured service credentials and persistence of the official administrative client's refreshed authorization. These values are not part of customer receipts or public site files. |

The browser's billing details therefore also reach Google's infrastructure; the
disclosure is not limited to the RevenueCat callback. The report has not verified
a complete retention schedule or an executed data-processing agreement for these
records.

Surge hosts the browser files and can serve an app which calls this HTTPS API.
Surge does not itself execute this server program.
[Surge documentation](https://surge.sh/help/getting-started-with-surge).

## Privacy and spending limits of this review

Google publishes a [Cloud Data Processing Addendum](https://cloud.google.com/terms/data-processing-addendum).
This identifies the provider framework; it does not verify the operator's executed
agreement, every subprocessor location, all logging/retention settings, or
Canadian-only residency. The inspected compute and database regions are in the
United States. This is a bounded technical report, not a completed legal review.

Actual resource settings: maximum 3 instances, 1 CPU and 512 MiB each,
concurrency 80 and request timeout 300 seconds. They do not establish a dollar
spending cap. Google states maximum instances can briefly be exceeded.
[Instance limit documentation](https://docs.cloud.google.com/run/docs/configuring/max-instances).

## Authorization and delivery

The operator explicitly approved configuring the production purchase callback
and dedicated verification token, while requiring this report and implementation
to proceed concurrently. The earlier automatic approval rejection is resolved
by that explicit user authorization, subject to the execution review.

The inspection made no service, IAM, billing, database or customer changes.
Callback configuration and release outcomes must be reported separately from
actual execution results. This report is not a purchase-success attestation.

Following explicit approval, configuration succeeded: integration
`whintgr80a0903f52`, project `projaba0bd94`, app `app941a60bf95`, production events
to `https://natally-billing-bd2e6ftjfq-uw.a.run.app/billing/webhook`.
Provider readback confirmed the exact routing. The dedicated authorization value
was stored canonically and referenced from the annotated environment, without
printing it. At callback-configuration time, the corrected runtime deployment
was the remaining step; its subsequent completion is recorded below.

## Subsequent approved deployment — 31 October 2026, 06:43 UTC

The inspection metadata above records the service as it existed at its stated inspection time. The later approved R10 deployment completed at 2026-10-31T06:43:15.742Z, using the same existing Google Cloud project, region, service URL and runtime service account. This is a deployment outcome record, not a new IAM or ownership inspection.

- Ready revision: `natally-billing-00005-j5j`.
- Service URL: https://natally-billing-bd2e6ftjfq-uw.a.run.app
- Image: `us-west1-docker.pkg.dev/rochemediaservices-infra/natally-billing/runtime@sha256:e68810664a2a993b35d4c2d6b3f6d0c3058c00e5e7e198dc16a7a0a557ae37fa`.
- Source archive SHA-256: `43c1149a397c96580417e939257feb142f790ac3dad2d430a902bc2ce472d224`.
- The deployment's built-in readiness response was HTTP 200.
- The approved runtime includes RevenueCat ROCHE as the customer balance authority, the official CLI's renewable OAuth profile delivered through Secret Manager, and the configured purchase callback authorization. Firestore stores supporting account operations, receipts and recovery records.

The subsequent canonical web-only coordinator automatically produced v1.31.90483 from pushed source `b62742160a8142ac685b641f77cb44d1dd46a047`, invocation `3a2306c5-fbd9-42dd-9525-bc4eda398760`. It exited 0 after publishing to both https://natally.robin.mba and https://natally.surge.sh. Its publication report matched 95 served files on each host, including the retained download page and manifest. Native builds remain held. The iteration is ready for the operator's actual purchase attempt, as instructed; publication and transaction outcome remain separate records.

See `release-1.31.90483.md` and `release-1.31.90483-publication.json` in this directory for the bounded deployment and artifact evidence.
