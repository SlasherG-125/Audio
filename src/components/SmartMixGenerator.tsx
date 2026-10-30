import React, { useState } from 'react';
import { Sparkles, Play, RefreshCw, Flame, Compass, CheckCircle2, Radio, Shuffle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Track } from '../types/music';

interface SmartMixGeneratorProps {
  tracks: Track[];
  onPlayTrack: (track: Track) => void;
}

const SEED_ARTISTS = ['The Midnight', 'Kavinsky', 'Daft Punk', 'Gunship', 'Sub Focus', 'ODESZA', 'Tycho'];
const MOODS = ['Late Night Drive', 'High Energy', 'Deep Focus', 'Melancholy Rain', 'Sunset Lounge'];

export const SmartMixGenerator: React.FC<SmartMixGeneratorProps> = ({
  tracks,
  onPlayTrack,
}) => {
  const [selectedArtist, setSelectedArtist] = useState<string>('The Midnight');
  const [selectedMood, setSelectedMood] = useState<string>('Late Night Drive');
  const [discoveryDepth, setDiscoveryDepth] = useState<number>(65);
  const [tempoBpm, setTempoBpm] = useState<number>(115);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedMix, setGeneratedMix] = useState<Track[] | null>(null);

  const generateMix = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const shuffled = [...tracks].sort(() => 0.5 - Math.random());
      setGeneratedMix(shuffled);
      setIsGenerating(false);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#FF2A4D', '#38bdf8']
      });
    }, 600);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-32">
      
      {/* Apple TV Station Generator Hero Card */}
      <div className="relative rounded-3xl tv-glass border border-white/15 p-6 sm:p-10 shadow-2xl overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF2A4D]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FF2A4D] uppercase tracking-wider mb-2">
            <Radio className="w-4 h-4" />
            <span>Apple TV Algorithmic Radio</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Create Custom Smart Radio
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-xl leading-relaxed">
            Generate an infinite stream tailored to your seed artist and mood with smooth crossfade blending.
          </p>

          {/* Generator Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            
            {/* Seed Artist */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <label className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-[#FF2A4D]" />
                Seed Artist Anchor:
              </label>
              <div className="flex flex-wrap gap-2">
                {SEED_ARTISTS.map((artist) => (
                  <button
                    key={artist}
                    onClick={() => setSelectedArtist(artist)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedArtist === artist
                        ? 'bg-white text-black font-bold shadow-md'
                        : 'tv-glass-pill text-zinc-300 hover:text-white'
                    }`}
                  >
                    {artist}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Mood */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <label className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Vibe &amp; Mood Channel:
              </label>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedMood === mood
                        ? 'bg-white text-black font-bold shadow-md'
                        : 'tv-glass-pill text-zinc-300 hover:text-white'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Sliders: Discovery & Tempo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-200 mb-2.5">
                <span>Discovery Depth:</span>
                <span className="text-[#FF2A4D] font-mono">
                  {discoveryDepth < 35 ? 'Familiar Hits' : discoveryDepth > 70 ? 'Deep Cuts' : 'Balanced'} ({discoveryDepth}%)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={discoveryDepth}
                onChange={(e) => setDiscoveryDepth(parseInt(e.target.value))}
                className="w-full accent-white bg-white/10 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-200 mb-2.5">
                <span>Target Energy / Tempo:</span>
                <span className="text-[#FF2A4D] font-mono">{tempoBpm} BPM</span>
              </div>
              <input
                type="range"
                min="70"
                max="175"
                value={tempoBpm}
                onChange={(e) => setTempoBpm(parseInt(e.target.value))}
                className="w-full accent-white bg-white/10 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Apple TV Solid White CTA */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={generateMix}
              disabled={isGenerating}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-zinc-200 text-black font-extrabold text-sm shadow-[0_10px_25px_rgba(255,255,255,0.25)] transition-all transform active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Synthesizing Station...' : 'Create Radio Station'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Generated Apple TV Rail */}
      {generatedMix && (
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Station: {selectedArtist} · {selectedMood}
              </h2>
            </div>
            <span className="text-xs text-zinc-400 font-mono">
              {generatedMix.length} curated tracks
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedMix.map((track) => (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track)}
                className="p-4 rounded-2xl tv-glass tv-card border border-white/10 cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5 truncate">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-md"
                  />
                  <div className="truncate">
                    <h4 className="text-sm font-bold text-white truncate">
                      {track.title}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">
                      {track.artist}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 mt-1">
                      <span className="text-[#FF2A4D]">{track.sampleRate}</span>
                      <span aria-hidden="true">·</span>
                      <span>{track.genre}</span>
                    </div>
                  </div>
                </div>

                <button className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-white group-hover:text-black flex items-center justify-center text-white transition-colors shrink-0">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
