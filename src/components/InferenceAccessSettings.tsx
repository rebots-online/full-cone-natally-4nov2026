import React, { useCallback, useEffect, useRef, useState } from 'react';
import { auth } from '../services/firebase';
import { getRocheBalance } from '../services/revenueCatCheckout';
import { loadInferenceKey } from '../services/inferenceAccess';
import { reconcileBillingAccess } from '../services/billingAccess';

export function InferenceAccessSettings({ accountUid }: { accountUid: string }) {
  const [connected, setConnected] = useState(() => { try { return !!loadInferenceKey(accountUid); } catch { return false; } });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceError, setBalanceError] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceOwner, setBalanceOwner] = useState<string | null>(null);
  const generationRef = useRef(0);
  const mountedRef = useRef(false);

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
      if (!result || result.ownerUid !== accountUid || result.currency !== 'ROCHE') {
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

  async function refreshBilling() {
    const owner = auth.currentUser;
    if (!owner || owner.uid !== accountUid || busy) return;
    setBusy(true); setNotice('Connecting your reading access…');
    try {
      const access = await reconcileBillingAccess(accountUid, true, () => auth.currentUser === owner);
      if (auth.currentUser !== owner) return;
      setConnected(!!loadInferenceKey(accountUid)); setNotice(access.message);
    } catch (error) {
      if (auth.currentUser === owner) setNotice(error instanceof Error ? error.message : 'Purchased access could not be confirmed. Please retry.');
    } finally { setBusy(false); }
  }

  let balanceText: string;
  if (balanceOwner !== accountUid || auth.currentUser?.uid !== accountUid) balanceText = 'ROCHE balance unavailable. Please refresh.';
  else if (balanceLoading) balanceText = 'Checking ROCHE balance…';
  else if (balanceError || balance === null) balanceText = 'ROCHE balance unavailable. Please refresh.';
  else balanceText = `${balance} ROCHE`;

  return <section className="rounded-xl border border-[#d4af37]/30 bg-[#1c1428] p-3 space-y-3" aria-label="Reading access">
    <h4 className="text-sm text-[#f2ca50]">Reading access · {connected ? 'Connected' : 'Not connected'}</h4>
    <p role="status" className="text-xs text-[#f1e8d8]">{balanceText}</p>
    <p className="text-xs text-[#c4b9ce]">Your reading access belongs to your Natally account. Existing access and saved conversations stay available here.</p>
    <h5 className="text-sm text-[#f1e8d8]">Payment methods</h5>
    <ul className="space-y-2 text-xs" aria-label="Payment availability">
      <li className="rounded-lg border border-white/10 p-3"><strong>Card · RevenueCat</strong><p className="mt-1 text-[#c4b9ce]">Not available yet</p></li>
      <li className="rounded-lg border border-white/10 p-3"><strong>Crypto · x402</strong><p className="mt-1 text-[#c4b9ce]">Not available yet</p></li>
      <li className="rounded-lg border border-white/10 p-3"><strong>Bitcoin Lightning</strong><p className="mt-1 text-[#c4b9ce]">Not available yet</p></li>
    </ul>
    <p className="text-xs text-[#c4b9ce]">Purchasing is not open yet. No payment can be taken here. Your reading stays in place while you check existing access.</p>
    <button type="button" disabled={balanceLoading} onClick={refreshBalance} className="min-h-11 rounded-lg border border-[#d4af37]/50 px-3 py-2 text-xs text-[#f2ca50] disabled:opacity-40">Refresh balance</button>
    <button type="button" disabled={busy} onClick={refreshBilling} className="min-h-11 rounded-lg border border-[#d4af37]/50 px-3 py-2 text-xs text-[#f2ca50] disabled:opacity-40">{busy ? 'Checking access…' : 'Check existing access'}</button>
    {notice && <p role="status" className="text-xs text-[#f1e8d8]">{notice}</p>}
  </section>;
}
