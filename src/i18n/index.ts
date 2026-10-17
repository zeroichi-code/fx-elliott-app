import { useMemo } from 'react';
import translations, { Lang, TranslationKeys } from './translations';

function detectLanguage(): Lang {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    return locale.startsWith('ja') ? 'ja' : 'en';
  } catch {
    return 'en';
  }
}

const lang = detectLanguage();

export function t(key: TranslationKeys, params?: Record<string, string>): string {
  const str = (translations[lang] as Record<string, unknown>)[key as string];
  if (typeof str !== 'string') return key as string;
  if (!params) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => params[k] ?? '');
}

export function tfLabel(value: string): string {
  return translations[lang].timeFrames[value] ?? value;
}

export function useTranslation() {
  return useMemo(() => ({ t, tfLabel, lang }), []);
}
