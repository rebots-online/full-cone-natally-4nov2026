import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { Astrolabe3D } from './components/Astrolabe3D';
import { auth } from './services/firebase';
import { fetchUserIntake, loadNatalIntake } from './services/onboarding';
import { requiresFreshOnboarding } from './services/natallyHistory';
import { calculateNatalChart, type NatalChartInput, type NatalChartResult } from './services/ephemeris';

type Phase =
  | { kind: 'resolving' }
  | { kind: 'signed-out' }
  | { kind: 'no-intake' }
  | { kind: 'loading'; intake: NatalChartInput }
  | { kind: 'ready'; intake: NatalChartInput; chart: NatalChartResult }
  | { kind: 'error'; message: string };

const CREATE_CHART_HREF = '/?app=1';

const isFreshOnboarding = (uid: string) => {
  try {
    return requiresFreshOnboarding(uid);
  } catch {
    return false;
  }
};

const MarketingNatalChart: React.FC = () => {
  const [phase, setPhase] = useState<Phase>({ kind: 'resolving' });
  const [paused, setPaused] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [selectedPlanetName, setSelectedPlanetName] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [inView, setInView] = useState(false);

  const generationRef = useRef(0);
  const mountedRef = useRef(true);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; generationRef.current += 1; };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      entries => setInView(entries.some(entry => entry.isIntersecting)),
      { rootMargin: '120px' },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const load = useCallback((uid: string | null) => {
    const generation = ++generationRef.current;
    const stale = () => !mountedRef.current || generationRef.current !== generation;

    if (!uid) { setPhase({ kind: 'signed-out' }); return; }
    if (isFreshOnboarding(uid)) { setPhase({ kind: 'no-intake' }); return; }

    (async () => {
      const isCurrent = () => !stale() && auth.currentUser?.uid === uid;
      const local = loadNatalIntake(uid);
      let localReady = false;
      if (local) {
        setPhase({ kind: 'loading', intake: local });
        try {
          const chart = await calculateNatalChart(local);
          if (!isCurrent()) return;
          setPhase({ kind: 'ready', intake: local, chart });
          localReady = true;
        } catch {
          if (!isCurrent()) return;
        }
      } else {
        setPhase({ kind: 'resolving' });
      }

      try {
        const remote = await fetchUserIntake(uid);
        if (!isCurrent()) return;
        if (!remote) {
          if (!localReady) {
            setPhase(local
              ? { kind: 'error', message: 'Your saved intake is invalid.' }
              : { kind: 'no-intake' });
          }
          return;
        }
        if (localReady && JSON.stringify(remote) === JSON.stringify(local)) return;
        if (!localReady) setPhase({ kind: 'loading', intake: remote });
        const chart = await calculateNatalChart(remote);
        if (!isCurrent()) return;
        setPhase({ kind: 'ready', intake: remote, chart });
      } catch {
        if (!isCurrent()) return;
        if (!localReady) setPhase({ kind: 'error', message: 'Your chart could not be loaded.' });
      }
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setSelectedComponents([]);
      setSelectedPlanetName(null);
      load(user?.uid ?? null);
    }, (err: unknown) => {
      generationRef.current += 1;
      setPhase({ kind: 'error', message: err instanceof Error && err.message ? err.message : 'Sign-in state could not be determined. Reload the page to try again.' });
    });
    return unsubscribe;
  }, [load]);

  const spinning = !reducedMotion && !paused && inView;

  const onToggleComponent = useCallback((id: string, isMulti: boolean) => {
    if (isMulti) {
      setSelectedComponents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    } else {
      setSelectedComponents(prev => (prev.length === 1 && prev[0] === id) ? [] : [id]);
    }
  }, []);
  const onSelectPlanet = useCallback((name: string | null) => setSelectedPlanetName(name), []);

  const caption = useMemo(() => {
    if (phase.kind !== 'ready') return null;
    const { name, birthDate, birthTime, birthTimeUnknown, placeName, houseSystem } = phase.intake;
    const time = birthTimeUnknown ? 'birth time not stated · Whole Sign houses' : `${birthTime} · ${houseSystem === 'P' ? 'Placidus' : 'Whole Sign'} houses`;
    return `${name} · born ${birthDate}, ${time} · ${placeName}`;
  }, [phase]);

  return (
    <section ref={sectionRef} className="natal-chart" aria-label="Real natal chart">
      <style>{`
        .natal-chart{width:100%;max-width:520px;margin-inline:auto}
        .natal-chart__stage{position:relative;width:100%;aspect-ratio:1}
        .natal-chart__note{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;gap:12px;text-align:center;padding:24px}
        .natal-chart__note p{color:var(--muted);font-size:14px;margin:0;max-width:34ch}
        .natal-chart__cta{display:inline-flex;align-items:center;min-height:48px;padding:0 20px;border:1px solid var(--accent);border-radius:var(--r);background:var(--accent);color:var(--accent-ink);font:600 15px/1 var(--font-body);text-decoration:none}
        .natal-chart__cta:hover{background:var(--accent-hover);border-color:var(--accent-hover)}
        .natal-chart__controls{position:absolute;left:12px;bottom:12px;display:flex;gap:8px;z-index:2}
        .natal-chart__button{min-height:36px;padding:0 12px;border:1px solid var(--border);border-radius:var(--r);background:color-mix(in oklch,var(--bg) 75%,transparent);backdrop-filter:blur(6px);color:var(--fg);font:500 12.5px/1 var(--font-body);cursor:pointer}
        .natal-chart__button:hover{background:var(--surface-2)}
        .natal-chart__caption{margin:8px auto 0;text-align:center;font-size:11px;color:var(--muted);max-width:520px}
      `}</style>
      <div className="natal-chart__stage">
        {phase.kind === 'ready' && (
          <Astrolabe3D
            chart={phase.chart}
            isSpinning={spinning}
            resetTrigger={resetTrigger}
            selectedComponents={selectedComponents}
            onToggleComponent={onToggleComponent}
            selectedPlanetName={selectedPlanetName}
            onSelectPlanet={onSelectPlanet}
            reducedMotion={reducedMotion}
            motionPaused={paused}
            visible={inView}
          />
        )}
        {(phase.kind === 'signed-out' || phase.kind === 'no-intake') && (
          <div className="natal-chart__note">
            <p>
              {phase.kind === 'signed-out'
                ? 'Sign in to see your own calculated chart here.'
                : 'No natal chart is saved on this account yet.'}
            </p>
            <a className="natal-chart__cta" href={CREATE_CHART_HREF}>Create your natal chart</a>
          </div>
        )}
        {phase.kind === 'resolving' && (
          <div className="natal-chart__note"><p>Loading your chart…</p></div>
        )}
        {phase.kind === 'loading' && (
          <div className="natal-chart__note"><p>Calculating the chart for {phase.intake.name}…</p></div>
        )}
        {phase.kind === 'error' && (
          <div className="natal-chart__note">
            <p>Your chart could not be shown. {phase.message}</p>
            <button type="button" className="natal-chart__cta" onClick={() => load(auth.currentUser?.uid ?? null)}>Retry</button>
          </div>
        )}
        {phase.kind === 'ready' && (
          <div className="natal-chart__controls">
            <button type="button" className="natal-chart__button" onClick={() => setPaused(p => !p)}>
              {paused ? 'Resume rotation' : 'Pause rotation'}
            </button>
            <button type="button" className="natal-chart__button" onClick={() => { setResetTrigger(n => n + 1); setPaused(false); }}>
              Reset view
            </button>
          </div>
        )}
      </div>
      {caption && <p className="natal-chart__caption">{caption}</p>}
    </section>
  );
};

const mount = document.getElementById('natal-chart-root');
if (mount) {
  createRoot(mount).render(<MarketingNatalChart />);
}
