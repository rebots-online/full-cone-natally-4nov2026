# Billing specification/client and onboarding delivery observations

23 October 2026; current host only, GitHub master. This records observed scope,
not completion of the full billing or reading journey.

## Published source

- `4eeb9f9`: separate DOCS/BILLING-SPEC.md, architecture delta, entity inventory,
  checklist and continuous billing demonstration trajectory.
- `ffaa6ad`: Firestore private intake accepts optional `readingStyle` only when
  `plain` or `merlin`; existing account-owner and other field rules unchanged.
- `56b363a`: billing access client, account recovery control, provenance for installed
  managed keys, and documented experiment configuration. The actual ignored `.env`
  has proposed offer USD 30, top-up 4000 basis points, one-year archive term;
  included inference allowance is empty, awaiting an operator experiment value.
- `69aa0b8`: one 180-second response deadline across direct inference/tool continuations;
  response-body abort now reports timeout rather than malformed JSON.

SPA source `69aa0b8` deployed to natally.surge.sh in Surge release `1792764744640`.
Live HTML references `assets/app-BCh18Kir.js`, matching the delivered build.
Remote master was read back as `69aa0b8692832cba5c9eeccdb7db0befa268735b`.

## Actual browser journey

The previously authorized erase opened six-step onboarding. Refresh kept it in
onboarding. Robin completed name, birth date/place/time, current location and reading
style. Begin initially failed with `Missing or insufficient permissions`.

The actual named database's published rules were read in Firebase console: its field
allowlist omitted `readingStyle`, matching the source defect. The committed correction
was published there; console showed the new active revision at 10:06 AM EDT.
Clicking Begin then saved the profile, opened the upfront offer, and Explore free first
entered the room with the automatic full-reading request. Reload after completion
restored the saved profile. This proves the observed schema correction, not a complete
successful reading.

The first reading received direct OpenRouter HTTP 200 headers, then its body aborted
at the previous deadline. The UI mislabeled this as unreadable. The corrected deadline
was deployed, and the same full-reading request was submitted through the live client.
That retry also received HTTP 200 headers but did not finish its body within three
minutes. The UI correctly displayed `OpenRouter took too long to finish the reading`
and retained the complete question and Retry control. There is still no completed
900–1200-word first reading or observed provider model for this attempt. Increasing
the deadline fixed the misleading error classification, not the upstream delay.

On the new release, Account settings displayed `Reading access · Connected` and
`Check purchased reading access`. Activating it showed `Purchasing is not connected
yet. Your current reading access is unchanged.` The personal connection remained
connected; no allowance was assigned and no management API mutation was made.

The retired Netlify `/.netlify/functions/chat` endpoint returned HTTP 404. No LLM
relay was reintroduced.

Local evidence directory (ignored; retains account-specific journey):
`.tmp/direct-openrouter-20261023/`. Files include `restart-onboarding.png`,
`intake-rules-published.png`, `billing-client-live.png`, and timestamped screencast
frame collections. These are partial journey evidence, with recording gaps; they
are not the final comprehensive continuous screencast and contain no captured audio.
The final billing/reading screencast collection contained zero frames, so it is not
video evidence. `billing-client-live.png` and `reading-provider-timeout.png` record
the actual final UI states; earlier onboarding frame collections remain partial.

## Remaining external configuration and implementation

RevenueCat CLI has no active credential. The configured RevenueCat MCP connection
was then attempted through Codex's MCP transport, without a model/agent turn. Its
OAuth refresh failed: `invalid_grant: OAuth authorization required`, reported as
`notLoggedIn`. The user has been asked to reconnect RevenueCat or authenticate its
CLI. The existing project/offering IDs in the specification are source bindings,
not a fresh live catalog readback.

The initial allowance has not been chosen. Actual product mapping, server API
credential, webhook authorization, ledger, provisioning worker and checkout-success
wiring remain unfinished. No purchase or payment has been made, no managed key has
been issued, and no paid access or frozen archive has been represented as operational.
The billing service URL remains unset so the client does not call a nonexistent service.

The separate spec is complete as a document. BP-3 remains in progress; BP-4 requires
the actual RevenueCat connection/catalog and policy configuration before binding and
demonstrating purchases. BP-5 and the complete initial-reading journey remain open.
