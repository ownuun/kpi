export type Locale = 'en' | 'ko';

export const locales: Locale[] = ['en', 'ko'];

export const defaultLocale: Locale = 'ko';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
};
