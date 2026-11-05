// One live inference per account across chat and the readings dialog.
// A superseded session may release its slot without allowing its response to apply.
const turns = new Map<string, { token:symbol; active:()=>boolean }>();
export async function withInferenceTurn<T>(uid:string|undefined, active:(()=>boolean)|undefined, run:()=>Promise<T>):Promise<T> {
  const key = uid || 'anonymous';
  const previous = turns.get(key);
  if (previous?.active()) throw new Error('Natally is already answering. Let that response finish, then retry this question.');
  const token = Symbol(key);
  turns.set(key,{token,active:active ?? (()=>true)});
  try { return await run(); }
  finally { if (turns.get(key)?.token === token) turns.delete(key); }
}
