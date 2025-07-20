
import React from 'react';

export const QuickListIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <svg 
      viewBox="0 0 48 48" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle with gradient */}
      <circle cx="24" cy="24" r="22" fill="url(#gradient)" stroke="currentColor" strokeWidth="2"/>
      
      {/* List lines */}
      <rect x="12" y="14" width="24" height="2" rx="1" fill="white"/>
      <rect x="12" y="20" width="20" height="2" rx="1" fill="white"/>
      <rect x="12" y="26" width="18" height="2" rx="1" fill="white"/>
      <rect x="12" y="32" width="16" height="2" rx="1" fill="white"/>
      
      {/* Checkmark circles */}
      <circle cx="8" cy="15" r="2" fill="white"/>
      <circle cx="8" cy="21" r="2" fill="white" opacity="0.7"/>
      <circle cx="8" cy="27" r="2" fill="white" opacity="0.5"/>
      <circle cx="8" cy="33" r="2" fill="white" opacity="0.3"/>
      
      {/* Check mark in first circle */}
      <path d="M6.5 15L7.5 16L9.5 14" stroke="hsl(220 14% 35%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(220 14% 35%)"/>
          <stop offset="100%" stopColor="hsl(225 71% 77%)"/>
        </linearGradient>
      </defs>
    </svg>
  );
};
