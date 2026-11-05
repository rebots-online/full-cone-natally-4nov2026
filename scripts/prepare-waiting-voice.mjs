import { pipeline, env } from '@huggingface/transformers';
import fs from 'node:fs/promises';
import path from 'node:path';
const revision='cff123c84b0655d9d647641f1b532c3cbb8f7faa';
env.remotePathTemplate='{model}/resolve/'+revision+'/';
env.allowLocalModels=false;
env.cacheDir=path.join(process.env.TEMP || '.', 'natally-supertonic-preparation');
const phrases=[['look-v2','Let me take a closer look.','closer.wav'],['moment-v2','Give me a moment.'],['thread-v2','Let me follow that thread.']];
const steps=16;
const out='public/voice/waiting';
await fs.mkdir(out,{recursive:true});
const tts=await pipeline('text-to-speech','onnx-community/Supertonic-TTS-ONNX',{revision,device:'cpu',dtype:'fp32'});
const response=await fetch('https://huggingface.co/onnx-community/Supertonic-TTS-ONNX/resolve/'+revision+'/voices/F4.bin');
if(!response.ok)throw new Error('Voice embedding unavailable: '+response.status);
const embedding=new Float32Array(await response.arrayBuffer());
for(const [id,text,sourceFile] of phrases){
  if(sourceFile){await fs.copyFile(path.join(out,sourceFile),path.join(out,id+'.wav'));continue;}
  const result=await tts(text,{speaker_embeddings:embedding,num_inference_steps:steps,speed:0.9});
  const samples=result.audio; const rate=result.sampling_rate;
  if(!samples?.length || !samples.every(Number.isFinite))throw new Error('Invalid generated audio');
  const wav=Buffer.alloc(44+samples.length*2);
  wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVE',8);wav.write('fmt ',12);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(samples.length*2,40);
  for(let i=0;i<samples.length;i++)wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,samples[i]))*32767),44+i*2);
  await fs.writeFile(path.join(out,id+'.wav'),wav);
  console.log(id,rate,samples.length,wav.length);
}
await fs.writeFile(path.join(out,'provenance.json'),JSON.stringify({model:'onnx-community/Supertonic-TTS-ONNX',revision,voice:'F4',speed:0.9,generatedAt:new Date().toISOString(),phrases:Object.fromEntries(phrases.map(([id,text])=>[id,text])),preparation:Object.fromEntries(phrases.map(([id,,sourceFile])=>[id,sourceFile?{sourceFile,steps:5}:{steps}]))},null,2));
