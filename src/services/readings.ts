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
  onProgress?: (text: string, model: string, chart: NatalChartResult) => void;
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
  model?: string;
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

// Chat and generated readings share the same character and configured temperature.
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
Talk directly to the person in your own slang-rich, opinionated, rambling voice. Give them a real conversation, including a personal side quest that comes back to their chart.
Here are the calculated facts and the reading they requested:
- Reading Type: ${req.type}
- Observation Timestamp (Current Sky): ${transitDateStr} at ${transitTimeStr}
- Observation Location: ${observationLocation}
- Target: ${req.targetKey || 'General'}
${buildStructuredNatalContext(req.chart, req.userLore ?? [])}
- Partner Data (if synastry): ${partnerSummary}
- Requested depth: ${req.quickNow ? 'A substantial, wandering exploration of the current sky and its connections to this natal chart' : req.length || 'thorough'}
- User Lore / Background notes: ${req.userLore?.join('; ') || 'None'}

${currentSky}

${req.quickNow ? 'INSTANT NOW means one-click generation. Linger with several of the calculated connections and their possible imagery; let personal tangents and Gen-Z aphorisms tumble into one another. Follow a thread until it has somewhere to go, without a word quota. Preserve the observation timestamp and chart/presentation cues.' : ''}
${req.seasonalMood === 'halloween' ? 'HALLOWEEN MOOD: playful spooky imagery and deliciously haunted side quests in the same SOUL voice. The seasonal room is atmosphere; the calculated sky stays the same.' : ''}

Begin in the middle of being yourself, with an image or a thought that has caught
your attention. Work the observation date/place into the conversation naturally.
${req.quickNow ? 'Explore the current sky and its natal connections in depth.' : 'Explore the natal foundations first, then the supplied current overlay when requested.'}
A historical/future observation keeps its actual date; natal and current layers
remain distinct. The geometry is calculated; its possible meanings are room to
wander in, not a verdict about the person. Stay with SOUL's associative voice to
the end, without tidying every image into advice or a concluding lesson.

${readingStylePrompt(req.accountUid, req.chart.input.readingStyle)}
`.trim();

  const calculations = createCalculationSession(readingChart, req.partnerChart);
  req.onProgress?.('', '', readingChart);
  const result = await withInferenceTurn(req.accountUid,req.isCurrentSession,() => requestHostedInference({
    prompt,
    onProgress:(text,model)=>req.onProgress?.(text,model,readingChart),
    temperature: Number(import.meta.env.VITE_OPENROUTER_TEMPERATURE || 0.8),
    systemInstruction: buildSoulPrompt(soul) + '\n\n' + calculations.context() + '\n\n' + buildChartPresentationPrompt(readingChart) + '\n\n' + buildPresentationContext(presentation,readingChart) + '\n\n' + NATALLY_SYSTEM_PROMPT + '\n\n' + readingStylePrompt(req.accountUid, req.chart.input.readingStyle),
  }, calculations.execute, req.isCurrentSession));
  const parsed = parseNatallyResponse(result.text, readingChart);
  if (req.isCurrentSession?.() !== false) for (const [index,text] of (parsed.soulDevelopments || []).entries()) soul = rememberCharacterDevelopment(soul,{id:'reading-'+Date.now()+'-'+index,text},req.isCurrentSession ?? (() => false));
  return {
    model: result.model,
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
