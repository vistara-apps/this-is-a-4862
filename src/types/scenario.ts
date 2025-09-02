import { TradeSetup, CalculationResult } from './trading';

export interface Scenario {
  id: string;
  name: string;
  setup: TradeSetup;
  result: CalculationResult | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScenarioState {
  scenarios: Scenario[];
  activeScenarioId: string | null;
  loading: boolean;
  error: Error | null;
}

export interface ScenarioContextType extends ScenarioState {
  createScenario: (name: string, setup: TradeSetup) => Scenario;
  updateScenario: (id: string, updates: Partial<Scenario>) => Scenario;
  deleteScenario: (id: string) => void;
  setActiveScenario: (id: string | null) => void;
  getScenario: (id: string) => Scenario | undefined;
  compareScenarios: (ids: string[]) => Scenario[];
}

