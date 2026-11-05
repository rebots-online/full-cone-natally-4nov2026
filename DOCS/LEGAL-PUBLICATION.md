# Natally legal-page publication — 26 October 2026

Operator request: build Terms and Privacy for the RevenueCat paywall, deploy them
on natally.surge.sh, and record the locations in README and Admin-Manual/KStore.

## Public documents

- Terms: https://natally.surge.sh/terms.html
- Privacy: https://natally.surge.sh/privacy.html
- Static sources: `public/terms.html`, `public/privacy.html`, `public/legal.css`.
- Operator: Robin L. M. Cheung, trading as Roche Media Services, sole proprietorship.
- Public contact: support@rochemediaservices.com.
- Policy date: 26 October 2026.
- The RevenueCat dashboard was not changed. Use the URLs above for the respective
  Navigate to Terms of Service / Privacy Policy buttons; in-app browser is suitable.

The existing README cannot supply standalone unauthenticated legal URLs, so new
static HTML documents are warranted. PurchaseAccess and About are the existing
in-app homes for their links. No price, entitlement, provider or checkout-flow
change was made. The operator will supply the business logo separately.

## Evidence and limitations

The live pre-change app and CSS hashes matched the `codex/live-payments` worktree,
not the original session checkout or the older master worktree. Independent
source review confirmed local/cloud deletion boundaries, direct OpenRouter
processing, browser speech recognition, RevenueCat identity and finite allowances.

`npm run build` passed (Vite 8.3.4). `npm run lint` failed on the existing
`tests/mascot.test.tsx:16` use of removed `avatarUrl`; both the test and component
were read from pre-change HEAD to confirm the mismatch predates this work.

Surge published successfully. HTTPS reads of terms.html, privacy.html, legal.css
and index.html each returned 200 and matched local dist bytes. Chrome displayed
both pages without authentication and followed the Terms-to-Privacy link.
Desktop screenshot: `.tmp/legal-verification/privacy-live.png` (local evidence).
Physical-device, payment and store-review acceptance were not performed.

## Global record

Admin-Manual `DOCS/INFRASTRUCTURE.md` section 3.2.1 records the operator identity,
support address, policy locations, rochemediaservices.com as the intended future
WooCommerce/software/shared-$ROCHE home, and rochemedia.ca as another used domain.
Renewal on 25 October 2026 is explicitly operator-reported, not registrar-verified.
No DNS or mail settings were changed.

KStore canonical document: `INFRASTRUCTURE.md`, source `admin-manual`, revision 3.
PostgreSQL and served-document exact-byte verification passed. Qdrant verification
reported `uuid set mismatch: postgres 25 vs qdrant 0 entities at head revision`.
See `LEGAL-KSTORE-RECEIPT.json`; its indexing field remains pending.
Admin-Manual GitHub publication verified at
`184da5c2858a1f78783276727103f3154fc8367f` after preserving incoming commits.

## Reference checks

- [RevenueCat paywall components](https://www.revenuecat.com/docs/tools/paywalls/creating-paywalls/components)
  documents Terms/Privacy destination actions.
- [Canadian privacy regulator: meaningful consent](https://www.priv.gc.ca/en/privacy-topics/privacy-for-businesses/appropriate-handling-of-personal-information/collecting-personal-information-and-consent/consent/gl_omc_201805/)
  informs the prominent data/purpose/recipient summary. This is not a claim of
  legal certification or acceptance by an app store.
