import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const chapters = [
  { number: '01', hindi: 'जन्म', english: 'Born', text: 'A melody begins inside a community—in fields, homes, festivals, work, celebration and grief.', image: 'https://images.pexels.com/photos/12585023/pexels-photo-12585023.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Hands playing a traditional string instrument' },
  { number: '02', hindi: 'याद', english: 'Remembered', text: 'It survives through memory, repeated by one voice and then carried by another.', image: 'https://images.pexels.com/photos/8520122/pexels-photo-8520122.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Generations sharing music together' },
  { number: '03', hindi: 'सुरक्षित', english: 'Preserved', text: 'The song is recorded with its artist, language, location and cultural story properly credited.', image: 'https://images.pexels.com/photos/11713445/pexels-photo-11713445.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Field recorder capturing sound outdoors' },
  { number: '04', hindi: 'विश्व तक', english: 'Shared', text: 'The local voice finds new listeners without losing its roots, identity or ownership.', image: 'https://images.pexels.com/photos/15937060/pexels-photo-15937060.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Folk musicians performing together' },
];

export function SoundJourney() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReduced = useReducedMotion();
  const touchStart = useRef(0);
  const chapter = chapters[activeIndex];
  const goTo = useCallback((index: number) => setActiveIndex(Math.max(0, Math.min(chapters.length - 1, index))), []);

  return (
    <section id="journey" data-theme="desert-folk" className="relative overflow-hidden bg-[var(--page-bg)] px-4 pb-16 pt-12 text-[var(--text-primary)] sm:px-6 sm:pb-20 sm:pt-16 lg:px-10 lg:pb-24 lg:pt-20">
      <div className="mx-auto max-w-[1400px]">
        <header className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--accent-primary)]">The Journey of a Folk Song</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-devanagari leading-[1.3]" style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)' }}>एक धुन गाँव से दुनिया तक कैसे पहुँचती है?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-[var(--text-secondary)] sm:text-base">Every recording carries a place, a person, a language and a story.</p>
        </header>

        <div className="mt-10 lg:mt-14" onKeyDown={(e) => { if (e.key === 'ArrowLeft') goTo(activeIndex - 1); if (e.key === 'ArrowRight') goTo(activeIndex + 1); }} onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }} onTouchEnd={(e) => { const delta = e.changedTouches[0].clientX - touchStart.current; if (Math.abs(delta) > 48) goTo(activeIndex + (delta < 0 ? 1 : -1)); }} tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Journey chapters">
          <div className="grid min-h-[430px] overflow-hidden rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--surface)] shadow-xl lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative min-h-[280px] overflow-hidden lg:min-h-[520px]">
              <AnimatePresence mode="wait">
                <motion.img key={chapter.number} src={chapter.image} alt={chapter.alt} initial={prefersReduced ? false : { opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={prefersReduced ? undefined : { opacity: 0 }} transition={{ duration: 0.45 }} className="absolute inset-0 h-full w-full object-cover" />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
              <span className="absolute bottom-5 left-5 font-display text-6xl font-bold text-[#F7C25A]">{chapter.number}</span>
            </div>
            <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-12">
              <AnimatePresence mode="wait">
                <motion.div key={chapter.number} initial={prefersReduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={prefersReduced ? undefined : { opacity: 0, y: -12 }} transition={{ duration: 0.35 }} aria-live="polite">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-primary)]">Chapter {chapter.number}</p>
                  <h3 className="mt-4 font-devanagari text-4xl leading-[1.25] sm:text-5xl">{chapter.hindi}<span className="ml-3 font-sans text-xl font-normal text-[var(--text-secondary)]">{chapter.english}</span></h3>
                  <p className="mt-6 max-w-md text-base leading-7 text-[var(--text-secondary)]">{chapter.text}</p>
                </motion.div>
              </AnimatePresence>
              <div className="mt-8">
                <div className="mb-5 h-1 overflow-hidden rounded-full bg-[var(--border-subtle)]"><motion.div animate={{ width: `${((activeIndex + 1) / chapters.length) * 100}%` }} className="h-full rounded-full bg-[var(--accent-primary)]" /></div>
                <div className="flex items-center justify-between gap-3">
                  <button type="button" onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0} aria-label="Previous journey chapter" className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-subtle)] disabled:opacity-35 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"><ChevronLeft /></button>
                  <div className="flex gap-2" aria-label="Choose chapter">{chapters.map((item, index) => <button key={item.number} type="button" onClick={() => goTo(index)} aria-label={`${item.hindi} — ${item.english}`} aria-current={index === activeIndex ? 'step' : undefined} className="group flex h-11 min-w-11 items-center justify-center"><span className={`block h-2 rounded-full transition-all ${index === activeIndex ? 'w-8 bg-[var(--accent-primary)]' : 'w-2 bg-[var(--text-secondary)]/35 group-hover:bg-[var(--text-secondary)]'}`} /></button>)}</div>
                  <button type="button" onClick={() => goTo(activeIndex + 1)} disabled={activeIndex === chapters.length - 1} aria-label="Next journey chapter" className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-subtle)] disabled:opacity-35 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"><ChevronRight /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
