import type { IndiaRegion } from '@/data/indiaStates';
import type { DemoTune } from '@/data/demoTunes';

export interface SearchItem { id: string; group: 'Songs' | 'Places' | 'Pages'; title: string; subtitle: string; terms: string; href: string; }
export function buildSearchIndex(regions: IndiaRegion[], tunes: DemoTune[]): SearchItem[] {
  return [
    ...tunes.map((tune) => ({ id: tune.id, group: 'Songs' as const, title: tune.title, subtitle: `${tune.artist} · ${tune.region} · ${tune.language}`, terms: [tune.title, tune.artist, tune.region, tune.language, tune.genre, tune.tradition].join(' ').toLowerCase(), href: `/states/${tune.stateSlug}` })),
    ...regions.map((region) => ({ id: `place-${region.slug}`, group: 'Places' as const, title: region.name, subtitle: `${region.nameHi} · ${region.type === 'state' ? 'State' : 'Union Territory'}`, terms: [region.name, region.nameHi, ...(region.languages ?? []), ...(region.traditions ?? [])].join(' ').toLowerCase(), href: `/states/${region.slug}` })),
    { id: 'page-home', group: 'Pages', title: 'Home', subtitle: 'LokTaal homepage', terms: 'home loktaal homepage मुखपृष्ठ', href: '/' },
    { id: 'page-upload', group: 'Pages', title: 'Upload Folk Music', subtitle: 'Prepare a contribution', terms: 'upload contribute preserve song recording अपलोड लोक संगीत', href: '/login?redirect=/upload' },
  ];
}
export function filterSearch(items: SearchItem[], query: string): SearchItem[] {
  const normalized = query.trim().toLowerCase();
  return normalized ? items.filter((item) => `${item.title} ${item.subtitle} ${item.terms}`.toLowerCase().includes(normalized)).slice(0, 10) : [];
}
