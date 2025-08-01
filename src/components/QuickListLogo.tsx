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
        src="/lovable-uploads/ad855730-be98-4686-8fa3-a8a65a74c7e8.png"
        alt="QuickList Logo" 
        className={`${sizeClasses[size]} object-contain drop-shadow-sm`}
        style={{ backgroundColor: 'transparent', background: 'none' }}
      />
      {showText && (
        <span className={`font-bold text-foreground ${textSizeClasses[size]} tracking-tight`}>
          QuickList
        </span>
      )}
    </div>
  );
};