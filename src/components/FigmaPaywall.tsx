import { APP_NAME } from '../services/appIdentity';
import { useEffect, useRef, useState } from 'react';
import adapted from '../../LIBS/UI/FIGMA/three-screen-offers-20261027/adapted/paywall-three-screen.html?raw';
import type { PurchaseKind } from '../services/purchaseIntent';

export type OfferPrices = { reading: string | null; conversation: string | null };
export type OfferTerms = {
  productType: 'subscription' | 'one_time';
  billingPeriod: string | null;
  productTitle: string;
};
export type OfferTermsByKind = { reading: OfferTerms | null; conversation: OfferTerms | null };
export type OfferOption = {
  offerId: string;
  formattedPrice: string;
  productTitle: string;
  productType: 'subscription' | 'one_time';
  billingPeriod: string | null;
};
type Props = {
  ownerUid: string;
  isCurrent: () => boolean;
  prices: OfferPrices;
  terms: OfferTermsByKind;
  options: OfferOption[];
  selectedOfferId: string | null;
  busy: boolean;
  message: string;
  initialScreen?: 1 | 2 | 3;
  onPurchase: (kind: PurchaseKind, offerId?: string) => void;
  onSelect: (offerId: string) => void;
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
    const selectedOption = () => latest.current.options.find(option => option.offerId === latest.current.selectedOfferId) ?? null;
    const purchase = (event: Event) => {
      const detail: unknown = (event as CustomEvent).detail;
      const kind: unknown = (detail as { kind?: unknown })?.kind;
      const current = latest.current;
      if (!isKind(kind) || current.busy || !current.isCurrent()) return;
      if (current.prices[kind] === null) return;
      const terms = current.terms[kind];
      if (!terms) return;
      if (terms.productType === 'subscription' && !terms.billingPeriod) return;
      if (kind === 'reading') {
        current.onPurchase('reading');
        return;
      }
      const offerId: unknown = (detail as { offerId?: unknown })?.offerId;
      if (typeof offerId !== 'string' || offerId !== current.selectedOfferId || !selectedOption()) return;
      current.onPurchase('conversation', offerId);
    };
    const select = (event: Event) => {
      const offerId: unknown = (event as CustomEvent).detail?.offerId;
      const current = latest.current;
      if (typeof offerId !== 'string' || current.busy || !current.isCurrent()) return;
      if (!current.options.some(option => option.offerId === offerId)) return;
      current.onSelect(offerId);
    };
    const restore = () => {
      const current = latest.current;
      if (!current.busy && current.isCurrent()) current.onRestore();
    };
    const close = () => latest.current.onClose();
    // The original also emits on window.parent; listen on the child document only.
    doc.addEventListener('natally:offer:purchase', purchase);
    doc.addEventListener('natally:offer:select', select);
    doc.addEventListener('natally:offer:restore', restore);
    doc.addEventListener('natally:offer:close', close);
    return () => {
      doc.removeEventListener('natally:offer:purchase', purchase);
      doc.removeEventListener('natally:offer:select', select);
      doc.removeEventListener('natally:offer:restore', restore);
      doc.removeEventListener('natally:offer:close', close);
    };
  }, [documentGeneration]);

  useEffect(() => {
    const send = (update: Record<string, unknown>) => {
      const win = frame.current?.contentWindow as (Window & { NatallyOffers?: { setState: (update: Record<string, unknown>) => void } }) | null;
      win?.NatallyOffers?.setState(update);
    };
    if (screenSent.current !== documentGeneration) {
      screenSent.current = documentGeneration;
      send({
        prices: latest.current.prices,
        terms: latest.current.terms,
        options: latest.current.options,
        selectedOfferId: latest.current.selectedOfferId,
        busy: latest.current.busy,
        message: latest.current.message,
        screen: latest.current.initialScreen ?? 1,
      });
      return;
    }
    send({
      prices: props.prices,
      terms: props.terms,
      options: props.options,
      selectedOfferId: props.selectedOfferId,
      busy: props.busy,
      message: props.message,
    });
  }, [documentGeneration, props.prices, props.terms, props.options, props.selectedOfferId, props.busy, props.message]);

  return <iframe ref={frame} title={`${APP_NAME} reading purchase options`} className="natally-paywall-frame"
    srcDoc={source} onLoad={() => setDocumentGeneration(value => value + 1)} />;
}
