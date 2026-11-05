# Natally public entry and Google verification

Updated 28 October 2026. Infrastructure record; full release acceptance is unfinished.

## Current deployment — v1.13.86779

The completed inventory was published through the prescribed coordinator's
`-DeployExisting` mode to `natally.surge.sh` and `natally.robin.mba`, without a
new build or stamp. Invocation:
`npm.cmd run build:all -- -DeployExisting dist/natally-ai-studio-v1.13.86779-test-build-inventory.json -DeployDomains 'natally.surge.sh,natally.robin.mba'`.
The command exited 0. All 88 served files plus `/` matched per host: 178/178
HTTP byte checks. The retained web ZIP SHA-256 is
`3db0a5abe66e4ea7b3fbf28459ca849993979a9387018dec94aa7adf5e015699`;
inventory SHA-256 is `63403a9ad01271660182d0efba8a2be87c1b3d65ea57db08e6f37e241c3a022b`.
Evidence: `DOCS/TEST-RESULTS/deployment-1.13.86779.json`.

Normal Chrome refresh still rendered cached v1.12.86707. With a tab-scoped
service-worker bypass/cache disable and a DevTools reload, the real served app
visibly rendered v1.13.86779. Both temporary settings were reset afterward; no
account storage or history was cleared. This proves the deployed new code renders,
not that the normal installed-PWA update path completed. The existing worker
waits for prior clients before activation; retain that acceptance limitation.

In the signed-in deployed app, Profile -> account -> Restore purchases made a
real RevenueCat lookup and reported no store purchases and 0 ROCHE for that
account. The old blanket purchasing-disabled message was absent. The result
separately reported that reading access could not be connected. This is not a
successful restore of a known purchaser or managed-key fulfillment. Screenshot:
`DOCS/TEST-RESULTS/deployed-restore-result-1.13.86779.png`.
Native Play products, six-pack selection and paid customer acceptance remain
unfinished; publishing this artifact does not activate Google Play payments.

## Previous deployment — v1.12.86707

Published the completed coordinator's frozen web package to both `natally.surge.sh`
and `natally.robin.mba` under the standing deploy-on-completion instruction. This
contains the application identity repair, not the subsequent native Play or
purchase-recovery source work. All 88 deployed files on both hosts matched the
artifact SHA-256 values: 176/176 comparisons. Evidence is
`DOCS/TEST-RESULTS/deployment-1.12.86707.json`.

A fresh in-app-browser session visibly rendered the canonical marketing page
with `v1.12.86707`; screenshot:
`DOCS/TEST-RESULTS/deployed-home-1.12.86707.jpg`. The existing Chrome session
continued displaying the earlier cached document. Its service worker caches
the shell and waits for existing clients before activating an update. Do not
mistake that old session's display for a successful new-version UI verification;
the separate fresh session supplied the observed new-version evidence.

The full coordinator completed all twelve artifacts with no missing targets.
This deployment does not establish functional Play billing, per-user key
provisioning, ROCHE fulfillment or successful sign-in on every native target.

## Previous evaluation deployment — v1.10.86133

At the operator's explicit request to mount the candidate for evaluation, the
complete built web directory was published with Surge to both `natally.surge.sh`
and `natally.robin.mba`. The typed `natally.surgs.sh` was interpreted as the
existing Surge hostname; no new domain was introduced. No DNS change was needed.

All 86 public build files were fetched from each HTTPS domain: 172/172 SHA256
comparisons matched the local v1.10.86133 candidate. Evidence:
`DOCS/TEST-RESULTS/deployment-1.10.86133.json`. This includes marketing.html,
auth/native.html, Terms, Privacy, Google verification HTML and PWA assets.
The built entry routes ordinary web visitors to marketing.html; `/?app=1`
opens the app. Native entry retains its application path.

This operator-requested evaluation deployment occurred while the complete native
matrix was still running. It is not full release acceptance. Paid session
fulfillment and actual login/purchase journeys remain incomplete or unverified.
Local browser automation returned disabled in Work settings; no screencast was
produced. Other MCPs were not declared disabled by that error.

## Authority

Infrastructure and credential authority: KStore Admin-Manual. Canonical
Namecheap credential document: CREDENTIALS/global-infrastructure/namecheap.md.
No secret belongs in this file. A later KStore request timed out; direct retrieval subsequently recovered.
This document is also published under the Natally project in Admin-Manual.
Intended project entry: PROJECTS/Natally/INFRA/public-entry.md, source admin-manual.

## DNS and hosting

Namecheap production API readback confirmed 24 robin.mba host records:

| Host | Type | Destination | TTL |
| --- | --- | --- | --- |
| natally | CNAME | geo.surge.world. | 300 |
| * | A | 104.158.190.71 | 60 |
| @ | A | 104.158.190.71 | 60 |

No DNS mutation was necessary or performed. Wildcard, mail and other records
remain unchanged. https://natally.robin.mba/ currently answers directly from
Surge independently of CT123/nginx. The marketing homepage and auth helper were
published in the v1.10.86133 evaluation deployment described above.

## Google OAuth

Project ID: gen-lang-client-0714568880. Display name: Natally.
Web client: 358982402678-uap9cjq5u7tkjaei1etc8e6q97tqg70c.apps.googleusercontent.com.

