import { useMemo, useState } from 'react';
import { Bookmark, MapPin, Play, Search, Share2, Shuffle } from 'lucide-react';
import { indiaArchiveTracks as archiveTracks, type AudioTrack } from '@/data/phase3';
import { useAudio } from '@/components/audio/AudioProvider';
import { usePublicSongs } from '@/contexts/PublicSongsContext';

const filters = ['All', 'Region', 'Language', 'Tradition', 'Recently Added'] as const;

export function ArchiveCollection() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const { playTrack } = useAudio();
  const { tracks: approvedTracks, loading: approvedLoading, error: approvedError } = usePublicSongs();
  const allTracks = useMemo(() => [...approvedTracks, ...archiveTracks], [approvedTracks]);
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    let list = allTracks.filter((track) => !term || [track.title, track.artist, track.location, track.language, track.tradition].some((v) => v.toLowerCase().includes(term)));
    if (filter === 'Region') list = list.filter((t) => ['Rajasthan', 'Assam', 'Nagaland'].includes(t.region));
    if (filter === 'Language') list = list.filter((t) => ['Marwari', 'Assamese', 'Bengali'].includes(t.language));
    if (filter === 'Tradition') list = list.filter((t) => t.tradition.toLowerCase().includes('folk') || t.tradition.toLowerCase().includes('ballad'));
    if (filter === 'Recently Added') list = [...list].sort((a, b) => b.addedOrder - a.addedOrder).slice(0, 4);
    return list;
  }, [allTracks, filter, query]);
  const share = (track: AudioTrack) => { setNotice(`Share link ready for ${track.title}`); window.setTimeout(() => setNotice(''), 1800); };
  const clear = () => { setQuery(''); setFilter('All'); };
  const random = () => { const pool = results.length ? results : allTracks; playTrack(pool[Math.floor(Math.random() * pool.length)]); };

  return (
    <section id="archive" data-theme="archive-paper" className="bg-[var(--page-bg)] px-4 py-16 text-[var(--text-primary)] sm:px-6 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-[1400px]">
        <header><p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--accent-primary)]">Fresh from the Archive</p><h2 className="mt-4 font-devanagari text-3xl sm:text-4xl lg:text-5xl">नई मिलीं, पुरानी धुनें</h2><p className="mt-3 max-w-2xl text-sm text-[var(--text-secondary)] sm:text-base">Approved community recordings appear first, followed by clearly marked demonstration material.</p>{approvedLoading && <p className="mt-2 text-xs text-[var(--text-secondary)]">Loading approved community recordings…</p>}{approvedError && <p className="mt-2 text-xs text-[#9E302D]">{approvedError} Demonstration material remains available.</p>}</header>
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} aria-pressed={filter === item} className={`min-h-11 shrink-0 rounded-full border px-4 text-sm ${filter === item ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white' : 'border-[var(--border-subtle)]'}`}>{item}</button>)}</div><label className="flex min-h-12 min-w-0 items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-4 lg:w-[390px]"><Search className="h-4 w-4 text-[var(--text-secondary)]" /><span className="sr-only">Search archive</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by song, artist, language or place" className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-secondary)]" /></label></div>
        {results.length ? <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <FeaturedTrack track={results[0]} onPlay={playTrack} saved={saved.includes(results[0].id)} onSave={() => setSaved((s) => s.includes(results[0].id) ? s.filter((id) => id !== results[0].id) : [...s, results[0].id])} onShare={() => share(results[0])} />
          <div className="space-y-3">{results.slice(1).map((track) => <TrackRow key={track.id} track={track} onPlay={playTrack} saved={saved.includes(track.id)} onSave={() => setSaved((s) => s.includes(track.id) ? s.filter((id) => id !== track.id) : [...s, track.id])} onShare={() => share(track)} />)}<button onClick={random} className="flex min-h-20 w-full items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--accent-secondary)] text-sm font-semibold text-[var(--accent-secondary)]"><Shuffle className="h-5 w-5" />Discover a random recording</button></div>
        </div> : <div className="mt-10 rounded-3xl border border-dashed border-[var(--border-subtle)] p-12 text-center"><p className="font-devanagari text-xl">No recordings match these filters yet.</p><button onClick={clear} className="mt-5 min-h-11 rounded-full bg-[var(--accent-primary)] px-5 text-sm font-semibold text-white">Clear filters</button></div>}
        <p className="sr-only" aria-live="polite">{notice}</p>
      </div>
    </section>
  );
}

function FeaturedTrack({ track, onPlay, saved, onSave, onShare }: TrackProps) { const demo = !track.id.startsWith('approved-'); return <article className="relative min-h-[440px] overflow-hidden rounded-[2rem]"><img src={track.artwork} alt="" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#241719] via-[#241719]/30 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9"><p className="text-[10px] uppercase tracking-[0.22em] text-[#F0B23D]">Featured recording · {demo ? 'Demonstration' : 'Community archive'}</p><h3 className="mt-2 font-devanagari text-3xl">{track.title}</h3><p className="mt-1 text-sm text-[#eadac8]">{track.artist}</p><p className="mt-3 flex items-center gap-2 text-xs text-[#eadac8]"><MapPin className="h-4 w-4" />{track.location} · {track.language}</p><div className="mt-6 flex gap-2"><PlayButton track={track} onPlay={onPlay} /><IconButton label={saved ? 'Remove saved track' : 'Save track'} onClick={onSave}><Bookmark fill={saved ? 'currentColor' : 'none'} /></IconButton><IconButton label="Share track" onClick={onShare}><Share2 /></IconButton></div></div></article>; }
function TrackRow({ track, onPlay, saved, onSave, onShare }: TrackProps) { return <article className="flex min-h-24 items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-3"><img src={track.artwork} alt="" className="h-16 w-16 rounded-xl object-cover" /><div className="min-w-0 flex-1"><h3 className="truncate font-devanagari text-base font-semibold">{track.title}</h3><p className="truncate text-xs text-[var(--text-secondary)]">{track.artist} · {track.location}</p><p className="mt-1 text-[10px] text-[var(--accent-secondary)]">{track.credit}</p></div><PlayButton track={track} onPlay={onPlay} /><IconButton label={saved ? 'Remove saved track' : 'Save track'} onClick={onSave}><Bookmark fill={saved ? 'currentColor' : 'none'} /></IconButton><span className="hidden sm:block"><IconButton label="Share track" onClick={onShare}><Share2 /></IconButton></span></article>; }
interface TrackProps { track: AudioTrack; onPlay: (track: AudioTrack) => void; saved: boolean; onSave: () => void; onShare: () => void; }
function PlayButton({ track, onPlay }: { track: AudioTrack; onPlay: (track: AudioTrack) => void }) { return <button onClick={() => onPlay(track)} aria-label={`Play ${track.title}`} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent-primary)] text-white"><Play className="h-4 w-4" fill="currentColor" /></button>; }
function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) { return <button onClick={onClick} aria-label={label} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-current/15 [&>svg]:h-4 [&>svg]:w-4">{children}</button>; }
