import { useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface RhythmTrailProps {
  activeBeat: number;
  onBeatClick: (index: number) => void;
  accent: string;
  beats: { x: number; y: number }[];
}

/**
 * SVG-based hand-drawn waveform trail that draws itself as the user scrolls.
 * Beat markers activate and can be clicked to play tones.
 */
export function RhythmTrail({ activeBeat, onBeatClick, accent, beats }: RhythmTrailProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [drawProgress, setDrawProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = (vh - rect.top) / (rect.height + vh);
        setDrawProgress(Math.max(0, Math.min(1, progress)));
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Generate a hand-drawn waveform path
  const pathD = generateWavePath(1200, 60, 12);

  return (
    <div ref={ref} className="relative w-full" aria-hidden="true">
      <svg
        viewBox="0 0 1200 80"
        className="w-full"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Faint full trail */}
        <path
          d={pathD}
          stroke={accent}
          strokeWidth="1"
          strokeLinecap="round"
          opacity={0.15}
        />
        {/* Drawn trail */}
        {!prefersReduced && (
          <motion.path
            d={pathD}
            stroke={accent}
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              pathLength: drawProgress,
              opacity: 0.6,
            }}
          />
        )}

        {/* Beat markers */}
        {beats.map((beat, i) => {
          const isActive = i <= activeBeat;
          const isCurrent = i === activeBeat;
          return (
            <g key={i}>
              {/* Pulse ring for active beats */}
              {isCurrent && !prefersReduced && (
                <motion.circle
                  cx={beat.x}
                  cy={beat.y}
                  r="4"
                  fill="none"
                  stroke={accent}
                  strokeWidth="1.5"
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <circle
                cx={beat.x}
                cy={beat.y}
                r={isCurrent ? 5 : 4}
                fill={isActive ? accent : 'var(--surface-raised)'}
                stroke={accent}
                strokeWidth="1"
                opacity={isActive ? 1 : 0.4}
                style={{ transition: 'all 0.4s ease' }}
              />
              {/* Interactive hit area */}
              <circle
                cx={beat.x}
                cy={beat.y}
                r="16"
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onClick={() => onBeatClick(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onBeatClick(i);
                  }
                }}
                aria-label={`Beat ${i + 1}`}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function generateWavePath(width: number, height: number, segments: number): string {
  const points: string[] = [];
  const segWidth = width / segments;
  for (let i = 0; i <= segments; i++) {
    const x = i * segWidth;
    const y = 40 + Math.sin(i * 0.8) * (height / 3) + Math.cos(i * 1.3) * (height / 5);
    if (i === 0) {
      points.push(`M ${x} ${y}`);
    } else {
      const cx = x - segWidth / 2;
      const cy = 40 + Math.sin((i - 0.5) * 0.8) * (height / 3);
      points.push(`Q ${cx} ${cy} ${x} ${y}`);
    }
  }
  return points.join(' ');
}
