import { auth } from './firebase';

export type DownloadRequest = { format: 'wav'|'pdf'|'markdown'|'png'|'jpg'|'transcript'; resourceId: string };
export type DownloadAccess = { state:'unavailable'; message:string } | { state:'owned'; expiresAt:string } | {
  state:'offer'; title:string; priceLabel:string; terms:string; checkoutUrl:string; expiresAt:string;
};

/** Only a configured authenticated commerce API can supply access or a checkout quote.
 * No URL-return flag, local cache, currency balance, or UI choice is a paid grant.
 * The deployed app currently has no such API configured. See DOCS/COMMERCE-DOWNLOAD-API.md.
 */
export async function checkDownloadAccess(request:DownloadRequest):Promise<DownloadAccess> {
  const endpoint = import.meta.env.VITE_DOWNLOAD_ACCESS_API_URL;
  if (!endpoint) return {state:'unavailable',message:'Purchasing isn’t available yet. You can explore your chart, generate readings and replay them here for free. Downloads will be available when purchasing opens.'};
  const owner=auth.currentUser;
  if (!owner) return {state:'unavailable',message:'Sign in to check an existing purchase. Your reading stays here.'};
  try {
    const url=new URL(endpoint);
    if(url.protocol!=='https:') throw new Error('Purchasing is not securely configured.');
    const token=await owner.getIdToken();
    const response=await fetch(url,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(request),cache:'no-store',credentials:'omit',redirect:'error',signal:AbortSignal.timeout(12000)});
    if(!response.ok) throw new Error('We couldn’t check your purchase. Please try again; no payment has been requested.');
    const result=await response.json();
    if(auth.currentUser?.uid!==owner.uid) throw new Error('The signed-in account changed. Please try again.');
    if(result.accountUid!==owner.uid || result.resourceId!==request.resourceId || result.format!==request.format || !(Date.parse(result.expiresAt)>Date.now())) throw new Error('Your purchase could not be verified. Please try again.');
    if(result.state==='owned') return {state:'owned',expiresAt:result.expiresAt};
    if(result.state==='offer' && typeof result.title==='string' && typeof result.priceLabel==='string' && result.priceLabel.trim() && typeof result.terms==='string' && result.terms.trim()) {
      const checkout=new URL(result.checkoutUrl);
      if(checkout.protocol!=='https:' || checkout.username || checkout.password) throw new Error('Checkout is unavailable.');
      return {state:'offer',title:result.title,priceLabel:result.priceLabel,terms:result.terms,checkoutUrl:checkout.href,expiresAt:result.expiresAt};
    }
    throw new Error('Purchasing is unavailable. You can continue exploring for free.');
  } catch(error) { return {state:'unavailable',message:error instanceof Error ? error.message : 'We couldn’t check your purchase. Please try again.'}; }
}
