import React from 'react';
import type { NatalChartResult } from '../services/ephemeris';
import { chartTargetLabel, resolveChartTarget } from '../services/chartTargets';
export function ChartSelectionDetails({ chart, targets, onDiscuss, busy = false }: {chart: NatalChartResult; targets:string[]; onDiscuss:(targets:string[])=>void; busy?:boolean}) {
  const selected = [...new Set(targets.map(t => resolveChartTarget(t,chart)).filter((t):t is string => !!t))];
  if (!selected.length) return null;
  return <section aria-label="Selected calculated placements" className="rounded-xl border border-[#d4af37]/40 bg-[#181126]/95 p-3 text-sm text-[#f1e8d8]">
    <h3 className="font-semibold text-[#f2ca50]">Your selection</h3>
    <dl className="my-2 space-y-2">{selected.map(target => {
      const body = chart.natalBodies.find(b => b.name === target);
      const house = chart.houseCusps.find(h => 'House '+h.num === target);
      const aspect = chart.aspectChords.find(a => a.name === target);
      const currentBody = chart.currentSky?.bodies.find(b => b.target === target);
      const transit = chart.currentSky?.aspects.find(a => a.name === target);
      const detail = currentBody ? 'Current sky · '+currentBody.fullDegText+' · '+chart.currentSky!.observedAt : transit ? 'Current → natal · '+transit.type+' · orb '+transit.orb.toFixed(2)+'° · '+chart.currentSky!.observedAt : body ? 'Natal · '+ body.fullDegText + (chart.input.birthTimeUnknown ? ' · approximate; birth time unknown' : ' · House '+body.house) + (body.isRetrograde ? ' · retrograde' : '')
        : house ? 'Cusp '+house.formattedDeg : aspect ? 'Natal aspect · orb '+aspect.orb.toFixed(2)+'°' : 'Zodiac sign on your natal chart';
      return <div key={target}><dt className="font-semibold">{chartTargetLabel(target)}</dt><dd className="text-[#c9bfd3]">{detail}</dd></div>;
    })}</dl>
    <button type="button" disabled={busy} onClick={() => onDiscuss(selected)} className="rounded-lg border border-[#d4af37]/60 px-3 py-2 text-[#f2ca50] disabled:opacity-50">{busy ? 'Natally is responding…' : 'Discuss with Natally'}</button>
  </section>;
}
