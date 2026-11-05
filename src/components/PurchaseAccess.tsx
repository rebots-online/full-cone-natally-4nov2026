import { APP_NAME } from '../services/appIdentity';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { checkDownloadAccess, type DownloadRequest } from '../services/downloadAccess';
import { getCheckoutOffer, getCheckoutOffers, purchaseCheckoutOffer, type CheckoutOffer } from '../services/revenueCatCheckout';
import { reconcileBillingAccess, restoreBillingPurchases } from '../services/billingAccess';
import './PurchaseAccess.css';
import { FigmaPaywall, type OfferOption, type OfferPrices, type OfferTerms, type OfferTermsByKind } from './FigmaPaywall';
import { purchaseIntent, type PurchaseIntent, type PurchaseKind } from '../services/purchaseIntent';
import { defaultCreditOfferId } from '../services/checkoutCatalog';
import { CreditActions } from './CreditActions';

type Intent = {
  seq:number; gen:number; kind:PurchaseKind|null; offerId?:string;
  request?:DownloadRequest; run?:()=>void|Promise<void>; current:()=>boolean;
  owner:string|null; explicitPurchase:boolean;
};
type AccessContext = {
  requestDownload:(request:DownloadRequest,run:()=>void|Promise<void>,current?:()=>boolean)=>Promise<void>;
  showOffer:(resourceId?:string,selection?:PurchaseIntent)=>void;
  showOffers:()=>void;
};
const Access=createContext<AccessContext|null>(null);
export function usePurchaseAccess() { const value=useContext(Access); if(!value) throw new Error('Purchase access provider is missing'); return value; }

