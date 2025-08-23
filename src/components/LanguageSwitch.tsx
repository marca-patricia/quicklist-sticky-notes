
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
        className="h-8 px-2 text-xs font-medium shrink-0 bg-white/80 border border-black/10 text-gray-800 hover:bg-white/90"
        aria-label={`Mudar idioma para ${language === 'pt' ? 'English' : 'Português'}`}
      >
        <span className="flex items-center gap-1">
          <span className="font-bold">{language.toUpperCase()}</span>
          <span className="opacity-70">|</span>
          <span>{language === 'pt' ? 'EN' : 'PT'}</span>
        </span>
      </Button>
    </div>
  );
};
