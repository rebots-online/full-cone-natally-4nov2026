import { useEffect, useRef, useState } from 'react';
import adapted from '../../LIBS/UI/FIGMA/three-screen-offers-20261027/adapted/paywall-three-screen.html?raw';
import type { PurchaseKind } from '../services/purchaseIntent';

export type OfferPrices = { reading: string | null; conversation: string | null };
type Props = {
  ownerUid: string;
  isCurrent: () => boolean;
  prices: OfferPrices;
  busy: boolean;
  message: string;
  initialScreen?: 1 | 2 | 3;
  onPurchase: (kind: PurchaseKind) => void;
  onRestore: () => void;
  onClose: () => void;
};

const source = adapted.replace(
  'src="/natally-paywall-art.webp"',
  'src="/paywall/natally-original.webp"',
);
const isKind = (value: unknown): value is PurchaseKind =>
  value === 'reading' || value === 'conversation';

/** Original Figma document; the host owns prices and every commercial action. */
export function FigmaPaywall(props: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const latest = useRef(props);
  latest.current = props;
  const [documentGeneration, setDocumentGeneration] = useState(0);
  const screenSent = useRef(-1);

  useEffect(() => {
    const win = frame.current?.contentWindow;
    const doc = frame.current?.contentDocument;
    if (!win || !doc) return;
    const purchase = (event: Event) => {
      const kind: unknown = (event as CustomEvent).detail?.kind;
      const current = latest.current;
      if (!isKind(kind) || current.busy || !current.isCurrent()) return;
      if (current.prices[kind] === null) return;
      current.onPurchase(kind);
    };
    const restore = () => {
      const current = latest.current;
      if (!current.busy && current.isCurrent()) current.onRestore();
    };
    const close = () => latest.current.onClose();
    // The original also emits on window.parent; listen on the child document only.
    doc.addEventListener('natally:offer:purchase', purchase);
    doc.addEventListener('natally:offer:restore', restore);
    doc.addEventListener('natally:offer:close', close);
    return () => {
      doc.removeEventListener('natally:offer:purchase', purchase);
      doc.removeEventListener('natally:offer:restore', restore);
      doc.removeEventListener('natally:offer:close', close);
    };
  }, [documentGeneration]);

  useEffect(() => {
    if (screenSent.current !== documentGeneration) {
      screenSent.current = documentGeneration;
      const win = frame.current?.contentWindow as (Window & { NatallyOffers?: { setState: (update: Record<string, unknown>) => void } }) | null;
      win?.NatallyOffers?.setState({
        prices: latest.current.prices,
        busy: latest.current.busy,
        message: latest.current.message,
        screen: latest.current.initialScreen ?? 1,
      });
      return;
    }
    const win = frame.current?.contentWindow as (Window & { NatallyOffers?: { setState: (update: Record<string, unknown>) => void } }) | null;
    win?.NatallyOffers?.setState({
      prices: props.prices,
      busy: props.busy,
      message: props.message,
    });
  }, [documentGeneration, props.prices, props.busy, props.message]);

  return <iframe ref={frame} title="Natally reading purchase options" className="natally-paywall-frame"
    srcDoc={source} onLoad={() => setDocumentGeneration(value => value + 1)} />;
}
