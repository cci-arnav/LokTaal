export interface FileLike { name: string; size: number; type: string; }
const audioTypes = new Set(['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/m4a']);
const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
export function validateAudioFile(file: FileLike): string {
  const extension = file.name.toLowerCase().split('.').pop();
  if (!audioTypes.has(file.type) || !['mp3', 'm4a'].includes(extension ?? '')) return 'Choose an MP3 or M4A audio file.';
  if (file.size > 25 * 1024 * 1024) return 'Audio must be 25 MB or smaller.';
  return '';
}
export function validateCoverFile(file: FileLike): string {
  if (!imageTypes.has(file.type)) return 'Choose a JPG, PNG or WebP image.';
  if (file.size > 3 * 1024 * 1024) return 'Cover image must be 3 MB or smaller.';
  return '';
}
export function formatFileSize(bytes: number): string { return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`; }
export interface RequiredUploadFields { contributorName: string; email: string; relationship: string; title: string; artist: string; stateSlug: string; district: string; language: string; tradition: string; description: string; culturalStory: string; consent: boolean; review: boolean; }
export function validateRequiredUploadFields(values: RequiredUploadFields): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const key of ['contributorName', 'email', 'relationship', 'title', 'artist', 'stateSlug', 'district', 'language', 'tradition', 'description', 'culturalStory'] as const) if (!values[key].trim()) errors[key] = 'This field is required.';
  if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Enter a valid email address.';
  if (!values.consent) errors.consent = 'Permission confirmation is required.';
  if (!values.review) errors.review = 'Review acknowledgement is required.';
  return errors;
}
