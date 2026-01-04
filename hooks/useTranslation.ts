// Custom hook for using translations throughout the app
import { useContext, createContext } from 'react';
import { Language, Translations, t, getVitalInstructions } from '../services/translations';
import { AccessibilityState } from '../types';

// This hook simplifies using translations in components
export const useTranslation = (accessibility: AccessibilityState) => {
  const language = accessibility.language as Language;
  
  return {
    t: (key: keyof Translations) => t(key, language),
    getVitalInstructions: (vitalType: string) => getVitalInstructions(vitalType, language),
    language,
  };
};