export function PurchaseAccessProvider({children}:{children:React.ReactNode}) {
  const [intent,setIntent]=useState<Intent|null>(null);
  const [prices,setPrices]=useState<OfferPrices>({reading:null,conversation:null});
  const [terms,setTerms]=useState<OfferTermsByKind>({reading:null,conversation:null});
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const [checkoutOverlay,setCheckoutOverlay]=useState(false);
  const [packOffers,setPackOffers]=useState<OfferOption[]>([]);
  const [selectedOfferId,setSelectedOfferIdState]=useState<string|null>(null);
  const intentRef=useRef<Intent|null>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const operation=useRef(0);
  const authGeneration=useRef(0);
  const authUid=useRef<string|null|undefined>(undefined);
  const mounted=useRef(true);
  const purchaseInFlight=useRef(false);
  const paymentConfirmed=useRef(false);
  const storePendingKind=useRef<PurchaseKind|null>(null);
  const launchAttempt=useRef<{seq:number;kind:PurchaseKind;offerId?:string}|null>(null);
  const busyRef=useRef(false);
  const quotes=useRef<{reading?:CheckoutOffer;conversation?:CheckoutOffer}>({});
  const packQuotes=useRef<Record<string,CheckoutOffer>>({});
  const selectedOfferIdRef=useRef<string|null>(null);
  const quotesOwner=useRef<string|null>(null);
  const termsRef=useRef<OfferTermsByKind>({reading:null,conversation:null});
  const loadSeq=useRef(0);
  const expiryTimer=useRef<number|undefined>(undefined);
  const queuedUrl=useRef<{type:'offer';kind:PurchaseKind}|{type:'journey'}|null>(null);
  const applyIntent=(value:Intent|null)=>{intentRef.current=value;setIntent(value);};
  const setBusyState=(value:boolean)=>{busyRef.current=value;setBusy(value);};
  const valid=(value:Intent|null):value is Intent=>!!value&&mounted.current&&operation.current===value.seq&&authGeneration.current===value.gen&&value.current()&&(auth.currentUser?.uid??null)===value.owner;
  const sessionCurrent=(owner:string,gen?:number)=>mounted.current&&(auth.currentUser?.uid??null)===owner&&(gen===undefined||authGeneration.current===gen);
  const setTermsState=(value:OfferTermsByKind)=>{termsRef.current=value;setTerms(value);};
  const clearQuotes=()=>{quotes.current={};packQuotes.current={};quotesOwner.current=null;selectedOfferIdRef.current=null;setSelectedOfferIdState(null);setPackOffers([]);setPrices({reading:null,conversation:null});setTermsState({reading:null,conversation:null});};
  const close=()=>{
    operation.current++;
    applyIntent(null);
    clearQuotes();
    paymentConfirmed.current=false;
    setBusyState(false);
    setMessage('');
  };
  const scheduleExpiry=()=>{
    window.clearTimeout(expiryTimer.current);
    const times=[quotes.current.reading?.expiresAt,...Object.values(packQuotes.current).map(quote=>quote.expiresAt)].filter((value):value is number=>typeof value==='number');
    if(times.length===0)return;
    const delay=Math.max(0,Math.min(...times)-Date.now());
    expiryTimer.current=window.setTimeout(()=>{
      if(!mounted.current||purchaseInFlight.current)return;
      const current=intentRef.current;
      if(!current||!sessionCurrent(current.owner??'')||quotesOwner.current!==(auth.currentUser?.uid??null))return;
      const packsExpired=Object.values(packQuotes.current).some(quote=>Date.now()>=quote.expiresAt);
      const readingExpired=quotes.current.reading!==undefined&&Date.now()>=quotes.current.reading.expiresAt;
      const selected=quotes.current.conversation;
      const selectedExpired=selected!==undefined&&Date.now()>=selected.expiresAt;
      if(!packsExpired&&!readingExpired&&!selectedExpired)return;
      if(readingExpired){quotes.current.reading=undefined;setPrices(prev=>({...prev,reading:null}));setTermsState({...termsRef.current,reading:null});}
      if(packsExpired||selectedExpired){setPrices(prev=>({...prev,conversation:null}));setTermsState({...termsRef.current,conversation:null});}
      // Expire and reload quotes; never automatically purchase on refresh.
      void loadQuotes(current,false);
    },delay);
  };
  const offerTerms=(offer:CheckoutOffer):OfferTerms|null=>{
    const raw=offer as Partial<OfferTerms>;
    const productType=raw.productType;
    if(productType!=='subscription'&&productType!=='one_time')return null;
    const billingPeriod=productType==='one_time'||typeof raw.billingPeriod!=='string'
      ?null
      :raw.billingPeriod;
    return {productType,billingPeriod,productTitle:typeof raw.productTitle==='string'?raw.productTitle:''};
  };
  const loadQuotes=async(value:Intent,allowLaunch=true)=>{
    const owner=value.owner;
    if(!owner||purchaseInFlight.current)return;
    if(value.kind==='conversation'){setMessage('');return;}
    const seq=++loadSeq.current;
    setMessage('Checking prices…');
    try{
      const results=await Promise.allSettled([getCheckoutOffer('reading'),getCheckoutOffers('conversation')]);
      if(!mounted.current||!valid(value)||seq!==loadSeq.current)return;
      const next:OfferPrices={reading:null,conversation:null};
      const nextTerms:OfferTermsByKind={reading:null,conversation:null};
      let loaded=false;
      const readingResult=results[0];
      if(readingResult.status==='fulfilled'&&readingResult.value.ownerUid===owner){
        const offer=readingResult.value;
        quotes.current.reading=offer;
        quotesOwner.current=owner;
        const expired=Date.now()>=offer.expiresAt;
        next.reading=expired?null:offer.formattedPrice;
        nextTerms.reading=expired?null:offerTerms(offer);
        loaded=true;
      }else{
        quotes.current.reading=undefined;
      }
      const packs:Record<string,CheckoutOffer>={};
      const options:OfferOption[]=[];
      const conversationResult=results[1];
      if(conversationResult.status==='fulfilled'){
        for(const offer of conversationResult.value){
          if(offer.ownerUid!==owner||Date.now()>=offer.expiresAt)continue;
          packs[offer.offerId]=offer;
          options.push({offerId:offer.offerId,formattedPrice:offer.formattedPrice,productTitle:offer.productTitle,productType:offer.productType,billingPeriod:offer.billingPeriod});
          loaded=true;
        }
      }
      if(!loaded)throw new Error('The offers could not be loaded. Please try again.');
      quotesOwner.current=owner;
      packQuotes.current=packs;
      const previous=selectedOfferIdRef.current??value.offerId??null;
      let selectedId=previous!==null&&packs[previous]&&Date.now()<packs[previous].expiresAt?previous:null;
      if(!selectedId&&!value.offerId){
        selectedId=defaultCreditOfferId(options);
      }
      selectedOfferIdRef.current=selectedId;
      setSelectedOfferIdState(selectedId);
      setPackOffers(options);
      const selectedOffer=selectedId!==null?packs[selectedId]:undefined;
      const selectedExpired=selectedOffer!==undefined&&Date.now()>=selectedOffer.expiresAt;
      quotes.current.conversation=selectedOffer;
      next.conversation=selectedOffer&&!selectedExpired?selectedOffer.formattedPrice:null;
      nextTerms.conversation=selectedOffer&&!selectedExpired?offerTerms(selectedOffer):null;
      setPrices(next);
      setTermsState(nextTerms);
      setMessage(!quotes.current.reading||options.length===0?'Some prices could not be loaded. Please try again later.':'');
      scheduleExpiry();
      const kind=value.kind;
      if(allowLaunch&&kind&&value.explicitPurchase&&!paymentConfirmed.current&&!busyRef.current&&!purchaseInFlight.current){
        if(kind==='reading'){
          if(!launchAttempt.current||launchAttempt.current.seq!==value.seq){
            launchAttempt.current={seq:value.seq,kind};
            void startPurchase(value,'reading');
          }
        }else if(value.offerId){
          const quote=packs[value.offerId];
          if(quote&&Date.now()<quote.expiresAt){
            if(!launchAttempt.current||launchAttempt.current.seq!==value.seq||launchAttempt.current.offerId!==value.offerId){
              launchAttempt.current={seq:value.seq,kind,offerId:value.offerId};
              void startPurchase(value,'conversation',value.offerId);
            }
          }else{
            setMessage('The selected pack is currently unavailable. Please choose another pack.');
          }
        }
      }
    }catch{
      if(!mounted.current||!valid(value)||seq!==loadSeq.current)return;
      clearQuotes();
      setMessage('The offers could not be loaded. Please try again.');
    }
  };
  const finishAfterAccess=async(value:Intent,ready:boolean)=>{
    const owner=value.owner;
    if(!owner)return;
    if(value.run&&value.request){
      const access=await checkDownloadAccess(value.request);
      if(!valid(value)||!sessionCurrent(owner,value.gen))return;
      if(access.state==='owned'){if(valid(value)){close();await value.run();}return;}
      if(valid(value))setMessage(access.state==='unavailable'?'Your purchase could not be confirmed. Please try again.':access.title);
      return;
    }
    if(ready&&valid(value))close();
  };
  const choosePack=(offerId:string)=>{
    const value=intentRef.current;
    if(!value||!valid(value)||busyRef.current||purchaseInFlight.current||paymentConfirmed.current)return;
    const quote=packQuotes.current[offerId];
    if(!quote||quote.ownerUid!==value.owner||Date.now()>=quote.expiresAt)return;
    selectedOfferIdRef.current=offerId;
    setSelectedOfferIdState(offerId);
    quotes.current.conversation=quote;
    setPrices(prev=>({...prev,conversation:quote.formattedPrice}));
    setTermsState({...termsRef.current,conversation:offerTerms(quote)});
  };
  const startPurchase=async(value:Intent,kind:PurchaseKind,offerId?:string)=>{
    const owner=value.owner;
    if(purchaseInFlight.current||busyRef.current)return;
    const offer=quotes.current[kind];
    const kindTerms=termsRef.current[kind];
    if(!owner||!offer||offer.ownerUid!==owner||!kindTerms||!valid(value)||paymentConfirmed.current)return;
    if(kind==='conversation'&&offerId!==undefined&&offer.offerId!==offerId)return;
    if(kindTerms.productType==='subscription'&&!kindTerms.billingPeriod){
      setMessage('Recurring billing details for this offer are unavailable right now. Please try again later.');
      return;
    }
    if(storePendingKind.current===kind&&!paymentConfirmed.current){
      setMessage('Your purchase is pending with the store. Do not buy again; it will be added automatically as soon as it is confirmed.');
      return;
    }
    if(Date.now()>=offer.expiresAt){
      setPrices(prev=>({...prev,[kind]:null}));
      void loadQuotes(value,false);
      return;
    }
    purchaseInFlight.current=true;
    setBusyState(true);
    setMessage('Opening secure checkout…');
    setCheckoutOverlay(true);
    let refresh=false;
    try{
      const outcome=await purchaseCheckoutOffer(offer);
      if(!mounted.current)return;
      if(!sessionCurrent(owner,value.gen))return;
      if(outcome.state==='cancelled'){
        refresh=true;
        if(valid(value))setMessage('');
        return;
      }
      if(outcome.state==='pending'){
        storePendingKind.current=kind;
        if(valid(value))setMessage('Your payment is pending with the store. It will be added automatically as soon as it is confirmed.');
        void autoConfirm(value,kind);
        return;
      }
      paymentConfirmed.current=true;
      if(storePendingKind.current===kind)storePendingKind.current=null;
      if(valid(value)){
        setPrices(prev=>({...prev,[kind]:null}));
        setTermsState({...termsRef.current,[kind]:null});
        setMessage('Payment confirmed. Updating your purchase…');
      }
      const access=await reconcileBillingAccess(owner,true,()=>sessionCurrent(owner,value.gen));
      if(!mounted.current||!sessionCurrent(owner,value.gen))return;
      window.dispatchEvent(new CustomEvent('natally:purchase-access-changed',{detail:{kind}}));
      const ready=access.state==='ready'&&!!access.connected;
      if(access.state!=='ready'){
        if(valid(value))setMessage('Payment confirmed. Adding it to your account…');
        void autoConfirm(value,kind);
        return;
      }
      if(valid(value))setMessage('Your purchase is ready.');
      await finishAfterAccess(value,ready);
      return;
    }catch{
      if(mounted.current&&sessionCurrent(owner,value.gen)){
        if(paymentConfirmed.current){
          if(valid(value))setMessage('Payment confirmed. Adding it to your account…');
          void autoConfirm(value,kind);
        }else{
          refresh=true;
          if(valid(value))setMessage('Your purchase could not start. Please try again.');
        }
      }
    }finally{
      purchaseInFlight.current=false;
      if(mounted.current&&operation.current===value.seq&&authGeneration.current===value.gen){
        setBusyState(false);
        setCheckoutOverlay(false);
      }
      if(refresh&&valid(value)&&!paymentConfirmed.current)void loadQuotes(value,false);
    }
  };
  // Restoring is our job: after a confirmed or store-pending payment, keep
  // re-reading RevenueCat (the authoritative store) until the purchase lands.
  const autoConfirm=async(value:Intent,kind:string)=>{
    const owner=value.owner;
    if(!owner)return;
    for(const delay of [2000,4000,8000,15000,30000,60000]){
      await new Promise(resolve=>setTimeout(resolve,delay));
      if(!mounted.current||!sessionCurrent(owner,value.gen))return;
      let access;
      try{access=await restoreBillingPurchases(owner,()=>sessionCurrent(owner,value.gen));}catch{continue;}
      if(!mounted.current||!sessionCurrent(owner,value.gen))return;
      if(access.state==='ready'){
        if(storePendingKind.current===kind)storePendingKind.current=null;
        window.dispatchEvent(new CustomEvent('natally:purchase-access-changed',{detail:{kind}}));
        if(valid(value))setMessage('Your purchase is ready.');
        await finishAfterAccess(value,!!access.connected);
        return;
      }
    }
    if(valid(value))setMessage('Your payment is recorded and is taking longer than usual to arrive. Natally keeps checking automatically each time you open it; you do not need to buy again.');
  };
  const restore=async(value:Intent)=>{
    const owner=value.owner;
    if(!owner||purchaseInFlight.current||busyRef.current||!valid(value))return;
    setBusyState(true);
    setMessage(paymentConfirmed.current?'Checking your purchase…':'Restoring purchases…');
    try{
      const access=await restoreBillingPurchases(owner,()=>sessionCurrent(owner,value.gen));
      if(!mounted.current||!sessionCurrent(owner,value.gen))return;
      const ready=access.state==='ready'&&!!access.connected;
      if(access.state==='ready'){
        window.dispatchEvent(new CustomEvent('natally:purchase-access-changed',{detail:{kind:value.kind??'reading'}}));
        if(valid(value))setMessage('Your purchases are up to date.');
        await finishAfterAccess(value,ready);
        return;
      }
      if(valid(value))setMessage(access.state==='pending'
        ?'A recent purchase is still being confirmed. It will be added automatically.'
        :access.state==='unfunded'
          ?'Your purchases are up to date. Your balance is empty; add credits to continue.'
          :'Your purchase records could not be reached just now. Natally will check again automatically.');
      await finishAfterAccess(value,ready);
    }catch{
      if(valid(value))setMessage('Your purchases could not be restored. Please try again.');
    }finally{
      if(mounted.current&&operation.current===value.seq&&authGeneration.current===value.gen)setBusyState(false);
    }
  };
  const resumeDownload=async(value:Intent)=>{
    if(!value.run||!value.request)return;
    setBusyState(false);
    setMessage('Checking your purchase…');
    try{
      const access=await checkDownloadAccess(value.request);
      if(!valid(value))return;
      if(access.state==='owned'){close();await value.run();return;}
      setMessage(access.state==='unavailable'?'Your purchase could not be confirmed. Please try again.':access.title);
      void loadQuotes(value,false);
    }catch{
      if(valid(value))setMessage('Your purchase could not be checked. Please try again.');
    }
  };
  const requestDownload=async(request:DownloadRequest,run:()=>void|Promise<void>,current=()=>true)=>{
    if(purchaseInFlight.current)return;
    const owner=auth.currentUser?.uid??null;
    const value:Intent={seq:++operation.current,gen:authGeneration.current,kind:request.purchaseIntent?.kind??'reading',request,run,current,owner,explicitPurchase:false};
    paymentConfirmed.current=false;
    clearQuotes();
    applyIntent(value);
    if(!owner||!current()){setMessage('Sign in to check your purchase. Your reading stays here.');return;}
    await resumeDownload(value);
  };
  const showOffer=(resourceId='natal-reading',selection=purchaseIntent('reading','reading-entry'))=>{
    if(purchaseInFlight.current)return;
    const owner=auth.currentUser?.uid??null;
    const value:Intent={seq:++operation.current,gen:authGeneration.current,kind:selection.kind,offerId:selection.offerId,request:{format:'pdf',resourceId,purchaseIntent:selection},current:()=>true,owner,explicitPurchase:true};
    paymentConfirmed.current=false;
    clearQuotes();
    applyIntent(value);
    if(!owner){setMessage('Sign in to continue your purchase.');return;}
    void loadQuotes(value);
  };
  const showOffers=()=>{
    if(purchaseInFlight.current)return;
    const owner=auth.currentUser?.uid??null;
    const value:Intent={seq:++operation.current,gen:authGeneration.current,kind:null,current:()=>true,owner,explicitPurchase:false};
    paymentConfirmed.current=false;
    clearQuotes();
    applyIntent(value);
    if(!owner){setMessage('Sign in to see the offers.');return;}
    void loadQuotes(value,false);
  };
  useEffect(()=>{
    mounted.current=true;
    return()=>{mounted.current=false;window.clearTimeout(expiryTimer.current);};
  },[]);
  useEffect(()=>{
    const url=new URL(window.location.href);
    const offerParam=url.searchParams.get('offer');
    const offersParam=url.searchParams.get('offers');
    if(offerParam==='reading'||offerParam==='conversation'){
      url.searchParams.delete('offer');
      queuedUrl.current={type:'offer',kind:offerParam};
    }else if(offersParam==='1'){
      url.searchParams.delete('offers');
      queuedUrl.current={type:'journey'};
    }
    if(queuedUrl.current)window.history.replaceState(window.history.state,'',url.pathname+url.search+url.hash);
    const unsubscribe=onAuthStateChanged(auth,user=>{
      if(!mounted.current)return;
      const uid=user?.uid??null;
      if(authUid.current===uid)return;
      authUid.current=uid;
      authGeneration.current+=1;
      storePendingKind.current=null;
      const queued=queuedUrl.current;
      if(uid&&queued){
        queuedUrl.current=null;
        if(queued.type==='offer')showOffer(queued.kind==='reading'?'natal-reading':'conversation',purchaseIntent(queued.kind,'url-offer'));
        else showOffers();
        return;
      }
      const current=intentRef.current;
      if(!current)return;
      if(current.owner===null&&uid&&!purchaseInFlight.current){
        const value:Intent={...current,seq:++operation.current,gen:authGeneration.current,owner:uid};
        applyIntent(value);
        if(value.run&&value.request)void resumeDownload(value);
        else void loadQuotes(value,value.explicitPurchase);
        return;
      }
      if(current.owner!==null&&current.owner!==uid)close();
    });
    const onShowOffers=()=>showOffers();
    window.addEventListener('natally:show-offers',onShowOffers);
    return()=>{unsubscribe();window.removeEventListener('natally:show-offers',onShowOffers);};
  },[]);
  const dialogPresent=!!intent&&intent.owner!==null;
  useEffect(()=>{
    const element=dialog.current;
    if(!element)return;
    if(dialogPresent&&!checkoutOverlay){if(!element.open)element.showModal();}
    else if(element.open)element.close();
  },[dialogPresent,checkoutOverlay]);
  return <Access.Provider value={{requestDownload,showOffer,showOffers}}>{children}
    {intent&&dialogPresent&&intent.owner&&createPortal(
      <dialog ref={dialog} className="natally-offer natally-offer--original" aria-label={`${APP_NAME} purchase options`}
        onCancel={event=>{event.preventDefault();close();}}>
        {intent.kind==='conversation'?<div className="account-billing p-6">
          <div className="account-billing__header"><h2>Purchases &amp; receipts</h2><button type="button" onClick={close}>Close</button></div>
          <CreditActions uid={intent.owner}/>
        </div>:<><button type="button" className="min-h-11 px-4 underline" onClick={()=>showOffer('conversation',purchaseIntent('conversation','purchase-options'))}>Buy credits or redeem a code</button>
        <FigmaPaywall ownerUid={intent.owner} isCurrent={()=>valid(intent)}
          prices={prices} terms={terms} options={packOffers} selectedOfferId={selectedOfferId}
          busy={busy} message={message}
          initialScreen={1}
          onPurchase={(kind,offerId)=>{if(kind==='conversation'){showOffer('conversation',purchaseIntent('conversation','purchase-options'));return;}const value=intentRef.current;if(value&&!purchaseInFlight.current)void startPurchase(value,kind,offerId);}}
          onSelect={choosePack}
          onRestore={()=>{const value=intentRef.current;if(value)void restore(value);}}
          onClose={close} /></>}
      </dialog>,document.body)}
  </Access.Provider>;
}

export function PurchaseCTA({kind,sourceSection,children,onOpen}:{kind:PurchaseKind;sourceSection:string;children:React.ReactNode;onOpen?:()=>void}) {
  const {showOffer}=usePurchaseAccess();
  return <button type="button" className="natally-purchase-cta" data-purchase-section={sourceSection} data-purchase-kind={kind}
    onClick={()=>{onOpen?.();showOffer(kind==='reading'?'natal-reading':'conversation',purchaseIntent(kind,sourceSection));}}>{children}</button>;
}
export function ReadingPurchaseNotice(){return <aside className="reading-purchase-notice"><span>Save your reading with the files included in your purchase.</span><PurchaseCTA kind="reading" sourceSection="reading-notice">Buy my reading</PurchaseCTA></aside>;}
