import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Living waveform divider between sections.
 * Amplitude increases slightly when scrolling faster, returns gently to rest.
 */
export function WaveformDivider({ accent }: { accent: string }) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [scrollSpeed, setScrollSpeed] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    if (prefersReduced) return;
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let rafId = 0;

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const now = performance.now();
        const dy = Math.abs(window.scrollY - lastY);
        const dt = now - lastTime;
        const speed = Math.min(dy / dt / 2, 1);
        setScrollSpeed(speed);
        lastY = window.scrollY;
        lastTime = now;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [prefersReduced]);

  const amplitude = 20 + scrollSpeed * 15;
  const pathD = generateWavePath(1200, amplitude, 14);

  return (
    <div ref={ref} className="relative h-24 w-full overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 1200 80"
        className="h-full w-full"
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.path
          d={pathD}
          stroke={accent}
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{
            pathLength: prefersReduced ? 1 : pathLength,
            opacity: 0.4,
          }}
        />
      </svg>
    </div>
  );
}

function generateWavePath(width: number, amplitude: number, segments: number): string {
  const points: string[] = [];
  const segWidth = width / segments;
  for (let i = 0; i <= segments; i++) {
    const x = i * segWidth;
    const y = 40 + Math.sin(i * 0.7) * amplitude + Math.cos(i * 1.1) * (amplitude * 0.5);
    if (i === 0) {
      points.push(`M ${x} ${y}`);
    } else {
      const cx = x - segWidth / 2;
      const cy = 40 + Math.sin((i - 0.5) * 0.7) * amplitude;
      points.push(`Q ${cx} ${cy} ${x} ${y}`);
    }
  }
  return points.join(' ');
}
