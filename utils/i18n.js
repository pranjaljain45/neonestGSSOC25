import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18next
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',        // fallback language if detection fails
        lng: 'en',                // explicitly set default language to English
        supportedLngs: ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'bn', 'mr', 'gu'],
        ns: ['common'],
        defaultNS: 'common',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18next;
