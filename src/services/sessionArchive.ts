import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type {NatalChartResult} from './ephemeris';
const active=new Map<string,string>();
const responses=new Map<string,{sessionId:string;requestId:string}>();
onAuthStateChanged(auth,user=>{active.clear();responses.clear();if(user)try{const saved=sessionStorage.getItem('natally.archive.'+user.uid);if(saved&&/^[a-f0-9]{64}$/.test(saved))active.set(user.uid,saved);}catch{/* The user can select their session again. */}});
export function activeArchiveSession(uid:string){return auth.currentUser?.uid===uid?active.get(uid):undefined;}
export function bindArchiveResponse(uid:string,requestId:string,text:string,sessionId=activeArchiveSession(uid)){if(auth.currentUser?.uid===uid&&sessionId)responses.set(uid+'\0'+text,{sessionId,requestId});}
export function activateArchiveSession(uid:string,id:string){if(auth.currentUser?.uid===uid){active.set(uid,id);try{sessionStorage.setItem('natally.archive.'+uid,id);}catch{/* In-memory session is still active. */}}}
export function deactivateArchiveSession(uid:string){active.delete(uid);try{sessionStorage.removeItem('natally.archive.'+uid);}catch{/* In-memory selection is cleared. */}}
/** Call after verified settlement and before initial inference, with the checkbox's explicit value. */
export async function preparePurchasedArchive(chart:NatalChartResult,consent:boolean,resourceId?:string):Promise<string|undefined>{
 const owner=auth.currentUser;if(!owner)throw new Error('Sign in to prepare your hosted session.');
 if(!consent){deactivateArchiveSession(owner.uid);return;}
 const result=await archiveRequest();
 const eligible=result.sessions.filter((item:{deleted_at:string|null;expires_at:string;resource_id:string})=>!item.deleted_at&&Date.parse(item.expires_at)>Date.now()&&(!resourceId||item.resource_id===resourceId));
 const session=eligible[0];if(!session)throw new Error('Your hosted session grant is still being reconciled. Your reading is waiting; do not purchase again.');
 await archiveRequest(session.id+'/consent','POST',{consent:true,snapshot:{version:1,calculationEngine:'Swiss Ephemeris',capturedAt:new Date().toISOString(),chart}});
 if(auth.currentUser!==owner)throw new Error('Account changed.');
 activateArchiveSession(owner.uid,session.id);return session.id;
}
export async function uploadArchivedReading(uid:string,text:string,wav:Blob){
 if(auth.currentUser?.uid!==uid)return;
 let bound=responses.get(uid+'\0'+text);
 if(!bound){
  const sessionId=activeArchiveSession(uid);if(!sessionId)return;
  const saved=await archiveRequest(sessionId);
  const {parseNatallyStream}=await import('./natallyChat');
  const chart=saved.archive.snapshot?.chart;
  const matching=saved.exchanges.filter((item:{answer:string})=>item.answer===text||(chart&&parseNatallyStream(item.answer,chart).text===text));
  if(matching.length!==1)return;bound={sessionId,requestId:matching[0].request_id};
 }
 await uploadSessionAudio(bound.sessionId,bound.requestId,wav);
}
export async function archiveRequest(path='',method='GET',body?:unknown,raw=false) {
 const owner=auth.currentUser;if(!owner)throw new Error('Sign in to access your sessions.');
 const base=new URL(String(import.meta.env.VITE_BILLING_API_URL||'https://natally-hosted-chat.netlify.app'));
 if(base.protocol!=='https:')throw new Error('Invalid session service.');
 const token=await owner.getIdToken();if(auth.currentUser!==owner)throw new Error('Account changed.');
 const response=await fetch(new URL('/sessions/'+path,base),{method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),cache:'no-store',credentials:'omit',redirect:'error'});
 if(auth.currentUser!==owner)throw new Error('Account changed.');
 if(!response.ok){const result=await response.json();throw new Error(result.error||'Session unavailable.');}
 return raw?response.blob():response.json();
}
export async function uploadSessionAudio(sessionId:string,requestId:string,wav:Blob) {
 const owner=auth.currentUser;const total=Math.ceil(wav.size/524288);
 if(!total||total>256)throw new Error('Recording exceeds hosted storage limit. Keep the local download.');
 for(let chunk=0;chunk<total;chunk++){
 if(auth.currentUser!==owner)throw new Error('Account changed.');
 const bytes=new Uint8Array(await wav.slice(chunk*524288,(chunk+1)*524288).arrayBuffer());
 let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
 await archiveRequest(sessionId+'/audio','POST',{requestId,chunk,total,mime:wav.type||'audio/wav',data:btoa(binary)});
 }
}
export async function loadSessionAudio(sessionId:string,requestId:string):Promise<Blob>{
 const owner=auth.currentUser,path=sessionId+'/audio/'+encodeURIComponent(requestId);
 const info=await archiveRequest(path);const parts:Blob[]=[];
 if(!Number.isInteger(info.total)||info.total<1||info.total>256)throw new Error('Invalid recording.');
 for(let chunk=0;chunk<info.total;chunk++){
  if(auth.currentUser!==owner)throw new Error('Account changed.');
  parts.push(await archiveRequest(path+'?chunk='+chunk,'GET',undefined,true));
 }
 return new Blob(parts,{type:info.mime});
}
