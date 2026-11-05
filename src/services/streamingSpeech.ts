import { supertonicSpeak, splitSpeechText } from './supertonicTts';
import { getSpeechPolicy, prepareSpeechWithOffsets, speakNatallyText, stopSpeaking, withNatallyVoice, type VoiceSettings, type NatallyAudioSegment } from './voiceService';

/** One playing unit and one synthesis ahead; incoming text never awaits audio. */
export function createStreamingSpeech(settings: VoiceSettings, callbacks: {
  active: () => boolean;
  beforeSpeech?: Promise<unknown>;
  onStart: (offset: number) => void;
  onIdle: () => void;
  onWord: (offset: number) => void;
  onPreparing: (preparing: boolean) => void;
  onAudioSegment: (segment: NatallyAudioSegment) => void;
}) {
  settings = withNatallyVoice(settings);
  type Audio = Awaited<ReturnType<typeof supertonicSpeak>>;
  type Unit = { text: string; offset: number; audio?: Promise<{ audio?: Audio; error?: unknown }> };
  let text = '', consumed = 0, stopped = false, ended = false;
  const queue: Unit[] = [];
  let running: Promise<void> | null = null;
  const active = () => !stopped && callbacks.active();
  const prime = () => {
    const unit = queue[0];
    if (!unit || unit.audio || !settings.readingAloud || !active()) return;
    const clean = prepareSpeechWithOffsets(unit.text).text;
    const chunk = splitSpeechText(clean, getSpeechPolicy(settings.resourceMode, navigator).chunkChars)[0];
    unit.audio = supertonicSpeak(chunk, { voice: settings.aiVoiceName, speed: settings.rate })
      .then(audio => ({ audio }), error => ({ error }));
  };
  const pump = () => {
    if (running || !settings.readingAloud || !active()) return;
    running = (async () => {
      await callbacks.beforeSpeech;
      while (queue.length && active()) {
        prime();
        const unit = queue.shift()!;
        if (settings.resourceMode !== 'gentle') prime();
        callbacks.onPreparing(true);
        const completed = await speakNatallyText(unit.text, settings,
          () => { if (active()) callbacks.onStart(unit.offset); }, undefined,
          offset => { if (active()) callbacks.onWord(unit.offset + offset); }, {
            preparedAudio: unit.audio?.then(result => { if (result.error) throw result.error; return result.audio!; }),
            onPreparing: preparing => { if (active()) callbacks.onPreparing(preparing); },
            onAudioSegment: segment => { if (active()) callbacks.onAudioSegment({ ...segment, sourceOffset: unit.offset + segment.sourceOffset, sourceEnd: unit.offset + segment.sourceEnd }); },
          });
        if (!completed) { stopped = true; queue.length = 0; }
      }
    })().finally(() => { running = null; if (callbacks.active()) callbacks.onIdle(); });
  };
  const flush = (final: boolean) => {
    if (!settings.readingAloud || !active()) return;
    while (consumed < text.length) {
      const tail = text.slice(consumed);
      const sentence = /[.!?]["'”’)]*(?=\s)/.exec(tail);
      let length = sentence ? sentence.index + sentence[0].length : 0;
      // The first spoken unit should not wait for a long model-written sentence.
      const limit = consumed === 0 ? 110 : 180;
      const clause = consumed === 0 ? /[,;:—](?=\s)/.exec(tail) : null;
      if (clause && clause.index >= 40 && (!length || clause.index < length)) length = clause.index + 1;
      if (!length || length > limit) {
        if (tail.length < limit && !final) break;
        if (tail.length <= limit) length = tail.length;
        else {
          const prefix = tail.slice(0, limit - 10);
          length = Math.max(prefix.lastIndexOf(', ') + 1, prefix.lastIndexOf('; ') + 1, prefix.lastIndexOf(' '));
          if (length <= 0) { if (!final) break; length = tail.length; }
        }
      }
      const unit = { text: tail.slice(0, length), offset: consumed };
      consumed += length;
      if (prepareSpeechWithOffsets(unit.text).text) queue.push(unit);
    }
    if (!running || settings.resourceMode !== 'gentle') prime();
    pump();
  };
  return {
    update(next: string) {
      if (ended || stopped) return;
      // Never repeat/rewrite already spoken text if a provider changes its prefix.
      // Parsing an unfinished hidden cue may retract only the unqueued tail.
      // Only revising text already handed to speech requires cancellation.
      if (next.slice(0,consumed) !== text.slice(0,consumed)) { this.cancel(); return; }
      text = next; flush(false);
    },
    async finish(): Promise<boolean> {
      ended = true; flush(true);
      while (running) await running;
      return active();
    },
    cancel() { stopped = true; queue.length = 0; if (running) stopSpeaking(); },
  };
}
