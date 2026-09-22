import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, MapPin, Music2, Calendar, User, FileText, Languages, ShieldCheck } from 'lucide-react';

// Mock archive record — DEMONSTRATION DATA. Replace with real API data.
const archiveRecord = {
  trackTitle: 'माटी री पुकार',
  artistCredit: 'कमला देवी एवं लोक मंडली',
  community: 'मांगणियार समुदाय',
  region: 'जैसलमेर, राजस्थान',
  language: 'मारवाड़ी',
  recordingDate: '2024-01-15',
  contributor: 'लोकताल क्षेत्रीय टीम',
  lyricsExcerpt: 'माटी बोले तो अमर री आवाज़, पीढ़ियों पीढ़ियों गावै तानी सुरावै...',
  englishTranslation: 'When the earth speaks, its voice is eternal — sung across generations, its melody endures...',
  storyBehind: 'This song is traditionally sung during the harvest season, expressing gratitude to the land and its people.',
  rightsStatus: 'Community-approved · Attribution required',
};

const metadataFields = [
  { icon: User, label: 'Artist Credit', value: archiveRecord.artistCredit, hindi: true },
  { icon: MapPin, label: 'Community', value: archiveRecord.community, hindi: true },
  { icon: MapPin, label: 'Region', value: archiveRecord.region, hindi: true },
  { icon: Languages, label: 'Language', value: archiveRecord.language, hindi: true },
  { icon: Calendar, label: 'Recording Date', value: archiveRecord.recordingDate },
  { icon: User, label: 'Contributor', value: archiveRecord.contributor, hindi: true },
];

export function PreservationStory() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const timelineWidth = useTransform(scrollYProgress, [0.1, 0.8], ['0%', '100%']);
  const lyricsY = useTransform(scrollYProgress, [0.2, 0.4], [20, 0]);
  const lyricsOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const translationY = useTransform(scrollYProgress, [0.35, 0.55], [20, 0]);
  const translationOpacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);

  return (
    <section
      id="mission"
      ref={sectionRef}
      data-theme="indigo-archive"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
      style={{
        backgroundColor: 'var(--page-bg)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Header */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="text-center">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: 'var(--accent-primary)' }}
          >
            More Than a Streaming Platform
          </p>
          <h2
            className="mx-auto mt-4 max-w-2xl font-devanagari leading-[1.25]"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2.75rem)' }}
          >
            हर रिकॉर्डिंग के पीछे एक पहचान है।
          </h2>
          <p
            className="mx-auto mt-3 max-w-xl text-sm sm:text-base"
            style={{ color: 'var(--text-secondary)' }}
          >
            LokTaal preserves more than audio. Every song can carry the artist's name,
            community, language, location, lyrics, translation and the story behind the tradition.
          </p>
        </div>
      </div>

      {/* Archive record interface */}
      <div className="mx-auto mt-14 max-w-5xl px-4 sm:px-6 lg:px-10">
        <div
          className="relative overflow-hidden rounded-2xl border p-6 sm:p-8 lg:p-10"
          style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--surface)',
          }}
        >
          {/* Track title + artist credit (prominent) */}
          <div className="mb-6 border-b pb-6" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3
                  className="font-devanagari"
                  style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'var(--text-primary)' }}
                >
                  {archiveRecord.trackTitle}
                </h3>
                <p
                  className="mt-2 font-devanagari text-lg"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  {archiveRecord.artistCredit}
                </p>
              </div>
              <div
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-medium"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--accent-secondary) 15%, transparent)',
                  color: 'var(--accent-secondary)',
                }}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                {archiveRecord.rightsStatus}
              </div>
            </div>
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            {metadataFields.map((field, i) => (
              <MetadataField key={i} field={field} index={i} />
            ))}
          </div>

          {/* Audio timeline */}
          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              <span className="flex items-center gap-1.5">
                <Music2 className="h-3 w-3" /> Audio Timeline
              </span>
              <span>04:32</span>
            </div>
            <div
              className="h-1.5 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: 'var(--border-subtle)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: prefersReduced ? '60%' : timelineWidth,
                  backgroundColor: 'var(--accent-primary)',
                }}
              />
            </div>
          </div>

          {/* Lyrics + Translation */}
          <div className="mt-8 space-y-4">
            {/* Lyrics */}
            <motion.div
              className="flex gap-3"
              style={{
                y: prefersReduced ? 0 : lyricsY,
                opacity: prefersReduced ? 1 : lyricsOpacity,
              }}
            >
              <FileText className="mt-1 h-4 w-4 shrink-0" style={{ color: 'var(--accent-primary)' }} />
              <div>
                <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Lyrics Excerpt
                </p>
                <p
                  className="mt-1 font-devanagari text-sm leading-relaxed sm:text-base"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {archiveRecord.lyricsExcerpt}
                </p>
              </div>
            </motion.div>

            {/* Translation */}
            <motion.div
              className="flex gap-3 border-t pt-4"
              style={{
                borderColor: 'var(--border-subtle)',
                y: prefersReduced ? 0 : translationY,
                opacity: prefersReduced ? 1 : translationOpacity,
              }}
            >
              <Languages className="mt-1 h-4 w-4 shrink-0" style={{ color: 'var(--accent-secondary)' }} />
              <div>
                <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  English Translation
                </p>
                <p
                  className="mt-1 text-sm leading-relaxed italic"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {archiveRecord.englishTranslation}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Story behind the song */}
          <div className="mt-6 border-t pt-4" style={{ borderColor: 'var(--border-subtle)' }}>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Story Behind the Song
            </p>
            <p
              className="mt-1 text-sm leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {archiveRecord.storyBehind}
            </p>
          </div>

          {/* Location marker connecting to regional discovery */}
          <div className="mt-6 flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <MapPin className="h-3.5 w-3.5" style={{ color: 'var(--accent-primary)' }} />
            <span>Connected to regional discovery: {archiveRecord.region}</span>
          </div>
        </div>

        {/* Closing statement + CTA */}
        <div className="mt-10 text-center">
          <p
            className="font-devanagari text-xl sm:text-2xl"
            style={{ color: 'var(--text-primary)' }}
          >
            Preservation begins with proper credit.
          </p>
          <button
            type="button"
            className="group mt-5 inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95"
            style={{
              borderColor: 'var(--accent-primary)',
              color: 'var(--accent-primary)',
              // @ts-expect-error CSS custom property
              '--tw-ring-color': 'var(--accent-primary)',
              '--tw-ring-offset-color': 'var(--page-bg)',
            }}
          >
            See how LokTaal protects every story
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}

function MetadataField({
  field,
  index,
}: {
  field: { icon: typeof User; label: string; value: string; hindi?: boolean };
  index: number;
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Icon = field.icon;

  return (
    <motion.div
      ref={ref}
      initial={prefersReduced ? undefined : { opacity: 0, y: 15 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
        <Icon className="h-3 w-3" />
        {field.label}
      </div>
      <p
        className={`mt-1 text-sm font-medium ${field.hindi ? 'font-devanagari' : ''}`}
        style={{ color: 'var(--text-primary)' }}
      >
        {field.value}
      </p>
    </motion.div>
  );
}
