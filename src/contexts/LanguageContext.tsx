import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  pt: {
    // Auth Page
    'auth.title': 'QuickList',
    'auth.login': 'Entrar',
    'auth.signup': 'Criar Conta',
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.passwordMin': 'Senha (mínimo 6 caracteres)',
    'auth.loginButton': 'Entrar',
    'auth.signupButton': 'Criar Conta',
    'auth.loggingIn': 'Entrando...',
    'auth.creating': 'Criando...',
    'auth.welcomeBack': 'Bem-vindo de volta!',
    'auth.accountCreated': 'Conta criada! Verifique seu email.',
    
    // General
    'general.loading': 'Carregando...',
    'general.save': 'Salvar',
    'general.cancel': 'Cancelar',
    'general.delete': 'Excluir',
    'general.edit': 'Editar',
    
    // Lists
    'addList': 'Adicionar',
    'listCreated': 'Lista criada com sucesso!',
    'listPlaceholder': 'Nome da nova lista...',
    'searchLists': 'Buscar listas',
    'allLists': 'Todas as Listas',
    'noResultsFound': 'Nenhum resultado encontrado',
    'showArchived': 'Mostrar Arquivadas',
    'hideArchived': 'Ocultar Arquivadas',
    'noArchivedLists': 'Nenhuma lista arquivada',
    'listArchived': 'Lista arquivada',
    'listUnarchived': 'Lista desarquivada',
    
    // Sticky Notes
    'Digite o título...': 'Digite o título...',
    'Título (opcional)': 'Título (opcional)',
    'Escreva sua nota...': 'Escreva sua nota...',
    'Título da lista': 'Título da lista',
    'Item': 'Item',
    'Adicionar item': 'Adicionar item',
    'Nome da categoria': 'Nome da categoria',
    'Ou escolha uma existente:': 'Ou escolha uma existente:',
    'Salvar': 'Salvar',
    'Post-it salvo com sucesso!': 'Post-it salvo com sucesso!',
    
    // Achievements - Conquistas
    'achievements': 'Conquistas',
    'unlocked': 'Desbloqueadas',
    'undo': 'Desfazer',
    'undone': 'Desfeito',
    'clickToUndo': 'Clique aqui para desfazer',
    
    // Achievement names and descriptions
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
    'legendaryAchiever': 'Lenda da Produtividade',
    'legendaryAchieverDesc': 'Complete 500 tarefas',
    'streakStarter': 'Sequência Iniciada',
    'streakStarterDesc': 'Complete tarefas por 3 dias seguidos',
    'streakMaster': 'Mestre da Consistência',
    'streakMasterDesc': 'Complete tarefas por 7 dias seguidos',
    'streakLegend': 'Lenda da Consistência',
    'streakLegendDesc': 'Complete tarefas por 30 dias seguidos',
    'organizer': 'Organizador',
    'organizerDesc': 'Use 5 categorias diferentes',
    'categoryMaster': 'Mestre das Categorias',
    'categoryMasterDesc': 'Use 10 categorias diferentes',
    'speedDemon': 'Velocista',
    'speedDemonDesc': 'Complete 10 tarefas em um dia',
    'powerUser': 'Super Usuário',
    'powerUserDesc': 'Complete 25 tarefas em um dia',
    'listCreator': 'Criador de Listas',
    'listCreatorDesc': 'Crie 5 listas diferentes',
    'listArchitect': 'Arquiteto de Listas',
    'listArchitectDesc': 'Crie 20 listas diferentes',
    'perfectionist': 'Perfeccionista',
    'perfectionistDesc': 'Complete uma lista inteira',
    'minimalist': 'Minimalista',
    'minimalistDesc': 'Complete uma lista com apenas 1 item',
    'maximalist': 'Maximalista',
    'maximalistDesc': 'Crie uma lista com 50+ itens',
    'weekendWarrior': 'Guerreiro de Fim de Semana',
    'weekendWarriorDesc': 'Complete tarefas no sábado e domingo',

    // Productivity insights
    'totalTasksCreated': 'Total de Tarefas Criadas',
    'totalTasksCompleted': 'Tarefas Concluídas',
    'completionRate': 'Taxa de Conclusão',
    'tasksCompletedToday': 'Tarefas Concluídas Hoje',
    'thisWeek': 'Esta Semana',
    'currentStreak': 'Sequência Atual',
    'insights': 'Estatísticas',
    'productivityInsights': 'Insights de Produtividade',
    'days': 'dias',

    // Templates
    'personalTemplate': 'Tarefas Pessoais',
    'personalDesc': 'Tarefas pessoais gerais e lembretes',
    'personalItems': 'Ligar dentista, Comprar supermercado, Exercitar-se, Ler livro',
    'workTemplate': 'Projetos de Trabalho',
    'workDesc': 'Tarefas profissionais e gestão de projetos',
    'workItems': 'Reunião da equipe, Revisar documentos, Enviar e-mails, Atualizar relatório',
    'shoppingTemplate': 'Lista de Compras',
    'shoppingDesc': 'Itens de supermercado e compras',
    'shoppingItems': 'Leite, Pão, Frutas, Vegetais',
    'travelTemplate': 'Planejamento de Viagem',
    'travelDesc': 'Preparação de viagem e checklist',
    'travelItems': 'Reservar hotel, Fazer as malas, Verificar passaporte, Comprar passagens',
    'studyTemplate': 'Plano de Estudos',
    'studyDesc': 'Objetivos educacionais e tarefas de estudo',
    'studyItems': 'Ler capítulo 1, Praticar exercícios, Fazer anotações, Revisar material',
    'eventTemplate': 'Planejamento de Evento',
    'eventDesc': 'Organização de eventos e preparação',
    'eventItems': 'Enviar convites, Reservar local, Planejar menu, Preparar decoração',
    'templates': 'Modelos',
    'useTemplate': 'Usar Modelo',
    
    // Missing translations
    'noLists': 'Nenhuma lista ainda',
    'noListsDesc': 'Clique no + para criar sua primeira lista',
    'confirmDeleteList': 'Confirmar Exclusão',
    'confirmDeleteListDesc': 'Tem certeza que deseja excluir esta lista? Esta ação não pode ser desfeita.',
    'deleteList': 'Excluir Lista',
    'confirmDeleteItem': 'Confirmar Exclusão',
    'confirmDeleteItemDesc': 'Tem certeza que deseja excluir este item?',
    'deleteItem': 'Excluir Item',
    'itemDeleted': 'Item excluído',
    'itemRestored': 'Item restaurado',
    'shareList': 'Compartilhar Lista',
    'completed': 'Concluída',
    'addItem': 'Adicionar Item',
    'homescreen': 'Início',
    'help': 'Ajuda',
    'cancel': 'Cancelar',
    'confirm': 'Confirmar',
    'listDeleted': 'Lista excluída',
'listRestored': 'Lista restaurada',
    'archiveList': 'Arquivar Lista',
    'unarchive': 'Desarquivar',
    'createNewList': 'Criar nova lista',
    
    // Missing navigation and interface translations
    'noItemsYet': 'Nenhum item na lista ainda',
    'offline': 'Offline',
    'loadingText': 'Carregando...',
    'toggleTheme': 'Alternar tema',
    'chooseColor': 'Escolher cor',
    'chooseListColor': 'Escolher cor da lista',
    'createNewListForm': 'Criar nova lista',
    'newListName': 'Nome da nova lista',
    'typeItem': 'Digite o item...',
    'tryDifferentSearch': 'Tente uma busca diferente',
    'appSettings': 'Configurações do aplicativo',
    'toolsAndStats': 'Ferramentas e estatísticas',
    'mainTaskList': 'Lista de tarefas principal',
    'createNewListSection': 'Criar nova lista',
    'reloadApp': 'Recarregar aplicativo QuickList',
    'achievementProgress': 'Progresso da conquista',
    'close': 'Fechar',
    'previous': 'Anterior',
    'next': 'Próximo',
    'morePages': 'Mais páginas',
    'goToPreviousPage': 'Ir para página anterior',
    'goToNextPage': 'Ir para próxima página',
    'toggleSidebar': 'Alternar barra lateral',
    'pagination': 'Paginação',
    'breadcrumb': 'Navegação estrutural',
    'previousSlide': 'Slide anterior',
    'nextSlide': 'Próximo slide',
    'more': 'Mais',
    
    // Missing category and filters
    'type': 'Tipo',
    'category': 'Categoria',
    'startWithDefaultCategories': 'Comece com categorias padrão',
    'deleteAllNotes': 'Excluir todas as notas?',
    'noteWithNameExists': 'Uma nota com este nome já existe',
    'suggestion': 'Sugestão',
    'listMayBeRemovedOrIncorrect': 'Esta lista pode ter sido removida ou o link está incorreto',
    'colorChangedSuccessfully': 'Cor alterada com sucesso!',
    'orChooseExisting': 'Ou escolha uma existente',
    'continueUsingApp': 'Continue usando o app para desbloquear!',
    'didntFindLooking': 'Não encontrou o que procura?',
    'welcomeBack': 'Bem-vindo de volta!',
    'changesSavedSuccessfully': 'Alterações salvas com sucesso!',
    'templateApplied': 'Template aplicado!',
    
    // Toast messages
    'listCreatedSuccessfully': 'Lista criada com sucesso!',
    'listDeletedSuccessfully': 'Lista deletada com sucesso!',
    'listUpdatedSuccessfully': 'Lista atualizada com sucesso!',
    'itemAddedSuccessfully': 'Item adicionado com sucesso!',
    'itemRemovedSuccessfully': 'Item removido com sucesso!',
    'itemUpdatedSuccessfully': 'Item atualizado com sucesso!',
    'categoryAddedSuccessfully': 'Categoria adicionada com sucesso!',
    'categoryRemovedSuccessfully': 'Categoria removida com sucesso!',
  },
  en: {
    // Auth Page
    'auth.title': 'QuickList',
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.passwordMin': 'Password (minimum 6 characters)',
    'auth.loginButton': 'Login',
    'auth.signupButton': 'Sign Up',
    'auth.loggingIn': 'Logging in...',
    'auth.creating': 'Creating...',
    'auth.welcomeBack': 'Welcome back!',
    'auth.accountCreated': 'Account created! Check your email.',
    
    // General
    'general.loading': 'Loading...',
    'general.save': 'Save',
    'general.cancel': 'Cancel',
    'general.delete': 'Delete',
    'general.edit': 'Edit',
    
    // Lists
    'addList': 'Add',
    'listCreated': 'List created successfully!',
    'listPlaceholder': 'New list name...',
    'searchLists': 'Search lists',
    'allLists': 'All Lists',
    'noResultsFound': 'No results found',
    'showArchived': 'Show Archived',
    'hideArchived': 'Hide Archived',
    'noArchivedLists': 'No archived lists',
    'listArchived': 'List archived',
    'listUnarchived': 'List unarchived',
    
    // Sticky Notes
    'Digite o título...': 'Enter title...',
    'Título (opcional)': 'Title (optional)',
    'Escreva sua nota...': 'Write your note...',
    'Título da lista': 'List title',
    'Item': 'Item',
    'Adicionar item': 'Add item',
    'Nome da categoria': 'Category name',
    'Ou escolha uma existente:': 'Or choose an existing one:',
    'Salvar': 'Save',
    'Post-it salvo com sucesso!': 'Post-it saved successfully!',
    
    // Achievements
    'achievements': 'Achievements',
    'unlocked': 'Unlocked',
    'undo': 'Undo',
    'undone': 'Undone',
    'clickToUndo': 'Click to undo',
    
    // Achievement names and descriptions
    'firstStep': 'First Step',
    'firstStepDesc': 'Complete your first task',
    'earlyBird': 'Early Bird',
    'earlyBirdDesc': 'Complete a task before 8 AM',
    'nightOwl': 'Night Owl',
    'nightOwlDesc': 'Complete a task after 10 PM',
    'taskMaster': 'Task Master',
    'taskMasterDesc': 'Complete 50 tasks',
    'productivityHero': 'Productivity Hero',
    'productivityHeroDesc': 'Complete 100 tasks',
    'legendaryAchiever': 'Legendary Achiever',
    'legendaryAchieverDesc': 'Complete 500 tasks',
    'streakStarter': 'Streak Starter',
    'streakStarterDesc': 'Complete tasks for 3 consecutive days',
    'streakMaster': 'Streak Master',
    'streakMasterDesc': 'Complete tasks for 7 consecutive days',
    'streakLegend': 'Streak Legend',
    'streakLegendDesc': 'Complete tasks for 30 consecutive days',
    'organizer': 'Organizer',
    'organizerDesc': 'Use 5 different categories',
    'categoryMaster': 'Category Master',
    'categoryMasterDesc': 'Use 10 different categories',
    'speedDemon': 'Speed Demon',
    'speedDemonDesc': 'Complete 10 tasks in one day',
    'powerUser': 'Power User',
    'powerUserDesc': 'Complete 25 tasks in one day',
    'listCreator': 'List Creator',
    'listCreatorDesc': 'Create 5 different lists',
    'listArchitect': 'List Architect',
    'listArchitectDesc': 'Create 20 different lists',
    'perfectionist': 'Perfectionist',
    'perfectionistDesc': 'Complete an entire list',
    'minimalist': 'Minimalist',
    'minimalistDesc': 'Complete a list with only 1 item',
    'maximalist': 'Maximalist',
    'maximalistDesc': 'Create a list with 50+ items',
    'weekendWarrior': 'Weekend Warrior',
    'weekendWarriorDesc': 'Complete tasks on Saturday and Sunday',

    // Productivity insights
    'totalTasksCreated': 'Total Tasks Created',
    'totalTasksCompleted': 'Tasks Completed',
    'completionRate': 'Completion Rate',
    'tasksCompletedToday': 'Tasks Completed Today',
    'thisWeek': 'This Week',
    'currentStreak': 'Current Streak',
'insights': 'Statistics',
    'productivityInsights': 'Productivity Insights',
    'days': 'days',

    // Templates
    'personalTemplate': 'Personal Tasks',
    'personalDesc': 'General personal tasks and reminders',
    'personalItems': 'Call dentist, Buy groceries, Exercise, Read book',
    'workTemplate': 'Work Projects',
    'workDesc': 'Professional tasks and project management',
    'workItems': 'Team meeting, Review documents, Send emails, Update report',
    'shoppingTemplate': 'Shopping List',
    'shoppingDesc': 'Grocery and shopping items',
    'shoppingItems': 'Milk, Bread, Fruits, Vegetables',
    'travelTemplate': 'Travel Planning',
    'travelDesc': 'Trip preparation and travel checklist',
    'travelItems': 'Book hotel, Pack clothes, Check passport, Buy tickets',
    'studyTemplate': 'Study Plan',
    'studyDesc': 'Educational goals and study tasks',
    'studyItems': 'Read chapter 1, Practice exercises, Take notes, Review material',
    'eventTemplate': 'Event Planning',
    'eventDesc': 'Event organization and preparation',
    'eventItems': 'Send invitations, Book venue, Plan menu, Prepare decorations',
    'templates': 'Templates',
    'useTemplate': 'Use Template',
    
    // Missing translations
    'noLists': 'No lists yet',
    'noListsDesc': 'Click the + to create your first list',
    'confirmDeleteList': 'Confirm Deletion',
    'confirmDeleteListDesc': 'Are you sure you want to delete this list? This action cannot be undone.',
    'deleteList': 'Delete List',
    'confirmDeleteItem': 'Confirm Deletion',
    'confirmDeleteItemDesc': 'Are you sure you want to delete this item?',
    'deleteItem': 'Delete Item',
    'itemDeleted': 'Item deleted',
    'itemRestored': 'Item restored',
    'shareList': 'Share List',
    'completed': 'Completed',
    'addItem': 'Add Item',
    'homescreen': 'Home',
    'help': 'Help',
    'cancel': 'Cancel',
    'confirm': 'Confirm',
    'listDeleted': 'List deleted',
'listRestored': 'List restored',
    'archiveList': 'Archive List',
    'unarchive': 'Unarchive',
    'createNewList': 'Create new list',
    
    // Missing navigation and interface translations
    'noItemsYet': 'No items in the list yet',
    'offline': 'Offline',
    'loadingText': 'Loading...',
    'toggleTheme': 'Toggle theme',
    'chooseColor': 'Choose color',
    'chooseListColor': 'Choose list color',
    'createNewListForm': 'Create new list',
    'newListName': 'New list name',
    'typeItem': 'Type item...',
    'tryDifferentSearch': 'Try a different search',
    'appSettings': 'App settings',
    'toolsAndStats': 'Tools and statistics',
    'mainTaskList': 'Main task list',
    'createNewListSection': 'Create new list',
    'reloadApp': 'Reload QuickList app',
    'achievementProgress': 'Achievement progress',
    'close': 'Close',
    'previous': 'Previous',
    'next': 'Next',
    'morePages': 'More pages',
    'goToPreviousPage': 'Go to previous page',
    'goToNextPage': 'Go to next page',
    'toggleSidebar': 'Toggle sidebar',
    'pagination': 'Pagination',
    'breadcrumb': 'Breadcrumb navigation',
    'previousSlide': 'Previous slide',
    'nextSlide': 'Next slide',
    'more': 'More',
    
    // Missing category and filters
    'type': 'Type',
    'category': 'Category',
    'startWithDefaultCategories': 'Start with default categories',
    'deleteAllNotes': 'Delete all notes?',
    'noteWithNameExists': 'A note with this name already exists',
    'suggestion': 'Suggestion',
    'listMayBeRemovedOrIncorrect': 'This list may have been removed or the link is incorrect',
    'colorChangedSuccessfully': 'Color changed successfully!',
    'orChooseExisting': 'Or choose an existing one',
    'continueUsingApp': 'Keep using the app to unlock!',
    'didntFindLooking': 'Didn\'t find what you\'re looking for?',
    'welcomeBack': 'Welcome back!',
    'changesSavedSuccessfully': 'Changes saved successfully!',
    'templateApplied': 'Template applied!',
    
    // Toast messages
    'listCreatedSuccessfully': 'List created successfully!',
    'listDeletedSuccessfully': 'List deleted successfully!',
    'listUpdatedSuccessfully': 'List updated successfully!',
    'itemAddedSuccessfully': 'Item added successfully!',
    'itemRemovedSuccessfully': 'Item removed successfully!',
    'itemUpdatedSuccessfully': 'Item updated successfully!',
    'categoryAddedSuccessfully': 'Category added successfully!',
    'categoryRemovedSuccessfully': 'Category removed successfully!',

    // Progress and feedback
    'progress.completed': 'Completed!',
    'progress.inProgress': 'in progress',

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

    // Enhanced Empty States
    'emptyState.lists.title': 'No lists yet',
    'emptyState.lists.description': 'Create your first list to start organizing your tasks efficiently.',
    'emptyState.lists.action': 'Create first list',
    'emptyState.notes.title': 'Empty board',
    'emptyState.notes.description': 'Add your first sticky note to capture important ideas and reminders.',
    'emptyState.notes.action': 'Create first note',
    'emptyState.achievements.title': 'Start your journey',
    'emptyState.achievements.description': 'Complete tasks and challenges to unlock achievements and track your progress.',
    'emptyState.achievements.action': 'View tasks',
    'emptyState.statistics.title': 'Data in preparation',
    'emptyState.statistics.description': 'Complete some tasks to see detailed statistics about your productivity.',
    'emptyState.statistics.action': 'Create list',

    // Navigation
    'nav.home': 'Home',
    'nav.notes': 'Notes',
    'nav.templates': 'Templates',
    'nav.statistics': 'Statistics',
    'nav.achievements': 'Achievements',
    'nav.listDetail': 'List Details',
    'nav.back': 'Back'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  useEffect(() => {
    const saved = localStorage.getItem('quicklist-language') as Language;
    if (saved && (saved === 'pt' || saved === 'en')) {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('quicklist-language', newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['pt']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}