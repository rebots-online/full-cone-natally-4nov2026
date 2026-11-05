# Committed redemption correction deployed

The approved backend-only command `node scripts/deploy-billing-runtime.mjs` completed with exit code 0 at `2026-10-31T08:49:05.894Z`.

- Approved correction commit: `d0ad6d0f39b50d7281b9088e73a4814d87193753`.
- Project: `rochemediaservices-infra`; region: `us-west1`; service: `natally-billing`.
- Ready revision: `natally-billing-00006-6mh`.
- Runtime URL: `https://natally-billing-bd2e6ftjfq-uw.a.run.app`.
- Source archive SHA-256: `5be6c07da4dc54853f462374d8af45f2c494f703a2b2172f595c6b05b8d5f3a1`.
- Immutable image: `us-west1-docker.pkg.dev/rochemediaservices-infra/natally-billing/runtime@sha256:1edaf0506abf45fc78c7e0cb17e8acc6afc67d402410d2baa2ef1eeba8f1b6f7`.
- Cloud Build operation: `operations/build/rochemediaservices-infra/YzgzMmFmOTQtOGVkNC00MzAzLTk4Y2YtMmU0MzU4YmUzZDU5`.
- Deployment script's built-in readiness response: HTTP 200.

This deploy activates the already committed redemption correction after the operator reported failure on web release 1.32.90532. No source edits, web/native builds, separate tests, redemption grants, or payment/inference probes were performed for this deployment. The successful deployment and readiness response do not establish successful customer redemption; that transaction remains unobserved by this release task.
