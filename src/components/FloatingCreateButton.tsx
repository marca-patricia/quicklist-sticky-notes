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
          "w-auto h-16 px-6 rounded-full shadow-xl transition-all duration-300 hover:scale-105 bg-primary border-4 border-white/40 ring-4 ring-primary/20 hover:ring-primary/30",
          "flex items-center gap-3",
          className
        )}
        title={t('createNewList')}
        aria-label={t('createNewList')}
      >
        <Plus 
          className={cn(
            "w-6 h-6 transition-transform duration-300 font-bold",
            isHovered && "rotate-90"
          )}
        />
        <span className="font-semibold text-white whitespace-nowrap">
          {t('addList')}
        </span>
      </Button>
    </div>
  );
};