import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { checkDownloadAccess, type DownloadAccess, type DownloadRequest } from '../services/downloadAccess';
import './PurchaseAccess.css';

type Intent = { request:DownloadRequest; run?:()=>void|Promise<void>; current:()=>boolean; owner:string|null; upfront:boolean };
type AccessContext = { requestDownload:(request:DownloadRequest,run:()=>void|Promise<void>,current?:()=>boolean)=>Promise<void>; showOffer:(resourceId?:string)=>void };
const Access=createContext<AccessContext|null>(null);
export function usePurchaseAccess() { const value=useContext(Access); if(!value) throw new Error('Purchase access provider is missing'); return value; }

export function PurchaseAccessProvider({children}:{children:React.ReactNode}) {
  const [intent,setIntent]=useState<Intent|null>(null);
  const [result,setResult]=useState<DownloadAccess|null>(null);
  const [busy,setBusy]=useState(false);
  const dialog=useRef<HTMLDialogElement>(null);
  const operation=useRef(0);
  const inFlight=useRef(false);
  const close=()=>{operation.current++;inFlight.current=false;setBusy(false);setIntent(null);setResult(null);};
  useEffect(()=>onAuthStateChanged(auth,()=>close()),[]);
  useEffect(()=>{
    if(!intent||!dialog.current)return;
    const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
    const element=dialog.current;element.showModal();
    return()=>{element.close();if(previous?.isConnected)previous.focus();};
  },[intent]);
  const valid=(value:Intent)=>(auth.currentUser?.uid??null)===value.owner && value.current();
  const resolve=async(value:Intent,openOnly=false)=>{
    if(inFlight.current)return;
    inFlight.current=true;const sequence=++operation.current;setBusy(true);
    const access=await checkDownloadAccess(value.request);
    if(sequence!==operation.current)return;
    inFlight.current=false;setBusy(false);
    if(!valid(value)){close();return;}
    if(access.state==='owned') {
      close();
      if(!openOnly && value.run && valid(value)) await value.run();
    } else {setResult(access);setIntent(value);}
  };
  const showOffer=(resourceId='natal-reading')=>{
    const value:Intent={request:{format:'pdf',resourceId},current:()=>true,owner:auth.currentUser?.uid??null,upfront:true};
    setResult(null);setIntent(value);void resolve(value,true);
  };
  const requestDownload=async(request:DownloadRequest,run:()=>void|Promise<void>,current=()=>true)=>{
    const value:Intent={request,run,current,owner:auth.currentUser?.uid??null,upfront:false};
    if(!current()||inFlight.current)return;
    // Keep reading/audio mounted while checking or showing the offer.
    setResult(null);setIntent(value);await resolve(value);
  };
  return <Access.Provider value={{requestDownload,showOffer}}>{children}{intent&&createPortal(
    <dialog ref={dialog} className="natally-offer" aria-labelledby="natally-offer-title" onClick={event=>{if(event.target!==event.currentTarget)return;const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)close();}} onCancel={event=>{event.preventDefault();close();}}>
      <button type="button" className="natally-offer__close" aria-label="Close purchase offer" onClick={close}>×</button>
      <div className="natally-offer__art"><img src="/atelier/poster.webp" alt="Natally in her candlelit reading room"/><p>A little cosmic company.<br/>At your own pace.</p></div>
      <div className="natally-offer__copy">
        <p className="natally-offer__eyebrow">YOUR READING, YOUR CHOICE</p>
        <h1 id="natally-offer-title">Your reading.<br/>Your time with Natally.</h1>
        <p>Conversations and generated readings require prepaid access or an included package allowance, including conversations before your chart is ready. Your offer will explain what is included before you pay.</p>
        {!intent.upfront&&<p className="natally-offer__requested">You chose: {intent.request.format.toUpperCase()} download. Your reading stays where you left it.</p>}
        <section className="natally-offer__product" aria-label="Reading purchase">
          <h2>{result?.state==='offer'?result.title:'Buy & keep your reading'}</h2>
          <p>Reading PDFs and saved voice recordings to revisit away from the reading room.</p><p><strong>One year in your saved atelier.</strong> Revisit your conversation in Natally’s interactive atelier, frozen in time with your reading. Explore the chart and replay the conversation as they were then.</p><p>The offer will show exactly which files and saved-atelier access are included before payment.</p>
          <p className="natally-offer__terms">Conversation credit packs ($ROCHE) are separate. Saved-atelier access is for revisiting that conversation; new conversations use separate credits. Downloaded files remain yours after the year of atelier access.</p>
          {busy?<p role="status">Checking purchase access…</p>:result?.state==='offer'?<>
            <strong>{result.priceLabel}</strong><p>{result.terms}</p>
            {Date.parse(result.expiresAt)>Date.now()&&<a className="natally-offer__buy" href={result.checkoutUrl} target="_blank" rel="noopener noreferrer">Continue to secure checkout ↗</a>}
          </>:<p role="status" className="natally-offer__availability">{result?.state==='unavailable'?result.message:'Checking purchase access…'}</p>}
        </section>
        <div className="natally-offer__actions">
          <button type="button" className="natally-offer__free" onClick={close}>Return to the room</button>
          <button type="button" disabled={busy} onClick={()=>void resolve(intent)}>{busy?'Checking…':'Already purchased? Check access'}</button>
        </div>
        <p className="natally-offer__footnote">No payment is taken on this screen. After checkout, return here to check access{intent.run?' and download your selected file':''}.</p>
      </div>
    </dialog>,document.body)}</Access.Provider>;
}

export function ReadingPurchaseNotice(){const {showOffer}=usePurchaseAccess();return <aside className="reading-purchase-notice"><span>Conversations use prepaid access. Reading bundles include the files listed in your offer.</span><button type="button" onClick={()=>showOffer()}>View purchase options</button></aside>;}
