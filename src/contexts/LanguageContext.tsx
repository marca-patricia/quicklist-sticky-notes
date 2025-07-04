
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
    addList: 'Nova Lista',
    placeholder: 'Digite um novo item...',
    listPlaceholder: 'Nome da nova lista...',
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
    markIncomplete: 'Marcar como pendente',
    deleteList: 'Excluir Lista',
    newList: 'Nova Lista',
    addToHome: 'Adicionar à Tela Inicial',
    completed: '✅ Concluídos',
    pending: 'Pendentes',
    noLists: 'Nenhuma lista ainda',
    noListsDesc: 'Crie sua primeira lista para começar a organizar suas tarefas',
    createFirstList: 'Criar primeira lista',
    allLists: 'Todas as listas',
    backToLists: 'Voltar às listas',
    listNotFound: 'Lista não encontrada',
    addItemHere: 'Adicione alguns itens para começar!',
    emptyList: 'Lista vazia',
    addItems: 'Adicionar itens',
    openFullApp: 'Abrir QuickList completo',
    installApp: 'Instalar QuickList',
    installDesc: 'Adicione o QuickList à sua tela inicial para acesso rápido e uso offline!',
    install: 'Instalar',
    later: 'Depois',
    homeScreen: 'Tela inicial',
    organizeDesc: 'Organize suas listas de forma simples e eficiente',
    listCreated: 'Nova lista criada!',
    itemAdded: 'Item adicionado à lista!',
    itemRemoved: 'Item removido da lista!',
    completedItemsRemoved: 'itens concluídos removidos!',
    listCopied: 'Lista copiada para área de transferência!',
    linkCopied: 'Link copiado! Cole na barra de endereços e adicione à tela inicial',
    yourListEmpty: 'Sua lista está vazia'
  },
  en: {
    appTitle: 'QuickList',
    addItem: 'Add item',
    addList: 'New List',
    placeholder: 'Type a new item...',
    listPlaceholder: 'New list name...',
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
    markIncomplete: 'Mark as pending',
    deleteList: 'Delete List',
    newList: 'New List',
    addToHome: 'Add to Home Screen',
    completed: '✅ Completed',
    pending: 'Pending',
    noLists: 'No lists yet',
    noListsDesc: 'Create your first list to start organizing your tasks',
    createFirstList: 'Create first list',
    allLists: 'All lists',
    backToLists: 'Back to lists',
    listNotFound: 'List not found',
    addItemHere: 'Add some items to get started!',
    emptyList: 'Empty list',
    addItems: 'Add items',
    openFullApp: 'Open full QuickList',
    installApp: 'Install QuickList',
    installDesc: 'Add QuickList to your home screen for quick access and offline use!',
    install: 'Install',
    later: 'Later',
    homeScreen: 'Home screen',
    organizeDesc: 'Organize your lists simply and efficiently',
    listCreated: 'New list created!',
    itemAdded: 'Item added to list!',
    itemRemoved: 'Item removed from list!',
    completedItemsRemoved: 'completed items removed!',
    listCopied: 'List copied to clipboard!',
    linkCopied: 'Link copied! Paste in address bar and add to home screen',
    yourListEmpty: 'Your list is empty'
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
