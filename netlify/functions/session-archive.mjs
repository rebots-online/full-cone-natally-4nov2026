import { authenticate } from '../lib/billing-identity.mjs';
import { withAccount } from '../lib/billing-store.mjs';
import { billingOriginAllowed } from '../lib/billing-cors.mjs';
import { archiveFor,consentArchive,saveAudioChunk,readArchive,deleteArchive } from '../lib/session-archive.mjs';
export default async function handler(request) {
 const env=name=>globalThis.Netlify?.env.get(name)||process.env[name]||'';
 const origin=request.headers.get('origin');
 const allowed=billingOriginAllowed(env,origin);
 const headers={'Cache-Control':'private, no-store',Vary:'Origin','Content-Type':'application/json',...(allowed?{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'Authorization, Content-Type','Access-Control-Allow-Methods':'GET, POST, DELETE, OPTIONS'}:{})};
 const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
 if(origin&&!allowed) return reply({error:'Origin unavailable.'},403);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
 try {
 const user=await authenticate(request,env);
 const url=new URL(request.url);
 const parts=url.pathname.split('/').filter(Boolean).slice(1);
 return await withAccount(env,user.uid,async store=>{
 if(!parts.length&&request.method==='GET')return reply({sessions:(await store.db.query('SELECT id,resource_id,fulfilled_at,expires_at,consent_at,deleted_at FROM session_archives WHERE uid=$1 ORDER BY fulfilled_at DESC',[user.uid])).rows});
 const [id,action,requestId]=parts;
 if(!/^[a-f0-9]{64}$/.test(id||''))return reply({error:'Invalid session.'},400);
 if(request.method==='DELETE'&&!action){await deleteArchive(store,id);return reply({deleted:true});}
 if(request.method==='GET'&&!action)return reply(await readArchive(store,id));
 if(request.method==='GET'&&action==='audio'){
 await archiveFor(store,id);
 const info=(await store.db.query('SELECT count(*) AS parts,max(total) AS total,max(mime) AS mime FROM session_audio WHERE session_id=$1 AND request_id=$2',[id,requestId])).rows[0];
 if(!info.total||Number(info.parts)!==info.total)return reply({error:'Recording upload incomplete.'},409);
 if(!url.searchParams.has('chunk'))return reply({total:info.total,mime:info.mime});
 const chunk=Number(url.searchParams.get('chunk'));
 if(!Number.isInteger(chunk)||chunk<0||chunk>=info.total)return reply({error:'Invalid recording chunk.'},400);
 const row=(await store.db.query('SELECT data FROM session_audio WHERE session_id=$1 AND request_id=$2 AND chunk=$3',[id,requestId,chunk])).rows[0];
 return new Response(row.data,{headers:{...headers,'Content-Type':info.mime}});
 }
 if(request.method!=='POST')return reply({error:'Route unavailable.'},404);
 const reader=request.body?.getReader();let size=0;const chunks=[];
 if(reader)try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>750000)return reply({error:'Upload too large.'},413);chunks.push(value);}}finally{await reader.cancel().catch(()=>{});}
 const body=JSON.parse(Buffer.concat(chunks).toString()||'{}');
 if(action==='consent'&&body.consent===true){await consentArchive(store,id,body.snapshot);return reply({saved:true});}
 if(action==='audio'){
 await saveAudioChunk(store,id,body.requestId,body.chunk,body.total,body.mime,Buffer.from(body.data||'','base64'));return reply({saved:true});
 }
 return reply({error:'Route unavailable.'},404);
 });
 }catch(error){return reply({error:error.status?error.message:'Session service unavailable. Your local recording is unchanged.'},error.status||503);}
}
export const config={path:'/sessions/*'};
