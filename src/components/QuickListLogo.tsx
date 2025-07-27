import React from 'react';
import { StickyNote } from 'lucide-react';

interface QuickListLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const QuickListLogo: React.FC<QuickListLogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="bg-note-yellow rounded-lg p-1.5 shadow-sm">
        <StickyNote 
          className={`${sizeClasses[size]} text-note-text`}
        />
      </div>
      {showText && (
        <span className={`font-bold text-foreground ${textSizeClasses[size]} tracking-tight`}>
          QuickList
        </span>
      )}
    </div>
  );
};