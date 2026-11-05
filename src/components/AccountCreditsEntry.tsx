import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import { auth } from '../services/firebase';
import { readCreditBalance, formatReadingAllowance } from '../services/billingApi';
import { AccountBillingDialog, type AccountCreditsState } from './AccountBillingDialog';

export function AccountCreditsEntry({ user, onOpenChange }: { user:User; onOpenChange?:(open:boolean)=>void }) {
  const [credits,setCredits]=useState<AccountCreditsState>({kind:'idle'});
  const [openUid,setOpenUid]=useState<string|null>(null);
  const owner=useRef(user.uid);owner.current=user.uid;
  const active=useRef(false);
  const generation=useRef(0);
  const notifyOpen=useRef(onOpenChange);notifyOpen.current=onOpenChange;

  const refreshCredits=useCallback(async (uid:string) => {
    const request=++generation.current;
    const current=()=>active.current && generation.current===request && owner.current===uid && auth.currentUser?.uid===uid;
    if (!current()) return;
    setCredits({kind:'loading',uid});
    try {
      const result=await readCreditBalance();
      if (!current()) return;
      if (result.ownerUid!==uid) throw new Error('Credits belong to another account.');
      setCredits({kind:'ready',uid,balance:result.balance});
    } catch {
      if (current()) setCredits({kind:'error',uid,message:'Your credits could not be loaded. Please retry.'});
    }
  },[]);

  useEffect(() => {
    const uid=user.uid;
    active.current=true;generation.current++;
    setCredits({kind:'idle'});setOpenUid(null);notifyOpen.current?.(false);
    const refresh=()=>{if(!document.hidden && auth.currentUser?.uid===uid) void refreshCredits(uid);};
    refresh();
    window.addEventListener('focus',refresh);
    document.addEventListener('visibilitychange',refresh);
    window.addEventListener('natally:purchase-access-changed',refresh);
    const confirmation=(event:Event)=>{if((event as CustomEvent).detail?.uid===uid&&auth.currentUser?.uid===uid){setOpenUid(uid);notifyOpen.current?.(true);}};
    window.addEventListener('natally:purchase-confirmation',confirmation);
    if(new URL(window.location.href).searchParams.has('billing_return')){setOpenUid(uid);notifyOpen.current?.(true);}
    return () => {
      active.current=false;generation.current++;
      window.removeEventListener('focus',refresh);
      document.removeEventListener('visibilitychange',refresh);
      window.removeEventListener('natally:purchase-access-changed',refresh);
      window.removeEventListener('natally:purchase-confirmation',confirmation);
      notifyOpen.current?.(false);
    };
  },[user.uid,refreshCredits]);

  const currentUser=auth.currentUser?.uid===user.uid;
  const matching=credits.kind!=='idle' && credits.uid===user.uid && currentUser ? credits : null;
  const open=openUid===user.uid && currentUser;
  const label=matching?.kind==='ready' ? `Balance: ${formatReadingAllowance(matching.balance)}. Open Account and billing.`
    : matching?.kind==='error' ? 'Balance unavailable. Open Account and billing to retry.'
    : 'Checking balance. Open Account and billing.';
  if (!currentUser) return null;

  return <>
    <button type="button" className="account-credits-entry" aria-label={label} aria-haspopup="dialog" aria-expanded={open}
      onClick={event=>{event.currentTarget.focus();setOpenUid(user.uid);notifyOpen.current?.(true);}}>
      <span className="account-credits-entry__amount" aria-live="polite">{matching?.kind==='ready' ? formatReadingAllowance(matching.balance) : matching?.kind==='error' ? 'Unavailable' : 'Checking…'}</span>
    </button>
    {open && <AccountBillingDialog key={user.uid} user={user} credits={matching} onRefreshCredits={refreshCredits}
      topUpHref="/app.html?app=1&offer=conversation" onClose={()=>{setOpenUid(null);notifyOpen.current?.(false);}} />}
  </>;
}
