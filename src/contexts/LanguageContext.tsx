
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  pt: {
    // Principais
    myLists: 'Minhas Listas',
    newList: 'Nova Lista',
    completed: 'concluído',
    toggleTheme: 'Alternar tema',
    colorChangedSuccessfully: 'Cor alterada com sucesso',
    listDeleted: 'Lista excluída',
    listRestored: 'Lista restaurada',
    listArchived: 'Lista arquivada',
    listUnarchived: 'Lista desarquivada',
    deleteList: 'Excluir Lista',
    archiveList: 'Arquivar Lista',
    unarchive: 'Desarquivar',
    confirmDeleteList: 'Confirmar exclusão',
    confirmDeleteListDesc: 'Esta ação não pode ser desfeita.',
    // Formulários
    listTitle: 'Título da Lista',
    listDescription: 'Descrição (opcional)',
    create: 'Criar',
    cancel: 'Cancelar',
    save: 'Salvar',
    // Estados
    noListsFound: 'Nenhuma lista encontrada',
    createFirstList: 'Crie sua primeira lista para começar',
    loading: 'Carregando...',
  },
  en: {
    // Main
    myLists: 'My Lists',
    newList: 'New List',
    completed: 'completed',
    toggleTheme: 'Toggle theme',
    colorChangedSuccessfully: 'Color changed successfully',
    listDeleted: 'List deleted',
    listRestored: 'List restored',
    listArchived: 'List archived',
    listUnarchived: 'List unarchived',
    deleteList: 'Delete List',
    archiveList: 'Archive List',
    unarchive: 'Unarchive',
    confirmDeleteList: 'Confirm deletion',
    confirmDeleteListDesc: 'This action cannot be undone.',
    // Forms
    listTitle: 'List Title',
    listDescription: 'Description (optional)',
    create: 'Create',
    cancel: 'Cancel',
    save: 'Save',
    // States
    noListsFound: 'No lists found',
    createFirstList: 'Create your first list to get started',
    loading: 'Loading...',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quicklist-language');
      if (saved === 'pt' || saved === 'en') {
        return saved;
      }
      // Default to Portuguese for Brazilian users
      return navigator.language.startsWith('pt') ? 'pt' : 'en';
    }
    return 'pt';
  });

  useEffect(() => {
    localStorage.setItem('quicklist-language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['pt']] || key;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
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
