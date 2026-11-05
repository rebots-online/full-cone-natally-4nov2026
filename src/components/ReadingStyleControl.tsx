import type { ReadingStyle } from '../services/readingStyle';
export interface ReadingStyleControlProps { accountUid?: string | null; initialStyle?: ReadingStyle }
export function ReadingStyleControl(_props: ReadingStyleControlProps) {
  return <div className="space-y-2">
    <h4 className="text-sm font-semibold">Astrology, explained as we go</h4>
    <p className="text-xs leading-relaxed text-white/70">Natally explains what each planet, house and relationship means, where its interpretation comes from, and why it matters to your question. Ask for more detail whenever you like.</p>
    <p className="text-xs leading-relaxed text-white/70">This standard applies to every new reading. Saved readings keep their original wording.</p>
  </div>;
}
