import { auth } from './firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { reconcileBillingAccess } from './billingAccess';
export type Rail = 'revenuecat' | 'alby' | 'blink' | 'x402';
export type Product = {id:string;title:string;kind:string;usd:number;sats:number;x402Label?:string;roche:number;turns:number;rails:Record<Rail,boolean>};
export type Order = {id:string;rail:Rail;product:string;status:string;canPay:boolean;expiresAt:string;invoice?:string;packageId:string;offering:string;publicKey:string;paymentRequired?:import('@x402/core/types').PaymentRequired};
export async function billingRequest(owner:User, path:string, body?:unknown) {
  if (auth.currentUser !== owner) throw new Error('Your account changed.');
  const base = new URL(String(import.meta.env.VITE_BILLING_API_URL || 'https://natally-hosted-chat.netlify.app'));
  if (base.protocol !== 'https:' || base.username || base.password) throw new Error('Invalid billing service.');
  const token = await owner.getIdToken();
  if (auth.currentUser !== owner) throw new Error('Your account changed.');
  const response = await fetch(new URL('/billing/'+path,base),{method:body === undefined ? 'GET' : 'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},
    ...(body === undefined ? {} : {body:JSON.stringify(body)}),cache:'no-store',credentials:'omit',redirect:'error',signal:AbortSignal.timeout(55000)});
  const result = await response.json();
  if (auth.currentUser !== owner) throw new Error('Your account changed.');
  if (!response.ok) throw new Error(result.error || 'Payment is being reconciled. Do not pay again.');
  if (result.accountUid !== owner.uid || !(Date.parse(result.expiresAt)>Date.now()) || Date.parse(result.expiresAt)>Date.now()+300000) throw new Error('Payment response is stale or belongs to another account.');
  return result;
}
export async function syncBillingCustomer(owner:User) {
  await billingRequest(owner,'customer',{});
  const pending:string[] = JSON.parse(localStorage.getItem('natally-turns:'+owner.uid) || '[]');
  for (const requestId of pending) {
    await billingRequest(owner,'turns/complete',{requestId});
    const ids:string[] = JSON.parse(localStorage.getItem('natally-turns:'+owner.uid) || '[]');
    localStorage.setItem('natally-turns:'+owner.uid,JSON.stringify(ids.filter(id=>id!==requestId)));
  }
  if (auth.currentUser === owner) await owner.getIdToken(true);
}
let started = false;
export function startBillingIdentitySync() {
  if (started) return; started = true;
  let timer:ReturnType<typeof setTimeout>|undefined;
  onAuthStateChanged(auth,owner=>{
    clearTimeout(timer); if (!owner) return;
    let attempt = 0;
    const sync = () => { void syncBillingCustomer(owner).catch(()=>{
      if (auth.currentUser === owner && ++attempt < 4) timer = setTimeout(sync,[5000,15000,60000][attempt-1]);
    }); };
    sync();
  });
}
let checkout = false;
let sdk:import('@revenuecat/purchases-js').Purchases|undefined;
let sdkUid = '';
export async function payOrder(owner:User, order:Order, target?:HTMLElement|null) {
  if (checkout) throw new Error('A payment is already open. Finish or close it first.');
  if (auth.currentUser !== owner || !order.canPay || Date.parse(order.expiresAt)<=Date.now()) throw new Error('This checkout is no longer current. Check existing access.');
  checkout = true;
  const unsubscribe = onAuthStateChanged(auth,user=>{if(user !== owner) {sdk?.close(); sdk=undefined;sdkUid='';}});
  try {
    if (order.rail === 'revenuecat') {
      const {Purchases,ErrorCode} = await import('@revenuecat/purchases-js');
      if (!sdk) {sdk = Purchases.configure({apiKey:order.publicKey,appUserId:owner.uid});sdkUid=owner.uid;}
      else if (sdkUid !== owner.uid) {await sdk.changeUser(owner.uid);sdkUid=owner.uid;}
      if (auth.currentUser !== owner) throw new Error('Your account changed.');
      const offerings = await sdk.getOfferings();
      const pkg = offerings.all[order.offering]?.availablePackages.find(item=>item.identifier === order.packageId);
      if (!pkg) throw new Error('The selected payment package is not published yet.');
      if (auth.currentUser !== owner) throw new Error('Your account changed.');
      await billingRequest(owner,'orders/'+order.id+'/start',{});
      order.canPay=false;
      const receipt = await sdk.purchase({rcPackage:pkg,customerEmail:owner.email || undefined,htmlTarget:target || undefined,
        metadata:{natally_order_id:order.id},selectedLocale:'en',skipSuccessPage:true}).catch(async error=>{
          if(error?.errorCode===ErrorCode.UserCancelledError && auth.currentUser===owner) {
            await billingRequest(owner,'orders/'+order.id+'/cancel',{});
            throw new Error('Checkout cancelled. Check payment options to refresh the list.');
          }
          throw error;
        });
      await billingRequest(owner,'orders/'+order.id+'/receipt',{transaction:receipt.storeTransaction.storeTransactionId});
    } else if (order.rail === 'x402') {
      const provider = (window as unknown as {ethereum?:import('viem').EIP1193Provider}).ethereum;
      if (!provider || !order.paymentRequired) throw new Error('Open this page with an Ethereum-compatible wallet to pay with crypto.');
      const [{createWalletClient,custom},{x402Client},{ExactEvmScheme}] = await Promise.all([import('viem'),import('@x402/core/client'),import('@x402/evm/exact/client')]);
      const wallet = createWalletClient({transport:custom(provider)});
      const [address] = await wallet.requestAddresses();
      const requirement = order.paymentRequired.accepts[0];
      const chainId = Number(requirement.network.split(':')[1]);
      if (await wallet.getChainId() !== chainId) await wallet.switchChain({id:chainId});
      if (auth.currentUser !== owner) throw new Error('Your account changed.');
      const signer = {address,signTypedData:(args:any)=>wallet.signTypedData({...args,account:address})};
      const client = new x402Client().register(requirement.network,new ExactEvmScheme(signer));
      const payment = await client.createPaymentPayload(order.paymentRequired);
      order.canPay=false;
      // A signed authorization is sent only to this account's stored order.
      await billingRequest(owner,'orders/'+order.id+'/settle',{payment});
    } else return;
    if (auth.currentUser !== owner) throw new Error('Your account changed.');
    await reconcileBillingAccess(owner.uid,true,()=>auth.currentUser === owner);
    await owner.getIdToken(true);
  } finally {unsubscribe();checkout=false;}
}
