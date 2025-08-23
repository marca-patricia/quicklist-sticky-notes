
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/contexts/LanguageContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-8 w-8 p-0 rounded-lg transition-all duration-200 shrink-0 shadow-sm hover:scale-105"
      style={{
        backgroundColor: theme === 'dark' ? '#FFFACC' : 'rgba(255, 255, 255, 0.8)',
        border: theme === 'dark' ? '1px solid #FFF066' : '1px solid rgba(0, 0, 0, 0.1)',
        color: theme === 'dark' ? '#0D0D0D' : '#1a1a1a'
      }}
      aria-label={t('toggleTheme')}
    >
      {theme === 'dark' ? (
        <Sun className="w-3.5 h-3.5" style={{ color: '#0D0D0D' }} />
      ) : (
        <Moon className="w-3.5 h-3.5" style={{ color: '#1a1a1a' }} />
      )}
    </Button>
  );
};
