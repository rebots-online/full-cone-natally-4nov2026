# Annotated environment synchronization and contemporaneous credential resolution

Operator-directed, 29 October 2026. This applies the existing Admin-Manual
configuration/reproducibility rule. It does not change providers, rotate keys,
invent credentials, or alter product behavior. KStore remains authoritative.

## Ownership and files

`scripts/environment.mjs` is the dependency-free Node 24 helper. Its focused
checks live in `tests/environment.test.mjs`. The environment worker owns this
helper, the full annotated `.env.example`, and reconstruction of `.env` and
`.env.local`. The build worker owns coordinator invocation. The pack-selection
worker supplies the production catalog schema and does not edit these env files.
Only the named integrator writes Git. Live credentials and env files are not
published to the public repository.

## Exact interfaces

| Entity | Contract |
| --- | --- |
| `parseEnvironmentDocument(text)` | Use built-in `node:util.parseEnv` for values. Retain comments, assignment spans including quoted multiline values, and active names so edits never reduce an annotated file to a bare assignment list. |
| `synchronizeEnvironment({template,environment,local})` | Pure function returning annotated `.env` text. Keep the complete template comment sequence and active keys. Existing `.env` values override template values; retain differing `.env.local` overrides in their original file. Add local-only and live-only names in a clearly annotated supplemental section. Preserve extra live comments and document the originating file for supplemental names. Never copy an invented template value or literal credential. Repeated synchronization is byte-identical. |
| `checkEnvironment({template,environment,local})` | Return named findings, never values. Require every active template key and the ordered template annotations in `.env`; require the union of live/local names, with annotations for supplemental names. Reject bare/minimal files, fabricated values, literal credentials, invalid pointers and manually assigned coordinator-owned bindings. Blank optional fields are allowed; configured references must resolve later. |
| `parseCredentialReference(value,binding)` | Accept only `kstore://admin-manual/<document-path>#<ENV_FRAGMENT>`, without query/user/port or traversal. Fragment is an environment variable name. Invalid explicit references fail with the binding name. |
| `createKStoreClient(options)` | Existing WSL route: Ubuntu-24.04, user robin, Python module `/home/robin/.local/share/kstore-client/current/kstore_client.py`. Invoke `KStoreClient` through captured process pipes. No new host or dependency. Read/write only named Admin-Manual documents; require exact reads. Suppress child output/errors that could expose content. |
| `resolveEnvironment({root,client})` | Check configuration, merge `.env` then `.env.local`, resolve every explicit pointer freshly for this invocation, and return `{environment,publicEnvironment,references}` in memory. Parse the requested document with `parseEnv`; a missing/empty/nested reference fails with the binding name. Cache a document only within this invocation. `references` contains names/path/fragment/revision, never values. |
| `recoverShellCredentials(options)` | Read only GEMINI_API_KEY, GOOGLE_API_KEY, OPENROUTER_ADMIN_KEY and OPENROUTER_API_KEY from Robin's current interactive WSL `bash -ic` environment. Capture the process stream; never print values or read shell history. |
| `migrateEnvironmentCredentials({root,client,recover})` | Preserve exact pre-edit env/local contents in the named KStore checkpoints below, with exact readback. Recover only the four named WSL keys and credentials already present in the declared env files. Preserve already configured pointers and nonempty existing canonical fragments; never rotate/overwrite them. Add missing actual values with descriptive comments, verify exact KStore readback, replace only corresponding env assignments with pointers, then perform annotated synchronization. Preserve differing local overrides with a separate `<NAME>_LOCAL` fragment. A conflicting existing fragment fails by name before env mutation. Re-running is idempotent. |

The template uses `# @credential NAME` to identify credential fields and
`# @public NAME` to approve an already-public `VITE_` binding for frontend
projection. Credential names such as admin/API/private/encryption keys, tokens,
passwords, webhook authorization and credential-bearing database URLs are also
recognized without annotations, so supplemental names cannot bypass the rule.
Public RevenueCat/Firebase SDK keys may carry both annotations: the files hold
pointers, while only these explicitly public bindings may reach the frontend.
Private credential names cannot be approved for public projection. Undeclared
`VITE_` names fail until their real public use is annotated in the template.

## Commands and build integration

- `node scripts/environment.mjs sync [--root <directory>]`: reconstruct only
  `.env`, preserving `.env.local` overrides and annotations; no provider access.
- `node scripts/environment.mjs check [--root <directory>]`: validate, printing
  only status/names. It does not mutate files or resolve credentials.
- `node scripts/environment.mjs resolve [--root <directory>]`: resolve and print
  only a non-secret summary. `--json` is an explicit captured-process transport
  returning the environment map; refuse a TTY and never write that map to disk.
- `node scripts/environment.mjs migrate [--root <directory>]`: perform the scoped
  actual migration and synchronization above; log only binding names and revisions.

