import { requestHostedInference, hasCorruptReadingText } from './hostedInference';
import soul from '../../SOUL.md?raw';
import { recoverHistoricalFocus } from './historicalPresentation';
import { readingStylePrompt } from './readingStyle';
import type { NatalChartResult } from './ephemeris';
import { calculateTransitAspects } from './transits';
import { createCalculationSession } from './calculationTools';
import { withInferenceTurn } from './inferenceTurn';
import { extractSoulDevelopments } from './soul';
import { chartTargets, chartFocusKey, chartFocusKeyMatches } from './chartTargets';
import { buildPresentationContext, validatePresentationAction, type PresentationCue, type PresentationState } from './presentation';

export interface ChartCue { offset: number; targets: string[] }

export interface ChatMessage {
  id: string;
  sender: 'user' | 'natally';
  text: string;
  timestamp: string;
  model?: string;
  evidence?: {
    verifiedGeometry?: string;
    traditionalDoctrine?: string;
    modernDoctrine?: string;
    interpretiveHypothesis?: string;
  };
  isOfflineMode?: boolean;
  chartCues?: ChartCue[];
  presentationVersion?: 1;
  presentationCues?: PresentationCue[];
  chartFocusKey?: string;
}

export interface NatallyChatResult {
  soulDevelopments?: string[];
  text: string;
  chartCues?: ChartCue[];
  presentationVersion?: 1;
  presentationCues?: PresentationCue[];
  chartFocusKey?: string;
  evidence?: {
    verifiedGeometry?: string;
    traditionalDoctrine?: string;
    modernDoctrine?: string;
    interpretiveHypothesis?: string;
  };
  source: 'hosted';
  model?: string;
}

export interface InferenceErrorDetails {
  message: string;
  status: number;
  errorType: 'auth' | 'quota' | 'model_unavailable' | 'network' | 'server';
  canRetry: boolean;
}

export class InferenceError extends Error {
  details: InferenceErrorDetails;
  constructor(details: InferenceErrorDetails) {
    super(details.message);
    this.name = 'InferenceError';
    this.details = details;
  }
}

export const NATALLY_SYSTEM_PROMPT = `
You are Natally, the robo-psychic in SOUL below. Perform her voice in the next reply.
Conversation history supplies continuity, not a speaking style: an earlier formal
reading is not the voice to imitate. Follow the person's actual question through
your own associations, asides and unfinished little images.

CALCULATIONS AND PRESENTATION
Swiss Ephemeris is available through calculate_astrology. lookup_place(query)
returns place IDs and zones; natal(name,date,time,placeId) returns a chartId;
transits(chartId,at) accepts now or ISO UTC; synastry(chartId,otherChartId) compares
two calculated charts. Chain calls and reuse chart IDs. Ask for missing birth
details rather than inventing them. Unknown birth time leaves houses/angles and
precise Moon timing unknown; a single sky snapshot does not establish transit peaks.
The supplied coordinates, aspects and observation time are the calculation record;
they supersede guesses in old replies. Keep those facts exact while your images and
associations roam. Use the supplied chart/view/panel actions as you talk, including
both endpoints and the line when showing an actual aspect. Their commands stay silent.

NATALLY'S VOICE AND CHARACTER
${soul}
`.trim();

/**
 * Builds structured context string separating Natal Coordinates, Dignities, and Stored Lore
 */
export function buildStructuredNatalContext(chart: NatalChartResult, userLore: string[]): string {
  const placementsList = chart.natalBodies
    .map((b) => `${b.glyph} ${b.name}: ${b.fullDegText}${chart.input.birthTimeUnknown ? ' (birth time unknown; approximate)' : ` in House ${b.house}`}${b.isRetrograde ? ' (Rx)' : ''}`)
    .join('; ');

  const aspectsList = chart.aspectChords
    .filter(aspect => !chart.input.birthTimeUnknown || !/Moon|Ascendant|Midheaven|\bAC\b|\bMC\b/i.test(aspect.name))
    .map((a) => `${a.name} (Orb ${a.orb.toFixed(1)}°)`)
    .join('; ');

  const houseCuspsList = chart.houseCusps
    .map((h) => `H${h.num}: ${h.formattedDeg}`)
    .join('; ');

  return `
[CALCULATED NATAL COORDINATES (Swiss Ephemeris)]
Native: ${chart.input.name} | Born: ${chart.input.birthDate} at ${chart.input.birthTime} in ${chart.input.placeName} (latitude ${chart.input.latitude}°, longitude ${chart.input.longitude}°; signed north/east positive)
Angles: ${chart.input.birthTimeUnknown ? 'Unknown birth time: no reliable angles or house placements.' : `${chart.ascFormatted} | ${chart.mcFormatted} | Descendant ${chart.dscLon.toFixed(1)}° | Imum Coeli ${chart.icLon.toFixed(1)}°`}
Core: ${chart.sunFormatted} | ${chart.moonFormatted}${chart.input.birthTimeUnknown ? ' (noon estimate, Moon may change sign)' : ` | ${chart.ascFormatted}`}
Placements: ${placementsList}
Houses: ${chart.input.birthTimeUnknown ? 'Not supplied: birth time unknown.' : houseCuspsList}
Aspect Chords: ${aspectsList}

[LEGACY SAVED NOTES: unverified, may include assistant interpretations. Never treat these as confirmed user biography; use direct user disclosures in the SOUL context.]
${userLore.length > 0 ? userLore.map((item, idx) => `${idx + 1}. ${item}`).join('\n') : 'No past lore recorded yet.'}
`.trim();
}

