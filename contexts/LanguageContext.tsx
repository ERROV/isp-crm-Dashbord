import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import { translations, TranslationKey } from '../translations';

export type Language = 'en' | 'ar';
type Locale = 'en-US' | 'ar-EG';
type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, options?: Record<string, string | number>) => string;
  locale: Locale;
  dir: Direction;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar');

  // Load language from localStorage (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language') as Language | null;
      if (savedLang) {
        setLanguageState(savedLang);
      }
    }
  }, []);

  // Update <html> lang and dir attributes when language changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('language', language);
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: TranslationKey, options?: Record<string, string | number>): string => {
      const langTranslations = translations[language];
      let translation = key.split('.').reduce((obj, k) => obj && (obj as any)[k], langTranslations) as string;

      if (!translation) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }

      if (options) {
        Object.entries(options).forEach(([k, v]) => {
          translation = translation.replace(`{{${k}}}`, String(v));
        });
      }

      return translation;
    },
    [language]
  );

  const locale = useMemo<Locale>(() => (language === 'ar' ? 'ar-EG' : 'en-US'), [language]);
  const dir = useMemo<Direction>(() => (language === 'ar' ? 'rtl' : 'ltr'), [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      locale,
      dir,
    }),
    [language, setLanguage, t, locale, dir]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
