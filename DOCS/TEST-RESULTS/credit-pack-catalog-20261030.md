# Credit pack catalog read-only receipt — 30 October 2026

This receipt records the existing Natally checkout configuration, the reported
visitor failure, source inspection, and the actual RevenueCat dashboard catalog.
It does not record a catalog repair, a completed purchase, or paid fulfillment.

- Dashboard observation date: **2026-10-30**, during the read-only session directly
  preceding this receipt. Individual browser DOM snapshots did not supply an
  absolute timestamp, so no per-page timestamp is invented.
- Receipt clock read: **2026-10-30 08:00:15 UTC** (04:00:15 America/Toronto).
- Approved repair boundary reported by the supervising parent: architecture
  **b8b7bbb4**, checklist/cold recipe **3eeef44d**, `PACK-REPAIR`.
- Catalog/policy work remains **IN_PROGRESS**. Implementation and deployed paid
  acceptance remain **NOT_STARTED** under that recipe.

## Visitor failure and exact configuration evidence

The supervising parent observed a genuine signed-in visitor on web **1.27**:
prominent account balance → Top Up → offers dialog screen 2 showed **“No packs
available”**, a disabled **“Checking price”** CTA, and **“Some prices could not be
loaded. Please try again later.”** This is the parent's actual runtime observation;
the read-only catalog inspection did not repeat a purchase or manufacture a user.

The existing `scripts/environment.mjs` parser/reference resolver was used to read
only the declared catalog bindings from the effective annotated `.env` and local
override union. No credential values were printed. These nonsecret values were
confirmed:

| Effective binding | Read value |
| --- | --- |
| `VITE_REVENUECAT_OFFERING_ID` | `Natally` |
| `VITE_REVENUECAT_READING_PACKAGE_ID` | `natally_reading_test` |
| `VITE_REVENUECAT_READING_PRODUCT_ID` | `natally_reading_test_v3` |
| `VITE_REVENUECAT_CONVERSATION_PACKAGE_ID` | `natally_roche_test` |
| `VITE_REVENUECAT_CONVERSATION_PRODUCT_ID` | `natally_roche_test_v3` |
| `VITE_REVENUECAT_CONVERSATION_PACKS_JSON` | Empty string; no explicit web pack entries |

The source path explains the observed failure without assuming a provider price
outage:

1. `src/services/checkoutCatalog.ts:29` trims environment values; an empty value
   becomes null. `conversationPackBindings` at line 54 returns an empty array
   when `VITE_REVENUECAT_CONVERSATION_PACKS_JSON` is absent/empty. The legacy
   conversation package/product bindings are deliberately not an active pack
   fallback. `checkoutEntries` at line 119 therefore produces no conversation
   entries for this effective configuration.
2. `src/services/revenueCatCheckout.ts:327` calls `checkoutEntries`; line 331 throws
   `No conversation checkout options are configured for this platform right now.`
   before any per-pack provider price lookup. This configuration error is distinct
   from the later generic all-quotes-failed error at line 336.
3. `src/components/PurchaseAccess.tsx:103` loads reading and conversation quotes
   with `Promise.allSettled`. When the reading quote succeeds and conversation
   loading fails, the pack options stay empty, conversation price/terms stay null,
   and line 149 emits the generic partial-price message. The specific conversation
   configuration failure is not preserved in that branch's visible message.
4. The existing offer bridge passes the prices, terms, and options to
   `LIBS/UI/FIGMA/three-screen-offers-20261027/adapted/paywall-three-screen.html`.
   Line 255 renders `Checking price` without a price; lines 276–280 disable an
   empty selector and render `No packs available`. This is consistent with the
   parent's observed dialog. These source reads are an explanation, not a new
   runtime trace of individual promises or network requests.

The parser currently accepts tiers `5`, `10`, and `25`; the parent also identified
the existing `.env.example` tier-1 documentation mismatch and hardcoded USD 0.99
marketing spans/note. Their correction belongs to the published `PACK-REPAIR`
recipe, not this read-only receipt.

## Actual current RevenueCat catalog

The authenticated existing RevenueCat dashboard was read without changing it.
Project: **Robin's AI World**, project path `aba0bd94`.
Natally Web Billing app: **`app941a60bf95`**.

