# natally-ai-studio design inventory — 19 October 2026

Destination repository: `https://github.com/rebots-online/natally-ai-studio.git`.
Destination OpenDesign project ID/name: `natally-ai-studio`.
No project with that name existed in the live OpenDesign list before this import.

## OpenDesign

The separate source is `Natally Crystal Ball Conversation 2026-10-17`, project
`natally-crystal-ball-conversation-2026-10-17-6733`, refined run
`5de9992f-660c-4de4-989b-5c5b5be0bd4b`. Its actual entry was fetched through MCP.
The import retains `index.html`, the earlier `index-v2.html`, original character
assets, design/motion contracts and provenance. It is a conversation/atelier
prototype with a chart dialog, transcript/composer, state rehearsal and motion
controls. It has no Profile, balance, top-up, order-history or billing-account
management screen. Original fixtures and silent simulation labels are preserved.

## Stitch

Recorded project: https://stitch.withgoogle.com/projects/8460014353109836944.
The repository's existing manifest attributes fourteen exports to this project:

| Export | View |
|---|---|
| PREPAID-01 Choose your reading | desktop, mobile |
| PREPAID-02 Make your chart interactive | desktop, mobile |
| PREPAID-03 Bring Natally home | desktop, mobile |
| PREPAID-04 Alby marketplace | desktop, mobile |
| PREPAID-05 x402 protocol | desktop, mobile |
| PREPAID-06 Review your reading | desktop |
| PREPAID-07 Your reading is ready | desktop, mobile |
| PREPAID-08 Pick up where you left off | desktop |

There is no account-management screen among these local exports. Some screens
contain a decorative profile image or example navigation; that is not a linked
account-management journey. Robin requires Stitch MCP for the live cloud
inventory and import. Direct MCP initialization and `tools/list` succeed at
`https://stitch.googleapis.com/mcp`; both `get_project` and `list_screens` for
project 8460014353109836944 return HTTP 401 Unauthorized without credentials.
This session exposes no authenticated Stitch tool, and the inspected Windows
MCP configurations contain no Stitch server. WSL configuration could not be
read because WSL invocations are not responding. The existing authenticated
connection is still being located; browser rendering is not an authority or a
substitute. Do not claim the local export is the complete current cloud inventory.

The atelier package is prepared under `LIBS/UI/STITCH/imports/` with the same
hashes. This local preparation is not evidence of a successful cloud import.

## Required additions from Robin's current instruction

1. Clicking the signed-in user's name opens Profile/account overview.
2. Balance and usage detail, with a Top up action.
3. Top-up quote, payment state, confirmation and recoverable failure/resume.
4. Natal-chart purchase: PDF and SPA, including interactive conversational reading.
5. Delivery/open-reading journey for purchased PDF/SPA access.
6. Expanded billing account management: orders, receipts, purchase history,
   recovery and refund states.

These requirements are recorded in DOCS/ARCHITECTURE.md. WooCommerce/custom
plugin owns commerce and paid access. Payment-funded Venice inference is a
separate funding/reservation/reconciliation mechanism behind that authority.
No payment, live provider funding or product entitlement implementation is
claimed by the screen inventory or atelier import.
