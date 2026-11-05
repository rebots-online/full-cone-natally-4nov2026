export type ReadingStyle = 'plain' | 'merlin';

export const READING_STYLE_OPTIONS = [
  { value: 'plain', label: 'Plain English', description: 'No astrology knowledge needed. Natally explains the planets, houses and connections as she goes.' },
  { value: 'merlin', label: 'Full Merlin', description: 'Speak astrology with me: precise aspects, houses, transits and chart details, with less introductory explanation.' },
] as const;

export const READING_STYLE_EVENT = 'natally-reading-style-change';
const storageKey = (uid: string) => `natally_reading_style_v1:${encodeURIComponent(uid)}`;
const sessionPreferences = new Map<string, ReadingStyle>();
export const normalizeReadingStyle = (value: unknown): ReadingStyle => value === 'merlin' ? 'merlin' : 'plain';

export function loadReadingStyle(accountUid?: string | null, initialStyle?: ReadingStyle): ReadingStyle {
  if (!accountUid) return normalizeReadingStyle(initialStyle);
  const sessionStyle = sessionPreferences.get(accountUid);
  if (sessionStyle) return sessionStyle;
  try {
    const saved = localStorage.getItem(storageKey(accountUid));
    if (saved === 'plain' || saved === 'merlin') return saved;
    return normalizeReadingStyle(initialStyle);
  } catch { /* A blocked store must not prevent reading. */ }
  return sessionPreferences.get(accountUid) ?? normalizeReadingStyle(initialStyle);
}

export function saveReadingStyle(accountUid: string, style: ReadingStyle): void {
  if (!accountUid) return;
  const normalized = normalizeReadingStyle(style);
  try {
    localStorage.setItem(storageKey(accountUid), normalized);
    sessionPreferences.delete(accountUid);
  } catch { sessionPreferences.set(accountUid, normalized); }
  window.dispatchEvent(new Event(READING_STYLE_EVENT));
}

export function clearReadingStyle(accountUid?: string | null): void {
  if (!accountUid) return;
  sessionPreferences.delete(accountUid);
  try { localStorage.removeItem(storageKey(accountUid)); } catch { /* Storage may be unavailable. */ }
  window.dispatchEvent(new Event(READING_STYLE_EVENT));
}

export function readingStylePrompt(accountUid?: string | null, initialStyle?: ReadingStyle): string {
  const style = loadReadingStyle(accountUid, initialStyle);
  return `READING LANGUAGE: ${style === 'merlin'
    ? 'Full Merlin. Use fluent, precise astrological terminology and relevant calculated placements, houses, aspect types and orbs. Skip routine beginner definitions unless asked; remain conversational and intelligible, with room for her digressions and personality.'
    : 'Plain English. Assume no astrology knowledge. Lead with everyday meaning and briefly explain each planet, house, aspect or transit term when introduced in this answer. For example, explain a square as a tense connection, a house as an area of life, and a transit as a current planet interacting with the birth chart. Avoid unexplained jargon and patronizing language.'}
Both styles use the SOUL's same rambling, oversharing Gen-Z personality and contemporary aphorisms. Full Merlin changes technical depth, not personality or warmth. Give concrete everyday examples and personal tangents, then circle back to the reading. Do not imitate older formal assistant messages or speak of the user as a native or case study. No formal observation-metadata preamble or compulsory therapeutic closing question.
Both styles use the same calculated facts, uncertainty qualifiers and unknown-birth-time limitations. Distinguish the current sky from natal placements. Keep exact inventory names in chart/presentation cues and highlight both endpoints and the relationship when discussing an aspect. Style changes language, never the data, confidence, or determinism of a claim. Apply this preference to new responses, not the wording of saved readings.`;
}
