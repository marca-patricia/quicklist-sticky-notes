
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="bg-background/80 hover:bg-background/90 border-border/50"
    >
      {theme === 'dark' ? 
        <Sun className="w-4 h-4 text-foreground" /> : 
        <Moon className="w-4 h-4 text-foreground" />
      }
    </Button>
  );
};
