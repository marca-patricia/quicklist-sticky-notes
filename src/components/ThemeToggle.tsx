
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Moon, Sun, Monitor, Palette } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type Theme = 'light' | 'dark' | 'system';

export const ThemeToggle: React.FC = () => {
  const { t } = useLanguage();
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  React.useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (newTheme: Theme) => {
      let effectiveTheme = newTheme;
      
      if (newTheme === 'system') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      root.classList.remove('light', 'dark');
      root.classList.add(effectiveTheme);
      localStorage.setItem('theme', newTheme);
    };

    applyTheme(theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const themes = [
    { value: 'light' as const, label: t('language') === 'pt' ? 'Claro' : 'Light', icon: Sun },
    { value: 'dark' as const, label: t('language') === 'pt' ? 'Escuro' : 'Dark', icon: Moon },
    { value: 'system' as const, label: t('language') === 'pt' ? 'Sistema' : 'System', icon: Monitor },
  ];

  const currentTheme = themes.find(t => t.value === theme);
  const CurrentIcon = currentTheme?.icon || Sun;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="w-9 px-0">
          <CurrentIcon className="h-4 w-4" />
          <span className="sr-only">{t('language') === 'pt' ? 'Alterar tema' : 'Toggle theme'}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40" align="end">
        <div className="space-y-1">
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            {t('language') === 'pt' ? 'Tema' : 'Theme'}
          </h4>
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            return (
              <Button
                key={themeOption.value}
                variant={theme === themeOption.value ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => setTheme(themeOption.value)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {themeOption.label}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
