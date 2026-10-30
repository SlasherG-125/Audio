import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { FeedTab } from './components/FeedTab';
import { SearchTab } from './components/SearchTab';
import { SmartMixGenerator } from './components/SmartMixGenerator';
import { LibraryTab } from './components/LibraryTab';
import { ApkTab } from './components/ApkTab';
import { NowPlayingBar } from './components/NowPlayingBar';
import { PlayerModal } from './components/PlayerModal';
import { SignalPathModal } from './components/SignalPathModal';
import { EqualizerModal } from './components/EqualizerModal';
import { ShareLyricsCardModal } from './components/ShareLyricsCardModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';
import { YouTubeSyncModal } from './components/YouTubeSyncModal';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { usePWAInstall } from './hooks/usePWAInstall';
import { ActiveTab, Track, YouTubeAccount } from './types/music';
import { CATALOG_TRACKS } from './data/mockCatalog';
import { downloadSongLocally } from './utils/localDownloader';

const INITIAL_YT_ACCOUNTS: YouTubeAccount[] = [
  {
    id: 'yt-acc-1',
    name: 'Ganesh Kushwaha',
    email: 'ganeshkush256@gmail.com',
    handle: '@ganeshkush',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    isActive: true,
    likedSongsCount: 128,
    playlistsCount: 14,
    syncedAt: 'Just now',
    cookieAuthStatus: 'connected',
  },
  {
    id: 'yt-acc-2',
    name: 'Ganesh Music & Vibes',
    email: 'ganesh.music@gmail.com',
    handle: '@ganeshmusic',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    isActive: false,
    likedSongsCount: 64,
    playlistsCount: 6,
    syncedAt: 'Yesterday',
    cookieAuthStatus: 'connected',
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');
  const [tracks, setTracks] = useState<Track[]>(CATALOG_TRACKS);
  
  // Modals state
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [isSignalPathOpen, setIsSignalPathOpen] = useState(false);
  const [isEqOpen, setIsEqOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isShareLyricsOpen, setIsShareLyricsOpen] = useState(false);
  const [isYouTubeSyncOpen, setIsYouTubeSyncOpen] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [miniPlayerMode, setMiniPlayerMode] = useState<'docked' | 'floating'>('docked');

  // YouTube Accounts & Sync state
  const [accounts, setAccounts] = useState<YouTubeAccount[]>(INITIAL_YT_ACCOUNTS);
  const [activeAccountId, setActiveAccountId] = useState<string>(INITIAL_YT_ACCOUNTS[0].id);
  const [isSyncingYouTube, setIsSyncingYouTube] = useState<boolean>(false);

  // Local Download tracking state
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  const activeAccount = accounts.find(a => a.id === activeAccountId) || accounts[0];

  const {
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
  } = useAudioPlayer();

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    if (isInstallable) {
      await install();
    } else {
      setIsApkModalOpen(true);
    }
  };

  // Perform local download of audio and .lrc synchronized lyrics
  const handleDownloadLocally = async (track: Track) => {
    setDownloadingId(track.id);
    setDownloadProgress(10);

    const result = await downloadSongLocally(track, (p) => {
      setDownloadProgress(p);
    });

    if (result.success) {
      setTracks(prev => prev.map(t => {
        if (t.id === track.id) {
          return {
            ...t,
            isDownloaded: true,
            localFilePath: result.localPath,
          };
        }
        return t;
      }));
    }

    setDownloadingId(null);
    setDownloadProgress(0);
  };

  const handleRemoveDownloaded = (trackId: string) => {
    setTracks(prev => prev.map(t => {
      if (t.id === trackId) {
        return {
          ...t,
          isDownloaded: false,
          localFilePath: undefined,
        };
      }
      return t;
    }));
  };

  // Switch active YouTube Music account
  const handleSwitchAccount = (acc: YouTubeAccount) => {
    setActiveAccountId(acc.id);
    setAccounts(prev => prev.map(a => ({
      ...a,
      isActive: a.id === acc.id
    })));
  };

  // Add new YouTube Music account
  const handleAddAccount = (newAcc: YouTubeAccount) => {
    setAccounts(prev => [newAcc, ...prev.map(a => ({ ...a, isActive: false }))]);
    setActiveAccountId(newAcc.id);
  };

  // Trigger YouTube Music account sync
  const handleSyncAccount = async (accountId: string) => {
    setIsSyncingYouTube(true);
    await new Promise(r => setTimeout(r, 1200));

    setAccounts(prev => prev.map(a => {
      if (a.id === accountId) {
        return {
          ...a,
          likedSongsCount: a.likedSongsCount + 4,
          syncedAt: 'Just now'
        };
      }
      return a;
    }));

    setIsSyncingYouTube(false);
  };

  const currentLyricLine = currentTrack.lyrics[activeLyricIndex]?.text || '';

  return (
    <div className="min-h-screen bg-[#050608] text-zinc-100 flex flex-col justify-between selection:bg-white selection:text-black">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSignalPath={() => setIsSignalPathOpen(true)}
        onOpenEq={() => setIsEqOpen(true)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
        onOpenYouTubeSync={() => setIsYouTubeSyncOpen(true)}
        activeAccount={activeAccount}
        isInstallable={isInstallable && !isInstalled}
        onInstallPwa={handleInstallClick}
      />

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pt-6">
        {activeTab === 'feed' && (
          <FeedTab
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayTrack={playTrack}
            onOpenApkModal={() => setIsApkModalOpen(true)}
            onOpenSignalPath={() => setIsSignalPathOpen(true)}
            onNavigateTab={setActiveTab}
            onDownloadLocally={handleDownloadLocally}
            downloadingId={downloadingId}
            downloadProgress={downloadProgress}
            activeAccount={activeAccount}
            onOpenYouTubeSync={() => setIsYouTubeSyncOpen(true)}
          />
        )}

        {activeTab === 'search' && (
          <SearchTab
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayTrack={playTrack}
            onDownloadLocally={handleDownloadLocally}
            downloadingId={downloadingId}
          />
        )}

        {activeTab === 'generator' && (
          <SmartMixGenerator
            tracks={tracks}
            onPlayTrack={playTrack}
          />
        )}

        {activeTab === 'library' && (
          <LibraryTab
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayTrack={playTrack}
            onOpenApkModal={() => setIsApkModalOpen(true)}
            onDownloadLocally={handleDownloadLocally}
            downloadingId={downloadingId}
            activeAccount={activeAccount}
            onOpenYouTubeSync={() => setIsYouTubeSyncOpen(true)}
            onRemoveDownloaded={handleRemoveDownloaded}
          />
        )}

        {activeTab === 'apk' && (
          <ApkTab
            onInstallPwa={handleInstallClick}
            isPwaInstallable={isInstallable}
          />
        )}
      </main>

      {/* Persistent Mini-Player (Docked Bar or Floating PiP Card) when outside PlayerModal */}
      {!isPlayerModalOpen && (
        <NowPlayingBar
          track={currentTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          activeLyricText={currentLyricLine}
          isCrossfading={isCrossfading}
          volume={volume}
          isMuted={isMuted}
          onTogglePlay={togglePlay}
          onNext={handleNext}
          onPrev={handlePrev}
          onSeek={seek}
          onSetVolume={setVolume}
          onToggleMute={() => setIsMuted(!isMuted)}
          onOpenPlayerModal={() => setIsPlayerModalOpen(true)}
          onOpenSignalPath={() => setIsSignalPathOpen(true)}
          miniPlayerMode={miniPlayerMode}
          onToggleMiniPlayerMode={setMiniPlayerMode}
        />
      )}

      {/* Full Screen Player Modal */}
      <PlayerModal
        isOpen={isPlayerModalOpen}
        onClose={() => setIsPlayerModalOpen(false)}
        track={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        activeLyricIndex={activeLyricIndex}
        volume={volume}
        isMuted={isMuted}
        isShuffle={isShuffle}
        repeatMode={repeatMode}
        queue={queue}
        onTogglePlay={togglePlay}
        onSeek={seek}
        onNext={handleNext}
        onPrev={handlePrev}
        onToggleShuffle={toggleShuffle}
        onToggleRepeat={toggleRepeat}
        onSetVolume={setVolume}
        onToggleMute={() => setIsMuted(!isMuted)}
        onSelectTrack={playTrack}
        onOpenSignalPath={() => setIsSignalPathOpen(true)}
        onOpenShareLyrics={() => setIsShareLyricsOpen(true)}
        onDownloadLocally={handleDownloadLocally}
        downloadingId={downloadingId}
        onEnterMiniPlayer={() => {
          setIsPlayerModalOpen(false);
          setMiniPlayerMode('floating');
        }}
      />

      {/* YouTube Music Multi-Account & Sync Modal */}
      <YouTubeSyncModal
        isOpen={isYouTubeSyncOpen}
        onClose={() => setIsYouTubeSyncOpen(false)}
        accounts={accounts}
        activeAccount={activeAccount}
        onSwitchAccount={handleSwitchAccount}
        onAddAccount={handleAddAccount}
        onSyncAccount={handleSyncAccount}
        isSyncing={isSyncingYouTube}
      />

      {/* Signal Path Modal (Poweramp 5-stage) */}
      <SignalPathModal
        isOpen={isSignalPathOpen}
        onClose={() => setIsSignalPathOpen(false)}
        track={currentTrack}
        bitPerfectMode={bitPerfectMode}
        studioClarity={studioClarity}
        bufferHealth={audioBufferHealth}
      />

      {/* Equalizer & Audio Transitions Modal */}
      <EqualizerModal
        isOpen={isEqOpen}
        onClose={() => setIsEqOpen(false)}
        eqBands={eqBands}
        onUpdateBand={updateEqBand}
        studioClarity={studioClarity}
        onToggleStudioClarity={() => setStudioClarity(!studioClarity)}
        bitPerfectMode={bitPerfectMode}
        onToggleBitPerfect={() => setBitPerfectMode(!bitPerfectMode)}
        crossfadeEnabled={crossfadeEnabled}
        onToggleCrossfade={() => setCrossfadeEnabled(!crossfadeEnabled)}
        crossfadeDuration={crossfadeDuration}
        onChangeCrossfadeDuration={setCrossfadeDuration}
        crossfadeCurve={crossfadeCurve}
        onChangeCrossfadeCurve={setCrossfadeCurve}
        gaplessMode={gaplessMode}
        onToggleGapless={() => setGaplessMode(!gaplessMode)}
        isCrossfading={isCrossfading}
      />

      {/* Share Lyrics Card Modal */}
      <ShareLyricsCardModal
        isOpen={isShareLyricsOpen}
        onClose={() => setIsShareLyricsOpen(false)}
        track={currentTrack}
        lyrics={currentTrack.lyrics}
        activeLyricIndex={activeLyricIndex}
      />

      {/* APK Download & Mobile Install Modal */}
      <ApkDownloadModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
        onInstallPwa={handleInstallClick}
        isPwaInstallable={isInstallable}
      />

      {/* iOS Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#050608] border border-white/10 p-6 shadow-2xl text-white">
            <h3 className="text-lg font-bold text-white">Install on iPhone / iPad</h3>
            <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
              1. Tap the <strong>Share</strong> button in Safari toolbar.<br />
              2. Scroll down and tap <strong>Add to Home Screen</strong>.<br />
              3. Launch Audio like a native app from your home screen!
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-[#FF2A4D] hover:bg-[#E0203E] text-white font-extrabold py-2.5 text-xs transition-colors shadow-lg shadow-red-500/20"
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
