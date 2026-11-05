# Continuous delivery: erase, onboarding, full reading and OpenRouter

Defined before implementation, scoped to RP01–RP05 and DL01. Existing complete
product/device/billing obligations remain open. Record one coherent real account
journey, with actual sound, motion and responses; save named stills from it.

| Scene | Entry, actions and continuity | Required observable result | Mapping |
| --- | --- | --- | --- |
| JR0 | Open Account settings and connect the supplied personal inference key. Then make a real reading request while recording the browser request path. | Key validates and is saved for this account; browser calls OpenRouter directly, returns actual model and text, never sends inference to the Netlify relay. Refresh preserves access. | DI01–DI03, DI05 / DI-1–DI-2 |
| JR1 | Open the deployed existing room and show release identity. With the operator's confirmation for their history, use Profile/About → whole-history erase. | Cancel preserves history. Confirmed erase stops speech and opens the full onboarding sequence. No greeting-only room or automatic reuse of cloud birth intake. | RP01–RP02 / RP-1 |
| JR2 | Refresh during unfinished onboarding. Enter intended name, date, place, known/unknown time, current location and plain-English reading depth. Complete intake and choose Explore free first in the offer. | Restart survives refresh. All six intake steps work; exactly one full first reading begins without another request. Offer dismissal does not cancel it. | RP01–RP02, RP05 / RP-1 |
| JR3 | Hear the complete reading, switching main/inset while natal then current relationships are discussed. | Substantial natal-and-current reading; unmistakable own Gen-Z voice throughout, natural rambling and fictional personal aside; factual limitations without chatbot caveat prefaces. Natal/current labels, both aspect endpoints, lines and house bearings follow narration in either layout. Actual response identifies OpenRouter's returned model. | RP03–RP05 / RP-2, RP-3 |
| JR4 | Ask “How does Saturn relate to my Moon?” without a style instruction. Switch to advanced depth and ask a follow-up, then generate Insta-now and request a different observation date. | Same branded voice at both depths; no fabricated aspect, house axis or user biography. Substantial instant reading; real tool request, calculated result and completed continuation. Date-specific chart focus stays matched to the observation. | RP03–RP05 / RP-2, RP-3 |
| JR5 | Refresh, reopen/replay the new saved reading, then change to another authorized account and return. | No repeated intake/duplicate first reading; no cross-account restart marker/history or late response. Replay retains dated focus and actual audio. | RP01–RP04 / RP-1–RP-3 |
| JR6 | During the same journey, observe real provider failure if encountered, recover the configured key/availability, and use its retry action. Continue through the existing export/offer flow. | Request text/history retained; no fake success, paid/GLM fallback or duplicate answer. Provider credential failure does not ask the user to sign in again. Download offer reflects actual current access. | RP02–RP04, DL01 / RP-2, RP-3 |

Append actual timecodes, screenshots, response/model evidence and remaining gaps
after the run. Never substitute a fabricated provider response or destructive
storage mutation for the product flow. If the operator has already erased their
history, start from that real state and explicitly mark JR1 still unobserved for
this new release. Completion requires every mapped outcome, not just publication.

Direct-inference correction: JR5 also observes key isolation on account switch.
JR6 explicitly disconnects the user key in Account settings, sends a question,
observes retained retryable text, reconnects and retries. No Firebase re-login
should be requested for missing provider access. Deployment evidence includes
the removed Netlify chat function (DI04); the Swiss service remains separately
tracked. All JR scenes also map to DI-2's full delivery obligation.
