import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, Menu, X, Upload, Globe } from 'lucide-react';

const navLinks = [
  { label: 'Discover', href: '#discover' },
  { label: 'Regions', href: '#regions' },
  { label: 'Artists', href: '#artists' },
  { label: 'Our Mission', href: '#mission' },
];

export function Navbar() {
  const prefersReduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={prefersReduced ? undefined : { y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <nav
          aria-label="Main navigation"
          className={`transition-all duration-500 ${
            scrolled
              ? 'border-b border-saffron/15 bg-indigo-midnight/80 backdrop-blur-xl'
              : 'border-b border-transparent bg-transparent'
          }`}
        >
          <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3.5 sm:px-6 lg:px-10">
            {/* Logo */}
            <a
              href="#"
              aria-label="LokTaal home"
              className="group flex flex-col leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron rounded-sm"
            >
              <span className="font-devanagari text-2xl font-normal text-ivory transition-colors group-hover:text-saffron sm:text-[26px]">
                लोकताल
              </span>
              <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.35em] text-sand/50">
                LokTaal
              </span>
            </a>

            {/* Desktop nav links */}
            <ul className="hidden items-center gap-8 lg:flex">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group relative py-2 text-sm font-medium text-sand/80 transition-colors hover:text-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron rounded-sm"
                  >
                    {link.label}
                    {/* Rhythm-line hover indicator */}
                    <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 overflow-hidden rounded-full bg-saffron transition-all duration-300 group-hover:w-full group-focus-visible:w-full">
                      <span className="block h-full w-3 rounded-full bg-terracotta" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search */}
              <button
                type="button"
                aria-label="Search folk music"
                className="flex h-10 w-10 items-center justify-center rounded-full text-sand/70 transition-colors hover:bg-sand/10 hover:text-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
              >
                <Search className="h-[18px] w-[18px]" />
              </button>

              {/* Language selector */}
              <button
                type="button"
                aria-label="Switch language"
                className="hidden items-center gap-1.5 rounded-full border border-sand/20 px-3 py-1.5 text-xs font-medium text-sand/70 transition-colors hover:border-saffron/40 hover:text-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron sm:flex"
              >
                <Globe className="h-3.5 w-3.5" />
                हिंदी / EN
              </button>

              {/* Upload CTA */}
              <button
                type="button"
                className="group hidden items-center gap-2 rounded-full bg-gradient-to-r from-terracotta to-saffron px-4 py-2.5 text-sm font-semibold text-indigo-midnight shadow-lg shadow-saffron/20 transition-all duration-300 hover:shadow-saffron/40 hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-midnight active:scale-95 sm:flex"
              >
                <Upload className="h-4 w-4" />
                Upload Folk Music
                <motion.span
                  className="inline-block"
                  animate={prefersReduced ? undefined : { x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  →
                </motion.span>
              </button>

              {/* Mobile upload icon */}
              <button
                type="button"
                aria-label="Upload folk music"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-terracotta to-saffron text-indigo-midnight shadow-lg shadow-saffron/20 transition-all hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron sm:hidden"
              >
                <Upload className="h-[18px] w-[18px]" />
              </button>

              {/* Hamburger */}
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-sand/80 transition-colors hover:bg-sand/10 hover:text-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron lg:hidden"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-indigo-midnight/95 backdrop-blur-xl"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={prefersReduced ? undefined : { y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={prefersReduced ? undefined : { y: -20, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative flex h-full flex-col px-6 pt-24 pb-8"
            >
              <ul className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={prefersReduced ? undefined : { x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between border-b border-sand/10 py-4 text-xl font-medium text-ivory transition-colors hover:text-saffron focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron rounded-sm"
                    >
                      <span className="font-devanagari text-2xl">{link.label}</span>
                      <span className="text-saffron">→</span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mt-auto space-y-3"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-terracotta to-saffron px-6 py-3.5 text-base font-semibold text-indigo-midnight shadow-lg shadow-saffron/20"
                >
                  <Upload className="h-5 w-5" />
                  Upload Folk Music
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-sand/20 px-6 py-3.5 text-base font-medium text-sand/80"
                >
                  <Globe className="h-4 w-4" />
                  हिंदी / EN
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
