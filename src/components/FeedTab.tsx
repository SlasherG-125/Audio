import React, { useState } from 'react';
import { 
  Play, Sparkles, Heart, Compass, Download, Radio, 
  ChevronRight, Smartphone, Activity, Check, ChevronLeft, 
  PlaySquare, HardDrive, RefreshCw
} from 'lucide-react';
import { Track, YouTubeAccount } from '../types/music';
import { QUICK_TILES } from '../data/mockCatalog';

interface FeedTabProps {
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onOpenApkModal: () => void;
  onOpenSignalPath: () => void;
  onNavigateTab: (tab: 'feed' | 'search' | 'generator' | 'library' | 'apk') => void;
  onDownloadLocally: (track: Track) => Promise<void>;
  downloadingId: string | null;
  downloadProgress: number;
  activeAccount: YouTubeAccount;
  onOpenYouTubeSync: () => void;
}

export const FeedTab: React.FC<FeedTabProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onOpenApkModal,
  onOpenSignalPath,
  onNavigateTab,
  onDownloadLocally,
  downloadingId,
  downloadProgress,
  activeAccount,
  onOpenYouTubeSync,
}) => {
  const [heroIndex, setHeroIndex] = useState(0);
  const heroTrack = tracks[heroIndex] || tracks[0];

  const handleNextHero = () => {
    setHeroIndex((prev) => (prev + 1) % tracks.length);
  };

  const handlePrevHero = () => {
    setHeroIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const isHeroDownloading = downloadingId === heroTrack.id;

  return (
    <div className="space-y-12 animate-fadeIn pb-32">
      
      {/* YouTube Music Connected Account Status Bar */}
      <div className="tv-glass rounded-2xl px-5 py-3 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-red-500/50 shrink-0">
            <img src={activeAccount.avatarUrl} alt={activeAccount.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white truncate">
                YouTube Music: {activeAccount.name}
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                ({activeAccount.handle})
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 truncate">
              {activeAccount.likedSongsCount} liked tracks · Synced {activeAccount.syncedAt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onOpenYouTubeSync}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl tv-glass-pill text-xs font-semibold text-zinc-200 hover:text-white transition-colors"
          >
            <PlaySquare className="w-3.5 h-3.5 text-red-500" />
            <span>Switch / Sync Accounts</span>
          </button>
        </div>
      </div>

      {/* Apple TV Cinematic Hero Billboard */}
      <section className="relative w-full rounded-3xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.85)] border border-white/10 group min-h-[440px] sm:min-h-[520px] flex flex-col justify-end p-6 sm:p-12 transition-all duration-700">
        
        {/* Full-Bleed Panoramic Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 group-hover:scale-100"
          style={{ backgroundImage: `url(${heroTrack.coverUrl})` }}
        />

        {/* Apple TV Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050608] via-[#050608]/50 to-transparent" />
        <div 
          className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none blur-3xl"
          style={{
            background: `radial-gradient(circle at 20% 60%, ${heroTrack.accentColor} 0%, transparent 60%)`
          }}
        />

        {/* Billboard Hero Content */}
        <div className="relative z-10 max-w-2xl">
          
          {/* Subtle Apple TV Text Kicker */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-400 mb-2">
            <span className="text-[#FF2A4D] font-bold">Featured on Audio</span>
            <span aria-hidden="true">·</span>
            <span>{heroTrack.genre}</span>
            <span aria-hidden="true">·</span>
            <span>{heroTrack.sampleRate} {heroTrack.bitDepth}</span>
          </div>

          {/* Huge Cinematic Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-lg">
            {heroTrack.title}
          </h1>

          <p className="text-base sm:text-xl font-medium text-zinc-200 mt-2 drop-shadow">
            {heroTrack.artist}
          </p>

          <p className="text-xs sm:text-sm text-zinc-300 mt-3 max-w-xl line-clamp-2 leading-relaxed opacity-90">
            Streamed in uncompressed bit-perfect format with real-time millisecond-synchronized lyrics, Poweramp 5-stage DAC pipeline, and fluid motion artwork.
          </p>

          {/* Apple TV Hero Action Buttons with PROMINENT LOCAL DOWNLOAD */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => onPlayTrack(heroTrack)}
              className="flex items-center gap-2.5 px-7 py-3 rounded-2xl bg-white hover:bg-zinc-200 text-black font-extrabold text-sm shadow-[0_10px_30px_rgba(255,255,255,0.3)] transition-all transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>{isPlaying && currentTrack.id === heroTrack.id ? 'Now Playing' : 'Play'}</span>
            </button>

            {/* Prominent Local Download Button */}
            <button
              onClick={() => onDownloadLocally(heroTrack)}
              disabled={isHeroDownloading}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all active:scale-95 text-sm font-bold shadow-lg ${
                heroTrack.isDownloaded
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                  : 'bg-[#FF2A4D] hover:bg-[#E0203E] text-white shadow-[0_0_20px_rgba(255,42,77,0.35)]'
              }`}
            >
              {isHeroDownloading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving {downloadProgress}%...</span>
                </>
              ) : heroTrack.isDownloaded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span>Downloaded Locally (Storage)</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Download Locally (FLAC + .LRC)</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenSignalPath}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl tv-glass-pill text-white font-semibold text-sm hover:bg-white/20 transition-all active:scale-95"
            >
              <Activity className="w-4 h-4 text-[#FF2A4D]" />
              <span>Signal Path</span>
            </button>
          </div>

        </div>

        {/* Carousel Slide Switcher Arrows */}
        <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
          <button
            onClick={handlePrevHero}
            className="w-10 h-10 rounded-full tv-glass-pill flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all"
            aria-label="Previous Featured"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextHero}
            className="w-10 h-10 rounded-full tv-glass-pill flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all"
            aria-label="Next Featured"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Carousel Dot Indicators */}
        <div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-1.5 z-20">
          {tracks.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => setHeroIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === heroIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

      </section>

      {/* Rail 1: Up Next / Continue Listening (With Visible Local Download Buttons) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Up Next &amp; Context Radios
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Instant continuation with seamless crossfade &amp; 1-tap local saving
            </p>
          </div>
          <button 
            onClick={() => onNavigateTab('search')}
            className="text-xs font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
          >
            See All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Scrolling Shelf */}
        <div className="flex items-stretch gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x">
          {tracks.map((track) => {
            const isCurrent = track.id === currentTrack.id;
            const isItemDownloading = downloadingId === track.id;

            return (
              <div
                key={track.id}
                className="w-64 sm:w-72 shrink-0 snap-start group"
              >
                {/* 16:9 Landscape Card with Focus Lift */}
                <div 
                  onClick={() => onPlayTrack(track)}
                  className="relative aspect-video rounded-2xl overflow-hidden tv-card bg-zinc-900 border border-white/10 shadow-lg mb-2.5 cursor-pointer"
                >
                  <img 
                    src={track.coverUrl} 
                    alt={track.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Subtle Gradient Veil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Play Action Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-xl">
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    </div>
                  </div>

                  {/* Audio Resolution Tag */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-zinc-300">
                    <span className="font-bold text-white drop-shadow">
                      {track.bitrate}
                    </span>
                    <span className="text-[#FF2A4D] drop-shadow font-semibold">
                      {track.sampleRate}
                    </span>
                  </div>

                  {/* Active Equalizer animation when playing */}
                  {isCurrent && isPlaying && (
                    <div className="absolute top-2.5 right-2.5 flex items-end gap-0.5 h-3 bg-black/60 px-1.5 py-0.5 rounded-lg border border-white/10">
                      <span className="w-0.5 bg-[#FF2A4D] animate-eq-1" />
                      <span className="w-0.5 bg-[#FF2A4D] animate-eq-2" />
                      <span className="w-0.5 bg-[#FF2A4D] animate-eq-3" />
                    </div>
                  )}
                </div>

                {/* Card Title & Prominent Local Download Row */}
                <div className="px-1 flex items-start justify-between gap-2">
                  <div className="truncate">
                    <h3 
                      onClick={() => onPlayTrack(track)}
                      className={`text-sm font-bold truncate cursor-pointer transition-colors ${
                        isCurrent ? 'text-[#FF2A4D]' : 'text-white group-hover:text-white'
                      }`}
                    >
                      {track.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5 truncate">
                      <span>{track.artist}</span>
                      <span aria-hidden="true">·</span>
                      <span>{track.genre}</span>
                    </div>
                  </div>

                  {/* Visible Local Download Button */}
                  <button
                    onClick={() => onDownloadLocally(track)}
                    disabled={isItemDownloading}
                    title={track.isDownloaded ? 'Downloaded locally to Music/Audio' : 'Download locally (.flac & .lrc)'}
                    className={`p-2 rounded-xl shrink-0 transition-all ${
                      track.isDownloaded
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        : 'bg-white/10 hover:bg-white text-zinc-300 hover:text-black shadow'
                    }`}
                  >
                    {isItemDownloading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-[#FF2A4D]" />
                    ) : track.isDownloaded ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Rail 2: Quick Mixes & Shelves */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Featured Mixes &amp; Smart Channels
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Personalized algorithmic radars and offline vaults
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_TILES.map((tile) => (
            <div
              key={tile.id}
              onClick={() => {
                if (tile.id === 'offline') onNavigateTab('library');
                else if (tile.id === 'radar') onNavigateTab('generator');
                else onPlayTrack(tracks[Math.floor(Math.random() * tracks.length)]);
              }}
              className="relative aspect-[16/10] rounded-2xl overflow-hidden tv-card cursor-pointer border border-white/10 p-5 flex flex-col justify-between group shadow-xl"
              style={{
                backgroundImage: `url(${tile.heroBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 group-hover:via-black/50 transition-colors" />

              <div className="relative z-10 flex items-center justify-between">
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: `${tile.iconColor}35`, color: tile.iconColor }}
                >
                  {tile.id === 'liked' && <Heart className="w-5 h-5 fill-current" />}
                  {tile.id === 'mix' && <Sparkles className="w-5 h-5" />}
                  {tile.id === 'radar' && <Compass className="w-5 h-5" />}
                  {tile.id === 'offline' && <Download className="w-5 h-5" />}
                </div>
                <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-white text-white group-hover:text-black flex items-center justify-center transition-colors">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-base font-bold text-white group-hover:text-white transition-colors">
                  {tile.title}
                </h3>
                <p className="text-xs text-zinc-300 mt-0.5">
                  {tile.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rail 3: Square Album Art Grid With 1-Tap Download */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Lossless Master Collection
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              High-resolution FLAC streams ready for local storage
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tracks.map((track) => {
            const isCurrent = track.id === currentTrack.id;
            const isItemDownloading = downloadingId === track.id;

            return (
              <div
                key={track.id}
                className="group"
              >
                {/* 1:1 Square Poster */}
                <div 
                  onClick={() => onPlayTrack(track)}
                  className="relative aspect-square rounded-2xl overflow-hidden tv-card bg-zinc-900 border border-white/10 shadow-md mb-2 cursor-pointer"
                >
                  <img 
                    src={track.coverUrl} 
                    alt={track.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-black ml-0.5" />
                    </div>
                  </div>

                  {/* Corner Download Status Badge */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownloadLocally(track);
                      }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-colors ${
                        track.isDownloaded ? 'bg-emerald-500 text-black' : 'bg-black/60 text-white hover:bg-white hover:text-black'
                      }`}
                      title={track.isDownloaded ? 'Downloaded locally' : 'Download locally'}
                    >
                      {track.isDownloaded ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <h3 
                  onClick={() => onPlayTrack(track)}
                  className={`text-xs font-bold truncate transition-colors cursor-pointer ${
                    isCurrent ? 'text-[#FF2A4D]' : 'text-white'
                  }`}
                >
                  {track.title}
                </h3>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {track.artist}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Android APK Installation Spotlight */}
      <section className="relative overflow-hidden rounded-3xl tv-glass p-8 sm:p-10 border border-white/15 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-[#FF2A4D] p-3 flex items-center justify-center shadow-[0_0_30px_rgba(255,42,77,0.5)] shrink-0">
            <Smartphone className="w-9 h-9 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Install Audio on Android
              </h3>
              <span className="text-[11px] font-bold text-zinc-400">
                v4.3.1 Release
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl leading-relaxed">
              Experience the complete native Android client with Poweramp 5-stage audio signal path, USB DAC bit-perfect output, and background playback.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenApkModal}
          className="w-full md:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-zinc-200 text-black font-extrabold text-sm shadow-[0_10px_25px_rgba(255,255,255,0.25)] transition-all shrink-0 active:scale-95 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Download Universal APK (25MB)</span>
        </button>
      </section>

    </div>
  );
};
