import React, { useState } from 'react';
import { X, Download, Copy, Check, Sparkles, Image as ImageIcon, Type } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Track, LyricLine } from '../types/music';

interface ShareLyricsCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track;
  lyrics: LyricLine[];
  activeLyricIndex: number;
}

export const ShareLyricsCardModal: React.FC<ShareLyricsCardModalProps> = ({
  isOpen,
  onClose,
  track,
  lyrics,
  activeLyricIndex,
}) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([
    activeLyricIndex,
    Math.min(activeLyricIndex + 1, lyrics.length - 1),
  ]);
  const [mode, setMode] = useState<'song' | 'lyrics'>('song');
  const [themePalette, setThemePalette] = useState<'lime' | 'cover' | 'dark' | 'sunset'>('lime');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const toggleLine = (index: number) => {
    if (selectedIndices.includes(index)) {
      if (selectedIndices.length > 1) {
        setSelectedIndices(selectedIndices.filter(i => i !== index));
      }
    } else {
      if (selectedIndices.length < 5) {
        setSelectedIndices([...selectedIndices, index].sort((a, b) => a - b));
      }
    }
  };

  const getCardStyle = () => {
    switch (themePalette) {
      case 'lime':
        return {
          bg: 'bg-gradient-to-br from-[#1a230c] via-[#0f1508] to-[#080b04]',
          border: 'border-[#FF2A4D]/40',
          accent: 'text-[#FF2A4D]',
          highlight: 'bg-[#FF2A4D]/20 text-[#FF2A4D]'
        };
      case 'cover':
        return {
          bg: 'bg-gradient-to-br from-indigo-950/90 via-slate-900 to-black',
          border: 'border-cyan-500/40',
          accent: 'text-cyan-400',
          highlight: 'bg-cyan-500/20 text-cyan-300'
        };
      case 'sunset':
        return {
          bg: 'bg-gradient-to-br from-rose-950/80 via-zinc-900 to-amber-950/40',
          border: 'border-rose-500/40',
          accent: 'text-rose-400',
          highlight: 'bg-rose-500/20 text-rose-300'
        };
      case 'dark':
      default:
        return {
          bg: 'bg-zinc-950',
          border: 'border-white/10',
          accent: 'text-white',
          highlight: 'bg-white/10 text-white'
        };
    }
  };

  const cardStyle = getCardStyle();

  const handleCopyCard = () => {
    const textLines = selectedIndices.map(i => lyrics[i]?.text).filter(Boolean).join('\n');
    const quote = `"${textLines}"\n\n— ${track.title} by ${track.artist} (via Audio v4.3.1)`;
    navigator.clipboard.writeText(quote);
    setCopied(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div 
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0e1208] border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.85)] text-white p-5 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#FF2A4D]" />
            <h2 className="text-lg font-bold text-white">Share Lyrics Card</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Mode & Palette Controls */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-white/5 text-xs font-semibold">
            <button
              onClick={() => setMode('song')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                mode === 'song' ? 'bg-[#FF2A4D] text-black shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Song Mode
            </button>
            <button
              onClick={() => setMode('lyrics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                mode === 'lyrics' ? 'bg-[#FF2A4D] text-black shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              Lyrics Mode
            </button>
          </div>

          {/* Palette Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-400 font-medium mr-1">Theme:</span>
            <button
              onClick={() => setThemePalette('lime')}
              className={`w-6 h-6 rounded-full bg-[#FF2A4D] border-2 ${
                themePalette === 'lime' ? 'border-white scale-110 shadow-lg' : 'border-transparent'
              }`}
              title="Audio Lime"
            />
            <button
              onClick={() => setThemePalette('cover')}
              className={`w-6 h-6 rounded-full bg-cyan-400 border-2 ${
                themePalette === 'cover' ? 'border-white scale-110 shadow-lg' : 'border-transparent'
              }`}
              title="Cover Tone"
            />
            <button
              onClick={() => setThemePalette('sunset')}
              className={`w-6 h-6 rounded-full bg-rose-500 border-2 ${
                themePalette === 'sunset' ? 'border-white scale-110 shadow-lg' : 'border-transparent'
              }`}
              title="Sunset Muted"
            />
            <button
              onClick={() => setThemePalette('dark')}
              className={`w-6 h-6 rounded-full bg-zinc-800 border-2 ${
                themePalette === 'dark' ? 'border-white scale-110 shadow-lg' : 'border-transparent'
              }`}
              title="Midnight Dark"
            />
          </div>
        </div>

        {/* The Rendered Lyric Card Preview */}
        <div className="mt-5 flex justify-center">
          <div 
            id="lastwave-lyric-card"
            className={`w-full max-w-md p-6 rounded-3xl border ${cardStyle.border} ${cardStyle.bg} shadow-2xl relative overflow-hidden transition-all duration-300`}
          >
            {/* Top Brand watermark */}
            <div className="flex items-center justify-between text-xs opacity-75 mb-4">
              <div className="flex items-center gap-1.5">
                <img src="/icon.svg" alt="logo" className="w-4 h-4" />
                <span className="font-extrabold tracking-tight text-white">Audio</span>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-wider opacity-60">
                Synced Lyrics
              </span>
            </div>

            {/* If Song Mode: Album art + Track info */}
            {mode === 'song' && (
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-white/10">
                <img 
                  src={track.coverUrl} 
                  alt={track.title} 
                  className="w-14 h-14 rounded-2xl object-cover shadow-md"
                />
                <div className="truncate">
                  <h4 className="font-bold text-base text-white truncate">
                    {track.title}
                  </h4>
                  <p className="text-xs text-zinc-300 truncate">
                    {track.artist}
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                    {track.album}
                  </p>
                </div>
              </div>
            )}

            {/* Selected Lyric Lines */}
            <div className="space-y-3.5 my-3">
              {selectedIndices.map((idx) => {
                const line = lyrics[idx];
                if (!line) return null;
                return (
                  <div key={idx} className="group cursor-pointer">
                    <p className="text-base sm:text-lg font-bold tracking-tight text-white leading-relaxed">
                      {line.text}
                    </p>
                    {line.romanization && (
                      <p className="text-xs text-zinc-400 font-normal mt-0.5">
                        {line.romanization}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer timestamp and attribution */}
            <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
              <div className="flex items-center gap-1">
                <span>{track.genre}</span>
                <span>•</span>
                <span>{track.sampleRate}</span>
              </div>
              <div className="font-mono text-[#FF2A4D]">
                lastwave.pages.dev
              </div>
            </div>
          </div>
        </div>

        {/* Line Selector Drawer */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
            Select Lines (Up to 5):
          </label>
          <div className="max-h-32 overflow-y-auto space-y-1.5 p-2 rounded-2xl bg-zinc-900/60 border border-white/5">
            {lyrics.map((line, idx) => {
              const isSelected = selectedIndices.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => toggleLine(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#FF2A4D]/20 text-[#FF2A4D] border border-[#FF2A4D]/30'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="truncate mr-2">{line.text}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={handleCopyCard}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Card Copied!' : 'Copy Lyric Card'}</span>
          </button>

          <button
            onClick={() => {
              handleCopyCard();
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FF2A4D] hover:bg-[#E0203E] text-black font-extrabold text-xs sm:text-sm shadow-[0_0_20px_rgba(255,42,77,0.35)] transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Share &amp; Export</span>
          </button>
        </div>

      </div>
    </div>
  );
};