The prescribed coordinator runs `check`, then captures `resolve --json` and sets
the returned names in its own process environment before stamping/preparation or
deploy-existing execution. It never echoes or persists the captured map. The
existing Vite public projection receives only annotated public `VITE_` bindings.
The helper does not build, stamp, deploy, or write resolved values into env files.

The environment worker also owns the bounded handoff in the existing
`scripts/build-all-platforms.ps1`: `Import-ResolvedEnvironment` runs the two
commands above, captures and validates the plain JSON map without echoing it,
installs string values using the Process environment target, and adds only the
resolved public `VITE_` names to `WSLENV`. It runs before the deployment branch,
matrix lock, stamp, transcript and preparation. Focused assertions in
`tests/environment.test.mjs` exercise this function independently; they never
invoke the build/deployment body. No signing or product changes belong to this
handoff.

The verified Python `read_document` result is an object containing `path`,
`doc_uuid`, `source_type`, `revision`, `head_revision`, `content` (string),
`exact` and `sha256`. Read its `content` field and require `exact: true`; do not
coerce the whole result to a string. Only an actual HTTP 404 is a missing document
that may be created; transport or inexact-read failures must preserve it.

## Exact storage and reconstruction

| Bindings | Canonical Admin-Manual document |
| --- | --- |
| OPENROUTER_ADMIN_KEY, OPENROUTER_API_KEY | `CREDENTIALS/OpenRouter/credentials.env` |
| GEMINI_API_KEY, GOOGLE_API_KEY | `CREDENTIALS/GoogleAI/credentials.env` |
| RevenueCat keys, including the two current public SDK keys | `CREDENTIALS/RevenueCat/Natally/credentials.env` |
| Other actual declared project credentials | `CREDENTIALS/Natally/credentials.env` |

The existing admin pointer is exactly
`kstore://admin-manual/CREDENTIALS/OpenRouter/credentials.env#OPENROUTER_ADMIN_KEY`.
Its exact revision-1 value already passed the real OpenRouter management
`GET /api/v1/keys` request. Preserve it. Append the actual tooling key without
replacing this value or the existing document annotations.

Before mutation, preserve `.env` and `.env.local`, when present, at
`CREDENTIALS/Natally/env-before-annotated-sync-29oct2026.env` and
`CREDENTIALS/Natally/env-local-before-annotated-sync-29oct2026.env`. Never replace
an existing first checkpoint. The prior 650-byte checkpoint at
`CREDENTIALS/Natally/env-before-key-restoration-29oct2026.env` remains intact.

Retain the complete current template and production defaults. Replace fabricated
`MY_*`, `sk-or-v1-`, `VENICE_*_KEY_` and `your-approved-api.example` values with
empty documented fields. Do not invent missing service URLs or catalog IDs.
Add missing actual configuration names GOOGLE_API_KEY,
VITE_REVENUECAT_CONVERSATION_PACKS_JSON, VITE_X402_FACILITATOR_URL,
VITE_BILLING_API_URL, FIREBASE_SERVICE_ACCOUNT_JSON and SURGE_TOKEN. Document
NATALLY_RELEASE_ID, NATALLY_DEPLOY_COORDINATOR, NATALLY_DEPLOY_INVENTORY and
RELEASE_SOURCE_COMMIT as coordinator-owned comments, never active assignments.
Android release bindings are ANDROID_KEYSTORE_PATH (actual local file),
ANDROID_KEY_ALIAS, ANDROID_KEYSTORE_PASSWORD and ANDROID_KEY_PASSWORD (credential
pointers), and ANDROID_SIGNING_CERT_SHA256 (public expected fingerprint). Keep
unknown values empty; the release worker verifies actual production bindings.
Resolved public VITE bindings reach WSL builds through WSLENV variable names;
their values are never placed in command arguments or generated env files.

The pack binding is a JSON array of `{cadence,tier,packageIdentifier,
webProductIdentifier?,androidProductIdentifier?}`. Cadence is `monthly` or
`one_time`; tier is `1`, `5`, `10` or `25`. The operator's latest correction
restores $1 Play choices; a real native product does not imply a Web product.
Only actual provider IDs are accepted;
localized prices, ROCHE grants and successful outcomes are never authored here.

## Verification

Focused checks cover annotation/key union, distinct local overrides, multiline
round trips, supplemental names, byte-idempotent sync, rejection of bare envs and
literal/fabricated credentials, named pointer failures, exact document readback,
no private frontend projection and idempotent migration preserving existing keys.
Actual acceptance then runs the real scoped WSL recovery, KStore write/readback,
annotated sync/check, and in-memory pointer resolution without exposing values.
The restored management binding must retain its working real API result. Full
build/deployment remains exclusively the prescribed coordinator's responsibility.
