
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSwitch: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-4 left-4 z-50">
      <Button
        variant="language"
        size="sm"
        onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
      >
        {language === 'pt' ? '🇺🇸 EN' : '🇧🇷 PT'}
      </Button>
    </div>
  );
};