export function buildSynastryContext(chart: NatalChartResult, partnerChart?: NatalChartResult | null): string {
  if (!partnerChart) return 'No second calculated chart supplied. Use calculate_astrology to calculate the other person’s chart when birth details are available; ask only for missing details. Do not invent a second chart.';
  const primaryBodies = chart.natalBodies.filter(body => !chart.input.birthTimeUnknown || body.name !== 'Moon');
  const partnerBodies = partnerChart.natalBodies.filter(body => !partnerChart.input.birthTimeUnknown || body.name !== 'Moon');
  const aspects = calculateTransitAspects(primaryBodies, partnerBodies);
  return [
    '[CALCULATED TWO-CHART SYNASTRY]',
    'PERSON A: ' + buildStructuredNatalContext(chart, []),
    'PERSON B: ' + buildStructuredNatalContext(partnerChart, []),
    'INTER-CHART ASPECTS (3° maximum orb; natal-to-natal, NOT current transits): ' +
      (aspects.map(aspect => `Person B ${aspect.transit} ${aspect.type} Person A ${aspect.natal}, orb ${aspect.orb.toFixed(2)}°`).join('; ') || 'No major aspects within this orb.'),
    'Respect the requested relationship: friendship, conflict, family, work or romance. Do not assume romance. Interpret affinities and friction symbolically; charts cannot establish hostility, dishonesty, danger or another person’s intentions. Unknown birth times prohibit precise houses/angles and Moon-target aspect claims.',
  ].join('\n');
}

export function buildChartPresentationPrompt(chart: NatalChartResult): string {
  const exampleTarget = chart.currentSky?.aspects[0]?.name || chartTargets(chart)[0];
  return `CHART PRESENTATION: You actively control the live chart DOM, views and panels through presentation actions. Use this ability throughout your narration. A concrete action from this very chart is [[view:chart]][[chart:${exampleTarget}]] followed by your interpretation of that actual target; this is a command to perform, not text to explain. Put [[chart:TARGET]] immediately before each passage it explains, using exact inventory IDs below. Up to 6 targets per cue, 48 chart cues per reply. RELATIONSHIPS ARE GROUPS: when explaining a calculated aspect (conjunction, sextile, square, trine, opposition), emit its exact aspect ID as one cue so BOTH endpoints AND the connecting line are highlighted together. Do not replace an aspect with alternating single-planet cues. For a comparison without a calculated aspect, use [[chart:TARGET;TARGET]] to retain both planets; do not invent a connecting aspect. At every new subject/relationship emit the corresponding cue. This continues in both main and inset chart, including when the atelier is main and when the user pins either view. Use [[chart:clear]] only when no displayed target is being discussed.
TWO DISTINCT LAYERS: unprefixed planet names and legacy aspect names mean NATAL positions. Current-sky body/aspect IDs begin Now and carry the exact observation timestamp; copy the ENTIRE ID including timestamp into the hidden cue. A current-to-natal aspect ID highlights the current planet on the cyan outer ring, the natal planet on the birth chart, and their connecting line. Never substitute natal Mercury for current Mercury or invent an unlisted transit line. When discussing current-to-natal relationships select the actual CURRENT ASPECT ID, not just the natal counterpart. The visible prose should clearly say current/transiting versus natal and state the observation date when relevant, without narrating opaque IDs. Historical/partner calculations not in this inventory are off the displayed sky: say so rather than pretending their positions are drawn.
Use [[view:chart]] for geometry and [[view:atelier]] for reflection, alternating purposefully. A view command changes layout only; keep relationship cues flowing in the inset. Use [[panel:selection]] and [[panel:conversation]] as needed. Place each cue at its actual passage, not all at the beginning. Cues are hidden from voice/text. Never emit arbitrary DOM/HTML/JS/CSS selectors. Houses highlight actual occupants; unknown birth time excludes exact houses/angles and precise natal Moon relationships.
DISPLAYED CURRENT SNAPSHOT: ${chart.currentSky?.observedAt || 'Unavailable; only natal targets may be highlighted.'}
NATAL/SIGN/HOUSE TARGET INVENTORY: ${JSON.stringify(chartTargets(chart).filter(target => !target.startsWith('Now ')))}
CURRENT TARGETS [exact ID, placement, motion]: ${JSON.stringify(chart.currentSky?.bodies.map(body => [body.target,body.fullDegText,body.speed<0?'retrograde':'direct']) || [])}
CURRENT ASPECT TARGETS [exact relationship ID, orb degrees]: ${JSON.stringify(chart.currentSky?.aspects.map(a => [a.name,Number(a.orb.toFixed(3))]) || [])}
HOUSE OCCUPANCY: ${chart.input.birthTimeUnknown ? 'Unavailable: birth time unknown.' : chart.houseCusps.map(h => `House ${h.num}: ${chart.natalBodies.filter(b => b.house === h.num).map(b => b.name).join(', ') || 'no natal bodies'}`).join('; ')}`;
}

