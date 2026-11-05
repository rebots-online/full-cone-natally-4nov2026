import React, { useEffect, useRef, useState } from 'react';
import { clearReadingAudio, downloadReadingAudio, loadReadingAudio, readingAudioFilename, READING_AUDIO_EVENT, type ReadingAudioRecord } from '../services/readingAudio';
import { usePurchaseAccess } from './PurchaseAccess';
import { dispatchNatallyVoicePerformance, registerExternalPlaybackStop, stopSpeaking } from '../services/voiceService';

export function RetainedReadingAudio({ accountUid, messageId, isCurrentSession = () => true, readOnly = false, onReplay, onPosition, onPlaybackState }: {
  accountUid: string;
  messageId: string;
  isCurrentSession?: () => boolean;
  readOnly?: boolean;
  onReplay?: () => boolean | void;
  onPosition?: (sourceOffset: number) => void;
  onPlaybackState?: (playing: boolean) => void;
}) {
  const {requestDownload}=usePurchaseAccess();
  const [record, setRecord] = useState<ReadingAudioRecord | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const releasePlayback = useRef<(() => void) | null>(null);
  const active = useRef(true);
  const session = useRef(isCurrentSession); session.current = isCurrentSession;
  const callbacks = useRef({ onReplay, onPosition, onPlaybackState }); callbacks.current = { onReplay, onPosition, onPlaybackState };
  const playbackFrame = useRef(0);
  const lastSegment = useRef(-1);
  const lastMouthWord = useRef(-1);
  const playing = useRef(false);
  const replayAllowed = useRef(false);
  const mishapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visualEnd = () => {
    cancelAnimationFrame(playbackFrame.current);
    if (playing.current) {
      dispatchNatallyVoicePerformance({ state: 'ended' });
      if (session.current()) callbacks.current.onPlaybackState?.(false);
    }
    playing.current = false;
  };
  const endPlayback = () => {
    replayAllowed.current = false;
    if (mishapTimer.current) clearTimeout(mishapTimer.current);
    mishapTimer.current = null;
    releasePlayback.current?.(); releasePlayback.current = null;
    visualEnd();
  };

  useEffect(() => {
    active.current = true;
    let generation = 0;
    const refresh = async () => {
      const request = ++generation;
      try {
        const value = await loadReadingAudio(accountUid, messageId);
        if (active.current && session.current() && request === generation) { setRecord(value); setError(null); }
      } catch (failure) {
        if (active.current && session.current() && request === generation) setError(failure instanceof Error ? failure.message : 'Saved audio is unavailable.');
      }
    };
    void refresh();
    const change = (event: Event) => {
      if ((event as CustomEvent<{ accountUid: string }>).detail.accountUid === accountUid) void refresh();
    };
    window.addEventListener(READING_AUDIO_EVENT, change);
    const mishap = (event: Event) => {
      const player = audio.current;
      if (!player || player.paused || !session.current()) return;
      const duration = Number((event as CustomEvent<{ durationMs: number }>).detail?.durationMs);
      if (!Number.isFinite(duration)) return;
      if (mishapTimer.current) clearTimeout(mishapTimer.current);
      mishapTimer.current = setTimeout(() => {
        mishapTimer.current = null;
        if (active.current && session.current() && audio.current === player && player.paused) {
          void player.play().catch(() => { endPlayback(); if (active.current) setError('Tap play to resume the retained reading.'); });
        }
      }, Math.max(0, Math.min(2000, duration)));
      player.pause(); visualEnd();
    };
    window.addEventListener('natally-atelier-mishap', mishap);
    return () => {
      active.current = false; generation++;
      window.removeEventListener(READING_AUDIO_EVENT, change);
      window.removeEventListener('natally-atelier-mishap', mishap);
      audio.current?.pause(); endPlayback();
    };
  }, [accountUid, messageId]);

  useEffect(() => {
    if (!record) { setUrl(null); return; }
    const objectUrl = URL.createObjectURL(record.wav); setUrl(objectUrl);
    return () => { audio.current?.pause(); endPlayback(); URL.revokeObjectURL(objectUrl); };
  }, [record]);

  const prepareReplay = () => {
    replayAllowed.current = false;
    if (!record || !session.current()) { audio.current?.pause(); return; }
    releasePlayback.current?.(); releasePlayback.current = null;
    if (mishapTimer.current) clearTimeout(mishapTimer.current);
    mishapTimer.current = null;
    stopSpeaking();
    if (callbacks.current.onReplay?.() === false) { audio.current?.pause(); return; }
    replayAllowed.current = true;
    releasePlayback.current = registerExternalPlaybackStop(() => { audio.current?.pause(); endPlayback(); });
  };
  const replay = () => {
    if (!record || !session.current() || !replayAllowed.current) { audio.current?.pause(); return; }
    if (playing.current) return;
    playing.current = true; lastSegment.current = -1; lastMouthWord.current = -1;
    dispatchNatallyVoicePerformance({ state: 'started' });
    callbacks.current.onPlaybackState?.(true);
    const boundaries: number[] = [];
    let totalFrames = 0;
    record.segments.forEach(segment => { boundaries.push(totalFrames / record.sampleRate); totalFrames += segment.frames; });
    const position = () => {
      if (!audio.current || audio.current.paused || !playing.current) return;
      if (!session.current()) { audio.current.pause(); endPlayback(); return; }
      let index = 0;
      while (index + 1 < boundaries.length && boundaries[index + 1] <= audio.current.currentTime) index++;
      if (index !== lastSegment.current) {
        lastSegment.current = index;
        // These are retained synthesis segment boundaries, not invented word times.
        callbacks.current.onPosition?.(record.segments[index].sourceOffset);
      }
      const segment = record.segments[index];
      const segmentText = record.text.slice(segment.sourceOffset, segment.sourceEnd);
      const words = [...segmentText.matchAll(/\S+/g)];
      const duration = segment.frames / record.sampleRate;
      const wordDuration = duration / Math.max(1, words.length);
      const wordIndex = Math.min(words.length - 1, Math.floor((audio.current.currentTime - boundaries[index]) / wordDuration));
      const word = words[wordIndex];
      const sourceOffset = word ? segment.sourceOffset + word.index! : -1;
      if (word && sourceOffset !== lastMouthWord.current) {
        lastMouthWord.current = sourceOffset;
        // Visual spelling approximation within retained audio, not measured phoneme timing.
        dispatchNatallyVoicePerformance({state:'word',charIndex:sourceOffset,text:word[0],durationMs:wordDuration*1000/audio.current.playbackRate});
      }
      playbackFrame.current = requestAnimationFrame(position);
    };
    position();
  };

  const seekPosition = () => {
    if (!record || !audio.current || !session.current()) return;
    let frames = 0;
    let sourceOffset = record.segments[0]?.sourceOffset ?? 0;
    for (const segment of record.segments) {
      if (frames / record.sampleRate > audio.current.currentTime) break;
      sourceOffset = segment.sourceOffset; frames += segment.frames;
    }
    callbacks.current.onPosition?.(sourceOffset);
  };

  const exportPdf = async () => {
    if (!record || !session.current()) return;
    setBusy(true); setError(null);
    try {
      const { jsPDF } = await import('jspdf');
      if (!active.current || !session.current()) return;
      const document = new jsPDF();
      document.setProperties({ title: 'Natally reading', subject: `Companion to ${readingAudioFilename(record)}`, creator: 'Natally' });
      document.setFontSize(17); document.text('A reading with Natally', 20, 22);
      document.setFontSize(9);
      const heading = [`Saved ${record.createdAt}`, `Voice ${record.voiceSettings.aiVoiceName}; rate ${record.voiceSettings.rate}; pitch ${record.voiceSettings.pitch}; tone ${record.voiceSettings.tone}`,
        `Audio companion: ${readingAudioFilename(record)}`, 'Download the WAV separately using the matching reading audio control.', 'This PDF contains the reading text; it does not embed playable audio.'];
      let y = 32;
      for (const line of heading) {
        const wrapped = document.splitTextToSize(line, 170);
        document.text(wrapped, 20, y); y += wrapped.length * 4.5;
      }
      y += 7; document.setFontSize(11);
      const lines = document.splitTextToSize(record.text, 170) as string[];
      for (const line of lines) {
        if (y > 278) { document.addPage(); y = 20; }
        document.text(line, 20, y); y += 5.5;
      }
      if (session.current()) document.save(readingAudioFilename(record).replace(/\.wav$/, '.pdf'));
    } catch (failure) {
      if (active.current && session.current()) setError(failure instanceof Error ? failure.message : 'The reading PDF could not be prepared. The WAV is still available.');
    } finally { if (active.current) setBusy(false); }
  };

  const clear = async () => {
    if (readOnly || !session.current()) return;
    audio.current?.pause(); endPlayback(); setBusy(true); setError(null);
    try { await clearReadingAudio(accountUid, messageId, () => active.current && session.current()); }
    catch (failure) { if (active.current && session.current()) setError(failure instanceof Error ? failure.message : 'The saved audio could not be cleared.'); }
    finally { if (active.current) setBusy(false); }
  };

  if (!record && !error) return null;
  return <section className="mt-3 rounded-xl border border-[#d4af37]/25 bg-black/15 p-3" aria-label="Retained reading audio">
    {record && <>
      <p className="text-xs text-[#efd39a]">Complete reading audio · {Math.floor(record.duration / 60)}:{Math.floor(record.duration % 60).toString().padStart(2, '0')} · saved on this device</p>
      {url && <audio ref={audio} controls controlsList="nodownload" preload="metadata" src={url} className="mt-2 w-full h-9" aria-label="Replay this complete reading"
        onPlay={prepareReplay} onPlaying={replay} onSeeked={seekPosition} onPause={() => { if (mishapTimer.current) visualEnd(); else endPlayback(); }} onEnded={() => { if (record && session.current()) callbacks.current.onPosition?.(record.text.length); endPlayback(); }}
        onError={() => { endPlayback(); setError('This recording could not be played. Try downloading its WAV.'); }} />}
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs">
        <button type="button" className="underline underline-offset-4 cursor-pointer" onClick={() => void requestDownload({format:"wav",resourceId:messageId},()=>downloadReadingAudio(record),()=>active.current&&session.current())}>Download WAV</button>
        <button type="button" disabled={busy} className="underline underline-offset-4 cursor-pointer disabled:opacity-50" onClick={() => void requestDownload({format:"pdf",resourceId:messageId},exportPdf,()=>active.current&&session.current())}>Reading PDF</button>
        {!readOnly && <button type="button" disabled={busy} className="underline underline-offset-4 cursor-pointer disabled:opacity-50" onClick={() => void clear()}>Clear saved audio</button>}
      </div>
      <p className="mt-2 text-[10px] text-white/45">Up to six recordings / 192 MiB per account on this device. Older recordings are replaced as space is needed. Replay here is free. PDF and WAV downloads require a purchase; you can view the offer before paying.</p>
    </>}
    {error && <p role="status" className="mt-2 text-xs text-amber-200">{error}</p>}
  </section>;
}
