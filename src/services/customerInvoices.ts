import { auth } from './firebase';

export type CustomerInvoice = {
  id:string; issuedAt:number; paidAt:number|null; currency:string;
  providerGross:number; providerTax:number; hasFile:boolean;
  products:Array<{productIdentifier:string;displayName:string|null;quantity:number}>;
};
export const invoiceServiceConfigured = () => !!String(import.meta.env.VITE_BILLING_INVOICES_ENDPOINT || '').trim();
function endpoint(): string {
  const configured = String(import.meta.env.VITE_BILLING_INVOICES_ENDPOINT || '').trim();
  if (!configured) throw new Error('Invoice service is not configured.');
  const url = new URL(configured);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) throw new Error('Invoice service address is invalid.');
  return url.href.replace(/\/$/,'');
}
async function request(ownerUid:string, current:()=>boolean, suffix='', signal?:AbortSignal) {
  signal?.throwIfAborted();
  const user = auth.currentUser;
  const active = () => current() && auth.currentUser === user && user?.uid === ownerUid;
  if (!user || !active()) throw new Error('The signed-in account changed.');
  const token = await user.getIdToken();
  if (!active()) throw new Error('The signed-in account changed.');
  const response = await fetch(endpoint()+suffix, {headers:{Authorization:`Bearer ${token}`},credentials:'omit',cache:'no-store',redirect:'error',signal:signal ? AbortSignal.any([signal,AbortSignal.timeout(20000)]) : AbortSignal.timeout(20000)});
  if (!active()) throw new Error('The signed-in account changed.');
  if (!response.ok) throw new Error(response.status === 401 ? 'Sign in again to view invoices.' : 'Invoices could not be retrieved. Please retry.');
  const payload = await response.json();
  if (!active() || payload.ownerUid !== ownerUid) throw new Error('Invoice records did not match the current account.');
  return payload;
}
const timestamp = (value:unknown) => typeof value === 'number' && Number.isSafeInteger(value) && Number.isFinite(new Date(value).getTime());
export async function getCustomerInvoices(ownerUid:string,current:()=>boolean,signal?:AbortSignal): Promise<CustomerInvoice[]> {
  const payload = await request(ownerUid,current,'',signal);
  if (!Array.isArray(payload.invoices) || !payload.invoices.every((item:any) =>
    typeof item.id === 'string' && item.id && timestamp(item.issuedAt) && (item.paidAt === null || timestamp(item.paidAt)) &&
    typeof item.currency === 'string' && /^[A-Z]{3}$/.test(item.currency) && Number.isFinite(item.providerGross) && Number.isFinite(item.providerTax) && typeof item.hasFile === 'boolean' &&
    Array.isArray(item.products) && item.products.every((product:any) => typeof product.productIdentifier === 'string' &&
      (product.displayName === null || typeof product.displayName === 'string') && Number.isSafeInteger(product.quantity) && product.quantity >= 0))) throw new Error('Invoice records were invalid.');
  return payload.invoices;
}
export async function getCustomerInvoiceFile(ownerUid:string,id:string,current:()=>boolean,signal?:AbortSignal):Promise<string> {
  const payload = await request(ownerUid,current,`/${encodeURIComponent(id)}/file`,signal);
  const url = new URL(payload.url);
  if (url.protocol !== 'https:' || url.username || url.password || url.hash) throw new Error('Invoice file address was invalid.');
  return url.href;
}
