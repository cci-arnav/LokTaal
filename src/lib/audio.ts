export interface AudioSelection { trackId: string | null; isPlaying: boolean; }
export function selectTrack(state: AudioSelection, trackId: string): AudioSelection { return state.trackId === trackId ? { ...state, isPlaying: !state.isPlaying } : { trackId, isPlaying: true }; }
export function formatAudioTime(seconds: number): string { const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0; return `${Math.floor(safe / 60)}:${Math.floor(safe % 60).toString().padStart(2, '0')}`; }
