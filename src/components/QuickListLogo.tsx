import React from 'react';

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
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src="/lovable-uploads/76e442a8-3773-480b-9b45-fd2f2680dcfb.png"
        alt="QuickList Logo" 
        className={`${sizeClasses[size]} object-contain drop-shadow-sm`}
        style={{ backgroundColor: 'transparent', background: 'none' }}
      />
      {showText && (
        <span className={`font-bold text-foreground dark:text-black ${textSizeClasses[size]} tracking-tight`}>
          QuickList
        </span>
      )}
    </div>
  );
};