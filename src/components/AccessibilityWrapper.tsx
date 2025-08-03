import React from 'react';
import { AriaLive } from '@/components/AriaLive';
import { SkipLink } from '@/components/SkipLink';

interface AccessibilityWrapperProps {
  children: React.ReactNode;
}

export const AccessibilityWrapper: React.FC<AccessibilityWrapperProps> = ({ children }) => {
  return (
    <>
      <SkipLink />
      <AriaLive />
      {children}
    </>
  );
};