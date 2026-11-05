import { useEffect, useState } from 'react';

/** Decoration slots are independent of the character, narration and durable belongings. */
export const ATELIER_THEMES = [
  { id: 'candlelit', label: 'Candlelit atelier', seasonal: false },
  { id: 'horrorween', label: 'Horrorween', seasonal: true },
] as const;
export type AtelierTheme = typeof ATELIER_THEMES[number]['id'];
const key = (uid:string|null) => 'natally.atelier.theme.v1:' + encodeURIComponent(uid || '__guest__');
const selected = new Map<string,AtelierTheme>();
export function getAtelierTheme(uid:string|null):AtelierTheme {
  const identity=key(uid);if(selected.has(identity))return selected.get(identity)!;
  let theme:AtelierTheme='candlelit';
  try{if(localStorage.getItem(identity)==='horrorween')theme='horrorween';}catch{/* Session preference remains usable. */}
  selected.set(identity,theme);return theme;
}
export function setAtelierTheme(uid:string|null,theme:AtelierTheme):void {
  selected.set(key(uid),theme);
  try{localStorage.setItem(key(uid),theme);}catch{/* A room theme does not gate the conversation. */}
  window.dispatchEvent(new CustomEvent('natally-atelier-theme',{detail:{uid,theme}}));
}
export function useAtelierTheme(uid:string|null):AtelierTheme {
  const [theme,setTheme]=useState(()=>getAtelierTheme(uid));
  useEffect(()=>{setTheme(getAtelierTheme(uid));const update=(event:Event)=>{if((event as CustomEvent).detail.uid===uid)setTheme(getAtelierTheme(uid));};window.addEventListener('natally-atelier-theme',update);return()=>window.removeEventListener('natally-atelier-theme',update);},[uid]);
  return theme;
}
