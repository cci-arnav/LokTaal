import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Play, ArrowRight } from 'lucide-react';
import { globalDiscoveryRegions, indiaDiscoveryRegions } from '@/data/regions';
import { InteractiveWaveform } from '@/components/audio/InteractiveWaveform';
import { useAudio } from '@/components/audio/AudioProvider';
import { useI18n } from '@/contexts/I18nContext';

interface RegionalDiscoveryProps {
  soundEnabled: boolean;
  onPlayTone: (index: number) => void;
}

export function RegionalDiscovery({ soundEnabled, onPlayTone }: RegionalDiscoveryProps) {
  const prefersReduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const { playTrack } = useAudio();
  const { t } = useI18n();

  const region = indiaDiscoveryRegions[activeIndex];

  const nextRegion = useCallback(() => {
    setActiveIndex((i) => (i + 1) % indiaDiscoveryRegions.length);
  }, []);

  const prevRegion = useCallback(() => {
    setActiveIndex((i) => (i - 1 + indiaDiscoveryRegions.length) % indiaDiscoveryRegions.length);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.3;
      if (!inView) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextRegion();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevRegion();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nextRegion, prevRegion]);

  // Wheel-based switching when section is active (non-hijacking)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let wheelTimeout: ReturnType<typeof setTimeout> | null = null;
    let accumulatedDelta = 0;

    const onWheel = (e: WheelEvent) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5;
      if (!inView || isHovering) return;

      // Only intercept when the section is centered and delta is mostly horizontal
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        accumulatedDelta += e.deltaX;
        if (wheelTimeout) clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          if (accumulatedDelta > 30) nextRegion();
          else if (accumulatedDelta < -30) prevRegion();
          accumulatedDelta = 0;
        }, 80);
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [nextRegion, prevRegion, isHovering]);

  // Touch swipe
  const touchStartX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) nextRegion();
      else prevRegion();
    }
  };

  return (
    <section
      id="regions"
      ref={sectionRef}
      data-theme="forest-echo"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
      style={{
        backgroundColor: 'var(--page-bg)',
        color: 'var(--text-primary)',
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Oversized background word */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden="true">
        <AnimatePresence mode="wait">
          <motion.span
            key={region.id}
            className="font-devanagari font-normal"
            style={{
              fontSize: 'clamp(8rem, 25vw, 22rem)',
              color: 'var(--accent-primary)',
              opacity: 0.06,
            }}
            initial={prefersReduced ? undefined : { opacity: 0, y: 30 }}
            animate={{ opacity: 0.06, y: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {region.bgWord}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="mb-10 text-center lg:mb-14">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: 'var(--accent-primary)' }}
          >
            Discover by Place
          </p>
          <h2
            className="mx-auto mt-4 max-w-2xl font-devanagari leading-[1.25]"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2.75rem)' }}
          >
            हर क्षेत्र की अपनी आवाज़ है।
          </h2>
          <p
            className="mx-auto mt-3 max-w-lg text-sm sm:text-base"
            style={{ color: 'var(--text-secondary)' }}
          >
            Explore music through the landscapes, languages and communities that shaped it.
          </p>
          <p
            className="mt-2 text-xs font-medium italic"
            style={{ color: 'var(--accent-primary)' }}
          >
            Choose a region. Feel its rhythm.
          </p>
        </div>

        {/* Two-column layout */}
        <div
          className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* LEFT: Region info */}
          <div className="flex flex-col justify-center">
            {/* Region number + nav */}
            <div className="mb-6 flex items-center gap-4">
              <span
                className="font-display text-6xl font-bold"
                style={{ color: 'var(--accent-primary)', opacity: 0.3 }}
              >
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-col gap-1">
                {indiaDiscoveryRegions.map((r, i) => (
                  <button
                    key={r.id}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Select ${r.name}`}
                    aria-pressed={i === activeIndex}
                    className="flex items-center gap-2 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm"
                    style={{
                      // @ts-expect-error CSS custom property
                      '--tw-ring-color': 'var(--accent-primary)',
                      '--tw-ring-offset-color': 'var(--page-bg)',
                    }}
                  >
                    <span
                      className="h-px transition-all duration-300"
                      style={{
                        width: i === activeIndex ? '32px' : '12px',
                        backgroundColor: i === activeIndex ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      }}
                    />
                    <span
                      className="text-xs font-medium transition-colors"
                      style={{
                        color: i === activeIndex ? 'var(--text-primary)' : 'var(--text-secondary)',
                        opacity: i === activeIndex ? 1 : 0.5,
                      }}
                    >
                      {r.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Region title */}
            <AnimatePresence mode="wait">
              <motion.div
                key={region.id}
                initial={prefersReduced ? undefined : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReduced ? undefined : { opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <MapPin className="h-4 w-4" style={{ color: 'var(--accent-primary)' }} />
                  <span>{region.name}, {region.country}</span>
                </div>
                <h3
                  className="mt-2 font-devanagari"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
                >
                  {region.name}
                </h3>
                <p
                  className="mt-4 max-w-md text-sm leading-relaxed sm:text-base"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {region.shortDescription}
                </p>

                {/* Meta info */}
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <div>
                    <span className="opacity-50">Language: </span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{region.language}</span>
                  </div>
                  <div>
                    <span className="opacity-50">Tradition: </span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{region.tradition}</span>
                  </div>
                </div>

                {/* Featured track */}
                <div
                  className="mt-6 rounded-xl border p-4"
                  style={{
                    borderColor: 'var(--border-subtle)',
                    backgroundColor: 'color-mix(in srgb, var(--surface) 50%, transparent)',
                  }}
                >
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--accent-primary)' }}>
                    Featured Track
                  </p>
                  <p className="mt-1 font-devanagari text-lg" style={{ color: 'var(--text-primary)' }}>
                    {region.trackTitle}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {region.artist}
                  </p>
                </div>

                {/* Explore button */}
                <button
                  type="button"
                  onClick={() => playTrack({ id: `region-${region.id}`, title: region.trackTitle, artist: region.artist, location: `${region.name}, ${region.country}`, language: region.language, tradition: region.tradition, artwork: region.image, duration: 'Preview', credit: 'Demonstration regional profile', region: region.name, addedOrder: 0 })}
                  className="group mt-6 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: 'var(--page-bg)',
                    // @ts-expect-error CSS custom property
                    '--tw-ring-color': 'var(--accent-primary)',
                    '--tw-ring-offset-color': 'var(--page-bg)',
                  }}
                >
                  <Play className="h-4 w-4 fill-current" />
                  Explore {region.name}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: Image + waveform */}
          <div className="relative">
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-[16/10]"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={region.id}
                  src={region.image}
                  alt={`Folk music from ${region.name}, ${region.country}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={prefersReduced ? false : { opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={prefersReduced ? undefined : { opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  loading="lazy"
                />
              </AnimatePresence>
              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, var(--page-bg) 0%, transparent 50%, transparent 100%)',
                }}
              />

              {/* Interactive waveform overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <InteractiveWaveform
                  accent={region.accentColor}
                  bars={32}
                  isPlaying={isHovering}
                  progress={50}
                />
              </div>

              {/* Region number badge */}
              <div className="absolute right-4 top-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur-md"
                  style={{
                    borderColor: 'var(--accent-primary)',
                    backgroundColor: 'color-mix(in srgb, var(--page-bg) 60%, transparent)',
                  }}
                >
                  <span className="font-display text-lg font-bold" style={{ color: 'var(--accent-primary)' }}>
                    {String(activeIndex + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            {/* Arrow controls */}
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={prevRegion}
                aria-label="Previous region"
                className="flex h-11 w-11 items-center justify-center rounded-full border transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                  // @ts-expect-error CSS custom property
                  '--tw-ring-color': 'var(--accent-primary)',
                  '--tw-ring-offset-color': 'var(--page-bg)',
                }}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Rhythm beads */}
              <RhythmBeads
                accent={region.accentColor}
                soundEnabled={soundEnabled}
                onPlayTone={onPlayTone}
              />

              <button
                type="button"
                onClick={nextRegion}
                aria-label="Next region"
                className="flex h-11 w-11 items-center justify-center rounded-full border transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                  // @ts-expect-error CSS custom property
                  '--tw-ring-color': 'var(--accent-primary)',
                  '--tw-ring-offset-color': 'var(--page-bg)',
                }}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-[var(--border-subtle)] pt-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div><p className="text-[11px] font-semibold uppercase tracking-[.3em] text-[var(--accent-primary)]">{t('global.eyebrow')}</p><h3 className="mt-3 font-devanagari text-2xl sm:text-3xl">{t('global.title')}</h3></div>
            <p className="max-w-xl text-sm leading-6 text-[var(--text-secondary)]">{t('global.body')}</p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">{globalDiscoveryRegions.map((item) => <article key={item.id} className="flex items-center gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4"><img src={item.image} alt="" loading="lazy" className="h-20 w-24 rounded-xl object-cover" /><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-primary)]">{t('global.upcoming')}</p><h4 className="mt-1 font-semibold">{item.name}</h4><p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-secondary)]">{item.tradition} · {item.language}</p></div></article>)}</div>
        </div>

        {/* aria-live region for screen readers */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Now viewing {region.name}, {region.country}. {region.shortDescription}
        </div>
      </div>
    </section>
  );
}

