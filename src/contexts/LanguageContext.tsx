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