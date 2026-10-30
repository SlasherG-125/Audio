import React, { useState } from 'react';
import { 
  X, Sliders, Sparkles, Check, RotateCcw, Zap, 
  Layers, Waves, ArrowRightLeft, Radio, Gauge
} from 'lucide-react';
import { EqualizerBand, CrossfadeCurve } from '../hooks/useAudioPlayer';

interface EqualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  eqBands: EqualizerBand[];
  onUpdateBand: (index: number, gain: number) => void;
  studioClarity: boolean;
  onToggleStudioClarity: () => void;
  bitPerfectMode: boolean;
  onToggleBitPerfect: () => void;
  crossfadeEnabled: boolean;
  onToggleCrossfade: () => void;
  crossfadeDuration: number;
  onChangeCrossfadeDuration: (secs: number) => void;
  crossfadeCurve: CrossfadeCurve;
  onChangeCrossfadeCurve: (curve: CrossfadeCurve) => void;
  gaplessMode: boolean;
  onToggleGapless: () => void;
  isCrossfading?: boolean;
}

const PRESETS = [
  { name: 'Audio Signature', values: [3.5, 2.0, 0.5, 0.0, -0.5, 1.0, 2.5, 3.0, 4.0, 4.5] },
  { name: 'Bass Boost + Sub', values: [7.0, 5.5, 3.5, 1.5, 0.0, 0.0, 0.5, 1.0, 1.5, 2.0] },
  { name: 'Vocal Clarity', values: [-1.0, -0.5, 0.0, 1.5, 3.0, 4.0, 3.5, 2.0, 1.0, 0.5] },
  { name: 'Electronic / Synth', values: [4.5, 3.5, 1.0, -0.5, -1.0, 1.0, 2.5, 4.0, 5.0, 5.5] },
  { name: 'Acoustic / Warm', values: [1.5, 2.0, 2.5, 1.5, 1.0, 1.0, 1.5, 2.0, 1.5, 1.0] },
  { name: 'Flat (Bypass)', values: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0] },
];

const CROSSFADE_PRESETS = [1, 2, 4, 6, 8, 12];

