import React from 'react';
import { Download, Activity, Sliders, Smartphone, PlaySquare } from 'lucide-react';
import { ActiveTab, YouTubeAccount } from '../types/music';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSignalPath: () => void;
  onOpenEq: () => void;
  onOpenApkModal: () => void;
  onOpenYouTubeSync: () => void;
  activeAccount: YouTubeAccount;
  isInstallable: boolean;
  onInstallPwa: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSignalPath,
  onOpenEq,
  onOpenApkModal,
  onOpenYouTubeSync,
  activeAccount,
  isInstallable,
  onInstallPwa,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 tv-glass px-4 sm:px-6 py-2.5 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
        
        {/* Apple TV Brand Header */}
        <div 
          onClick={() => setActiveTab('feed')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-2xl overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(255,42,77,0.4)] border border-white/20 group-hover:scale-105 transition-transform duration-300 bg-white">
            <img 
              src="/app-logo.png" 
              alt="Audio Logo" 
              className="w-full h-full object-contain p-0.5"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-white group-hover:text-[#FF2A4D] transition-colors">
                Audio
              </span>
              <span className="text-[10px] font-semibold text-zinc-400">
                tvOS
              </span>
            </div>
          </div>
        </div>

        {/* Apple TV Center Segmented Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/10 shadow-inner">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'feed'
                ? 'bg-white text-black shadow-lg font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Listen Now
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'search'
                ? 'bg-white text-black shadow-lg font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Browse &amp; Search
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'generator'
                ? 'bg-white text-black shadow-lg font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Radio &amp; Mixes
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'library'
                ? 'bg-white text-black shadow-lg font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Library
          </button>

          <button
            onClick={() => setActiveTab('apk')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all relative ${
              activeTab === 'apk'
                ? 'bg-white text-black shadow-lg font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Install APK
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A4D] absolute top-1 right-1" />
          </button>
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">
          
          {/* YouTube Music Connected Account Switcher Button */}
          <button
            onClick={onOpenYouTubeSync}
            title={`Connected YouTube Music: ${activeAccount.name} (${activeAccount.handle})`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl tv-glass-pill text-xs font-medium text-zinc-200 hover:text-white transition-all group border border-red-500/30"
          >
            <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 border border-red-500/50">
              <img 
                src={activeAccount.avatarUrl} 
                alt={activeAccount.name} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <span className="hidden sm:inline font-bold truncate max-w-[85px]">
              {activeAccount.name.split(' ')[0]}
            </span>
            <PlaySquare className="w-3 h-3 text-[#FF2A4D] shrink-0" />
          </button>

          {/* Signal Path */}
          <button
            onClick={onOpenSignalPath}
            title="Signal Path (Poweramp 5-stage)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl tv-glass-pill text-xs font-medium text-zinc-300 hover:text-white transition-all"
          >
            <Activity className="w-3.5 h-3.5 text-[#FF2A4D]" />
            <span className="hidden sm:inline">Signal Path</span>
          </button>

          {/* Equalizer & Crossfade */}
          <button
            onClick={onOpenEq}
            title="Equalizer & Crossfade"
            className="p-2 rounded-2xl tv-glass-pill text-zinc-300 hover:text-white transition-all"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {/* WebApp Install */}
          {isInstallable && (
            <button
              onClick={onInstallPwa}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl tv-glass-pill text-xs font-medium text-zinc-300 hover:text-white transition-all"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#FF2A4D]" />
              <span>Install WebApp</span>
            </button>
          )}

          {/* Primary Action Button */}
          <button
            onClick={onOpenApkModal}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-2xl bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-[0_4px_20px_rgba(255,255,255,0.25)] transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Download APK</span>
          </button>

        </div>

      </div>
    </header>
  );
};
