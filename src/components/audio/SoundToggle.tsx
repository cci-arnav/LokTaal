import { motion, useReducedMotion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

/**
 * Fixed sound control button at lower-right.
 * Default: Sound Off. Activates only on explicit user click.
 */
export function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        type="button"
        onClick={onToggle}
        aria-label={enabled ? 'Turn sound off' : 'Turn sound on'}
        aria-pressed={enabled}
        className="group flex items-center gap-2.5 rounded-full border px-4 py-3 shadow-lg backdrop-blur-md transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          borderColor: enabled ? 'var(--accent-primary)' : 'var(--border-subtle)',
          backgroundColor: enabled
            ? 'color-mix(in srgb, var(--accent-primary) 15%, var(--surface))'
            : 'var(--surface)',
          color: enabled ? 'var(--accent-primary)' : 'var(--text-secondary)',
          // @ts-expect-error CSS custom property
          '--tw-ring-color': 'var(--accent-primary)',
          '--tw-ring-offset-color': 'var(--page-bg)',
        }}
      >
        {/* Animated waveform / pulse icon */}
        <span className="flex h-5 items-end gap-[2px]">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="w-[2px] rounded-full"
              style={{
                backgroundColor: 'currentColor',
                height: enabled ? '100%' : '30%',
              }}
              animate={
                prefersReduced || !enabled
                  ? undefined
                  : {
                      height: ['40%', '100%', '60%', '100%', '40%'],
                    }
              }
              transition={{
                duration: 0.8 + i * 0.15,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.1,
              }}
            />
          ))}
        </span>

        <span className="text-xs font-semibold uppercase tracking-wider">
          {enabled ? 'Sound On' : 'Sound Off'}
        </span>

        {enabled ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <VolumeX className="h-4 w-4 opacity-60" />
        )}
      </button>
    </div>
  );
}
