# Three-screen offer source — Figma Make

Exported 27 October 2026 from the existing Figma Make project:
https://www.figma.com/make/qaDnpIyfhFmqa7E5fRDIwY/Three-Screen-Natally-Offer-Journey

The external designer authored `original/public/paywall-three-screen.html` in
version “Implement Three-Screen Offer Journey” (6:01 PM displayed by Figma).
Downloaded through Files → File actions → Download code as
`W:/Downloads/Three-Screen Natally Offer Journey.zip`.

Original HTML SHA-256:
`fc39961aaa1abed471bab992b37be4cf2244cc5aef69fe37399f1afd8a83db44`.
Artwork SHA-256:
`8766fb9ed3c23e4571c864e9b433366e643a066743e43418062e0b2f0dc6ae95`.
The artwork is byte-identical to `public/paywall/natally-original.webp`; the
adapter maps its relative asset URL to that existing local asset.

This source replaces the obsolete payment-method picker in the original export
for the user-requested three-screen offer journey. It preserves that project's
artwork, palette, and typography. It does not implement or simulate payment.

## Addressable binding contract

- `.screen[data-screen="1"]`: souvenir reading offer only.
- `.screen[data-screen="2"]`: experiential co-exploration offer only.
- `.screen[data-screen="3"] .offers.compare`: both cards in comparison.
- `.offer[data-kind="reading"|"conversation"]`: whole card is purchase action.
- `.back`, `.next`: secondary navigation; `.close`: dismiss.
- `.restore`: same-account purchase restoration.
- `window.NatallyOffers.setState({prices,busy,message,screen})`: actual prices,
  operation lock and status; `screen` only for initial presentation.
- Child document `natally:offer:purchase` event has `detail.kind`; close and
  restore use corresponding `natally:offer:close` / `natally:offer:restore`.
  The source duplicates events to parent.window, so the adapter listens only
  on the child document to avoid duplicate purchases.

The source disables purchase with absent prices. The host binds RevenueCat SDK
prices and authenticates the exact Firebase UID before checkout. Source export
and any static preview do not establish a successful charge or fulfillment.

## Why the RevenueCat workflow is not the presentation source

On 27 October, the actual earlier-screen component menu offered no Package or
Purchase component. RevenueCat's AI editor explicitly declined the requested
purchase card because purchases are restricted to the final screen of its
multi-step workflow. No workflow edit was saved or published by this attempt.
Official documentation also describes the offer on the final screen:
https://www.revenuecat.com/docs/tools/paywalls/creating-paywalls

The coordinator selected app-owned presentation with RevenueCat purchases-js
checkout to satisfy direct purchase on every screen. RevenueCat remains the
commercial authority. The app does not replace its customer, purchase,
entitlement or credit records.

## Adapted runtime copy

`adapted/paywall-three-screen.html` is the runtime source. Its SHA-256 is
`e937258850a2209db9a3e4331177520c64139ce5bde78a9a670270759965528e`.
The original export above remains frozen byte-for-byte. A subsequent external
Figma refinement completed but its export was blocked by Figma's bot-verification
screen; no challenge was bypassed. The coordinator authorized using this exported
source with exact user copy changes and mechanical action bindings.

Mechanical GLM-4.7 nonthinking edits preserve the original layout/styles and:
- replace evaluation labels with one-time purchase language;
- describe the same interactive Natally experience for both acquisition paths;
- identify the souvenir as a personal interactive astrology encyclopedia frozen
  in time, with chart, reading, questions/answers and spoken reread, hosted at
  least one year;
- preserve the extensive per-planet PDF and ten exploratory questions;
- allow credits buyers to add the souvenir later;
- bind live provider price through textContent, never price interpolation;
- suppress restore/arrow actions while a purchase is in progress.

`FigmaPaywall.tsx` loads only the adapted document. It binds child-document events
once and sends state updates only on actual prop changes, preserving navigation.
Runtime/device acceptance remains separate from this source provenance.

## Persisted raster captures

`raster/screen-1.png`, `screen-2.png`, and `screen-3.png` preserve the adapted
HTML at 430 x 932 CSS pixels, captured in Chrome on 27 October 2026. They use
the tracked original WebP artwork. Prices remain in the actual unloaded
Checking price state; these source captures do not claim a completed checkout.
The executable HTML is `adapted/paywall-three-screen.html`; its app adapter is
`src/components/FigmaPaywall.tsx`, and artwork is
`public/paywall/natally-original.webp`. Both source HTML variants, artwork and
these raster captures are ordinary Git blobs, without Git LFS.
