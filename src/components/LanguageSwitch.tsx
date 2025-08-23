
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSwitch: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
          className="h-8 px-2 text-xs font-medium shrink-0 rounded-lg bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 hover:scale-105 transition-all"
          aria-label={`Mudar idioma para ${language === 'pt' ? 'English' : 'Português'}`}
        >
          <span className="flex items-center gap-1">
            <span className="font-bold text-gray-800 dark:text-white">{language.toUpperCase()}</span>
            <span className="opacity-70 text-gray-600 dark:text-gray-300">|</span>
            <span className="text-gray-600 dark:text-gray-300">{language === 'pt' ? 'EN' : 'PT'}</span>
          </span>
        </Button>
    </div>
  );
};
