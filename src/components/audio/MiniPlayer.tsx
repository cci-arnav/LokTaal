import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play, Volume2, X } from 'lucide-react';
import { useAudio } from './AudioProvider';

export function MiniPlayer() {
  const { track, isPlaying, progress, volume, toggle, seek, setVolume, close } = useAudio();
  useEffect(() => {
    document.documentElement.style.setProperty('--player-space', track ? '7rem' : '0px');
    return () => document.documentElement.style.setProperty('--player-space', '0px');
  }, [track]);
  return (
    <AnimatePresence>
      {track && (
        <motion.aside initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 120, opacity: 0 }} className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[70] mx-auto max-w-4xl rounded-2xl border border-white/15 bg-[#17122B]/95 p-3 text-[#FFF8EA] shadow-2xl backdrop-blur-xl" aria-label="Now playing">
          <div className="flex items-center gap-3">
            <img src={track.artwork} alt="" className="h-12 w-12 rounded-xl object-cover sm:h-14 sm:w-14" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-devanagari text-sm font-semibold sm:text-base">{track.title}</p>
              <p className="truncate text-[11px] text-[#DEC8BB] sm:text-xs">{track.artist} · {track.location}</p>
              {!track.audioUrl && <p className="mt-0.5 text-[10px] text-[#F0B23D]">Demonstration preview · audio unavailable</p>}
            </div>
            <button onClick={toggle} type="button" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0B23D] text-[#17122B] focus:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label={isPlaying ? 'Pause preview' : 'Play preview'}>{isPlaying ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5" fill="currentColor" />}</button>
            <label className="hidden items-center gap-2 md:flex"><Volume2 className="h-4 w-4" /><span className="sr-only">Volume</span><input aria-label="Volume" type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-20 accent-[#F0B23D]" /></label>
            <button type="button" onClick={close} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#DEC8BB] hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label="Close player"><X className="h-5 w-5" /></button>
          </div>
          <input aria-label="Playback progress" type="range" min="0" max="100" value={progress} onChange={(e) => seek(Number(e.target.value))} className="mt-2 h-1 w-full accent-[#F0B23D]" />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
