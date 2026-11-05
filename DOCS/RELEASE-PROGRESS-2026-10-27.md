# Release implementation checkpoint — 27 October 2026

Source through c6cf4a3 is pushed and remote SHA verified. Current npm run lint
passes. These source changes have not yet been rebuilt and deployed as a complete
ordinary-user release.

- Paywall adapted/original HTML, WebP artwork and three 430x932 PNG captures are
  tracked in ordinary Git. PNG captures preserve the unloaded-price source state.
- Fresh RevenueCat ROCHE balance reader: five focused behavior checks passed.
- Windows Google/SMS AuthModal uses existing native sign-in bridge. Actual signed-in
  Windows acceptance remains outstanding.
- Download access now reads RevenueCat natally_downloads directly; nine focused
  behavior checks passed. No Netlify endpoint required for this check.
- Direct customer-key inference restored. Managed keys require funded OpenRouter
  allowance and authoritative positive ROCHE; personal-key support retained.
  Nine focused behavior checks passed. Reading entitlement remains available for
  souvenir replay even without inference funds.
- Firebase operational souvenir snapshots preserve actual chart, completed reading
  and conversation; interactive viewer and PDF are integrated with ExportModal.
  Agent contract checks cover original snapshot reuse, real-message preservation,
  per-body chapters, server read, offline fallback, and rejection without a reading.
  One-year retention metadata is not infrastructure retention acceptance evidence.
- Free authored educational voice path and readonly snapshot replay source committed.

Still required: automatic zero-limit OpenRouter key provisioning at signup,
verified purchase allocation and ROCHE grant/spend synchronization, single-use
attributed code redemption, live ordinary-user payment and delivery, native auth
acceptance, responsive/device checks, and production deployment/readback.
Do not claim a working paid release from TypeScript or contract checks alone.

Existing isolated build session 7334 is v0.11.85692 from older source80c2942 plus
Kotlin ignore fix: Windows executable/NSIS/MSI staged; Android failed during Gradle;
Linux build still running at this checkpoint. It does not include current fixes.
Preserve that process; do not infer a complete native matrix or restart it blindly.
