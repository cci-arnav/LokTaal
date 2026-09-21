import { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface InteractiveWaveformProps {
  accent: string;
  bars?: number;
  isPlaying?: boolean;
  progress?: number;
}

/**
 * Pointer-responsive waveform.
 * Horizontal pointer movement changes progression.
 * Vertical pointer movement changes bar height slightly.
 * Disabled on touch devices.
 */
export function InteractiveWaveform({
  accent,
  bars = 48,
  isPlaying = false,
  progress = 0,
}: InteractiveWaveformProps) {
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isTouch || prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPointer({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const effectiveProgress = isTouch ? progress : pointer.x * 100;
  const heightMod = isTouch || prefersReduced ? 1 : 0.7 + pointer.y * 0.6;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="flex h-16 items-center gap-[2px]"
      role="img"
      aria-label="Interactive folk music waveform"
    >
      {Array.from({ length: bars }).map((_, i) => {
        const baseHeight = 15 + Math.abs(Math.sin(i * 0.4)) * 60;
        const dynamicHeight = isPlaying
          ? baseHeight * heightMod * (0.6 + Math.abs(Math.sin(i * 0.3 + Date.now() / 1000)) * 0.4)
          : baseHeight * heightMod;
        const passed = (i / bars) * 100 < effectiveProgress;

        return (
          <motion.div
            key={i}
            className="flex-1 rounded-full"
            style={{
              backgroundColor: passed ? accent : `${accent}33`,
            }}
            animate={
              prefersReduced
                ? undefined
                : isPlaying
                  ? { height: [dynamicHeight * 0.5, dynamicHeight, dynamicHeight * 0.7] }
                  : { height: dynamicHeight }
            }
            transition={
              prefersReduced
                ? { duration: 0 }
                : {
                    duration: 0.3 + (i % 5) * 0.08,
                    repeat: isPlaying ? Infinity : 0,
                    ease: 'easeInOut',
                  }
            }
          />
        );
      })}
    </div>
  );
}
