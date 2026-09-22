import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import { useAudio } from './AudioProvider';
import { formatAudioTime } from '@/lib/audio';
import { useI18n } from '@/contexts/I18nContext';

export function MiniPlayer() {
  const { t } = useI18n();
  const { track, isPlaying, progress, currentTime, duration, volume, muted, loading, error, toggle, seek, setVolume, toggleMute, close } = useAudio();
  useEffect(() => {
    document.documentElement.style.setProperty('--player-space', track ? '7rem' : '0px');
    return () => document.documentElement.style.setProperty('--player-space', '0px');
  }, [track]);
  return (
    <AnimatePresence>
      {track && (
        <motion.aside initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 120, opacity: 0 }} className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[70] mx-auto max-w-4xl rounded-2xl border border-white/15 bg-[#17122B]/95 p-3 text-[#FFF8EA] shadow-2xl backdrop-blur-xl" aria-label={t('audio.nowPlaying')}>
          <div className="flex items-center gap-3">
            <img src={track.artwork} alt="" className="h-12 w-12 rounded-xl object-cover sm:h-14 sm:w-14" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-devanagari text-sm font-semibold sm:text-base">{track.title}</p>
              <p className="truncate text-[11px] text-[#DEC8BB] sm:text-xs">{track.artist} · {track.location}</p>
              {loading && <p className="mt-0.5 text-[10px] text-[#F0B23D]">{t('audio.loading')}</p>}
              {error && <p className="mt-0.5 text-[10px] text-[#ff9e86]">{t('audio.error')}</p>}
              {!track.audioUrl && !error && <p className="mt-0.5 text-[10px] text-[#F0B23D]">{t('audio.previewUnavailable')}</p>}
            </div>
            <button onClick={toggle} type="button" disabled={loading || Boolean(error)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0B23D] text-[#17122B] disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label={isPlaying ? t('audio.pause') : t('audio.play')}>{isPlaying ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5" fill="currentColor" />}</button>
            <button type="button" onClick={toggleMute} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#DEC8BB] hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label={muted ? t('audio.unmute') : t('audio.mute')}>{muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}</button>
            <label className="hidden items-center gap-2 md:flex"><span className="sr-only">{t('audio.volume')}</span><input aria-label={t('audio.volume')} type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-20 accent-[#F0B23D]" /></label>
            <button type="button" onClick={close} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#DEC8BB] hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label={t('audio.close')}><X className="h-5 w-5" /></button>
          </div>
          <div className="mt-2 flex items-center gap-3"><span className="w-9 text-[10px] text-white/60">{formatAudioTime(currentTime)}</span><input aria-label={t('audio.progress')} type="range" min="0" max="100" value={progress} onChange={(e) => seek(Number(e.target.value))} className="h-1 flex-1 accent-[#F0B23D]" /><span className="w-9 text-right text-[10px] text-white/60">{formatAudioTime(duration)}</span></div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
