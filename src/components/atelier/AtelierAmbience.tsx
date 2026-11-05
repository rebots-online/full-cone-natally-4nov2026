import React, { useEffect, useRef, useState } from 'react';
import type { PresentationView } from '../../services/presentation';
import type { ConversationPhase } from './AtelierScene';

export function AtelierAmbience({view,phase}:{view:PresentationView;phase:ConversationPhase}) {
  const [enabled,setEnabled]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [volume,setVolume]=useState(()=>{try{const saved=Number(localStorage.getItem('natally.ambience.volume')??'.3');return Number.isFinite(saved)?Math.max(0,Math.min(1,saved)):.3;}catch{return .3;}});
  const engine=useRef<{context:AudioContext;master:GainNode;gains:GainNode[];sources:AudioBufferSourceNode[]}|null>(null);
  const generation=useRef(0);
  const settings=useRef({view,phase,volume,enabled});settings.current={view,phase,volume,enabled};
  const adjust=()=>{
    const audio=engine.current;if(!audio)return;
    const current=settings.current,now=audio.context.currentTime;
    audio.master.gain.cancelAndHoldAtTime(now);
    audio.master.gain.setTargetAtTime(current.enabled?current.volume*(current.phase==='speaking'?.16:1):0,now,.22);
    audio.gains.forEach((gain,index)=>{gain.gain.cancelAndHoldAtTime(now);gain.gain.setTargetAtTime((index===0)===(current.view==='atelier')?1:0,now,.65);});
  };
  const stop=()=>{generation.current++;const audio=engine.current;engine.current=null;if(audio){audio.sources.forEach(source=>{try{source.stop();}catch{}});void audio.context.close();}setEnabled(false);setLoading(false);};
  useEffect(()=>{adjust();},[view,phase,volume,enabled]);
  useEffect(()=>{
    const visibility=()=>{const audio=engine.current;if(!audio)return;if(document.hidden)void audio.context.suspend();else if(settings.current.enabled)void audio.context.resume().catch(()=>setError('Tap Ambience to resume sound.'));};
    document.addEventListener('visibilitychange',visibility);
    return()=>{document.removeEventListener('visibilitychange',visibility);generation.current++;const audio=engine.current;engine.current=null;if(audio)void audio.context.close();};
  },[]);
  const start=async()=>{
    if(engine.current){stop();return;}
    const ticket=++generation.current;setError('');setLoading(true);
    try{
      const context=new AudioContext(),master=context.createGain();master.gain.value=0;master.connect(context.destination);
      const audio={context,master,gains:[] as GainNode[],sources:[] as AudioBufferSourceNode[]};engine.current=audio;
      await context.resume();
      const buffers=await Promise.all(['workshop-ambience','chart-ambience'].map(async name=>{const response=await fetch('/atelier/audio/'+name+'.mp3');if(!response.ok)throw new Error('The soundscape could not load.');return context.decodeAudioData(await response.arrayBuffer());}));
      if(ticket!==generation.current)return;
      buffers.forEach((buffer,index)=>{const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;source.loop=true;gain.gain.value=(index===0)===(settings.current.view==='atelier')?1:0;source.connect(gain);gain.connect(master);source.start();audio.sources.push(source);audio.gains.push(gain);});
      setEnabled(true);setLoading(false);
      if(document.hidden)await context.suspend();
    }catch{if(ticket!==generation.current)return;stop();setError('Ambience could not start. Tap to retry.');}
  };
  return <div className="atelier-ambience">
    <button type="button" aria-pressed={enabled} onClick={()=>void start()}>{loading?'Cancel ambience loading':enabled?'Ambience on':'Ambience off'}</button>
    {enabled&&<label>Volume <input aria-label="Ambience volume" type="range" min="0" max="1" step=".05" value={volume} onChange={event=>{const next=Number(event.target.value);setVolume(next);try{localStorage.setItem('natally.ambience.volume',String(next));}catch{}}}/></label>}
    {error&&<span role="status">{error}</span>}
  </div>;
}
