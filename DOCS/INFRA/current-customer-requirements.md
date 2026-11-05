# Current customer-facing release requirements

These operator corrections supersede conflicting earlier wording. They do not
claim that the release has passed acceptance.

## Production copy

Never display tester, test purchase, evaluation, mocked content or placeholder
status on production assets. Existing low catalog prices remain the actual
purchase prices. Internal SKU identifiers are not customer product names and
must not be renamed just to change display copy. RevenueCat display names are
Souvenir reading and Exploration credits. Internal acceptance documentation
continues to distinguish observed results from pending work.

## Same experience, optional souvenirs

Both purchase paths provide the same interactive Natally experience. The souvenir
purchase adds an extensive PDF with general encyclopedia-like chapters for each
planet, the customer's personal reading, and their own saved interactive atelier
where Natally can reread the reading in her voice. The included ten exploratory
questions support this reading. Further daily horoscopes, synastry and other
inference use available or newly purchased credits. Replaying an existing reading
does not create a new paid inference turn. A credits customer can buy a one-off
souvenir at any time; the offers are not permanently exclusive account types.

## Optional code entry

Customer label: Have a code? Action: Apply. Use actual provider validation and
the confirmed checkout amount. Do not label the field Discount code. AppSumo
purchase/license redemption is distinct from a RevenueCat promotional code;
do not imply arbitrary partner codes work without their configured integration.

## Lightning

The operator explicitly requested Blink.sv POS/API receiving for Bitcoin
Lightning payments. This is an authorized additional payment rail. Confirmed
purchase rights and allowances still belong to RevenueCat. Implement the
invoice and fulfillment connection without a competing commercial ledger.

## Observed homepage responsive state

Local marketing.html was rendered in a browser and measured at CSS viewport
sizes on 27 October. These are desktop-engine responsive observations, not APK
or physical Android acceptance. Document width did not exceed client width at
320x568, 360x640, 360x800, 393x873, 412x915, 800x360, 768x1024 and 1024x768.
Purchase buttons were 48 CSS pixels tall. The first CTA started at y919 for
320x568, y846 for 360-wide phones, y815 for 393x873, y806 for 412x915, y626 for
800x360, y643 for 768x1024, and y611 for 1024x768. Thus the first CTA requires
scrolling on the smaller phones and landscape, despite no horizontal clipping.
Mobile artwork-first ordering and vertical spacing need improvement before
claiming a prominent immediately visible phone purchase action. Landscape safe
areas, enlarged text, keyboard and actual APK WebView remain unobserved.

## Preserved encyclopedia clarification

The operator rejected describing the souvenir as saved voice replay: it is a
fully interactive webapp encyclopedia preserving the person's interaction with
Natally, frozen in time. This is a complete interactive artifact, not an audio
file. Customer description: Your own interactive astrology encyclopedia—a
personal web app preserving your chart, reading, and exploration with Natally,
frozen in time and hosted for at least one year. Its clickable chart, planetary
chapters, questions and answers, and narrated reading remain available to
revisit; credits allow further exploration. The extensive downloadable PDF is
an additional deliverable, not a substitute for the interactive web app.

## Settled customer and ROCHE architecture — 27 October 2026

The operator has answered the architecture question. This supersedes the prior
pending-approval text and suggestion to add Hugging Face hosting. Do not add
hosting services or expand the rejected Netlify drafts.

RevenueCat owns the customer account, purchases, entitlements and shared balance,
enumerated and displayed as ROCHE. Other apps may award ROCHE that customers can
spend in Natally. Rewards, gift-code grants and purchases feed the same authoritative
customer balance; do not create a separate Natally-only commercial ledger.
Firebase holds operational data, including conversations, keyed or linked to the
RevenueCat customer identity. Preserve the existing authentication integration.

Every session follows the adopted one-hour contract in
PROJECTS/Natally/ARCHITECTURE/session-keys.md. Check issuer validity of the
associated key, reuse a valid eligible key or issue a zero-limit key expiring
one hour after issuance, then read current shared RevenueCat ROCHE and set its
spend limit using the configured conversion. Write and verify the association
on the RevenueCat customer. Do not use the old key limit or balance as an input.
Zero ROCHE and logout deactivate the key. Active sessions renew before expiry.
This replaces the earlier creation-only provisioning description.

Credit purchases grant ROCHE; a souvenir includes sufficient ROCHE for at least
ten exploratory turns plus its reading, extensive PDF and retained interactive
encyclopedia. Both offers use the same interactive experience. Implementation
and live purchase, renewal, restoration and cross-app synchronization remain
unfinished; this record describes the required behavior.

The optional field remains "Have a code?" with an "Apply" action. Support single-use
redemption codes (including configured partner/AppSumo codes), gift codes granting
ROCHE without a purchase, code benefits alongside a purchase, and percentage offers
such as 25% off. Enforce the actual code's redemption and combination rules. A
percentage offer changes the payable price; a ROCHE gift grants currency. Repeated
submission must not grant a single-use benefit twice. Display actual authoritative
ROCHE balance and actual checkout price, never an invented successful redemption.

Status: requirements confirmed; implementation and live purchase/redemption,
cross-app balance and allowance synchronization still need verification.

## Issued-code attribution rule

Gift and percentage-off codes default to individually issued, single-use codes
validated against the issued-code list. Do not assume discounts are reusable.
Each code retains its campaign and intended marketing target; successful redemption
records the RevenueCat customer and redemption outcome against that attribution.
Keep intended target and actual redeemer distinguishable for campaign analytics.
Enforce any explicit recipient restriction without assuming every target is an
email address. Reusable or shareable codes require an explicit campaign exception;
they are not the default. Duplicate/retried redemption must not grant benefits
again. The code is a mutually beneficial attributed marketing instrument, not
an anonymous generic coupon. Implementation and live verification remain pending.
