import React, {useEffect,useRef,useState} from 'react';
import {auth} from '../services/firebase';
import {billingRequest,payOrder,type Product,type Order,type Rail} from '../services/payments';
import {reconcileBillingAccess} from '../services/billingAccess';
const labels:Record<Rail,string> = {revenuecat:'Card · RevenueCat',alby:'Bitcoin Lightning · Alby',blink:'Bitcoin Lightning · Blink',x402:'Crypto · x402'};
export function PaymentMethods({accountUid,resourceId='natal-reading'}:{accountUid:string;resourceId?:string}) {
  const [products,setProducts]=useState<Product[]>([]),[notice,setNotice]=useState('Loading payment options…');
  const [busy,setBusy]=useState(false),[order,setOrder]=useState<Order|null>(null);
  const target=useRef<HTMLDivElement>(null),inFlight=useRef(false);
  useEffect(()=>{
    let active=true;setProducts([]);setOrder(null);
    const owner=auth.currentUser;
    if (!owner || owner.uid!==accountUid) return;
    void Promise.all([billingRequest(owner,'offer'),billingRequest(owner,'orders')]).then(([offer,pending])=>{
      if(active && auth.currentUser===owner){setProducts(offer.products);setOrder(pending.orders[0] || null);setNotice('Choose a payment method. Prices shown below are real charges.');}
    }).catch(error=>{if(active && auth.currentUser===owner)setNotice(error.message);});
    return()=>{active=false;};
  },[accountUid]);
  async function act(run:(owner:NonNullable<typeof auth.currentUser>)=>Promise<void>) {
    const owner=auth.currentUser;if(!owner || owner.uid!==accountUid || inFlight.current)return;
    inFlight.current=true;setBusy(true);
    try{await run(owner);}catch(error){if(auth.currentUser===owner)setNotice(error instanceof Error?error.message:'Payment could not be confirmed. Do not pay again.');}
    finally{inFlight.current=false;setBusy(false);}
  }
  const check=()=>act(async owner=>{
    const access=await reconcileBillingAccess(owner.uid,true,()=>auth.currentUser===owner);
    if(auth.currentUser!==owner)return;
    await owner.getIdToken(true);setNotice(access.message);
    const pending=await billingRequest(owner,'orders');setOrder(pending.orders[0] || null);
  });
  return <section className="space-y-3" aria-label="Payment methods">
    <p role="status" className="text-xs text-[#c4b9ce]">{notice}</p>
    {products.map(product=><div key={product.id} className="rounded-lg border border-white/15 p-3 space-y-2">
      <h5 className="text-sm text-[#f2ca50]">{product.title}</h5>
      <p className="text-xs text-[#c4b9ce]">{product.turns>0?`${product.turns} completed conversational turns. `:''}{product.roche>0?`${product.roche} $ROCHE credited to your account.`:''}</p>
      {(Object.keys(labels) as Rail[]).map(rail=><button key={rail} type="button" disabled={busy || !!order || !product.rails[rail]} className="block min-h-11 w-full rounded-lg border border-[#d4af37]/40 px-3 py-2 text-xs text-[#f1e8d8] disabled:opacity-40" onClick={()=>void act(async owner=>{
        const result=await billingRequest(owner,'orders',{requestId:crypto.randomUUID(),product:product.id,rail,resourceId});
        setOrder(result.order);
        if(rail==='alby'||rail==='blink')setNotice('Pay this invoice once, then check payment. Your invoice stays attached to your account.');
        else{await payOrder(owner,result.order,target.current);setNotice('Payment submitted. Check access to finish connecting your purchase.');}
      })}>{labels[rail]} · {rail==='revenuecat'?`US$${product.usd.toFixed(2)}`:rail==='x402'?(product.x402Label || 'See wallet quote'):`${product.sats} sat`}{!product.rails[rail]?' · Awaiting configuration':''}</button>)}
    </div>)}
    {order&&<div className="rounded-lg border border-[#d4af37]/40 p-3 text-xs space-y-2">
      <p>Pending payment · {labels[order.rail]}</p>
      {order.invoice&&<><textarea aria-label="Lightning invoice" readOnly value={order.invoice} className="w-full min-h-20 bg-black/30 p-2 break-all"/><a className="block underline text-[#f2ca50]" href={'lightning:'+order.invoice}>Open Lightning wallet</a><button type="button" onClick={()=>void navigator.clipboard.writeText(order.invoice!)}>Copy invoice</button></>}
      {!order.invoice&&order.canPay&&Date.parse(order.expiresAt)>Date.now()&&<button type="button" disabled={busy} onClick={()=>void act(async owner=>{await payOrder(owner,order,target.current);setNotice('Check access to confirm your payment.');})}>Continue this checkout</button>}
      <p>Keep this order until its payment status is confirmed. Do not start another payment for it.</p>
    </div>}
    <div ref={target}/>
    <button type="button" disabled={busy} onClick={()=>void check()} className="min-h-11 rounded-lg border border-[#d4af37]/50 px-3 py-2 text-xs text-[#f2ca50] disabled:opacity-40">{busy?'Working…':'Check payment and access'}</button>
  </section>;
}
