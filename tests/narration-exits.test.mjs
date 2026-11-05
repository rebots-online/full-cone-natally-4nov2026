import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {transformSync} from 'esbuild';

// Execute the actual callback/exit statements and owner-checked cleanup, isolated
// from React and audio hardware. This is not browser/listening acceptance.
const source=readFileSync(new URL('../src/components/NatallyChatbot.tsx',import.meta.url),'utf8');
function arrow(name) {
  const begin=source.indexOf(`  const ${name} = `), end=source.indexOf('\n  };',begin)+5;
  assert.ok(begin>=0 && end>begin);return source.slice(begin,end);
}
function before(marker,endMarker) {
  const begin=source.indexOf(marker),end=source.indexOf(endMarker,begin);
  assert.ok(begin>=0 && end>begin);return source.slice(begin,end);
}
for(const [name,code] of [
  ['Sound Off',arrow('toggleReadingAloud')+'\ntoggleReadingAloud();'],
  ['new request without selected targets',before('    failedSnapshot.current = snapshot;','    const mediaToSave')],
  ['educational request before prepare can fail',before('    // A fresh lesson replaces earlier authored speech;', '    setCurrentlySpeakingMsgId(null);')],
]) {
  test(name+' clears old narration before invalidating it, preserving manual selection',()=>{
    const generation={current:4}, chart={}, playback={current:{generation:4,sourceChart:chart}};
    const state={focus:['Sun'],manual:['Jupiter']}, events=[];
    const environment={presentationGeneration:generation,playbackPosition:playback,sessionIsActive:()=>true,
      onPresentationAction:action=>{if(action.type==='clear'){state.focus=[];events.push('clear');}},
      streamingReply:{current:{cancelSpeech(){events.push('cancel');assert.equal(generation.current,4);}}},
      stopSpeaking(){events.push('stop');assert.deepEqual(state.focus,[]);},greetingAllowed:{current:true},
      voiceSettings:{readingAloud:true},onUpdateVoiceSettings(){},snapshotMode:true,saveVoiceSettings(){},
      onSpeechStateChange(){},setCurrentlySpeakingMsgId(){},setIsPreparingSpeech(){},setKaraokeCharIndex(){},
      failedSnapshot:{current:null},snapshot:{selectedTargets:[]},requestChart:chart,
    };
    runInNewContext(transformSync(arrow('clearPlaybackFocus')+'\n'+code,{loader:'ts',target:'es2022'}).code,environment);
    assert.deepEqual(state.focus,[]);assert.deepEqual(state.manual,['Jupiter']);assert.equal(generation.current,5);
    assert.ok(events.indexOf('clear')<events.indexOf('stop'));
    assert.ok(events.includes('cancel'));
  });
}
