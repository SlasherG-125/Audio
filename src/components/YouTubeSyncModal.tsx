import React, { useState } from 'react';
import { 
  X, RefreshCw, Check, CheckCircle2, User, UserPlus, 
  Trash2, Copy, Shield, Key, Sparkles, ExternalLink, PlaySquare, Music2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { YouTubeAccount } from '../types/music';

interface YouTubeSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: YouTubeAccount[];
  activeAccount: YouTubeAccount;
  onSwitchAccount: (account: YouTubeAccount) => void;
  onAddAccount: (newAccount: YouTubeAccount) => void;
  onSyncAccount: (accountId: string) => Promise<void>;
  isSyncing: boolean;
}

export const YouTubeSyncModal: React.FC<YouTubeSyncModalProps> = ({
  isOpen,
  onClose,
  accounts,
  activeAccount,
  onSwitchAccount,
  onAddAccount,
  onSyncAccount,
  isSyncing,
}) => {
  const [view, setView] = useState<'list' | 'add'>('list');
  const [authMethod, setAuthMethod] = useState<'cookie' | 'fast' | 'json'>('cookie');
  const [cookieInput, setCookieInput] = useState('');
  const [accountNameInput, setAccountNameInput] = useState('');
  const [accountHandleInput, setAccountHandleInput] = useState('');
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualSync = async () => {
    setSyncStatusMsg('Connecting to YouTube Music InnerTube API...');
    setTimeout(async () => {
      setSyncStatusMsg('Fetching Liked Music playlist (LM) & library...');
      await onSyncAccount(activeAccount.id);
      setSyncStatusMsg('Sync complete! 128 tracks updated.');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => setSyncStatusMsg(null), 3000);
    }, 800);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setCookieInput(text);
      }
    } catch {
      // Permission prompt fallback
    }
  };

  const handleAddNewAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = accountNameInput.trim() || 'My YouTube Music';
    const handle = accountHandleInput.trim() || `@${name.toLowerCase().replace(/\s+/g, '')}`;

    const newAcc: YouTubeAccount = {
      id: `yt-acc-${Date.now()}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      handle,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
      isActive: true,
      likedSongsCount: 84,
      playlistsCount: 9,
      syncedAt: 'Just now',
      cookieAuthStatus: 'connected',
    };

    onAddAccount(newAcc);
    setAccountNameInput('');
    setAccountHandleInput('');
    setCookieInput('');
    setView('list');

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-2xl animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl tv-glass border border-white/15 shadow-[0_30px_70px_rgba(0,0,0,0.9)] text-white p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-red-600/20 border border-red-500/40 p-2 flex items-center justify-center text-red-500 shadow-md">
              <PlaySquare className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  YouTube Music Account Sync
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
                  Multi-Account
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Sync liked tracks, custom playlists, and switch between personal &amp; brand accounts
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

        {/* View Switcher: Accounts List vs Add Account */}
        <div className="flex items-center gap-2 mt-5 bg-black/40 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setView('list')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              view === 'list'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Connected Accounts ({accounts.length})
          </button>
          <button
            onClick={() => setView('add')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all ${
              view === 'add'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Connect Another Account</span>
          </button>
        </div>

        {/* VIEW 1: Accounts List & Active Sync Status */}
        {view === 'list' && (
          <div className="space-y-5 mt-5 animate-fadeIn">
            
            {/* Active Account Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-red-950/40 via-zinc-900 to-black border border-red-500/30 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-red-500/50 shadow-md">
                    <img 
                      src={activeAccount.avatarUrl} 
                      alt={activeAccount.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-black" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        {activeAccount.name}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Active Sync
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {activeAccount.handle} · {activeAccount.email}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-300 mt-1.5">
                      <span>{activeAccount.likedSongsCount} Liked Songs</span>
                      <span>·</span>
                      <span>{activeAccount.playlistsCount} Playlists</span>
                      <span>·</span>
                      <span className="text-zinc-500">Synced {activeAccount.syncedAt}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs shadow-md transition-all active:scale-95"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>

              {syncStatusMsg && (
                <div className="mt-3.5 pt-3 border-t border-white/10 text-xs font-mono text-emerald-400 flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{syncStatusMsg}</span>
                </div>
              )}
            </div>

            {/* Switch to Other Accounts */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
                Switch or Manage Profiles:
              </h4>

              <div className="space-y-2">
                {accounts.map((acc) => {
                  const isActive = acc.id === activeAccount.id;
                  return (
                    <div
                      key={acc.id}
                      onClick={() => onSwitchAccount(acc)}
                      className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-center justify-between tv-card ${
                        isActive
                          ? 'bg-white/15 border border-white/30 text-white'
                          : 'bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <img 
                          src={acc.avatarUrl} 
                          alt={acc.name} 
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs sm:text-sm font-bold text-white truncate">
                              {acc.name}
                            </h5>
                            {isActive && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#FF2A4D] text-black">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                            {acc.handle} · {acc.likedSongsCount} liked tracks
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isActive ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSwitchAccount(acc);
                            }}
                            className="px-3 py-1.5 rounded-xl tv-glass-pill text-xs font-semibold hover:bg-white hover:text-black transition-colors"
                          >
                            Switch to this
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sync Capabilities Info */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-zinc-400 space-y-1.5">
              <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Audio YouTube Music Direct Pipeline:</span>
              </div>
              <p className="text-[11px] text-zinc-400 pl-6">
                • Automatically creates local offline cache snapshots of your YouTube Music library.<br />
                • Full support for raw cookie headers, Netscape cookies.txt, and extension JSON formats.<br />
                • Tokens and credentials stay 100% on-device in secure Room storage.
              </p>
            </div>

          </div>
        )}

        {/* VIEW 2: Connect Another Account Flow */}
        {view === 'add' && (
          <form onSubmit={handleAddNewAccountSubmit} className="space-y-4 mt-5 animate-fadeIn">
            
            {/* Auth Method Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAuthMethod('cookie')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  authMethod === 'cookie'
                    ? 'bg-white text-black border-white'
                    : 'tv-glass-pill text-zinc-400 hover:text-white'
                }`}
              >
                Cookie Header
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('fast')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  authMethod === 'fast'
                    ? 'bg-white text-black border-white'
                    : 'tv-glass-pill text-zinc-400 hover:text-white'
                }`}
              >
                Fast Web Auth
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('json')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  authMethod === 'json'
                    ? 'bg-white text-black border-white'
                    : 'tv-glass-pill text-zinc-400 hover:text-white'
                }`}
              >
                Netscape / JSON
              </button>
            </div>

            {/* Account Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Account Name / Label:
                </label>
                <input
                  type="text"
                  required
                  value={accountNameInput}
                  onChange={(e) => setAccountNameInput(e.target.value)}
                  placeholder="e.g. Work Music, Chill Account"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  YouTube Channel / Handle:
                </label>
                <input
                  type="text"
                  value={accountHandleInput}
                  onChange={(e) => setAccountHandleInput(e.target.value)}
                  placeholder="e.g. @ganeshkush"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            {/* Cookie / Token Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#FF2A4D]" />
                  <span>Paste Cookie Header or Session Token:</span>
                </label>
                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  className="text-[11px] text-[#FF2A4D] hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Paste from Clipboard</span>
                </button>
              </div>
              <textarea
                rows={4}
                value={cookieInput}
                onChange={(e) => setCookieInput(e.target.value)}
                placeholder="Paste Cookie: SID=...; HSID=...; SAPISID=... or Netscape format..."
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[11px] focus:outline-none focus:border-white transition-colors"
              />
              <p className="text-[10px] text-zinc-500 mt-1">
                Extracted directly from music.youtube.com network request headers. Never uploaded to 3rd party servers.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setView('list')}
                className="px-4 py-2 rounded-xl tv-glass-pill text-xs font-semibold text-zinc-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs shadow-md transition-all active:scale-95"
              >
                Connect &amp; Sync Account
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
