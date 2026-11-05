import { requestHostedInference } from './hostedInference';
import { readingStylePrompt } from './readingStyle';
import { withInferenceTurn } from './inferenceTurn';
import { NatalChartResult } from './ephemeris';
import { buildCurrentSkyContext, calculateCurrentSkySnapshot, resolveObservationMoment } from './transits';
import { NATALLY_SYSTEM_PROMPT, buildStructuredNatalContext, buildChartPresentationPrompt, buildSynastryContext, parseNatallyResponse, type ChartCue } from './natallyChat';
import { buildPresentationContext, initialPresentation, type PresentationState, type PresentationCue } from './presentation';
import { chartFocusKey, resolveChartTarget } from './chartTargets';
import { loadSoulState, buildSoulPrompt, rememberCharacterDevelopment } from './soul';
import { createCalculationSession } from './calculationTools';

export interface ReadingRequest {
  quickNow?: boolean;
  seasonalMood?: 'halloween';
  accountUid?: string;
  presentation?: PresentationState;
  isCurrentSession?: () => boolean;
  type: 'horoscope' | 'synastry' | 'house' | 'planet' | 'aspect' | 'full_natal';
  targetKey?: string; // e.g. "House 8", "Mars", "Saturn ☍ Jupiter"
  chart: NatalChartResult;
  partnerChart?: NatalChartResult | null;
  length?: 'short' | 'thorough' | 'exhaustive';
  userLore?: string[];
  transitDate?: string;
  transitTime?: string;
  transitPlace?: string;
  transitTimezoneOffset?: number;
}

export interface ReadingResponse {
  title: string;
  subtitle: string;
  content: string;
  chartCues?: ChartCue[];
  presentationVersion?:1;
  presentationCues?:PresentationCue[];
  soulNotice?:string|null;
  chartFocusKey?: string;
  generatedAt: string;
  observationSnapshot?: NatalChartResult['currentSky'];
}

