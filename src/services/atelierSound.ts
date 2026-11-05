import { loadVoiceSettings } from './voiceService';
import type { TrinketId } from './atelierMemories';
let effectContext:AudioContext|null=null;
let crunchBuffer:Promise<AudioBuffer>|null=null;
let currentCrunch:AudioBufferSourceNode|null=null;
function loadCrunch(context:AudioContext):Promise<AudioBuffer> {
  if(!crunchBuffer)crunchBuffer=fetch('/atelier/audio/cookie-bite-crunch-v2.mp3').then(response=>{
    if(!response.ok)throw new Error('Cookie sound unavailable');
    return response.arrayBuffer();
  }).then(bytes=>context.decodeAudioData(bytes)).catch(error=>{crunchBuffer=null;throw error;});
  return crunchBuffer;
}
function allowed():boolean {
  if(!loadVoiceSettings().readingAloud || document.visibilityState==='hidden')return false;
  try{return localStorage.getItem('natally.atelier.sound-muted')!=='true';}catch{return false;}
}
/** Call directly from pointer/keyboard gestures, before any delayed collision. */
export function unlockAtelierSound():void {
  if(!allowed())return;
  try {effectContext ||= new AudioContext();void effectContext.resume().catch(()=>{});void loadCrunch(effectContext).catch(()=>{});for(const name of ['glass-shatter','crystal-break','brass-clatter','shelf-wobble','bowlingball'] as FoleyName[])void loadFoley(effectContext,name).catch(()=>{});}catch{/* Interaction remains available without audio. */}
}
type FoleyName = 'glass-shatter'|'crystal-break'|'brass-clatter'|'shelf-wobble'|'bowlingball';
const foleyBuffers = new Map<FoleyName,Promise<AudioBuffer>>();
let currentWobble:AudioBufferSourceNode|null=null;
let wobbleUntil=0;
let breakUntil=0;
function loadFoley(context:AudioContext,name:FoleyName):Promise<AudioBuffer> {
  let pending=foleyBuffers.get(name);
  if(!pending){pending=fetch('/atelier/audio/'+name+'.mp3').then(response=>{
    if(!response.ok)throw new Error('Room sound unavailable');return response.arrayBuffer();
  }).then(bytes=>context.decodeAudioData(bytes)).catch(error=>{foleyBuffers.delete(name);throw error;});foleyBuffers.set(name,pending);}
  return pending;
}
function playFoley(name:FoleyName,gain:number,delay=0,rate=1):void {
  unlockAtelierSound();
  if(!allowed()||!effectContext)return;
  const context=effectContext,requested=performance.now(),startAt=context.currentTime+delay;
  void loadFoley(context,name).then(buffer=>{
    // Never play a late download over a later interaction, or a wobble after a fall.
    if(!allowed()||context.state!=='running'||performance.now()-requested>delay*1000+600||
      ((name==='shelf-wobble'||name==='bowlingball')&&performance.now()<breakUntil))return;
    const source=context.createBufferSource(),volume=context.createGain();
    source.buffer=buffer;source.playbackRate.value=rate;volume.gain.value=gain;
    source.connect(volume);volume.connect(context.destination);
    if(name==='shelf-wobble'||name==='bowlingball'){currentWobble?.stop();currentWobble=source;}
    const muteWatch=window.setInterval(()=>{if(!allowed())source.stop();},60);
    source.onended=()=>{window.clearInterval(muteWatch);source.disconnect();volume.disconnect();if(currentWobble===source)currentWobble=null;};
    source.start(Math.max(context.currentTime,startAt));
  }).catch(()=>{/* Missing Foley stays silent; no synthesized substitute. */});
}
/** Physical crash and settling fragments, aligned with the visible fall. */
export function playAtelierBreak(item:TrinketId):void {
  currentWobble?.stop();currentWobble=null;breakUntil=performance.now()+1800;
  const sound=item==='armillary'?'brass-clatter':['crystal','emerald','rose'].includes(item)?'crystal-break':'glass-shatter';
  playFoley(sound,.9,.49);
}
/** Pointer energy changes contact weight; one short rocking phrase at a time. */
export function playAtelierWobble(item:TrinketId,energy=1):void {
  const now=performance.now();if(now<wobbleUntil||now<breakUntil||!allowed())return;
  wobbleUntil=now+1450;
  const gem=['crystal','emerald','rose'].includes(item);
  playFoley(gem?'shelf-wobble':'bowlingball',Math.min(.65,.25+energy*.075),0,gem?1.04:1);
}
export function playAtelierCrunch():void {
  unlockAtelierSound();
  if(!allowed()||!effectContext)return;
  const context=effectContext;
  void loadCrunch(context).then(buffer=>{
    if(!allowed()||context.state!=='running')return;
    // Each gesture starts one baked Foley bite. Rapid clicks cannot pile up louder copies.
    currentCrunch?.stop();
    const source=context.createBufferSource(),volume=context.createGain();
    source.buffer=buffer;volume.gain.value=.8;source.connect(volume);volume.connect(context.destination);
    currentCrunch=source;
    const muteWatch=window.setInterval(()=>{if(!allowed())source.stop();},100);
    source.onended=()=>{window.clearInterval(muteWatch);source.disconnect();volume.disconnect();if(currentCrunch===source)currentCrunch=null;};
    source.start();
  }).catch(()=>{/* A missing asset stays silent rather than reverting to the rejected percussion. */});
}
