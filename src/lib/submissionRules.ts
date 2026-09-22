import type { SongRecord, SongStatus } from '@/types/backend';

export const PUBLIC_SONG_STATUS: SongStatus = 'approved';
export const editableStatuses: SongStatus[] = ['draft', 'rejected'];

export function canContributorEdit(status: SongStatus): boolean {
  return editableStatuses.includes(status);
}

export function canSubmitStatus(status: SongStatus): boolean {
  return status === 'draft' || status === 'rejected';
}

export function isPublicSong(song: Pick<SongRecord, 'status' | 'published_at'>): boolean {
  return song.status === PUBLIC_SONG_STATUS && Boolean(song.published_at);
}

export function ownsSong(song: Pick<SongRecord, 'user_id'>, userId: string | null | undefined): boolean {
  return Boolean(userId) && song.user_id === userId;
}

export function safeStorageSegment(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9.-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'file';
}

export function createStoragePath(userId: string, songId: string, fileName: string): string {
  const extension = fileName.includes('.') ? `.${safeStorageSegment(fileName.split('.').pop() ?? '')}` : '';
  return `${userId}/${songId}/${crypto.randomUUID()}-${safeStorageSegment(fileName.replace(/\.[^.]+$/, ''))}${extension}`;
}

export function cleanupTargets(audioPath?: string | null, coverPath?: string | null) {
  return { audio: audioPath ? [audioPath] : [], covers: coverPath ? [coverPath] : [] };
}

export function statusLabel(status: SongStatus, language: 'en' | 'hi'): string {
  const labels = {
    en: { draft: 'Draft', pending: 'Pending review', approved: 'Approved', rejected: 'Rejected' },
    hi: { draft: 'ड्राफ़्ट', pending: 'समीक्षा लंबित', approved: 'स्वीकृत', rejected: 'अस्वीकृत' },
  } as const;
  return labels[language][status];
}

export function friendlyBackendError(language: 'en' | 'hi', fallback?: string): string {
  if (fallback?.includes('Supabase is not configured')) return fallback;
  return language === 'hi'
    ? 'अनुरोध पूरा नहीं हो सका। कृपया अपना कनेक्शन जाँचें और फिर प्रयास करें।'
    : 'The request could not be completed. Check your connection and try again.';
}
