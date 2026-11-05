import { ASTROLOGY_TOOLS, validToolCall } from '../../netlify/lib/astrology-tools.mjs';
import { loadInferenceKey, loadInferenceKeySource } from './inferenceAccess';
import { createReadingDeadline } from './readingDeadline';
import { activeArchiveSession, bindArchiveResponse } from './sessionArchive';

export interface HostedPayload {
  openingStage?: 'natal' | 'now';
  openingIdentity?: string;
  prompt: string;
  systemInstruction: string;
  history?: Array<{ role: string; content: string }>;
  image?: { data: string; mimeType: string };
  temperature?: number;
  onProgress?: (text: string, model: string) => void;
}

export class HostedAuthenticationError extends Error {
  readonly code = 'auth_required';
  constructor(message = 'Sign in to receive your reading. Your question is kept here.') {
    super(message); this.name = 'HostedAuthenticationError';
  }
}

export type CalculationExecutor = (name: string, args: string) => Promise<string>;

/** A narrow decoding-corruption guard, not a judgement of meaning or style. */
export function hasCorruptReadingText(text: string): boolean {
  return (text.match(/\uFFFD/g)?.length || 0) >= 3;
}

async function readOpenRouterStream(response: Response, progress: (text: string, model: string) => void, current: () => boolean) {
  if (!response.body) throw new Error('The reading stream was empty. Please retry.');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const message: any = { role: 'assistant', content: '' };
  const calls = new Map<number, any>();
  const reasoning = new Map<number, any>();
  let buffer = '', data: string[] = [], model = '', finish: string | null = null, done = false;
  const event = () => {
    if (!data.length) return;
    const raw = data.join('\n'); data = [];
    if (raw === '[DONE]') { done = true; return; }
    const chunk = JSON.parse(raw);
    if (chunk.error) throw new Error('The reading stream was interrupted: ' + (chunk.error.message || 'provider error') + '. Your question is kept here; retry.');
    if (chunk.model) model = chunk.model;
    const choice = chunk.choices?.[0];
    if (!choice) return; // Accounting-only frame.
    if (choice.finish_reason) finish = choice.finish_reason;
    if (finish === 'error') throw new Error('The reading stream was interrupted. Your question is kept here; retry.');
    const delta = choice.delta || {};
    for (const detail of delta.reasoning_details || []) {
      const index = detail.index ?? reasoning.size;
      const previous = reasoning.get(index) || {};
      for (const [key, value] of Object.entries(detail)) previous[key] = ['text', 'data', 'signature'].includes(key) && typeof value === 'string' ? (previous[key] || '') + value : value;
      reasoning.set(index, previous);
    }
    for (const call of delta.tool_calls || []) {
      if (!Number.isSafeInteger(call.index) || call.index < 0 || call.index >= 6) throw new Error('The calculation stream was invalid. Please retry.');
      const previous = calls.get(call.index) || { id: '', type: 'function', function: { name: '', arguments: '' } };
      if (call.id) previous.id = call.id;
      if (call.type) previous.type = call.type;
      previous.function.name += call.function?.name || '';
      previous.function.arguments += call.function?.arguments || '';
      calls.set(call.index, previous);
    }
    if (typeof delta.content === 'string' && delta.content) {
      message.content += delta.content;
      if (hasCorruptReadingText(message.content)) throw new Error('The reading arrived with corrupted text. Your question is kept here; retry.');
      if (message.content.length > 500000) throw new Error('The reading stream exceeded its size allowance. Please retry a shorter question.');
      progress(message.content, model);
    }
  };
  const feed = (text: string) => {
    buffer += text;
    let newline: number;
    while ((newline = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, newline).replace(/\r$/, ''); buffer = buffer.slice(newline + 1);
      if (!line) event();
      else if (line.startsWith('data:')) data.push(line.slice(5).replace(/^ /, ''));
    }
  };
  try {
    while (!done) {
      if (!current()) throw new HostedAuthenticationError('The account or reading access changed.');
      const read = await reader.read();
      if (read.done) { feed(decoder.decode() + '\n\n'); break; }
      feed(decoder.decode(read.value, { stream: true }));
    }
    if (!finish || !['stop', 'tool_calls', 'length', 'function_call'].includes(finish)) throw new Error('The reading stopped before it finished. Your question is kept here; retry.');
    if (calls.size) message.tool_calls = [...calls].sort((a, b) => a[0] - b[0]).map(([, call]) => call);
    if (reasoning.size) message.reasoning_details = [...reasoning].sort((a, b) => a[0] - b[0]).map(([, detail]) => detail);
    return { model, choices: [{ message, finish_reason: finish }] };
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
}

/** Name retained for callers: inference is hosted by OpenRouter, contacted directly. */
export async function completeHosted(payload: HostedPayload, token: string, endpoint: string, execute?: CalculationExecutor, isCurrentSession: () => boolean = () => true) {
  if (!isCurrentSession()) throw new HostedAuthenticationError('The account session changed.');
  if (!token) throw new Error('Check reading access in Profile → Account settings, then retry. Your question is kept here.');
  if (endpoint !== 'https://openrouter.ai/api/v1/chat/completions') throw new Error('The direct OpenRouter endpoint is not configured.');
  const messages: any[] = [
    { role: 'system', content: payload.systemInstruction },
    ...(payload.history || []).map(message => ({ role: message.role === 'model' ? 'assistant' : message.role, content: message.content })),
    { role: 'user', content: payload.image ? [
      { type: 'text', text: payload.prompt },
      { type: 'image_url', image_url: { url: `data:${payload.image.mimeType};base64,${payload.image.data}` } },
    ] : payload.prompt },
  ];
  const toolMessages: any[] = [];
  const maxTokens = Number(import.meta.env.VITE_OPENROUTER_MAX_TOKENS || 16384);
  if (!Number.isSafeInteger(maxTokens) || maxTokens < 4096 || maxTokens > 65536) throw new Error('Invalid OpenRouter output-token configuration.');
  const deadline = AbortSignal.timeout(300000);
  let continuations = 0;
  let partialText = '';
  let continuationModel = 'openrouter/free';
  let requiresReasoning = false;
  const cancellation = new AbortController();
  const progressDeadline = createReadingDeadline();
  const sessionWatch = setInterval(() => { if (!isCurrentSession()) cancellation.abort(); }, 200);
  try {
  for (let round = 0; round < 9; round++) {
    if (!isCurrentSession()) throw new HostedAuthenticationError('The account or reading access changed.');
    const completed = toolMessages.filter(message => message.role === 'tool').length;
    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({
          model: continuationModel, stream: true, messages: [...messages, ...toolMessages], max_tokens: maxTokens,
          reasoning: requiresReasoning ? { effort: 'low' } : { enabled: false },
          temperature: typeof payload.temperature === 'number' && Number.isFinite(payload.temperature)
            ? Math.max(0, Math.min(2, payload.temperature)) : 0.8,
          ...(execute ? { tools: ASTROLOGY_TOOLS, tool_choice: completed >= 6 ? 'none' : 'auto', parallel_tool_calls: false } : {}),
        }),
        signal: AbortSignal.any([deadline, cancellation.signal, progressDeadline.signal]),
      });
    } catch (error) {
      if (!isCurrentSession()) throw new HostedAuthenticationError('The account or reading access changed.');
      throw new Error(error instanceof Error && ['TimeoutError', 'AbortError'].includes(error.name)
        ? 'OpenRouter took too long to answer. Your question is kept here; please retry.'
        : 'Could not reach OpenRouter. Your question is kept here; check your connection and retry.');
    }
    let result: any;
    try { result = response.ok && response.headers.get('content-type')?.includes('text/event-stream')
      ? await readOpenRouterStream(response, (text, model) => { progressDeadline.progress(); payload.onProgress?.(partialText + text, model); }, isCurrentSession)
      : await response.json(); }
    catch (error) {
      if (!isCurrentSession()) throw new HostedAuthenticationError('The account or reading access changed.');
      if (deadline.aborted || (error instanceof Error && ['TimeoutError', 'AbortError'].includes(error.name))) {
        throw new Error('OpenRouter took too long to finish the reading. Your question is kept here; please retry.');
      }
      throw error instanceof Error && !(error instanceof SyntaxError) ? error : new Error('OpenRouter returned an unreadable response. Please retry.');
    }
    if (!isCurrentSession()) throw new HostedAuthenticationError('The account or reading access changed.');
    if (!response.ok || result.error) {
      // Some free-router endpoints require reasoning. Retry that explicit
      // capability rejection once, before any answer content was emitted.
      if (!requiresReasoning && /reasoning.*(?:mandatory|required|cannot be disabled)/i.test(result.error?.message || '')) {
        requiresReasoning = true; round--; continue;
      }
      const retryAfter = response.headers.get('retry-after');
      const providerError = [401, 403].includes(response.status)
        ? 'Reading access could not be verified. Check access in Profile → Account settings, then retry.'
        : response.status === 402
          ? 'Your reading access has no available balance. Check access in Profile → Account settings; your question is kept here.'
          : response.status === 429
            ? `The free OpenRouter models are rate limited. Please retry${retryAfter ? ' after ' + retryAfter + ' (Retry-After)' : ' shortly'}; your question is kept here.`
            : 'OpenRouter could not complete the reading: ' + (result.error?.message || 'HTTP ' + response.status) + '. Please retry.';
      throw new Error(providerError);
    }
    const choice = result.choices?.[0];
    if (!result.model) throw new Error('OpenRouter did not identify the responding model. Please retry.');
    if (typeof choice?.message?.content === 'string' && hasCorruptReadingText(partialText + choice.message.content)) {
      throw new Error('The reading arrived with corrupted text. Your question is kept here; please retry.');
    }
    if (choice?.finish_reason === 'length') {
      if (continuations++ >= 2) throw new Error('This reading exceeded the provider output allowance even after continuing. Retry this part; completed earlier readings are kept.');
      const content = choice.message?.content;
      if (typeof content === 'string' && content.trim()) {
        partialText += content;
        // Do not execute a potentially truncated tool call.
        toolMessages.push({ role: 'assistant', content }, { role: 'user', content: 'Continue the interrupted answer exactly where it stopped, without repeating it or introducing a new reading. Finish the requested interpretation in your own Natally voice, including passage-aligned chart cues.' });
      }
      // Never turn an unidentified/free-router result into a paid model request.
      continuationModel = result.model.endsWith(':free') ? result.model : 'openrouter/free';
      continue;
    }
    const calls = choice?.message?.tool_calls;
    if (calls?.length) {
      if (choice.message.content) partialText += choice.message.content + '\n\n';
      if (!execute || !Array.isArray(calls) || completed + calls.length > 6 || !calls.every(validToolCall) ||
          new Set(calls.map(call => call.id)).size !== calls.length || calls.some(call => toolMessages.some(message => message.tool_call_id === call.id))) throw new Error('Invalid calculation request or calculation limit reached.');
      const results = [];
      for (const call of calls) {
        if (!isCurrentSession()) throw new HostedAuthenticationError('The account or reading access changed.');
        const content = await execute(call.function.name, call.function.arguments);
        if (typeof content !== 'string' || content.length > 24000) throw new Error('Calculation result is too large.');
        results.push({ role: 'tool', tool_call_id: call.id, content });
      }
      toolMessages.push({ ...choice.message, role: 'assistant' }, ...results);
      continue;
    }
    const content = choice?.message?.content;
    if (typeof content !== 'string' || !content.trim()) throw new Error('OpenRouter returned no complete reading. Please retry.');
    payload.onProgress?.(partialText + content, result.model);
    return { text: partialText + content, model: result.model };
  }
  throw new Error('Calculation limit reached. Please narrow the request.');
  } finally { clearInterval(sessionWatch); progressDeadline.dispose(); }
}

