import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSwitch: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };

  return (
    <Button
      variant="language"
      size="sm"
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 font-semibold"
    >
      {language === 'pt' ? '🇺🇸 EN' : '🇧🇷 PT'}
    </Button>
  );
};