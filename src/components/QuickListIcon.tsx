
import React from 'react';

export const QuickListIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <svg 
      viewBox="0 0 48 48" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background rounded rectangle with orange/yellow gradient */}
      <rect x="4" y="4" width="40" height="40" rx="8" fill="url(#gradient)" stroke="none"/>
      
      {/* List lines */}
      <rect x="12" y="14" width="24" height="2" rx="1" fill="white"/>
      <rect x="12" y="20" width="20" height="2" rx="1" fill="white"/>
      <rect x="12" y="26" width="18" height="2" rx="1" fill="white"/>
      <rect x="12" y="32" width="16" height="2" rx="1" fill="white"/>
      
      {/* Small accent dots/bullets */}
      <circle cx="8" cy="15" r="1.5" fill="white"/>
      <circle cx="8" cy="21" r="1.5" fill="white"/>
      <circle cx="8" cy="27" r="1.5" fill="white"/>
      <circle cx="8" cy="33" r="1.5" fill="white"/>
      
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#FFA500"/>
          <stop offset="100%" stopColor="#FF8C00"/>
        </linearGradient>
      </defs>
    </svg>
  );
};
