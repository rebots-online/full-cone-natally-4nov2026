/** Selection only; prices, grants and checkout eligibility remain server-owned. */
export type PurchaseKind = 'reading' | 'conversation';
export type PurchaseIntent = {
  kind: PurchaseKind;
  productId: string;
  sourceSection: string;
};
const products: Record<PurchaseKind, string> = {
  reading: 'proda88125bed7',
  conversation: 'prod2f046e3b64',
};
export function purchaseIntent(kind: PurchaseKind, sourceSection: string): PurchaseIntent {
  return { kind, productId: products[kind], sourceSection };
}
