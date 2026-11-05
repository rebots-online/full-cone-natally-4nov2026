# Natally regression repair — portable source evidence (30 October 2026)

Overall state: **IN_PROGRESS**, not a completed release or customer acceptance.
Base: `rebots-online/natally-ai-studio` commit `6c207843a65123a6d0038ef33d7eac9e3faa1b42`, version 1.29.89107.
This is a sparse, hash-verified source mirror, not a Git checkout. Omitted tracked paths are NOT deletions. No version was bumped, remote source published, payment made or release deployed.

## Source changes and remaining acceptance

| Scope | Source work | Remaining evidence |
|---|---|---|
| Credits text | Amount, label and adjacent Profile action share .8rem/1.35 typography variables and Nunito family; 44px/2.75rem targets retained. App title/person-name hierarchy is unchanged. | Actual mobile/desktop screenshots, large balances/loading/error and visual comparison. |
| Inset tooltip | Existing document.body tooltip is enabled independently of persistent chart labels, positioned outside the inset pane and clamped to viewport. | Actual pointer/touch interaction and screenshots; limited viewport with no free space remains constrained by physical screen size. |
| Wheel | Only transient narration dims materials; original opacity/transparency restored while manual selection remains. Owner-checked cleanup on completion/cancel/error/retained stop; explicit Stop, Sound Off, new request and authored education replacement clear/cancel old ownership before generation invalidation. | Actual final cue without trailing clear, cancellation/errors, stale callback and physical rendering. Source contract tests are not browser acceptance. |
| Speech | Whole-stream busy reservation covers synthesis and gaps; waiting/retained playback is busy; automatic tips/nudges yield atomically. Performance events carry owners and stale end/word events are discarded. | Real timer-driven audio overlap/listening, synthesis failures, mouth/teeth timing on actual device. Unit tests do not prove audible behavior. |
| History | Actual SDK transactions remain separate, store provenance shown; other products clearly labelled latest-date snapshots. Native Kotlin projection mirrors this and retains nullable historical transaction price/currency from the pinned SDK, never current catalogue pricing or invented receipt data. | Android compiler/device and real account two-purchase readback. |
| Invoices | Real RevenueCat V2 adapter, verified Firebase UID ownership, paginated read-only Express route, authenticated real PDF redirect retrieval; client rechecks identity and aborts on unmount/account switch. | Configured billing runtime, key permission, real account invoice/PDF, payment/tax accuracy. No fake receipt/amount/paid status. |
| Downloads | Existing full-site deployment staging gains `/downloads/` only after complete inventory verification; real file hashes/sizes rechecked. | Full native matrix, real artifacts, coordinator deployment and download checks. No empty page or fake binary generated. |

## Receipt deployment gate: BLOCKED

No canonical deployed billing runtime URL or usable invoice-read permission was established in this workspace. No server secret was requested, created or copied. The feature is not live merely because code exists.

Required server configuration names:
- `REVENUECAT_SECRET_API_KEY`: secret API V2 key with `customer_information:invoices:read`; never a public SDK key.
- `REVENUECAT_PROJECT_ID`: actual RevenueCat project, not the Firebase project ID.
- `BILLING_INVOICE_ALLOWED_ORIGINS`: explicitly approved origins, comma-separated; no wildcard/default. HTTPS origins and the exact standard native origins `http://tauri.localhost` / `tauri://localhost` are supported only when explicitly configured. Never allow `null`.

Required client configuration:
- `VITE_BILLING_INVOICES_ENDPOINT`: explicit HTTPS URL for the real mounted `/api/billing/invoices` service. No guessed relative URL on static Surge, credentials, query string or fragment.

The existing Express entrypoint mounts list and `/:invoiceId/file` reads. It is NOT a deployment instruction to resurrect historical Netlify functions or create a new service. A valid configured endpoint is required before invoice UI is mounted; do not treat absence of the invoice section as fulfillment. Release approval must remain blocked until authenticated real-account invoices/PDFs and key scope are verified.

Authentication follows the existing billing contract: Google `accounts:lookup` verifies bearer token before checking project/issuer/UID/expiry/revocation claims. The caller cannot choose a customer ID. Server derives RevenueCat customer ID from verified Firebase UID. Pagination URLs must remain on the exact authenticated customer route. PDF request uses manual redirect; RevenueCat secret is never forwarded to the file host. Responses are private/no-store. File URL is fetched only on a user's real invoice action.

The installed RevenueCat Web SDK's non-subscription records do not provide financial amounts or receipt URLs. Android SDK 11.0.0 additionally supplies nullable historical `Transaction.price`; it is displayed as recorded transaction price, without inferring tax-inclusive total or inventing a currency when only a symbol is supplied. The V2 invoice API does, but its gross/tax documentation describes provider revenue fields ambiguously; UI labels those fields literally rather than summing or presenting them as a definitive charged total. `paid_at: null` remains unknown, not unpaid/paid. Provider PDF remains authoritative for charge and tax details. Firebase credit grant receipts are NOT tax invoices. No HST registration number is invented.

