import React from 'react';
import { 
  HardDrive, Play, Trash2, CheckCircle2, Music, Shuffle, 
  Download, RefreshCw, Check, PlaySquare, ArrowDownToLine, Folder
} from 'lucide-react';
import { Track, YouTubeAccount } from '../types/music';

interface LibraryTabProps {
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onOpenApkModal: () => void;
  onDownloadLocally: (track: Track) => Promise<void>;
  downloadingId: string | null;
  activeAccount: YouTubeAccount;
  onOpenYouTubeSync: () => void;
  onRemoveDownloaded: (trackId: string) => void;
}

export const LibraryTab: React.FC<LibraryTabProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onDownloadLocally,
  downloadingId,
  activeAccount,
  onOpenYouTubeSync,
  onRemoveDownloaded,
}) => {
  const downloadedTracks = tracks.filter(t => t.isDownloaded);
  const cloudTracks = tracks.filter(t => !t.isDownloaded);

  const totalStorageMb = downloadedTracks.reduce((acc, t) => acc + (t.fileSizeMb || 5), 0);

  return (
    <div className="space-y-8 animate-fadeIn pb-32">
      
      {/* Apple TV Library & Offline Vault Banner */}
      <div className="p-8 sm:p-10 rounded-3xl tv-glass border border-white/15 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white shadow-lg">
              <HardDrive className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  Library &amp; Local Downloads
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  Storage Active
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                <span className="text-white font-semibold">{downloadedTracks.length} Saved to Device</span>
                <span aria-hidden="true">·</span>
                <span>{totalStorageMb.toFixed(1)} MB Used</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#FF2A4D] font-mono">Music/Audio/</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                if (downloadedTracks.length > 0) {
                  onPlayTrack(downloadedTracks[0]);
                }
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-zinc-200 text-black font-extrabold text-sm shadow-lg transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Play All Local</span>
            </button>
            <button
              onClick={() => {
                if (downloadedTracks.length > 0) {
                  const randomTrack = downloadedTracks[Math.floor(Math.random() * downloadedTracks.length)];
                  onPlayTrack(randomTrack);
                }
              }}
              className="p-3 rounded-2xl tv-glass-pill text-zinc-300 hover:text-white transition-all"
              title="Shuffle Local Tracks"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Storage details & YouTube sync summary */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between text-xs text-zinc-400 gap-3">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-[#FF2A4D]" />
            <span>Files stored with embedded ID3v2 tags &amp; millisecond synchronized .lrc lyrics</span>
          </div>

          <button
            onClick={onOpenYouTubeSync}
            className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
          >
            <PlaySquare className="w-3.5 h-3.5 text-red-500" />
            <span>Synced YT Account: <strong className="text-white">{activeAccount.name}</strong></span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Locally Downloaded Songs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
          <span className="font-bold text-white text-sm">Offline Device Songs (Available without Internet)</span>
          <span>{downloadedTracks.length} files in Music/Audio</span>
        </div>

        {downloadedTracks.length === 0 ? (
          <div className="p-14 text-center rounded-3xl tv-glass border border-white/10 text-zinc-400">
            <Music className="w-12 h-12 mx-auto text-zinc-600 mb-3" />
            <h4 className="text-lg font-bold text-white">No songs stored locally</h4>
            <p className="text-xs text-zinc-500 mt-1">
              Tap &quot;Download Locally&quot; on any track below to save the audio file &amp; .lrc lyrics to your phone.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {downloadedTracks.map((track, idx) => {
              const isCurrent = track.id === currentTrack.id;
              const isDownloading = downloadingId === track.id;

              return (
                <div
                  key={track.id}
                  onClick={() => onPlayTrack(track)}
                  className={`p-4 rounded-2xl cursor-pointer tv-card transition-all flex items-center justify-between group ${
                    isCurrent
                      ? 'bg-white/15 border border-white/30 text-white shadow-xl'
                      : 'bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/15 text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-4 truncate">
                    <span className="w-5 text-center text-xs font-mono text-zinc-500">
                      {idx + 1}
                    </span>

                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-md"
                    />

                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white truncate">
                          {track.title}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                          Local FLAC
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400 truncate mt-0.5">
                        <span>{track.artist}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#FF2A4D] font-mono text-[11px]">{track.sampleRate}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-[11px]">{track.fileSizeMb || 5.0} MB</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pl-2">
                    {/* Re-download / export to disk */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownloadLocally(track);
                      }}
                      disabled={isDownloading}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white text-zinc-200 hover:text-black font-semibold text-xs transition-colors"
                      title="Save / Export audio file & lyrics to browser"
                    >
                      {isDownloading ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ArrowDownToLine className="w-3.5 h-3.5" />
                      )}
                      <span className="hidden sm:inline">Export File</span>
                    </button>

                    {/* Delete from local storage */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveDownloaded(track.id);
                      }}
                      className="p-2 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete from Offline Vault"
                    >
                      <Trash2 className="w-4 h-4" />
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
        )}
      </div>

      {/* SECTION 2: Synced YouTube Music Cloud Tracks with 1-Tap Download */}
      {cloudTracks.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
            <span className="font-bold text-white text-sm">
              YouTube Music Cloud Tracks (Available for Local Download)
            </span>
            <span>1-Tap to Save Locally</span>
          </div>

          <div className="space-y-2">
            {cloudTracks.map((track) => {
              const isDownloading = downloadingId === track.id;

              return (
                <div
                  key={track.id}
                  onClick={() => onPlayTrack(track)}
                  className="p-4 rounded-2xl cursor-pointer tv-card transition-all flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-200"
                >
                  <div className="flex items-center gap-4 truncate">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-md"
                    />

                    <div className="truncate">
                      <h4 className="text-sm font-bold text-white truncate">
                        {track.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400 truncate mt-0.5">
                        <span>{track.artist}</span>
                        <span aria-hidden="true">·</span>
                        <span>{track.album}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-zinc-300 font-mono text-[11px]">{track.sampleRate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pl-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownloadLocally(track);
                      }}
                      disabled={isDownloading}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF2A4D] hover:bg-[#E0203E] text-black font-extrabold text-xs shadow-md transition-all active:scale-95"
                    >
                      {isDownloading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Download Locally</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
