
import React from 'react';

export const QuickListIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <svg 
      viewBox="0 0 64 64" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background with rounded rectangle and gradient like in the images */}
      <rect x="8" y="8" width="48" height="48" rx="12" fill="url(#orangeGradient)"/>
      
      {/* Yellow accent bars on top */}
      <rect x="16" y="12" width="8" height="3" rx="1.5" fill="#FFE55C"/>
      <rect x="26" y="12" width="8" height="3" rx="1.5" fill="#FFE55C"/>
      <rect x="36" y="12" width="8" height="3" rx="1.5" fill="#FFE55C"/>
      <rect x="46" y="12" width="4" height="3" rx="1.5" fill="#FFE55C"/>
      
      {/* List lines - white/light */}
      <rect x="16" y="22" width="28" height="2.5" rx="1.25" fill="rgba(255,255,255,0.9)"/>
      <rect x="16" y="28" width="24" height="2.5" rx="1.25" fill="rgba(255,255,255,0.8)"/>
      <rect x="16" y="34" width="20" height="2.5" rx="1.25" fill="rgba(255,255,255,0.7)"/>
      <rect x="16" y="40" width="16" height="2.5" rx="1.25" fill="rgba(255,255,255,0.6)"/>
      
      <defs>
        <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE55C"/>
          <stop offset="30%" stopColor="#FFB347"/>
          <stop offset="70%" stopColor="#FF8C42"/>
          <stop offset="100%" stopColor="#FF6B35"/>
        </linearGradient>
      </defs>
    </svg>
  );
};
