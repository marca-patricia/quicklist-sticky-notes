import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AccessibilityAnnouncerProps {
  message?: string;
  priority?: 'polite' | 'assertive';
}

export const AccessibilityAnnouncer: React.FC<AccessibilityAnnouncerProps> = ({
  message,
  priority = 'polite'
}) => {
  const { t } = useLanguage();
  const announcerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message && announcerRef.current) {
      // Clear previous message
      announcerRef.current.textContent = '';
      
      // Add new message after a brief delay to ensure screen readers pick it up
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = message;
        }
      }, 100);
    }
  }, [message]);

  return (
    <>
      {/* Live region for announcements */}
      <div
        ref={announcerRef}
        className="sr-only"
        aria-live={priority}
        aria-atomic="true"
        role="status"
      />
      
      {/* Skip links for keyboard navigation */}
      <div className="sr-only focus-within:not-sr-only">
        <a
          href="#main-content"
          className="fixed top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {t('skipToMain')}
        </a>
        <a
          href="#navigation"
          className="fixed top-4 left-32 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {t('skipToNav')}
        </a>
      </div>
    </>
  );
};