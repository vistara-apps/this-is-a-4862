import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Scenario } from '../types/scenario';
import { TradeSetup, CalculationResult } from '../types/trading';
import { TradingCalculator } from '../utils/calculations';

export const useScenarios = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Create a new scenario
  const createScenario = useCallback((name: string, setup: TradeSetup): Scenario => {
    try {
      const result = TradingCalculator.calculatePosition(setup);
      
      const newScenario: Scenario = {
        id: uuidv4(),
        name,
        setup,
        result,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setScenarios(prev => [...prev, newScenario]);
      return newScenario;
    } catch (err) {
      const newScenario: Scenario = {
        id: uuidv4(),
        name,
        setup,
        result: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setScenarios(prev => [...prev, newScenario]);
      return newScenario;
    }
  }, []);

  // Update an existing scenario
  const updateScenario = useCallback((id: string, updates: Partial<Scenario>): Scenario => {
    setScenarios(prev => {
      const index = prev.findIndex(scenario => scenario.id === id);
      
      if (index === -1) {
        throw new Error(`Scenario with id ${id} not found`);
      }
      
      const updatedScenario = {
        ...prev[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      // If setup was updated, recalculate the result
      if (updates.setup) {
        try {
          updatedScenario.result = TradingCalculator.calculatePosition(updatedScenario.setup);
        } catch (err) {
          updatedScenario.result = null;
        }
      }
      
      const newScenarios = [...prev];
      newScenarios[index] = updatedScenario;
      
      return newScenarios;
    });
    
    return getScenario(id)!;
  }, []);

  // Delete a scenario
  const deleteScenario = useCallback((id: string): void => {
    setScenarios(prev => prev.filter(scenario => scenario.id !== id));
    
    if (activeScenarioId === id) {
      setActiveScenarioId(null);
    }
  }, [activeScenarioId]);

  // Get a scenario by id
  const getScenario = useCallback((id: string): Scenario | undefined => {
    return scenarios.find(scenario => scenario.id === id);
  }, [scenarios]);

  // Compare multiple scenarios
  const compareScenarios = useCallback((ids: string[]): Scenario[] => {
    return scenarios.filter(scenario => ids.includes(scenario.id));
  }, [scenarios]);

  return {
    scenarios,
    activeScenarioId,
    loading,
    error,
    createScenario,
    updateScenario,
    deleteScenario,
    setActiveScenario: setActiveScenarioId,
    getScenario,
    compareScenarios,
  };
};

