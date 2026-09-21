import { useEffect, useRef, useCallback } from 'react';
import type { ThemeName } from '@/hooks/useSectionTheme';

interface SectionThemeControllerProps {
  theme: ThemeName;
  onActivate: (theme: ThemeName) => void;
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Wraps a section, sets data-theme on it, and fires onActivate when the section
 * crosses the viewport midpoint via IntersectionObserver.
 */
export function SectionThemeController({
  theme,
  onActivate,
  children,
  className = '',
  id,
  as = 'section',
}: SectionThemeControllerProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onActivate(theme);
          }
        });
      },
      { threshold: 0.35, rootMargin: '-20% 0px -30% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [theme, onActivate]);

  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref}
      data-theme={theme}
      id={id}
      className={className}
      style={{
        backgroundColor: 'var(--page-bg)',
        color: 'var(--text-primary)',
      }}
    >
      {children}
    </Tag>
  );
}
