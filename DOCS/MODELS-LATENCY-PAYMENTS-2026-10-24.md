# Natally: models, spoken latency and paid access

Snapshot: 24 October 2026. Prices are USD per million tokens, before taxes,
payment fees and other services. This is a dated comparison, not a price promise.
“All free” means all currently listed OpenRouter free text-generation model IDs,
not every promotional credit or self-hostable model on the internet. Model
capabilities below are catalog declarations, not individual Natally runtime
acceptance. Strengths and drawbacks are suitability assessments, not measured
head-to-head results.

## Every currently listed free model

Source: [OpenRouter live model catalog](https://openrouter.ai/api/v1/models).
The accompanying JSON snapshot preserves exact IDs, parameters, context limits,
reasoning metadata and prices. There are 17 `:free` models plus the free router.
Every row has zero listed input/output token price. Zero token prices do not
promise capacity, uptime, unlimited use or a viable free consumer product.

All rows can be requested through OpenRouter's streaming API. Actual provider
behavior must be observed; streaming is not evidence that optional reasoning is
disabled or that TTS begins promptly. None of these free entries advertises a
separate cache-read price in this snapshot; cache availability is endpoint
dependent, not confirmed absent. T = text, I = image, V = video, A = audio input.
“Structured” means the catalog explicitly lists `structured_outputs`; absence
does not mean JSON text or `response_format` is impossible.

| Model / exact ID | Context | Inputs | Reasoning | Tools / structured | Useful attributes | Drawbacks for Natally |
|---|---:|---|---|---|---|---|
| Recursive Flint `recursive/flint-v1.0:free` | 262,144 | T | Required | Yes / not listed | Coding-agent specialization | Coding emphasis; reasoning cannot simply be disabled |
| Xing 4.0 `xingchen-agi/xing4.0-29b-a4b:free` | 262,144 | T | Optional, on by default | Yes / yes | General MoE, explicit structured output | Voice and explanation quality unmeasured |
| Nemotron 3.5 Super VL `nvidia/nemotron-3.5-super-vl:free` | 1,000,000 | T/I/V | Optional | Yes / yes | Document, image and video understanding | Multimodal capacity may be unnecessary for ordinary dialogue |
| Dots 3 Note Preview `dots-studio/dots-3-note-preview:free` | 512,000 | T/I | Optional | Yes / yes | Broad multimodal capacity | Preview availability and continuity risk |
| Liquid LFM 2.5 2.6B `liquid/lfm-2.5-2.6b:free` | 65,536 | T | Required | Yes / yes | Compact extraction/RAG workloads | Smaller context; nuanced long readings need careful evaluation |
| Nemotron 3.5 Lightning `nvidia/nemotron-3.5-lightning:free` | 1,000,000 | T | Optional | Yes / not listed | Efficient active parameter count, long context | Name does not guarantee first-token latency on a shared endpoint |
| Inkling Small `thinkingmachines/inkling-small:free` | 1,048,576 | T/I/A | Optional; supports none | Yes / not listed | Multimodal general conversation candidate | Defaults to high reasoning unless configured |
| Laguna S 2.1 `poolside/laguna-s-2.1:free` | 262,144 | T | Optional, on by default | Yes / not listed | Coding and tool use | Specialization is not conversational persona quality |
| Inkling `thinkingmachines/inkling:free` | 1,048,576 | T/I/A | Optional; supports none | Yes / not listed | Broad reasoning and multimodal capability | Larger model; default high reasoning can delay speech |
| Laguna XS 2.1 `poolside/laguna-xs-2.1:free` | 262,144 | T | Optional, on by default | Yes / not listed | Smaller coding/tool model | Dialogue and rubric compliance unmeasured |
| North Mini Code `cohere/north-mini-code:free` | 256,000 | T | Optional | Yes / not listed | Compact coding agent | Poor default fit for a character-led reading without evidence |
| Nemotron 3.5 Content Safety `nvidia/nemotron-3.5-content-safety:free` | 128,000 | T/I | Optional, on by default | No / not listed | Moderation/classification | Not the model to deliver Natally's conversation |
| Nemotron 3 Ultra `nvidia/nemotron-3-ultra-550b-a55b:free` | 1,000,000 | T | Optional; high/medium/none | Yes / not listed | Large reasoning/tool model | Actual Natally run made factual and biographical errors; speed alone is insufficient |
| Nemotron 3 Nano Omni `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` | 256,000 | T/A/I/V | Optional, on by default | Yes / not listed | Broad perception inputs | Perception-oriented strengths do not establish conversational fit |
| Gemma 4 26B A4B `google/gemma-4-26b-a4b-it:free` | 262,144 | I/T/V | Optional, off by default | Yes / not listed | Efficient instruction model; promising direct-response candidate | Still needs actual voice, factuality and availability observation |
| Gemma 4 31B `google/gemma-4-31b-it:free` | 262,144 | I/T/V | Optional, off by default | Yes / not listed | Dense instruction model; promising dialogue candidate | Shared free capacity and unknown Natally latency |
| Nemotron 3 Super `nvidia/nemotron-3-super-120b-a12b:free` | 262,144 | T | Optional; medium/low/none | Yes / yes | Tools and structured output | Reasoning defaults on; conversational style unmeasured |
| Free router `openrouter/free` | 200,000 advertised | T/I advertised | Depends on selected endpoint | Capability-dependent | Convenient development fallback | Model/persona/latency can vary between requests; not a stable product identity |

MiniMax M3.1 Flash (free) appears in the weekly popularity ranking but is absent
from the current catalog snapshot. It is not counted as currently available.
Lyria music entries have per-song charges despite zero text-token prices and
are not free conversational models. OpenRouter free limits and availability
must be read at time of use: [limits](https://openrouter.ai/docs/api/reference/limits).

## Top five by popularity

Definition: OpenRouter's **This Week** token-volume ranking observed on this date,
not an objective best-model ranking. Ranking source: [OpenRouter rankings](https://openrouter.ai/rankings),
attributed to OpenRouter under its stated CC BY 4.0 license. A seven-day usage
window may include endpoints no longer available today. Prices are catalog
listings; provider selection, cache conditions and scheduled overrides matter.

| Rank / model | Weekly tokens | Input / output / cache-read $ per M | Reasoning | Streaming / tools / structured | Strengths | Drawbacks |
|---|---:|---|---|---|---|---|
| 1. DeepSeek V4.1 Flash 1017 | 26.7T | 0.15 / 0.60 / 0.003 base | Optional; none supported | Yes / yes / yes | Popular economical snapshot, vision, 1M context, cheap cached input | Weekday peak schedules double listed rates; popularity is not persona compliance |
| 2. DeepSeek V4.1 Flash | 20.5T | 0.02 / 1.00 / 0.015 | Optional; none supported | Yes / yes / yes | Very low listed input price; vision and 1M context | Different endpoint pricing from 1017; output-heavy turns change economics |
| 3. MiniMax M3.1 Flash (free) | 13.7T | Free variant unavailable in catalog; paid counterpart 0.15 / 0.60 / 0.015 | Paid counterpart requires reasoning | Paid counterpart: yes / yes / yes | Multimodal agent capability, 1M context | Do not assume expired free capacity; max reasoning default can delay first speech |
| 4. GLM 5.3 Flash | 11.9T | 0.15 / 0.50 / 0.03 | Required | Yes / yes / yes | Multimodal long-context/tool work; low output price | Max reasoning default; cannot satisfy an unconditional reasoning-off policy |
| 5. Tencent Hy4 Preview | 8.77T | 0.834 / 2.501 / 0.042 base | Optional; none supported | Yes / yes / yes | Complex tools/productivity, 1M context | Preview, text-only catalog inputs, higher price; scheduled discount varies |

For comparison, the ranking page's leading benchmark entries were Claude Opus
5.5 (57.6), Claude Sonnet 5.5 (56.0), Kimi K3.1 Pro (55.1), Claude Fable 5.1
(53.4), and Qwen 3.8 Max (53.4). These scores are the page's reported benchmark
ordering, not a Natally evaluation. Their catalog input/output/cache-read prices
were respectively $4/$20/$0.20, $2/$10/$0.10, $2/$10/$0.20,
$10/$50/$0.25, and $2/$6/$0.25 (`qwen3.8-max-0902`). Kimi permits reasoning
off; the other four catalog entries mark reasoning mandatory. All advertise
tools and structured output. Their strengths are broader complex-task ability;
their obvious tradeoffs here are cost and potentially longer deliberation.

## Groq and Cerebras

Assumption: “grow” meant **Groq**, not xAI's Grok. Groq and Cerebras are separate
inference companies with different hardware stacks. Both host models made by
other organizations; the same model can therefore be compared across them.

| Provider / model | Input / output $ per M | Advertised output speed | Reasoning / stream | Cache and constraints |
|---|---|---:|---|---|
| Groq GPT-OSS 120B | 0.15 / 0.60 | ~500 tokens/s | Low/medium/high, no off; streaming | Automatic eligible-prefix cache, 50% input discount on hits; production catalog model |
| Groq GPT-OSS 20B | 0.075 / 0.30 | ~1,000 tokens/s | Low/medium/high, no off; streaming | Same cache policy; smaller model needs quality observation |
| Cerebras GPT-OSS 120B | 0.35 / 0.75 | ~3,000 tokens/s | Model-dependent reasoning; streaming | Automatic prefix cache; developer price is for evaluation, production agreement needed |
| Cerebras Qwen 3.8 27B | 0.99 / 1.49 | ~1,850 tokens/s | Verify model-specific effort settings; streaming | Same developer-tier production limitation |

Sources: [Groq production models](https://console.groq.com/docs/models),
[reasoning controls](https://console.groq.com/docs/reasoning),
[Groq cache](https://console.groq.com/docs/prompt-caching),
[Cerebras pricing](https://www.cerebras.ai/pricing),
[Cerebras cache](https://inference-docs.cerebras.ai/capabilities/prompt-caching).
Groq documents a two-hour inactivity cache expiry for supported GPT-OSS models.
Cerebras documents exact-prefix 128-token blocks with a five-minute guaranteed
TTL, possibly up to an hour; no cache-price discount is assumed here.

Example: 10,000 uncached input tokens + 1,000 billed output tokens on GPT-OSS
120B costs about **$0.00210 on Groq** or **$0.00425 on Cerebras** at those
listed rates. At 10,000 such turns: $21 versus $42.50. Reasoning tokens, tools,
storage, voice, payment charges and taxes may add costs. Production Cerebras
pricing requires its production offer, not extrapolation from developer rates.

Both are worthwhile candidates for reduced latency, but no direct-provider
Natally comparison has been run. Output throughput alone does not establish
first-sentence latency. Measure request-to-first-visible-content,
first-complete-phrase, first-audio-start, gaps between phrases, interruptions,
provider failures and cost on the same real questions and chart data. Preserve
the chosen persona and calculation tools. Do not silently swap a free request
to a paid route. A paid fixed model/provider is a more predictable product
default than a random free router, once its quality and budget are accepted.

## Streaming policy and actual observation

OpenRouter supports [SSE streaming](https://openrouter.ai/docs/api/reference/streaming)
and [reasoning controls](https://openrouter.ai/docs/guides/best-practices/reasoning-tokens).
Natally requests streaming and optional reasoning disabled. An actual routed
endpoint rejected disabled reasoning; a bounded compatibility retry uses low
effort. This cannot promise zero hidden-reasoning latency on mandatory models.
Hiding reasoning text is not the same as disabling its computation.

On the observed live Nemotron Ultra run, text appeared at 3.742 seconds, speech
started at 7.017 seconds while text was still growing, and final text arrived
at 26.446 seconds. These are one desktop browser run, not a provider benchmark,
physical-phone observation or acoustic listening result. Generated text still
contained factual and unsupported biographical claims. The operator subsequently
clarified that immediate streaming takes priority over exhaustive educational
coverage. The rubric is conditional guidance, never a whole-response buffering
or rewrite gate. Accuracy errors remain distinct from missing educational detail.

## Paid access before any AI conversation

Product requirement: pre-chart AI chat also consumes paid access. There is no
public promise of free inference, regardless of the provider's zero token price.
Static lessons, navigation and already available material can remain accessible.
The temporary development-account grant is an explicit exception, not a public
entitlement. Public offer wording must reflect this now.

| Purchase route | Appropriate use | Required implementation |
|---|---|---|
| Prepaid conversation balance | Default low-friction conversation funding | Authenticated ledger, verified payment, quote/reservation before inference, settlement from actual usage or clear fixed-turn pricing |
| Upfront reading/package | Reading plus defined PDF/voice/SPA deliverables | Exact included files, allowed generation/turn budget, archive duration and restoration rights before payment |
| Native Apple/Google in-app purchase | Digital reading bundles and consumable conversation packs inside store apps | Store products, verified receipts, account binding, restore/refund handling and store-specific rules |
| Web checkout | Browser/PWA purchases | Web payment processor; RevenueCat can reconcile entitlements across platforms |
| x402 | Optional wallet/API payment or prepaid top-up | Exact supported network/asset/facilitator; verify and settle the quoted authorization before granting access; idempotency and failure reconciliation |
| $ROCHE | Intended conversation-credit denomination | Decide whether closed-loop app credits or a transferable token; do not assume they are interchangeable or already integrated |

**Yes, PDF/SPA bundles can be sold as digital in-app purchases.** A permanent
reading unlock can be modeled separately from a consumable conversation pack
and a time-limited hosted archive. A one-year archive must not silently become
a lifetime promise, and downloaded files do not disappear at archive expiry.
The existing Surge browser site uses web checkout, not native StoreKit or Play
Billing merely because it runs on a phone. App-store external-payment allowances
vary by storefront/program; x402 is not a blanket exception for native digital
goods. Sources: [Apple review rules](https://developer.apple.com/app-store/review/guidelines/),
[Google Play payments](https://support.google.com/googleplay/android-developer/answer/9858738),
[RevenueCat web](https://www.revenuecat.com/docs/web/overview),
[RevenueCat virtual currency](https://www.revenuecat.com/docs/offerings/virtual-currency).

[x402](https://docs.x402.org/introduction) is a payment protocol, not a model,
credit ledger or universal currency adapter. Use one authorization for a quoted
turn/session or top-up, not a payment approval for every SSE token or spoken
sentence. A supported stablecoin can fund an internal balance; $ROCHE support
depends on the selected asset and facilitator, not the label in the UI.

Recommended initial commerce design: prepaid app credits plus a clearly bounded
reading bundle, with native store purchases where appropriate and web checkout
on the web. Add x402 as another funding path into the same account ledger.
Keep user and order IDs, receipt/provider identifiers, idempotency keys,
reservation/settlement/refund events, limits and expiry server authoritative.
No second charge on a retry. A purchase-success callback only triggers server
reconciliation; it does not prove entitlement. Decide prices and $ROCHE's nature
before configuring products; neither is invented in this document.

**Current implementation boundary:** the billing endpoint supplies an expiring
development grant to the allowed development account. The client accepts managed
provider grants but a complete paid provisioning/ledger/checkout service is not
verified. Personal user-key access also exists. Removing free copy does not
implement server-side metering or purchase enforcement. The download-commerce
API is not configured. No checkout, payment, credit debit, refund, native IAP or
x402 settlement is claimed live by this document.
