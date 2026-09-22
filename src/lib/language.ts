import type { Language } from '@/contexts/I18nContext';
export function normalizeLanguagePreference(value: string | null): Language { return value === 'hi' ? 'hi' : 'en'; }
export function nextLanguage(language: Language): Language { return language === 'en' ? 'hi' : 'en'; }
