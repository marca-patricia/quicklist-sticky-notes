
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
          className="h-8 px-3 text-xs font-medium bg-background hover:bg-muted text-black dark:text-black border-2 border-border hover:border-primary/50"
          aria-label={`Mudar idioma para ${language === 'pt' ? 'English' : 'Português'}`}
        >
          <span className="flex items-center gap-1.5">
            <span className="font-bold text-black dark:text-black">{language.toUpperCase()}</span>
            <span className="text-black dark:text-black">|</span>
            <span className="text-black dark:text-black transition-colors">
              {language === 'pt' ? '🇺🇸' : '🇧🇷'}
            </span>
          </span>
        </Button>
    </div>
  );
};
