import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { buildIdentity, type BuildIdentity } from '../services/buildIdentity';
import './BuildStamp.css';
import { APP_NAME } from '../services/appIdentity';

export function BuildStamp({ identity = buildIdentity }: { identity?: BuildIdentity | null }) {
  const badge = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = badge.current;
    if (!element || typeof element.showPopover !== 'function') return;
    const showAboveDialog = () => {
      if (!element.isConnected) return;
      if (element.matches(':popover-open')) element.hidePopover();
      element.showPopover();
    };
    showAboveDialog();
    const observer = new MutationObserver(records => {
      if (records.some(record => record.target instanceof HTMLDialogElement)) showAboveDialog();
    });
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
    return () => {
      observer.disconnect();
      if (element.matches(':popover-open')) element.hidePopover();
    };
  }, [identity]);

  if (!identity) return null;
  return createPortal(
    <div ref={badge} popover="manual" className="natally-build-stamp"
      data-natally-version-badge aria-label={`${APP_NAME} version ${identity.version}`}>
      v{identity.version}
    </div>, document.body,
  );
}
