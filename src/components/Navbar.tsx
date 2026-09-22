import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Globe2, Menu, Search, Upload, X } from 'lucide-react';
import logo from '@/assets/branding/loktaal-logo.png';
import { useI18n } from '@/contexts/I18nContext';
import { AppLink, useRouter } from '@/contexts/RouterContext';
import { buildSearchIndex, filterSearch } from '@/lib/search';
import { indiaRegions } from '@/data/indiaStates';
import { demoTunes } from '@/data/demoTunes';

export function Navbar() {
  const reduced = useReducedMotion();
  const { t, language, toggleLanguage } = useI18n();
  const { path, navigate } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeResult, setActiveResult] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const index = useMemo(() => buildSearchIndex(indiaRegions, demoTunes), []);
  const results = useMemo(() => filterSearch(index, query), [index, query]);

  const links = [
    { label: t('nav.home'), href: '/', route: true },
    { label: t('nav.explore'), href: '/#discover', section: 'discover' },
    { label: t('nav.states'), href: '/#states', section: 'states' },
    { label: t('nav.traditions'), href: '/#journey', section: 'journey' },
    { label: t('nav.about'), href: '/#mission', section: 'mission' },
  ];
  const isCurrentLink = (link: (typeof links)[number]) =>
    (link.route && path === '/') || (link.section === 'states' && path.startsWith('/states/'));

  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 20); onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMobileOpen(false); setSearchOpen(false); } };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); };
  }, [mobileOpen]);
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!searchRef.current?.contains(event.target as Node)) setSearchOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, []);
  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [path]);

  const goSection = (event: React.MouseEvent<HTMLAnchorElement>, section?: string) => {
    if (!section) return;
    event.preventDefault();
    if (path !== '/') navigate(`/#${section}`);
    window.requestAnimationFrame(() => document.getElementById(section)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }));
    setMobileOpen(false);
  };
  const chooseResult = (href: string) => { setSearchOpen(false); setQuery(''); navigate(href); };
  const searchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActiveResult((value) => Math.min(results.length - 1, value + 1)); }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActiveResult((value) => Math.max(0, value - 1)); }
    if (event.key === 'Enter' && results[activeResult]) { event.preventDefault(); chooseResult(results[activeResult].href); }
    if (event.key === 'Escape') setSearchOpen(false);
  };

  return <motion.header initial={reduced ? undefined : { y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed inset-x-0 top-0 z-50">
    <nav aria-label="Main navigation" style={scrolled || path !== '/' ? { backgroundColor: 'color-mix(in srgb, var(--page-bg) 93%, transparent)' } : undefined} className={`border-b transition duration-300 ${scrolled || path !== '/' ? 'border-[var(--border-subtle)] shadow-lg backdrop-blur-xl' : 'border-transparent'}`}>
      <div className="relative mx-auto flex h-[74px] max-w-[1600px] items-center gap-4 px-3 sm:px-6 lg:px-8">
        <AppLink to="/" aria-label="Loktaal home" className="flex shrink-0 rounded-lg bg-[#100b1d]/80 px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"><img src={logo} alt="Loktaal" className="h-auto w-[100px] object-contain sm:w-[124px]" /></AppLink>
        <ul className="hidden flex-1 items-center justify-center gap-4 xl:flex">{links.map((link) => <li key={link.href}><AppLink to={link.href} onClick={(event) => goSection(event, link.section)} aria-current={isCurrentLink(link) ? 'page' : undefined} className="rounded-md px-2 py-3 text-sm font-semibold text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] aria-[current=page]:text-[var(--accent-primary)]">{link.label}</AppLink></li>)}</ul>
        <div className="ml-auto flex items-center gap-2">
          <div ref={searchRef} className="relative hidden md:block">
            <div className={`flex h-11 items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] transition-all ${searchOpen ? 'w-[min(360px,32vw)] px-3' : 'w-11 justify-center'}`}>
              <button type="button" aria-label={t('search.label')} aria-expanded={searchOpen} onClick={() => setSearchOpen((value) => !value)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"><Search className="h-4 w-4" /></button>
              {searchOpen && <input autoFocus value={query} onChange={(event) => { setQuery(event.target.value); setActiveResult(0); }} onKeyDown={searchKeyDown} placeholder={t('search.placeholder')} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-secondary)]" />}
            </div>
            <SearchResults open={searchOpen} query={query} results={results} active={activeResult} onChoose={chooseResult} />
          </div>
          <button type="button" onClick={toggleLanguage} aria-label="Switch language" className="hidden h-11 items-center gap-1 rounded-full border border-[var(--border-subtle)] px-3 text-sm font-semibold sm:flex"><Globe2 className="h-4 w-4" />{language === 'en' ? 'हिंदी' : 'EN'}</button>
          <button type="button" onClick={() => navigate('/login?redirect=/upload')} className="hidden min-h-11 items-center gap-2 rounded-full bg-gradient-to-r from-[#E06543] to-[#F0B23D] px-4 text-sm font-bold text-[#21112a] shadow-lg sm:flex"><Upload className="h-4 w-4" />{t('nav.upload')}</button>
          <button type="button" onClick={() => setMobileOpen((value) => !value)} aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-subtle)] xl:hidden">{mobileOpen ? <X /> : <Menu />}</button>
        </div>
      </div>
    </nav>
    <AnimatePresence>{mobileOpen && <motion.div id="mobile-navigation" initial={reduced ? false : { opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -12 }} className="fixed inset-x-0 bottom-0 top-[74px] overflow-y-auto bg-[#17122B]/98 p-5 text-[#FFF7E8] backdrop-blur-xl xl:hidden">
      <div className="mx-auto max-w-xl">
        <MobileSearch query={query} setQuery={setQuery} results={results} onChoose={chooseResult} placeholder={t('search.placeholder')} noResults={t('search.none')} />
        <ul className="mt-6">{links.map((link) => <li key={link.href}><AppLink to={link.href} onClick={(event) => goSection(event, link.section)} aria-current={isCurrentLink(link) ? 'page' : undefined} className="flex min-h-14 items-center justify-between border-b border-white/10 text-lg font-semibold aria-[current=page]:text-[#F0B23D]">{link.label}<span className="text-[#F0B23D]">→</span></AppLink></li>)}</ul>
        <button type="button" onClick={() => navigate('/login?redirect=/upload')} className="mt-7 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E06543] to-[#F0B23D] font-bold text-[#21112a]"><Upload className="h-5 w-5" />{t('nav.upload')}</button>
        <button type="button" onClick={toggleLanguage} className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/20"><Globe2 className="h-4 w-4" />{language === 'en' ? 'हिंदी' : 'EN'}</button>
      </div>
    </motion.div>}</AnimatePresence>
  </motion.header>;
}

