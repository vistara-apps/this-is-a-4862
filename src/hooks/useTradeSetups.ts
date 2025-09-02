import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { TradeSetup, CalculationResult } from '../types/trading';
import { TradingCalculator } from '../utils/calculations';
import { 
  saveTradeSetup, 
  getTradeSetups, 
  getTradeSetup, 
  updateTradeSetup, 
  deleteTradeSetup,
  saveCalculationResult
} from '../lib/supabase';

interface UseTradeSetupsReturn {
  setups: TradeSetup[];
  savedResults: Record<string, CalculationResult>;
  loading: boolean;
  error: Error | null;
  saveSetup: (setup: TradeSetup) => Promise<string | null>;
  loadSetup: (setupId: string) => Promise<TradeSetup | null>;
  updateSetup: (setupId: string, updates: Partial<TradeSetup>) => Promise<boolean>;
  deleteSetup: (setupId: string) => Promise<boolean>;
  saveResult: (setupId: string, result: CalculationResult) => Promise<boolean>;
}

export const useTradeSetups = (): UseTradeSetupsReturn => {
  const { user } = useAuth();
  const [setups, setSetups] = useState<TradeSetup[]>([]);
  const [savedResults, setSavedResults] = useState<Record<string, CalculationResult>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch user's saved trade setups
  useEffect(() => {
    const fetchSetups = async () => {
      if (!user) {
        setSetups([]);
        setSavedResults({});
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await getTradeSetups(user.id);
        
        if (error) throw error;
        
        setSetups(data as TradeSetup[]);
        
        // Fetch calculation results for each setup
        const results: Record<string, CalculationResult> = {};
        
        for (const setup of data as TradeSetup[]) {
          try {
            const result = TradingCalculator.calculatePosition(setup);
            results[setup.id] = result;
          } catch (err) {
            console.error(`Error calculating result for setup ${setup.id}:`, err);
          }
        }
        
        setSavedResults(results);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching trade setups:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSetups();
  }, [user]);

  // Save a trade setup
  const saveSetup = useCallback(async (setup: TradeSetup): Promise<string | null> => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await saveTradeSetup(user.id, setup);
      
      if (error) throw error;
      
      const savedSetup = data[0] as TradeSetup;
      setSetups(prev => [...prev, savedSetup]);
      
      // Calculate and save the result
      try {
        const result = TradingCalculator.calculatePosition(setup);
        await saveCalculationResult(savedSetup.id, result);
        setSavedResults(prev => ({ ...prev, [savedSetup.id]: result }));
      } catch (err) {
        console.error(`Error calculating result for new setup:`, err);
      }
      
      return savedSetup.id;
    } catch (err) {
      setError(err as Error);
      console.error('Error saving trade setup:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load a trade setup
  const loadSetup = useCallback(async (setupId: string): Promise<TradeSetup | null> => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await getTradeSetup(setupId);
      
      if (error) throw error;
      
      return data as TradeSetup;
    } catch (err) {
      setError(err as Error);
      console.error('Error loading trade setup:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Update a trade setup
  const updateSetup = useCallback(async (setupId: string, updates: Partial<TradeSetup>): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await updateTradeSetup(setupId, updates);
      
      if (error) throw error;
      
      const updatedSetup = data[0] as TradeSetup;
      setSetups(prev => prev.map(setup => setup.id === setupId ? updatedSetup : setup));
      
      // Recalculate and save the result
      try {
        const result = TradingCalculator.calculatePosition(updatedSetup);
        await saveCalculationResult(setupId, result);
        setSavedResults(prev => ({ ...prev, [setupId]: result }));
      } catch (err) {
        console.error(`Error calculating result for updated setup:`, err);
      }
      
      return true;
    } catch (err) {
      setError(err as Error);
      console.error('Error updating trade setup:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Delete a trade setup
  const deleteSetup = useCallback(async (setupId: string): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    try {
      const { error } = await deleteTradeSetup(setupId);
      
      if (error) throw error;
      
      setSetups(prev => prev.filter(setup => setup.id !== setupId));
      setSavedResults(prev => {
        const newResults = { ...prev };
        delete newResults[setupId];
        return newResults;
      });
      
      return true;
    } catch (err) {
      setError(err as Error);
      console.error('Error deleting trade setup:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Save a calculation result
  const saveResult = useCallback(async (setupId: string, result: CalculationResult): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await saveCalculationResult(setupId, result);
      
      if (error) throw error;
      
      setSavedResults(prev => ({ ...prev, [setupId]: result }));
      return true;
    } catch (err) {
      console.error('Error saving calculation result:', err);
      return false;
    }
  }, [user]);

  return {
    setups,
    savedResults,
    loading,
    error,
    saveSetup,
    loadSetup,
    updateSetup,
    deleteSetup,
    saveResult,
  };
};

