import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { AudioTrack } from '@/data/phase3';

interface AudioState {
  track: AudioTrack | null;
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  loading: boolean;
  error: string;
  playTrack: (track: AudioTrack) => void;
  toggle: () => void;
  seek: (value: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  close: () => void;
}

const AudioContext = createContext<AudioState | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [track, setTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audio.muted = muted;
    audioRef.current = audio;
    const update = () => { setCurrentTime(audio.currentTime); setDuration(Number.isFinite(audio.duration) ? audio.duration : 0); setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0); };
    const ended = () => { setIsPlaying(false); setProgress(100); };
    const failed = () => { setIsPlaying(false); setLoading(false); setError('playback'); };
    const ready = () => { setLoading(false); setDuration(Number.isFinite(audio.duration) ? audio.duration : 0); };
    const waiting = () => setLoading(true);
    audio.addEventListener('timeupdate', update);
    audio.addEventListener('ended', ended);
    audio.addEventListener('error', failed);
    audio.addEventListener('canplay', ready);
    audio.addEventListener('waiting', waiting);
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', update);
      audio.removeEventListener('ended', ended);
      audio.removeEventListener('error', failed);
      audio.removeEventListener('canplay', ready);
      audio.removeEventListener('waiting', waiting);
    };
  // The media element is intentionally created once; volume and mute changes are
  // synchronized by their dedicated callbacks below.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isPlaying || track?.audioUrl) return;
    const timer = window.setInterval(() => setProgress((p) => (p >= 100 ? 0 : p + 0.18)), 200);
    return () => window.clearInterval(timer);
  }, [isPlaying, track]);

  const playTrack = useCallback((next: AudioTrack) => {
    const audio = audioRef.current;
    const changed = next.id !== track?.id;
    if (changed) {
      audio?.pause();
      setTrack(next);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
      setError('');
      if (audio && next.audioUrl) { setLoading(true); audio.src = next.audioUrl; audio.load(); }
    }
    setIsPlaying(true);
    if (next.audioUrl) audio?.play().catch(() => { setIsPlaying(false); setLoading(false); setError('playback'); });
  }, [track]);

  const toggle = useCallback(() => {
    if (!track) return;
    setIsPlaying((playing) => {
      const next = !playing;
      if (track.audioUrl) {
        if (next) audioRef.current?.play().catch(() => { setIsPlaying(false); setError('playback'); });
        else audioRef.current?.pause();
      }
      return next;
    });
  }, [track]);

  const seek = useCallback((value: number) => {
    const safe = Math.max(0, Math.min(100, value));
    setProgress(safe);
    const audio = audioRef.current;
    if (audio?.duration) audio.currentTime = (safe / 100) * audio.duration;
  }, []);

  const setVolume = useCallback((value: number) => {
    const safe = Math.max(0, Math.min(1, value));
    setVolumeState(safe);
    if (safe > 0) setMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = safe;
      if (safe > 0) audioRef.current.muted = false;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((value) => {
      const next = !value;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  }, []);

  const close = useCallback(() => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setTrack(null);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setLoading(false);
    setError('');
  }, []);

  const value = useMemo(() => ({ track, isPlaying, progress, currentTime, duration, volume, muted, loading, error, playTrack, toggle, seek, setVolume, toggleMute, close }), [track, isPlaying, progress, currentTime, duration, volume, muted, loading, error, playTrack, toggle, seek, setVolume, toggleMute, close]);
  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
}
