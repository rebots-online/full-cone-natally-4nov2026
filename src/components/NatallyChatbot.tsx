import { openingPrompt, isLegacyOpeningPrompt, type OpeningStage } from '../services/openingReading';
import { ensureReadingAccess } from '../services/billingAccess';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Mic,
  MicOff,
  Download,
  Trash2,
  Sparkles,
  Minimize2,
  Maximize2,
  Move,
  Volume2,
  VolumeX,
  Sliders,
  Search,
  Compass,
  Tag,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Paperclip,
  ZoomIn,
  Square,
} from 'lucide-react';
import { loadAccountValue, saveAccountValue } from '../services/accountStorage';
import { HISTORY_ERASURE_EVENT, isNatallyHistoryErasing, type HistoryErasureNotice } from '../services/historyLifecycle';
import { NatalChartResult } from '../services/ephemeris';
import { ChatMessage, askNatally, parseNatallyStream, ChartCue, chartFocusAt, validateChartCues } from '../services/natallyChat';
import { createStreamingSpeech } from '../services/streamingSpeech';
import { createCalculationSession } from '../services/calculationTools';
import { keepKaraokeVisible } from '../services/karaokeScroll';
import { getChatViewportLayout } from '../services/chatViewport';
import { useVisualViewport } from '../hooks/useVisualViewport';
import { chartFocusKey, chartFocusKeyMatches, chartReferenceNames, chartTargetLabel, chartTargets, resolveChartTarget } from '../services/chartTargets';
import { withReadingCamera, validatePresentationCues, presentationActionsAt, presentationFocusAt, presentationViewAt, type PresentationState, type PresentationAction, type PresentationCue } from '../services/presentation';
import { loadSoulState, buildSoulPrompt, rememberUserDisclosure, rememberCharacterDevelopment } from '../services/soul';
import { createReadingAudioCapture, type ReadingAudioStatus } from '../services/readingAudio';
import { recoverHistoricalFocus } from '../services/historicalPresentation';
import { RetainedReadingAudio } from './RetainedReadingAudio';
import { RichText } from './RichText';
import {
  VoiceSettings,
  loadVoiceSettings,
  saveVoiceSettings,
  speakNatallyText,
  stopSpeaking,
  prepareWaitingVoice,
  startWaitingUtterance,
} from '../services/voiceService';
import { usePurchaseAccess } from './PurchaseAccess';
import { NatallyConfigModal } from './NatallyConfigModal';
import { NatallyIcon } from './NatallyIcon';

export interface PersistentChatMessage extends ChatMessage {
  streamState?: 'streaming' | 'interrupted';
  openingStage?: OpeningStage;
  createdAt?: string;
  observationSnapshot?: NatalChartResult['currentSky'];
  topic?: string;
  category?: 'lore' | 'reading' | 'chat' | 'horoscope' | 'synastry';
  mediaUrl?: string;
  mediaName?: string;
}

interface NatallyChatbotProps {
  focusReadingRequest?: number;
  externalReadingProgress?: { id: string; text: string; chart: NatalChartResult; title: string; model?: string; error?: string } | null;
  embedded?: boolean;
  presentation: PresentationState;
  onPresentationAction: (action: PresentationAction, sourceChart: NatalChartResult) => void;
  onShowTargets: (targets: string[]) => void;
  onReadingChart?: (source: NatalChartResult, archived: boolean) => void;
  onReadingStart?: () => void;
  onPhaseChange?: (phase: 'idle'|'listening'|'thinking'|'speaking') => void;
  onBusyChange?: (busy: boolean) => void;
  selectionRequest?: {id:string;targets:string[];sourceChart:NatalChartResult} | null;
  onSelectionRequestConsumed?: (id:string) => void;
  accountUid: string;
  isCurrentSession: () => boolean;
  chart: NatalChartResult;
  partnerChart?: NatalChartResult | null;
  userLore: string[];
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onSignIn: () => void;
  isSignedIn: boolean;
  onAddUserLore: (lore: string) => void;
  voiceSettings: VoiceSettings;
  onUpdateVoiceSettings: (settings: VoiceSettings) => void;
  onSpeechStateChange: (isSpeaking: boolean, snippet: string | null, targetEntity: string | null) => void;
  onSelectPlanet?: (name: string) => void;
  onChartFocus?: (targets: string[], sourceChart: NatalChartResult) => void;
  externalReadingToInject?: {
    streamId?: string;
    model?: string;
    title: string;
    content: string;
    type: string;
    sender?: 'user' | 'natally';
    observationSnapshot?: NatalChartResult['currentSky'];
    generatedAt?:string;
    chartCues?: ChartCue[];
    presentationVersion?: 1;
    presentationCues?: PresentationCue[];
    chartFocusKey?: string;
  } | null;
  onClearExternalReading?: () => void;
  /** Quick-entry keyboard path: a user message injected from the small
   * summon-on-typing entry box — handled as a normal sent turn. */
  quickMessage?: { text: string; nonce: number } | null;
  onClearQuickMessage?: () => void;
}

const CHAT_STORAGE_KEY = 'astrosphere_natally_chat_history_v3';

