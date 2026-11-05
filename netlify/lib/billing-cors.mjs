const canonical=new Set(['https://natally.robin.mba','http://tauri.localhost','tauri://localhost']);
export function billingOriginAllowed(env,origin) {
  if(typeof origin!=='string')return false;
  if(canonical.has(origin))return true;
  const configured=[env('BILLING_ALLOWED_ORIGIN'),env('BILLING_ALLOWED_ORIGINS')].filter(Boolean).join(',').split(',').map(value=>value.trim()).filter(Boolean);
  if(!configured.includes(origin))return false;
  try {const url=new URL(origin);return url.protocol==='https:' && url.origin===origin && !url.username && !url.password;}catch{return false;}
}
