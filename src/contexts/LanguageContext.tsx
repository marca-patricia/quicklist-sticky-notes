import * as React from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: any) => string;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

const translations = {
  pt: {
    // Auth Page
    'auth.title': 'QuickList',
    'auth.login': 'Entrar',
    'auth.signup': 'Criar Conta',
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.confirmPassword': 'Confirmar Senha',
    'auth.forgotPassword': 'Esqueci minha senha',
    'auth.dontHaveAccount': 'Não tem uma conta?',
    'auth.alreadyHaveAccount': 'Já tem uma conta?',
    'auth.loginWithGoogle': 'Entrar com Google',
    'auth.loginWithGitHub': 'Entrar com GitHub',
    'auth.or': 'ou',
    'auth.passwordMinLength': 'A senha deve ter pelo menos 6 caracteres',
    'auth.passwordsDontMatch': 'As senhas não coincidem',
    'auth.loginSuccess': 'Login realizado com sucesso!',
    'auth.signupSuccess': 'Conta criada com sucesso!',
    'auth.emailSent': 'Email de redefinição enviado!',
    'auth.loggingIn': 'Entrando...',
    'auth.signingUp': 'Criando conta...',
    'auth.loading': 'Carregando...',
    'auth.terms': 'Ao continuar, você aceita nossos termos de uso',
    'auth.privacy': 'Política de Privacidade',
    'auth.invalidEmail': 'Email inválido',
    'auth.weakPassword': 'Senha muito fraca',
    'auth.emailAlreadyInUse': 'Este email já está em uso',
    'auth.wrongPassword': 'Senha incorreta',
    'auth.userNotFound': 'Usuário não encontrado',
    'auth.tooManyAttempts': 'Muitas tentativas. Tente novamente mais tarde',
    'auth.networkError': 'Erro de conexão. Verifique sua internet',
    'auth.unknownError': 'Erro desconhecido. Tente novamente',

    // Common
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Excluir',
    'common.edit': 'Editar',
    'common.add': 'Adicionar',
    'common.search': 'Buscar',
    'common.loading': 'Carregando...',
    'common.yes': 'Sim',
    'common.no': 'Não',
    'common.ok': 'OK',
    'common.close': 'Fechar',
    'common.back': 'Voltar',
    'common.next': 'Próximo',
    'common.previous': 'Anterior',
    'common.done': 'Concluído',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.warning': 'Aviso',
    'common.info': 'Informação',
    
    // Lists
    'lists.title': 'Minhas Listas',
    'lists.newList': 'Nova Lista',
    'lists.editList': 'Editar Lista',
    'lists.deleteList': 'Excluir Lista',
    'lists.confirmDelete': 'Tem certeza que deseja excluir esta lista?',
    'lists.emptyState': 'Nenhuma lista criada ainda',
    'lists.createFirst': 'Criar primeira lista',
    'lists.itemsCount': (count: number) => `${count} ${count === 1 ? 'item' : 'itens'}`,
    'lists.completed': 'Concluída',
    'lists.pending': 'Pendente',
    'lists.progress': 'Progresso',
    
    // List Items
    'listItems.addItem': 'Adicionar item',
    'listItems.editItem': 'Editar item',
    'listItems.deleteItem': 'Excluir item',
    'listItems.markComplete': 'Marcar como concluído',
    'listItems.markIncomplete': 'Marcar como pendente',
    'listItems.placeholder': 'Digite um novo item...',
    'listItems.emptyState': 'Nenhum item nesta lista',
    'listItems.addFirst': 'Adicionar primeiro item',
    
    // Templates
    'templates.title': 'Modelos',
    'templates.use': 'Usar Modelo',
    'templates.shopping': 'Lista de Compras',
    'templates.todo': 'Lista de Tarefas',
    'templates.travel': 'Lista de Viagem',
    'templates.books': 'Lista de Leitura',
    'templates.movies': 'Lista de Filmes',
    'templates.goals': 'Metas e Objetivos',
    
    // Statistics
    'statistics.title': 'Estatísticas',
    'statistics.totalLists': 'Total de Listas',
    'statistics.totalItems': 'Total de Itens',
    'statistics.completedItems': 'Itens Concluídos',
    'statistics.completionRate': 'Taxa de Conclusão',
    'statistics.thisWeek': 'Esta Semana',
    'statistics.thisMonth': 'Este Mês',
    'statistics.allTime': 'Todo o Período',
    
    // Achievements
    'achievements.title': 'Conquistas',
    'achievements.unlocked': 'Desbloqueada',
    'achievements.locked': 'Bloqueada',
    'achievements.firstList': 'Primeira Lista',
    'achievements.firstListDesc': 'Crie sua primeira lista',
    'achievements.tenItems': 'Produtivo',
    'achievements.tenItemsDesc': 'Complete 10 itens',
    'achievements.streak': 'Sequência',
    'achievements.streakDesc': 'Use o app por 7 dias seguidos',
    
    // Navigation
    'nav.home': 'Início',
    'nav.lists': 'Listas',
    'nav.templates': 'Modelos',
    'nav.statistics': 'Estatísticas',
    'nav.achievements': 'Conquistas',
    'nav.settings': 'Configurações',
    'nav.logout': 'Sair',

    // Settings
    'settings.title': 'Configurações',
    'settings.language': 'Idioma',
    'settings.theme': 'Tema',
    'settings.notifications': 'Notificações',
    'settings.export': 'Exportar Dados',
    'settings.import': 'Importar Dados',
    'settings.clearData': 'Limpar Dados',
    'settings.account': 'Conta',
    
    // Themes
    'theme.light': 'Claro',
    'theme.dark': 'Escuro',
    'theme.system': 'Sistema',
    
    // Notifications
    'notifications.title': 'Notificações',
    'notifications.taskReminder': 'Lembrete de tarefa',
    'notifications.dailyGoal': 'Meta diária',
    'notifications.permission': 'Permitir notificações',
    
    // Data Management
    'data.export': 'Exportar',
    'data.import': 'Importar',
    'data.clear': 'Limpar',
    'data.exportSuccess': 'Dados exportados com sucesso',
    'data.importSuccess': 'Dados importados com sucesso',
    'data.clearSuccess': 'Dados limpos com sucesso',
    'data.confirmClear': 'Tem certeza que deseja limpar todos os dados?',
    
    // Offline
    'offline.title': 'Modo Offline',
    'offline.description': 'Você está offline. Suas alterações serão sincronizadas quando reconectar.',
    'offline.reconnected': 'Conectado novamente',
    'offline.syncError': 'Erro ao sincronizar',
    
    // Search
    'search.placeholder': 'Buscar listas...',
    'search.noResults': 'Nenhum resultado encontrado',
    'search.resultsFor': 'Resultados para',
    
    // Empty States
    'emptyState.title': 'Nada aqui ainda',
    'emptyState.description': 'Comece criando sua primeira lista',
    'emptyState.action': 'Criar Lista',
    
    // Errors
    'error.generic': 'Algo deu errado',
    'error.network': 'Erro de conexão',
    'error.retry': 'Tentar novamente',
    'error.reportBug': 'Reportar erro',
    
    // Success Messages
    'success.listCreated': 'Lista criada com sucesso',
    'success.listUpdated': 'Lista atualizada com sucesso',
    'success.listDeleted': 'Lista excluída com sucesso',
    'success.itemAdded': 'Item adicionado com sucesso',
    'success.itemCompleted': 'Item marcado como concluído',
    'success.saved': 'Salvo com sucesso',
    
    // Accessibility
    'a11y.menu': 'Menu principal',
    'a11y.close': 'Fechar',
    'a11y.toggle': 'Alternar',
    'a11y.expand': 'Expandir',
    'a11y.collapse': 'Recolher',
    'a11y.loading': 'Carregando conteúdo',

    // New additions for missing translations
    'listCreated': 'Lista criada com sucesso!',
    'listPlaceholder': 'Nome da nova lista...',
    'searchLists': 'Buscar listas',
    'searchNotes': 'Buscar notas...',
    'createFirstList': 'Criar primeira lista',
    'newListName': 'Nome da nova lista',
    'typeItem': 'Digite um item...',
    
    // Onboarding Portuguese
    'onboarding.welcome.title': 'Bem-vindo ao QuickList!',
    'onboarding.welcome.description': 'Organize suas tarefas de forma simples e eficiente. Vamos começar!',
    'onboarding.createLists.title': 'Crie suas listas',
    'onboarding.createLists.description': 'Use o botão + para criar listas personalizadas ou escolha entre nossos templates.',
    'onboarding.features.title': 'Recursos disponíveis',
    'onboarding.features.description': 'Notas adesivas, estatísticas, conquistas e muito mais para impulsionar sua produtividade.',
    'onboarding.skip': 'Pular',
    'onboarding.next': 'Próximo',
    'onboarding.getStarted': 'Começar',

    // Notes specific
    'notes.title': 'Notas',
    'notes.searchPlaceholder': 'Buscar notas...',
    'notes.createNew': 'Nova Nota',
    'notes.editNote': 'Editar Nota',
    'notes.titlePlaceholder': 'Digite o título da nota...',
    'notes.contentPlaceholder': 'Escreva sua nota...',
    'notes.colorLabel': 'Cor:',
    'notes.titleLabel': 'Título:',
    'notes.contentLabel': 'Conteúdo:',
    'notes.save': 'Salvar',
    'notes.saveChanges': 'Salvar Alteração',
    'notes.cancel': 'Cancelar',
    'notes.delete': 'Excluir',
    'notes.close': 'Fechar',
    'notes.notesCount': (count: number) => `${count} nota${count !== 1 ? 's' : ''}`,
    'notes.emptyState': 'Nenhuma nota encontrada',
    'notes.confirmDelete': 'Tem certeza que deseja excluir esta nota?',

    // Additional common terms
    'welcomeBack': 'Bem-vindo de volta!',
    'changesSavedSuccessfully': 'Alterações salvas com sucesso!',

    // List Detail Specific
    'allLists': 'Todas as Listas',
    'listNotFound': 'Lista não encontrada',
    'backToLists': 'Voltar para listas',
    'itemAdded': 'Item adicionado',
    'itemRemoved': 'Item removido',
    'completedItem': '✓',
    'pendingItem': '○',
    'listCopied': 'Lista copiada para área de transferência',
    'completedItemsRemoved': 'itens concluídos removidos',
    'linkCopied': 'Link copiado',
    'listUpdated': 'Lista atualizada',
    'itemMoved': 'Item movido',
    'clickToEdit': 'Clique para editar',
    'homeScreen': 'Tela inicial',
    'pending': 'Pendentes',
    'completed': 'Concluídos',
    'noItems': 'Nenhum item',
    'addItemHere': 'Adicionar item aqui',
    'showArchived': 'Mostrar Arquivadas',
    'hideArchived': 'Ocultar Arquivadas',
    'archiveList': 'Arquivar lista',
    'unarchive': 'Desarquivar',
    'deleteList': 'Excluir lista',
    'confirmDeleteList': 'Confirmar exclusão',
    'confirmDeleteListDesc': 'Tem certeza que deseja excluir esta lista? Esta ação não pode ser desfeita.',
    'listRestored': 'Lista restaurada',
    'listDeleted': 'Lista excluída',
    'listArchived': 'Lista arquivada',
    'listUnarchived': 'Lista desarquivada',
    'colorChangedSuccessfully': 'Cor alterada com sucesso',
    'noResultsFound': 'Nenhum resultado encontrado',
    'tryDifferentSearch': 'Tente uma busca diferente',
    'noArchivedLists': 'Nenhuma lista arquivada',

    // More empty state messages
    'emptyState.lists.title': 'Nenhuma lista criada',
    'emptyState.lists.description': 'Crie sua primeira lista para começar a organizar suas tarefas.',
    'emptyState.lists.action': 'Criar lista',
    'emptyState.templates.title': 'Modelos disponíveis',
    'emptyState.templates.description': 'Escolha um modelo para começar rapidamente.',
    'emptyState.templates.action': 'Ver modelos',
    'emptyState.achievements.title': 'Conquistas aguardando',
    'emptyState.achievements.description': 'Complete tarefas para desbloquear conquistas.',
    'emptyState.achievements.action': 'Ver tarefas',
    'emptyState.statistics.title': 'Dados em preparação',
    'emptyState.statistics.description': 'Complete algumas tarefas para ver estatísticas detalhadas sobre sua produtividade.',
    'emptyState.statistics.action': 'Criar lista',
  },
  en: {
    // Auth Page
    'auth.title': 'QuickList',
    'auth.login': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot password',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.loginWithGoogle': 'Sign in with Google',
    'auth.loginWithGitHub': 'Sign in with GitHub',
    'auth.or': 'or',
    'auth.passwordMinLength': 'Password must be at least 6 characters',
    'auth.passwordsDontMatch': 'Passwords do not match',
    'auth.loginSuccess': 'Successfully signed in!',
    'auth.signupSuccess': 'Account created successfully!',
    'auth.emailSent': 'Reset email sent!',
    'auth.loggingIn': 'Signing in...',
    'auth.signingUp': 'Creating account...',
    'auth.loading': 'Loading...',
    'auth.terms': 'By continuing, you accept our terms of use',
    'auth.privacy': 'Privacy Policy',
    'auth.invalidEmail': 'Invalid email',
    'auth.weakPassword': 'Password too weak',
    'auth.emailAlreadyInUse': 'This email is already in use',
    'auth.wrongPassword': 'Wrong password',
    'auth.userNotFound': 'User not found',
    'auth.tooManyAttempts': 'Too many attempts. Try again later',
    'auth.networkError': 'Connection error. Check your internet',
    'auth.unknownError': 'Unknown error. Try again',

    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.done': 'Done',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Information',
    
    // Lists
    'lists.title': 'My Lists',
    'lists.newList': 'New List',
    'lists.editList': 'Edit List',
    'lists.deleteList': 'Delete List',
    'lists.confirmDelete': 'Are you sure you want to delete this list?',
    'lists.emptyState': 'No lists created yet',
    'lists.createFirst': 'Create first list',
    'lists.itemsCount': (count: number) => `${count} ${count === 1 ? 'item' : 'items'}`,
    'lists.completed': 'Completed',
    'lists.pending': 'Pending',
    'lists.progress': 'Progress',
    
    // List Items
    'listItems.addItem': 'Add item',
    'listItems.editItem': 'Edit item',
    'listItems.deleteItem': 'Delete item',
    'listItems.markComplete': 'Mark as complete',
    'listItems.markIncomplete': 'Mark as incomplete',
    'listItems.placeholder': 'Type a new item...',
    'listItems.emptyState': 'No items in this list',
    'listItems.addFirst': 'Add first item',
    
    // Templates
    'templates.title': 'Templates',
    'templates.use': 'Use Template',
    'templates.shopping': 'Shopping List',
    'templates.todo': 'Todo List',
    'templates.travel': 'Travel List',
    'templates.books': 'Reading List',
    'templates.movies': 'Movie List',
    'templates.goals': 'Goals & Objectives',
    
    // Statistics
    'statistics.title': 'Statistics',
    'statistics.totalLists': 'Total Lists',
    'statistics.totalItems': 'Total Items',
    'statistics.completedItems': 'Completed Items',
    'statistics.completionRate': 'Completion Rate',
    'statistics.thisWeek': 'This Week',
    'statistics.thisMonth': 'This Month',
    'statistics.allTime': 'All Time',
    
    // Achievements
    'achievements.title': 'Achievements',
    'achievements.unlocked': 'Unlocked',
    'achievements.locked': 'Locked',
    'achievements.firstList': 'First List',
    'achievements.firstListDesc': 'Create your first list',
    'achievements.tenItems': 'Productive',
    'achievements.tenItemsDesc': 'Complete 10 items',
    'achievements.streak': 'Streak',
    'achievements.streakDesc': 'Use the app for 7 consecutive days',
    
    // Navigation
    'nav.home': 'Home',
    'nav.lists': 'Lists',
    'nav.templates': 'Templates',
    'nav.statistics': 'Statistics',
    'nav.achievements': 'Achievements',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',

    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.notifications': 'Notifications',
    'settings.export': 'Export Data',
    'settings.import': 'Import Data',
    'settings.clearData': 'Clear Data',
    'settings.account': 'Account',
    
    // Themes
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.taskReminder': 'Task reminder',
    'notifications.dailyGoal': 'Daily goal',
    'notifications.permission': 'Allow notifications',
    
    // Data Management
    'data.export': 'Export',
    'data.import': 'Import',
    'data.clear': 'Clear',
    'data.exportSuccess': 'Data exported successfully',
    'data.importSuccess': 'Data imported successfully',
    'data.clearSuccess': 'Data cleared successfully',
    'data.confirmClear': 'Are you sure you want to clear all data?',
    
    // Offline
    'offline.title': 'Offline Mode',
    'offline.description': 'You are offline. Your changes will be synced when you reconnect.',
    'offline.reconnected': 'Connected again',
    'offline.syncError': 'Sync error',
    
    // Search
    'search.placeholder': 'Search lists...',
    'search.noResults': 'No results found',
    'search.resultsFor': 'Results for',
    
    // Empty States
    'emptyState.title': 'Nothing here yet',
    'emptyState.description': 'Start by creating your first list',
    'emptyState.action': 'Create List',
    
    // Errors
    'error.generic': 'Something went wrong',
    'error.network': 'Connection error',
    'error.retry': 'Try again',
    'error.reportBug': 'Report error',
    
    // Success Messages
    'success.listCreated': 'List created successfully',
    'success.listUpdated': 'List updated successfully',
    'success.listDeleted': 'List deleted successfully',
    'success.itemAdded': 'Item added successfully',
    'success.itemCompleted': 'Item marked as complete',
    'success.saved': 'Saved successfully',
    
    // Accessibility
    'a11y.menu': 'Main menu',
    'a11y.close': 'Close',
    'a11y.toggle': 'Toggle',
    'a11y.expand': 'Expand',
    'a11y.collapse': 'Collapse',
    'a11y.loading': 'Loading content',

    // New additions for missing translations
    'listCreated': 'List created successfully!',
    'listPlaceholder': 'New list name...',
    'searchLists': 'Search lists',
    'searchNotes': 'Search notes...',
    'createFirstList': 'Create first list',
    'newListName': 'New list name',
    'typeItem': 'Type item...',
    
    // Onboarding
    'onboarding.welcome.title': 'Welcome to QuickList!',
    'onboarding.welcome.description': 'Organize your tasks simply and efficiently. Let\'s get started!',
    'onboarding.createLists.title': 'Create your lists',
    'onboarding.createLists.description': 'Use the + button to create custom lists or choose from our templates.',
    'onboarding.features.title': 'Available features',
    'onboarding.features.description': 'Sticky notes, statistics, achievements and much more to boost your productivity.',
    'onboarding.skip': 'Skip',
    'onboarding.next': 'Next',
    'onboarding.getStarted': 'Get Started',

    // Notes specific
    'notes.title': 'Notes',
    'notes.searchPlaceholder': 'Search notes...',
    'notes.createNew': 'New Note',
    'notes.editNote': 'Edit Note',
    'notes.titlePlaceholder': 'Enter note title...',
    'notes.contentPlaceholder': 'Write your note...',
    'notes.colorLabel': 'Color:',
    'notes.titleLabel': 'Title:',
    'notes.contentLabel': 'Content:',
    'notes.save': 'Save',
    'notes.saveChanges': 'Save Changes',
    'notes.cancel': 'Cancel',
    'notes.delete': 'Delete',
    'notes.close': 'Close',
    'notes.notesCount': (count: number) => `${count} note${count !== 1 ? 's' : ''}`,
    'notes.emptyState': 'No notes found',
    'notes.confirmDelete': 'Are you sure you want to delete this note?',

    // Additional common terms
    'welcomeBack': 'Welcome back!',
    'changesSavedSuccessfully': 'Changes saved successfully!',

    // More empty state messages
    'emptyState.lists.title': 'No lists created',
    'emptyState.lists.description': 'Create your first list to start organizing your tasks.',
    'emptyState.lists.action': 'Create list',
    'emptyState.templates.title': 'Available templates',
    'emptyState.templates.description': 'Choose a template to get started quickly.',
    'emptyState.templates.action': 'View templates',
    'emptyState.achievements.title': 'Achievements waiting',
    'emptyState.achievements.description': 'Complete tasks to unlock achievements.',
    'emptyState.achievements.action': 'View tasks',
    'emptyState.statistics.title': 'Data in preparation',
    'emptyState.statistics.description': 'Complete some tasks to see detailed statistics about your productivity.',
    'emptyState.statistics.action': 'Create list',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = React.useState<Language>('pt');

  React.useEffect(() => {
    const saved = localStorage.getItem('quicklist-language') as Language;
    if (saved && (saved === 'pt' || saved === 'en')) {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('quicklist-language', newLanguage);
  };

  const t = (key: string, params?: any): string => {
    const value = translations[language][key as keyof typeof translations['pt']];
    if (typeof value === 'function' && params !== undefined) {
      return value(params);
    }
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}