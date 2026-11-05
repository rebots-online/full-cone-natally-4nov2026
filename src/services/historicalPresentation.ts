import type { NatalChartResult } from './ephemeris';
import { chartFocusKeyMatches, chartTargets } from './chartTargets';
import type { PresentationCue } from './presentation';
import { withReadingCamera } from './presentation';

export interface RecoveredReference { start:number; end:number; target:string }
export interface HistoricalFocus { cues:PresentationCue[]; references:RecoveredReference[]; notice:string|null }
const escape = (text:string) => text.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const offChart = /\b(?:transit(?:ing|s)?|current(?:ly)?|today|tonight|tomorrow|synastry|partner|their|his|her)\b/i;

/** Recover named natal subjects, never an observation date or a moving planet's position. */
export function recoverHistoricalFocus(text:string, chart:NatalChartResult, savedKey:unknown, explicit:PresentationCue[], category?:string, useObservation=false):HistoricalFocus {
  if (savedKey && !chartFocusKeyMatches(savedKey,chart)) return {cues:[],references:[],notice:'This reading belongs to different natal coordinates. Its original chart is needed to replay its highlights.'};
  const natalChart={...chart,currentSky:undefined};
  const inventory=chartTargets(useObservation?chart:natalChart);
  const names=chartTargets(natalChart).filter(name=>!chart.aspectChords.some(aspect=>aspect.name===name));
  const pattern=new RegExp('\\b('+names.sort((a,b)=>b.length-a.length).map(escape).join('|')+')\\b','gi');
  // Spaces preserve offsets through Markdown without rewriting saved text or speech.
  const plain=text.replace(/[*_`#]/g,' ');
  const references:RecoveredReference[]=[];
  const recovered:PresentationCue[]=[];
  const bodyNames=new Set([...chart.natalBodies.map(body=>body.name),...(useObservation?chart.currentSky?.bodies.map(body=>body.target)||[]:[])]);
  let omittedSky=false;
  for(const paragraph of plain.matchAll(/[^\n]+(?:\n(?!\s*\n)[^\n]+)*/g)) {
    const paragraphStart=paragraph.index!;
    const foreignContext=category==='horoscope'||category==='synastry'||offChart.test(paragraph[0]);
    const partnerContext=category==='synastry'||/\b(?:partner|their|his|her)\b/i.test(paragraph[0]);
    for(const sentence of paragraph[0].matchAll(/[^.!?\n]+(?:[.!?]+|$)/g)) {
      const offset=paragraphStart+sentence.index!;
      const end=offset+sentence[0].length;
      const subjects:RecoveredReference[]=[];
      for(const mention of sentence[0].matchAll(pattern)) {
        const prefix=sentence[0].slice(0,mention.index!).slice(-65);
        const directlyForeign=/\b(?:transiting|transit|current|now|their|his|her|partner(?:'s)?)\s+(?:natal\s+)?$/i.test(prefix);
        const explicitlyYours=/\b(?:your|primary)(?:\s+natal)?(?:\s+(?:Aries|Taurus|Gemini|Cancer|Leo|Virgo|Libra|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces))?\s+$/i.test(prefix);
        const explicitlyNatal=/\bnatal(?:\s+(?:Aries|Taurus|Gemini|Cancer|Leo|Virgo|Libra|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces))?\s+$/i.test(prefix)&&!partnerContext;
        const name=names.find(name=>name.toLowerCase()===mention[0].toLowerCase())!;
        const isBody=chart.natalBodies.some(body=>body.name===name);
        const current=useObservation&&!partnerContext&&!explicitlyYours&&!explicitlyNatal&&(/\b(?:transiting|transit|current|now)\s+$/i.test(prefix)||category==='horoscope')?chart.currentSky?.bodies.find(body=>body.name===name):undefined;
        if(isBody&&!current&&(directlyForeign||(foreignContext&&!explicitlyYours&&!explicitlyNatal))){omittedSky=true;continue;}
        const target=current?.target||name;
        const ref={start:offset+mention.index!,end:offset+mention.index!+mention[0].length,target};
        subjects.push(ref);references.push(ref);
      }
      const targets=[...new Set(subjects.map(ref=>ref.target))];
      const bodies=subjects.filter(ref=>bodyNames.has(ref.target));
      for(let i=0;i<bodies.length-1;i++) {
        const left=bodies[i],right=bodies[i+1];
        const relation=plain.slice(left.end,right.start);
        if(relation.length>100||/\b(?:not|never|no|without)\b/i.test(relation))continue;
        const relationMatch=/\b(?:square[sd]?|trine[sd]?|sextile[sd]?|oppos(?:ition|ite|es?)|conjunct(?:ion|s)?)\b/i.exec(relation);
        const type=relationMatch?.[0].toLowerCase();
        if(!type)continue;
        const canonical=type.startsWith('oppos')?'opposition':type.startsWith('conjunct')?'conjunction':type.startsWith('square')?'square':type.startsWith('trine')?'trine':'sextile';
        const aspect=[...chart.aspectChords,...(useObservation?chart.currentSky?.aspects||[]:[])].find(a=>a.type.toLowerCase()===canonical&&((a.from===left.target&&a.to===right.target)||(a.to===left.target&&a.from===right.target))&&inventory.includes(a.name));
        if(aspect){targets.unshift(aspect.name);references.push({start:left.end+relationMatch!.index,end:left.end+relationMatch!.index+relationMatch![0].length,target:aspect.name});}
      }
      // An authored cue in this passage has priority over recovered prose references.
      const authoredHere=explicit.some(c=>c.offset>=offset&&c.offset<end&&(c.action.type==='focus'||c.action.type==='clear'));
      if(!authoredHere&&(targets.length||foreignContext))recovered.push({offset,action:targets.length?{type:'focus',targets:[...new Set(targets)].slice(0,6)}:{type:'clear'}});
    }
  }
  const cues=withReadingCamera(text,[...recovered,...explicit].sort((a,b)=>a.offset-b.offset),references);
  return {cues,references,notice:useObservation?null:recovered.some(c=>c.action.type==='focus')
    ? 'Highlights recovered from named natal references in the saved text; relationship lines appear only for aspects calculated in this natal chart.'+(omittedSky?' Historical transit and partner positions are unavailable; only explicit natal counterparts are shown.':'')
    : omittedSky?'Historical sky positions were not saved. Explicit natal counterparts can be shown; old transit references are not mapped onto today’s sky.':null};
}
