import { motion, useReducedMotion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { regionChips } from '@/data/featuredTracks';

interface RegionSelectorProps {
  activeRegion: string;
  onSelect: (region: string) => void;
  accent: string;
}

export function RegionSelector({ activeRegion, onSelect, accent }: RegionSelectorProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="flex flex-wrap gap-2 sm:gap-2.5" role="group" aria-label="Select a folk music region">
      {regionChips.map((region) => {
        const isActive = region === activeRegion;
        return (
          <button
            key={region}
            type="button"
            onClick={() => onSelect(region)}
            aria-pressed={isActive}
            className="group relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-midnight focus-visible:ring-saffron"
            style={{
              borderColor: isActive ? accent : 'rgba(232, 215, 185, 0.2)',
              backgroundColor: isActive ? `${accent}22` : 'rgba(23, 18, 43, 0.5)',
              backdropFilter: 'blur(8px)',
              color: isActive ? '#FFF8EA' : 'rgba(232, 215, 185, 0.7)',
            }}
          >
            {isActive && (
              <motion.span
                layoutId="region-active-dot"
                className="flex items-center"
                transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 25 }}
              >
                <MapPin
                  className="h-3 w-3"
                  style={{ color: accent }}
                  strokeWidth={2.5}
                />
              </motion.span>
            )}
            <span className={isActive ? 'font-semibold' : ''}>{region}</span>
            {isActive && (
              <motion.span
                className="absolute -bottom-px left-1/2 h-0.5 rounded-full"
                style={{ backgroundColor: accent, width: '60%' }}
                layoutId="region-active-underline"
                transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 25 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
