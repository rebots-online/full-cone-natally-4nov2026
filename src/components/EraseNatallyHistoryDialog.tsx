import { APP_NAME } from '../services/appIdentity';
import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { auth } from '../services/firebase';
import { eraseWholeNatallyHistory } from '../services/natallyHistory';

export function EraseNatallyHistoryDialog({ accountUid, open, onClose }: { accountUid: string; open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);
  const currentAccount = useRef(accountUid); currentAccount.current = accountUid;
  const title = useId();
  useEffect(() => {
    if (!open || !dialog.current) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setConfirmation(''); setMessage(null); setComplete(false);
    dialog.current.showModal();
    return () => { dialog.current?.close(); if (previous?.isConnected) previous.focus(); };
  }, [open, accountUid]);
  const erase = async () => {
    if (busy || confirmation !== 'ERASE' || auth.currentUser?.uid !== accountUid) return;
    const owner = accountUid;
    setBusy(true); setMessage(null);
    try {
      await eraseWholeNatallyHistory(owner, () => auth.currentUser?.uid === owner && currentAccount.current === owner);
      if (currentAccount.current === owner) { setComplete(true); setMessage(`${APP_NAME} history on this device was erased. Start onboarding again for a new full reading. Your account and voice settings remain.`); }
    } catch (error) {
      if (currentAccount.current === owner) setMessage(error instanceof Error ? error.message : 'History could not be erased.');
    } finally { setBusy(false); }
  };
  if (!open) return null;
  return createPortal(<dialog ref={dialog} className="natally-about" aria-labelledby={title} onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}>
    <div className="natally-about__content" style={{ textAlign: 'left' }}>
      <h2 id={title} style={{ fontSize: '1.5rem' }}>Erase all {APP_NAME} history on this device?</h2>
      <p className="mt-4 text-sm leading-relaxed">For this signed-in account, this erases conversations, disclosed memories, Natally’s evolving fictional memories, saved reading audio, and the atelier’s damage and object placement history together.</p>
      <p className="mt-3 text-sm leading-relaxed">You will start onboarding again, then Natally will give you a new full reading. Your account, voice settings and exported files remain. Your old cloud birth profile will not skip onboarding. History on other devices is not erased. This action cannot be undone.</p>
      {!complete && <form className="mt-4" onSubmit={event => { event.preventDefault(); void erase(); }}>
        <label className="block text-sm" htmlFor={`${title}-confirm`}>Type ERASE to confirm the whole-history erasure</label>
        <input id={`${title}-confirm`} autoFocus autoComplete="off" spellCheck={false} disabled={busy} value={confirmation} onChange={event => setConfirmation(event.target.value)} className="mt-2 w-full rounded border border-white/30 bg-black/30 p-3 text-white" />
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="submit" disabled={busy || confirmation !== 'ERASE'} className="rounded border border-red-300/50 bg-red-900/30 px-4 py-3 text-sm disabled:opacity-40">{busy ? 'Erasing history…' : `Erase all ${APP_NAME} history on this device`}</button>
          <button type="button" disabled={busy} className="rounded border border-white/30 px-4 py-3 text-sm" onClick={onClose}>Cancel</button>
        </div>
      </form>}
      {message && <p role="status" className="mt-4 text-sm leading-relaxed text-amber-100">{message}</p>}
      {complete && <button type="button" className="mt-4 rounded border border-white/30 px-4 py-3 text-sm" onClick={onClose}>Return to {APP_NAME}</button>}
    </div>
  </dialog>, document.body);
}
