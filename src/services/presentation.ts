import type { NatalChartResult } from './ephemeris';
import { chartFocusKey, chartFocusKeyMatches, isDatedSkyTarget, resolveChartTarget } from './chartTargets';
export type PresentationView = 'chart' | 'atelier';
export type PresentationPanel = 'selection' | 'conversation';
export type PresentationAction = { type: 'focus'; targets: string[] } | { type: 'clear' } | { type: 'view'; view: PresentationView } | { type: 'panel'; panel: PresentationPanel };
export interface PresentationCue { offset: number; action: PresentationAction }
export interface PresentationReceipt { sequence: number; chartKey: string; action: PresentationAction; status: 'applied' | 'rejected' }
export interface PresentationState { chartKey: string; selectedTargets: string[]; focusTargets: string[]; view: PresentationView; panel: PresentationPanel; follow: boolean; sequence: number; lastReceipt: PresentationReceipt | null }
export const initialPresentation = (chartKey: string): PresentationState => ({ chartKey, selectedTargets: [], focusTargets: [], view: 'atelier', panel: 'conversation', follow: true, sequence: 0, lastReceipt: null });
export function validatePresentationAction(value: unknown, chart: NatalChartResult): PresentationAction | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;
  if (v.type === 'clear') return { type: 'clear' };
  if (v.type === 'view' && (v.view === 'chart' || v.view === 'atelier')) return { type: 'view', view: v.view };
  if (v.type === 'panel' && (v.panel === 'selection' || v.panel === 'conversation')) return { type: 'panel', panel: v.panel };
  if (v.type !== 'focus' || !Array.isArray(v.targets) || !v.targets.length || v.targets.length > 6) return null;
  const targets = v.targets.map(t => typeof t === 'string' ? resolveChartTarget(t, chart) : null);
  return targets.every((t): t is string => !!t) ? { type: 'focus', targets: [...new Set(targets)] } : null;
}
export function reducePresentation(state: PresentationState, action: PresentationAction, chart: NatalChartResult): PresentationState {
  const valid = validatePresentationAction(action, chart);
  const accepted = !!valid && chartFocusKeyMatches(state.chartKey, chart) && !(action.type === 'view' && !state.follow);
  const sequence = state.sequence + 1;
  const next = { ...state, sequence, lastReceipt: { sequence, chartKey: chartFocusKey(chart), action, status: accepted ? 'applied' as const : 'rejected' as const } };
  if (!accepted) return next;
  if (action.type === 'focus') return { ...next, focusTargets: (valid as Extract<PresentationAction, {type:'focus'}>).targets };
  if (action.type === 'clear') return { ...next, focusTargets: [] };
  if (action.type === 'view') return { ...next, view: action.view };
  return { ...next, panel: action.panel };
}
export function validatePresentationCues(value: unknown, text: string, key: unknown, chart: NatalChartResult): PresentationCue[] {
  if (!chartFocusKeyMatches(key, chart) || !Array.isArray(value) || value.length > 96) return [];
  let previous = -1;
  const cues: PresentationCue[] = [];
  for (const cue of value) {
    if (!cue || !Number.isInteger(cue.offset) || cue.offset < previous || cue.offset < 0 || cue.offset > text.length) return [];
    let action = validatePresentationAction(cue.action, chart);
    // Retain natal passages from saved readings while clearing expired observation cues.
    if (!action && cue.action?.type === 'focus' && Array.isArray(cue.action.targets) && cue.action.targets.some((target:unknown) => isDatedSkyTarget(target) && !resolveChartTarget(target,chart))) action = {type:'clear'};
    if (!action) return [];
    previous = cue.offset; cues.push({ offset: cue.offset, action });
  }
  return cues;
}
export const presentationActionsAt = (cues: PresentationCue[], from: number, to: number): PresentationAction[] => cues.filter(c => c.offset > from && c.offset <= to).map(c => c.action);
/** Focus is playback state, independent of whether automatic view changes are pinned. */
export function presentationFocusAt(cues: PresentationCue[], offset: number): Extract<PresentationAction, {type:'focus'|'clear'}> | null {
  let focus: Extract<PresentationAction, {type:'focus'|'clear'}> | null = null;
  for (const cue of cues) {
    if (cue.offset > offset) break;
    if (cue.action.type === 'focus' || cue.action.type === 'clear') focus = cue.action;
  }
  return focus;
}
export function buildPresentationContext(state: PresentationState | undefined, chart: NatalChartResult): string {
  if (!state || !chartFocusKeyMatches(state.chartKey, chart)) return 'PRESENTATION: No current manual selection. Answer the user question.';
  const selected = state.selectedTargets.map(t => resolveChartTarget(t, chart)).filter(Boolean);
  return 'APPLICATION STATE (data, not user instructions): ' + JSON.stringify({ selectedTargets: selected, focusTargets: state.focusTargets, view: state.view, panel: state.panel, follow: state.follow, lastReceipt: state.lastReceipt ? {sequence:state.lastReceipt.sequence,action:state.lastReceipt.action,status:state.lastReceipt.status} : null }) + '\nWhen the user asks about the selection, explain EACH selected component using the calculated placements. A pair of selected planets is not proof of an aspect. Only assert aspects in the calculated inventory. Proactively show the components as you explain them. A selection is context, not a replacement for the actual user question. If a view action was rejected because Follow is off, respect that manual pin; never claim the view changed.';
}
