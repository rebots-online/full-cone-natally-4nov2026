import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Volume2, VolumeX, Sliders, Play, RotateCcw } from 'lucide-react';
import {
  VoiceSettings, DEFAULT_VOICE_SETTINGS, NATALLY_VOICE_SAMPLE,
  saveVoiceSettings, speakNatallyText, stopSpeaking, withNatallyVoice,
} from '../services/voiceService';
import { subscribeVoiceStatus, type VoiceStatus } from '../services/supertonicTts';
import { VoiceMeasurementPanel } from './VoiceMeasurementPanel';

interface NatallyConfigModalProps {
  settings: VoiceSettings;
  onUpdateSettings: (newSettings: VoiceSettings) => void;
  onClose: () => void;
}

export const NatallyConfigModal: React.FC<NatallyConfigModalProps> = ({ settings, onUpdateSettings, onClose }) => {
  const [localSettings, setLocalSettings] = useState(() => withNatallyVoice(settings));
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>({ phase: 'idle', message: 'Voice ready to load' });
  useEffect(() => subscribeVoiceStatus(setVoiceStatus), []);
  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); onClose(); } };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);
  const update = (changes: Partial<VoiceSettings>) => {
    const next = withNatallyVoice({ ...localSettings, ...changes });
    setLocalSettings(next); onUpdateSettings(next); saveVoiceSettings(next);
  };
  const preview = async () => {
    setIsPlayingTest(true);
    try {
      await speakNatallyText(NATALLY_VOICE_SAMPLE, { ...localSettings, readingAloud: true },
        () => setIsPlayingTest(true), () => setIsPlayingTest(false));
    } finally { setIsPlayingTest(false); }
  };
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
      <div role="dialog" aria-modal="true" aria-labelledby="natally-listening-title" className="celestial-panel w-full max-w-md max-h-[calc(100dvh-2rem)] flex flex-col rounded-2xl border border-[#d4af37]/60 shadow-2xl overflow-hidden bg-[#180f26]/95">
        <div className="px-5 py-4 shrink-0 border-b border-[#322641] bg-[#201433]/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-[#f2ca50]" />
            <h3 id="natally-listening-title" className="font-cinzel text-sm font-bold text-[#f2ca50]">Listening preferences</h3>
          </div>
          <button type="button" autoFocus aria-label="Close listening preferences" onClick={onClose} className="min-h-11 min-w-11 flex items-center justify-center rounded-lg text-[#a99dae] hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4 min-h-0 overflow-y-auto font-mono text-xs text-[#f1e8d8]">
          <div className="p-3.5 rounded-xl bg-[#221636] border border-[#3b2954] flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-[#f2ca50] flex items-center gap-1.5">
                {localSettings.readingAloud ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-300" />}
                <span>Read aloud</span>
              </div>
              <p className="text-[11px] text-[#a99dae] mt-1">{localSettings.readingAloud ? 'Hear Natally as her answer arrives.' : 'Read her answers without speech.'}</p>
            </div>
            <button type="button" role="switch" aria-checked={localSettings.readingAloud} aria-label="Read aloud" onClick={() => { if (localSettings.readingAloud) stopSpeaking(); update({ readingAloud: !localSettings.readingAloud }); }} className="min-h-11 px-3 rounded-lg border border-[#d4af37]/40 text-[#f2ca50] cursor-pointer">{localSettings.readingAloud ? 'On' : 'Off'}</button>
          </div>
          <section className="p-3.5 rounded-xl bg-[#221636] border border-[#3b2954] space-y-3" aria-label="Natally’s voice">
            <h4 className="font-semibold text-[#f2ca50]">Natally’s voice</h4>
            <label className="block" htmlFor="natally-reading-pace">Reading pace <span className="float-right text-[#f2ca50]">{localSettings.rate.toFixed(2)}×</span></label>
            <input id="natally-reading-pace" type="range" min="0.8" max="1.4" step="0.05" value={localSettings.rate} onChange={event => update({ rate: parseFloat(event.target.value) })} className="w-full accent-[#d4af37] cursor-pointer" />
            <button type="button" onClick={() => void preview()} disabled={isPlayingTest} className="w-full min-h-11 px-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#f2a38c] text-[#120c1c] font-semibold cursor-pointer flex items-center justify-center gap-2"><Play className="w-3.5 h-3.5 fill-current" />{isPlayingTest ? 'Speaking…' : 'Preview Natally’s voice'}</button>
            {voiceStatus.phase === 'error' && <p role="status" className="text-rose-300">{voiceStatus.message}</p>}
          </section>
          <details className="p-3.5 rounded-xl border border-[#322641] space-y-3">
            <summary className="cursor-pointer text-[#c7bcce]">Voice loading and device performance</summary>
            <p className="text-[11px] text-[#a99dae]">Speech is generated on this device. The first use downloads about 265 MB of voice files plus the runtime; later visits can reuse the browser cache. Conversation replies use your connected reading service.</p>
            <label className="block">Speech resource use
              <select aria-label="Speech resource use" value={localSettings.resourceMode} onChange={event => { stopSpeaking(); update({ resourceMode: event.target.value as VoiceSettings['resourceMode'] }); }} className="mt-1 w-full min-h-11 bg-[#1a1224] border border-[#322641] rounded p-2">
                <option value="auto">Auto · prepare the next phrase during playback</option>
                <option value="gentle">Gentle · prepare phrases one at a time</option>
              </select>
            </label>
            <p className="text-[11px] text-[#a99dae]">Both begin speaking while the answer arrives. The first voice setup may take longer.</p>
            <p role="status" aria-live="polite" className={voiceStatus.phase === 'error' ? 'text-rose-300' : 'text-emerald-300'}>{voiceStatus.message}</p>
            <VoiceMeasurementPanel />
          </details>
        </div>
        <div className="px-5 py-3 shrink-0 bg-[#1d122e] border-t border-[#322641] flex items-center justify-between gap-3">
          <button type="button" onClick={() => { stopSpeaking(); update({ ...DEFAULT_VOICE_SETTINGS }); }} className="min-h-11 text-[11px] text-[#a99dae] hover:text-[#f2ca50] flex items-center gap-1 cursor-pointer"><RotateCcw className="w-3 h-3" />Restore defaults</button>
          <button type="button" onClick={onClose} className="min-h-11 px-4 rounded-lg bg-[#271c36] border border-[#d4af37]/40 text-[#f2ca50] text-xs cursor-pointer">Done</button>
        </div>
      </div>
    </div>, document.body
  );
};