function RhythmBeads({
  accent,
  soundEnabled,
  onPlayTone,
}: {
  accent: string;
  soundEnabled: boolean;
  onPlayTone: (index: number) => void;
}) {
  const prefersReduced = useReducedMotion();
  const [activeBead, setActiveBead] = useState(-1);

  const handleBeadClick = (i: number) => {
    setActiveBead(i);
    onPlayTone(i);
    setTimeout(() => setActiveBead(-1), 400);
  };

  return (
    <div className="flex items-center gap-2.5" role="group" aria-label={soundEnabled ? 'Rhythm beads, sound on' : 'Rhythm beads, sound off'}>
      {[0, 1, 2, 3, 4].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => handleBeadClick(i)}
          aria-label={`Play beat ${i + 1}`}
          className="group relative flex h-9 w-9 items-center justify-center rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-90"
          style={{
            // @ts-expect-error CSS custom property
            '--tw-ring-color': accent,
            '--tw-ring-offset-color': 'var(--page-bg)',
          }}
        >
          {/* Bead */}
          <motion.span
            className="block rounded-full"
            style={{
              backgroundColor: activeBead === i ? accent : `${accent}44`,
              width: activeBead === i ? '28px' : '18px',
              height: activeBead === i ? '28px' : '18px',
            }}
            animate={
              prefersReduced ? undefined : activeBead === i
                ? { scale: [1, 1.3, 1] }
                : {}
            }
            transition={{ duration: 0.3 }}
          />
          {/* Ripple */}
          {activeBead === i && !prefersReduced && (
            <motion.span
              className="absolute inset-0 rounded-full border"
              style={{ borderColor: accent }}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
