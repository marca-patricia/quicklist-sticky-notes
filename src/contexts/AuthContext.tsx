
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';

// Lazy import do supabase para evitar problemas de inicialização
let supabase: any = null;

const getSupabase = async () => {
  if (!supabase && typeof window !== 'undefined') {
    try {
      const { supabase: sb } = await import('@/integrations/supabase/client');
      supabase = sb;
    } catch (error) {
      console.warn('Supabase not available:', error);
    }
  }
  return supabase;
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Evitar execução durante SSR
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    let mounted = true;
    let subscription: any = null;

    const initAuth = async () => {
      try {
        const sb = await getSupabase();
        if (!sb || !mounted) {
          if (mounted) {
            setLoading(false);
            setInitialized(true);
          }
          return;
        }

        // Set up auth state listener
        const { data: { subscription: authSubscription } } = sb.auth.onAuthStateChange(
          (event: string, session: Session | null) => {
            if (mounted) {
              setSession(session);
              setUser(session?.user ?? null);
              if (!initialized) {
                setLoading(false);
                setInitialized(true);
              }
            }
          }
        );

        subscription = authSubscription;

        // Check for existing session
        const { data: { session: currentSession } } = await sb.auth.getSession();
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);
          setInitialized(true);
        }
      } catch (error) {
        console.warn('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    // Delay initialization to avoid dispatcher issues
    const timer = setTimeout(initAuth, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const sb = await getSupabase();
      if (!sb) {
        return { error: new Error('Authentication not available') };
      }

      const redirectUrl = `${window.location.origin}/`;
      const { error } = await sb.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const sb = await getSupabase();
      if (!sb) {
        return { error: new Error('Authentication not available') };
      }

      const { error } = await sb.auth.signInWithPassword({
        email,
        password
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const sb = await getSupabase();
      if (sb) {
        await sb.auth.signOut();
      }
    } catch (error) {
      console.warn('Sign out error:', error);
    }
  };

  // Show loading state until initialized
  if (!initialized) {
    return (
      <AuthContext.Provider value={{
        user: null,
        session: null,
        signUp,
        signIn,
        signOut,
        loading: true
      }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      signUp,
      signIn,
      signOut,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
