import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { installInferenceKey, loadInferenceKey, loadInferenceKeySource, removeInferenceKey } from '../services/inferenceAccess';
import { reconcileBillingAccess, type BillingAccess } from '../services/billingAccess';

export function InferenceAccessSettings({ accountUid }: { accountUid: string }) {
  const [key, setKey] = useState('');
  const [connected, setConnected] = useState(() => { try { return !!loadInferenceKey(accountUid); } catch { return false; } });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [billingState, setBillingState] = useState<BillingAccess | null>(null);

  async function refreshBilling() {
    const owner = auth.currentUser;
    if (!owner || owner.uid !== accountUid || busy) return;
    setBusy(true); setNotice('Connecting your reading access…');
    try {
      const access = await reconcileBillingAccess(accountUid, true, () => auth.currentUser === owner);
      if (auth.currentUser !== owner) return;
      setBillingState(access); setConnected(!!loadInferenceKey(accountUid)); setNotice(access.message);
    } catch (error) {
      if (auth.currentUser === owner) setNotice(error instanceof Error ? error.message : 'Purchased access could not be confirmed. Please retry.');
    } finally { setBusy(false); }
  }

  async function connect(event: React.FormEvent) {
    event.preventDefault();
    const owner = auth.currentUser;
    if (!owner || owner.uid !== accountUid || busy) return;
    setBusy(true); setNotice('Connecting to OpenRouter…');
    try {
      await installInferenceKey(accountUid, key, () => auth.currentUser === owner);
      if (auth.currentUser !== owner) return;
      setKey(''); setConnected(true);
      setNotice('Connected. Return to your reading, or retry the question waiting there.');
    } catch (error) {
      if (auth.currentUser === owner) setNotice(error instanceof Error ? error.message : 'Connection failed. Please retry.');
    } finally { setBusy(false); }
  }

  function disconnect() {
    if (auth.currentUser?.uid !== accountUid || busy) return;
    try {
      removeInferenceKey(accountUid); setKey(''); setConnected(false);
      setNotice('Disconnected. Your conversation and saved readings are still here.');
    } catch { setNotice('The browser could not remove reading access. Please retry.'); }
  }

  return <section className="rounded-xl border border-[#d4af37]/30 bg-[#1c1428] p-3 space-y-3" aria-label="Reading access">
    <h4 className="text-sm text-[#f2ca50]">Reading access · {connected ? 'Connected' : 'Not connected'}</h4>
    <p className="text-xs text-[#c4b9ce]">Reading access is checked for your account when you ask Natally. Public conversations require prepaid access; checkout is not connected yet. Authorized development access is temporary. A personal provider key below uses that provider account's allowance.</p>
    {connected && loadInferenceKeySource(accountUid) === 'development' && <p className="text-xs text-[#f2ca50]">Temporary development access · your personal key is supplied automatically for your account. This is separate from a purchase.</p>}
    <form onSubmit={connect} className="space-y-2">
      <label className="block text-xs text-[#f1e8d8]">{connected ? 'Replace OpenRouter user key' : 'OpenRouter user key'}
        <input type="password" autoComplete="off" spellCheck={false} value={key} disabled={busy} onChange={event => setKey(event.target.value)} className="mt-1 w-full rounded-lg border border-[#544363] bg-[#120d1b] p-2 text-sm" placeholder="sk-or-v1-…" />
      </label>
      <div className="flex gap-2">
        <button type="submit" disabled={busy || !key.trim()} className="rounded-lg border border-[#d4af37]/50 px-3 py-2 text-xs text-[#f2ca50] disabled:opacity-40">{busy ? 'Connecting…' : 'Connect reading access'}</button>
        {connected && <button type="button" disabled={busy} onClick={disconnect} className="rounded-lg border border-[#544363] px-3 py-2 text-xs">Disconnect</button>}
      </div>
    </form>
    <button type="button" disabled={busy} onClick={refreshBilling} className="rounded-lg border border-[#d4af37]/50 px-3 py-2 text-xs text-[#f2ca50] disabled:opacity-40">Refresh reading access</button>
    {billingState?.state === 'ready' && billingState.source === 'managed' && <p className="text-xs text-[#c4b9ce]">Purchased inference allowance: ${billingState.limitUsd?.toFixed(2)} total · ${Math.max(0, (billingState.limitUsd ?? 0) - (billingState.usageUsd ?? 0)).toFixed(2)} remaining when checked.</p>}
    {notice && <p role="status" className="text-xs text-[#f1e8d8]">{notice}</p>}
  </section>;
}
