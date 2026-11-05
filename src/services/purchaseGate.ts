/** Checkout is an invitation to reconcile, never evidence that money settled. */
export function waitForPurchase<T>(owner:T,isCurrentSession:()=>boolean):Promise<void> {
  return new Promise((resolve,reject)=>{
    let settled=false;
    const finish=(error?:unknown)=>{if(settled)return;settled=true;clearInterval(watch);error?reject(error):resolve();};
    const watch=setInterval(()=>{if(!isCurrentSession())finish(Object.assign(new Error('Your account or reading changed.'),{code:'auth_required'}));},200);
    if(!isCurrentSession()){finish(new Error('Your account changed.'));return;}
    window.dispatchEvent(new CustomEvent('natally:purchase-required',{detail:{owner,isCurrentSession,resolve:()=>finish(),reject:(error?:Error)=>finish(error||Object.assign(new Error('Reading options closed. Your question is kept here.'),{code:'purchase_dismissed'}))}}));
  });
}
