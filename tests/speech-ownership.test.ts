import test from 'node:test';
import assert from 'node:assert/strict';
import * as voice from '../src/services/voiceService';

test('retained playback makes idle speech yield without stopping it', async () => {
  let stopped = false;
  const release = voice.registerExternalPlaybackStop(() => { stopped = true; });
  try {
    assert.equal(voice.isSpeechBusy(), true);
    assert.equal(await voice.speakNatallyText('An idle aside.', voice.DEFAULT_VOICE_SETTINGS, undefined, undefined, undefined, {interrupt:false}), false);
    assert.equal(stopped, false);
  } finally { release(); voice.stopSpeaking(); }
});

test('stream reservation survives empty gaps until its own release', () => {
  assert.equal(typeof voice.reserveSpeech, 'function');
  const release = voice.reserveSpeech();
  assert.equal(voice.isSpeechBusy(), true);
  voice.stopSpeaking(); // Between units, the stream itself remains reserved.
  assert.equal(voice.isSpeechBusy(), true);
  release(); release();
  assert.equal(voice.isSpeechBusy(), false);
});

test('obsolete mouth end and word events cannot overwrite a newer voice owner', () => {
  const target = new EventTarget();
  const previous = globalThis.window;
  Object.assign(globalThis, {window:target});
  const events: string[] = [];
  target.addEventListener('natally-voice-performance', event => events.push((event as CustomEvent).detail.state));
  const older = Symbol('older'), newer = Symbol('newer');
  try {
    voice.dispatchNatallyVoicePerformance({state:'started',owner:older});
    voice.dispatchNatallyVoicePerformance({state:'started',owner:newer});
    voice.dispatchNatallyVoicePerformance({state:'ended',owner:older});
    voice.dispatchNatallyVoicePerformance({state:'word',owner:older,text:'stale'});
    voice.dispatchNatallyVoicePerformance({state:'word',owner:newer,text:'current'});
    voice.dispatchNatallyVoicePerformance({state:'ended',owner:newer});
    assert.deepEqual(events, ['started','started','word','ended']);
  } finally { Object.assign(globalThis, {window:previous}); }
});

test('real streaming controller releases reservations on empty completion and cancellation', async () => {
  const {createStreamingSpeech} = await import('../src/services/streamingSpeech');
  const callbacks={active:()=>true,onStart:()=>{},onIdle:()=>{},onWord:()=>{},onPreparing:()=>{},onAudioSegment:()=>{}};
  const first=createStreamingSpeech(voice.DEFAULT_VOICE_SETTINGS,callbacks);
  assert.equal(voice.isSpeechBusy(),true);
  assert.equal(await first.finish(),true);
  assert.equal(voice.isSpeechBusy(),false);
  const older=createStreamingSpeech(voice.DEFAULT_VOICE_SETTINGS,callbacks);
  const newer=createStreamingSpeech(voice.DEFAULT_VOICE_SETTINGS,callbacks);
  older.cancel();
  assert.equal(voice.isSpeechBusy(),true,'old cancellation must not release newer stream');
  newer.cancel();
  assert.equal(voice.isSpeechBusy(),false);
});
