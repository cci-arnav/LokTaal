import { useEffect } from 'react';
import { ArrowLeft, MapPin, Play } from 'lucide-react';
import { AppLink } from '@/contexts/RouterContext';
import { useI18n } from '@/contexts/I18nContext';
import { indiaRegions } from '@/data/indiaStates';
import { demoTunes } from '@/data/demoTunes';
import { DemoTuneCard } from '@/components/sections/StateDirectory';
import { useAudio } from '@/components/audio/AudioProvider';
import { usePublicSongs } from '@/contexts/PublicSongsContext';
import type { AudioTrack } from '@/data/phase3';

export function StatePage({ slug }: { slug: string }) {
  const { t, language } = useI18n();
  const { close, playTrack } = useAudio();
  const { tracks: approvedTracks, loading } = usePublicSongs();
  useEffect(() => () => close(), [close]);
  const region = indiaRegions.find((item) => item.slug === slug);
  const tunes = demoTunes.filter((tune) => tune.stateSlug === slug);
  const approved = approvedTracks.filter((track) => track.stateSlug === slug);
  if (!region) return <main className="flex min-h-screen items-center bg-[radial-gradient(circle_at_70%_20%,rgba(147,51,234,.35),transparent_30%),#25113f] px-4 pb-20 pt-32 text-white"><div className="mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-white/5 p-10 text-center"><p className="text-xs font-bold uppercase tracking-[.28em] text-[#F0B23D]">404 · LokTaal</p><h1 className="mt-4 font-devanagari text-4xl font-bold sm:text-5xl">{t('notFound.title')}</h1><p className="mx-auto mt-4 max-w-xl text-white/65">{t('notFound.body')}</p><AppLink to="/" className="mt-7 inline-flex min-h-12 items-center rounded-full bg-[#F0B23D] px-6 font-bold text-[#25113f]">{t('notFound.home')}</AppLink></div></main>;
  return <main data-theme="midnight-raga" className="min-h-screen bg-[radial-gradient(circle_at_75%_15%,rgba(147,51,234,.35),transparent_28%),#25113f] px-4 pb-24 pt-32 text-white sm:px-6"><div className="mx-auto max-w-5xl"><AppLink to="/#states" className="inline-flex min-h-11 items-center gap-2 text-sm text-white/70"><ArrowLeft className="h-4 w-4" />{t('common.backHome')}</AppLink><div className="mt-10"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.24em] text-[#F0B23D]"><MapPin className="h-4 w-4" />{region.type === 'state' ? t('states.state') : t('states.ut')}</p><h1 className="mt-4 font-devanagari text-5xl sm:text-7xl">{language === 'hi' ? region.nameHi : region.name}</h1><p className="mt-3 text-xl text-white/65">{language === 'hi' ? region.name : region.nameHi}</p></div><div className="mt-12">{approved.length > 0 && <section><p className="mb-5 text-xs font-bold uppercase tracking-[.24em] text-[#F0B23D]">{language === 'hi' ? 'समुदाय संग्रह' : 'Community archive'}</p><div className="grid gap-5 md:grid-cols-2">{approved.map((track) => <ArchiveTrackCard key={track.id} track={track} onPlay={playTrack} />)}</div></section>}{loading && <p className="mt-6 text-white/60">Loading approved recordings…</p>}{tunes.length > 0 && <section className="mt-10"><p className="mb-5 text-xs font-bold uppercase tracking-[.24em] text-white/50">{t('demo.room')}</p><div className="grid gap-5 md:grid-cols-2">{tunes.map((tune) => <DemoTuneCard key={tune.id} tune={tune} />)}</div></section>}{!loading && approved.length === 0 && tunes.length === 0 && <div className="rounded-3xl border border-white/15 bg-white/5 p-10 text-center"><p className="font-devanagari text-2xl">{t('states.coming')}</p><p className="mt-3 text-sm leading-6 text-white/60">This collection will grow only through properly credited, permission-aware contributions.</p><AppLink to="/login?redirect=/upload" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#F0B23D] px-5 font-bold text-[#25113f]">{t('nav.upload')}</AppLink></div>}</div></div></main>;
}

function ArchiveTrackCard({ track, onPlay }: { track: AudioTrack; onPlay: (track: AudioTrack) => void }) { return <article className="flex items-center gap-4 rounded-3xl border border-white/15 bg-white/5 p-4"><img src={track.artwork} alt="" className="h-24 w-24 rounded-2xl object-cover" /><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-wider text-[#F0B23D]">Approved recording</p><h2 className="mt-2 truncate font-devanagari text-xl">{track.title}</h2><p className="truncate text-sm text-white/60">{track.artist} · {track.language}</p></div><button onClick={() => onPlay(track)} aria-label={`Play ${track.title}`} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0B23D] text-[#25113f]"><Play className="h-4 w-4" fill="currentColor" /></button></article>; }
