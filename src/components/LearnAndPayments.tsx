import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './learn-and-payments.css';
import { PurchaseCTA } from './PurchaseAccess';

export interface LearnAndPaymentsProps { open: boolean; onClose: () => void }
type Section = 'start' | 'lessons' | 'payments';
const sections: Array<{ id: Section; label: string }> = [
  { id: 'start', label: 'Using Natally' }, { id: 'lessons', label: 'Free lessons' }, { id: 'payments', label: 'Payments' },
];
const Source = ({ href, children }: { href: string; children: ReactNode }) => <a href={href} target="_blank" rel="noopener noreferrer">{children} ↗</a>;

const lessons = [
  { id: 'two-skies', title: '1. Your birth chart and the sky now', paragraphs: [
    'A natal chart records the calculated sky for your birth details. A current observation records another instant. In Natally, gold NATAL labels identify birth positions; cyan NOW labels identify the observed sky. These are different layers even when the same planet appears in both.',
    'Try this: open Your chart, find the observation timestamp, then choose a current-to-natal relationship. When you replay a saved observation, its date matters: it is not automatically today’s sky.',
  ] },
  { id: 'planets-signs', title: '2. Planets and signs: a symbolic vocabulary', paragraphs: [
    'Astrological readings attach symbolic themes to planets. Mercury is often read through communication and thought; the Moon through feelings and habits. A sign describes a style of expression within that tradition. These interpretations are different from the measured planetary position.',
    'Try this: select Mercury and ask Natally to explain its placement in Plain English. Ask which part is calculated and which part is interpretation. One placement is a starting point for reflection, not a complete account of a person.',
  ] },
  { id: 'houses', title: '3. Houses: areas of life', paragraphs: [
    'The twelve houses organize a chart into areas of life. Astrologers commonly associate the fourth with home, the seventh with relationships, and the tenth with public life. House boundaries depend on birth details and the chosen house system; signs and houses are not interchangeable.',
    'Try this: ask about one house rather than the whole chart. If your birth time is unknown, tell Natally. A stand-in time does not establish exact houses or angles; explore interpretations with that limitation visible.',
  ] },
  { id: 'aspects', title: '4. Aspects: follow both ends of the line', paragraphs: [
    'An aspect describes angular separation: conjunction 0°, sextile 60°, square 90°, trine 120°, opposition 180°. The orb is the distance from the exact angle. Astrologers interpret these relationships in different ways; a square is not a prediction that something bad will happen.',
    'Try this: hover a connecting line, then select it. Follow both labelled endpoints. “Now Mercury square natal Moon” compares today’s Mercury with the birth Moon; a natal Mercury–Moon square compares two birth positions.',
  ] },
  { id: 'reflect', title: '5. Make the reading a conversation', paragraphs: [
    'Natally uses astrology as a symbolic framework for reflection. Calculated positions do not make a personal interpretation a scientifically established prediction. You can disagree, ask for another interpretation, or explain what does and does not fit your experience.',
    'Try this: use Insta-now horoscope for a short reflection, then ask one specific follow-up. Natally explains terminology, the tradition behind an interpretation, and why it matters to your question as she goes. Ask for more detail at any time.',
  ] },
];