export const NatallyChatbot: React.FC<NatallyChatbotProps> = ({
  externalReadingProgress, focusReadingRequest = 0,
  embedded = false, presentation, onPresentationAction, onShowTargets, onReadingChart, onReadingStart, onPhaseChange, onBusyChange, selectionRequest, onSelectionRequestConsumed,
  accountUid,
  isCurrentSession,
  chart,
  partnerChart,
  userLore,
  isOpen,
  onClose,
  onOpen,
  onSignIn,
  isSignedIn,
  onAddUserLore,
  voiceSettings,
  onUpdateVoiceSettings,
  onSpeechStateChange,
  onSelectPlanet,
  onChartFocus,
  externalReadingToInject,
  onClearExternalReading,
  quickMessage,
  onClearQuickMessage,
}) => {
  const {requestDownload}=usePurchaseAccess();
  const [soul, setSoul] = useState(() => loadSoulState(accountUid));
  const soulRef = useRef(soul);
  soulRef.current = soul;
  const calculationSession = useMemo(() => createCalculationSession(chart, partnerChart), [chart, partnerChart]);
  const legacyOpeningPending = useRef(false);
  // Load persistent messages or initialize default
  const [messages, setMessages] = useState<PersistentChatMessage[]>(() => {
    const saved = loadAccountValue<unknown>(CHAT_STORAGE_KEY, accountUid, null);
    if (Array.isArray(saved) && saved.every(message => message && typeof message.id === 'string' &&
        typeof message.text === 'string' && ['user', 'natally'].includes(message.sender))) {
      const index = saved.findIndex(message => message.sender === 'user' && isLegacyOpeningPrompt(message.text));
      legacyOpeningPending.current = index >= 0 && !saved.slice(index + 1).some(message => message.sender === 'natally');
      return saved.filter(message => message.sender !== 'user' || !isLegacyOpeningPrompt(message.text));
    }
    return [
      {
        id: 'init-1',
        sender: 'natally',
        text: `${chart.input.name}, come in. Your chart has entered the chat and I have thoughts. Get comfy — I do side quests. Pick something that catches your eye, or tell me what's going on.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        topic: 'Origin & Core Astrolabe',
        category: 'lore',
      },
    ];
  });

  const messagesRef = useRef(messages);
  const [streamingMessage, setStreamingMessage] = useState<PersistentChatMessage | null>(null);
  const streamingReply = useRef<ReturnType<typeof beginStreamingReply> | null>(null);
  messagesRef.current = messages;
  const openingGeneration = useRef(0);
  const failedOpeningStage = useRef<OpeningStage | null>(null);
  const natalOpening = messages.find(message => message.openingStage === 'natal');
  const nowOpening = messages.find(message => message.openingStage === 'now');
  const restoredMessageIds = useRef(new Set(messages.map(message => message.id)));
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPreparingSpeech, setIsPreparingSpeech] = useState(false);
  const [audioNotices,setAudioNotices] = useState<Record<string,ReadingAudioStatus>>({});
  const [waitingCaption, setWaitingCaption] = useState<string | null>(null);
  const waitingUtterance = useRef<ReturnType<typeof startWaitingUtterance> | null>(null);
  useEffect(() => {
    if (!isTyping) return;
    const preparing = setTimeout(() => setWaitingCaption('Preparing your reading…'), 10_000);
    const delayed = setTimeout(() => setWaitingCaption('Your reading is taking longer than usual. It will appear here as it arrives.'), 30_000);
    return () => { clearTimeout(preparing); clearTimeout(delayed); };
  }, [isTyping]);
  useEffect(() => { prepareWaitingVoice(voiceSettings); if (!voiceSettings.readingAloud) {waitingUtterance.current?.cancel();setIsPreparingSpeech(false);} }, [voiceSettings.readingAloud,voiceSettings.aiVoiceName]);
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Error recovery & Evidence inspection state
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<{ message: string; canRetry: boolean; errorType: string } | null>(null);
  const [expandedEvidenceMsgId, setExpandedEvidenceMsgId] = useState<string | null>(null);

  // Media upload state
  const [attachedMedia, setAttachedMedia] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Draggable Card Coordinates & Size State - docked in comfortable bottom-right corner
  const [cardPos, setCardPos] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem('astrosphere_natally_chat_pos_v3');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const h = typeof window !== 'undefined' ? window.innerHeight : 800;
    return {
      x: Math.max(20, w - 490),
      y: Math.max(30, h - 640),
    };
  });
  const [cardSize, setCardSize] = useState<{ width: number; height: number }>({
    width: 460,
    height: 600,
  });
  const viewport = useVisualViewport();
  const chatLayout = getChatViewportLayout(viewport, cardPos, cardSize, isExpanded);
  const isResizingRef = useRef(false);
  const resizeStartRef = useRef({ mouseX: 0, mouseY: 0, width: 460, height: 600 });
  const [isDraggingCard, setIsDraggingCard] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, initialX: 0, initialY: 0 });

  // Save card position to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('astrosphere_natally_chat_pos_v3', JSON.stringify(cardPos));
    } catch (_) {}
  }, [cardPos]);

  // Ensure chat card is always clamped and visible in viewport when opened, never offscreen
  useEffect(() => {
    if (isOpen) {
      setCardPos((prev) => {
        const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
        const h = typeof window !== 'undefined' ? window.innerHeight : 800;
        const width = Math.min(cardSize.width || 460, w - 32);
        const height = Math.min(cardSize.height || 600, h - 40);

        if (
          !prev ||
          prev.x === undefined ||
          prev.y === undefined ||
          isNaN(prev.x) ||
          isNaN(prev.y) ||
          prev.x < 10 ||
          prev.x > w - 100 ||
          prev.y < 10 ||
          prev.y > h - 100
        ) {
          return {
            x: Math.max(16, w - width - 32),
            y: Math.max(20, h - height - 32),
          };
        }

        return {
          x: Math.max(16, Math.min(w - width - 16, prev.x)),
          y: Math.max(16, Math.min(h - height - 16, prev.y)),
        };
      });
    }
  }, [isOpen, cardSize.width, cardSize.height]);

  // Karaoke state
  const [currentlySpeakingMsgId, setCurrentlySpeakingMsgId] = useState<string | null>(null);
  const [karaokeCharIndex, setKaraokeCharIndex] = useState<number | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const handleSendMessageRef = useRef<((t?: string) => Promise<void>) | null>(null);
  const consumedExternalReading = useRef<typeof externalReadingToInject>(null);
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const linkedPassage = useRef<{messageId:string;offset:number}|null>(null);
  const recognitionRef = useRef<any>(null);


  // Always land on the LATEST message: on open and on every new turn —
  // opening at the first-ever message forced an extreme scroll (operator
  // report 2026-10-12).
  useEffect(() => {
    if (isOpen && !currentlySpeakingMsgId && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [isOpen, messages, streamingMessage]);

  useEffect(() => {
    if (errorDetails && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [errorDetails]);

  useEffect(() => {
    if (!isOpen || !currentlySpeakingMsgId || karaokeCharIndex === null) return;
    const container = messagesContainerRef.current;
    const active = messageRefs.current[currentlySpeakingMsgId]?.querySelector<HTMLElement>('[data-karaoke-active="true"]');
    if (container && active) keepKaraokeVisible(container, active,
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  }, [isOpen, currentlySpeakingMsgId, karaokeCharIndex]);

  useEffect(() => {
    if (!focusReadingRequest || !isOpen) return;
    const matching = [...messages].reverse().find(message => cuesFor(message).some(cue => cue.action.type === 'focus' && cue.action.targets.some(target => presentation.focusTargets.includes(target))));
    const id = currentlySpeakingMsgId ?? linkedPassage.current?.messageId ?? passage?.messageId ?? matching?.id;
    if (!id) return;
    const message = messageRefs.current[id];
    const offset = currentlySpeakingMsgId ? karaokeCharIndex ?? playbackPosition.current?.offset : linkedPassage.current?.offset ?? (matching && cuesFor(matching).find(cue => cue.action.type === 'focus' && cue.action.targets.some(target => presentation.focusTargets.includes(target)))?.offset);
    const words = Array.from(message?.querySelectorAll<HTMLElement>('[data-reading-start]') ?? []);
    const target = message?.querySelector<HTMLElement>('[data-karaoke-active="true"]') ??
      words.find(word => offset != null && Number(word.dataset.readingStart) <= offset && Number(word.dataset.readingEnd) > offset) ??
      words.find(word => offset != null && Number(word.dataset.readingStart) >= offset) ?? message;
    if (!target) return;
    target.tabIndex = -1;
    target.focus({preventScroll:true});
    target.scrollIntoView({block:'center',behavior:'instant'});
  }, [focusReadingRequest, isOpen]);

  const mounted = useRef(true);
  const currentChart = useRef(chart);
  currentChart.current = chart;
  const presentationGeneration = useRef(0);
  const presentationRef = useRef(presentation);
  presentationRef.current = presentation;
  const playbackPosition = useRef<{generation:number;chart:NatalChartResult;sourceChart:NatalChartResult;cues:PresentationCue[];offset:number}|null>(null);
  const reconcilePlaybackFocus = () => {
    const playback = playbackPosition.current;
    if (!playback || playback.generation !== presentationGeneration.current || playback.chart !== chart || !sessionIsActive()) return;
    const view = presentationViewAt(playback.cues, playback.offset);
    if (presentationRef.current.follow && presentationRef.current.view !== view) onPresentationAction({type:'view',view},playback.sourceChart);
    const focus = presentationFocusAt(playback.cues, playback.offset);
    const targets = view === 'chart' && focus?.type === 'focus' ? focus.targets : [];
    const current = presentationRef.current.focusTargets;
    if (current.length !== targets.length || current.some((target,index) => target !== targets[index])) onPresentationAction(targets.length ? {type:'focus',targets} : {type:'clear'}, playback.sourceChart);
  };
  useEffect(() => {
    // Pinning the room or chart changes the camera choice, never the spoken subject.
    reconcilePlaybackFocus();
  }, [presentation.view, presentation.follow]);
  const retainedReplay = useRef<{messageId:string;generation:number;offset:number;chart:NatalChartResult}|null>(null);
  const requestGeneration = useRef(0);
  const inFlight = useRef(false);
  const consumedSelection = useRef<string | null>(null);
  const failedSnapshot = useRef<PresentationState | null>(null);
  const failedChartSnapshot = useRef<NatalChartResult | null>(null);
  const [passage, setPassage] = useState<{messageId:string; index:number} | null>(null);
  useEffect(() => { onPhaseChange?.(isListening ? 'listening' : currentlySpeakingMsgId ? 'speaking' : (isTyping || isPreparingSpeech) ? 'thinking' : 'idle'); }, [isListening, isTyping, isPreparingSpeech, currentlySpeakingMsgId]);
  useEffect(() => { onBusyChange?.(isTyping); }, [isTyping]);
  const greetingAllowed = useRef(true);
  const sessionIsActive = () => mounted.current && isCurrentSession() && currentChart.current === chart && !isNatallyHistoryErasing(accountUid);
  useEffect(() => {
    const erasing = (event: Event) => {
      const notice = (event as CustomEvent<HistoryErasureNotice>).detail;
      if (notice.accountUid !== accountUid || notice.phase !== 'erasing') return;
      presentationGeneration.current++; requestGeneration.current++; inFlight.current = false;
      waitingUtterance.current?.cancel(); stopSpeaking();
      setIsTyping(false); setIsPreparingSpeech(false); setCurrentlySpeakingMsgId(null);
    };
    window.addEventListener(HISTORY_ERASURE_EVENT, erasing);
    return () => window.removeEventListener(HISTORY_ERASURE_EVENT, erasing);
  }, [accountUid]);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; waitingUtterance.current?.cancel(); stopSpeaking(); };
  }, []);

  useEffect(() => {
    stopSpeaking();
    streamingReply.current?.cancelSpeech(); setStreamingMessage(null);
    presentationGeneration.current++;
    requestGeneration.current++;
    inFlight.current = false;
    setPassage(null);
    waitingUtterance.current?.cancel(); setWaitingCaption(null); setIsPreparingSpeech(false);
    setIsTyping(false);
    setCurrentlySpeakingMsgId(null);
    setKaraokeCharIndex(null);
    onChartFocus?.([], chart);
  }, [chart]);

  useEffect(() => {
    if (!voiceSettings.readingAloud) streamingReply.current?.cancelSpeech();
  }, [voiceSettings.readingAloud]);

  useEffect(() => () => streamingReply.current?.cancelSpeech(), []);

  const readingPlans = useMemo(() => new Map(messages.map(message => {
    const archived = restoredMessageIds.current.has(message.id) || !!message.observationSnapshot && message.observationSnapshot.observedAt !== chart.currentSky?.observedAt;
    const snapshot = message.observationSnapshot;
    const validSnapshot = chartFocusKeyMatches(message.chartFocusKey,chart) && snapshot && typeof snapshot.observedAt === 'string' && Number.isFinite(Date.parse(snapshot.observedAt)) &&
      Array.isArray(snapshot.bodies) && snapshot.bodies.every(body => !!body && typeof body.target === 'string' && body.target.endsWith(' @ '+snapshot.observedAt) && Number.isFinite(body.lon)) &&
      Array.isArray(snapshot.aspects) && snapshot.aspects.every(aspect => !!aspect && typeof aspect.name === 'string' && typeof aspect.from === 'string' && typeof aspect.to === 'string' && Number.isFinite(aspect.orb));
    const sourceChart = archived ? {...chart,currentSky:validSnapshot ? snapshot : undefined} : chart;
    const explicit:PresentationCue[] = message.presentationVersion === 1
      ? validatePresentationCues(message.presentationCues,message.text,message.chartFocusKey,sourceChart)
      : validateChartCues(message.chartCues,message.text,message.chartFocusKey,sourceChart).map(cue=>({offset:cue.offset,action:cue.targets.length?{type:'focus',targets:cue.targets}:{type:'clear'}}));
    const recovered = recoverHistoricalFocus(message.text,sourceChart,message.chartFocusKey,explicit,message.category,!!sourceChart.currentSky);
    return [message.id,{sourceChart,archived,cues:recovered?.cues ?? explicit,recovered}] as const;
  })),[messages,chart]);
  const planFor = (message:PersistentChatMessage) => readingPlans.get(message.id);
  const sourceChartFor = (message:PersistentChatMessage) => planFor(message)?.sourceChart ?? (message.observationSnapshot ? {...chart,currentSky:message.observationSnapshot} : chart);
  const cuesFor = (message:PersistentChatMessage):PresentationCue[] => withReadingCamera(message.text, planFor(message)?.cues ?? (message.presentationVersion === 1
    ? validatePresentationCues(message.presentationCues,message.text,message.chartFocusKey,sourceChartFor(message))
    : validateChartCues(message.chartCues,message.text,message.chartFocusKey,sourceChartFor(message)).map(cue=>({offset:cue.offset,action:cue.targets.length?{type:'focus',targets:cue.targets}:{type:'clear'}}))), [], ['reading','horoscope','synastry'].includes(message.category ?? ''));
  const showReadingChart = (message:PersistentChatMessage) => onReadingChart?.(sourceChartFor(message),planFor(message)?.archived ?? (!!message.observationSnapshot && message.observationSnapshot.observedAt !== chart.currentSky?.observedAt));
  const goToPassage = (message: PersistentChatMessage, index: number) => {
    if (!sessionIsActive()) return;
    presentationGeneration.current++; stopSpeaking();
    setCurrentlySpeakingMsgId(null); setKaraokeCharIndex(null); setIsPreparingSpeech(false);
    onSpeechStateChange(false,null,null);
    showReadingChart(message);
    const sourceChart = sourceChartFor(message);
    const cues = cuesFor(message);
    const offsets = [...new Set([0,...cues.map(c => c.offset)])];
    const bounded = Math.max(0,Math.min(index,offsets.length-1));
    // Reconstruct earlier state in order so jumping backward is meaningful.
    onPresentationAction({type:'clear'},sourceChart);
    for (const action of presentationActionsAt(cues,-1,offsets[bounded])) onPresentationAction(action,sourceChart);
    setPassage({messageId:message.id,index:bounded});
    const element = messageRefs.current[message.id];
    element?.scrollIntoView({block:'nearest',behavior:'auto'});
  };
  const beginRetainedReplay = (message:PersistentChatMessage):boolean => {
    if (!sessionIsActive()) return false;
    showReadingChart(message);
    const generation=++presentationGeneration.current;
    retainedReplay.current={messageId:message.id,generation,offset:-1,chart};
    waitingUtterance.current?.cancel();
    setIsPreparingSpeech(false);setCurrentlySpeakingMsgId(null);setKaraokeCharIndex(null);
    setPassage({messageId:message.id,index:0});
    return true;
  };
  const retainedReplayActive = (message:PersistentChatMessage) => {
    const replay=retainedReplay.current;
    return !!replay && replay.messageId===message.id && replay.generation===presentationGeneration.current && replay.chart===chart && sessionIsActive();
  };
  const presentRetainedPosition = (message:PersistentChatMessage,offset:number) => {
    if (!retainedReplayActive(message)) return;
    const replay=retainedReplay.current!;
    const cues=cuesFor(message);
    const sourceChart=sourceChartFor(message);
    const position=Math.max(0,Math.min(message.text.length,offset));
    if(position<replay.offset){onPresentationAction({type:'clear'},sourceChart);replay.offset=-1;}
    for(const action of presentationActionsAt(cues,replay.offset,position)) {
      if (action.type !== 'focus' && action.type !== 'clear') onPresentationAction(action,sourceChart);
    }
    playbackPosition.current={generation:replay.generation,chart,sourceChart,cues,offset:position};
    reconcilePlaybackFocus();
    replay.offset=position;
    // Saved positions identify actual synthesis segments, not inferred word times.
    setKaraokeCharIndex(null);
    const offsets=[...new Set([0,...cues.map(cue=>cue.offset)])];
    setPassage({messageId:message.id,index:Math.max(0,offsets.filter(start=>start<=position).length-1)});
  };
  const presentRetainedState = (message:PersistentChatMessage,playing:boolean) => {
    if(!retainedReplayActive(message))return;
    if (playing && retainedReplay.current!.offset < 0 && message.category !== 'lore') onReadingStart?.();
    setCurrentlySpeakingMsgId(playing?message.id:null);
    setIsPreparingSpeech(false);
    onSpeechStateChange(playing,playing?message.text.slice(0,110):null,null);
  };

  function beginStreamingReply(id: string, sourceChart: NatalChartResult, prefix = '', welcome?: PersistentChatMessage) {
    streamingReply.current?.cancelSpeech();
    const generation = ++presentationGeneration.current;
    stopSpeaking();
    const active = () => sessionIsActive() && presentationGeneration.current === generation;
    const currentStream = () => sessionIsActive() && streamingReply.current?.id === id;
    let latest: PersistentChatMessage = { id, sender: 'natally', text: prefix, timestamp: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}), category:'reading', streamState:'streaming',
      chartFocusKey: chartFocusKey(sourceChart), observationSnapshot: sourceChart.currentSky ? structuredClone(sourceChart.currentSky) : undefined };
    let lastOffset = -1, voiceStopped = false, shown = false, playbackStarted = false;
    const advance = (offset: number) => {
      if (!active()) return;
      const cues = cuesFor(latest);
      for (const action of presentationActionsAt(cues,lastOffset,offset)) if (action.type !== 'focus' && action.type !== 'clear') onPresentationAction(action,sourceChart);
      lastOffset = Math.max(lastOffset,offset);
      playbackPosition.current = { generation, chart, sourceChart, cues, offset:lastOffset };
      reconcilePlaybackFocus();
    };
    const captureOptions = {accountUid,messageId:id,text:'',voiceSettings,isCurrentSession:active,
      onStatus:(status:ReadingAudioStatus) => { if(active()) setAudioNotices(previous=>({...previous,[id]:status})); }};
    const capture = createReadingAudioCapture(captureOptions);
    // The provider and text rendering start now; only spoken reading waits for
    // the welcome. A failed audio startup cannot strand the opening request.
    let releaseWelcome: () => void = () => {};
    const beforeSpeech = welcome && voiceSettings.readingAloud ? new Promise<void>(resolve => { releaseWelcome = resolve; }) : undefined;
    const voice = createStreamingSpeech(voiceSettings, {
      active, beforeSpeech,
      onStart: offset => { if(active()) {if(!playbackStarted){playbackStarted=true;onReadingStart?.();}setCurrentlySpeakingMsgId(id);advance(offset);onSpeechStateChange(true,latest.text.slice(offset,offset+110),null);} },
      onIdle: () => { if(active()) {setCurrentlySpeakingMsgId(null);setIsPreparingSpeech(false);onSpeechStateChange(false,null,null);} },
      onWord: offset => { if(active()) {setKaraokeCharIndex(offset);advance(offset);} },
      onPreparing: preparing => { if(active()) setIsPreparingSpeech(preparing); },
      onAudioSegment: capture.onAudioSegment,
    });
    setStreamingMessage(null); setCurrentlySpeakingMsgId(null); setKaraokeCharIndex(null);
    setPassage({messageId:id,index:0});
    const controller = {
      id,
      update(raw: string, model = '') {
        if (!currentStream()) return;
        const parsed = parseNatallyStream(prefix + raw, sourceChart);
        latest = {...latest,...parsed,model,streamState:'streaming'};
        setStreamingMessage(latest);
        if (parsed.text.length > prefix.length) {
          waitingUtterance.current?.cancel(); setWaitingCaption(null);
          if (!shown) { shown = true; showReadingChart(latest); }
          voice.update(parsed.text);
        }
      },
      cancelSpeech() {
        voiceStopped = true; voice.cancel(); capture.cancel();
        if(active()) {
          setIsPreparingSpeech(false);setCurrentlySpeakingMsgId(null);setKaraokeCharIndex(null);onSpeechStateChange(false,null,null);
          setAudioNotices(previous => previous[id]?.state === 'recording' ? {...previous,[id]:{state:'discarded',message:'Voice stopped. No complete recording was saved from this playback.'}} : previous);
        }
      },
      fail() {
        controller.cancelSpeech();
        if(currentStream() && latest.text.trim()) setStreamingMessage({...latest,streamState:'interrupted'});
      },
      async complete(message: PersistentChatMessage) {
        latest = message; captureOptions.text = message.text;
        voice.update(message.text);
        const completed = await voice.finish();
        if (active() && completed && !voiceStopped) { advance(message.text.length); void capture.complete(); }
        else capture.cancel();
        return completed && !voiceStopped;
      },
    };
    streamingReply.current = controller;
    if (beforeSpeech && welcome) {
      void speakNatallyText(welcome.text, voiceSettings,
        () => { if (active()) { setCurrentlySpeakingMsgId(welcome.id); onSpeechStateChange(true,welcome.text,null); } },
        () => { releaseWelcome(); if (active()) { setCurrentlySpeakingMsgId(null); onSpeechStateChange(false,null,null); } },
        offset => { if (active()) setKaraokeCharIndex(offset); },
        { onPreparing: preparing => { if (active()) setIsPreparingSpeech(preparing); } }
      ).finally(releaseWelcome);
    }
    return controller;
  }

  const presentMessage = (message: PersistentChatMessage): Promise<boolean> => {
    streamingReply.current?.cancelSpeech();
    greetingAllowed.current = false;
    const generation = ++presentationGeneration.current;
    stopSpeaking();
    setCurrentlySpeakingMsgId(null); setKaraokeCharIndex(null);
    const active = () => sessionIsActive() && presentationGeneration.current === generation;
    waitingUtterance.current?.cancel();
    setIsPreparingSpeech(voiceSettings.readingAloud);
    setWaitingCaption(previous => previous || 'Getting this passage ready.');
    showReadingChart(message);
    const sourceChart = sourceChartFor(message);
    const cues = cuesFor(message);
    let lastOffset = -1;
    const advance = (offset:number) => {
      if (!active()) return;
      for (const action of presentationActionsAt(cues,lastOffset,offset)) {
        if (action.type !== 'focus' && action.type !== 'clear') onPresentationAction(action,sourceChart);
      }
      lastOffset = Math.max(lastOffset,offset);
      playbackPosition.current={generation,chart,sourceChart,cues,offset:lastOffset};
      reconcilePlaybackFocus();
    };
    setPassage({messageId:message.id,index:0});
    if (!voiceSettings.readingAloud) {
      advance(0);
      onSpeechStateChange(false,message.text.slice(0,110),null);
      return Promise.resolve(true);
    }
    const capture = createReadingAudioCapture({accountUid,messageId:message.id,text:message.text,voiceSettings,isCurrentSession:active,onStatus:status => {if(active()) setAudioNotices(previous => ({...previous,[message.id]:status}));}});
    return speakNatallyText(message.text, voiceSettings,
      () => { if (active()) { if(message.category !== 'lore') onReadingStart?.(); setCurrentlySpeakingMsgId(message.id); advance(0); onSpeechStateChange(true,message.text.slice(0,110),null); } },
      () => {
        if (!active()) return;
        onSpeechStateChange(false,null,null);
        setCurrentlySpeakingMsgId(null); setKaraokeCharIndex(null);
      },
      charIdx => { if (active()) { setKaraokeCharIndex(charIdx); advance(charIdx); } },
      {onAudioSegment:capture.onAudioSegment,onPreparing:preparing => {if(active()) setIsPreparingSpeech(preparing);}}).then(completed => {
        if (completed && active()) {advance(message.text.length); void capture.complete();}
        else capture.cancel();
        return completed && active();
      });
  };

  useEffect(() => {
    if (sessionIsActive()) saveAccountValue(CHAT_STORAGE_KEY, accountUid, messages);
  }, [messages, accountUid]);

  const extractAstrologicalEntity = (text: string): string | null => {
    const bodies = [
      'Venus',
      'Mars',
      'Sun',
      'Moon',
      'Jupiter',
      'Saturn',
      'Mercury',
      'Uranus',
      'Neptune',
      'Pluto',
      'Chiron',
    ];
    for (const b of bodies) {
      if (new RegExp(`\\b${b}\\b`, 'i').test(text)) {
        return b;
      }
    }
    const houseMatch = text.match(/\bHouse\s+(\d{1,2})\b/i);
    if (houseMatch) {
      return `House ${houseMatch[1]}`;
    }
    return null;
  };

  const handleSendMessage = async (textToSend?: string, selectedTargets?: string[], selectedChart?:NatalChartResult, openingStage?: OpeningStage) => {
    if (!sessionIsActive()) return;
    const text = (textToSend || inputText).trim();
    if ((!text && !attachedMedia) || inFlight.current) return;
    if (!openingStage) openingGeneration.current++;
    failedOpeningStage.current = openingStage ?? null;
    inFlight.current = true;
    const requestId = ++requestGeneration.current;
    const requestActive = () => sessionIsActive() && requestGeneration.current === requestId;
    const retrying = text === lastFailedPrompt;
    let requestChart = retrying && failedChartSnapshot.current ? failedChartSnapshot.current : selectedChart ?? chart;
    if(openingStage) {
      const key='natally-opening-snapshot:'+accountUid+':'+openingStage;
      try {const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved && chartFocusKeyMatches(chartFocusKey(saved),chart))requestChart=saved;else localStorage.setItem(key,JSON.stringify(requestChart));}catch{localStorage.setItem(key,JSON.stringify(requestChart));}
    }
    if (!chartFocusKeyMatches(chartFocusKey(requestChart),chart)) {inFlight.current=false;return;}
    try { await ensureReadingAccess(accountUid,requestActive); }
    catch(error) {
      if(requestActive()) {inFlight.current=false;setIsTyping(false);if(!openingStage)setInputText(previous=>previous.trim()?previous:text);setLastFailedPrompt(text);setErrorDetails({message:error instanceof Error?error.message:'Reading access unavailable.',canRetry:true,errorType:'reading_access_required'});}
      return;
    }
    if(!requestActive()){inFlight.current=false;return;}
    failedChartSnapshot.current=requestChart;
    onReadingChart?.(requestChart,requestChart.currentSky?.observedAt !== chart.currentSky?.observedAt);
    const snapshot = retrying && failedSnapshot.current ? failedSnapshot.current : { ...presentation, selectedTargets: [...(selectedTargets ?? presentation.selectedTargets)] };
    failedSnapshot.current = snapshot;
    greetingAllowed.current = false;
    presentationGeneration.current++;
    stopSpeaking();
    setCurrentlySpeakingMsgId(null); setKaraokeCharIndex(null); setIsPreparingSpeech(false);
    onSpeechStateChange(false,null,null);
    if (snapshot.selectedTargets.length) onPresentationAction({type:'focus',targets:snapshot.selectedTargets.slice(0,6)},requestChart);

    const mediaToSave = openingStage ? null : attachedMedia;
    if (!openingStage) setAttachedMedia(null);

    const userMsg: PersistentChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text || '(Shared Media)',
      mediaUrl: mediaToSave?.url,
      mediaName: mediaToSave?.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'chat',
    };

    if (!retrying && !openingStage) setMessages((prev) => [...prev, userMsg]);
    if (!openingStage && (!textToSend || inputText.trim() === text)) setInputText('');
    setIsTyping(true);
    setErrorDetails(null);
    setLastFailedPrompt(null);
    waitingUtterance.current?.cancel();
    const welcome = openingStage === 'natal' && !retrying && messagesRef.current.every(message => message.id === 'init-1')
      ? messagesRef.current.find(message => message.id === 'init-1') : undefined;
    const stream = beginStreamingReply(`natally-${Date.now()}`, requestChart, '', welcome);
    if (!welcome) {
      waitingUtterance.current = startWaitingUtterance(voiceSettings);
      setWaitingCaption(waitingUtterance.current.caption);
    } else setWaitingCaption(null);

    const freshSoul = loadSoulState(accountUid);
    if (!freshSoul.notice) soulRef.current = freshSoul;
    if (!retrying && !openingStage) {
      const updatedSoul = rememberUserDisclosure(soulRef.current,{id:userMsg.id,text},requestActive);
      soulRef.current = updatedSoul; setSoul(updatedSoul);
    }

    try {
      const promptQuery = mediaToSave
        ? `${text}\n[Attached Media: ${mediaToSave.name}. Please incorporate insights from this shared media into our astrological reading and lore!]`
        : text;

      const observationContext = requestChart.currentSky && requestChart.currentSky.observedAt !== chart.currentSky?.observedAt ? '\nThe selected components belong to the displayed archived observation at '+requestChart.currentSky.observedAt+'. Discuss that observation and explicitly distinguish it from today; do not replace it with a new sky.' : '';
      const result = await askNatally(promptQuery+observationContext, messagesRef.current, requestChart, userLore, undefined, { openingStage, accountUid, partnerChart, calculationSession:requestChart===chart?calculationSession:createCalculationSession(requestChart,partnerChart), presentation:snapshot, soulPrompt:buildSoulPrompt(soulRef.current), isCurrentSession:requestActive, onProgress:(raw,model)=>{if(requestActive())stream.update(raw,model);} });
      if (!requestActive()) return;
      for (const [index, development] of (result.soulDevelopments || []).entries()) {
        soulRef.current = rememberCharacterDevelopment(soulRef.current,{id:'reply-'+userMsg.id+'-'+index,text:development},requestActive);
      }
      setSoul(soulRef.current);
      failedSnapshot.current = null; failedChartSnapshot.current = null;
      const reply = result.text;
      const targetEntity = extractAstrologicalEntity(reply);

      const topicTag = openingStage ? (openingStage === 'natal' ? 'Your natal reading' : 'Your horoscope right now') : targetEntity
        ? `${targetEntity} Insight`
        : mediaToSave
        ? `Media: ${mediaToSave.name.slice(0, 15)}`
        : text.length < 24
        ? text
        : `${text.slice(0, 20)}...`;

      const natallyMsg: PersistentChatMessage = {
        openingStage,
        createdAt: new Date().toISOString(),
        observationSnapshot: requestChart.currentSky ? structuredClone(requestChart.currentSky) : undefined,
        id: stream.id,
        sender: 'natally',
        text: reply,
        model: result.model,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        topic: topicTag,
        category: 'reading',
        evidence: result.evidence,
        chartCues: result.chartCues,
        presentationVersion:result.presentationVersion,
        presentationCues:result.presentationCues,
        chartFocusKey: result.chartFocusKey,
        isOfflineMode: false,
      };
      messagesRef.current = [...messagesRef.current, natallyMsg];
      setMessages(messagesRef.current);
      setStreamingMessage(null);
      failedOpeningStage.current = null;
      inFlight.current = false; setIsTyping(false);
      if (openingStage) return await stream.complete(natallyMsg);
      void stream.complete(natallyMsg);
      return true;
    } catch (e: any) {
      if (!requestActive()) return;
      stream.fail();
      waitingUtterance.current?.cancel(); setWaitingCaption(null); setIsPreparingSpeech(false);
      console.error('Natally inference failed:', e);
      // Preserve the user's unfulfilled message so it is not lost
      if (!openingStage) setInputText(previous => previous.trim() ? previous : text);
      setLastFailedPrompt(text);

      const errMessage =
        e?.details?.message ||
        e?.message ||
        'Celestial inference connection failed. Please check connection or retry.';

      setErrorDetails({
        message: errMessage,
        canRetry: e?.details?.canRetry ?? true,
        errorType: e?.code || e?.details?.errorType || 'inference_failure',
      });
    } finally {
      if (requestActive()) { inFlight.current = false; setIsTyping(false); }
    }
  };

  const runOpening = async (stage: OpeningStage = 'natal') => {
    const generation = ++openingGeneration.current;
    const active = () => sessionIsActive() && openingGeneration.current === generation;
    greetingAllowed.current = false;
    onOpen();
    // Inference begins immediately; beginStreamingReply sequences welcome and reading speech.
    if (!active()) return;
    await handleSendMessage(openingPrompt(stage), undefined, undefined, stage);
    // The person chooses when to leave the exploration stop; never auto-advance.
  };

  handleSendMessageRef.current = async (t?: string) => { await handleSendMessage(t); };

  useEffect(() => {
    const progress = externalReadingProgress;
    if (!progress || !sessionIsActive()) return;
    const controller = streamingReply.current?.id === progress.id ? streamingReply.current
      : beginStreamingReply(progress.id,progress.chart,`### ${progress.title}\n\n`);
    if (progress.error) { controller.fail(); setIsTyping(false); waitingUtterance.current?.cancel();setWaitingCaption(null); }
    else {setIsTyping(true);controller.update(progress.text,progress.model);}
  }, [externalReadingProgress]);

  useEffect(() => {
    if (!selectionRequest || consumedSelection.current === selectionRequest.id || inFlight.current) return;
    consumedSelection.current = selectionRequest.id;
    void handleSendMessage('Explain the selected chart components using their calculated placements, and show each as you discuss it.',selectionRequest.targets,selectionRequest.sourceChart);
    onSelectionRequestConsumed?.(selectionRequest.id);
  }, [selectionRequest, isTyping, chart]);

  // Quick-entry: consume the injected keyboard message as a sent turn.
  useEffect(() => {
    if (quickMessage?.text && chart && !inFlight.current) {
      void handleSendMessageRef.current?.(quickMessage.text);
      onClearQuickMessage?.();
    }
  }, [quickMessage, chart, isTyping]);

  // Inject external reading or user inquiry (e.g. from Readings modal, Themes box, or Multi-select)
  useEffect(() => {
    if (sessionIsActive() && !inFlight.current && externalReadingToInject && consumedExternalReading.current !== externalReadingToInject) {
      const { title, content, type, sender } = externalReadingToInject;
      if (type === 'initial_reading' && !isSignedIn) {
        onOpen();
        onSignIn();
        return;
      }
      consumedExternalReading.current = externalReadingToInject;

      if (type === 'initial_reading') {
        onClearExternalReading?.();
        void runOpening('natal');
        return;
      }

      if (sender === 'user' || type === 'user_query' || type === 'user_inquiry') {
        onOpen();
        if (onClearExternalReading) {
          onClearExternalReading();
        }
        handleSendMessage(content);
        return;
      }

      setSoul(loadSoulState(accountUid));
      const readingMsg: PersistentChatMessage = {
        createdAt: externalReadingToInject.generatedAt ?? new Date().toISOString(),
        observationSnapshot: externalReadingToInject.observationSnapshot ? structuredClone(externalReadingToInject.observationSnapshot) : undefined,
        id: externalReadingToInject.streamId || `reading-${Date.now()}`,
        model: externalReadingToInject.model,
        sender: 'natally',
        text: `### ${title}\n\n${content}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        topic: title.slice(0, 28),
        category: type as any,
        chartFocusKey: externalReadingToInject.chartFocusKey,
        presentationVersion:externalReadingToInject.presentationVersion,
        presentationCues:externalReadingToInject.presentationCues?.map(cue => ({...cue,offset:cue.offset+`### ${title}\n\n`.length})),
        chartCues: externalReadingToInject.chartCues?.map(cue => ({ ...cue, offset: cue.offset + `### ${title}\n\n`.length })),
      };

      setMessages((prev) => [...prev, readingMsg]);
      // A generated interpretation is not a user-disclosed biographical fact.

      if (externalReadingToInject.streamId && streamingReply.current?.id === externalReadingToInject.streamId) {
        setStreamingMessage(null);setIsTyping(false);void streamingReply.current.complete(readingMsg);
      } else presentMessage(readingMsg);

      if (onClearExternalReading) {
        onClearExternalReading();
      }

      onOpen();
    }
  }, [externalReadingToInject, isSignedIn, isTyping]);

  useEffect(() => {
    const hasOnlyWelcome = messagesRef.current.length === 0 || messagesRef.current.every(message => message.id === 'init-1');
    if ((legacyOpeningPending.current || hasOnlyWelcome) && isSignedIn && !inFlight.current && sessionIsActive()) {
      legacyOpeningPending.current = false;
      void runOpening('natal');
    }
  }, [isSignedIn]);

  // Read initial greeting if freshly mounted and reading aloud is enabled
  useEffect(() => {
    if (voiceSettings.readingAloud && messages.length === 1 && !currentlySpeakingMsgId) {
      const initGreeting = messages[0]?.text;
      if (initGreeting) {
        const t = setTimeout(() => {
          if (!sessionIsActive() || !greetingAllowed.current) return;
          presentMessage(messages[0]);
        }, 1200);
        return () => clearTimeout(t);
      }
    }
  }, []);

  // Voice speech-to-text recognition initialization
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && sessionIsActive()) {
          void handleSendMessageRef.current?.(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      return () => {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.abort();
        recognitionRef.current = null;
      };
    }
  }, [chart, voiceSettings]);

  const toggleVoiceListen = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser window. You can type freely!');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Draggable card event handlers - can drag anywhere on card
  const handleCardPointerDown = (e: React.PointerEvent) => {
    if (chatLayout.mobile) return;
    if (
      (e.target as HTMLElement).closest(
        'button, input, textarea, a, select, [role="button"], form, .overflow-y-auto'
      ) ||
      isExpanded
    ) {
      return;
    }
    setIsDraggingCard(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: cardPos.x,
      initialY: cardPos.y,
    };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handleHeaderPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingCard || isExpanded || chatLayout.mobile) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;
    const curWidth = Math.min(cardSize.width, window.innerWidth - 32);
    const curHeight = Math.min(cardSize.height, window.innerHeight - 32);
    const newX = Math.max(16, Math.min(window.innerWidth - curWidth - 16, dragStartRef.current.initialX + dx));
    const newY = Math.max(16, Math.min(window.innerHeight - curHeight - 16, dragStartRef.current.initialY + dy));
    setCardPos({ x: newX, y: newY });
  };

  const handleHeaderPointerUp = (e: React.PointerEvent) => {
    if (isDraggingCard) {
      setIsDraggingCard(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  // Corner resize handler
  const handleResizePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isResizingRef.current = true;
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      width: cardSize.width,
      height: cardSize.height,
    };
    const handlePointerMove = (ev: PointerEvent) => {
      if (!isResizingRef.current) return;
      const dx = ev.clientX - resizeStartRef.current.mouseX;
      const dy = ev.clientY - resizeStartRef.current.mouseY;
      setCardSize({
        width: Math.max(320, Math.min(window.innerWidth - 30, resizeStartRef.current.width + dx)),
        height: Math.max(380, Math.min(window.innerHeight - 30, resizeStartRef.current.height + dy)),
      });
    };
    const handlePointerUp = () => {
      isResizingRef.current = false;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Media upload handler
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (!sessionIsActive()) return;
      const dataUrl = event.target?.result as string;
      setAttachedMedia({ url: dataUrl, name: file.name });
    };
    reader.readAsDataURL(file);
  };

  // Replay a specific turn using the loudspeaker icon with karaoke
  const stopCurrentVoice = () => {
    streamingReply.current?.cancelSpeech();
    presentationGeneration.current++;
    stopSpeaking();
    setIsPreparingSpeech(false);setCurrentlySpeakingMsgId(null);setKaraokeCharIndex(null);
    onSpeechStateChange(false,null,null);
  };

  const handleReplayTurn = (msg: PersistentChatMessage) => {
    if (!sessionIsActive()) return;
    if (msg.streamState) { stopCurrentVoice(); return; }
    if (currentlySpeakingMsgId === msg.id || (isPreparingSpeech && passage?.messageId === msg.id)) {
      stopCurrentVoice();
      return;
    }

    presentMessage(msg);
  };

  // Scroll to a specific message milestone from the timeline
  const scrollToMessage = (msgId: string) => {
    const el = messageRefs.current[msgId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-[#f2ca50]');
      setTimeout(() => el.classList.remove('ring-2', 'ring-[#f2ca50]'), 1800);
    }
  };

  // Filter messages by search query
  const filteredMessages = useMemo(() => {
    const visible = streamingMessage ? [...messages,streamingMessage] : messages;
    if (!searchQuery.trim()) return visible;
    const q = searchQuery.toLowerCase();
    return visible.filter(
      (m) =>
        m.text.toLowerCase().includes(q) ||
        (m.topic && m.topic.toLowerCase().includes(q)) ||
        (m.mediaName && m.mediaName.toLowerCase().includes(q))
    );
  }, [messages, streamingMessage, searchQuery]);

  const messageChartCues = useMemo(() => new Map([...readingPlans].map(([id,plan]) => [id,
    plan.cues.filter(cue=>cue.action.type==='focus').map(cue=>({offset:cue.offset,targets:(cue.action as Extract<PresentationAction,{type:'focus'}>).targets}))])),[readingPlans]);

  // Rich scrollable timeline milestones with date-time markings for all key turns
  const timelineTopics = useMemo(() => {
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return messages
      .filter((m) => {
        // Include messages with explicit topic, readings, user inquiries, or first greeting
        if (m.topic) return true;
        if (m.category && m.category !== 'chat') return true;
        if (m.sender === 'user') return true;
        if (m.id.includes('init') || m.id.includes('welcome')) return true;
        return false;
      })
      .map((m, idx) => {
        let topicLabel = m.topic;
        if (!topicLabel) {
          if (m.sender === 'user') {
            const clean = m.text.replace(/[*#_~`>]/g, '').trim();
            topicLabel = clean.length > 28 ? clean.slice(0, 26) + '…' : clean || 'Inquiry';
          } else if (m.category === 'reading') {
            topicLabel = 'Celestial Reading';
          } else if (m.category === 'horoscope') {
            topicLabel = 'Transit Horoscope';
          } else if (m.category === 'synastry') {
            topicLabel = 'Synastry Synthesis';
          } else {
            topicLabel = idx === 0 ? 'Natal Chart Vault' : `Turn ${idx + 1}`;
          }
        }
        return {
          id: m.id,
          topic: topicLabel,
          timestamp: m.timestamp,
          date: todayStr,
          sender: m.sender,
        };
      });
  }, [messages]);

  const handleDownloadTranscript = () => {
    if (!sessionIsActive()) return;
    const transcriptText = messages
      .map((m) => {
        const mediaTag = m.mediaName ? ` [Attached: ${m.mediaName}]` : '';
        return `[${m.timestamp}] ${m.sender.toUpperCase()}${mediaTag}: ${m.text}`;
      })
      .join('\n\n');
    const blob = new Blob(
      [
        `NATALLY CONVERSATION & PERSISTENT LORE TRANSCRIPT\nNative: ${chart.input.name} (${chart.sunFormatted}, ${chart.ascFormatted})\nLocation: ${chart.input.placeName}\nGenerated: ${new Date().toLocaleString()}\n\n${transcriptText}\n\n---\nCopyright (C)2026 Robin L. M. Cheung, MBA. https://natally.robin.mba/`,
      ],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `natally_lore_${chart.input.name.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearHistory = () => {
    if (!sessionIsActive()) return;
    if (confirm('Clear only the conversation? Memories, saved audio and atelier history remain. To erase them together, use Profile → Erase all Natally history.')) {
      presentationGeneration.current++;
      stopSpeaking();
      onChartFocus?.([], chart);
      setMessages([
        {
          id: 'init-1',
          sender: 'natally',
          text: `A fresh page. I still have your chart beside me. What would you like to explore?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          topic: 'Fresh Slate',
          category: 'lore',
        },
      ]);
    }
  };

  const toggleReadingAloud = () => {
    const updated = { ...voiceSettings, readingAloud: !voiceSettings.readingAloud };
    onUpdateVoiceSettings(updated);
    saveVoiceSettings(updated);
    if (!updated.readingAloud) {
      presentationGeneration.current++;
      stopSpeaking();
      onSpeechStateChange(false, null, null);
      setCurrentlySpeakingMsgId(null); setIsPreparingSpeech(false);
    }
  };

  return (
    <>
      {/* Dockable, Resizable & Draggable Acrylic Chat Card */}
      {(embedded || isOpen) && (
        <div
          data-embedded={embedded}
          data-mobile={chatLayout.mobile}
          data-compact={chatLayout.compact}
          role="region"
          aria-label="Chat with Natally"
          style={embedded ? {position:'relative', width:'100%',height:'100%',minHeight:0,background:'#100a1c'} : {
            position: 'fixed',
            top: chatLayout.top,
            left: chatLayout.left,
            width: chatLayout.width,
            height: chatLayout.height,
            zIndex: 55,
            background: 'rgba(16, 10, 28, 0.48)',
            backdropFilter: 'blur(32px) saturate(210%)',
            WebkitBackdropFilter: 'blur(32px) saturate(210%)',
            boxShadow: isDraggingCard
              ? '0 24px 60px rgba(0,0,0,0.85), 0 0 24px rgba(212,175,55,0.35)'
              : '0 20px 48px -12px rgba(0,0,0,0.65), 0 0 18px rgba(212,175,55,0.25)',
          }}
          onPointerDown={embedded ? undefined : handleCardPointerDown}
          onPointerMove={embedded ? undefined : handleHeaderPointerMove}
          onPointerUp={embedded ? undefined : handleHeaderPointerUp}
          className={`natally-chat celestial-panel rounded-2xl border border-[#d4af37]/50 shadow-2xl flex flex-col pointer-events-auto transition-shadow cursor-grab active:cursor-grabbing ${
            isDraggingCard ? 'scale-[1.01]' : ''
          }`}
        >
          {/* Draggable Card Header */}
          <div
            onPointerDown={handleCardPointerDown}
            onPointerMove={handleHeaderPointerMove}
            onPointerUp={handleHeaderPointerUp}
            className={`natally-chat-header shrink-0 px-4 py-3 bg-[#1d122e]/95 border-b border-[#322641] rounded-t-2xl flex items-center justify-between select-none ${
              isExpanded ? '' : 'cursor-grab active:cursor-grabbing'
            }`}
          >
            <div className="natally-chat-identity flex min-w-0 items-center gap-2.5">
              <div title="Natally" className="pointer-events-auto">
                <NatallyIcon size="header" isSpeaking={currentlySpeakingMsgId !== null} />
              </div>
              <div className="pointer-events-none">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-cinzel font-bold text-sm text-[#f2ca50] flex items-center gap-1">
                    <span>Natally</span>
                    <Move className="w-3 h-3 text-[#a99dae] opacity-60" />
                  </h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="natally-chat-detail text-[9px] font-mono text-[#f2a38c] bg-[#3b2752] px-1.5 py-0.2 rounded border border-[#f2ca50]/30">
                    Natally’s Voice
                  </span>
                </div>
                <p className="natally-chat-detail font-mono text-[10px] text-[#a99dae]">
                  {embedded ? 'The conversation' : 'Draggable Card'} · {chart.input.birthTimeUnknown ? 'Birth time unknown' : chart.ascFormatted}
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="natally-chat-controls flex shrink-0 items-center gap-1 text-[#a99dae] pointer-events-auto">

              <button
                type="button"
                onClick={toggleReadingAloud}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  voiceSettings.readingAloud
                    ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                    : 'text-rose-400 bg-rose-950/40 border border-rose-500/30'
                }`}
                title={
                  voiceSettings.readingAloud
                    ? 'Reading Aloud Active (Click to mute)'
                    : 'Silent Mode (Click to enable Voice)'
                }
              >
                {voiceSettings.readingAloud ? (
                  <Volume2 className="w-3.5 h-3.5" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowConfigModal(true)}
                className="p-1.5 rounded-lg hover:text-[#f2ca50] transition-colors cursor-pointer"
                title="Listening preferences"
                aria-label="Listening preferences"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={()=>void requestDownload({format:"transcript",resourceId:chartFocusKey(chart)},handleDownloadTranscript,sessionIsActive)}
                className="p-1.5 rounded-lg hover:text-[#f2ca50] transition-colors cursor-pointer"
                title="Download Persistent Transcript"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg hover:text-rose-400 transition-colors cursor-pointer"
                title="Clear Conversation History"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                hidden={embedded}
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:text-[#f2ca50] transition-colors cursor-pointer"
                title={isExpanded ? 'Restore Size' : 'Maximize Window'}
              >
                {isExpanded ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                type="button"
                hidden={embedded}
                onClick={onClose}
                className="p-1.5 rounded-lg hover:text-rose-400 transition-colors cursor-pointer"
                title="Close Chat Window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {(natalOpening || nowOpening || messages.every(message => message.id === 'init-1') || externalReadingToInject?.type === 'initial_reading') && <nav className="natally-reading-route" aria-label="Your reading journey">
            <ol className="natally-reading-route__stations">
              <li data-current={!natalOpening}><button type="button" disabled={!natalOpening} onClick={() => natalOpening && goToPassage(natalOpening,0)}>Natal</button></li>
              <li data-current={!!natalOpening && !nowOpening}><span>Explore</span></li>
              <li data-current={!!nowOpening}><button type="button" disabled={!nowOpening} onClick={() => nowOpening && goToPassage(nowOpening,0)}>Right now</button></li>
            </ol>
            {natalOpening && !nowOpening && <button type="button" className="natally-reading-route__continue" disabled={isTyping} onClick={() => void runOpening('now')}>{isTyping ? 'One moment…' : 'Continue to my horoscope →'}</button>}
          </nav>}

          {/* Search Bar & Lore Filter */}
          <div className="natally-chat-search shrink-0 px-3.5 py-2 bg-[#170e24]/90 border-b border-[#322641] flex items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <Search className="w-3.5 h-3.5 text-[#a99dae] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversation, topics, or lore..."
                className="talisman-input w-full rounded-lg pl-8 pr-6 py-1 text-[11px] font-mono"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#a99dae] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
            <span className="text-[10px] font-mono text-[#a99dae] whitespace-nowrap">
              {filteredMessages.length} turns
            </span>
          </div>

          {/* Interactive Scrollable Timeline Rail with Conversation Turn-Lore & Date-Time Markings */}
          {timelineTopics.length > 0 && (
            <div className="natally-chat-timeline shrink-0 relative px-2 py-1.5 bg-[#180f26]/95 border-b border-[#322641] flex items-center gap-1.5 select-none z-10 group/timeline">
              <div className="flex items-center gap-1 shrink-0 px-1 text-[#f2ca50] font-bold text-[10px] font-mono border-r border-[#322641] pr-2">
                <Clock className="w-3.5 h-3.5 text-[#f2ca50] animate-spin-slow" />
                <span>Timeline:</span>
              </div>

              {/* Scroll Left Button */}
              <button
                type="button"
                onClick={() => {
                  const rail = document.getElementById('natally-timeline-scroll-rail');
                  if (rail) rail.scrollBy({ left: -220, behavior: 'smooth' });
                }}
                className="p-1 rounded hover:bg-[#3d2657] text-[#a99dae] hover:text-[#f2ca50] transition-colors shrink-0 cursor-pointer"
                title="Scroll timeline back"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {/* Horizontally Scrollable Timeline Track */}
              <div
                id="natally-timeline-scroll-rail"
                onWheel={(e) => {
                  if (e.deltaY !== 0) {
                    e.currentTarget.scrollLeft += e.deltaY;
                  }
                }}
                className="flex items-center gap-2 overflow-x-auto scroll-smooth py-1 px-1 flex-1 text-[10px] font-mono"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#d4af37 #1a102a',
                }}
              >
                {timelineTopics.map((item, idx) => (
                  <button
                    key={`${item.id}-${idx}`}
                    type="button"
                    onClick={() => scrollToMessage(item.id)}
                    className="px-2.5 py-1 rounded-lg bg-[#241537] hover:bg-[#382054] border border-[#d4af37]/35 hover:border-[#f2ca50] text-[#f1e8d8] whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 group shrink-0 shadow-sm"
                    title={`Go to: ${item.topic} (${item.date} ${item.timestamp})`}
                  >
                    <span className="text-[#f2ca50] group-hover:scale-125 transition-transform text-[11px]">✦</span>
                    <span className="font-semibold text-white/95 group-hover:text-[#f2ca50] transition-colors max-w-[130px] truncate">
                      {item.topic}
                    </span>
                    <span className="text-[8.5px] text-[#f2ca50] bg-[#160d24] px-1.5 py-0.5 rounded border border-[#d4af37]/25 font-mono flex items-center gap-0.5">
                      <Calendar className="w-2.5 h-2.5 text-[#f2ca50]" />
                      <span>{item.date}</span>
                    </span>
                    <span className="text-[8.5px] text-[#f2a38c] bg-[#160d24] px-1.5 py-0.5 rounded border border-[#f2a38c]/25 font-mono flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5 text-[#f2a38c]" />
                      <span>{item.timestamp}</span>
                    </span>
                  </button>
                ))}
              </div>

              {/* Scroll Right Button */}
              <button
                type="button"
                onClick={() => {
                  const rail = document.getElementById('natally-timeline-scroll-rail');
                  if (rail) rail.scrollBy({ left: 220, behavior: 'smooth' });
                }}
                className="p-1 rounded hover:bg-[#3d2657] text-[#a99dae] hover:text-[#f2ca50] transition-colors shrink-0 cursor-pointer"
                title="Scroll timeline forward"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Infinite Scroll Messages Area */}
          <div
            ref={messagesContainerRef}
            className="natally-chat-messages min-h-0 flex-1 p-3.5 overflow-y-auto space-y-3 font-mono text-xs"
          >
            {filteredMessages.map((m) => {
              const chartCues = messageChartCues.get(m.id) || [];
              const isNatally = m.sender === 'natally';
              const isSpeakingThisMsg = currentlySpeakingMsgId === m.id;
              const isPreparingThisMsg = isPreparingSpeech && passage?.messageId === m.id;

              return (
                <div
                  key={m.id}
                  data-streaming={m.streamState === 'streaming'}
                  data-model={m.model}
                  aria-busy={m.streamState === 'streaming'}
                  ref={(el) => {
                    messageRefs.current[m.id] = el;
                  }}
                  className={`flex flex-col transition-all duration-200 ${
                    isNatally ? 'items-start' : 'items-end'
                  }`}
                >
                  {/* Header info */}
                  <div className="flex items-center gap-2 mb-1 text-[9px] text-[#8e8294]">
                    <span className="font-semibold">{isNatally ? 'NATALLY' : chart.input.name}</span>
                    <span>·</span>
                    <span>{m.timestamp}</span>
                    {m.topic && (
                      <span className="bg-[#2a1a3d] text-[#f2ca50] px-1.5 py-0.2 rounded border border-[#f2ca50]/20 flex items-center gap-0.5">
                        <Tag className="w-2.5 h-2.5" />
                        <span>{m.topic}</span>
                      </span>
                    )}
                    {m.isOfflineMode && (
                      <span className="bg-amber-950/70 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30 text-[8px] font-mono tracking-wide uppercase">
                        Legacy generated template · not a model reply
                      </span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`relative max-w-[88%] px-3.5 py-2.5 rounded-2xl leading-relaxed shadow-md transition-all ${
                      isNatally
                        ? `bg-[#25173c]/95 text-[#f1e8d8] border rounded-tl-sm ${
                            isSpeakingThisMsg
                              ? 'border-[#f2ca50] shadow-[0_0_16px_rgba(242,202,80,0.25)]'
                              : 'border-[#d4af37]/35'
                          }`
                        : 'bg-gradient-to-r from-[#d4af37] to-[#f2a38c] text-[#120c1c] font-medium rounded-tr-sm'
                    }`}
                  >
                    {/* Render Uploaded Media image if attached to message */}
                    {m.mediaUrl && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-white/20 shadow-md">
                        <img
                          src={m.mediaUrl}
                          alt={m.mediaName || 'Uploaded media'}
                          className="max-h-48 w-full object-cover"
                        />
                        <div className="px-2.5 py-1 bg-black/75 text-[9px] font-mono text-white/90 flex items-center justify-between gap-2">
                          <span className="truncate">📎 {m.mediaName}</span>
                        </div>
                      </div>
                    )}

                    {isNatally ? (
                      <div>
                        {chartCues.some(cue => cue.targets.length > 0) && (
                          <div className="mb-2 flex flex-wrap gap-1" aria-label="Chart highlights for this reply">
                            {chartCues.filter(cue => cue.targets.length > 0).map((cue, index) => (
                              <button key={index} type="button" className="rounded border border-[#d4af37]/50 px-2 py-1 text-[#ffdf80] cursor-pointer"
                                onClick={() => {linkedPassage.current={messageId:m.id,offset:cue.offset};showReadingChart(m); onShowTargets(cue.targets);}}>
                                Show {cue.targets.map(chartTargetLabel).join(' · ')}
                              </button>
                            ))}
                          </div>
                        )}
                        <RichText
                          content={m.text}
                          references={planFor(m)?.recovered?.references}
                          resolveTarget={(raw,offset) => {
                            const plan=planFor(m);
                            if(plan?.recovered) return plan.recovered.references.find(ref=>ref.start===offset&&ref.end===offset+raw.length)?.target ?? null;
                            return resolveChartTarget(raw,sourceChartFor(m));
                          }}
                          targetNames={[...new Set([...chartReferenceNames(chart),...chartReferenceNames(sourceChartFor(m))])]}
                          highlightCharIndex={isSpeakingThisMsg ? karaokeCharIndex : null}
                          isCurrentlySpeaking={isSpeakingThisMsg}
                          onTagClick={(tag, offset) => {
                            linkedPassage.current = {messageId:m.id,offset};
                            showReadingChart(m); onShowTargets([tag]);
                          }}
                        />
                        {m.streamState && <p role="status" className="mt-2 text-xs text-[#f2ca50]">{m.streamState === 'streaming' ? 'Writing…' : 'Interrupted reading · retry your question below.'}</p>}

                        {planFor(m)?.recovered?.notice && <p className="mt-2 text-[10px] text-[#c7b7d3]">{planFor(m)!.recovered!.notice}</p>}
                        {cuesFor(m).length > 0 && <div className="mt-3 flex flex-wrap items-center gap-2 text-xs" aria-label="Reading passage navigation">
                          <button type="button" className="rounded border border-[#d4af37]/40 px-2 py-1" onClick={() => goToPassage(m, passage?.messageId === m.id ? passage.index-1 : 0)}>Previous passage</button>
                          <span>{passage?.messageId === m.id ? passage.index+1 : 1} / {[...new Set([0,...cuesFor(m).map(c => c.offset)])].length}</span>
                          <button type="button" className="rounded border border-[#d4af37]/40 px-2 py-1" onClick={() => goToPassage(m, passage?.messageId === m.id ? passage.index+1 : 0)}>Next passage</button>
                        </div>}
                        {/* Optional Astrological Provenance & Verified Geometry Disclosure */}
                        {m.evidence && (
                          <div className="mt-2 pt-1 border-t border-[#3b2954]/50">
                            <button
                              type="button"
                              onClick={() => setExpandedEvidenceMsgId(expandedEvidenceMsgId === m.id ? null : m.id)}
                              className="text-[9px] font-mono text-[#d4af37] hover:text-[#f2ca50] flex items-center gap-1 cursor-pointer transition-colors bg-[#180f26] px-2 py-0.5 rounded border border-[#d4af37]/30"
                            >
                              <Compass className="w-2.5 h-2.5 text-[#d4af37]" />
                              <span>{expandedEvidenceMsgId === m.id ? 'Hide Astrological Provenance & Geometry' : '✦ View Astrological Provenance & Geometry'}</span>
                            </button>

                            {expandedEvidenceMsgId === m.id && (
                              <div className="mt-1.5 p-2 rounded-xl bg-[#130a21] border border-[#d4af37]/35 text-[9px] font-mono space-y-1 text-[#e5dcd0]">
                                <div className="font-bold text-[#f2ca50] flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-[#f2ca50]" />
                                  <span>Epistemological Provenance</span>
                                </div>
                                {m.evidence.verifiedGeometry && (
                                  <div>
                                    <span className="text-[#a99dae] font-semibold">Verified Geometry: </span>
                                    <span>{m.evidence.verifiedGeometry}</span>
                                  </div>
                                )}
                                {m.evidence.traditionalDoctrine && (
                                  <div>
                                    <span className="text-[#a99dae] font-semibold">Traditional Doctrine: </span>
                                    <span>{m.evidence.traditionalDoctrine}</span>
                                  </div>
                                )}
                                {m.evidence.modernDoctrine && (
                                  <div>
                                    <span className="text-[#a99dae] font-semibold">Modern Doctrine: </span>
                                    <span>{m.evidence.modernDoctrine}</span>
                                  </div>
                                )}
                                {m.evidence.interpretiveHypothesis && (
                                  <div>
                                    <span className="text-[#a99dae] font-semibold">Interpretive Hypothesis: </span>
                                    <span>{m.evidence.interpretiveHypothesis}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {audioNotices[m.id] && <p role="status" className="mt-2 text-[10px] text-[#c7b7d3]">{audioNotices[m.id].message}</p>}
                        {!m.streamState && <RetainedReadingAudio accountUid={accountUid} messageId={m.id} isCurrentSession={sessionIsActive} onReplay={() => beginRetainedReplay(m)} onPosition={offset => presentRetainedPosition(m,offset)} onPlaybackState={playing => presentRetainedState(m,playing)} />}
                        {/* Turn-by-Turn Replay Loudspeaker & Karaoke Action Button */}
                        <div className="mt-2 pt-1.5 border-t border-[#3b2954]/60 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => handleReplayTurn(m)}
                            disabled={!!m.streamState && !isSpeakingThisMsg && !isPreparingThisMsg}
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                              isSpeakingThisMsg
                                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400'
                                : 'bg-[#1b102b] text-[#f2ca50] border border-[#d4af37]/30 hover:bg-[#342452]'
                            }`}
                            title="Replay in Natally's voice with karaoke"
                          >
                            <Volume2
                              className={`w-3 h-3 ${isSpeakingThisMsg ? 'animate-pulse text-emerald-300' : ''}`}
                            />
                            <span>{isPreparingThisMsg ? 'Preparing voice (Stop)' : isSpeakingThisMsg ? 'Karaoke Active (Stop)' : 'Replay Voice'}</span>
                          </button>

                          {m.category && (
                            <span className="text-[9px] text-[#8e8294] uppercase tracking-wider">
                              {m.category}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span>{m.text}</span>
                    )}
                  </div>
                </div>
              );
            })}

            {(isTyping || isPreparingSpeech) && (
              <div className="flex items-center gap-1.5 text-xs text-[#d4af37] font-mono pl-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span role="status">{streamingMessage?.streamState === 'streaming'
                  ? currentlySpeakingMsgId ? 'Speaking while the reading arrives…' : isPreparingSpeech ? 'Preparing the next spoken passage…' : 'Writing…'
                  : waitingCaption || (isPreparingSpeech ? 'Preparing voice…' : 'Let me look into that.')}</span>
              </div>
            )}

          {soul.notice && <p role="status" className="px-4 py-2 text-xs text-amber-200">{soul.notice}</p>}
          {presentation.selectedTargets.length > 0 && <div className="natally-chat-selection px-2 py-2 border-t border-[#d4af37]/30 text-xs flex flex-wrap items-center justify-between gap-2"><span>Selected: {presentation.selectedTargets.map(chartTargetLabel).join(' · ')}</span><button type="button" disabled={isTyping} className="px-2 py-1 border rounded disabled:opacity-40" onClick={() => handleSendMessage('Explain the selected chart components using their calculated placements, and show each as you discuss it.')}>Discuss selection</button></div>}
          {/* Error Recovery & Status Notice Banner */}
          {errorDetails && (
            <div role="alert" className="natally-chat-notice my-2 p-2.5 rounded-xl bg-amber-950/80 border border-amber-500/50 text-[11px] font-mono text-amber-200 flex flex-col gap-1.5 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Reading status</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorDetails(null)}
                  className="text-amber-400 hover:text-white text-xs cursor-pointer"
                  title="Dismiss notice"
                >
                  ✕
                </button>
              </div>
              <p className="text-[10px] text-amber-100/90 leading-relaxed">
                {errorDetails.message}
              </p>
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {errorDetails.errorType === 'auth_required' && (
                  <button type="button" onClick={onSignIn}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] cursor-pointer">
                    {isSignedIn ? 'Check sign-in' : 'Sign in to get your reading'}
                  </button>
                )}
                {errorDetails.errorType === 'reading_access_required' && <button type="button" onClick={onSignIn} className="px-2.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold cursor-pointer">Check reading access</button>}
                {errorDetails.canRetry && lastFailedPrompt && (errorDetails.errorType !== 'auth_required' || isSignedIn) && (
                  <button
                    type="button"
                    onClick={() => {
                      const prompt = lastFailedPrompt;
                      setErrorDetails(null);
                      if (failedOpeningStage.current) void runOpening(failedOpeningStage.current);
                      else void handleSendMessage(prompt);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] cursor-pointer transition-colors"
                  >
                    ↻ Retry reading
                  </button>
                )}
              </div>
            </div>
          )}
          </div>

          {/* Attached Media Preview inside Input Footer */}
          {attachedMedia && (
            <div className="shrink-0 px-3.5 py-1.5 bg-[#170e24] border-t border-[#322641] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <img
                  src={attachedMedia.url}
                  alt="Thumbnail"
                  className="w-7 h-7 rounded-lg object-cover border border-[#d4af37]/40 shrink-0"
                />
                <span className="text-[10px] font-mono text-[#f2ca50] truncate">
                  📎 {attachedMedia.name}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setAttachedMedia(null)}
                  className="text-xs text-[#a99dae] hover:text-rose-400 p-1 cursor-pointer"
                  title="Remove attachment"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Input Footer with Media Upload & Voice Buttons */}
          <div className="natally-chat-composer shrink-0 p-3 bg-[#1d122e]/95 border-t border-[#322641] rounded-b-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Media Upload Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.txt"
                onChange={handleMediaUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-xl bg-[#271c36] hover:bg-[#382650] border border-[#322641] text-[#a99dae] hover:text-[#f2ca50] transition-colors cursor-pointer"
                title="Upload image or chart media to share with Natally"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={toggleVoiceListen}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                    : 'bg-[#271c36] border-[#322641] text-[#a99dae] hover:text-[#f2ca50]'
                }`}
                title={isListening ? 'Stop Listening' : 'Speak to Natally'}
              >
                {isListening ? (
                  <Mic className="w-4 h-4" />
                ) : (
                  <MicOff className="w-4 h-4" />
                )}
              </button>

              <input
                type="text"
                value={inputText}
                aria-label="Message Natally"
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isListening
                    ? 'Listening to your voice...'
                    : 'Ask Natally or share media lore...'
                }
                className="talisman-input min-w-0 flex-1 rounded-xl px-3.5 py-2 text-xs"
              />

              {(isTyping || currentlySpeakingMsgId || isPreparingSpeech) && <button type="button" aria-label="Stop voice" title="Stop voice; keep receiving text" onClick={stopCurrentVoice} className="p-2 rounded-xl bg-[#271c36] border border-[#d4af37]/50 text-[#f2ca50] cursor-pointer"><Square className="w-4 h-4"/></button>}

              <button
                type="submit"
                aria-label="Send message"
                disabled={isTyping || (!inputText.trim() && !attachedMedia)}
                className="p-2 rounded-xl bg-[#d4af37] hover:bg-[#f2ca50] text-[#120c1c] transition-colors cursor-pointer disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Corner Resize Grip */}
          {!embedded && !isExpanded && !chatLayout.mobile && (
            <div
              onPointerDown={handleResizePointerDown}
              className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize flex items-end justify-end p-1 z-50 select-none group/resize"
              title="Drag corner to resize chat container"
            >
              <svg
                viewBox="0 0 10 10"
                className="w-3 h-3 text-[#d4af37]/50 group-hover/resize:text-[#d4af37] transition-colors pointer-events-none"
              >
                <path d="M9 1L1 9M9 5L5 9M9 9L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Config Modal */}
      {showConfigModal && (
        <NatallyConfigModal
          settings={voiceSettings}
          onUpdateSettings={onUpdateVoiceSettings}
          onClose={() => setShowConfigModal(false)}
        />
      )}
    </>
  );
};
