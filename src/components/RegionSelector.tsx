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
            className="group relative flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#E9E2D7] focus-visible:ring-[#A94432]"
            style={{
              borderColor: isActive ? accent : 'rgba(73, 55, 43, 0.42)',
              backgroundColor: isActive ? `${accent}28` : 'rgba(255, 253, 248, 0.94)',
              backdropFilter: 'blur(8px)',
              color: '#35251C',
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
