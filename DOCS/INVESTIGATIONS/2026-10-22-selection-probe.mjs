// Diagnostic of existing code, not a passing regression test or production fixture.
// Run from repository root: node DOCS/INVESTIGATIONS/2026-10-22-selection-probe.mjs
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import tailwindcss from '@tailwindcss/vite';
import { mkdir, writeFile } from 'node:fs/promises';

// Real React/chat/parser/Swiss Ephemeris/WebGL. Only hosted inference and
// speech callbacks are controlled, so no account, provider or voice download is needed.
const fixture = `
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import { NatallyChatbot } from '/src/components/NatallyChatbot.tsx';
import { Astrolabe3D } from '/src/components/Astrolabe3D.tsx';
import { calculateNatalChart } from '/src/services/ephemeris.ts';
import { generateAstrologicalReading } from '/src/services/readings.ts';
import '/src/index.css';
window.THREE=THREE; window.pending = []; window.probe = {}; window.session = true;
const originalUpdate = THREE.Object3D.prototype.updateMatrixWorld;
THREE.Object3D.prototype.updateMatrixWorld = function(force) {
  if (this.isScene) {
    const beads = [], chords = [], sectors = [];
    this.traverse(o => {
      if (o.name && o.material?.emissiveIntensity === 0.9) beads.push(o.name);
      if (o.name && o.geometry?.type === 'TubeGeometry') chords.push(o.name);
      if (o.name && o.geometry?.type === 'RingGeometry') sectors.push(o.name);
    });
    window.probe = { beads, chords, sectors };
  }
  const result=originalUpdate.call(this, force);
  if(this.isCamera) window.camera=this;
  if(this.isScene && window.camera) { window.scene=this; window.points={}; this.traverse(o=>{if(o.userData?.planetName){const p=o.getWorldPosition(new THREE.Vector3()).project(window.camera); const r=document.querySelector('canvas').getBoundingClientRect(); window.points[o.userData.planetName]={x:r.left+(p.x+1)*r.width/2,y:r.top+(1-p.y)*r.height/2};}}); }
  return result;
};
const initial = await calculateNatalChart({ name:'Synthetic chart focus', birthDate:'2000-01-01', birthTime:'00:00', placeName:'Greenwich', latitude:51.48, longitude:0, timezoneOffset:0, houseSystem:'W' });
window.initial = initial;
function Fixture() {
  const [chart, setChart] = useState(initial), [focus, setFocus] = useState([]), [manual, setManual] = useState([]);
  const [voice, setVoice] = useState(false), [visible, setVisible] = useState(true);
  const [external, setExternal] = useState(null);
  window.manual = manual; window.setManual = setManual; window.generateReading = async () => { const reading = await generateAstrologicalReading({type:'house', targetKey:'House 4', chart}); setExternal({...reading,content:reading.content,type:'reading'}); };
  window.changeChart = () => { setFocus([]); setChart({...initial, input:{...initial.input, birthDate:'2001-01-01'}}); };
  window.enableVoice = () => setVoice(true);
  window.unmountChat = () => { window.session = false; setFocus([]); setVisible(false); };
  return <><Astrolabe3D chart={chart} isSpinning={false} resetTrigger={0} selectedComponents={manual} highlightedComponents={focus} onToggleComponent={(id) => setManual([id])}/>
    <output aria-label="Current chart focus" style={{position:'fixed',top:0,zIndex:100}}>{focus.join(';')}</output>
    <button style={{position:'fixed',top:30,zIndex:100}} onClick={() => setFocus([])}>Clear focus</button>
    {visible && <NatallyChatbot accountUid="focus-fixture" chart={chart} isCurrentSession={() => window.session}
      isOpen={true} isSignedIn={true} userLore={[]} onClose={() => {}} onOpen={() => {}} onSignIn={() => {}}
      onAddUserLore={() => {}} onUpdateVoiceSettings={() => {}} onSpeechStateChange={() => {}}
      onSelectPlanet={(id) => setManual([id])} onChartFocus={(targets, source) => { if (source === chart && window.session) setFocus(targets); }}
      externalReadingToInject={external} onClearExternalReading={() => setExternal(null)}
      voiceSettings={{readingAloud:voice,language:'en-US',rate:1,pitch:1,accentMode:'standard',ttsModel:'supertonic-onnx',aiVoiceName:'F4',kawaiiMode:'natural_companion',kawaiiIntensity:0,spriteMode:'docked'}}/>}</>;
}
createRoot(document.getElementById('root')).render(<Fixture/>);
`;
const server = await createServer({
  configFile: false, server: { host: '127.0.0.1', port: 0 },
  optimizeDeps: { include: ['react', 'react-dom/client', 'three'] },
  plugins: [tailwindcss(), { name: 'chart-presentation-fixture', enforce: 'pre',
    resolveId(id) { if (id === '/__chart-fixture.tsx') return id; },
    load(id) { if (id === '/__chart-fixture.tsx') return fixture; },
    transform(code, id) {
      if (id.split('?')[0].endsWith('/src/services/hostedInference.ts')) return code.replace(
        'export async function requestHostedInference(', 'async function originalRequestHostedInference(') +
        '\nexport async function requestHostedInference(payload: any) { return new Promise(resolve => window.pending.push({payload, resolve})); }';
      if (id.split('?')[0].endsWith('/src/services/voiceService.ts')) return code
        .replace('export async function speakNatallyText(', 'async function originalSpeakNatallyText(')
        .replace('export function stopSpeaking()', 'function originalStopSpeaking()') +
        '\nexport function stopSpeaking() { originalStopSpeaking(); const old=window.speech; window.speech=null; old?.end?.(); }' +
        '\nexport async function speakNatallyText(text:any, settings:any, start:any, end:any, word:any) { stopSpeaking(); window.speech={text,end,word}; start?.(); return true; }';
    },
    configureServer(vite) { vite.middlewares.use((req, res, next) => {
      if (req.url !== '/__chart-fixture') return next();
      res.setHeader('Content-Type', 'text/html');
      res.end('<!doctype html><div id="root"></div><script type="module" src="/__chart-fixture.tsx"></script>');
    }); },
  }],
});
let browser;
try {
  await server.listen();
  browser = await chromium.launch({ channel: process.env.NATALLY_TEST_BROWSER || 'chrome', headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/__chart-fixture`);
  await page.getByLabel('Message Natally').waitFor();
  const send = async text => { await page.getByLabel('Message Natally').fill(text); await page.getByLabel('Send message', { exact: true }).click(); await page.waitForFunction(() => window.pending.length > 0); };
  const reply = text => page.evaluate(text => window.pending.shift().resolve({text, model:'controlled-model',source:'hosted'}), text);

  await send('Selection diagnostic.');
  await reply('Saturn and Neptune. saturn and neptune. **Saturn** and *Neptune*.');
  await page.getByRole('button',{name:'Saturn',exact:true}).waitFor();
  const result={date:new Date().toISOString(),scope:{browser:'native Windows Chrome, headless SwiftShader WebGL',hostedInference:'controlled',speech:'controlled',liveProvider:false,physicalDevice:false,productionCodeModified:false},fixture:'Greenwich 2000-01-01 00:00 Whole Sign',reading:[],chart:[],errors};
  for(const name of ['Saturn','Neptune','saturn','neptune']) {
    await page.getByRole('button',{name,exact:true}).click();
    await page.waitForFunction(name=>window.manual.includes(name),name);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    result.reading.push({clicked:name,...await page.evaluate(()=>({manual:window.manual,lit:window.probe.beads}))});
  }
  result.formatted={boldSaturnButtons:await page.locator('strong button').count(),italicNeptuneButtons:await page.locator('em button').count()};
  await page.evaluate(()=>window.unmountChat());
  for(const name of ['Saturn','Neptune']) {
    await page.evaluate(()=>window.setManual([]));
    await page.waitForFunction(()=>window.manual.length===0);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const point=await page.evaluate(name=>window.points[name],name);
    const under=await page.evaluate(point=>{const T=window.THREE; const ray=new T.Raycaster(); ray.setFromCamera(new T.Vector2(point.x/innerWidth*2-1,-point.y/innerHeight*2+1),window.camera);const objects=[];window.scene.traverse(o=>{if(o.userData?.componentId)objects.push(o)});return ray.intersectObjects(objects,false).slice(0,4).map(i=>({id:i.object.userData.componentId,distance:i.distance}));},point).catch(()=>null);
    const element=await page.evaluate(p=>{const e=document.elementFromPoint(p.x,p.y);return e?.outerHTML.slice(0,300)},point);
    await page.mouse.click(point.x,point.y);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    result.chart.push({clicked:name,point,element,under,...await page.evaluate(()=>({manual:window.manual,lit:window.probe.beads}))});
  }
  console.log(JSON.stringify(result,null,2));
  await mkdir('DOCS/INVESTIGATIONS',{recursive:true});
  await writeFile('DOCS/INVESTIGATIONS/2026-10-22-selection-probe.json',JSON.stringify(result,null,2)+'\n');
} finally { await browser?.close(); await server.close(); }
