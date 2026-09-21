import { useEffect, useRef, useState, useCallback } from 'react';

// Pentatonic frequencies (C minor pentatonic) for generated tones
const PENTATONIC = [261.63, 311.13, 349.23, 392.0, 466.16];

interface UseOptionalSoundReturn {
  soundEnabled: boolean;
  toggleSound: () => void;
  playTone: (index?: number) => void;
}

/**
 * Global optional sound control using the Web Audio API.
 * Sound is OFF by default. Tones are only generated after the user explicitly enables sound.
 * Designed so real licensed folk-music previews can replace generated tones later.
 */
export function useOptionalSound(): UseOptionalSoundReturn {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeOscRef = useRef<OscillatorNode | null>(null);

  // Restore session preference
  useEffect(() => {
    const stored = sessionStorage.getItem('loktaal-sound');
    if (stored === 'true') setSoundEnabled(true);
  }, []);

  // Persist session preference
  useEffect(() => {
    sessionStorage.setItem('loktaal-sound', String(soundEnabled));
  }, [soundEnabled]);

  const ensureContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (Ctx) audioCtxRef.current = new Ctx();
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const stopTone = useCallback(() => {
    if (activeOscRef.current) {
      try {
        activeOscRef.current.stop();
      } catch {
        // already stopped
      }
      activeOscRef.current = null;
    }
  }, []);

  const playTone = useCallback(
    (index = 0) => {
      if (!soundEnabled) return;
      const ctx = ensureContext();
      if (!ctx) return;

      stopTone();

      const freq = PENTATONIC[index % PENTATONIC.length];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      // Soft envelope: quick attack, gentle decay
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);

      activeOscRef.current = osc;
    },
    [soundEnabled, ensureContext, stopTone]
  );

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) {
        ensureContext();
      } else {
        stopTone();
      }
      return next;
    });
  }, [ensureContext, stopTone]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTone();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, [stopTone]);

  return { soundEnabled, toggleSound, playTone };
}