export async function requestHostedInference(payload: HostedPayload, execute?: CalculationExecutor, isCurrentSession: () => boolean = () => true) {
  if (!isCurrentSession()) throw new HostedAuthenticationError('The account session changed.');
  const { auth } = await import('./firebase');
  await auth.authStateReady();
  if (!isCurrentSession()) throw new HostedAuthenticationError('The account session changed.');
  const owner = auth.currentUser;
  if (!owner) throw new HostedAuthenticationError();
  const { ensureReadingAccess } = await import('./billingAccess');
  let key: string;
  try { key = await ensureReadingAccess(owner.uid, () => isCurrentSession() && auth.currentUser === owner); }
  catch (error) {
    if (!isCurrentSession() || auth.currentUser !== owner) throw new HostedAuthenticationError('The account session changed.');
    throw Object.assign(new Error(error instanceof Error ? error.message : 'Reading access is unavailable. Your question is kept here.'), { code: 'reading_access_required' });
  }
  const isCurrent = () => isCurrentSession() && auth.currentUser === owner;
  if (import.meta.env.DEV && key !== 'managed-relay' && loadInferenceKeySource(owner.uid) !== 'managed') return completeHosted(payload, key, 'https://openrouter.ai/api/v1/chat/completions', execute, isCurrent);
  return completeManaged(payload, owner, execute, isCurrent);
}

