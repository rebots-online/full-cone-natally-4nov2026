import { CreditActions } from './CreditActions';
import { CustomerValueExplanation } from './CustomerValueExplanation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { auth } from '../services/firebase';
import { readCreditBalance, formatReadingAllowance } from '../services/billingApi';
import { reconcileBillingAccess, restoreBillingPurchases } from '../services/billingAccess';

export function InferenceAccessSettings({ accountUid }: { accountUid: string }) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceError, setBalanceError] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceOwner, setBalanceOwner] = useState<string | null>(null);
  const generationRef = useRef(0);
  const mountedRef = useRef(false);
  const billingOpRef = useRef(0);
  const billingBusyRef = useRef(false);

  const refreshBalance = useCallback(async () => {
    generationRef.current += 1;
    const generation = generationRef.current;
    const owner = auth.currentUser;
    setBalanceOwner(owner?.uid ?? null);
    setBalance(null);
    setBalanceError(false);
    if (!owner || owner.uid !== accountUid) {
      setBalanceError(true);
      setBalanceLoading(false);
      return;
    }
    setBalanceLoading(true);
    try {
      const result = await readCreditBalance();
      if (!mountedRef.current || generationRef.current !== generation || auth.currentUser !== owner) return;
      if (!result || result.ownerUid !== accountUid ||
          typeof result.balance !== 'number' || !Number.isFinite(result.balance) || result.balance < 0) {
        setBalance(null);
        setBalanceError(true);
        return;
      }
      setBalance(result.balance);
      setBalanceError(false);
    } catch {
      if (mountedRef.current && generationRef.current === generation && auth.currentUser === owner) {
        setBalance(null);
        setBalanceError(true);
      }
    } finally {
      if (mountedRef.current && generationRef.current === generation) setBalanceLoading(false);
    }
  }, [accountUid]);

  useEffect(() => {
    mountedRef.current = true;
    const unsubscribe = auth.onAuthStateChanged(() => { refreshBalance(); });
    window.addEventListener('focus', refreshBalance);
    window.addEventListener('natally:purchase-access-changed', refreshBalance);
    return () => {
      mountedRef.current = false;
      generationRef.current += 1;
      unsubscribe();
      window.removeEventListener('focus', refreshBalance);
      window.removeEventListener('natally:purchase-access-changed', refreshBalance);
    };
  }, [refreshBalance, accountUid]);

  useEffect(() => {
    if (accountUid && auth.currentUser?.uid === accountUid) void restorePurchases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountUid]);

  useEffect(() => {
    setNotice('');
    setBusy(false);
    billingOpRef.current += 1; billingBusyRef.current=false;
  }, [accountUid]);

  async function refreshBilling() {
    const owner = auth.currentUser;
    if (!owner || owner.uid !== accountUid || busy || billingBusyRef.current) return;
    billingBusyRef.current = true;
    const op = ++billingOpRef.current;
    setBusy(true); setNotice('Updating balance…');
    try {
      const access = await reconcileBillingAccess(accountUid, true, () => auth.currentUser === owner && billingOpRef.current === op);
      if (!mountedRef.current || billingOpRef.current !== op || auth.currentUser !== owner) return;
      setNotice(access.state === 'ready' ? 'Balance updated.' : access.state === 'pending' ? 'Your balance is still updating. Please refresh shortly.' : 'Your balance could not be updated. Please retry.');
      await refreshBalance();
    } catch {
      if (!mountedRef.current || billingOpRef.current !== op || auth.currentUser !== owner) return;
      setNotice('Your balance could not be updated. Please retry.');
    } finally { billingBusyRef.current = false; if (mountedRef.current && billingOpRef.current === op && auth.currentUser === owner) setBusy(false); }
  }

  // Restoring is our job, never the customer's: it runs automatically whenever
  // this account's balance panel loads. The one manual control lives in
  // Account & billing.
  async function restorePurchases() {
    const owner = auth.currentUser;
    if (!owner || owner.uid !== accountUid || busy || billingBusyRef.current) return;
    billingBusyRef.current = true;
    const op = ++billingOpRef.current;
    setBusy(true);
    try {
      const access = await restoreBillingPurchases(accountUid, () => auth.currentUser === owner && billingOpRef.current === op);
      if (!mountedRef.current || billingOpRef.current !== op || auth.currentUser !== owner) return;
      if (access.state === 'pending') setNotice('A recent purchase is still being confirmed. It will appear here automatically.');
      window.dispatchEvent(new CustomEvent('natally:purchase-access-changed', { detail: { kind: 'reading' } }));
    } catch {
      if (!mountedRef.current || billingOpRef.current !== op || auth.currentUser !== owner) return;
      // Silent: the balance shown above is read straight from RevenueCat.
    } finally { billingBusyRef.current=false; if (mountedRef.current && billingOpRef.current === op && auth.currentUser === owner) setBusy(false); }
  }

  let balanceText: string;
  if (balanceOwner !== accountUid || auth.currentUser?.uid !== accountUid) balanceText = 'Balance unavailable. Please refresh.';
  else if (balanceLoading) balanceText = 'Checking balance…';
  else if (balanceError || balance === null) balanceText = 'Balance unavailable. Please refresh.';
  else balanceText = formatReadingAllowance(balance);

  return <section className="rounded-xl border border-[#d4af37]/30 bg-[#1c1428] p-3 space-y-3" aria-label="Balance and purchases">
    <CustomerValueExplanation headingLevel={4} />
    <h4 className="text-sm text-[#f2ca50]">Balance</h4>
    <p role="status" className="text-lg font-semibold text-[#f1e8d8]">{balanceText}</p>
    <div className="flex flex-wrap gap-2">
      <button type="button" disabled={busy || balanceLoading} onClick={refreshBilling} className="min-h-11 rounded-lg border border-[#d4af37]/50 px-3 py-2 text-xs text-[#f2ca50] disabled:opacity-40">Refresh balance</button>
    </div>
    <CreditActions uid={accountUid} onChanged={()=>void refreshBalance()} />
    {notice && <p role="status" className="text-xs text-[#f1e8d8]">{notice}</p>}
  </section>;
}
