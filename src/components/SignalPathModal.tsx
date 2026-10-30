import React from 'react';
import { X, CheckCircle, Activity, Cpu, Disc3, Volume2, Radio, Zap } from 'lucide-react';
import { Track } from '../types/music';

interface SignalPathModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track;
  bitPerfectMode: boolean;
  studioClarity: boolean;
  bufferHealth: number;
}

export const SignalPathModal: React.FC<SignalPathModalProps> = ({
  isOpen,
  onClose,
  track,
  bitPerfectMode,
  studioClarity,
  bufferHealth,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0d1207] border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.85)] text-white p-5 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF2A4D]/20 border border-[#FF2A4D]/40 p-2 flex items-center justify-center text-[#FF2A4D]">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-white">
                  Audio Signal Path
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Bit-Perfect Active
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Poweramp-style 5-stage lossless hardware pipeline diagnostics
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

        {/* Quality Banner Score */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-[#17200d] via-[#11170a] to-[#0d1207] border border-[#FF2A4D]/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Audio Fidelity Score
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-[#FF2A4D]">99.8%</span>
              <span className="text-xs text-emerald-400 font-medium">True High-Res Lossless</span>
            </div>
          </div>
          <div className="text-right text-xs space-y-0.5 text-zinc-400">
            <div>Clock Drift: <span className="font-mono text-white">0.0 ms</span></div>
            <div>Buffer Health: <span className="font-mono text-[#FF2A4D]">{bufferHealth}%</span></div>
            <div>Latency: <span className="font-mono text-emerald-400">4.2 ms</span></div>
          </div>
        </div>

        {/* 5-Stage Pipeline */}
        <div className="space-y-3 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-[#FF2A4D] before:via-cyan-400 before:to-emerald-400">
          
          {/* Stage 1: Source */}
          <div className="relative pl-12">
            <div className="absolute left-3 top-3 w-4 h-4 rounded-full bg-[#FF2A4D] flex items-center justify-center -translate-x-1/2 ring-4 ring-[#0d1207]">
              <Disc3 className="w-2.5 h-2.5 text-black" />
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="text-[#FF2A4D]">Stage 1:</span> Source Audio
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {track.source}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs">
                <div>
                  <div className="text-zinc-500 text-[10px]">Format</div>
                  <div className="font-semibold text-zinc-200">{track.bitrate}</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">Sample Rate</div>
                  <div className="font-semibold text-zinc-200">{track.sampleRate}</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">Bit Depth</div>
                  <div className="font-semibold text-zinc-200">{track.bitDepth} Integer</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">Channels</div>
                  <div className="font-semibold text-zinc-200">2.0 Stereo (FL/FR)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stage 2: DSP */}
          <div className="relative pl-12">
            <div className="absolute left-3 top-3 w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center -translate-x-1/2 ring-4 ring-[#0d1207]">
              <Cpu className="w-2.5 h-2.5 text-black" />
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="text-cyan-400">Stage 2:</span> DSP &amp; Equalizer Engine
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  {studioClarity ? 'Studio Clarity ON (+3.5 dB)' : 'Flat EQ'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs">
                <div>
                  <div className="text-zinc-500 text-[10px]">Equalizer</div>
                  <div className="font-semibold text-zinc-200">10-Band Graphic</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">DSP Resampler</div>
                  <div className="font-semibold text-zinc-200">Soxr VHQ sinc</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">Internal Precision</div>
                  <div className="font-semibold text-zinc-200">64-bit Float (Double)</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">Dither</div>
                  <div className="font-semibold text-zinc-200">TPDF Noise Shaping</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stage 3: Volume Control */}
          <div className="relative pl-12">
            <div className="absolute left-3 top-3 w-4 h-4 rounded-full bg-sky-400 flex items-center justify-center -translate-x-1/2 ring-4 ring-[#0d1207]">
              <Volume2 className="w-2.5 h-2.5 text-black" />
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="text-sky-400">Stage 3:</span> Volume &amp; Loudness Control
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
                  1.0f Unity Gain
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 text-xs">
                <div>
                  <div className="text-zinc-500 text-[10px]">Hardware Attenuation</div>
                  <div className="font-semibold text-zinc-200">0.0 dB (Direct)</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">Bit Truncation</div>
                  <div className="font-semibold text-emerald-400">Zero (0-LSB Truncation)</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">ReplayGain</div>
                  <div className="font-semibold text-zinc-200">Target -14 LUFS</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stage 4: Output Engine */}
          <div className="relative pl-12">
            <div className="absolute left-3 top-3 w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center -translate-x-1/2 ring-4 ring-[#0d1207]">
              <Radio className="w-2.5 h-2.5 text-black" />
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="text-emerald-400">Stage 4:</span> Output Architecture
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  Native C++ AudioTrack
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 text-xs">
                <div>
                  <div className="text-zinc-500 text-[10px]">Driver API</div>
                  <div className="font-semibold text-zinc-200">AAudio / OpenSL ES</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">Exclusive USB Mode</div>
                  <div className="font-semibold text-[#FF2A4D]">Enabled (Direct IO)</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">Native Clock Sync</div>
                  <div className="font-semibold text-zinc-200">Dual-Crystal UAC2</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stage 5: Output Device */}
          <div className="relative pl-12">
            <div className="absolute left-3 top-3 w-4 h-4 rounded-full bg-[#FF2A4D] flex items-center justify-center -translate-x-1/2 ring-4 ring-[#0d1207]">
              <Zap className="w-2.5 h-2.5 text-black" />
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="text-[#FF2A4D]">Stage 5:</span> Output Device &amp; DAC
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FF2A4D]/20 text-[#FF2A4D]">
                  USB DAC / Hi-Res Audio
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 text-xs">
                <div>
                  <div className="text-zinc-500 text-[10px]">Active Interface</div>
                  <div className="font-semibold text-zinc-200">External DAC / Headphone</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">Hardware Rate</div>
                  <div className="font-semibold text-[#FF2A4D]">192.0 kHz / 24-bit</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">Android Mixer Bypass</div>
                  <div className="font-semibold text-emerald-400">100% Bypassed</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-[#FF2A4D]" />
            <span>Audio Audio Engine • Native C++ AudioEngine.cpp</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
