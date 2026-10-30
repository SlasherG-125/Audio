import { useState, useEffect, useRef, useCallback } from 'react';
import { Track } from '../types/music';
import { CATALOG_TRACKS } from '../data/mockCatalog';

export interface EqualizerBand {
  freq: string;
  gain: number; // in dB (-12 to +12)
}

export type CrossfadeCurve = 'equalPower' | 'linear' | 'exponential';

const DEFAULT_EQ_BANDS: EqualizerBand[] = [
  { freq: '32Hz', gain: 3.5 },
  { freq: '64Hz', gain: 2.0 },
  { freq: '125Hz', gain: 0.5 },
  { freq: '250Hz', gain: 0.0 },
  { freq: '500Hz', gain: -0.5 },
  { freq: '1kHz', gain: 1.0 },
  { freq: '2kHz', gain: 2.5 },
  { freq: '4kHz', gain: 3.0 },
  { freq: '8kHz', gain: 4.0 },
  { freq: '16kHz', gain: 4.5 },
];

export function useAudioPlayer() {
  const [currentTrack, setCurrentTrack] = useState<Track>(CATALOG_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(CATALOG_TRACKS[0].duration);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('all');
  const [queue] = useState<Track[]>(CATALOG_TRACKS);
  const [eqBands, setEqBands] = useState<EqualizerBand[]>(DEFAULT_EQ_BANDS);
  const [studioClarity, setStudioClarity] = useState<boolean>(true);
  const [bitPerfectMode, setBitPerfectMode] = useState<boolean>(true);
  const [audioBufferHealth] = useState<number>(98.5);

  // Crossfade states
  const [crossfadeEnabled, setCrossfadeEnabled] = useState<boolean>(true);
  const [crossfadeDuration, setCrossfadeDuration] = useState<number>(4); // in seconds
  const [crossfadeCurve, setCrossfadeCurve] = useState<CrossfadeCurve>('equalPower');
  const [gaplessMode, setGaplessMode] = useState<boolean>(true);
  const [isCrossfading, setIsCrossfading] = useState<boolean>(false);

  // Dual Decks for smooth crossfading
  const deckARef = useRef<HTMLAudioElement | null>(null);
  const deckBRef = useRef<HTMLAudioElement | null>(null);
  const activeDeckRef = useRef<'A' | 'B'>('A');
  const crossfadeTimerRef = useRef<number | null>(null);
  const crossfadeTriggeredForTrackRef = useRef<string | null>(null);

  // Helper to compute volume gain based on crossfade curve
  // progress goes from 0.0 (start of transition) to 1.0 (transition complete)
  const calculateFadeGains = useCallback((progress: number, curve: CrossfadeCurve) => {
    const p = Math.max(0, Math.min(1, progress));
    if (curve === 'equalPower') {
      // Equal power curve maintains constant acoustic energy (gainA^2 + gainB^2 = 1)
      const gainOut = Math.cos(p * 0.5 * Math.PI);
      const gainIn = Math.sin(p * 0.5 * Math.PI);
      return { gainOut, gainIn };
    } else if (curve === 'exponential') {
      const gainOut = Math.pow(1 - p, 2);
      const gainIn = Math.pow(p, 2);
      return { gainOut, gainIn };
    } else {
      // Linear
      return { gainOut: 1 - p, gainIn: p };
    }
  }, []);

  // Initialize Dual Decks
  useEffect(() => {
    const audioA = new Audio();
    const audioB = new Audio();
    audioA.preload = 'metadata';
    audioB.preload = 'metadata';
    deckARef.current = audioA;
    deckBRef.current = audioB;

    const getActiveAudio = () => (activeDeckRef.current === 'A' ? audioA : audioB);

    const onTimeUpdate = (e: Event) => {
      const audio = e.target as HTMLAudioElement;
      if (audio === getActiveAudio()) {
        setCurrentTime(audio.currentTime);

        // Check if we should trigger auto-crossfade into next track before the track ends
        const activeTrackDur = audio.duration || currentTrack.duration;
        const remaining = activeTrackDur - audio.currentTime;
        
        if (
          crossfadeEnabled &&
          remaining > 0 &&
          remaining <= crossfadeDuration &&
          crossfadeTriggeredForTrackRef.current !== currentTrack.id &&
          repeatMode !== 'one'
        ) {
          crossfadeTriggeredForTrackRef.current = currentTrack.id;
          performCrossfadeToNext(crossfadeDuration);
        }
      }
    };

    const onLoadedMetadata = (e: Event) => {
      const audio = e.target as HTMLAudioElement;
      if (audio === getActiveAudio() && audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onEnded = (e: Event) => {
      const audio = e.target as HTMLAudioElement;
      if (audio === getActiveAudio()) {
        if (!crossfadeEnabled || crossfadeTriggeredForTrackRef.current !== currentTrack.id) {
          handleNextDirect();
        }
      }
    };

    audioA.addEventListener('timeupdate', onTimeUpdate);
    audioA.addEventListener('loadedmetadata', onLoadedMetadata);
    audioA.addEventListener('ended', onEnded);

    audioB.addEventListener('timeupdate', onTimeUpdate);
    audioB.addEventListener('loadedmetadata', onLoadedMetadata);
    audioB.addEventListener('ended', onEnded);

    // Initial load
    audioA.src = currentTrack.audioUrl;
    audioA.volume = volume;

    return () => {
      audioA.removeEventListener('timeupdate', onTimeUpdate);
      audioA.removeEventListener('loadedmetadata', onLoadedMetadata);
      audioA.removeEventListener('ended', onEnded);

      audioB.removeEventListener('timeupdate', onTimeUpdate);
      audioB.removeEventListener('loadedmetadata', onLoadedMetadata);
      audioB.removeEventListener('ended', onEnded);

      audioA.pause();
      audioB.pause();
      if (crossfadeTimerRef.current) {
        window.clearInterval(crossfadeTimerRef.current);
      }
    };
  }, [crossfadeEnabled, crossfadeDuration, currentTrack, repeatMode]);

  // Volume updates applied according to mute and active deck
  useEffect(() => {
    const effectiveVol = isMuted ? 0 : volume;
    if (!isCrossfading) {
      if (activeDeckRef.current === 'A' && deckARef.current) {
        deckARef.current.volume = effectiveVol;
      } else if (activeDeckRef.current === 'B' && deckBRef.current) {
        deckBRef.current.volume = effectiveVol;
      }
    }
  }, [volume, isMuted, isCrossfading]);

  // Execute smooth crossfade transition between Deck A and Deck B
  const startCrossfadeTransition = useCallback((nextTrack: Track, transitionSecs: number) => {
    const fromDeck = activeDeckRef.current === 'A' ? deckARef.current : deckBRef.current;
    const toDeck = activeDeckRef.current === 'A' ? deckBRef.current : deckARef.current;
    const targetDeckKey = activeDeckRef.current === 'A' ? 'B' : 'A';

    if (!toDeck) return;

    if (crossfadeTimerRef.current) {
      window.clearInterval(crossfadeTimerRef.current);
    }

    setIsCrossfading(true);
    crossfadeTriggeredForTrackRef.current = nextTrack.id;

    // Load next track into destination deck
    toDeck.src = nextTrack.audioUrl;
    toDeck.currentTime = 0;
    toDeck.volume = 0;

    toDeck.play().then(() => {
      // Transition start
      const startTime = performance.now();
      const durationMs = Math.max(500, transitionSecs * 1000);
      const baseVol = isMuted ? 0 : volume;

      crossfadeTimerRef.current = window.setInterval(() => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        const { gainOut, gainIn } = calculateFadeGains(progress, crossfadeCurve);

        if (fromDeck) {
          fromDeck.volume = Math.max(0, Math.min(1, baseVol * gainOut));
        }
        toDeck.volume = Math.max(0, Math.min(1, baseVol * gainIn));

        if (progress >= 1) {
          // Transition complete
          if (crossfadeTimerRef.current) {
            window.clearInterval(crossfadeTimerRef.current);
            crossfadeTimerRef.current = null;
          }
          if (fromDeck) {
            fromDeck.pause();
            fromDeck.currentTime = 0;
          }
          toDeck.volume = baseVol;
          activeDeckRef.current = targetDeckKey;
          setCurrentTrack(nextTrack);
          setDuration(nextTrack.duration);
          setCurrentTime(0);
          setIsCrossfading(false);
          setIsPlaying(true);
        }
      }, 30);
    }).catch(() => {
      // Fallback if browser blocks parallel audio
      activeDeckRef.current = targetDeckKey;
      setCurrentTrack(nextTrack);
      setDuration(nextTrack.duration);
      setCurrentTime(0);
      setIsCrossfading(false);
      setIsPlaying(true);
    });
  }, [volume, isMuted, calculateFadeGains, crossfadeCurve]);

  // Find next track in queue
  const getNextTrack = useCallback(() => {
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    let nextIndex = 0;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }
    return queue[nextIndex];
  }, [queue, currentTrack, isShuffle]);

  const performCrossfadeToNext = useCallback((fadeDuration: number) => {
    const nextTrack = getNextTrack();
    startCrossfadeTransition(nextTrack, fadeDuration);
  }, [getNextTrack, startCrossfadeTransition]);

  const handleNextDirect = useCallback(() => {
    const nextTrack = getNextTrack();
    const activeDeck = activeDeckRef.current === 'A' ? deckARef.current : deckBRef.current;
    if (activeDeck) {
      activeDeck.src = nextTrack.audioUrl;
      activeDeck.currentTime = 0;
      activeDeck.volume = isMuted ? 0 : volume;
      activeDeck.play().catch(() => {});
    }
    setCurrentTrack(nextTrack);
    setCurrentTime(0);
    setDuration(nextTrack.duration);
    setIsPlaying(true);
  }, [getNextTrack, volume, isMuted]);

  // User triggers Next track
  const handleNext = useCallback(() => {
    if (repeatMode === 'one') {
      const activeDeck = activeDeckRef.current === 'A' ? deckARef.current : deckBRef.current;
      if (activeDeck) {
        activeDeck.currentTime = 0;
        activeDeck.play().catch(() => {});
      }
      return;
    }

    if (crossfadeEnabled) {
      // On manual skip, perform a punchy 2.5s crossfade or user setting
      performCrossfadeToNext(Math.min(crossfadeDuration, 2.5));
    } else {
      handleNextDirect();
    }
  }, [repeatMode, crossfadeEnabled, crossfadeDuration, performCrossfadeToNext, handleNextDirect]);

  // User triggers Previous track
  const handlePrev = useCallback(() => {
    const activeDeck = activeDeckRef.current === 'A' ? deckARef.current : deckBRef.current;
    if (currentTime > 3 && activeDeck) {
      activeDeck.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    const prevTrack = queue[prevIndex];

    if (crossfadeEnabled) {
      startCrossfadeTransition(prevTrack, Math.min(crossfadeDuration, 2.0));
    } else {
      if (activeDeck) {
        activeDeck.src = prevTrack.audioUrl;
        activeDeck.currentTime = 0;
        activeDeck.play().catch(() => {});
      }
      setCurrentTrack(prevTrack);
      setCurrentTime(0);
      setDuration(prevTrack.duration);
      setIsPlaying(true);
    }
  }, [currentTime, queue, currentTrack, crossfadeEnabled, crossfadeDuration, startCrossfadeTransition]);

  // Play a specific track (with optional smooth crossfade transition)
  const playTrack = useCallback((track: Track) => {
    if (track.id === currentTrack.id && isPlaying) return;

    if (crossfadeEnabled && isPlaying) {
      startCrossfadeTransition(track, Math.min(crossfadeDuration, 2.0));
    } else {
      const activeDeck = activeDeckRef.current === 'A' ? deckARef.current : deckBRef.current;
      if (activeDeck) {
        activeDeck.src = track.audioUrl;
        activeDeck.currentTime = 0;
        activeDeck.volume = isMuted ? 0 : volume;
        activeDeck.play().catch(() => {});
      }
      setCurrentTrack(track);
      setCurrentTime(0);
      setDuration(track.duration);
      setIsPlaying(true);
    }
  }, [currentTrack, isPlaying, crossfadeEnabled, crossfadeDuration, startCrossfadeTransition, volume, isMuted]);

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    const activeDeck = activeDeckRef.current === 'A' ? deckARef.current : deckBRef.current;
    if (!activeDeck) return;

    if (isPlaying) {
      activeDeck.pause();
      setIsPlaying(false);
    } else {
      activeDeck.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(true);
      });
    }
  }, [isPlaying]);

  const seek = useCallback((seconds: number) => {
    const activeDeck = activeDeckRef.current === 'A' ? deckARef.current : deckBRef.current;
    if (activeDeck) {
      activeDeck.currentTime = seconds;
      setCurrentTime(seconds);
    }
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => !prev);
  }, []);

  // Compute current active lyric line
  const activeLyricIndex = currentTrack.lyrics.reduce((acc, line, idx) => {
    if (currentTime >= line.time) {
      return idx;
    }
    return acc;
  }, 0);

  const updateEqBand = (index: number, gain: number) => {
    setEqBands(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], gain };
      return updated;
    });
  };

  return {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    queue,
    eqBands,
    studioClarity,
    bitPerfectMode,
    audioBufferHealth,
    activeLyricIndex,
    crossfadeEnabled,
    crossfadeDuration,
    crossfadeCurve,
    gaplessMode,
    isCrossfading,
    togglePlay,
    playTrack,
    seek,
    handleNext,
    handlePrev,
    setVolume,
    setIsMuted,
    toggleRepeat,
    toggleShuffle,
    setStudioClarity,
    setBitPerfectMode,
    setCrossfadeEnabled,
    setCrossfadeDuration,
    setCrossfadeCurve,
    setGaplessMode,
    updateEqBand,
  };
}
