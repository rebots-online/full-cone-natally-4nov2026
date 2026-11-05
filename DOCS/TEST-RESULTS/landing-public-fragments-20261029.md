# Landing section URL correction review

Date: 29 October 2026. Architecture checkpoint:
`a644065b62d0e0765b02db3ca1915acd8dc63de0`. Checklist and preauthored rubric:
`6cd00adb3482a63726e3c1fa49dec22b40b80cc7`. The reviewed implementation is
`marketing.html` in the same published checkpoint as this review.

## Semantic comparison

| Requirement | Actual source and review result |
| --- | --- |
| URL-01 | All five real section IDs use the contract's customer-readable names. How she reads links directly to `#your-chart`, Prices to `#prices`. Existing `#top` and `how-it-works` remain unchanged. Each target exists once. |
| URL-02 | The fixed alias map matches each old section to its corresponding renamed element. Normalization requires an own mapping entry and an existing element. It constructs `URL` from the current address, changes only `hash`, calls `replaceState` with the existing `history.state`, and scrolls the matching real element. No extra history entry, query deletion or app redirect is introduced. |
| URL-03 | The same normalizer runs on initialization and `hashchange`. Unknown and canonical fragments return without mutation. The diff retains all design, attribution and purchase hooks, content, styling, quote/checkout behavior, legal links and version badge. No dependency, router or account state is added. |

The supervisor inspected the complete 28-insertion / 7-deletion scoped diff.
No correction was required. This establishes source conformity for this bounded
change, not successful authentication, pricing, purchase or chart delivery.

## Observed actual local page behavior

The existing integrated Vite page at `http://127.0.0.1:49418/marketing.html` was
opened through the real Chrome browser. No account, chart, balance, price,
network or history state was injected. These are actual browser observations;
they are not the held canonical-domain continuous demonstration.

| Opened legacy fragment | Observed replacement fragment |
| --- | --- |
| `#usp-hero` | `#meet-natally` |
| `#usp-precision` | `#your-chart` |
| `#usp-attention` | `#reading-aloud` |
| `#usp-conversation` | `#talk-with-natally` |
| `#offer-scope` | `#prices` |

Activating the actual Prices link changed the address to `#prices`; browser Back
returned to `#your-chart`. The accessibility tree contained the renamed real
sections and matching primary-navigation links. Preservation of a nonempty query
and caller-supplied history state is established here by source review, not by
injecting artificial browser state. Full Back/Forward and unknown-fragment scenes
remain part of URL-S3/S4 for the later continuous recording.

Build, deployment and recording were not performed. The public site's older
release can still expose old fragments until the matching source is deployed.
URL-RECORD remains NOT_STARTED under the operator's recording hold.
