import React, { useState } from 'react';
import { Plus, Trash2, Edit, Copy, BarChart3 } from 'lucide-react';
import { Scenario } from '../types/scenario';
import { TradeSetup } from '../types/trading';
import { TradingCalculator } from '../utils/calculations';

interface ScenarioManagerProps {
  scenarios: Scenario[];
  activeScenarioId: string | null;
  currentSetup: TradeSetup;
  onCreateScenario: (name: string, setup: TradeSetup) => void;
  onUpdateScenario: (id: string, updates: Partial<Scenario>) => void;
  onDeleteScenario: (id: string) => void;
  onSelectScenario: (id: string) => void;
  onCompareScenarios: (ids: string[]) => void;
}

export const ScenarioManager: React.FC<ScenarioManagerProps> = ({
  scenarios,
  activeScenarioId,
  currentSetup,
  onCreateScenario,
  onUpdateScenario,
  onDeleteScenario,
  onSelectScenario,
  onCompareScenarios,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [scenarioName, setScenarioName] = useState('');
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  // Handle creating a new scenario
  const handleCreateScenario = () => {
    if (!scenarioName.trim()) return;
    
    onCreateScenario(scenarioName, currentSetup);
    setScenarioName('');
    setIsCreating(false);
  };

  // Handle updating a scenario
  const handleUpdateScenario = (id: string) => {
    if (!scenarioName.trim()) return;
    
    onUpdateScenario(id, { name: scenarioName });
    setScenarioName('');
    setIsEditing(null);
  };

  // Handle selecting a scenario for comparison
  const handleSelectForComparison = (id: string) => {
    setSelectedScenarios(prev => {
      if (prev.includes(id)) {
        return prev.filter(scenarioId => scenarioId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle comparing selected scenarios
  const handleCompareScenarios = () => {
    if (selectedScenarios.length < 2) return;
    
    onCompareScenarios(selectedScenarios);
    setIsComparing(false);
    setSelectedScenarios([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-text-primary">Scenarios</h3>
        
        <div className="flex space-x-2">
          {isComparing ? (
            <>
              <button
                onClick={handleCompareScenarios}
                disabled={selectedScenarios.length < 2}
                className={`btn-primary text-sm py-1 px-3 ${
                  selectedScenarios.length < 2 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Compare ({selectedScenarios.length})
              </button>
              
              <button
                onClick={() => {
                  setIsComparing(false);
                  setSelectedScenarios([]);
                }}
                className="btn-secondary text-sm py-1 px-3"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              {scenarios.length > 1 && (
                <button
                  onClick={() => setIsComparing(true)}
                  className="btn-secondary text-sm py-1 px-3 flex items-center space-x-1"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Compare</span>
                </button>
              )}
              
              <button
                onClick={() => setIsCreating(true)}
                className="btn-primary text-sm py-1 px-3 flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>New</span>
              </button>
            </>
          )}
        </div>
      </div>

      {isCreating && (
        <div className="card p-4">
          <div className="space-y-3">
            <div>
              <label htmlFor="scenario-name" className="block text-sm font-medium text-dark-text-primary mb-1">
                Scenario Name
              </label>
              <input
                id="scenario-name"
                type="text"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                placeholder="e.g., Conservative BTC Long"
                className="input-field"
                autoFocus
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsCreating(false);
                  setScenarioName('');
                }}
                className="btn-secondary text-sm py-1 px-3"
              >
                Cancel
              </button>
              
              <button
                onClick={handleCreateScenario}
                disabled={!scenarioName.trim()}
                className={`btn-primary text-sm py-1 px-3 ${
                  !scenarioName.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Save Scenario
              </button>
            </div>
          </div>
        </div>
      )}

      {scenarios.length === 0 ? (
        <div className="card p-4 text-center text-dark-text-secondary">
          <p>No scenarios yet. Create one to compare different trade setups.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`card p-4 ${
                activeScenarioId === scenario.id ? 'border-dark-accent' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {isEditing === scenario.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={scenarioName}
                        onChange={(e) => setScenarioName(e.target.value)}
                        className="input-field"
                        autoFocus
                      />
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setIsEditing(null);
                            setScenarioName('');
                          }}
                          className="btn-secondary text-xs py-1 px-2"
                        >
                          Cancel
                        </button>
                        
                        <button
                          onClick={() => handleUpdateScenario(scenario.id)}
                          disabled={!scenarioName.trim()}
                          className={`btn-primary text-xs py-1 px-2 ${
                            !scenarioName.trim() ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h4 className="font-medium text-dark-text-primary">{scenario.name}</h4>
                      
                      <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <div className="text-dark-text-secondary">Instrument:</div>
                        <div className="text-dark-text-primary font-medium">{scenario.setup.instrument}</div>
                        
                        <div className="text-dark-text-secondary">Position Size:</div>
                        <div className="text-dark-text-primary font-medium">
                          {scenario.result
                            ? TradingCalculator.formatNumber(scenario.result.positionSize, 4)
                            : 'N/A'}
                        </div>
                        
                        <div className="text-dark-text-secondary">Risk/Reward:</div>
                        <div className="text-dark-text-primary font-medium">
                          {scenario.result && scenario.setup.takeProfitPrice
                            ? `1:${TradingCalculator.formatNumber(scenario.result.riskRewardRatio, 2)}`
                            : 'N/A'}
                        </div>
                        
                        <div className="text-dark-text-secondary">Risk Amount:</div>
                        <div className="text-dark-text-primary font-medium">
                          {scenario.result
                            ? TradingCalculator.formatCurrency(scenario.result.riskAmount)
                            : 'N/A'}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex space-x-1 ml-4">
                  {isComparing ? (
                    <div className="flex items-center justify-center w-6 h-6">
                      <input
                        type="checkbox"
                        checked={selectedScenarios.includes(scenario.id)}
                        onChange={() => handleSelectForComparison(scenario.id)}
                        className="w-4 h-4 rounded border-dark-border text-dark-accent focus:ring-dark-accent"
                      />
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => onSelectScenario(scenario.id)}
                        className="p-1 text-dark-text-secondary hover:text-dark-text-primary"
                        title="Load scenario"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => {
                          setIsEditing(scenario.id);
                          setScenarioName(scenario.name);
                        }}
                        className="p-1 text-dark-text-secondary hover:text-dark-text-primary"
                        title="Edit name"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => onDeleteScenario(scenario.id)}
                        className="p-1 text-dark-text-secondary hover:text-red-400"
                        title="Delete scenario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

