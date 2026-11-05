import test from 'node:test';
import assert from 'node:assert/strict';
import { createReadingDeadline } from '../src/services/readingDeadline';

test('a silent reading times out even when the connection remains open', context => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const deadline = createReadingDeadline();
  context.mock.timers.tick(89_999);
  assert.equal(deadline.signal.aborted, false);
  context.mock.timers.tick(1);
  assert.equal(deadline.signal.aborted, true);
  assert.equal(deadline.signal.reason.name, 'TimeoutError');
  deadline.dispose();
});

test('incoming reading text renews the wait and completion releases the timer', context => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const deadline = createReadingDeadline();
  context.mock.timers.tick(80_000);
  deadline.progress();
  context.mock.timers.tick(80_000);
  assert.equal(deadline.signal.aborted, false);
  deadline.dispose();
  deadline.progress();
  context.mock.timers.tick(90_000);
  assert.equal(deadline.signal.aborted, false);
});
