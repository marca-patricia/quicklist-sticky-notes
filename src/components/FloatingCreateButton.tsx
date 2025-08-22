import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface FloatingCreateButtonProps {
  onClick: () => void;
  className?: string;
}

export const FloatingCreateButton: React.FC<FloatingCreateButtonProps> = ({
  onClick,
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-6 right-6 z-40 md:bottom-8 md:right-8">
      <Button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "w-auto h-16 px-6 rounded-full transition-all duration-300 hover:scale-110 active:scale-95",
          "flex items-center gap-3 font-semibold text-white",
          "bg-gradient-to-br from-primary via-primary to-primary-glow",
          "shadow-2xl hover:shadow-3xl",
          "border-2 border-white/30 hover:border-white/50",
          "ring-4 ring-primary/20 hover:ring-primary/40",
          "backdrop-blur-sm",
          // 3D effect styles
          "relative transform-gpu",
          "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-t before:from-transparent before:via-white/10 before:to-white/20 before:pointer-events-none",
          "after:absolute after:inset-px after:rounded-full after:bg-gradient-to-b after:from-white/20 after:to-transparent after:pointer-events-none",
          className
        )}
        style={{
          boxShadow: isHovered 
            ? '0 20px 40px -10px rgba(var(--primary) / 0.5), 0 10px 30px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.2)'
            : '0 10px 30px -5px rgba(var(--primary) / 0.4), 0 5px 20px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.2), inset 0 -1px 2px rgba(0, 0, 0, 0.1)'
        }}
        title={t('createNewList')}
        aria-label={t('createNewList')}
      >
        <Plus 
          className={cn(
            "w-6 h-6 transition-all duration-300 font-bold drop-shadow-sm relative z-10",
            isHovered && "rotate-90 scale-110"
          )}
        />
        <span className="font-semibold text-white whitespace-nowrap drop-shadow-sm relative z-10">
          {t('addList')}
        </span>
      </Button>
    </div>
  );
};