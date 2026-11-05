import { useId, useSyncExternalStore } from 'react';
import { loadReadingStyle, READING_STYLE_EVENT, READING_STYLE_OPTIONS, saveReadingStyle, type ReadingStyle } from '../services/readingStyle';

export interface ReadingStyleControlProps {
  accountUid?: string | null;
  initialStyle?: ReadingStyle;
}

function subscribe(callback: () => void) {
  window.addEventListener(READING_STYLE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(READING_STYLE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

export function ReadingStyleControl({ accountUid, initialStyle }: ReadingStyleControlProps) {
  const id = useId();
  const style = useSyncExternalStore(subscribe, () => loadReadingStyle(accountUid, initialStyle), () => initialStyle ?? 'plain');
  return <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-semibold">Reading language</label>
    <select id={id} value={style} disabled={!accountUid} aria-describedby={`${id}-hint`}
      className="w-full rounded-lg border border-white/20 bg-[#21182f] px-3 py-3 text-white"
      onChange={event => { if (accountUid) saveReadingStyle(accountUid, event.target.value as ReadingStyle); }}>
      {READING_STYLE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
    <p id={`${id}-hint`} className="text-xs leading-relaxed text-white/70">{READING_STYLE_OPTIONS.find(option => option.value === style)?.description} Applies to new readings and conversation on this device. Saved readings keep their original wording.</p>
  </div>;
}
