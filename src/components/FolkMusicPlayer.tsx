import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Bookmark,
  Share2,
  MapPin,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react';
import type { FeaturedTrack } from '@/data/featuredTracks';
import { useAudio } from '@/components/audio/AudioProvider';

interface FolkMusicPlayerProps {
  track: FeaturedTrack;
}

export function FolkMusicPlayer({ track }: FolkMusicPlayerProps) {
  const prefersReduced = useReducedMotion();
  const { track: globalTrack, isPlaying: globalPlaying, progress: globalProgress, playTrack, toggle, seek, volume, setVolume } = useAudio();
  const [muted, setMuted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  const isCurrent = globalTrack?.id === track.id;
  const isPlaying = isCurrent && globalPlaying;
  const progress = isCurrent ? globalProgress : 0;
  const selectTrack = () => {
    if (isCurrent) toggle();
    else playTrack({ id: track.id, title: track.title, artist: track.artist, location: track.location, language: track.language, tradition: track.category, artwork: track.artwork, duration: track.duration, credit: track.verified ? 'Community credit recorded' : 'Demonstration credit', region: track.region, addedOrder: 0 });
  };

  const currentTime = formatTime((progress / 100) * 272); // 4:32 = 272s
  const accent = track.accent;

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <motion.div
      key={track.id}
      initial={prefersReduced ? undefined : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative w-full max-w-sm rounded-2xl border border-sand/15 bg-indigo-midnight/70 p-5 shadow-2xl backdrop-blur-xl"
      style={{
        boxShadow: `0 20px 60px -20px ${accent}33, 0 8px 32px -8px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Header label */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-devanagari text-sm text-ivory/90">अभी गूँज रहा है</p>
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: accent }}
          >
            Now Echoing
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }}
          />
          <span className="text-[10px] uppercase tracking-wider text-sand/60">Live</span>
        </div>
      </div>

      {/* Artwork + track info */}
      <div className="flex items-center gap-3.5">
        <div className="relative shrink-0">
          <div
            className="absolute inset-0 rounded-full opacity-50 blur-md"
            style={{ backgroundColor: accent }}
          />
          <img
            src={track.artwork}
            alt={`Folk artist from ${track.region}`}
            className="relative h-16 w-16 rounded-full border-2 object-cover"
            style={{ borderColor: accent }}
            loading="lazy"
          />
          <button
            type="button"
            onClick={selectTrack}
            aria-label={isPlaying ? 'Pause track' : 'Play track'}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-indigo-midnight/40 transition-colors hover:bg-indigo-midnight/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 text-ivory" fill="currentColor" />
            ) : (
              <Play className="ml-0.5 h-6 w-6 text-ivory" fill="currentColor" />
            )}
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-devanagari text-base font-medium text-ivory">
            {track.title}
          </h3>
          <p className="truncate text-xs text-sand/70">{track.artist}</p>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-sand/50">
            <MapPin className="h-3 w-3 shrink-0" style={{ color: accent }} />
            <span className="truncate">{track.location}</span>
          </div>
        </div>
      </div>

      {/* Category / Language badges */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-medium"
          style={{ backgroundColor: `${accent}1a`, color: accent }}
        >
          {track.category}
        </span>
        <span className="rounded-full bg-sand/10 px-2 py-0.5 text-[10px] text-sand/60">
          {track.language}
        </span>
        {track.verified && (
          <span className="flex items-center gap-0.5 rounded-full bg-forest/30 px-2 py-0.5 text-[10px] text-ivory/80">
            <BadgeCheck className="h-3 w-3" style={{ color: accent }} />
            Community Credit
          </span>
        )}
      </div>

      {/* Waveform */}
      <div className="mt-4 flex h-10 items-center gap-[2px]">
        {Array.from({ length: 40 }).map((_, i) => {
          const height = isPlaying
            ? 20 + Math.abs(Math.sin(i * 0.5 + progress * 0.1)) * 60
            : 8 + Math.abs(Math.sin(i * 0.5)) * 20;
          const passed = (i / 40) * 100 < progress;
          return (
            <motion.div
              key={i}
              className="flex-1 rounded-full"
              style={{
                backgroundColor: passed ? accent : 'rgba(232, 215, 185, 0.2)',
              }}
              animate={
                prefersReduced
                  ? undefined
                  : isPlaying
                    ? { height: [height * 0.5, height, height * 0.7] }
                    : { height }
              }
              transition={
                prefersReduced
                  ? { duration: 0 }
                  : {
                      duration: 0.4 + (i % 5) * 0.1,
                      repeat: isPlaying ? Infinity : 0,
                      ease: 'easeInOut',
                    }
              }
            />
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <div
          className="h-1 w-full cursor-pointer overflow-hidden rounded-full bg-sand/15"
          role="slider"
          aria-label="Track progress"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            seek(((e.clientX - rect.left) / rect.width) * 100);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') seek(progress + 5);
            if (e.key === 'ArrowLeft') seek(progress - 5);
          }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: accent }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-sand/50">
          <span>{currentTime}</span>
          <span>{track.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setMuted(!muted); setVolume(muted ? 0.8 : 0); }}
            aria-label={muted || volume === 0 ? 'Unmute' : 'Mute'}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-sand/5 text-sand/60 transition-colors hover:bg-sand/10 hover:text-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
          >
            {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setSaved(!saved)}
            aria-label={saved ? 'Remove bookmark' : 'Save track'}
            aria-pressed={saved}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-sand/5 transition-colors hover:bg-sand/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
            style={{ color: saved ? accent : 'rgba(232, 215, 185, 0.6)' }}
          >
            <Bookmark className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share track"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-sand/5 text-sand/60 transition-colors hover:bg-sand/10 hover:text-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          className="group flex items-center gap-1 text-[11px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron rounded-sm"
          style={{ color: accent }}
        >
          View artist story
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Share confirmation */}
      <AnimatePresence>
        {shared && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-forest px-3 py-1 text-[10px] text-ivory shadow-lg"
          >
            Link copied
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
