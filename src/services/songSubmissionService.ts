import { requireSupabase } from '@/lib/supabase';
import { cleanupTargets, createStoragePath } from '@/lib/submissionRules';
import type { SongRecord, UploadProgress } from '@/types/backend';

export interface SongSubmissionMetadata { [key: string]: string | boolean; }
export interface SongSubmissionDraft { metadata: SongSubmissionMetadata; audioFile: File; coverFile?: File; }
export interface SongUpdateDraft { metadata: SongSubmissionMetadata; audioFile?: File; coverFile?: File; }
export interface SubmissionResult { status: 'pending'; song: SongRecord; }
export type ProgressListener = (progress: UploadProgress) => void;

export class UploadCancelledError extends Error { constructor() { super('Upload cancelled.'); this.name = 'UploadCancelledError'; } }

async function cleanupFiles(audioPath?: string | null, coverPath?: string | null): Promise<void> {
  const client = requireSupabase();
  const targets = cleanupTargets(audioPath, coverPath);
  await Promise.all([
    targets.audio.length ? client.storage.from('song-audio').remove(targets.audio) : Promise.resolve(),
    targets.covers.length ? client.storage.from('song-covers').remove(targets.covers) : Promise.resolve(),
  ]);
}

function assertNotCancelled(signal?: AbortSignal) { if (signal?.aborted) throw new UploadCancelledError(); }
function splitList(value: unknown): string[] { return String(value ?? '').split(',').map((item) => item.trim()).filter(Boolean).slice(0, 30); }
function optionalYear(value: unknown): number | null { const parsed = Number(value); return Number.isInteger(parsed) && parsed > 0 ? parsed : null; }

export async function createSongSubmission(draft: SongSubmissionDraft, userId: string, onProgress?: ProgressListener, signal?: AbortSignal): Promise<SubmissionResult> {
  const client = requireSupabase();
  const songId = crypto.randomUUID();
  const audioPath = createStoragePath(userId, songId, draft.audioFile.name);
  const coverPath = draft.coverFile ? createStoragePath(userId, songId, draft.coverFile.name) : null;
  let rowCreated = false;
  const progress = (stage: UploadProgress['stage'], audio: number, cover: number, overall: number) => onProgress?.({ stage, audio, cover, overall });
  try {
    assertNotCancelled(signal); progress('audio', 0, 0, 5);
    const audioUpload = await client.storage.from('song-audio').upload(audioPath, draft.audioFile, { contentType: draft.audioFile.type, upsert: false, cacheControl: '3600' });
    if (audioUpload.error) throw audioUpload.error;
    assertNotCancelled(signal); progress('cover', 100, draft.coverFile ? 0 : 100, 45);
    if (draft.coverFile && coverPath) {
      const coverUpload = await client.storage.from('song-covers').upload(coverPath, draft.coverFile, { contentType: draft.coverFile.type, upsert: false, cacheControl: '3600' });
      if (coverUpload.error) throw coverUpload.error;
    }
    assertNotCancelled(signal); progress('metadata', 100, 100, 72);
    const m = draft.metadata;
    const payload = {
      id: songId, user_id: userId, title: String(m.title ?? '').trim(), artist_name: String(m.artist ?? '').trim(),
      contributor_name: String(m.contributorName ?? '').trim(), contributor_relationship: String(m.relationship ?? '').trim(),
      state_slug: String(m.stateSlug ?? ''), district_region: String(m.district ?? '').trim(), language: String(m.language ?? '').trim(),
      folk_genre: String(m.tradition ?? '').trim(), instruments: splitList(m.instruments), recording_year: optionalYear(m.year),
      description: String(m.description ?? '').trim(), cultural_story: String(m.culturalStory ?? '').trim(), lyrics: String(m.lyrics ?? '').trim() || null,
      tags: splitList(m.tags), audio_path: audioPath, cover_path: coverPath, rights_confirmed: m.consent === true,
    };
    const inserted = await client.from('songs').insert(payload).select('*').single();
    if (inserted.error) throw inserted.error;
    rowCreated = true;
    progress('submitting', 100, 100, 90);
    const submitted = await client.rpc('submit_song', { song_id: songId });
    if (submitted.error) throw submitted.error;
    progress('complete', 100, 100, 100);
    return { status: 'pending', song: submitted.data as SongRecord };
  } catch (error) {
    if (!rowCreated) { progress('cleanup', 100, 100, 0); await cleanupFiles(audioPath, coverPath); }
    throw error;
  }
}

export async function updateSongSubmission(existing: SongRecord, draft: SongUpdateDraft, userId: string, onProgress?: ProgressListener, signal?: AbortSignal): Promise<SubmissionResult> {
  const client = requireSupabase();
  const newAudioPath = draft.audioFile ? createStoragePath(userId, existing.id, draft.audioFile.name) : null;
  const newCoverPath = draft.coverFile ? createStoragePath(userId, existing.id, draft.coverFile.name) : null;
  let rowUpdated = false;
  const progress = (stage: UploadProgress['stage'], audio: number, cover: number, overall: number) => onProgress?.({ stage, audio, cover, overall });
  try {
    assertNotCancelled(signal); progress('audio', draft.audioFile ? 0 : 100, 0, 5);
    if (draft.audioFile && newAudioPath) { const result = await client.storage.from('song-audio').upload(newAudioPath, draft.audioFile, { contentType: draft.audioFile.type, upsert: false }); if (result.error) throw result.error; }
    assertNotCancelled(signal); progress('cover', 100, draft.coverFile ? 0 : 100, 45);
    if (draft.coverFile && newCoverPath) { const result = await client.storage.from('song-covers').upload(newCoverPath, draft.coverFile, { contentType: draft.coverFile.type, upsert: false }); if (result.error) throw result.error; }
    assertNotCancelled(signal); progress('metadata', 100, 100, 72);
    const m = draft.metadata;
    const payload = {
      title: String(m.title ?? '').trim(), artist_name: String(m.artist ?? '').trim(), contributor_name: String(m.contributorName ?? '').trim(), contributor_relationship: String(m.relationship ?? '').trim(),
      state_slug: String(m.stateSlug ?? ''), district_region: String(m.district ?? '').trim(), language: String(m.language ?? '').trim(), folk_genre: String(m.tradition ?? '').trim(),
      instruments: splitList(m.instruments), recording_year: optionalYear(m.year), description: String(m.description ?? '').trim(), cultural_story: String(m.culturalStory ?? '').trim(), lyrics: String(m.lyrics ?? '').trim() || null,
      tags: splitList(m.tags), audio_path: newAudioPath ?? existing.audio_path, cover_path: newCoverPath ?? existing.cover_path, rights_confirmed: m.consent === true,
    };
    const updated = await client.from('songs').update(payload).eq('id', existing.id).eq('user_id', userId).select('*').single();
    if (updated.error) throw updated.error;
    rowUpdated = true;
    await cleanupFiles(draft.audioFile ? existing.audio_path : null, draft.coverFile ? existing.cover_path : null);
    progress('submitting', 100, 100, 90);
    const submitted = await client.rpc('submit_song', { song_id: existing.id });
    if (submitted.error) throw submitted.error;
    progress('complete', 100, 100, 100);
    return { status: 'pending', song: submitted.data as SongRecord };
  } catch (error) {
    if (!rowUpdated) await cleanupFiles(newAudioPath, newCoverPath);
    throw error;
  }
}
