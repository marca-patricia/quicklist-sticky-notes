
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
    // Basic
    'toggleTheme': 'Alternar tema',
    'welcomeTitle': 'Bem-vindo!',
    'welcomeDesc': 'A aplicação está carregando. Esta é uma versão básica para verificar se o problema foi resolvido.',
    'lists': 'Listas',
    'listsDesc': 'Organize suas tarefas',
    'notes': 'Notas',
    'notesDesc': 'Faça anotações rápidas',
    'statistics': 'Estatísticas',
    'statisticsDesc': 'Acompanhe seu progresso',
    'newList': 'Nova Lista',
    'newNote': 'Nova Nota',
    'addItem': 'Adicionar Item',
    'editItem': 'Editar Item',
    'deleteItem': 'Excluir Item',
    'completed': 'Concluído',
    'pending': 'Pendente',
    'save': 'Salvar',
    'cancel': 'Cancelar',
    'edit': 'Editar',
    'delete': 'Excluir',
    'title': 'Título',
    'description': 'Descrição',
    'color': 'Cor',
    'font': 'Fonte',
    'fontSize': 'Tamanho da Fonte',
    'achievements': 'Conquistas',
    'templates': 'Modelos',
    'personal': 'Pessoal',
    'work': 'Trabalho',
    'shopping': 'Compras',
    'travel': 'Viagem',
    'study': 'Estudos',
    'health': 'Saúde'
  },
  en: {
    // Basic
    'toggleTheme': 'Toggle theme',
    'welcomeTitle': 'Welcome!',
    'welcomeDesc': 'The application is loading. This is a basic version to check if the problem has been resolved.',
    'lists': 'Lists',
    'listsDesc': 'Organize your tasks',
    'notes': 'Notes',
    'notesDesc': 'Make quick notes',
    'statistics': 'Statistics',
    'statisticsDesc': 'Track your progress',
    'newList': 'New List',
    'newNote': 'New Note',
    'addItem': 'Add Item',
    'editItem': 'Edit Item',
    'deleteItem': 'Delete Item',
    'completed': 'Completed',
    'pending': 'Pending',
    'save': 'Save',
    'cancel': 'Cancel',
    'edit': 'Edit',
    'delete': 'Delete',
    'title': 'Title',
    'description': 'Description',
    'color': 'Color',
    'font': 'Font',
    'fontSize': 'Font Size',
    'achievements': 'Achievements',
    'templates': 'Templates',
    'personal': 'Personal',
    'work': 'Work',
    'shopping': 'Shopping',
    'travel': 'Travel',
    'study': 'Study',
    'health': 'Health'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('quicklist-language') as Language;
    if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('quicklist-language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
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
