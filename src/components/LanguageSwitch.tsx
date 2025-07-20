
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
        className="bg-transparent hover:bg-white/20 text-gray-700 border-none"
      >
        {language === 'pt' ? '🇺🇸 EN' : '🇧🇷 PT'}
      </Button>
    </div>
  );
};
