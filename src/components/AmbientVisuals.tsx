import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface AmbientVisualsProps {
  accent: string;
  mouseX: number;
  mouseY: number;
}

export function AmbientVisuals({ accent, mouseX, mouseY }: AmbientVisualsProps) {
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(500);

  useEffect(() => {
    const updateSize = () => {
      setSize(Math.min(window.innerWidth * 0.55, 620));
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const rings = [0.45, 0.62, 0.78, 0.92];
  const orbitPoints = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      {/* Sound orbit rings */}
      <div
        style={{ width: size, height: size }}
        className="relative flex items-center justify-center"
      >
        {rings.map((scale, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute rounded-full border"
            style={{
              width: size * scale,
              height: size * scale,
              borderColor: `${accent}22`,
              borderWidth: 1,
            }}
            animate={
              prefersReduced
                ? undefined
                : {
                    scale: [1, 1.02, 1],
                    opacity: [0.4, 0.6, 0.4],
                  }
            }
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Moving song points travelling outward */}
        {!prefersReduced &&
          orbitPoints.map((i) => {
            const angle = (i / orbitPoints.length) * Math.PI * 2;
            const ringIndex = i % rings.length;
            const targetScale = rings[ringIndex] * 0.5 + 0.5;
            return (
              <motion.div
                key={`point-${i}`}
                className="absolute rounded-full"
                style={{
                  width: 4,
                  height: 4,
                  backgroundColor: accent,
                  boxShadow: `0 0 8px ${accent}`,
                }}
                animate={{
                  x: [
                    Math.cos(angle) * size * 0.15,
                    Math.cos(angle) * size * targetScale * 0.5,
                  ],
                  y: [
                    Math.sin(angle) * size * 0.15,
                    Math.sin(angle) * size * targetScale * 0.5,
                  ],
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 8 + i * 1.5,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: i * 0.8,
                }}
              />
            );
          })}

        {/* Waveform fragments on rings */}
        {!prefersReduced &&
          [0, 1, 2].map((ringIdx) => {
            const radius = size * rings[ringIdx] * 0.5;
            return (
              <svg
                key={`wave-${ringIdx}`}
                className="absolute"
                width={size * rings[ringIdx]}
                height={size * rings[ringIdx]}
                viewBox={`0 0 ${size * rings[ringIdx]} ${size * rings[ringIdx]}`}
                fill="none"
              >
                <motion.path
                  d={`M ${radius} ${radius - radius * 0.7} Q ${radius + 30} ${radius - radius * 0.5} ${radius} ${radius - radius * 0.3}`}
                  stroke={accent}
                  strokeWidth="1.5"
                  opacity={0.3}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{
                    duration: 5 + ringIdx * 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: ringIdx,
                  }}
                />
              </svg>
            );
          })}

        {/* Glowing location point at center */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 8,
            height: 8,
            backgroundColor: accent,
            boxShadow: `0 0 20px 4px ${accent}88`,
          }}
          animate={
            prefersReduced
              ? undefined
              : {
                  scale: [1, 1.4, 1],
                  opacity: [0.6, 1, 0.6],
                }
          }
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Subtle parallax offset from cursor */}
        {!prefersReduced && (
          <motion.div
            className="absolute inset-0"
            animate={{
              x: mouseX * 12,
              y: mouseY * 12,
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        )}
      </div>
    </div>
  );
}