export function LearnAndPayments({ open, onClose }: LearnAndPaymentsProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [section, setSection] = useState<Section>('start');
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) { setSection('start'); element.showModal(); }
    else if (!open && element.open) element.close();
  }, [open]);
  if (typeof document === 'undefined') return null;
  return createPortal(<dialog ref={dialog} className="natally-learn" aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) {
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
    } }}>
    <header className="natally-learn__header"><div><p className="natally-learn__eyebrow">A little cosmic company</p><h2 id={titleId}>A guide to your time with Natally</h2></div>
      <button type="button" onClick={onClose} autoFocus aria-label="Close help">Close ×</button>
    </header>
    <nav className="natally-learn__nav" aria-label="Guide sections">{sections.map(item => <button type="button" key={item.id} aria-pressed={section === item.id} onClick={() => setSection(item.id)}>{item.label}</button>)}</nav>
    <div className="natally-learn__body">
      {section === 'start' && <section aria-label="Using Natally">
        <h3>Make yourself at home in the atelier.</h3>
        <p>Meet Natally in her workshop, explore the objects on her shelves, and bring your chart into focus whenever you want a closer look. Your conversation stays alongside the room.</p>
        <p>Download buttons explain the purchase needed before releasing a file. Verified prepaid access skips that offer for the downloads it covers. Dismissing the offer keeps your reading and conversation in place.</p>
        <div className="natally-learn__notice"><strong>Purchasing is not available yet.</strong><p>The checkout and purchase verification service are not connected. There is no price to agree to or payment to make here yet. Development access is temporary and does not provide public free conversations. The static lessons below remain free.</p></div>
        <ol><li>Natally explains each chart component and relationship as it enters your conversation. Ask for a reminder, a different example or more technical detail whenever it helps.</li>
          <li>Use <strong>Insta-now horoscope</strong> for a quick reading based on a fresh observation. Ask Natally a follow-up, or select a planet or relationship and choose <strong>Discuss</strong>.</li>
          <li>Switch between the reading room and your chart. The smaller inset keeps the other view nearby; click it to bring it forward. Chart highlights follow the reading as Natally speaks.</li>
          <li>Replay a saved reading at its original observation time. Download controls check the purchase covering that file. New AI conversations use their own prepaid allowance.</li></ol>
        <PurchaseCTA kind="reading" sourceSection="guide-atelier" onOpen={onClose}>Buy my natal reading</PurchaseCTA>
        <button type="button" onClick={() => setSection('lessons')}>Begin the free lessons →</button>
      </section>}
      {section === 'lessons' && <section aria-label="Free astrology lessons">
        <h3>A little chart literacy, completely free</h3><p>Five small lessons to use alongside your own chart. No purchase unlock is needed.</p>
        {lessons.map(lesson => <details key={lesson.id} className="natally-learn__lesson"><summary>{lesson.title}</summary><article>{lesson.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</article></details>)}
        <PurchaseCTA kind="reading" sourceSection="guide-lessons" onOpen={onClose}>Buy a reading of my chart</PurchaseCTA>
        <p className="natally-learn__sources">Explore the traditions further: <Source href="https://www.astro.com/astrology/in_intro_e.htm">Astrodienst introduction</Source> · <Source href="https://astrology.org.uk/wordpress/wp-content/uploads/IntroducingAstrology.pdf">Faculty of Astrological Studies introduction</Source>.</p>
      </section>}
      {section === 'payments' && <section aria-label="Payments explained">
        <h3>What each payment option is for</h3>
        <div className="natally-learn__notice"><strong>No live checkout connected</strong><p>These explain the planned options. Natally currently has no confirmed checkout price, accepted-asset list, or connected purchase verification. No option below asks you to pay or connect a wallet.</p></div>
        <PurchaseCTA kind="reading" sourceSection="guide-reading-purchase" onOpen={onClose}>Buy my reading pack</PurchaseCTA>
        <details open><summary>Downloads and RevenueCat</summary><p>The planned download purchase is separate from conversational credits. RevenueCat can connect a product purchase to access rights, called entitlements. Natally still needs its configured products, price, checkout and verified access connected. A designed offer screen alone does not activate purchases.</p><p><Source href="https://www.revenuecat.com/docs/getting-started/entitlements">RevenueCat explains entitlements</Source></p></details>
        <PurchaseCTA kind="conversation" sourceSection="guide-conversation-purchase" onOpen={onClose}>Buy conversation credits</PurchaseCTA>
        <details><summary>$ROCHE: conversational credits</summary><p>$ROCHE is the planned shared credit for conversational use and optional atelier replacements. A credit purchase is different from buying a downloadable reading. Packs, conversion rates and spending rules are not available here yet; no balance or exchange rate is being promised.</p></details>
        <details><summary>Alby: a Lightning wallet connection, not your Natally login</summary><p>Alby Hub can connect a Bitcoin Lightning wallet to compatible apps through Nostr Wallet Connect. That wallet connection does not by itself sign you into Natally or prove that you own a paid download. Natally’s proposed Alby flow is per-turn payment; it is not connected here.</p><p>When available, a Natally quote should show what one payment covers before you approve it in your wallet. Do not paste wallet connection secrets into conversation.</p><p><Source href="https://github.com/getAlby/hub">Alby Hub documentation</Source></p></details>
        <details><summary>Blink point of sale: a Lightning invoice</summary><p>Blink’s browser point of sale creates invoices for receiving Bitcoin over Lightning. A merchant payment needs to be linked to your Natally order and confirmed before access can be granted. Natally has no connected Blink checkout here; paying an unrelated invoice would not unlock a reading.</p><p><Source href="https://faq.blink.sv/blink-payment-methods/lightning-address/what-is-the-cash-register-in-blink">Blink point-of-sale guide</Source></p></details>
        <details><summary>x402: which cryptocurrencies are accepted?</summary><p>x402 lets a service reply with payment requirements for a particular request. The service specifies the network, asset, amount and recipient it accepts. It does not mean every cryptocurrency or every network is accepted.</p><p>Natally’s accepted networks and assets are not configured, so there is no supported-coin list to publish yet. A future payment screen must name the exact asset and network before you approve it. Bitcoin Lightning, $ROCHE credits and x402 are not interchangeable payment labels.</p><p><Source href="https://github.com/x402-foundation/x402/blob/main/specs/x402-specification-v2.md">Official x402 specification</Source></p></details>
      </section>}
    </div>
  </dialog>, document.body);
}
