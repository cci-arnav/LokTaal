import { ArrowLeft, MapPin } from 'lucide-react';
import { AppLink } from '@/contexts/RouterContext';
import { useI18n } from '@/contexts/I18nContext';
import { indiaRegions } from '@/data/indiaStates';
import { demoTunes } from '@/data/demoTunes';
import { DemoTuneCard } from '@/components/sections/StateDirectory';

export function StatePage({ slug }: { slug: string }) {
  const { t, language } = useI18n();
  const region = indiaRegions.find((item) => item.slug === slug);
  const tunes = demoTunes.filter((tune) => tune.stateSlug === slug);
  if (!region) return <div className="min-h-screen bg-[#17122B] px-4 pb-20 pt-32 text-white"><div className="mx-auto max-w-4xl"><h1 className="text-4xl font-bold">Region not found</h1><AppLink to="/" className="mt-6 inline-flex text-[#F0B23D]">{t('common.backHome')}</AppLink></div></div>;
  return <main data-theme="midnight-raga" className="min-h-screen bg-[radial-gradient(circle_at_75%_15%,rgba(147,51,234,.35),transparent_28%),#25113f] px-4 pb-24 pt-32 text-white sm:px-6"><div className="mx-auto max-w-5xl"><AppLink to="/#states" className="inline-flex min-h-11 items-center gap-2 text-sm text-white/70"><ArrowLeft className="h-4 w-4" />{t('common.backHome')}</AppLink><div className="mt-10"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.24em] text-[#F0B23D]"><MapPin className="h-4 w-4" />{region.type === 'state' ? t('states.state') : t('states.ut')}</p><h1 className="mt-4 font-devanagari text-5xl sm:text-7xl">{language === 'hi' ? region.nameHi : region.name}</h1><p className="mt-3 text-xl text-white/65">{language === 'hi' ? region.name : region.nameHi}</p></div><div className="mt-12">{tunes.length ? <div className="grid gap-5 md:grid-cols-2">{tunes.map((tune) => <DemoTuneCard key={tune.id} tune={tune} />)}</div> : <div className="rounded-3xl border border-white/15 bg-white/5 p-10 text-center"><p className="font-devanagari text-2xl">{t('states.coming')}</p><p className="mt-3 text-sm leading-6 text-white/60">This collection will grow only through properly credited, permission-aware contributions.</p><AppLink to="/login?redirect=/upload" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#F0B23D] px-5 font-bold text-[#25113f]">{t('nav.upload')}</AppLink></div>}</div></div></main>;
}
