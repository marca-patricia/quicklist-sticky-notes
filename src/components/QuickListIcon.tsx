
import React from 'react';

export const QuickListIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <svg 
      viewBox="0 0 64 64" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Enhanced shadow */}
      <rect x="10" y="10" width="48" height="48" rx="12" fill="url(#shadowGradient)" opacity="0.2"/>
      
      {/* Main notepad background - enhanced yellow gradient */}
      <rect x="8" y="8" width="48" height="48" rx="12" fill="url(#notepadGradient)"/>
      
      {/* Enhanced spiral holes with modern styling */}
      <circle cx="20" cy="18" r="2.5" fill="url(#holeGradient)"/>
      <circle cx="32" cy="18" r="2.5" fill="url(#holeGradient)"/>
      <circle cx="44" cy="18" r="2.5" fill="url(#holeGradient)"/>
      
      {/* Modern notepad lines with enhanced styling */}
      <rect x="16" y="30" width="32" height="1.5" rx="0.75" fill="url(#lineGradient)"/>
      <rect x="16" y="36" width="28" height="1.5" rx="0.75" fill="url(#lineGradient)"/>
      <rect x="16" y="42" width="24" height="1.5" rx="0.75" fill="url(#lineGradient)"/>
      <rect x="16" y="48" width="20" height="1.5" rx="0.75" fill="url(#lineGradient)" opacity="0.7"/>
      
      {/* Gradients definitions */}
      <defs>
        <linearGradient id="notepadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047"/>
          <stop offset="100%" stopColor="#FACC15"/>
        </linearGradient>
        <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#374151"/>
          <stop offset="100%" stopColor="#1F2937"/>
        </linearGradient>
        <linearGradient id="holeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6"/>
          <stop offset="100%" stopColor="#1D4ED8"/>
        </linearGradient>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EC4899"/>
          <stop offset="100%" stopColor="#F97316"/>
        </linearGradient>
      </defs>
    </svg>
  );
};
