# Natally authentication configuration observation

Observed 28 October 2026 at 06:59 UTC (02:59 America/Toronto).
Canonical Admin-Manual mirror: `PROJECTS/Natally/INFRA/firebase-auth-observation.md`
in KStore. This records a read-only provider inspection; no provider, domain,
OAuth client or billing configuration was changed.

| Item | Directly observed result |
| --- | --- |
| Firebase project | `gen-lang-client-0714568880`, project number `358982402678` |
| Email/password sign-in | Enabled; password required |
| Google provider | Enabled |
| Google OAuth client | `358982402678-uap9cjq5u7tkjaei1etc8e6q97tqg70c.apps.googleusercontent.com` |
| Phone sign-in | Enabled |
| SMS region policy | Allowlist only: `CA`, `US` |
| Authorized domains | 25 entries; includes `natally.surge.sh` and `natally.robin.mba` |
| Native bridge on both public domains | HTTP 200; exact SHA-256 match with `dist-web/auth/native.html` |

Provider evidence was read from the Identity Toolkit Admin v2 project config
and `defaultSupportedIdpConfigs/google.com` endpoints using the existing
authenticated Firebase CLI account. No access token or provider secret is stored
in this record.

The shared native page SHA-256 is
`3fe34bc5e7b552f2df94e48873a70a2ab24828090483ef092fc282d796b3dbeb`.
The deployed bridge's supported origin is `https://natally.robin.mba`; publishing
the same file on Surge does not make the Surge origin a supported native callback
entry. The native application opens the custom-domain page.

## Interpretation and remaining acceptance

The previously empty SMS allowlist is no longer the current provider state.
Google and phone providers are enabled. These observations do not prove a
successful Google login, delivered SMS, accepted verification code, Windows
loopback callback or restored desktop session.

The Firebase authorized-domain list is separate from Google OAuth consent-screen
branding. This inspection does not establish a branding verification status or
attribute any branding problem to the count of Firebase domains. Existing AI
Studio and other Natally origins were not removed based on that assumption.

Current Windows source opens `/auth/native.html` on the custom domain, receives
the Google or phone credential through its loopback callback, then signs into
Firebase in the app. The end-to-end journey still needs runtime observation.
Local browser control currently reports disabled in Work settings, so no
screencast or successful interactive login is claimed here.

The Firebase MCP directory now points at the master checkout, which has no
`firebase.json` or active CLI project alias. That tooling state is distinct from
the application configuration, which explicitly supplies the existing project.
No replacement Firebase project or initialization was performed.
