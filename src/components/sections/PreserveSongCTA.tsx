import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Upload, X } from 'lucide-react';
import { useRouter } from '@/contexts/RouterContext';

export function PreserveSongCTA() {
  const [open, setOpen] = useState(false);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const reduced = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { navigate } = useRouter();

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'Tab') {
        const modal = document.getElementById('upload-info-modal');
        const focusable = modal?.querySelectorAll<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])');
        if (!focusable?.length) return;
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); trigger?.focus(); };
  }, [open]);

  return (
    <section id="preserve" data-theme="midnight-raga" onPointerMove={(e) => { if (reduced || e.pointerType === 'touch') return; const r = e.currentTarget.getBoundingClientRect(); setPointer({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }} className="relative overflow-hidden bg-[var(--page-bg)] px-4 py-20 text-[var(--text-primary)] sm:px-6 lg:px-10 lg:py-28">
      <div className="absolute inset-0 opacity-70" aria-hidden="true" style={{ background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(233,165,43,.18), transparent 28%)` }} />
      <svg className="absolute inset-x-0 top-1/2 h-48 w-full -translate-y-1/2 opacity-30" viewBox="0 0 1200 180" preserveAspectRatio="none" aria-hidden="true"><motion.path d="M0 90 C150 20 250 160 400 90 S650 20 800 90 1050 160 1200 90" fill="none" stroke="var(--accent-primary)" strokeWidth="2" animate={reduced ? undefined : { d: [`M0 90 C150 20 250 160 400 90 S650 20 800 90 1050 160 1200 90`, `M0 90 C150 55 250 125 400 90 S650 55 800 90 1050 125 1200 90`, `M0 90 C150 20 250 160 400 90 S650 20 800 90 1050 160 1200 90`] }} transition={{ duration: 5, repeat: Infinity }} /></svg>
      <div className="relative mx-auto max-w-4xl text-center"><p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--accent-primary)]">Preserve a Song</p><h2 className="mt-5 font-devanagari text-3xl leading-tight sm:text-5xl lg:text-6xl">क्या आपके पास कोई भूली हुई लोकधुन है?</h2><p className="mx-auto mt-6 max-w-2xl font-devanagari text-base leading-8 text-[var(--text-secondary)] sm:text-lg">किसी कलाकार, परिवार या समुदाय की आवाज़ को सुरक्षित रखने में मदद करें। सही जानकारी और अनुमति के साथ उसे लोकताल पर साझा करें।</p><p className="mt-3 text-sm text-[var(--text-secondary)]">Help preserve a song—with proper credit, context and permission.</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"><button onClick={() => navigate('/login?redirect=/upload')} className="group flex min-h-14 items-center gap-3 rounded-full bg-[var(--accent-primary)] px-7 font-semibold text-[#17122B]"><Upload className="h-5 w-5" /><span><span className="block font-devanagari">लोकधुन अपलोड करें</span><span className="block text-[10px] uppercase tracking-wider opacity-65">Upload a Folk Song</span></span></button><button ref={triggerRef} onClick={() => setOpen(true)} className="flex min-h-14 items-center gap-3 rounded-full border border-[var(--border-subtle)] px-7"><span><span className="block font-devanagari">अपलोड प्रक्रिया समझें</span><span className="block text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">How preservation works</span></span><ArrowRight className="h-4 w-4" /></button></div>
      </div>
      <AnimatePresence>{open && <motion.div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div id="upload-info-modal" role="dialog" aria-modal="true" aria-labelledby="upload-modal-title" initial={reduced ? false : { opacity: 0, y: 20, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduced ? undefined : { opacity: 0, y: 12 }} className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#211A3B] p-7 text-[#FFF8EA] shadow-2xl"><button ref={closeRef} onClick={() => setOpen(false)} aria-label="Close upload information" className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10"><X /></button><p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E9A52B]">Coming in a later phase</p><h3 id="upload-modal-title" className="mt-4 pr-10 font-devanagari text-2xl">सम्मान के साथ संग्रह</h3><p className="mt-4 text-sm leading-7 text-[#CFC2AF]">The upload experience is being designed around informed permission, accurate artist and community credit, cultural context, and clear rights. No submission is being collected yet.</p><ul className="mt-5 space-y-2 text-sm text-[#CFC2AF]"><li>• Confirm consent from the artist or community</li><li>• Record place, language and tradition</li><li>• Choose clear reuse and attribution terms</li></ul><button onClick={() => setOpen(false)} className="mt-7 min-h-11 rounded-full bg-[#E9A52B] px-6 font-semibold text-[#17122B]">Understood</button></motion.div></motion.div>}</AnimatePresence>
    </section>
  );
}
