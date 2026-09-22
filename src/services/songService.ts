import { requireSupabase } from '@/lib/supabase';
import type { SongRecord, SongStatus } from '@/types/backend';

async function attachSignedUrls(song: SongRecord): Promise<SongRecord> {
  const client = requireSupabase();
  const [audio, cover] = await Promise.all([
    song.audio_path ? client.storage.from('song-audio').createSignedUrl(song.audio_path, 3600) : Promise.resolve({ data: null, error: null }),
    song.cover_path ? client.storage.from('song-covers').createSignedUrl(song.cover_path, 3600) : Promise.resolve({ data: null, error: null }),
  ]);
  return { ...song, audio_url: audio.data?.signedUrl, cover_url: cover.data?.signedUrl };
}

async function withSignedUrls(rows: SongRecord[]): Promise<SongRecord[]> { return Promise.all(rows.map(attachSignedUrls)); }

export async function listApprovedSongs(stateSlug?: string): Promise<SongRecord[]> {
  let query = requireSupabase().from('songs').select('*').eq('status', 'approved').order('published_at', { ascending: false });
  if (stateSlug) query = query.eq('state_slug', stateSlug);
  const { data, error } = await query;
  if (error) throw error;
  return withSignedUrls((data ?? []) as SongRecord[]);
}

export async function listMySubmissions(userId: string): Promise<SongRecord[]> {
  const { data, error } = await requireSupabase().from('songs').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return withSignedUrls((data ?? []) as SongRecord[]);
}

export async function getMySubmission(songId: string, userId: string): Promise<SongRecord> {
  const { data, error } = await requireSupabase().from('songs').select('*').eq('id', songId).eq('user_id', userId).single();
  if (error) throw error;
  return attachSignedUrls(data as SongRecord);
}

export async function listModerationSubmissions(status?: SongStatus): Promise<SongRecord[]> {
  let query = requireSupabase().from('songs').select('*').order('submitted_at', { ascending: true });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return withSignedUrls((data ?? []) as SongRecord[]);
}

export async function resubmitSong(songId: string): Promise<void> {
  const { error } = await requireSupabase().rpc('submit_song', { song_id: songId });
  if (error) throw error;
}

export async function approveSong(songId: string): Promise<void> {
  const { error } = await requireSupabase().rpc('approve_song', { song_id: songId });
  if (error) throw error;
}

export async function rejectSong(songId: string, reason: string): Promise<void> {
  const { error } = await requireSupabase().rpc('reject_song', { song_id: songId, reason });
  if (error) throw error;
}

export async function deleteDraft(song: SongRecord): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from('songs').delete().eq('id', song.id).eq('status', 'draft');
  if (error) throw error;
  await Promise.all([
    song.audio_path ? client.storage.from('song-audio').remove([song.audio_path]) : Promise.resolve(),
    song.cover_path ? client.storage.from('song-covers').remove([song.cover_path]) : Promise.resolve(),
  ]);
}
