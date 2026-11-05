# Natally public entry and Google verification

Observed 27 October 2026. Infrastructure record; release is unfinished.

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
Surge with HTTP 200, independently of CT123/nginx. The marketing homepage is
not yet deployed. Preserve existing app and auth-helper paths during publishing.

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
