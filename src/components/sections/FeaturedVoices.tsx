import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { indiaFeaturedArtists as featuredArtists } from '@/data/phase3';
import { useAudio } from '@/components/audio/AudioProvider';

export function FeaturedVoices() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStart = useRef(0);
  const reduced = useReducedMotion();
  const { playTrack } = useAudio();
  const artist = featuredArtists[activeIndex];
  const select = useCallback((index: number) => setActiveIndex((index + featuredArtists.length) % featuredArtists.length), []);
  const play = () => playTrack({ id: `artist-${artist.id}`, title: artist.trackTitle, artist: artist.name, location: `${artist.region}, ${artist.country}`, language: artist.language, tradition: artist.tradition, artwork: artist.image, duration: 'Preview', credit: 'Demonstration profile', region: artist.region, addedOrder: 0 });

  return (
    <section id="artists" data-theme="ember-stage" className="overflow-hidden bg-[var(--page-bg)] px-4 py-16 text-[var(--text-primary)] sm:px-6 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--accent-primary)]">Featured Voices</p>
        <div className="mt-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><h2 className="max-w-3xl font-devanagari text-3xl leading-tight sm:text-4xl lg:text-5xl">जिन आवाज़ों से लोकधुनें जीवित हैं</h2><p className="max-w-lg text-sm leading-6 text-[var(--text-secondary)] sm:text-base">Meet demonstration artists and communities carrying generations of music forward.</p></div>
        <div className="mt-9 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] border border-[var(--border-subtle)]" onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }} onTouchEnd={(e) => { const delta = e.changedTouches[0].clientX - touchStart.current; if (Math.abs(delta) > 45) select(activeIndex + (delta < 0 ? 1 : -1)); }}>
            <AnimatePresence mode="wait"><motion.img key={artist.id} src={artist.image} alt={`Demonstration portrait for ${artist.name}`} initial={reduced ? false : { opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={reduced ? undefined : { opacity: 0 }} className="absolute inset-0 h-full w-full object-cover" /></AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[#38131b] via-[#38131b]/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: artist.accentColor }}>{artist.region} · {artist.language}</p>
              <h3 className="mt-2 font-devanagari text-3xl sm:text-4xl">{artist.name}</h3><p className="mt-3 max-w-xl text-sm leading-6 text-[#DEC8BB] sm:text-base">{artist.bio}</p>
              <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={play} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--accent-primary)] px-5 py-3 text-sm font-semibold text-[#3a1520] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"><Play className="h-4 w-4" fill="currentColor" />Listen to their music</button><button type="button" onClick={() => document.getElementById('archive')?.scrollIntoView()} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold">View artist story <ArrowRight className="h-4 w-4" /></button></div>
            </div>
          </div>
          <div className="flex flex-col rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 sm:p-7">
            <div className="mb-5 flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-secondary)]">Demonstration profiles</p><p className="mt-1 text-sm">{String(activeIndex + 1).padStart(2, '0')} / {String(featuredArtists.length).padStart(2, '0')}</p></div><div className="flex gap-2"><button onClick={() => select(activeIndex - 1)} aria-label="Previous artist" className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-subtle)]"><ChevronLeft /></button><button onClick={() => select(activeIndex + 1)} aria-label="Next artist" className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-subtle)]"><ChevronRight /></button></div></div>
            <div className="scrollbar-hide flex flex-1 snap-x snap-mandatory gap-2 overflow-x-auto lg:flex-col lg:justify-center lg:overflow-visible">{featuredArtists.map((item, index) => <button key={item.id} onClick={() => select(index)} aria-current={index === activeIndex ? 'true' : undefined} className={`group flex min-h-20 min-w-[78%] snap-center items-center gap-3 rounded-xl px-3 text-left transition sm:min-w-[55%] lg:min-h-14 lg:min-w-0 ${index === activeIndex ? 'bg-white/10' : 'hover:bg-white/5'}`}><span className="h-px transition-all" style={{ width: index === activeIndex ? 34 : 14, backgroundColor: index === activeIndex ? item.accentColor : 'var(--border-subtle)' }} /><span className="flex-1"><span className="block font-devanagari text-base">{item.name}</span><span className="block text-[11px] text-[var(--text-secondary)]">{item.region} · {item.tradition}</span></span></button>)}</div>
            <div className="mt-5 flex h-12 items-end gap-1" aria-hidden="true">{Array.from({ length: 32 }).map((_, i) => <motion.span key={i} animate={reduced ? undefined : { height: [`${15 + (i % 5) * 8}%`, `${35 + ((i * 7 + activeIndex * 9) % 60)}%`, `${15 + (i % 5) * 8}%`] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.025 }} className="flex-1 rounded-full" style={{ height: '30%', backgroundColor: artist.accentColor, opacity: 0.65 }} />)}</div>
          </div>
        </div>
        <div className="sr-only" aria-live="polite">Selected {artist.name}, {artist.region}. {artist.trackTitle}.</div>
      </div>
    </section>
  );
}
