
import React from 'react';

export const QuickListIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <svg 
      viewBox="0 0 64 64" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shadow */}
      <rect x="10" y="10" width="48" height="48" rx="12" fill="#5D7EC9" opacity="0.3"/>
      
      {/* Main notepad background - yellow */}
      <rect x="8" y="8" width="48" height="48" rx="12" fill="#FFD15B"/>
      
      {/* Three holes at the top (spiral notepad style) */}
      <circle cx="20" cy="20" r="3" fill="#5D7EC9"/>
      <circle cx="32" cy="20" r="3" fill="#5D7EC9"/>
      <circle cx="44" cy="20" r="3" fill="#5D7EC9"/>
      
      {/* Notepad lines - coral color */}
      <rect x="16" y="32" width="32" height="2" rx="1" fill="#F17D6E"/>
      <rect x="16" y="38" width="28" height="2" rx="1" fill="#F17D6E"/>
      <rect x="16" y="44" width="24" height="2" rx="1" fill="#F17D6E"/>
    </svg>
  );
};
