import React,{useEffect,useState} from 'react';
import {archiveRequest,activateArchiveSession,deactivateArchiveSession,loadSessionAudio} from '../services/sessionArchive';
import {auth} from '../services/firebase';
import {onAuthStateChanged} from 'firebase/auth';
import {Astrolabe3D} from './Astrolabe3D';
import {NatallyAvatar} from './NatallyAvatar';
import type {NatalChartResult} from '../services/ephemeris';
type Session={id:string;resource_id:string;expires_at:string;deleted_at:string|null};
export function SessionArchive({chart}:{chart:NatalChartResult}) {
 const [sessions,setSessions]=useState<Session[]>([]),[selected,setSelected]=useState<any>(null),[error,setError]=useState(''),[audio,setAudio]=useState('');
 const [planet,setPlanet]=useState<string|null>(null),[speaking,setSpeaking]=useState(false);
 useEffect(()=>onAuthStateChanged(auth,()=>{setSelected(null);setAudio('');setSessions([]);}),[]);
 useEffect(()=>{let current=true;void archiveRequest().then(r=>{if(current)setSessions(r.sessions);}).catch(e=>{if(current)setError(e.message);});return()=>{current=false;};},[]);
 useEffect(()=>()=>{if(audio)URL.revokeObjectURL(audio);},[audio]);
 const run=async(action:()=>Promise<void>)=>{setError('');try{await action();}catch(e){setError(e instanceof Error?e.message:'Session unavailable.');}};
 return <section aria-label="Saved sessions"><h2>Your saved sessions</h2>{error&&<p role="alert">{error}</p>}
 {!selected?sessions.filter(s=>!s.deleted_at).map(s=><button key={s.id} onClick={()=>void run(async()=>setSelected(await archiveRequest(s.id)))}>{s.resource_id} · hosted until {new Date(s.expires_at).toLocaleDateString()}</button>):<>
 <button onClick={()=>{setSelected(null);setAudio('');}}>Back to sessions</button>
 {!selected.archive.consent_at?<><p>With your consent, this session stores your chart, future completed questions and answers, and voice recordings on our server until {new Date(selected.archive.expires_at).toLocaleDateString()}. You can delete them here. Downloads remain yours.</p><button onClick={()=>void run(async()=>{await archiveRequest(selected.archive.id+'/consent','POST',{consent:true,snapshot:{version:1,calculationEngine:'Swiss Ephemeris',capturedAt:new Date().toISOString(),chart}});if(auth.currentUser)activateArchiveSession(auth.currentUser.uid,selected.archive.id);setSelected(await archiveRequest(selected.archive.id));})}>Consent and save this session</button></>:<button onClick={()=>{if(auth.currentUser)activateArchiveSession(auth.currentUser.uid,selected.archive.id);}}>Continue saving to this session</button>}
 {selected.archive.snapshot?.chart&&<><div style={{height:300,position:'relative'}}><Astrolabe3D chart={selected.archive.snapshot.chart} isSpinning={false} resetTrigger={0} selectedPlanetName={planet} onSelectPlanet={setPlanet}/></div>{planet&&<p>{selected.archive.snapshot.chart.natalBodies.find((body:any)=>body.name===planet)?.detail}</p>}</>}
 <h3>Your questions and responses</h3>
 {selected.exchanges.map((exchange:any)=><article key={exchange.request_id}><h4>{exchange.question}</h4><p style={{whiteSpace:'pre-wrap'}}>{exchange.answer}</p>{exchange.audio_ready&&<button onClick={()=>void run(async()=>{const blob=await loadSessionAudio(selected.archive.id,exchange.request_id);setAudio(URL.createObjectURL(blob));})}>Replay saved Natally recording</button>}</article>)}
 {audio&&<><NatallyAvatar size={100} isAnimated isSpeaking={speaking}/><audio controls autoPlay src={audio} onPlay={()=>setSpeaking(true)} onPause={()=>setSpeaking(false)} onEnded={()=>setSpeaking(false)}/></>}
 <button onClick={()=>void run(async()=>{await archiveRequest(selected.archive.id,'DELETE');if(auth.currentUser)deactivateArchiveSession(auth.currentUser.uid);setSessions(s=>s.filter(item=>item.id!==selected.archive.id));setSelected(null);setAudio('');})}>Delete this hosted session and recordings</button>
 </>}
 </section>;
}
