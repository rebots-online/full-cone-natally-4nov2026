import type { CustomerInfo } from '@revenuecat/purchases-js';

/** Provider records, not a local payment ledger or a receipt substitute. */
export type PurchaseHistoryRecord = {
  transactionId: string | null;
  productIdentifier: string;
  purchaseDate: number | null;
  kind: 'transaction' | 'latest_product';
  store: string | null;
  price: {amountMicros:number;currency:string;formatted:string} | null;
};

export function projectPurchaseHistory(info: Pick<CustomerInfo, 'nonSubscriptionTransactions' | 'allPurchaseDatesByProduct'>): PurchaseHistoryRecord[] {
  const date = (value: Date | null): number | null => value instanceof Date && Number.isFinite(value.getTime()) ? value.getTime() : null;
  const transactions: PurchaseHistoryRecord[] = (info.nonSubscriptionTransactions ?? []).map(transaction => ({
    transactionId: transaction.transactionIdentifier,
    productIdentifier: transaction.productIdentifier,
    purchaseDate: date(transaction.purchaseDate), kind: 'transaction', store:transaction.store, price:null,
  }));
  const represented = new Set(transactions.map(transaction => transaction.productIdentifier));
  // This SDK exposes only the latest date per other product, not every renewal.
  const latest: PurchaseHistoryRecord[] = Object.entries(info.allPurchaseDatesByProduct ?? {})
    .filter(([product, purchased]) => purchased && !represented.has(product))
    .map(([productIdentifier, purchased]) => ({transactionId:null, productIdentifier, purchaseDate:date(purchased), kind:'latest_product', store:null, price:null}));
  return [...transactions, ...latest].sort((a,b) => (b.purchaseDate ?? -Infinity) - (a.purchaseDate ?? -Infinity));
}

export function validatePurchaseHistory(value: unknown): PurchaseHistoryRecord[] | undefined {
  // Older native binaries do not return history; that is unavailable, not empty.
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) throw new Error('Purchase history is malformed.');
  return value.map(record => {
    if (!record || typeof record !== 'object' || typeof record.productIdentifier !== 'string' || !record.productIdentifier.trim() ||
        !['transaction','latest_product'].includes(record.kind) ||
        !(record.transactionId === null || typeof record.transactionId === 'string' && record.transactionId.trim()) ||
        !(record.store === null || typeof record.store === 'string') ||
        !(record.purchaseDate === null || typeof record.purchaseDate === 'number' && Number.isFinite(record.purchaseDate) && Number.isFinite(new Date(record.purchaseDate).getTime())) ||
        (record.kind === 'transaction' && !record.transactionId)) throw new Error('A purchase history record is malformed.');
    const price = record.price == null ? null : record.price;
    if (price !== null && (typeof price !== 'object' || !Number.isSafeInteger(price.amountMicros) ||
        typeof price.currency !== 'string' || !price.currency.trim() || typeof price.formatted !== 'string' || !price.formatted.trim())) throw new Error('A purchase history price is malformed.');
    return {transactionId:record.transactionId,productIdentifier:record.productIdentifier,purchaseDate:record.purchaseDate,kind:record.kind,store:record.store,price:price === null ? null : {amountMicros:price.amountMicros,currency:price.currency,formatted:price.formatted}};
  }).sort((a,b) => (b.purchaseDate ?? -Infinity) - (a.purchaseDate ?? -Infinity));
}
