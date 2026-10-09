import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, Upload, ArrowRight, ChevronDown } from 'lucide-react';
import { FolkMusicPlayer } from '@/components/FolkMusicPlayer';
import { RegionSelector } from '@/components/RegionSelector';
import { AmbientVisuals } from '@/components/AmbientVisuals';
import { featuredTracks } from '@/data/featuredTracks';
import { useI18n } from '@/contexts/I18nContext';
import { useRouter } from '@/contexts/RouterContext';

const heroImage =
  'https://images.pexels.com/photos/15937060/pexels-photo-15937060.jpeg?auto=compress&cs=tinysrgb&w=1600';

const marqueeText = 'लोकधुनें • क्षेत्रीय कलाकार • भूली हुई आवाज़ें • जीवित परंपराएँ';

export function Hero() {
  const prefersReduced = useReducedMotion();
  const { t, language } = useI18n();
  const { navigate } = useRouter();
  const [activeRegion, setActiveRegion] = useState('Rajasthan');
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  const activeTrack =
    featuredTracks.find((t) => t.region === activeRegion) ?? featuredTracks[0];
  const trustItems = [{ label: t('hero.credit'), dot: '#A94432' }, { label: t('hero.regional'), dot: '#C87535' }, { label: t('hero.preservation'), dot: '#56816A' }];

  // Cursor parallax for orbit (desktop only)
  useEffect(() => {
    if (prefersReduced) return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const onMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setMouse({
        x: (e.clientX - cx) / rect.width,
        y: (e.clientY - cy) / rect.height,
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [prefersReduced]);

  return (
    <section id="discover" data-theme="desert-folk" className="relative min-h-[100svh] w-full overflow-x-clip bg-[#E9E2D7] text-[#35251C]">
      {/* === Background layers === */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* A quiet, low-saturation parchment base keeps the hero easy on the eyes. */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(250,247,240,.45),transparent_42%),linear-gradient(125deg,#E9E2D7_0%,#EAE5D9_58%,#E4DDD0_100%)]" />

        {/* Folk performer image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Rajasthani folk musicians playing traditional instruments outdoors"
            className="h-full w-full object-cover object-center opacity-[0.76]"
          />
        </div>

        {/* Calm reading space on the left; the original musician photo remains clear on the right. */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(233,226,215,.86)_0%,rgba(233,226,215,.76)_34%,rgba(233,226,215,.48)_58%,rgba(233,226,215,.12)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(233,226,215,.48)_0%,rgba(233,226,215,.12)_24%,transparent_44%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(228,221,208,.22)_0%,transparent_38%)]" />

        {/* Textile line pattern */}
        <div className="textile-pattern absolute inset-0 opacity-[0.07]" />

        {/* Grain texture */}
        <div className="grain-overlay absolute inset-0 opacity-[0.035] mix-blend-overlay" />

        {/* Soft sound rings from player area */}
        <div className="absolute right-[8%] top-1/2 hidden -translate-y-1/2 lg:block">
          <div className="h-[600px] w-[600px] rounded-full border border-[#A94432]/10" />
        </div>
      </div>

      {/* === Content === */}
      <div
        ref={heroRef}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col px-4 pb-24 pt-24 sm:px-6 sm:pb-28 sm:pt-28 lg:px-10 lg:pb-24 lg:pt-28"
      >
        <div className="flex flex-1 flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-8">
          {/* === LEFT: Content (52%) === */}
          <div className="w-full lg:w-[52%]">
            {/* Eyebrow badge */}
            <motion.div
              initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="inline-flex items-center gap-2.5 rounded-full border border-[#A94432]/20 bg-[#FFF9EC]/70 px-3.5 py-1.5 shadow-sm backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-[#A94432]"
                  animate={prefersReduced ? undefined : { scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#A94432]" />
              </span>
              <span className="font-devanagari text-xs text-[#49372B]">
                {t('hero.eyebrow')}
              </span>
              <span className="text-[#8D6849]/50">•</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A94432]/80">
                {t('hero.archive')}
              </span>
            </motion.div>

            {/* Main heading */}
            <h1 className="mt-5 font-devanagari text-[#35251C]">
              <motion.span
                initial={prefersReduced ? undefined : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                className="block font-normal leading-[1.15] text-balance"
                style={{ fontSize: 'clamp(2rem, 5.5vw, 3.75rem)' }}
              >
                {t('hero.line1')}
              </motion.span>
              <motion.span
                initial={prefersReduced ? undefined : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.25 }}
                className="block font-normal leading-[1.15] text-balance"
                style={{
                  fontSize: 'clamp(2rem, 5.5vw, 3.75rem)',
                  color: '#A94432',
                  textShadow: '0 0 32px rgba(169, 68, 50, 0.12)',
                }}
              >
                {t('hero.line2')}
              </motion.span>
            </h1>

            {/* English supporting line */}
            <motion.p
              initial={prefersReduced ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-3 font-sans text-sm text-[#49372B] sm:text-base"
            >
              {t('hero.support')}
            </motion.p>

            {/* Supporting paragraph */}
            <motion.p
              initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-5 max-w-xl font-devanagari text-sm leading-relaxed text-[#49372B] sm:text-[15px]"
            >
              {t('hero.body')}
            </motion.p>
            <motion.p
              initial={prefersReduced ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-2 max-w-xl text-xs text-[#49372B]/90 sm:text-[13px]"
            >
              {language === 'en' ? 'Upload, discover and support traditional music from every state, region, district and village.' : 'हर राज्य, क्षेत्र, ज़िले और गाँव की लोकधुनों को साझा करें, खोजें और समर्थन दें।'}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              {/* Primary */}
              <button
                type="button"
                onClick={() => document.getElementById('states')?.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' })}
                className="group relative flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-[#A94432] px-6 py-3.5 text-[#FFF8EA] shadow-xl shadow-[#713326]/20 transition-all duration-300 hover:bg-[#8F382B] hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A94432] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E9E2D7] active:scale-[0.97] sm:px-7"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <Play className="h-4 w-4 fill-current" />
                <span className="flex flex-col items-start leading-none">
                  <span className="font-devanagari text-base font-medium text-[#FFF8EA]">
                    {t('hero.explore')}
                  </span>
                  <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-[#FFF8EA]/90">
                    Explore Folk Music
                  </span>
                </span>
                <motion.span
                  className="ml-1"
                  animate={prefersReduced ? undefined : { x: [0, 4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowRight className="h-4 w-4 text-[#FFF8EA]" />
                </motion.span>
              </button>

              {/* Secondary */}
              <button
                type="button"
                onClick={() => navigate('/login?redirect=/upload')}
                className="group flex items-center justify-center gap-2.5 rounded-full border border-[#A94432]/30 bg-[#FFF9EC]/65 px-6 py-3.5 text-[#49372B] shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-[#A94432]/55 hover:bg-[#FFF9EC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A94432] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E9E2D7] active:scale-[0.97] sm:px-7"
              >
                <Upload className="h-4 w-4 text-[#A94432]" />
                <span className="flex flex-col items-start leading-none">
                  <span className="font-devanagari text-base font-medium">
                    {t('hero.upload')}
                  </span>
                  <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-[#624B3A]">
                    Upload a Folk Song
                  </span>
                </span>
              </button>
            </motion.div>

            {/* Trust microcopy */}
            <motion.div
              initial={prefersReduced ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2"
            >
              {trustItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: item.dot }}
                  />
                  <span className="text-[11px] font-medium text-[#49372B]">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* === RIGHT: Interactive composition (48%) === */}
          <div className="relative w-full lg:w-[48%]">
            <motion.div
              initial={prefersReduced ? undefined : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="relative flex flex-col items-center gap-5 xl:px-16"
            >
              {/* Ambient orbit behind player */}
              <div className="relative flex w-full justify-center">
                <AmbientVisuals
                  accent={activeTrack.accent}
                  mouseX={mouse.x}
                  mouseY={mouse.y}
                />

                {/* Player card */}
                <div className="relative z-10 w-full max-w-sm">
                  <FolkMusicPlayer track={activeTrack} />
                </div>

              </div>

              {/* Region selector */}
              <div className="relative z-10 w-full max-w-sm">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#49372B]">
                  Explore by region
                </p>
                <div className="scrollbar-hide -mx-1 overflow-x-auto px-1 pb-1">
                  <RegionSelector
                    activeRegion={activeRegion}
                    onSelect={setActiveRegion}
                    accent={activeTrack.accent}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* === Scroll indicator === */}
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="mt-6 flex flex-col items-center gap-2"
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#725B47]/65">
            Explore the living archive
          </p>
          <motion.div
            className="h-8 w-px bg-gradient-to-b from-[#A94432]/60 to-transparent"
            animate={prefersReduced ? undefined : { scaleY: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top' }}
          />
          <ChevronDown className="h-3 w-3 text-[#A94432]/45" />
        </motion.div>
      </div>

      {/* === Marquee strip === */}
      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-[#725B47]/25 py-3"
        aria-hidden="true"
      >
        <div className="flex whitespace-nowrap">
          <motion.div
            className="flex shrink-0"
            animate={prefersReduced ? undefined : { x: ['0%', '-50%'] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="font-devanagari text-sm text-[#49372B]/70"
                style={{ padding: '0 2rem' }}
              >
                {marqueeText}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
