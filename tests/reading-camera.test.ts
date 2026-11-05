import test from 'node:test';
import assert from 'node:assert/strict';
import { withReadingCamera, presentationViewAt } from '../src/services/presentation';

test('reading takes the chart at its first word, before any named subject', () => {
  const text = 'Come with me. Look here. Your Sun is the subject.';
  const cues = withReadingCamera(text, [{offset:24,action:{type:'focus',targets:['Sun']}}], [], true);
  assert.equal(presentationViewAt(cues, 0), 'chart');
  assert.equal(presentationViewAt(cues, 12), 'chart');
  assert.equal(presentationViewAt(cues, text.length), 'atelier');
});

test('clearing a subject and a delayed model camera cue cannot derail a reading', () => {
  const text = 'Come with me. Your Sun. Let that settle. Your Moon.';
  const cues = withReadingCamera(text, [
    {offset:0,action:{type:'view',view:'atelier'}},
    {offset:14,action:{type:'focus',targets:['Sun']}},
    {offset:23,action:{type:'clear'}},
  ], [], true);
  assert.equal(presentationViewAt(cues, 0), 'chart');
  assert.equal(presentationViewAt(cues, 30), 'chart');
});

test('welcome without chart references stays in the atelier', () => {
  assert.equal(presentationViewAt(withReadingCamera('Come in. Settle here.', [], []), 0), 'atelier');
});

test('camera returns to Natally when a short chart passage finishes', () => {
  const text = 'Your Sun is the subject.';
  const cues = withReadingCamera(text, [{offset:0,action:{type:'focus',targets:['Sun']}}], []);
  assert.equal(presentationViewAt(cues, 5), 'chart');
  assert.equal(presentationViewAt(cues, text.length), 'atelier');
});

test('an explicit end of chart discussion returns to the room before the closing words', () => {
  const text = 'Your Sun. Back to you and what you want to do about it.';
  const cues = withReadingCamera(text, [
    {offset:0,action:{type:'focus',targets:['Sun']}},
    {offset:10,action:{type:'clear'}},
  ], [{start:5,end:8}]);
  assert.equal(presentationViewAt(cues, 5), 'chart');
  assert.equal(presentationViewAt(cues, 10), 'atelier');
});

test('a later relationship can bring the chart back after a clear cue', () => {
  const text = 'Sun talk. A pause. Your Moon and Saturn are next.';
  const cues = withReadingCamera(text, [
    {offset:0,action:{type:'focus',targets:['Sun']}},
    {offset:10,action:{type:'clear'}},
    {offset:19,action:{type:'focus',targets:['Moon','Saturn']}},
  ], [{start:24,end:28}]);
  assert.equal(presentationViewAt(cues, 12), 'atelier');
  assert.equal(presentationViewAt(cues, 24), 'chart');
  assert.equal(presentationViewAt(cues, text.length), 'atelier');
});

