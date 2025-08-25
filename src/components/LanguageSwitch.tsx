
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSwitch: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
          className="h-8 px-3 text-xs font-medium bg-white/80 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
          aria-label={`Mudar idioma para ${language === 'pt' ? 'English' : 'Português'}`}
        >
          <span className="flex items-center gap-1.5">
            <span className="font-bold">{language.toUpperCase()}</span>
            <span className="opacity-70">|</span>
            <span>{language === 'pt' ? 'EN' : 'PT'}</span>
          </span>
        </Button>
    </div>
  );
};
