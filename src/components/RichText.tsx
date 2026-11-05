import React from 'react';

interface RichTextProps {
  content: string;
  resolveTarget?: (raw: string, sourceOffset: number) => string | null;
  targetNames?: string[];
  references?: Array<{start:number;end:number;target:string}>;
  onTagClick?: (tag: string) => void;
  className?: string;
  highlightCharIndex?: number | null; // For karaoke word-by-word reading
  isCurrentlySpeaking?: boolean;
}

export const RichText: React.FC<RichTextProps> = ({
  content,
  onTagClick,
  resolveTarget,
  targetNames,
  references,
  className = '',
  highlightCharIndex = null,
  isCurrentlySpeaking = false,
}) => {
  if (!content) return null;

  // Split into paragraphs / lines
  const lines = content.split('\n');

  let accumulatedCharCount = 0;

  const renderInteractive = (text: string, base: number) => {
    if (references && onTagClick) {
      const nodes:React.ReactNode[]=[];let cursor=base;
      for(const ref of [...references].sort((a,b)=>a.start-b.start)) {
        const start=Math.max(base,ref.start),end=Math.min(base+text.length,ref.end);
        if(start<cursor||end<=start)continue;
        if(start>cursor)nodes.push(<React.Fragment key={'text-'+cursor}>{renderKaraokeWords(text.slice(cursor-base,start-base),cursor)}</React.Fragment>);
        const active=isCurrentlySpeaking&&highlightCharIndex!==null&&highlightCharIndex>=start&&highlightCharIndex<end;
        nodes.push(<button type="button" key={'ref-'+start} data-karaoke-active={active||undefined} className={'rounded border px-1 py-0.5 font-semibold '+(active?'border-[#fff4bc] bg-[#f2ca50] text-[#120c1c]':'border-[#d4af37]/70 bg-[#34233f] text-[#ffe49b] hover:bg-[#50375c] focus-visible:outline focus-visible:outline-2')} title={'Show '+ref.target+' on your chart'} onClick={()=>onTagClick(ref.target)}>{text.slice(start-base,end-base)}</button>);
        cursor=end;
      }
      if(cursor<base+text.length)nodes.push(<React.Fragment key={'text-'+cursor}>{renderKaraokeWords(text.slice(cursor-base),cursor)}</React.Fragment>);
      return nodes;
    }
    const names = targetNames ?? ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto','Chiron','Ascendant','Midheaven', ...Array.from({length:12}, (_,i) => 'House ' + (i+1))];
    const patterns = [...names].sort((a,b) => b.length - a.length).map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+'));
    if (!patterns.length) return renderKaraokeWords(text, base);
    const parts = text.split(new RegExp('(?<![\\w])(' + patterns.join('|') + ')(?![\\w])', 'gi'));
    let offset = base;
    return parts.map((part, index) => {
      const start = offset; offset += part.length;
      const target = resolveTarget ? resolveTarget(part, start) : names.find(name => name.toLowerCase() === part.trim().replace(/\s+/g,' ').toLowerCase());
      const active = isCurrentlySpeaking && highlightCharIndex !== null && highlightCharIndex >= start && highlightCharIndex < offset;
      return target && onTagClick ? <button type="button" key={index} data-karaoke-active={active || undefined}
        className={active ? 'rounded bg-[#f2ca50] text-[#120c1c] px-1' : 'rounded border border-[#d4af37]/70 bg-[#34233f] px-1 py-0.5 text-[#ffe49b] hover:bg-[#50375c]'}
        title={'Show ' + target + ' on your chart'} onClick={() => onTagClick(target)}>{part}</button>
        : <React.Fragment key={index}>{renderKaraokeWords(part, start)}</React.Fragment>;
    });
  };
  const renderInlineFormatted = (text: string, lineStartCharOffset: number) => {
    let offset = lineStartCharOffset;
    return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((segment, index) => {
      const start = offset; offset += segment.length;
      if (segment.startsWith('**') && segment.endsWith('**')) return <strong key={index} className="font-semibold">{renderInteractive(segment.slice(2,-2),start+2)}</strong>;
      if (segment.startsWith('*') && segment.endsWith('*')) return <em key={index}>{renderInteractive(segment.slice(1,-1),start+1)}</em>;
      return <React.Fragment key={index}>{renderInteractive(segment,start)}</React.Fragment>;
    });
  };

  // Helper to split text into words and apply karaoke highlighting to the active word
  const renderKaraokeWords = (rawText: string, baseOffset: number) => {
    if (!isCurrentlySpeaking || highlightCharIndex === null) {
      return rawText;
    }

    const words = rawText.split(/(\s+)/);
    let currentPos = baseOffset;

    return words.map((w, wIdx) => {
      const wStart = currentPos;
      currentPos += w.length;

      // Check if highlightCharIndex is within this word (or close proximity)
      const isWordActive =
        highlightCharIndex >= wStart && highlightCharIndex < wStart + w.length;

      if (isWordActive && w.trim().length > 0) {
        return (
          <span
            key={wIdx}
            data-karaoke-active="true"
            className="bg-[#f2ca50]/30 text-[#fff7cc] font-semibold px-0.5 py-0.2 rounded shadow-[0_0_8px_rgba(242,202,80,0.5)] transition-all duration-100"
          >
            {w}
          </span>
        );
      }

      return <span key={wIdx}>{w}</span>;
    });
  };

  const renderedElements: React.ReactNode[] = [];
  let inList = false;
  let currentListItems: React.ReactNode[] = [];

  const flushList = () => {
    if (inList && currentListItems.length > 0) {
      renderedElements.push(
        <ul key={`list-${renderedElements.length}`} className="my-1.5 space-y-1 pl-2">
          {currentListItems}
        </ul>
      );
      currentListItems = [];
      inList = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    const lineOffset = accumulatedCharCount + line.length - line.trimStart().length;
    accumulatedCharCount += line.length + 1;

    if (!trimmed) {
      flushList();
      return;
    }

    // Heading level 3 or 4: ### or ####
    if (trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
      flushList();
      const hText = trimmed.replace(/^#+\s*/, '');
      renderedElements.push(
        <h4
          key={`h-${idx}`}
          className="font-cinzel text-xs font-bold text-[#f2ca50] tracking-wide mt-2.5 mb-1 flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
          <span>{renderInlineFormatted(hText, lineOffset + trimmed.length - hText.length)}</span>
        </h4>
      );
      return;
    }

    // Heading level 1 or 2: # or ##
    if (trimmed.startsWith('# ') || trimmed.startsWith('## ')) {
      flushList();
      const hText = trimmed.replace(/^#+\s*/, '');
      renderedElements.push(
        <h3
          key={`h-${idx}`}
          className="font-cinzel text-sm font-bold text-[#f2ca50] tracking-wide mt-3 mb-1.5 border-b border-[#d4af37]/20 pb-1"
        >
          {renderInlineFormatted(hText, lineOffset + trimmed.length - hText.length)}
        </h3>
      );
      return;
    }

    // Bullet points: - or *
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true;
      const itemText = trimmed.slice(2);
      currentListItems.push(
        <li key={`li-${idx}`} className="flex items-start gap-1.5 text-xs text-[#f1e8d8]/90">
          <span className="text-[#d4af37] text-[10px] mt-0.5 leading-none">✦</span>
          <span className="flex-1 leading-relaxed">
            {renderInlineFormatted(itemText, lineOffset + 2)}
          </span>
        </li>
      );
      return;
    }

    // Blockquote: >
    if (trimmed.startsWith('> ')) {
      flushList();
      const quoteText = trimmed.slice(2);
      renderedElements.push(
        <blockquote
          key={`quote-${idx}`}
          className="my-2 pl-3 py-1 border-l-2 border-[#d4af37] bg-[#1d122b]/60 rounded-r-lg text-xs italic text-[#e6d8c3]"
        >
          {renderInlineFormatted(quoteText, lineOffset + 2)}
        </blockquote>
      );
      return;
    }

    // Standard paragraph
    flushList();
    renderedElements.push(
      <p key={`p-${idx}`} className="my-1.5 text-xs leading-relaxed text-[#f1e8d8]/90">
        {renderInlineFormatted(trimmed, lineOffset)}
      </p>
    );
  });

  flushList();

  return <div className={`space-y-0.5 ${className}`}>{renderedElements}</div>;
};
