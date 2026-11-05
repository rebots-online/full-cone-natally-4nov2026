# robin.mba — global DNS and Google ownership

Recorded: 27 October 2026, America/Toronto. Scope: global infrastructure for
Robin's AI World, with Natally as the initiating project. This repository file
mirrors the canonical Admin-Manual record in KStore; it is not a competing source
for infrastructure or credentials.

Canonical document: `INFRASTRUCTURE/domains/robin.mba-google-verification.md`,
source type `admin-manual`. Global index: `INFRASTRUCTURE.md`. Natally-specific
settings: `PROJECTS/Natally/INFRA/public-entry.md` in the same source namespace,
mirrored locally at `DOCS/INFRA/natally-public-entry.md`.

## Decision and scope

The original issue was Natally's Google OAuth branding being withheld. Google
reported excessive authorized domains, unverified homepage ownership and a
homepage requiring login. The coordinator reduced the Natally branding domain
list and verified the Natally URL-prefix property. The operator then explicitly
clarified that ownership of `robin.mba` is global infrastructure and required both
the global setting and the reasoning behind it to be recorded in Admin-Manual.

Decision: maintain a Google Search Console **Domain property for `robin.mba`**,
covering the domain across protocols and subdomains, alongside the narrower
Natally URL-prefix property. Document the domain ownership and shared DNS rules
globally; reference them from Natally's project record. Do not describe a verified
URL-prefix property as proof that the entire root domain was verified.

This decision does not authorize unrelated OAuth clients, domains, credentials,
mail-routing changes or a new hosting provider. No new credential was created.
The existing Namecheap production credential was retrieved from its canonical
KStore Admin-Manual record for the explicitly requested DNS operations.

## Discussion excerpts establishing the decision

The following are verbatim operator excerpts from the active Natally discussion
on 27 October 2026. Spelling is preserved. The preceding section is the normalized
decision, not a replacement for these excerpts.

> by the waY there are way too many domains listed in the .. it hink its firebase google config that it refeuses to displasy mybranding now becdause it exceeds 10. it should only need one or two

> build out with google everything necesary, rewcording ther infra seettings in BOTH zkstore ANED DOCS/ under the infra and in Admin-Manual under the project

> Admin-Manual global infra seettings as applicable too (e.g robin.mba verification to google is not a natally speefifi infrta matt3er but a global onie)

> and the decision and excerpt of this discussion turtns that led to the doingverification for robin.mba too, then do the global (but issue a subagent and have it document everything too to global )

The operator also reported unplugging the server and directed use of a specific
Namecheap DNS record while preserving the wildcard's general route. Accordingly,
the Natally site continues to route directly to Surge; the offline nginx server
was not reconfigured. The global documentation subagent was explicitly assigned
to this record while the coordinator retained the Google console session.

## Ownership scopes and observed state

| Google property | Scope | Verification mechanism | Observed result |
| --- | --- | --- | --- |
| `robin.mba` Domain property | Root domain, protocols and subdomains | Root DNS TXT below | Google displayed **Ownership verified**, method **Domain name provider**, observed by coordinator |
| `https://natally.robin.mba/` URL-prefix property | That HTTPS URL prefix | Dedicated DNS CNAME below | Google displayed **Ownership verified**, observed by coordinator |

Google account in the verification session: `robinsaiworld@gmail.com`. This is
the observed verification account, not a claim about every owner or permission
on the properties. No additional users were invited or granted access.

The first root-property verification attempt failed with a message referring to
CNAME records, despite the displayed root challenge being TXT. The coordinator
reopened the property, explicitly selected TXT and retried. Google then displayed
**Ownership verified**, with **Domain name provider** as the verification method.
The property was created using the Domain input `robin.mba`, not URL-prefix.
The successful Google result and independently observed authoritative DNS provide
separate evidence; the initial failed attempt is retained here for troubleshooting.

The Natally HTML-file alternative was downloaded as
`googleec5be2e6c03b1d80.html`, containing
`google-site-verification: googleec5be2e6c03b1d80.html`. It is not the mechanism
that established the observed Natally verification. Publishing or retaining that
file later can provide an additional method; a downloaded file alone proves no
ownership.

