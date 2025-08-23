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
    'searchNotes': 'Buscar notas...',
    'noResultsFound': 'Nenhum resultado encontrado',
    'tryDifferentSearch': 'Tente uma busca diferente',
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
    
    // Missing translations - Delete confirmations
    'confirmDeleteItem': 'Excluir Item?',
    'confirmDeleteItemDesc': 'Esta ação não pode ser desfeita. O item será removido da lista.',
    
    // Missing translations - Undo system
    'itemDeleted': 'Item excluído',
    'clickToUndo': 'Clique para desfazer',
    'itemRestored': 'Item restaurado',
    'undone': 'Desfeito',
    
    // Missing translations - Time
    'justNow': 'agora há pouco',
    'minutesAgo': 'há {{count}} minutos',
    'hoursAgo': 'há {{count}} horas', 
    'daysAgo': 'há {{count}} dias',
    'offline': 'Offline',
    'yes': 'Sim',
    'no': 'Não',
    
    // Missing translations - Categories
    'startWithDefaultCategories': 'Comece criando algumas categorias padrão para organizar melhor suas tarefas.',
    
    // Missing translations - Achievements that are used
    'legendaryAchiever': 'Conquistador Lendário',
    'legendaryAchieverDesc': 'Complete 1000 tarefas',
    'categoryMaster': 'Mestre das Categorias', 
    'categoryMasterDesc': 'Use 20 categorias diferentes',
    'powerUser': 'Usuário Avançado',
    'powerUserDesc': 'Use o app por 30 dias consecutivos',
    'listArchitect': 'Arquiteto de Listas',
    'listArchitectDesc': 'Crie 50 listas diferentes',
    'streakLegend': 'Lenda da Sequência',
    'streakLegendDesc': 'Complete tarefas por 30 dias consecutivos',
    
    // Missing translations - Sync and connectivity
    'pendingChanges': 'Alterações pendentes',
    'syncInProgress': 'Sincronização em andamento',
    'offlineModeDesc': 'Você está offline. As alterações serão sincronizadas quando a conexão for restaurada.',
    
    // Missing translations - Accessibility
    'skipToMain': 'Pular para conteúdo principal',
    'skipToNav': 'Pular para navegação',
    'toggleTheme': 'Alternar tema claro/escuro',
    
    // Missing translations - Additional items
    'itemSaved': 'Item salvo',
    'clickToEdit': 'Clique para editar',
    'newCategory': 'Nova Categoria',
    'categoryName': 'Nome da categoria',
    'createDefaultCategories': 'Criar Categorias Padrão',
    'home': 'Início',
    'statisticsPageDesc': 'Visualize suas estatísticas e analise seu progresso',
    'confirmDeleteList': 'Excluir Lista?',
    'confirmDeleteListDesc': 'Esta ação não pode ser desfeita. A lista e todos os seus itens serão removidos.',
    'listRestored': 'Lista restaurada',
    'unarchive': 'Desarquivar',
    'colorChangedSuccessfully': 'Cor alterada com sucesso',
    'tryAgain': 'Tentar Novamente',
    
    // Native Features translations
    'appInstalled': 'App Instalado',
    'appInstalledDesc': 'O QuickList foi instalado com sucesso no seu dispositivo!',
    'shareAppText': 'Confira o QuickList - Uma lista de tarefas simples e eficiente!',
    'sharedSuccessfully': 'Compartilhado com sucesso',
    'sharedSuccessfullyDesc': 'O app foi compartilhado com sucesso!',
    'copiedToClipboard': 'Copiado para a área de transferência',
    'notificationsNotSupported': 'Notificações não suportadas',
    'notificationsNotSupportedDesc': 'Seu navegador não suporta notificações.',
    'notificationsEnabled': 'Notificações ativadas',
    'notificationsEnabledDesc': 'Você receberá notificações do QuickList.',
    'testNotificationBody': 'Suas notificações estão funcionando!',
    'notificationsDenied': 'Notificações negadas',
    'notificationsDeniedDesc': 'Você pode ativar as notificações nas configurações do navegador.',
    'notificationsError': 'Erro nas notificações',
    'notificationsErrorDesc': 'Ocorreu um erro ao configurar as notificações.',
    'dataExported': 'Dados exportados',
    'dataExportedDesc': 'Seus dados foram exportados com sucesso!',
    'exportError': 'Erro na exportação',
    'exportErrorDesc': 'Ocorreu um erro ao exportar os dados.',
    'dataImported': 'Dados importados',
    'dataImportedDesc': 'Seus dados foram importados com sucesso!',
    'importError': 'Erro na importação',
    'importErrorDesc': 'Arquivo inválido ou corrompido.',
    'installApp': 'Instalar App',
    'shareAppDescription': 'Compartilhe o QuickList com seus amigos e familiares!',
    'copyLink': 'Copiar Link',
    
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
    'sync': 'Sync',
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
      'titlePlaceholder': 'Digite o título da nota...',
      'contentLabel': 'Conteúdo da Etiqueta',
      'contentPlaceholder': 'Digite o conteúdo da nota...',
      'cancel': 'Cancelar',
      'delete': 'Excluir',
      'saveChanges': 'Salvar Alterações'
    },
    
    // Achievements
    'continueUsingApp': 'Continue usando o app',
    'placeholder': 'Digite aqui...',
    'listPlaceholder': 'Nova lista...',
    'newListName': 'Nome da nova lista',
    'chooseListColor': 'Escolher cor da lista',
    'createNewListForm': 'Criar nova lista',
    'pleaseEnterListName': 'Por favor, digite um nome para a lista',
    'errorCreatingList': 'Erro ao criar lista',
    
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
    'streakStarter': 'Sequência Iniciada',
    'streakStarterDesc': 'Complete tarefas por 3 dias seguidos',
    'streakMaster': 'Mestre das Sequências',
    'streakMasterDesc': 'Complete tarefas por 7 dias seguidos',
    'organizer': 'Organizador',
    'organizerDesc': 'Use 5 categorias diferentes',
    'speedDemon': 'Demônio da Velocidade',
    'speedDemonDesc': 'Complete 10 tarefas em 1 hora',
    'listCreator': 'Criador de Listas',
    'listCreatorDesc': 'Crie 10 listas diferentes',
    'perfectionist': 'Perfeccionista',
    'perfectionistDesc': 'Complete todas as tarefas de uma lista',
    'multitasker': 'Multitarefa',
    'multitaskerDesc': 'Tenha 5 listas ativas ao mesmo tempo',
    'minimalist': 'Minimalista',
    'minimalistDesc': 'Complete uma lista com apenas 3 itens',
    'maximalist': 'Maximalista',
    'maximalistDesc': 'Crie uma lista com mais de 50 itens',
    'weekendWarrior': 'Guerreiro do Fim de Semana',
    'weekendWarriorDesc': 'Complete 20 tarefas durante o fim de semana',
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
    'searchNotes': 'Search notes...',
    'noResultsFound': 'No results found',
    'tryDifferentSearch': 'Try a different search',
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
    
    // Missing translations - Delete confirmations
    'confirmDeleteItem': 'Delete Item?',
    'confirmDeleteItemDesc': 'This action cannot be undone. The item will be removed from the list.',
    
    // Missing translations - Undo system
    'itemDeleted': 'Item deleted',
    'clickToUndo': 'Click to undo',
    'itemRestored': 'Item restored',
    'undone': 'Undone',
    
    // Missing translations - Time
    'justNow': 'just now',
    'minutesAgo': '{{count}} minutes ago',
    'hoursAgo': '{{count}} hours ago',
    'daysAgo': '{{count}} days ago',
    'offline': 'Offline',
    'yes': 'Yes',
    'no': 'No',
    
    // Missing translations - Categories
    'startWithDefaultCategories': 'Start by creating some default categories to better organize your tasks.',
    
    // Missing translations - Achievements that are used
    'legendaryAchiever': 'Legendary Achiever',
    'legendaryAchieverDesc': 'Complete 1000 tasks',
    'categoryMaster': 'Category Master',
    'categoryMasterDesc': 'Use 20 different categories',
    'powerUser': 'Power User',
    'powerUserDesc': 'Use the app for 30 consecutive days',
    'listArchitect': 'List Architect', 
    'listArchitectDesc': 'Create 50 different lists',
    'streakLegend': 'Streak Legend',
    'streakLegendDesc': 'Complete tasks for 30 consecutive days',
    
    // Missing translations - Sync and connectivity
    'pendingChanges': 'Pending changes',
    'syncInProgress': 'Sync in progress',
    'offlineModeDesc': 'You are offline. Changes will be synced when connection is restored.',
    
    // Missing translations - Accessibility
    'skipToMain': 'Skip to main content',
    'skipToNav': 'Skip to navigation',
    'toggleTheme': 'Toggle light/dark theme',
    
    // Missing translations - Additional items
    'itemSaved': 'Item saved',
    'clickToEdit': 'Click to edit',
    'newCategory': 'New Category',
    'categoryName': 'Category name',
    'createDefaultCategories': 'Create Default Categories',
    'home': 'Home',
    'statisticsPageDesc': 'View your statistics and analyze your progress',
    'confirmDeleteList': 'Delete List?',
    'confirmDeleteListDesc': 'This action cannot be undone. The list and all its items will be removed.',
    'listRestored': 'List restored',
    'unarchive': 'Unarchive',
    'colorChangedSuccessfully': 'Color changed successfully',
    'tryAgain': 'Try Again',
    
    // Native Features translations
    'appInstalled': 'App Installed',
    'appInstalledDesc': 'QuickList has been successfully installed on your device!',
    'shareAppText': 'Check out QuickList - A simple and efficient task list!',
    'sharedSuccessfully': 'Shared successfully',
    'sharedSuccessfullyDesc': 'The app was shared successfully!',
    'copiedToClipboard': 'Copied to clipboard',
    'notificationsNotSupported': 'Notifications not supported',
    'notificationsNotSupportedDesc': 'Your browser does not support notifications.',
    'notificationsEnabled': 'Notifications enabled',
    'notificationsEnabledDesc': 'You will receive QuickList notifications.',
    'testNotificationBody': 'Your notifications are working!',
    'notificationsDenied': 'Notifications denied',
    'notificationsDeniedDesc': 'You can enable notifications in browser settings.',
    'notificationsError': 'Notifications error',
    'notificationsErrorDesc': 'An error occurred while setting up notifications.',
    'dataExported': 'Data exported',
    'dataExportedDesc': 'Your data has been successfully exported!',
    'exportError': 'Export error',
    'exportErrorDesc': 'An error occurred while exporting data.',
    'dataImported': 'Data imported',
    'dataImportedDesc': 'Your data has been successfully imported!',
    'importError': 'Import error',
    'importErrorDesc': 'Invalid or corrupted file.',
    'installApp': 'Install App',
    'shareAppDescription': 'Share QuickList with your friends and family!',
    'copyLink': 'Copy Link',
    
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
      'titlePlaceholder': 'Enter note title...',
      'contentLabel': 'Content Label',
      'contentPlaceholder': 'Enter note content...',
      'cancel': 'Cancel',
      'delete': 'Delete',
      'saveChanges': 'Save Changes'
    },
    
    // Achievements
    'continueUsingApp': 'Continue using app',
    'placeholder': 'Type here...',
    'listPlaceholder': 'New list...',
    'newListName': 'New list name',
    'chooseListColor': 'Choose list color',
    'createNewListForm': 'Create new list',
    'pleaseEnterListName': 'Please enter a list name',
    'errorCreatingList': 'Error creating list',
    
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
    'streakStarter': 'Streak Starter',
    'streakStarterDesc': 'Complete tasks for 3 consecutive days',
    'streakMaster': 'Streak Master',
    'streakMasterDesc': 'Complete tasks for 7 consecutive days',
    'organizer': 'Organizer',
    'organizerDesc': 'Use 5 different categories',
    'speedDemon': 'Speed Demon',
    'speedDemonDesc': 'Complete 10 tasks in 1 hour',
    'listCreator': 'List Creator',
    'listCreatorDesc': 'Create 10 different lists',
    'perfectionist': 'Perfectionist',
    'perfectionistDesc': 'Complete all tasks in a list',
    'multitasker': 'Multitasker',
    'multitaskerDesc': 'Have 5 active lists at the same time',
    'minimalist': 'Minimalist',
    'minimalistDesc': 'Complete a list with only 3 items',
    'maximalist': 'Maximalist',
    'maximalistDesc': 'Create a list with more than 50 items',
    'weekendWarrior': 'Weekend Warrior',
    'weekendWarriorDesc': 'Complete 20 tasks during the weekend',
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