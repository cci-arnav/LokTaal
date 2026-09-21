import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, useReducedMotion, type MotionValue } from 'framer-motion';

// Chapter data — demonstration content for the scroll story
const chapters = [
  {
    number: '01',
    hindi: 'जन्म',
    english: 'Born',
    text: 'A melody begins inside a community—in fields, homes, festivals, work, celebration and grief.',
    image:
      'https://images.pexels.com/photos/12585023/pexels-photo-12585023.jpeg?auto=compress&cs=tinysrgb&w=1000',
    alt: 'Close-up of hands playing a traditional string instrument',
  },
  {
    number: '02',
    hindi: 'याद',
    english: 'Remembered',
    text: 'It survives through memory, repeated by one voice and then carried by another.',
    image:
      'https://images.pexels.com/photos/8520122/pexels-photo-8520122.jpeg?auto=compress&cs=tinysrgb&w=1000',
    alt: 'Older and younger generations sharing music together',
  },
  {
    number: '03',
    hindi: 'सुरक्षित',
    english: 'Preserved',
    text: 'The song is recorded with its artist, language, location and cultural story properly credited.',
    image:
      'https://images.pexels.com/photos/11713445/pexels-photo-11713445.jpeg?auto=compress&cs=tinysrgb&w=1000',
    alt: 'Portable field recorder capturing audio outdoors',
  },
  {
    number: '04',
    hindi: 'विश्व तक',
    english: 'Shared',
    text: 'The local voice finds new listeners without losing its roots, identity or ownership.',
    image:
      'https://images.pexels.com/photos/15937060/pexels-photo-15937060.jpeg?auto=compress&cs=tinysrgb&w=1000',
    alt: 'Folk musicians performing for an audience',
  },
];

export function SoundJourney() {
  const prefersReduced = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <section
      data-theme="desert-folk"
      className="relative"
      style={{
        backgroundColor: 'var(--page-bg)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Section header */}
      <div className="mx-auto max-w-[1600px] px-4 pt-16 sm:px-6 sm:pt-20 lg:px-10">
        <div className="text-center">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: 'var(--accent-primary)' }}
          >
            The Journey of a Folk Song
          </p>
          <h2
            className="mx-auto mt-4 max-w-2xl font-devanagari leading-[1.25]"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2.75rem)' }}
          >
            एक धुन गाँव से दुनिया तक कैसे पहुँचती है?
          </h2>
          <p
            className="mx-auto mt-3 max-w-lg text-sm sm:text-base"
            style={{ color: 'var(--text-secondary)' }}
          >
            Every recording carries a place, a person, a language and a story.
          </p>
        </div>
      </div>

      {isDesktop && !prefersReduced ? (
        <DesktopJourney />
      ) : (
        <MobileJourney />
      )}
    </section>
  );
}

