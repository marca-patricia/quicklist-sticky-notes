import React from 'react';

export const SkipLink: React.FC = () => {
  const handleSkip = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  };

  return (
    <button
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 focus:z-[60]"
      onClick={handleSkip}
      tabIndex={0}
    >
      Pular para o conteúdo principal
    </button>
  );
};