// Higher-than-normal temperature setting (1.25) for intuitive latitude
export async function generateAstrologicalReading(req: ReadingRequest): Promise<ReadingResponse> {
  if (req.type === 'synastry' && !req.partnerChart) throw new Error('Add the other person’s birth details to calculate synastry.');
  let soul = loadSoulState(req.accountUid ?? null);
  const target = req.targetKey ? resolveChartTarget(req.targetKey,req.chart) : null;
  const presentation = { ...(req.presentation ?? initialPresentation(chartFocusKey(req.chart))), ...(target ? {selectedTargets:[target]} : {}) };
  const partnerSummary = req.type === 'synastry' ? buildSynastryContext(req.chart, req.partnerChart) : 'None';

  const explicitObservation = !!(req.transitDate || req.transitTime);
  const now = req.quickNow ? new Date() : !explicitObservation && req.chart.currentSky ? new Date(req.chart.currentSky.observedAt) : resolveObservationMoment(req.transitDate, req.transitTime, req.transitTimezoneOffset);
  const transitDateStr = (!req.quickNow && req.transitDate) || now.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const transitTimeStr = (!req.quickNow && req.transitTime) || now.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
  const observationLocation = req.transitPlace || req.chart.input.currentLocationName || 'Current location not supplied';
  const usesSky = req.quickNow || req.type === 'horoscope' || req.type === 'full_natal';
  const observationSnapshot = usesSky
    ? req.quickNow || explicitObservation || !req.chart.currentSky ? await calculateCurrentSkySnapshot(req.chart,now) : req.chart.currentSky
    : req.chart.currentSky;
  // The exact same observation supplies the prompt, target inventory, parser and saved replay.
  const readingChart: NatalChartResult = {...req.chart,currentSky:observationSnapshot};
  const currentSky = usesSky
    ? await buildCurrentSkyContext({ ...readingChart, input: { ...readingChart.input, currentLocationName: observationLocation,
        currentTimezoneId: req.transitDate ? Intl.DateTimeFormat().resolvedOptions().timeZone : readingChart.input.currentTimezoneId } })
    : '';

  const prompt = `
You are Natally, the robo-psychic companion defined in the supplied SOUL.
You are not a cold, clinical mechanical turk fortune-teller. Conversation is the main mode of communication.
Provide an intuitive astrological reading for the following request:
- Reading Type: ${req.type}
- Observation Timestamp (Current Sky): ${transitDateStr} at ${transitTimeStr}
- Observation Location: ${observationLocation}
- Target: ${req.targetKey || 'General'}
${buildStructuredNatalContext(req.chart, req.userLore ?? [])}
- Partner Data (if synastry): ${partnerSummary}
- Desired Length: ${req.quickNow ? 'Substantial current-sky reading: approximately 550-750 words with personal tangents and concrete examples' : req.length || 'thorough'}
- User Lore / Background notes: ${req.userLore?.join('; ') || 'None'}

${currentSky}

${req.quickNow ? 'INSTANT NOW means one-click generation, not brevity. Give approximately 550-750 words exploring several calculated connections, everyday examples and practical suggestions. Ramble into personal asides from established character lore, use Gen-Z aphorisms, then circle back. Preserve the observation timestamp and chart/presentation cues.' : ''}
${req.seasonalMood === 'halloween' ? 'HALLOWEEN MOOD: A little playful spooky atmosphere is welcome. Keep the same calculated sky and practical meaning; no doom, threats, curses, death predictions or claims that the seasonal decoration changes astrology. A Horrorscope is a lighthearted name, not a frightening forecast.' : ''}

Formatting & Tone Instructions:
1. Mention observation date and place naturally, without a formal report preamble.
2. ${req.quickNow ? 'Explore the current sky and natal connections in depth.' : 'Explain the natal foundations first, then the calculated transits at the specified observation time when supplied.'} A requested historical or future observation is not today's sky; state its actual date. The saved reading restores this exact observation when shown in the conversation. Never describe a natal aspect as a current transit. Do not invent current sky positions or exact future timings.
3. Deliver the reading in the shared SOUL character, consistent with the supplied fictional character lore. Do not reroll a backstory or invent user biography.
4. End naturally after a satisfying reading; no compulsory therapeutic reflection question.
`.trim();

  const calculations = createCalculationSession(readingChart, req.partnerChart);
  const result = await withInferenceTurn(req.accountUid,req.isCurrentSession,() => requestHostedInference({
    prompt,
    systemInstruction: NATALLY_SYSTEM_PROMPT + '\n\n' + buildSoulPrompt(soul) + '\n\n' + calculations.context() + '\n\n' + buildChartPresentationPrompt(readingChart) + '\n\n' + buildPresentationContext(presentation,readingChart) + '\n\n' + readingStylePrompt(req.accountUid, req.chart.input.readingStyle),
  }, calculations.execute, req.isCurrentSession));
  const parsed = parseNatallyResponse(result.text, readingChart);
  if (req.isCurrentSession?.() !== false) for (const [index,text] of (parsed.soulDevelopments || []).entries()) soul = rememberCharacterDevelopment(soul,{id:'reading-'+Date.now()+'-'+index,text},req.isCurrentSession ?? (() => false));
  return {
    title: req.quickNow ? (req.seasonalMood === 'halloween' ? 'HORRORSCOPE - RIGHT NOW' : 'YOUR SKY - RIGHT NOW') : req.type.toUpperCase() + ': ' + (req.targetKey || req.chart.input.name),
    subtitle: req.chart.sunFormatted,
    content: parsed.text,
    chartCues: parsed.chartCues,
    presentationVersion:parsed.presentationVersion,
    presentationCues:parsed.presentationCues,
    soulNotice:soul.notice,
    chartFocusKey: parsed.chartFocusKey,
    generatedAt: new Date().toISOString(),
    observationSnapshot: observationSnapshot ? structuredClone(observationSnapshot) : undefined,
  };
}
