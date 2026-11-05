---
title: Handoff — 2 Nov 2026 (repo reconciliation, build_all.sh, purchase→key defect)
conversation_id: session_01Q4wdhSBmBCZGmF2siH9dL2
created_at_utc: 2026-11-02T23:00:00Z
updated_at_utc: 2026-11-02T23:00:00Z
file_computer: claude.ai cloud session container (host identity unverified)
file_absolute_path: /home/user/natally-ai-studio/DOCS/HANDOFF-2nov2026.md
authority_revision: natally-ai-studio branch ccr-7cae02ab-pll3nk (PR #2)
scope_locations:
  natally-ai-studio: https://github.com/rebots-online/natally-ai-studio (canonical; GitHub template)
  natally-ubuntu: https://github.com/rebots-online/natally-ubuntu (build twin; to retire after Ubuntu run)
  natalby: https://github.com/rebots-online/natalby (Alby marketplace edition, made from the template)
  admin-manual: https://github.com/rebots-online/Admin-Manual (global source of truth)
---

# Handoff — 2 Nov 2026

## Order of work (Robin's rulings today)

1. **STOP-HARM** — pause card checkout (RevenueCat Web Billing / Stripe) and
   settle the US$1.98 (refund, or carry into the firebase wallet after the
   fix). The live Cloud Run billing service still has the wallet defect.
2. **BILLING-HOST** — fixed- or zero-cost hosting only (Oracle Always Free,
   Hostinger prepaid if VPS, Vultr prepaid). Cloud Run is untenable before
   revenue. Needs host choice + access, then a VM deploy script.
3. **PLAY-CLOSED-TEST** — start the 14-day clock with the first build that
   can't take money without giving a reading. v1.41.92153 is withheld.

On hold behind these: provider-funding design, Venice/OpenRouter card-vs-
crypto split, natalby history choice, pay-per-use rails.

## Done today (all pushed to `ccr-7cae02ab-pll3nk`, draft PR #2)

| Commit | What |
|---|---|
| 5f71a82, 4802f58 | natally-ubuntu innovations ported; `build_all.sh` restored at root as the only build entry (Ubuntu: Android aab/symbols/apk, Windows exe+NSIS via cargo-xwin, Linux, web/PWA; Windows: hands off to ps1, adds MSI); deploy-surge.sh no longer Windows-only |
| a1ad54d | **Purchases fund the key limit**: commerce credits the runtime wallet (firebase), not RevenueCat ROCHE; regression test `tests/purchase-funds-key.test.mjs` fails on old code, passes now |
| 6fe0c1e … fca8937 | ARCHITECTURE.md: two rail classes (prepaid → one wallet; x402/Alby per-turn → no balance, contemporaneous keys); key limit is a spend ceiling, not a balance; provider funding not yet architected; card-vs-crypto provider bifurcation (assignment open) |
| f0921a3 + this | CHECKLIST: Play closed test priority; row repair; STOP-HARM / BILLING-HOST / PLAY-CLOSED-TEST order |

Verified: `tsc --noEmit` 0; suite 157/191 (34 failures identical to the
untouched baseline); no real build run yet on either physical computer.

## Facts established

- Keys: 1-hour OpenRouter keys, created at $0, AES-GCM-encrypted in
  Firestore `natallyCreditAccounts`; each request PATCHes an **absolute**
  limit = accounted usage + available balance (idempotent).
  `billing/customer-session.mjs` (RevenueCat-attribute keys) is unwired.
- natally-ai-studio is a GitHub template; natalby was created from it
  (single "Initial commit", same branches) and has no work of its own; it is
  28 minor versions behind. Template copies share no history.
- `src/services/x402Access.ts` is an unwired client-side seam (browser
  success + localStorage) that does not meet the roadmap's server-
  verification rule. No pay-per-use rail exists yet.
- v1.41.92153 AAB: signed with the production upload certificate
  (SHA-256 56C13674…3BD943), hashes match its inventory — but its card
  checkout calls the defective Cloud Run service.

## Decisions waiting for Robin

- Merge PR #2.
- Billing host + access details; go-ahead for the VM deploy script.
- Which provider serves card methods (Venice.ai or OpenRouter).
- natalby: (A) stay a template copy, or (B) connect it to studio history.
- Key lifetime: keep 1 h, or ~1 min contemporaneous for pay-per-use.
- Review the I0 v1.22 draft:
  Admin-Manual `INBOX-To-Be-Evaluated-Aligned-and-Integrated/I0-v1.22-unleveraged-launch-DRAFT-20261102.md`.

## Later on 2–3 Nov 2026 (Robin's rulings, all pushed to PR #2)

| Ruling | Result in code / records |
|---|---|
| RevenueCat is authoritative for everything about a user account; Firebase is only a working database | `BILLING_CREDIT_BALANCE_STORE=revenuecat`; credit-policy requires it; ARCHITECTURE authority rule (645c8ad) |
| The US$1.98 was correctly recorded in RevenueCat ROCHE; the fault was the key limit reading Firebase | Test reproduces it (ce0894c) |
| No Cloud Run, no homelab for billing; use the existing Netlify function mechanism | `netlify/functions/billing.mjs`; dev relay `reading-access.mjs` removed (881c4c5) |
| One-command deploy | `node scripts/deploy-billing-netlify.mjs --site natally-hosted-chat` (befe585) |
| Customers never need to click Restore; one button kept for reassurance, and it works | Automatic restore on load, on open, after payment (befe585) |
| "Reading access" is meaningless: without credits Natally teaches general astrology | Removed from customer text (befe585) |
| Never take payment before showing what it buys | Add credits opens the offer walkthrough (b89071f) |
| RevenueCat's paywall editor should hold the walkthrough; Google Play Billing is the main processor on Android (Play gift cards) | Not yet built: needs `purchases-ui` on Android + Play products created after the first closed-test upload |
| Admin code: US$4 = 400 credits (1 credit = 1 cent), added to the RevenueCat balance like a US$10 purchase at 40% | 8118fb3; set `BILLING_REDEMPTION_CODE` and `BILLING_REDEMPTION_ALLOWANCE_USD=4` in Netlify env |
| Any redemption behaviour is defined by the code itself | `billing/redemption-codes.mjs`; kind `grant` now; gift certificates, coupons (30% off), single-use codes later (346e81d, CHECKLIST REDEMPTION-KINDS) |
| Short-lived keys; the app holds its own key | Unchanged design; possible later simplification: never store the key server-side |
| Infrastructure is its own project; KStore is the single source of truth; Admin-Manual and its GitHub mirror are backups | aero5x .87 → pve-114 LXC migration and the KStore TUI are separate task cards, not in this repo |
| Robin is in extreme mental overload: replies must be a few words | — |

## Next, in order
1. Merge PR #2.
2. Netlify env: `BILLING_REDEMPTION_CODE`, `BILLING_REDEMPTION_ALLOWANCE_USD=4`.
3. `node scripts/deploy-billing-netlify.mjs --site natally-hosted-chat`.
4. Set `VITE_BILLING_API_URL` to the Netlify site; point the RevenueCat webhook at `/billing/webhook`.
5. `bash build_all.sh` → upload AAB + symbols to the Play closed test.
