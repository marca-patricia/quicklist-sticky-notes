
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
        className="h-8 px-2 text-xs font-medium text-primary-foreground hover:text-primary-foreground hover:bg-primary/20 border border-primary/30 dark:text-black dark:hover:text-black dark:hover:bg-yellow-200 dark:border-yellow-300 bg-transparent"
        aria-label={`Mudar idioma para ${language === 'pt' ? 'English' : 'Português'}`}
      >
        <span className="dark:text-black">{language === 'pt' ? '🇺🇸 EN' : '🇧🇷 PT'}</span>
      </Button>
    </div>
  );
};
