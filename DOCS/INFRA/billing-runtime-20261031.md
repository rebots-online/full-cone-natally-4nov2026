# Natally billing runtime deployment — 31 October 2026

Actual deployed service: https://natally-billing-bd2e6ftjfq-uw.a.run.app

- Google project: `rochemediaservices-infra`.
- Region: `us-west1`, using an existing initialized project region. The originally
  selected `us-central1` failed provider regional initialization with quota exceeded.
  The supervisor approved this deployment adjustment; Firebase identity and its
  named database were preserved.
- Ready revision: `natally-billing-00004-ngp`.
- Deployment completed: `2026-10-31T05:11:36.895Z`.
- Immutable image: `us-west1-docker.pkg.dev/rochemediaservices-infra/natally-billing/runtime@sha256:a983af3c826522fac30250eb8275783513a75cd6191dc1e84d08e91b4790a406`.
- Uploaded source archive SHA-256: `92b11c685aaebe442dc7b679af9f11217d8e562b0b573276ee07a5130fc87190`.
- Includes the final checkout preflight that requires actual fulfillment bindings
  before returning a live payment URL.
- The deployment's built-in `/billing/health` check returned HTTP 200. Google
  intercepts `/healthz`; the application health endpoint is under `/billing`.

`scripts/deploy-billing-runtime.mjs` packages the real billing modules and Firebase
configuration without environment files or credentials. The existing Firebase CLI
login authorizes deployment. Managed service identity
`natally-billing@rochemediaservices-infra.iam.gserviceaccount.com` receives access to
the existing Natally named Firestore database. Canonical credentials resolve into
Secret Manager versions and Cloud Run receives secret references. No plaintext
credential fallback is implemented.

The live annotated environment points `VITE_BILLING_API_URL` to this service.
The configured permanent code is `Ch4n3l.C3351`, with allowance `10.00` USD.
The actual RevenueCat Stripe-app production public SDK binding is stored canonically
and configured as `REVENUECAT_STRIPE_PUBLIC_KEY`. Future configured redemption code,
allowance, encryption-key and origin overrides are preserved by setup reruns.

These deployment results do not establish a completed customer redemption or
purchase. Actual Google CLI user OAuth could not serve as a Firebase app token
because its audience differs. No fabricated account, payment, grant or inference
result was substituted. At deployment, these checkout bindings remained empty:
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `BILLING_STRIPE_CREDIT_PRODUCT_ID`,
`REVENUECAT_SECRET_API_KEY`, `REVENUECAT_WEBHOOK_AUTH`.

The existing production Android upload key was read from the canonical signing
record and its actual keystore certificate matched
`56C13674EF22DF95DEB1E5C468820E8CFA3EA2F522511749AB7B6E5BDE3BD943`.
Both APK and AAB outputs must match that fingerprint. After coding and publication
completed, the canonical coordinator stamped `1.30.90390` and began its full matrix
from published source `f931ebcc79ee8aabbec4ff50f6fca7834eecaddf`; that build's own
inventory records artifact completion. The separately requested
working-folder copy was stopped on the operator's subsequent instruction; its
partial directory is retained and is not a completed build.