Saved in Google Cloud console this session:
- Authorized branding domains reduced from 22 to 2: robin.mba and
  gen-lang-client-0714568880.firebaseapp.com.
- Obsolete AI Studio origins/redirects removed from the existing web client.
- Retained origins: http://localhost, http://localhost:5000,
  https://gen-lang-client-0714568880.firebaseapp.com, https://natally.robin.mba.
- Retained redirects: https://gen-lang-client-0714568880.firebaseapp.com/__/auth/handler
  and https://natally.robin.mba/__/auth/handler.
- Provider displayed both OAuth client saved and Branding changes saved.

Firebase Authentication's separate authorized-domain list was not changed.

## Ownership and public URLs

Existing Search Console URL-prefix property: https://natally.robin.mba/.
Downloaded Google's challenge: googleec5be2e6c03b1d80.html, with exact content
`google-site-verification: googleec5be2e6c03b1d80.html`.
It must remain publicly served at the same root URL after verification.
The HTML file is a secondary method awaiting deployment. Ownership is already verified through the DNS CNAME recorded below.

OAuth home: https://natally.robin.mba/
Privacy: https://natally.robin.mba/privacy.html
Terms: https://natally.robin.mba/terms.html
Public operator: Roche Media Services; support@rochemediaservices.com.

Google previously reported domain ownership unverified and homepage behind
login, in addition to excess domains. Do not claim branding approval from the
domain cleanup; complete public entry, ownership verification and review.

## Google ownership verified via DNS

Search Console displayed Ownership verified for https://natally.robin.mba/
on 27 October 2026, using Domain name provider verification. Keep this record:

- Host: ysmyumzxmybd.natally.robin.mba
- CNAME: gv-xyayoqx62vxvvx.dv.googlehosted.com.
- TTL: 300

Namecheap credentials were retrieved directly from KStore Admin-Manual revision 2.
The zone grew from 24 to 25 records; exact readback confirmed all prior host records
and email routing unchanged. Authoritative dns1.registrar-servers.com also returned
the new CNAME. The first Google attempt preceded propagation and failed; the later
attempt explicitly succeeded. The HTML verification file is retained as a future
secondary method, not the evidence of this success.

OAuth branding approval remains unfinished until the public marketing homepage
is delivered and Google's review completes. Do not conflate ownership with approval.

## Global domain ownership

Google also confirmed the robin.mba Domain property through a separate root TXT
challenge. The global decision, verbatim operator excerpts, public DNS records
and preservation evidence are in [robin-mba-google-verification.md](robin-mba-google-verification.md),
mirroring canonical KStore Admin-Manual INFRASTRUCTURE/domains/robin.mba-google-verification.md.
Global INFRASTRUCTURE.md revision 7 preserves the prior full document and links
the detailed record. Literal readback succeeded; semantic indexing is pending.

## Google branding verified and published — 28 October 2026

At 15:28 UTC, a fresh Chrome inspection confirmed the existing OAuth branding
name is Natally and the branding-domain list contains exactly two entries:
`robin.mba` and `gen-lang-client-0714568880.firebaseapp.com`. Search Console
reported "You are a verified owner" for `https://natally.robin.mba/`. The public
homepage opened the marketing page without requiring sign-in.

The console still showed the previous failed verification reasons (ownership,
more than ten domains, and a homepage behind login). After confirming those
three conditions were corrected, the operator-authorized re-verification was
submitted. Google returned verified; Publish branding was then applied. The
resulting status was: "Your branding has been verified and is being shown to
users." Evidence is `DOCS/TEST-RESULTS/google-branding-published-28oct2026.jpg`;
the preceding request is `google-branding-recheck-28oct2026.jpg` in that folder.

The subsequent deployed `https://natally.surge.sh/?app=1` Continue with Google
action opened Google's account chooser with "to continue to Natally" and the
Natally Terms and Privacy links. This was directly observed in the customer
prompt, not inferred from the console. No account was selected; the popup was
closed after inspection. The custom-domain app's existing session was preserved.

This supersedes the earlier pending-branding status in this record and verifies
the visible Google prompt name. It does not establish a completed Google, email
or SMS login, a Windows return callback, or Android sign-in. No auth domain,
OAuth client, Firebase provider, DNS record or application build was changed in
this action. The explicit build hold remains.

A separate follow-up attempted the same existing Google account already shown
in the custom-domain app's account dialog. The account-selection action timed
out in browser control; Google's popup then remained on its loading state for
more than two minutes and the app did not report a signed-in result. The popup
was closed. This is an unsuccessful verification attempt, not evidence that
the account credentials or Firebase configuration caused the stall. The
existing custom-domain session was left signed in.
# Current build authorization and logo preparation — 28 October 2026

The operator's later instruction "no dont kleep builds on hold. build now in
parallel" supersedes the earlier build hold recorded below. The prescribed full
matrix is running as 1.12.86707; this is not proof of repaired authentication,
Google Play purchase, restore or paid inference.

Prepared the existing high-resolution hero as
`public/branding/natally-hero-google.jpg` (1586 × 992; 520017 bytes), a JPEG format
conversion of `public/marketing-assets/natally-paywall-original.webp` without
crop, resize or regenerated artwork. Google OAuth logo upload has not completed:
the browser extension requires file-URL access before its upload API can supply
the selected local file. Published Natally display-name branding remains a
separate, confirmed observation.

