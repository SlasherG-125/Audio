import { Track } from '../types/music';
import confetti from 'canvas-confetti';

/**
 * Downloads a song locally to the user's device (browser / Files).
 * Also triggers browser file download for the audio and .lrc synchronized lyrics.
 */
export async function downloadSongLocally(
  track: Track,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; localPath: string }> {
  const safeTitle = `${track.artist} - ${track.title}`.replace(/[/\\?%*:|"<>]/g, '_');
  const fileName = `${safeTitle}.mp3`;
  const lrcFileName = `${safeTitle}.lrc`;

  try {
    if (onProgress) onProgress(20);

    // Fetch the audio stream
    const response = await fetch(track.audioUrl);
    if (onProgress) onProgress(50);
    const blob = await response.blob();
    if (onProgress) onProgress(80);

    // Trigger local audio file download
    const audioUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(audioUrl);

    // Also generate and download .lrc synchronized lyrics file
    if (track.lyrics && track.lyrics.length > 0) {
      const lrcContent = generateLrcContent(track);
      const lrcBlob = new Blob([lrcContent], { type: 'text/plain;charset=utf-8' });
      const lrcUrl = window.URL.createObjectURL(lrcBlob);
      const lrcLink = document.createElement('a');
      lrcLink.href = lrcUrl;
      lrcLink.download = lrcFileName;
      document.body.appendChild(lrcLink);
      lrcLink.click();
      document.body.removeChild(lrcLink);
      window.URL.revokeObjectURL(lrcUrl);
    }

    if (onProgress) onProgress(100);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FF2A4D', '#ffffff', '#38bdf8']
    });

    return {
      success: true,
      localPath: `Music/Audio/${fileName}`
    };
  } catch (err) {
    console.warn('Direct fetch download blocked by CORS, falling back to direct anchor download', err);
    
    // Direct anchor fallback
    const a = document.createElement('a');
    a.href = track.audioUrl;
    a.download = fileName;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (onProgress) onProgress(100);
    return {
      success: true,
      localPath: `Music/Audio/${fileName}`
    };
  }
}

/**
 * Format timestamps into standard [mm:ss.xx] .lrc syntax
 */
function generateLrcContent(track: Track): string {
  const header = `[ti:${track.title}]\n[ar:${track.artist}]\n[al:${track.album}]\n[by:Audio v4.3.1]\n\n`;
  const lines = track.lyrics.map(l => {
    const mins = Math.floor(l.time / 60);
    const secs = Math.floor(l.time % 60);
    const hundredths = Math.floor((l.time % 1) * 100);
    const timeTag = `[${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}]`;
    return `${timeTag}${l.text}`;
  }).join('\n');

  return header + lines;
}
