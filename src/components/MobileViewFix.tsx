import React, { useEffect } from 'react';

export const MobileViewFix: React.FC = () => {
  useEffect(() => {
    // Force cache refresh for styles
    const timestamp = Date.now();
    const existingStyleSheets = document.querySelectorAll('link[rel="stylesheet"]');
    existingStyleSheets.forEach(sheet => {
      const link = sheet as HTMLLinkElement;
      const href = link.href.split('?')[0];
      link.href = `${href}?v=${timestamp}`;
    });

    // Force reload styles on mobile
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }

    // Add background fallback color if image fails to load
    document.body.style.backgroundColor = '#B8956A';

    // Apply mobile-specific styles immediately
    const applyMobileStyles = () => {
      if (window.innerWidth <= 768) {
        // Force scroll attachment on mobile
        document.body.style.backgroundAttachment = 'scroll';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        
        // Force update grid layouts
        setTimeout(() => {
          const grids = document.querySelectorAll('[style*="grid-template-columns"]');
          grids.forEach(grid => {
            const element = grid as HTMLElement;
            element.style.gridTemplateColumns = 'repeat(auto-fill, 140px)';
            element.style.gap = '12px';
            element.style.justifyContent = 'center';
            element.style.padding = '16px';
          });

          // Force sticky notes size
          const stickyNotes = document.querySelectorAll('[style*="width: 160px"]');
          stickyNotes.forEach(note => {
            const element = note as HTMLElement;
            element.style.width = '140px !important';
            element.style.height = '140px !important';
          });
        }, 100);
      }
    };

    // Run immediately and on events
    applyMobileStyles();
    
    const timeoutId = setTimeout(applyMobileStyles, 500);
    window.addEventListener('resize', applyMobileStyles);
    window.addEventListener('orientationchange', applyMobileStyles);
    window.addEventListener('load', applyMobileStyles);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', applyMobileStyles);
      window.removeEventListener('orientationchange', applyMobileStyles);
      window.removeEventListener('load', applyMobileStyles);
    };
  }, []);

  return null;
};