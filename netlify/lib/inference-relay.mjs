import { BillingError } from './billing-config.mjs';
import { ASTROLOGY_TOOLS, validToolCall } from './astrology-tools.mjs';
import { managedAccess, managedBearer } from './billing-access.mjs';
import { validUuid } from './billing-commerce.mjs';

async function archiveAnswer(store,id,state) {
  if(!state.sessionId || state.archived)return;
  try {
    const {recordExchange}=await import('./session-archive.mjs');
    state.archived=await recordExchange(store,{sessionId:state.sessionId,requestId:id,question:state.question,answer:state.result.text,openingStage:state.openingLedger?state.openingStage:undefined});
    await store.saveInference(id,state);
  } catch { /* Result remains durable; same-request replay retries archive only. */ }
}

// The account lock is held through provider streaming and durable completion.
export async function relayTurn(env, store, snapshot, body, signal, emit, fetcher = fetch) {
  if (!validUuid(body.requestId)) throw new BillingError('Invalid reading identity.',400);
  await store.expireInference?.();
  let state = await store.inference(body.requestId);
  const openingStage=state ? state.openingStage : body.openingStage;
  if(openingStage && !['natal','now'].includes(openingStage))throw new BillingError('Invalid opening stage.',400);
  let openingLedger=state ? state.openingLedger===true : !!openingStage;
  const settleTurn=async action=>{
    if(openingLedger) {
      const result=await store.opening(body.requestId,action,openingStage);
      if(action!=='reserve'||result!=='exhausted')return result;
      // Shared prepaid access can fund an opening without buying a bundle.
      openingLedger=false;
    }
    return store.turn(body.requestId,action);
  };
  if(state?.status==='expired')throw new BillingError('The temporary replay expired. Open your saved session or start a new request.',410);
  if (state?.status === 'complete') { await settleTurn('complete'); await archiveAnswer(store,body.requestId,state); emit({result:state.result}); return; }
  if (state?.status === 'uncertain') throw new BillingError('Previous provider request needs reconciliation; do not purchase again.',409);
  if (state?.status === 'failed') throw new BillingError('This reading failed. Start a new request.',422);
  if (!Object.hasOwn(snapshot.capabilities,'reading')) throw new BillingError('Reading access required.',403);
  const access = await managedAccess(env,store,snapshot);
  if (access.state !== 'ready') throw new BillingError('Reading access unavailable.',402);
  if (!state) {
    const p = body.payload;
    if (!p || typeof p.prompt !== 'string' || !p.prompt.trim() || p.prompt.length>24000 || typeof p.systemInstruction !== 'string' || p.systemInstruction.length>64000) throw new BillingError('Invalid reading request.',400);
    if(p.image && (!['image/png','image/jpeg','image/webp'].includes(p.image.mimeType)||typeof p.image.data!=='string'||p.image.data.length>700000||!/^[A-Za-z0-9+/]+={0,2}$/.test(p.image.data)))throw new BillingError('Invalid reading image.',400);
    if (p.history && (!Array.isArray(p.history) || p.history.length>100 || p.history.some(m=>!['user','assistant','model'].includes(m.role)||typeof m.content!=='string'||m.content.length>32000))) throw new BillingError('Invalid history.',400);
    if(body.sessionId && (typeof body.sessionId!=='string'||body.sessionId.length>128))throw new BillingError('Invalid session.',400);
    if (await settleTurn('reserve') !== 'reserved') throw new BillingError('Reading allowance exhausted.',402);
    state={status:'ready',payloadExpiresAt:Date.now()+86400000,sessionId:body.sessionId,question:p.prompt,round:0,text:'',tools:0,messages:[{role:'system',content:p.systemInstruction},...(p.history||[]).map(m=>({role:m.role==='model'?'assistant':m.role,content:m.content})),{role:'user',content:p.image?[{type:'text',text:p.prompt},{type:'image_url',image_url:{url:`data:${p.image.mimeType};base64,${p.image.data}`}}]:p.prompt}],enableTools:!!body.enableTools};
  } else if (state.status === 'tools') {
    const results=body.results;
    if(results===undefined){emit({calls:state.messages.at(-1).tool_calls});return;}
    if (!Array.isArray(results)||results.length!==state.pending.length||new Set(results.map(r=>r.id)).size!==results.length||results.some(r=>!state.pending.includes(r.id)||typeof r.content!=='string'||r.content.length>24000)) throw new BillingError('Invalid calculation results.',400);
    state.messages.push(...results.map(r=>({role:'tool',tool_call_id:r.id,content:r.content})));state.pending=[];
  }
  state.openingStage=openingStage;
  state.openingLedger=openingLedger;
  if (state.round>=9) {state.status='failed';await store.saveInference(body.requestId,state);await settleTurn('release');throw new BillingError('Calculation limit reached.',400);}
  state.status='uncertain'; state.round++; await store.saveInference(body.requestId,state);
  try {
    const bearer=await managedBearer(env,store);
    const maxTokens=Number(env('OPENROUTER_RELAY_MAX_TOKENS')||16384);
    if (!Number.isSafeInteger(maxTokens)||maxTokens<256||maxTokens>32768) throw new BillingError('Invalid inference output limit.');
    const providerDeadline=AbortSignal.timeout(42000);
    const dispatch=model=>fetcher('https://openrouter.ai/api/v1/chat/completions',{method:'POST',headers:{Authorization:'Bearer '+bearer,'Content-Type':'application/json'},body:JSON.stringify({model,stream:true,messages:state.messages,max_tokens:maxTokens,...(state.enableTools?{tools:ASTROLOGY_TOOLS,tool_choice:state.tools>=6?'none':'auto',parallel_tool_calls:false}:{})}),signal:AbortSignal.any([signal,providerDeadline]),redirect:'error'});
    let response=await dispatch('openrouter/free');
    const fallback=env('OPENROUTER_RELAY_PAID_MODEL');
    if([429,503].includes(response.status) && fallback && /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._:-]+$/.test(fallback) && fallback!=='openrouter/free') {
      await response.body?.cancel();response=await dispatch(fallback);
    }
    if (!response.ok) throw new BillingError(response.status===429?'Provider capacity is busy. Your turn was retained.':'Provider could not complete the reading.',response.status===429?429:503);
    if (!response.body) throw new BillingError('Empty provider stream.');
    const reader=response.body.getReader(),decoder=new TextDecoder(),calls=new Map(),reasoning=new Map();
    let buffer='',text='',model='',finish='';
    try { for (;;) {
      const chunk=await reader.read(); if(chunk.done)break; buffer+=decoder.decode(chunk.value,{stream:true});if(buffer.length>2000000)throw new BillingError('Provider frame too large.');let pos;
      while((pos=buffer.indexOf('\n'))>=0) {
        const line=buffer.slice(0,pos).trim();buffer=buffer.slice(pos+1);
        if(!line.startsWith('data:')||line.slice(5).trim()==='[DONE]')continue;
        const frame=JSON.parse(line.slice(5));if(frame.error)throw new BillingError('Provider stream interrupted.');
        model=frame.model||model;const choice=frame.choices?.[0];if(!choice)continue;
        finish=choice.finish_reason||finish;const delta=choice.delta||{};
        for(const detail of delta.reasoning_details||[]) {
          const index=detail.index??reasoning.size,previous=reasoning.get(index)||{};
          for(const [key,value] of Object.entries(detail))previous[key]=['text','data','signature'].includes(key)&&typeof value==='string'?(previous[key]||'')+value:value;
          reasoning.set(index,previous);
          if(reasoning.size>100 || JSON.stringify([...reasoning.values()]).length>500000)throw new BillingError('Provider reasoning too large.');
        }
        if(typeof delta.content==='string') {text+=delta.content;if(text.length>500000||(text.match(/\uFFFD/g)||[]).length>=3)throw new BillingError('Invalid provider output.');emit({progress:state.text+text,model});}
        for(const call of delta.tool_calls||[]) {
          if(!Number.isInteger(call.index)||call.index<0||call.index>5)throw new BillingError('Invalid tool index.');
          const c=calls.get(call.index)||{id:'',type:'function',function:{name:'',arguments:''}};
          c.id=call.id||c.id;c.function.name+=call.function?.name||'';c.function.arguments+=call.function?.arguments||'';calls.set(call.index,c);
        }
      }
    }} catch(error) {
      // Continue clean partial prose in another bounded function invocation.
      // Never execute partial tools or treat user cancellation as completion.
      if(text.trim() && model && !calls.size && (providerDeadline.aborted || signal.reason?.name==='TimeoutError')) finish='length';
      else throw error;
    } finally {await reader.cancel().catch(()=>{});reader.releaseLock();}
    if(!model||!['stop','tool_calls','length'].includes(finish))throw new BillingError('Provider response incomplete.');
    state.text+=text;
    if(calls.size) {
      const list=[...calls.values()];
      if(!state.enableTools||state.tools+list.length>6||!list.every(validToolCall)||new Set(list.map(c=>c.id)).size!==list.length)throw new BillingError('Invalid calculation request.');
      state.tools+=list.length;state.messages.push({role:'assistant',content:text,tool_calls:list,...(reasoning.size?{reasoning_details:[...reasoning.values()]}:{})});state.expiresAt=Date.now()+600000;state.status='tools';state.pending=list.map(c=>c.id);
      await store.saveInference(body.requestId,state);emit({calls:list});return;
    }
    if(finish==='length') {state.messages.push({role:'assistant',content:text},{role:'user',content:'Continue exactly where the answer stopped without repetition.'});state.expiresAt=Date.now()+600000;state.status='ready';await store.saveInference(body.requestId,state);emit({continue:true});return;}
    if(!state.text.trim())throw new BillingError('Provider returned no reading.');
    state.status='complete';state.result={text:state.text,model};
    await store.saveInference(body.requestId,state);await settleTurn('complete');await archiveAnswer(store,body.requestId,state);emit({result:state.result});
  } catch(error) {
    if(state.status!=='complete') {state.status='failed';await store.saveInference(body.requestId,state);await settleTurn('release');}
    throw error;
  }
}
