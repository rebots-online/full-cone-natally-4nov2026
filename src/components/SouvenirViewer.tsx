import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { AuthModal } from './AuthModal';
import { ReadingStage } from './ReadingStage';
import { Astrolabe3D } from './Astrolabe3D';
import { NatallyChatbot, type PersistentChatMessage } from './NatallyChatbot';
import { RichText } from './RichText';
import { initialPresentation, reducePresentation, type PresentationAction, type PresentationState, type PresentationView } from '../services/presentation';
import type { ConversationPhase } from './atelier/AtelierScene';
import { chartFocusKey, chartFocusKeyMatches, chartTargetLabel, resolveChartTarget } from '../services/chartTargets';
import { speakNatallyText, stopSpeaking, type VoiceSettings } from '../services/voiceService';
import type { NatalChartResult } from '../services/ephemeris';
import { loadSouvenir, type SouvenirSnapshot } from '../services/souvenir';
import { downloadSouvenirPdf } from '../services/souvenirPdf';

type SouvenirMessages = PersistentChatMessage[];

export function SouvenirViewer({ id }: { id: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [snapshot, setSnapshot] = useState<SouvenirSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [presentation, setPresentation] = useState<PresentationState>(() => initialPresentation(''));
  const [phase, setPhase] = useState<ConversationPhase>('idle');
  const [motionPaused, setMotionPaused] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings | null>(null);
  const [observation, setObservation] = useState<{ chart: NatalChartResult; archived: boolean } | null>(null);
  const observationRef = useRef(observation);
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [speakingChapter, setSpeakingChapter] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [pdfStatus, setPdfStatus] = useState<string | null>(null);

  // This closure belongs to one authenticated session; account switches invalidate it.
  const sessionGeneration = useRef(0);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  const isCurrentSession = useCallback(() =>
    mounted.current && !!user && auth.currentUser === user,
  [user]);

  useEffect(() => onAuthStateChanged(auth, next => {
    setUser(next);
    setAuthResolved(true);
  }), []);

  useEffect(() => {
    sessionGeneration.current += 1;
    loadOperation.current += 1;
    setSnapshot(null);
    setVoiceSettings(null);
    setObservation(null);
    observationRef.current = null;
    setActiveChapter(null);
    setSpeakingChapter(false);
    setPresentation(initialPresentation(''));
    setPhase('idle');
    setPdfStatus(null);
    stopSpeaking();
    return () => {
      sessionGeneration.current += 1;
      loadOperation.current += 1;
      stopSpeaking();
    };
  }, [user?.uid, id]);

  const loadOperation = useRef(0);
  const loadSnapshot = useCallback(async (uid: string) => {
    const operation = ++loadOperation.current;
    const generation = sessionGeneration.current;
    setLoading(true);
    setError(null);
    try {
      const next = await loadSouvenir(id);
      if (operation !== loadOperation.current) return;
      if (auth.currentUser?.uid !== uid || sessionGeneration.current !== generation) return;
      setSnapshot(next);
      setVoiceSettings(next.voiceSettings);
      setPresentation(initialPresentation(chartFocusKey(next.chart)));
    } catch (err) {
      if (operation !== loadOperation.current) return;
      if (auth.currentUser?.uid !== uid || sessionGeneration.current !== generation) return;
      setError(err instanceof Error ? err.message : String(err || 'The souvenir could not be loaded.'));
    } finally {
      if (operation === loadOperation.current && auth.currentUser?.uid === uid && sessionGeneration.current === generation) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!authResolved || !user) return;
    void loadSnapshot(user.uid);
  }, [authResolved, user, loadSnapshot]);

  useEffect(() => () => stopSpeaking(), []);

  const displayedChart = useMemo(() => {
    if (!snapshot) return null;
    const source = observation?.chart;
    return source && chartFocusKeyMatches(chartFocusKey(source), snapshot.chart) ? source : snapshot.chart;
  }, [snapshot, observation]);

  const chartRef = useRef<NatalChartResult | null>(null);
  chartRef.current = displayedChart;

  const findChapterForTarget = (chart: NatalChartResult, target: string) =>
    snapshot?.chapters.find(chapter => chapter.targets.some(raw => resolveChartTarget(raw, chart) === target)) ?? null;

  const speechSequence = useRef(0);
  const speakChapter = useCallback((index: number) => {
    if (!snapshot || !isCurrentSession()) return;
    const chapter = snapshot.chapters[index];
    if (!chapter) return;
    const sequence = ++speechSequence.current;
    const generation = sessionGeneration.current;
    const alive = () => isCurrentSession() && speechSequence.current === sequence && sessionGeneration.current === generation;
    stopSpeaking();
    setActiveChapter(index);
    setSpeechError(null);
    setSpeakingChapter(true);
    setPhase('speaking');
    speakNatallyText(chapter.text, snapshot.voiceSettings,
      () => { if (alive()) { setSpeakingChapter(true); setPhase('speaking'); } },
      () => { if (alive()) { setSpeakingChapter(false); setPhase('idle'); } },
      undefined,
      { onPreparing: preparing => { if (alive()) setSpeakingChapter(preparing || false); } },
    ).then(() => {
      if (alive()) { setSpeakingChapter(false); setPhase('idle'); }
    }).catch(err => {
      if (!alive()) return;
      setSpeakingChapter(false);
      setPhase('idle');
      setSpeechError(err instanceof Error ? err.message : String(err || 'Speech could not start.'));
    });
  }, [snapshot, isCurrentSession]);

  const selectTarget = useCallback((rawTarget: string, multi: boolean) => {
    const chart = chartRef.current;
    if (!chart || !isCurrentSession()) return;
    const target = resolveChartTarget(rawTarget, chart);
    if (!target) return;
    setPresentation(previous => {
      const selected = multi
        ? [...new Set([...previous.selectedTargets, target])]
        : previous.selectedTargets.includes(target) ? previous.selectedTargets.filter(item => item !== target) : [target];
      return { ...previous, selectedTargets: selected, view: 'chart', panel: 'selection' };
    });
    const chapter = findChapterForTarget(chart, target);
    if (chapter) speakChapter(snapshot!.chapters.indexOf(chapter));
  }, [isCurrentSession, snapshot, speakChapter]);

  const handlePresentationAction = useCallback((action: PresentationAction, sourceChart: NatalChartResult) => {
    if (!chartRef.current || !chartFocusKeyMatches(chartFocusKey(sourceChart), chartRef.current)) return;
    setPresentation(previous => reducePresentation(previous, action, sourceChart));
  }, []);

  const handleChartFocus = useCallback((targets: string[], sourceChart: NatalChartResult) => {
    if (!chartRef.current || !chartFocusKeyMatches(chartFocusKey(sourceChart), chartRef.current)) return;
    setPresentation(previous => reducePresentation(previous, targets.length ? { type: 'focus', targets: targets.slice(0, 6) } : { type: 'clear' }, sourceChart));
  }, []);

  const handleShowTargets = useCallback((targets: string[]) => {
    const source = observationRef.current?.chart ?? chartRef.current;
    if (!source || !isCurrentSession()) return;
    const canonical = targets.map(target => resolveChartTarget(target, source)).filter((target): target is string => !!target);
    if (!canonical.length) return;
    setPresentation(previous => ({ ...reducePresentation(previous, { type: 'focus', targets: canonical.slice(0, 6) }, source), selectedTargets: [...new Set([...previous.selectedTargets, ...canonical])], view: 'chart', follow: false, panel: 'selection' }));
  }, [isCurrentSession]);

  const handleReadingChart = useCallback((source: NatalChartResult, archived: boolean) => {
    const chart = chartRef.current;
    if (!chart || !chartFocusKeyMatches(chartFocusKey(source), chart)) return;
    const next = { chart: source, archived };
    observationRef.current = next;
    setObservation(next);
    setPresentation(previous => ({ ...previous, follow: true, panel: 'conversation' }));
  }, []);

  const setManualView = (view: PresentationView) => setPresentation(previous => ({ ...previous, view, follow: false }));

  const handleSpeechStateChange = useCallback((speaking: boolean) => {
    if (!isCurrentSession()) return;
    setPhase(speaking ? 'speaking' : 'idle');
  }, [isCurrentSession]);

  const handleDownloadPdf = useCallback(async () => {
    if (!snapshot || !isCurrentSession()) return;
    if (snapshot.accountUid !== user?.uid) return;
    setPdfStatus('Preparing your PDF…');
    const generation = sessionGeneration.current;
    try {
      await downloadSouvenirPdf(snapshot);
      if (!isCurrentSession() || sessionGeneration.current !== generation || snapshot.accountUid !== user?.uid) return;
      setPdfStatus('PDF downloaded.');
    } catch (err) {
      if (!isCurrentSession() || sessionGeneration.current !== generation || snapshot.accountUid !== user?.uid) return;
      setPdfStatus(`PDF download failed: ${err instanceof Error ? err.message : String(err)} You can retry.`);
    }
  }, [snapshot, isCurrentSession, user?.uid]);

  if (!authResolved) {
    return <div className="min-h-dvh flex items-center justify-center p-6 bg-[#120c1c] text-[#f1e8d8]">
      <div className="celestial-panel max-w-md p-6 rounded-2xl space-y-4 text-center">
        <p role="status">Restoring your sign-in…</p>
      </div>
    </div>;
  }
  if (!user) {
    return <div className="min-h-dvh bg-[#120c1c]"><AuthModal user={null} required onClose={() => {}} /></div>;
  }
  if (!user || auth.currentUser?.uid !== user.uid) {
    return <div className="min-h-dvh flex items-center justify-center p-6 bg-[#120c1c] text-[#f1e8d8]">
      <div className="celestial-panel max-w-md p-6 rounded-2xl space-y-4 text-center">
        <p role="status">Restoring your sign-in…</p>
      </div>
    </div>;
  }
  if (!snapshot || snapshot.accountUid !== user.uid || snapshot.id !== id) {
    return <div className="min-h-dvh flex items-center justify-center p-6 bg-[#120c1c] text-[#f1e8d8]">
      <div className="celestial-panel max-w-md p-6 rounded-2xl space-y-4 text-center">
        <p role={error ? 'alert' : 'status'}>{error ? 'Your souvenir could not be loaded.' : loading ? 'Opening your souvenir…' : 'Opening your souvenir…'}</p>
        {error && <p className="text-xs font-mono text-red-200">{error}</p>}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {error && <button type="button" className="px-4 py-3 border rounded text-[#d4af37]" onClick={() => { void loadSnapshot(user.uid); }}>Retry</button>}
          <a href="/?app=1" className="px-4 py-3 border rounded text-[#d4af37]">Return to the atelier</a>
        </div>
      </div>
    </div>;
  }

  const chapters = snapshot.chapters;
  const chapter = activeChapter !== null ? chapters[activeChapter] ?? null : null;

  return <div key={`${user.uid}:${id}`} className="natally-workspace relative flex flex-col p-3 md:p-4 min-h-screen bg-[#120c1c] text-[#f1e8d8]">
    <ReadingStage
      extraControls={<>
        <button type="button" onClick={() => void handleDownloadPdf()}>Download PDF</button>
        <a href="/?app=1" className="px-2 py-1 underline text-[#d4af37]">Return to live atelier</a>
        {pdfStatus && <p role="status" className="text-sm text-amber-200 max-w-sm">{pdfStatus}</p>}
      </>}
      chartTools={<details className="reading-stage__chart-tools" open={!!chapter}>
        <summary>Souvenir chapters</summary>
        <div className="flex items-center gap-2 flex-wrap mt-1">
          <label className="flex min-w-0 items-center gap-2 text-white/80">
            <span className="sr-only">Choose a saved chapter</span>
            <select aria-label="Choose a saved chapter" className="min-h-11 min-w-0 max-w-64 rounded-lg border border-white/20 bg-[#241c32] px-2 text-white"
              value={activeChapter ?? ''} onChange={event => { const index = Number(event.target.value); if (Number.isInteger(index) && chapters[index]) speakChapter(index); }}>
              <option value="">Choose chapter…</option>
              {chapters.map((item, index) => <option key={index} value={index}>{item.title}</option>)}
            </select>
          </label>
          {chapter && <>
            <button type="button" className="px-2 py-0.5 rounded bg-[#1e152e] border border-[#d4af37]/40 text-[#f2ca50] whitespace-nowrap hover:border-[#f2ca50] transition-colors cursor-pointer" onClick={() => speakChapter(activeChapter!)}>
              {speakingChapter ? 'Speaking…' : 'Read aloud'}
            </button>
            <button type="button" className="px-2 py-0.5 rounded bg-[#1e152e] border border-white/20 text-[#f1e8d8] whitespace-nowrap hover:border-[#d4af37]/50 transition-colors cursor-pointer" onClick={() => handleShowTargets(chapter.targets)}>
              Show {chapter.targets.map(chartTargetLabel).join(' · ')}
            </button>
          </>}
          {speechError && <p role="alert" className="text-xs font-mono text-red-200 w-full">{speechError}</p>}
        </div>
        {chapter && <RichText content={chapter.text} className="mt-2 max-w-prose text-sm text-[#f1e8d8]" />}
        <p className="font-mono text-[10px] sm:text-xs text-[#d4af37]/75 mt-2">
          Saved {new Date(snapshot.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'long' })}
          {snapshot.retainUntil ? ` · retained until ${new Date(snapshot.retainUntil).toLocaleDateString(undefined, { dateStyle: 'medium' })}` : ''}
        </p>
      </details>}
      accountUid={`${user.uid}:souvenir:${id}`}
      presentation={presentation}
      phase={phase}
      paused={motionPaused}
      onPause={setMotionPaused}
      onView={setManualView}
      chart={<div className="relative w-full h-full">
        <Astrolabe3D chart={displayedChart!} isSpinning={false} resetTrigger={0}
          selectedComponents={presentation.selectedTargets} highlightedComponents={presentation.focusTargets}
          focusSequence={presentation.sequence} motionPaused={motionPaused} visible layoutKey={presentation.view}
          onToggleComponent={selectTarget} onSelectPlanet={name => { if (name) selectTarget(name, false); }} />
      </div>}
      conversation={<NatallyChatbot
        key={`${user.uid}:${id}`}
        embedded
        readOnly
        initialMessages={snapshot.messages as SouvenirMessages}
        presentation={presentation}
        onPresentationAction={handlePresentationAction}
        onReadingChart={handleReadingChart}
        onShowTargets={handleShowTargets}
        onPhaseChange={setPhase}
        onSpeechStateChange={handleSpeechStateChange}
        accountUid={user.uid}
        isCurrentSession={isCurrentSession}
        chart={snapshot.chart}
        userLore={[]}
        isOpen={true}
        onClose={() => {}}
        onOpen={() => {}}
        onSignIn={() => {}}
        isSignedIn={true}
        onAddUserLore={() => {}}
        voiceSettings={voiceSettings ?? snapshot.voiceSettings}
        onUpdateVoiceSettings={setVoiceSettings}
        onChartFocus={handleChartFocus}
        onSelectPlanet={name => selectTarget(name, false)}
      />} />
  </div>;
}

export default SouvenirViewer;
