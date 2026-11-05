---
written_utc: 2026-11-04T10:26:47Z   (05:26 America/Toronto)
session: https://claude.ai/code/session_01Q4wdhSBmBCZGmF2siH9dL2 (cloud container, not tied to a machine)
repo: natally-ai-studio master (see `git log` for the head at reading time)
master version: v1.44.96449 (stamped by a failed build_all.sh run; nothing deployed)
live version: v1.42.95682 on natally.robin.mba and natally.surge.sh (broken landing at `/`)
status: STOPPED. Nothing running. Every open item awaits Robin.
---

# Handoff — landing, billing, Surge, KStore over VPN

## Task list

🟫 Launch / infrastructure
- ✅ Working v1.32 landing files restored in master (`57ea43c`: `src/main.tsx`,
  `src/marketing.tsx`, `src/marketing.css` from e9522ff). Verified locally on the dev
  server: header, nav, atelier, 8 sections. NOT deployed. Unsigned (ARCHITECTURE R15).
- ⬜ Live site still v1.42 with `/` showing only the inset. Cause: unified-entry WIP
  `5c6ef3d`, brought into master by my reconciliation `5f71a82`.
- ✅ `build_all.sh` line 59 defaults restored (`33ba799`); a comment from my 0fe31f7 had
  swallowed DEPLOY_EXISTING/VERIFY_ONLY/CONTINUE. Unsigned (R15).
- ⬜ A build from the cloud container fails in preparation: `cargo tauri` is not
  installed (`cargo install --locked tauri-cli --version '^2'`, or
  `scripts/cloud-build-env.sh`). Robin stopped the second run. Do not build on aero5x
  (not a development workstation).
- ⬜ Surge: natally.robin.mba and natally.surge.sh are claimed by the OLD account
  `shannon-coinbase@robin.mba` (login saved only on Windows PC DESKTOP-CN0GDTR). The NEW
  account may be refused for those domains; then DNS must change through Namecheap.
- ⬜ Namecheap API works but allowlists Robin's home IP only; this cloud session's
  egress was 160.79.106.18 / 160.79.106.133.
- ⬜ Landing design (R14, held): v1.10/v1.17 nav, whole hero sticky, copy beside it,
  inset chart zooms to main when the chart section scrolls in and back out.

🟨 Billing (ARCHITECTURE R13 + R13b, held; no checklist; no code)
- Traced with CodeGraph 1.6.2 (installed; index current, 4,322 nodes / 11,481 edges):
  - history: AccountBillingDialog `readCustomer` → `restoreBillingPurchases` (first) →
    `getCheckoutCustomer` → `projectWebCustomer` (`revenueCatCheckout.ts:252-262`), which
    DISCARDS `CustomerInfo.nonSubscriptionTransactions` (id, product, date). Any
    billing-server failure therefore shows "could not be refreshed" with no transactions.
  - balance: `readCreditBalance` → `getRocheBalance`, read at 1,000,000 units/USD → Robin's
    real 79 ROCHE shows as 0.01 Cr.
  - runtime uses `billing/revenuecat-commerce.mjs` only; `billing/commerce.mjs`
    `createCommerce` has 0 callers (dead) — not yet in R13.
  - Top Up circles: Top Up → CreditActions → (live) Add credits → souvenir paywall → back.
- Next step (operationalized, Robin 2026-11-04): finish CodeGraph verification of every
  R13 row (wallet units, /billing/history, CreditActions, Top Up flow, chat Add credits,
  souvenir product id, key TTL), correct R13 one commit per line, then STOP and show the
  verified R13.
- RevenueCat (done via API 2026-11-03): NATALTURN grants removed + archived (has
  transactions); AICREDIT deleted; US$0.99 "Exploration credits" detached from its
  package. Souvenir price US$30 still to set in the dashboard (Robin).

🟪 KStore (not reachable from cloud; nothing from this session is in KStore)
- Robin's ruling: VPN only, never an open port. Proposed: Tailscale on aero5x; ACL
  `tag:cloud-agent` → `.87:8788` only; ephemeral tagged auth key in Admin-Manual global
  infrastructure; cloud environment Network access allowing controlplane.tailscale.com,
  login.tailscale.com, *.tailscale.com, log.tailscale.io; KStore bearer token on top;
  `rebots-online/kstore` attached for the client. Robin: "not going to work today".

⚪ Deferred: R13b souvenir generator, PDF layout, Stack SFTP hosting, SMTP email.

## Rules set by Robin this session (Admin-Manual global rules)
- Rule 0a: CodeGraph → ARCHITECTURE → STOP for sign-off → CHECKLIST → STOP for sign-off →
  code or coder subagents. Present each conceptual step as operationalized steps with
  the next stopping point; do not run ahead.
- Rule 0b: in ALL projects the version comes only from the build script; never stamp
  by hand; never title a commit with a version (my `56223f8` hand stamp violated this).
- Print the colour-coded task list every turn.
- One commit and one push per line written, until consistent.

## Credentials (values in Admin-Manual only, never in this repo)
- New Surge account `robinsaiworld+surge-natally@gmail.com` (email confirmed by Robin):
  password and token in Admin-Manual `CREDENTIALS/global-infrastructure/surge-deploy-account.md`
  and `surge.env`.
- RevenueCat secret and exact public keys: Admin-Manual
  `CREDENTIALS/RevenueCat/Natally/credentials.env`.
- OpenRouter, Google AI and Android signing are now env docs in Admin-Manual, so
  `environment.mjs resolve` completes (117 keys) from Admin-Manual alone.
  BILLING_KEY_ENCRYPTION_KEY, REVENUECAT_WEBHOOK_AUTH, REVENUECAT_STRIPE_PUBLIC_KEY and
  REVENUECAT_CLI_PROFILE_JSON exist only in KStore and are left empty (server-side).

## Do not
- Build on aero5x. Change code before both sign-offs. Stamp versions by hand.