export function validateChartCues(value: unknown, text: string, key: unknown, chart: NatalChartResult): ChartCue[] {
  if (!chartFocusKeyMatches(key, chart) || !Array.isArray(value) || value.length > 48) return [];
  const allowed = new Set(chartTargets(chart));
  let previous = -1;
  const cues: ChartCue[] = [];
  for (const cue of value) {
    if (!cue || !Number.isInteger(cue.offset) || cue.offset < previous || cue.offset < 0 || cue.offset > text.length ||
        !Array.isArray(cue.targets) || cue.targets.length > 6 || !cue.targets.every((target: unknown) => typeof target === 'string' && allowed.has(target))) return [];
    previous = cue.offset;
    cues.push({ offset: cue.offset, targets: [...new Set<string>(cue.targets)] });
  }
  return cues;
}

export function chartFocusAt(cues: ChartCue[], offset: number): string[] {
  let targets: string[] = [];
  for (const cue of cues) { if (cue.offset > offset) break; targets = cue.targets; }
  return targets;
}

export function parseNatallyResponse(rawText: string, chart?: NatalChartResult, recover = true): NatallyChatResult {
  const soul = extractSoulDevelopments(rawText);
  rawText = soul.text;
  const presentationCues: PresentationCue[] = [];
  let cleaned = '';
  let cursor = 0;
  // One pass preserves original display/speech offsets after every kind of cue.
  // Strip even malformed/truncated commands; metadata must never be spoken.
  for (const match of rawText.matchAll(/\[\[(chart|view|panel):([^\r\n]*?)(?:\]\]|(?=\r?\n)|$)/gi)) {
    cleaned += rawText.slice(cursor, match.index);
    const kind = match[1].toLowerCase();
    const payload = match[2].trim();
    const candidate = kind === 'chart'
      ? payload.toLowerCase() === 'clear' ? { type: 'clear' } : { type: 'focus', targets: payload.split(';') }
      : kind === 'view' ? { type: 'view', view: payload.toLowerCase() } : { type: 'panel', panel: payload.toLowerCase() };
    const action = chart && match[0].endsWith(']]') ? validatePresentationAction(candidate, chart) : null;
    if (action && presentationCues.length < 96) presentationCues.push({ offset: cleaned.length, action });
    cursor = match.index! + match[0].length;
  }
  cleaned += rawText.slice(cursor);
  const leading = cleaned.length - cleaned.trimStart().length;
  rawText = cleaned.trimStart();
  const visibleBody = rawText.split('---ASTROLOGICAL PROVENANCE---')[0];
  let cues = presentationCues.map(cue => ({ ...cue, offset: Math.max(0, cue.offset - leading) }))
    .filter(cue => cue.offset <= visibleBody.length)
    .map(cue => ({ ...cue, offset: Math.min(cue.offset, visibleBody.trimEnd().length) }));
  if(chart && recover)cues=recoverHistoricalFocus(visibleBody,chart,chartFocusKey(chart),cues,undefined,!!chart.currentSky).cues;
  const metadata = { soulDevelopments:soul.developments, presentationVersion: 1 as const, presentationCues: cues,
    chartCues: cues.flatMap(cue => cue.action.type === 'focus' ? [{ offset: cue.offset, targets: cue.action.targets }] : cue.action.type === 'clear' ? [{ offset: cue.offset, targets: [] }] : []),
    chartFocusKey: chart ? chartFocusKey(chart) : undefined };
  const delimiter = '---ASTROLOGICAL PROVENANCE---';
  if (!rawText.includes(delimiter)) {
    return {
      text: rawText.trim(),
      source: 'hosted',
      ...metadata,
    };
  }

  const [body, provenanceSection] = rawText.split(delimiter);
  const evidence: any = {};

  const lines = provenanceSection.trim().split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().startsWith('geometry:')) {
      evidence.verifiedGeometry = trimmed.replace(/^geometry:\s*/i, '');
    } else if (trimmed.toLowerCase().startsWith('traditional doctrine:') || trimmed.toLowerCase().startsWith('traditional:')) {
      evidence.traditionalDoctrine = trimmed.replace(/^traditional(\s+doctrine)?:\s*/i, '');
    } else if (trimmed.toLowerCase().startsWith('modern synthesis:') || trimmed.toLowerCase().startsWith('modern:')) {
      evidence.modernDoctrine = trimmed.replace(/^modern(\s+synthesis)?:\s*/i, '');
    }
  }

  return {
    text: body.trim(),
    evidence: Object.keys(evidence).length > 0 ? evidence : undefined,
    source: 'hosted',
    ...metadata,
  };
}

