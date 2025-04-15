import React, { createContext, useContext, ReactNode } from 'react';
import { useClaimContext } from './ClaimContext';
import { getTranslation } from '@/utils/translations';

interface TranslationContextType {
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { language } = useClaimContext();
  
  const t = (key: string): string => {
    return getTranslation(key, language);
  };
  
  return (
    <TranslationContext.Provider value={{ t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslationContext must be used within a TranslationProvider');
  }
  return context;
};