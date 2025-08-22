import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

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
    'add': 'Adicionar',
    'edit': 'Editar',
    'delete': 'Excluir',
    'save': 'Salvar',
    'cancel': 'Cancelar',
    'close': 'Fechar',
    'back': 'Voltar',
    'next': 'Próximo',
    'previous': 'Anterior',
    'search': 'Buscar',
    'filter': 'Filtrar',
    'sort': 'Ordenar',
    'export': 'Exportar',
    'import': 'Importar',
    'settings': 'Configurações',
    'help': 'Ajuda',
    'about': 'Sobre',
    'loading': 'Carregando...',
    'error': 'Erro',
    'success': 'Sucesso',
    'warning': 'Aviso',
    'info': 'Informação',
    
    // Onboarding
    'onboarding': {
      'welcome': {
        'title': 'Bem-vindo ao QuickList!',
        'description': 'Organize suas tarefas de forma simples e eficiente. Vamos começar!'
      },
      'createLists': {
        'title': 'Crie suas Listas',
        'description': 'Organize suas tarefas em listas personalizadas. Use categorias e cores para melhor organização.'
      },
      'features': {
        'title': 'Recursos Incríveis',
        'description': 'Aproveite filtros, busca, estatísticas e muito mais para aumentar sua produtividade.'
      },
      'skip': 'Pular',
      'next': 'Próximo',
      'getStarted': 'Começar'
    },

    // App specific
    'appName': 'QuickList',
    'homescreen': 'Início',
    'allLists': 'Todas as Listas',
    'newList': 'Nova Lista',
    'createList': 'Criar Lista',
    'addList': 'Adicionar Lista',
    'editList': 'Editar Lista',
    'deleteList': 'Excluir Lista',
    'listTitle': 'Título da Lista',
    'listDescription': 'Descrição da Lista',
    'listColor': 'Cor da Lista',
    'noLists': 'Nenhuma lista criada',
    'noListsDesc': 'Crie sua primeira lista para começar a organizar suas tarefas.',
    'listNotFound': 'Lista não encontrada',
    'backToLists': 'Voltar às Listas',
    'searchLists': 'Buscar listas',
    'showArchived': 'Mostrar Arquivadas',
    'hideArchived': 'Ocultar Arquivadas',
    'archiveList': 'Arquivar Lista',
    'unarchiveList': 'Desarquivar Lista',
    'duplicateList': 'Duplicar Lista',
    'shareList': 'Compartilhar Lista',
    'listCopied': 'Lista copiada para a área de transferência',
    'linkCopied': 'Link copiado para a área de transferência',
    'listShared': 'Lista compartilhada com sucesso',
    'listUpdated': 'Lista atualizada com sucesso',
    'listCreated': 'Lista criada com sucesso',
    'listDeleted': 'Lista excluída com sucesso',
    'listArchived': 'Lista arquivada com sucesso',
    'listUnarchived': 'Lista desarquivada com sucesso',
    'listDuplicated': 'Lista duplicada com sucesso',
    
    // Items
    'addItem': 'Adicionar Item',
    'editItem': 'Editar Item',
    'searchTasks': 'Buscar tarefas...',
    'hideCompleted': 'Ocultar concluídas',
    'showCompleted': 'Mostrar concluídas',
    'sortBy': 'Ordenar por',
    'recent': 'Recente',
    'alphabetical': 'Alfabética',
    'completed': 'Concluídas',
    'newItem': 'Novo Item',
    'deleteItem': 'Excluir Item',
    'itemText': 'Texto do Item',
    'itemAdded': 'Item adicionado',
    'itemRemoved': 'Item removido',
    'itemUpdated': 'Item atualizado',
    'itemMoved': 'Item movido',
    'completedItem': '✓',
    'pendingItem': '○',
    'noItems': 'Nenhum item',
    'addItemHere': 'Adicione itens aqui...',
    'addItemPlaceholder': 'Digite o texto do item...',
    'searchTasksPlaceholder': 'Digite para buscar...',
    'pending': 'Pendentes',
    'completedItemsRemoved': 'itens concluídos removidos',
    'markComplete': 'Marcar como concluído',
    'markIncomplete': 'Marcar como pendente',
    'priority': 'Prioridade',
    'dueDate': 'Data de Vencimento',
    'category': 'Categoria',
    'categories': 'Categorias',
    'notesLabel': 'Notas',
    'filters': 'Filtros',
    'clearCompleted': 'Limpar Concluídas',
    'oneItemLeft': 'item restante',
    'itemsLeft': 'itens restantes',
    'allCompleted': 'Todas as tarefas concluídas!',
    'selectAll': 'Selecionar tudo',
    'deselectAll': 'Deselecionar tudo',
    
    // Statistics and insights
    'insights': 'Insights',
    'statistics': 'Estatísticas',
    'achievements': 'Conquistas',
    
    // Templates
    'templates': 'Modelos',
    'useTemplate': 'Usar Modelo',
    'selectTemplate': 'Selecionar Modelo',
    'personalTemplate': 'Pessoal',
    'workTemplate': 'Trabalho',
    'shoppingTemplate': 'Compras',
    'travelTemplate': 'Viagem',
    'studyTemplate': 'Estudos',
    'eventTemplate': 'Eventos',
    'personalDesc': 'Lista para tarefas pessoais e atividades do dia a dia',
    'personalItems': 'Fazer exercícios, Ir ao mercado, Ligar para a família, Organizar quarto',
    'workDesc': 'Lista para tarefas e projetos profissionais',
    'workItems': 'Revisar emails, Participar da reunião, Finalizar relatório, Preparar apresentação',
    'shoppingDesc': 'Lista para compras de mercado e produtos',
    'shoppingItems': 'Leite, Pão, Ovos, Frutas, Produtos de limpeza',
    'travelDesc': 'Lista para organizar viagens e passeios',
    'travelItems': 'Fazer as malas, Verificar documentos, Reservar hotel, Pesquisar pontos turísticos',
    'studyDesc': 'Organize seus estudos e materiais de aprendizado',
    'studyItems': 'Revisar capítulo 1, Fazer exercícios, Preparar apresentação, Estudar para prova',
    'eventDesc': 'Organize todos os detalhes do seu evento',
    'eventItems': 'Definir local, Enviar convites, Comprar decorações, Preparar comida',
    
    // Auth translations
    auth: {
      title: 'QuickList',
      login: 'Entrar',
      signup: 'Cadastrar',
      email: 'Email',
      password: 'Senha',
      passwordMin: 'Senha (mínimo 6 caracteres)',
      loginButton: 'Entrar',
      signupButton: 'Criar Conta',
      loggingIn: 'Entrando...',
      creating: 'Criando conta...',
      welcomeBack: 'Bem-vindo de volta!',
      accountCreated: 'Conta criada com sucesso!'
    },

    // Statistics page
    'overview': 'Visão Geral',
    'analytics': 'Análises',
    'sync': 'Sincronização',
    'tools': 'Ferramentas',
    'last7Days': 'Últimos 7 Dias',
    'last30Days': 'Últimos 30 Dias',
    'last90Days': 'Últimos 90 Dias',
    'pageViews': 'Visualizações',
    'uniqueUsers': 'Usuários Únicos',
    'avgSessionTime': 'Tempo Médio',
    'bounceRate': 'Taxa de Rejeição',
    'topPages': 'Páginas Principais',
    'deviceTypes': 'Tipos de Dispositivo',
    'topCountries': 'Principais Países',
    'gridView': 'Visualização em Grade',
    
    // Sync page
    'syncStatus': 'Status de Sincronização',
    'lastSync': 'Última Sincronização',
    'online': 'Online',
    'neverSynced': 'Nunca Sincronizado',
    'dataManagement': 'Gerenciamento de Dados',
    'dataManagementDesc': 'Gerencie seus dados e configurações',
    'shareApp': 'Compartilhar App',
    'enableNotifications': 'Ativar Notificações',
    'exportData': 'Exportar Dados',
    'importData': 'Importar Dados',
    
    // Tools page
    'appFeatures': 'Recursos do App',
    'systemInfo': 'Informações do Sistema',
    'userAgent': 'Agente do Usuário',
    'platform': 'Plataforma',
    'language': 'Idioma',
    'cookiesEnabled': 'Cookies Habilitados',
    'onlineStatus': 'Status Online',
    
    // Notes
    'notes': {
      'editNote': 'Editar Nota',
      'colorLabel': 'Cor da Etiqueta',
      'titleLabel': 'Título da Etiqueta',
      'contentLabel': 'Conteúdo da Etiqueta',
      'cancel': 'Cancelar',
      'delete': 'Excluir',
      'saveChanges': 'Salvar Alterações'
    },
    
    // Achievements
    'continueUsingApp': 'Continue usando o app',
    'placeholder': 'Digite aqui...',
    
    // Achievement titles and descriptions
    'firstStep': 'Primeiro Passo',
    'firstStepDesc': 'Complete sua primeira tarefa',
    'earlyBird': 'Madrugador',
    'earlyBirdDesc': 'Complete uma tarefa antes das 8h',
    'nightOwl': 'Coruja Noturna',
    'nightOwlDesc': 'Complete uma tarefa depois das 22h',
    'taskMaster': 'Mestre das Tarefas',
    'taskMasterDesc': 'Complete 50 tarefas',
    'productivityHero': 'Herói da Produtividade',
    'productivityHeroDesc': 'Complete 100 tarefas',
    'productivityLegend': 'Lenda da Produtividade',
    'productivityLegendDesc': 'Complete 500 tarefas',
    'overallProgress': 'Progresso Geral',
    'achievementsUnlocked': 'conquistas desbloqueadas',
    'all': 'Todas',
    'unlocked': 'Desbloqueadas',
    'locked': 'Bloqueadas',
    'tasks': 'Tarefas'
  },
  en: {
    // Basic
    'add': 'Add',
    'edit': 'Edit',
    'delete': 'Delete',
    'save': 'Save',
    'cancel': 'Cancel',
    'close': 'Close',
    'back': 'Back',
    'next': 'Next',
    'previous': 'Previous',
    'search': 'Search',
    'filter': 'Filter',
    'sort': 'Sort',
    'export': 'Export',
    'import': 'Import',
    'settings': 'Settings',
    'help': 'Help',
    'about': 'About',
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    'warning': 'Warning',
    'info': 'Information',
    
    // Onboarding
    'onboarding': {
      'welcome': {
        'title': 'Welcome to QuickList!',
        'description': 'Organize your tasks simply and efficiently. Let\'s get started!'
      },
      'createLists': {
        'title': 'Create Your Lists',
        'description': 'Organize your tasks in personalized lists. Use categories and colors for better organization.'
      },
      'features': {
        'title': 'Amazing Features',
        'description': 'Take advantage of filters, search, statistics and much more to increase your productivity.'
      },
      'skip': 'Skip',
      'next': 'Next',
      'getStarted': 'Get Started'
    },

    // App specific
    'appName': 'QuickList',
    'homescreen': 'Home',
    'allLists': 'All Lists',
    'newList': 'New List',
    'createList': 'Create List',
    'addList': 'Add List',
    'editList': 'Edit List',
    'deleteList': 'Delete List',
    'listTitle': 'List Title',
    'listDescription': 'List Description',
    'listColor': 'List Color',
    'noLists': 'No lists created',
    'noListsDesc': 'Create your first list to start organizing your tasks.',
    'listNotFound': 'List not found',
    'backToLists': 'Back to Lists',
    'searchLists': 'Search lists',
    'showArchived': 'Show Archived',
    'hideArchived': 'Hide Archived',
    'archiveList': 'Archive List',
    'unarchiveList': 'Unarchive List',
    'duplicateList': 'Duplicate List',
    'shareList': 'Share List',
    'listCopied': 'List copied to clipboard',
    'linkCopied': 'Link copied to clipboard',
    'listShared': 'List shared successfully',
    'listUpdated': 'List updated successfully',
    'listCreated': 'List created successfully',
    'listDeleted': 'List deleted successfully',
    'listArchived': 'List archived successfully',
    'listUnarchived': 'List unarchived successfully',
    'listDuplicated': 'List duplicated successfully',
    
    // Items
    'addItem': 'Add Item',
    'editItem': 'Edit Item',
    'searchTasks': 'Search tasks...',
    'hideCompleted': 'Hide completed',
    'showCompleted': 'Show completed',
    'sortBy': 'Sort by',
    'recent': 'Recent',
    'alphabetical': 'Alphabetical',
    'completed': 'Completed',
    'newItem': 'New Item',
    'deleteItem': 'Delete Item',
    'itemText': 'Item Text',
    'itemAdded': 'Item added',
    'itemRemoved': 'Item removed',
    'itemUpdated': 'Item updated',
    'itemMoved': 'Item moved',
    'completedItem': '✓',
    'pendingItem': '○',
    'noItems': 'No items',
    'addItemHere': 'Add items here...',
    'addItemPlaceholder': 'Enter item text...',
    'searchTasksPlaceholder': 'Type to search...',
    'pending': 'Pending',
    'completedItemsRemoved': 'completed items removed',
    'markComplete': 'Mark as complete',
    'markIncomplete': 'Mark as incomplete',
    'priority': 'Priority',
    'dueDate': 'Due Date',
    'category': 'Category',
    'categories': 'Categories',
    'notesLabel': 'Notes',
    'filters': 'Filters',
    'clearCompleted': 'Clear completed',
    'oneItemLeft': 'item left',
    'itemsLeft': 'items left',
    'allCompleted': 'All tasks completed!',
    'selectAll': 'Select all',
    'deselectAll': 'Deselect all',
    
    // Statistics and insights
    'insights': 'Insights',
    'statistics': 'Statistics',
    'achievements': 'Achievements',
    
    // Templates
    'templates': 'Templates',
    'useTemplate': 'Use Template',
    'selectTemplate': 'Select Template',
    'personalTemplate': 'Personal',
    'workTemplate': 'Work',
    'shoppingTemplate': 'Shopping',
    'travelTemplate': 'Travel',
    'studyTemplate': 'Study',
    'eventTemplate': 'Event',
    'personalDesc': 'List for personal tasks and daily activities',
    'personalItems': 'Exercise, Go to market, Call family, Organize room',
    'workDesc': 'List for professional tasks and projects',
    'workItems': 'Review emails, Attend meeting, Finish report, Prepare presentation',
    'shoppingDesc': 'List for grocery and product shopping',
    'shoppingItems': 'Milk, Bread, Eggs, Fruits, Cleaning supplies',
    'travelDesc': 'List for organizing trips and outings',
    'travelItems': 'Pack bags, Check documents, Book hotel, Research attractions',
    'studyDesc': 'Organize your studies and learning materials',
    'studyItems': 'Review chapter 1, Do exercises, Prepare presentation, Study for exam',
    'eventDesc': 'Organize all the details of your event',
    'eventItems': 'Define location, Send invitations, Buy decorations, Prepare food',
    
    // Auth translations  
    auth: {
      title: 'QuickList',
      login: 'Login',
      signup: 'Sign Up',
      email: 'Email',
      password: 'Password',
      passwordMin: 'Password (minimum 6 characters)',
      loginButton: 'Login',
      signupButton: 'Create Account',
      loggingIn: 'Logging in...',
      creating: 'Creating account...',
      welcomeBack: 'Welcome back!',
      accountCreated: 'Account created successfully!'
    },

    // Statistics page
    'overview': 'Overview',
    'analytics': 'Analytics',
    'sync': 'Sync',
    'tools': 'Tools',
    'last7Days': 'Last 7 Days',
    'last30Days': 'Last 30 Days',
    'last90Days': 'Last 90 Days',
    'pageViews': 'Page Views',
    'uniqueUsers': 'Unique Users',
    'avgSessionTime': 'Avg Session Time',
    'bounceRate': 'Bounce Rate',
    'topPages': 'Top Pages',
    'deviceTypes': 'Device Types',
    'topCountries': 'Top Countries',
    'gridView': 'Grid View',
    
    // Sync page
    'syncStatus': 'Sync Status',
    'lastSync': 'Last Sync',
    'online': 'Online',
    'neverSynced': 'Never Synced',
    'dataManagement': 'Data Management',
    'dataManagementDesc': 'Manage your data and settings',
    'shareApp': 'Share App',
    'enableNotifications': 'Enable Notifications',
    'exportData': 'Export Data',
    'importData': 'Import Data',
    
    // Tools page
    'appFeatures': 'App Features',
    'systemInfo': 'System Info',
    'userAgent': 'User Agent',
    'platform': 'Platform',
    'language': 'Language',
    'cookiesEnabled': 'Cookies Enabled',
    'onlineStatus': 'Online Status',
    
    // Notes
    'notes': {
      'editNote': 'Edit Note',
      'colorLabel': 'Color Label',
      'titleLabel': 'Title Label',
      'contentLabel': 'Content Label',
      'cancel': 'Cancel',
      'delete': 'Delete',
      'saveChanges': 'Save Changes'
    },
    
    // Achievements
    'continueUsingApp': 'Continue using app',
    'placeholder': 'Type here...',
    
    // Achievement titles and descriptions
    'firstStep': 'First Step',
    'firstStepDesc': 'Complete your first task',
    'earlyBird': 'Early Bird',
    'earlyBirdDesc': 'Complete a task before 8am',
    'nightOwl': 'Night Owl',
    'nightOwlDesc': 'Complete a task after 10pm',
    'taskMaster': 'Task Master',
    'taskMasterDesc': 'Complete 50 tasks',
    'productivityHero': 'Productivity Hero',
    'productivityHeroDesc': 'Complete 100 tasks',
    'productivityLegend': 'Productivity Legend',
    'productivityLegendDesc': 'Complete 500 tasks',
    'overallProgress': 'Overall Progress',
    'achievementsUnlocked': 'achievements unlocked',
    'all': 'All',
    'unlocked': 'Unlocked',
    'locked': 'Locked',
    'tasks': 'Tasks'
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

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('quicklist-language', lang);
  }, []);

  const t = useCallback((key: string): string => {
    // Handle nested keys with dot notation
    const keys = key.split('.');
    let translation: any = translations[language];
    
    for (const k of keys) {
      translation = translation?.[k];
      if (!translation) break;
    }
    
    if (translation && typeof translation === 'string') {
      return translation;
    }
    
    // Fallback to Portuguese if key not found in current language
    if (language !== 'pt') {
      let fallbackTranslation: any = translations.pt;
      for (const k of keys) {
        fallbackTranslation = fallbackTranslation?.[k];
        if (!fallbackTranslation) break;
      }
      
      if (fallbackTranslation && typeof fallbackTranslation === 'string') {
        return fallbackTranslation;
      }
    }
    
    // Return key as fallback
    return key;
  }, [language]);

  const contextValue = useMemo(() => ({
    language, 
    setLanguage: handleSetLanguage, 
    t
  }), [language, handleSetLanguage, t]);

  return (
    <LanguageContext.Provider value={contextValue}>
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