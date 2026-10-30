import React, { useState } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Maximize2, Mic2, Activity, ArrowRightLeft,
  Volume2, VolumeX, PictureInPicture2, ChevronDown, Sparkles
} from 'lucide-react';
import { Track } from '../types/music';

export interface NowPlayingBarProps {
  track: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  activeLyricText: string;
  isCrossfading?: boolean;
  volume: number;
  isMuted: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (seconds: number) => void;
  onSetVolume: (vol: number) => void;
  onToggleMute: () => void;
  onOpenPlayerModal: () => void;
  onOpenSignalPath: () => void;
  miniPlayerMode: 'docked' | 'floating';
  onToggleMiniPlayerMode: (mode: 'docked' | 'floating') => void;
}

export const NowPlayingBar: React.FC<NowPlayingBarProps> = ({
  track,
  isPlaying,
  currentTime,
  duration,
  activeLyricText,
  isCrossfading = false,
  volume,
  isMuted,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onSetVolume,
  onToggleMute,
  onOpenPlayerModal,
  onOpenSignalPath,
  miniPlayerMode,
  onToggleMiniPlayerMode,
}) => {
  const [showVolumePopup, setShowVolumePopup] = useState(false);

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    onSeek(Math.max(0, Math.min(duration, pos * duration)));
  };

  /* =========================================================================
     MODE 1: FLOATING PICTURE-IN-PICTURE (PiP) MINI-PLAYER CARD
     ========================================================================= */
  if (miniPlayerMode === 'floating') {
    return (
      <div className="fixed bottom-6 right-4 sm:right-8 z-40 w-[92vw] max-w-[340px] animate-fadeIn pointer-events-auto">
        <div className="relative tv-glass rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.95)] border border-white/20 p-4 overflow-hidden backdrop-blur-3xl group">
          
          {/* Ambient Red Glow Backdrop */}
          <div 
            className="absolute -top-10 -right-10 w-44 h-44 rounded-full opacity-35 blur-3xl pointer-events-none"
            style={{ backgroundColor: '#FF2A4D' }}
          />

          {/* Mini-Player Top Title Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF2A4D] animate-ping" />
              <span className="font-bold text-white tracking-tight">Audio Mini-Player</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onToggleMiniPlayerMode('docked')}
                title="Dock to bottom bar"
                className="p-1.5 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenPlayerModal}
                title="Expand to Full Player"
                className="p-1.5 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Track Presentation */}
          <div className="pt-3.5 flex items-center gap-3.5">
            <div 
              onClick={onOpenPlayerModal}
              className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-white/15 cursor-pointer group/art"
            >
              <img 
                src={track.coverUrl} 
                alt={track.title} 
                className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-105' : 'scale-100'}`}
              />
              <div className="absolute inset-0 bg-black/20 group-hover/art:bg-transparent transition-colors" />
              {isPlaying && (
                <div className="absolute bottom-1 right-1 flex items-end gap-0.5 h-3 bg-black/80 px-1 py-0.5 rounded-md">
                  <span className="w-0.5 bg-[#FF2A4D] animate-eq-1" />
                  <span className="w-0.5 bg-[#FF2A4D] animate-eq-2" />
                  <span className="w-0.5 bg-[#FF2A4D] animate-eq-3" />
                </div>
              )}
            </div>

            <div className="flex-1 truncate">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#FF2A4D]/20 text-[#FF2A4D] font-bold">
                  {track.bitDepth}
                </span>
                {isCrossfading && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#FF2A4D] text-white font-bold animate-pulse flex items-center gap-0.5">
                    <ArrowRightLeft className="w-2.5 h-2.5" /> FADE
                  </span>
                )}
              </div>
              <h4 
                onClick={onOpenPlayerModal}
                className="text-sm font-bold text-white hover:text-[#FF2A4D] transition-colors truncate cursor-pointer mt-0.5"
              >
                {track.title}
              </h4>
              <p className="text-xs text-zinc-400 truncate">
                {track.artist}
              </p>
            </div>
          </div>

          {/* Synced Lyrics Snippet */}
          {activeLyricText && (
            <div 
              onClick={onOpenPlayerModal}
              className="mt-3 px-3 py-2 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FF2A4D]/40 cursor-pointer transition-all flex items-center gap-2 group/lyric"
            >
              <Mic2 className="w-3.5 h-3.5 text-[#FF2A4D] shrink-0 animate-pulse" />
              <p className="text-xs font-semibold text-zinc-200 group-hover/lyric:text-white truncate">
                &quot;{activeLyricText}&quot;
              </p>
            </div>
          )}

          {/* Scrubber Slider */}
          <div className="mt-3.5 space-y-1">
            <div 
              onClick={handleScrubberClick}
              className="relative w-full h-2 rounded-full bg-white/15 cursor-pointer py-1 group/scrub"
            >
              <div 
                className="absolute top-1/2 -translate-y-1/2 left-0 h-1.5 rounded-full bg-gradient-to-r from-[#FF2A4D] to-rose-400 shadow-[0_0_8px_#FF2A4D]"
                style={{ width: `${progressPercent}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md -translate-x-1/2 scale-0 group-hover/scrub:scale-100 transition-transform"
                style={{ left: `${progressPercent}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Transport Controls */}
          <div className="flex items-center justify-between pt-2">
            
            {/* Volume control */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onToggleMute}
                className="p-2 rounded-xl tv-glass-pill text-zinc-300 hover:text-white transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => onSetVolume(parseFloat(e.target.value))}
                className="w-16 h-1 accent-[#FF2A4D] bg-zinc-800 rounded-full cursor-pointer appearance-none"
                title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
              />
            </div>

            {/* Playback Transport Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onPrev}
                className="p-2 rounded-xl tv-glass-pill text-zinc-300 hover:text-white transition-colors active:scale-95"
                title="Previous track"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={onTogglePlay}
                className="w-10 h-10 rounded-full bg-white hover:bg-zinc-200 text-black flex items-center justify-center shadow-[0_4px_16px_rgba(255,42,77,0.3)] active:scale-95 transition-all"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-black" />
                ) : (
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                )}
              </button>

              <button
                onClick={onNext}
                className="p-2 rounded-xl tv-glass-pill text-zinc-300 hover:text-white transition-colors active:scale-95"
                title="Next track"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  /* =========================================================================
     MODE 2: DOCKED BOTTOM BAR MINI-PLAYER (DEFAULT TV SHELF BAR)
     ========================================================================= */
  return (
    <div className="fixed bottom-4 sm:bottom-6 left-0 right-0 z-30 px-3 sm:px-8 pointer-events-none transition-all">
      <div className="max-w-4xl mx-auto tv-glass rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] border border-white/15 p-2.5 sm:p-3 pointer-events-auto relative overflow-hidden backdrop-blur-3xl">
        
        {/* Interactive Scrub Progress Bar Across Top */}
        <div 
          onClick={handleScrubberClick}
          className="absolute top-0 left-0 right-0 h-1.5 bg-white/10 cursor-pointer group"
        >
          <div 
            className="h-full bg-gradient-to-r from-[#FF2A4D] to-rose-400 shadow-[0_0_8px_#FF2A4D] transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          
          {/* Left: Track Info & Synced Lyrics Ticker */}
          <div 
            onClick={onOpenPlayerModal}
            className="flex items-center gap-3.5 cursor-pointer group truncate max-w-[50%] sm:max-w-md"
          >
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 shadow-md border border-white/10 group-hover:scale-105 transition-transform duration-300">
              <img 
                src={track.coverUrl} 
                alt={track.title} 
                className="w-full h-full object-cover"
              />
              {isPlaying && (
                <div className="absolute bottom-1 right-1 flex items-end gap-0.5 h-2.5 bg-black/70 px-1 py-0.5 rounded-md">
                  <span className="w-0.5 bg-[#FF2A4D] animate-eq-1" />
                  <span className="w-0.5 bg-[#FF2A4D] animate-eq-2" />
                  <span className="w-0.5 bg-[#FF2A4D] animate-eq-3" />
                </div>
              )}
            </div>

            <div className="truncate">
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#FF2A4D] transition-colors truncate">
                  {track.title}
                </h4>
                {isCrossfading ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded-full bg-[#FF2A4D] text-white animate-pulse flex items-center gap-1">
                    <ArrowRightLeft className="w-2.5 h-2.5" />
                    FADE
                  </span>
                ) : (
                  <span className="hidden md:inline-block text-[10px] font-mono px-2 py-0.2 rounded-full bg-white/10 text-zinc-300">
                    {track.bitDepth}
                  </span>
                )}
              </div>
              
              {/* Dynamic Live Lyric Ticker */}
              <p className="text-[11px] sm:text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors truncate flex items-center gap-1.5 mt-0.5">
                <span className="truncate">{track.artist}</span>
                {activeLyricText && (
                  <>
                    <span className="text-zinc-600 hidden sm:inline">·</span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[#FF2A4D] text-[11px] font-medium truncate">
                      <Mic2 className="w-2.5 h-2.5 shrink-0" />
                      &quot;{activeLyricText}&quot;
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Right: Full Playback Transport & Mini-Player Mode Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Timestamp */}
            <span className="hidden md:inline-block text-xs font-mono text-zinc-400">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Signal Path Badge */}
            <button
              onClick={onOpenSignalPath}
              title="Signal Path (5-Stage)"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl tv-glass-pill text-[11px] font-mono text-zinc-300 hover:text-white transition-all"
            >
              <Activity className="w-3 h-3 text-[#FF2A4D]" />
              <span>{track.sampleRate}</span>
            </button>

            {/* Previous Track */}
            <button
              onClick={onPrev}
              className="p-2 rounded-2xl tv-glass-pill text-zinc-300 hover:text-white transition-all active:scale-95"
              title="Previous Track"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Apple TV Solid White Play Button */}
            <button
              onClick={onTogglePlay}
              className="w-10 h-10 rounded-full bg-white hover:bg-zinc-200 text-black flex items-center justify-center shadow-lg active:scale-95 transition-all"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-black" />
              ) : (
                <Play className="w-4 h-4 fill-black ml-0.5" />
              )}
            </button>

            {/* Next Track */}
            <button
              onClick={onNext}
              className="p-2 rounded-2xl tv-glass-pill text-zinc-300 hover:text-white transition-all active:scale-95"
              title="Next Track"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Inline Volume Popover Toggle */}
            <div className="relative hidden lg:flex items-center">
              <button
                onClick={() => setShowVolumePopup(!showVolumePopup)}
                className="p-2 rounded-2xl tv-glass-pill text-zinc-300 hover:text-white transition-all"
                title="Volume"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {showVolumePopup && (
                <div className="absolute bottom-12 right-0 bg-[#050608]/95 backdrop-blur-2xl border border-white/20 p-3 rounded-2xl shadow-2xl flex flex-col items-center gap-2 z-50">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => onSetVolume(parseFloat(e.target.value))}
                    className="h-24 w-1.5 accent-[#FF2A4D] bg-zinc-800 rounded-full cursor-pointer appearance-none [writing-mode:vertical-lr] [direction:rtl]"
                  />
                  <button
                    onClick={onToggleMute}
                    className="text-[10px] font-mono text-zinc-400 hover:text-white"
                  >
                    {isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}
                  </button>
                </div>
              )}
            </div>

            {/* Switch to Floating PiP Mini-Player Mode */}
            <button
              onClick={() => onToggleMiniPlayerMode('floating')}
              className="p-2 rounded-2xl tv-glass-pill text-zinc-300 hover:text-[#FF2A4D] transition-all"
              title="Switch to Floating Mini-Player Card"
            >
              <PictureInPicture2 className="w-4 h-4" />
            </button>

            {/* Expand Apple TV Full Screen View */}
            <button
              onClick={onOpenPlayerModal}
              className="p-2 rounded-2xl tv-glass-pill text-zinc-400 hover:text-white transition-all"
              title="Open Full Player"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};
