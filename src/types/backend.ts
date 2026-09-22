export type SongStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_path: string | null;
  bio: string | null;
  state_slug: string | null;
  preferred_language: 'en' | 'hi';
  created_at: string;
  updated_at: string;
}

export interface SongRecord {
  id: string;
  user_id: string;
  title: string;
  artist_name: string;
  contributor_name: string;
  contributor_relationship: string;
  state_slug: string;
  district_region: string;
  language: string;
  folk_genre: string;
  instruments: string[];
  recording_year: number | null;
  description: string;
  cultural_story: string;
  lyrics: string | null;
  tags: string[];
  audio_path: string | null;
  cover_path: string | null;
  audio_duration_seconds: number | null;
  rights_confirmed: boolean;
  status: SongStatus;
  rejection_reason: string | null;
  submitted_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  audio_url?: string;
  cover_url?: string;
}

export interface UploadProgress {
  stage: 'idle' | 'audio' | 'cover' | 'metadata' | 'submitting' | 'complete' | 'cleanup';
  audio: number;
  cover: number;
  overall: number;
}