| Observed object | Exact identifiers | Actual displayed price/cadence | Actual association/readback |
| --- | --- | --- | --- |
| Natally offering | `Natally`; REST ID `ofrng352609e01b` | Three packages | [Offering detail](https://app.revenuecat.com/projects/aba0bd94/product-catalog/offerings/ofrng352609e01b) |
| Exploration credits package/product | Package `natally_roche_test`; product `natally_roche_test_v3`; REST ID `prod2f046e3b64` | **USD 0.99**, **Consumable**; recent transaction type **One Time**; trial/introductory/grace periods **None** | App **Natally (Web Billing)**; no associated entitlement; [product detail](https://app.revenuecat.com/projects/aba0bd94/product-catalog/products/prod2f046e3b64) |
| Souvenir reading package/product | Package `natally_reading_test`; product `natally_reading_test_v3`; REST ID `proda88125bed7` | **USD 0.99**, **Consumable**; recent transaction type **One Time**; trial/introductory/grace periods **None** | Entitlements `natally_reading` and `natally_downloads`; [product detail](https://app.revenuecat.com/projects/aba0bd94/product-catalog/products/proda88125bed7) |
| Reading bundle package | `natally_reading_bundle` | No price; **no product attached** | Display name “Reading PDF, one year saved atelier, ten turns”; package name is not proof of a current grant; [offering detail](https://app.revenuecat.com/projects/aba0bd94/product-catalog/offerings/ofrng352609e01b) |
| Required production credit default | No matching USD 5 Natally web product/package observed | Operator-approved default **USD 5**; approved monthly-first selection and one-time alternative still require actual products | The Natally app's product list showed only the two legacy products above, including with the **All** state filter and Natally search; [product list](https://app.revenuecat.com/projects/aba0bd94/product-catalog/products?state=all) |
| Required production souvenir default | No matching USD 29.99 Natally web product observed | Operator-approved default **USD 29.99** | Current configured souvenir is the legacy USD 0.99 product above |

No monthly Natally product was present in the inspected Natally catalog. The
absence finding is bounded to the existing Natally app/offerings inspected; it is
not a claim that unrelated apps or undocumented canonical records do not exist.

## Actual currency evidence and unresolved numeric policy

The literal currency **ROCHE** is distinct from the historical **AICREDIT** and
**NATALTURN** codes, even where display names or descriptions overlap.

| Currency evidence | Actual dashboard readback | Implication/limit |
| --- | --- | --- |
| Literal `ROCHE` detail | Name **Roche Credit**; description **Roche Media Services Credit**. Associated products were only `kintsugi_ai_pak_s`, `kintsugi_ai_pak_m`, `kintsugi_ai_pak_l`, `prefetch_pak_m`, `prefetch_pak_l`, and `prefetch_pak_s`. The displayed association group showed **Purchase amount 0**, **Trial amount 100**, **Expiration Never**. [Literal ROCHE detail](https://app.revenuecat.com/projects/aba0bd94/product-catalog/virtual-currencies/ROCHE) | Neither Natally product is configured in this literal-ROCHE product association. These other apps' displayed amounts do not define a Natally USD-to-ROCHE conversion or the required USD 5 grant. |
| `NATALTURN` currency list row | Name **Natally exploration turns**; **2 products**. Description says **“Ten per tester purchase; distinct from shared ROCHE.”** [Currency list](https://app.revenuecat.com/projects/aba0bd94/product-catalog/virtual-currencies) | Historical tester turns cannot be treated as literal ROCHE or reused to infer the production grant. This inspection did not expand the NATALTURN product-detail table or audit actual transaction grants. |

Fresh canonical read through the existing KStore helper:

- Entry: `PROJECTS/Natally/ARCHITECTURE/session-keys.md`.
- Exact readback: **true**; revision/head: **3 / 3**.
- SHA-256: **`87d3415e17ee10f6555a665db728c39ffc7ed83445f715fee4597354114d424d`**.
- The contract makes RevenueCat authoritative for shared literal ROCHE and requires
  explicit existing allocation/conversion policy. It does **not** supply a numeric
  grant quantity or ROCHE-to-USD rate.

`DOCS/SESSION-ADAPTER-INTEGRATION.md:130–132` separately records the pending
numerical conversion, rounding, and absolute-cap semantics. It explicitly says
historical 40% allocation and another repository's USD-per-ROCHE constant do not
resolve the contract. Purchase grants, conversion, and actual usage/debit
accounting remain separate. No numeric value is inferred here from 40%, the pack
tier, product names, or ten historical turns.

The parent has asked the operator for the actual grant quantity/conversion before
provider mutation. That answer and its canonical authority are still required to
configure the production credit products. This bounded lookup does not establish
the absence of a policy elsewhere in Admin-Manual.

## Authorized next boundary and scope of this receipt

Follow the published `PACK-REPAIR` architecture **b8b7bbb4** and recipe
**3eeef44d**: establish actual approved currency grant/conversion and cadence;
create/attach the approved real products in the existing Natally offering while
preserving historical purchases; bind their actual platform IDs explicitly;
align displayed prices, quantity, cadence, and checkout product. Default credits
are USD 5 and souvenir USD 29.99; preserve monthly-first and actual one-time
alternatives. Do not enable a retired USD 0.99 tester product as a substitute.

This read-only work created no user, purchase, product, package, currency, grant,
entitlement, credential, or infrastructure. No provider/configuration mutation,
checkout submission, source repair, build, deployment, recording, or Git action
was performed. Only this factual receipt was written; the parent owns review and
publication. Paid fulfillment, a usable current session after purchase, native
acceptance, and recording are not completed by this evidence.
