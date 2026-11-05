import React from 'react';
import {createRoot} from 'react-dom/client';
import {NatallyChatbot} from '../../src/components/NatallyChatbot';
import {initialPresentation} from '../../src/services/presentation';
import {chartFocusKey} from '../../src/services/chartTargets';
import {loadVoiceSettings} from '../../src/services/voiceService';
const chart:any={input:{name:'Recovery fixture',birthDate:'2000-01-01',birthTime:'00:00',latitude:0,longitude:0,timezoneOffset:0},natalBodies:[],aspectChords:[],houseCusps:[],ascFormatted:'test',ascLon:0,mcLon:0};
const returning=new URLSearchParams(location.search).has('returning');
const uid='reading-recovery-fixture-'+(returning?'returning':'fresh');
const historyKey='astrosphere_natally_chat_history_v3:'+encodeURIComponent(uid);
localStorage.setItem(historyKey,JSON.stringify([{id:'init-1',sender:'natally',text:'Welcome fixture',timestamp:'',category:'lore'}]));
function Harness(){const [external,setExternal]=React.useState<any>(returning?null:{title:'Opening',content:'',type:'initial_reading',sender:'user'});return <NatallyChatbot embedded accountUid={uid} isCurrentSession={()=>true} chart={chart} userLore={[]} isOpen isSignedIn presentation={initialPresentation(chartFocusKey(chart))} voiceSettings={{...loadVoiceSettings(),readingAloud:true}} externalReadingToInject={external} onClearExternalReading={()=>setExternal(null)} onClose={()=>{}} onOpen={()=>{}} onSignIn={()=>{}} onAddUserLore={()=>{}} onUpdateVoiceSettings={()=>{}} onSpeechStateChange={()=>{}} onShowTargets={()=>{}} onPresentationAction={()=>{}}/>}
createRoot(document.getElementById('root')!).render(<Harness/>);
