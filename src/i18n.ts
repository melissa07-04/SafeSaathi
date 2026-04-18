import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './i18n/locales/en.json';
import hiTranslations from './i18n/locales/hi.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      hi: { translation: hiTranslations }
    },
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
