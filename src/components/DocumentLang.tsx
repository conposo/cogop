'use client';

import { useEffect } from 'react';
import { useI18n } from '@/contexts/I18nContext';

const HTML_LANG: Record<string, string> = {
  en: 'en',
  bg: 'bg',
};

/**
 * Keeps `<html lang>` aligned with the active UI locale for a11y and SEO hints.
 */
export default function DocumentLang() {
  const { language } = useI18n();

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[language] ?? 'bg';
  }, [language]);

  return null;
}
