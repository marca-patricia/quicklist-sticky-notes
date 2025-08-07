
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
          className="h-8 px-3 text-xs font-medium bg-background/80 hover:bg-background text-foreground hover:text-foreground border border-muted"
          aria-label={`Mudar idioma para ${language === 'pt' ? 'English' : 'Português'}`}
        >
          <span className="flex items-center gap-1">
            <span className="font-semibold text-primary">{language.toUpperCase()}</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground hover:text-foreground transition-colors">
              {language === 'pt' ? '🇺🇸' : '🇧🇷'}
            </span>
          </span>
        </Button>
    </div>
  );
};
