import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CircleUserRound } from 'lucide-react';
import swissPackage from 'swisseph-wasm/package.json';
import './AboutDialog.css';
import { EraseNatallyHistoryDialog } from './EraseNatallyHistoryDialog';

declare const __NATALLY_BUILD__: { version: string | null; revision: string | null; dirty: boolean; builtAt: string };
const source = 'https://github.com/rebots-online/natally-ai-studio';
const build = typeof __NATALLY_BUILD__ === 'undefined' ? null : __NATALLY_BUILD__;

export function AboutDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useId();
  useEffect(() => {
    if (!open || !dialog.current) return;
    const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const element = dialog.current;
    element.showModal();
    return () => {
      element.close();
      if (returnFocus?.isConnected) returnFocus.focus();
    };
  }, [open]);
  if (!open) return null;
  return createPortal(
    <dialog ref={dialog} className="natally-about" aria-labelledby={heading}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="natally-about__content">
        <button type="button" className="natally-about__close" onClick={onClose} autoFocus aria-label="Close About Natally">×</button>
        <img className="natally-about__portrait" src="/natally-mascot.webp" alt="" />
        <p className="natally-about__eyebrow">A little cosmic company</p>
        <h2 id={heading}>Natally</h2>
        <p className="natally-about__build">Copyright ©2026 Robin L. M. Cheung, MBA.</p>
        <p className="natally-about__version">GNU Affero General Public License v3.0 only</p>
        <p className="natally-about__build">You may redistribute and modify Natally under its licence. Provided without warranty; see the licence for details.</p>
        {build?.version && <p className="natally-about__version">v{build.version}</p>}
        {build?.revision && <p className="natally-about__build">Revision <code>{build.revision.slice(0, 12)}</code>{build.dirty ? ' · local changes' : ''}</p>}
        {build?.builtAt && <p className="natally-about__build">Built <time dateTime={build.builtAt}>{build.builtAt}</time></p>}
        <nav className="natally-about__links" aria-label="Natally source and licences">
          <a href="/terms.html" target="_blank" rel="noopener noreferrer">Terms of Service ↗</a>
          <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Privacy Policy ↗</a>
          <a href="/notices/AGPL-3.0.txt" target="_blank" rel="noopener noreferrer">Natally licence · AGPL-3.0-only ↗</a>
          <a href={source} target="_blank" rel="noopener noreferrer">GitHub source ↗</a>
          {build?.revision && <a href={`${source}/tree/${build.revision}`} target="_blank" rel="noopener noreferrer">
            {build.dirty ? 'Source revision before local changes' : 'Source for this build'} ↗
          </a>}
          <a href="/notices/THIRD-PARTY-NOTICES.txt" target="_blank" rel="noopener noreferrer">Third-party notices and licence texts ↗</a>
        </nav>
        <section className="natally-about__software" aria-label="Software acknowledgements">
          <h3>Calculations and type</h3>
          <p>Swiss Ephemeris · Copyright © 1997–2021 Astrodienst AG, Switzerland.</p>
          <p>Swiss Ephemeris is available under the GNU Affero General Public License or the Swiss Ephemeris Professional License. Its notices are retained here.</p>
          <p><a href="/notices/Swiss-Ephemeris-LICENSE.txt" target="_blank" rel="noopener noreferrer">Swiss Ephemeris terms</a> · <a href="https://github.com/aloistr/swisseph" target="_blank" rel="noopener noreferrer">Upstream source</a></p>
          <p>swisseph-wasm {swissPackage.version} · Copyright © 2024 prolaxu · {swissPackage.license}.</p>
          <p><a href="/notices/swisseph-wasm-LICENSE.txt" target="_blank" rel="noopener noreferrer">Wrapper notice</a> · <a href="https://github.com/prolaxu/swisseph-wasm" target="_blank" rel="noopener noreferrer">Wrapper source</a></p>
          <p>Playfair Display · Copyright © 2017 The Playfair Display Project Authors · SIL Open Font License 1.1.</p>
          <p><a href="/fonts/OFL-PlayfairDisplay.txt" target="_blank" rel="noopener noreferrer">Font licence</a></p>
        </section>
      </div>
    </dialog>, document.body,
  );
}

/** Adds About/source to the existing account entry without creating a menu bar. */
export function ProfileAbout({ onAccount, accountLabel = 'Account', accountUid, onReadings, onHelp }: { onAccount: () => void; accountLabel?: string; accountUid?: string; onReadings?: () => void; onHelp?: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [about, setAbout] = useState(false);
  const [eraseHistory, setEraseHistory] = useState(false);
  const profile = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const controls = useId();
  useEffect(() => {
    if (!expanded) return;
    const outside = (event: PointerEvent) => { if (!profile.current?.contains(event.target as Node)) setExpanded(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [expanded]);
  const closeAbout = () => { setAbout(false); requestAnimationFrame(() => button.current?.focus()); };
  return <div ref={profile} className="natally-profile" onKeyDown={event => {
    if (event.key === 'Escape' && expanded) { event.stopPropagation(); setExpanded(false); button.current?.focus(); }
  }}>
    <button type="button" ref={button} className="natally-profile__button" aria-expanded={expanded} aria-controls={controls} onClick={() => setExpanded(value => !value)}><CircleUserRound size={24} aria-hidden="true" /><span>Profile</span></button>
    {expanded && <div className="natally-profile__panel" id={controls}>
      <button type="button" onClick={() => { setExpanded(false); onAccount(); }}>{accountLabel}</button>
      {onReadings && <button type="button" onClick={() => { setExpanded(false); onReadings(); }}>Readings</button>}
      {onHelp && <button type="button" onClick={() => { setExpanded(false); onHelp(); }}>Help</button>}
      <button type="button" onClick={() => { setExpanded(false); setAbout(true); }}>About Natally</button>
      {accountUid && <button type="button" onClick={() => { setExpanded(false); setEraseHistory(true); }}>Erase all Natally history…</button>}
      <a href={source} target="_blank" rel="noopener noreferrer">GitHub source ↗</a>
    </div>}
    <AboutDialog open={about} onClose={closeAbout} />
    {accountUid && <EraseNatallyHistoryDialog accountUid={accountUid} open={eraseHistory} onClose={() => { setEraseHistory(false); requestAnimationFrame(() => button.current?.focus()); }} />}
  </div>;
}