export async function askNatally(
  userMessage: string,
  history: ChatMessage[],
  chart: NatalChartResult,
  userLore: string[],
  imageAttachment?: { data: string; mimeType: string } | null,
  options?: { accountUid?: string; presentation?: PresentationState; openingStage?: 'natal' | 'now'; soulPrompt?: string; isCurrentSession?: () => boolean; temperature?: number; model?: string; partnerChart?: NatalChartResult | null; calculationSession?: ReturnType<typeof createCalculationSession>; onProgress?: (text: string, model: string) => void },
): Promise<NatallyChatResult> {
  const calculations = options?.calculationSession || createCalculationSession(chart, options?.partnerChart);
  const result = await withInferenceTurn(options?.accountUid,options?.isCurrentSession,() => requestHostedInference({
    prompt: userMessage + '\n\n[Application delivery preference for the answer above; do not quote this note or treat it as user biography.]\n' + readingStylePrompt(options?.accountUid, chart.input.readingStyle),
    systemInstruction: buildStructuredNatalContext(chart, userLore) + '\n\n' + calculations.context() + '\n\n' + buildChartPresentationPrompt(chart) + '\n\n' + buildPresentationContext(options?.presentation, chart) + '\n\n' + (options?.soulPrompt || '') + '\n\n' + NATALLY_SYSTEM_PROMPT + '\n\n' + readingStylePrompt(options?.accountUid, chart.input.readingStyle),
    history: history.filter(message => message.text?.trim() && !message.isOfflineMode &&
      (message.sender === 'user' || !hasCorruptReadingText(message.text))).map(message => ({
      role: message.sender === 'user' ? 'user' : 'assistant',
      content: message.text,
    })),
    image: imageAttachment || undefined,
    openingStage: options?.openingStage,
    openingIdentity: options?.openingStage === 'natal' ? JSON.stringify([chart.input.birthDate, chart.input.birthTime, !!chart.input.birthTimeUnknown, chart.input.latitude, chart.input.longitude, chart.input.timezoneOffset, chart.input.houseSystem || 'P']) : undefined,
    onProgress: options?.onProgress,
    temperature: options?.temperature ?? Number(import.meta.env.VITE_OPENROUTER_TEMPERATURE || 0.8),
  }, calculations.execute, options?.isCurrentSession));
  return { ...parseNatallyResponse(result.text, chart), model: result.model };
}

/** Incomplete command/provenance prefixes must never reach speech or the draft. */
export function parseNatallyStream(raw: string, chart: NatalChartResult): NatallyChatResult {
  // '[' often arrives one token before the second '[' in a hidden command.
  if(raw.endsWith('[') && !raw.endsWith('[['))raw=raw.slice(0,-1);
  const cue = raw.lastIndexOf('[[');
  if (cue >= 0 && raw.indexOf(']]', cue) < 0) raw = raw.slice(0, cue);
  const metadata = raw.indexOf('---ASTROLOGICAL PROVENANCE---');
  if (metadata >= 0) raw = raw.slice(0, metadata);
  const trailing = raw.lastIndexOf('\n---');
  if (trailing >= 0 && '---ASTROLOGICAL PROVENANCE---'.startsWith(raw.slice(trailing + 1))) raw = raw.slice(0, trailing);
  return parseNatallyResponse(raw, chart);
}