async function completeManaged(payload: HostedPayload, owner: import('firebase/auth').User, execute: CalculationExecutor | undefined, current: () => boolean) {
  const sessionId=activeArchiveSession(owner.uid);
  const base = new URL(String(import.meta.env.VITE_BILLING_API_URL || 'https://natally-hosted-chat.netlify.app'));
  if(base.protocol !== 'https:' || base.username || base.password) throw new Error('Invalid reading service.');
  const fingerprint=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(payload.openingIdentity || JSON.stringify({...payload,onProgress:undefined}))))).map(n=>n.toString(16).padStart(2,'0')).join('');
  const pendingKey='natally-relay-pending:'+owner.uid+':'+fingerprint;
  const requestId = localStorage.getItem(pendingKey) || crypto.randomUUID();
  localStorage.setItem(pendingKey,requestId);
  const cancel = new AbortController();
  const watcher = setInterval(()=>{if(!current())cancel.abort();},200);
  let results: Array<{id:string;content:string}> | undefined;
  try { for(let round=0;round<10;round++) {
    if(!current())throw new HostedAuthenticationError();
    const token=await owner.getIdToken();
    if(!current())throw new HostedAuthenticationError();
    const response=await fetch(new URL('/billing/inference',base),{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({requestId,...(round===0?{payload:{...payload,onProgress:undefined},enableTools:!!execute,openingStage:payload.openingStage,sessionId}:{results})}),signal:AbortSignal.any([cancel.signal,AbortSignal.timeout(250000)]),cache:'no-store',credentials:'omit',redirect:'error'});
    if(!response.ok || !response.body)throw new Error('Reading service unavailable. Your question is kept here.');
    const reader=response.body.getReader(), decoder=new TextDecoder();let buffer='';let terminal:any;
    try { for(;;) {const chunk=await reader.read();if(chunk.done)break;if(!current())throw new HostedAuthenticationError();buffer+=decoder.decode(chunk.value,{stream:true});let end;
      while((end=buffer.indexOf('\n\n'))>=0){const event=buffer.slice(0,end);buffer=buffer.slice(end+2);if(!event.startsWith('data: '))continue;const frame=JSON.parse(event.slice(6));if(frame.error){if(frame.retryNewRequest)localStorage.removeItem(pendingKey);throw new Error(frame.error);}if(frame.progress!==undefined)payload.onProgress?.(frame.progress,frame.model);else terminal=frame;}
    }} finally {await reader.cancel().catch(()=>{});reader.releaseLock();}
    if(terminal?.result){if(!current())throw new HostedAuthenticationError();bindArchiveResponse(owner.uid,requestId,terminal.result.text,sessionId);if(!payload.openingIdentity)localStorage.removeItem(pendingKey);return terminal.result as {text:string;model:string};}
    if(terminal?.calls && execute){results=[];for(const call of terminal.calls){if(!current())throw new HostedAuthenticationError();results.push({id:call.id,content:await execute(call.function.name,call.function.arguments)});}continue;}
    if(terminal?.continue){results=undefined;continue;}
    throw new Error('Reading interrupted before completion. Your question is kept here.');
  }} finally {clearInterval(watcher);}
  throw new Error('Reading exceeded the calculation limit.');
}
