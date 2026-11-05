import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Sparkles,
  Share2,
  BookOpen,
  User,
  RotateCcw,
  Compass,
} from 'lucide-react';
import { Astrolabe3D } from './components/Astrolabe3D';
import { chartFocusKey, chartFocusKeyMatches, chartTargetLabel, resolveChartTarget } from './services/chartTargets';
import { getAuthoredConversationClose } from './services/authoredChartExplanations';
import { readPaidConversationAccess } from './services/billingAccess';
import { calculateCurrentSkySnapshot } from './services/transits';
import { initialPresentation, reducePresentation, type PresentationAction, type PresentationCue, type PresentationView } from './services/presentation';
import { ReadingStage } from './components/ReadingStage';
import { ChartSelectionDetails } from './components/ChartSelectionDetails';
import { ProfileAbout } from './components/AboutDialog';
import { HISTORY_ERASURE_EVENT, isNatallyHistoryErasing, type HistoryErasureNotice } from './services/historyLifecycle';
import { requiresFreshOnboarding, completeFreshOnboarding } from './services/natallyHistory';
import type { ChartCue } from './services/natallyChat';
import { DraggableCard } from './components/DraggableCard';
import { FirstLight } from './components/onboarding/FirstLight';
import { NatalInputForm } from './components/NatalInputForm';
import { ThemesAndWisdomBox } from './components/ThemesAndWisdomBox';
import { NatallyChatbot } from './components/NatallyChatbot';
import { NatallySprite } from './components/NatallySprite';
import { NatallyIcon } from './components/NatallyIcon';
import { SelectedComponentsBar } from './components/SelectedComponentsBar';
import { generateAstrologicalReading } from './services/readings';
import { useAtelierTheme } from './services/atelierTheme';
import { AtelierThemeSelector } from './components/atelier/AtelierThemeSelector';
import { saveReadingStyle } from './services/readingStyle';
import { LearnAndPayments } from './components/LearnAndPayments';
import { ExportModal } from './components/ExportModal';
import { SouvenirViewer } from './components/SouvenirViewer';
import { AuthModal } from './components/AuthModal';
import { ReadingsModal } from './components/ReadingsModal';
import {
  calculateNatalChart,
  NatalChartInput,
  NatalChartResult,
  formatLongitude,
} from './services/ephemeris';
import { computeThemesAndWisdom, NumerologyAndThemes } from './services/astrowisdom';
import {
  VoiceSettings,
  loadVoiceSettings,
  saveVoiceSettings,
  stopSpeaking,
} from './services/voiceService';
import { loadAccountValue, saveAccountValue } from './services/accountStorage';
import { restoreCheckoutCustomer } from './services/revenueCatCheckout';
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { loadGazetteer } from './services/gazetteer';
import { createSessionProfileLoader, getEntryStage, type SessionProfileState } from './services/sessionProfile';
import {
  IntakeStorageBillingError,
  clearNatalIntake,
  fetchUserIntake,
  uploadUserIntake,
} from './services/onboarding';
import {
  IntakeDraft,
  intakeToChartInput,
  loadNatalIntake,
  saveNatalIntake,
} from './services/onboarding';

const LORE_STORAGE_KEY = 'astrosphere_user_lore_v1';
const OFFER_JOURNEY_SEEN_KEY = 'natally_offer_journey_seen_v1';