Primary contracts consulted:
- Installed `@revenuecat/purchases-js` 1.73.1 declarations, `CustomerInfo` and `NonSubscriptionTransaction`.
- https://www.revenuecat.com/docs/api-v2/invoice
- https://www.revenuecat.com/docs/redocusaurus/openapi-v2-invoice.yaml
- https://raw.githubusercontent.com/RevenueCat/purchases-android/main/purchases/src/main/kotlin/com/revenuecat/purchases/models/Transaction.kt
- https://v2.tauri.app/reference/config/ (standard native origins; native PDF navigation remains unverified).
- Pinned `RevenueCat/purchases-android` ref `11.0.0`, `purchases/src/main/kotlin/com/revenuecat/purchases/models/Transaction.kt`, Git blob `5bb902410cafc8bc2a16fa5116db21fbeb266e57`, declares `store: Store`; same ref `EntitlementInfo.kt`, blob `20087540e564a5c8fcb29e6c13cff00f57b81de7`, declares the Store enum. These were retrieved through the authorized GitHub connector after web cache misses. Thus `transaction.store.name` has pinned source evidence, not just main-branch inference.
- Pinned ref `11.0.0`, `models/Price.kt`, Git blob `387496ad3d96d3262f7bc75b4c0149861e2327e9`, defines `amountMicros: Long`, `currencyCode: String`, and `formatted: String`; currencyCode may be a symbol when ISO currency is unknown. Transaction price itself is nullable. Numeric micros are validated as safe integers; formatting/currency come directly from that historical transaction, not a current product quote.
- Pinned Android Gradle source specifies `com.revenuecat.purchases:purchases:11.0.0`; Kotlin changes were NOT compiled here.

## Verification and honest limits

- Baseline `npm run lint` passed before edits; repeated `npm run lint` passed after edits.
- Final focused suite: **28 passed / 0 failed** (visual/source contracts, speech bookkeeping, invoice security/client boundaries, download staging refusal).
- Focused regressions were introduced RED and made GREEN, including text metrics, tooltip geometry, actual Three material restoration, voice reservation/event ownership, invoice URL confinement, and missing-inventory refusal.
- Executable invoice transport-boundary tests cover rejected/revoked Google authentication, caller customer override ignored, PDF redirect without secret forwarding, nullable payment/file fields, client account-switch result rejection and actual abort signal propagation. These isolated test specimens never enter product UI and are not live payment/receipt evidence.
- Sound Off/new-request-with-empty-selection/authored-education regressions execute the actual production callback/exit statements and owner-checked cleanup in an isolated VM, verifying old focus cleared before invalidation and manual selection retained. They are not rendered React/browser tests.
- Some tests are source-contract assertions (history wiring, focus cleanup paths, invoice client wiring). They do not replace real UI playback, invoice or browser acceptance.
- Broad `node --import tsx --test tests/*.test.ts` run: untouched base 59 passed / 10 failed (69 total); after source changes and added tests, 73 passed / same 10 failed (83 total, final aggregate run). No broad-suite green claim.
- Existing failures: two account-isolation hosted tests need actual direct OpenRouter configuration; calculation-tools/chart-presentation imports use `.md` unsupported by this Node invocation; four supertonic tests have absent standardized brand asset, existing docked/wander expectation mismatch, incomplete window.dispatchEvent test boundary, and prefetch expectation mismatch; two voice-runtime-progress tests request a production Vite config and hit the mandatory complete-matrix build guard.
- For broad comparison only, temporary local `.env` contained the two verified nonsecret identity values from `src-tauri/tauri.conf.json`: `APP_NAME=Natally`, `APP_IDENTIFIER=mba.robin.natally`. It was removed afterward; no provider value was fabricated. Without it, the two runtime-progress tests fail earlier at missing explicit identity. Build guard was never bypassed.
- Legacy `.mjs` synthetic checkout/payment suites were not run as customer acceptance. No purchase/refund/registration, credential mutation or secret exposure occurred.
- Actual Chromium launch was denied local sockets; supported escalation failed before shell (`bwrap` could not create a file in a read-only denied session directory). No sandbox workaround, denied-directory read or browser success claim.
- Full native coordinator/build/deployment, receipt runtime and real artifact downloads remain UNRUN. No standalone Vite build or replacement `build_all.sh` was introduced.
- Three large branding originals remain absent from sparse fetch; none was replaced with placeholder artwork.
- Latest KStore Admin-Manual is inaccessible: no verified canonical current read endpoint, user reports database-host Precision T3600 unplugged. Known repository instructions were followed; no stale document claimed current authority.

The root coordinator must review the exact patch/original blob SHAs, apply to the real checkout without deleting omitted paths, resolve receipt runtime configuration, then use prescribed `scripts/build-all-platforms.ps1` for actual matrix and original full-site staging/deployment.
