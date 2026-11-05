import React, { useEffect, useRef, useState } from 'react';

interface NatallyIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'header';
  isSpeaking?: boolean;
  className?: string;
}

export const NatallyIcon: React.FC<NatallyIconProps> = ({
  size = 'md',
  isSpeaking = false,
  className = '',
}) => {
  const [guiding, setGuiding] = useState(false);
  const [sequence, setSequence] = useState(0);
  const [guideReady, setGuideReady] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    if (!guideReady || !sequence) return;
    setGuiding(true);
    timer.current = setTimeout(() => setGuiding(false), 1700);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [sequence, guideReady]);
  const guide = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setSequence(value => value + 1);
  };
  const pixelSizes = {
    header: Math.min(112, Math.max(48, Number(import.meta.env?.VITE_NATALLY_HEADER_SIZE) || 72)),
    sm: 36,
    md: 48,
    lg: 64,
    xl: 84,
  }[size];

  return (
    <button type="button" className={`natally-brand-icon ${size === 'header' ? 'natally-header-avatar' : ''} ${guiding ? 'is-guiding' : ''} ${className}`}
      style={{ width: pixelSizes, height: pixelSizes }} aria-label="Watch Natally point to her natal chart"
      onPointerDown={event => event.stopPropagation()} onClick={guide}>
      <img className="natally-brand-icon__still" src="/branding/192x192.png" alt="Natally beside a natal chart" draggable={false} />
      <span key={sequence} className="natally-brand-icon__gesture" aria-hidden="true">
        <svg className="natally-brand-icon__chart" viewBox="0 0 100 100" fill="none">
          <circle cx="77" cy="29" r="22" fill="#120c1c" stroke="#f2ca50" strokeWidth=".8" />
          <circle cx="77" cy="29" r="17" stroke="#f2ca50" strokeWidth=".5" />
          {Array.from({ length: 12 }, (_, i) => <path key={i} d="M77 7V12" stroke="#f2ca50" strokeWidth=".7" transform={`rotate(${i * 30} 77 29)`} />)}
          <path d="M65 18L86 22L73 39L65 18L90 35L73 39" stroke="#c084fc" strokeWidth=".7" />
          <circle cx="65" cy="18" r="1.2" fill="#f2ca50" /><circle cx="86" cy="22" r="1.2" fill="#f2ca50" />
          <circle className="natally-brand-icon__focus" cx="73" cy="39" r="2" fill="#fff2ae" stroke="#f2ca50" strokeWidth="1" />
        </svg>
        <img className="natally-brand-icon__guide" src="/branding/natally-guide-512.png" alt="" draggable={false} onLoad={() => setGuideReady(true)} />
      </span>
      {isSpeaking && <span className="natally-brand-icon__speaking" aria-hidden="true" />}
    </button>
  );
};
