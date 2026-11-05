import {build} from 'esbuild';
import fs from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const baseline=process.argv.find(value=>value.startsWith('--baseline='))?.slice('--baseline='.length);
await fs.mkdir('.tmp/reading-recovery',{recursive:true});
await build({entryPoints:['tests/browser/opening-recovery.tsx'],outfile:'.tmp/reading-recovery/'+(baseline?'before':'after')+'.js',bundle:true,format:'esm',platform:'browser',external:['node:*'],loader:{'.md':'text'},define:{'import.meta.env':'{}'},plugins:[{name:'fixture-boundaries',setup(b){
 b.onLoad({filter:/NatallyChatbot\.tsx$/},async a=>({contents:baseline?execFileSync('git',['show',baseline+':src/components/NatallyChatbot.tsx'],{encoding:'utf8'}):await fs.readFile(a.path,'utf8'),loader:'tsx'}));
 b.onLoad({filter:/natallyChat\.ts$/},async a=>({contents:(await fs.readFile(a.path,'utf8')).replace('export async function askNatally(', 'async function originalAskNatally(')+`\nexport async function askNatally(prompt,history,chart){document.getElementById('calls').textContent += prompt.includes('FIRST OF TWO')?'natal ':'now ';return parseNatallyResponse(prompt.includes('FIRST OF TWO')?'Your natal reading has arrived.':'Your horoscope has arrived.',chart);}`,loader:'ts'}));
 b.onLoad({filter:/voiceService\.ts$/},async a=>({contents:(await fs.readFile(a.path,'utf8')).replace('export async function speakNatallyText(', 'async function originalSpeakNatallyText(').replace('export function prepareWaitingVoice(', 'function originalPrepareWaitingVoice(').replace('export function startWaitingUtterance(', 'function originalStartWaitingUtterance(')+`\nexport function speakNatallyText(){document.getElementById('voice').textContent='Greeting audio blocked';return new Promise(()=>{});} export function prepareWaitingVoice(){} export function startWaitingUtterance(){return {caption:'Preparing fixture',cancel(){}};}`,loader:'ts'}));
 b.onLoad({filter:/streamingSpeech\.ts$/},()=>({contents:'export function createStreamingSpeech(){return {update(){},cancel(){},async finish(){return true;}}}',loader:'ts'}));
 b.onLoad({filter:/PurchaseAccess\.tsx$/},()=>({contents:'export function usePurchaseAccess(){return {requestDownload:async()=>{}}}',loader:'ts'}));
 b.onLoad({filter:/RetainedReadingAudio\.tsx$/},()=>({contents:'export function RetainedReadingAudio(){return null}',loader:'ts'}));
 b.onLoad({filter:/NatallyConfigModal\.tsx$/},()=>({contents:'export function NatallyConfigModal(){return null}',loader:'ts'}));
}}]});
const name=baseline?'before':'after';
await fs.writeFile('.tmp/reading-recovery/'+name+'.html',`<html><body><h1>Isolated opening recovery fixture</h1><p>Mock inference; greeting speech never resolves.</p><output id="calls"></output><output id="voice"></output><div id="root"></div><script type="module" src="${name}.js"></script></body></html>`);


