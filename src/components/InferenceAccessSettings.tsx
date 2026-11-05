import { APP_NAME } from '../services/appIdentity';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { auth } from '../services/firebase';
import { getRocheBalance } from '../services/revenueCatCheckout';
import { loadInferenceKey } from '../services/inferenceAccess';
import { reconcileBillingAccess, restoreBillingPurchases } from '../services/billingAccess';
import { usePurchaseAccess } from './PurchaseAccess';

export function InferenceAccessSettings({ accountUid }: { accountUid: string }) {
  const [connected, setConnected] = useState(() => { try { return !!loadInferenceKey(accountUid); } catch { return false; } });
  const [validated, setValidated] = useState(false);
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
  const { showOffers } = usePurchaseAccess();

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
      const result = await getRocheBalance();
      if (!mountedRef.current || generationRef.current !== generation || auth.currentUser !== owner) return;
      if (!result || result.ownerUid !== accountUid || result.currency !== 'ROCHE' ||
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
    setValidated(false);
    setNotice('');
    setBusy(false);
    billingOpRef.current += 1;
    try { setConnected(!!loadInferenceKey(accountUid)); } catch { setConnected(false); }
  }, [accountUid]);

  async function refreshBilling() {
    const owner = auth.currentUser;
    if (!owner || owner.uid !== accountUid || busy || billingBusyRef.current) return;
    billingBusyRef.current = true;
    const op = ++billingOpRef.current;
    setBusy(true); setNotice('Checking your existing access…');
    try {
      const access = await reconcileBillingAccess(accountUid, true, () => auth.currentUser === owner && billingOpRef.current === op);
      if (!mountedRef.current || billingOpRef.current !== op || auth.currentUser !== owner) return;
      setConnected(!!loadInferenceKey(accountUid)); setValidated(access.state === 'ready'); setNotice(access.message);
    } catch (error) {
      if (!mountedRef.current || billingOpRef.current !== op || auth.currentUser !== owner) return;
      setValidated(false); setNotice(error instanceof Error ? error.message : 'Purchased access could not be confirmed. Please retry.');
    } finally { billingBusyRef.current = false; if (mountedRef.current && billingOpRef.current === op && auth.currentUser === owner) setBusy(false); }
  }

  async function restorePurchases() {
    const owner = auth.currentUser;
    if (!owner || owner.uid !== accountUid || busy || billingBusyRef.current) return;
    billingBusyRef.current = true;
    const op = ++billingOpRef.current;
    setBusy(true); setNotice('Restoring purchases…');
    try {
      const access = await restoreBillingPurchases(accountUid, () => auth.currentUser === owner && billingOpRef.current === op);
      if (!mountedRef.current || billingOpRef.current !== op || auth.currentUser !== owner) return;
      setConnected(!!loadInferenceKey(accountUid)); setValidated(access.state === 'ready'); setNotice(access.message);
      window.dispatchEvent(new CustomEvent('natally:purchase-access-changed', { detail: { kind: 'reading' } }));
    } catch (error) {
      if (!mountedRef.current || billingOpRef.current !== op || auth.currentUser !== owner) return;
      setNotice(error instanceof Error ? error.message : 'Restoring could not be completed. Please try again.');
    } finally { if (mountedRef.current && billingOpRef.current === op && auth.currentUser === owner) setBusy(false); }
  }

  let balanceText: string;
  if (balanceOwner !== accountUid || auth.currentUser?.uid !== accountUid) balanceText = 'ROCHE balance unavailable. Please refresh.';
  else if (balanceLoading) balanceText = 'Checking ROCHE balance…';
  else if (balanceError || balance === null) balanceText = 'ROCHE balance unavailable. Please refresh.';
  else balanceText = `${balance} ROCHE`;

  return <section className="rounded-xl border border-[#d4af37]/30 bg-[#1c1428] p-3 space-y-3" aria-label="Reading access">
    <h4 className="text-sm text-[#f2ca50]">Reading access · {connected ? 'Key installed' : 'No key installed'}</h4>
    <p role="status" className="text-xs text-[#f1e8d8]">{balanceText}</p>
    <p role="status" className="text-xs text-[#c4b9ce]">{validated
      ? 'Validated: your reading access key is connected and funded.'
      : connected
        ? 'A reading access key is installed on this account, but it has not been validated yet. Use “Check existing access” to validate it.'
        : 'No reading access key is installed yet. Purchases you make stay tied to your account and can be restored here.'}</p>
    <p className="text-xs text-[#c4b9ce]">Your reading access belongs to your {APP_NAME} account. Existing access and saved conversations stay available here.</p>
    <p className="text-xs text-[#c4b9ce]">Readings and conversation credits are bought through the in-app checkout: card via RevenueCat here, Google Play on Android where it is configured. A purchase still pending in the store is not treated as paid.</p>
    <div className="flex flex-wrap gap-2">
      <button type="button" disabled={busy} onClick={showOffers} className="min-h-11 rounded-lg border border-[#d4af37]/50 px-3 py-2 text-xs text-[#f2ca50] disabled:opacity-40">Buy reading access</button>
      <button type="button" disabled={busy} onClick={restorePurchases} className="min-h-11 rounded-lg border border-[#d4af37]/50 px-3 py-2 text-xs text-[#f2ca50] disabled:opacity-40">Restore purchases</button>
      <button type="button" disabled={balanceLoading} onClick={refreshBalance} className="min-h-11 rounded-lg border border-[#d4af37]/50 px-3 py-2 text-xs text-[#f2ca50] disabled:opacity-40">Refresh balance</button>
      <button type="button" disabled={busy} onClick={refreshBilling} className="min-h-11 rounded-lg border border-[#d4af37]/50 px-3 py-2 text-xs text-[#f2ca50] disabled:opacity-40">{busy ? 'Checking access…' : 'Check existing access'}</button>
    </div>
    {notice && <p role="status" className="text-xs text-[#f1e8d8]">{notice}</p>}
  </section>;
}