export default function App() {
  const [showLearning,setShowLearning]=useState(false);
  const [quickReadingBusy,setQuickReadingBusy]=useState(false);
  const quickReadingLock=useRef(false);
  const [quickReadingError,setQuickReadingError]=useState<string|null>(null);
  const [chartInput, setChartInput] = useState<NatalChartInput | null>(null);
  const [chartResult, setChartResult] = useState<NatalChartResult | null>(null);
  const [readingObservation,setReadingObservation] = useState<{chart:NatalChartResult;archived:boolean}|null>(null);
  const readingObservationRef = useRef<typeof readingObservation>(null);
  const displayedChart = readingObservation && chartResult && chartFocusKeyMatches(chartFocusKey(readingObservation.chart),chartResult) ? readingObservation.chart : chartResult;
  useEffect(() => {readingObservationRef.current=null;setReadingObservation(null);},[chartResult]);
  const [wisdom, setWisdom] = useState<NumerologyAndThemes | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [currentSkyError, setCurrentSkyError] = useState<string | null>(null);
  const [isRefreshingSky, setIsRefreshingSky] = useState(false);
  const skyOperation = useRef(0);
  const [onboardBusy, setOnboardBusy] = useState<boolean>(false);
  const [onboardError, setOnboardError] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(true);
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [inspectorTab, setInspectorTab] = useState<'planets' | 'houses'>('planets');
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState<boolean>(true);

  // Multi-Selection State for Shift-/Ctrl-Clicking Components
  const [presentation, setPresentation] = useState(() => initialPresentation(''));
  const [focusReadingRequest, setFocusReadingRequest] = useState(0);
  const selectedComponents = presentation.selectedTargets;
  const setSelectedComponents = (value: string[] | ((previous:string[])=>string[])) => setPresentation(previous => ({...previous,selectedTargets:typeof value === 'function' ? value(previous.selectedTargets) : value}));
  const chartRef = useRef(chartResult); chartRef.current = chartResult;
  const [selectionRequest, setSelectionRequest] = useState<{id:string;targets:string[];sourceChart:NatalChartResult} | null>(null);
  const [educationalRequest, setEducationalRequest] = useState<{id:string;target:string;sourceChart:NatalChartResult} | null>(null);
  const [phase, setPhase] = useState<'idle'|'listening'|'thinking'|'speaking'>('idle');
  const [motionPaused, setMotionPaused] = useState(false);
  const handleReadingChart = useCallback((source:NatalChartResult,archived:boolean) => {
    if (!chartRef.current || !chartFocusKeyMatches(chartFocusKey(source),chartRef.current)) return;
    const observation={chart:source,archived};
    readingObservationRef.current=observation;setReadingObservation(observation);
    // Manual inspection lasts until the next reading or replay begins.
    setPresentation(previous => ({...previous,follow:true,panel:'conversation'}));
  },[]);
  const handlePresentationAction = useCallback((action:PresentationAction, sourceChart:NatalChartResult) => {
    if (!chartRef.current || !chartFocusKeyMatches(chartFocusKey(sourceChart),chartRef.current)) return;
    setPresentation(previous => reducePresentation(previous,action,sourceChart));
  }, []);
  const handleChartFocus = useCallback((targets:string[], sourceChart:NatalChartResult) => {
    if (chartRef.current !== sourceChart) return;
    setPresentation(previous => reducePresentation(previous,targets.length ? {type:'focus',targets:targets.slice(0,6)} : {type:'clear'},sourceChart));
  }, []);
  const setManualView = (view:PresentationView) => setPresentation(previous => ({...previous,view,follow:false}));
  const showTargets = (targets:string[]) => {
    const source=readingObservationRef.current?.chart ?? chartResult;
    if (!source) return;
    const canonical = targets.map(target => resolveChartTarget(target,source)).filter((target):target is string => !!target);
    if (!canonical.length) return;
    setPresentation(previous => ({...reducePresentation(previous,{type:'focus',targets:canonical.slice(0,6)},source),selectedTargets:[...new Set([...previous.selectedTargets,...canonical])],view:'chart',follow:false,panel:'selection'}));
  };
  const [isGeneratingMultiReading, setIsGeneratingMultiReading] = useState(false);
  const [isNatalParamsRolledUp, setIsNatalParamsRolledUp] = useState(true);
  const [isThemesRolledUp, setIsThemesRolledUp] = useState(false);

  // Natally Companion State
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [synastryChart, setSynastryChart] = useState<NatalChartResult | null>(null);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(() => loadVoiceSettings());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSnippet, setSpeechSnippet] = useState<string | null>(null);
  const [activeTargetEntity, setActiveTargetEntity] = useState<string | null>(null);
  // Keyboard quick-entry: typing anything (no field focused) summons a small
  // chat entry box — mouseless desktop path that never blocks the torus view.
  const [quickEntryOpen, setQuickEntryOpen] = useState<boolean>(false);
  const [quickMessage, setQuickMessage] = useState<{ text: string; nonce: number } | null>(null);
  const [externalReadingToInject, setExternalReadingToInject] = useState<{
    streamId?: string;
    model?: string;
    title: string;
    content: string;
    type: string;
    sender?: 'user' | 'natally';
    observationSnapshot?: NatalChartResult['currentSky'];
    generatedAt?:string;
    chartCues?: ChartCue[];
    presentationVersion?:1;
    presentationCues?:PresentationCue[];
    chartFocusKey?: string;
  } | null>(null);
  const [externalReadingProgress,setExternalReadingProgress] = useState<{id:string;text:string;model?:string;chart:NatalChartResult;title:string;error?:string}|null>(null);

  // Modals
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showReadingsModal, setShowReadingsModal] = useState(false);
  const [readingsInitialType, setReadingsInitialType] = useState<
    'horoscope' | 'synastry' | 'house' | 'planet' | 'aspect'
  >('horoscope');
  const [readingsTargetKey, setReadingsTargetKey] = useState<string | undefined>(undefined);

  // User state & Persistent Lore memory store
  const [user, setUser] = useState<FirebaseUser | null>(null);
  useEffect(() => { setEducationalRequest(null); }, [chartResult, user?.uid]);
  const atelierTheme=useAtelierTheme(user?.uid??null);
  useEffect(()=>{quickReadingLock.current=false;setQuickReadingBusy(false);setQuickReadingError(null);setShowLearning(false);},[user?.uid]);
  const [authResolved, setAuthResolved] = useState<boolean>(false);
  const [profileState, setProfileState] = useState<SessionProfileState<NatalChartInput>>({ uid: null, status: 'loading', profile: null, error: null });
  const profileLoader = useRef<ReturnType<typeof createSessionProfileLoader<NatalChartInput>> | null>(null);
  const sessionGeneration = useRef(0);
  const booted = useRef(false);
  // Capture the entry URL before the purchase provider strips offer params;
  // an explicit offer flow always takes precedence over the automatic journey.
  const explicitEntryOffer = useRef<boolean>(((): boolean => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('offers') === '1' || params.get('offer') === 'reading' || params.get('offer') === 'conversation';
    } catch { return false; }
  })());
  const offerLookupStarted = useRef<Set<string>>(new Set<string>());
  const maybeAutoShowOfferJourney = useCallback(async (uid: string, generation: number) => {
    if (offerLookupStarted.current.has(uid) || explicitEntryOffer.current) return;
    offerLookupStarted.current.add(uid);
    try {
      if (loadAccountValue<boolean>(OFFER_JOURNEY_SEEN_KEY, uid, false)) return;
      const source = chartRef.current;
      if (!source) return;
      const customer = await restoreCheckoutCustomer();
      if (auth.currentUser?.uid !== uid || sessionGeneration.current !== generation) return;
      const knownProducts = ['natally_reading_test_v3', 'natally_roche_test_v3'];
      const purchasedKnown = knownProducts.some(product => !!customer.allPurchaseDatesByProduct?.[product]) ||
        (customer.nonSubscriptionTransactions ?? []).some(transaction => knownProducts.includes(transaction.productIdentifier));
      const hasActiveEntitlement = Object.keys(customer.entitlements?.active ?? {}).length > 0;
      if (purchasedKnown || hasActiveEntitlement) return;
      if (chartRef.current !== source) return;
      saveAccountValue(OFFER_JOURNEY_SEEN_KEY, uid, true);
      stopSpeaking();
      try { window.dispatchEvent(new CustomEvent('natally:show-offers')); } catch (_) {}
    } catch {
      // A restore/lookup error must not classify the account as unpaid; skip the automatic offer.
    }
  }, []);
  // Billing/quota storage failure: proceeding unmetered would leak funds.
  const [storageBillingBlocked, setStorageBillingBlocked] = useState<string | null>(null);
  const [userLore, setUserLore] = useState<string[]>([]);
  const [historyRevision, setHistoryRevision] = useState(0);
  // This closure belongs to one authenticated session, including A→B→A changes.
  const renderGeneration = sessionGeneration.current;
  const isCurrentSession = () => !!user && auth.currentUser?.uid === user.uid &&
    sessionGeneration.current === renderGeneration && !isNatallyHistoryErasing(user.uid);

  useEffect(() => {
    const changed = (event: Event) => {
      const notice = (event as CustomEvent<HistoryErasureNotice>).detail;
      if (notice.accountUid !== auth.currentUser?.uid) return;
      sessionGeneration.current++;
      stopSpeaking(); setIsSpeaking(false); setSpeechSnippet(null); setPhase('idle');
      setShowReadingsModal(false); setExternalReadingToInject(null); setExternalReadingProgress(null); setQuickMessage(null);
      setSelectionRequest(null); setIsGeneratingMultiReading(false);
      if (notice.phase === 'complete') {
        booted.current = false;
        skyOperation.current++;
        chartRef.current = null;
        setChartInput(null); setChartResult(null); setWisdom(null); setSynastryChart(null);
        setCurrentSkyError(null); setIsRefreshingSky(false); setIsCalculating(false);
        setReadingObservation(null); readingObservationRef.current = null;
        setSelectedComponents([]); setActiveTargetEntity(null); setPresentation(initialPresentation(''));
        setOnboardError(null); setOnboardBusy(false); setShowAuthModal(false); setShowExportModal(false);
        setProfileState({ uid: notice.accountUid, status: 'ready', profile: null, error: null });
      }
      if (notice.phase !== 'erasing') {
        const saved = loadAccountValue<unknown>(LORE_STORAGE_KEY, notice.accountUid, []);
        setUserLore(Array.isArray(saved) ? saved.filter((value): value is string => typeof value === 'string') : []);
        setHistoryRevision(value => value + 1);
      }
    };
    window.addEventListener(HISTORY_ERASURE_EVENT, changed);
    return () => window.removeEventListener(HISTORY_ERASURE_EVENT, changed);
  }, []);

  useEffect(() => {
    if (isCurrentSession()) saveAccountValue(LORE_STORAGE_KEY, user!.uid, userLore);
  }, [userLore, user]);

  useEffect(() => {
    if (!authResolved || !user || profileState.status !== 'ready' || !chartInput) return;
    const onAnyKey = (e: KeyboardEvent) => {
      if (document.querySelector('dialog[open]') || (e.target as HTMLElement | null)?.closest('button, a, [role="button"]')) return;
      if (e.key === 'Escape') { setQuickEntryOpen(false); return; }
      const target = e.target as HTMLElement | null;
      const inField = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable);
      const printable = e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter';
      if (!inField && !quickEntryOpen && printable && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setQuickEntryOpen(true);
      }
    };
    window.addEventListener('keydown', onAnyKey);
    return () => window.removeEventListener('keydown', onAnyKey);
  }, [quickEntryOpen, authResolved, user, profileState.status, chartInput]);

  useEffect(() => {
    const loader = createSessionProfileLoader<NatalChartInput>(async uid => {
      if (requiresFreshOnboarding(uid)) return null;
      const remote = await fetchUserIntake(uid);
      return requiresFreshOnboarding(uid) ? null : remote ?? loadNatalIntake(uid);
    }, state => {
      const restartRequired = !!state.uid && requiresFreshOnboarding(state.uid);
      if (restartRequired && state.status === 'ready') state = { ...state, profile: null };
      setProfileState(state);
      if (state.status === 'ready' && state.uid && auth.currentUser?.uid === state.uid) {
        if (state.profile) saveNatalIntake(state.profile, state.uid);
        setChartInput(state.profile);
      }
    });
    profileLoader.current = loader;
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      sessionGeneration.current += 1;
      booted.current = false;
      stopSpeaking();
      setIsSpeaking(false);
      setSpeechSnippet(null);
      setActiveTargetEntity(null);
      setSelectedComponents([]);
      setPresentation(initialPresentation('')); setSelectionRequest(null); setPhase('idle');
      setIsGeneratingMultiReading(false);
      const lore = loadAccountValue<unknown>(LORE_STORAGE_KEY, currentUser?.uid, []);
      setUserLore(Array.isArray(lore) ? lore.filter((item): item is string => typeof item === 'string') : []);
      setUser(currentUser);
      setAuthResolved(true);
      setChartInput(null);
      setChartResult(null);
      setCurrentSkyError(null);
      setIsRefreshingSky(false);
      skyOperation.current += 1;
      setWisdom(null);
      setSynastryChart(null);
      setStorageBillingBlocked(null);
      setOnboardError(null);
      setOnboardBusy(false);
      setIsCalculating(false);
      setIsChatOpen(true);
      setQuickEntryOpen(false);
      setQuickMessage(null);
        setExternalReadingToInject(null);setExternalReadingProgress(null);
      setShowAuthModal(false);
      setShowReadingsModal(false);
      setShowExportModal(false);
      void loader.load(currentUser?.uid ?? null);
    }, () => {
      sessionGeneration.current += 1;
      stopSpeaking();
      setUserLore([]);
      setChartInput(null);
      setChartResult(null);
      setSpeechSnippet(null);
      setPresentation(initialPresentation('')); setSelectionRequest(null); setPhase('idle');
      setIsSpeaking(false);
      setAuthResolved(true);
      setUser(null);
      void loader.load(null);
    });
    return () => { unsubscribe(); loader.dispose(); sessionGeneration.current += 1; profileLoader.current = null; };
  }, []);

  const runCalculation = useCallback(async (input: NatalChartInput, isUserSubmission = false) => {
    const generation = sessionGeneration.current;
    const uid = auth.currentUser?.uid;
    if (!uid) return false;
    const operation = ++skyOperation.current;
    setIsRefreshingSky(false);
    setIsCalculating(true);
    try {
      let res = await calculateNatalChart(input);
      let skyError: string | null = null;
      try {
        res = {...res, currentSky: await calculateCurrentSkySnapshot(res)};
      } catch (err) {
        skyError = err instanceof Error ? err.message : 'The observation could not be calculated.';
      }
      if (generation !== sessionGeneration.current || auth.currentUser?.uid !== uid || operation !== skyOperation.current) return false;
      setCurrentSkyError(skyError);
      setChartResult(res);
      chartRef.current = res;
      stopSpeaking();
      setPresentation(initialPresentation(chartFocusKey(res))); setSelectionRequest(null); setPhase('idle');
      setSynastryChart(null);
      setChartInput(input);
      setSelectedComponents([]);

      const w = computeThemesAndWisdom(res);
      setWisdom(w);
      // Automatically roll up natal parameters like a shade & reveal major themes under it!
      setIsNatalParamsRolledUp(true);
      setIsThemesRolledUp(true);
      try {
        localStorage.removeItem('astrosphere_card_pos_themes-wisdom');
        localStorage.removeItem('astrosphere_card_pos_natal-params');
      } catch (_) {}
      setResetTrigger((c) => c + 1);

      if (isUserSubmission) {
        setExternalReadingToInject({
          title: `Your natal reading · ${input.name}`,
          content: '', // Hidden opening sequence is owned by NatallyChatbot.
          type: 'initial_reading',
          sender: 'user',
        });
        setIsChatOpen(true);
      }
    } catch (err) {
      console.error('Swiss Ephemeris calculation error:', err);
      return false;
    } finally {
      if (generation === sessionGeneration.current && operation === skyOperation.current) setIsCalculating(false);
    }
    return true;
  }, []);

  const refreshCurrentSky = async () => {
    const previousChart = chartRef.current;
    const uid = auth.currentUser?.uid;
    if (!previousChart || !uid || isCalculating || isRefreshingSky || !isCurrentSession()) return;
    const generation = sessionGeneration.current;
    const operation = ++skyOperation.current;
    setIsRefreshingSky(true);
    try {
      const currentSky = await calculateCurrentSkySnapshot(previousChart);
      if (generation !== sessionGeneration.current || auth.currentUser?.uid !== uid || operation !== skyOperation.current || chartRef.current !== previousChart) return;
      const updatedChart = {...previousChart, currentSky};
      stopSpeaking();
      chartRef.current = updatedChart;
      setChartResult(updatedChart);
      setCurrentSkyError(null);
      setSelectionRequest(null);
      setPhase('idle');
      setActiveTargetEntity(null);
      setPresentation(previous => ({...previous,
        selectedTargets: previous.selectedTargets.filter(target => !!resolveChartTarget(target, updatedChart)),
        focusTargets: previous.focusTargets.filter(target => !!resolveChartTarget(target, updatedChart)),
      }));
    } catch (err) {
      if (generation === sessionGeneration.current && auth.currentUser?.uid === uid && operation === skyOperation.current) {
        setCurrentSkyError(err instanceof Error ? err.message : 'The observation could not be calculated.');
      }
    } finally {
      if (generation === sessionGeneration.current && operation === skyOperation.current) setIsRefreshingSky(false);
    }
  };

  const handleDiscussWithNatally = (title: string, query: string) => {
    setExternalReadingToInject({
      title,
      content: query,
      type: 'user_query',
      sender: 'user',
    });
    setIsChatOpen(true);
  };

  const handleToggleNatalParams = (rolledUp: boolean) => {
    setIsNatalParamsRolledUp(rolledUp);
    if (!rolledUp) {
      // User expanded natal parameters: roll up themes to preserve vertical space
      setIsThemesRolledUp(true);
    } else {
      // User rolled up natal parameters: reveal themes right under the title bar!
      setIsThemesRolledUp(false);
    }
  };

  // First-light onboarding: cast the sky the moment the intake completes.
  const handleOnboarded = useCallback(
    async (draft: IntakeDraft) => {
      const uid = auth.currentUser?.uid;
      const generation = sessionGeneration.current;
      if (!uid) return;
      setOnboardBusy(true);
      setOnboardError(null);
      try {
        const input = intakeToChartInput(draft);
        saveNatalIntake(input, uid);
        saveReadingStyle(uid,input.readingStyle??"plain");
        if (auth.currentUser?.uid === uid) {
          try {
            await uploadUserIntake(uid, input);
          } catch (err) {
            if (generation !== sessionGeneration.current) return;
            if (err instanceof IntakeStorageBillingError) { setStorageBillingBlocked(err.message); return; }
            throw err;
          }
        }
        if (generation !== sessionGeneration.current || auth.currentUser?.uid !== uid) return;
        booted.current = true;
        const cast = await runCalculation(input, true);
        if (!cast) throw new Error('Your sky could not be drawn. Please try again.');
        if(generation===sessionGeneration.current&&auth.currentUser?.uid===uid) {
          completeFreshOnboarding(uid);
          // Presentation-only offer journey; never part of onboarding success or failure.
          void maybeAutoShowOfferJourney(uid, generation);
        }
      } catch (err) {
        if (generation !== sessionGeneration.current) return;
        setOnboardError(
          err instanceof Error ? err.message : 'Your sky could not be drawn. Please try again.'
        );
      } finally {
        if (generation === sessionGeneration.current) setOnboardBusy(false);
      }
    },
    [runCalculation, maybeAutoShowOfferJourney]
  );

  // Returning visitors: their persisted intake recasts on load, once.
  useEffect(() => {
    if (!authResolved || !user || profileState.uid !== user.uid || profileState.status !== 'ready' || !chartInput || booted.current) return;
    booted.current = true;
    runCalculation(chartInput, false);
  }, [chartInput, runCalculation, authResolved, user, profileState]);

  // Handle Shift-/Ctrl-Click multi-selection toggle
  const handleToggleComponent = (componentId:string, isMulti:boolean) => {
    if (!chartResult) return;
    const source=readingObservationRef.current?.chart ?? chartResult;
    const canonical = resolveChartTarget(componentId,source);
    if (!canonical) return;
    setPresentation(previous => {
      const selectedTargets = isMulti ? previous.selectedTargets.includes(canonical) ? previous.selectedTargets.filter(t => t !== canonical) : [...previous.selectedTargets,canonical] : [canonical];
      return {...reducePresentation(previous,{type:'focus',targets:[canonical]},source),selectedTargets,panel:'selection'};
    });
    setActiveTargetEntity(canonical);
    setEducationalRequest({id:crypto.randomUUID(),target:canonical,sourceChart:source});
  };

  const handleClearSelection = () => {
    setSelectedComponents([]);
    setActiveTargetEntity(null);
  };

  const handleRemoveComponent = (id: string) => {
    setSelectedComponents((prev) => prev.filter((c) => c !== id));
  };

  // Begin Intuitive Reading based on selected components
  const handleBeginIntuitiveReading = (components:string[]) => {
    if (!isCurrentSession() || !chartResult || !components.length || isGeneratingMultiReading) return;
    const sourceChart=readingObservationRef.current?.chart ?? chartResult;
    const targets = components.map(t => resolveChartTarget(t,sourceChart)).filter((t):t is string => !!t);
    if (!targets.length) return;
    setPresentation(previous => ({...reducePresentation(previous,{type:'focus',targets:targets.slice(0,6)},sourceChart),selectedTargets:targets,panel:'selection'}));
    setSelectionRequest({id:crypto.randomUUID(),targets,sourceChart});
    setIsChatOpen(true);
  };

  const handleInstaNow = async () => {
    if(!isCurrentSession()||!chartResult||quickReadingLock.current||isGeneratingMultiReading)return;
    const source=chartResult,owner=user!.uid,generation=sessionGeneration.current;
    const streamId=`reading-stream-${Date.now()}`;
    const streamTitle=atelierTheme==='horrorween'?'HORRORSCOPE - RIGHT NOW':'YOUR SKY - RIGHT NOW';
    const current=()=>auth.currentUser?.uid===owner&&sessionGeneration.current===generation&&chartRef.current===source;
    quickReadingLock.current=true;setQuickReadingBusy(true);setQuickReadingError(null);setPhase('thinking');
    setPresentation(previous=>({...previous,follow:true,panel:'conversation'}));
    try {
      const { canInfer } = await readPaidConversationAccess(owner);
      if (!current()) return;
      if (!canInfer) {
        const lesson = getAuthoredConversationClose(source.input.name);
        setExternalReadingToInject({title:lesson.title,content:lesson.text,type:'educational',observationSnapshot:source.currentSky,generatedAt:new Date().toISOString()});
        setIsChatOpen(true);
        return;
      }
      const reading=await generateAstrologicalReading({type:'horoscope',chart:source,accountUid:owner,userLore,presentation,quickNow:true,length:'short',seasonalMood:atelierTheme==='horrorween'?'halloween':undefined,isCurrentSession:current,onProgress:(text,model,chart)=>{if(current())setExternalReadingProgress({id:streamId,text,model,chart,title:streamTitle});}});
      if(!current())return;
      setExternalReadingToInject({streamId,model:reading.model,title:reading.title,content:reading.content,type:'horoscope',chartCues:reading.chartCues,presentationVersion:reading.presentationVersion,presentationCues:reading.presentationCues,chartFocusKey:reading.chartFocusKey,observationSnapshot:reading.observationSnapshot,generatedAt:reading.generatedAt});
      setIsChatOpen(true);
    } catch(error){if(current()) {const message=error instanceof Error && /dynamically imported module|Loading chunk|Importing a module script/i.test(error.message)?'A new Natally version is available. Reload to continue; your saved conversation stays here.':error instanceof Error?error.message:'The current-sky reading could not be generated. Please retry.';setQuickReadingError(message);setExternalReadingProgress(previous=>previous?.id===streamId?{...previous,error:message}:null);}}
    finally{if(generation===sessionGeneration.current){quickReadingLock.current=false;setQuickReadingBusy(false);setPhase(previous=>previous==='thinking'?'idle':previous);}}
  };

  const handleOpenReading = (
    type: 'horoscope' | 'synastry' | 'house' | 'planet' | 'aspect',
    targetKey?: string
  ) => {
    setReadingsInitialType(type);
    setReadingsTargetKey(targetKey);
    setShowReadingsModal(true);
  };

  const handleAddUserLore = (newLore: string) => {
    if (!isCurrentSession()) return;
    setUserLore((prev) => (prev.includes(newLore) ? prev : [newLore, ...prev]));
  };

  const handleSpeechStateChange = (
    speaking: boolean,
    snippet: string | null,
    targetEntity: string | null
  ) => {
    if (!isCurrentSession()) return;
    setIsSpeaking(speaking);
    setSpeechSnippet(snippet);
      setActiveTargetEntity(targetEntity);
  };

  const entryStage = getEntryStage(authResolved, user?.uid ?? null, profileState, chartInput !== null);
  if (entryStage === 'login') {
    return <div className="min-h-dvh bg-[#120c1c]"><AuthModal user={null} required onClose={() => {}} /></div>;
  }
  if (entryStage === 'session-loading' || entryStage === 'profile-loading' || entryStage === 'profile-error') {
    return <div className="min-h-dvh flex items-center justify-center p-6 bg-[#120c1c] text-[#f1e8d8]">
      <div className="celestial-panel max-w-md p-6 rounded-2xl space-y-4 text-center">
        <p role={entryStage === 'profile-error' ? 'alert' : 'status'}>{entryStage === 'session-loading' ? 'Restoring your sign-in…' : entryStage === 'profile-loading' ? 'Loading your saved Natally profile…' : 'Your saved profile could not be loaded. Please retry; your existing profile has not been replaced.'}</p>
        {entryStage === 'profile-error' && <button type="button" className="px-4 py-3 border rounded text-[#d4af37]" onClick={() => { void profileLoader.current?.load(auth.currentUser?.uid ?? null); }}>Retry profile loading</button>}
        {user && <button type="button" className="px-4 py-3 border rounded" onClick={() => { void signOut(auth).catch(error => setProfileState(previous => ({ ...previous, status: 'error', error: String(error) }))); }}>Sign out</button>}
      </div>
    </div>;
  }

  const souvenirId = new URLSearchParams(window.location.search).get('souvenir');
  if (souvenirId && user) {
    return <SouvenirViewer id={souvenirId} />;
  }

  if (storageBillingBlocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#120c1c]">
        <div className="celestial-panel max-w-md rounded-2xl p-6 border border-red-500/40 text-center space-y-3">
          <h2 className="font-cinzel text-lg text-red-300">The observatory is closed</h2>
          <p className="text-sm text-red-200/90 font-mono">{storageBillingBlocked}</p>
          <p className="text-xs text-white/60 font-mono">
            Journey blocked on purpose: unmetered inference spend would leak funds. Restore
            Firebase billing/quota, then reload.
          </p>
        </div>
      </div>
    );
  }

  if (!chartInput) {
    return (
      <FirstLight
        gazetteer={loadGazetteer()}
        busy={onboardBusy}
        error={onboardError}
        onCreate={(draft) => {
          void handleOnboarded(draft);
        }}
      />
    );
  }

  const houseSystemLabel =
    chartInput.houseSystem === 'W'
      ? 'Whole Sign'
      : chartInput.houseSystem === 'K'
      ? 'Koch Houses'
      : chartInput.houseSystem === 'R'
      ? 'Regiomontanus'
      : chartInput.houseSystem === 'E'
      ? 'Equal Houses'
      : 'Placidus Houses';

  return (
    <div className="natally-workspace relative flex flex-col p-3 md:p-4 min-h-screen bg-[#120c1c] text-[#f1e8d8] overflow-hidden select-none">
      <LearnAndPayments open={showLearning} onClose={()=>setShowLearning(false)} />
      {/* Top Navigation & Ephemeris Telemetry Bar */}
      <header className="w-full max-w-7xl mx-auto flex flex-row items-center justify-between gap-3 border-b border-[#d4af37]/25 pb-2 z-20 pointer-events-auto">
        <div className="flex items-center gap-2.5 min-w-0">
          <NatallyIcon size="md" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-cinzel text-lg sm:text-xl md:text-2xl text-[#f2ca50] tracking-wider uppercase font-bold shrink-0">
                Natally
              </h1>
              {chartResult && (
                <span className="font-fraunces text-xs sm:text-sm text-[#f2a38c] sm:border-l border-[#d4af37]/30 sm:pl-2.5 truncate">
                  {chartResult.input.name}
                </span>
              )}
            </div>

          </div>
        </div>

        <ProfileAbout onAccount={() => setShowAuthModal(true)} accountLabel={user?.displayName || 'Account'} accountUid={user?.uid}
          onReadings={() => handleOpenReading('horoscope')} onHelp={() => setShowLearning(true)} />
      </header>

      {chartResult && <div className="w-full max-w-7xl mx-auto my-2 relative z-10">
        <SelectedComponentsBar selectedComponents={selectedComponents} onRemoveComponent={handleRemoveComponent} onClearAll={handleClearSelection} onBeginIntuitiveReading={handleBeginIntuitiveReading} isGeneratingReading={isGeneratingMultiReading} />
        <ReadingStage chartTools={<details className="reading-stage__chart-tools"><summary>Chart details</summary>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <p className="font-mono text-[10px] sm:text-xs text-[#d4af37]/75">
                Swiss Ephemeris v{chartResult?.engineVersion || '2.10.03'} · {houseSystemLabel} · Geocentric
              </p>
              {chartResult && (
                <div className="flex items-center gap-1.5 flex-wrap font-mono text-[10px] sm:text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleOpenReading('planet', 'Ascendant')}
                    className="px-2 py-0.5 rounded bg-[#1e152e] border border-[#d4af37]/40 text-[#f2ca50] whitespace-nowrap hover:border-[#f2ca50] transition-colors cursor-pointer"
                  >
                    {chartResult.ascFormatted}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenReading('planet', 'Midheaven')}
                    className="px-2 py-0.5 rounded bg-[#1e152e] border border-[#d4af37]/40 text-[#f2ca50] whitespace-nowrap hover:border-[#f2ca50] transition-colors cursor-pointer"
                  >
                    {chartResult.mcFormatted}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenReading('planet', 'Sun')}
                    className="px-2 py-0.5 rounded bg-[#1e152e] border border-white/20 text-[#f1e8d8] whitespace-nowrap hover:border-[#d4af37]/50 transition-colors cursor-pointer"
                  >
                    {chartResult.sunFormatted}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenReading('planet', 'Moon')}
                    className="px-2 py-0.5 rounded bg-[#1e152e] border border-white/20 text-[#f1e8d8] whitespace-nowrap hover:border-[#d4af37]/50 transition-colors cursor-pointer"
                  >
                    {chartResult.moonFormatted}
                  </button>
                </div>
              )}
            </div>
        <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-white/10 bg-[#171321] px-4 py-3 text-sm" aria-label="Chart layers and observation time">
          <span className="text-[#ffdf80]">● Natal · birth chart</span>
          <span className="text-[#67e8f9]">{readingObservation?.archived ? displayedChart?.currentSky ? '● Archived observation' : '● Historical sky unavailable · natal only' : '● Now · current sky'}</span>
          <label className="flex min-w-0 items-center gap-2 text-white/80">Highlight an aspect
            <select aria-label="Highlight an aspect" className="min-h-11 min-w-0 max-w-64 rounded-lg border border-white/20 bg-[#241c32] px-2 text-white" value="" onChange={event => {if (event.target.value) showTargets([event.target.value]);}}>
              <option value="">Choose relationship…</option>
              <optgroup label="Natal">{chartResult.aspectChords.map(aspect => <option key={aspect.name} value={aspect.name}>{chartTargetLabel(aspect.name)}</option>)}</optgroup>
              {!!displayedChart?.currentSky?.aspects.length && <optgroup label={readingObservation?.archived ? 'Archived sky → natal' : 'Current → natal'}>{displayedChart.currentSky.aspects.map(aspect => <option key={aspect.name} value={aspect.name}>{chartTargetLabel(aspect.name)}</option>)}</optgroup>}
            </select>
          </label>
          {displayedChart?.currentSky && <time className="text-white/70" dateTime={displayedChart.currentSky.observedAt}>Observed {new Date(displayedChart.currentSky.observedAt).toLocaleString(undefined, {dateStyle:'medium', timeStyle:'long'})}</time>}
          <button type="button" className="ml-auto min-h-11 rounded-lg border border-cyan-200/30 px-3 text-cyan-100 disabled:opacity-50" disabled={isRefreshingSky || isCalculating} onClick={() => void refreshCurrentSky()}>{isRefreshingSky ? 'Updating positions…' : 'Update to current time'}</button>
          {currentSkyError && <p role="status" className="w-full text-amber-200">{chartResult.currentSky ? 'Sky refresh unavailable; the displayed observation is unchanged.' : 'Current sky unavailable; your natal chart remains available.'} {currentSkyError} Use Update to current time to try again.</p>}
        </div>
        </details>} extraControls={<><button type="button" onClick={() => setShowExportModal(true)} className="flex items-center gap-2"><Share2 className="w-4 h-4" />Share chart</button><button type="button" disabled={quickReadingBusy||isGeneratingMultiReading} onClick={()=>void handleInstaNow()}>{quickReadingBusy?'Reading the sky…':atelierTheme==='horrorween'?'Insta-now horrorscope':'Insta-now horoscope'}</button><details className="reading-stage__options"><summary>Room</summary><div className="reading-stage__options-body"><AtelierThemeSelector accountUid={user!.uid}/></div></details>{quickReadingError&&<p role="alert" className="text-sm text-amber-200 max-w-sm">{quickReadingError} <button type="button" onClick={()=>quickReadingError.startsWith('A new Natally version')?window.location.reload():void handleInstaNow()}>{quickReadingError.startsWith('A new Natally version')?'Reload Natally':'Retry horoscope'}</button></p>}</>} accountUid={user!.uid} presentation={presentation} phase={phase} paused={motionPaused} onPause={setMotionPaused}
          onView={setManualView}
          chart={<div className="relative w-full h-full"><Astrolabe3D chart={displayedChart!} isSpinning={isSpinning} resetTrigger={resetTrigger}
            selectedComponents={selectedComponents} highlightedComponents={presentation.focusTargets}
            focusSequence={presentation.sequence} motionPaused={motionPaused} visible layoutKey={presentation.view}
            onToggleComponent={handleToggleComponent} onSelectPlanet={name => {if(name) handleToggleComponent(name,false);}} />
            {presentation.focusTargets.length > 0 && <button type="button" className="absolute left-3 bottom-8 z-20 max-w-[85%] rounded-lg border border-[#d4af37]/60 bg-[#181126]/95 p-3 text-left text-xs text-[#ffdf80] focus-visible:outline focus-visible:outline-2" aria-label="Now focusing on: return to the reading" onClick={() => {setPresentation(previous=>({...previous,panel:'conversation'}));setFocusReadingRequest(previous=>previous+1);}}><span role="status">Now focusing on: {presentation.focusTargets.map(chartTargetLabel).join(' · ')}</span><span className="block underline mt-1">Follow the reading ↗</span></button>}
          </div>}
          conversation={<div className="flex h-full min-h-0 flex-col">
            {presentation.panel === 'selection' && (selectedComponents.length > 0 || presentation.focusTargets.length > 0) && <div className="shrink-0 max-h-52 overflow-auto"><ChartSelectionDetails chart={displayedChart!} targets={selectedComponents.length ? selectedComponents : presentation.focusTargets} onDiscuss={handleBeginIntuitiveReading} busy={isGeneratingMultiReading} /></div>}
            <div className="min-h-0 flex-1"><NatallyChatbot
          key={`${user!.uid}:${historyRevision}`}
          embedded
          focusReadingRequest={focusReadingRequest}
          presentation={presentation}
          onPresentationAction={handlePresentationAction}
          onReadingChart={handleReadingChart}
          onReadingStart={() => {setPresentation(previous=>({...previous,view:'chart',follow:true,panel:'conversation'}));document.querySelector('.reading-stage__visual')?.scrollIntoView({block:'start',behavior:'instant'});}}
          onShowTargets={showTargets}
          onPhaseChange={setPhase}
          onBusyChange={setIsGeneratingMultiReading}
          selectionRequest={selectionRequest}
          onSelectionRequestConsumed={id => setSelectionRequest(previous => previous?.id === id ? null : previous)}
          educationalRequest={educationalRequest}
          onEducationalRequestConsumed={id => setEducationalRequest(previous => previous?.id === id ? null : previous)}
          accountUid={user!.uid}
          isCurrentSession={isCurrentSession}
          chart={chartResult}
          partnerChart={synastryChart}
          userLore={userLore}
          isOpen={true}
          onClose={() => setIsChatOpen(false)}
          onOpen={() => setIsChatOpen(true)}
          onSignIn={() => setShowAuthModal(true)}
          isSignedIn={!!user}
          onAddUserLore={handleAddUserLore}
          voiceSettings={voiceSettings}
          onUpdateVoiceSettings={(settings) => {
            setVoiceSettings(settings);
            saveVoiceSettings(settings);
          }}
          onSpeechStateChange={handleSpeechStateChange}
          onChartFocus={handleChartFocus}
          onSelectPlanet={(name) => handleToggleComponent(name, false)}
          externalReadingToInject={externalReadingToInject}
           externalReadingProgress={externalReadingProgress}
          onClearExternalReading={() => setExternalReadingToInject(null)}
          quickMessage={quickMessage}
          onClearQuickMessage={() => setQuickMessage(null)}
        /></div>
          </div>} />
      </div>}

      {/* HUD Layer Stage */}
      <main className="natally-workspace-main relative w-full max-w-7xl mx-auto flex-1 flex flex-col justify-between my-3 min-h-0 md:min-h-[280px] pointer-events-none">
        {/* Top Row Overlays: Draggable & Corner-Resizable Translucent Acrylic Cards */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-4 w-full z-20">
          {/* Left Column Cards */}
          <div className="space-y-2.5 w-full sm:w-auto pointer-events-auto">
            {/* Natal Parameters Card: Rolls up like a shade to just the title bar after submitting, click to expand */}
            <DraggableCard
              id="natal-params"
              title={
                <div className="flex items-center gap-1.5 truncate">
                  <span>Natal Parameters</span>
                  {isNatalParamsRolledUp && (
                    <span className="text-[10px] text-[#f2a38c] font-normal truncate opacity-90 hidden sm:inline">
                      · {chartInput.name} ({chartInput.birthDate})
                    </span>
                  )}
                </div>
              }
              icon={<Sparkles className="w-3.5 h-3.5 text-[#f2ca50]" />}
              defaultPosition={{ x: 0, y: 0 }}
              defaultWidth={340}
              minWidth={280}
              defaultZIndex={45}
              resetTrigger={resetTrigger}
              isCollapsed={isNatalParamsRolledUp}
              onToggleCollapse={(c) => handleToggleNatalParams(c)}
              extraHeaderControls={
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleNatalParams(!isNatalParamsRolledUp);
                  }}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#3b2752] hover:bg-[#523573] text-[#f2ca50] border border-[#f2ca50]/40 font-bold cursor-pointer transition-colors shrink-0"
                  title={isNatalParamsRolledUp ? 'Unroll parameters form like a shade' : 'Roll up to title bar'}
                >
                  {isNatalParamsRolledUp ? 'Expand ▾' : 'Roll Up ▴'}
                </button>
              }
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center pb-1 border-b border-white/5">
                  <span className="text-[10px] text-[#a99dae]">Established Birth Chart Inputs</span>
                  <button
                    type="button"
                    onClick={() => handleToggleNatalParams(true)}
                    className="text-[10px] text-[#f2ca50] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Roll Up Like a Shade ▴</span>
                  </button>
                </div>
                <NatalInputForm
                  key={user!.uid}
                  accountUid={user!.uid}
                  currentInput={chartInput}
                  onCalculate={(input) => {
                    if (!isCurrentSession()) return;
                    runCalculation(input, true);
                    // Automatically rolls up like a shade to just the title bar!
                    handleToggleNatalParams(true);
                  }}
                  isCalculating={isCalculating}
                  embedded={true}
                />
              </div>
            </DraggableCard>

            {/* Major Themes & Events Card (Moved UP directly under title bar; strictly constrained so it never flows off bottom of screen) */}
            {wisdom && (
              <DraggableCard
                id="themes-wisdom"
                title="Major Themes & Events"
                icon={<Compass className="w-3.5 h-3.5 text-[#f2ca50]" />}
                defaultPosition={{ x: 0, y: 0 }}
                defaultWidth={340}
                minWidth={280}
                defaultZIndex={30}
                resetTrigger={resetTrigger}
                isCollapsed={isThemesRolledUp}
                onToggleCollapse={(c) => setIsThemesRolledUp(c)}
                maxHeight="calc(100vh - 180px)"
                extraHeaderControls={
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsThemesRolledUp(!isThemesRolledUp);
                    }}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#3b2752] hover:bg-[#523573] text-[#f2ca50] border border-[#f2ca50]/40 font-bold cursor-pointer transition-colors shrink-0"
                    title={isThemesRolledUp ? 'Expand themes & events' : 'Roll up themes & events'}
                  >
                    {isThemesRolledUp ? 'Expand ▾' : 'Roll Up ▴'}
                  </button>
                }
              >
                <ThemesAndWisdomBox
                  wisdom={wisdom}
                  onOpenReading={handleOpenReading}
                  onDiscussWithNatally={handleDiscussWithNatally}
                  embedded={true}
                />
              </DraggableCard>
            )}
          </div>

          {/* Right Column: Draggable & Resizable Dynamic Planet & House Inspector Card */}
          {chartResult && (
            <div className="w-auto pointer-events-none">
              <DraggableCard
                className="pointer-events-auto"
                id="planet-inspector"
                title={inspectorTab === 'planets' ? 'Planetary Coordinates' : 'House Cusps'}
                icon={<Compass className="w-3.5 h-3.5" />}
                defaultPosition={{ x: 0, y: 0 }}
                defaultWidth={340}
                minWidth={280}
                resetTrigger={resetTrigger}
                isCollapsed={isInspectorCollapsed}
                onToggleCollapse={setIsInspectorCollapsed}
                extraHeaderControls={
                  <div className="flex items-center gap-1 bg-[#1c1428] p-0.5 rounded border border-[#322641]">
                    <button
                      type="button"
                      onClick={() => setInspectorTab('planets')}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors cursor-pointer whitespace-nowrap ${
                        inspectorTab === 'planets'
                          ? 'bg-[#271c36] text-[#f2ca50] font-semibold'
                          : 'text-[#a99dae] hover:text-[#f1e8d8]'
                      }`}
                    >
                      Planets
                    </button>
                    <button
                      type="button"
                      onClick={() => setInspectorTab('houses')}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors cursor-pointer whitespace-nowrap ${
                        inspectorTab === 'houses'
                          ? 'bg-[#271c36] text-[#9fb4ff] font-semibold'
                          : 'text-[#a99dae] hover:text-[#f1e8d8]'
                      }`}
                    >
                      {houseSystemLabel.split(' ')[0]}
                    </button>
                  </div>
                }
              >
                {inspectorTab === 'planets' ? (
                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {chartResult.natalBodies.map((b) => {
                      const isSelected = selectedComponents.includes(b.name);
                      return (
                        <div
                          key={b.name}
                          onClick={(e) => {
                            const isMulti = e.shiftKey || e.ctrlKey || e.metaKey;
                            handleToggleComponent(b.name, isMulti);
                          }}
                          className={`flex items-center justify-between p-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#3b2752] border-[#f2ca50] text-[#f2ca50] shadow-sm'
                              : 'bg-[#181126]/80 border-[#322641] hover:border-[#d4af37]/40 hover:bg-[#201533]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: b.color }}
                            />
                            <span className="font-semibold text-white/90">
                              {b.glyph} {b.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-[#c7bcce]">
                            <span>{b.fullDegText}</span>
                            <span className="text-[10px] text-[#f2ca50] bg-[#271c36] px-1 rounded">
                              H{b.house}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {chartResult.houseCusps.map((h) => {
                      const houseId = `House ${h.num}`;
                      const isSelected = selectedComponents.includes(houseId);
                      return (
                        <div
                          key={h.num}
                          onClick={(e) => {
                            const isMulti = e.shiftKey || e.ctrlKey || e.metaKey;
                            handleToggleComponent(houseId, isMulti);
                          }}
                          className={`flex items-center justify-between p-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#3b2752] border-[#f2ca50] text-[#f2ca50] shadow-sm'
                              : 'bg-[#181126]/80 border-[#322641] hover:border-[#d4af37]/40 hover:bg-[#201533]'
                          }`}
                        >
                          <span
                            className={`font-semibold ${
                              h.isCardo ? 'text-[#f2ca50]' : 'text-white/80'
                            }`}
                          >
                            {h.label} ({h.signGlyph})
                          </span>
                          <span className="text-[11px] text-[#c7bcce]">
                            {h.formattedDeg}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </DraggableCard>
            </div>
          )}
        </div>
      </main>

      {/* Footer Navigation & Controls */}
      <footer className="natally-workspace-footer w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#d4af37]/25 pt-4 z-20 pointer-events-auto">
        <div className="flex flex-wrap justify-center items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSpinning(!isSpinning)}
            className="px-4 py-2 rounded-lg bg-[#241838] hover:bg-[#342452] border border-[#d4af37]/40 text-[#f2ca50] font-mono text-xs transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <span
              className={
                isSpinning
                  ? 'w-2 h-2 rounded-full bg-[#f2ca50] animate-ping'
                  : 'w-2 h-2 rounded-full bg-white/40'
              }
            />
            <span>{isSpinning ? 'Pause Contemplative Drift' : 'Resume Contemplative Drift'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              try {
                localStorage.removeItem('astrosphere_card_pos_themes-wisdom');
                localStorage.removeItem('astrosphere_card_pos_natal-params');
                localStorage.removeItem('astrosphere_card_pos_planet-inspector');
              } catch (_) {}
              setResetTrigger((c) => c + 1);
            }}
            className="px-3.5 py-2 rounded-lg bg-[#181126] hover:bg-[#241838] border border-white/10 text-white/80 font-mono text-xs transition-all cursor-pointer whitespace-nowrap"
          >
            Reset Perspective &amp; Layout
          </button>
        </div>

        {/* Small Print Copyright & Version */}
        <div className="text-right font-mono text-[10px] text-[#a99dae]">
          <p>
            Natally · Epoch 2000.0 ·{' '}
            <span className="text-white/90">
              Copyright &copy;2026 Robin L. M. Cheung, MBA. AGPL-3.0-only.{' '}
            </span>
            <a
              href="https://natally.robin.mba/"
              target="_blank"
              rel="noreferrer"
              className="text-[#f2ca50] hover:underline"
            >
              https://natally.robin.mba/
            </a>
          </p>
        </div>
      </footer>

      {/* Keyboard quick-entry: small box only, full chat opens on send */}
      {quickEntryOpen && !isChatOpen && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = (e.currentTarget.elements.namedItem('quick-entry') as HTMLInputElement);
            const text = input?.value.trim();
            if (text) {
              setQuickMessage({ text, nonce: Date.now() });
              setIsChatOpen(true);
            }
            setQuickEntryOpen(false);
          }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[65] w-[min(92vw,480px)] flex gap-2"
        >
          <input
            name="quick-entry"
            type="text"
            autoFocus
            placeholder="Ask Natally…"
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#1c1428]/95 border border-[#d4af37]/40 text-[#f1e8d8] font-mono text-sm outline-none focus:border-[#f2ca50]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#241838] hover:bg-[#342452] border border-[#d4af37]/40 text-[#f2ca50] font-mono text-sm cursor-pointer"
          >
            Send
          </button>
        </form>
      )}

      {/* Modals */}
      {showExportModal && chartResult && (
        <ExportModal chart={chartResult} onClose={() => setShowExportModal(false)} />
      )}
      {showAuthModal && (
        <AuthModal
          user={user}
          onClose={() => setShowAuthModal(false)}
          onReonboard={() => {
            if (!user) return;
            clearNatalIntake(user.uid);
            booted.current = false;
            setChartInput(null);
            setShowAuthModal(false);
          }}
        />
      )}
      {showReadingsModal && chartResult && (
        <ReadingsModal
          key={user!.uid}
          accountUid={user!.uid}
          presentation={presentation}
          isCurrentSession={isCurrentSession}
          onPartnerChart={(chart) => { if (isCurrentSession()) setSynastryChart(chart); }}
          chart={chartResult}
          onSignIn={() => setShowAuthModal(true)}
          isSignedIn={!!user}
          onClose={() => setShowReadingsModal(false)}
          initialType={readingsInitialType}
          initialTargetKey={readingsTargetKey}
          onSendToNatally={(title, content, type, presentation) => {
            if (!isCurrentSession()) return;
            setExternalReadingToInject({ title, content, type, ...presentation });
            setIsChatOpen(true);
          }}
        />
      )}
    </div>
  );
}
