import React, { useState } from 'react';
import { 
  Download, ShieldCheck, Smartphone, Check, Copy, ExternalLink, 
  CheckCircle2, AlertCircle, QrCode, HelpCircle
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
  const [copiedSha, setCopiedSha] = useState<string | null>(null);

  const handleDownload = (apkUrl: string, name: string) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffffff', '#FF2A4D', '#38bdf8'],
    });

    const link = document.createElement('a');
    link.href = apkUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSha(text);
    setTimeout(() => setCopiedSha(null), 2500);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&bgcolor=050608&color=ffffff&margin=6&data=${encodeURIComponent(
    `${currentUrl}/downloads/Audio-v4.3.1-universal.apk`
  )}`;

  return (
    <div className="space-y-8 animate-fadeIn pb-32">
      
      {/* Apple TV Installation Billboard Hero */}
      <div className="relative overflow-hidden rounded-3xl tv-glass border border-white/15 p-8 sm:p-12 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#FF2A4D] uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Release v4.3.1 · Verified Android Build</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Get Audio on Android
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 mt-2.5 leading-relaxed">
              Install the complete native Android client with Poweramp 5-stage audio signal path, USB DAC bit-perfect output, and background playback.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-8">
              <button
                onClick={() => handleDownload('/downloads/Audio-v4.3.1-universal.apk', 'Audio-v4.3.1-universal.apk')}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white hover:bg-zinc-200 text-black font-extrabold text-sm shadow-[0_10px_30px_rgba(255,255,255,0.3)] transition-all transform active:scale-95"
              >
                <Download className="w-5 h-5 stroke-[2.5]" />
                <span>Download Universal APK (25.0 MB)</span>
              </button>

              <button
                onClick={onInstallPwa}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl tv-glass-pill text-white font-semibold text-sm hover:bg-white/20 transition-all active:scale-95"
              >
                <Smartphone className="w-4 h-4 text-[#FF2A4D]" />
                <span>Install Instant WebAPK</span>
              </button>
            </div>
          </div>

          {/* QR Code Card for Phone Scanning */}
          <div className="tv-glass p-5 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center text-center shrink-0 w-full sm:w-auto">
            <div className="w-40 h-40 rounded-2xl overflow-hidden bg-black p-2 border border-white/10 mb-3">
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
              Instant mobile APK download
            </span>
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
                <button
                  onClick={() => handleDownload(variant.downloadUrl, variant.name)}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all ${
                    variant.tag === 'Recommended'
                      ? 'bg-white hover:bg-zinc-200 text-black shadow-md'
                      : 'tv-glass-pill text-white'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>Download ({variant.size})</span>
                </button>

                <a
                  href={variant.directGithubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-zinc-400 hover:text-white flex items-center justify-center gap-1 py-1"
                >
                  <span>GitHub Release</span>
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
              Tap <strong>Download Universal APK</strong> to save the <code className="text-zinc-200">.apk</code> file to your device.
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
