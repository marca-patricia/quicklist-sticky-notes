
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const ThemeToggle: React.FC = () => {
  const { t } = useLanguage();
  
  const [theme, setTheme] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('quicklist-theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'light';
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('quicklist-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

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
