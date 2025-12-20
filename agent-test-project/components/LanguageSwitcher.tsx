'use client';

import { useI18n } from '@/lib/i18n/context';
import { locales, localeNames } from '@/lib/i18n/locales';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-1 flex gap-1">
        {locales.map((lang) => (
          <button
            key={lang}
            onClick={() => setLocale(lang)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              locale === lang
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {localeNames[lang]}
          </button>
        ))}
      </div>
    </div>
  );
}
