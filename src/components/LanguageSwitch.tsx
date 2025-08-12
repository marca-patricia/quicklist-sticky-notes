
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSwitch: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center">
        <Button
          variant="language"
          size="sm"
          onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
          className="h-8 px-3 text-xs font-medium"
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
