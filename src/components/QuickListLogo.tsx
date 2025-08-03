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
      {/* Logo como SVG sem fundo - Post-it amarelo com pin vermelho */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Post-it amarelo */}
          <rect 
            x="10" y="15" width="80" height="80" 
            fill="#FFF8C5" 
            stroke="#F5E06B" 
            strokeWidth="1"
            rx="2"
            style={{
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))'
            }}
          />
          
          {/* Pin vermelho */}
          <circle 
            cx="50" cy="25" r="4" 
            fill="#DC2626"
            style={{
              filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))'
            }}
          />
          
          {/* Linhas do post-it */}
          <line x1="20" y1="40" x2="80" y2="40" stroke="#E5D555" strokeWidth="0.5" />
          <line x1="20" y1="50" x2="80" y2="50" stroke="#E5D555" strokeWidth="0.5" />
          <line x1="20" y1="60" x2="80" y2="60" stroke="#E5D555" strokeWidth="0.5" />
        </svg>
      </div>
      
      {showText && (
        <span className={`font-bold text-foreground ${textSizeClasses[size]} tracking-tight`}>
          QuickList
        </span>
      )}
    </div>
  );
};