import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// These would typically be environment variables in a production app
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper functions for common Supabase operations

// User authentication
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
};

// Trade setups
export const saveTradeSetup = async (userId: string, setup: any) => {
  const { data, error } = await supabase
    .from('trade_setups')
    .insert([{ ...setup, user_id: userId }])
    .select();
  return { data, error };
};

export const getTradeSetups = async (userId: string) => {
  const { data, error } = await supabase
    .from('trade_setups')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getTradeSetup = async (setupId: string) => {
  const { data, error } = await supabase
    .from('trade_setups')
    .select('*')
    .eq('id', setupId)
    .single();
  return { data, error };
};

export const updateTradeSetup = async (setupId: string, updates: any) => {
  const { data, error } = await supabase
    .from('trade_setups')
    .update(updates)
    .eq('id', setupId)
    .select();
  return { data, error };
};

export const deleteTradeSetup = async (setupId: string) => {
  const { error } = await supabase
    .from('trade_setups')
    .delete()
    .eq('id', setupId);
  return { error };
};

// Calculation results
export const saveCalculationResult = async (setupId: string, result: any) => {
  const { data, error } = await supabase
    .from('calculation_results')
    .insert([{ ...result, trade_setup_id: setupId }])
    .select();
  return { data, error };
};

export const getCalculationResults = async (setupId: string) => {
  const { data, error } = await supabase
    .from('calculation_results')
    .select('*')
    .eq('trade_setup_id', setupId)
    .order('created_at', { ascending: false });
  return { data, error };
};

// Subscription management
export const getUserSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
};

export const updateUserSubscription = async (userId: string, subscription: any) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .upsert({ user_id: userId, ...subscription })
    .select();
  return { data, error };
};

