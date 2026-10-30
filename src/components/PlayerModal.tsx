import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Repeat1, 
  Volume2, VolumeX, ListMusic, Mic2, Activity, Share2, Languages, ArrowRightLeft,
  Download, Check, RefreshCw, Focus, ArrowDown, Sparkles, PictureInPicture2
} from 'lucide-react';
import { Track } from '../types/music';

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  activeLyricIndex: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  queue: Track[];
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onSetVolume: (vol: number) => void;
  onToggleMute: () => void;
  onSelectTrack: (track: Track) => void;
  onOpenSignalPath: () => void;
  onOpenShareLyrics: () => void;
  onDownloadLocally: (track: Track) => Promise<void>;
  downloadingId: string | null;
  onEnterMiniPlayer?: () => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  isOpen,
  onClose,
  track,
  isPlaying,
  currentTime,
  duration,
  activeLyricIndex,
  volume,
  isMuted,
  isShuffle,
  repeatMode,
  queue,
  onTogglePlay,
  onSeek,
  onNext,
  onPrev,
  onToggleShuffle,
  onToggleRepeat,
  onSetVolume,
  onToggleMute,
  onSelectTrack,
  onOpenSignalPath,
  onOpenShareLyrics,
  onDownloadLocally,
  downloadingId,
  onEnterMiniPlayer,
}) => {
  const [rightPanel, setRightPanel] = useState<'lyrics' | 'queue'>('lyrics');
  const [showTranslations, setShowTranslations] = useState<boolean>(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
  const [isUserBrowsing, setIsUserBrowsing] = useState<boolean>(false);

  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const isUserBrowsingRef = useRef<boolean>(false);
  const browseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActiveIndexRef = useRef<number>(-1);

  // Exact dead-center smooth scrolling calculation
  const scrollToLyricIndex = useCallback((index: number, smooth: boolean = true) => {
    const container = lyricsContainerRef.current;
    if (!container) return;

    const activeElement = container.querySelector(`[data-lyric-idx="${index}"]`) as HTMLElement;
    if (!activeElement) return;

    const containerRect = container.getBoundingClientRect();
    const elRect = activeElement.getBoundingClientRect();
    const currentScrollTop = container.scrollTop;

    // Calculate relative offset so the active element's midpoint matches the container's vertical midpoint
    const relativeElCenter = (elRect.top - containerRect.top) + (elRect.height / 2);
    const targetScrollTop = currentScrollTop + relativeElCenter - (containerRect.height / 2);

    container.scrollTo({
      top: Math.max(0, targetScrollTop),
      behavior: smooth ? 'smooth' : 'instant',
    });
  }, []);

  // Center immediately when opening modal, switching to lyrics, or changing track
  useEffect(() => {
    if (isOpen && rightPanel === 'lyrics' && autoScrollEnabled) {
      isUserBrowsingRef.current = false;
      setIsUserBrowsing(false);
      if (browseTimeoutRef.current) clearTimeout(browseTimeoutRef.current);

      const r1 = requestAnimationFrame(() => {
        const r2 = requestAnimationFrame(() => {
          scrollToLyricIndex(activeLyricIndex, false);
        });
        return () => cancelAnimationFrame(r2);
      });
      return () => cancelAnimationFrame(r1);
    }
  }, [isOpen, track.id, rightPanel, autoScrollEnabled, scrollToLyricIndex]);

  // Center smoothly on lyric line change if auto-scroll is active and user isn't manually reading
  useEffect(() => {
    if (!isOpen || rightPanel !== 'lyrics' || !autoScrollEnabled) return;
    if (activeLyricIndex === lastActiveIndexRef.current) return;
    lastActiveIndexRef.current = activeLyricIndex;

    if (isUserBrowsingRef.current) return;

    scrollToLyricIndex(activeLyricIndex, true);
  }, [activeLyricIndex, isOpen, rightPanel, autoScrollEnabled, scrollToLyricIndex]);

  // Handle user manual scroll / wheel / touch interaction without jarring fight-backs
  const handleUserInteraction = useCallback(() => {
    if (!autoScrollEnabled) return;
    isUserBrowsingRef.current = true;
    setIsUserBrowsing(true);

    if (browseTimeoutRef.current) {
      clearTimeout(browseTimeoutRef.current);
    }

    // Automatically resume auto-scroll after 4.5 seconds of user inactivity
    browseTimeoutRef.current = setTimeout(() => {
      isUserBrowsingRef.current = false;
      setIsUserBrowsing(false);
      scrollToLyricIndex(activeLyricIndex, true);
    }, 4500);
  }, [autoScrollEnabled, activeLyricIndex, scrollToLyricIndex]);

  const resumeAutoScroll = useCallback(() => {
    if (browseTimeoutRef.current) {
      clearTimeout(browseTimeoutRef.current);
    }
    isUserBrowsingRef.current = false;
    setIsUserBrowsing(false);
    setAutoScrollEnabled(true);
    scrollToLyricIndex(activeLyricIndex, true);
  }, [activeLyricIndex, scrollToLyricIndex]);

  // Calculate intra-line playback progress for the active lyric line
  const currentLyricLine = track.lyrics[activeLyricIndex];
  const nextLyricLine = track.lyrics[activeLyricIndex + 1];
  const lineStartTime = currentLyricLine ? currentLyricLine.time : 0;
  const lineEndTime = nextLyricLine ? nextLyricLine.time : (currentLyricLine ? currentLyricLine.time + 6 : 1);
  const lineDuration = Math.max(0.6, lineEndTime - lineStartTime);
  const intraLineProgress = Math.min(1, Math.max(0, (currentTime - lineStartTime) / lineDuration));
  const intraLinePercent = Math.round(intraLineProgress * 100);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050608] animate-fadeIn overflow-hidden">
      
      {/* Apple TV Ambient Fluid Color Backdrop */}
      <div 
        className="absolute inset-0 opacity-40 blur-3xl pointer-events-none scale-150 transition-all duration-1000"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 40%, ${track.accentColor} 0%, transparent 60%), radial-gradient(circle at 80% 60%, #1e293b 0%, transparent 70%)`
        }}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />

      {/* Main Container */}
      <div className="relative w-full h-full max-w-7xl mx-auto flex flex-col justify-between p-6 sm:p-12 z-10 overflow-hidden">
        
        {/* Top tvOS Bar */}
        <div className="flex items-center justify-between pb-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl tv-glass-pill text-xs font-semibold text-zinc-300 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
              <span>Close (ESC)</span>
            </button>
            {onEnterMiniPlayer && (
              <button
                onClick={onEnterMiniPlayer}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl tv-glass-pill text-xs font-semibold text-zinc-300 hover:text-white hover:border-[#FF2A4D]/50 transition-all group"
                title="Switch to Mini-Player mode"
              >
                <PictureInPicture2 className="w-3.5 h-3.5 text-[#FF2A4D] group-hover:scale-110 transition-transform" />
                <span>Mini-Player</span>
              </button>
            )}
          </div>

          {/* Right Panel Switcher */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setRightPanel('lyrics')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                rightPanel === 'lyrics' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Mic2 className="w-3.5 h-3.5" />
              <span>Apple TV Lyrics</span>
            </button>
            <button
              onClick={() => setRightPanel('queue')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                rightPanel === 'queue' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ListMusic className="w-3.5 h-3.5" />
              <span>Playing Next ({queue.length})</span>
            </button>
          </div>

          {/* Signal Path / DAC Pill */}
          <button
            onClick={onOpenSignalPath}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl tv-glass-pill text-xs font-mono text-zinc-300 hover:text-white transition-all"
          >
            <Activity className="w-3.5 h-3.5 text-[#FF2A4D]" />
            <span>{track.sampleRate} · {track.bitDepth}</span>
          </button>
        </div>

        {/* Center Split Screen: Left Artwork & Controls | Right Synced Lyrics */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center my-4 overflow-hidden">
          
          {/* Left Column (5 Cols): Album Artwork, Title & Transport */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            
            {/* Apple TV Large Album Cover */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.9)] border border-white/15 group">
              <img 
                src={track.coverUrl} 
                alt={track.title} 
                className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Track Info */}
            <div className="w-full">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-medium text-zinc-400">
                <span className="text-[#FF2A4D] font-bold">{track.source}</span>
                <span aria-hidden="true">·</span>
                <span>{track.genre}</span>
                <span aria-hidden="true">·</span>
                <span>{track.year}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1 leading-tight">
                {track.title}
              </h2>

              <p className="text-base sm:text-lg font-semibold text-zinc-300 mt-1">
                {track.artist}
              </p>

              <p className="text-xs text-zinc-500 mt-0.5">
                {track.album}
              </p>
            </div>

            {/* Scrubber & Controls */}
            <div className="w-full space-y-3 pt-2 max-w-md">
              
              {/* Apple TV Scrubber */}
              <div className="space-y-1">
                <div 
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pos = (e.clientX - rect.left) / rect.width;
                    onSeek(pos * duration);
                  }}
                  className="relative w-full h-2 rounded-full bg-white/15 cursor-pointer group py-1"
                >
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 left-0 h-1.5 rounded-full bg-white shadow-sm"
                    style={{ width: `${progressPercent}%` }}
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform"
                    style={{ left: `${progressPercent}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Transport Buttons */}
              <div className="flex items-center justify-center lg:justify-start gap-4 pt-1">
                <button
                  onClick={onToggleShuffle}
                  className={`p-2.5 rounded-2xl tv-glass-pill transition-colors ${
                    isShuffle ? 'text-[#FF2A4D] border-[#FF2A4D]/40' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Shuffle"
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                <button
                  onClick={onPrev}
                  className="p-3 rounded-2xl tv-glass-pill text-zinc-300 hover:text-white transition-colors"
                  title="Previous Track"
                >
                  <SkipBack className="w-6 h-6" />
                </button>

                {/* Main White Play / Pause Button */}
                <button
                  onClick={onTogglePlay}
                  className="w-16 h-16 rounded-full bg-white hover:bg-zinc-200 text-black flex items-center justify-center shadow-[0_10px_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-black" />
                  ) : (
                    <Play className="w-7 h-7 fill-black ml-1" />
                  )}
                </button>

                <button
                  onClick={onNext}
                  className="p-3 rounded-2xl tv-glass-pill text-zinc-300 hover:text-white transition-colors"
                  title="Next Track (Crossfade Enabled)"
                >
                  <SkipForward className="w-6 h-6" />
                </button>

                <button
                  onClick={onToggleRepeat}
                  className={`p-2.5 rounded-2xl tv-glass-pill transition-colors ${
                    repeatMode !== 'off' ? 'text-[#FF2A4D] border-[#FF2A4D]/40' : 'text-zinc-400 hover:text-white'
                  }`}
                  title={`Repeat Mode: ${repeatMode}`}
                >
                  {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                </button>
              </div>

              {/* Secondary Action Pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2">
                
                {/* Prominent Local Download Button */}
                <button
                  onClick={() => onDownloadLocally(track)}
                  disabled={downloadingId === track.id}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                    track.isDownloaded
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-[#FF2A4D] hover:bg-[#E0203E] text-white shadow-[0_0_20px_rgba(255,42,77,0.35)]'
                  }`}
                >
                  {downloadingId === track.id ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Storage...</span>
                    </>
                  ) : track.isDownloaded ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Downloaded (Storage)</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Download Locally (.FLAC + .LRC)</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onOpenShareLyrics}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl tv-glass-pill text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#FF2A4D]" />
                  <span>Share Card</span>
                </button>

                <button
                  onClick={onOpenSignalPath}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl tv-glass-pill text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                >
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>5-Stage DSP</span>
                </button>
              </div>

            </div>

          </div>

          {/* Right Column (7 Cols): Apple TV Cascading Lyrics or Up Next Queue */}
          <div className="lg:col-span-7 h-full max-h-[460px] lg:max-h-[560px] flex flex-col justify-between overflow-hidden">
            
            {/* View A: Apple TV Style Karaoke Synced Lyrics */}
            {rightPanel === 'lyrics' && (
              <div className="relative h-full flex flex-col justify-between animate-fadeIn overflow-hidden">
                
                {/* Header Tooling */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-zinc-400 shrink-0 z-20 bg-transparent">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF2A4D] shadow-[0_0_8px_#FF2A4D] animate-ping" />
                      <Sparkles className="w-3.5 h-3.5 text-[#FF2A4D]" />
                      <span>Karaoke Luminous Glow Sync</span>
                    </span>
                    <button
                      onClick={() => {
                        const next = !autoScrollEnabled;
                        setAutoScrollEnabled(next);
                        if (next) resumeAutoScroll();
                      }}
                      className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl tv-glass-pill text-[11px] font-medium transition-all ${
                        autoScrollEnabled 
                          ? (isUserBrowsing ? 'text-amber-300 border-amber-300/40 bg-amber-400/10' : 'text-[#FF2A4D] border-[#FF2A4D]/40 bg-[#FF2A4D]/10')
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                      title="Toggle lyrics auto-scroll alignment"
                    >
                      <Focus className="w-3 h-3" />
                      <span>{autoScrollEnabled ? (isUserBrowsing ? 'Auto-Scroll Paused' : 'Auto-Scroll Active') : 'Auto-Scroll Off'}</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setShowTranslations(!showTranslations)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl tv-glass-pill text-xs transition-colors ${
                      showTranslations ? 'text-[#FF2A4D] border-[#FF2A4D]/40' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Languages className="w-3.5 h-3.5" />
                    <span>Translation</span>
                  </button>
                </div>

                {/* Cascading Lyrics Scroll Container with Apple TV Fade Mask & Centering Offset */}
                <div 
                  ref={lyricsContainerRef}
                  onWheel={handleUserInteraction}
                  onTouchMove={handleUserInteraction}
                  onPointerDown={handleUserInteraction}
                  className="relative flex-1 overflow-y-auto space-y-9 px-4 scroll-smooth text-left no-scrollbar overscroll-contain"
                  style={{
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
                    paddingTop: '32vh',
                    paddingBottom: '32vh',
                  }}
                >
                  {track.lyrics.map((line, idx) => {
                    const isActive = idx === activeLyricIndex;
                    const isPassed = idx < activeLyricIndex;
                    const isNextImmediate = idx === activeLyricIndex + 1;

                    return (
                      <div 
                        key={idx}
                        data-lyric-idx={idx}
                        onClick={() => {
                          onSeek(line.time);
                          resumeAutoScroll();
                        }}
                        className={`relative group cursor-pointer lyric-line-transition py-3 px-3 rounded-3xl ${
                          isActive 
                            ? 'text-white font-black scale-[1.035] opacity-100 z-10' 
                            : isPassed
                            ? 'text-zinc-500 font-semibold opacity-30 hover:opacity-80 scale-[0.98] blur-[0.6px] hover:blur-none'
                            : isNextImmediate
                            ? 'text-zinc-300 font-bold opacity-60 hover:opacity-90 scale-[1.0] blur-[0.2px] hover:blur-none'
                            : 'text-zinc-500 font-medium opacity-35 hover:opacity-80 scale-[0.98] blur-[0.5px] hover:blur-none'
                        }`}
                      >
                        {/* Luminous Ambient Backdrop Glow for Active Line */}
                        {isActive && (
                          <div 
                            className="absolute -inset-x-4 -inset-y-2 rounded-3xl bg-gradient-to-r from-[#FF2A4D]/25 via-rose-500/10 to-transparent blur-xl -z-10 animate-ambient-drift pointer-events-none"
                            style={{
                              boxShadow: '0 0 45px rgba(255, 42, 77, 0.25)',
                            }}
                          />
                        )}

                        <div className="flex items-start justify-between gap-4">
                          <p className={`text-xl sm:text-3xl lg:text-4xl tracking-tight leading-relaxed lyric-line-transition ${
                            isActive 
                              ? 'text-white lyric-active-glow font-black drop-shadow-[0_0_24px_rgba(255,255,255,0.9)]' 
                              : ''
                          }`}>
                            {line.text}
                          </p>
                          <span className={`text-[11px] font-mono shrink-0 lyric-line-transition mt-2 ${
                            isActive 
                              ? 'text-[#FF2A4D] opacity-100 font-bold drop-shadow-[0_0_10px_rgba(255,42,77,0.8)]' 
                              : 'text-zinc-600 opacity-0 group-hover:opacity-75'
                          }`}>
                            {formatTime(line.time)}
                          </span>
                        </div>

                        {/* Real-Time Intra-Line Karaoke Glowing Progress Fill */}
                        {isActive && (
                          <div className="w-full max-w-md h-1.5 bg-white/10 rounded-full mt-3.5 overflow-hidden shadow-inner p-0.5">
                            <div 
                              className="h-full bg-gradient-to-r from-[#FF2A4D] via-white to-[#FF2A4D] rounded-full transition-[width] duration-150 ease-linear shadow-[0_0_16px_#FF2A4D]"
                              style={{ width: `${intraLinePercent}%` }}
                            />
                          </div>
                        )}

                        {showTranslations && line.translation && (
                          <p className={`text-xs sm:text-sm mt-2 font-normal lyric-line-transition ${
                            isActive 
                              ? 'text-zinc-100 opacity-95 font-medium drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]' 
                              : 'text-zinc-500 opacity-60'
                          }`}>
                            {line.translation}
                          </p>
                        )}
                        {showTranslations && line.romanization && (
                          <p className={`text-[11px] mt-0.5 font-normal lyric-line-transition ${
                            isActive ? 'text-zinc-300 opacity-80' : 'text-zinc-600 opacity-40'
                          }`}>
                            {line.romanization}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Floating Apple TV Sync Pill (Visible when user manually scrolls away) */}
                {isUserBrowsing && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 animate-fadeIn pointer-events-auto">
                    <button
                      onClick={resumeAutoScroll}
                      className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-2xl border border-white/25 text-white text-xs font-bold shadow-[0_12px_36px_rgba(0,0,0,0.9)] transition-all hover:scale-105 active:scale-95 group"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#FF2A4D] animate-ping" />
                      <span>Sync with Audio · {formatTime(currentTime)}</span>
                      <Focus className="w-3.5 h-3.5 text-[#FF2A4D] group-hover:rotate-90 transition-transform" />
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* View B: Up Next Queue */}
            {rightPanel === 'queue' && (
              <div className="h-full flex flex-col justify-between animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs shrink-0">
                  <span className="font-bold text-white">Up Next on Apple TV</span>
                  <span className="text-zinc-400">{queue.length} tracks in queue</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 py-3">
                  {queue.map((qTrack, idx) => {
                    const isCurrent = qTrack.id === track.id;
                    return (
                      <div
                        key={qTrack.id}
                        onClick={() => onSelectTrack(qTrack)}
                        className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer tv-card transition-all ${
                          isCurrent
                            ? 'bg-white/15 border border-white/20 text-white'
                            : 'bg-white/5 hover:bg-white/10 border border-transparent text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 truncate">
                          <span className="w-5 text-center text-xs font-mono text-zinc-500">
                            {idx + 1}
                          </span>
                          <img 
                            src={qTrack.coverUrl} 
                            alt={qTrack.title} 
                            className="w-11 h-11 rounded-xl object-cover shrink-0"
                          />
                          <div className="truncate">
                            <h4 className="text-xs sm:text-sm font-bold truncate text-white">
                              {qTrack.title}
                            </h4>
                            <p className="text-[11px] text-zinc-400 truncate">
                              {qTrack.artist}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 shrink-0">
                          <span>{formatTime(qTrack.duration)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
