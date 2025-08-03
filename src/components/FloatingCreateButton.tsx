import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingCreateButtonProps {
  onClick: () => void;
  className?: string;
}

export const FloatingCreateButton: React.FC<FloatingCreateButtonProps> = ({
  onClick,
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <Button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full shadow-xl transition-all duration-300 hover:scale-110 bg-primary border-4 border-white/40 ring-4 ring-primary/20 hover:ring-primary/30",
        "md:bottom-8 md:right-8",
        className
      )}
      style={{
        color: isDark ? '#000000' : undefined,
      }}
      title="Criar nova lista"
    >
      <Plus 
        className={cn(
          "w-8 h-8 transition-transform duration-300 font-bold",
          isHovered && "rotate-90"
        )}
        style={{
          color: isDark ? '#000000' : undefined,
        }}
      />
    </Button>
  );
};