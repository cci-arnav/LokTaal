export interface SongSubmissionMetadata { [key: string]: string | boolean; }
export interface SongSubmissionDraft { metadata: SongSubmissionMetadata; audioFile: File; coverFile?: File; }
export interface PendingSubmission { status: 'backend-pending'; metadata: SongSubmissionMetadata; }

// TODO Supabase phase:
// 1. Require a Supabase Auth session.
// 2. Upload audio and cover files to Supabase Storage.
// 3. Insert metadata into the `songs` table with moderation_status = `pending`.
// 4. Support pending / approved / rejected moderation transitions.
export async function createSongSubmission(draft: SongSubmissionDraft): Promise<PendingSubmission> {
  return { status: 'backend-pending', metadata: draft.metadata };
}
