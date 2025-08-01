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
        "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl",
        "bg-floating-button text-floating-button-text border-2 border-white/20 ring-2 ring-floating-button/30 hover:ring-floating-button/50",
        "md:bottom-8 md:right-8 md:w-16 md:h-16",
        className
      )}
      style={{
        background: 'hsl(var(--floating-button))',
        color: 'hsl(var(--floating-button-text))',
        boxShadow: 'var(--shadow-floating)'
      }}
      title="Criar nova nota"
    >
      <Plus 
        className={cn(
          "w-6 h-6 md:w-8 md:h-8 transition-transform duration-300 font-bold",
          isHovered && "rotate-90"
        )} 
      />
    </Button>
  );
};