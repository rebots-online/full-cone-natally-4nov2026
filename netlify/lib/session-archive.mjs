import { createHash } from 'node:crypto';
import { BillingError } from './billing-config.mjs';
const fail=(message,status=400)=>{throw new BillingError(message,status);};
export async function grantArchive(store,{receiptId,resourceId,fulfilledAt=Date.now()}) {
 if(!receiptId || !resourceId || !Number.isFinite(Number(fulfilledAt))) fail('Invalid archive grant.');
 const id=createHash('sha256').update(store.uid+'\0'+receiptId).digest('hex');
 const start=new Date(Number(fulfilledAt)),end=new Date(start.getTime()+366*86400000);
 await store.db.query('INSERT INTO session_archives(id,uid,receipt_id,resource_id,fulfilled_at,expires_at) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(receipt_id) DO NOTHING',[id,store.uid,receiptId,resourceId,start,end]);
 return id;
}
export async function archiveFor(store,id) {
 const row=(await store.db.query('SELECT * FROM session_archives WHERE id=$1 AND uid=$2',[id,store.uid])).rows[0];
 if(!row) fail('Session unavailable.',404);
 if(row.deleted_at) fail('Session was deleted.',410);
 if(new Date(row.expires_at).getTime()<=Date.now()) fail('Hosted session access expired.',410);
 return row;
}
export async function consentArchive(store,id,snapshot) {
 await archiveFor(store,id);
 if(!snapshot || typeof snapshot!=='object' || Array.isArray(snapshot) || Buffer.byteLength(JSON.stringify(snapshot))>262144) fail('Invalid chart snapshot.');
 await store.db.query('UPDATE session_archives SET consent_at=COALESCE(consent_at,now()),snapshot=COALESCE(snapshot,$3) WHERE id=$1 AND uid=$2',[id,store.uid,snapshot]);
}
export async function recordExchange(store,{sessionId,requestId,question,answer}) {
 const archive=await archiveFor(store,sessionId);
 if(!archive.consent_at) return false;
 if(typeof requestId!=='string'||requestId.length>128||!requestId||typeof question!=='string'||typeof answer!=='string'||question.length>32000||answer.length>200000) fail('Invalid completed exchange.');
 const count=Number((await store.db.query('SELECT count(*) AS count FROM session_exchanges WHERE session_id=$1',[sessionId])).rows[0].count);
 const prior=(await store.db.query('SELECT request_id FROM session_exchanges WHERE session_id=$1 AND request_id=$2',[sessionId,requestId])).rows[0];
 if(prior)return true;
 if(count>=64) fail('Session storage limit reached.',409);
 await store.db.query('INSERT INTO session_exchanges(session_id,request_id,question,answer) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING',[sessionId,requestId,question,answer]);
 return true;
}
export async function saveAudioChunk(store,id,requestId,chunk,total,mime,data) {
 const archive=await archiveFor(store,id);
 if(!archive.consent_at) fail('Consent is required before recording upload.',403);
 if(!Number.isInteger(chunk)||!Number.isInteger(total)||chunk<0||chunk>=total||total>256||!['audio/wav','audio/webm','audio/ogg','audio/mpeg'].includes(mime)||!Buffer.isBuffer(data)||!data.length||data.length>524288) fail('Invalid audio chunk.');
 const prior=(await store.db.query('SELECT total,mime,data FROM session_audio WHERE session_id=$1 AND request_id=$2 AND chunk=$3',[id,requestId,chunk])).rows[0];
 if(prior){if(prior.total!==total||prior.mime!==mime||!prior.data.equals(data))fail('Recording chunk conflicts with existing data.',409);return;}
 const bytes=Number((await store.db.query('SELECT COALESCE(sum(octet_length(data)),0) AS bytes FROM session_audio WHERE session_id=$1',[id])).rows[0].bytes);
 if(bytes+data.length>256*1024*1024) fail('Session audio storage is full.',413);
 const existing=(await store.db.query('SELECT total,mime FROM session_audio WHERE session_id=$1 AND request_id=$2 LIMIT 1',[id,requestId])).rows[0];
 if(existing&&(existing.total!==total||existing.mime!==mime)) fail('Recording upload conflicts with existing data.',409);
 await store.db.query('INSERT INTO session_audio(session_id,request_id,chunk,total,mime,data) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING',[id,requestId,chunk,total,mime,data]);
}
export async function readArchive(store,id) {
 const archive=await archiveFor(store,id);
 const exchanges=(await store.db.query('SELECT e.*,COALESCE(a.parts,0)=a.total AS audio_ready,a.mime FROM session_exchanges e LEFT JOIN (SELECT request_id,count(*) AS parts,max(total) AS total,max(mime) AS mime FROM session_audio WHERE session_id=$1 GROUP BY request_id) a USING(request_id) WHERE e.session_id=$1 ORDER BY e.created_at,e.request_id',[id])).rows;
 return {archive,exchanges};
}
export async function deleteArchive(store,id) {
 // Owner check remains available after expiry, so deletion never requires renewal.
 const found=(await store.db.query('SELECT id FROM session_archives WHERE id=$1 AND uid=$2',[id,store.uid])).rows[0];
 if(!found) fail('Session unavailable.',404);
 await store.db.query('BEGIN');
 try {
 await store.db.query('DELETE FROM session_exchanges WHERE session_id=$1',[id]);
 const relay=(await store.db.query("SELECT to_regclass('public.billing_inference') AS relation")).rows[0];
 if(relay?.relation)await store.db.query("UPDATE billing_inference SET state=jsonb_build_object('status','expired') WHERE uid=$1 AND state->>'sessionId'=$2",[store.uid,id]);
 await store.db.query('UPDATE session_archives SET snapshot=NULL,deleted_at=COALESCE(deleted_at,now()) WHERE id=$1',[id]);
 await store.db.query('COMMIT');
 } catch(error) {await store.db.query('ROLLBACK');throw error;}
}
