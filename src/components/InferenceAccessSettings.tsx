import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { loadInferenceKey } from '../services/inferenceAccess';
import { reconcileBillingAccess } from '../services/billingAccess';
import { PaymentMethods } from './PaymentMethods';

export function InferenceAccessSettings({ accountUid }: { accountUid: string }) {
  const [connected, setConnected] = useState(() => { try { return !!loadInferenceKey(accountUid); } catch { return false; } });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

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

  return <section className="rounded-xl border border-[#d4af37]/30 bg-[#1c1428] p-3 space-y-3" aria-label="Reading access">
    <h4 className="text-sm text-[#f2ca50]">Reading access · {connected ? 'Connected' : 'Not connected'}</h4>
    <p className="text-xs text-[#c4b9ce]">Your reading access belongs to your Natally account. Existing access and saved conversations stay available here.</p>
    <h5 className="text-sm text-[#f1e8d8]">Payment methods</h5>
    <PaymentMethods accountUid={accountUid}/>
    <button type="button" disabled={busy} onClick={refreshBilling} className="min-h-11 rounded-lg border border-[#d4af37]/50 px-3 py-2 text-xs text-[#f2ca50] disabled:opacity-40">{busy ? 'Checking access…' : 'Check existing access'}</button>
    {notice && <p role="status" className="text-xs text-[#f1e8d8]">{notice}</p>}
  </section>;
}
