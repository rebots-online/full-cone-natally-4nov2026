import React, { useState } from 'react';
import { Download, Share2, X, Check, Copy, FileText, Image, FileImage, Sparkles, BookOpen } from 'lucide-react';
import { usePurchaseAccess } from './PurchaseAccess';
import { chartFocusKey } from '../services/chartTargets';
import { NatalChartResult } from '../services/ephemeris';
import { generateComprehensiveNatalReading } from '../services/comprehensiveReading';
import { createSouvenir, souvenirUrl } from '../services/souvenir';
import { downloadSouvenirPdf } from '../services/souvenirPdf';

interface ExportModalProps {
  chart: NatalChartResult;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ chart, onClose }) => {
  const {requestDownload}=usePurchaseAccess();
  const [version, setVersion] = useState<'short' | 'thorough' | 'exhaustive'>('exhaustive');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [exportError, setExportError] = useState('');
  const [savedSouvenirUrl, setSavedSouvenirUrl] = useState('');

  const shareUrl = `https://natally.robin.mba/?chart=${encodeURIComponent(chart.input.name)}`;
  const shareText = `Explore ${chart.input.name}'s Natal Astrolabe 3D chart: ${chart.sunFormatted} · ${chart.ascFormatted} · ${chart.moonFormatted} | Cast on Swiss Ephemeris engine at https://natally.robin.mba/`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const reading = generateComprehensiveNatalReading(chart);
    const blob = new Blob([reading.fullMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chart.input.name.replace(/\s+/g, '_')}_comprehensive_natal_reading.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPNG = async () => {
    setIsExporting(true);
    try {
      const canvasEl = document.querySelector('canvas') as HTMLCanvasElement;
      if (canvasEl) {
        const link = document.createElement('a');
        link.download = `${chart.input.name.replace(/\s+/g, '_')}_natal_astrolabe.png`;
        link.href = canvasEl.toDataURL('image/png');
        link.click();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJPG = async () => {
    setIsExporting(true);
    try {
      const canvasEl = document.querySelector('canvas') as HTMLCanvasElement;
      if (canvasEl) {
        const link = document.createElement('a');
        link.download = `${chart.input.name.replace(/\s+/g, '_')}_natal_astrolabe.jpg`;
        link.href = canvasEl.toDataURL('image/jpeg', 0.95);
        link.click();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportError('');
    setSavedSouvenirUrl('');
    try {
      const snapshot = await createSouvenir(chart);
      await downloadSouvenirPdf(snapshot);
      setSavedSouvenirUrl(souvenirUrl(snapshot.id));
    } catch (e) {
      setExportError(e instanceof Error ? e.message : 'Your souvenir could not be saved. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleNativeShare = async (platform?: string) => {
    if (navigator.share && !platform) {
      try {
        await navigator.share({
          title: `Natal Astrolabe 3D: ${chart.input.name}`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or fallback
      }
    }

    // Direct social web intents
    let target = '';
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    switch (platform) {
      case 'whatsapp':
        target = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'facebook':
        target = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'email':
        target = `mailto:?subject=${encodeURIComponent(`Natal Chart: ${chart.input.name}`)}&body=${encodedText}`;
        break;
      case 'mms':
        target = `sms:?&body=${encodedText}`;
        break;
      default:
        handleCopyLink();
        return;
    }

    window.open(target, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="celestial-panel w-full max-w-lg rounded-2xl p-5 border border-[#d4af37]/40 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#322641] pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#d4af37]" />
            <h3 className="font-cinzel text-sm text-[#f2ca50] font-bold tracking-wider uppercase">
              Export Comprehensive Reading &amp; Chart
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-[#271c36] text-[#a99dae] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reading Scope Selector */}
        <div className="space-y-1.5">
          <label className="block font-mono text-xs text-[#a99dae]">Report Depth:</label>
          <div className="grid grid-cols-3 gap-2">
            {(['short', 'thorough', 'exhaustive'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVersion(v)}
                className={`py-2 px-3 rounded-xl border text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  version === v
                    ? 'bg-[#3b2752] border-[#f2ca50] text-[#f2ca50] shadow-sm font-bold'
                    : 'bg-[#1a1224] border-[#322641] text-[#a99dae] hover:border-[#d4af37]/40 hover:text-white'
                }`}
              >
                {v === 'exhaustive' ? 'Exhaustive (5-Page)' : v}
              </button>
            ))}
          </div>
          <p className="text-[11px] font-mono text-[#d4af37]/80">
            {version === 'exhaustive'
              ? '✨ Full 5-Page Deluxe Edition with all in-depth chapters, archetypal analysis, aspect synthesis, and Natally’s personal oracle transmission!'
              : version === 'thorough'
              ? 'Multi-page comprehensive reading with planetary breakdown and key aspects.'
              : 'Concise summary report with astrolabe chart and core planetary coordinates.'}
          </p>
        </div>

        {/* Download Actions */}
        <div className="space-y-2">
          <label className="block font-mono text-xs text-[#a99dae]">Export Documents &amp; Images — purchase required for downloads:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => void requestDownload({format:"pdf",resourceId:chartFocusKey(chart)},handleExportPDF)}
              disabled={isExporting}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#f2a38c] text-[#120c1c] font-cinzel font-bold text-xs tracking-wider uppercase transition-all hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              <span>{isExporting ? 'Generating PDF...' : 'Full Deluxe PDF'}</span>
            </button>

            <button
              type="button"
              onClick={() => void requestDownload({format:"markdown",resourceId:chartFocusKey(chart)},handleDownloadMarkdown)}
              className="py-2.5 px-3 rounded-xl bg-[#241738] hover:bg-[#342452] border border-[#d4af37]/50 text-[#f2ca50] font-mono text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              title="Download entire in-depth psychic reading as Markdown document"
            >
              <BookOpen className="w-4 h-4" />
              <span>Download (.md)</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => void requestDownload({format:"png",resourceId:chartFocusKey(chart)},handleExportPNG)}
              disabled={isExporting}
              className="py-2 px-3 rounded-xl bg-[#1c1428] hover:bg-[#271c36] border border-white/10 text-white/90 font-mono text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Image className="w-3.5 h-3.5 text-[#9fb4ff]" />
              <span>3D Wheel (PNG)</span>
            </button>

            <button
              type="button"
              onClick={() => void requestDownload({format:"jpg",resourceId:chartFocusKey(chart)},handleExportJPG)}
              disabled={isExporting}
              className="py-2 px-3 rounded-xl bg-[#1c1428] hover:bg-[#271c36] border border-white/10 text-white/90 font-mono text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FileImage className="w-3.5 h-3.5 text-[#f2a38c]" />
              <span>3D Wheel (JPG)</span>
            </button>
          </div>
        </div>

        {exportError && <p role="alert" className="text-xs font-mono text-red-300">{exportError}</p>}
        {savedSouvenirUrl && <a href={savedSouvenirUrl} target="_blank" rel="noreferrer" className="text-xs font-mono text-[#f2ca50] underline">Open my interactive encyclopedia</a>}

        {/* Share Section */}
        <div className="pt-2 border-t border-[#322641] space-y-2">
          <label className="block font-mono text-xs text-[#a99dae]">Direct Share &amp; Copy:</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleNativeShare()}
              className="py-2 px-2.5 rounded-xl bg-[#231538] hover:bg-[#321e50] border border-[#d4af37]/30 text-white/90 font-mono text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3 h-3 text-[#f2ca50]" />
              <span>Native</span>
            </button>

            <button
              type="button"
              onClick={() => handleNativeShare('whatsapp')}
              className="py-2 px-2.5 rounded-xl bg-[#231538] hover:bg-[#321e50] border border-[#d4af37]/30 text-white/90 font-mono text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="text-emerald-400 font-bold">WA</span>
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="py-2 px-2.5 rounded-xl bg-[#231538] hover:bg-[#321e50] border border-[#d4af37]/30 text-white/90 font-mono text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#f2ca50]" />}
              <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyText}
              className="py-2 px-2.5 rounded-xl bg-[#231538] hover:bg-[#321e50] border border-[#d4af37]/30 text-white/90 font-mono text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedText ? <Check className="w-3 h-3 text-emerald-400" /> : <FileText className="w-3 h-3 text-[#f2ca50]" />}
              <span>{copiedText ? 'Copied!' : 'Copy Summary'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

