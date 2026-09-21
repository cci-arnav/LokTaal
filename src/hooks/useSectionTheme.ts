import { useEffect, useState, useCallback } from 'react';

export type ThemeName = 'midnight-raga' | 'desert-folk' | 'forest-echo' | 'indigo-archive';

export const themeNames: ThemeName[] = [
  'midnight-raga',
  'desert-folk',
  'forest-echo',
  'indigo-archive',
];

/**
 * Reads or sets the active theme on the <html> element.
 * The SectionThemeController calls setActiveTheme when sections enter the viewport.
 */
export function useSectionTheme() {
  const [activeTheme, setActiveThemeState] = useState<ThemeName>('midnight-raga');

  const setActiveTheme = useCallback((theme: ThemeName) => {
    setActiveThemeState(theme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme);
    document.body.style.backgroundColor = `var(--page-bg)`;
    document.body.style.color = `var(--text-primary)`;
  }, [activeTheme]);

  return { activeTheme, setActiveTheme };
}
