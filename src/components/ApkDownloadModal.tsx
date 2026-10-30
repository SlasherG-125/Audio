import React, { useState } from 'react';
import { 
  X, Download, CheckCircle2, ShieldCheck, Smartphone, 
  ExternalLink, Copy, Check, Sparkles, AlertCircle, QrCode,
  Layers, RefreshCw, AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { APK_VARIANTS } from '../data/mockCatalog';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallPwa: () => void;
  isPwaInstallable: boolean;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({
  isOpen,
  onClose,
  onInstallPwa,
  isPwaInstallable,
}) => {
  const [copiedSha, setCopiedSha] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isBlobDownloading, setIsBlobDownloading] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<'apk' | 'pwa' | 'instructions'>('apk');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const directApkUrl = `${currentUrl}/downloads/Audio-v4.3.1-universal.apk`;

  const handleBlobDownload = async (apkUrl: string, name: string) => {
    setIsBlobDownloading(true);
    setDownloadStarted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF2A4D', '#ffffff', '#38bdf8', '#10b981'],
    });

    try {
      const response = await fetch(apkUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    } catch (err) {
      console.warn('Fallback opening in new window:', err);
      window.open(apkUrl, '_blank');
    } finally {
      setIsBlobDownloading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSha(text);
    setTimeout(() => setCopiedSha(null), 2500);
  };

  const copyDirectLink = () => {
    navigator.clipboard.writeText(directApkUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&bgcolor=050608&color=ffffff&margin=5&data=${encodeURIComponent(
    directApkUrl
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#050608] border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.8)] text-white p-5 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-[0_0_20px_rgba(255,42,77,0.4)] border border-white/20 overflow-hidden">
              <img src="/app-logo.png" alt="Audio" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Install Audio on Android
                </h2>
                <span className="bg-[#FF2A4D] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  v4.3.1
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400">
                Official native APK packages and 1-tap WebAPK installation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Device Alert Notice */}
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-white">Android Security Notice:</span> If Chrome or your phone displays &quot;File might be harmful&quot; or &quot;Can&apos;t download file&quot;, tap <strong>&quot;Download anyway&quot;</strong>, or use our <strong>&quot;Backup Stream&quot;</strong> button below.
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 mt-4 bg-zinc-900/60 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'apk'
                ? 'bg-[#FF2A4D] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            📦 Download Android APK
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'instructions'
                ? 'bg-[#FF2A4D] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            📋 Fix &quot;Can&apos;t Download&quot; Guide
          </button>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'pwa'
                ? 'bg-[#FF2A4D] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            ⚡ Instant WebAPK (Zero APK)
          </button>
        </div>

        {/* Tab 1: APK Packages */}
        {activeTab === 'apk' && (
          <div className="mt-5 space-y-4">
            
            {/* Primary Recommended Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2a0e14] to-[#140609] border-2 border-[#FF2A4D]/40 p-5 shadow-[0_0_30px_rgba(255,42,77,0.15)]">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-[#FF2A4D] text-white">
                      Recommended
                    </span>
                    <span className="text-xs text-zinc-400">Android 10 to 16+</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                    Audio-v4.3.1-universal.apk
                  </h3>
                  <p className="text-xs text-zinc-300 mt-1 max-w-lg leading-relaxed">
                    Official release build with 16KB page-aligned native DSP engine, Poweramp-style signal path, synced lyrics, and FLAC decoders.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-zinc-400">
                    <span className="font-semibold text-white">Size: 25.0 MB</span>
                    <span>•</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" /> Official Signed Release
                    </span>
                    <span>•</span>
                    <span className="text-zinc-400">SHA-256 Verified</span>
                  </div>
                </div>

                <div className="flex flex-col w-full sm:w-auto gap-2.5 shrink-0">
                  {/* Primary Direct APK Link (target=_self to prevent Chrome insecure-context block) */}
                  <a
                    href="/downloads/Audio-v4.3.1-universal.apk"
                    download="Audio-v4.3.1-universal.apk"
                    onClick={() => {
                      confetti({
                        particleCount: 80,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#FF2A4D', '#ffffff', '#38bdf8', '#10b981'],
                      });
                      setDownloadStarted(true);
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FF2A4D] hover:bg-[#e0203e] text-white font-extrabold text-sm shadow-[0_0_24px_rgba(255,42,77,0.4)] transition-all transform active:scale-95 text-center"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>Download APK (Direct)</span>
                  </a>

                  {/* Server Stream Mirror Route */}
                  <a
                    href="/api/download/apk?format=apk"
                    download="Audio-v4.3.1-universal.apk"
                    onClick={() => setDownloadStarted(true)}
                    className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-zinc-200 transition-colors text-center"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#FF2A4D]" />
                    <span>Server Mirror Stream</span>
                  </a>

                  {/* Unblocked ZIP Archive for Carrier / Google Files restrictions */}
                  <a
                    href="/downloads/Audio-v4.3.1-universal.apk.zip"
                    download="Audio-v4.3.1-universal.apk.zip"
                    onClick={() => {
                      confetti({
                        particleCount: 80,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#38bdf8', '#ffffff', '#10b981'],
                      });
                      setDownloadStarted(true);
                    }}
                    className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 text-xs font-bold text-sky-200 transition-colors text-center"
                    title="Bypasses mobile security and carrier filters that block raw .apk files"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    <span>Download as ZIP (Bypasses Blocks)</span>
                  </a>

                  <button
                    onClick={copyDirectLink}
                    className="text-[11px] text-center text-zinc-400 hover:text-white flex items-center justify-center gap-1 pt-0.5"
                  >
                    {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLink ? 'Direct Link Copied!' : 'Copy Direct Link'}</span>
                  </button>
                </div>
              </div>

              {/* SHA-256 Box */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400 bg-black/30 p-2.5 rounded-xl">
                <div className="truncate mr-2 font-mono">
                  <span className="text-zinc-500">SHA256: </span>
                  6209eb8e3631bfc9bef9ff478eb63082e309a62850e5475dd4f6c39912e5287c
                </div>
                <button
                  onClick={() => copyToClipboard('6209eb8e3631bfc9bef9ff478eb63082e309a62850e5475dd4f6c39912e5287c')}
                  className="flex items-center gap-1 text-xs text-[#FF2A4D] hover:underline font-medium shrink-0"
                >
                  {copiedSha ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSha ? 'Copied' : 'Copy Hash'}
                </button>
              </div>
            </div>

            {/* Other Variants */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {APK_VARIANTS.slice(1).map((variant) => (
                <div key={variant.name} className="p-4 rounded-2xl bg-zinc-900/50 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        {variant.tag}
                      </span>
                      <span className="text-xs text-zinc-400 font-medium">{variant.size}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1.5 truncate" title={variant.name}>
                      {variant.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      {variant.description}
                    </p>
                  </div>
                  <a
                    href={variant.downloadUrl}
                    download={variant.name}
                    className="mt-3 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download {variant.size}
                  </a>
                </div>
              ))}
            </div>

            {/* QR Code Section for Phone Scan */}
            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-white/5 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-28 h-28 rounded-xl bg-black p-2 border border-[#FF2A4D]/30 shadow-inner flex items-center justify-center shrink-0">
                <img 
                  src={qrCodeUrl} 
                  alt="Scan QR code with Android phone" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-[#FF2A4D]" />
                  <h4 className="text-sm font-bold text-white">
                    Scan with Android Camera to Download on Phone
                  </h4>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Point your phone camera or Google Lens at this code to trigger the APK download directly into your mobile browser.
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Works on Samsung Galaxy, Google Pixel, Xiaomi, OnePlus, Motorola, and Oppo.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Installation Step-by-Step Instructions & Fixes */}
        {activeTab === 'instructions' && (
          <div className="mt-5 space-y-4">
            
            <div className="p-4 rounded-2xl bg-[#FF2A4D]/10 border border-[#FF2A4D]/30 text-xs text-zinc-200">
              <h4 className="text-sm font-bold text-white mb-1">
                How to Fix &quot;Download blocked or file cannot be downloaded securely&quot;
              </h4>
              <p className="text-zinc-300 leading-relaxed">
                Modern Android and Google Chrome display this when downloading standalone applications outside Google Play. Follow these exact steps to download and install via Google Files or Chrome:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#FF2A4D] text-white font-extrabold flex items-center justify-center text-sm mb-2">
                  1
                </div>
                <h4 className="text-sm font-bold text-white">Chrome: Tap &quot;Download anyway&quot;</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  When Chrome prompts with <em>&quot;File might be harmful&quot;</em> or <em>&quot;Can&apos;t download securely&quot;</em>, tap <strong>Details &rarr; Download anyway</strong>. If Chrome blocked it, open <strong>Chrome menu (3 dots) &rarr; Downloads &rarr; tap the warning &rarr; Keep</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#FF2A4D] text-white font-extrabold flex items-center justify-center text-sm mb-2">
                  2
                </div>
                <h4 className="text-sm font-bold text-white">In Google Files: Open App Install Files</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Open your <strong>Google Files</strong> app &rarr; tap <strong>Browse</strong> at the bottom &rarr; tap <strong>Apps</strong> &rarr; select the <strong>App install files (.apk)</strong> tab &rarr; tap <code className="text-zinc-200">Audio-v4.3.1-universal.apk</code>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#FF2A4D] text-white font-extrabold flex items-center justify-center text-sm mb-2">
                  3
                </div>
                <h4 className="text-sm font-bold text-white">Enable Unknown Sources in Google Files</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  If Google Files says: <em>&quot;For your security, your phone is not allowed to install unknown apps from this source&quot;</em>, tap <strong>Settings</strong> and switch on <strong>&quot;Allow from this source&quot;</strong>, then return and tap <strong>Install</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#FF2A4D] text-white font-extrabold flex items-center justify-center text-sm mb-2">
                  4
                </div>
                <h4 className="text-sm font-bold text-white">Carrier Block Workaround: Use ZIP</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  If your mobile carrier or device blocks .apk downloads completely, tap <strong>&quot;Download as ZIP&quot;</strong> on the download tab. In Google Files, tap the downloaded zip &rarr; tap <strong>Extract</strong> &rarr; tap the extracted APK to install!
                </p>
              </div>

            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <div>
                <strong>Safe &amp; Verified Package:</strong> The APK package is 100% open-source, compiled with Android SDK 35 and 16KB page alignment. No telemetry or adware is included.
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Instant WebAPK / PWA */}
        {activeTab === 'pwa' && (
          <div className="mt-5 space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 text-center">
              <div className="w-16 h-16 rounded-3xl bg-[#FF2A4D] p-3 mx-auto flex items-center justify-center shadow-[0_0_24px_rgba(255,42,77,0.35)]">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mt-3">
                Zero-Download Android WebAPK
              </h3>
              <p className="text-xs text-zinc-300 mt-1.5 max-w-md mx-auto">
                Cannot download or install APK files due to phone restrictions? Install Audio instantly to your home screen with zero APK downloading or permissions needed!
              </p>

              <div className="mt-5 flex justify-center">
                <button
                  onClick={onInstallPwa}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF2A4D] hover:bg-[#E0203E] text-white font-extrabold text-sm shadow-[0_0_20px_rgba(255,42,77,0.35)] transition-all transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  Install Web App to Home Screen
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 text-left max-w-sm mx-auto text-xs text-zinc-400 space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Fullscreen standalone app without browser URL bar
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Offline cache &amp; background audio playback
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Works on any Android phone (Chrome, Samsung Internet, Edge)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Audio v4.3.1 (Latest Stable)</span>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/Clash-Projects/Audio-Native" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1"
            >
              GitHub Repo <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a 
              href="https://t.me/clashprojects" 
              target="_blank" 
              rel="noreferrer"
              className="text-[#38bdf8] hover:underline flex items-center gap-1"
            >
              Telegram Community
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
