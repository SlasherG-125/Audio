import React, { useState } from 'react';
import { 
  Download, ShieldCheck, Smartphone, Copy, ExternalLink, 
  HelpCircle, QrCode, AlertTriangle, Check, Layers, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { APK_VARIANTS } from '../data/mockCatalog';

interface ApkTabProps {
  onInstallPwa: () => void;
  isPwaInstallable: boolean;
}

export const ApkTab: React.FC<ApkTabProps> = ({
  onInstallPwa,
  isPwaInstallable,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isBlobDownloading, setIsBlobDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const directApkUrl = `${currentOrigin}/downloads/Audio-v4.3.1-universal.apk`;

  const handleStandardDownload = (url: string, filename: string) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffffff', '#FF2A4D', '#38bdf8'],
    });

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 5000);
  };

  const handleBlobDownload = async (url: string, filename: string) => {
    setIsBlobDownloading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      console.warn('Blob download fallback to direct window open:', err);
      window.open(url, '_blank');
    } finally {
      setIsBlobDownloading(false);
    }
  };

  const copyDirectLink = () => {
    navigator.clipboard.writeText(directApkUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&bgcolor=050608&color=ffffff&margin=6&data=${encodeURIComponent(
    directApkUrl
  )}`;

  return (
    <div className="space-y-8 animate-fadeIn pb-32">
      
      {/* Alert Card if device encountered download issue */}
      <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">
              Device says &quot;Can&apos;t download file&quot; or &quot;File might be harmful&quot;?
            </h3>
            <p className="text-xs text-amber-200/90 mt-1 leading-relaxed max-w-2xl">
              This is normal for Android security when downloading files outside the Play Store. Android Chrome simply requires you to tap <strong>&quot;Download anyway&quot;</strong>, or you can use our <strong>Alternative Blob Download</strong> or <strong>1-Tap Instant WebAPK</strong> below.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => handleBlobDownload('/downloads/Audio-v4.3.1-universal.apk', 'Audio-v4.3.1-universal.apk')}
            disabled={isBlobDownloading}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            {isBlobDownloading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Layers className="w-3.5 h-3.5" />}
            <span>Try Alternative Download</span>
          </button>
          <button
            onClick={onInstallPwa}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#FF2A4D]" />
            <span>Install WebAPK (No APK needed)</span>
          </button>
        </div>
      </div>

      {/* Apple TV Installation Billboard Hero */}
      <div className="relative overflow-hidden rounded-3xl tv-glass border border-white/15 p-8 sm:p-12 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#FF2A4D] uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Release v4.3.1 · Verified Android Package Archive</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Get Audio on Android
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 mt-2.5 leading-relaxed">
              Native Android build with Poweramp-grade 32-bit floating point DSP audio engine, bit-perfect output, and continuous background audio service.
            </p>

            {downloadSuccess && (
              <div className="mt-4 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-medium flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Download started! Check your phone&apos;s notification drawer or Downloads folder.</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 mt-8">
              {/* Primary Direct Download */}
              <a
                href="/downloads/Audio-v4.3.1-universal.apk"
                download="Audio-v4.3.1-universal.apk"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  confetti({
                    particleCount: 80,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#ffffff', '#FF2A4D', '#38bdf8'],
                  });
                  setDownloadSuccess(true);
                  setTimeout(() => setDownloadSuccess(false), 5000);
                }}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white hover:bg-zinc-200 text-black font-extrabold text-sm shadow-[0_10px_30px_rgba(255,255,255,0.3)] transition-all transform active:scale-95"
              >
                <Download className="w-5 h-5 stroke-[2.5]" />
                <span>Download Universal APK (25.0 MB)</span>
              </a>

              {/* In-Memory Blob Stream */}
              <button
                onClick={() => handleBlobDownload('/downloads/Audio-v4.3.1-universal.apk', 'Audio-v4.3.1-universal.apk')}
                disabled={isBlobDownloading}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl tv-glass-pill text-white font-semibold text-sm hover:bg-white/20 transition-all active:scale-95"
              >
                {isBlobDownloading ? <RefreshCw className="w-4 h-4 animate-spin text-[#FF2A4D]" /> : <Layers className="w-4 h-4 text-[#FF2A4D]" />}
                <span>{isBlobDownloading ? 'Downloading Stream...' : 'Backup Direct Stream'}</span>
              </button>

              {/* WebAPK option */}
              <button
                onClick={onInstallPwa}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl tv-glass-pill text-zinc-300 font-semibold text-sm hover:bg-white/20 transition-all active:scale-95"
              >
                <Smartphone className="w-4 h-4 text-[#38bdf8]" />
                <span>Install Instant WebAPK</span>
              </button>
            </div>

            {/* Copy Link helper */}
            <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
              <span>Need to download in phone browser?</span>
              <button
                onClick={copyDirectLink}
                className="text-[#FF2A4D] hover:underline flex items-center gap-1 font-semibold"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link copied! Paste in Chrome' : 'Copy direct download link'}</span>
              </button>
            </div>
          </div>

          {/* QR Code Card for Phone Scanning */}
          <div className="tv-glass p-5 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center text-center shrink-0 w-full sm:w-auto">
            <div className="w-44 h-44 rounded-2xl overflow-hidden bg-black p-2 border border-white/10 mb-3">
              <img 
                src={qrCodeUrl} 
                alt="Scan to download APK on Android" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <QrCode className="w-3.5 h-3.5 text-[#FF2A4D]" />
              <span>Scan with Android Camera</span>
            </div>
            <span className="text-[11px] text-zinc-400 mt-0.5">
              Opens directly in mobile Chrome
            </span>
          </div>
        </div>
      </div>

      {/* Troubleshooting Guide: When Android blocks or shows warning */}
      <div className="p-6 sm:p-8 rounded-3xl tv-glass border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-white">
          <HelpCircle className="w-5 h-5 text-[#FF2A4D]" />
          <h2 className="text-xl font-bold">
            How to Solve &quot;Cannot Be Downloaded&quot; on Android Devices
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          Follow these 3 quick fixes if your Android device restricts direct APK downloads:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="w-7 h-7 rounded-full bg-[#FF2A4D] text-white font-extrabold flex items-center justify-center text-xs">
              A
            </div>
            <h4 className="text-sm font-bold text-white">Chrome: &quot;File might be harmful&quot;</h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Android Chrome displays this for every APK outside the Play Store.
            </p>
            <div className="text-[11px] text-zinc-400 bg-black/40 p-2.5 rounded-xl border border-white/5">
              &rarr; Tap <strong>Download anyway</strong>.<br />
              &rarr; If it was blocked, tap <strong>Chrome menu (3 dots) &rarr; Downloads &rarr; tap file &rarr; Keep</strong>.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="w-7 h-7 rounded-full bg-[#FF2A4D] text-white font-extrabold flex items-center justify-center text-xs">
              B
            </div>
            <h4 className="text-sm font-bold text-white">Enable &quot;Install Unknown Apps&quot;</h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Android restricts newly downloaded files until you approve the browser or Files app.
            </p>
            <div className="text-[11px] text-zinc-400 bg-black/40 p-2.5 rounded-xl border border-white/5">
              &rarr; Open <strong>Android Settings &rarr; Apps &rarr; Chrome</strong> (or Files).<br />
              &rarr; Tap <strong>Install unknown apps</strong> &rarr; switch toggle to <strong>Allow</strong>.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="w-7 h-7 rounded-full bg-[#38bdf8] text-black font-extrabold flex items-center justify-center text-xs">
              C
            </div>
            <h4 className="text-sm font-bold text-white">Zero-Download WebAPK (1-Tap)</h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Bypass all APK sideloading barriers completely by installing as a native progressive web app.
            </p>
            <div className="text-[11px] text-zinc-400 bg-black/40 p-2.5 rounded-xl border border-white/5">
              &rarr; In Chrome or Samsung Internet, tap <strong>(3 dots) &rarr; Install app</strong> / <strong>Add to Home screen</strong>.<br />
              &rarr; Instant native home screen icon with full offline player!
            </div>
          </div>

        </div>
      </div>

      {/* APK Variants Rail */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Available Architecture Builds
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Target API 35 (Android 15 Ready)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {APK_VARIANTS.map((variant) => (
            <div 
              key={variant.name}
              className={`p-6 rounded-3xl tv-glass tv-card border flex flex-col justify-between transition-all ${
                variant.tag === 'Recommended'
                  ? 'border-white/30 shadow-2xl'
                  : 'border-white/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    variant.tag === 'Recommended' ? 'bg-white text-black' : 'bg-white/10 text-zinc-300'
                  }`}>
                    {variant.tag}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono font-bold">{variant.size}</span>
                </div>

                <h3 className="text-base font-bold text-white mt-3 truncate" title={variant.name}>
                  {variant.name}
                </h3>

                <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
                  {variant.description}
                </p>

                <div className="mt-4 text-[11px] font-mono text-zinc-400 space-y-1">
                  <div>Min Version: <span className="text-white">{variant.minAndroid}</span></div>
                  <div className="truncate">
                    Hash: <span className="text-zinc-500">{variant.sha256.slice(0, 16)}...</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-white/5 flex flex-col gap-2">
                <a
                  href={variant.downloadUrl}
                  download={variant.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all ${
                    variant.tag === 'Recommended'
                      ? 'bg-white hover:bg-zinc-200 text-black shadow-md'
                      : 'tv-glass-pill text-white'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>Download ({variant.size})</span>
                </a>

                <a
                  href={variant.directGithubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-zinc-400 hover:text-white flex items-center justify-center gap-1 py-1"
                >
                  <span>GitHub Mirror Release</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Sideloading Walkthrough */}
      <div className="p-8 sm:p-10 rounded-3xl tv-glass border border-white/10 space-y-5">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#FF2A4D]" />
          <h2 className="text-xl font-bold text-white">
            Android Sideloading Walkthrough
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="w-7 h-7 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-xs">
              1
            </div>
            <h4 className="text-xs font-bold text-white">Download APK</h4>
            <p className="text-xs text-zinc-400">
              Tap <strong>Download Universal APK</strong>. Tap <strong>Download anyway</strong> if Chrome prompts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="w-7 h-7 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-xs">
              2
            </div>
            <h4 className="text-xs font-bold text-white">Open Downloads</h4>
            <p className="text-xs text-zinc-400">
              When download completes, tap the notification in your status bar or open your <strong>Files</strong> app.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="w-7 h-7 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-xs">
              3
            </div>
            <h4 className="text-xs font-bold text-white">Allow Unknown Source</h4>
            <p className="text-xs text-zinc-400">
              If prompted, tap <strong>Settings</strong> and toggle on <strong>Allow from this source</strong>.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="w-7 h-7 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-xs">
              4
            </div>
            <h4 className="text-xs font-bold text-white">Tap Install &amp; Open</h4>
            <p className="text-xs text-zinc-400">
              Tap <strong>Install</strong>, then <strong>Open</strong> to launch Audio with lossless streaming!
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
