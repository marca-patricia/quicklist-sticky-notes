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