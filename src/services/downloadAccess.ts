import { auth } from './firebase';
import type { PurchaseIntent } from './purchaseIntent';
import { getCheckoutCustomer, getCheckoutOffer } from './revenueCatCheckout';

export type DownloadRequest = { format: 'wav'|'pdf'|'markdown'|'png'|'jpg'|'transcript'; resourceId: string; purchaseIntent?: PurchaseIntent };
export type DownloadAccess = { state:'unavailable'; message:string } | { state:'owned'; expiresAt:string } | {
  state:'offer'; title:string; priceLabel:string; terms:string; expiresAt:string;
};

const DOWNLOAD_FORMATS = ['wav','pdf','markdown','png','jpg','transcript'] as const;

// UX-PLAY-1: the download entitlement id is an explicit env binding, required
// only when this path runs; no fallback value is invented here.
function downloadEntitlementId(): string {
  const value = (import.meta.env as unknown as Record<string, string | undefined>).VITE_REVENUECAT_DOWNLOAD_ENTITLEMENT_ID;
  if (typeof value !== 'string' || !value) {
    throw new Error('Required billing binding VITE_REVENUECAT_DOWNLOAD_ENTITLEMENT_ID is not configured.');
  }
  return value;
}

/** Reads RevenueCat's authoritative current-owner entitlement and quote. No simulated purchase. */
export async function checkDownloadAccess(request:DownloadRequest):Promise<DownloadAccess> {
  await auth.authStateReady();
  const owner=auth.currentUser;
  if (!owner) return {state:'unavailable',message:'Sign in to check an existing purchase. Your reading stays here.'};
  if (typeof request.resourceId !== 'string' || !request.resourceId.trim() || !DOWNLOAD_FORMATS.includes(request.format as typeof DOWNLOAD_FORMATS[number])) {
    return {state:'unavailable',message:'This download is not available.'};
  }
  try {
    const entitlementId=downloadEntitlementId();
    const customer=await getCheckoutCustomer();
    if (auth.currentUser!==owner || customer.ownerUid!==owner.uid) return {state:'unavailable',message:'The signed-in account changed. Please try again.'};
    const now=Date.now();
    if (customer.activeEntitlementIds.includes(entitlementId)) {
      const configuredExpiry=customer.entitlementExpirations[entitlementId];
      const expiry=typeof configuredExpiry==='number' ? Math.min(now+60000, configuredExpiry) : now+60000;
      if (expiry<=now) throw new Error('We couldn’t check your purchase. Please try again; no payment has been requested.');
      return {state:'owned',expiresAt:new Date(expiry).toISOString()};
    }
    const quote=await getCheckoutOffer('reading');
    if (auth.currentUser!==owner || quote.ownerUid!==owner.uid || !(quote.expiresAt>Date.now())) {
      throw new Error('The signed-in account changed. Please try again.');
    }
    const terms=quote.productType==='subscription'
      ? `Subscription${quote.billingPeriod ? ` (billing period ${quote.billingPeriod})` : ''}. Includes the reading souvenir downloads.`
      : 'One-time purchase. Includes the reading souvenir downloads.';
    return {state:'offer',title:'Choose your reading souvenir',priceLabel:quote.formattedPrice,terms,expiresAt:new Date(quote.expiresAt).toISOString()};
  } catch(error) { return {state:'unavailable',message:error instanceof Error ? error.message : 'We couldn’t check your purchase. Please try again.'}; }
}
