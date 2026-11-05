# CodeGraph semantic entity table

| ID | Kind | Qualified entity | File | Lines | Signature |
| --- | --- | --- | --- | --- | --- |
| file:DOCS/INVESTIGATIONS/2026-10-22-selection-probe.mjs | file | DOCS/INVESTIGATIONS/2026-10-22-selection-probe.mjs | DOCS/INVESTIGATIONS/2026-10-22-selection-probe.mjs | 1–121 |  |
| import:f69222e6384c59aff1f27eb42c8ea92f | import | node:assert/strict | DOCS/INVESTIGATIONS/2026-10-22-selection-probe.mjs | 3–3 | import assert from 'node:assert/strict'; |
| import:6b0454578a494849c99a42ea3d17cf36 | import | vite | DOCS/INVESTIGATIONS/2026-10-22-selection-probe.mjs | 4–4 | import { createServer } from 'vite'; |
| import:b71b51e004bf89eed16f4b3bc8960d44 | import | playwright | DOCS/INVESTIGATIONS/2026-10-22-selection-probe.mjs | 5–5 | import { chromium } from 'playwright'; |
| import:233b257de13ef70be1b5382271ad554e | import | @tailwindcss/vite | DOCS/INVESTIGATIONS/2026-10-22-selection-probe.mjs | 6–6 | import tailwindcss from '@tailwindcss/vite'; |
| import:0b7321935b85c4f71d7d4a59b82d1152 | import | node:fs/promises | DOCS/INVESTIGATIONS/2026-10-22-selection-probe.mjs | 7–7 | import { mkdir, writeFile } from 'node:fs/promises'; |
| constant:7640d8be95d3b79d7cfcad914fd3819f | constant | fixture | DOCS/INVESTIGATIONS/2026-10-22-selection-probe.mjs | 11–58 | = ` import React, { useState } from 'react'; import { createRoot } from 'react-dom/client'; import ... |
| constant:82e7d3ac079f971d9560f23fe8859326 | constant | server | DOCS/INVESTIGATIONS/2026-10-22-selection-probe.mjs | 59–81 | = await createServer({   configFile: false, server: { host: '127.0.0.1', port: 0 },   optimizeDeps: ... |
| variable:5671f89b62cba1508432a25038f285bd | variable | browser | DOCS/INVESTIGATIONS/2026-10-22-selection-probe.mjs | 82–82 |  |
| constant:21968998ae5a61b813cd903acb9fe852 | constant | page | DOCS/INVESTIGATIONS/2026-10-22-selection-probe.mjs | 86–86 | = await browser.newPage({ viewport: { width: 1280, height: 900 } }) |
| constant:5d00cbe6725ae849a1c93df21ce8e212 | constant | errors | DOCS/INVESTIGATIONS/2026-10-22-selection-probe.mjs | 87–87 | = [] |
| function:e37ebd416e838925367ddec812f743ba | function | send | DOCS/INVESTIGATIONS/2026-10-22-selection-probe.mjs | 91–91 |  |
| function:41c61e4a103c0c3b983155e6e1084d58 | function | reply | DOCS/INVESTIGATIONS/2026-10-22-selection-probe.mjs | 92–92 |  |
| constant:f58c731d74d501e75adbcd34f8871da3 | constant | result | DOCS/INVESTIGATIONS/2026-10-22-selection-probe.mjs | 97–97 | = {date:new Date().toISOString(),scope:{browser:'native Windows Chrome, headless SwiftShader WebGL',ho... |
| constant:0b94f1505e4f3ccd1e13b06be8d69342 | constant | point | DOCS/INVESTIGATIONS/2026-10-22-selection-probe.mjs | 110–110 | = await page.evaluate(name=>window.points[name],name) |
| constant:022404b2922f3b1841ee487a8b45689f | constant | under | DOCS/INVESTIGATIONS/2026-10-22-selection-probe.mjs | 111–111 | = await page.evaluate(point=>{const T=window.THREE; const ray=new T.Raycaster(); ray.setFromCamera(new... |
| constant:9cfa6187797768c7b16d9d3097645268 | constant | element | DOCS/INVESTIGATIONS/2026-10-22-selection-probe.mjs | 112–112 | = await page.evaluate(p=>{const e=document.elementFromPoint(p.x,p.y);return e?.outerHTML.slice(0,300)}... |
| file:LIBS/UI/OPENDESIGN/billing-preview-20261021/branch-preview.js | file | LIBS/UI/OPENDESIGN/billing-preview-20261021/branch-preview.js | LIBS/UI/OPENDESIGN/billing-preview-20261021/branch-preview.js | 1–73 |  |
| constant:01af0b6f0f0359d188a426ecf2551cda | constant | views | LIBS/UI/OPENDESIGN/billing-preview-20261021/branch-preview.js | 2–2 | = new Set(['profile', 'balance', 'topup', 'offers', 'billing', 'alby', 'conversation']) |
| constant:f238f5328f9da3b1379488622d91d67a | constant | originalSwitch | LIBS/UI/OPENDESIGN/billing-preview-20261021/branch-preview.js | 3–3 | = window.switchView |
| constant:1dde9756d30e020be89c1c9758b66e17 | constant | status | LIBS/UI/OPENDESIGN/billing-preview-20261021/branch-preview.js | 4–4 | = document.querySelector('#preview-status') |
| constant:00af1b13c187b1ec5d005aad55ee45ab | constant | notices | LIBS/UI/OPENDESIGN/billing-preview-20261021/branch-preview.js | 32–40 | = {   'request-topup': 'Top-up is not connected. No quote was issued and no money was requested.',   '... |
| constant:56c219501759038bd5f933f62ca72cc6 | constant | button | LIBS/UI/OPENDESIGN/billing-preview-20261021/branch-preview.js | 42–42 | = document.getElementById(id) |
| constant:cf2ac3439e218ea8a144cd98c6987efa | constant | amount | LIBS/UI/OPENDESIGN/billing-preview-20261021/branch-preview.js | 56–56 | = document.querySelector('#topup-amount') |
| constant:4fd03b4e448147b114fa9506340f5960 | constant | currencyMark | LIBS/UI/OPENDESIGN/billing-preview-20261021/branch-preview.js | 65–65 | = amount.parentElement.querySelector('span') |
| constant:c7eef7ae9fe9e1e78efcd9c788a3aaaa | constant | atelier | LIBS/UI/OPENDESIGN/billing-preview-20261021/branch-preview.js | 69–69 | = document.querySelector('#open-atelier') |
| file:LIBS/UI/STITCH/prototype.js | file | LIBS/UI/STITCH/prototype.js | LIBS/UI/STITCH/prototype.js | 1–145 |  |
| constant:fca99e0cc3658d0a431bde6785b9922e | constant | screens | LIBS/UI/STITCH/prototype.js | 2–11 | = {   '01': ['Choose your reading', 'prepaid_01_choose_your_reading', 'prepaid_01m_choose_your_readin... |
| constant:8c9c960f6530803a9b6e41b479faba05 | constant | offers | LIBS/UI/STITCH/prototype.js | 12–12 | = {'pdf-only':'Natal chart — PDF only','pdf-spa':'Natal chart — PDF + SPA',home:'Bring Natally home'} |
| constant:eef495ec8fdec3d3f9e5bb0fa733e1ac | constant | frame | LIBS/UI/STITCH/prototype.js | 13–13 | = document.querySelector('#screen') |
| constant:9cb56904f7d12567116d329d5df5a4e5 | constant | select | LIBS/UI/STITCH/prototype.js | 14–14 | = document.querySelector('#screen-select') |
| constant:23aaf419f642b382f217037b02058bdc | constant | dialog | LIBS/UI/STITCH/prototype.js | 15–15 | = document.querySelector('#preview') |
| constant:e730918bb2759eca2d91b4fa740c61e8 | constant | smallViewport | LIBS/UI/STITCH/prototype.js | 16–16 | = matchMedia('(max-width:767px)') |
| variable:c3e56ba8beeaca924e3608dc49e6b976 | variable | mobile | LIBS/UI/STITCH/prototype.js | 17–17 | = smallViewport.matches |
| variable:737f165f2ab2969d2381a6726201f8bf | variable | offer | LIBS/UI/STITCH/prototype.js | 18–18 | = 'pdf-spa' |
| variable:758828274d0f645bf22f1981cd75d7ba | variable | channel | LIBS/UI/STITCH/prototype.js | 18–18 | = 'direct' |
| variable:b66de62942404328f0024e76f3e3d92c | variable | view | LIBS/UI/STITCH/prototype.js | 18–18 | = '01' |
| function:81e0745f2e3aa6fcfcd20ce23e77c89a | function | show | LIBS/UI/STITCH/prototype.js | 21–26 | (id) |
| function:cc7f602bc8fba8dcd950e81d5ffc2dbf | function | render | LIBS/UI/STITCH/prototype.js | 27–42 | () |
| function:c24a6826c48c659fe35fdfe3ba35428a | function | preview | LIBS/UI/STITCH/prototype.js | 43–59 | (title, copy, next) |
| function:089757ed4019e8228c14e8230b61e26c | function | selectedOffer | LIBS/UI/STITCH/prototype.js | 60–65 | (doc) |
| function:bf62297b5fafcfa9b82b33b9f70ea44e | function | route | LIBS/UI/STITCH/prototype.js | 66–101 | (action, doc) |
| function:5eafb4475c43d2b040f7e54ed4e73815 | function | applyScenario | LIBS/UI/STITCH/prototype.js | 117–138 | (doc) |
| file:netlify/functions/chat.mjs | file | netlify/functions/chat.mjs | netlify/functions/chat.mjs | 1–110 |  |
| import:841c96b0e953ae760825c543899e7af3 | import | ../lib/astrology-tools.mjs | netlify/functions/chat.mjs | 1–1 | import { ASTROLOGY_TOOLS, validToolCall, validToolMessages, toolCallCount } from '../lib/astrology-tools.mjs'; |
| constant:ecf370ad71402058714f89843613ba49 | constant | windows | netlify/functions/chat.mjs | 3–3 | = new Map() |
| function:e7473911492972fc03cb7c7d298100b7 | function | handleChat | netlify/functions/chat.mjs | 5–105 | (request, { env = process.env, fetchImpl = fetch, now = Date.now } = {}) |
| function:c81db9dd3b0e01c6d71f01e6bb9e18f4 | function | handleChat::respond | netlify/functions/chat.mjs | 18–18 | (status, body) |
| constant:67f734a0d75ad3d9c861c7fb197167b6 | constant | config | netlify/functions/chat.mjs | 109–109 | = { rateLimit: { action: 'rate_limit', aggregateBy: ['domain', 'ip'], windowSize: 60, windowLimit: 30 ... |
| constant:7711219b65c701163c8fbdc89e1ff2b3 | constant | ASTROLOGY_TOOLS | netlify/lib/astrology-tools.mjs | 1–21 | = [{   type: 'function',   function: {     name: 'calculate_astrology',     description: 'Execute ... |
| file:netlify/lib/astrology-tools.mjs | file | netlify/lib/astrology-tools.mjs | netlify/lib/astrology-tools.mjs | 1–46 |  |
| function:92930538682a0974761d1df9eadc4e57 | function | validToolCall | netlify/lib/astrology-tools.mjs | 23–26 | (call) |
| function:6e55d748836870ed4c9fd501d801564c | function | validToolMessages | netlify/lib/astrology-tools.mjs | 28–43 | (messages) |
| function:45085584616d95ab0924d91bd21c21a4 | function | toolCallCount | netlify/lib/astrology-tools.mjs | 45–45 |  |
| file:scripts/benchmark-supertonic.mjs | file | scripts/benchmark-supertonic.mjs | scripts/benchmark-supertonic.mjs | 1–43 |  |
| import:de7a8fc7b5c675aa2ed5881f97d9b29f | import | @huggingface/transformers | scripts/benchmark-supertonic.mjs | 1–1 | import { pipeline, env } from '@huggingface/transformers'; |
| import:1ac3fb5fb5b39b72f896c1971b7945b1 | import | node:fs/promises | scripts/benchmark-supertonic.mjs | 2–2 | import { mkdir, writeFile } from 'node:fs/promises'; |
| import:d82388b261e6aa989295baacbc2860b8 | import | node:perf_hooks | scripts/benchmark-supertonic.mjs | 3–3 | import { performance } from 'node:perf_hooks'; |
| constant:db86486cfa72d3d6c6455311268a2aa0 | constant | revision | scripts/benchmark-supertonic.mjs | 5–5 | = 'cff123c84b0655d9d647641f1b532c3cbb8f7faa' |
| constant:9c066fd66c10240a0f9420666b9f3e80 | constant | model | scripts/benchmark-supertonic.mjs | 6–6 | = 'onnx-community/Supertonic-TTS-ONNX' |
| constant:bd5a4a76eceb6d111e449f4ecdc058f7 | constant | started | scripts/benchmark-supertonic.mjs | 9–9 | = performance.now() |
| constant:aff0dd8ad4132b7869130b71ec25fbfa | constant | engine | scripts/benchmark-supertonic.mjs | 10–13 | = await pipeline('text-to-speech', model, {   revision, device: 'cpu', dtype: 'fp32',   session_opti... |
| constant:d62bad62fb3da5f80f2dc215106eade8 | constant | loadSeconds | scripts/benchmark-supertonic.mjs | 14–14 | = (performance.now() - started) / 1000 |
| constant:1349a40f663fc327dd8cbc657e73ec56 | constant | response | scripts/benchmark-supertonic.mjs | 15–15 | = await fetch(`https://huggingface.co/${model}/resolve/${revision}/voices/F4.bin`) |
| constant:f0a592c9e44669a38085f3f2312a031f | constant | voice | scripts/benchmark-supertonic.mjs | 17–17 | = new Float32Array(await response.arrayBuffer()) |
| constant:9ead4d39977981bd044d370fc10c0a0d | constant | paragraphs | scripts/benchmark-supertonic.mjs | 18–22 | = [   'Your natal chart describes a pattern, not a verdict. We can start with the Sun and Moon, then ... |
| constant:6ffeeaf5cc0b1c2944b114e2e5e67d3b | constant | chunks | scripts/benchmark-supertonic.mjs | 23–23 | = [] |
| constant:43655356634f05ebcb3533c056245b05 | constant | before | scripts/benchmark-supertonic.mjs | 25–25 | = performance.now() |
| constant:60f96fdfbc0e1c5486c03fe419dff242 | constant | output | scripts/benchmark-supertonic.mjs | 26–26 | = await engine(text, { speaker_embeddings: voice, num_inference_steps: 5, speed: 0.85 }) |
| constant:57eaa045cdf3076e0a4cb54d6fbdcb98 | constant | synthesisSeconds | scripts/benchmark-supertonic.mjs | 27–27 | = (performance.now() - before) / 1000 |
| constant:e5694387c206c5d830fdc6764c5efbe1 | constant | playbackSeconds | scripts/benchmark-supertonic.mjs | 28–28 | = output.audio.length / output.sampling_rate / 1.3 |
| constant:61ee184f508b598b1c04cbfb2d81c01e | constant | result | scripts/benchmark-supertonic.mjs | 30–30 | = { characters: text.length, synthesisSeconds, playbackSeconds, realTimeFactor: synthesisSeconds / pla... |
| constant:851c684fb0cd174354b9815a91044f31 | constant | report | scripts/benchmark-supertonic.mjs | 34–38 | = {   recordedAt: new Date().toISOString(), runtime: 'Node native ONNX CPU; NOT browser WASM or a pho... |
| file:scripts/onnx-progress-plugin.ts | file | scripts/onnx-progress-plugin.ts | scripts/onnx-progress-plugin.ts | 1–53 |  |
| import:15e094d1b165e80501f654072749913a | import | vite | scripts/onnx-progress-plugin.ts | 1–1 | import type { Plugin } from 'vite'; |
| function:94a9cd5fc70d64c4e90f5d6a79e23e89 | function | patchOnnxRuntime | scripts/onnx-progress-plugin.ts | 5–36 | (source: string): string |
| function:9b2f1719c8464644830a6615e2e828b8 | function | onnxProgressPlugin | scripts/onnx-progress-plugin.ts | 38–46 | (): Plugin |
| function:e3baa4741d60d81d324d33e3491940b4 | function | patchFileReadSource | scripts/onnx-progress-plugin.ts | 48–52 | (source: string): string |
| file:scripts/prepare-waiting-voice.mjs | file | scripts/prepare-waiting-voice.mjs | scripts/prepare-waiting-voice.mjs | 1–26 |  |
| import:f9dbca20838a93baa1be182e23724574 | import | @huggingface/transformers | scripts/prepare-waiting-voice.mjs | 1–1 | import { pipeline, env } from '@huggingface/transformers'; |
| import:0aa0ce84831d74485f59c706d8589516 | import | node:fs/promises | scripts/prepare-waiting-voice.mjs | 2–2 | import fs from 'node:fs/promises'; |
| import:9fe55b0e3cf9327d1c6148f3b7eb1129 | import | node:path | scripts/prepare-waiting-voice.mjs | 3–3 | import path from 'node:path'; |
| constant:286060bd1f727269153aa7d69abc059f | constant | revision | scripts/prepare-waiting-voice.mjs | 4–4 | = 'cff123c84b0655d9d647641f1b532c3cbb8f7faa' |
| constant:dd7c1ecb88bf9ac3e7190e9acba371f4 | constant | phrases | scripts/prepare-waiting-voice.mjs | 8–8 | = [['look','Let me look into that.'],['moment','Give me a moment with this.'],['closer','Let me take a... |
| constant:08286c9920b026918fb64d30db2c8a5e | constant | out | scripts/prepare-waiting-voice.mjs | 9–9 | = 'public/voice/waiting' |
| constant:911830eb69dc374eaeb4740dd7981dc5 | constant | tts | scripts/prepare-waiting-voice.mjs | 11–11 | = await pipeline('text-to-speech','onnx-community/Supertonic-TTS-ONNX',{revision,device:'cpu',dtype:'f... |
| constant:5f59c0bf74f173bb6b0f323e59b82d51 | constant | response | scripts/prepare-waiting-voice.mjs | 12–12 | = await fetch('https://huggingface.co/onnx-community/Supertonic-TTS-ONNX/resolve/'+revision+'/voices/F... |
| constant:4060d375c94f7b17985e982fa63d9df9 | constant | embedding | scripts/prepare-waiting-voice.mjs | 14–14 | = new Float32Array(await response.arrayBuffer()) |
| constant:5ea8a6aeea8e273355dff4b03498d7ae | constant | result | scripts/prepare-waiting-voice.mjs | 16–16 | = await tts(text,{speaker_embeddings:embedding,num_inference_steps:5,speed:0.9}) |
| constant:8c2fa94e791868bc6ac000ee60f59f4d | constant | rate | scripts/prepare-waiting-voice.mjs | 17–17 | = result.sampling_rate |
| constant:a574d02fe3d83f053f810e94471c0b8e | constant | samples | scripts/prepare-waiting-voice.mjs | 17–17 | = result.audio |
| constant:cee035370fb901d22d31ae609f7a4e64 | constant | wav | scripts/prepare-waiting-voice.mjs | 19–19 | = Buffer.alloc(44+samples.length*2) |
| variable:a6a517830bb7d1f87ea5275103a066d4 | variable | i | scripts/prepare-waiting-voice.mjs | 21–21 | = 0 |
| file:scripts/summarize-voice-measurements.ts | file | scripts/summarize-voice-measurements.ts | scripts/summarize-voice-measurements.ts | 1–31 |  |
| import:056006c1f8eddb9160520296565cafcf | import | node:fs | scripts/summarize-voice-measurements.ts | 1–1 | import { readFileSync } from 'node:fs'; |
| import:856cb27f4c8cc81644075afb734cf305 | import | node:path | scripts/summarize-voice-measurements.ts | 2–2 | import { resolve } from 'node:path'; |
| import:274d850aec4956a76cb0d77405f7e245 | import | node:url | scripts/summarize-voice-measurements.ts | 3–3 | import { pathToFileURL } from 'node:url'; |
| import:ee3e020933ab4196df4bf9cfcc3602a1 | import | ../src/services/voiceMeasurements | scripts/summarize-voice-measurements.ts | 4–4 | import { summarizeMeasurements, type VoiceMeasurement } from '../src/services/voiceMeasurements'; |
| function:bee65926f7190da0eeb2fb51163e4b5a | function | aggregateVoiceReports | scripts/summarize-voice-measurements.ts | 7–29 | (reports: any[]) |
| file:scripts/verify-calculation-api.mjs | file | scripts/verify-calculation-api.mjs | scripts/verify-calculation-api.mjs | 1–61 |  |
| import:8448357e7ec7665dad449e021756d2f3 | import | node:fs/promises | scripts/verify-calculation-api.mjs | 1–1 | import { readFile, writeFile } from 'node:fs/promises'; |
| import:f1839ab8c136dc711a1b7519ca20bbbb | import | node:crypto | scripts/verify-calculation-api.mjs | 2–2 | import { randomUUID, randomBytes } from 'node:crypto'; |
| import:f9fafb1f3d48f6d1ab828351b5b3f573 | import | ../src/services/ephemeris.ts | scripts/verify-calculation-api.mjs | 3–3 | import { calculateNatalChart } from '../src/services/ephemeris.ts'; |
| import:fcf9d79a325cd38cc36effe18c13b9eb | import | ../src/services/calculationTools.ts | scripts/verify-calculation-api.mjs | 4–4 | import { createCalculationSession } from '../src/services/calculationTools.ts'; |
| import:e78be18c83b5a00f6440cf39f3d8f34e | import | ../src/services/natallyChat.ts | scripts/verify-calculation-api.mjs | 5–5 | import { NATALLY_SYSTEM_PROMPT, buildStructuredNatalContext } from '../src/services/natallyChat.ts'; |
| import:adcb43e1dfa24e2914f1f4de0ec8c3f9 | import | ../src/services/hostedInference.ts | scripts/verify-calculation-api.mjs | 6–6 | import { completeHosted } from '../src/services/hostedInference.ts'; |
| constant:9d404afbe8e0d87d5f53b4f0f2634f2a | constant | config | scripts/verify-calculation-api.mjs | 8–8 | = JSON.parse(await readFile('firebase-applet-config.json', 'utf8')) |
| constant:d6958ea78914d38c157c4b3dd95ed32e | constant | endpoint | scripts/verify-calculation-api.mjs | 9–9 | = 'https://natally-hosted-chat.netlify.app/.netlify/functions/chat' |
| constant:33bd84d01d60411918c859a22730d7ce | constant | originalFetch | scripts/verify-calculation-api.mjs | 10–10 | = globalThis.fetch |
| constant:15afbda937161102cfc28401f0aaee3d | constant | calls | scripts/verify-calculation-api.mjs | 11–11 | = [] |
| constant:956793a061821137dea6086f4eeadc50 | constant | diagnostics | scripts/verify-calculation-api.mjs | 12–12 | = [] |
| function:30fe46e16691cbf481d654e7c3bfc5ef | function | identity | scripts/verify-calculation-api.mjs | 21–26 | (action, body) |
| variable:25a11ca140df1d9296700e08442d6902 | variable | token | scripts/verify-calculation-api.mjs | 27–27 |  |
| variable:69f48af0fc6a9cc8c36c8b3959b0d0cb | variable | result | scripts/verify-calculation-api.mjs | 28–28 |  |
| variable:6f534297860725a20b51ff259feea31a | variable | failure | scripts/verify-calculation-api.mjs | 29–29 |  |
| constant:db6ee4d9dbf9edc17821702d326e8562 | constant | signup | scripts/verify-calculation-api.mjs | 31–31 | = await identity('signUp', { email: 'natally-tools-' + randomUUID() + '@example.test', password: rando... |
| constant:7b6738cc4357d6d25ed1952b6899df62 | constant | chart | scripts/verify-calculation-api.mjs | 33–33 | = await calculateNatalChart({ name: 'Synthetic A', birthDate: '2000-01-01', birthTime: '00:00', placeN... |
| constant:cebdd8f30ccdf76f47806018785fc610 | constant | session | scripts/verify-calculation-api.mjs | 34–34 | = createCalculationSession(chart) |
| constant:d106ef8c33cfa503066fddbef05cc8b4 | constant | operations | scripts/verify-calculation-api.mjs | 46–46 | = calls.map(call => call.args.operation) |
| file:scripts/verify-intake-rules.py | file | scripts/verify-intake-rules.py | scripts/verify-intake-rules.py | 1–64 |  |
| import:705522b9f12df45ade14f0f1da540cd6 | import | json | scripts/verify-intake-rules.py | 1–1 | import json |
| import:7a6903ae3394c94bbc0fbb183266a2e5 | import | pathlib | scripts/verify-intake-rules.py | 2–2 | import pathlib |
| import:e7bebfbbd8f73ce759cf2f53c838e545 | import | subprocess | scripts/verify-intake-rules.py | 3–3 | import subprocess |
| import:062e00f820159e01ac916a57c73a2efc | import | urllib.request | scripts/verify-intake-rules.py | 4–4 | import urllib.request |
| variable:5c506d9925f0bc0e7ec62d4261c94ec8 | variable | root | scripts/verify-intake-rules.py | 6–6 | = pathlib.Path(__file__).resolve().parents[1] |
| variable:1bcf47011df14b8dac0581cec2ce8729 | variable | config | scripts/verify-intake-rules.py | 7–7 | = json.loads((root / 'firebase-applet-config.json').read_text()) |
| variable:28d241d0da04af92edee729999583be0 | variable | project | scripts/verify-intake-rules.py | 8–8 | = config['projectId'] |
| variable:2c43ca5c1ea4a55a1849bb571c147168 | variable | database | scripts/verify-intake-rules.py | 9–9 | = config['firestoreDatabaseId'] |
| variable:0388c46a3ba5d8c85b71afe81816d629 | variable | token | scripts/verify-intake-rules.py | 10–10 | = subprocess.check_output(['gcloud', 'auth', 'print-access-token'], text=True).strip() |
| variable:294e18c618ce001829ca02f2c290895f | variable | profile | scripts/verify-intake-rules.py | 11–15 | = {     'name': 'Test profile', 'birthDate': '2000-01-01', 'birthTime': '12:00',     'placeName': 'T... |
| variable:c52b8a7ea7c035528116768473f791be | variable | cases | scripts/verify-intake-rules.py | 16–16 | = [] |
| variable:33c42249e9676488de311a110ffb8047 | variable | labels | scripts/verify-intake-rules.py | 17–17 | = [] |
| function:710b73116cec11f3b07a9b073986bbda | function | case | scripts/verify-intake-rules.py | 20–28 | (label, method, uid, owner='alice', data=None, suffix='private/intake', allow=False) |
| variable:f86ce9395a81741b512c4fc31b81d337 | variable | body | scripts/verify-intake-rules.py | 44–44 | = {'source': {'files': [{'name': 'intake.rules', 'content': (root / 'firebase/intake.rules').read_text... |
| variable:46157c673e7c621b66eff53a937c813e | variable | request | scripts/verify-intake-rules.py | 45–49 | = urllib.request.Request(     f'https://firebaserules.googleapis.com/v1/projects/{project}:test',   ... |
| variable:6668342c22373ba5fbabd6fd34800014 | variable | result | scripts/verify-intake-rules.py | 51–51 | = json.load(response) |
| variable:5cb00293f2cdbb65cf6b90b7914b8f6d | variable | failures | scripts/verify-intake-rules.py | 52–52 | = [issue for issue in result.get('issues', []) if issue.get('severity') == 'ERROR'] |
| variable:c74fadbf8e1170dc658a532df2694eb5 | variable | results | scripts/verify-intake-rules.py | 53–53 | = result.get('testResults', []) |
| file:scripts/verify-live.mjs | file | scripts/verify-live.mjs | scripts/verify-live.mjs | 1–52 |  |
| import:c14c1e08125365e033a89dd330379f09 | import | node:assert/strict | scripts/verify-live.mjs | 1–1 | import assert from 'node:assert/strict'; |
| import:5a730666a4321a60ba8ad7a81032a3ea | import | node:crypto | scripts/verify-live.mjs | 2–2 | import { createHash } from 'node:crypto'; |
| import:7240018e11bd8b7599e70d0689b0618c | import | node:fs/promises | scripts/verify-live.mjs | 3–3 | import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'; |
| import:2011db8035bca96b51cc17e5d440128b | import | node:path | scripts/verify-live.mjs | 4–4 | import path from 'node:path'; |
| import:002072dfd97eb02e9d09d199d807faa9 | import | playwright | scripts/verify-live.mjs | 5–5 | import { chromium } from 'playwright'; |
| constant:227dc4f94a26d4df45a3a5852493745e | constant | origin | scripts/verify-live.mjs | 7–7 | = 'https://natally.surge.sh' |
| constant:3f27c3aaa8a4304f6c059b3c0ded7a92 | constant | release | scripts/verify-live.mjs | 8–8 | = process.env.SURGE_RELEASE |
| constant:bcf229ed1f4d716832f280d6988532b5 | constant | root | scripts/verify-live.mjs | 10–10 | = path.resolve('dist') |
| constant:68bbf33ed086a2aea0401740c17160d4 | constant | evidenceDirectory | scripts/verify-live.mjs | 11–11 | = path.join(root, 'verification') |
| function:bb20228401b4c69c76caf9c6538e6d15 | function | walk | scripts/verify-live.mjs | 13–16 |  |
| constant:7137952a544693ba13b39e184d3a5ce5 | constant | files | scripts/verify-live.mjs | 17–18 | = [path.join(root, 'index.html'), path.join(root, 'natally-mascot.webp'),   ...(await Promise.all(['a... |
| function:327cbc3e6f247232ac1852c0a73d2012 | function | sha256 | scripts/verify-live.mjs | 19–19 |  |
| constant:082a7b2554946ea5d045c6195f9ce92d | constant | assets | scripts/verify-live.mjs | 20–20 | = [] |
| constant:173dc7d604cb0bee597590456a4ce8ed | constant | relative | scripts/verify-live.mjs | 22–22 | = path.relative(root, filename).split(path.sep).join('/') |
| constant:a62fd996ef907630de511ed53e2ff000 | constant | local | scripts/verify-live.mjs | 23–23 | = await readFile(filename) |
| constant:0cdb2d51897184c80a30acfafcd8ed91 | constant | response | scripts/verify-live.mjs | 24–24 | = await fetch(`${origin}/${relative}?release=${release}`, { signal: AbortSignal.timeout(90000) }) |
| constant:6a1ff03b38151949233c7ec931b12f31 | constant | remote | scripts/verify-live.mjs | 26–26 | = Buffer.from(await response.arrayBuffer()) |
| constant:4abc299ceadc644dc7d0a9cfa1803a33 | constant | appAsset | scripts/verify-live.mjs | 30–30 | = assets.find(asset => /^assets\/app-.*\.js$/.test(asset.path)) |
| variable:c443e77886bafda99f62192dbf9325e4 | variable | browser | scripts/verify-live.mjs | 33–33 |  |
| constant:32f757f641eccca10f4f470a48028cd1 | constant | errors | scripts/verify-live.mjs | 34–34 | = [] |
| variable:6b682c2d5e022ec5df082d463a3e7c4f | variable | browserResult | scripts/verify-live.mjs | 35–35 |  |
| constant:9f2b691246c582f76aaf844d1a817185 | constant | page | scripts/verify-live.mjs | 38–38 | = await browser.newPage({ viewport: { width: 1280, height: 900 } }) |
| constant:75200f4c5ab618c853a203ca0b70b70f | constant | report | scripts/verify-live.mjs | 47–49 | = { checkedAt: new Date().toISOString(), origin, release, sourceCommit: process.env.RELEASE_SOURCE_COM... |
| file:scripts/voice-instrumentation-landmarks.ts | file | scripts/voice-instrumentation-landmarks.ts | scripts/voice-instrumentation-landmarks.ts | 1–17 |  |
| import:d32aff5d6ec7d20f04ad77e45ce5326b | import | node:module | scripts/voice-instrumentation-landmarks.ts | 1–1 | import { createRequire } from 'node:module'; |
| import:b1c5681b6496575875de6844255be26f | import | node:fs | scripts/voice-instrumentation-landmarks.ts | 2–2 | import { readFileSync } from 'node:fs'; |
| import:50122e99209775fd9e2c10813c9e4ecb | import | node:path | scripts/voice-instrumentation-landmarks.ts | 3–3 | import { dirname, resolve } from 'node:path'; |
| import:033e9125ee241991cc602b78c0d52772 | import | node:crypto | scripts/voice-instrumentation-landmarks.ts | 4–4 | import { createHash } from 'node:crypto'; |
| import:50cffdccf5d428baafd1ea0764613533 | import | ./onnx-progress-plugin | scripts/voice-instrumentation-landmarks.ts | 5–5 | import { patchFileReadSource, patchOnnxRuntime } from './onnx-progress-plugin'; |
| constant:f8ba3478d1fa0df3666b95b8e9615f7a | constant | require | scripts/voice-instrumentation-landmarks.ts | 7–7 | = createRequire(import.meta.url) |
| constant:ee982a77e9c873dae37ad49f2b45c96f | constant | dist | scripts/voice-instrumentation-landmarks.ts | 8–8 | = dirname(require.resolve('@huggingface/transformers')) |
| constant:aac434ec5dbca8887d56f0942b41200d | constant | file | scripts/voice-instrumentation-landmarks.ts | 9–9 | = resolve(dist, 'transformers.web.js') |
| constant:1ec129fc42a598473c1f56074683bf92 | constant | source | scripts/voice-instrumentation-landmarks.ts | 10–10 | = readFileSync(file, 'utf8') |
| constant:cfce7a358e577a7945484774d5c745a3 | constant | anchors | scripts/voice-instrumentation-landmarks.ts | 12–12 | = ['var InferenceSession = ONNX.InferenceSession;', 'status: "download",\n    name: path_or_repo_id,\n... |
| file:server.ts | file | server.ts | server.ts | 1–488 |  |
| import:1cb08003e14076d13c5415b74af79775 | import | express | server.ts | 1–1 | import express from 'express'; |
| import:ee0f0c045b11fde70a97779cdc76b937 | import | path | server.ts | 2–2 | import path from 'path'; |
| import:9b825b8179376fd06593ef9aa5f5764e | import | fs | server.ts | 3–3 | import fs from 'fs'; |
| import:1aa91ef99ba9a6958e48bf5453cabfcc | import | url | server.ts | 4–4 | import { fileURLToPath } from 'url'; |
| import:c98ef4723beb18cafb418679e796fbda | import | @google/genai | server.ts | 5–5 | import { GoogleGenAI } from '@google/genai'; |
| import:5138ea69c3f0e9532b9142f70d480491 | import | mime | server.ts | 6–6 | import mime from 'mime'; |
| import:b0dd43754e7cd81d675303580baa8fd8 | import | ./server/inference/registry | server.ts | 7–7 | import { resolveEngine } from './server/inference/registry'; |
| import:15cb50aad0fc088d076e20bc378dd6dc | import | ./server/inference/types | server.ts | 8–8 | import { InferenceError } from './server/inference/types'; |
| import:76b7a02f4f4689467e1d47768f84ab80 | import | ./server/inference/metering | server.ts | 9–9 | import { recordUsage } from './server/inference/metering'; |
| constant:a18b5208a905a6f53a3566c93dceafb2 | constant | __filename | server.ts | 11–11 | = fileURLToPath(import.meta.url) |
| constant:d0c170d141f003697e18765b938bf5cb | constant | __dirname | server.ts | 12–12 | = path.dirname(__filename) |
| variable:8bf6682d27d50f87113962eb7ed6f2c8 | variable | detectedKeyLeakedOrInvalid | server.ts | 14–14 | = false |
| variable:f79995bfdee1c78a250601da6f5d469a | variable | lastKnownApiKey | server.ts | 15–15 | = process.env.GEMINI_API_KEY &#124;&#124; '' |
| function:2c25187b823f3993b66779653cffbc7c | function | syncEnvFile | server.ts | 18–47 | () |
| function:3af433ce6913d502e9fc33373a4676aa | function | getAIClient | server.ts | 50–65 | (): GoogleGenAI |
| constant:4a92873ad604b8ff961f0dcd31d07053 | constant | app | server.ts | 67–67 | = express() |
| constant:79a17bf6a2e099af99ab76848f49dd71 | constant | PORT | server.ts | 68–68 | = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000 |
| interface:c268d4894044abaccc4c0091671acb2e | interface | WavConversionOptions | server.ts | 72–76 |  |
| property:9b125ee83f3baa442881a846eb493f4a | property | WavConversionOptions::numChannels | server.ts | 73–73 | number numChannels |
| property:5c4797c26085c7b2e616e9ca5086dff8 | property | WavConversionOptions::sampleRate | server.ts | 74–74 | number sampleRate |
| property:d66a157e5e9d4ea32f4908bcb012ce22 | property | WavConversionOptions::bitsPerSample | server.ts | 75–75 | number bitsPerSample |
| function:6465610d9c2cf5ab3c9b81c6217be164 | function | parseMimeType | server.ts | 78–106 | (mimeType: string): WavConversionOptions |
| function:1c5c40fec0e9edc86752a7bb4f410ddb | function | createWavHeader | server.ts | 108–129 | (dataLength: number, options: WavConversionOptions): Buffer |
| function:8d204fd3daf23374ac8d1a2bca400596 | function | convertToWav | server.ts | 131–136 | (rawData: string, mimeType: string): Buffer |
| function:467cd4d2ca399786afd2d513b11a1af4 | function | splitIntoSpeechChunks | server.ts | 139–171 | (text: string, maxLen = 160): string[] |
| constant:d958ce051a36e3d02816c0ea22c13e54 | constant | serverTtsCache | server.ts | 174–174 | = new Map<string, { audio: string; mimeType: string }>() |
| route:server.ts:177:POST:/api/tts | route | server.ts::POST:/api/tts | server.ts | 177–177 |  |
| route:server.ts:367:POST:/api/chat | route | server.ts::POST:/api/chat | server.ts | 367–367 |  |
| route:server.ts:424:POST:/api/readings | route | server.ts::POST:/api/readings | server.ts | 424–424 |  |
| function:26f53c4a32a12097967f892a73081d65 | function | startServer | server.ts | 462–482 | () |
| file:server/inference/engines/gemini.ts | file | server/inference/engines/gemini.ts | server/inference/engines/gemini.ts | 1–100 |  |
| import:0a9650f57fa54fe53165634bca8ebb7d | import | @google/genai | server/inference/engines/gemini.ts | 1–1 | import { GoogleGenAI } from '@google/genai'; |
| import:38c1c22e7f57cfa3ce83962927fb4bec | import | ../types | server/inference/engines/gemini.ts | 2–7 | import {   CompletionRequest,   CompletionResult,   InferenceEngine,   InferenceError, } from '../types'; |
| variable:721963504d1b18b09586e1b9c0307fdf | variable | detectedKeyLeakedOrInvalid | server/inference/engines/gemini.ts | 14–14 | = false |
| variable:5a3077496241bc10f99057aa39ea9831 | variable | lastKnownApiKey | server/inference/engines/gemini.ts | 15–15 | = process.env.GEMINI_API_KEY &#124;&#124; '' |
| function:0fb53aa6929cb57ad77ee1f14c15459c | function | resetGeminiKeyHealthIfRotated | server/inference/engines/gemini.ts | 17–22 | (): void |
| function:45fabfff5d92b97a830485706666473d | function | geminiKeyUnhealthy | server/inference/engines/gemini.ts | 24–26 | (): boolean |
| function:a9ba73d67928f5cc02a36cb761e902c3 | function | client | server/inference/engines/gemini.ts | 28–34 | (): GoogleGenAI |
| constant:3bad1ef47104407cceaf728f72363939 | constant | geminiEngine | server/inference/engines/gemini.ts | 36–99 | = {   id: 'gemini',   defaultModel: 'gemini-3.8-flash',    available(): boolean {     return Bool... |
| function:383c22d81a31de941edef85b306d9ec3 | function | available | server/inference/engines/gemini.ts | 40–42 | (): boolean |
| function:0508ff9987dce747f8fe532463e1172c | function | complete | server/inference/engines/gemini.ts | 44–98 | (req: CompletionRequest): Promise<CompletionResult> |
| file:server/inference/engines/openai-compatible.ts | file | server/inference/engines/openai-compatible.ts | server/inference/engines/openai-compatible.ts | 1–203 |  |
| import:68b0d7c923a12b8198a475d37b2c73ae | import | ../types | server/inference/engines/openai-compatible.ts | 1–6 | import {   CompletionRequest,   CompletionResult,   InferenceEngine,   InferenceError, } from '../types'; |
| interface:5e49069409026cae5105be2c25168aab | interface | OpenAICompatibleConfig | server/inference/engines/openai-compatible.ts | 20–30 |  |
| property:370b134b4fb6a003f33ae1c8d7cbbc8e | property | OpenAICompatibleConfig::id | server/inference/engines/openai-compatible.ts | 21–21 | string id |
| property:58047f84dec092a796df87a0bf6d2094 | property | OpenAICompatibleConfig::label | server/inference/engines/openai-compatible.ts | 23–23 | string label |
| property:2b70f1ab87fd9fb46f5a601dea7b8850 | property | OpenAICompatibleConfig::baseUrl | server/inference/engines/openai-compatible.ts | 24–24 | () => string baseUrl |
| property:90ef5345a0f7769d6b2a0878c94c92f0 | property | OpenAICompatibleConfig::apiKey | server/inference/engines/openai-compatible.ts | 25–25 | () => string apiKey |
| property:0e427fd746621d6825a9d35a0ff36274 | property | OpenAICompatibleConfig::defaultModels | server/inference/engines/openai-compatible.ts | 27–27 | () => string[] defaultModels |
| property:a01a5d5cf0d8f10bbc4ca247a6c47ec9 | property | OpenAICompatibleConfig::extraHeaders | server/inference/engines/openai-compatible.ts | 29–29 | () => Record<string, string> extraHeaders |
| interface:262f88a17ed11426746abc34474c6100 | interface | OpenAIChoice | server/inference/engines/openai-compatible.ts | 32–34 |  |
| property:b4940bb09f94dc8c1011f6e9c926b60b | property | OpenAIChoice::message | server/inference/engines/openai-compatible.ts | 33–33 | { content?: string &#124; null } message |
| interface:d401f774e5b554f2e7bf10d7dd33cad9 | interface | OpenAIResponse | server/inference/engines/openai-compatible.ts | 35–44 |  |
| property:e501555795d0f2137f7a4f2a9453ecd9 | property | OpenAIResponse::choices | server/inference/engines/openai-compatible.ts | 36–36 | OpenAIChoice[] choices |
| property:18707934c596aee37de63c3955eeeb5d | property | OpenAIResponse::model | server/inference/engines/openai-compatible.ts | 37–37 | string model |
| property:b6c65098ef6d86af097adeba92d42c3f | property | OpenAIResponse::usage | server/inference/engines/openai-compatible.ts | 38–42 | {     prompt_tokens?: number;     completion_tokens?: number;     total_tokens?: number;   } usage |
| property:3dcbfc2ed8d493d6df9b84a7cf9dc4ba | property | OpenAIResponse::error | server/inference/engines/openai-compatible.ts | 43–43 | { message?: string } &#124; string error |
| function:e6b41c12eac3dde6ae3efdc0f86de9ab | function | errorMessage | server/inference/engines/openai-compatible.ts | 46–49 | (payload: OpenAIResponse, status: number): string |
| function:accc50ac0e520c7460bc80d00594e75a | function | makeOpenAICompatibleEngine | server/inference/engines/openai-compatible.ts | 51–170 | (config: OpenAICompatibleConfig): InferenceEngine |
| constant:d7fc01d01d79265002944db842be8332 | constant | customOpenAIEngine | server/inference/engines/openai-compatible.ts | 173–187 | = makeOpenAICompatibleEngine({   id: 'openai-compatible',   label: 'Custom OpenAI-compatible endpoin... |
| constant:99a57265dd8067e7c37dd4f764f292ae | constant | veniceEngine | server/inference/engines/openai-compatible.ts | 192–202 | = makeOpenAICompatibleEngine({   id: 'venice',   label: 'Venice.ai',   baseUrl: () => process.env.V... |
| file:server/inference/engines/openrouter.ts | file | server/inference/engines/openrouter.ts | server/inference/engines/openrouter.ts | 1–217 |  |
| import:f4289cb3c8390ac107847bccc4c93554 | import | ../types | server/inference/engines/openrouter.ts | 1–6 | import {   CompletionRequest,   CompletionResult,   InferenceEngine,   InferenceError, } from '../types'; |
| function:5d39b57e4c9704b4b79479c8957e147f | function | openRouterBase | server/inference/engines/openrouter.ts | 22–23 | () |
| constant:a8c61976c4f56250a74f169824151400 | constant | FREE_MODEL_CHAIN | server/inference/engines/openrouter.ts | 25–29 | = [   'nvidia/nemotron-3.5-lightning:free',   'thinkingmachines/inkling:free',   'poolside/laguna-s... |
| function:ffd9a18083befda73010a3e2a99a3b2a | function | discoverLiveFreeModel | server/inference/engines/openrouter.ts | 33–48 | (base: string, tried: string[]): Promise<string &#124; null> |
| function:9bcf7122cfa410d12540cc76ae8c4f37 | function | configuredChain | server/inference/engines/openrouter.ts | 50–55 | (): string[] |
| function:3105f32c0edb92ab64878f51b350faa4 | function | resolveModels | server/inference/engines/openrouter.ts | 58–62 | (requested: string &#124; undefined): string[] |
| interface:4381b18cc9d0b3c73b4a1e8d2134d128 | interface | OpenRouterChoice | server/inference/engines/openrouter.ts | 64–66 |  |
| property:4e7e407890f523869bb2f59f51964533 | property | OpenRouterChoice::message | server/inference/engines/openrouter.ts | 65–65 | { content?: string &#124; null } message |
| interface:e135ce19b396e752316c7828e9921e9b | interface | OpenRouterResponse | server/inference/engines/openrouter.ts | 67–77 |  |
| property:f574e46875fe1a627e037b9be5eb38e2 | property | OpenRouterResponse::choices | server/inference/engines/openrouter.ts | 68–68 | OpenRouterChoice[] choices |
| property:8a7e2abc87f262d58404facc91163256 | property | OpenRouterResponse::model | server/inference/engines/openrouter.ts | 69–69 | string model |
| property:ecb1abd03986d4ea7f006b3a204573ed | property | OpenRouterResponse::usage | server/inference/engines/openrouter.ts | 70–75 | {     prompt_tokens?: number;     completion_tokens?: number;     total_tokens?: number;     cost?: { total?: number };   } usage |
| property:c93ca978d1e6e52f076779641d24ec9f | property | OpenRouterResponse::error | server/inference/engines/openrouter.ts | 76–76 | { message?: string; code?: number &#124; string } error |
| constant:591fba115629aaf7bd356d20bd99d672 | constant | openRouterEngine | server/inference/engines/openrouter.ts | 79–216 | = {   id: 'openrouter',    get defaultModel(): string {     return configuredChain()[0];   },  ... |
| function:4df899be5c4f2857cbc243f7ba6af400 | function | defaultModel | server/inference/engines/openrouter.ts | 82–84 | (): string |
| function:18d6257a5a0792c7bf8752c94123cc9f | function | available | server/inference/engines/openrouter.ts | 86–89 | (): boolean |
| function:21ac96e6e099b553bdd399cd75ca5917 | function | complete | server/inference/engines/openrouter.ts | 91–215 | (req: CompletionRequest): Promise<CompletionResult> |
| function:e1526465846bdf7c487df34b80d02d19 | function | complete::attemptChain | server/inference/engines/openrouter.ts | 138–199 | (models: string[]): Promise<CompletionResult> |
| file:server/inference/metering.ts | file | server/inference/metering.ts | server/inference/metering.ts | 1–25 |  |
| import:52563040de1a67f9cf875a9561286efa | import | ./types | server/inference/metering.ts | 1–1 | import type { UsageReport } from './types'; |
| function:10b662b33df781a03469624f39402368 | function | recordUsage | server/inference/metering.ts | 11–24 | (   engine: string,   model: string,   usage: UsageReport &#124; undefined,   subject?: string, ): void |
| file:server/inference/registry.ts | file | server/inference/registry.ts | server/inference/registry.ts | 1–86 |  |
| import:7fbabcf281366546d9e47205ceb6a045 | import | ./engines/gemini | server/inference/registry.ts | 1–1 | import { geminiEngine } from './engines/gemini'; |
| import:ffc401c0061aecf4f5f0e348481bb91a | import | ./engines/openrouter | server/inference/registry.ts | 2–2 | import { openRouterEngine } from './engines/openrouter'; |
| import:39c994c1ba47198011c1954bde6b913c | import | ./engines/openai-compatible | server/inference/registry.ts | 3–3 | import { customOpenAIEngine, veniceEngine } from './engines/openai-compatible'; |
| import:39b2ebb077ec314c143ea4c0e3d71186 | import | ./types | server/inference/registry.ts | 4–4 | import { InferenceEngine, InferenceError } from './types'; |
| constant:a0f8e8ad8ed694eee0f5ec99cbfb3c44 | constant | engines | server/inference/registry.ts | 27–32 | = new Map<string, InferenceEngine>([   [geminiEngine.id, geminiEngine],   [openRouterEngine.id, open... |
| function:383d3d085532b96641fe4b84786b97a8 | function | registerEngine | server/inference/registry.ts | 34–36 | (engine: InferenceEngine): void |
| variable:e191d5f56639aae04d5b784a31147e2d | variable | activeEngine | server/inference/registry.ts | 38–38 | = null |
| variable:be2b7b57801b911f926e5d7d19cb8399 | variable | activeReason | server/inference/registry.ts | 39–39 | = '' |
| function:9a628494d6d35c7b80272544e3599927 | function | fallbackEngine | server/inference/registry.ts | 42–47 | (): InferenceEngine &#124; null |
| function:d2e1fca9351bfa0df1a2e6cabb3119e5 | function | resolveEngine | server/inference/registry.ts | 49–79 | (): InferenceEngine |
| function:513ea15f108104353512d05332c9210b | function | resetEngineCache | server/inference/registry.ts | 82–85 | (): void |
| file:server/inference/types.ts | file | server/inference/types.ts | server/inference/types.ts | 1–86 |  |
| interface:19d2735594b79cde32bc1ccb49dc4f33 | interface | ChatTurn | server/inference/types.ts | 16–19 |  |
| property:d8d61bbd37bb3fb3fe7ec5e4ae121e25 | property | ChatTurn::role | server/inference/types.ts | 17–17 | 'user' &#124; 'assistant' role |
| property:6fe5782f1ce44dc7e7c409af859d3ccc | property | ChatTurn::content | server/inference/types.ts | 18–18 | string content |
| interface:03c76f71870294cb7af8c62f4298a35f | interface | CompletionImage | server/inference/types.ts | 21–24 |  |
| property:7cbde7cb6231f1cdd713a94bffe48109 | property | CompletionImage::data | server/inference/types.ts | 22–22 | string data |
| property:668c465a8d14dd713a2564bbe79bd817 | property | CompletionImage::mimeType | server/inference/types.ts | 23–23 | string mimeType |
| interface:7b5a04446e14321579e780289e89441b | interface | CompletionRequest | server/inference/types.ts | 26–41 |  |
| property:292568fed0b899b8fe4eb8cc9523555d | property | CompletionRequest::prompt | server/inference/types.ts | 27–27 | string prompt |
| property:d9bd388efa947f2a324ca227a720aaeb | property | CompletionRequest::systemInstruction | server/inference/types.ts | 28–28 | string systemInstruction |
| property:95258d879a6f84c60d090bb2bb996958 | property | CompletionRequest::history | server/inference/types.ts | 30–30 | readonly ChatTurn[] history |
| property:87f218413480d758faf4725f527b6950 | property | CompletionRequest::image | server/inference/types.ts | 32–32 | CompletionImage image |
| property:c67cd896697723bddb54d337843effb4 | property | CompletionRequest::model | server/inference/types.ts | 34–34 | string model |
| property:02daa298829389a570772328fba51b8f | property | CompletionRequest::temperature | server/inference/types.ts | 35–35 | number temperature |
| property:2333a91fb1740966192ba425298c0f46 | property | CompletionRequest::topP | server/inference/types.ts | 36–36 | number topP |
| property:75a1c37cb7e066942481920e333344b2 | property | CompletionRequest::topK | server/inference/types.ts | 37–37 | number topK |
| property:560ce8e479fdfb466b0c910a83fccbb7 | property | CompletionRequest::maxOutputTokens | server/inference/types.ts | 38–38 | number maxOutputTokens |
| property:40906f6037ca79110f2bd8eef047afc8 | property | CompletionRequest::subject | server/inference/types.ts | 40–40 | string subject |
| interface:15749fe28ccc0063337350aa8d5ef4a2 | interface | UsageReport | server/inference/types.ts | 43–49 |  |
| property:331e9263c5cdd8b569df0b5d273a84fa | property | UsageReport::promptTokens | server/inference/types.ts | 44–44 | number promptTokens |
| property:0ef6cf83af8dcc8b9743f0748eb92474 | property | UsageReport::completionTokens | server/inference/types.ts | 45–45 | number completionTokens |
| property:db42127950b9c917adad563dc73d9001 | property | UsageReport::totalTokens | server/inference/types.ts | 46–46 | number totalTokens |
| property:3fb6cc20564c00d41c114bc3ec9ce5b0 | property | UsageReport::costUsd | server/inference/types.ts | 48–48 | number costUsd |
| interface:9aef36f87fcf3c008b5155bce2c30627 | interface | CompletionResult | server/inference/types.ts | 51–56 |  |
| property:42a33ce1a6de1242f11befa38c1b2a3c | property | CompletionResult::text | server/inference/types.ts | 52–52 | string text |
| property:ee10b2d5cbdf61c25469b4f13b818740 | property | CompletionResult::model | server/inference/types.ts | 53–53 | string model |
| property:ba94ced4ec8bd6910393a1befcb19878 | property | CompletionResult::engine | server/inference/types.ts | 54–54 | string engine |
| property:9d682b54b55f3c3bb864167c8a1eceb7 | property | CompletionResult::usage | server/inference/types.ts | 55–55 | UsageReport usage |
| type_alias:8f0d8b51fe0f9a8120141c37e4b4a29b | type_alias | InferenceErrorCode | server/inference/types.ts | 58–64 |  |
| class:9ef4fe55c805513ce2da33b059a86968 | class | InferenceError | server/inference/types.ts | 66–76 |  |
| property:c92ec9c5e45a849e2edd6c61ff829749 | property | InferenceError::code | server/inference/types.ts | 67–67 | InferenceErrorCode code |
| property:89e5658e05b49d8f00b74497f43db892 | property | InferenceError::httpStatus | server/inference/types.ts | 68–68 | number httpStatus |
| method:029412a63a15a83fa53dd22b12f8c210 | method | InferenceError::constructor | server/inference/types.ts | 70–75 | (message: string, code: InferenceErrorCode = 'INFERENCE_FAILED', httpStatus = 500) |
| interface:9ea70bde21281fb34b95d888201ad757 | interface | InferenceEngine | server/inference/types.ts | 78–85 |  |
| property:727a966972df1313c07517a7ae4815ae | property | InferenceEngine::id | server/inference/types.ts | 79–79 | string id |
| property:6e37c1a09a18d8f4f4d32fb44b16e8d3 | property | InferenceEngine::defaultModel | server/inference/types.ts | 81–81 | string defaultModel |
| method:9496189771779f7720e7ed4e02316997 | method | InferenceEngine::available | server/inference/types.ts | 83–83 | (): boolean |
| method:9c7814f5590250b424adb34880ea4507 | method | InferenceEngine::complete | server/inference/types.ts | 84–84 | (req: CompletionRequest): Promise<CompletionResult> |
| file:src/App.tsx | file | src/App.tsx | src/App.tsx | 1–1048 |  |
| import:2d7b51c441fa7886e203f2c200a19c43 | import | react | src/App.tsx | 1–1 | import React, { useState, useEffect, useCallback, useRef } from 'react'; |
| import:bc0d574f94dec359e0dbc6bdc8798c00 | import | lucide-react | src/App.tsx | 2–9 | import {   Sparkles,   Share2,   BookOpen,   User,   RotateCcw,   Compass, } from 'lucide-react'; |
| import:b80f57bb1697d468528a8cb3a8f2fec3 | import | ./components/Astrolabe3D | src/App.tsx | 10–10 | import { Astrolabe3D } from './components/Astrolabe3D'; |
| import:5b9891d069ce4f930016e16a92f83f47 | import | ./services/chartTargets | src/App.tsx | 11–11 | import { chartFocusKey, chartFocusKeyMatches, chartTargetLabel, resolveChartTarget } from './services/chartTargets'; |
| import:5d92008b8b20c785c598fb968c9cf304 | import | ./services/transits | src/App.tsx | 12–12 | import { calculateCurrentSkySnapshot } from './services/transits'; |
| import:fd459f90127992eb83ce98ec1da125f7 | import | ./services/presentation | src/App.tsx | 13–13 | import { initialPresentation, reducePresentation, type PresentationAction, type PresentationCue, type PresentationView } from './services/presentation'; |
| import:068ce8dc9439fddc4542f67fda986643 | import | ./components/ReadingStage | src/App.tsx | 14–14 | import { ReadingStage } from './components/ReadingStage'; |
| import:a007c4ce3065bfc321945da4195c301c | import | ./components/ChartSelectionDetails | src/App.tsx | 15–15 | import { ChartSelectionDetails } from './components/ChartSelectionDetails'; |
| import:a02b50c7d2f79c10bc8f45f1095b8bba | import | ./components/AboutDialog | src/App.tsx | 16–16 | import { ProfileAbout } from './components/AboutDialog'; |
| import:17abc235d6607bc6bc3431d2c35803a7 | import | ./services/historyLifecycle | src/App.tsx | 17–17 | import { HISTORY_ERASURE_EVENT, isNatallyHistoryErasing, type HistoryErasureNotice } from './services/historyLifecycle'; |
| import:ba97d4a52cc0bb6875ce54cd897f20d6 | import | ./services/natallyChat | src/App.tsx | 18–18 | import type { ChartCue } from './services/natallyChat'; |
| import:fcd0dfba106c6de80727ac81b9f875aa | import | ./components/DraggableCard | src/App.tsx | 19–19 | import { DraggableCard } from './components/DraggableCard'; |
| import:4fafb60ed5a65400d5904f8085cfd38a | import | ./components/onboarding/FirstLight | src/App.tsx | 20–20 | import { FirstLight } from './components/onboarding/FirstLight'; |
| import:68154a0a83a5eb28d66b95c249eca791 | import | ./components/NatalInputForm | src/App.tsx | 21–21 | import { NatalInputForm } from './components/NatalInputForm'; |
| import:a91eac2bc2ed5c243e11dfc45b00adbb | import | ./components/ThemesAndWisdomBox | src/App.tsx | 22–22 | import { ThemesAndWisdomBox } from './components/ThemesAndWisdomBox'; |
| import:b98df2a2d1ce08b57a9b5169b69b9d5c | import | ./components/NatallyChatbot | src/App.tsx | 23–23 | import { NatallyChatbot } from './components/NatallyChatbot'; |
| import:e0e46d92978ae23a9ad9080edeca7aea | import | ./components/NatallySprite | src/App.tsx | 24–24 | import { NatallySprite } from './components/NatallySprite'; |
| import:4a404523c459a96debb2ec9def8349ba | import | ./components/NatallyIcon | src/App.tsx | 25–25 | import { NatallyIcon } from './components/NatallyIcon'; |
| import:ecb9615ad556aa4593228d7e3868398a | import | ./components/SelectedComponentsBar | src/App.tsx | 26–26 | import { SelectedComponentsBar } from './components/SelectedComponentsBar'; |
| import:f11ca9ec4228c5744b85c06d5e38eaba | import | ./components/PurchaseAccess | src/App.tsx | 27–27 | import { usePurchaseAccess, ReadingPurchaseNotice } from './components/PurchaseAccess'; |
| import:f801e2ee9ccd8e8126b72d47f47b305f | import | ./services/readings | src/App.tsx | 28–28 | import { generateAstrologicalReading } from './services/readings'; |
| import:1e481c58b25da69cd6aec9d9c92c28bf | import | ./services/atelierTheme | src/App.tsx | 29–29 | import { useAtelierTheme } from './services/atelierTheme'; |
| import:fdcce91ee6a93b0d89e80f5aab6cda23 | import | ./components/atelier/AtelierThemeSelector | src/App.tsx | 30–30 | import { AtelierThemeSelector } from './components/atelier/AtelierThemeSelector'; |
| import:615261391dc8c177da65af1c64833ca9 | import | ./services/readingStyle | src/App.tsx | 31–31 | import { saveReadingStyle } from './services/readingStyle'; |
| import:ea9ef9748c79f56e27cf01bd9b46b758 | import | ./components/LearnAndPayments | src/App.tsx | 32–32 | import { LearnAndPayments } from './components/LearnAndPayments'; |
| import:4e018507e62f6589cb59199c401dcc6f | import | ./components/ExportModal | src/App.tsx | 33–33 | import { ExportModal } from './components/ExportModal'; |
| import:d60826c2c7616b4a3938be0479db6a8b | import | ./components/AuthModal | src/App.tsx | 34–34 | import { AuthModal } from './components/AuthModal'; |
| import:af71267da2b1af1b97c0d4919721cb88 | import | ./components/ReadingsModal | src/App.tsx | 35–35 | import { ReadingsModal } from './components/ReadingsModal'; |
| import:d0c2af856593938c0d3dcd31f804fa02 | import | ./services/ephemeris | src/App.tsx | 36–41 | import {   calculateNatalChart,   NatalChartInput,   NatalChartResult,   formatLongitude, } from './services/ephemeris'; |
| import:401595b3a958f645148ad294f5f96d1f | import | ./services/astrowisdom | src/App.tsx | 42–42 | import { computeThemesAndWisdom, NumerologyAndThemes } from './services/astrowisdom'; |
| import:4a5b1172fafef9d3b436666ceddc1c79 | import | ./services/voiceService | src/App.tsx | 43–48 | import {   VoiceSettings,   loadVoiceSettings,   saveVoiceSettings,   stopSpeaking, } from './services/voiceService'; |
| import:3bcea6f29aa9ddedb4ecf439bdb91507 | import | ./services/accountStorage | src/App.tsx | 49–49 | import { loadAccountValue, saveAccountValue } from './services/accountStorage'; |
| import:f040d45daa15decb25f5f801d1275282 | import | ./services/firebase | src/App.tsx | 50–50 | import { auth } from './services/firebase'; |
| import:96f9ade5ee320fd90ae4e955f269bf42 | import | firebase/auth | src/App.tsx | 51–51 | import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth'; |
| import:f1d64f7bb174475659333b124ab5f3e0 | import | ./services/gazetteer | src/App.tsx | 52–52 | import { loadGazetteer } from './services/gazetteer'; |
| import:6eaefff9041c34d0428f6bd198d084bb | import | ./services/sessionProfile | src/App.tsx | 53–53 | import { createSessionProfileLoader, getEntryStage, type SessionProfileState } from './services/sessionProfile'; |
| import:c321dc5b1329e6a8d8a54b42475a28da | import | ./services/onboarding | src/App.tsx | 54–59 | import {   IntakeStorageBillingError,   clearNatalIntake,   fetchUserIntake,   uploadUserIntake, } from './services/onboarding'; |
| import:c583d732b77ad07b3c0c201502b1579b | import | ./services/onboarding | src/App.tsx | 60–65 | import {   IntakeDraft,   intakeToChartInput,   loadNatalIntake,   saveNatalIntake, } from './services/onboarding'; |
| constant:d6f5f9c1c8229c0a1064170753576438 | constant | LORE_STORAGE_KEY | src/App.tsx | 67–67 | = 'astrosphere_user_lore_v1' |
| function:01af6bd9a3f70a072ed32fcd6ee489ba | function | App | src/App.tsx | 69–1047 | () |
| function:a871110dde92f4f8d7699e0ea335b508 | function | App::setSelectedComponents | src/App.tsx | 96–96 | (value: string[] &#124; ((previous:string[])=>string[])) |
| function:423c2860f5cfe721007fc96aac2cbd46 | function | App::handleReadingChart | src/App.tsx | 101–105 | (source:NatalChartResult,archived:boolean) |
| function:fa56db395b795ea507a22361cb905cbc | function | App::handlePresentationAction | src/App.tsx | 106–109 | (action:PresentationAction, sourceChart:NatalChartResult) |
| function:45a4089f10907c5ec17837a153f979aa | function | App::handleChartFocus | src/App.tsx | 110–113 | (targets:string[], sourceChart:NatalChartResult) |
| function:f36f9c53c65a699b08fdc50355077f5b | function | App::setManualView | src/App.tsx | 114–114 | (view:PresentationView) |
| function:3805809c1311e1f7dd59e66c2924df7e | function | App::showTargets | src/App.tsx | 115–121 | (targets:string[]) |
| function:ed1c08152b18e9a56efb166bb3608e20 | function | App::isCurrentSession | src/App.tsx | 174–175 | () |
| function:bc8f6ede84454ab64924922e2a594d34 | function | App::changed | src/App.tsx | 178–190 | (event: Event) |
| function:9570b9440cff54859a39477283ad253b | function | App::onAnyKey | src/App.tsx | 201–210 | (e: KeyboardEvent) |
| function:6fb7bec0b27e28110297789275ce0888 | function | App::runCalculation | src/App.tsx | 276–328 | (input: NatalChartInput, isUserSubmission = false) |
| function:8699937ac7e4d66e3478ffcec10a1f77 | function | App::refreshCurrentSky | src/App.tsx | 330–359 | () |
| function:85bde9e063908cf87ea76a9fca80c9fc | function | App::handleDiscussWithNatally | src/App.tsx | 361–369 | (title: string, query: string) |
| function:ff0eb0fb4b8086cc2cd122aa46deb830 | function | App::handleToggleNatalParams | src/App.tsx | 371–380 | (rolledUp: boolean) |
| function:d40e7a78cc60189bfdcae4222e4ef2ef | function | App::handleOnboarded | src/App.tsx | 384–416 | (draft: IntakeDraft) |
| function:91d8d9da8782ee92ada9884a6d0e26cc | function | App::handleToggleComponent | src/App.tsx | 428–438 | (componentId:string, isMulti:boolean) |
| function:52b6deba9be7cde943c94ad1743e10bc | function | App::handleClearSelection | src/App.tsx | 440–443 | () |
| function:b883614e0e0cc6a2972133901f919b60 | function | App::handleRemoveComponent | src/App.tsx | 445–447 | (id: string) |
| function:d91678738d0f690723b6c9f251b77b3b | function | App::handleBeginIntuitiveReading | src/App.tsx | 450–458 | (components:string[]) |
| function:719ad76d270b327bdecd6cb9214ddaa8 | function | App::handleInstaNow | src/App.tsx | 460–473 | () |
| function:83f5ab15d0c90557ecea1ac9bcd64d1c | function | App::handleInstaNow::current | src/App.tsx | 463–463 | () |
| function:96e23126589206767742aca0cebd26a2 | function | App::handleOpenReading | src/App.tsx | 475–482 | (     type: 'horoscope' &#124; 'synastry' &#124; 'house' &#124; 'planet' &#124; 'aspect',     targetKey?: string   ) |
| function:940ab188c9db28ad2a5bee1892650d77 | function | App::handleAddUserLore | src/App.tsx | 484–487 | (newLore: string) |
| function:101ec5963038326e949d39bf8eede568 | function | App::handleSpeechStateChange | src/App.tsx | 489–498 | (     speaking: boolean,     snippet: string &#124; null,     targetEntity: string &#124; null   ) |
| file:src/components/AboutDialog.tsx | file | src/components/AboutDialog.tsx | src/components/AboutDialog.tsx | 1–92 |  |
| import:e84fbd965f83dbb7d387b4d5af3e53b0 | import | react | src/components/AboutDialog.tsx | 1–1 | import React, { useEffect, useId, useRef, useState } from 'react'; |
| import:43e0628b0739c54905e4a3c66338bba4 | import | react-dom | src/components/AboutDialog.tsx | 2–2 | import { createPortal } from 'react-dom'; |
| import:f6359fcd68272b5f96d4f5eb70a7c705 | import | swisseph-wasm/package.json | src/components/AboutDialog.tsx | 3–3 | import swissPackage from 'swisseph-wasm/package.json'; |
| import:abe6c74244babfbb245fccf5e5cddecf | import | ./AboutDialog.css | src/components/AboutDialog.tsx | 4–4 | import './AboutDialog.css'; |
| import:5e9a04f9de91fa6a41b8bcbff3ce2542 | import | ./EraseNatallyHistoryDialog | src/components/AboutDialog.tsx | 5–5 | import { EraseNatallyHistoryDialog } from './EraseNatallyHistoryDialog'; |
| constant:1896f9516479c77c1d653d84b9494c44 | constant | __NATALLY_BUILD__ | src/components/AboutDialog.tsx | 7–7 |  |
| constant:1026787e0792a0693be446542ebc21e2 | constant | source | src/components/AboutDialog.tsx | 8–8 | = 'https://github.com/rebots-online/natally-ai-studio' |
| constant:3ddbb44f32c25185419a07c3250ace2d | constant | build | src/components/AboutDialog.tsx | 9–9 | = typeof __NATALLY_BUILD__ === 'undefined' ? null : __NATALLY_BUILD__ |
| function:84a9498012963115704143d0d02bb644 | function | AboutDialog | src/components/AboutDialog.tsx | 11–61 | ({ open, onClose }: { open: boolean; onClose: () => void }) |
| function:e9ec92cd23f4c6de3db4da04869b13d2 | function | ProfileAbout | src/components/AboutDialog.tsx | 64–91 | ({ onAccount, accountLabel = 'Account', accountUid }: { onAccount: () => void; accountLabel?: string; accountUid?: string }) |
| function:87f5ae9b6fa26b24a0b2d65775cf4c13 | function | ProfileAbout::outside | src/components/AboutDialog.tsx | 73–73 | (event: PointerEvent) |
| function:22c863efee794813dc0035f41591b792 | function | ProfileAbout::closeAbout | src/components/AboutDialog.tsx | 77–77 | () |
| file:src/components/Astrolabe3D.tsx | file | src/components/Astrolabe3D.tsx | src/components/Astrolabe3D.tsx | 1–1268 |  |
| import:40e0a3ada55beaab1a31938273f7525c | import | react | src/components/Astrolabe3D.tsx | 1–1 | import React, { useEffect, useRef, useMemo } from 'react'; |
| import:b7fdea977098af47a6903aced662419e | import | three | src/components/Astrolabe3D.tsx | 2–2 | import * as THREE from 'three'; |
| import:6e9ea6f9535034952487ab4c84e91d7b | import | ../services/chartFocusVisuals | src/components/Astrolabe3D.tsx | 3–3 | import { CHART_FOCUS, chartHaloOpacity } from '../services/chartFocusVisuals'; |
| import:003b507203551f525c01a49371dd4803 | import | ../services/torusGestures | src/components/Astrolabe3D.tsx | 4–4 | import { bindTorusTouch, getTorusZoomDistance } from '../services/torusGestures'; |
| import:bb089b779d431922740b76e3821c0a6a | import | ../services/ephemeris | src/components/Astrolabe3D.tsx | 5–5 | import { NatalChartResult, ZODIAC_SIGNS } from '../services/ephemeris'; |
| interface:dcfda50312794ba78f875abcb47ffa8a | interface | Astrolabe3DProps | src/components/Astrolabe3D.tsx | 7–21 |  |
| property:e0b4445faa054f6ba2cab1ef456a1166 | property | Astrolabe3DProps::chart | src/components/Astrolabe3D.tsx | 8–8 | NatalChartResult chart |
| property:5f2af4aea7b412c7fc1c71d349b2fca2 | property | Astrolabe3DProps::isSpinning | src/components/Astrolabe3D.tsx | 9–9 | boolean isSpinning |
| property:5a2cc78fc46f933a97a5b5de40bd1c39 | property | Astrolabe3DProps::resetTrigger | src/components/Astrolabe3D.tsx | 10–10 | number resetTrigger |
| property:fb2157d40e17f088f97934a56c3b2281 | property | Astrolabe3DProps::selectedComponents | src/components/Astrolabe3D.tsx | 11–11 | string[] selectedComponents |
| property:f442c33f5606626d7cebf678b26fe3e6 | property | Astrolabe3DProps::highlightedComponents | src/components/Astrolabe3D.tsx | 12–12 | string[] highlightedComponents |
| property:73d69a3b266c297aad40243c3452ba85 | property | Astrolabe3DProps::focusSequence | src/components/Astrolabe3D.tsx | 13–13 | number focusSequence |
| property:1ea674a8675cccce83841fb3a863d524 | property | Astrolabe3DProps::reducedMotion | src/components/Astrolabe3D.tsx | 14–14 | boolean reducedMotion |
| property:8ec6455dbfbece31f22af1912493c3ef | property | Astrolabe3DProps::motionPaused | src/components/Astrolabe3D.tsx | 15–15 | boolean motionPaused |
| property:3bd7f48ea2a4f94e74c28f79b7e3d71a | property | Astrolabe3DProps::visible | src/components/Astrolabe3D.tsx | 16–16 | boolean visible |
| property:0a7f50b520883cd2d283502f0d5aec64 | property | Astrolabe3DProps::layoutKey | src/components/Astrolabe3D.tsx | 17–17 | string layoutKey |
| property:de802ef54b9fe906db30086c5b359a5e | property | Astrolabe3DProps::onToggleComponent | src/components/Astrolabe3D.tsx | 18–18 | (id: string, isMulti: boolean) => void onToggleComponent |
| property:38e1de0c54feecd129a2226b7f20eb14 | property | Astrolabe3DProps::selectedPlanetName | src/components/Astrolabe3D.tsx | 19–19 | string &#124; null selectedPlanetName |
| property:7079ce6e06e35d5fa4cd4f30328a3599 | property | Astrolabe3DProps::onSelectPlanet | src/components/Astrolabe3D.tsx | 20–20 | (name: string &#124; null) => void onSelectPlanet |
| function:71884c1c1bcb740dd03f315fcb36cd3d | function | Astrolabe3D | src/components/Astrolabe3D.tsx | 23–1267 | ({   chart,   isSpinning,   resetTrigger,   selectedComponents = [],   highlightedComponents = [],   focusSequence = 0,   reducedMotion = false,   motionPaused = false,   visible = true,   layoutKey,   onToggleComponent,   selectedPlanetName,   onSelectPlanet, }) |
| function:33bf0ca4aadec9b6b31a41f60efe89b9 | function | Astrolabe3D::redraw | src/components/Astrolabe3D.tsx | 67–67 | () |
| function:fffb9175edee80a4177738fe5bd75bd6 | function | Astrolabe3D::startDrag | src/components/Astrolabe3D.tsx | 289–297 | (clientX: number, clientY: number) |
| function:97cff37f5c4cc79faee06c00ca548ac6 | function | Astrolabe3D::updateDrag | src/components/Astrolabe3D.tsx | 299–321 | (clientX: number, clientY: number) |
| function:3e8d39fd89ca42425bf3b8f7c8bbbb26 | function | Astrolabe3D::endDrag | src/components/Astrolabe3D.tsx | 323–329 | () |
| function:5726f5d4df70a2808ac8f57e301af3fe | function | Astrolabe3D::onMouseDown | src/components/Astrolabe3D.tsx | 331–343 | (e: MouseEvent) |
| function:662f53e3b0ab8198d5cfe3f3001e29af | function | Astrolabe3D::onMouseUp | src/components/Astrolabe3D.tsx | 345–348 | () |
| function:0a7102a9b26ece87ab4eaccbaeae96c2 | function | Astrolabe3D::pickChartTargets | src/components/Astrolabe3D.tsx | 350–367 | () |
| function:a0e07a36290f59c3c1c55ca2970c59ec | function | Astrolabe3D::pickChartTargets::distance | src/components/Astrolabe3D.tsx | 361–364 | (hit: THREE.Intersection) |
| function:5c52b3762700c9987035f4b02361ff36 | function | Astrolabe3D::onMouseMove | src/components/Astrolabe3D.tsx | 369–439 | (event: MouseEvent) |
| function:1d11bebf489359dd21572a728f2ed42a | function | Astrolabe3D::zoom | src/components/Astrolabe3D.tsx | 441–445 | (factor: number) |
| function:dcd029a1e83baeeb16453e1bec965f7e | function | Astrolabe3D::onClick | src/components/Astrolabe3D.tsx | 465–497 | (event: MouseEvent) |
| function:9d4bfff9acbc38c6b360788c2fd168ac | function | Astrolabe3D::onWheel | src/components/Astrolabe3D.tsx | 499–502 | (event: WheelEvent) |
| function:87b84422b6de8faf348f819451f91b53 | function | Astrolabe3D::onMouseLeave | src/components/Astrolabe3D.tsx | 504–513 | () |
| function:3f50333b2f1aa4e3609e213f527f1e29 | function | Astrolabe3D::animate | src/components/Astrolabe3D.tsx | 527–579 | () |
| function:16b163466feefa167292bc5a7c063664 | function | Astrolabe3D::wake | src/components/Astrolabe3D.tsx | 580–583 | () |
| function:d255c9ca68595d78b8b8f00726568d71 | function | Astrolabe3D::handleResize | src/components/Astrolabe3D.tsx | 589–604 | () |
| function:03f372910a519999c0ee04797dcba4b5 | function | Astrolabe3D::onContextLost | src/components/Astrolabe3D.tsx | 605–610 | (event: Event) |
| function:d68a52524c08421ea7734d3f48b85a74 | function | Astrolabe3D::onContextRestored | src/components/Astrolabe3D.tsx | 611–615 | () |
| function:26c9b39413f0668f5a70b4d66688f063 | function | Astrolabe3D::lonToRad | src/components/Astrolabe3D.tsx | 678–681 | (lon: number): number |
| function:3f8d8533bfb08104f4c9fb0cd9d4fa09 | function | Astrolabe3D::createGlyphSprite | src/components/Astrolabe3D.tsx | 683–764 | (       text: string,       subText: string,       colorHex: string,       scale = 0.36,       isHighlighted = false     ): THREE.Sprite |
| function:d2748534ccd8519c116586a1a9ef06b2 | function | Astrolabe3D::addEndpointLabel | src/components/Astrolabe3D.tsx | 985–999 | (kind: 'NATAL' &#124; 'NOW', name: string, glyph: string, placement: string, point: THREE.Vector3, target: string, persistent: boolean) |
| function:2caf115ba52f3b9396bd330715793558 | function | Astrolabe3D::addAspect | src/components/Astrolabe3D.tsx | 1116–1174 | (asp: VisibleAspect, from: THREE.Vector3, to: THREE.Vector3, transit: boolean) |
| function:0cc2ae364e830d29c41878418b6be507 | function | Astrolabe3D::addAspect::tube | src/components/Astrolabe3D.tsx | 1132–1135 | (path: THREE.Curve<THREE.Vector3>, radius: number, color: number, opacity: number) |
| function:c3308d9ba402701ff020879575021b67 | function | Astrolabe3D::addAspect::addHoverPath | src/components/Astrolabe3D.tsx | 1161–1164 | (path: THREE.Curve<THREE.Vector3>) |
| function:6d07d294e46c7f6242019042cbf17bfa | function | Astrolabe3D::applyHover | src/components/Astrolabe3D.tsx | 1201–1218 | (name: string &#124; null) |
| file:src/components/AuthModal.tsx | file | src/components/AuthModal.tsx | src/components/AuthModal.tsx | 1–355 |  |
| import:f6ef56f0e27a5680c62926ccb09607f9 | import | react | src/components/AuthModal.tsx | 1–1 | import React, { useState } from 'react'; |
| import:a1da699e343d0e65352ef4f4d0feae1a | import | ./NatallyIcon | src/components/AuthModal.tsx | 2–2 | import { NatallyIcon } from './NatallyIcon'; |
| import:60f93113bcc83c4771134ce272db069c | import | lucide-react | src/components/AuthModal.tsx | 3–3 | import { X, LogIn, UserPlus, LogOut, Phone, Mail, ShieldCheck } from 'lucide-react'; |
| import:dd2b9f817263f7ec7f4a0b9214a9766c | import | ../services/firebase | src/components/AuthModal.tsx | 4–14 | import {   auth,   googleProvider,   signInWithPopup,   signOut,   signInWithEmailAndPassword,   createUserWithEmailAndPassword,   RecaptchaVerifier,   signInWithPhoneNumber,   ConfirmationResult, } from '../services/firebase'; |
| import:7524927b6bc277cdaeba3619d0f7e6a2 | import | firebase/auth | src/components/AuthModal.tsx | 15–15 | import { User } from 'firebase/auth'; |
| interface:8c90fb224417125d4a4215fce91a9bc0 | interface | AuthModalProps | src/components/AuthModal.tsx | 17–23 |  |
| property:68933cfc20b4c61ea1740f47dc7beabf | property | AuthModalProps::user | src/components/AuthModal.tsx | 18–18 | User &#124; null user |
| property:7f4cd0dd149f96cf45964f964e72bcf4 | property | AuthModalProps::onClose | src/components/AuthModal.tsx | 19–19 | () => void onClose |
| property:95874ea19e23d43cf54171d665ba31e8 | property | AuthModalProps::onReonboard | src/components/AuthModal.tsx | 21–21 | () => void onReonboard |
| property:b6acde2eb94f6c3390712063789da767 | property | AuthModalProps::required | src/components/AuthModal.tsx | 22–22 | boolean required |
| function:992c61370d04adbbf8c8854e345ca7e3 | function | AuthModal | src/components/AuthModal.tsx | 25–354 | ({ user, onClose, onReonboard, required = false }) |
| function:e8bbad2525bb4350ea7ac074e700943d | function | AuthModal::handleGoogleSignIn | src/components/AuthModal.tsx | 35–46 | () |
| function:7b0a9bc8c65051dffa54afec01b80dec | function | AuthModal::handleEmailAuth | src/components/AuthModal.tsx | 48–64 | (e: React.FormEvent) |
| function:89c91985b0f125865a958920b9043c58 | function | AuthModal::handleSendPhoneCode | src/components/AuthModal.tsx | 66–81 | (e: React.FormEvent) |
| function:43c7011fc1b203dd8499b91e7542f3c2 | function | AuthModal::handleVerifyPhoneCode | src/components/AuthModal.tsx | 83–96 | (e: React.FormEvent) |
| function:6c3c2eee50a9d29b907cb34c750c2699 | function | AuthModal::handleSignOut | src/components/AuthModal.tsx | 98–101 | () |
| file:src/components/ChartSelectionDetails.tsx | file | src/components/ChartSelectionDetails.tsx | src/components/ChartSelectionDetails.tsx | 1–22 |  |
| import:e15c582014122e066f8bb003aa320dc9 | import | react | src/components/ChartSelectionDetails.tsx | 1–1 | import React from 'react'; |
| import:1a16df5e38a17e473f2567f66efd4a4c | import | ../services/ephemeris | src/components/ChartSelectionDetails.tsx | 2–2 | import type { NatalChartResult } from '../services/ephemeris'; |
| import:a0f5543dda61ad702429d06ec4e9630c | import | ../services/chartTargets | src/components/ChartSelectionDetails.tsx | 3–3 | import { chartTargetLabel, resolveChartTarget } from '../services/chartTargets'; |
| function:05fea3c1fdef54562c7def33dad0661b | function | ChartSelectionDetails | src/components/ChartSelectionDetails.tsx | 4–21 | ({ chart, targets, onDiscuss, busy = false }: {chart: NatalChartResult; targets:string[]; onDiscuss:(targets:string[])=>void; busy?:boolean}) |
| file:src/components/DraggableCard.tsx | file | src/components/DraggableCard.tsx | src/components/DraggableCard.tsx | 1–365 |  |
| import:cbf4cd83e788654cd2dcad86a6e1531f | import | react | src/components/DraggableCard.tsx | 1–1 | import React, { useState, useRef, useEffect, useCallback } from 'react'; |
| import:84a33156d16c8dace069248b2403a66d | import | lucide-react | src/components/DraggableCard.tsx | 2–2 | import { GripHorizontal, RotateCcw, Minus, Plus } from 'lucide-react'; |
| interface:2944f4500f174d1a2df2799462e10e41 | interface | DraggableCardProps | src/components/DraggableCard.tsx | 4–21 |  |
| property:08fe356d0a3f8aed61b613962925069f | property | DraggableCardProps::id | src/components/DraggableCard.tsx | 5–5 | string id |
| property:90532782784fdabf722e91b4a6007a64 | property | DraggableCardProps::title | src/components/DraggableCard.tsx | 6–6 | React.ReactNode title |
| property:bf90c0ffe4d6901fd281e07a0b9f8eff | property | DraggableCardProps::icon | src/components/DraggableCard.tsx | 7–7 | React.ReactNode icon |
| property:bc71f261f8461fc1713a1f369ceb11cf | property | DraggableCardProps::children | src/components/DraggableCard.tsx | 8–8 | React.ReactNode children |
| property:5e1bb3c27e11987c2023cf63d61779c3 | property | DraggableCardProps::defaultPosition | src/components/DraggableCard.tsx | 9–9 | { x: number; y: number } defaultPosition |
| property:e6c906a02c411d82e0ef30f8182294f0 | property | DraggableCardProps::defaultWidth | src/components/DraggableCard.tsx | 10–10 | number defaultWidth |
| property:e93263c3c3fdbf1c860b46acdf89ffad | property | DraggableCardProps::minWidth | src/components/DraggableCard.tsx | 11–11 | number minWidth |
| property:73550e07626df55acc1b5a40f23bfa34 | property | DraggableCardProps::minHeight | src/components/DraggableCard.tsx | 12–12 | number minHeight |
| property:a2001f7a708d045584fbcf28a6531ae4 | property | DraggableCardProps::maxHeight | src/components/DraggableCard.tsx | 13–13 | string &#124; number maxHeight |
| property:f113f7a4a876d0e48c8ed1d4200797ed | property | DraggableCardProps::className | src/components/DraggableCard.tsx | 14–14 | string className |
| property:b9f81e771c5d61258fee6e64fdeefb8c | property | DraggableCardProps::extraHeaderControls | src/components/DraggableCard.tsx | 15–15 | React.ReactNode extraHeaderControls |
| property:fc6899649a8bac766ee32da0a6fb5353 | property | DraggableCardProps::allowCollapse | src/components/DraggableCard.tsx | 16–16 | boolean allowCollapse |
| property:940007707900f7a3edbe1c8ea54c281a | property | DraggableCardProps::defaultZIndex | src/components/DraggableCard.tsx | 17–17 | number defaultZIndex |
| property:f86b04821bdc90f069651b1e4f7950ef | property | DraggableCardProps::isCollapsed | src/components/DraggableCard.tsx | 18–18 | boolean isCollapsed |
| property:fe8e80aebf9d01a64cade504618a4637 | property | DraggableCardProps::onToggleCollapse | src/components/DraggableCard.tsx | 19–19 | (collapsed: boolean) => void onToggleCollapse |
| property:756eb8f835c6a800876f4ea80452b6fc | property | DraggableCardProps::resetTrigger | src/components/DraggableCard.tsx | 20–20 | number resetTrigger |
| variable:d181ec530f77aceea44fc1ede439eae6 | variable | globalHighestZIndex | src/components/DraggableCard.tsx | 24–24 | = 50 |
| function:ce6df678625d908c48766d2568cd8cd0 | function | getNextCardZIndex | src/components/DraggableCard.tsx | 25–28 | () |
| function:5b5d02236d1c8a73230c194fa43db69c | function | DraggableCard | src/components/DraggableCard.tsx | 30–364 | ({   id,   title,   icon,   children,   defaultPosition = { x: 0, y: 0 },   defaultWidth = 320,   minWidth = 260,   minHeight = 120,   maxHeight,   className = '',   extraHeaderControls,   allowCollapse = true,   defaultZIndex = 25,   isCollapsed: isCollapsedProp,   onToggleCollapse,   resetTrigger, }) |
| function:811ed35ef3b8e4bcefe7675f32d99d45 | function | DraggableCard::toggleCollapse | src/components/DraggableCard.tsx | 67–74 | () |
| function:ff346ff6644404b87d642597bb2c50b5 | function | DraggableCard::bringToFront | src/components/DraggableCard.tsx | 117–119 | () |
| function:3a1217681f1859920afe5dd32cb4cc8b | function | DraggableCard::clampPos | src/components/DraggableCard.tsx | 122–129 | (newX: number, newY: number) |
| function:d68f9805adc57b8fab14a763979649f4 | function | DraggableCard::handleDragMouseDown | src/components/DraggableCard.tsx | 132–176 | (e: React.MouseEvent) |
| function:04600c82473c86f984e9c0487607375f | function | DraggableCard::handleDragMouseDown::handleMouseMove | src/components/DraggableCard.tsx | 159–166 | (moveEvent: MouseEvent) |
| function:4b270d7b32b5793012949ed7f0847790 | function | DraggableCard::handleDragMouseDown::handleMouseUp | src/components/DraggableCard.tsx | 168–172 | () |
| function:2dd093664a41542b3b06dd3e32e3c92b | function | DraggableCard::handleTouchStart | src/components/DraggableCard.tsx | 179–217 | (e: React.TouchEvent) |
| function:02cd3db8603836eb3491acc38f297289 | function | DraggableCard::handleTouchStart::handleTouchMove | src/components/DraggableCard.tsx | 200–207 | (moveEvent: TouchEvent) |
| function:4d4553b5d4e316f26817d7b2082cf2c9 | function | DraggableCard::handleTouchStart::handleTouchEnd | src/components/DraggableCard.tsx | 209–213 | () |
| function:fc90e646607281d59edd3f2493a4e57f | function | DraggableCard::handleResizeMouseDown | src/components/DraggableCard.tsx | 220–256 | (e: React.MouseEvent) |
| function:97ee6f20aabc930a2ab4ae483d423728 | function | DraggableCard::handleResizeMouseDown::handleMouseMove | src/components/DraggableCard.tsx | 234–246 | (moveEvent: MouseEvent) |
| function:3df9993f4a67a330c28fa655727ee3be | function | DraggableCard::handleResizeMouseDown::handleMouseUp | src/components/DraggableCard.tsx | 248–252 | () |
| function:32f70196d4d2c7a4d590176d63afa849 | function | DraggableCard::handleResetPosition | src/components/DraggableCard.tsx | 258–262 | (e: React.MouseEvent) |
| file:src/components/EraseNatallyHistoryDialog.tsx | file | src/components/EraseNatallyHistoryDialog.tsx | src/components/EraseNatallyHistoryDialog.tsx | 1–51 |  |
| import:58bc819b26bb10e1d32c2c1cfd562991 | import | react | src/components/EraseNatallyHistoryDialog.tsx | 1–1 | import React, { useEffect, useId, useRef, useState } from 'react'; |
| import:fef0331052fb2e0fb332848f42c949c8 | import | react-dom | src/components/EraseNatallyHistoryDialog.tsx | 2–2 | import { createPortal } from 'react-dom'; |
| import:7fd882259f1a8ac1601214df83d0f4d5 | import | ../services/firebase | src/components/EraseNatallyHistoryDialog.tsx | 3–3 | import { auth } from '../services/firebase'; |
| import:a48b18cc71fcb3d85fbbc513b746d520 | import | ../services/natallyHistory | src/components/EraseNatallyHistoryDialog.tsx | 4–4 | import { eraseWholeNatallyHistory } from '../services/natallyHistory'; |
| function:7a323f3fcd216551a08215ad857e9cd7 | function | EraseNatallyHistoryDialog | src/components/EraseNatallyHistoryDialog.tsx | 6–50 | ({ accountUid, open, onClose }: { accountUid: string; open: boolean; onClose: () => void }) |
| function:024240b7130f4c0c5a075085fb578119 | function | EraseNatallyHistoryDialog::erase | src/components/EraseNatallyHistoryDialog.tsx | 21–31 | () |
| file:src/components/ExportModal.tsx | file | src/components/ExportModal.tsx | src/components/ExportModal.tsx | 1–454 |  |
| import:2782cfe43c6818b2708dd36c7dfbf906 | import | react | src/components/ExportModal.tsx | 1–1 | import React, { useState } from 'react'; |
| import:dbcb2b3689eeb708ea59e058f4a32ca5 | import | lucide-react | src/components/ExportModal.tsx | 2–2 | import { Download, Share2, X, Check, Copy, FileText, Image, FileImage, Sparkles, BookOpen } from 'lucide-react'; |
| import:e1beaa51ab92af414acee0572cd04e93 | import | jspdf | src/components/ExportModal.tsx | 3–3 | import { jsPDF } from 'jspdf'; |
| import:8d37f45a19849a3093ab27bb241c3d2f | import | ./PurchaseAccess | src/components/ExportModal.tsx | 4–4 | import { usePurchaseAccess } from './PurchaseAccess'; |
| import:3106131828509026ca6d04789dde37de | import | ../services/chartTargets | src/components/ExportModal.tsx | 5–5 | import { chartFocusKey } from '../services/chartTargets'; |
| import:2bf1304d5ba08b380515e7871a74295d | import | ../services/ephemeris | src/components/ExportModal.tsx | 6–6 | import { NatalChartResult } from '../services/ephemeris'; |
| import:bda80b328ed837faa2ffd3add64f19e1 | import | ../services/comprehensiveReading | src/components/ExportModal.tsx | 7–7 | import { generateComprehensiveNatalReading } from '../services/comprehensiveReading'; |
| interface:60719dfd2c614676731ed823aff05eb0 | interface | ExportModalProps | src/components/ExportModal.tsx | 9–12 |  |
| property:5256c0f02b8e3f77779d4d55eff3e908 | property | ExportModalProps::chart | src/components/ExportModal.tsx | 10–10 | NatalChartResult chart |
| property:3aac8970b7365e15f2dbdde2114bfd66 | property | ExportModalProps::onClose | src/components/ExportModal.tsx | 11–11 | () => void onClose |
| function:ac68b011e2fbfc6b26185c167ac9cd85 | function | ExportModal | src/components/ExportModal.tsx | 14–452 | ({ chart, onClose }) |
| function:e26e54cff110b1c407ffc4180383e1ad | function | ExportModal::handleCopyLink | src/components/ExportModal.tsx | 24–28 | () |
| function:c7db95e8aec15cab3334a3f4593b07ef | function | ExportModal::handleCopyText | src/components/ExportModal.tsx | 30–34 | () |
| function:ec9cc09594ec88c0c082ad03979cbd20 | function | ExportModal::handleDownloadMarkdown | src/components/ExportModal.tsx | 36–45 | () |
| function:c2c0cffff290fdd073ec0b9b4ce33c77 | function | ExportModal::handleExportPNG | src/components/ExportModal.tsx | 47–62 | () |
| function:3f7c45f43b6002119c9ec78270468875 | function | ExportModal::handleExportJPG | src/components/ExportModal.tsx | 64–79 | () |
| function:4a06062bf1faf3954abce9ed9b157182 | function | ExportModal::handleExportPDF | src/components/ExportModal.tsx | 81–270 | () |
| function:b7b33c1cfd30fe3cf6d37434a9d72cb4 | function | ExportModal::handleExportPDF::setupPageBackground | src/components/ExportModal.tsx | 91–109 | (pageNum: number, totalPages: number) |
| function:47597fbf51b124194043d92fbf61c830 | function | ExportModal::handleExportPDF::renderSectionHeading | src/components/ExportModal.tsx | 203–214 | (title: string, subtitle: string) |
| function:39c55fe8ab225f3cbad2f12a0660e5de | function | ExportModal::handleExportPDF::renderParagraph | src/components/ExportModal.tsx | 216–227 | (text: string, fontSize = 9, fontColor = [235, 230, 240]) |
| function:ef0a9c0c1f550ee7ea99639c73fe4d67 | function | ExportModal::handleNativeShare | src/components/ExportModal.tsx | 272–310 | (platform?: string) |
| file:src/components/LearnAndPayments.tsx | file | src/components/LearnAndPayments.tsx | src/components/LearnAndPayments.tsx | 1–85 |  |
| import:e95199e9c475921fa9cc6266f27811a5 | import | react | src/components/LearnAndPayments.tsx | 1–1 | import { useEffect, useId, useRef, useState, type ReactNode } from 'react'; |
| import:ce42307caf05e75d597d61abb1d99f21 | import | react-dom | src/components/LearnAndPayments.tsx | 2–2 | import { createPortal } from 'react-dom'; |
| import:b084e954bb47a8dff662f79f53eb9f79 | import | ./learn-and-payments.css | src/components/LearnAndPayments.tsx | 3–3 | import './learn-and-payments.css'; |
| interface:7ccad8047264c43052fa78b28258a4f4 | interface | LearnAndPaymentsProps | src/components/LearnAndPayments.tsx | 5–5 |  |
| property:a387b1cf533e97c7427985dd6f53e03c | property | LearnAndPaymentsProps::onClose | src/components/LearnAndPayments.tsx | 5–5 | () => void onClose |
| property:e81893f16f807940ace6cd2ddbb84072 | property | LearnAndPaymentsProps::open | src/components/LearnAndPayments.tsx | 5–5 | boolean open |
| type_alias:cc8644a667c2eaf0f669a563927aa19a | type_alias | Section | src/components/LearnAndPayments.tsx | 6–6 |  |
| constant:b1249a9047c3ae4cc7416a278f2443c9 | constant | sections | src/components/LearnAndPayments.tsx | 7–9 | = [   { id: 'start', label: 'Start here' }, { id: 'lessons', label: 'Free lessons' }, { id: 'payments... |
| function:9f48642c84ee292406d1b1d756d57e64 | function | Source | src/components/LearnAndPayments.tsx | 10–10 | ({ href, children }: { href: string; children: ReactNode }) |
| constant:491f42e5908e4b64d93c175de78613e4 | constant | lessons | src/components/LearnAndPayments.tsx | 12–33 | = [   { id: 'two-skies', title: '1. Your birth chart and the sky now', paragraphs: [     'A natal ch... |
| function:d4a4fb8fc29d3ec2902137e5340a77f6 | function | LearnAndPayments | src/components/LearnAndPayments.tsx | 35–84 | ({ open, onClose }: LearnAndPaymentsProps) |
| file:src/components/NatalInputForm.tsx | file | src/components/NatalInputForm.tsx | src/components/NatalInputForm.tsx | 1–844 |  |
| import:3e78bbf09ed88e9a6af68e111c102654 | import | react | src/components/NatalInputForm.tsx | 1–1 | import React, { useState, useEffect, useRef } from 'react'; |
| import:281e23d373b8b75b605e14129ef844c4 | import | lucide-react | src/components/NatalInputForm.tsx | 2–14 | import {   Calendar,   Clock,   MapPin,   User,   Compass,   Sparkles,   ChevronDown,   ChevronUp,   Search,   CheckCircle2,   Lock, } from 'lucide-react'; |
| import:59f3915454e0ad32e1c39df167f71b8d | import | ../services/ephemeris | src/components/NatalInputForm.tsx | 15–15 | import { NatalChartInput } from '../services/ephemeris'; |
| import:647f00f14ff5881f740249f9fbfd0e33 | import | ../services/locations | src/components/NatalInputForm.tsx | 16–22 | import {   CityLocation,   PRESET_CITIES,   searchPlaceOnline,   getPersistedVantageLocation,   savePersistedVantageLocation, } from '../services/locations'; |
| interface:aabb2dd1748fd437501b605e812ceedd | interface | NatalInputFormProps | src/components/NatalInputForm.tsx | 24–30 |  |
| property:78d6564df5e85b5b01b2a88199fd7873 | property | NatalInputFormProps::accountUid | src/components/NatalInputForm.tsx | 25–25 | string accountUid |
| property:c7235784c2dcc29b077383644189dee7 | property | NatalInputFormProps::currentInput | src/components/NatalInputForm.tsx | 26–26 | NatalChartInput currentInput |
| property:ccc0fd235627ef258b86b72f34a6384e | property | NatalInputFormProps::onCalculate | src/components/NatalInputForm.tsx | 27–27 | (input: NatalChartInput) => void onCalculate |
| property:c23070bef5a7ebeb630b1620eb47b3f9 | property | NatalInputFormProps::isCalculating | src/components/NatalInputForm.tsx | 28–28 | boolean isCalculating |
| property:df592fbd31f82d0b66c82f33ee46ec6b | property | NatalInputFormProps::embedded | src/components/NatalInputForm.tsx | 29–29 | boolean embedded |
| function:95fc42b55b47efb11cad05d70f8655b5 | function | NatalInputForm | src/components/NatalInputForm.tsx | 32–843 | ({   accountUid,   currentInput,   onCalculate,   isCalculating,   embedded = false, }) |
| function:84edb3ac477186b8f2746a23ab54d1fa | function | NatalInputForm::handleDateChange | src/components/NatalInputForm.tsx | 91–113 | (val: string) |
| function:3f400a7dba026ae8043042207e780bc4 | function | NatalInputForm::handleDateKeyDown | src/components/NatalInputForm.tsx | 115–129 | (e: React.KeyboardEvent<HTMLInputElement>) |
| function:569166733fffa2b39dd3ca5617fecc93 | function | NatalInputForm::getReadableDateTime | src/components/NatalInputForm.tsx | 132–159 | () |
| function:c6b661a18a9150bcb75089bcc4e8c1bf | function | NatalInputForm::handleClickOutside | src/components/NatalInputForm.tsx | 176–183 | (e: MouseEvent) |
| function:9c9877175dd03316a8b9913e126af4e4 | function | NatalInputForm::handlePlaceInput | src/components/NatalInputForm.tsx | 188–219 | (val: string) |
| function:39737b8d1f8d14b325be21a57107a82f | function | NatalInputForm::handleCurrentPlaceInput | src/components/NatalInputForm.tsx | 221–250 | (val: string) |
| function:f583db4c24a8eb89b53c157b6081b3b4 | function | NatalInputForm::selectCity | src/components/NatalInputForm.tsx | 252–284 | (city: CityLocation) |
| function:646e5a18b2691737fe59c8a8c5c692f2 | function | NatalInputForm::selectCurrentCity | src/components/NatalInputForm.tsx | 286–295 | (city: CityLocation) |
| function:fa43fc288161431909100985c11f669b | function | NatalInputForm::handleSubmit | src/components/NatalInputForm.tsx | 297–332 | (e: React.FormEvent) |
| file:src/components/NatallyAvatar.tsx | file | src/components/NatallyAvatar.tsx | src/components/NatallyAvatar.tsx | 1–431 |  |
| import:125d5b7ae6ccf0939ecf281f654793a6 | import | react | src/components/NatallyAvatar.tsx | 1–1 | import React, { useState, useEffect } from 'react'; |
| interface:e05aa52cd9ac311663826c710bbed95d | interface | NatallyAvatarProps | src/components/NatallyAvatar.tsx | 6–11 |  |
| property:eb1eb8804abdaf370acf9d4973173b48 | property | NatallyAvatarProps::size | src/components/NatallyAvatar.tsx | 7–7 | number &#124; string size |
| property:3fad49b90b053fad1c06eee7b4d0dd98 | property | NatallyAvatarProps::isAnimated | src/components/NatallyAvatar.tsx | 8–8 | boolean isAnimated |
| property:bbabd13c4da23dedb0f73a5f098ae53c | property | NatallyAvatarProps::isSpeaking | src/components/NatallyAvatar.tsx | 9–9 | boolean isSpeaking |
| property:48b2f94af3c6d4c40752a99c46a0af79 | property | NatallyAvatarProps::className | src/components/NatallyAvatar.tsx | 10–10 | string className |
| function:ddcefc0f66f06464030b4cb584ca73b9 | function | NatallyAvatar | src/components/NatallyAvatar.tsx | 22–430 | ({   size = 64,   isAnimated = true,   isSpeaking = false,   className = '', }) |
| function:d5a2445bbb18af2f5cb77007d96e5f46 | function | NatallyAvatar::updateMotion | src/components/NatallyAvatar.tsx | 36–36 | () |
| file:src/components/NatallyChatbot.tsx | file | src/components/NatallyChatbot.tsx | src/components/NatallyChatbot.tsx | 1–1534 |  |
| import:73d8054c378938b636e8cb98d83a5c59 | import | react | src/components/NatallyChatbot.tsx | 1–1 | import React, { useState, useEffect, useRef, useMemo } from 'react'; |
| import:faf73c4ff3e972baa54d6fcea30cc6c9 | import | lucide-react | src/components/NatallyChatbot.tsx | 2–27 | import {   MessageSquare,   X,   Send,   Mic,   MicOff,   Download,   Trash2,   Sparkles,   Minimize2,   Maximize2,   Move,   Volume2,   VolumeX,   Sliders,   Search,   Compass,   Tag,   Clock,   Calendar,   ChevronLeft,   ChevronRight,   Image as ImageIcon,   Paperclip,   ZoomIn, } from 'lucide-react'; |
| import:40e23e05510161f08e01360e8416fc6c | import | ../services/accountStorage | src/components/NatallyChatbot.tsx | 28–28 | import { loadAccountValue, saveAccountValue } from '../services/accountStorage'; |
| import:cfe64047424a09d4406e84c1e9f8149e | import | ../services/historyLifecycle | src/components/NatallyChatbot.tsx | 29–29 | import { HISTORY_ERASURE_EVENT, isNatallyHistoryErasing, type HistoryErasureNotice } from '../services/historyLifecycle'; |
| import:cf2d326f96c8ac844af84be090b719f3 | import | ../services/ephemeris | src/components/NatallyChatbot.tsx | 30–30 | import { NatalChartResult } from '../services/ephemeris'; |
| import:0b8971873d9ce0e25cf8431a042d928d | import | ../services/natallyChat | src/components/NatallyChatbot.tsx | 31–31 | import { ChatMessage, askNatally, ChartCue, chartFocusAt, validateChartCues } from '../services/natallyChat'; |
| import:853799f17ce4bdf77cfbcc6a7b54029e | import | ../services/calculationTools | src/components/NatallyChatbot.tsx | 32–32 | import { createCalculationSession } from '../services/calculationTools'; |
| import:0a8c126513d4091b25c7c39c6ec601d2 | import | ../services/karaokeScroll | src/components/NatallyChatbot.tsx | 33–33 | import { keepKaraokeVisible } from '../services/karaokeScroll'; |
| import:f338cf0a57ee56f40691afb3ebf0a7d4 | import | ../services/chatViewport | src/components/NatallyChatbot.tsx | 34–34 | import { getChatViewportLayout } from '../services/chatViewport'; |
| import:373dc113512b0cc5efc683667d1127c7 | import | ../hooks/useVisualViewport | src/components/NatallyChatbot.tsx | 35–35 | import { useVisualViewport } from '../hooks/useVisualViewport'; |
| import:f15f015ff067209c1fc16503588867a6 | import | ../services/chartTargets | src/components/NatallyChatbot.tsx | 36–36 | import { chartFocusKey, chartFocusKeyMatches, chartReferenceNames, chartTargetLabel, chartTargets, resolveChartTarget } from '../services/chartTargets'; |
| import:90f801df06906874cc8b69f5516bee59 | import | ../services/presentation | src/components/NatallyChatbot.tsx | 37–37 | import { validatePresentationCues, presentationActionsAt, presentationFocusAt, type PresentationState, type PresentationAction, type PresentationCue } from '../services/presentation'; |
| import:8f433cf9ab706f9b112b09baecf1065c | import | ../services/soul | src/components/NatallyChatbot.tsx | 38–38 | import { loadSoulState, buildSoulPrompt, rememberUserDisclosure, rememberCharacterDevelopment } from '../services/soul'; |
| import:eeac7d4ca1fec03e0bcf3010f8e5b2fe | import | ../services/readingAudio | src/components/NatallyChatbot.tsx | 39–39 | import { createReadingAudioCapture, type ReadingAudioStatus } from '../services/readingAudio'; |
| import:4d5740e606d947b1790a019b581c2ce4 | import | ../services/historicalPresentation | src/components/NatallyChatbot.tsx | 40–40 | import { recoverHistoricalFocus } from '../services/historicalPresentation'; |
| import:4a0ed4fa0d7519e1f559f412ed68604f | import | ./RetainedReadingAudio | src/components/NatallyChatbot.tsx | 41–41 | import { RetainedReadingAudio } from './RetainedReadingAudio'; |
| import:a18ee2ff3e48601965b2351c26cf75f0 | import | ./RichText | src/components/NatallyChatbot.tsx | 42–42 | import { RichText } from './RichText'; |
| import:30b7f85650312e458f24ae484b1b41dc | import | ../services/voiceService | src/components/NatallyChatbot.tsx | 43–51 | import {   VoiceSettings,   loadVoiceSettings,   saveVoiceSettings,   speakNatallyText,   stopSpeaking,   prepareWaitingVoice,   startWaitingUtterance, } from '../services/voiceService'; |
| import:eacad91b93c02d3ece0f22736c243c7d | import | ./PurchaseAccess | src/components/NatallyChatbot.tsx | 52–52 | import { usePurchaseAccess } from './PurchaseAccess'; |
| import:eb3f835a25f1102e87a76fb86c51a57a | import | ./NatallyConfigModal | src/components/NatallyChatbot.tsx | 53–53 | import { NatallyConfigModal } from './NatallyConfigModal'; |
| import:acd46b0c3c73d7000a4e1f9d0b3741b0 | import | ./NatallyIcon | src/components/NatallyChatbot.tsx | 54–54 | import { NatallyIcon } from './NatallyIcon'; |
| interface:819965bc783a0b64b41f9ab6f3c24a41 | interface | PersistentChatMessage | src/components/NatallyChatbot.tsx | 56–63 |  |
| property:17afd2fc433ca352a8d9060efb509bc2 | property | PersistentChatMessage::createdAt | src/components/NatallyChatbot.tsx | 57–57 | string createdAt |
| property:4156233b8a7a279f1e6ec785ba010135 | property | PersistentChatMessage::observationSnapshot | src/components/NatallyChatbot.tsx | 58–58 | NatalChartResult['currentSky'] observationSnapshot |
| property:edbcdae419ba6deac1799950c0ba6732 | property | PersistentChatMessage::topic | src/components/NatallyChatbot.tsx | 59–59 | string topic |
| property:72ba7bbe5208b9b9b8cef46d7ab1c66e | property | PersistentChatMessage::category | src/components/NatallyChatbot.tsx | 60–60 | 'lore' &#124; 'reading' &#124; 'chat' &#124; 'horoscope' &#124; 'synastry' category |
| property:2a947e00ee8f7916102d2f61e8c95f34 | property | PersistentChatMessage::mediaUrl | src/components/NatallyChatbot.tsx | 61–61 | string mediaUrl |
| property:07cb8a15e3efd9ded1cddb8e440fed62 | property | PersistentChatMessage::mediaName | src/components/NatallyChatbot.tsx | 62–62 | string mediaName |
| interface:d6e8d2e3471b599a1a399299d5b923b7 | interface | NatallyChatbotProps | src/components/NatallyChatbot.tsx | 65–108 |  |
| property:89eb4213843e22fd7f4b628d2458bdca | property | NatallyChatbotProps::embedded | src/components/NatallyChatbot.tsx | 66–66 | boolean embedded |
| property:ed30186cab45418b3390acd04b6e6da8 | property | NatallyChatbotProps::presentation | src/components/NatallyChatbot.tsx | 67–67 | PresentationState presentation |
| property:3aa8f53899db5162d0fe88dde1e4424e | property | NatallyChatbotProps::onPresentationAction | src/components/NatallyChatbot.tsx | 68–68 | (action: PresentationAction, sourceChart: NatalChartResult) => void onPresentationAction |
| property:e96720d52dc6881cd3688f557c86a5b3 | property | NatallyChatbotProps::onShowTargets | src/components/NatallyChatbot.tsx | 69–69 | (targets: string[]) => void onShowTargets |
| property:c06df178b8168c01b5756a08081276dc | property | NatallyChatbotProps::onReadingChart | src/components/NatallyChatbot.tsx | 70–70 | (source: NatalChartResult, archived: boolean) => void onReadingChart |
| property:6dfefed2828d2f465abf189c117c6c0e | property | NatallyChatbotProps::onPhaseChange | src/components/NatallyChatbot.tsx | 71–71 | (phase: 'idle'&#124;'listening'&#124;'thinking'&#124;'speaking') => void onPhaseChange |
| property:b0754013944dc7840adecba8869c1c1e | property | NatallyChatbotProps::onBusyChange | src/components/NatallyChatbot.tsx | 72–72 | (busy: boolean) => void onBusyChange |
| property:9ae3c37bb276304ea2b29533824e59e2 | property | NatallyChatbotProps::selectionRequest | src/components/NatallyChatbot.tsx | 73–73 | {id:string;targets:string[];sourceChart:NatalChartResult} &#124; null selectionRequest |
| property:ab6bb8883abffd16551aa1ad82cb162b | property | NatallyChatbotProps::onSelectionRequestConsumed | src/components/NatallyChatbot.tsx | 74–74 | (id:string) => void onSelectionRequestConsumed |
| property:f5a40ff7455b8eae4aa905fa4fc5f6f1 | property | NatallyChatbotProps::accountUid | src/components/NatallyChatbot.tsx | 75–75 | string accountUid |
| property:35498d1248309490835c271c85885412 | property | NatallyChatbotProps::isCurrentSession | src/components/NatallyChatbot.tsx | 76–76 | () => boolean isCurrentSession |
| property:ba87e5c9814d521d4e97956a038c0aef | property | NatallyChatbotProps::chart | src/components/NatallyChatbot.tsx | 77–77 | NatalChartResult chart |
| property:3c5f38efd1bbfc9a349c3bef688995e2 | property | NatallyChatbotProps::partnerChart | src/components/NatallyChatbot.tsx | 78–78 | NatalChartResult &#124; null partnerChart |
| property:f74b9eefc4399edefe97bea5e6f616a1 | property | NatallyChatbotProps::userLore | src/components/NatallyChatbot.tsx | 79–79 | string[] userLore |
| property:07624a53156dbe84f5d7e4c3aec865de | property | NatallyChatbotProps::isOpen | src/components/NatallyChatbot.tsx | 80–80 | boolean isOpen |
| property:5ac018cd117a302ec972d21c95029d18 | property | NatallyChatbotProps::onClose | src/components/NatallyChatbot.tsx | 81–81 | () => void onClose |
| property:5f790ce28e8c29cd949a8ad6e29c2a65 | property | NatallyChatbotProps::onOpen | src/components/NatallyChatbot.tsx | 82–82 | () => void onOpen |
| property:cd38692c2d99b59c35bddab4b92c10e1 | property | NatallyChatbotProps::onSignIn | src/components/NatallyChatbot.tsx | 83–83 | () => void onSignIn |
| property:b8e1dfca508522e62a5fee11c0735bc2 | property | NatallyChatbotProps::isSignedIn | src/components/NatallyChatbot.tsx | 84–84 | boolean isSignedIn |
| property:fb6f0f35111594ccec116a834c6ddbe3 | property | NatallyChatbotProps::onAddUserLore | src/components/NatallyChatbot.tsx | 85–85 | (lore: string) => void onAddUserLore |
| property:eea47e58205d04cc64d11d810ad22146 | property | NatallyChatbotProps::voiceSettings | src/components/NatallyChatbot.tsx | 86–86 | VoiceSettings voiceSettings |
| property:19bdc5237c90c8380a415133c46f5812 | property | NatallyChatbotProps::onUpdateVoiceSettings | src/components/NatallyChatbot.tsx | 87–87 | (settings: VoiceSettings) => void onUpdateVoiceSettings |
| property:59d803b6c7056d5136e33827f637cb44 | property | NatallyChatbotProps::onSpeechStateChange | src/components/NatallyChatbot.tsx | 88–88 | (isSpeaking: boolean, snippet: string &#124; null, targetEntity: string &#124; null) => void onSpeechStateChange |
| property:aa1c62f99370d90e1160bdcdc797e967 | property | NatallyChatbotProps::onSelectPlanet | src/components/NatallyChatbot.tsx | 89–89 | (name: string) => void onSelectPlanet |
| property:870a4ad0f4dedb634b214f9d8d0a261f | property | NatallyChatbotProps::onChartFocus | src/components/NatallyChatbot.tsx | 90–90 | (targets: string[], sourceChart: NatalChartResult) => void onChartFocus |
| property:2e2f0c390900211216c9e3b8f093a9a1 | property | NatallyChatbotProps::externalReadingToInject | src/components/NatallyChatbot.tsx | 91–102 | {     title: string;     content: string;     type: string;     sender?: 'user' &#124; 'natally';     observationSnapshot?: NatalChartResult['currentSky'];     generatedAt?:string;     chartCues?: ChartCue[];     presentationVersion?: 1;     presentationCues?: PresentationCue[];     chartFocusKey?: string;   } &#124; null externalReadingToInject |
| property:784db2a7b395e21e4c710d4a9003faec | property | NatallyChatbotProps::onClearExternalReading | src/components/NatallyChatbot.tsx | 103–103 | () => void onClearExternalReading |
| property:7c7ece4b12a151e0f592e70b943ba942 | property | NatallyChatbotProps::quickMessage | src/components/NatallyChatbot.tsx | 106–106 | { text: string; nonce: number } &#124; null quickMessage |
| property:41fe0943d7ffc1f81cd6b323b447cb47 | property | NatallyChatbotProps::onClearQuickMessage | src/components/NatallyChatbot.tsx | 107–107 | () => void onClearQuickMessage |
| constant:86e13564f82dc46f682dd38186add98e | constant | CHAT_STORAGE_KEY | src/components/NatallyChatbot.tsx | 110–110 | = 'astrosphere_natally_chat_history_v3' |
| function:0cd99fdd559361f369d22219c4bbb00e | function | NatallyChatbot | src/components/NatallyChatbot.tsx | 112–1533 | ({   embedded = false, presentation, onPresentationAction, onShowTargets, onReadingChart, onPhaseChange, onBusyChange, selectionRequest, onSelectionRequestConsumed,   accountUid,   isCurrentSession,   chart,   partnerChart,   userLore,   isOpen,   onClose,   onOpen,   onSignIn,   isSignedIn,   onAddUserLore,   voiceSettings,   onUpdateVoiceSettings,   onSpeechStateChange,   onSelectPlanet,   onChartFocus,   externalReadingToInject,   onClearExternalReading,   quickMessage,   onClearQuickMessage, }) |
| function:0b69b51425985bc3774c51dbcd59f02b | function | NatallyChatbot::reconcilePlaybackFocus | src/components/NatallyChatbot.tsx | 279–287 | () |
| function:c81827d9ef564de0aeb27fc06dff1c8a | function | NatallyChatbot::sessionIsActive | src/components/NatallyChatbot.tsx | 302–302 | () |
| function:4f13193315ff13d6898a00bf1be99eea | function | NatallyChatbot::erasing | src/components/NatallyChatbot.tsx | 304–310 | (event: Event) |
| function:22edb1acae59148b447c767746b6c4ec | function | NatallyChatbot::planFor | src/components/NatallyChatbot.tsx | 345–345 | (message:PersistentChatMessage) |
| function:41a11bacf0fa9a8f74b7ee25a56dbda3 | function | NatallyChatbot::sourceChartFor | src/components/NatallyChatbot.tsx | 346–346 | (message:PersistentChatMessage) |
| function:293a03d6b110f455697cc41907d58da3 | function | NatallyChatbot::cuesFor | src/components/NatallyChatbot.tsx | 347–349 | (message:PersistentChatMessage): PresentationCue[] |
| function:bce4e36a921c520e457cf4f788f68235 | function | NatallyChatbot::showReadingChart | src/components/NatallyChatbot.tsx | 350–350 | (message:PersistentChatMessage) |
| function:41e0060a1a90ecab2d42c266a5cdf9f7 | function | NatallyChatbot::goToPassage | src/components/NatallyChatbot.tsx | 351–367 | (message: PersistentChatMessage, index: number) |
| function:c9e9ca256a54136a13adf44c8eeb0d8c | function | NatallyChatbot::beginRetainedReplay | src/components/NatallyChatbot.tsx | 368–377 | (message:PersistentChatMessage): boolean |
| function:f0a0e3c9cebedd50af9e8728cb6c3526 | function | NatallyChatbot::retainedReplayActive | src/components/NatallyChatbot.tsx | 378–381 | (message:PersistentChatMessage) |
| function:55b8515681048cd766fc000b2fb250d6 | function | NatallyChatbot::presentRetainedPosition | src/components/NatallyChatbot.tsx | 382–399 | (message:PersistentChatMessage,offset:number) |
| function:310a3786cf039097a9d1fa93637ee88a | function | NatallyChatbot::presentRetainedState | src/components/NatallyChatbot.tsx | 400–405 | (message:PersistentChatMessage,playing:boolean) |
| function:c2876bbc8ffc644a3eac5b2adbc28795 | function | NatallyChatbot::presentMessage | src/components/NatallyChatbot.tsx | 407–448 | (message: PersistentChatMessage) |
| function:ee723ff4af6ea7e90d4a6b7d13b8d85e | function | NatallyChatbot::presentMessage::active | src/components/NatallyChatbot.tsx | 412–412 | () |
| function:c69bf91422755e10938a274d7bff7b95 | function | NatallyChatbot::presentMessage::advance | src/components/NatallyChatbot.tsx | 420–428 | (offset:number) |
| function:92e44efa8262d39924a2d6b947723f67 | function | NatallyChatbot::extractAstrologicalEntity | src/components/NatallyChatbot.tsx | 454–478 | (text: string): string &#124; null |
| function:49e73155038d36b6fcdcee3ec18966d9 | function | NatallyChatbot::handleSendMessage | src/components/NatallyChatbot.tsx | 480–594 | (textToSend?: string, selectedTargets?: string[], selectedChart?:NatalChartResult) |
| function:5f76083f8379a76e993b72ff9d72dc09 | function | NatallyChatbot::handleSendMessage::requestActive | src/components/NatallyChatbot.tsx | 486–486 | () |
| function:f05ca0cab1056688ba11f94507ccd3dc | function | NatallyChatbot::toggleVoiceListen | src/components/NatallyChatbot.tsx | 708–720 | () |
| function:6fe30825f1cf6aebf29e45636f0bd3fe | function | NatallyChatbot::handleCardPointerDown | src/components/NatallyChatbot.tsx | 723–743 | (e: React.PointerEvent) |
| function:0bb7e56ddbe9160e88ce14144951dcd8 | function | NatallyChatbot::handleHeaderPointerMove | src/components/NatallyChatbot.tsx | 745–754 | (e: React.PointerEvent) |
| function:4b7bceaa84b502af5b595c9047f51744 | function | NatallyChatbot::handleHeaderPointerUp | src/components/NatallyChatbot.tsx | 756–763 | (e: React.PointerEvent) |
| function:b715e0ddc23c0ce4adac4210996ce8f3 | function | NatallyChatbot::handleResizePointerDown | src/components/NatallyChatbot.tsx | 766–792 | (e: React.PointerEvent) |
| function:833bae3f1fe7beb7096fbb796502e098 | function | NatallyChatbot::handleResizePointerDown::handlePointerMove | src/components/NatallyChatbot.tsx | 776–784 | (ev: PointerEvent) |
| function:56e62e9ff19bc6e3d409760da20c92ba | function | NatallyChatbot::handleResizePointerDown::handlePointerUp | src/components/NatallyChatbot.tsx | 785–789 | () |
| function:e2d5ad08765d9c2935bedd55d0472e32 | function | NatallyChatbot::handleMediaUpload | src/components/NatallyChatbot.tsx | 795–806 | (e: React.ChangeEvent<HTMLInputElement>) |
| function:51b2febebd35fe76ba7787394b5c160d | function | NatallyChatbot::handleReplayTurn | src/components/NatallyChatbot.tsx | 809–822 | (msg: PersistentChatMessage) |
| function:a627947535d96d6f42fe0d231c07b409 | function | NatallyChatbot::scrollToMessage | src/components/NatallyChatbot.tsx | 825–832 | (msgId: string) |
| function:09a4de8d46472d126611ff4484904a66 | function | NatallyChatbot::handleDownloadTranscript | src/components/NatallyChatbot.tsx | 887–907 | () |
| function:174f73282d17fce22eba006642f263f8 | function | NatallyChatbot::handleClearHistory | src/components/NatallyChatbot.tsx | 909–926 | () |
| function:ac24344a27a83a63b79f29ac4622400d | function | NatallyChatbot::toggleReadingAloud | src/components/NatallyChatbot.tsx | 928–938 | () |
| file:src/components/NatallyConfigModal.tsx | file | src/components/NatallyConfigModal.tsx | src/components/NatallyConfigModal.tsx | 1–401 |  |
| import:cb82b6bb6b5b49aeb656a4cfa5647e9e | import | react | src/components/NatallyConfigModal.tsx | 1–1 | import React, { useState, useEffect } from 'react'; |
| import:97d537caf8dbceebac98dc6ab5ad1790 | import | lucide-react | src/components/NatallyConfigModal.tsx | 2–14 | import {   X,   Volume2,   VolumeX,   Sparkles,   Sliders,   Play,   RotateCcw,   Bot,   MousePointer,   Compass,   Check, } from 'lucide-react'; |
| import:87594a5e70b69bc0bfa5f1f12a667c81 | import | ../services/voiceService | src/components/NatallyConfigModal.tsx | 15–22 | import {   VoiceSettings,   DEFAULT_VOICE_SETTINGS,   NATALLY_VOICE_SAMPLE,   saveVoiceSettings,   speakNatallyText,   stopSpeaking, } from '../services/voiceService'; |
| import:a467d36592e7edcd9c8bac719132095c | import | ../services/supertonicTts | src/components/NatallyConfigModal.tsx | 23–23 | import { subscribeVoiceStatus, type VoiceStatus } from '../services/supertonicTts'; |
| import:2303e0834a18d4e0bb08bb135fe42237 | import | ./ReadingStyleControl | src/components/NatallyConfigModal.tsx | 24–24 | import { ReadingStyleControl } from './ReadingStyleControl'; |
| import:0ed0b42d4bc60caa6516f18b6669d6b0 | import | ../services/firebase | src/components/NatallyConfigModal.tsx | 25–25 | import { auth } from '../services/firebase'; |
| import:5143c5a97d9a07acf852622bb1b8c89e | import | ../services/onboarding | src/components/NatallyConfigModal.tsx | 26–26 | import { loadNatalIntake } from '../services/onboarding'; |
| import:a52061f016324b26715ba429e7677cbb | import | ./VoiceMeasurementPanel | src/components/NatallyConfigModal.tsx | 27–27 | import { VoiceMeasurementPanel } from './VoiceMeasurementPanel'; |
| interface:16f0e875fda55a164a7d7b759d4fe110 | interface | NatallyConfigModalProps | src/components/NatallyConfigModal.tsx | 29–33 |  |
| property:c20c8c368419adaab64707289b40ad27 | property | NatallyConfigModalProps::settings | src/components/NatallyConfigModal.tsx | 30–30 | VoiceSettings settings |
| property:1f2f137e3484a0853727cd6a162dfa87 | property | NatallyConfigModalProps::onUpdateSettings | src/components/NatallyConfigModal.tsx | 31–31 | (newSettings: VoiceSettings) => void onUpdateSettings |
| property:15e09acac70a82b1384992e4b04c9296 | property | NatallyConfigModalProps::onClose | src/components/NatallyConfigModal.tsx | 32–32 | () => void onClose |
| function:6865880519ff2e2f670df94f9a21131f | function | NatallyConfigModal | src/components/NatallyConfigModal.tsx | 35–400 | ({   settings,   onUpdateSettings,   onClose, }) |
| function:ec8ea2ae5bbc7ea30bc4c08c642e3785 | function | NatallyConfigModal::handleToggleReadingAloud | src/components/NatallyConfigModal.tsx | 45–53 | (val: boolean) |
| function:e736dadccbd96be01ca9c7524fff3f76 | function | NatallyConfigModal::handleChangeSpriteMode | src/components/NatallyConfigModal.tsx | 55–60 | (mode: VoiceSettings['spriteMode']) |
| function:b16f15fa096e329a474047a3b38de099 | function | NatallyConfigModal::handleSliderChange | src/components/NatallyConfigModal.tsx | 62–67 | (key: 'rate' &#124; 'pitch', val: number) |
| function:e10dc469ec81d273bfffc15f89504264 | function | NatallyConfigModal::handleTestVoice | src/components/NatallyConfigModal.tsx | 69–83 | () |
| file:src/components/NatallyIcon.tsx | file | src/components/NatallyIcon.tsx | src/components/NatallyIcon.tsx | 1–32 |  |
| import:3c7acaeeadbf4a202731559e827f9f3a | import | react | src/components/NatallyIcon.tsx | 1–1 | import React from 'react'; |
| import:57acd51a74cd0f92f78aae44c0d01cfc | import | ./NatallyAvatar | src/components/NatallyIcon.tsx | 2–2 | import { NatallyAvatar } from './NatallyAvatar'; |
| interface:95ab89a4facc09a72ab9355d36218f45 | interface | NatallyIconProps | src/components/NatallyIcon.tsx | 4–8 |  |
| property:29e3fac5a2c81d1afa5de34b83b95e71 | property | NatallyIconProps::size | src/components/NatallyIcon.tsx | 5–5 | 'sm' &#124; 'md' &#124; 'lg' &#124; 'xl' &#124; 'header' size |
| property:9310e4043858b9a23d438a2ccd03aee1 | property | NatallyIconProps::isSpeaking | src/components/NatallyIcon.tsx | 6–6 | boolean isSpeaking |
| property:949f60aa777eb003795cdf378d2b2f86 | property | NatallyIconProps::className | src/components/NatallyIcon.tsx | 7–7 | string className |
| function:eac1d22412ec088768683e2a2057d5d7 | function | NatallyIcon | src/components/NatallyIcon.tsx | 10–31 | ({   size = 'md',   isSpeaking = false,   className = '', }) |
| file:src/components/NatallySprite.tsx | file | src/components/NatallySprite.tsx | src/components/NatallySprite.tsx | 1–327 |  |
| import:03fa8e21b28017dd026c35044f20cfa3 | import | react | src/components/NatallySprite.tsx | 1–1 | import React, { useState, useEffect, useRef, useCallback } from 'react'; |
| import:6f8eff381545272fe172dec4b7756436 | import | lucide-react | src/components/NatallySprite.tsx | 2–2 | import { Sparkles, Volume2, MessageSquare, Heart, X } from 'lucide-react'; |
| import:85de6a2d67979b9c50f5b3c111ab516e | import | ../services/ephemeris | src/components/NatallySprite.tsx | 3–3 | import { NatalChartResult } from '../services/ephemeris'; |
| import:a75b8e537531ea5d31ebf149bf77c666 | import | ../services/voiceService | src/components/NatallySprite.tsx | 4–4 | import { VoiceSettings, speakNatallyText, isSpeechBusy } from '../services/voiceService'; |
| import:fab76240413ffc761d09a236ec934a67 | import | ./NatallyAvatar | src/components/NatallySprite.tsx | 5–5 | import { NatallyAvatar } from './NatallyAvatar'; |
| interface:b840e84dcfe2bc4a76a0ee3bda294e4c | interface | NatallySpriteProps | src/components/NatallySprite.tsx | 7–16 |  |
| property:9d823666aaa0dbd1f4b56db5f6927367 | property | NatallySpriteProps::chart | src/components/NatallySprite.tsx | 8–8 | NatalChartResult chart |
| property:c9c4d3e9cf93ac51fda931972e796b27 | property | NatallySpriteProps::settings | src/components/NatallySprite.tsx | 9–9 | VoiceSettings settings |
| property:08cbedf5a18c0e04fc495069c83c9176 | property | NatallySpriteProps::isSpeaking | src/components/NatallySprite.tsx | 10–10 | boolean isSpeaking |
| property:2de197a7361f6956c64de50b91e7a176 | property | NatallySpriteProps::activeTargetEntity | src/components/NatallySprite.tsx | 11–11 | string &#124; null activeTargetEntity |
| property:aa723142b9722bb1bd43fca4d3e8564d | property | NatallySpriteProps::latestSpeechSnippet | src/components/NatallySprite.tsx | 12–12 | string &#124; null latestSpeechSnippet |
| property:e0689fc8668262fade3cbca7a46c3c2c | property | NatallySpriteProps::isOpen | src/components/NatallySprite.tsx | 13–13 | boolean isOpen |
| property:c335085ee298a974981e413d4334fe54 | property | NatallySpriteProps::onOpenChat | src/components/NatallySprite.tsx | 14–14 | () => void onOpenChat |
| property:fa750a1d6e0f37fadeca949b2dc9bdd2 | property | NatallySpriteProps::onSelectPlanet | src/components/NatallySprite.tsx | 15–15 | (name: string) => void onSelectPlanet |
| constant:60693839bf644d0de0a6371867a6b0f9 | constant | KAWAII_GREETINGS | src/components/NatallySprite.tsx | 18–25 | = [   "Okay, what's the situation? Let's take a look.",   "Your chart has layers. Relatable, honestl... |
| constant:a6b595ab0845ea6393bafddf0a48299f | constant | ENNUI_IDLE_THOUGHTS | src/components/NatallySprite.tsx | 27–35 | = [   "No rush. Sometimes you need a minute to let things land.",   "A chart can hold a contradictio... |
| variable:4f50bf75a9df299c447214881dbe20cb | variable | idleDeck | src/components/NatallySprite.tsx | 39–39 | = [] |
| function:653ff524af625ddedd2e09f6a7ffcc21 | function | drawIdleThought | src/components/NatallySprite.tsx | 40–50 | (): string |
| function:af21a4dc435ac9c9af82db149c6b0257 | function | NatallySprite | src/components/NatallySprite.tsx | 52–326 | ({   chart,   settings,   isSpeaking,   activeTargetEntity,   latestSpeechSnippet,   isOpen = false,   onOpenChat, }) |
| function:d9c9e43330a8be514b7ae5c744fcf5a4 | function | NatallySprite::triggerGreeting | src/components/NatallySprite.tsx | 75–92 | (customText?: string) |
| function:acdd978be36bcf7271d436ae95ac0f70 | function | NatallySprite::handleUserActivity | src/components/NatallySprite.tsx | 96–104 | () |
| function:19c6f7bcbb7dd982df7f92a2a6bd9094 | function | NatallySprite::handleMouseMove | src/components/NatallySprite.tsx | 149–172 | (e: MouseEvent) |
| function:46dd8d793d35c103fa24b5c477e390a6 | function | NatallySprite::handleClickMascot | src/components/NatallySprite.tsx | 180–194 | (e: React.MouseEvent) |
| file:src/components/PurchaseAccess.tsx | file | src/components/PurchaseAccess.tsx | src/components/PurchaseAccess.tsx | 1–79 |  |
| import:a32cb2198a8a911c3a4bd671adc51606 | import | react | src/components/PurchaseAccess.tsx | 1–1 | import React, { createContext, useContext, useEffect, useRef, useState } from 'react'; |
| import:8a48b1f27f869cab6cfbf1e2071b2ad8 | import | react-dom | src/components/PurchaseAccess.tsx | 2–2 | import { createPortal } from 'react-dom'; |
| import:b50ad2935d229547f12bd530d023e18a | import | ../services/firebase | src/components/PurchaseAccess.tsx | 3–3 | import { auth } from '../services/firebase'; |
| import:8a78fc70e68565c725e510c6ba143498 | import | firebase/auth | src/components/PurchaseAccess.tsx | 4–4 | import { onAuthStateChanged } from 'firebase/auth'; |
| import:38b14dd80c764198c01f5634635a10f0 | import | ../services/downloadAccess | src/components/PurchaseAccess.tsx | 5–5 | import { checkDownloadAccess, type DownloadAccess, type DownloadRequest } from '../services/downloadAccess'; |
| import:696dc7004fac0c081e968b63ca5ef9a0 | import | ./PurchaseAccess.css | src/components/PurchaseAccess.tsx | 6–6 | import './PurchaseAccess.css'; |
| method:7f193014b61486ad7e49a549e184bc14 | method | Intent::current | src/components/PurchaseAccess.tsx | 8–8 | current:()=>boolean |
| method:d88a95f340a8a72e9dcaffdf00316553 | method | Intent::run | src/components/PurchaseAccess.tsx | 8–8 | run?:()=>void&#124;Promise<void> |
| property:3037336c6e88cbbec47a4bae0471c93d | property | Intent::owner | src/components/PurchaseAccess.tsx | 8–8 | owner:string&#124;null |
| property:e3989366378b8320b2b3ddd0cf905ce6 | property | Intent::upfront | src/components/PurchaseAccess.tsx | 8–8 | upfront:boolean |
| property:fa3ffdcb2e3cdfe2ec49174091b6bb38 | property | Intent::request | src/components/PurchaseAccess.tsx | 8–8 | request:DownloadRequest |
| type_alias:35be1099755cedbd8569aa7135aed930 | type_alias | Intent | src/components/PurchaseAccess.tsx | 8–8 |  |
| method:5c5b7713afbc7387a7ddeb37afb20ff2 | method | AccessContext::requestDownload | src/components/PurchaseAccess.tsx | 9–9 | requestDownload:(request:DownloadRequest,run:()=>void&#124;Promise<void>,current?:()=>boolean)=>Promise<void> |
| method:c166cc6ce5b5e766c470a12a53ed961c | method | AccessContext::showOffer | src/components/PurchaseAccess.tsx | 9–9 | showOffer:(resourceId?:string)=>void |
| type_alias:6684c9897a884b04d2a29dba7721eac0 | type_alias | AccessContext | src/components/PurchaseAccess.tsx | 9–9 |  |
| constant:e4c6e2f611ee2bb621a59ef500c0f6b9 | constant | Access | src/components/PurchaseAccess.tsx | 10–10 | = createContext<AccessContext&#124;null>(null) |
| function:7469021276aded4a29e6677569425879 | function | usePurchaseAccess | src/components/PurchaseAccess.tsx | 11–11 | () |
| function:32d690677ce4c4c33de92041af26d714 | function | PurchaseAccessProvider | src/components/PurchaseAccess.tsx | 13–76 | ({children}:{children:React.ReactNode}) |
| function:4f11de816474f671976a3dbdbd162090 | function | PurchaseAccessProvider::close | src/components/PurchaseAccess.tsx | 20–20 | () |
| function:fa801e00eec11a4a06b08293d34ea326 | function | PurchaseAccessProvider::valid | src/components/PurchaseAccess.tsx | 28–28 | (value:Intent) |
| function:edde7fd60d5ebdf5b536f2400c3541ab | function | PurchaseAccessProvider::resolve | src/components/PurchaseAccess.tsx | 29–40 | (value:Intent,openOnly=false) |
| function:41779da81257519a5cf4d0e687fd0a3c | function | PurchaseAccessProvider::showOffer | src/components/PurchaseAccess.tsx | 41–44 | (resourceId='natal-reading') |
| function:1485dcbcdcd2a47a9b4f25df3150a4bd | function | PurchaseAccessProvider::requestDownload | src/components/PurchaseAccess.tsx | 45–50 | (request:DownloadRequest,run:()=>void&#124;Promise<void>,current=()=>true) |
| function:ddad7ea7946d4e30231ae5cdc8b53d70 | function | ReadingPurchaseNotice | src/components/PurchaseAccess.tsx | 78–78 | () |
| file:src/components/ReadingStage.tsx | file | src/components/ReadingStage.tsx | src/components/ReadingStage.tsx | 1–96 |  |
| import:bc07292ffd6055b1d71446a691cd033b | import | ./atelier/AtelierAmbience | src/components/ReadingStage.tsx | 1–1 | import { AtelierAmbience } from './atelier/AtelierAmbience'; |
| import:222579350662faf0149d19353004bcb0 | import | react | src/components/ReadingStage.tsx | 2–2 | import React, { useEffect, useRef, useState } from 'react'; |
| import:230e15e631d3e344ab80eacd3e7dbd79 | import | ../services/chartTargets | src/components/ReadingStage.tsx | 3–3 | import { chartTargetLabel } from '../services/chartTargets'; |
| import:41a83e6ad1a18831ed97eb8a1c088db0 | import | ../services/presentation | src/components/ReadingStage.tsx | 4–4 | import type { PresentationState, PresentationView } from '../services/presentation'; |
| import:901d1f9f3219751cf4ea89b11cb4e3a2 | import | ./atelier/AtelierScene | src/components/ReadingStage.tsx | 5–5 | import { AtelierScene, type ConversationPhase } from './atelier/AtelierScene'; |
| import:9122c9eeaeabca09571264fc837614d4 | import | ./ReadingStage.css | src/components/ReadingStage.tsx | 6–6 | import './ReadingStage.css'; |
| interface:e31bbaf1e418e2f82b453b946a62d3a8 | interface | ReadingStageProps | src/components/ReadingStage.tsx | 8–18 |  |
| property:bac144a98a16fe94a821ebe08f7db24a | property | ReadingStageProps::accountUid | src/components/ReadingStage.tsx | 9–9 | string accountUid |
| property:830a8cdb3fe002badc6bb8f0f56396ea | property | ReadingStageProps::extraControls | src/components/ReadingStage.tsx | 10–10 | React.ReactNode extraControls |
| property:0a9fafbb33ecc77296e7e9bfd3296315 | property | ReadingStageProps::presentation | src/components/ReadingStage.tsx | 11–11 | PresentationState presentation |
| property:d2b3b3ae54ac4f7687aac0f8b622d250 | property | ReadingStageProps::phase | src/components/ReadingStage.tsx | 12–12 | ConversationPhase phase |
| property:b4f191eec6b1663e91b7268e1e942d4b | property | ReadingStageProps::paused | src/components/ReadingStage.tsx | 13–13 | boolean paused |
| property:0a4c94c185f225d8d63e8f6654259b8d | property | ReadingStageProps::onPause | src/components/ReadingStage.tsx | 14–14 | (paused: boolean) => void onPause |
| property:e27a4ce8ede0b0bd244be7b81ef1a048 | property | ReadingStageProps::onView | src/components/ReadingStage.tsx | 15–15 | (view: PresentationView) => void onView |
| property:c4ec34d0601cfcfe63b523a3bfe5326f | property | ReadingStageProps::chart | src/components/ReadingStage.tsx | 16–16 | React.ReactNode chart |
| property:bb36160e29eed5c43d958f42eacaa047 | property | ReadingStageProps::conversation | src/components/ReadingStage.tsx | 17–17 | React.ReactNode conversation |
| function:67033ba8c9a5ee9edf1162dcb5a788f9 | function | ReadingStage | src/components/ReadingStage.tsx | 20–95 | ({ extraControls, accountUid, presentation, phase, paused, onPause, onView, chart, conversation }: ReadingStageProps) |
| function:744b96f00125be1af01238873b602c7d | function | ReadingStage::clamp | src/components/ReadingStage.tsx | 26–26 | (value:number) |
| function:e31d548c5be7031453c8c1d54a873e44 | function | ReadingStage::place | src/components/ReadingStage.tsx | 27–30 | (position:{x:number;y:number},save=true) |
| function:f69fb02648b341cc231b961a10cb5992 | function | ReadingStage::move | src/components/ReadingStage.tsx | 32–36 | (event:Event) |
| function:ebd305cacae87a95ee1f975ea8b298c4 | function | ReadingStage::endDrag | src/components/ReadingStage.tsx | 37–42 | (event:React.PointerEvent<HTMLButtonElement>) |
| function:86f82704a88cf7e73b5b0e9ca733a8ca | function | ReadingStage::endDrag::snap | src/components/ReadingStage.tsx | 40–40 | (value:number) |
| function:c6df298649011e359ebd1a7ef1420212 | function | ReadingStage::update | src/components/ReadingStage.tsx | 49–49 | () |
| file:src/components/ReadingStyleControl.tsx | file | src/components/ReadingStyleControl.tsx | src/components/ReadingStyleControl.tsx | 1–31 |  |
| import:34ff9593a18ecb4d412bc3f4ecbd684f | import | react | src/components/ReadingStyleControl.tsx | 1–1 | import { useId, useSyncExternalStore } from 'react'; |
| import:a69769d8250bd87a93c413c5bf7c3cc6 | import | ../services/readingStyle | src/components/ReadingStyleControl.tsx | 2–2 | import { loadReadingStyle, READING_STYLE_EVENT, READING_STYLE_OPTIONS, saveReadingStyle, type ReadingStyle } from '../services/readingStyle'; |
| interface:9010f4494ce66ad3267dc95a044cc77b | interface | ReadingStyleControlProps | src/components/ReadingStyleControl.tsx | 4–7 |  |
| property:cb03d7fdb3005d77ca7483c86f136ed7 | property | ReadingStyleControlProps::accountUid | src/components/ReadingStyleControl.tsx | 5–5 | string &#124; null accountUid |
| property:efcb810d74e1ba34de9d5ac2b5a6fe59 | property | ReadingStyleControlProps::initialStyle | src/components/ReadingStyleControl.tsx | 6–6 | ReadingStyle initialStyle |
| function:23bfa7ae7b23e93e73a264ade80fd3bb | function | subscribe | src/components/ReadingStyleControl.tsx | 9–16 | (callback: () => void) |
| function:373c98dacedf323f17eb21ca825de1f6 | function | ReadingStyleControl | src/components/ReadingStyleControl.tsx | 18–30 | ({ accountUid, initialStyle }: ReadingStyleControlProps) |
| file:src/components/ReadingsModal.tsx | file | src/components/ReadingsModal.tsx | src/components/ReadingsModal.tsx | 1–1067 |  |
| import:a27012bcd522c40fc388d6604d9b428b | import | react | src/components/ReadingsModal.tsx | 1–1 | import React, { useState, useEffect, useRef } from 'react'; |
| import:4ded12144221b59ff60a05f8f111275a | import | lucide-react | src/components/ReadingsModal.tsx | 2–16 | import {   X,   Sparkles,   BookOpen,   Users,   Compass,   Eye,   Download,   MessageSquare,   MapPin,   Search,   CheckCircle2,   RotateCcw,   Calendar, } from 'lucide-react'; |
| import:95e7550bf6fe0f0008e39c1002a0765e | import | ../services/ephemeris | src/components/ReadingsModal.tsx | 17–17 | import { NatalChartResult, NatalChartInput, calculateNatalChart } from '../services/ephemeris'; |
| import:1beac0f0334f93cfea710c380ad2b52b | import | ../services/readings | src/components/ReadingsModal.tsx | 18–18 | import { generateAstrologicalReading, ReadingResponse } from '../services/readings'; |
| import:9f1e93ed9ee5b5e22ffb7e91686bfc1d | import | ../services/locations | src/components/ReadingsModal.tsx | 19–25 | import {   CityLocation,   PRESET_CITIES,   searchPlaceOnline,   getPersistedVantageLocation,   savePersistedVantageLocation, } from '../services/locations'; |
| import:8e323dcc509f6f62afc4611f502e14b7 | import | ../services/presentation | src/components/ReadingsModal.tsx | 26–26 | import type { PresentationState } from '../services/presentation'; |
| import:4a6107fa6c760e45a7b2152d11498b56 | import | ./RichText | src/components/ReadingsModal.tsx | 27–27 | import { RichText } from './RichText'; |
| interface:ef757871e4d8508e5e15240bd3f166e4 | interface | ReadingsModalProps | src/components/ReadingsModal.tsx | 29–41 |  |
| property:d8a666c27e50e9f615a75c238857f120 | property | ReadingsModalProps::presentation | src/components/ReadingsModal.tsx | 30–30 | PresentationState presentation |
| property:89689e48b12481aa64771ac49dfd7cbc | property | ReadingsModalProps::accountUid | src/components/ReadingsModal.tsx | 31–31 | string accountUid |
| property:4b842f3e5220d14f4a128d7c60f5f9c9 | property | ReadingsModalProps::isCurrentSession | src/components/ReadingsModal.tsx | 32–32 | () => boolean isCurrentSession |
| property:29c4e347c0b0657f3732671d93f8fdad | property | ReadingsModalProps::onPartnerChart | src/components/ReadingsModal.tsx | 33–33 | (chart: NatalChartResult) => void onPartnerChart |
| property:564e59c801ea2baa8089f8c547bbfa53 | property | ReadingsModalProps::onSignIn | src/components/ReadingsModal.tsx | 34–34 | () => void onSignIn |
| property:51f1ccfb3894cd2d1126add608c320a0 | property | ReadingsModalProps::isSignedIn | src/components/ReadingsModal.tsx | 35–35 | boolean isSignedIn |
| property:b9aa30c91b9e4e4bfe29af4cabb9882d | property | ReadingsModalProps::chart | src/components/ReadingsModal.tsx | 36–36 | NatalChartResult chart |
| property:1946cf24d8784ea77103075ce25fa25a | property | ReadingsModalProps::onClose | src/components/ReadingsModal.tsx | 37–37 | () => void onClose |
| property:430e8641639aaeb566b032b2c9869f56 | property | ReadingsModalProps::initialType | src/components/ReadingsModal.tsx | 38–38 | 'horoscope' &#124; 'synastry' &#124; 'house' &#124; 'planet' &#124; 'aspect' initialType |
| property:1459cbcf14d0fc174b137b414cd9ccca | property | ReadingsModalProps::initialTargetKey | src/components/ReadingsModal.tsx | 39–39 | string initialTargetKey |
| property:a798a659167e3ba4d7967f6018026393 | property | ReadingsModalProps::onSendToNatally | src/components/ReadingsModal.tsx | 40–40 | (title: string, content: string, type: string, presentation?: Pick<ReadingResponse, 'chartCues' &#124; 'chartFocusKey' &#124; 'presentationVersion' &#124; 'presentationCues' &#124; 'observationSnapshot' &#124; 'generatedAt'>) => void onSendToNatally |
| function:97a23b558b28009921895508c33f8269 | function | ReadingsModal | src/components/ReadingsModal.tsx | 43–1066 | ({   accountUid,   presentation,   isCurrentSession,   onPartnerChart,   onSignIn,   isSignedIn,   chart,   onClose,   initialType = 'horoscope',   initialTargetKey,   onSendToNatally, }) |
| function:92f56f09cf216c5beac05db8b63a9f85 | function | ReadingsModal::requestActive | src/components/ReadingsModal.tsx | 138–138 | () |
| function:f83dc37b3fd08f85fd3cc7a4d81d094b | function | ReadingsModal::handleClickOutside | src/components/ReadingsModal.tsx | 142–155 | (e: MouseEvent) |
| function:fa477eaf567fb0a2a44c1ec4f0c6a7ca | function | ReadingsModal::handleTransitPlaceInput | src/components/ReadingsModal.tsx | 161–192 | (val: string) |
| function:2aa078241cddbf40d379f7d83467fd23 | function | ReadingsModal::selectTransitCity | src/components/ReadingsModal.tsx | 194–202 | (city: CityLocation) |
| function:5b30d017111bc14e80995a1df0677c3a | function | ReadingsModal::resetToBirthplace | src/components/ReadingsModal.tsx | 204–214 | () |
| function:c89aec7a9074da04ad743e264acf8693 | function | ReadingsModal::handlePartnerPlaceInput | src/components/ReadingsModal.tsx | 217–248 | (val: string) |
| function:ead526fb63fc0b2bb5eb9dafc3f7aa93 | function | ReadingsModal::selectPartnerCity | src/components/ReadingsModal.tsx | 250–256 | (city: CityLocation) |
| function:4f294f3cc5f05ae56cd02919d66887cb | function | ReadingsModal::handleGenerateHoroscope | src/components/ReadingsModal.tsx | 258–292 | (     tDate = transitDate,     tTime = transitTime,     city = vantageLocation   ) |
| function:16f4d3922e955ad3dea78fe509d7bd89 | function | ReadingsModal::handleGenerateSynastry | src/components/ReadingsModal.tsx | 294–334 | () |
| function:8bca46fa6ba38f5946f5de2c3915c827 | function | ReadingsModal::handleGenerateEntity | src/components/ReadingsModal.tsx | 336–359 | (type: 'house' &#124; 'planet' &#124; 'aspect', key: string) |
| file:src/components/RetainedReadingAudio.tsx | file | src/components/RetainedReadingAudio.tsx | src/components/RetainedReadingAudio.tsx | 1–205 |  |
| import:a4c755d809f9908563d5a02333eea612 | import | react | src/components/RetainedReadingAudio.tsx | 1–1 | import React, { useEffect, useRef, useState } from 'react'; |
| import:c62804b63cb000b8d3f785c2cc895ef1 | import | ../services/readingAudio | src/components/RetainedReadingAudio.tsx | 2–2 | import { clearReadingAudio, downloadReadingAudio, loadReadingAudio, readingAudioFilename, READING_AUDIO_EVENT, type ReadingAudioRecord } from '../services/readingAudio'; |
| import:f3369d8d48f5d1c4380144f7fa080841 | import | ./PurchaseAccess | src/components/RetainedReadingAudio.tsx | 3–3 | import { usePurchaseAccess } from './PurchaseAccess'; |
| import:e1bad12218aa0a06b64a0e7dec817a37 | import | ../services/voiceService | src/components/RetainedReadingAudio.tsx | 4–4 | import { dispatchNatallyVoicePerformance, registerExternalPlaybackStop, stopSpeaking } from '../services/voiceService'; |
| function:9c9873597966fcbeb78416c45a721d78 | function | RetainedReadingAudio | src/components/RetainedReadingAudio.tsx | 6–204 | ({ accountUid, messageId, isCurrentSession = () => true, onReplay, onPosition, onPlaybackState }: {   accountUid: string;   messageId: string;   isCurrentSession?: () => boolean;   onReplay?: () => boolean &#124; void;   onPosition?: (sourceOffset: number) => void;   onPlaybackState?: (playing: boolean) => void; }) |
| function:c848ee50c5d359b67eecafbfff6ba77e | function | RetainedReadingAudio::visualEnd | src/components/RetainedReadingAudio.tsx | 30–37 | () |
| function:52fc63980dee272c5378b39ecfb4e780 | function | RetainedReadingAudio::endPlayback | src/components/RetainedReadingAudio.tsx | 38–44 | () |
| function:ffdc348acf1611a23de1ee6a90363df2 | function | RetainedReadingAudio::refresh | src/components/RetainedReadingAudio.tsx | 49–57 | () |
| function:ed4b5bde5bf53e87d32f3696896e7cc4 | function | RetainedReadingAudio::change | src/components/RetainedReadingAudio.tsx | 59–61 | (event: Event) |
| function:8b2a531e0a02925ec754b7dd7ecf6791 | function | RetainedReadingAudio::mishap | src/components/RetainedReadingAudio.tsx | 63–76 | (event: Event) |
| function:d2679406883d86c766c57aba3d4331c7 | function | RetainedReadingAudio::prepareReplay | src/components/RetainedReadingAudio.tsx | 92–102 | () |
| function:3d649e3f4f8863db21a9a6f22b9c7cfc | function | RetainedReadingAudio::replay | src/components/RetainedReadingAudio.tsx | 103–138 | () |
| function:c46ab467346a7b751ab5b55552d3facb | function | RetainedReadingAudio::replay::position | src/components/RetainedReadingAudio.tsx | 112–136 | () |
| function:201d35533e7b9543a6e0e8f303545c52 | function | RetainedReadingAudio::seekPosition | src/components/RetainedReadingAudio.tsx | 140–149 | () |
| function:28f706586ee9de7465a41ed0516864a5 | function | RetainedReadingAudio::exportPdf | src/components/RetainedReadingAudio.tsx | 151–178 | () |
| function:5e3a656cdaf90b13edc530706ef7a758 | function | RetainedReadingAudio::clear | src/components/RetainedReadingAudio.tsx | 180–186 | () |
| file:src/components/RichText.tsx | file | src/components/RichText.tsx | src/components/RichText.tsx | 1–203 |  |
| import:efc80f92d9cc5c91a108b13d24d3eb81 | import | react | src/components/RichText.tsx | 1–1 | import React from 'react'; |
| interface:3ca60c42e9a741a839604a54a08a9c59 | interface | RichTextProps | src/components/RichText.tsx | 3–12 |  |
| property:88826a962032f8c4f85562b1ab13baf9 | property | RichTextProps::content | src/components/RichText.tsx | 4–4 | string content |
| property:a8527bdc5dbf28311729b3b43aaed127 | property | RichTextProps::resolveTarget | src/components/RichText.tsx | 5–5 | (raw: string, sourceOffset: number) => string &#124; null resolveTarget |
| property:986218e1699fbe099e00ed74e1975cbb | property | RichTextProps::targetNames | src/components/RichText.tsx | 6–6 | string[] targetNames |
| property:826a51c2996b19967358527133655db0 | property | RichTextProps::references | src/components/RichText.tsx | 7–7 | Array<{start:number;end:number;target:string}> references |
| property:4fe866ec384e55d1cba993a31ff8dbee | property | RichTextProps::onTagClick | src/components/RichText.tsx | 8–8 | (tag: string) => void onTagClick |
| property:30f1b79e2fb04b6816f5e2410b373f48 | property | RichTextProps::className | src/components/RichText.tsx | 9–9 | string className |
| property:795e91b3f72455c40f3b4d11cc667f31 | property | RichTextProps::highlightCharIndex | src/components/RichText.tsx | 10–10 | number &#124; null highlightCharIndex |
| property:06ffbd0b6059bf5a5bb7b79ac1c3f306 | property | RichTextProps::isCurrentlySpeaking | src/components/RichText.tsx | 11–11 | boolean isCurrentlySpeaking |
| function:576da79cf4dc814183816119845c69b6 | function | RichText | src/components/RichText.tsx | 14–202 | ({   content,   onTagClick,   resolveTarget,   targetNames,   references,   className = '',   highlightCharIndex = null,   isCurrentlySpeaking = false, }) |
| function:45955409631c17b0dd5f42cac0968f21 | function | RichText::renderInteractive | src/components/RichText.tsx | 31–59 | (text: string, base: number) |
| function:83542db100d30e2a10f72d19d763bd80 | function | RichText::renderInlineFormatted | src/components/RichText.tsx | 60–68 | (text: string, lineStartCharOffset: number) |
| function:615496c1e158069f5277308fdfb9832a | function | RichText::renderKaraokeWords | src/components/RichText.tsx | 71–101 | (rawText: string, baseOffset: number) |
| function:52b72b72e1f7b17dd747f25ca1c6f28b | function | RichText::flushList | src/components/RichText.tsx | 107–117 | () |
| file:src/components/SelectedComponentsBar.tsx | file | src/components/SelectedComponentsBar.tsx | src/components/SelectedComponentsBar.tsx | 1–82 |  |
| import:c7390416e7332de33eff13bfc1f27d6d | import | react | src/components/SelectedComponentsBar.tsx | 1–1 | import React from 'react'; |
| import:cb282b9f97751f6b2c3938a8feca6fdc | import | ../services/chartTargets | src/components/SelectedComponentsBar.tsx | 2–2 | import { chartTargetLabel } from '../services/chartTargets'; |
| import:bf5acef63a9f97dae7db2cfdf9c9186e | import | lucide-react | src/components/SelectedComponentsBar.tsx | 3–3 | import { Sparkles, X, Compass, Zap, BookOpen } from 'lucide-react'; |
| interface:d1db7eb1cd5b3c7ecc986272557c05ce | interface | SelectedComponentsBarProps | src/components/SelectedComponentsBar.tsx | 5–11 |  |
| property:f0475973251c8b37c011f6769989d0e2 | property | SelectedComponentsBarProps::selectedComponents | src/components/SelectedComponentsBar.tsx | 6–6 | string[] selectedComponents |
| property:ca5c6eeb54ef6cac95e63b8b12fa4ee0 | property | SelectedComponentsBarProps::onRemoveComponent | src/components/SelectedComponentsBar.tsx | 7–7 | (id: string) => void onRemoveComponent |
| property:1689b9b92299082d487512fea37436c1 | property | SelectedComponentsBarProps::onClearAll | src/components/SelectedComponentsBar.tsx | 8–8 | () => void onClearAll |
| property:d4bcf65c346b822d3c54cfc70f1bac93 | property | SelectedComponentsBarProps::onBeginIntuitiveReading | src/components/SelectedComponentsBar.tsx | 9–9 | (components: string[]) => void onBeginIntuitiveReading |
| property:8d6657f971765bfdf57c04f62293a649 | property | SelectedComponentsBarProps::isGeneratingReading | src/components/SelectedComponentsBar.tsx | 10–10 | boolean isGeneratingReading |
| function:674dcb197268f8a5e479f84840878dfc | function | SelectedComponentsBar | src/components/SelectedComponentsBar.tsx | 13–81 | ({   selectedComponents,   onRemoveComponent,   onClearAll,   onBeginIntuitiveReading,   isGeneratingReading = false, }) |
| file:src/components/ThemesAndWisdomBox.tsx | file | src/components/ThemesAndWisdomBox.tsx | src/components/ThemesAndWisdomBox.tsx | 1–230 |  |
| import:95bc56c238bf36b67576966eaf48df95 | import | react | src/components/ThemesAndWisdomBox.tsx | 1–1 | import React, { useState } from 'react'; |
| import:635a4075ec42a5fdcbf2d64a2c12a2b1 | import | lucide-react | src/components/ThemesAndWisdomBox.tsx | 2–2 | import { Sparkles, Calendar, Compass, Shield, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'; |
| import:c0c6b51824c335e4a34c56afad66fa79 | import | ../services/astrowisdom | src/components/ThemesAndWisdomBox.tsx | 3–3 | import { NumerologyAndThemes } from '../services/astrowisdom'; |
| interface:1e33654d541e28b3a045f2cadbc433df | interface | ThemesAndWisdomBoxProps | src/components/ThemesAndWisdomBox.tsx | 5–10 |  |
| property:4c18d3c4400e8a990a168d20dfc9b8a4 | property | ThemesAndWisdomBoxProps::wisdom | src/components/ThemesAndWisdomBox.tsx | 6–6 | NumerologyAndThemes wisdom |
| property:e35b525a49cd841914f10ba013c9efe2 | property | ThemesAndWisdomBoxProps::onOpenReading | src/components/ThemesAndWisdomBox.tsx | 7–7 | (type: 'horoscope' &#124; 'synastry' &#124; 'house' &#124; 'planet' &#124; 'aspect') => void onOpenReading |
| property:662a5f10794264050cfcfef5bcdecca7 | property | ThemesAndWisdomBoxProps::onDiscussWithNatally | src/components/ThemesAndWisdomBox.tsx | 8–8 | (title: string, query: string) => void onDiscussWithNatally |
| property:5114f9ca99ab861fc706542eb7516600 | property | ThemesAndWisdomBoxProps::embedded | src/components/ThemesAndWisdomBox.tsx | 9–9 | boolean embedded |
| function:2ecfc688bd415ee97bc13b405b35a307 | function | ThemesAndWisdomBox | src/components/ThemesAndWisdomBox.tsx | 12–229 | ({   wisdom,   onOpenReading,   onDiscussWithNatally,   embedded = false, }) |
| file:src/components/VoiceDownloadStatus.tsx | file | src/components/VoiceDownloadStatus.tsx | src/components/VoiceDownloadStatus.tsx | 1–52 |  |
| import:354ffa70e680393681ba0a992fc3ac3c | import | react | src/components/VoiceDownloadStatus.tsx | 1–1 | import { useEffect, useState } from 'react'; |
| import:bd5ccd2164d2026a8234fed185b2d0b8 | import | ../services/supertonicTts | src/components/VoiceDownloadStatus.tsx | 2–2 | import { subscribeVoiceStatus, type VoiceStatus } from '../services/supertonicTts'; |
| function:b47ee7fda4a86fcd842f7f9c085e07dc | function | VoiceDownloadStatus | src/components/VoiceDownloadStatus.tsx | 4–8 | () |
| function:2a3cbe55893b987c3d2665c37c4d5f88 | function | VoiceProgress | src/components/VoiceDownloadStatus.tsx | 10–51 | ({ status }: { status: VoiceStatus }) |
| function:9c32c85677546cd5203854807e52749a | function | VoiceProgress::format | src/components/VoiceDownloadStatus.tsx | 19–19 | (bytes: number) |
| file:src/components/VoiceMeasurementPanel.tsx | file | src/components/VoiceMeasurementPanel.tsx | src/components/VoiceMeasurementPanel.tsx | 1–45 |  |
| import:5b9e2568e3108b34da31c2074a11472f | import | react | src/components/VoiceMeasurementPanel.tsx | 1–1 | import { useEffect, useState } from 'react'; |
| import:60087569c66493465be162b92c8ff130 | import | ../services/voiceMeasurements | src/components/VoiceMeasurementPanel.tsx | 2–2 | import { EMPTY_SURVEY, SURVEY_OPTIONS, voiceMeasurements, summarizeMeasurements, type VoiceSurvey } from '../services/voiceMeasurements'; |
| constant:0dd44d532a4cdcb0468fd0b41981d7c5 | constant | labels | src/components/VoiceMeasurementPanel.tsx | 4–4 | = { device: 'Device type', os: 'Operating system', browser: 'Browser', memory: 'Device RAM (if known)'... |
| function:ef55cddaf743a53b588e0b061e7ae72e | function | VoiceMeasurementPanel | src/components/VoiceMeasurementPanel.tsx | 5–44 | () |
| function:be6bc54d800413480d679f7b770dcc9b | function | VoiceMeasurementPanel::exportReport | src/components/VoiceMeasurementPanel.tsx | 14–18 | () |
| file:src/components/atelier/AtelierAmbience.tsx | file | src/components/atelier/AtelierAmbience.tsx | src/components/atelier/AtelierAmbience.tsx | 1–47 |  |
| import:d8ff052e4ffd6e69323b393ce97dd845 | import | react | src/components/atelier/AtelierAmbience.tsx | 1–1 | import React, { useEffect, useRef, useState } from 'react'; |
| import:252b02782be52504a0d9325f38e6fd12 | import | ../../services/presentation | src/components/atelier/AtelierAmbience.tsx | 2–2 | import type { PresentationView } from '../../services/presentation'; |
| import:32f42f87c85194ec259ae79ff6ac26c2 | import | ./AtelierScene | src/components/atelier/AtelierAmbience.tsx | 3–3 | import type { ConversationPhase } from './AtelierScene'; |
| function:0700b070f143f1ea77eb3da27cb19571 | function | AtelierAmbience | src/components/atelier/AtelierAmbience.tsx | 5–46 | ({view,phase}:{view:PresentationView;phase:ConversationPhase}) |
| function:6b7f2b21e73436cafab658d150cda6b3 | function | AtelierAmbience::adjust | src/components/atelier/AtelierAmbience.tsx | 13–19 | () |
| function:f61a683fb0ddc9771b4a5f916ed8f30f | function | AtelierAmbience::stop | src/components/atelier/AtelierAmbience.tsx | 20–20 | () |
| function:5dd089027e40567cfe98f398743db596 | function | AtelierAmbience::visibility | src/components/atelier/AtelierAmbience.tsx | 23–23 | () |
| function:0fc0db6fc1df7b9018c62169a205a515 | function | AtelierAmbience::start | src/components/atelier/AtelierAmbience.tsx | 27–40 | () |
| file:src/components/atelier/AtelierCharacter.tsx | file | src/components/atelier/AtelierCharacter.tsx | src/components/atelier/AtelierCharacter.tsx | 1–121 |  |
| import:863c40f90b7298de89c303deef598253 | import | react | src/components/atelier/AtelierCharacter.tsx | 1–1 | import React, { useEffect, useId, useRef, useState } from 'react'; |
| import:9fe2c61acc7aacedf2c643090cf940a8 | import | ../../services/voiceService | src/components/atelier/AtelierCharacter.tsx | 2–2 | import type { NatallyVoicePerformance } from '../../services/voiceService'; |
| import:0baada2d68d37665c6938cce45801977 | import | ./AtelierScene | src/components/atelier/AtelierCharacter.tsx | 3–3 | import type { ConversationPhase } from './AtelierScene'; |
| constant:5446db19bff20d1da2773520aaa61630 | constant | LEFT_HAND_PATH | src/components/atelier/AtelierCharacter.tsx | 5–5 | = 'M626 1036C636 943 665 862 725 798C758 754 811 724 862 711C896 694 924 691 950 702L996 716L1012 736L... |
| constant:6d2c9398389eb21b634a3991fd448d62 | constant | RIGHT_HAND_PATH | src/components/atelier/AtelierCharacter.tsx | 6–6 | = 'M1267 815C1316 807 1375 855 1375 915C1378 967 1324 1018 1272 1053L1214 1088L1167 1116L1126 1125L108... |
| function:6084852064a819733911911276228636 | function | AtelierCharacter | src/components/atelier/AtelierCharacter.tsx | 10–120 | ({ phase, motionEnabled, assetAttempt, onReady }: { phase: ConversationPhase; motionEnabled: boolean; assetAttempt: number; onReady: (ready: boolean) => void }) |
| function:6a59a4e2c06c189dfdadab302cb713fd | function | AtelierCharacter::clearMouth | src/components/atelier/AtelierCharacter.tsx | 18–18 | () |
| function:0b41a92e16ba532adf0010150f3870ed | function | AtelierCharacter::performanceEvent | src/components/atelier/AtelierCharacter.tsx | 30–57 | (event: Event) |
| function:7d9a654823048a7f6878901ac677c271 | function | AtelierCharacter::performanceEvent::apply | src/components/atelier/AtelierCharacter.tsx | 52–52 | () |
| function:e3739d85cca2d7b3188a1d918500abec | function | AtelierCharacter::mishap | src/components/atelier/AtelierCharacter.tsx | 63–80 | (event:Event) |
| function:aff11176fbd0badd0eec7db7a8530dee | function | AtelierCharacter::ref | src/components/atelier/AtelierCharacter.tsx | 85–85 | (name: string) |
| file:src/components/atelier/AtelierScene.tsx | file | src/components/atelier/AtelierScene.tsx | src/components/atelier/AtelierScene.tsx | 1–46 |  |
| import:1ab8fa3ffc602950b63bf9ec4a0fff8a | import | react | src/components/atelier/AtelierScene.tsx | 1–1 | import React, { useEffect, useState } from 'react'; |
| import:a95e8fdd339efcdf03d2bac2bb5b0632 | import | ../../services/atelierMotion | src/components/atelier/AtelierScene.tsx | 2–2 | import { canAnimateAtelier } from '../../services/atelierMotion'; |
| import:b801cbe607288ae258018f609443451d | import | ./AtelierTrinkets | src/components/atelier/AtelierScene.tsx | 3–3 | import { AtelierTrinkets } from './AtelierTrinkets'; |
| import:e6ca202367bc5d3fa36c4e14de4184e4 | import | ./AtelierCharacter | src/components/atelier/AtelierScene.tsx | 4–4 | import { AtelierCharacter } from './AtelierCharacter'; |
| import:fe31186405e28143b9dad6c850aa5fd6 | import | ./AtelierScene.css | src/components/atelier/AtelierScene.tsx | 5–5 | import './AtelierScene.css'; |
| import:130a139f80d4993a3d40641e4785625d | import | ./AtelierSeason | src/components/atelier/AtelierScene.tsx | 6–6 | import { AtelierSeason } from './AtelierSeason'; |
| import:347eaab75fa127d38f9cd14838fc3a1e | import | ../../services/atelierTheme | src/components/atelier/AtelierScene.tsx | 7–7 | import { useAtelierTheme } from '../../services/atelierTheme'; |
| import:7119a26c6263aeefc8e415e6f631bbef | import | ../../services/atelierSound | src/components/atelier/AtelierScene.tsx | 8–8 | import { unlockAtelierSound } from '../../services/atelierSound'; |
| type_alias:43f43c97f0f3eea00ff9cf6afa7148f0 | type_alias | ConversationPhase | src/components/atelier/AtelierScene.tsx | 10–10 |  |
| constant:db59ce1fc0c8f015edba16e720c23c08 | constant | PHASE_LABELS | src/components/atelier/AtelierScene.tsx | 11–11 | = { idle: 'Here with you', listening: 'Listening', thinking: 'Considering your question', speaking: 'S... |
| function:a73913204fe74cc01148161e23f2f6c3 | function | AtelierScene | src/components/atelier/AtelierScene.tsx | 13–45 | ({ phase, motionEnabled, sceneVisible = true, accountUid = null }: { phase: ConversationPhase; motionEnabled: boolean; sceneVisible?: boolean; accountUid?: string &#124; null }) |
| function:95be5a495e5f2a1e08d2699be224ef0f | function | AtelierScene::retryArtwork | src/components/atelier/AtelierScene.tsx | 21–21 | () |
| function:8996f3ae2c05a27c0c08070819a56a58 | function | AtelierScene::visibility | src/components/atelier/AtelierScene.tsx | 23–23 | () |
| function:3d61de9fe133491fccdfe653d3a1e412 | function | AtelierScene::motion | src/components/atelier/AtelierScene.tsx | 25–25 | () |
| function:c131b51876bfc1a6d6ae5903ffbeb082 | function | AtelierScene::online | src/components/atelier/AtelierScene.tsx | 26–26 | () |
| file:src/components/atelier/AtelierSeason.tsx | file | src/components/atelier/AtelierSeason.tsx | src/components/atelier/AtelierSeason.tsx | 1–44 |  |
| import:5ba539e4a1fcd1b12aea55e191074ac1 | import | react | src/components/atelier/AtelierSeason.tsx | 1–1 | import React, { useEffect, useId, useRef, useState } from 'react'; |
| import:bc01cfd8f068ef2af78fd0edf1790506 | import | ../../services/atelierSound | src/components/atelier/AtelierSeason.tsx | 2–2 | import { playAtelierCrunch, unlockAtelierSound } from '../../services/atelierSound'; |
| import:8c7c3787a6be55bf5b2f718b4c7ac075 | import | ../../services/atelierTheme | src/components/atelier/AtelierSeason.tsx | 3–3 | import type { AtelierTheme } from '../../services/atelierTheme'; |
| constant:fb6b8f26dfe8282738f6ff0e043805aa | constant | FRESH_COOKIES | src/components/atelier/AtelierSeason.tsx | 4–4 | = [{x:1580,y:1110,bites:0},{x:1690,y:1125,bites:0},{x:1790,y:1100,bites:0}] |
| function:3ec999350cd321b50607fe3204b13cf4 | function | AtelierSeason | src/components/atelier/AtelierSeason.tsx | 6–43 | ({theme,accountUid}:{theme:AtelierTheme;accountUid:string&#124;null}) |
| function:d6596006cce23dd58359ed40cd322453 | function | AtelierSeason::bite | src/components/atelier/AtelierSeason.tsx | 15–15 | () |
| file:src/components/atelier/AtelierThemeSelector.tsx | file | src/components/atelier/AtelierThemeSelector.tsx | src/components/atelier/AtelierThemeSelector.tsx | 1–7 |  |
| import:9c2ad50b308e1bcd3aaaf501d15618f8 | import | react | src/components/atelier/AtelierThemeSelector.tsx | 1–1 | import React from 'react'; |
| import:bf9bf116aa37c1a65eb8cdbec2c846d3 | import | ../../services/atelierTheme | src/components/atelier/AtelierThemeSelector.tsx | 2–2 | import { ATELIER_THEMES, setAtelierTheme, useAtelierTheme, type AtelierTheme } from '../../services/atelierTheme'; |
| function:7a9a1880a38a958e18e6b6c17b59004a | function | AtelierThemeSelector | src/components/atelier/AtelierThemeSelector.tsx | 3–6 | ({accountUid=null}:{accountUid?:string&#124;null}) |
| file:src/components/atelier/AtelierTrinkets.tsx | file | src/components/atelier/AtelierTrinkets.tsx | src/components/atelier/AtelierTrinkets.tsx | 1–193 |  |
| import:11f09dc630ecc91e1139e7412098bbd5 | import | ./CrystalPool | src/components/atelier/AtelierTrinkets.tsx | 1–1 | import { CrystalPool } from './CrystalPool'; |
| import:95e5f9498df52f915ff534de40fedbf2 | import | react | src/components/atelier/AtelierTrinkets.tsx | 2–2 | import React, { useEffect, useId, useRef, useState } from 'react'; |
| import:a360000e9dd7fab4172ec81dd12e4bdd | import | ./AtelierScene | src/components/atelier/AtelierTrinkets.tsx | 3–3 | import type { ConversationPhase } from './AtelierScene'; |
| import:1d3e4a2c745dddd896ed3fd064e99803 | import | ../../services/atelierSound | src/components/atelier/AtelierTrinkets.tsx | 4–4 | import { playAtelierBreak, playAtelierWobble, unlockAtelierSound } from '../../services/atelierSound'; |
| import:d8fd5e4db6c4f51dba3d469cb9871665 | import | ./AtelierCharacter | src/components/atelier/AtelierTrinkets.tsx | 5–5 | import { LEFT_HAND_PATH, RIGHT_HAND_PATH } from './AtelierCharacter'; |
| import:7b4143487e260279ad1ef4a902825330 | import | ../../services/atelierMemories | src/components/atelier/AtelierTrinkets.tsx | 6–6 | import { nextRehearsalAppointment, isAtelierRehearsal, setAtelierRehearsal, resetAtelierRehearsal, getAtelierMemory, breakAtelierObject, placeAtelierObjects, type TrinketId } from '../../services/atelierMemories'; |
| constant:93db4bc34f3ae5aacdf13c1de8ba8009 | constant | ITEMS | src/components/atelier/AtelierTrinkets.tsx | 9–9 | = [{id:'hourglass',label:'Hourglass',x:410,y:712,base:81,radius:44},{id:'armillary',label:'Brass armil... |
| constant:7b3cc71db2a53a2399a233a4b8cdc06a | constant | SHELVES | src/components/atelier/AtelierTrinkets.tsx | 11–20 | = [   {id:'bookcase-top-left',label:'Top of left bookcase',left:80,right:650,y:345},   {id:'bookcase... |
| type_alias:9ac390cea83f5d97cc3583be4387979f | type_alias | Shelf | src/components/atelier/AtelierTrinkets.tsx | 21–21 |  |
| function:fece63f07760c55a175a75305446e576 | function | nearestShelf | src/components/atelier/AtelierTrinkets.tsx | 22–25 | (item:typeof ITEMS[number],point:{x:number;y:number}): Shelf |
| function:75b14d24d6e4aa386e24a2c932941791 | function | nearestShelf::distance | src/components/atelier/AtelierTrinkets.tsx | 23–23 | (s:Shelf) |
| function:04c06179ee4d1c04a8fbd7537bbc6de2 | function | ShelfObject | src/components/atelier/AtelierTrinkets.tsx | 27–36 | ({ item, broken, taped, active, resonance, offset, picked, children }: { item: typeof ITEMS[number]; broken:boolean;taped:boolean;active:boolean;resonance:number;offset:{x:number;y:number};picked:boolean;children:React.ReactNode }) |
| function:acd0701b6abde21dc08b6f0606a47bc2 | function | AtelierTrinkets | src/components/atelier/AtelierTrinkets.tsx | 38–192 | ({ motionEnabled, phase, characterReady = false, accountUid = null }: { motionEnabled: boolean; phase: ConversationPhase; characterReady?: boolean; accountUid?: string &#124; null }) |
| function:57c8b24800ab5fcc8535aed3a1bc0c2a | function | AtelierTrinkets::update | src/components/atelier/AtelierTrinkets.tsx | 52–52 | (event:Event) |
| function:cc67ecda344e7f24c46b235e70f27309 | function | AtelierTrinkets::positionOf | src/components/atelier/AtelierTrinkets.tsx | 56–56 | (item:typeof ITEMS[number],values=offsetsRef.current) |
| function:fc58f1fd349c50d9937d222c5d7ac03c | function | AtelierTrinkets::shatter | src/components/atelier/AtelierTrinkets.tsx | 57–61 | (ids:TrinketId[]) |
| function:63decdaf456eddad614deaa20bf48cc3 | function | AtelierTrinkets::dropOnShelf | src/components/atelier/AtelierTrinkets.tsx | 62–78 | (itemId:TrinketId,specifiedShelf?:Shelf) |
| function:067750864d66992b478e2724f15879a0 | function | AtelierTrinkets::putBack | src/components/atelier/AtelierTrinkets.tsx | 79–79 | () |
| function:733f51f125fb22af3ff764f314b84fc6 | function | AtelierTrinkets::nudge | src/components/atelier/AtelierTrinkets.tsx | 80–90 | (item:TrinketId,event:React.PointerEvent<HTMLButtonElement>,entering=false) |
| function:2cd4abe8213fb92a82c018e7513660a1 | function | AtelierTrinkets::beginDrag | src/components/atelier/AtelierTrinkets.tsx | 91–96 | (event:React.PointerEvent<HTMLButtonElement>,item:TrinketId) |
| function:2244c4fb3ab74a8c98787dea03d96722 | function | AtelierTrinkets::moveDrag | src/components/atelier/AtelierTrinkets.tsx | 97–97 | (event:React.PointerEvent<HTMLButtonElement>) |
| function:3a2bce2d921453dd5dd7883ba7411b09 | function | AtelierTrinkets::endDrag | src/components/atelier/AtelierTrinkets.tsx | 98–98 | (event:React.PointerEvent<HTMLButtonElement>) |
| function:6db79058529d27ac03dab086e3758591 | function | AtelierTrinkets::moveByKey | src/components/atelier/AtelierTrinkets.tsx | 99–103 | (event:React.KeyboardEvent<HTMLButtonElement>,item:TrinketId) |
| function:996af574c29602b76074d7af0864e0c3 | function | AtelierTrinkets::itemProps | src/components/atelier/AtelierTrinkets.tsx | 104–104 | (id:TrinketId) |
| function:56812531dbe8b27ed33939a167a55c53 | function | AtelierTrinkets::ref | src/components/atelier/AtelierTrinkets.tsx | 106–106 | (name: string) |
| file:src/components/atelier/CrystalPool.tsx | file | src/components/atelier/CrystalPool.tsx | src/components/atelier/CrystalPool.tsx | 1–37 |  |
| import:8645dc9f6b346fcd699b8b49bff4906d | import | react | src/components/atelier/CrystalPool.tsx | 1–1 | import React, { useEffect, useId, useRef, useState } from 'react'; |
| function:657e3801f25ca8cd27e7a98910488e9b | function | CrystalPool | src/components/atelier/CrystalPool.tsx | 4–36 | ({ motionEnabled }: { motionEnabled:boolean }) |
| function:febb01f4c406e236fc1f46126ca07d49 | function | CrystalPool::stir | src/components/atelier/CrystalPool.tsx | 11–19 | (event:React.PointerEvent<SVGCircleElement>) |
| function:92e41693d82f8efda944d71823ab1c34 | function | CrystalPool::pulse | src/components/atelier/CrystalPool.tsx | 20–20 | () |
| file:src/components/onboarding/BirthDateFields.tsx | file | src/components/onboarding/BirthDateFields.tsx | src/components/onboarding/BirthDateFields.tsx | 1–100 |  |
| import:2ed60fdbcd1c8bbb386cb647d143455e | import | react | src/components/onboarding/BirthDateFields.tsx | 1–1 | import { useEffect, useState } from 'react'; |
| import:b625a179d4d8c8fd3344aa6d84cef52e | import | ../../services/birthDate | src/components/onboarding/BirthDateFields.tsx | 2–2 | import { formatBirthDateInput, getBirthDateParts, getBirthMonthDays } from '../../services/birthDate'; |
| function:337b52f7c78a40865ece1077a976c3b0 | function | BirthDateFields | src/components/onboarding/BirthDateFields.tsx | 4–99 | ({ value, onChange, disabled, describedBy, invalid, maxDate }: {   value: string;   onChange: (value: string) => void;   disabled: boolean;   describedBy: string;   invalid: boolean;   maxDate: string; }) |
| function:7ec60742751a7571317ac12673f25492 | function | BirthDateFields::selectYear | src/components/onboarding/BirthDateFields.tsx | 30–34 | (year: number) |
| function:ebfd4c185f7b9abe6cec8703274415a2 | function | BirthDateFields::moveMonth | src/components/onboarding/BirthDateFields.tsx | 35–39 | (offset: number) |
| file:src/components/onboarding/CalendarPicker.tsx | file | src/components/onboarding/CalendarPicker.tsx | src/components/onboarding/CalendarPicker.tsx | 1–146 |  |
| import:54d092d4e5e745fcae0ae09a04d1a765 | import | react | src/components/onboarding/CalendarPicker.tsx | 1–1 | import { useMemo, useState } from 'react'; |
| constant:a45fd3445bc142362e1aa91f2db51ca7 | constant | MONTHS | src/components/onboarding/CalendarPicker.tsx | 3–6 | = [   'January', 'February', 'March', 'April', 'May', 'June',   'July', 'August', 'September', 'Octo... |
| constant:2fa04d10bcd48184a195644c8e034590 | constant | WEEKDAYS | src/components/onboarding/CalendarPicker.tsx | 7–7 | = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] |
| interface:e61eb13a9f01f1b3ade34769b42e4127 | interface | CalendarPickerProps | src/components/onboarding/CalendarPicker.tsx | 9–16 |  |
| property:1a6b7da61a8651e589dbf25a76c572a9 | property | CalendarPickerProps::value | src/components/onboarding/CalendarPicker.tsx | 11–11 | string value |
| property:28a2368b73f8350642093640e71517ea | property | CalendarPickerProps::min | src/components/onboarding/CalendarPicker.tsx | 12–12 | string min |
| property:2e21c0febbba07eb37cad5f4044ae8ae | property | CalendarPickerProps::max | src/components/onboarding/CalendarPicker.tsx | 13–13 | string max |
| property:2572426ad852ea2b568b20c2b6385ad5 | property | CalendarPickerProps::onPick | src/components/onboarding/CalendarPicker.tsx | 14–14 | (iso: string) => void onPick |
| property:fc1eaf9510dc69047d164c98fc391ded | property | CalendarPickerProps::onClose | src/components/onboarding/CalendarPicker.tsx | 15–15 | () => void onClose |
| constant:b4f28992c568d9d1e9ae5a891ed775f2 | constant | maxYearDyn | src/components/onboarding/CalendarPicker.tsx | 19–19 | = new Date().getFullYear() + 1 |
| function:5698be44197c228551b5d76cd0889fa5 | function | toIso | src/components/onboarding/CalendarPicker.tsx | 21–22 | (y: number, m: number, d: number) |
| function:716fb41c6f1a8851544971cf5a905435 | function | CalendarPicker | src/components/onboarding/CalendarPicker.tsx | 28–143 | ({ value, min, max, onPick, onClose }: CalendarPickerProps) |
| function:eb491d95f2d83c3eb1e25ddca67378d2 | function | CalendarPicker::stepByYears | src/components/onboarding/CalendarPicker.tsx | 46–49 | (delta: number) |
| function:f7064b26b9ffd2e1d7d575d1344daa43 | function | CalendarPicker::step | src/components/onboarding/CalendarPicker.tsx | 51–60 | (delta: number) |
| file:src/components/onboarding/FirstLight.tsx | file | src/components/onboarding/FirstLight.tsx | src/components/onboarding/FirstLight.tsx | 1–521 |  |
| import:ec914a8cf76581b64d62e81e47a0800d | import | ../../services/readingStyle | src/components/onboarding/FirstLight.tsx | 1–1 | import { READING_STYLE_OPTIONS, type ReadingStyle } from '../../services/readingStyle'; |
| import:93a9b1fd53fa50d5e609f35383ee218f | import | react | src/components/onboarding/FirstLight.tsx | 2–2 | import { type FormEvent, useEffect, useId, useMemo, useRef, useState } from 'react'; |
| import:cf90fa2dacbf102c7be06d0499d68f58 | import | react-dom | src/components/onboarding/FirstLight.tsx | 3–3 | import { flushSync } from 'react-dom'; |
| import:fbd68284986aae7dda737335d8fbcf98 | import | ../../services/gazetteer | src/components/onboarding/FirstLight.tsx | 4–4 | import type { GazetteerEntry } from '../../services/gazetteer'; |
| import:c151db9dd790e5198dc236b02656987b | import | ../../services/onboarding | src/components/onboarding/FirstLight.tsx | 5–5 | import type { IntakeDraft } from '../../services/onboarding'; |
| import:44aebc7e91b8c7bd4a0e05eb42862b64 | import | ./first-light.css | src/components/onboarding/FirstLight.tsx | 6–6 | import './first-light.css'; |
| import:fc54c71f530ea68f94d66a67fa384c23 | import | ../../services/supertonicTts | src/components/onboarding/FirstLight.tsx | 7–7 | import { scheduleSupertonicPreload } from '../../services/supertonicTts'; |
| import:7efe30871120dff8663d6d8346a636ca | import | ../../services/transits | src/components/onboarding/FirstLight.tsx | 8–8 | import { requestCurrentLocation, type CurrentLocation } from '../../services/transits'; |
| import:a7df32bccd2df203592a143a1814743a | import | ../../services/birthDate | src/components/onboarding/FirstLight.tsx | 9–9 | import { validateBirthDate } from '../../services/birthDate'; |
| import:3a4be1f2d8bcf7c20210e7de2112daf5 | import | ./BirthDateFields | src/components/onboarding/FirstLight.tsx | 10–10 | import { BirthDateFields } from './BirthDateFields'; |
| interface:a490e859accb7587cbd02da8b8ced4fb | interface | FirstLightProps | src/components/onboarding/FirstLight.tsx | 14–19 |  |
| property:75bde5a4b6f41e9b96fb0e9a2edb7cfe | property | FirstLightProps::gazetteer | src/components/onboarding/FirstLight.tsx | 15–15 | readonly GazetteerEntry[] gazetteer |
| property:b59bae438a6e2fb93a4338650114887b | property | FirstLightProps::busy | src/components/onboarding/FirstLight.tsx | 16–16 | boolean busy |
| property:191d437cb1d10543f94393b0db2f3c47 | property | FirstLightProps::error | src/components/onboarding/FirstLight.tsx | 17–17 | string &#124; null error |
| property:e0e4b82c30cbf6294ec5efd83fc35f25 | property | FirstLightProps::onCreate | src/components/onboarding/FirstLight.tsx | 18–18 | (draft: IntakeDraft) => void onCreate |
| constant:5029a5c86494725ea63a51fcb4606213 | constant | QUESTION_SEQUENCE | src/components/onboarding/FirstLight.tsx | 21–28 | = [   { kind: 'name', prompt: 'What may I call you?', type: 'text', placeholder: 'your name…' },   {... |
| constant:de665e29973a66c2aabe27ac07a63054 | constant | MAX_BIRTH_DATE | src/components/onboarding/FirstLight.tsx | 31–35 | = (() => {   const d = new Date();   d.setFullYear(d.getFullYear() + 1);   return d.toISOString().s... |
| constant:b516e81176223dda410afdcc3af4368c | constant | stars | src/components/onboarding/FirstLight.tsx | 37–47 | = Array.from({ length: 24 }, (_, index) => {   const seed = (multiplier: number) => (Math.sin((index ... |
| function:500bd9acfe35e780d9e56c75a1ed2833 | function | stars::seed | src/components/onboarding/FirstLight.tsx | 38–38 | (multiplier: number) |
| function:98474246f6f583b7944b2a1c3aeb3ba8 | function | normalizePlaceLabel | src/components/onboarding/FirstLight.tsx | 49–50 | (value: string) |
| function:5ee24d473df267b6625a2cd0d9fbbd52 | function | FirstLight | src/components/onboarding/FirstLight.tsx | 53–518 | ({ gazetteer, busy, error, onCreate }: FirstLightProps) |
| function:5589bc3d4eff4307431726a84ed7377b | function | FirstLight::latLabel | src/components/onboarding/FirstLight.tsx | 101–101 | (lat: number) |
| function:6c1af284bfde5799ee07912ab1ae4682 | function | FirstLight::lonLabel | src/components/onboarding/FirstLight.tsx | 102–102 | (lon: number) |
| function:13a1009664a956ebb10bb6ebcf066778 | function | FirstLight::update | src/components/onboarding/FirstLight.tsx | 121–121 | () |
| function:a07fb594c2e3cc119178327430f9d06d | function | FirstLight::syncCaret | src/components/onboarding/FirstLight.tsx | 153–156 | (field: HTMLInputElement) |
| function:d1a8d71ca52e79697f0616a76467792e | function | FirstLight::advance | src/components/onboarding/FirstLight.tsx | 158–184 | (event: FormEvent<HTMLFormElement>) |
| file:src/hooks/useVisualViewport.ts | file | src/hooks/useVisualViewport.ts | src/hooks/useVisualViewport.ts | 1–35 |  |
| import:fd737a9e60740e41dd69b54474652c62 | import | react | src/hooks/useVisualViewport.ts | 1–1 | import { useEffect, useState } from 'react'; |
| import:154e01596243c96fea3c305503a99b6d | import | ../services/chatViewport | src/hooks/useVisualViewport.ts | 2–2 | import type { ViewportBounds } from '../services/chatViewport'; |
| function:a079aa311abb4b2d9b5af790cd6c0d0e | function | readViewport | src/hooks/useVisualViewport.ts | 4–16 | (): ViewportBounds |
| function:e587f32751c877bd0e365cbf0df9febf | function | useVisualViewport | src/hooks/useVisualViewport.ts | 18–34 | (): ViewportBounds |
| function:d5805eaeba4eb1df49e4f7c543815045 | function | useVisualViewport::update | src/hooks/useVisualViewport.ts | 22–22 | () |
| file:src/main.tsx | file | src/main.tsx | src/main.tsx | 1–8 |  |
| import:e43de4eeda54621f68f558dcbdbb2ff1 | import | react-dom/client | src/main.tsx | 1–1 | import { createRoot } from 'react-dom/client'; |
| import:8725af07418c0741dd8b10d84f6f85df | import | ./App.tsx | src/main.tsx | 2–2 | import App from './App.tsx'; |
| import:79386c23be13453da7bec407968d6bb7 | import | ./components/PurchaseAccess | src/main.tsx | 3–3 | import { PurchaseAccessProvider } from './components/PurchaseAccess'; |
| import:35d3bfb984800614a60d966248babcd4 | import | ./components/VoiceDownloadStatus | src/main.tsx | 4–4 | import { VoiceDownloadStatus } from './components/VoiceDownloadStatus'; |
| import:80167a8eefc3483ab64a6ccea31e3d66 | import | ./index.css | src/main.tsx | 5–5 | import './index.css'; |
| file:src/services/accountStorage.ts | file | src/services/accountStorage.ts | src/services/accountStorage.ts | 1–23 |  |
| import:5f0d59bc3ecfeb98fc1bb7b798493c98 | import | ./historyLifecycle | src/services/accountStorage.ts | 1–1 | import { isNatallyHistoryErasing } from './historyLifecycle'; |
| function:e2352f2127bec08ad4479d690ab5eb82 | function | accountStorageKey | src/services/accountStorage.ts | 4–6 | (base: string, uid: string &#124; null &#124; undefined): string &#124; null |
| function:6ed5c937ce2d52dd6d922741d6dc8c68 | function | loadAccountValue | src/services/accountStorage.ts | 8–15 | (base: string, uid: string &#124; null &#124; undefined, fallback: T): T |
| function:88a68135fe1a01675b0011007327ccc7 | function | saveAccountValue | src/services/accountStorage.ts | 17–22 | (base: string, uid: string &#124; null &#124; undefined, value: T): void |
| file:src/services/astrowisdom.ts | file | src/services/astrowisdom.ts | src/services/astrowisdom.ts | 1–269 |  |
| import:95b4385e4ed7f16ec5a96803e5c972a4 | import | ./ephemeris | src/services/astrowisdom.ts | 2–2 | import { NatalChartResult } from './ephemeris'; |
| interface:fbb87f07ec84bb5d32db43c4cd33460c | interface | NumerologyAndThemes | src/services/astrowisdom.ts | 4–25 |  |
| property:c73278a7337eb5058bbdebb3d3bb9b48 | property | NumerologyAndThemes::lifePathNumber | src/services/astrowisdom.ts | 5–5 | number lifePathNumber |
| property:1c6f3c0c85d0390b8d83c4d56a831c38 | property | NumerologyAndThemes::lifePathMeaning | src/services/astrowisdom.ts | 6–6 | string lifePathMeaning |
| property:6e2b89283f271eb031b2cca20a4e8e1f | property | NumerologyAndThemes::sunSign | src/services/astrowisdom.ts | 7–7 | string sunSign |
| property:c7636743d7384659f8d2f1f9e84ddfc6 | property | NumerologyAndThemes::sunSignGlyph | src/services/astrowisdom.ts | 8–8 | string sunSignGlyph |
| property:ac1cbb2e42d3d8c10caa5ea093cea8e9 | property | NumerologyAndThemes::sunSignElement | src/services/astrowisdom.ts | 9–9 | string sunSignElement |
| property:07034af43c87f6d1f0466fb2f684f29c | property | NumerologyAndThemes::moonSign | src/services/astrowisdom.ts | 10–10 | string moonSign |
| property:1d0f67a3a4d4acc38e658212582caafb | property | NumerologyAndThemes::moonSignGlyph | src/services/astrowisdom.ts | 11–11 | string moonSignGlyph |
| property:0036532f007a4d26da381c54664ae73b | property | NumerologyAndThemes::moonSignElement | src/services/astrowisdom.ts | 12–12 | string moonSignElement |
| property:66d707518dc2a8fae7b0c372738bed52 | property | NumerologyAndThemes::risingSign | src/services/astrowisdom.ts | 13–13 | string risingSign |
| property:6aef182608b571242ccbb40705cb6ea6 | property | NumerologyAndThemes::risingSignGlyph | src/services/astrowisdom.ts | 14–14 | string risingSignGlyph |
| property:f532813e95639bf4ecb99db98d589275 | property | NumerologyAndThemes::risingSignElement | src/services/astrowisdom.ts | 15–15 | string risingSignElement |
| property:e4579588a90df51f7113207bc1a8bb1e | property | NumerologyAndThemes::corePolarity | src/services/astrowisdom.ts | 16–16 | string corePolarity |
| property:f4df12828b193f10ccf382356a6640dd | property | NumerologyAndThemes::majorThemes | src/services/astrowisdom.ts | 17–17 | string[] majorThemes |
| property:617fdd707e25f0c3fe94cf014b0eca68 | property | NumerologyAndThemes::astrologicalEventsOfNote | src/services/astrowisdom.ts | 18–23 | Array<{     title: string;     timing: string;     category: 'Natal Configuration' &#124; 'Impending Transit' &#124; 'Cyclical Phase';     description: string;   }> astrologicalEventsOfNote |
| property:965951c4010668ad5daea5640e4785fd | property | NumerologyAndThemes::traditionalBriefInterpretation | src/services/astrowisdom.ts | 24–24 | string traditionalBriefInterpretation |
| constant:f5ff0282e3c69cad13e63932ba7be8d2 | constant | LIFE_PATH_DESCRIPTIONS | src/services/astrowisdom.ts | 27–40 | = {   1: 'The Sovereign Pioneer — Driven by originative will, independence, self-direction, and trail... |
| function:70bef52db404944fd01bd48f3d54d844 | function | calculateLifePathNumber | src/services/astrowisdom.ts | 42–68 | (birthDate: string): { number: number; meaning: string } |
| function:692dfacb474888b06ecb4b3c0729ec15 | function | calculateLifePathNumber::reduceDigits | src/services/astrowisdom.ts | 47–53 | (numStr: string, isMasterCheck = true): number |
| constant:234c12234eda4dca27a804f763e033e0 | constant | SIGN_ELEMENTS | src/services/astrowisdom.ts | 70–83 | = {   Aries: 'Fire',   Leo: 'Fire',   Sagittarius: 'Fire',   Taurus: 'Earth',   Virgo: 'Earth', ... |
| constant:0c973e0506bb0816cc358ddad9914ab4 | constant | SIGN_MODALITIES | src/services/astrowisdom.ts | 85–98 | = {   Aries: 'Cardinal',   Cancer: 'Cardinal',   Libra: 'Cardinal',   Capricorn: 'Cardinal',   Ta... |
| function:2c7991475366c558620fb3ac9af434f6 | function | computeThemesAndWisdom | src/services/astrowisdom.ts | 100–268 | (chart: NatalChartResult): NumerologyAndThemes |
| function:7e3ca7c5a20171766fb393dd606dc4b4 | function | computeThemesAndWisdom::hasAspectBetween | src/services/astrowisdom.ts | 133–139 | (p1: string, p2: string, type: 'Opposition' &#124; 'Square' &#124; 'Trine' &#124; 'Sextile') |
| file:src/services/atelierMemories.ts | file | src/services/atelierMemories.ts | src/services/atelierMemories.ts | 1–79 |  |
| import:faf7cf72e59705a5aca4921f0541ad71 | import | ./historyLifecycle | src/services/atelierMemories.ts | 1–1 | import { isNatallyHistoryErasing } from './historyLifecycle'; |
| constant:d37533245c09fdd5d4b8115443db4e5d | constant | ATELIER_ITEMS | src/services/atelierMemories.ts | 2–2 | = ['hourglass', 'armillary', 'crystal', 'vial', 'emerald', 'rose'] as const |
| type_alias:a45fa5a820b666f420a3d2fc655afd19 | type_alias | TrinketId | src/services/atelierMemories.ts | 3–3 |  |
| property:35d219a7b1069da7456ba138dc01c636 | property | AtelierPosition::y | src/services/atelierMemories.ts | 4–4 | y:number |
| property:98aea8acef97c27b0cb3d65565a5fd09 | property | AtelierPosition::x | src/services/atelierMemories.ts | 4–4 | x:number |
| type_alias:15233ec0043e7eb87b4ab5d749080a60 | type_alias | AtelierPosition | src/services/atelierMemories.ts | 4–4 |  |
| property:2bbccd1de939318ee41552870cb30008 | property | AtelierMemory::persistenceAvailable | src/services/atelierMemories.ts | 5–5 | persistenceAvailable: boolean |
| property:35e6a4ef02b28b21d3abcf43b83d794d | property | AtelierMemory::placements | src/services/atelierMemories.ts | 5–5 | placements:Partial<Record<TrinketId,AtelierPosition>> |
| property:55627787a73e9d8600bcfdfd3871364a | property | AtelierMemory::taped | src/services/atelierMemories.ts | 5–5 | taped: TrinketId[] |
| property:b3d50c4803dd956c81521950b3917688 | property | AtelierMemory::broken | src/services/atelierMemories.ts | 5–5 | broken: TrinketId[] |
| type_alias:c1c05c15392ca21d3932e5dd76c823fc | type_alias | AtelierMemory | src/services/atelierMemories.ts | 5–5 |  |
| constant:1edff07b9aa1a9a2d6e198f62665f110 | constant | sessions | src/services/atelierMemories.ts | 6–6 | = new Map<string, AtelierMemory>() |
| constant:acf5ecc53f4e500cb40c0fc87df509ba | constant | rehearsals | src/services/atelierMemories.ts | 7–7 | = new Set<string>() |
| function:8aac5755f84a403169554fd13452cf41 | function | realIdentity | src/services/atelierMemories.ts | 8–8 | (uid:string&#124;null) |
| function:ae7c27c019e7b49f6956be6e94efcd75 | function | identity | src/services/atelierMemories.ts | 9–9 | (uid:string&#124;null) |
| function:618a77e257c84072a224c5c21022ba64 | function | isAtelierRehearsal | src/services/atelierMemories.ts | 10–10 | (uid:string&#124;null) |
| function:d3243948ff1c9c022a6fb809373066a8 | function | setAtelierRehearsal | src/services/atelierMemories.ts | 11–14 | (uid:string&#124;null,enabled:boolean) |
| function:f2ac617d40567cc26c3260ea6489e54e | function | resetAtelierRehearsal | src/services/atelierMemories.ts | 15–18 | (uid:string&#124;null) |
| function:d6034f439a8980edeb85c851aff0cc0b | function | nextRehearsalAppointment | src/services/atelierMemories.ts | 19–24 | (uid:string&#124;null) |
| function:e44029626cc208a3b54d09cfe91b205c | function | storageKey | src/services/atelierMemories.ts | 25–25 | (uid: string) |
| function:f63ee2d934e298701b7f9d91d7eefce6 | function | valid | src/services/atelierMemories.ts | 26–26 | (value: unknown): value is TrinketId |
| function:9602b3b7fb930733ca3ea495e6c8872f | function | getAtelierMemory | src/services/atelierMemories.ts | 27–49 | (uid: string &#124; null): AtelierMemory |
| function:19c4e6cdd6870326104ab7bc53ce2ac9 | function | validatedPositions | src/services/atelierMemories.ts | 50–53 | (value:unknown): AtelierMemory['placements'] |
| function:990f87e53f8db9bde91e22725929b304 | function | save | src/services/atelierMemories.ts | 54–54 | (uid:string,state:AtelierMemory) |
| function:f168dbc82190b9196f608b6a5aed7c24 | function | placeAtelierObjects | src/services/atelierMemories.ts | 55–58 | (uid:string&#124;null,placements:AtelierMemory['placements']): AtelierMemory |
| function:5000f1856ab050f1d1be7b1cbbe51f47 | function | publish | src/services/atelierMemories.ts | 59–59 | (uid:string&#124;null) |
| function:3cf58c59f472f09310702d3c7836dff7 | function | breakAtelierObject | src/services/atelierMemories.ts | 60–66 | (uid:string&#124;null,item:TrinketId): AtelierMemory |
| function:ef0909d071f0f85856fda6aac4d4ac4b | function | eraseAtelierHistory | src/services/atelierMemories.ts | 67–73 | (uid:string&#124;null): AtelierMemory |
| function:d5ba9472931aaeea860a3eb5fe3abf06 | function | buildAtelierMemoryPrompt | src/services/atelierMemories.ts | 74–78 | (uid:string): string |
| file:src/services/atelierMotion.ts | file | src/services/atelierMotion.ts | src/services/atelierMotion.ts | 1–5 |  |
| function:2655979c8bff16505daa7e41b2e407cb | function | canAnimateAtelier | src/services/atelierMotion.ts | 2–4 | (input: { paused: boolean; reducedMotion: boolean; documentVisible: boolean; sceneVisible: boolean }): boolean |
| file:src/services/atelierSound.ts | file | src/services/atelierSound.ts | src/services/atelierSound.ts | 1–80 |  |
| import:381191cf31374eb75dfbf906ddd0a09b | import | ./voiceService | src/services/atelierSound.ts | 1–1 | import { loadVoiceSettings } from './voiceService'; |
| import:90896713b39fed544eea3ba333e9adb7 | import | ./atelierMemories | src/services/atelierSound.ts | 2–2 | import type { TrinketId } from './atelierMemories'; |
| variable:299be9cb83c777c91e9ced66aa224d86 | variable | effectContext | src/services/atelierSound.ts | 3–3 | = null |
| variable:619e1510d76dd86f75c0bbb2344a7d12 | variable | crunchBuffer | src/services/atelierSound.ts | 4–4 | = null |
| variable:f16352a064bbd0830e7f666d6b98a4a3 | variable | currentCrunch | src/services/atelierSound.ts | 5–5 | = null |
| function:60f03467359b4a3b2c991ca1c470501a | function | loadCrunch | src/services/atelierSound.ts | 6–12 | (context:AudioContext): Promise<AudioBuffer> |
| function:db6dbf87b357c4c55c4da680024e54af | function | allowed | src/services/atelierSound.ts | 13–16 | (): boolean |
| function:a44e0971ef7036fa1206f498cf30fef8 | function | unlockAtelierSound | src/services/atelierSound.ts | 18–21 | (): void |
| type_alias:d85f7b5b5fef5c65bd504b781cf49608 | type_alias | FoleyName | src/services/atelierSound.ts | 22–22 |  |
| constant:1e4c4adc7aff61f40d9b4caa187556ef | constant | foleyBuffers | src/services/atelierSound.ts | 23–23 | = new Map<FoleyName,Promise<AudioBuffer>>() |
| variable:d592f7545f6e52e89d022252177a2419 | variable | currentWobble | src/services/atelierSound.ts | 24–24 | = null |
| variable:c9ecedecb8b8b032aa07ff8d61f35c1a | variable | wobbleUntil | src/services/atelierSound.ts | 25–25 | = 0 |
| variable:52035df94db53cd5b406641939189401 | variable | breakUntil | src/services/atelierSound.ts | 26–26 | = 0 |
| function:3320a2409a83247a4adc284057c52070 | function | loadFoley | src/services/atelierSound.ts | 27–33 | (context:AudioContext,name:FoleyName): Promise<AudioBuffer> |
| function:12cf11070beec09ace6e6f9c2bad930d | function | playFoley | src/services/atelierSound.ts | 34–50 | (name:FoleyName,gain:number,delay=0,rate=1): void |
| function:46930bfb2157222848b5789b6031590c | function | playAtelierBreak | src/services/atelierSound.ts | 52–56 | (item:TrinketId): void |
| function:f88196e82dcddb13f5f79ffdce0ad46b | function | playAtelierWobble | src/services/atelierSound.ts | 58–63 | (item:TrinketId,energy=1): void |
| function:1c0145ae73319af48d0c84f47fd6e07d | function | playAtelierCrunch | src/services/atelierSound.ts | 64–79 | (): void |
| file:src/services/atelierTheme.ts | file | src/services/atelierTheme.ts | src/services/atelierTheme.ts | 1–27 |  |
| import:c1e0336dff15fb4a1a8b922ced05bb2e | import | react | src/services/atelierTheme.ts | 1–1 | import { useEffect, useState } from 'react'; |
| constant:32a01d556263946b8c2626376d100265 | constant | ATELIER_THEMES | src/services/atelierTheme.ts | 4–7 | = [   { id: 'candlelit', label: 'Candlelit atelier', seasonal: false },   { id: 'horrorween', label:... |
| type_alias:0741c81b426b2791434fb493b14fa6fb | type_alias | AtelierTheme | src/services/atelierTheme.ts | 8–8 |  |
| function:93e11b3a0195eebbb319954a31f16639 | function | key | src/services/atelierTheme.ts | 9–9 | (uid:string&#124;null) |
| constant:b0f4a15462d7a3afb3db3fc4698d531d | constant | selected | src/services/atelierTheme.ts | 10–10 | = new Map<string,AtelierTheme>() |
| function:62007d08f93f8e88cc930a2286b97517 | function | getAtelierTheme | src/services/atelierTheme.ts | 11–16 | (uid:string&#124;null): AtelierTheme |
| function:7906853c952f316f7e37ff04a22b716d | function | setAtelierTheme | src/services/atelierTheme.ts | 17–21 | (uid:string&#124;null,theme:AtelierTheme): void |
| function:673497463b93cce4047d86921f541547 | function | useAtelierTheme | src/services/atelierTheme.ts | 22–26 | (uid:string&#124;null): AtelierTheme |
| function:670f620accee3d4a20bb6d767ee4e11c | function | useAtelierTheme::update | src/services/atelierTheme.ts | 24–24 | (event:Event) |
| file:src/services/birthDate.ts | file | src/services/birthDate.ts | src/services/birthDate.ts | 1–57 |  |
| interface:51fecbe7e42b75ee8f6207d1d76ba4a8 | interface | BirthDateParts | src/services/birthDate.ts | 1–5 |  |
| property:6cb0e3378441f1dc9854a3220c8509e8 | property | BirthDateParts::day | src/services/birthDate.ts | 2–2 | string day |
| property:c9a8545b7765132a77ed53ab50d89065 | property | BirthDateParts::month | src/services/birthDate.ts | 3–3 | string month |
| property:4aa1c2cb11265ce7a32bd6941d75c65f | property | BirthDateParts::year | src/services/birthDate.ts | 4–4 | string year |
| function:5b062ff0a38cd5a0f80080c2da940df9 | function | getBirthDateParts | src/services/birthDate.ts | 7–10 | (value: string): BirthDateParts |
| function:072110c5648c3ffb09abf5cd992a69bf | function | getBirthMonthDays | src/services/birthDate.ts | 12–15 | (year: number, month: number): number |
| function:329e8c907bb493677fd6a4a0a107b3e0 | function | formatBirthDateInput | src/services/birthDate.ts | 17–31 | (value: string, previousValue: string): string |
| function:9ba7f8e6f60d05d06aaab8a2cc34b5b2 | function | validateBirthDate | src/services/birthDate.ts | 33–56 | (value: string, maxDate: string) |
| function:c13b0257adab689dc6a3349eb6e48955 | function | validateBirthDate::invalid | src/services/birthDate.ts | 35–35 | (message: string) |
| file:src/services/calculationTools.ts | file | src/services/calculationTools.ts | src/services/calculationTools.ts | 1–59 |  |
| import:9141daa30e91eb8abd902f1fe2796019 | import | ./ephemeris | src/services/calculationTools.ts | 1–1 | import { calculateNatalChart, type NatalChartResult } from './ephemeris'; |
| import:6852c67353f86bd3297406e26d9da4ae | import | ./gazetteer | src/services/calculationTools.ts | 2–2 | import { loadGazetteer, tzOffsetHours } from './gazetteer'; |
| import:82bc26cba868b6dee4a8e217fa6d4691 | import | ./transits | src/services/calculationTools.ts | 3–3 | import { buildCurrentSkyContext, resolveObservationMoment } from './transits'; |
| import:4fe04ce21c0e8c8096cb29b80e91bcda | import | ./natallyChat | src/services/calculationTools.ts | 4–4 | import { buildStructuredNatalContext, buildSynastryContext } from './natallyChat'; |
| function:497b9d8225e2bda53d762627fbe284b2 | function | createCalculationSession | src/services/calculationTools.ts | 6–58 | (primary: NatalChartResult, partner?: NatalChartResult &#124; null) |
| function:d5305687e8c0f8de02dede50630e0785 | function | createCalculationSession::chart | src/services/calculationTools.ts | 9–13 | (id: unknown) |
| file:src/services/chartFocusVisuals.ts | file | src/services/chartFocusVisuals.ts | src/services/chartFocusVisuals.ts | 1–9 |  |
| constant:4bf342ed2cb27840d74f308a0156e5fe | constant | CHART_FOCUS | src/services/chartFocusVisuals.ts | 2–2 | = { dim: 0.19, steadyHalo: 0.64, peakHalo: 0.94, pulseMs: 720, pulses: 2 } as const |
| function:8f00b39c31b3e704e96a34119085c9e7 | function | chartHaloOpacity | src/services/chartFocusVisuals.ts | 3–8 | (elapsedMs: number, reducedMotion: boolean): number |
| file:src/services/chartTargets.ts | file | src/services/chartTargets.ts | src/services/chartTargets.ts | 1–75 |  |
| import:463c65ea3716e3805dbc41346842ef63 | import | ./ephemeris | src/services/chartTargets.ts | 1–1 | import { ZODIAC_SIGNS, type NatalChartResult } from './ephemeris'; |
| function:cca377bea1909397a36163d8d24adff0 | function | chartTargets | src/services/chartTargets.ts | 3–11 | (chart: NatalChartResult): string[] |
| function:9d987848df91f5ec4deae10f0ccf8585 | function | chartFocusKey | src/services/chartTargets.ts | 12–14 | (chart: NatalChartResult): string |
| function:25a3522fe40088e75a85155f86431f8f | function | chartFocusKeyMatches | src/services/chartTargets.ts | 16–31 | (key: unknown, chart: NatalChartResult): boolean |
| function:85e1a3caecbcb473064626258801741b | function | chartFocusKeyMatches::close | src/services/chartTargets.ts | 22–22 | (left: unknown, right: unknown) |
| function:565a5f99920c9163224986e591b94c53 | function | normalize | src/services/chartTargets.ts | 32–32 | (raw: string) |
| function:45039c178a1498e28acbe0e3464e6d31 | function | chartTargetLabel | src/services/chartTargets.ts | 33–33 | (target: string): string |
| function:5389484406df6565387e668cecf86094 | function | isDatedSkyTarget | src/services/chartTargets.ts | 34–34 | (target: unknown): target is string |
| function:9714f84496631188d14add2f755ea40d | function | resolveChartTarget | src/services/chartTargets.ts | 35–59 | (raw: string, chart: NatalChartResult): string &#124; null |
| function:9c335c22218a2ff15bfc7c2546e338f9 | function | resolveChartTarget::stripAngle | src/services/chartTargets.ts | 46–46 | (text: string) |
| function:e901b096107f978bcd2c58473e0b6fdc | function | chartReferenceNames | src/services/chartTargets.ts | 62–74 | (chart: NatalChartResult): string[] |
| file:src/services/chatViewport.ts | file | src/services/chatViewport.ts | src/services/chatViewport.ts | 1–33 |  |
| interface:353e2c709bebe8773b5644858b4414d2 | interface | ViewportBounds | src/services/chatViewport.ts | 1–7 |  |
| property:cb2a23cb9a8bfd2a16be512204f8e14e | property | ViewportBounds::width | src/services/chatViewport.ts | 2–2 | number width |
| property:36781d815b11ab912ec28883c19d5227 | property | ViewportBounds::height | src/services/chatViewport.ts | 3–3 | number height |
| property:20afe9187833940071497ace8178aa83 | property | ViewportBounds::left | src/services/chatViewport.ts | 4–4 | number left |
| property:9c91d3f972829a5f5d7417858cd31253 | property | ViewportBounds::top | src/services/chatViewport.ts | 5–5 | number top |
| property:3ac79ef237bc2568241d73008b9941b5 | property | ViewportBounds::layoutWidth | src/services/chatViewport.ts | 6–6 | number layoutWidth |
| function:de013d4624dc385306c225b99ab31e10 | function | getChatViewportLayout | src/services/chatViewport.ts | 9–32 | (   bounds: ViewportBounds,   position: { x: number; y: number },   size: { width: number; height: number },   expanded: boolean, ) |
| file:src/services/comprehensiveReading.ts | file | src/services/comprehensiveReading.ts | src/services/comprehensiveReading.ts | 1–282 |  |
| import:af0b7d37ceb28b7fb1f02a64872f90d1 | import | ./ephemeris | src/services/comprehensiveReading.ts | 1–1 | import { NatalChartResult } from './ephemeris'; |
| import:708407cc83ac5a03d536262117033049 | import | ./astrowisdom | src/services/comprehensiveReading.ts | 2–2 | import { computeThemesAndWisdom } from './astrowisdom'; |
| interface:b499dc72e9cf2f96d5e5fb7beb02e696 | interface | ComprehensiveReadingSection | src/services/comprehensiveReading.ts | 4–8 |  |
| property:05838eca863fd3075bcfffc27d274dac | property | ComprehensiveReadingSection::title | src/services/comprehensiveReading.ts | 5–5 | string title |
| property:f4f23c866e68a34d58bef3c1f3ca99fd | property | ComprehensiveReadingSection::subtitle | src/services/comprehensiveReading.ts | 6–6 | string subtitle |
| property:a7ba79630d0035d2d1b17581b5d28c67 | property | ComprehensiveReadingSection::content | src/services/comprehensiveReading.ts | 7–7 | string content |
| interface:ce5e3d88d9cfc56bab031c7c86d4fdbd | interface | ComprehensiveReadingResult | src/services/comprehensiveReading.ts | 10–17 |  |
| property:b89102f04f9ba9e7ae2b0b74c8646cb8 | property | ComprehensiveReadingResult::title | src/services/comprehensiveReading.ts | 11–11 | string title |
| property:f1dd33514902ecd3ab370ba32300c393 | property | ComprehensiveReadingResult::nativeName | src/services/comprehensiveReading.ts | 12–12 | string nativeName |
| property:9dd46c04971c2a8551719dcba07f9a36 | property | ComprehensiveReadingResult::observationContext | src/services/comprehensiveReading.ts | 13–13 | string observationContext |
| property:5e9773b6ce31cf44d85f11384fbba02c | property | ComprehensiveReadingResult::sections | src/services/comprehensiveReading.ts | 14–14 | ComprehensiveReadingSection[] sections |
| property:ee3e75133f9bbe50b0682f4f9583a6af | property | ComprehensiveReadingResult::natallyPersonalNote | src/services/comprehensiveReading.ts | 15–15 | string natallyPersonalNote |
| property:074d43a935bc2e54ce7e6f54c209fdc1 | property | ComprehensiveReadingResult::fullMarkdown | src/services/comprehensiveReading.ts | 16–16 | string fullMarkdown |
| constant:666fa6b80e9e12f0bf6eeab41582109b | constant | SIGN_DESCRIPTIONS | src/services/comprehensiveReading.ts | 19–92 | = {   Aries: {     essence: 'The Cardinal Fire initiator; originative vitality, fearless pioneer ins... |
| constant:ff287a3bff60b9a8d136960792d33e88 | constant | PLANET_ARCHETYPAL_ROLES | src/services/comprehensiveReading.ts | 94–107 | = {   Sun: 'The Sovereign Will & Conscious Spark of Divinity',   Moon: 'The Instinctual Well, Emotio... |
| function:382a10921cf7b79533bdccd225446768 | function | generateComprehensiveNatalReading | src/services/comprehensiveReading.ts | 109–281 | (chart: NatalChartResult): ComprehensiveReadingResult |
| file:src/services/downloadAccess.ts | file | src/services/downloadAccess.ts | src/services/downloadAccess.ts | 1–35 |  |
| import:3436a415c9d0d98e2fdb8dcf2620b02f | import | ./firebase | src/services/downloadAccess.ts | 1–1 | import { auth } from './firebase'; |
| property:0459dc896151c384b862c2c98b062313 | property | DownloadRequest::format | src/services/downloadAccess.ts | 3–3 | format: 'wav'&#124;'pdf'&#124;'markdown'&#124;'png'&#124;'jpg'&#124;'transcript' |
| property:741b45fd3425f4bb4dfde87439e164b3 | property | DownloadRequest::resourceId | src/services/downloadAccess.ts | 3–3 | resourceId: string |
| type_alias:6df64ed7109ccd300bfeb773b18172c3 | type_alias | DownloadRequest | src/services/downloadAccess.ts | 3–3 |  |
| type_alias:e621d6234020a723da28a4a32d37c325 | type_alias | DownloadAccess | src/services/downloadAccess.ts | 4–6 |  |
| function:54d09af41461d32f3fd395af76f61bcd | function | checkDownloadAccess | src/services/downloadAccess.ts | 12–34 | (request:DownloadRequest): Promise<DownloadAccess> |
| file:src/services/ephemeris.ts | file | src/services/ephemeris.ts | src/services/ephemeris.ts | 1–487 |  |
| import:f42eb42baab7942d9cc18222960f678a | import | ./readingStyle | src/services/ephemeris.ts | 1–1 | import type { ReadingStyle } from './readingStyle'; |
| import:f663122510935135face1fb54b25eae5 | import | ../vendor/swisseph/src/swisseph.js | src/services/ephemeris.ts | 3–3 | import SwissEph from '../vendor/swisseph/src/swisseph.js'; |
| interface:93902ba2448c916808cb6028b367adcd | interface | ZodiacSignInfo | src/services/ephemeris.ts | 5–13 |  |
| property:c200c20491912cdca6cfb2eed93723df | property | ZodiacSignInfo::name | src/services/ephemeris.ts | 6–6 | string name |
| property:2642acbf3ba3b8333753c6c858f14837 | property | ZodiacSignInfo::short | src/services/ephemeris.ts | 7–7 | string short |
| property:d390169530fc465893c251a5dab9b6ab | property | ZodiacSignInfo::glyph | src/services/ephemeris.ts | 8–8 | string glyph |
| property:ddc3482d897364f4b726cedd548b7f01 | property | ZodiacSignInfo::lon | src/services/ephemeris.ts | 9–9 | number lon |
| property:3e60ab09ede14d13ed40129b0e3c205e | property | ZodiacSignInfo::desc | src/services/ephemeris.ts | 10–10 | string desc |
| property:d2aca95f4c74c97072147c10e0172f7a | property | ZodiacSignInfo::element | src/services/ephemeris.ts | 11–11 | 'Fire' &#124; 'Earth' &#124; 'Air' &#124; 'Water' element |
| property:15bbe0b5f394a883f1569f214fec7119 | property | ZodiacSignInfo::modality | src/services/ephemeris.ts | 12–12 | 'Cardinal' &#124; 'Fixed' &#124; 'Mutable' modality |
| constant:3aab62c4809b35fe57c057cd9adaad7b | constant | ZODIAC_SIGNS | src/services/ephemeris.ts | 15–28 | = [   { name: 'Aries', short: 'Ari', glyph: '♈', lon: 0, element: 'Fire', modality: 'Cardinal', desc:... |
| interface:2cb3cd60e6e8c002763061cd5154fc5f | interface | HouseCuspData | src/services/ephemeris.ts | 30–40 |  |
| property:e6a8201b039c1d746d67d6007535d3e8 | property | HouseCuspData::num | src/services/ephemeris.ts | 31–31 | number num |
| property:32053430879aea6283717d36cd82bc5f | property | HouseCuspData::lon | src/services/ephemeris.ts | 32–32 | number lon |
| property:18f8b1e9765d4d58ff4ee970aa1e8810 | property | HouseCuspData::label | src/services/ephemeris.ts | 33–33 | string label |
| property:c3883840a918c2e16f9fd7a72a499b38 | property | HouseCuspData::isCardo | src/services/ephemeris.ts | 34–34 | boolean isCardo |
| property:33092c628cb09287204aa1744a351018 | property | HouseCuspData::title | src/services/ephemeris.ts | 35–35 | string title |
| property:b4efd1191bc390e734294efbf08f0595 | property | HouseCuspData::desc | src/services/ephemeris.ts | 36–36 | string desc |
| property:f41dba562de2cf74b5cd6c093541b51d | property | HouseCuspData::signName | src/services/ephemeris.ts | 37–37 | string signName |
| property:51ef0fdf12bb17c2987fa156b986eedc | property | HouseCuspData::signGlyph | src/services/ephemeris.ts | 38–38 | string signGlyph |
| property:46036513822d770984f7246850d6adee | property | HouseCuspData::formattedDeg | src/services/ephemeris.ts | 39–39 | string formattedDeg |
| interface:64ab6bce73c228d7c544ebbc463bd165 | interface | NatalBodyData | src/services/ephemeris.ts | 42–63 |  |
| property:c3b42dedc1d18b0d0372b16a3418f14e | property | NatalBodyData::id | src/services/ephemeris.ts | 43–43 | string id |
| property:fbecb68da6632b6fed278177edecef5c | property | NatalBodyData::name | src/services/ephemeris.ts | 44–44 | string name |
| property:a9c9ede6cbfb9bdcb2321f07c27abb0c | property | NatalBodyData::glyph | src/services/ephemeris.ts | 45–45 | string glyph |
| property:973b44f9e60494574bc0fe2b4f675dcf | property | NatalBodyData::lon | src/services/ephemeris.ts | 46–46 | number lon |
| property:08139621b88c3e45df769be7d405da4a | property | NatalBodyData::lat | src/services/ephemeris.ts | 47–47 | number lat |
| property:1f37a44c4e75e4d7b360d9bdd8b9f6a6 | property | NatalBodyData::speed | src/services/ephemeris.ts | 48–48 | number speed |
| property:c930ada4a04b1fd082aa5ccdefc7ec3b | property | NatalBodyData::isRetrograde | src/services/ephemeris.ts | 49–49 | boolean isRetrograde |
| property:a44a1ad3e2f75c9d7042cb26157a8add | property | NatalBodyData::signName | src/services/ephemeris.ts | 50–50 | string signName |
| property:7f9d3f46c4e460a3ec27f8f5855d3826 | property | NatalBodyData::signShort | src/services/ephemeris.ts | 51–51 | string signShort |
| property:f57ec88ae66335e0f2372ccc90482fb1 | property | NatalBodyData::signGlyph | src/services/ephemeris.ts | 52–52 | string signGlyph |
| property:d595cef405c54fb8060ff29e3cee1413 | property | NatalBodyData::degInSign | src/services/ephemeris.ts | 53–53 | number degInSign |
| property:7a7882b1b54edbc16bf98351cd6ce947 | property | NatalBodyData::minInSign | src/services/ephemeris.ts | 54–54 | number minInSign |
| property:78645a57902b6c8776572fe642a9fe12 | property | NatalBodyData::secInSign | src/services/ephemeris.ts | 55–55 | number secInSign |
| property:df8494bb37e726d3edd33ad174b4f2b1 | property | NatalBodyData::degText | src/services/ephemeris.ts | 56–56 | string degText |
| property:874aba70f7c711538096b9e910687d3d | property | NatalBodyData::fullDegText | src/services/ephemeris.ts | 57–57 | string fullDegText |
| property:efcc93ff7cd83e5c77e2accc7b319367 | property | NatalBodyData::house | src/services/ephemeris.ts | 58–58 | number house |
| property:243448d458e98daa4f7d26e3801a4875 | property | NatalBodyData::color | src/services/ephemeris.ts | 59–59 | string color |
| property:267f3dff560561053d32255cd66e4224 | property | NatalBodyData::tier | src/services/ephemeris.ts | 60–60 | number tier |
| property:64cc0068b5ee3415180a2e87d2db8f1c | property | NatalBodyData::clusterAngle | src/services/ephemeris.ts | 61–61 | number clusterAngle |
| property:00eeddb878b68e1d1bf24ab4c383b391 | property | NatalBodyData::detail | src/services/ephemeris.ts | 62–62 | string detail |
| interface:079eafd9d360cfbf91010d260f0cbcc1 | interface | AspectChordData | src/services/ephemeris.ts | 65–78 |  |
| property:29a315c10862b69de83e784f04569663 | property | AspectChordData::from | src/services/ephemeris.ts | 66–66 | string from |
| property:749fa9097d61454030884bddc1eb7afd | property | AspectChordData::to | src/services/ephemeris.ts | 67–67 | string to |
| property:9afa16deed265fb44ceba4082ec67c6d | property | AspectChordData::fromGlyph | src/services/ephemeris.ts | 68–68 | string fromGlyph |
| property:315d143729bf1ffcf6fb36374ef68b96 | property | AspectChordData::toGlyph | src/services/ephemeris.ts | 69–69 | string toGlyph |
| property:971aea325f35eeed4bf6cbf7c77d5349 | property | AspectChordData::type | src/services/ephemeris.ts | 70–70 | 'Opposition' &#124; 'Square' &#124; 'Trine' &#124; 'Sextile' &#124; 'Conjunction' type |
| property:b72b6bb233d3d79ff2215d49bfc8cf83 | property | AspectChordData::symbol | src/services/ephemeris.ts | 71–71 | string symbol |
| property:25ef158cd3adbd1394fbd48e868a731a | property | AspectChordData::angle | src/services/ephemeris.ts | 72–72 | number angle |
| property:5bfe1295ba7f44432aa3d79218b8a1a5 | property | AspectChordData::orb | src/services/ephemeris.ts | 73–73 | number orb |
| property:1e69e38ebfb03f36e2b20e37eeb76014 | property | AspectChordData::color | src/services/ephemeris.ts | 74–74 | number color |
| property:f47020cfc43cad9e3693826207e90e7f | property | AspectChordData::colorHex | src/services/ephemeris.ts | 75–75 | string colorHex |
| property:e125e1baef63f540ffee02d78af92b1f | property | AspectChordData::name | src/services/ephemeris.ts | 76–76 | string name |
| property:ad724ca36e5483edfc9c11dbf697c178 | property | AspectChordData::detail | src/services/ephemeris.ts | 77–77 | string detail |
| interface:aa5f1d42a7fa3132c6a2f4cf6a060383 | interface | NatalChartInput | src/services/ephemeris.ts | 80–96 |  |
| property:fc5809e1fc19ed977a4fe7cc39572095 | property | NatalChartInput::readingStyle | src/services/ephemeris.ts | 81–81 | ReadingStyle readingStyle |
| property:24452e4ba148614bb65e186181e08e30 | property | NatalChartInput::name | src/services/ephemeris.ts | 82–82 | string name |
| property:f9300bf806aa121ea476c53365d35e11 | property | NatalChartInput::birthDate | src/services/ephemeris.ts | 83–83 | string birthDate |
| property:cfa821e802ac7bede8a7a94727dec1ad | property | NatalChartInput::birthTime | src/services/ephemeris.ts | 84–84 | string birthTime |
| property:53fb62dd794f4880ee82f8e60d2a1cfb | property | NatalChartInput::placeName | src/services/ephemeris.ts | 85–85 | string placeName |
| property:50fff7a1429556e984ec9362d4944ea3 | property | NatalChartInput::latitude | src/services/ephemeris.ts | 86–86 | number latitude |
| property:7c458d6ef2f9596f9aab7eaa7b7a0de9 | property | NatalChartInput::longitude | src/services/ephemeris.ts | 87–87 | number longitude |
| property:77bab992836050d9549e4f575e68a4f7 | property | NatalChartInput::timezoneOffset | src/services/ephemeris.ts | 88–88 | number timezoneOffset |
| property:beb198cd6c38d521c6282ba2936fed49 | property | NatalChartInput::houseSystem | src/services/ephemeris.ts | 89–89 | 'P' &#124; 'W' &#124; 'K' &#124; 'E' &#124; 'R' houseSystem |
| property:2752aca19faead0b3b66dce9454e4a78 | property | NatalChartInput::currentLocationName | src/services/ephemeris.ts | 90–90 | string currentLocationName |
| property:ff92466583e38a3acd03c2419901c474 | property | NatalChartInput::currentLatitude | src/services/ephemeris.ts | 91–91 | number currentLatitude |
| property:08404b9e9cae9c349f2186903ab81fa5 | property | NatalChartInput::currentLongitude | src/services/ephemeris.ts | 92–92 | number currentLongitude |
| property:c9fdaf1666ab9092a6b815e5371defe0 | property | NatalChartInput::currentTimezoneOffset | src/services/ephemeris.ts | 93–93 | number currentTimezoneOffset |
| property:4189e7ed73ddb1ab7910f679f62414c8 | property | NatalChartInput::currentTimezoneId | src/services/ephemeris.ts | 94–94 | string currentTimezoneId |
| property:2ae59ac521d531b406f019305922a076 | property | NatalChartInput::birthTimeUnknown | src/services/ephemeris.ts | 95–95 | boolean birthTimeUnknown |
| interface:6c2331cb48950ab6eb6a6675aeb8b059 | interface | CurrentSkySnapshot | src/services/ephemeris.ts | 98–102 |  |
| property:39c603560d9d63268b53e2fab10aae0c | property | CurrentSkySnapshot::observedAt | src/services/ephemeris.ts | 99–99 | string observedAt |
| property:749a2a50447666890caa5b64c072c4d2 | property | CurrentSkySnapshot::bodies | src/services/ephemeris.ts | 100–100 | Array<{ name: string; target: string; glyph: string; lon: number; speed: number; fullDegText: string }> bodies |
| property:012514bba7375a62586fdf9b58a77e9d | property | CurrentSkySnapshot::aspects | src/services/ephemeris.ts | 101–101 | Array<{ name: string; from: string; to: string; type: AspectChordData['type']; symbol: string; angle: number; orb: number; color: number; colorHex: string; detail: string }> aspects |
| interface:29e24157ff57aa25bc3c4a00bf5509f5 | interface | NatalChartResult | src/services/ephemeris.ts | 104–121 |  |
| property:abc235c956af64857f2157fc95f49eea | property | NatalChartResult::input | src/services/ephemeris.ts | 105–105 | NatalChartInput input |
| property:832f41d98466a87e71f6fe0b397fbc43 | property | NatalChartResult::julianDayUT | src/services/ephemeris.ts | 106–106 | number julianDayUT |
| property:4324aa11064d3ee6fe45565579b5dbed | property | NatalChartResult::siderealTimeHours | src/services/ephemeris.ts | 107–107 | number siderealTimeHours |
| property:2cdbc271ec4724eab9c069cfcf3944cc | property | NatalChartResult::ascLon | src/services/ephemeris.ts | 108–108 | number ascLon |
| property:06a5f965a414b6a85281bfc503cd42d6 | property | NatalChartResult::mcLon | src/services/ephemeris.ts | 109–109 | number mcLon |
| property:64a8434e33bb16a03d74402a9f73ebf6 | property | NatalChartResult::dscLon | src/services/ephemeris.ts | 110–110 | number dscLon |
| property:3ddc4cb9ff3427091e249659b357431b | property | NatalChartResult::icLon | src/services/ephemeris.ts | 111–111 | number icLon |
| property:767cfae9cd5d50f5c7d2bcd9cd85bba2 | property | NatalChartResult::ascFormatted | src/services/ephemeris.ts | 112–112 | string ascFormatted |
| property:890f236f1eb3c2e79649185d4518a9f9 | property | NatalChartResult::mcFormatted | src/services/ephemeris.ts | 113–113 | string mcFormatted |
| property:1ee40d54c9dd976bbaee960d648de8bc | property | NatalChartResult::sunFormatted | src/services/ephemeris.ts | 114–114 | string sunFormatted |
| property:fb2048ab3f00e839cf09966e9bd687b5 | property | NatalChartResult::moonFormatted | src/services/ephemeris.ts | 115–115 | string moonFormatted |
| property:ee816e655ab0750e2d1a37d21e835245 | property | NatalChartResult::houseCusps | src/services/ephemeris.ts | 116–116 | HouseCuspData[] houseCusps |
| property:49ec91803b5e3a2f5536a041aa9c4d87 | property | NatalChartResult::natalBodies | src/services/ephemeris.ts | 117–117 | NatalBodyData[] natalBodies |
| property:9d26a3ed0b7e26ddd264454988a2b49c | property | NatalChartResult::aspectChords | src/services/ephemeris.ts | 118–118 | AspectChordData[] aspectChords |
| property:a306b00b8824d2ea81e00aff93ca347c | property | NatalChartResult::engineVersion | src/services/ephemeris.ts | 119–119 | string engineVersion |
| property:58efb470b88c5ae975338daf81af3130 | property | NatalChartResult::currentSky | src/services/ephemeris.ts | 120–120 | CurrentSkySnapshot currentSky |
| constant:a0fb809a902a5d8a46f4571733c26201 | constant | HOUSE_MEANINGS | src/services/ephemeris.ts | 123–136 | = {   1: { name: 'Ascendant (AC)', domain: 'The persona, physical vessel, outward demeanor, and inter... |
| constant:581a443c7b91684df253da56f63de89e | constant | PLANET_ARCHETYPES | src/services/ephemeris.ts | 138–151 | = {   Sun: 'Core vital essence, illuminated awareness, and sovereign life purpose.',   Moon: 'Instin... |
| function:171a2fb98d005e897281a3a6e12e5c4b | function | formatLongitude | src/services/ephemeris.ts | 153–188 | (lon: number): {   sign: ZodiacSignInfo;   deg: number;   min: number;   sec: number;   shortText: string;   fullText: string;   badgeText: string; } |
| function:5096786709a8b74d77fb559d5025df77 | function | getHouseForLongitude | src/services/ephemeris.ts | 190–203 | (lon: number, cusps: number[]): number |
| variable:4417d553bc894df94a4022d7d9e61652 | variable | sharedSweInstance | src/services/ephemeris.ts | 205–205 | = null |
| variable:8166c3e52bba1ec5850b8d9dee54ec38 | variable | initPromise | src/services/ephemeris.ts | 206–206 | = null |
| function:404ac18373c779863c4ad3225c65de4c | function | getSwissEph | src/services/ephemeris.ts | 208–220 | (): Promise<any> |
| function:293c8de44c19c4045b5fe7bf2228baa7 | function | calculateNatalChart | src/services/ephemeris.ts | 222–486 | (input: NatalChartInput): Promise<NatalChartResult> |
| file:src/services/firebase.ts | file | src/services/firebase.ts | src/services/firebase.ts | 1–44 |  |
| import:7313f71cc0a38d7d9b310d91ee52061e | import | firebase/app | src/services/firebase.ts | 1–1 | import { initializeApp, getApps } from 'firebase/app'; |
| import:0e6717492d5b39f81e4d0653716bd071 | import | firebase/auth | src/services/firebase.ts | 2–12 | import {   getAuth,   GoogleAuthProvider,   signInWithPopup,   signOut,   signInWithEmailAndPassword,   createUserWithEmailAndPassword,   RecaptchaVerifier,   signInWithPhoneNumber,   ConfirmationResult, } from 'firebase/auth'; |
| import:508d4d0910fed3209dac129932dc8528 | import | firebase/firestore | src/services/firebase.ts | 13–13 | import { getFirestore, doc, getDocFromServer } from 'firebase/firestore'; |
| import:b116ee898461a2e9c1f34cce525f2143 | import | ../../firebase-applet-config.json | src/services/firebase.ts | 14–14 | import firebaseConfig from '../../firebase-applet-config.json'; |
| constant:ded14dbd6737005e38d4c3e9f8ebb8d1 | constant | app | src/services/firebase.ts | 16–16 | = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0] |
| constant:41f2eedcd96c915204af963abb2b2560 | constant | auth | src/services/firebase.ts | 18–18 | = getAuth(app) |
| constant:c0d661c13e04f0163b0c8d7922e8cbc3 | constant | db | src/services/firebase.ts | 19–19 | = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId) |
| constant:7edbe3e499a90765355c631d7c819c5d | constant | googleProvider | src/services/firebase.ts | 21–21 | = new GoogleAuthProvider() |
| function:11ecc5d0d30877f7326050968111699a | function | testConnection | src/services/firebase.ts | 23–31 | () |
| file:src/services/gazetteer.ts | file | src/services/gazetteer.ts | src/services/gazetteer.ts | 1–73 |  |
| import:c182392c9dca66ff913da7a9bc3a72cd | import | ./gazetteer.json | src/services/gazetteer.ts | 1–1 | import gazetteerData from './gazetteer.json'; |
| interface:9e630a49f264e73d8b8861696b159af5 | interface | GazetteerEntry | src/services/gazetteer.ts | 8–15 |  |
| property:0e76e9a53623618deae92273ca24bdb4 | property | GazetteerEntry::id | src/services/gazetteer.ts | 9–9 | string id |
| property:12817fe4486480847ba463a2953d2520 | property | GazetteerEntry::name | src/services/gazetteer.ts | 10–10 | string name |
| property:70fb8421646444b263e07dd1a0dc1e6a | property | GazetteerEntry::countryCode | src/services/gazetteer.ts | 11–11 | string countryCode |
| property:80905663d6355d82277838b4ad3b7669 | property | GazetteerEntry::lat | src/services/gazetteer.ts | 12–12 | number lat |
| property:6e8eaed3075bb8b8a28d3c58cf2f1316 | property | GazetteerEntry::lon | src/services/gazetteer.ts | 13–13 | number lon |
| property:b905a614286ab4a6b54aa119c7f5c114 | property | GazetteerEntry::tzid | src/services/gazetteer.ts | 14–14 | string tzid |
| variable:30a4fd76229baba3a6c8ccf639fc9eee | variable | cache | src/services/gazetteer.ts | 17–17 | = null |
| function:a57d9f08b016ac8ec5df3c82f211abfb | function | loadGazetteer | src/services/gazetteer.ts | 19–22 | (): readonly GazetteerEntry[] |
| function:e9f10b0de972f7504be5e0cec282355d | function | tzOffsetHours | src/services/gazetteer.ts | 29–46 | (tzid: string, date: string, time: string): number |
| function:63969fe292dde450bb99f9e0ae3015d9 | function | zoneOffsetMinutes | src/services/gazetteer.ts | 48–72 | (tzid: string, utcMs: number): number |
| function:c19d6f0e6f703ab883ab02b5f991bb7c | function | zoneOffsetMinutes::get | src/services/gazetteer.ts | 59–60 | (type: Intl.DateTimeFormatPartTypes) |
| file:src/services/historicalPresentation.ts | file | src/services/historicalPresentation.ts | src/services/historicalPresentation.ts | 1–67 |  |
| import:a42ef308c9a5a4445b0b4f6a45969b09 | import | ./ephemeris | src/services/historicalPresentation.ts | 1–1 | import type { NatalChartResult } from './ephemeris'; |
| import:d7fa92fa55883a0a3a66147dee65e568 | import | ./chartTargets | src/services/historicalPresentation.ts | 2–2 | import { chartFocusKeyMatches, chartTargets } from './chartTargets'; |
| import:a8501b721a5b46eafe057fb9687873ae | import | ./presentation | src/services/historicalPresentation.ts | 3–3 | import type { PresentationCue } from './presentation'; |
| interface:d37ea0ea76842b405bc8a3ede607c9c8 | interface | RecoveredReference | src/services/historicalPresentation.ts | 5–5 |  |
| property:3fbbb9eb7797a3c118d7574d533d3e46 | property | RecoveredReference::end | src/services/historicalPresentation.ts | 5–5 | number end |
| property:50416170e35b9bfcb26313979e11cba3 | property | RecoveredReference::target | src/services/historicalPresentation.ts | 5–5 | string target |
| property:dbaf83bf7f7ed21fca7bae3868121181 | property | RecoveredReference::start | src/services/historicalPresentation.ts | 5–5 | number start |
| interface:865cc87078e3cde007443c9042c799f8 | interface | HistoricalFocus | src/services/historicalPresentation.ts | 6–6 |  |
| property:0e9bd2af65a071ccba01a26a7dc1e56f | property | HistoricalFocus::references | src/services/historicalPresentation.ts | 6–6 | RecoveredReference[] references |
| property:a757fa9d6e4ef7b2aeb33f8107cd3cb3 | property | HistoricalFocus::notice | src/services/historicalPresentation.ts | 6–6 | string&#124;null notice |
| property:a91e442d3fd813c3985e074384b62158 | property | HistoricalFocus::cues | src/services/historicalPresentation.ts | 6–6 | PresentationCue[] cues |
| function:53e26c4fbf68acd6927b8444eecb3f8e | function | escape | src/services/historicalPresentation.ts | 7–7 | (text:string) |
| constant:60e5924d4ea00a18a35d1df9d78b089e | constant | offChart | src/services/historicalPresentation.ts | 8–8 | = /\b(?:transit(?:ing&#124;s)?&#124;current(?:ly)?&#124;today&#124;tonight&#124;tomorrow&#124;synastry&#124;partner&#124;their&#124;his&#124;her)\b/i |
| function:12dbbc2ae19f6024ab84ac823f38ebf4 | function | recoverHistoricalFocus | src/services/historicalPresentation.ts | 11–66 | (text:string, chart:NatalChartResult, savedKey:unknown, explicit:PresentationCue[], category?:string, useObservation=false): HistoricalFocus |
| constant:8b2a352fcd51cecd7663f291b3a96fb3 | constant | HISTORY_ERASURE_EVENT | src/services/historyLifecycle.ts | 1–1 | = 'natally-whole-history-erasure' |
| file:src/services/historyLifecycle.ts | file | src/services/historyLifecycle.ts | src/services/historyLifecycle.ts | 1–41 |  |
| constant:ec58390605168ae72b932dc7302cc9d9 | constant | PREFIX | src/services/historyLifecycle.ts | 2–2 | = 'natally.history-erasure.v1:' |
| property:7d29fef3fb5ca46bfb74714bdf0990dd | property | HistoryErasureNotice::phase | src/services/historyLifecycle.ts | 3–3 | phase: 'erasing' &#124; 'complete' &#124; 'failed' |
| property:b50b0469cbaad270eee99ce1bad13e86 | property | HistoryErasureNotice::accountUid | src/services/historyLifecycle.ts | 3–3 | accountUid: string |
| property:e3f6a957a340ae4857163f39220f94ec | property | HistoryErasureNotice::operation | src/services/historyLifecycle.ts | 3–3 | operation: string |
| type_alias:7d905dd3859e9c5b07adfd6bdb21c5f6 | type_alias | HistoryErasureNotice | src/services/historyLifecycle.ts | 3–3 |  |
| constant:5c9ac3b89799198e1c52609dbb7a4d11 | constant | pending | src/services/historyLifecycle.ts | 4–4 | = new Set<string>() |
| constant:381a8d323e63e928e90f23f2d5e8f0a3 | constant | settled | src/services/historyLifecycle.ts | 5–5 | = new Map<string, string>() |
| function:f43d1d5d73b5afd91bed595d6ade5aa0 | function | publish | src/services/historyLifecycle.ts | 7–11 | (notice: HistoryErasureNotice) |
| function:19a9e6f31fafdaace2e4ffdbef992d56 | function | isNatallyHistoryErasing | src/services/historyLifecycle.ts | 13–21 | (uid: string &#124; null &#124; undefined): boolean |
| function:a135a28c9b69e316bdb9a6957c6d9661 | function | announceHistoryErasure | src/services/historyLifecycle.ts | 23–27 | (notice: HistoryErasureNotice): void |
| function:e1696321e68babebd5a8ba5d3f54f813 | function | finishHistoryErasure | src/services/historyLifecycle.ts | 29–32 | (notice: HistoryErasureNotice): void |
| file:src/services/hostedInference.ts | file | src/services/hostedInference.ts | src/services/hostedInference.ts | 1–75 |  |
| interface:c58ac956518fe696a2cda6df46299faa | interface | HostedPayload | src/services/hostedInference.ts | 1–7 |  |
| property:12edc554ac61de2be3608feef4b73933 | property | HostedPayload::prompt | src/services/hostedInference.ts | 2–2 | string prompt |
| property:1ce732146bb62541028887bc469b75f1 | property | HostedPayload::systemInstruction | src/services/hostedInference.ts | 3–3 | string systemInstruction |
| property:8904406eddceb498ba80ef5d7981edc3 | property | HostedPayload::history | src/services/hostedInference.ts | 4–4 | Array<{ role: string; content: string }> history |
| property:33c37f7241bc2bc22577f63f7b1763a7 | property | HostedPayload::image | src/services/hostedInference.ts | 5–5 | { data: string; mimeType: string } image |
| property:9e217ca3fde59a1e38af96baa27fc867 | property | HostedPayload::temperature | src/services/hostedInference.ts | 6–6 | number temperature |
| class:3a49d8c9cdd7f592cdeaa0b02e94e21c | class | HostedAuthenticationError | src/services/hostedInference.ts | 9–15 |  |
| property:fae895c8642c855cd6ad4bf44006bc72 | property | HostedAuthenticationError::code | src/services/hostedInference.ts | 10–10 | code |
| method:a8f562656b503c26519f75a7b1b43655 | method | HostedAuthenticationError::constructor | src/services/hostedInference.ts | 11–14 | (message = 'Sign in to receive your hosted reading. Your question is kept here.') |
| type_alias:fcd18486f25e4a70e3ac20c726884341 | type_alias | CalculationExecutor | src/services/hostedInference.ts | 17–17 |  |
| function:e3ca6af9d78d76f326e59d6754317ad2 | function | completeHosted | src/services/hostedInference.ts | 19–63 | (payload: HostedPayload, token: string, endpoint: string, execute?: CalculationExecutor, isCurrentSession: () => boolean = () => true) |
| function:f882bb6284f245f1c43b8f9fa3116fb3 | function | requestHostedInference | src/services/hostedInference.ts | 65–74 | (payload: HostedPayload, execute?: CalculationExecutor, isCurrentSession: () => boolean = () => true) |
| file:src/services/inferenceTurn.ts | file | src/services/inferenceTurn.ts | src/services/inferenceTurn.ts | 1–13 |  |
| constant:e0541a5410990b052771ef3f20acd9ef | constant | turns | src/services/inferenceTurn.ts | 3–3 | = new Map<string, { token:symbol; active:()=>boolean }>() |
| function:64fda8bc7c764387de7dcf7084043700 | function | withInferenceTurn | src/services/inferenceTurn.ts | 4–12 | (uid:string&#124;undefined, active:(()=>boolean)&#124;undefined, run:()=>Promise<T>): Promise<T> |
| file:src/services/karaokeScroll.ts | file | src/services/karaokeScroll.ts | src/services/karaokeScroll.ts | 1–15 |  |
| function:5f5842ba3459a6456a408cba6a6c1a97 | function | keepKaraokeVisible | src/services/karaokeScroll.ts | 1–14 | (container: HTMLElement, active: HTMLElement, reducedMotion = false): boolean |
| file:src/services/locations.ts | file | src/services/locations.ts | src/services/locations.ts | 1–410 |  |
| import:683ce051fb80259f858367ec5a083086 | import | ./accountStorage | src/services/locations.ts | 1–1 | import { accountStorageKey } from './accountStorage'; |
| interface:04ba66c72a2bdc3a12f018e1391e2b92 | interface | CityLocation | src/services/locations.ts | 3–11 |  |
| property:311cd155f0ec815a08086af06938f497 | property | CityLocation::name | src/services/locations.ts | 4–4 | string name |
| property:0dfb916651b71d5b5d93e38bf1e412fa | property | CityLocation::country | src/services/locations.ts | 5–5 | string country |
| property:0103bc34b91277969dbe58d32ed5abca | property | CityLocation::adminRegion | src/services/locations.ts | 6–6 | string adminRegion |
| property:c4b7a22259dada2bc16ec32b9b0064d4 | property | CityLocation::latitude | src/services/locations.ts | 7–7 | number latitude |
| property:349b21626c8643e1a43f9ad0dedd317a | property | CityLocation::longitude | src/services/locations.ts | 8–8 | number longitude |
| property:aa37a68d31ef459038d4a75b10414e43 | property | CityLocation::timezoneOffset | src/services/locations.ts | 9–9 | number timezoneOffset |
| property:594d82ab67732157d1d1ecd63b47fd53 | property | CityLocation::label | src/services/locations.ts | 10–10 | string label |
| constant:6b0389ed3bf1edc986308162b4cdd4c7 | constant | PRESET_CITIES | src/services/locations.ts | 13–224 | = [   // User's Hometown & Canadian Centers (Ontario / Quebec Border Corridor)   {     name: 'Alexa... |
| function:74d5f1a4acd583e991866cb132223db4 | function | estimateTimezoneFromLon | src/services/locations.ts | 226–228 | (lon: number): number |
| constant:a219917c30b8fb8079a3b7bca84f8380 | constant | searchCache | src/services/locations.ts | 231–231 | = new Map<string, CityLocation[]>() |
| function:b50e9e3885473d919e287913459b3d7e | function | searchPlaceOnline | src/services/locations.ts | 233–362 | (query: string): Promise<CityLocation[]> |
| constant:bf8ac39122ef767facaed9c432887f30 | constant | VANTAGE_LOCATION_STORAGE_KEY | src/services/locations.ts | 364–364 | = 'astrosphere_current_vantage_location_v2' |
| function:5a4ea77444a1946a6971fff98211d7e8 | function | getPersistedVantageLocation | src/services/locations.ts | 366–392 | (accountUid: string &#124; null): CityLocation &#124; null |
| function:0b4cff4312ec7b853175dc12222052b6 | function | savePersistedVantageLocation | src/services/locations.ts | 394–408 | (location: CityLocation, accountUid: string &#124; null): void |
| file:src/services/natallyChat.ts | file | src/services/natallyChat.ts | src/services/natallyChat.ts | 1–274 |  |
| import:6a2d06346a1a511633ec79fe9c9df9b4 | import | ./hostedInference | src/services/natallyChat.ts | 1–1 | import { requestHostedInference } from './hostedInference'; |
| import:401ff6bca67f16cd67edf2576c4a68e1 | import | ./historicalPresentation | src/services/natallyChat.ts | 2–2 | import { recoverHistoricalFocus } from './historicalPresentation'; |
| import:706445f3bc2b6674b0d828260ae3e3e8 | import | ./readingStyle | src/services/natallyChat.ts | 3–3 | import { readingStylePrompt } from './readingStyle'; |
| import:62a944f146dc162f75720e1965a434ff | import | ./ephemeris | src/services/natallyChat.ts | 4–4 | import type { NatalChartResult } from './ephemeris'; |
| import:dc8497a056f122c93b397c63716b3a24 | import | ./astrowisdom | src/services/natallyChat.ts | 5–5 | import { computeThemesAndWisdom } from './astrowisdom'; |
| import:0f8d4a66d2555f5f3a05bcb28c01fe20 | import | ./transits | src/services/natallyChat.ts | 6–6 | import { calculateTransitAspects } from './transits'; |
| import:5f8d04ca0cf7275c46b8309dda23078a | import | ./calculationTools | src/services/natallyChat.ts | 7–7 | import { createCalculationSession } from './calculationTools'; |
| import:d87d4de0555dfab3dc08a286255adb87 | import | ./inferenceTurn | src/services/natallyChat.ts | 8–8 | import { withInferenceTurn } from './inferenceTurn'; |
| import:a221d861234128564ce4a5e9ae98b521 | import | ./soul | src/services/natallyChat.ts | 9–9 | import { extractSoulDevelopments } from './soul'; |
| import:de0ba640f976702f2512ffa956774e07 | import | ./chartTargets | src/services/natallyChat.ts | 10–10 | import { chartTargets, chartFocusKey, chartFocusKeyMatches } from './chartTargets'; |
| import:eb550da5c9b9ef3eccd3ff73ed04048b | import | ./presentation | src/services/natallyChat.ts | 11–11 | import { buildPresentationContext, validatePresentationAction, type PresentationCue, type PresentationState } from './presentation'; |
| interface:feabd7d46646ecf3d3febb2666d2d0ab | interface | ChartCue | src/services/natallyChat.ts | 13–13 |  |
| property:0a5cf43deaf129ecd2883aa71f692de7 | property | ChartCue::offset | src/services/natallyChat.ts | 13–13 | number offset |
| property:f032c75c2fbc88ff2c4221292d6fb0d3 | property | ChartCue::targets | src/services/natallyChat.ts | 13–13 | string[] targets |
| interface:a548db20adfca7d62ce099afd743015b | interface | ChatMessage | src/services/natallyChat.ts | 15–31 |  |
| property:617c2f943c2362e593cf57fd414619e0 | property | ChatMessage::id | src/services/natallyChat.ts | 16–16 | string id |
| property:d2ae123faa3a3a7ca191ed30f385e73e | property | ChatMessage::sender | src/services/natallyChat.ts | 17–17 | 'user' &#124; 'natally' sender |
| property:4a3bc649c39f7c37b5279ad3f3b0ad76 | property | ChatMessage::text | src/services/natallyChat.ts | 18–18 | string text |
| property:295cb7a89368dc94c87d09b057f0c860 | property | ChatMessage::timestamp | src/services/natallyChat.ts | 19–19 | string timestamp |
| property:ed787bce6ef2a4bf76089a07461caabc | property | ChatMessage::evidence | src/services/natallyChat.ts | 20–25 | {     verifiedGeometry?: string;     traditionalDoctrine?: string;     modernDoctrine?: string;     interpretiveHypothesis?: string;   } evidence |
| property:c5523a615a9bda06ce5062938123ba81 | property | ChatMessage::isOfflineMode | src/services/natallyChat.ts | 26–26 | boolean isOfflineMode |
| property:645d4a0a2e316ce47cce73d3eec5a62d | property | ChatMessage::chartCues | src/services/natallyChat.ts | 27–27 | ChartCue[] chartCues |
| property:70f955e86e67deeedcb15dc4c681c00b | property | ChatMessage::presentationVersion | src/services/natallyChat.ts | 28–28 | 1 presentationVersion |
| property:67daf9f8710472792101a471e05e4c3c | property | ChatMessage::presentationCues | src/services/natallyChat.ts | 29–29 | PresentationCue[] presentationCues |
| property:9fcc76154818c761a3003dbf58f10a9c | property | ChatMessage::chartFocusKey | src/services/natallyChat.ts | 30–30 | string chartFocusKey |
| interface:5aefd7f5c331c6ce694acb829c85f9de | interface | NatallyChatResult | src/services/natallyChat.ts | 33–48 |  |
| property:d4807b16bf2eed2c5da3a0a4b510060d | property | NatallyChatResult::soulDevelopments | src/services/natallyChat.ts | 34–34 | string[] soulDevelopments |
| property:d1282f15f8718b062db962dc1538022c | property | NatallyChatResult::text | src/services/natallyChat.ts | 35–35 | string text |
| property:7df1a0545cabf84f1c291ddf828f5c21 | property | NatallyChatResult::chartCues | src/services/natallyChat.ts | 36–36 | ChartCue[] chartCues |
| property:c85f5bbac718ac685e63696169ebf64b | property | NatallyChatResult::presentationVersion | src/services/natallyChat.ts | 37–37 | 1 presentationVersion |
| property:7eb84fc4da3e2884d7718378e518f1f4 | property | NatallyChatResult::presentationCues | src/services/natallyChat.ts | 38–38 | PresentationCue[] presentationCues |
| property:eb9a44223ec049d4519c49af7b01e937 | property | NatallyChatResult::chartFocusKey | src/services/natallyChat.ts | 39–39 | string chartFocusKey |
| property:2cb5d187d39a474d86cb4708b20d1f37 | property | NatallyChatResult::evidence | src/services/natallyChat.ts | 40–45 | {     verifiedGeometry?: string;     traditionalDoctrine?: string;     modernDoctrine?: string;     interpretiveHypothesis?: string;   } evidence |
| property:5c23566e3cee181beb34a89ef764bcb3 | property | NatallyChatResult::source | src/services/natallyChat.ts | 46–46 | 'hosted' source |
| property:780f03656ba6120f47e37abf8dcfb0ff | property | NatallyChatResult::model | src/services/natallyChat.ts | 47–47 | string model |
| interface:028e24123922cb9256419b743d8e7923 | interface | InferenceErrorDetails | src/services/natallyChat.ts | 50–55 |  |
| property:cedcc42662ec66f0ba2a5606452fc134 | property | InferenceErrorDetails::message | src/services/natallyChat.ts | 51–51 | string message |
| property:44772aa0eb99ce06dc25f4a338e65e34 | property | InferenceErrorDetails::status | src/services/natallyChat.ts | 52–52 | number status |
| property:408d6796631674fd0554fcd9a4b10789 | property | InferenceErrorDetails::errorType | src/services/natallyChat.ts | 53–53 | 'auth' &#124; 'quota' &#124; 'model_unavailable' &#124; 'network' &#124; 'server' errorType |
| property:3b12c406e11683e7d80a35cb36620e00 | property | InferenceErrorDetails::canRetry | src/services/natallyChat.ts | 54–54 | boolean canRetry |
| class:f335a63989fb1f49006d851115d89292 | class | InferenceError | src/services/natallyChat.ts | 57–64 |  |
| property:1b27a7fb382c26d8a9c6848626dee4de | property | InferenceError::details | src/services/natallyChat.ts | 58–58 | InferenceErrorDetails details |
| method:05828c0d4d7486a471aeb9b4be103174 | method | InferenceError::constructor | src/services/natallyChat.ts | 59–63 | (details: InferenceErrorDetails) |
| constant:1f580f3590dde672b8521a40c973ec9e | constant | NATALLY_SYSTEM_PROMPT | src/services/natallyChat.ts | 66–108 | = ` You are Natally, the robo-psychic companion described in the shared SOUL definition supplied belo... |
| function:6452965f7172eae6f78c6706c552d880 | function | buildStructuredNatalContext | src/services/natallyChat.ts | 113–143 | (chart: NatalChartResult, userLore: string[]): string |
| function:accf1779c04d3dc1f82212fd368172d8 | function | buildSynastryContext | src/services/natallyChat.ts | 145–158 | (chart: NatalChartResult, partnerChart?: NatalChartResult &#124; null): string |
| function:a59e6ab6c7724b84c71bab5a6a0f3bd7 | function | buildChartPresentationPrompt | src/services/natallyChat.ts | 160–169 | (chart: NatalChartResult): string |
| function:b22010235a79607e39990b52f615dd4d | function | validateChartCues | src/services/natallyChat.ts | 171–183 | (value: unknown, text: string, key: unknown, chart: NatalChartResult): ChartCue[] |
| function:a7a6b68c6437a4a1d2758bd352d963d1 | function | chartFocusAt | src/services/natallyChat.ts | 185–189 | (cues: ChartCue[], offset: number): string[] |
| function:e9d412b9c1a62f203fb70ad81d41abda | function | parseNatallyResponse | src/services/natallyChat.ts | 191–251 | (rawText: string, chart?: NatalChartResult): NatallyChatResult |
| function:2a96b269620cc8b2a1baf19508bc5b67 | function | askNatally | src/services/natallyChat.ts | 253–273 | (   userMessage: string,   history: ChatMessage[],   chart: NatalChartResult,   userLore: string[],   imageAttachment?: { data: string; mimeType: string } &#124; null,   options?: { accountUid?: string; presentation?: PresentationState; soulPrompt?: string; isCurrentSession?: () => boolean; temperature?: number; model?: string; partnerChart?: NatalChartResult &#124; null; calculationSession?: ReturnType<typeof createCalculationSession> }, ): Promise<NatallyChatResult> |
| file:src/services/natallyHistory.ts | file | src/services/natallyHistory.ts | src/services/natallyHistory.ts | 1–41 |  |
| import:aadef25b1e673d3bf117d5c4f5ddbac8 | import | ./accountStorage | src/services/natallyHistory.ts | 1–1 | import { accountStorageKey } from './accountStorage'; |
| import:166dc64d6d64dcd30dcc2cff838af94d | import | ./readingAudio | src/services/natallyHistory.ts | 2–2 | import { clearAccountReadingAudio } from './readingAudio'; |
| import:d5cef6a3b47161e4d3c30548e0a6cdc6 | import | ./atelierMemories | src/services/natallyHistory.ts | 3–3 | import { eraseAtelierHistory } from './atelierMemories'; |
| import:dfcaba9b42a82539d480e4e0eacff0ae | import | ./historyLifecycle | src/services/natallyHistory.ts | 4–4 | import { announceHistoryErasure, finishHistoryErasure } from './historyLifecycle'; |
| function:44addc20e128c9c022b1af1eac0e6582 | function | eraseWholeNatallyHistory | src/services/natallyHistory.ts | 7–40 | (accountUid: string, isCurrentAccount: () => boolean): Promise<void> |
| file:src/services/onboarding.ts | file | src/services/onboarding.ts | src/services/onboarding.ts | 1–132 |  |
| import:9894cfb303c209d4f798b4a079a650b5 | import | ./readingStyle | src/services/onboarding.ts | 1–1 | import { normalizeReadingStyle, type ReadingStyle } from './readingStyle'; |
| import:45e8ff3997ffa59577616656682d84cf | import | firebase/firestore | src/services/onboarding.ts | 2–2 | import { doc, getDoc, setDoc } from 'firebase/firestore'; |
| import:6a8b5cc24c02816cc912a55cc43ffcf5 | import | ./firebase | src/services/onboarding.ts | 3–3 | import { db } from './firebase'; |
| import:34a3ffee4c908a67b2669437f1d709ec | import | ./ephemeris | src/services/onboarding.ts | 4–4 | import type { NatalChartInput } from './ephemeris'; |
| import:34be73618afd132e009b2a1282891e76 | import | ./transits | src/services/onboarding.ts | 5–5 | import type { CurrentLocation } from './transits'; |
| import:b975ba19f1b1343d418fe4bd275f33ba | import | ./gazetteer | src/services/onboarding.ts | 6–6 | import { loadGazetteer, tzOffsetHours } from './gazetteer'; |
| interface:555031fb483929800f448b49976c73ec | interface | IntakeDraft | src/services/onboarding.ts | 14–22 |  |
| property:9c9de3b3c8c5a6d5a88638c447a183e4 | property | IntakeDraft::readingStyle | src/services/onboarding.ts | 15–15 | ReadingStyle readingStyle |
| property:ec57f47ac9b173949aebbd5b590ea128 | property | IntakeDraft::name | src/services/onboarding.ts | 16–16 | string name |
| property:a843f9b85a14d058a677d33e95f9dbf5 | property | IntakeDraft::date | src/services/onboarding.ts | 17–17 | string date |
| property:ba40cd1e77a666672c88509460e15e6c | property | IntakeDraft::time | src/services/onboarding.ts | 18–18 | string &#124; null time |
| property:25fd7b7d019bbe1e3c1b81fd29ff9869 | property | IntakeDraft::unknownTime | src/services/onboarding.ts | 19–19 | boolean unknownTime |
| property:025fba9aaccb6efd779644356136569b | property | IntakeDraft::placeId | src/services/onboarding.ts | 20–20 | string &#124; null placeId |
| property:3727a2423faea2ceec3d6607d2e9d716 | property | IntakeDraft::currentLocation | src/services/onboarding.ts | 21–21 | CurrentLocation currentLocation |
| constant:7ab200905ce642baa9647180a974c5d7 | constant | NATAL_INTAKE_STORAGE_KEY | src/services/onboarding.ts | 24–24 | = 'astrosphere_natal_intake_v1' |
| function:aa65eb070f01b35148a30653e9ba21ac | function | intakeToChartInput | src/services/onboarding.ts | 26–50 | (draft: IntakeDraft): NatalChartInput |
| function:329856f500c300939cb6edd5c40ec884 | function | loadNatalIntake | src/services/onboarding.ts | 52–72 | (uid?: string): NatalChartInput &#124; null |
| function:0290ddb007f86fdc9fb3b05e48e46873 | function | saveNatalIntake | src/services/onboarding.ts | 74–80 | (input: NatalChartInput, uid?: string): void |
| function:643771f8c32c6195509d35d44d76130d | function | clearNatalIntake | src/services/onboarding.ts | 82–86 | (uid?: string): void |
| class:2258adce20665493755acb6727280027 | class | IntakeStorageBillingError | src/services/onboarding.ts | 91–96 |  |
| method:322655d34a6720df98ad77c0c309f951 | method | IntakeStorageBillingError::constructor | src/services/onboarding.ts | 92–95 | (public readonly cause: unknown) |
| constant:608adc099b2e1d78776a2a7796898e3c | constant | BILLING_CODES | src/services/onboarding.ts | 98–102 | = new Set([   'failed-precondition', // Firestore not enabled / billing removed mid-flight   'resour... |
| function:3bdcf3063314ffa31ec22ef679af8fd7 | function | isBillingClass | src/services/onboarding.ts | 104–109 | (err: unknown): boolean |
| function:6896861399e42cfbc554eb270441571e | function | intakeDoc | src/services/onboarding.ts | 111–111 | (uid: string) |
| function:c723c9478fed47768abb42fe3bdcb711 | function | fetchUserIntake | src/services/onboarding.ts | 113–122 | (uid: string): Promise<NatalChartInput &#124; null> |
| function:83b7b938720d7a23196f0a9698855917 | function | uploadUserIntake | src/services/onboarding.ts | 124–131 | (uid: string, input: NatalChartInput): Promise<void> |
| file:src/services/presentation.ts | file | src/services/presentation.ts | src/services/presentation.ts | 1–60 |  |
| import:14e24552eb0ad61f33e0fdcb9d5c6823 | import | ./ephemeris | src/services/presentation.ts | 1–1 | import type { NatalChartResult } from './ephemeris'; |
| import:c56007f3cd0e772dbb4af64f0f23b369 | import | ./chartTargets | src/services/presentation.ts | 2–2 | import { chartFocusKey, chartFocusKeyMatches, isDatedSkyTarget, resolveChartTarget } from './chartTargets'; |
| type_alias:5a8e701c4249728c48a96a08aa7fdef6 | type_alias | PresentationView | src/services/presentation.ts | 3–3 |  |
| type_alias:9754c97bc1249c7726258d32b38a9496 | type_alias | PresentationPanel | src/services/presentation.ts | 4–4 |  |
| type_alias:49d807f85e4f65a460ba70248668e69b | type_alias | PresentationAction | src/services/presentation.ts | 5–5 |  |
| interface:b150e832741bf6e5313c4875e85f8cc2 | interface | PresentationCue | src/services/presentation.ts | 6–6 |  |
| property:04ab6b2ae0991c6d11994ccea5327516 | property | PresentationCue::action | src/services/presentation.ts | 6–6 | PresentationAction action |
| property:b73c4717ed02fa3048e5d264f52e9245 | property | PresentationCue::offset | src/services/presentation.ts | 6–6 | number offset |
| interface:9c29687d03bbaafbb8adbe327f64edfe | interface | PresentationReceipt | src/services/presentation.ts | 7–7 |  |
| property:09b36b1a732842a5723f7f11dc1d7be7 | property | PresentationReceipt::status | src/services/presentation.ts | 7–7 | 'applied' &#124; 'rejected' status |
| property:5c60386a49e44989d18d651256983337 | property | PresentationReceipt::chartKey | src/services/presentation.ts | 7–7 | string chartKey |
| property:5df18384c0bf3d0af515ab06ae3a610a | property | PresentationReceipt::sequence | src/services/presentation.ts | 7–7 | number sequence |
| property:d12ea82d179e9d90bea3b2fbc7d94031 | property | PresentationReceipt::action | src/services/presentation.ts | 7–7 | PresentationAction action |
| interface:3ddf8faee9b4a5ff62c09fb378164b07 | interface | PresentationState | src/services/presentation.ts | 8–8 |  |
| property:2cf0593f0147e66bbc107cb7cb8ef799 | property | PresentationState::focusTargets | src/services/presentation.ts | 8–8 | string[] focusTargets |
| property:4d90d3526d6a00cee9d7514a8685dd95 | property | PresentationState::panel | src/services/presentation.ts | 8–8 | PresentationPanel panel |
| property:a09cf3fe567b1329a5a1ad521bb3c5fe | property | PresentationState::view | src/services/presentation.ts | 8–8 | PresentationView view |
| property:a37b839baddd6b6d9d1fca994b142bf4 | property | PresentationState::chartKey | src/services/presentation.ts | 8–8 | string chartKey |
| property:b58834cb0d6bd8c988a7a57c73600e3e | property | PresentationState::follow | src/services/presentation.ts | 8–8 | boolean follow |
| property:df7fbd77a44196e8a33b1cee35d9262b | property | PresentationState::lastReceipt | src/services/presentation.ts | 8–8 | PresentationReceipt &#124; null lastReceipt |
| property:dffaeb668131c9d2e89ae474effa4c15 | property | PresentationState::selectedTargets | src/services/presentation.ts | 8–8 | string[] selectedTargets |
| property:ef9613bc0f4b5547b6210c0f7c5d4b6f | property | PresentationState::sequence | src/services/presentation.ts | 8–8 | number sequence |
| function:4a1e6fd868b105591292a921dddba9b6 | function | initialPresentation | src/services/presentation.ts | 9–9 | (chartKey: string): PresentationState |
| function:f09d187dda51bd880ad51d1eb827857d | function | validatePresentationAction | src/services/presentation.ts | 10–19 | (value: unknown, chart: NatalChartResult): PresentationAction &#124; null |
| function:a72d9cffb8b52dbc69217fa78740fd02 | function | reducePresentation | src/services/presentation.ts | 20–30 | (state: PresentationState, action: PresentationAction, chart: NatalChartResult): PresentationState |
| function:5155fe986e94c08c4efa014db0f00108 | function | validatePresentationCues | src/services/presentation.ts | 31–44 | (value: unknown, text: string, key: unknown, chart: NatalChartResult): PresentationCue[] |
| function:4f6a3f8b16f2e880fb74f060ee0860eb | function | presentationActionsAt | src/services/presentation.ts | 45–45 | (cues: PresentationCue[], from: number, to: number): PresentationAction[] |
| function:7f7012c359f691fc385691e922064447 | function | presentationFocusAt | src/services/presentation.ts | 47–54 | (cues: PresentationCue[], offset: number): Extract<PresentationAction, {type:'focus'&#124;'clear'}> &#124; null |
| function:48b4c974c3bbeab3b522c11241145736 | function | buildPresentationContext | src/services/presentation.ts | 55–59 | (state: PresentationState &#124; undefined, chart: NatalChartResult): string |
| file:src/services/readingAudio.ts | file | src/services/readingAudio.ts | src/services/readingAudio.ts | 1–251 |  |
| import:7e03dade0a5439fb3bdbaf40fd5d157e | import | ./voiceService | src/services/readingAudio.ts | 1–1 | import type { VoiceSettings } from './voiceService'; |
| constant:80e2d1db8d81437a537c7a6a98a55979 | constant | DATABASE | src/services/readingAudio.ts | 3–3 | = 'natally-retained-reading-audio-v1' |
| constant:38653039ea168aa5453c6e80805b7308 | constant | STORE | src/services/readingAudio.ts | 4–4 | = 'readings' |
| constant:3cca8a7e09e0491807ca6a0c5de65bec | constant | SAMPLE_RATE | src/services/readingAudio.ts | 5–5 | = 24000 |
| constant:de1f2c9e4f90c74cdbc1ef3de0025615 | constant | MAX_RECORD_BYTES | src/services/readingAudio.ts | 6–6 | = 24 * 1024 * 1024 |
| constant:e3e913b6b103ae9e787d884d78104448 | constant | MAX_ACCOUNT_BYTES | src/services/readingAudio.ts | 7–7 | = 64 * 1024 * 1024 |
| constant:975a4a75ced77596df6dfb670881abe6 | constant | MAX_RECORDINGS | src/services/readingAudio.ts | 8–8 | = 6 |
| constant:74f4978e5140a754b93972ad7cb87f2c | constant | READING_AUDIO_EVENT | src/services/readingAudio.ts | 9–9 | = 'natally-reading-audio-changed' |
| interface:f9b3ffa350270d0464dc4159b6c522b6 | interface | ReadingAudioSegment | src/services/readingAudio.ts | 11–17 |  |
| property:9beac298df27edfe15b087ab3c98314c | property | ReadingAudioSegment::samples | src/services/readingAudio.ts | 12–12 | Float32Array samples |
| property:169b385f637e4c23d4282a63e041be2c | property | ReadingAudioSegment::sampleRate | src/services/readingAudio.ts | 13–13 | number sampleRate |
| property:70aff48115cdc46137441baf1cc4345c | property | ReadingAudioSegment::sourceOffset | src/services/readingAudio.ts | 14–14 | number sourceOffset |
| property:b8c6a2a8bf29ce6962191750ea8becec | property | ReadingAudioSegment::sourceEnd | src/services/readingAudio.ts | 15–15 | number sourceEnd |
| property:daf1d9b308a342e795229535365518be | property | ReadingAudioSegment::pitch | src/services/readingAudio.ts | 16–16 | number pitch |
| interface:837ece95eaefd671e992f8bc332451b1 | interface | ReadingAudioStatus | src/services/readingAudio.ts | 18–21 |  |
| property:50ebc95110d3b543c4e949966b770a3d | property | ReadingAudioStatus::state | src/services/readingAudio.ts | 19–19 | 'recording' &#124; 'saving' &#124; 'saved' &#124; 'error' &#124; 'discarded' state |
| property:efb2b44b42401ce9cd6718bb08230ece | property | ReadingAudioStatus::message | src/services/readingAudio.ts | 20–20 | string message |
| interface:22076f7a08791555528cb6e96dba0ed1 | interface | ReadingAudioRecord | src/services/readingAudio.ts | 22–36 |  |
| property:54f37a5fcef6e954a5282c12428e4630 | property | ReadingAudioRecord::key | src/services/readingAudio.ts | 23–23 | string key |
| property:839226f29215a56c02f636e6f9c0a094 | property | ReadingAudioRecord::version | src/services/readingAudio.ts | 24–24 | 1 version |
| property:5f00cfd927e8aa1702e2ffdffab5c142 | property | ReadingAudioRecord::accountUid | src/services/readingAudio.ts | 25–25 | string accountUid |
| property:53a10bd83a224496fc5ec6f1796d68ef | property | ReadingAudioRecord::messageId | src/services/readingAudio.ts | 26–26 | string messageId |
| property:f9b9a2ce895f4382025cee001ed81f50 | property | ReadingAudioRecord::text | src/services/readingAudio.ts | 27–27 | string text |
| property:65d9b5ecd74bbb957b45702071ea0b1b | property | ReadingAudioRecord::createdAt | src/services/readingAudio.ts | 28–28 | string createdAt |
| property:111afe4575b40fe76226fb6d32000509 | property | ReadingAudioRecord::complete | src/services/readingAudio.ts | 29–29 | true complete |
| property:aec1cb2548df3a22ad9466d8c35638bc | property | ReadingAudioRecord::sampleRate | src/services/readingAudio.ts | 30–30 | number sampleRate |
| property:a6f28bd9ba1813dd47bed3d4171a9511 | property | ReadingAudioRecord::duration | src/services/readingAudio.ts | 31–31 | number duration |
| property:c0dcfcab0f9c2a95ac7eab1e9b405fa8 | property | ReadingAudioRecord::bytes | src/services/readingAudio.ts | 32–32 | number bytes |
| property:5ea6fbb3567e12a6aaa2b389d3e674f8 | property | ReadingAudioRecord::voiceSettings | src/services/readingAudio.ts | 33–33 | Pick<VoiceSettings, 'ttsModel' &#124; 'aiVoiceName' &#124; 'pitch' &#124; 'rate' &#124; 'language' &#124; 'tone'> voiceSettings |
| property:11e90cbf5e40d5333b8571477794a936 | property | ReadingAudioRecord::segments | src/services/readingAudio.ts | 34–34 | Array<{ sourceOffset: number; sourceEnd: number; frames: number }> segments |
| property:4550cea24b5258a62312acff7d1d6cbc | property | ReadingAudioRecord::wav | src/services/readingAudio.ts | 35–35 | Blob wav |
| function:f82ba9ead0b9c013485844b8d5da1a00 | function | keyFor | src/services/readingAudio.ts | 38–38 | (accountUid: string, messageId: string) |
| function:9f58a47a3daf87ef814f9a546448c2f2 | function | changed | src/services/readingAudio.ts | 39–41 | (accountUid: string) |
| function:3096293998c820e5731d20711ef97c40 | function | openDatabase | src/services/readingAudio.ts | 42–54 | (): Promise<IDBDatabase> |
| function:207e2a157c80734f739dc1be16041f6b | function | loadReadingAudio | src/services/readingAudio.ts | 56–71 | (accountUid: string, messageId: string): Promise<ReadingAudioRecord &#124; null> |
| function:2dcbbffae3c6c3c21878438638a65a6b | function | clearReadingAudio | src/services/readingAudio.ts | 73–84 | (accountUid: string, messageId: string, isCurrentSession: () => boolean = () => true): Promise<void> |
| function:9b0460fb27281ffcd6b19f8ae11d26b3 | function | clearAccountReadingAudio | src/services/readingAudio.ts | 87–103 | (accountUid: string, isCurrentAccount: () => boolean): Promise<void> |
| function:d5fc7f43d44a650022fbe21b9f800dd9 | function | saveReadingAudio | src/services/readingAudio.ts | 105–128 | (record: ReadingAudioRecord, isCurrentSession: () => boolean): Promise<void> |
| function:2140c3066d2a08137e7c2cf5d1407040 | function | wavHeader | src/services/readingAudio.ts | 130–139 | (dataBytes: number): ArrayBuffer |
| function:5ae11728545c50152487388cc138885b | function | wavHeader::write | src/services/readingAudio.ts | 133–133 | (at: number, value: string) |
| function:9e892d656b4813d2c9a2264fdc8800f5 | function | applyVoiceTone | src/services/readingAudio.ts | 141–162 | (parts: ArrayBuffer[], frames: number, tone: VoiceSettings['tone']): Promise<ArrayBuffer[]> |
| function:77a33a5a2006cf92f69cd7e7f7f5b6ee | function | createReadingAudioCapture | src/services/readingAudio.ts | 165–240 | (options: {   accountUid: string;   messageId: string;   text: string;   voiceSettings: VoiceSettings;   isCurrentSession: () => boolean;   onStatus?: (status: ReadingAudioStatus) => void; }) |
| function:be940f17a482eab8bb320628c4505a9b | function | createReadingAudioCapture::status | src/services/readingAudio.ts | 178–180 | (state: ReadingAudioStatus['state'], message: string) |
| function:2a35431f05b05f2e9735184aa281cb5c | function | readingAudioFilename | src/services/readingAudio.ts | 242–244 | (record: Pick<ReadingAudioRecord, 'messageId' &#124; 'createdAt'>): string |
| function:25b6404d4a155c8e97d36a4525d72c44 | function | downloadReadingAudio | src/services/readingAudio.ts | 246–250 | (record: ReadingAudioRecord): void |
| file:src/services/readingStyle.ts | file | src/services/readingStyle.ts | src/services/readingStyle.ts | 1–50 |  |
| type_alias:a9bdc848863d675b85a2d19ca8cffebb | type_alias | ReadingStyle | src/services/readingStyle.ts | 1–1 |  |
| constant:d03c102de56955748d4c951f7b59fd5f | constant | READING_STYLE_OPTIONS | src/services/readingStyle.ts | 3–6 | = [   { value: 'plain', label: 'Plain English', description: 'No astrology knowledge needed. Natally ... |
| constant:0fe9071082363f651c047b359661d51b | constant | READING_STYLE_EVENT | src/services/readingStyle.ts | 8–8 | = 'natally-reading-style-change' |
| function:b9c06ba5bfbb8bc99d6ec9fe879e35bc | function | storageKey | src/services/readingStyle.ts | 9–9 | (uid: string) |
| constant:7c7391993c1d98a011795eb21e327d30 | constant | sessionPreferences | src/services/readingStyle.ts | 10–10 | = new Map<string, ReadingStyle>() |
| function:0d18dfd0788330d4368bc7ad2a84dcf8 | function | normalizeReadingStyle | src/services/readingStyle.ts | 11–11 | (value: unknown): ReadingStyle |
| function:9b2276ef737e3799cee6526e3fb3a641 | function | loadReadingStyle | src/services/readingStyle.ts | 13–23 | (accountUid?: string &#124; null, initialStyle?: ReadingStyle): ReadingStyle |
| function:701492eab4c253a910c2c12707ffd870 | function | saveReadingStyle | src/services/readingStyle.ts | 25–33 | (accountUid: string, style: ReadingStyle): void |
| function:cc0775c6a53edc809ccdf7d8c225d7da | function | clearReadingStyle | src/services/readingStyle.ts | 35–40 | (accountUid?: string &#124; null): void |
| function:4c6fa009638baf8132289efcd7f579b4 | function | readingStylePrompt | src/services/readingStyle.ts | 42–49 | (accountUid?: string &#124; null, initialStyle?: ReadingStyle): string |
| file:src/services/readings.ts | file | src/services/readings.ts | src/services/readings.ts | 1–121 |  |
| import:50cb59d49ba6e326b22c70ee4ffa43ee | import | ./hostedInference | src/services/readings.ts | 1–1 | import { requestHostedInference } from './hostedInference'; |
| import:d69d9a647f1dec4008cd3f7d51d726f9 | import | ./readingStyle | src/services/readings.ts | 2–2 | import { readingStylePrompt } from './readingStyle'; |
| import:9760e24495cab08cb579d568afa3a5fb | import | ./inferenceTurn | src/services/readings.ts | 3–3 | import { withInferenceTurn } from './inferenceTurn'; |
| import:a055569fbdcb1c8265b890e2900e84d4 | import | ./ephemeris | src/services/readings.ts | 4–4 | import { NatalChartResult } from './ephemeris'; |
| import:3e3e2ffc81b76c7c97ad6f11d380580e | import | ./transits | src/services/readings.ts | 5–5 | import { buildCurrentSkyContext, calculateCurrentSkySnapshot, resolveObservationMoment } from './transits'; |
| import:6b91e3012bb90c1afa8a4d8ca3399528 | import | ./natallyChat | src/services/readings.ts | 6–6 | import { NATALLY_SYSTEM_PROMPT, buildStructuredNatalContext, buildChartPresentationPrompt, buildSynastryContext, parseNatallyResponse, type ChartCue } from './natallyChat'; |
| import:a4e36f30eb8fc532e5868125aafbc51d | import | ./presentation | src/services/readings.ts | 7–7 | import { buildPresentationContext, initialPresentation, type PresentationState, type PresentationCue } from './presentation'; |
| import:d780027551c108430e994f3fdbd17bf7 | import | ./chartTargets | src/services/readings.ts | 8–8 | import { chartFocusKey, resolveChartTarget } from './chartTargets'; |
| import:608bf8c88173ee9bc0d284d641f7686b | import | ./soul | src/services/readings.ts | 9–9 | import { loadSoulState, buildSoulPrompt, rememberCharacterDevelopment } from './soul'; |
| import:e15e0a72a3ac588f65d549950ad5aa1b | import | ./calculationTools | src/services/readings.ts | 10–10 | import { createCalculationSession } from './calculationTools'; |
| interface:de2bd12102e68ac0740f7f0d156d2834 | interface | ReadingRequest | src/services/readings.ts | 12–28 |  |
| property:badac25d7cac41c8b56e8198c0676f0a | property | ReadingRequest::quickNow | src/services/readings.ts | 13–13 | boolean quickNow |
| property:e19154e6fa503529b07a44c064dcbc64 | property | ReadingRequest::seasonalMood | src/services/readings.ts | 14–14 | 'halloween' seasonalMood |
| property:a352812cc1539af5ef93fb16a1576dcb | property | ReadingRequest::accountUid | src/services/readings.ts | 15–15 | string accountUid |
| property:2ac3135fa865c6916633cb9f5f42066f | property | ReadingRequest::presentation | src/services/readings.ts | 16–16 | PresentationState presentation |
| property:97d4afefd699900a7eb620461c3519ad | property | ReadingRequest::isCurrentSession | src/services/readings.ts | 17–17 | () => boolean isCurrentSession |
| property:31425703b66bf018920fd111bc73927a | property | ReadingRequest::type | src/services/readings.ts | 18–18 | 'horoscope' &#124; 'synastry' &#124; 'house' &#124; 'planet' &#124; 'aspect' &#124; 'full_natal' type |
| property:6299f6b93406a3585b9ce23077753321 | property | ReadingRequest::targetKey | src/services/readings.ts | 19–19 | string targetKey |
| property:f72819a5107d697755495cd07c1d6351 | property | ReadingRequest::chart | src/services/readings.ts | 20–20 | NatalChartResult chart |
| property:e70decfc37747f4cfc5f44fc396836ad | property | ReadingRequest::partnerChart | src/services/readings.ts | 21–21 | NatalChartResult &#124; null partnerChart |
| property:0295d939951ab19420fd3fa26a9bf7f5 | property | ReadingRequest::length | src/services/readings.ts | 22–22 | 'short' &#124; 'thorough' &#124; 'exhaustive' length |
| property:2e75ee8e7d7fe13a552fe436856e9c97 | property | ReadingRequest::userLore | src/services/readings.ts | 23–23 | string[] userLore |
| property:a2fd17a3c2b420847f1a7950dafd74fd | property | ReadingRequest::transitDate | src/services/readings.ts | 24–24 | string transitDate |
| property:0603cec70e649994e088f38ea19929f6 | property | ReadingRequest::transitTime | src/services/readings.ts | 25–25 | string transitTime |
| property:03106febb937ddac38ee6eab418cc15c | property | ReadingRequest::transitPlace | src/services/readings.ts | 26–26 | string transitPlace |
| property:c0043f85c712e29c003f309610b1c6f6 | property | ReadingRequest::transitTimezoneOffset | src/services/readings.ts | 27–27 | number transitTimezoneOffset |
| interface:254b6cf16dd714d0c10aa73518b006d6 | interface | ReadingResponse | src/services/readings.ts | 30–41 |  |
| property:6901b3822836e012d9bd7e8d8a3a60d8 | property | ReadingResponse::title | src/services/readings.ts | 31–31 | string title |
| property:1e85cb84dc17890275c5d84fc4d57b10 | property | ReadingResponse::subtitle | src/services/readings.ts | 32–32 | string subtitle |
| property:0b45268b8dc7ef841b383a54d10cf31b | property | ReadingResponse::content | src/services/readings.ts | 33–33 | string content |
| property:4d3fe093241c4569ec0cc6cc31a9d061 | property | ReadingResponse::chartCues | src/services/readings.ts | 34–34 | ChartCue[] chartCues |
| property:69d38b5c1318b3566410299694bff1fa | property | ReadingResponse::presentationVersion | src/services/readings.ts | 35–35 | 1 presentationVersion |
| property:420f7c7e93909f2d7b394f080175c00e | property | ReadingResponse::presentationCues | src/services/readings.ts | 36–36 | PresentationCue[] presentationCues |
| property:518d62b4f91eb36733b9f1ff465d696a | property | ReadingResponse::soulNotice | src/services/readings.ts | 37–37 | string&#124;null soulNotice |
| property:051f26e0b10179d4fe97b900669e7967 | property | ReadingResponse::chartFocusKey | src/services/readings.ts | 38–38 | string chartFocusKey |
| property:7f46a9710f43739c4eb8bbb939baf6e5 | property | ReadingResponse::generatedAt | src/services/readings.ts | 39–39 | string generatedAt |
| property:91c13306e469ec9d18776d3138fb0d39 | property | ReadingResponse::observationSnapshot | src/services/readings.ts | 40–40 | NatalChartResult['currentSky'] observationSnapshot |
| function:a4f05bea83c1f47a7ed5c8a7be8d4efb | function | generateAstrologicalReading | src/services/readings.ts | 44–120 | (req: ReadingRequest): Promise<ReadingResponse> |
| file:src/services/sessionProfile.ts | file | src/services/sessionProfile.ts | src/services/sessionProfile.ts | 1–46 |  |
| interface:119b16908dfaa3a732ea3691f48dcd88 | interface | SessionProfileState | src/services/sessionProfile.ts | 1–6 |  |
| property:cd556aa4d8e311c500e67ddcb7844468 | property | SessionProfileState::uid | src/services/sessionProfile.ts | 2–2 | string &#124; null uid |
| property:3e02d59a862cdb4f06436db0ffeb4d23 | property | SessionProfileState::status | src/services/sessionProfile.ts | 3–3 | 'loading' &#124; 'ready' &#124; 'error' status |
| property:7978d0cb2d7c2b9da589d1a0a693ef0c | property | SessionProfileState::profile | src/services/sessionProfile.ts | 4–4 | Profile &#124; null profile |
| property:8c35ec881a9b7385713a244ce271f259 | property | SessionProfileState::error | src/services/sessionProfile.ts | 5–5 | string &#124; null error |
| function:444b9affbfbba2cb7361c1553f789eda | function | createSessionProfileLoader | src/services/sessionProfile.ts | 8–32 | (   fetchProfile: (uid: string) => Promise<Profile &#124; null>,   onState: (state: SessionProfileState<Profile>) => void, ) |
| function:4e4c8f2ade065939f2c546718f095af2 | function | getEntryStage | src/services/sessionProfile.ts | 34–45 | (   authResolved: boolean,   uid: string &#124; null,   state: SessionProfileState<Profile>,   hasChart: boolean, ) |
| file:src/services/soul.ts | file | src/services/soul.ts | src/services/soul.ts | 1–129 |  |
| import:783638927a7a2b17f18d3a4950a99dc2 | import | ../../SOUL.md?raw | src/services/soul.ts | 1–1 | import soul from '../../SOUL.md?raw'; |
| import:283393d893867a856c476f2cb29e85e4 | import | ./accountStorage | src/services/soul.ts | 2–2 | import { accountStorageKey } from './accountStorage'; |
| import:39739d420c3ca8b74b934e95d21bdbb8 | import | ./atelierMemories | src/services/soul.ts | 3–3 | import { buildAtelierMemoryPrompt } from './atelierMemories'; |
| import:502163d12838f6027dea76540d49cc3a | import | ./historyLifecycle | src/services/soul.ts | 4–4 | import { isNatallyHistoryErasing } from './historyLifecycle'; |
| constant:2d074c069c728dd44d5fe5eaa3d59707 | constant | CHARACTER_KEY | src/services/soul.ts | 6–6 | = 'natally_character_lore_v1' |
| constant:db30d95fd2722fa5dc3ec5fd670c2911 | constant | USER_KEY | src/services/soul.ts | 7–7 | = 'natally_user_disclosures_v1' |
| constant:b8bc73c1c65ab29fb0ec5a0de98fb7b7 | constant | MAX_ENTRIES | src/services/soul.ts | 8–8 | = 80 |
| constant:601716592c7dcc2e989c9021840ae916 | constant | MAX_TEXT | src/services/soul.ts | 9–9 | = 1800 |
| interface:0b4409388193e726f75c9854297283a3 | interface | SoulEntry | src/services/soul.ts | 11–11 |  |
| property:05c6a8b31e846a7668987e99e2272178 | property | SoulEntry::at | src/services/soul.ts | 11–11 | string at |
| property:84d0e53957566c8f842ff40d0503d0c4 | property | SoulEntry::text | src/services/soul.ts | 11–11 | string text |
| property:c5bc6bb1c179d9dd9ab6c87e90b8794b | property | SoulEntry::id | src/services/soul.ts | 11–11 | string id |
| interface:c9f9684e2b7c64842e18831f9f047efd | interface | CharacterLore | src/services/soul.ts | 12–12 |  |
| property:3f9848a8f2d793a1fb8421bf3db1f4b1 | property | CharacterLore::version | src/services/soul.ts | 12–12 | 1 version |
| property:64cab28ce697b0aee1c8772881194ca1 | property | CharacterLore::entries | src/services/soul.ts | 12–12 | SoulEntry[] entries |
| property:8be4b070f74d06c00af058c55e766ead | property | CharacterLore::seed | src/services/soul.ts | 12–12 | string seed |
| property:c61886e747ac5ceb07d06af66d1955ef | property | CharacterLore::owner | src/services/soul.ts | 12–12 | string owner |
| interface:0d4d9317042cf69508fbee373558fa85 | interface | UserLore | src/services/soul.ts | 13–13 |  |
| property:0ccd05a70745cfce23c94e1769a39335 | property | UserLore::version | src/services/soul.ts | 13–13 | 1 version |
| property:0f46d745de92610fbdae4032807c4bdf | property | UserLore::owner | src/services/soul.ts | 13–13 | string owner |
| property:280d49e4a4dfd39e5db9f999e45143c5 | property | UserLore::entries | src/services/soul.ts | 13–13 | SoulEntry[] entries |
| interface:0e3fa2f8c968aaa3af0699573c13ea1a | interface | SoulState | src/services/soul.ts | 14–19 |  |
| property:cfc1f6d1aa71ba384d75e888e4ef4410 | property | SoulState::uid | src/services/soul.ts | 15–15 | string &#124; null uid |
| property:2b3779ca21e4832e524930ff591ea1c7 | property | SoulState::character | src/services/soul.ts | 16–16 | CharacterLore &#124; null character |
| property:382d9258caf2095b9942f63360ba673e | property | SoulState::user | src/services/soul.ts | 17–17 | UserLore &#124; null user |
| property:d5f48f412d54400e204514caade943cd | property | SoulState::notice | src/services/soul.ts | 18–18 | string &#124; null notice |
| constant:e596a92d486419abaeaa7c253cb5f7dc | constant | seeds | src/services/soul.ts | 21–26 | = [   'Natally keeps the little brass hourglass from her final psychic-school exam. She graduated, bu... |
| function:8278da6c6e6ca3d0bfe3c32f4a4e718e | function | seedFor | src/services/soul.ts | 30–34 | (uid: string): string |
| function:3e51d6e80981c540a50a52b5d7c12a71 | function | validEntries | src/services/soul.ts | 36–41 | (value: unknown): value is SoulEntry[] |
| function:8f4d6a2630edb1791b6fa641a4f49c93 | function | readStore | src/services/soul.ts | 43–52 | (key: string, uid: string, character: boolean): T &#124; null |
| function:35861c5dd9f4714b7bfa7d261742644c | function | loadSoulState | src/services/soul.ts | 55–77 | (uid: string &#124; null &#124; undefined): SoulState |
| function:7d54b17f25030f71fb02dd4b567efa93 | function | remember | src/services/soul.ts | 79–95 | (state: SoulState, entry: Pick<SoulEntry, 'id' &#124; 'text'>, kind: 'character' &#124; 'user', isCurrentSession: () => boolean): SoulState |
| function:8fb0dfb02d92b63a16775a9de22fa05f | function | rememberUserDisclosure | src/services/soul.ts | 98–100 | (state: SoulState, entry: Pick<SoulEntry, 'id' &#124; 'text'>, isCurrentSession: () => boolean): SoulState |
| function:7745950f0d6d37c08b55f41d49d89d14 | function | rememberCharacterDevelopment | src/services/soul.ts | 103–105 | (state: SoulState, entry: Pick<SoulEntry, 'id' &#124; 'text'>, isCurrentSession: () => boolean): SoulState |
| function:c90f8f4b59a596d3fd78bf31b672bde2 | function | extractSoulDevelopments | src/services/soul.ts | 108–116 | (raw: string): { text: string; developments: string[] } |
| function:5bc6c6789709651f3a25b42b99b62984 | function | buildSoulPrompt | src/services/soul.ts | 118–128 | (state: SoulState): string |
| file:src/services/supertonic.worker.ts | file | src/services/supertonic.worker.ts | src/services/supertonic.worker.ts | 1–175 |  |
| import:c81000b03a2666419b98d7e48c84d44e | import | @huggingface/transformers | src/services/supertonic.worker.ts | 1–1 | import { env, pipeline } from '@huggingface/transformers'; |
| import:9bd960d172e02b6ba56fe3ab830b432c | import | ./supertonicDownload | src/services/supertonic.worker.ts | 2–2 | import { SupertonicDownloadProgress, SUPERTONIC_MODEL_FILES } from './supertonicDownload'; |
| import:f98376780e10b0e179d7d19e8c448c23 | import | ./supertonicTts | src/services/supertonic.worker.ts | 3–3 | import type { VoiceStatus, VoiceGraphProgress } from './supertonicTts'; |
| import:96abfe41a5ebfa5e681b93cb95f7d1ab | import | ./voiceMeasurements | src/services/supertonic.worker.ts | 4–4 | import type { VoiceMeasurement } from './voiceMeasurements'; |
| constant:4c2ff884c7e7d9cd02d059824fbfcb59 | constant | MODEL_ID | src/services/supertonic.worker.ts | 5–5 | = 'onnx-community/Supertonic-TTS-ONNX' |
| constant:208bc1eab02ec5e359ec9361eb4c1bb2 | constant | REVISION | src/services/supertonic.worker.ts | 6–6 | = 'cff123c84b0655d9d647641f1b532c3cbb8f7faa' |
| variable:15be3a7d602c8b7552a4aa3fa7970e9d | variable | engine | src/services/supertonic.worker.ts | 13–13 | = null |
| variable:61a14f3f832f52aefabeda63c406fdb7 | variable | backend | src/services/supertonic.worker.ts | 14–14 | = 'wasm' |
| variable:d6dd958589ca4ba8969dda5f09d369ef | variable | queue | src/services/supertonic.worker.ts | 15–15 | = Promise.resolve() |
| constant:70820d5392cbf19eeb8df9e26963eba5 | constant | voices | src/services/supertonic.worker.ts | 16–16 | = new Map<string, Float32Array>() |
| constant:8ffa8a9120150040365ea7eae7adab13 | constant | clips | src/services/supertonic.worker.ts | 17–17 | = new Map<string, { samples: Float32Array; sampleRate: number }>() |
| variable:3b75828bd0cac167a85cd2dc9e22803c | variable | clipBytes | src/services/supertonic.worker.ts | 18–18 | = 0 |
| variable:e6aa9f5991152a662e11459c1fe578f7 | variable | current | src/services/supertonic.worker.ts | 19–19 | = { phase: 'idle', message: '' } |
| variable:cfe4839ae09f1e2c81330f610d4f49e6 | variable | requestContext | src/services/supertonic.worker.ts | 20–20 | = { runId: '', workload: 'preload', memoryReuse: false, start: 0, speed: 1 } |
| constant:161e450d953e34afc3e7d55ff7d694e8 | constant | graphs | src/services/supertonic.worker.ts | 21–21 | = new Map<string, VoiceGraphProgress>() |
| function:216e9d77a9ce0380e97aa2d5a2ebe1a7 | function | measure | src/services/supertonic.worker.ts | 22–26 | (event: Omit<VoiceMeasurement, 'runId' &#124; 'atMs' &#124; 'revision'>) |
| function:f16fe8410d3b4446abb94257a7d157e8 | function | status | src/services/supertonic.worker.ts | 27–30 | (phase: VoiceStatus['phase'], message: string, extra: Partial<VoiceStatus> = {}) |
| function:a1d818c8db1608c7ae8115e04c736e6a | function | loadEngine | src/services/supertonic.worker.ts | 44–97 | (forceWasm = false) |
| function:1d89ba90d52ff21455359a1def1c3719 | function | loadEngine::progress_callback | src/services/supertonic.worker.ts | 60–76 | (info: any) |
| function:9705c345334d8644cfd83d43f43217f7 | function | synthesize | src/services/supertonic.worker.ts | 98–173 | (data: { id: number; text: string; preload?: boolean; voice?: string; speed?: number; forceWasm?: boolean }) |
| constant:ea9fb5eb2804288ce4b0d47726d1786a | constant | SUPERTONIC_MODEL_FILES | src/services/supertonicDownload.ts | 1–11 | = Object.freeze({   'config.json': 247,   'tokenizer.json': 2038,   'tokenizer_config.json': 119, ... |
| file:src/services/supertonicDownload.ts | file | src/services/supertonicDownload.ts | src/services/supertonicDownload.ts | 1–33 |  |
| class:48b78ffd6842938df36acee280bcbcd4 | class | SupertonicDownloadProgress | src/services/supertonicDownload.ts | 13–32 |  |
| property:30477b19521a8a9c3c63197f9b36f93a | property | SupertonicDownloadProgress::loaded | src/services/supertonicDownload.ts | 14–14 | loaded |
| property:8e071b8091b4d6ca5c559475a8a7b4ae | property | SupertonicDownloadProgress::sources | src/services/supertonicDownload.ts | 15–15 | sources |
| property:0d7ba7c2a0de79fbcd0bc5e93bdc0506 | property | SupertonicDownloadProgress::attemptBytes | src/services/supertonicDownload.ts | 16–16 | attemptBytes |
| method:56ee341937530a0bc7fa40a0a156df6c | method | SupertonicDownloadProgress::totalBytes | src/services/supertonicDownload.ts | 17–17 |  |
| method:e36cbc6106fb2d4756d18ea96570de22 | method | SupertonicDownloadProgress::update | src/services/supertonicDownload.ts | 19–29 | (event: { file?: string; status?: string; loaded?: number; source?: 'cache' &#124; 'network' &#124; 'unknown' }) |
| method:bcc6233bf45ab8cb9c2e6aae05fe6750 | method | SupertonicDownloadProgress::lastReadBytes | src/services/supertonicDownload.ts | 30–30 | (file: string) |
| method:48f4d548ae7bfb872091de842fdda0ac | method | SupertonicDownloadProgress::files | src/services/supertonicDownload.ts | 31–31 | () |
| file:src/services/supertonicTts.ts | file | src/services/supertonicTts.ts | src/services/supertonicTts.ts | 1–154 |  |
| import:6d738c4e5c01a34064809df9618e564f | import | ./voiceMeasurements | src/services/supertonicTts.ts | 1–1 | import { voiceMeasurements, VOICE_REVISION, type VoiceMeasurement } from './voiceMeasurements'; |
| interface:6675423ef259f3be70a65bdad5adf3a4 | interface | LocalSpeech | src/services/supertonicTts.ts | 2–2 |  |
| property:0918a7c885468dcd58e73db2124a6c60 | property | LocalSpeech::clipReuse | src/services/supertonicTts.ts | 2–2 | boolean clipReuse |
| property:1e4108801f7d6524b8479e7d3614c46d | property | LocalSpeech::sampleRate | src/services/supertonicTts.ts | 2–2 | number sampleRate |
| property:6e4add320d2442f1f248a9d2bd5cb0aa | property | LocalSpeech::samples | src/services/supertonicTts.ts | 2–2 | Float32Array samples |
| property:d44e385c1873582fc776ae1ebd36782e | property | LocalSpeech::generationMs | src/services/supertonicTts.ts | 2–2 | number generationMs |
| property:eef5735f56144aa1fb9bda045d43ba6d | property | LocalSpeech::backend | src/services/supertonicTts.ts | 2–2 | string backend |
| interface:111ee1e876e125f7612bed361ab6069d | interface | VoiceGraphProgress | src/services/supertonicTts.ts | 3–3 |  |
| property:2f8c5ad91bdb21f874879730f9cf33a5 | property | VoiceGraphProgress::durationMs | src/services/supertonicTts.ts | 3–3 | number durationMs |
| property:38bb840a7eafafbfa2cd26fb9b1b827b | property | VoiceGraphProgress::expected | src/services/supertonicTts.ts | 3–3 | number expected |
| property:70897538d96236a09689b6aa24d23555 | property | VoiceGraphProgress::state | src/services/supertonicTts.ts | 3–3 | 'start' &#124; 'complete' &#124; 'error' state |
| property:79d607d488b4a42879980390f0a4b4ab | property | VoiceGraphProgress::backend | src/services/supertonicTts.ts | 3–3 | string backend |
| property:a076d506554d3ea307982de80a668601 | property | VoiceGraphProgress::startedAt | src/services/supertonicTts.ts | 3–3 | number startedAt |
| property:db2f7ef11909ea88c75c5d28f1baa01f | property | VoiceGraphProgress::operation | src/services/supertonicTts.ts | 3–3 | 'session' &#124; 'run' operation |
| property:dffef300e7fa4f4ed31d7ca249dfaa9a | property | VoiceGraphProgress::file | src/services/supertonicTts.ts | 3–3 | string file |
| property:efad673e62205a761b73933f38aa57ff | property | VoiceGraphProgress::completed | src/services/supertonicTts.ts | 3–3 | number completed |
| interface:8cee35a966fa22f4abaad01266f059ee | interface | VoiceStatus | src/services/supertonicTts.ts | 4–16 |  |
| property:c4c9ed5d0e020df64a1c1dac6faf8594 | property | VoiceStatus::phase | src/services/supertonicTts.ts | 5–5 | 'idle' &#124; 'loading' &#124; 'preparing' &#124; 'ready' &#124; 'synthesizing' &#124; 'error' phase |
| property:3123db17e2b2ced6a7c805b73d3a1f35 | property | VoiceStatus::message | src/services/supertonicTts.ts | 6–6 | string message |
| property:7a49f97bc261a4868fc904f059e5ec41 | property | VoiceStatus::loadedBytes | src/services/supertonicTts.ts | 7–7 | number loadedBytes |
| property:890a1aacb8d33e1c9dee9182a1ce4e2e | property | VoiceStatus::totalBytes | src/services/supertonicTts.ts | 8–8 | number totalBytes |
| property:f21e0d5dd5067ed47426f3c5b5e8d7ec | property | VoiceStatus::file | src/services/supertonicTts.ts | 9–9 | string file |
| property:db9e9439f28cc587e1ecdd352be36452 | property | VoiceStatus::files | src/services/supertonicTts.ts | 10–10 | { file: string; loadedBytes: number; totalBytes: number; source: 'cache' &#124; 'network' &#124; 'unknown' }[] files |
| property:dba8305c1be160db2c70f3d51bc6d401 | property | VoiceStatus::graphs | src/services/supertonicTts.ts | 11–11 | VoiceGraphProgress[] graphs |
| property:636797ed3c1c96c73a3f2e2f8db904a8 | property | VoiceStatus::startedAt | src/services/supertonicTts.ts | 12–12 | number startedAt |
| property:72b0f0caa06862b2ee374047c7f6f050 | property | VoiceStatus::confirmedAt | src/services/supertonicTts.ts | 13–13 | number confirmedAt |
| property:62a679d1af0b973b1ce605bc8733c9df | property | VoiceStatus::runtimeEvent | src/services/supertonicTts.ts | 14–14 | boolean runtimeEvent |
| property:6b3f5eb2932067390f5cf0237afbdff7 | property | VoiceStatus::heartbeatAt | src/services/supertonicTts.ts | 15–15 | number heartbeatAt |
| variable:8d3078a337452521d350e2010b148190 | variable | status | src/services/supertonicTts.ts | 17–17 | = { phase: 'idle', message: 'Supertonic local voice · downloads on first use' } |
| constant:20bb421f2218d7b9ed4271ef1c605d22 | constant | listeners | src/services/supertonicTts.ts | 18–18 | = new Set<(value: VoiceStatus) => void>() |
| variable:0136daf661251f351cbccc3fff7b7fc2 | variable | worker | src/services/supertonicTts.ts | 19–19 | = null |
| variable:780cd54a94047e886376e9f3a159ad74 | variable | nextId | src/services/supertonicTts.ts | 20–20 | = 0 |
| constant:06d716d291dfa87eff2fd7cce5d210f1 | constant | pending | src/services/supertonicTts.ts | 21–21 | = new Map<number, { resolve: (audio: LocalSpeech &#124; null) => void; reject: (error: Error) => void; time... |
| variable:9e1ac8bc523f34ba355b40426738bd9d | variable | preload | src/services/supertonicTts.ts | 22–22 | = null |
| variable:4e4d0e6f052c7e6a4a088496e3ab80fc | variable | forceWasm | src/services/supertonicTts.ts | 25–25 | = false |
| function:5297e6321694e3e8e963dfae1fd160ff | function | reportVoiceStatus | src/services/supertonicTts.ts | 27–30 | (value: VoiceStatus) |
| function:83ad09b08f6dac7f16b7a7c46c31389b | function | subscribeVoiceStatus | src/services/supertonicTts.ts | 31–35 | (listener: (value: VoiceStatus) => void) |
| function:ab88e346cc47e110211194446b1994c5 | function | resetWorker | src/services/supertonicTts.ts | 36–47 | (message: string, recordInterruption = true) |
| function:e4554d5f38f5c87dc5bb4ac23c0ceb24 | function | splitSpeechText | src/services/supertonicTts.ts | 48–73 | (text: string, limit = 300): string[] |
| function:b2fe9fbe484ae3b10986b0a733bf7ac4 | function | requestWorker | src/services/supertonicTts.ts | 74–124 | (payload: { text?: string; preload?: boolean; voice?: string; speed?: number }): Promise<LocalSpeech &#124; null> |
| function:f34246a4722f72f85672c5869339a3fc | function | initSupertonic | src/services/supertonicTts.ts | 126–132 | (): Promise<void> |
| function:69294cc6cc9275e251ab0c36262569f6 | function | scheduleSupertonicPreload | src/services/supertonicTts.ts | 134–145 | (): () => void |
| function:a8972a627a57f0ee034cb848f3c8f841 | function | scheduleSupertonicPreload::start | src/services/supertonicTts.ts | 138–138 | () |
| function:102e493fcf5bc8d11542e6d6331c2569 | function | supertonicSpeak | src/services/supertonicTts.ts | 147–153 | (text: string, options: { voice?: string; speed?: number } = {}): Promise<LocalSpeech> |
| file:src/services/torusGestures.ts | file | src/services/torusGestures.ts | src/services/torusGestures.ts | 1–91 |  |
| function:9aab77b87afe47db105ccceb27a178cd | function | getTorusZoomDistance | src/services/torusGestures.ts | 1–5 | (distance: number, factor: number): number |
| function:952ac4393b0ee97806998ac08b6532fc | function | bindTorusTouch | src/services/torusGestures.ts | 7–90 | (element: HTMLElement, callbacks: {   start: (x: number, y: number) => void;   move: (x: number, y: number) => void;   end: (allowMomentum: boolean) => void;   zoom: (factor: number) => void; }) |
| function:ce112459a6bb01e34ddb0fe2aae12aa7 | function | bindTorusTouch::separation | src/services/torusGestures.ts | 19–22 | (touches: TouchList) |
| function:5af060e0b6f5bf2d9e90ab8c00754432 | function | bindTorusTouch::resetBaseline | src/services/torusGestures.ts | 23–40 | (event: TouchEvent) |
| function:777f1df9d5ae66106ad9b7f8b598d2c7 | function | bindTorusTouch::onStart | src/services/torusGestures.ts | 41–44 | (event: TouchEvent) |
| function:0700679ececec95c143642d6000cc9c7 | function | bindTorusTouch::onMove | src/services/torusGestures.ts | 45–65 | (event: TouchEvent) |
| function:30983be6d9a97a01ed56ffda59873750 | function | bindTorusTouch::onCancel | src/services/torusGestures.ts | 66–74 | () |
| file:src/services/transits.ts | file | src/services/transits.ts | src/services/transits.ts | 1–112 |  |
| import:ce6f85efb5ec32107541e03665a46f60 | import | ./ephemeris | src/services/transits.ts | 1–1 | import type { NatalChartResult, CurrentSkySnapshot, AspectChordData } from './ephemeris'; |
| interface:3b5e9f28cc85807fa0dd031191511488 | interface | CurrentLocation | src/services/transits.ts | 3–8 |  |
| property:48b2d3224c18ee8e7f0203cc27d5ae72 | property | CurrentLocation::name | src/services/transits.ts | 4–4 | string name |
| property:aaf27001ead2c4049ae315ca86849d36 | property | CurrentLocation::latitude | src/services/transits.ts | 5–5 | number latitude |
| property:63e59138a3ad27488c8773a63fd82598 | property | CurrentLocation::longitude | src/services/transits.ts | 6–6 | number longitude |
| property:cbb1e4ba3648e5bca0de693ce6671e8f | property | CurrentLocation::timeZone | src/services/transits.ts | 7–7 | string timeZone |
| function:92f3939db264c0ff7bf2bb3ca6fa0435 | function | requestCurrentLocation | src/services/transits.ts | 10–21 | (): Promise<CurrentLocation> |
| function:ed7f97fe4f52afa57b3457e77fca22dd | function | calculateTransitAspects | src/services/transits.ts | 23–42 | (   natal: Array<{ name: string; lon: number }>,   current: Array<{ name: string; lon: number }>, ) |
| function:c93b02450390286952975275fd8846ae | function | resolveObservationMoment | src/services/transits.ts | 44–53 | (date?: string, time?: string, offset?: number): Date |
| function:ccab34438e75b7153d821e85c0099ec2 | function | calculateCurrentSkySnapshot | src/services/transits.ts | 55–89 | (chart: NatalChartResult, now = new Date()): Promise<CurrentSkySnapshot> |
| function:2b87c8280d4e3c15541843ea5b811e43 | function | buildCurrentSkyContext | src/services/transits.ts | 91–111 | (chart: NatalChartResult, now?: Date): Promise<string> |
| constant:a042cdf214f822f60540b0eb47b0ee5e | constant | VOICE_REVISION | src/services/voiceMeasurements.ts | 1–1 | = 'cff123c84b0655d9d647641f1b532c3cbb8f7faa' |
| file:src/services/voiceMeasurements.ts | file | src/services/voiceMeasurements.ts | src/services/voiceMeasurements.ts | 1–95 |  |
| interface:af1508e63b4f85d594d678cd9456be9c | interface | VoiceMeasurement | src/services/voiceMeasurements.ts | 2–19 |  |
| property:b2504a83831342b3aa8df454c78fb202 | property | VoiceMeasurement::operation | src/services/voiceMeasurements.ts | 3–3 | 'request' &#124; 'load' &#124; 'file' &#124; 'session' &#124; 'run' operation |
| property:1a4879b177873bb1a5a3cedbd376ee59 | property | VoiceMeasurement::state | src/services/voiceMeasurements.ts | 4–4 | 'start' &#124; 'complete' &#124; 'error' state |
| property:8e0cf137caaa937432f7edd5e1e00533 | property | VoiceMeasurement::runId | src/services/voiceMeasurements.ts | 5–5 | string runId |
| property:6e8981041df8b671a5ec0dfd2d31d395 | property | VoiceMeasurement::atMs | src/services/voiceMeasurements.ts | 6–6 | number atMs |
| property:2715ed3904f1d136a2dd44b5824180bd | property | VoiceMeasurement::durationMs | src/services/voiceMeasurements.ts | 7–7 | number durationMs |
| property:7e4ac6e56c31ea287d8c9e9fbe2a8fde | property | VoiceMeasurement::file | src/services/voiceMeasurements.ts | 8–8 | string file |
| property:2d6275747ed2a982f3251dfa377d7c6c | property | VoiceMeasurement::backend | src/services/voiceMeasurements.ts | 9–9 | string backend |
| property:39ae80e0b4655df8c4de75ac059a7f33 | property | VoiceMeasurement::source | src/services/voiceMeasurements.ts | 10–10 | 'cache' &#124; 'network' &#124; 'unknown' source |
| property:458da383efeb7828fdb9abd4d561cf46 | property | VoiceMeasurement::workload | src/services/voiceMeasurements.ts | 11–11 | string workload |
| property:7827fc1c85a86322a91564b0c571e4a3 | property | VoiceMeasurement::revision | src/services/voiceMeasurements.ts | 12–12 | string revision |
| property:12a0f44bd4c2a2832e5b826f20e37eec | property | VoiceMeasurement::memoryReuse | src/services/voiceMeasurements.ts | 13–13 | boolean memoryReuse |
| property:ccb6f6d2be8405e839ecb334fbb4eea7 | property | VoiceMeasurement::clipReuse | src/services/voiceMeasurements.ts | 14–14 | boolean clipReuse |
| property:1f672165135ed02e5c1573a01d765c58 | property | VoiceMeasurement::speed | src/services/voiceMeasurements.ts | 15–15 | number speed |
| property:9aecd1ccb758cb353a95b6b736eaf081 | property | VoiceMeasurement::steps | src/services/voiceMeasurements.ts | 16–16 | number steps |
| property:caab9d9eac66ba628257d54caa7b3563 | property | VoiceMeasurement::capturedStart | src/services/voiceMeasurements.ts | 17–17 | boolean capturedStart |
| property:f89eec281f63bc21305a08cdb2228303 | property | VoiceMeasurement::bytes | src/services/voiceMeasurements.ts | 18–18 | number bytes |
| constant:a21b16122f30ea254c5d7d739ef058d3 | constant | SURVEY_OPTIONS | src/services/voiceMeasurements.ts | 20–28 | = {   device: ['unknown', 'phone', 'tablet', 'laptop', 'desktop'],   os: ['unknown', 'android', 'ios... |
| type_alias:037cadda9bb2dd4e8728f05a348ce01e | type_alias | VoiceSurvey | src/services/voiceMeasurements.ts | 29–29 |  |
| constant:1b4ddd619fe9889293911028f27459be | constant | EMPTY_SURVEY | src/services/voiceMeasurements.ts | 30–30 | = Object.fromEntries(Object.keys(SURVEY_OPTIONS).map(key => [key, 'unknown'])) as VoiceSurvey |
| function:c84a59219a3c0203570d0f8095de39a5 | function | summarizeMeasurements | src/services/voiceMeasurements.ts | 32–51 | (events: readonly VoiceMeasurement[]) |
| class:1d61eb9f529e96b95231c494d3a0fd29 | class | VoiceMeasurementStore | src/services/voiceMeasurements.ts | 53–92 |  |
| property:af6a137364f34c5ed001758e15ef9a44 | property | VoiceMeasurementStore::enabled | src/services/voiceMeasurements.ts | 54–54 | enabled |
| property:779f4408106210e9d485ac43b4fadb07 | property | VoiceMeasurementStore::events | src/services/voiceMeasurements.ts | 55–55 | VoiceMeasurement[] events |
| property:55c783a33ccccd7b55a8ae7f810562f7 | property | VoiceMeasurementStore::omittedEvents | src/services/voiceMeasurements.ts | 56–56 | omittedEvents |
| property:90838821ee54278f579de3fb8577588b | property | VoiceMeasurementStore::reportId | src/services/voiceMeasurements.ts | 57–57 | reportId |
| property:9fc2ba4bd8240b09eb7f9ee56b3a2bee | property | VoiceMeasurementStore::snapshotSequence | src/services/voiceMeasurements.ts | 58–58 | snapshotSequence |
| property:5b5001df265ac6daa21ebdcda4bd4e6a | property | VoiceMeasurementStore::starts | src/services/voiceMeasurements.ts | 59–59 | starts |
| method:7c7c31ce88ce43eef770fdfe0e7e3fb8 | method | VoiceMeasurementStore::constructor | src/services/voiceMeasurements.ts | 60–60 | (private readonly limit = 10000) |
| method:3de702b95b4e531171f22142cf7f3623 | method | VoiceMeasurementStore::setEnabled | src/services/voiceMeasurements.ts | 61–61 | (value: boolean) |
| method:2e531aeec95ab6dcedd78fd44f14261d | method | VoiceMeasurementStore::record | src/services/voiceMeasurements.ts | 62–78 | (event: VoiceMeasurement) |
| method:a682385d75f72a68624f05edbf269a4a | method | VoiceMeasurementStore::snapshot | src/services/voiceMeasurements.ts | 79–79 | () |
| method:21ddf2f7531eea225338922b9c382716 | method | VoiceMeasurementStore::clear | src/services/voiceMeasurements.ts | 80–80 | () |
| method:05b4b8e28b37f94e09018253852aec22 | method | VoiceMeasurementStore::export | src/services/voiceMeasurements.ts | 81–91 | (survey: VoiceSurvey) |
| constant:63583d550d659b0ff7497dd2f1c61e01 | constant | voiceMeasurements | src/services/voiceMeasurements.ts | 94–94 | = new VoiceMeasurementStore() |
| file:src/services/voiceService.ts | file | src/services/voiceService.ts | src/services/voiceService.ts | 1–433 |  |
| import:0b64e7091b8aa318b50532f13d8341ad | import | ./supertonicTts | src/services/voiceService.ts | 1–1 | import { supertonicSpeak, splitSpeechText, reportVoiceStatus } from './supertonicTts'; |
| constant:3c1dca0ecfeffde7a2a066adb05f06d6 | constant | NATALLY_VOICE_SAMPLE | src/services/voiceService.ts | 3–3 | = "Okay, tiny cosmic plot twist. Your psychic is still figuring things out too. Let's take it one thin... |
| interface:162b8351d085b8d17645ad2ba74e43be | interface | VoiceSettings | src/services/voiceService.ts | 5–19 |  |
| property:48feaac34b3cdf4cbea13e6cde8d7221 | property | VoiceSettings::resourceMode | src/services/voiceService.ts | 6–6 | 'auto' &#124; 'gentle' resourceMode |
| property:eb27994534455a9ddc84facaef2ea4da | property | VoiceSettings::tone | src/services/voiceService.ts | 7–7 | 'natural' &#124; 'soft' &#124; 'warm' tone |
| property:70f3011f838856a121b6b0d49392a6d8 | property | VoiceSettings::readingAloud | src/services/voiceService.ts | 8–8 | boolean readingAloud |
| property:d7a08a2e9b5d68185dd9d619b9b942f8 | property | VoiceSettings::language | src/services/voiceService.ts | 9–9 | string language |
| property:7c79ed56597a89516daf6d1e2a467f61 | property | VoiceSettings::accentMode | src/services/voiceService.ts | 10–10 | 'moldavian' &#124; 'slavic' &#124; 'standard' accentMode |
| property:f15c8b6bcc56fd26bededa3ce1fa8cd2 | property | VoiceSettings::rate | src/services/voiceService.ts | 11–11 | number rate |
| property:23c81186ff81088569867702f33c4f2a | property | VoiceSettings::pitch | src/services/voiceService.ts | 12–12 | number pitch |
| property:474261c251d6477f9d1672bdc4437b2b | property | VoiceSettings::ttsModel | src/services/voiceService.ts | 13–13 | 'supertonic-onnx' ttsModel |
| property:c4e4a4f661bf653ef48a4c8c01a8be11 | property | VoiceSettings::aiVoiceName | src/services/voiceService.ts | 14–14 | string aiVoiceName |
| property:383b56cb90e980a7a8af14ef5d08e711 | property | VoiceSettings::kawaiiMode | src/services/voiceService.ts | 15–15 | 'cheeky_sidekick' &#124; 'kawaii_chibi' &#124; 'moldavian_confidante' &#124; 'celestial_oracle' &#124; 'natural_companion' kawaiiMode |
| property:1c472e953e0c7700dba6c1715277f285 | property | VoiceSettings::kawaiiIntensity | src/services/voiceService.ts | 16–16 | number kawaiiIntensity |
| property:c324fbcc09860ee2b41e7778a24ace17 | property | VoiceSettings::spriteMode | src/services/voiceService.ts | 17–17 | 'wander' &#124; 'follow' &#124; 'docked' spriteMode |
| property:1b707708e304b6746d010fb20c3de3ef | property | VoiceSettings::customAvatarUrl | src/services/voiceService.ts | 18–18 | string &#124; null customAvatarUrl |
| constant:66f563800b94039572c590754f4243bc | constant | STORAGE_KEY | src/services/voiceService.ts | 21–21 | = 'astrosphere_natally_voice_config_v3' |
| constant:57577790cae411b2fb5dbddb19a067b0 | constant | SUPPORTED_VOICES | src/services/voiceService.ts | 22–22 | = ['F1', 'F2', 'F3', 'F4', 'F5', 'M1', 'M2'] |
| function:32ffab4bbf1f1364011e6184b5dcfe94 | function | getVoicePreset | src/services/voiceService.ts | 24–32 | (env: Record<string, string &#124; undefined>) |
| constant:0c220e5e2564753db3dda84512a1fd69 | constant | voicePreset | src/services/voiceService.ts | 34–34 | = getVoicePreset(import.meta.env ?? {}) |
| constant:25bc068799bb9a9e79148596818d02eb | constant | voicePresetVersion | src/services/voiceService.ts | 35–35 | = `${voicePreset.aiVoiceName}:${voicePreset.pitch}:${voicePreset.rate}` |
| constant:4b7676ec08a1a12f88fc2bf33e32fad6 | constant | configuredChunkSize | src/services/voiceService.ts | 36–36 | = Number(import.meta.env?.VITE_NATALLY_SPEECH_CHUNK_CHARS) |
| constant:4de21964c9394ba9703e181fe0ec3475 | constant | speechChunkSize | src/services/voiceService.ts | 37–37 | = Number.isInteger(configuredChunkSize) && configuredChunkSize >= 100 && configuredChunkSize <= 800 ? ... |
| function:ae9271f0d2a40dad1be73e282c80748c | function | getSpeechPolicy | src/services/voiceService.ts | 40–53 | (   mode: VoiceSettings['resourceMode'],   capabilities: { hardwareConcurrency?: number; deviceMemory?: number },   realTimeFactor?: number, ): { chunkChars: number; prefetch: boolean } |
| constant:2affba08f2e81108df794694e90f64e8 | constant | DEFAULT_VOICE_SETTINGS | src/services/voiceService.ts | 55–67 | = {   resourceMode: 'auto',   tone: 'soft',   readingAloud: true, // Enabled by default   language... |
| function:1edbe75f89a4b9e0101eb6249260d8df | function | loadVoiceSettings | src/services/voiceService.ts | 69–91 | (): VoiceSettings |
| function:6824adc0384ea019b279efdfac611c62 | function | saveVoiceSettings | src/services/voiceService.ts | 93–99 | (settings: VoiceSettings): void |
| function:d08ed2c2f271934272e92e5cc9386f40 | function | prepareSpeechText | src/services/voiceService.ts | 102–104 | (rawText: string): string |
| function:5ff116ee095c53fd90fa6f81fa07727f | function | prepareSpeechWithOffsets | src/services/voiceService.ts | 106–141 | (rawText: string): { text: string; sourceOffsets: number[] } |
| variable:9df39a481832b1fc45c7d38c8f9a6dc0 | variable | sharedAudioContext | src/services/voiceService.ts | 143–143 | = null |
| variable:e5a2d7eea623886f2d2c6bc84f9622d2 | variable | currentBufferSource | src/services/voiceService.ts | 144–144 | = null |
| variable:896f7a6ea800435e3c417686b0240ece | variable | generation | src/services/voiceService.ts | 145–145 | = 0 |
| variable:6b175ed883eae2d7aeb3da41ecf168ce | variable | finishPlayback | src/services/voiceService.ts | 146–146 | = null |
| variable:90ba2668618f088cf1e57511b0ab35e1 | variable | finishUtterance | src/services/voiceService.ts | 147–147 | = null |
| function:20cbc7d4080008ec02481272647c8e95 | function | isSpeechBusy | src/services/voiceService.ts | 148–148 | (): boolean |
| function:65c05063b84bf83559bd26d132f6a793 | function | getSharedAudioContext | src/services/voiceService.ts | 150–157 | (): AudioContext &#124; null |
| function:5f331fbbd1ef6b83584ca28174cd7ae3 | function | unlockAudio | src/services/voiceService.ts | 158–161 | (): void |
| variable:1fae6f6063c070046df695c73a8e640d | variable | performingSource | src/services/voiceService.ts | 168–168 | = null |
| variable:3f16304222ac79e6d8e34859d1c32779 | variable | performanceCharIndex | src/services/voiceService.ts | 169–169 | = 0 |
| variable:511991b31651f423c6df00ee7933ae20 | variable | mishapTimer | src/services/voiceService.ts | 170–170 | = null |
| variable:5c4e34a17121119fb69bbd4a41d6f685 | variable | mishapOwner | src/services/voiceService.ts | 171–171 | = null |
| property:2f6dd5979a03526f4ca10e4d497c03fb | property | NatallyVoicePerformance::state | src/services/voiceService.ts | 172–172 | state: 'started' &#124; 'word' &#124; 'ended' |
| property:357e208a27d7cafb7888e6454ae340cc | property | NatallyVoicePerformance::durationMs | src/services/voiceService.ts | 172–172 | durationMs?: number |
| property:cae8bcd4361f23bfad110cc2841c77b3 | property | NatallyVoicePerformance::charIndex | src/services/voiceService.ts | 172–172 | charIndex?: number |
| property:ed0988a9e4ddaa21681416eed3e9f827 | property | NatallyVoicePerformance::text | src/services/voiceService.ts | 172–172 | text?: string |
| type_alias:827dc05cc37d6566c2b0180c0746685d | type_alias | NatallyVoicePerformance | src/services/voiceService.ts | 172–172 |  |
| function:1e109b12e140df2451f2e3aa58360869 | function | dispatchNatallyVoicePerformance | src/services/voiceService.ts | 173–176 | (detail: NatallyVoicePerformance): void |
| interface:44f22424a49b743d49ca493037a7580b | interface | NatallyAudioSegment | src/services/voiceService.ts | 210–210 |  |
| property:38d100e1d1b5c6f8cd6fca2b1433c88f | property | NatallyAudioSegment::pitch | src/services/voiceService.ts | 210–210 | number pitch |
| property:4eb6d5afb2023d345fece326196e90a7 | property | NatallyAudioSegment::sampleRate | src/services/voiceService.ts | 210–210 | number sampleRate |
| property:75a242cae2c8087f4e87e03269faa825 | property | NatallyAudioSegment::sourceEnd | src/services/voiceService.ts | 210–210 | number sourceEnd |
| property:7806086dd29013d54bcc30d695805604 | property | NatallyAudioSegment::samples | src/services/voiceService.ts | 210–210 | Float32Array samples |
| property:ed18f0e6a1962d9a9ff5509aae12eec6 | property | NatallyAudioSegment::sourceOffset | src/services/voiceService.ts | 210–210 | number sourceOffset |
| interface:69f2501c759e04853b36fd0fec86aac8 | interface | NatallySpeechOptions | src/services/voiceService.ts | 211–214 |  |
| property:f6a90cb9d4a4a2a18ce46ca2876f8332 | property | NatallySpeechOptions::onAudioSegment | src/services/voiceService.ts | 212–212 | (segment: NatallyAudioSegment) => void onAudioSegment |
| property:399f935bce13693153da41d3c9cb8db3 | property | NatallySpeechOptions::onPreparing | src/services/voiceService.ts | 213–213 | (preparing: boolean) => void onPreparing |
| variable:53898fc73c3e479876a4a3a2cb79528b | variable | externalPlaybackStop | src/services/voiceService.ts | 215–215 | = null |
| function:b184aea2708479ef3952e9c5c8f5a000 | function | registerExternalPlaybackStop | src/services/voiceService.ts | 216–220 | (stop: () => void): () => void |
| constant:23ef36c5d4ab8db77076f2081c31451b | constant | WAITING_PHRASES | src/services/voiceService.ts | 221–226 | = [   {id:'look',text:'Let me look into that.'},   {id:'moment',text:'Give me a moment with this.'},... |
| variable:3e61d4c8f3157ae023b223e9a6971ef0 | variable | waitingIndex | src/services/voiceService.ts | 227–227 | = -1 |
| constant:ad4ac907714d7b4a98e4df615b295a81 | constant | waitingBuffers | src/services/voiceService.ts | 228–228 | = new Map<string,Promise<AudioBuffer>>() |
| function:489c0d6e0d859f6df71e9260bbdddd20 | function | loadWaitingBuffer | src/services/voiceService.ts | 229–242 | (id:string): Promise<AudioBuffer> |
| function:8308ba1a9c6eb29027e290733abba7d4 | function | prepareWaitingVoice | src/services/voiceService.ts | 244–247 | (settings:VoiceSettings): void |
| function:3d7cd4726db966deb1e922b30e609571 | function | startWaitingUtterance | src/services/voiceService.ts | 248–285 | (settings:VoiceSettings): {caption:string;cancel:()=>void} |
| function:cb048057afbae7def5478f7a3bff0533 | function | startWaitingUtterance::unregister | src/services/voiceService.ts | 254–254 | () |
| function:47de6732afcd0cb2d3ef174f9d4d6e22 | function | startWaitingUtterance::cancel | src/services/voiceService.ts | 255–262 | () |
| function:c0bf3ff1178c66d76b867e700fc6fd78 | function | startWaitingUtterance::emit | src/services/voiceService.ts | 279–279 | () |
| function:7f8b5ea18388ba0459b45c8c88a69c05 | function | stopSpeaking | src/services/voiceService.ts | 287–300 | (): void |
| function:d30cf2068bc8da228417bd6a69a9735c | function | speakNatallyText | src/services/voiceService.ts | 301–432 | (   text: string,   settings: VoiceSettings,   onStart?: () => void,   onEnd?: () => void,   onWordBoundary?: (charIndex: number, charLength?: number) => void,   options: NatallySpeechOptions = {} ): Promise<boolean> |
| function:5a8736ffc62ece81d2159671a913c341 | function | speakNatallyText::end | src/services/voiceService.ts | 316–322 | () |
| function:a01053dd6ef1e29d5a26e70c2b8d6f0b | function | speakNatallyText::synthesize | src/services/voiceService.ts | 336–337 | (chunk: string) |
| function:3998444f6c70120dc7f3bb4882d2f6e7 | function | speakNatallyText::emitWord | src/services/voiceService.ts | 386–396 | () |
| function:c1436b99e914d0b3aa00ef985e15da3e | function | speakNatallyText::finish | src/services/voiceService.ts | 398–410 | () |
| file:src/services/x402Access.ts | file | src/services/x402Access.ts | src/services/x402Access.ts | 1–95 |  |
| constant:fdc05b1ceca5d43926fbda19a1263ca2 | constant | GUEST_ACCESS_KEY | src/services/x402Access.ts | 13–13 | = 'astrosphere_x402_guest_access' |
| constant:0d443ac693ff8642af53048c3d855b48 | constant | GUEST_PRICE_SATS | src/services/x402Access.ts | 14–14 | = 2000 |
| interface:8f5cbcd825d3d7bf4b7b9671437dbc00 | interface | WebLNProvider | src/services/x402Access.ts | 16–19 |  |
| method:5712519fd6670ee1d625e975640019f1 | method | WebLNProvider::sendPayment | src/services/x402Access.ts | 17–17 | (paymentRequest: string): Promise<{ preimage: string }> |
| method:d45ed2525892fcf0d9035e7cd2f8e82e | method | WebLNProvider::enable | src/services/x402Access.ts | 18–18 | (): Promise<void> |
| interface:e82438d7824d8e71ec4490a7adbabc2c | interface | Window | src/services/x402Access.ts | 22–24 |  |
| property:2eea90191e13087eb752b844a12a26d3 | property | Window::webln | src/services/x402Access.ts | 23–23 | WebLNProvider webln |
| function:68728428cd2a8924e0420ddf40ff8ee8 | function | hasWebLn | src/services/x402Access.ts | 27–29 | (): boolean |
| interface:8c59adbd31bf070129722e6fb935021e | interface | GuestAccessResult | src/services/x402Access.ts | 31–34 |  |
| property:4df31faf3982a8d4a4e38867775c03e4 | property | GuestAccessResult::granted | src/services/x402Access.ts | 32–32 | boolean granted |
| property:3c391ea25e1d3d7ea0a1b7350edc2505 | property | GuestAccessResult::reason | src/services/x402Access.ts | 33–33 | string reason |
| function:765611157706c9a1ff5a36279e9d04c9 | function | payForGuestAccess | src/services/x402Access.ts | 36–81 | (): Promise<GuestAccessResult> |
| function:9ab39845f7fee5589e35309fff201b2d | function | guestAccessActive | src/services/x402Access.ts | 83–92 | (): boolean |
| constant:e28eaef70f26f53a0b789a1e14e3afbe | constant | GUEST_PRICE_LABEL | src/services/x402Access.ts | 94–94 | = `${GUEST_PRICE_SATS} sats` |
| file:tests/account-isolation-browser.mjs | file | tests/account-isolation-browser.mjs | tests/account-isolation-browser.mjs | 1–112 |  |
| import:3230c226be1ac585e7e9f0043c496d3a | import | node:assert/strict | tests/account-isolation-browser.mjs | 1–1 | import assert from 'node:assert/strict'; |
| import:5a38d9d70816d29de2ba310addd13b85 | import | vite | tests/account-isolation-browser.mjs | 2–2 | import { createServer } from 'vite'; |
| import:dcb2dc2e3015ccba954b27a0cae0d3f1 | import | playwright | tests/account-isolation-browser.mjs | 3–3 | import { chromium } from 'playwright'; |
| constant:633345ea4addb947c3347619db445182 | constant | fixture | tests/account-isolation-browser.mjs | 6–30 | = ` import React from 'react'; import { createRoot } from 'react-dom/client'; import { NatallyChatb... |
| constant:2fe7100a9d98db87438e936580fb7998 | constant | server | tests/account-isolation-browser.mjs | 31–55 | = await createServer({   configFile: false,   server: { host: '127.0.0.1', port: 0 },   optimizeDep... |
| variable:db3db10e0c2769af9afe6ea29307373c | variable | browser | tests/account-isolation-browser.mjs | 56–56 |  |
| constant:c812aa3b2dc66e8e5ec4259e8c06877e | constant | page | tests/account-isolation-browser.mjs | 60–60 | = await browser.newPage({ viewport: { width: 1280, height: 900 } }) |
| constant:804d3ae35de6910d3b8eeef93224f0c4 | constant | errors | tests/account-isolation-browser.mjs | 61–61 | = [] |
| constant:d4a43aea9726ca72270caa7d9000e89b | constant | base | tests/account-isolation-browser.mjs | 65–65 | = 'astrosphere_natally_chat_history_v3' |
| constant:0e625461f3868b07b02b68114ae911bb | constant | legacy | tests/account-isolation-browser.mjs | 66–66 | = JSON.stringify([{ id: 'legacy', sender: 'user', text: 'LEGACY_SECRET', timestamp: '12:00' }]) |
| function:53ca3459af422b50fd283c816318b497 | function | send | tests/account-isolation-browser.mjs | 71–71 |  |
| function:b216505fd1e2a7378a1e8edf53f1e138 | function | mount | tests/account-isolation-browser.mjs | 72–72 |  |
| constant:3e4f7755774ceab2139c9e3af4272c44 | constant | speechCount | tests/account-isolation-browser.mjs | 79–79 | = await page.evaluate(() => window.speechEvents.length) |
| constant:1bf7a53a22dcb783d689e9c2c56814e1 | constant | storedB | tests/account-isolation-browser.mjs | 91–91 | = await page.evaluate(base => localStorage.getItem(base + ':B'), base) |
| file:tests/account-isolation.test.ts | file | tests/account-isolation.test.ts | tests/account-isolation.test.ts | 1–81 |  |
| import:4948c6e395ffccc392b3ab5ac0d1e0b9 | import | node:test | tests/account-isolation.test.ts | 1–1 | import test from 'node:test'; |
| import:cbb147f77a8b678a0663cc092bacf870 | import | node:assert/strict | tests/account-isolation.test.ts | 2–2 | import assert from 'node:assert/strict'; |
| import:a19d988b4f686cd2c4049863ea61bdc9 | import | ../src/services/accountStorage | tests/account-isolation.test.ts | 3–3 | import { accountStorageKey, loadAccountValue, saveAccountValue } from '../src/services/accountStorage'; |
| import:ece2d5d1721480753ffe4218527214e8 | import | ../src/services/locations | tests/account-isolation.test.ts | 4–4 | import { getPersistedVantageLocation, savePersistedVantageLocation } from '../src/services/locations'; |
| import:c2101daaf45cc04bf8e0d2eeee1318e5 | import | ../src/services/hostedInference | tests/account-isolation.test.ts | 5–5 | import { completeHosted, requestHostedInference, HostedAuthenticationError } from '../src/services/hostedInference'; |
| constant:5c25091a928d638fd2a75ee8a01b7444 | constant | storage | tests/account-isolation.test.ts | 7–7 | = new Map<string, string>() |
| file:tests/birth-date.test.ts | file | tests/birth-date.test.ts | tests/birth-date.test.ts | 1–94 |  |
| import:cf32b28320732d147b35ef19b944bd15 | import | node:test | tests/birth-date.test.ts | 1–1 | import test from 'node:test'; |
| import:5ba117e1d47c58a31ac3e0b53d524430 | import | node:assert/strict | tests/birth-date.test.ts | 2–2 | import assert from 'node:assert/strict'; |
| import:1c93a2d802667cf77c93b9e133acf2de | import | react | tests/birth-date.test.ts | 3–3 | import React from 'react'; |
| import:a4a3553d0f0e04e6d2a75ec4f770953b | import | react-dom/server | tests/birth-date.test.ts | 4–4 | import { renderToStaticMarkup } from 'react-dom/server'; |
| import:f520f724f865b92caa33207a219a0bc5 | import | ../src/services/birthDate | tests/birth-date.test.ts | 5–5 | import { formatBirthDateInput, getBirthDateParts, getBirthMonthDays, validateBirthDate } from '../src/services/birthDate'; |
| import:f686ebffed8b2747081e8a109cddec6b | import | ../src/components/onboarding/BirthDateFields | tests/birth-date.test.ts | 6–6 | import { BirthDateFields } from '../src/components/onboarding/BirthDateFields'; |
| constant:55bd514c2818f8e840345d584ddccc34 | constant | maximum | tests/birth-date.test.ts | 8–8 | = '2027-10-12' |
| file:tests/calculation-tools.test.ts | file | tests/calculation-tools.test.ts | tests/calculation-tools.test.ts | 1–104 |  |
| import:a2c762d9306fbf2917d80c513f0c314c | import | node:test | tests/calculation-tools.test.ts | 1–1 | import test from 'node:test'; |
| import:eefe3ca487bec9bd78acca4cf297d560 | import | node:assert/strict | tests/calculation-tools.test.ts | 2–2 | import assert from 'node:assert/strict'; |
| import:7a0a0e0bd35b64ed32cd37370ee38d61 | import | ../src/services/ephemeris | tests/calculation-tools.test.ts | 3–3 | import { calculateNatalChart } from '../src/services/ephemeris'; |
| import:368bd9aad3cac4ab8d21eb23d9e8940c | import | ../src/services/calculationTools | tests/calculation-tools.test.ts | 4–4 | import { createCalculationSession } from '../src/services/calculationTools'; |
| import:2f537074d3b5cb2e80c0cfeb6205f419 | import | ../src/services/hostedInference | tests/calculation-tools.test.ts | 5–5 | import { completeHosted } from '../src/services/hostedInference'; |
| import:6b4186caa56230cc283b0ba96f047184 | import | ../netlify/lib/astrology-tools.mjs | tests/calculation-tools.test.ts | 6–6 | import { validToolMessages } from '../netlify/lib/astrology-tools.mjs'; |
| function:71cecbb6771519de63eab6fa12d99a44 | function | makeChart | tests/calculation-tools.test.ts | 8–9 | () |
| function:0bdaf0c5ca31001320050972a6de39ac | function | run | tests/calculation-tools.test.ts | 13–13 | (args: object) |
| file:tests/chart-presentation-browser.mjs | file | tests/chart-presentation-browser.mjs | tests/chart-presentation-browser.mjs | 1–156 |  |
| import:dd8b027625448dda48e296ece644903f | import | node:assert/strict | tests/chart-presentation-browser.mjs | 1–1 | import assert from 'node:assert/strict'; |
| import:4f6a29879f061e0c639fa7806159e033 | import | vite | tests/chart-presentation-browser.mjs | 2–2 | import { createServer } from 'vite'; |
| import:5b53b3b94116811a93a729cc7a4960da | import | playwright | tests/chart-presentation-browser.mjs | 3–3 | import { chromium } from 'playwright'; |
| import:42ec2e28dc5a2abf83d0306533dcd747 | import | @tailwindcss/vite | tests/chart-presentation-browser.mjs | 4–4 | import tailwindcss from '@tailwindcss/vite'; |
| import:254a6935ae9ebd81e86de79afcfb107b | import | node:fs/promises | tests/chart-presentation-browser.mjs | 5–5 | import { mkdir, writeFile } from 'node:fs/promises'; |
| constant:6bc0ffa3d33b483eae6949ff8acc9943 | constant | fixture | tests/chart-presentation-browser.mjs | 9–53 | = ` import React, { useState } from 'react'; import { createRoot } from 'react-dom/client'; import ... |
| constant:0d373555fade9b6dba2affd746f35788 | constant | server | tests/chart-presentation-browser.mjs | 54–76 | = await createServer({   configFile: false, server: { host: '127.0.0.1', port: 0 },   optimizeDeps: ... |
| variable:54ac6aeb8a4b3255ae230214e5d0e08c | variable | browser | tests/chart-presentation-browser.mjs | 77–77 |  |
| constant:8ee0ff5b31067f539e94dd2bfe87673a | constant | page | tests/chart-presentation-browser.mjs | 81–81 | = await browser.newPage({ viewport: { width: 1280, height: 900 } }) |
| constant:d8f07112be03f4a22325c78b8e5daf5b | constant | errors | tests/chart-presentation-browser.mjs | 82–82 | = [] |
| function:6699f50ca50918002eb7cba6929ec9f8 | function | send | tests/chart-presentation-browser.mjs | 86–86 |  |
| function:6c1debb22794455c4640e2e05ae69bc0 | function | reply | tests/chart-presentation-browser.mjs | 87–87 |  |
| constant:7b44d30822718beaf6007c91ac8145f1 | constant | payload | tests/chart-presentation-browser.mjs | 89–89 | = await page.evaluate(() => window.pending[0].payload) |
| constant:16c31751036d71b0f364e6fcdaa3e5f0 | constant | occupants | tests/chart-presentation-browser.mjs | 98–98 | = await page.evaluate(() => window.initial.natalBodies.filter(b => b.house === 4).map(b => b.name)) |
| constant:19d55dbd49067f55f3f34fe90631e2ce | constant | aspect | tests/chart-presentation-browser.mjs | 104–104 | = await page.evaluate(() => window.initial.aspectChords[0].name) |
| constant:70897f03df00917169e8c2bb6122ab8e | constant | extras | tests/chart-presentation-browser.mjs | 110–110 | = await page.evaluate(name => window.probe.chords.filter(chord => chord !== name && !window.initial.as... |
| constant:d133afd747960c175b81426c791baf83 | constant | contentOffset | tests/chart-presentation-browser.mjs | 130–130 | = await page.evaluate(() => window.speech.text.indexOf('A generated')) |
| constant:753be2e683efa3120b07f62196305566 | constant | report | tests/chart-presentation-browser.mjs | 151–152 | = {checkedAt:new Date().toISOString(), passed:true, realWebGL:true, mutedFocus:true, houseOccupants:oc... |
| file:tests/chart-presentation.test.ts | file | tests/chart-presentation.test.ts | tests/chart-presentation.test.ts | 1–63 |  |
| import:1fa7d74dcfa133d00249ee51c364529e | import | node:test | tests/chart-presentation.test.ts | 1–1 | import test from 'node:test'; |
| import:56812420fbef0f18cbc1063b68379a76 | import | node:assert/strict | tests/chart-presentation.test.ts | 2–2 | import assert from 'node:assert/strict'; |
| import:70695832a6c91465d00e53cc3096d0a7 | import | ../src/services/natallyChat | tests/chart-presentation.test.ts | 3–3 | import * as chat from '../src/services/natallyChat'; |
| import:46e3884ab6fa956820df7d2676339261 | import | ../src/services/ephemeris | tests/chart-presentation.test.ts | 4–4 | import { calculateNatalChart } from '../src/services/ephemeris'; |
| constant:65fecfa17866c13c9887591f24fdf290 | constant | chart | tests/chart-presentation.test.ts | 6–7 | = await calculateNatalChart({ name: 'Chart focus fixture', birthDate: '2000-01-01', birthTime: '00:00'... |
| file:tests/hosted-chat.test.mjs | file | tests/hosted-chat.test.mjs | tests/hosted-chat.test.mjs | 1–91 |  |
| import:fc2150d54d874829f646e9d736b97231 | import | node:test | tests/hosted-chat.test.mjs | 1–1 | import { test } from 'node:test'; |
| import:8df5ffc0e12354982e2234706c8c4307 | import | node:assert/strict | tests/hosted-chat.test.mjs | 2–2 | import assert from 'node:assert/strict'; |
| import:8c00c0a925bbd09fbc235e16fc2fabc7 | import | ../netlify/functions/chat.mjs | tests/hosted-chat.test.mjs | 3–3 | import { handleChat } from '../netlify/functions/chat.mjs'; |
| constant:417326a0f0c1ffa10bce7847d74499da | constant | env | tests/hosted-chat.test.mjs | 5–5 | = { ZAI_API_KEY: 'server-only-test-key', FIREBASE_API_KEY: 'test-project' } |
| constant:a54bd34a02b6fab6eb5e23e1dbf77262 | constant | payload | tests/hosted-chat.test.mjs | 6–6 | = { prompt: 'What is 19 + 23?', systemInstruction: 'Answer accurately.' } |
| function:fd2d5dd22e4738f0b928c23f116de418 | function | request | tests/hosted-chat.test.mjs | 7–9 | (body = payload, token = 'valid-session', origin = 'https://natally.surge.sh') |
| function:411f7cd5bc3617f29c3e282628a8d922 | function | json | tests/hosted-chat.test.mjs | 10–10 | (body, status = 200) |
| file:tests/karaoke.test.ts | file | tests/karaoke.test.ts | tests/karaoke.test.ts | 1–42 |  |
| import:586f7d6b324ccb6532768982139bdd84 | import | node:test | tests/karaoke.test.ts | 1–1 | import test from 'node:test'; |
| import:4d5b40f523b74d842d8cf410b0b326d4 | import | node:assert/strict | tests/karaoke.test.ts | 2–2 | import assert from 'node:assert/strict'; |
| import:37e741be3520bf526af7da02ebdf5799 | import | react | tests/karaoke.test.ts | 3–3 | import React from 'react'; |
| import:6568c403b4f49b88b8e6a2eccd77675e | import | react-dom/server | tests/karaoke.test.ts | 4–4 | import { renderToStaticMarkup } from 'react-dom/server'; |
| import:ec5389c236c107d4e85873683c6f03b1 | import | ../src/components/RichText | tests/karaoke.test.ts | 5–5 | import { RichText } from '../src/components/RichText'; |
| import:b23a7c956b78738ef99250e7db007ba7 | import | ../src/services/voiceService | tests/karaoke.test.ts | 6–6 | import { prepareSpeechWithOffsets } from '../src/services/voiceService'; |
| import:072016174809a3ecb5c6710d3d0f4460 | import | ../src/services/karaokeScroll | tests/karaoke.test.ts | 7–7 | import { keepKaraokeVisible } from '../src/services/karaokeScroll'; |
| function:e297f4eb4f1b8392496a3629f63a7641 | function | word | tests/karaoke.test.ts | 32–32 | (top: number) |
| file:tests/mascot.test.tsx | file | tests/mascot.test.tsx | tests/mascot.test.tsx | 1–39 |  |
| import:981b854ab0cce1a6d50de6c9bb64297a | import | react | tests/mascot.test.tsx | 1–1 | import React from 'react'; |
| import:4a7e8e1fdf3e2c360d22220180747675 | import | node:assert/strict | tests/mascot.test.tsx | 2–2 | import assert from 'node:assert/strict'; |
| import:4e735da7dc46067f8e327a772f7a6891 | import | node:test | tests/mascot.test.tsx | 3–3 | import { test } from 'node:test'; |
| import:f03fc4d6182bd6e95f29c464af1c12ac | import | node:fs | tests/mascot.test.tsx | 4–4 | import { readFileSync } from 'node:fs'; |
| import:fb1dd5b70e2683293486e5468e225056 | import | react-dom/server | tests/mascot.test.tsx | 5–5 | import { renderToStaticMarkup } from 'react-dom/server'; |
| import:5c4ae32916070a3db01ed9df3b67aa81 | import | ../src/components/NatallyAvatar | tests/mascot.test.tsx | 6–6 | import { NatallyAvatar } from '../src/components/NatallyAvatar'; |
| import:07bbf9d0d28cf2b7a1f048bac199a131 | import | ../src/components/NatallyIcon | tests/mascot.test.tsx | 7–7 | import { NatallyIcon } from '../src/components/NatallyIcon'; |
| file:tests/mobile-layout.test.ts | file | tests/mobile-layout.test.ts | tests/mobile-layout.test.ts | 1–193 |  |
| import:b36abaf5e7f48f697d9a9662c262dd23 | import | node:test | tests/mobile-layout.test.ts | 1–1 | import test from 'node:test'; |
| import:34df65fa47c0a10c5ae9add9c2ad1c4f | import | node:assert/strict | tests/mobile-layout.test.ts | 2–2 | import assert from 'node:assert/strict'; |
| import:60a338e5a6e0111729bd5c1ecff802d5 | import | ../src/services/chatViewport | tests/mobile-layout.test.ts | 3–3 | import { getChatViewportLayout, type ViewportBounds } from '../src/services/chatViewport'; |
| import:80ca389241e81a7afc007e298c8a4628 | import | ../src/services/torusGestures | tests/mobile-layout.test.ts | 4–4 | import { bindTorusTouch, getTorusZoomDistance } from '../src/services/torusGestures'; |
| constant:cb5fe835a60163615bc060fb793f08f2 | constant | phone | tests/mobile-layout.test.ts | 6–6 | = { width: 393, height: 740, left: 0, top: 0, layoutWidth: 393 } |
| constant:085232a39674be76505f7e54e0f8e304 | constant | savedPosition | tests/mobile-layout.test.ts | 7–7 | = { x: 930, y: 580 } |
| constant:3ba3b77885dba578aae06435af70b535 | constant | savedSize | tests/mobile-layout.test.ts | 8–8 | = { width: 460, height: 600 } |
| function:9d4b83be3eac8a77b23843f35258d0d3 | function | touchEvent | tests/mobile-layout.test.ts | 53–60 | (element: EventTarget, type: string, points: number[][]) |
| function:7c477a2b8193ab89f816c55bd340d354 | function | fixture | tests/mobile-layout.test.ts | 62–76 | () |
| file:tests/natally-regression-suite.ts | file | tests/natally-regression-suite.ts | tests/natally-regression-suite.ts | 1–58 |  |
| import:3449e00b1a1a0a73250a655b6be04e16 | import | node:test | tests/natally-regression-suite.ts | 1–1 | import { test } from 'node:test'; |
| import:9d3c9ecaa0001918dd4e307d33527c59 | import | node:assert/strict | tests/natally-regression-suite.ts | 2–2 | import assert from 'node:assert/strict'; |
| import:3728bfd3b2af92b5a079200df8b19c82 | import | ../src/services/hostedInference.ts | tests/natally-regression-suite.ts | 3–3 | import { completeHosted, HostedAuthenticationError } from '../src/services/hostedInference.ts'; |
| constant:9ff93a2229d2697738b12dbaa84ccadc | constant | payload | tests/natally-regression-suite.ts | 5–5 | = { prompt: 'What are significant transits?', systemInstruction: 'Use supplied facts.' } |
| file:tests/session-profile.test.ts | file | tests/session-profile.test.ts | tests/session-profile.test.ts | 1–93 |  |
| import:8801e28dcec81453ef538c36c4c99b0b | import | node:test | tests/session-profile.test.ts | 1–1 | import test from 'node:test'; |
| import:1eb204ca0b5c29da74e5aebe7e8bc74e | import | node:assert/strict | tests/session-profile.test.ts | 2–2 | import assert from 'node:assert/strict'; |
| import:84137fe812cdf3fc0ace3860b3716cd3 | import | ../src/services/sessionProfile | tests/session-profile.test.ts | 3–3 | import { createSessionProfileLoader, getEntryStage, type SessionProfileState } from '../src/services/sessionProfile'; |
| function:76c21121814433891872749c3564b217 | function | ready | tests/session-profile.test.ts | 5–5 | (uid: string &#124; null, profile: string &#124; null = null): SessionProfileState<string> |
| function:7482735d1da50c1345b26467e3cb4a1d | function | deferred | tests/session-profile.test.ts | 6–11 | () |
| file:tests/supertonic.test.ts | file | tests/supertonic.test.ts | tests/supertonic.test.ts | 1–245 |  |
| import:6d96fe27a2d9a31287a9172d48f61088 | import | node:test | tests/supertonic.test.ts | 1–1 | import test from 'node:test'; |
| import:83cd52431b1e1e5a9b8c858f38148c5f | import | node:assert/strict | tests/supertonic.test.ts | 2–2 | import assert from 'node:assert/strict'; |
| import:283974b616d56d1c55e90446de2b85d5 | import | node:fs | tests/supertonic.test.ts | 3–3 | import { readFileSync } from 'node:fs'; |
| import:92b90de8930d1db03c49d752b7194698 | import | ../src/services/supertonicTts | tests/supertonic.test.ts | 4–4 | import { splitSpeechText, initSupertonic } from '../src/services/supertonicTts'; |
| import:be1d85891497f3aecfc117e181948fd4 | import | ../src/services/supertonicDownload | tests/supertonic.test.ts | 5–5 | import { SupertonicDownloadProgress, SUPERTONIC_MODEL_FILES } from '../src/services/supertonicDownload'; |
| import:09da0cd1e122ca74f4f46e2d95381ab4 | import | ../src/services/voiceService | tests/supertonic.test.ts | 6–6 | import { DEFAULT_VOICE_SETTINGS, getVoicePreset, loadVoiceSettings, saveVoiceSettings, speakNatallyText, stopSpeaking, getSpeechPolicy, isSpeechBusy } from '../src/services/voiceService'; |
| class:24cbd464a16eaafc34071ad9956ee8ad | class | TestWorker | tests/supertonic.test.ts | 70–75 |  |
| property:5fb16b8e60646d7590c9d18860346568 | property | TestWorker::onmessage | tests/supertonic.test.ts | 71–71 | any onmessage |
| method:96e95ebdb8b04dea676f332f8180e53a | method | TestWorker::constructor | tests/supertonic.test.ts | 72–72 | () |
| method:a33b6cd6999e63bc7970858a49cc9548 | method | TestWorker::postMessage | tests/supertonic.test.ts | 73–73 | (data: any) |
| method:d7243230bc410a448d462dcc1bc9ba0a | method | TestWorker::terminate | tests/supertonic.test.ts | 74–74 | () |
| class:def3572669f20147b3c99b91e5704b4a | class | TestContext | tests/supertonic.test.ts | 76–88 |  |
| property:eacbe0e607261cce2284bdbd0fb724de | property | TestContext::state | tests/supertonic.test.ts | 77–77 | state |
| method:d5b7e9f348af781fef0a44b98baf3e36 | method | TestContext::resume | tests/supertonic.test.ts | 78–78 | () |
| method:fe43524466008aa111f59f3a039193ce | method | TestContext::createBuffer | tests/supertonic.test.ts | 79–79 | (_channels: number, length: number) |
| method:f0b6d03f7b91d7d17afbf9c48e3bf82b | method | TestContext::createGain | tests/supertonic.test.ts | 80–80 | () |
| method:dee4bec58c6c3d5623494e135dfbe689 | method | TestContext::createBiquadFilter | tests/supertonic.test.ts | 81–81 | () |
| method:809041bd163b43566a98e1d70598554f | method | TestContext::createBufferSource | tests/supertonic.test.ts | 82–87 | () |
| file:tests/torus-browser.mjs | file | tests/torus-browser.mjs | tests/torus-browser.mjs | 1–73 |  |
| import:1c90f863ea3e97eaf87d71458f7c64d0 | import | node:assert/strict | tests/torus-browser.mjs | 1–1 | import assert from 'node:assert/strict'; |
| import:7587237bd3fec3f73294d17a4b721c20 | import | playwright | tests/torus-browser.mjs | 2–2 | import { chromium } from 'playwright'; |
| constant:e822175b024b93b038e1f55c2e22702f | constant | base | tests/torus-browser.mjs | 5–5 | = process.env.NATALLY_TEST_URL &#124;&#124; 'http://127.0.0.1:3000' |
| constant:b87923c35737ede86a16480fa54452de | constant | browser | tests/torus-browser.mjs | 6–6 | = await chromium.launch({ headless: true, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-... |
| constant:c2f69429136d972bae4b1752fd112534 | constant | evidence | tests/torus-browser.mjs | 7–7 | = {} |
| constant:6cbba1d16fc73a12f948b2dd001d6412 | constant | page | tests/torus-browser.mjs | 9–9 | = await browser.newPage({ viewport: { width: 393, height: 740 }, hasTouch: true, isMobile: true }) |
| constant:bbcedc41823a9c640f58bbc7ee2dcead | constant | errors | tests/torus-browser.mjs | 10–10 | = [] |
| function:931fb55f5e7e176b5c64ff43fc3032d8 | function | sample | tests/torus-browser.mjs | 14–14 | () |
| function:539c6e82e0e420ee65c1d30b2cfbf0d6 | function | frames | tests/torus-browser.mjs | 15–19 | (count) |
| constant:e5ff29e30267d4feffd3df3d8ab18e24 | constant | cdp | tests/torus-browser.mjs | 20–20 | = await page.context().newCDPSession(page) |
| function:a4ab537a6f4c04989a4fe649dc42b23a | function | touch | tests/torus-browser.mjs | 21–23 | (type, points) |
| constant:17c4a4356471349ce37cfd444a779273 | constant | dragging | tests/torus-browser.mjs | 29–29 | = await sample() |
| constant:3d8411ef6d94d305065e8ae47870a89a | constant | released | tests/torus-browser.mjs | 31–31 | = await frames(4) |
| constant:276ff18fdf7031bd553c22ae4c09a31b | constant | coasting | tests/torus-browser.mjs | 32–32 | = await frames(4) |
| constant:258db57b013691b16b55bdb6f1911d42 | constant | pinching | tests/torus-browser.mjs | 39–39 | = await frames(2) |
| constant:a7425b8e316e0fd10657ac1d9dc981aa | constant | zoomed | tests/torus-browser.mjs | 41–41 | = await frames(2) |
| constant:166c9f9804c89fb1848e9c062d2e28fd | constant | afterPinch | tests/torus-browser.mjs | 44–44 | = await frames(4) |
| constant:e18c853d4887d70b64adf230ea8efeba | constant | stopped | tests/torus-browser.mjs | 45–45 | = await frames(4) |
| constant:b3ff105e09e9632c2a9d14e5aca8db16 | constant | desktop | tests/torus-browser.mjs | 52–52 | = await browser.newPage({ viewport: { width: 1200, height: 800 } }) |
| constant:5e55d6a69cd4d66f61d19880df72217b | constant | frame | tests/torus-browser.mjs | 58–58 | = await desktop.evaluate(() => window.torusProbe.frame) |
| constant:2d3d1769c03aa46ec043ecbe11eba296 | constant | first | tests/torus-browser.mjs | 63–63 | = await desktop.evaluate(() => ({ ...window.torusProbe })) |
| constant:c8016c9bb77c95f269bdd5c20589f115 | constant | second | tests/torus-browser.mjs | 65–65 | = await desktop.evaluate(() => ({ ...window.torusProbe })) |
| file:tests/torus-browser.tsx | file | tests/torus-browser.tsx | tests/torus-browser.tsx | 1–26 |  |
| import:8b9d0958f08f28b148493a2e64b5679c | import | react | tests/torus-browser.tsx | 1–1 | import React from 'react'; |
| import:f158cc8a776fd384699534032793cac9 | import | react-dom/client | tests/torus-browser.tsx | 2–2 | import { createRoot } from 'react-dom/client'; |
| import:c3a451d4efb8dbe4401f800ef86dbd92 | import | three | tests/torus-browser.tsx | 3–3 | import * as THREE from 'three'; |
| import:4837d39f6a0b4cdb8522f5836e027257 | import | ../src/components/Astrolabe3D | tests/torus-browser.tsx | 4–4 | import { Astrolabe3D } from '../src/components/Astrolabe3D'; |
| import:3713f43dda375df48b32e33f14d3a0e3 | import | ../src/services/ephemeris | tests/torus-browser.tsx | 5–5 | import { calculateNatalChart } from '../src/services/ephemeris'; |
| constant:34c8cb650e998875babd7f7f8c440ef0 | constant | probe | tests/torus-browser.tsx | 9–9 | = { frame: 0, y: 0, distance: 0, selections: 0, ready: false } |
| constant:ab33613faec5a03fde95dfde26131824 | constant | updateMatrixWorld | tests/torus-browser.tsx | 11–11 | = THREE.Object3D.prototype.updateMatrixWorld |
| constant:7ff74ced31f772f497f8d0da603762eb | constant | chart | tests/torus-browser.tsx | 20–21 | = await calculateNatalChart({ name: 'Synthetic interaction test', birthDate: '2000-01-01', birthTime: ... |
| file:tests/transits.test.ts | file | tests/transits.test.ts | tests/transits.test.ts | 1–63 |  |
| import:57e63b405176be1911e205b6b95aa289 | import | node:test | tests/transits.test.ts | 1–1 | import test from 'node:test'; |
| import:673f178a6e4a0cf4e404409db9ccdba1 | import | node:assert/strict | tests/transits.test.ts | 2–2 | import assert from 'node:assert/strict'; |
| import:7ef9122fd73f90a3f2c10d078caf7d65 | import | ../src/services/transits | tests/transits.test.ts | 3–3 | import { calculateTransitAspects, buildCurrentSkyContext, resolveObservationMoment, requestCurrentLocation } from '../src/services/transits'; |
| import:3e03dad400c4bf00eece395df530b1f7 | import | ../src/services/ephemeris | tests/transits.test.ts | 4–4 | import { calculateNatalChart } from '../src/services/ephemeris'; |
| file:tests/voice-adaptive-browser.mjs | file | tests/voice-adaptive-browser.mjs | tests/voice-adaptive-browser.mjs | 1–82 |  |
| import:7e7ad66d6f2709b01dfc9946d9731016 | import | playwright | tests/voice-adaptive-browser.mjs | 1–1 | import { chromium } from 'playwright'; |
| import:b29ecbbf7dafdcd313cf4526e39fa7eb | import | node:assert/strict | tests/voice-adaptive-browser.mjs | 2–2 | import assert from 'node:assert/strict'; |
| import:0234f9782166d181fdbbea82ad2d1856 | import | node:fs/promises | tests/voice-adaptive-browser.mjs | 3–3 | import { writeFile } from 'node:fs/promises'; |
| import:e997a2f9f4d1e13d9ab1c1ea205a4dfb | import | node:os | tests/voice-adaptive-browser.mjs | 4–4 | import { hostname } from 'node:os'; |
| constant:1d4c5533171a6682d9691008cfec21c6 | constant | browser | tests/voice-adaptive-browser.mjs | 6–6 | = await chromium.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required'] }) |
| constant:2232fe7ec42659fde4c94baea0675f03 | constant | page | tests/voice-adaptive-browser.mjs | 7–7 | = await browser.newPage() |
| constant:d9ec6233e00e9a3e1d9f870c561f5588 | constant | failures | tests/voice-adaptive-browser.mjs | 8–8 | = [] |
| constant:96df9624bd9828df8a4659f0a72fe0e1 | constant | device | tests/voice-adaptive-browser.mjs | 13–48 | = await page.evaluate(() => {     window.voiceRun = { requests: [], completions: [], starts: [], ends... |
| constant:5c6ec90685bd5955b372794e6037ab4c | constant | text | tests/voice-adaptive-browser.mjs | 49–49 | = await page.locator('#sample').inputValue() |
| constant:f0bfb4e81e47bf7e944194052d1a4533 | constant | gentle | tests/voice-adaptive-browser.mjs | 53–53 | = await page.evaluate(() => ({ ...window.voiceRun, result: document.querySelector('#playback').textCon... |
| variable:e6b805c519bae8877eef9c2c8f73fd90 | variable | i | tests/voice-adaptive-browser.mjs | 59–59 | = 1 |
| constant:7e9e1c2e8a1ad191048123734f11f9a1 | constant | autoText | tests/voice-adaptive-browser.mjs | 67–67 | = await page.locator('#sample').inputValue() |
| constant:e926a2e314012cd0914c3511c158928e | constant | auto | tests/voice-adaptive-browser.mjs | 70–70 | = await page.evaluate(() => ({ ...window.voiceRun, result: document.querySelector('#playback').textCon... |
| constant:78a8db14cad4bd296266639af436463c | constant | report | tests/voice-adaptive-browser.mjs | 77–77 | = { recordedAt: new Date().toISOString(), url: page.url(), host: hostname(), device, runtime: 'Playwri... |
| file:tests/voice-cached-startup.test.mjs | file | tests/voice-cached-startup.test.mjs | tests/voice-cached-startup.test.mjs | 1–50 |  |
| import:44110944dd617f6b86e126ee3a24d404 | import | node:test | tests/voice-cached-startup.test.mjs | 1–1 | import test from 'node:test'; |
| import:80a302c6c66da08098ad391883258878 | import | node:assert/strict | tests/voice-cached-startup.test.mjs | 2–2 | import assert from 'node:assert/strict'; |
| import:6a6d747bfcdc8de05e1f74faff71cd77 | import | node:fs | tests/voice-cached-startup.test.mjs | 3–3 | import { readFileSync } from 'node:fs'; |
| import:974adcaa9e95ced6522f7283f611c3c8 | import | node:vm | tests/voice-cached-startup.test.mjs | 4–4 | import { runInNewContext } from 'node:vm'; |
| import:c630345d19bc61d3153b2b9de03cafaf | import | esbuild | tests/voice-cached-startup.test.mjs | 5–5 | import { transformSync } from 'esbuild'; |
| import:d9b16327e39f4fdccd1f905258514bcf | import | ../node_modules/@huggingface/transformers/src/env.js | tests/voice-cached-startup.test.mjs | 6–6 | import { env } from '../node_modules/@huggingface/transformers/src/env.js'; |
| import:cfd859219de2ea2b4c8037312b3df5c3 | import | ../node_modules/@huggingface/transformers/src/utils/model_registry/get_tokenizer_files.js | tests/voice-cached-startup.test.mjs | 7–7 | import { get_tokenizer_files } from '../node_modules/@huggingface/transformers/src/utils/model_registry/get_tokenizer_files.js'; |
| import:0c6245790525c0aac22d0e83b1f9f85f | import | ../node_modules/@huggingface/transformers/src/utils/model_registry/get_file_metadata.js | tests/voice-cached-startup.test.mjs | 8–8 | import { get_file_metadata } from '../node_modules/@huggingface/transformers/src/utils/model_registry/get_file_metadata.js'; |
| file:tests/voice-measurements.test.ts | file | tests/voice-measurements.test.ts | tests/voice-measurements.test.ts | 1–91 |  |
| import:d8d834288becbb1fa088966f858c1d4e | import | node:test | tests/voice-measurements.test.ts | 1–1 | import test from 'node:test'; |
| import:89b2cf8f02eb50350d21b045103ecab4 | import | node:assert/strict | tests/voice-measurements.test.ts | 2–2 | import assert from 'node:assert/strict'; |
| import:62c23ea71cc469f2acfa9ce871975793 | import | ../src/services/voiceMeasurements | tests/voice-measurements.test.ts | 3–3 | import { VoiceMeasurementStore, summarizeMeasurements, EMPTY_SURVEY } from '../src/services/voiceMeasurements'; |
| import:2dd7177758a03417814254bc903a70ed | import | ../scripts/summarize-voice-measurements | tests/voice-measurements.test.ts | 4–4 | import { aggregateVoiceReports } from '../scripts/summarize-voice-measurements'; |
| file:tests/voice-recovery.test.ts | file | tests/voice-recovery.test.ts | tests/voice-recovery.test.ts | 1–66 |  |
| import:2c0650cdbc8d0b661cdc83351f9b7873 | import | node:test | tests/voice-recovery.test.ts | 1–1 | import test from 'node:test'; |
| import:2b130a365209f51582f9ba56eede54cc | import | node:assert/strict | tests/voice-recovery.test.ts | 2–2 | import assert from 'node:assert/strict'; |
| import:487ebdcb47091510e49d5593757d7b5b | import | ../src/services/supertonicTts | tests/voice-recovery.test.ts | 3–3 | import { initSupertonic, supertonicSpeak, subscribeVoiceStatus } from '../src/services/supertonicTts'; |
| class:5391afe71d4a83ed6c66e851ba26fc22 | class | TestWorker | tests/voice-recovery.test.ts | 7–16 |  |
| property:10273c63757a86a1cd6102f7490d9c60 | property | TestWorker::onmessage | tests/voice-recovery.test.ts | 8–8 | ((event: { data: any }) => void) &#124; null onmessage |
| property:ca91be6b4b02d3effc0348cdc04e01bf | property | TestWorker::onerror | tests/voice-recovery.test.ts | 9–9 | (() => void) &#124; null onerror |
| property:3519fe440f7d4d357b2fea9ce70be018 | property | TestWorker::terminated | tests/voice-recovery.test.ts | 10–10 | terminated |
| property:6d1397ffabec76c4f1830e06f660fd99 | property | TestWorker::requests | tests/voice-recovery.test.ts | 11–11 | any[] requests |
| method:b237119e77c86c0c67aa0c597a667e23 | method | TestWorker::constructor | tests/voice-recovery.test.ts | 12–12 | () |
| method:da9b635a654b5af9a1a83e35669d8204 | method | TestWorker::postMessage | tests/voice-recovery.test.ts | 13–13 | (data: any) |
| method:b3df985dfb9d8768bbb6a3b790671b3a | method | TestWorker::terminate | tests/voice-recovery.test.ts | 14–14 | () |
| method:94f4890dae34f4b3b65bc2f5213de04b | method | TestWorker::reply | tests/voice-recovery.test.ts | 15–15 | (data: any) |
| file:tests/voice-runtime-progress.test.ts | file | tests/voice-runtime-progress.test.ts | tests/voice-runtime-progress.test.ts | 1–63 |  |
| import:1fd86383e396645b15f1ebd60c4bea34 | import | node:test | tests/voice-runtime-progress.test.ts | 1–1 | import test from 'node:test'; |
| import:4bfde66b3f7ccb06da40f0f317bf299d | import | node:assert/strict | tests/voice-runtime-progress.test.ts | 2–2 | import assert from 'node:assert/strict'; |
| import:5e6bbcf9b63ed15f38ee375c84cf9999 | import | node:vm | tests/voice-runtime-progress.test.ts | 3–3 | import { runInNewContext } from 'node:vm'; |
| import:488db9d5a97c2670f5e44506576a87c8 | import | ../vite.config | tests/voice-runtime-progress.test.ts | 4–4 | import configure from '../vite.config'; |
| function:54e70542896d4bed975ff753f6b8efb8 | function | instrument | tests/voice-runtime-progress.test.ts | 6–14 | (source: string) |
| file:vite.config.ts | file | vite.config.ts | vite.config.ts | 1–50 |  |
| import:e599f30a14b887510231c95a309fd481 | import | @tailwindcss/vite | vite.config.ts | 1–1 | import tailwindcss from '@tailwindcss/vite'; |
| import:07314d2b81e5c296c3317562d915e2d9 | import | @vitejs/plugin-react | vite.config.ts | 2–2 | import react from '@vitejs/plugin-react'; |
| import:801534375fbefd4c461f40611cb2f3b3 | import | path | vite.config.ts | 3–3 | import path from 'path'; |
| import:14161cfe61089f6824c87d70c7772530 | import | node:child_process | vite.config.ts | 4–4 | import { execFileSync } from 'node:child_process'; |
| import:b08a792e4be5ce83325d882c2a6ba643 | import | node:fs | vite.config.ts | 5–5 | import { existsSync, readFileSync } from 'node:fs'; |
| import:dc424a3f0b7c99875e665455123e242d | import | vite | vite.config.ts | 6–6 | import { defineConfig } from 'vite'; |
| import:c91839a98254fa574866c56d236e128c | import | ./scripts/onnx-progress-plugin.ts | vite.config.ts | 7–7 | import { onnxProgressPlugin } from './scripts/onnx-progress-plugin.ts'; |
| function:484b89f3128f2fb418bce392a9caed5c | function | git | vite.config.ts | 10–13 | (...args: string[]) |
