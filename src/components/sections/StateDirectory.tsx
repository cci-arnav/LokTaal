import { useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { states, unionTerritories, type IndiaRegion } from '@/data/indiaStates';
import { AppLink } from '@/contexts/RouterContext';
import { useI18n } from '@/contexts/I18nContext';

export function StateDirectory() {
  const { t, language } = useI18n();
  const [query, setQuery] = useState('');
  const filteredStates = useMemo(() => { const term = query.trim().toLowerCase(); return states.filter((item) => !term || `${item.name} ${item.nameHi} ${(item.languages ?? []).join(' ')} ${(item.traditions ?? []).join(' ')}`.toLowerCase().includes(term)); }, [query]);
  const filteredUTs = useMemo(() => { const term = query.trim().toLowerCase(); return unionTerritories.filter((item) => !term || `${item.name} ${item.nameHi} ${(item.languages ?? []).join(' ')} ${(item.traditions ?? []).join(' ')}`.toLowerCase().includes(term)); }, [query]);
  return <section id="states" data-theme="archive-paper" className="bg-[var(--page-bg)] px-4 py-16 text-[var(--text-primary)] sm:px-6 lg:px-10 lg:py-20">
    <div className="mx-auto max-w-[1400px]">
      <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end"><header><p className="text-[11px] font-bold uppercase tracking-[.28em] text-[var(--accent-primary)]">{t('states.eyebrow')}</p><h2 className="mt-4 max-w-3xl font-devanagari text-3xl leading-tight sm:text-5xl">{t('states.title')}</h2><p className="mt-4 max-w-2xl leading-7 text-[var(--text-secondary)]">{t('states.body')}</p></header><label className="flex min-h-13 items-center gap-3 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-5"><Search className="h-4 w-4" /><span className="sr-only">{t('states.search')}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('states.search')} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-secondary)]" /></label></div>
      <RegionGroup title={`${t('states.state')} · 28`} items={filteredStates} language={language} coming={t('states.coming')} />
      <RegionGroup title={`${t('states.ut')} · 8`} items={filteredUTs} language={language} coming={t('states.coming')} />
      {!filteredStates.length && !filteredUTs.length && <p className="mt-12 rounded-3xl border border-dashed border-[var(--border-subtle)] p-10 text-center text-[var(--text-secondary)]">{t('search.none')}</p>}
    </div>
  </section>;
}
function RegionGroup({ title, items, language, coming }: { title: string; items: IndiaRegion[]; language: 'en' | 'hi'; coming: string }) {
  return <div className="mt-12"><div className="mb-5 flex items-center gap-4"><h3 className="font-display text-sm font-bold uppercase tracking-[.2em]">{title}</h3><span className="h-px flex-1 bg-[var(--border-subtle)]" /></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{items.map((item) => <AppLink key={item.slug} to={`/states/${item.slug}`} className="group flex min-h-32 flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 transition hover:-translate-y-1 hover:border-[var(--accent-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"><div className="flex items-start justify-between gap-3"><div><p className="font-devanagari text-xl font-semibold">{language === 'hi' ? item.nameHi : item.name}</p><p className="mt-1 text-xs text-[var(--text-secondary)]">{language === 'hi' ? item.name : item.nameHi}</p></div><ArrowRight className="h-4 w-4 text-[var(--accent-primary)] transition group-hover:translate-x-1" /></div><p className="mt-5 text-xs font-semibold text-[var(--text-secondary)]">{item.featured ? (item.traditions?.join(' · ') ?? coming) : coming}</p></AppLink>)}</div></div>;
}
