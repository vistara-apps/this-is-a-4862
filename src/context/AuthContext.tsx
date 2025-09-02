import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase, signUp as supabaseSignUp, signIn as supabaseSignIn, signOut as supabaseSignOut, getCurrentUser } from '../lib/supabase';
import { AuthContextType, AuthState, AuthUser } from '../types/auth';

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial auth state
const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  error: null,
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user data
          const { data: { user }, error } = await getCurrentUser();
          
          if (error) throw error;
          
          setState({
            user: user as AuthUser,
            session,
            loading: false,
            error: null,
          });
        } else {
          setState({
            ...initialState,
            loading: false,
          });
        }
      } catch (error) {
        setState({
          ...initialState,
          loading: false,
          error: error as Error,
        });
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { data: { user }, error } = await getCurrentUser();
          
          if (error) {
            setState({
              ...state,
              error: error as Error,
            });
            return;
          }
          
          setState({
            user: user as AuthUser,
            session,
            loading: false,
            error: null,
          });
        } else if (event === 'SIGNED_OUT') {
          setState({
            ...initialState,
            loading: false,
          });
        }
      }
    );

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign up function
  const signUp = async (email: string, password: string) => {
    setState({ ...state, loading: true });
    const { data, error } = await supabaseSignUp(email, password);
    
    if (error) {
      setState({ ...state, error: error as Error, loading: false });
      return { data, error };
    }
    
    return { data, error: null };
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setState({ ...state, loading: true });
    const { data, error } = await supabaseSignIn(email, password);
    
    if (error) {
      setState({ ...state, error: error as Error, loading: false });
      return { data, error };
    }
    
    return { data, error: null };
  };

  // Sign out function
  const signOut = async () => {
    setState({ ...state, loading: true });
    const { error } = await supabaseSignOut();
    
    if (error) {
      setState({ ...state, error: error as Error, loading: false });
      return { error };
    }
    
    setState({ ...initialState, loading: false });
    return { error: null };
  };

  // Update profile function
  const updateProfile = async (updates: Partial<AuthUser>) => {
    setState({ ...state, loading: true });
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', state.user?.id || '')
      .select()
      .single();
    
    if (error) {
      setState({ ...state, error: error as Error, loading: false });
      return { data, error };
    }
    
    setState({
      ...state,
      user: { ...state.user, ...updates } as AuthUser,
      loading: false,
    });
    
    return { data, error: null };
  };

  // Auth context value
  const value = {
    ...state,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

