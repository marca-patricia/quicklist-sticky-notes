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

  return (
    <Button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 bg-primary text-primary-foreground border-2 border-white/20",
        "md:bottom-8 md:right-8",
        className
      )}
      title="Criar nova lista"
    >
      <Plus 
        className={cn(
          "w-6 h-6 transition-transform duration-300",
          isHovered && "rotate-90"
        )} 
      />
    </Button>
  );
};