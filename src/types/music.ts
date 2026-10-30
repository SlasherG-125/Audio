export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl: string;
  source: 'YouTube Music' | 'Lossless FLAC' | 'Local Device';
  sampleRate: string; // e.g., '48.0 kHz' | '96.0 kHz' | '192.0 kHz'
  bitDepth: string; // '24-bit' | '16-bit'
  bitrate: string; // '160 kbps Opus' | '1411 kbps FLAC' | '9216 kbps Hi-Res'
  accentColor: string;
  genre: string;
  year: number;
  lyrics: LyricLine[];
  isDownloaded?: boolean;
  fileSizeMb?: number;
  localFilePath?: string;
  downloadProgress?: number;
  syncedFromYt?: boolean;
}

export interface LyricLine {
  time: number; // in seconds
  text: string;
  translation?: string;
  romanization?: string;
  words?: { word: string; time: number; duration: number }[];
}

export interface SignalPathStage {
  title: string;
  subtitle: string;
  status: 'active' | 'bypassed' | 'optimal';
  details: { label: string; value: string }[];
  accentColor?: string;
}

export interface YouTubeAccount {
  id: string;
  name: string;
  email: string;
  handle: string;
  avatarUrl: string;
  isActive: boolean;
  likedSongsCount: number;
  playlistsCount: number;
  syncedAt: string;
  cookieAuthStatus: 'connected' | 'expired' | 'guest';
}

export type ActiveTab = 'feed' | 'search' | 'generator' | 'library' | 'apk';
