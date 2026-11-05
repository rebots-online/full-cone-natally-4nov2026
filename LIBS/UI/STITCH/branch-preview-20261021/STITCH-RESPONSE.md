# Stitch generation response

Verbatim tool text, preserved as provenance. Generated claims are not acceptance evidence; source corrections and observed checks are recorded with the working preview.

I have designed and added the new **"natally-ai-studio — Profile and billing preview"** screen to the project canvas, strictly honoring all branch architecture constraints, the uploaded design system tokens, and your operator requirements.

### Key Architecture & Implementation Details:

1. **Responsive Editorial Layout & Atmosphere**:
   - **Desktop**: Asymmetric split structure featuring a left sidebar for account navigation (`profile`, `balance`, `topup`, `offers`, `billing`, `alby`, `conversation`) and a right content pane.
   - **Mobile**: Seamless single-column collapse with minimum 44px touch targets and full keyboard accessibility.
   - **Tokens**: Deep observatory charcoal (`#18161B`), raised containers (`#242127`), hairline borders (`#514953`), starlight text (`#F5F2E9`), and warm celestial brass (`#C9AA60`).
   - **Original Asset Only**: The authentic mascot asset (`natally-mascot.webp` / fallback `natally-idle-400.webp`) is preserved proportionally without replacement avatars.

2. **Operator Decisions Upheld**:
   - **WooCommerce Deferred**: Explicitly isolated for RevenueCat (site-centric PDF / SPA purchases) and Alby (metered per-turn reading conversations).
   - **Zero Live Settlement Simulation**: Truthful indicators ("Price shown in server quote", "Unavailable until verified", "Branch preview — payments not connected"). No arbitrary prices or simulated charges.
   - **Hosted Inference Boundary**: Clearly states that PDF/SPA ownership does not imply unlimited hosted conversations.

3. **Complete Semantic Views & Addressable DOM IDs**:
   - Top user name trigger: `id="profile-name"` (clicking opens the Profile view).
   - Sidebar & Navigation: `id="view-profile"`, `id="view-balance"`, `id="view-topup"`, `id="view-offers"`, `id="view-billing"`, `id="view-conversation"`, `id="view-alby"`.
   - Content views with matching `data-view`:
     - **Profile (`data-view="profile"`)**: Status cards, quick review actions, and the `Expand billing account management` trigger.
     - **Balance (`data-view="balance"`)**: USD credit balance isolated from satoshis/turns and provider treasury; empty usage state.
     - **Top Up (`data-view="topup"`)**: Server quote request flow with `id="request-topup"` and payment recovery notes.
     - **Offers (`data-view="offers"`)**: Three canonical offers via accessible radio selector (`name="offer"` values `pdf-only`, `pdf-spa`, `home`), checkout button `id="buy-reading"`, and `id="restore-purchases"`.
     - **Billing (`data-view="billing"`)**: Empty receipt state, refund/recovery policy, and portal link `id="open-billing-portal"`.
     - **Alby (`data-view="alby"`)**: Textarea `id="reading-question"`, single-turn quote manifest, `id="quote-turn"`, `id="pay-turn"`, and `id="resume-turn"` with delivery protection guidance.
     - **Conversation (`data-view="conversation"`)**: Link to original OpenDesign atelier view with `id="open-atelier"`.
   - Accessible status announcer: `id="preview-status"` (`aria-live="polite"`).

## Stitch suggestions

- Inspect the mobile view at 390px viewport width
- Test tab-navigation and keyboard accessibility across the sidebar
- Review the Alby per-turn quotation parameters
