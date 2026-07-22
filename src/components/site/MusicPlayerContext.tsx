'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

type Track = {
  src: string;
  title: string;
  artist: string;
  cover: string;
};

export const TRACKS: Track[] = [
  {
    src: '/media/music/ipod-touch-ninajirachi.m4a',
    title: 'iPod touch',
    artist: 'Ninajirachi',
    cover: '/media/covers/iPod%20Touch_track_cover.jpg',
  },
  {
    src: '/media/music/Bumpa%20-%20Bibi.m4a',
    title: 'Bumpa',
    artist: 'Bibi',
    cover: '/media/covers/BUMPA_track_cover.jpg',
  },
  {
    src: '/media/music/Dracula%20-%20Jennie%20Remix%20-%20Tame%20Impala%20Jennie.m4a',
    title: 'Dracula',
    artist: 'JENNIE Remix — Tame Impala',
    cover: '/media/covers/Dracula_track_cover.jpg',
  },
  {
    src: '/media/music/Stayin%20Alive%20-%20Avu-chan.m4a',
    title: "Stayin' Alive",
    artist: 'Avu-chan',
    cover: "/media/covers/Stayin'%20Alive_track_cover.jpg",
  },
  {
    src: '/media/music/Telepathy%20Love%20feat%20Clara%20La%20San%20-%20Bnyx%20Clara%20La%20San.m4a',
    title: 'TELEPATHY LOVE',
    artist: 'BNYX® feat. Clara La San',
    cover: '/media/covers/TELEPATHY%20LOVE%20(feat.%20Clara%20La%20San)_track_cover.jpg',
  },
];

interface MusicPlayerContextValue {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  status: string;
  expanded: boolean;
  showLyrics: boolean;
  currentTrackIndex: number;
  currentTrack: Track;
  setExpanded: (expanded: boolean) => void;
  setShowLyrics: (show: boolean) => void;
  togglePlayback: () => Promise<void>;
  handleSeek: (value: number) => void;
  toggleMuted: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setCurrentTrackIndex: (index: number) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) throw new Error('useMusicPlayer must be used within MusicPlayerProvider');
  return ctx;
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [status, setStatus] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndexState] = useState(0);

  const currentTrack = TRACKS[currentTrackIndex]!;

  const loadTrack = useCallback((index: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const wasPlaying = !audio.paused;
    audio.pause();
    audio.src = TRACKS[index]!.src;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    setStatus('Loading track');
    if (wasPlaying) {
      audio.play().catch(() => setStatus('Unable to play this audio file.'));
    }
  }, []);

  const setCurrentTrackIndex = useCallback(
    (index: number) => {
      const next = ((index % TRACKS.length) + TRACKS.length) % TRACKS.length;
      setCurrentTrackIndexState(next);
      loadTrack(next);
    },
    [loadTrack],
  );

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex(currentTrackIndex + 1);
  }, [currentTrackIndex, setCurrentTrackIndex]);

  const previousTrack = useCallback(() => {
    setCurrentTrackIndex(currentTrackIndex - 1);
  }, [currentTrackIndex, setCurrentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = currentTrack.src;
    audio.load();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const pauseForPageExit = () => audio.pause();
    window.addEventListener('pagehide', pauseForPageExit);

    return () => {
      window.removeEventListener('pagehide', pauseForPageExit);
      audio.pause();
    };
  }, []);

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      setStatus('Loading track');
      try {
        await audio.play();
      } catch {
        setStatus('Unable to play this audio file.');
      }
    } else {
      audio.pause();
    }
  }, []);

  const handleSeek = useCallback((value: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = value;
    setCurrentTime(value);
  }, []);

  const toggleMuted = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  }, []);

  return (
    <MusicPlayerContext.Provider
      value={{
        audioRef,
        isPlaying,
        isMuted,
        currentTime,
        duration,
        status,
        expanded,
        showLyrics,
        currentTrackIndex,
        currentTrack,
        setExpanded,
        setShowLyrics,
        togglePlayback,
        handleSeek,
        toggleMuted,
        nextTrack,
        previousTrack,
        setCurrentTrackIndex,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration);
          setStatus('');
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => {
          setIsPlaying(true);
          setStatus(`Playing ${currentTrack.title}`);
        }}
        onPause={() => {
          setIsPlaying(false);
          setStatus('Paused');
        }}
        onWaiting={() => setStatus('Buffering track')}
        onCanPlay={() => setStatus((current) => (current === 'Buffering track' ? '' : current))}
        onEnded={() => {
          setIsPlaying(false);
          setStatus('Track ended');
          nextTrack();
        }}
        onError={() => setStatus('Audio file could not be loaded.')}
      />
    </MusicPlayerContext.Provider>
  );
}