export const EqualizerModal: React.FC<EqualizerModalProps> = ({
  isOpen,
  onClose,
  eqBands,
  onUpdateBand,
  studioClarity,
  onToggleStudioClarity,
  bitPerfectMode,
  onToggleBitPerfect,
  crossfadeEnabled,
  onToggleCrossfade,
  crossfadeDuration,
  onChangeCrossfadeDuration,
  crossfadeCurve,
  onChangeCrossfadeCurve,
  gaplessMode,
  onToggleGapless,
  isCrossfading = false,
}) => {
  const [activeTab, setActiveTab] = useState<'eq' | 'crossfade'>('eq');
  const [activePreset, setActivePreset] = useState<string>('Audio Signature');

  if (!isOpen) return null;

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setActivePreset(preset.name);
    preset.values.forEach((val, idx) => {
      onUpdateBand(idx, val);
    });
  };

  const resetFlat = () => {
    applyPreset(PRESETS[5]); // Flat
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#050608] border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.85)] text-white p-5 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF2A4D] p-2 flex items-center justify-center text-black shadow-[0_0_16px_rgba(255,42,77,0.3)]">
              <Sliders className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  DSP Equalizer &amp; Audio Transitions
                </h2>
                {isCrossfading && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF2A4D] text-black animate-pulse">
                    Crossfading
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400">
                10-band parametric EQ, Studio Clarity, and smooth track crossfade
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

        {/* Modal Section Navigation Tabs */}
        <div className="flex items-center gap-1.5 mt-4 bg-zinc-900/60 p-1 rounded-2xl border border-white/5">
          <button
            onClick={() => setActiveTab('eq')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'eq'
                ? 'bg-[#FF2A4D] text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>10-Band Graphic EQ</span>
          </button>

          <button
            onClick={() => setActiveTab('crossfade')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all relative ${
              activeTab === 'crossfade'
                ? 'bg-[#FF2A4D] text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Crossfade &amp; Transitions</span>
            {crossfadeEnabled && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>
        </div>

        {/* TAB 1: 10-Band Graphic EQ */}
        {activeTab === 'eq' && (
          <div className="animate-fadeIn">
            {/* Feature Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
              
              {/* Studio Clarity Toggle */}
              <div 
                onClick={onToggleStudioClarity}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  studioClarity
                    ? 'bg-[#21080d] border-[#FF2A4D]/40 shadow-[0_0_20px_rgba(255,42,77,0.15)]'
                    : 'bg-zinc-900/50 border-white/5 opacity-75'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    studioClarity ? 'bg-[#FF2A4D] text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Studio Clarity</h4>
                    <p className="text-[10px] text-zinc-400">Harmonic presence &amp; air (+3.5dB)</p>
                  </div>
                </div>
                <div className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                  studioClarity ? 'bg-[#FF2A4D]' : 'bg-zinc-700'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-black transition-transform ${
                    studioClarity ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </div>
              </div>

              {/* Bit-Perfect Output Toggle */}
              <div 
                onClick={onToggleBitPerfect}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  bitPerfectMode
                    ? 'bg-[#21080d] border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                    : 'bg-zinc-900/50 border-white/5 opacity-75'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    bitPerfectMode ? 'bg-emerald-400 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Bit-Perfect DAC</h4>
                    <p className="text-[10px] text-zinc-400">Bypass Android Mixer truncation</p>
                  </div>
                </div>
                <div className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                  bitPerfectMode ? 'bg-emerald-400' : 'bg-zinc-700'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-black transition-transform ${
                    bitPerfectMode ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </div>
              </div>

            </div>

            {/* Presets Chips */}
            <div className="space-y-1.5 my-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Equalizer Presets:</span>
                <button 
                  onClick={resetFlat}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      activePreset === preset.name
                        ? 'bg-[#FF2A4D] text-black shadow-md'
                        : 'bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {activePreset === preset.name && <Check className="w-3 h-3" />}
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 10-Band Sliders Grid */}
            <div className="mt-4 p-4 rounded-3xl bg-zinc-900/50 border border-white/5">
              <div className="grid grid-cols-10 gap-1.5 sm:gap-3 items-end h-44 sm:h-52 pb-2">
                {eqBands.map((band, idx) => (
                  <div key={band.freq} className="flex flex-col items-center justify-end h-full group">
                    <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 group-hover:text-[#FF2A4D] mb-2 font-bold">
                      {band.gain > 0 ? `+${band.gain.toFixed(1)}` : band.gain.toFixed(1)}
                    </span>
                    
                    <div className="relative flex-1 flex items-center justify-center w-full">
                      <input
                        type="range"
                        min="-12"
                        max="12"
                        step="0.5"
                        value={band.gain}
                        onChange={(e) => {
                          setActivePreset('Custom');
                          onUpdateBand(idx, parseFloat(e.target.value));
                        }}
                        className="h-28 sm:h-36 w-1.5 accent-[#FF2A4D] bg-zinc-800 rounded-full appearance-none cursor-pointer [writing-mode:vertical-lr] [direction:rtl]"
                      />
                    </div>

                    <span className="text-[9px] sm:text-[10px] font-mono text-zinc-300 font-bold mt-2">
                      {band.freq}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Crossfade & Transitions Settings */}
        {activeTab === 'crossfade' && (
          <div className="space-y-4 my-4 animate-fadeIn">
            
            {/* Primary Crossfade Master Toggle */}
            <div 
              onClick={onToggleCrossfade}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                crossfadeEnabled
                  ? 'bg-gradient-to-r from-[#260a10] to-[#150508] border-[#FF2A4D]/40 shadow-[0_0_24px_rgba(255,42,77,0.15)]'
                  : 'bg-zinc-900/50 border-white/5 opacity-75'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${
                  crossfadeEnabled ? 'bg-[#FF2A4D] text-black' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">Track Crossfade</h3>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded-full ${
                      crossfadeEnabled ? 'bg-[#FF2A4D]/20 text-[#FF2A4D]' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {crossfadeEnabled ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Seamlessly overlap and fade songs into each other without silence
                  </p>
                </div>
              </div>

              <div className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                crossfadeEnabled ? 'bg-[#FF2A4D]' : 'bg-zinc-700'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-black transition-transform ${
                  crossfadeEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </div>
            </div>

            {/* Crossfade Duration Slider & Presets */}
            <div className={`p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-3 transition-opacity ${
              crossfadeEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-[#FF2A4D]" />
                  Crossfade Duration:
                </span>
                <span className="font-mono text-sm font-black text-[#FF2A4D]">
                  {crossfadeDuration.toFixed(1)}s {crossfadeDuration === 4 ? '(Recommended)' : ''}
                </span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="1"
                max="12"
                step="0.5"
                value={crossfadeDuration}
                onChange={(e) => onChangeCrossfadeDuration(parseFloat(e.target.value))}
                className="w-full accent-[#FF2A4D] bg-zinc-800 h-2 rounded-lg cursor-pointer"
              />

              {/* Quick Step Buttons */}
              <div className="flex items-center justify-between gap-1 pt-1">
                {CROSSFADE_PRESETS.map((seconds) => (
                  <button
                    key={seconds}
                    onClick={() => onChangeCrossfadeDuration(seconds)}
                    className={`flex-1 py-1 text-xs font-mono font-bold rounded-lg transition-all ${
                      crossfadeDuration === seconds
                        ? 'bg-[#FF2A4D] text-black shadow'
                        : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300'
                    }`}
                  >
                    {seconds}s
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Waveform Curve Envelope Preview */}
            <div className={`p-4 rounded-2xl bg-zinc-950/70 border border-white/5 space-y-2.5 transition-opacity ${
              crossfadeEnabled ? 'opacity-100' : 'opacity-40'
            }`}>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 font-semibold text-zinc-300">
                  <Waves className="w-3.5 h-3.5 text-cyan-400" />
                  Transition Curve Preview:
                </span>
                <span className="font-mono text-[11px] text-[#FF2A4D]">
                  {crossfadeCurve === 'equalPower' ? 'Equal Power (0dB Dip)' : crossfadeCurve === 'exponential' ? 'Exponential Club Dip' : 'Smooth Linear'}
                </span>
              </div>

              {/* SVG Curve Graphic */}
              <div className="relative h-16 w-full rounded-xl bg-black/50 p-2 overflow-hidden border border-white/5 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 300 60" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="curveLime" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF2A4D" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#FF2A4D" stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="curveCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>

                  {/* Outgoing track curve (Lime) */}
                  <path 
                    d={crossfadeCurve === 'equalPower' 
                      ? "M 10 10 Q 150 15 290 55"
                      : crossfadeCurve === 'exponential'
                      ? "M 10 10 Q 80 50 290 55"
                      : "M 10 10 L 290 55"
                    }
                    fill="none" 
                    stroke="#FF2A4D" 
                    strokeWidth="2.5" 
                  />

                  {/* Incoming track curve (Cyan) */}
                  <path 
                    d={crossfadeCurve === 'equalPower' 
                      ? "M 10 55 Q 150 45 290 10"
                      : crossfadeCurve === 'exponential'
                      ? "M 10 55 Q 220 50 290 10"
                      : "M 10 55 L 290 10"
                    }
                    fill="none" 
                    stroke="#38bdf8" 
                    strokeWidth="2.5" 
                  />

                  {/* Center Cross point dot */}
                  <circle cx="150" cy="32" r="3.5" fill="#ffffff" />
                </svg>

                <div className="absolute left-3 top-2 text-[10px] font-mono text-[#FF2A4D] font-bold">
                  Track 1 Fade Out
                </div>
                <div className="absolute right-3 bottom-2 text-[10px] font-mono text-cyan-400 font-bold">
                  Track 2 Fade In
                </div>
              </div>

              {/* Curve Selection Pills */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-semibold">
                <button
                  onClick={() => onChangeCrossfadeCurve('equalPower')}
                  className={`py-1.5 px-2 rounded-xl transition-all border ${
                    crossfadeCurve === 'equalPower'
                      ? 'bg-[#FF2A4D]/20 border-[#FF2A4D]/40 text-[#FF2A4D]'
                      : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  Equal Power
                </button>
                <button
                  onClick={() => onChangeCrossfadeCurve('linear')}
                  className={`py-1.5 px-2 rounded-xl transition-all border ${
                    crossfadeCurve === 'linear'
                      ? 'bg-[#FF2A4D]/20 border-[#FF2A4D]/40 text-[#FF2A4D]'
                      : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  Linear
                </button>
                <button
                  onClick={() => onChangeCrossfadeCurve('exponential')}
                  className={`py-1.5 px-2 rounded-xl transition-all border ${
                    crossfadeCurve === 'exponential'
                      ? 'bg-[#FF2A4D]/20 border-[#FF2A4D]/40 text-[#FF2A4D]'
                      : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  Exponential
                </button>
              </div>
            </div>

            {/* Gapless Playback Toggle */}
            <div 
              onClick={onToggleGapless}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                gaplessMode
                  ? 'bg-[#21080d] border-emerald-500/40'
                  : 'bg-zinc-900/50 border-white/5 opacity-75'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  gaplessMode ? 'bg-emerald-400 text-black' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Gapless Pre-Buffering</h4>
                  <p className="text-[10px] text-zinc-400">Zero-latency buffer bridging across live albums &amp; mixes</p>
                </div>
              </div>
              <div className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                gaplessMode ? 'bg-emerald-400' : 'bg-zinc-700'
              }`}>
                <div className={`w-4 h-4 rounded-full bg-black transition-transform ${
                  gaplessMode ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </div>
            </div>

          </div>
        )}

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#FF2A4D]" />
            <span>Dual-Deck Audio Engine • {crossfadeEnabled ? `${crossfadeDuration}s Blend` : 'Direct Switch'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#FF2A4D] hover:bg-[#E0203E] text-black font-extrabold text-xs transition-colors shadow-md"
          >
            Apply &amp; Done
          </button>
        </div>

      </div>
    </div>
  );
};