## DNS records and preservation

Provider: Namecheap BasicDNS for `robin.mba`.
Authoritative nameservers: `dns1.registrar-servers.com` and
`dns2.registrar-servers.com`.

| Host within robin.mba | Type | Value | TTL | Role |
| --- | --- | --- | --- | --- |
| `@` | TXT | `google-site-verification=ahj18DAmUbFdnU010ncCX0-bzbjCcxi8D4kAlb7_mtQ` | 300 | New root-domain Google ownership challenge |
| `ysmyumzxmybd.natally` | CNAME | `gv-xyayoqx62vxvvx.dv.googlehosted.com.` | 300 | Natally URL-prefix Google ownership challenge |
| `natally` | CNAME | `geo.surge.world.` | 300 | Existing direct Surge route |
| `*` | A | `104.158.190.71` | 60 | Existing general wildcard route; unchanged |
| `@` | A | `104.158.190.71` | 60 | Existing apex route; unchanged |

The pre-existing root Google TXT value
`google-site-verification=JRhyC4rdW1T5x9w307DlcQXeudkd8TtaWY9me0jIQJ8`
was retained. Do not assume it is obsolete or delete it: it can support another
existing verification owner or service.

Coordinator Namecheap API readback recorded:

1. Original zone: 24 records; the explicit Natally Surge CNAME already existed.
   No change to that record was needed.
2. Added the Natally verification CNAME: 25 records. All prior host records and
   email routing were confirmed unchanged.
3. Added the root Google verification TXT: 26 records. All 25 prior host records
   and email routing were confirmed unchanged.

The global documentation subagent independently queried
`dns1.registrar-servers.com` on 27 October and observed both root Google TXT
values and the Natally verification CNAME. Authoritative DNS presence and a
provider write are distinct from Google's final ownership confirmation.

The existing Namecheap email forwarding configuration and SPF
`v=spf1 include:spf.efwd.registrar-servers.com ~all` were preserved. No MX, SPF,
wildcard, apex A, unrelated hostname or existing verification record was removed.

## Credentials and maintenance

Credential location only:
`Admin-Manual → CREDENTIALS/global-infrastructure/namecheap.md` in KStore,
source type `admin-manual`; revision 2 was used by the coordinator. This document
contains no API key or authentication token. Use KStore and Admin-Manual for
credential retrieval; an unavailable service is not permission to recover secrets
from conversation histories or other incidental stores.

Namecheap `setHosts` replaces the submitted host-record set. Before any future
DNS write, retrieve the current full zone, merge only the authorized change,
preserve email-routing configuration and all unrelated records, submit the full
set, then read it back. Never replay an old zone snapshot over intervening changes.

Keep the new Google verification records in place after successful verification.
Removing a challenge can cause ownership loss. A future rollback should remove
only the exact newly added challenge record, only when explicitly authorized and
after confirming that another verified method preserves required ownership. It
must not alter the `natally` CNAME, wildcard, apex, old Google TXT or mail records.

## Related Natally OAuth correction

Natally's Google Cloud project is `gen-lang-client-0714568880` (display name
Natally). Its authorized branding domain list was saved from 22 entries down to:

- `robin.mba`
- `gen-lang-client-0714568880.firebaseapp.com`

The coordinator also removed obsolete AI Studio origins and redirects from the
existing web OAuth client while preserving current Natally and Firebase callbacks
and local development origins. The detailed client ID, URI set and public legal
URLs belong in the Natally project infrastructure record linked above. Firebase
Authentication's separate authorized-domain list was not changed by that cleanup.

Domain ownership does not establish OAuth branding approval, a functioning login,
or a working purchase. The public marketing homepage and Google branding review
remain separate unfinished release work at this checkpoint. The live Natally site
answers from Surge independently of the unplugged CT123 host; no nginx mutation
was performed.

## Documentation verification boundary

KStore literal publication, independent PostgreSQL verification and Qdrant semantic
indexing are separately reported in the publication receipt. A pending semantic
index is not a reason to alter infrastructure or abandon Natally implementation.
This file does not claim that all broader release requirements have passed.
