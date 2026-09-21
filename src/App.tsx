import { useCallback, useEffect } from 'react';
import { Hero } from '@/components/Hero';
import { Navbar } from '@/components/Navbar';
import { ManifestoTransition } from '@/components/sections/ManifestoTransition';
import { SoundJourney } from '@/components/sections/SoundJourney';
import { RegionalDiscovery } from '@/components/sections/RegionalDiscovery';
import { PreservationStory } from '@/components/sections/PreservationStory';
import { FeaturedVoices } from '@/components/sections/FeaturedVoices';
import { ArchiveCollection } from '@/components/sections/ArchiveCollection';
import { PreserveSongCTA } from '@/components/sections/PreserveSongCTA';
import { WaveformDivider } from '@/components/sections/WaveformDivider';
import { SoundToggle } from '@/components/audio/SoundToggle';
import { AudioProvider } from '@/components/audio/AudioProvider';
import { MiniPlayer } from '@/components/audio/MiniPlayer';
import { useOptionalSound } from '@/hooks/useOptionalSound';
import '@/styles/themes.css';

function ThemeObserver() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-theme]'));
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const marker = window.innerHeight * 0.32;
        const active = sections.find((section) => { const rect = section.getBoundingClientRect(); return rect.top <= marker && rect.bottom > marker; }) ?? sections[0];
        if (active?.dataset.theme) document.documentElement.setAttribute('data-theme', active.dataset.theme);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return null;
}

function Homepage() {
  const { soundEnabled, toggleSound, playTone } = useOptionalSound();
  const handleTone = useCallback((index: number) => playTone(index), [playTone]);
  return <main className="min-h-screen overflow-x-clip pb-[var(--player-space,0px)]">
    <ThemeObserver />
    <Navbar />
    <Hero />
    <ManifestoTransition />
    <SoundJourney />
    <WaveformDivider accent="#D88924" />
    <RegionalDiscovery soundEnabled={soundEnabled} onPlayTone={handleTone} />
    <WaveformDivider accent="#E59B32" />
    <PreservationStory />
    <FeaturedVoices />
    <ArchiveCollection />
    <PreserveSongCTA />
    <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
    <MiniPlayer />
  </main>;
}

export default function App() {
  return <AudioProvider><Homepage /></AudioProvider>;
}
