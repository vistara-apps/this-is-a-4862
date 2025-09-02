import { User } from '@supabase/supabase-js';

export interface AuthUser extends User {
  subscription_tier?: 'free' | 'pro' | 'premium';
}

export interface AuthState {
  user: AuthUser | null;
  session: any | null;
  loading: boolean;
  error: Error | null;
}

export interface AuthContextType extends AuthState {
  signUp: (email: string, password: string) => Promise<{ data: any; error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ data: any; error: Error | null }>;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

