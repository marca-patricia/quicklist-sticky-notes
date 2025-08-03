import React, { createContext, useContext, useState } from 'react';

interface AriaLiveContextType {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
}

const AriaLiveContext = createContext<AriaLiveContextType | undefined>(undefined);

export const AriaLive: React.FC = () => {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (priority === 'assertive') {
      setAssertiveMessage(message);
      setTimeout(() => setAssertiveMessage(''), 100);
    } else {
      setPoliteMessage(message);
      setTimeout(() => setPoliteMessage(''), 100);
    }
  };

  return (
    <AriaLiveContext.Provider value={{ announce }}>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {politeMessage}
      </div>
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {assertiveMessage}
      </div>
    </AriaLiveContext.Provider>
  );
};

export const useAriaLive = () => {
  const context = useContext(AriaLiveContext);
  if (context === undefined) {
    throw new Error('useAriaLive must be used within an AriaLive provider');
  }
  return context;
};