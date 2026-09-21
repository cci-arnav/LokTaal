import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

const movingText = 'A song disappears when no one carries it forward.';

export function ManifestoTransition() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const rhythmLineProgress = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.4, 0.4, 0]);
  const textX = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
  const firstLineY = useTransform(scrollYProgress, [0.15, 0.4], [40, 0]);
  const firstLineOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
  const secondLineY = useTransform(scrollYProgress, [0.25, 0.5], [40, 0]);
  const secondLineOpacity = useTransform(scrollYProgress, [0.25, 0.45], [0, 1]);
  const englishOpacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);

  return (
    <section
      ref={sectionRef}
      data-theme="desert-folk"
      className="relative overflow-hidden py-20 sm:py-28 lg:py-32"
      style={{
        backgroundColor: 'var(--page-bg)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Woven texture overlay */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{ opacity: prefersReduced ? 0.15 : bgOpacity }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='40' viewBox='0 0 80 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23A9342B' stroke-width='0.4' opacity='0.2'%3E%3Cpath d='M0 20 Q20 5 40 20 T80 20'/%3E%3Cpath d='M0 30 Q20 15 40 30 T80 30'/%3E%3Cpath d='M0 10 Q20 25 40 10 T80 10'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </motion.div>

      {/* Moving text strip */}
      <div className="absolute top-16 overflow-hidden whitespace-nowrap py-3" aria-hidden="true">
        <motion.div
          className="inline-block"
          style={{ x: prefersReduced ? 0 : textX }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="mx-8 font-devanagari text-sm"
              style={{ color: 'var(--text-secondary)', opacity: 0.4 }}
            >
              {movingText}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Curved rhythm line */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 px-4" aria-hidden="true">
        <svg
          viewBox="0 0 1200 80"
          className="w-full"
          preserveAspectRatio="none"
          fill="none"
        >
          <motion.path
            d="M0 40 Q150 10 300 40 T600 40 T900 40 T1200 40"
            stroke="var(--rhythm-line)"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{
              pathLength: prefersReduced ? 1 : rhythmLineProgress,
              opacity: 0.5,
            }}
          />
          {/* Beat points along the line */}
          {[150, 350, 550, 750, 950].map((cx, i) => (
            <circle
              key={i}
              cx={cx}
              cy={40}
              r="3"
              fill="var(--accent-primary)"
              opacity={0.4}
            />
          ))}
          {/* Moving beat point */}
          {!prefersReduced && (
            <motion.circle
              r="5"
              fill="var(--accent-primary)"
              animate={{
                cx: [0, 1200],
                opacity: [0, 1, 0],
              }}
              transition={{
                cx: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              }}
              cy={40}
            />
          )}
        </svg>
      </div>

      {/* Main statement */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.h2
          className="font-devanagari leading-[1.2]"
          style={{
            fontSize: 'clamp(1.75rem, 5vw, 3.5rem)',
            color: 'var(--text-primary)',
          }}
        >
          <motion.span
            className="block overflow-hidden"
            style={{
              y: prefersReduced ? 0 : firstLineY,
              opacity: prefersReduced ? 1 : firstLineOpacity,
            }}
          >
            संगीत केवल सुना नहीं जाता—
          </motion.span>
          <motion.span
            className="mt-2 block overflow-hidden"
            style={{
              y: prefersReduced ? 0 : secondLineY,
              opacity: prefersReduced ? 1 : secondLineOpacity,
              color: 'var(--accent-primary)',
            }}
          >
            उसे पीढ़ियों तक पहुँचाया जाता है।
          </motion.span>
        </motion.h2>

        <motion.p
          className="mx-auto mt-6 max-w-xl text-sm leading-relaxed sm:text-base"
          style={{
            color: 'var(--text-secondary)',
            opacity: prefersReduced ? 1 : englishOpacity,
          }}
        >
          Folk music lives through memory, community and the people who choose to carry
          it forward.
        </motion.p>
      </div>
    </section>
  );
}
