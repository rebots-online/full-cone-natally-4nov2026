import type { NatalChartResult } from './ephemeris';
import { chartFocusKeyMatches } from './chartTargets';
import { getAuthoredChartExplanation } from './authoredChartExplanations';
import { loadAccountValue, saveAccountValue } from './accountStorage';
import { loadVoiceSettings } from './voiceService';
import { auth, db } from './firebase';
import { doc, runTransaction, getDocFromServer } from 'firebase/firestore';
import { restoreCheckoutCustomer } from './revenueCatCheckout';
import type { VoiceSettings } from './voiceService';
import type { ChartCue } from './natallyChat';
import type { PresentationCue } from './presentation';

/** Authored public offer sentence; stripped from chapter text by exact string only. */
export const AUTHORED_OFFER_SENTENCE = 'If you would like, we can keep exploring it together in a live conversation, or I can weave it into a personal reading you can keep.';

const HISTORY_KEY = 'astrosphere_natally_chat_history_v3';
const MIN_RETENTION_DAYS = 365;
const MAX_MESSAGES = 200;
const MAX_MESSAGE_CHARS = 50000;
const MAX_CHAPTERS = 60;
const MAX_CHAPTER_CHARS = 60000;
const MAX_PAYLOAD_BYTES = 850000;
const READING_PRODUCT_ID = 'natally_reading_test_v3';

/** Structurally compatible subset of PersistentChatMessage; personal text preserved exactly. */
export type SouvenirMessage = {
  id: string;
  sender: 'user' | 'natally';
  text: string;
  timestamp: string;
  createdAt?: string;
  category?: 'lore' | 'reading' | 'chat' | 'horoscope' | 'synastry';
  model?: string;
  chartCues?: ChartCue[];
  presentationCues?: PresentationCue[];
  presentationVersion?: 1;
  chartFocusKey?: string;
  observationSnapshot?: NatalChartResult['currentSky'];
};

export type SouvenirChapter = { title: string; text: string; targets: string[] };

export type SouvenirSnapshot = {
  schemaVersion: 1;
  id: string;
  accountUid: string;
  createdAt: string;
  retainUntil: string;
  chart: NatalChartResult;
  messages: SouvenirMessage[];
  voiceSettings: VoiceSettings;
  chapters: SouvenirChapter[];
};

