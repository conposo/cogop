import { I18n } from 'i18n-js';
import { useI18n } from '@/contexts/I18nContext';
import { bgMessages } from './bg';
import { enMessages } from './en';

/** Keys present in the English catalog — keep en/bg objects aligned. */
export type TranslationKey = keyof typeof enMessages;

export type TranslateOptions = Record<string, unknown>;

const i18n = new I18n();

i18n.translations = {
  en: enMessages,
  bg: bgMessages,
};

i18n.locale = 'bg';

export function useTranslation() {
  const { language } = useI18n();

  return {
    t: (key: string, options?: TranslateOptions) => {
      i18n.locale = language;
      return i18n.t(key, options);
    },
    language,
  };
}

export function setLocale(locale: string) {
  i18n.locale = locale;
}

export function t(key: string, options?: TranslateOptions) {
  return i18n.t(key, options);
}
