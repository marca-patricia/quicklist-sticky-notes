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