function stripOffer(text: string): string {
  return text
    .split(AUTHORED_OFFER_SENTENCE).join(' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function isCompletedRealMessage(message: unknown): message is PersistentLike {
  const m = message as PersistentLike | null;
  return !!m && typeof m === 'object' &&
    typeof m.id === 'string' && m.id !== 'init-1' &&
    (m.sender === 'user' || m.sender === 'natally') &&
    typeof m.text === 'string' &&
    !m.streamState &&
    !m.authoredEducation;
}

type PersistentLike = {
  id: string;
  sender: 'user' | 'natally';
  text: string;
  timestamp?: string;
  createdAt?: string;
  category?: SouvenirMessage['category'];
  model?: string;
  chartCues?: ChartCue[];
  presentationCues?: PresentationCue[];
  presentationVersion?: 1;
  chartFocusKey?: string;
  observationSnapshot?: NatalChartResult['currentSky'];
  streamState?: 'streaming' | 'interrupted';
  authoredEducation?: boolean;
};

function toSouvenirMessage(message: PersistentLike): SouvenirMessage {
  return {
    id: message.id,
    sender: message.sender,
    text: message.text,
    timestamp: typeof message.timestamp === 'string' ? message.timestamp : '',
    ...(message.createdAt !== undefined ? { createdAt: message.createdAt } : {}),
    ...(message.category !== undefined ? { category: message.category } : {}),
    ...(message.model !== undefined ? { model: message.model } : {}),
    ...(message.chartCues !== undefined ? { chartCues: message.chartCues } : {}),
    ...(message.presentationCues !== undefined ? { presentationCues: message.presentationCues } : {}),
    ...(message.presentationVersion !== undefined ? { presentationVersion: message.presentationVersion } : {}),
    ...(message.chartFocusKey !== undefined ? { chartFocusKey: message.chartFocusKey } : {}),
    ...(message.observationSnapshot !== undefined ? { observationSnapshot: message.observationSnapshot } : {}),
  };
}

function matchesChart(message: PersistentLike, chart: NatalChartResult): boolean {
  if (!message.chartFocusKey) return false;
  return chartFocusKeyMatches(message.chartFocusKey, chart);
}

function buildChapters(chart: NatalChartResult): SouvenirChapter[] {
  const chapters: SouvenirChapter[] = [];
  const seen = new Set<string>();
  if (chapters.length > MAX_CHAPTERS) {
    throw new Error('This chart produces more chapters than a keepsake can hold.');
  }
  const push = (title: string, text: string, targets: string[]) => {
    const clean = stripOffer(text);
    if (!clean || seen.has(title)) return;
    if (chapters.length >= MAX_CHAPTERS) {
      throw new Error('This chart produces more chapters than a keepsake can hold.');
    }
    seen.add(title);
    chapters.push({ title, text: clean, targets });
  };
  const houseKnown = !chart.input.birthTimeUnknown && chart.houseCusps.length > 0;
  for (const body of chart.natalBodies) {
    const lesson = getAuthoredChartExplanation(chart, body.name);
    const resolvedTargets = [body.name];
    if (body.signName) resolvedTargets.push(body.signName);
    if (houseKnown && body.house >= 1 && body.house <= 12) resolvedTargets.push('House ' + body.house);
    for (const aspect of chart.aspectChords) {
      if (aspect.from === body.name || aspect.to === body.name) resolvedTargets.push(aspect.name);
    }
    const parts: string[] = [];
    parts.push(`${body.name} stands at ${body.fullDegText}${body.isRetrograde ? ', retrograde' : ''}`);
    if (houseKnown && body.house >= 1 && body.house <= 12) {
      parts.push(`in house ${body.house}`);
    } else if (houseKnown) {
      parts.push('outside the twelve houses');
    } else {
      parts.push('with house position unknown (birth time unknown)');
    }
    parts.push('.');
    let text = parts.join(' ') + '\n\n' + lesson.text;
    if (body.signName) {
      const signLesson = getAuthoredChartExplanation(chart, body.signName);
      if (signLesson?.text) text += '\n\n' + signLesson.text;
    }
    if (houseKnown && body.house >= 1 && body.house <= 12) {
      const houseLesson = getAuthoredChartExplanation(chart, 'House ' + body.house);
      if (houseLesson?.text) text += '\n\n' + houseLesson.text;
    }
    for (const aspect of chart.aspectChords) {
      if (aspect.from !== body.name && aspect.to !== body.name) continue;
      const aspectLesson = getAuthoredChartExplanation(chart, aspect.name);
      if (aspectLesson?.text) {
        text += '\n\n' + `${aspect.from} ${aspect.name.toLowerCase()} ${aspect.to}: ` + aspectLesson.text;
      }
    }
    push(body.name, text, resolvedTargets);
  }
  return chapters;
}

/**
 * Build the immutable souvenir content from the account's actual completed
 * conversation and the calculated chart. No fabricated chats, no synthetic
 * reading: rejects when no actual matching Natally reading exists.
 */
export function buildSouvenirContent(chart: NatalChartResult, accountUid: string) {
  if (!accountUid?.trim()) throw new Error('Sign in to create your souvenir.');
  const history = loadAccountValue<unknown[]>(HISTORY_KEY, accountUid, []);
  if (!Array.isArray(history)) throw new Error('Your conversation history could not be read. Reload and try again.');
  const completed = history.filter(isCompletedRealMessage);
  const keep = new Set<string>();
  for (let i = 0; i < completed.length; i++) {
    const message = completed[i];
    if (message.sender !== 'natally' || !message.category || !['reading', 'chat', 'horoscope', 'synastry'].includes(message.category) || !matchesChart(message, chart)) continue;
    keep.add(message.id);
    for (let j = i - 1; j >= 0; j--) {
      const prior = completed[j];
      if (prior.sender === 'user') {
        if (!prior.chartFocusKey || matchesChart(prior, chart)) keep.add(prior.id);
        break;
      }
      if (prior.sender === 'natally') break;
    }
  }
  const messages = completed.filter(message => keep.has(message.id)).map(toSouvenirMessage);
  if (!messages.some(message => message.sender === 'natally' && message.category === 'reading')) {
    throw new Error('No completed Natally reading was found for this chart. Finish a reading first, then create your souvenir.');
  }
  if (messages.length > MAX_MESSAGES) {
    throw new Error('This conversation has more than ' + MAX_MESSAGES + ' saved messages, which is too long for a keepsake. Start a fresh reading to create one.');
  }
  for (const message of messages) {
    if (message.text.length > MAX_MESSAGE_CHARS) {
      throw new Error('One saved message exceeds ' + MAX_MESSAGE_CHARS + ' characters and cannot be preserved exactly in a keepsake.');
    }
  }
  const voiceSettings = loadVoiceSettings();
  validateVoiceSettings(voiceSettings);
  return {
    schemaVersion: 1 as const,
    chart: structuredClone(chart),
    messages,
    voiceSettings,
    chapters: buildChapters(chart),
  };
}

const ID_PATTERN = /^[a-f0-9]{64}$/;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function validateChartShape(chart: NatalChartResult): void {
  if (!chart || typeof chart !== 'object' || !chart.input || typeof chart.input !== 'object' ||
      !Array.isArray(chart.natalBodies) || chart.natalBodies.length === 0 ||
      !Array.isArray(chart.houseCusps) || !Array.isArray(chart.aspectChords)) {
    throw new Error('The souvenir chart record is invalid.');
  }
  const input = chart.input;
  if (typeof input.name !== 'string' || typeof input.birthDate !== 'string' ||
      typeof input.birthTime !== 'string' || typeof input.placeName !== 'string' ||
      !isFiniteNumber(input.latitude) || !isFiniteNumber(input.longitude) ||
      !isFiniteNumber(input.timezoneOffset)) {
    throw new Error('The souvenir chart record is invalid.');
  }
  for (const key of ['julianDayUT', 'siderealTimeHours', 'ascLon', 'mcLon', 'dscLon', 'icLon'] as const) {
    if (!isFiniteNumber(chart[key])) throw new Error('The souvenir chart record is invalid.');
  }
  for (const key of ['ascFormatted', 'mcFormatted', 'sunFormatted', 'moonFormatted', 'engineVersion'] as const) {
    if (typeof chart[key] !== 'string') {
      throw new Error('The souvenir chart record is invalid.');
    }
  }
  for (const body of chart.natalBodies) {
    if (!body || typeof body.name !== 'string' || !body.name ||
        !isFiniteNumber(body.lon) || typeof body.fullDegText !== 'string' ||
        typeof body.isRetrograde !== 'boolean') {
      throw new Error('The souvenir chart record is invalid.');
    }
  }
  if (chart.houseCusps.length > 0) {
    for (const cusp of chart.houseCusps) {
      if (!cusp || typeof cusp !== 'object' ||
          !isFiniteNumber(cusp.num) || cusp.num < 1 || cusp.num > 12 ||
          !isFiniteNumber(cusp.lon)) {
        throw new Error('The souvenir chart record is invalid.');
      }
    }
  }
  for (const aspect of chart.aspectChords) {
    if (!aspect || typeof aspect.from !== 'string' || typeof aspect.to !== 'string' ||
        typeof aspect.name !== 'string') {
      throw new Error('The souvenir chart record is invalid.');
    }
  }
}

function validateVoiceSettings(settings: VoiceSettings): void {
  if (!settings || typeof settings !== 'object' || Object.keys(settings).length === 0 ||
      settings.ttsModel !== 'supertonic-onnx' || typeof settings.aiVoiceName !== 'string' ||
      !settings.aiVoiceName ||
      !isFiniteNumber(settings.rate) || !isFiniteNumber(settings.pitch)) {
    throw new Error('The souvenir voice record is invalid.');
  }
}

function validateSnapshotShape(value: unknown, accountUid: string, id?: string): SouvenirSnapshot {
  const snapshot = value as SouvenirSnapshot | null;
  if (!snapshot || typeof snapshot !== 'object' || snapshot.schemaVersion !== 1 ||
      typeof snapshot.id !== 'string' || !ID_PATTERN.test(snapshot.id) ||
      (id !== undefined && snapshot.id !== id) ||
      snapshot.accountUid !== accountUid ||
      typeof snapshot.createdAt !== 'string' || typeof snapshot.retainUntil !== 'string' ||
      !snapshot.chart || !Array.isArray(snapshot.chart.natalBodies) ||
      !Array.isArray(snapshot.chart.houseCusps) || !Array.isArray(snapshot.chart.aspectChords) ||
      !Array.isArray(snapshot.messages) || snapshot.messages.length > MAX_MESSAGES ||
      !Array.isArray(snapshot.chapters) || snapshot.chapters.length > MAX_CHAPTERS) {
    throw new Error('The souvenir record is invalid or belongs to a different account.');
  }
  validateChartShape(snapshot.chart);
  validateVoiceSettings(snapshot.voiceSettings);
  const createdAt = Date.parse(snapshot.createdAt);
  const retainUntil = Date.parse(snapshot.retainUntil);
  if (!Number.isFinite(createdAt) || !Number.isFinite(retainUntil) ||
      retainUntil < createdAt + MIN_RETENTION_DAYS * 86400000) {
    throw new Error('The souvenir retention metadata is invalid.');
  }
  for (const message of snapshot.messages) {
    if (!message || typeof message.id !== 'string' || (message.sender !== 'user' && message.sender !== 'natally') ||
        typeof message.text !== 'string' || message.text.length > MAX_MESSAGE_CHARS) {
      throw new Error('The souvenir conversation record is invalid.');
    }
  }
  for (const chapter of snapshot.chapters) {
    if (!chapter || typeof chapter.title !== 'string' || typeof chapter.text !== 'string' ||
        chapter.text.length > MAX_CHAPTER_CHARS || !Array.isArray(chapter.targets)) {
      throw new Error('The souvenir chapter record is invalid.');
    }
  }
  return snapshot;
}

function souvenirDoc(uid: string, id: string) {
  return doc(db, 'users', uid, 'charts', 'souvenir-' + id);
}

async function hashContent(accountUid: string, contentJson: string): Promise<string> {
  const data = new TextEncoder().encode(accountUid + contentJson);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hasActiveEntitlements(customerInfo: unknown): boolean {
  const info = customerInfo as { entitlements?: { active?: Record<string, { isActive?: boolean; productIdentifier?: string }> } } | null;
  const active = info?.entitlements?.active;
  if (!active) return false;
  const reading = active['natally_reading'];
  const downloads = active['natally_downloads'];
  return !!reading?.isActive && reading.productIdentifier === READING_PRODUCT_ID && !!downloads?.isActive;
}

/** Create a frozen souvenir for this chart on the account's behalf. */
export async function createSouvenir(chart: NatalChartResult): Promise<SouvenirSnapshot> {
  await auth.authStateReady();
  const owner = auth.currentUser;
  if (!owner) throw new Error('Sign in to create your souvenir.');
  const accountUid = owner.uid;
  const current = () => auth.currentUser === owner;

  const customerInfo = await restoreCheckoutCustomer();
  if (!hasActiveEntitlements(customerInfo)) {
    throw new Error('An active Natally reading purchase is required to create a souvenir.');
  }

  const content = buildSouvenirContent(chart, accountUid);
  const contentJson = JSON.stringify(JSON.parse(JSON.stringify(content)));
  const bytes = new TextEncoder().encode(contentJson);
  if (bytes.length > MAX_PAYLOAD_BYTES) {
    throw new Error('This keepsake is too large to store exactly (' + bytes.length + ' bytes). It cannot be preserved without truncation.');
  }
  const id = await hashContent(accountUid, contentJson);
  const now = new Date().toISOString();
  const retainUntil = new Date(Date.now() + (MIN_RETENTION_DAYS + 1) * 86400000).toISOString();

  if (!current()) throw new Error('Your account changed. Try again.');
  const snapshot = await runTransaction(db, async (transaction) => {
    if (!current()) throw new Error('Your account changed. Try again.');
    const ref = souvenirDoc(accountUid, id);
    const existing = await transaction.get(ref);
    if (existing.exists()) {
      const stored = existing.data() as { kind?: string; payload?: string };
      if (stored?.kind !== 'natally-souvenir' || typeof stored.payload !== 'string') {
        throw new Error('The existing souvenir record is invalid.');
      }
      const parsed = validateSnapshotShape(JSON.parse(stored.payload), accountUid, id);
      if (parsed.id !== id) throw new Error('The existing souvenir record is invalid.');
      return parsed;
    }
    const snapshot: SouvenirSnapshot = {
      schemaVersion: 1,
      id,
      accountUid,
      createdAt: now,
      retainUntil,
      chart: content.chart,
      messages: content.messages,
      voiceSettings: content.voiceSettings,
      chapters: content.chapters,
    };
    validateSnapshotShape(snapshot, accountUid, id);
    const payloadJson = JSON.stringify(snapshot);
    if (new TextEncoder().encode(payloadJson).length > MAX_PAYLOAD_BYTES) {
      throw new Error('This keepsake is too large to store exactly. It cannot be preserved without truncation.');
    }
    transaction.set(ref, { kind: 'natally-souvenir', payload: payloadJson });
    return snapshot;
  });

  if (!current()) throw new Error('Your account changed. Try again.');
  if (auth.currentUser !== owner) throw new Error('Your account changed. Try again.');
  saveAccountValue('natally_souvenir_v1:' + id, accountUid, snapshot);
  return snapshot;
}

/** Load an existing frozen souvenir by id; must belong to the signed-in owner. */
export async function loadSouvenir(id: string): Promise<SouvenirSnapshot> {
  await auth.authStateReady();
  const owner = auth.currentUser;
  if (!owner) throw new Error('Sign in to open your souvenir.');
  if (!ID_PATTERN.test(id)) throw new Error('The souvenir id is invalid.');
  const uid = owner.uid;
  let snapshot: SouvenirSnapshot;
  try {
    const existing = await getDocFromServer(souvenirDoc(uid, id));
    if (!existing.exists()) {
      throw new Error('This souvenir could not be found on your account.');
    }
    const stored = existing.data() as { kind?: string; payload?: string };
    if (stored?.kind !== 'natally-souvenir' || typeof stored.payload !== 'string') {
      throw new Error('The souvenir record is invalid.');
    }
    snapshot = validateSnapshotShape(JSON.parse(stored.payload), uid, id);
  } catch (error) {
    const code = (error as { code?: string })?.code;
    const offline = code === 'unavailable' || code === 'failed-precondition' || code === 'network-request-failed';
    if (!offline) throw error;
    const cached = loadAccountValue<SouvenirSnapshot | null>('natally_souvenir_v1:' + id, uid, null);
    if (!cached) throw error;
    snapshot = validateSnapshotShape(cached, uid, id);
  }
  if (auth.currentUser !== owner) throw new Error('Your account changed. Try again.');
  saveAccountValue('natally_souvenir_v1:' + id, uid, snapshot);
  return snapshot;
}

/** Private, own-account viewer link; carries no personal data in the URL. */
export function souvenirUrl(id: string): string {
  return 'https://natally.robin.mba/?app=1&souvenir=' + encodeURIComponent(id);
}
