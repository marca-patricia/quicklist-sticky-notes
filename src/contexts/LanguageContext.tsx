import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  pt: {
    appTitle: 'QuickList',
    addItem: 'Adicionar item',
    placeholder: 'Digite um novo item...',
    noItems: 'Sua lista está vazia',
    noItemsDesc: 'Adicione alguns itens para começar',
    shareList: 'Compartilhar Lista',
    clearCompleted: 'Limpar Concluídos',
    itemsLeft: 'itens restantes',
    oneItemLeft: 'item restante',
    allCompleted: 'Todos os itens concluídos!',
    sharedText: 'Minha QuickList:\n\n',
    completedItem: '✅',
    pendingItem: '⭕',
    deleteItem: 'Excluir',
    markComplete: 'Marcar como concluído',
    markIncomplete: 'Marcar como pendente'
  },
  en: {
    appTitle: 'QuickList',
    addItem: 'Add item',
    placeholder: 'Type a new item...',
    noItems: 'Your list is empty',
    noItemsDesc: 'Add some items to get started',
    shareList: 'Share List',
    clearCompleted: 'Clear Completed',
    itemsLeft: 'items left',
    oneItemLeft: 'item left',
    allCompleted: 'All items completed!',
    sharedText: 'My QuickList:\n\n',
    completedItem: '✅',
    pendingItem: '⭕',
    deleteItem: 'Delete',
    markComplete: 'Mark as complete',
    markIncomplete: 'Mark as pending'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('quicklist-language');
    return (saved as Language) || 'pt';
  });

  useEffect(() => {
    localStorage.setItem('quicklist-language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['pt']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};