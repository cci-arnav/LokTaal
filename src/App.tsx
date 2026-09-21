import { useCallback } from 'react';
import { Hero } from '@/components/Hero';
import { ManifestoTransition } from '@/components/sections/ManifestoTransition';
import { SoundJourney } from '@/components/sections/SoundJourney';
import { RegionalDiscovery } from '@/components/sections/RegionalDiscovery';
import { PreservationStory } from '@/components/sections/PreservationStory';
import { WaveformDivider } from '@/components/sections/WaveformDivider';
import { SoundToggle } from '@/components/audio/SoundToggle';
import { useSectionTheme, type ThemeName } from '@/hooks/useSectionTheme';
import { useOptionalSound } from '@/hooks/useOptionalSound';
import '@/styles/themes.css';

function App() {
  const { setActiveTheme } = useSectionTheme();
  const { soundEnabled, toggleSound, playTone } = useOptionalSound();

  const handleThemeChange = useCallback(
    (theme: ThemeName) => {
      setActiveTheme(theme);
    },
    [setActiveTheme]
  );

  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Hero (Midnight Raga — already manages its own theme) */}
      <Hero />

      {/* Manifesto transition (Desert Folk) */}
      <ManifestoTransition />

      {/* Sound Journey (Desert Folk) */}
      <SoundJourney />

      {/* Waveform divider into Forest Echo */}
      <WaveformDivider accent="#D88924" />

      {/* Regional Discovery (Forest Echo) */}
      <RegionalDiscovery soundEnabled={soundEnabled} onPlayTone={playTone} />

      {/* Waveform divider into Indigo Archive */}
      <WaveformDivider accent="#E59B32" />

      {/* Preservation Story (Indigo Archive) */}
      <PreservationStory />

      {/* Global sound control */}
      <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
    </main>
  );
}

export default App;
