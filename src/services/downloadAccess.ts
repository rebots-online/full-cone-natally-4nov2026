import { auth } from './firebase';
import type { PurchaseIntent } from './purchaseIntent';
import { restoreCheckoutCustomer, getCheckoutOffer } from './revenueCatCheckout';

export type DownloadRequest = { format: 'wav'|'pdf'|'markdown'|'png'|'jpg'|'transcript'; resourceId: string; purchaseIntent?: PurchaseIntent };
export type DownloadAccess = { state:'unavailable'; message:string } | { state:'owned'; expiresAt:string } | {
  state:'offer'; title:string; priceLabel:string; terms:string; expiresAt:string;
};

const DOWNLOAD_FORMATS = ['wav','pdf','markdown','png','jpg','transcript'] as const;

/** Reads RevenueCat's authoritative current-owner entitlement and quote. No simulated purchase. */
export async function checkDownloadAccess(request:DownloadRequest):Promise<DownloadAccess> {
  await auth.authStateReady();
  const owner=auth.currentUser;
  if (!owner) return {state:'unavailable',message:'Sign in to check an existing purchase. Your reading stays here.'};
  if (typeof request.resourceId !== 'string' || !request.resourceId.trim() || !DOWNLOAD_FORMATS.includes(request.format as typeof DOWNLOAD_FORMATS[number])) {
    return {state:'unavailable',message:'This download is not available.'};
  }
  try {
    const info=await restoreCheckoutCustomer();
    if (auth.currentUser!==owner) return {state:'unavailable',message:'The signed-in account changed. Please try again.'};
    const entitlement=info.entitlements.active['natally_downloads'];
    const now=Date.now();
    if (entitlement?.isActive===true) {
      const expiry=entitlement.expirationDate instanceof Date ? Math.min(now+60000, entitlement.expirationDate.getTime()) : now+60000;
      if (expiry<=now) throw new Error('We couldn’t check your purchase. Please try again; no payment has been requested.');
      return {state:'owned',expiresAt:new Date(expiry).toISOString()};
    }
    const quote=await getCheckoutOffer('reading');
    if (auth.currentUser!==owner || quote.ownerUid!==owner.uid || !(quote.expiresAt>Date.now())) {
      throw new Error('The signed-in account changed. Please try again.');
    }
    return {state:'offer',title:'Choose your reading souvenir',priceLabel:quote.formattedPrice,terms:'One-time purchase. Includes the reading souvenir downloads.',expiresAt:new Date(quote.expiresAt).toISOString()};
  } catch(error) { return {state:'unavailable',message:error instanceof Error ? error.message : 'We couldn’t check your purchase. Please try again.'}; }
}
