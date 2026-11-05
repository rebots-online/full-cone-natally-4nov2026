# Automatic reading access and mobile recovery

Operator correction: provision through billing; during development supply Robin's
personal inference key automatically. This supersedes DI02/DI05's manual-only
setup for this development account. BP01–BP12 remain the paid provisioning contract;
the temporary grant is never a purchase, allowance, or completed paid provisioning.

| Requirement | Entity and change | Task / scene |
| --- | --- | --- |
| AR01 | `billingAccess.ts/requestBillingAccess` accepts an explicitly development-sourced grant with expiry and no invented allowance; `ensureReadingAccess` deduplicates concurrent acquisition, retains existing keys, guards account/key changes. `hostedInference.ts/requestHostedInference` acquires access before direct inference. | AR-1 / A1–A3 |
| AR02 | `netlify/functions/reading-access.mjs` handles existing `/billing/access` and `/billing/reconcile` routes. Validate Firebase bearer using project accounts:lookup, project/issuer/expiry/validSince and verified account identity; restrict to server allowlist, allowed SPA origin and temporary expiry. Server-only personal key, no management key. No caching/logging of credentials; never echo provider errors. | AR-1 / A1–A4 |
| AR03 | `inferenceAccess.ts` adds development provenance/expiry; expired grants stop loading. Existing personal/managed keys keep precedence. `InferenceAccessSettings.tsx` describes automatic access and explicit refresh, without labelling development as paid. | AR-1 / A1–A4 |
| AR04 | `NatallyChatbot.tsx` applies mobile layout in embedded mode; selected targets and error live in scrollable messages, leaving composer reachable. Typed access errors open settings directly; retry reacquires access and preserves the question. `index.css` compact header/buttons, wrapping, message min-height and scrolling. | AR-2 / A2–A5 |
| AR05 | Build/deploy SPA and access function, configure temporary secret through server environment only, publish source and actual observed evidence. Voice LC01–02 and all existing billing/phone/audio obligations remain open. | AR-3 / A1–A5 |
| AR06 | Actual A1 retry recovered access but returned multilingual corruption containing many Unicode replacement characters. `hostedInference.ts/hasCorruptReadingText` rejects three or more replacement markers before continuation, save or speech; `natallyChat.ts/askNatally` excludes such historical assistant output from future context without deleting history. Shared default temperature becomes 0.8 instead of 1.45; routing stays `openrouter/free`. Preserve actual model on new chat messages. | AR-4 / A6 |

No model-policy change belongs to this increment. Netlify distributes authorized
access; browser sends prompts directly to OpenRouter. Development expiry is an
operator-configurable server setting, initially 30 days. Removing the grant or
expiry stops future acquisition; a bearer already supplied to a browser requires
provider revocation to revoke independently of the client.

## Continuous integrated demonstration, defined before implementation

A1: In the live signed-in account, show current reading access, disconnect through
the normal UI, close settings. Keep account/history/profile; no history erasure.
Begin a neutral question at phone width. Observe automatic access acquisition then
a real direct OpenRouter request and completed reading, without entering a key.

A2: Keep the same conversation, select Mars and submit a follow-up. Observe selected
target, message scrolling, readable status and composer fully reachable. On actual
provider failure, preserve question, reach retry/settings, retry normally; do not
manufacture a failure or claim an unobserved recovery path completed.

A3: Reload, preserve history/profile and automatically reacquire when required.
Inspect settings: development access distinct from purchased access. Repeat neutral
question without a style reminder; record voice outcome separately from access.

A4: In that same sequence sign out through settings, observe entry blocked until
sign-in; sign in again using normal Google flow, reconnect automatically. Another
account, grant expiry, paid purchase/provisioning and physical phone observations
remain unfinished if unavailable, never inferred from this account's success.

A5: Resize same session to desktop then 360/390px portrait and short landscape;
scroll messages/selection/status, keyboard-focus composer and submit control. Record
actual sequence and screenshots. Name exact deployed artifact and account/device
gaps. Private recordings/credentials stay outside source and static deployment.

A6 (added after the observed corruption, before its repair): stop actual corrupt
playback through Replay/Stop; retain existing history. On the delivered correction,
ask the same neutral friendship question without a style reminder and observe a
real provider response or preserved retryable failure. Record actual model when
returned. The marker guard is deliberately narrow, not a claim to assess all
semantic errors or to prove Gen-Z voice. Existing corrupt output remains visible
in history but is not fed back as an assistant exemplar. Actual new corruption is
required to observe the rejection branch; do not manufacture provider output.
