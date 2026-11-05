import React, { useEffect, useId, useRef, useState } from 'react';
import { playAtelierCrunch, unlockAtelierSound } from '../../services/atelierSound';
import type { AtelierTheme } from '../../services/atelierTheme';
const FRESH_COOKIES=[{x:1340,y:1110,bites:0},{x:1620,y:1125,bites:0},{x:1900,y:1100,bites:0}];
/** Seasonal set dressing occupies its own layer; it never resets the room's belongings. */
export function AtelierSeason({theme,accountUid}:{theme:AtelierTheme;accountUid:string|null}) {
  const id=useId().replace(/:/g,'');
  const [cookies,setCookies]=useState(()=>FRESH_COOKIES.map(cookie=>({...cookie})));
  const [held,setHeld]=useState<number|null>(null);
  const [announcement,setAnnouncement]=useState('');
  const drag=useRef<{index:number;x:number;y:number;startX:number;startY:number;scaleX:number;scaleY:number;moved:boolean}|null>(null);
  useEffect(()=>{setCookies(FRESH_COOKIES.map(cookie=>({...cookie})));setHeld(null);},[accountUid]);
  useEffect(()=>{
    // Let the parent restore its saved inset and install its shelf-focus listener first.
    const frame=requestAnimationFrame(()=>window.dispatchEvent(new CustomEvent('natally-atelier-shelf-focus',{detail:{x:1620,y:1149}})));
    return()=>cancelAnimationFrame(frame);
  },[theme,accountUid]);
  const halloween=theme==='horrorween', christmas=theme==='christmas';
  const cookieName=halloween?'Pumpkin cookie':christmas?'Xmas cookie':'Chocolate chip cookie';
  const sign=halloween?'FREE HALLOWEEN COOKIES':christmas?'FREE XMAS COOKIES':'FREE COOKIES';
  const bite=()=>{if(held===null)return;playAtelierCrunch();const bites=cookies[held].bites+1;setCookies(previous=>previous.map((cookie,index)=>index===held?{...cookie,bites}:cookie));setAnnouncement(bites===4?'The last bite. Just a few crumbs.':`Crunch. ${4-bites} bites left.`);if(bites===4)setHeld(null);};
  return <>
    <svg className="atelier-season" viewBox="0 0 2048 1280" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={id+'-pumpkin'}><stop stopColor="#f7b23c"/><stop offset=".55" stopColor="#b85416"/><stop offset="1" stopColor="#44200e"/></radialGradient>
        <radialGradient id={id+'-lantern'}><stop stopColor="#ffb63a" stopOpacity=".6"/><stop offset="1" stopColor="#ff9420" stopOpacity="0"/></radialGradient>
        {cookies.map((cookie,index)=><mask key={index} id={id+'-cookie-'+index}><circle r="43" fill="white"/>{Array.from({length:cookie.bites},(_,biteIndex)=><g key={biteIndex} transform={'rotate('+biteIndex*85+')'} fill="black"><circle cx="35" cy="-24" r="25"/><circle cx="13" cy="-39" r="13"/><circle cx="44" cy="-4" r="14"/></g>)}</mask>)}
      </defs>
      {halloween&&[false,true].map(right=><g key={String(right)} transform={right?'translate(2048 0) scale(-1 1)':undefined} fill="none" stroke="#dfd4d5" strokeWidth="1.8" opacity=".64"><path d="M38 45L460 44M38 45L410 190M38 45L302 323M38 45L155 385M38 45L37 423"/>{[.25,.5,.75,1].map(scale=><path key={scale} transform={'translate(38 45) scale('+scale+')'} d="M422 0Q342 40 372 145Q278 132 264 278Q153 212 117 340Q43 276-1 378"/>)}<path d="M240 120V262"/><ellipse cx="240" cy="270" rx="9" ry="12" fill="#342431" stroke="#ad9da9"/><path d="M234 264L221 253M246 264L259 253M231 272L217 274M249 272L263 274M234 278L222 291M246 278L259 291"/></g>)}
      {halloween&&[[220,1020,1],[1840,915,.8]].map(([x,y,scale])=><g key={x} transform={'translate('+x+' '+y+') scale('+scale+')'}>
        <ellipse className="atelier-pumpkin-light" rx="180" ry="150" fill={'url(#'+id+'-lantern)'}/>
        <ellipse cy="73" rx="93" ry="15" fill="#140906" opacity=".8"/>
        <path d="M-5-57Q-16-86 7-91L20-83Q3-77 12-58" fill="#786138" stroke="#302d14" strokeWidth="4"/>
        <ellipse rx="89" ry="70" fill={'url(#'+id+'-pumpkin)'} stroke="#632811" strokeWidth="3"/>
        <g fill="none" stroke="#6f2a0b" strokeWidth="3" opacity=".5"><ellipse rx="58" ry="70"/><ellipse rx="28" ry="70"/></g>
        <g className="atelier-pumpkin-face" fill="#ffdc76" stroke="#4e220c" strokeWidth="5"><path d="M-61-10L-22-24L-31 8ZM61-10L22-24L31 8ZM-11 16L0-2L11 16Z"/><path d="M-56 29L-23 39L-18 29L0 44L20 29L26 39L56 29Q29 78 0 61Q-29 78-56 29Z"/></g>
      </g>)}
      <ellipse cx="1620" cy="1149" rx="354" ry="40" fill="#573a38" stroke="#d3a16e" strokeWidth="5"/>
      {cookies.map((cookie,index)=><g key={index} transform={'translate('+cookie.x+' '+cookie.y+')'} className="atelier-cookie" data-held={held===index}>
        {cookie.bites<4?<g mask={'url(#'+id+'-cookie-'+index+')'}><circle r="43" fill="#a95022" stroke="#e0a356" strokeWidth="6"/><circle r="35" fill="#e9b579" stroke="#d58441" strokeWidth="4"/>{halloween?<path d="M-25-8L-13-23L-5-7ZM25-8L13-23L5-7ZM-23 12Q0 33 23 12L12 14L8 7L-2 18L-12 7L-14 14Z" fill="#583226"/>:christmas?<g stroke="#fff4dc" strokeWidth="6" strokeLinecap="round"><path d="M0-27V27M-24-14L24 14M-24 14L24-14"/><circle r="5" fill="#bb3933" stroke="none"/></g>:<g fill="#5b3024"><circle cx="-14" cy="-13" r="6"/><circle cx="15" cy="-8" r="5"/><circle cx="-6" cy="14" r="6"/><circle cx="20" cy="19" r="4"/></g>}<circle cx="-26" cy="22" r="3" fill="#9f652b"/></g>:<g fill="#e7ae67"><circle cx="-9" cy="22" r="4"/><circle cx="12" cy="18" r="3"/><circle cx="1" cy="27" r="2"/></g>}
      </g>)}
    </svg>
    <div className="atelier-cookie-controls">
      <div className="atelier-cookie-sign"><strong>{sign}</strong><span>Tap a cookie · take a bite</span></div>
      {cookies.map((cookie,index)=>cookie.bites<4&&<button key={index} type="button" className="atelier-cookie-hit"
        style={{left:cookie.x/2048*100+'%',top:cookie.y/1280*100+'%'}}
        aria-label={cookieName+' '+(index+1)+', '+(4-cookie.bites)+' bites left. Pick up'}
        onClick={()=>setHeld(index)}
        onPointerDown={event=>{
          if(event.button!==0)return;
          unlockAtelierSound();
          const rect=event.currentTarget.parentElement!.getBoundingClientRect();
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current={index,x:event.clientX,y:event.clientY,startX:cookie.x,startY:cookie.y,scaleX:2048/rect.width,scaleY:1280/rect.height,moved:false};
        }}
        onPointerMove={event=>{
          const d=drag.current;if(!d||d.index!==index)return;
          // A resting finger must not move the target before its tap completes.
          if(!d.moved&&Math.hypot(event.clientX-d.x,event.clientY-d.y)<6)return;
          d.moved=true;setHeld(index);
          const x=Math.max(65,Math.min(1983,d.startX+(event.clientX-d.x)*d.scaleX)),y=Math.max(120,Math.min(1170,d.startY+(event.clientY-d.y)*d.scaleY));
          setCookies(previous=>previous.map((item,i)=>i===index?{...item,x,y}:item));
        }}
        onPointerUp={event=>{
          if(drag.current?.index===index)setHeld(index);
          drag.current=null;
          if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={()=>{drag.current=null;}}
        onKeyDown={event=>{
          if(event.key==='Escape'){setHeld(null);return;}
          const direction:Record<string,[number,number]>={ArrowLeft:[-30,0],ArrowRight:[30,0],ArrowUp:[0,-30],ArrowDown:[0,30]};
          const offset=direction[event.key];if(!offset)return;
          event.preventDefault();setHeld(index);
          setCookies(previous=>previous.map((item,i)=>i===index?{...item,x:Math.max(65,Math.min(1983,item.x+offset[0])),y:Math.max(120,Math.min(1170,item.y+offset[1]))}:item));
        }}><span aria-hidden="true">✧</span></button>)}
    </div>
    {held!==null&&<div className="atelier-cookie-inspection" role="group" aria-label={cookieName}><span>{4-cookies[held].bites} bites left</span><button type="button" onClick={bite}>Take a bite</button><button type="button" onClick={()=>{const index=held;setCookies(previous=>previous.map((cookie,i)=>i===index?{...cookie,x:FRESH_COOKIES[i].x,y:FRESH_COOKIES[i].y}:cookie));setHeld(null);}}>Put on plate</button></div>}
    <span className="atelier-visually-hidden" role="status">{announcement}</span>
  </>;
}
