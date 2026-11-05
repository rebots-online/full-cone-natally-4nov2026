import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getRocheBalance } from '../services/revenueCatCheckout';
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
      const result=await getRocheBalance();
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
    return () => {
      active.current=false;generation.current++;
      window.removeEventListener('focus',refresh);
      document.removeEventListener('visibilitychange',refresh);
      window.removeEventListener('natally:purchase-access-changed',refresh);
      notifyOpen.current?.(false);
    };
  },[user.uid,refreshCredits]);

  const currentUser=auth.currentUser?.uid===user.uid;
  const matching=credits.kind!=='idle' && credits.uid===user.uid && currentUser ? credits : null;
  const open=openUid===user.uid && currentUser;
  const label=matching?.kind==='ready' ? `${matching.balance.toLocaleString()} credits remaining. Open Account and billing.`
    : matching?.kind==='error' ? 'Credits unavailable. Open Account and billing to retry.'
    : 'Checking credits. Open Account and billing.';
  if (!currentUser) return null;

  return <>
    <button type="button" className="account-credits-entry" aria-label={label} aria-haspopup="dialog" aria-expanded={open}
      onClick={event=>{event.currentTarget.focus();setOpenUid(user.uid);notifyOpen.current?.(true);}}>
      <span className="account-credits-entry__amount" aria-live="polite">{matching?.kind==='ready' ? matching.balance.toLocaleString() : matching?.kind==='error' ? 'Unavailable' : 'Checking…'}</span>
      <span className="account-credits-entry__label">{matching?.kind==='ready' ? 'credits remaining' : 'Credits · Account & billing'}</span>
    </button>
    {open && <AccountBillingDialog key={user.uid} user={user} credits={matching} onRefreshCredits={refreshCredits}
      topUpHref="/app.html?app=1&offer=conversation" onClose={()=>{setOpenUid(null);notifyOpen.current?.(false);}} />}
  </>;
}
