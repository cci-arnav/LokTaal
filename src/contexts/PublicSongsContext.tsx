import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { listApprovedSongs } from '@/services/songService';
import { indiaRegions } from '@/data/indiaStates';
import type { AudioTrack } from '@/data/phase3';
import type { SongRecord } from '@/types/backend';

export interface ApprovedAudioTrack extends AudioTrack { songId: string; stateSlug: string; isDemo: false; }
interface PublicSongsValue { songs: SongRecord[]; tracks: ApprovedAudioTrack[]; loading: boolean; error: string; refresh: () => Promise<void>; }
const PublicSongsContext = createContext<PublicSongsValue | null>(null);

function mapSong(song: SongRecord): ApprovedAudioTrack {
  const region = indiaRegions.find((item) => item.slug === song.state_slug);
  return {
    id: `approved-${song.id}`, songId: song.id, stateSlug: song.state_slug, isDemo: false,
    title: song.title, artist: song.artist_name, location: `${song.district_region}, ${region?.name ?? song.state_slug}`,
    language: song.language, tradition: song.folk_genre, artwork: song.cover_url || '/images/demo-tunes/rajasthan.svg',
    duration: song.audio_duration_seconds ? `${Math.floor(song.audio_duration_seconds / 60)}:${String(song.audio_duration_seconds % 60).padStart(2, '0')}` : 'Preview',
    audioUrl: song.audio_url, credit: `Contributed by ${song.contributor_name}`, region: region?.name ?? song.state_slug, addedOrder: Date.parse(song.published_at ?? song.created_at),
  };
}

export function PublicSongsProvider({ children }: { children: React.ReactNode }) {
  const [songs, setSongs] = useState<SongRecord[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true); setError('');
    try { setSongs(await listApprovedSongs()); } catch { setError('Approved community recordings are temporarily unavailable.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const tracks = useMemo(() => songs.map(mapSong), [songs]);
  const value = useMemo(() => ({ songs, tracks, loading, error, refresh }), [songs, tracks, loading, error, refresh]);
  return <PublicSongsContext.Provider value={value}>{children}</PublicSongsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePublicSongs() { const value = useContext(PublicSongsContext); if (!value) throw new Error('usePublicSongs must be used inside PublicSongsProvider'); return value; }
