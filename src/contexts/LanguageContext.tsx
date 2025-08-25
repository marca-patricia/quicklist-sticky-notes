
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  pt: {
    // Basic UI
    'homescreen': 'QuickList',
    'allLists': 'Todas as Listas',
    'addList': 'Criar Lista',
    'createList': 'Criar Lista',
    'addNewList': 'Adicionar Nova Lista',
    'listPlaceholder': 'Digite o nome da sua lista...',
    'newListName': 'Nome da nova lista',
    'pleaseEnterListName': 'Por favor, digite o nome da lista',
    'createNewListForm': 'Formulário para criar nova lista',
    'chooseListColor': 'Escolher cor da lista',
    'listCreated': 'Lista criada com sucesso!',
    'errorCreatingList': 'Erro ao criar lista',
    'searchLists': 'Buscar listas',
    'noResultsFound': 'Nenhum resultado encontrado',
    'tryDifferentSearch': 'Tente uma pesquisa diferente',
    'noArchivedLists': 'Nenhuma lista arquivada',
    'hideArchived': 'Ocultar Arquivadas',
    'showArchived': 'Mostrar Arquivadas',
    
    // App and Lists
    'app.title': 'QuickList',
    'lists.new': 'Nova Lista',
    'lists.empty': 'Nenhuma lista ainda',
    'lists.empty.description': 'Crie sua primeira lista para começar',
    'lists.completed': 'completos',
    'lists.moreItems': 'mais itens...',
    'lists.deleteTitle': 'Excluir lista',
    
    // List actions
    'openList': 'Abrir lista',
    'editList': 'Editar lista',
    'deleteList': 'Excluir lista',
    'confirmDeleteList': 'Tem certeza que deseja excluir esta lista?',
    'archive': 'Arquivar',
    'unarchive': 'Desarquivar',
    'edit': 'Editar',
    'delete': 'Excluir',
    'completed': 'Concluídas',
    'moreOptions': 'Mais opções',
    
    // Settings and tools
    'appSettings': 'Configurações do app',
    'toolsAndStats': 'Ferramentas e estatísticas',
    'insights': 'Insights',
    'achievements': 'Conquistas',
    'reloadApp': 'Recarregar app',
    'mainTaskList': 'Lista principal de tarefas',
    'createNewListSection': 'Seção para criar nova lista',
    
    // Templates
    'templates': 'Modelos de Lista',
    'useTemplate': 'Usar Modelo',
    'personalTemplate': 'Lista Pessoal',
    'personalDesc': 'Uma lista para organizar suas tarefas pessoais do dia a dia',
    'personalItems': 'Fazer exercícios, Ler um livro, Ligar para família, Organizar quarto, Planejar fim de semana',
    'workTemplate': 'Lista de Trabalho',
    'workDesc': 'Organize suas tarefas profissionais e projetos',
    'workItems': 'Responder emails, Reunião com equipe, Finalizar relatório, Revisar documento, Preparar apresentação',
    'shoppingTemplate': 'Lista de Compras',
    'shoppingDesc': 'Não esqueça nada na sua próxima ida ao mercado',
    'shoppingItems': 'Leite, Pão, Frutas, Ovos, Arroz, Feijão, Carne, Verduras',
    'travelTemplate': 'Lista de Viagem',
    'travelDesc': 'Prepare-se para sua viagem sem esquecer nada importante',
    'travelItems': 'Passaporte, Roupas, Carregador, Medicamentos, Câmera, Protetor solar, Documentos',
    'studyTemplate': 'Lista de Estudos',
    'studyDesc': 'Organize seus estudos e atividades acadêmicas',
    'studyItems': 'Ler capítulo 3, Fazer exercícios, Revisar anotações, Pesquisar sobre tema, Preparar resumo',
    'eventTemplate': 'Lista de Evento',
    'eventDesc': 'Planeje seu evento ou festa sem esquecer detalhes',
    'eventItems': 'Definir local, Fazer convites, Comprar decoração, Preparar comida, Organizar música',

    // Auth
    'auth.title': 'QuickList',
    'auth.login': 'Entrar',
    'auth.signup': 'Cadastrar',
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.passwordMin': 'Senha (mín. 6 caracteres)',
    'auth.loginButton': 'Entrar',
    'auth.signupButton': 'Cadastrar',
    'auth.loggingIn': 'Entrando...',
    'auth.creating': 'Criando conta...',
    'auth.welcomeBack': 'Bem-vindo de volta!',
    'auth.accountCreated': 'Conta criada com sucesso!'
  },
  en: {
    // Basic UI
    'homescreen': 'QuickList',
    'allLists': 'All Lists',
    'addList': 'Create List',
    'createList': 'Create List',
    'addNewList': 'Add New List',
    'listPlaceholder': 'Enter your list name...',
    'newListName': 'New list name',
    'pleaseEnterListName': 'Please enter the list name',
    'createNewListForm': 'Form to create new list',
    'chooseListColor': 'Choose list color',
    'listCreated': 'List created successfully!',
    'errorCreatingList': 'Error creating list',
    'searchLists': 'Search lists',
    'noResultsFound': 'No results found',
    'tryDifferentSearch': 'Try a different search',
    'noArchivedLists': 'No archived lists',
    'hideArchived': 'Hide Archived',
    'showArchived': 'Show Archived',
    
    // App and Lists
    'app.title': 'QuickList',
    'lists.new': 'New List',
    'lists.empty': 'No lists yet',
    'lists.empty.description': 'Create your first list to get started',
    'lists.completed': 'completed',
    'lists.moreItems': 'more items...',
    'lists.deleteTitle': 'Delete list',
    
    // List actions
    'openList': 'Open list',
    'editList': 'Edit list',
    'deleteList': 'Delete list',
    'confirmDeleteList': 'Are you sure you want to delete this list?',
    'archive': 'Archive',
    'unarchive': 'Unarchive',
    'edit': 'Edit',
    'delete': 'Delete',
    'completed': 'Completed',
    'moreOptions': 'More options',
    
    // Settings and tools
    'appSettings': 'App settings',
    'toolsAndStats': 'Tools and statistics',
    'insights': 'Insights',
    'achievements': 'Achievements',
    'reloadApp': 'Reload app',
    'mainTaskList': 'Main task list',
    'createNewListSection': 'Section to create new list',
    
    // Templates
    'templates': 'List Templates',
    'useTemplate': 'Use Template',
    'personalTemplate': 'Personal List',
    'personalDesc': 'A list to organize your daily personal tasks',
    'personalItems': 'Exercise, Read a book, Call family, Organize room, Plan weekend',
    'workTemplate': 'Work List',
    'workDesc': 'Organize your professional tasks and projects',
    'workItems': 'Answer emails, Team meeting, Finish report, Review document, Prepare presentation',
    'shoppingTemplate': 'Shopping List',
    'shoppingDesc': "Don't forget anything on your next grocery trip",
    'shoppingItems': 'Milk, Bread, Fruits, Eggs, Rice, Beans, Meat, Vegetables',
    'travelTemplate': 'Travel List',
    'travelDesc': 'Get ready for your trip without forgetting anything important',
    'travelItems': 'Passport, Clothes, Charger, Medications, Camera, Sunscreen, Documents',
    'studyTemplate': 'Study List',
    'studyDesc': 'Organize your studies and academic activities',
    'studyItems': 'Read chapter 3, Do exercises, Review notes, Research topic, Prepare summary',
    'eventTemplate': 'Event List',
    'eventDesc': 'Plan your event or party without forgetting details',
    'eventItems': 'Define venue, Make invitations, Buy decorations, Prepare food, Organize music',

    // Auth
    'auth.title': 'QuickList',
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.passwordMin': 'Password (min. 6 characters)',
    'auth.loginButton': 'Login',
    'auth.signupButton': 'Sign Up',
    'auth.loggingIn': 'Logging in...',
    'auth.creating': 'Creating account...',
    'auth.welcomeBack': 'Welcome back!',
    'auth.accountCreated': 'Account created successfully!'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('quicklist-language') as Language;
    if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('quicklist-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
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