function DesktopJourney() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  const activeChapter = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 1, 2, 3]);
  const rhythmLineProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const [chapterIndex, setChapterIndex] = useState(0);

  useEffect(() => {
    const unsub = activeChapter.on('change', (v) => setChapterIndex(Math.round(v)));
    return () => unsub();
  }, [activeChapter]);

  return (
    <div ref={scrollRef} style={{ height: '300vh' }} className="relative">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-2 gap-8 px-6 lg:px-10">
          {/* Left: sticky visual */}
          <div className="relative flex h-[70vh] items-center justify-center">
            {/* Rhythm line through chapters */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 400 500"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
            >
              <motion.path
                d="M200 0 Q120 125 200 250 Q280 375 200 500"
                stroke="var(--rhythm-line)"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ pathLength: rhythmLineProgress, opacity: 0.4 }}
              />
              {/* Chapter beat markers */}
              {chapters.map((ch, i) => {
                const y = 50 + i * 130;
                const isActive = i === chapterIndex;
                return (
                  <g key={i}>
                    <circle
                      cx={200}
                      cy={y}
                      r={isActive ? 8 : 5}
                      fill={isActive ? 'var(--accent-primary)' : 'var(--surface-raised)'}
                      stroke="var(--accent-primary)"
                      strokeWidth="1.5"
                      style={{ transition: 'r 0.4s ease, fill 0.4s ease' }}
                    />
                    {isActive && (
                      <motion.circle
                        cx={200}
                        cy={y}
                        r="14"
                        fill="none"
                        stroke="var(--accent-primary)"
                        strokeWidth="1"
                        initial={{ scale: 1, opacity: 0.6 }}
                        animate={{ scale: 1.8, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Image with mask reveal */}
            <div className="relative h-[50vh] w-[50vh] max-w-full overflow-hidden rounded-2xl">
              {chapters.map((ch, i) => (
                <motion.img
                  key={ch.number}
                  src={ch.image}
                  alt={ch.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ y: imageY }}
                  initial={false}
                  animate={{
                    opacity: i === chapterIndex ? 1 : 0,
                    scale: i === chapterIndex ? 1 : 1.05,
                    clipPath:
                      i === chapterIndex
                        ? 'inset(0% 0% 0% 0%)'
                        : 'inset(100% 0% 0% 0%)',
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  loading="lazy"
                />
              ))}
              {/* Image overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, var(--page-bg) 0%, transparent 50%)',
                }}
              />
              {/* Chapter number on image */}
              <div className="absolute bottom-4 left-4">
                <motion.span
                  key={chapterIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="font-display text-5xl font-bold"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  {chapters[chapterIndex].number}
                </motion.span>
              </div>
            </div>
          </div>

          {/* Right: chapter text */}
          <div className="flex h-[70vh] flex-col justify-center">
            <div className="relative h-full">
              {chapters.map((ch, i) => (
                <motion.div
                  key={ch.number}
                  className="absolute inset-0 flex flex-col justify-center"
                  animate={{
                    opacity: i === chapterIndex ? 1 : 0,
                    y: i === chapterIndex ? 0 : 30,
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <div className="flex items-baseline gap-3">
                    <span
                      className="font-display text-2xl font-bold"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      {ch.number}
                    </span>
                    <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                      Chapter
                    </span>
                  </div>
                  <h3
                    className="mt-3 font-devanagari"
                    style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
                  >
                    {ch.hindi}
                    <span
                      className="ml-3 font-sans text-xl"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {ch.english}
                    </span>
                  </h3>
                  <p
                    className="mt-5 max-w-md text-base leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {ch.text}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Progress rhythm track */}
            <div className="mt-8">
              <div
                className="h-1 w-full overflow-hidden rounded-full"
                style={{ backgroundColor: 'var(--border-subtle)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ width: progressWidth, backgroundColor: 'var(--accent-primary)' }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                <span>Birth</span>
                <span>Memory</span>
                <span>Preservation</span>
                <span>World</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileJourney() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {/* Vertical rhythm line */}
      <div className="relative">
        <svg
          className="absolute left-6 top-0 h-full w-12"
          viewBox="0 0 48 100"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M24 0 Q12 25 24 50 Q36 75 24 100"
            stroke="var(--rhythm-line)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity={0.4}
          />
        </svg>

        <div className="space-y-12 pl-16">
          {chapters.map((ch, i) => (
            <MobileChapter key={ch.number} chapter={ch} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileChapter({
  chapter,
  index,
}: {
  chapter: (typeof chapters)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const prefersReduced = useReducedMotion();

  return (
    <div ref={ref} className="relative">
      {/* Beat marker */}
      <div
        className="absolute -left-14 top-2 flex h-6 w-6 items-center justify-center rounded-full border-2"
        style={{
          borderColor: 'var(--accent-primary)',
          backgroundColor: inView ? 'var(--accent-primary)' : 'var(--surface)',
        }}
      >
        <span className="text-[9px] font-bold" style={{ color: 'var(--page-bg)' }}>
          {index + 1}
        </span>
      </div>

      <motion.div
        initial={prefersReduced ? undefined : { opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="relative mb-4 h-48 overflow-hidden rounded-xl">
          <img
            src={chapter.image}
            alt={chapter.alt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, var(--page-bg) 0%, transparent 60%)',
            }}
          />
          <span
            className="absolute bottom-3 left-3 font-display text-3xl font-bold"
            style={{ color: 'var(--accent-primary)' }}
          >
            {chapter.number}
          </span>
        </div>
        <h3 className="font-devanagari text-2xl">
          {chapter.hindi}
          <span className="ml-2 font-sans text-lg" style={{ color: 'var(--text-secondary)' }}>
            {chapter.english}
          </span>
        </h3>
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {chapter.text}
        </p>
      </motion.div>
    </div>
  );
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    setMatches(m.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    m.addEventListener('change', handler);
    return () => m.removeEventListener('change', handler);
  }, [query]);
  return matches;
}
