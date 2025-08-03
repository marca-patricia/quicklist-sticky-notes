
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
        className="h-8 px-2 text-xs font-medium text-primary-foreground hover:text-primary-foreground hover:bg-primary/20 border border-primary/30 dark:text-foreground dark:hover:text-foreground dark:hover:bg-muted dark:border-border bg-transparent"
        aria-label={`Mudar idioma para ${language === 'pt' ? 'English' : 'Português'}`}
      >
        {language === 'pt' ? '🇺🇸 EN' : '🇧🇷 PT'}
      </Button>
    </div>
  );
};