function SearchResults({ open, query, results, active, onChoose }: { open: boolean; query: string; results: ReturnType<typeof filterSearch>; active: number; onChoose: (href: string) => void }) {
  const { t } = useI18n();
  if (!open || !query.trim()) return null;
  return <div role="listbox" aria-label={t('search.results')} className="absolute right-0 top-14 max-h-[60vh] w-[min(420px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-2 text-[var(--text-primary)] shadow-2xl">{results.length ? results.map((result, index) => <button type="button" role="option" aria-selected={active === index} key={result.id} onClick={() => onChoose(result.href)} className={`block w-full rounded-xl px-3 py-3 text-left ${active === index ? 'bg-[var(--border-subtle)]' : 'hover:bg-[var(--border-subtle)]'}`}><span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--accent-primary)]">{result.group}</span><span className="block font-semibold">{result.title}</span><span className="block text-xs text-[var(--text-secondary)]">{result.subtitle}</span></button>) : <p className="px-3 py-6 text-center text-sm text-[var(--text-secondary)]">{t('search.none')}</p>}</div>;
}

function MobileSearch({ query, setQuery, results, onChoose, placeholder, noResults }: { query: string; setQuery: (value: string) => void; results: ReturnType<typeof filterSearch>; onChoose: (href: string) => void; placeholder: string; noResults: string }) {
  return <div><label className="flex min-h-12 items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4"><Search className="h-4 w-4" /><span className="sr-only">{placeholder}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/50" /></label>{query.trim() && <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 p-2">{results.length ? results.slice(0, 6).map((result) => <button key={result.id} onClick={() => onChoose(result.href)} className="block min-h-12 w-full rounded-xl px-3 text-left hover:bg-white/10"><span className="block font-semibold">{result.title}</span><span className="block text-xs text-white/60">{result.subtitle}</span></button>) : <p className="p-4 text-center text-sm text-white/60">{noResults}</p>}</div>}</div>;
}
