import React, { useState, useMemo } from 'react';
import { Search, Play, Download, Check, RefreshCw } from 'lucide-react';
import { Track } from '../types/music';

interface SearchTabProps {
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onDownloadLocally: (track: Track) => Promise<void>;
  downloadingId: string | null;
}

const GENRE_CHIPS = ['All', 'Synthwave', 'Lo-Fi Chill', 'Darksynth', 'Ambient Indie', 'Drum & Bass', 'Electronic', 'Soul & Groove'];

export const SearchTab: React.FC<SearchTabProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onDownloadLocally,
  downloadingId,
}) => {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  const filteredTracks = useMemo(() => {
    return tracks.filter(t => {
      const matchQuery = 
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.artist.toLowerCase().includes(query.toLowerCase()) ||
        t.album.toLowerCase().includes(query.toLowerCase()) ||
        t.genre.toLowerCase().includes(query.toLowerCase());
      
      const matchGenre = selectedGenre === 'All' || t.genre.toLowerCase().includes(selectedGenre.toLowerCase());
      return matchQuery && matchGenre;
    });
  }, [tracks, query, selectedGenre]);

  return (
    <div className="space-y-8 animate-fadeIn pb-32">
      
      {/* Apple TV Search Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Search YouTube Music
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Browse albums, songs, artists, and download directly to your local device
          </p>
        </div>

        {/* Large tvOS Search Bar */}
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Artists, songs, lyrics, or genres..."
            className="w-full pl-14 pr-12 py-4 rounded-2xl tv-glass border border-white/15 text-white placeholder-zinc-500 text-base focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all shadow-xl"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {GENRE_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setSelectedGenre(chip)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedGenre === chip
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'tv-glass-pill text-zinc-400 hover:text-white'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
          <span>{filteredTracks.length} Results</span>
          <span>1-Tap Local Storage Available</span>
        </div>

        {/* Apple TV Track List Rows */}
        <div className="space-y-2">
          {filteredTracks.map((track, idx) => {
            const isCurrent = track.id === currentTrack.id;
            const isDownloading = downloadingId === track.id;

            return (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track)}
                className={`p-3.5 sm:p-4 rounded-2xl cursor-pointer tv-card transition-all flex items-center justify-between group ${
                  isCurrent
                    ? 'bg-white/15 border border-white/30 text-white shadow-xl'
                    : 'bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/15 text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-4 truncate">
                  <span className="w-5 text-center text-xs font-mono text-zinc-500">
                    {idx + 1}
                  </span>

                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                    </div>
                  </div>

                  <div className="truncate">
                    <h4 className="text-sm font-bold text-white truncate">
                      {track.title}
                    </h4>
                    
                    {/* Clean unboxed Apple metadata */}
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 truncate mt-0.5">
                      <span>{track.artist}</span>
                      <span aria-hidden="true">·</span>
                      <span>{track.album}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-zinc-300 font-mono text-[11px]">{track.sampleRate}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action Tools: High-Visibility Local Download Button */}
                <div className="flex items-center gap-3 shrink-0 pl-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownloadLocally(track);
                    }}
                    disabled={isDownloading}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      track.isDownloaded
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-white/10 hover:bg-white text-zinc-200 hover:text-black border border-white/10 shadow-sm'
                    }`}
                  >
                    {isDownloading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FF2A4D]" />
                        <span className="hidden sm:inline">Saving...</span>
                      </>
                    ) : track.isDownloaded ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span className="hidden sm:inline">Downloaded</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Download Locally</span>
                      </>
                    )}
                  </button>

                  {isCurrent && isPlaying ? (
                    <div className="flex items-end gap-0.5 h-3.5 pr-1">
                      <span className="w-1 bg-[#FF2A4D] animate-eq-1" />
                      <span className="w-1 bg-[#FF2A4D] animate-eq-2" />
                      <span className="w-1 bg-[#FF2A4D] animate-eq-3" />
                    </div>
                  ) : (
                    <button className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white group-hover:text-black flex items-center justify-center text-zinc-300 transition-colors">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
