import React from 'react';
import { X } from 'lucide-react';
import { Scenario } from '../types/scenario';
import { TradingCalculator } from '../utils/calculations';

interface ScenarioComparisonProps {
  scenarios: Scenario[];
  onClose: () => void;
}

export const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({
  scenarios,
  onClose,
}) => {
  if (scenarios.length < 2) {
    return null;
  }

  // Sort scenarios by risk/reward ratio (descending)
  const sortedScenarios = [...scenarios].sort((a, b) => {
    const aRatio = a.result?.riskRewardRatio || 0;
    const bRatio = b.result?.riskRewardRatio || 0;
    return bRatio - aRatio;
  });

  // Get the best scenario based on risk/reward ratio
  const bestScenario = sortedScenarios[0];

  // Metrics to compare
  const metrics = [
    { 
      name: 'Position Size', 
      getValue: (scenario: Scenario) => scenario.result?.positionSize || 0,
      format: (value: number) => TradingCalculator.formatNumber(value, 4),
      unit: 'units'
    },
    { 
      name: 'Margin Required', 
      getValue: (scenario: Scenario) => scenario.result?.marginRequired || 0,
      format: (value: number) => TradingCalculator.formatCurrency(value),
      unit: ''
    },
    { 
      name: 'Risk Amount', 
      getValue: (scenario: Scenario) => scenario.result?.riskAmount || 0,
      format: (value: number) => TradingCalculator.formatCurrency(value),
      unit: ''
    },
    { 
      name: 'Capital at Risk', 
      getValue: (scenario: Scenario) => scenario.result?.capitalAtRisk || 0,
      format: (value: number) => TradingCalculator.formatPercentage(value),
      unit: ''
    },
    { 
      name: 'Potential Profit', 
      getValue: (scenario: Scenario) => scenario.result?.potentialProfit || 0,
      format: (value: number) => TradingCalculator.formatCurrency(value),
      unit: ''
    },
    { 
      name: 'Potential Loss', 
      getValue: (scenario: Scenario) => scenario.result?.potentialLoss || 0,
      format: (value: number) => TradingCalculator.formatCurrency(value),
      unit: ''
    },
    { 
      name: 'Risk/Reward Ratio', 
      getValue: (scenario: Scenario) => scenario.result?.riskRewardRatio || 0,
      format: (value: number) => `1:${TradingCalculator.formatNumber(value, 2)}`,
      unit: ''
    },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-dark-text-primary">Scenario Comparison</h3>
        
        <button
          onClick={onClose}
          className="p-1 text-dark-text-secondary hover:text-dark-text-primary"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="py-2 px-4 text-left text-dark-text-secondary font-medium">Metric</th>
              {sortedScenarios.map((scenario) => (
                <th 
                  key={scenario.id} 
                  className={`py-2 px-4 text-left font-medium ${
                    scenario.id === bestScenario.id ? 'text-dark-accent' : 'text-dark-text-primary'
                  }`}
                >
                  {scenario.name}
                  {scenario.id === bestScenario.id && (
                    <span className="ml-1 text-xs text-dark-accent">(Best)</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-dark-border">
              <td className="py-2 px-4 text-dark-text-secondary">Instrument</td>
              {sortedScenarios.map((scenario) => (
                <td key={scenario.id} className="py-2 px-4 text-dark-text-primary">
                  {scenario.setup.instrument}
                </td>
              ))}
            </tr>
            
            <tr className="border-b border-dark-border">
              <td className="py-2 px-4 text-dark-text-secondary">Entry Price</td>
              {sortedScenarios.map((scenario) => (
                <td key={scenario.id} className="py-2 px-4 text-dark-text-primary">
                  {TradingCalculator.formatCurrency(scenario.setup.entryPrice)}
                </td>
              ))}
            </tr>
            
            <tr className="border-b border-dark-border">
              <td className="py-2 px-4 text-dark-text-secondary">Stop Loss</td>
              {sortedScenarios.map((scenario) => (
                <td key={scenario.id} className="py-2 px-4 text-dark-text-primary">
                  {TradingCalculator.formatCurrency(scenario.setup.stopLossPrice)}
                </td>
              ))}
            </tr>
            
            <tr className="border-b border-dark-border">
              <td className="py-2 px-4 text-dark-text-secondary">Take Profit</td>
              {sortedScenarios.map((scenario) => (
                <td key={scenario.id} className="py-2 px-4 text-dark-text-primary">
                  {scenario.setup.takeProfitPrice
                    ? TradingCalculator.formatCurrency(scenario.setup.takeProfitPrice)
                    : 'N/A'}
                </td>
              ))}
            </tr>
            
            <tr className="border-b border-dark-border">
              <td className="py-2 px-4 text-dark-text-secondary">Leverage</td>
              {sortedScenarios.map((scenario) => (
                <td key={scenario.id} className="py-2 px-4 text-dark-text-primary">
                  {scenario.setup.leverage}x
                </td>
              ))}
            </tr>
            
            {metrics.map((metric) => (
              <tr key={metric.name} className="border-b border-dark-border">
                <td className="py-2 px-4 text-dark-text-secondary">{metric.name}</td>
                {sortedScenarios.map((scenario) => {
                  const value = metric.getValue(scenario);
                  const isBest = 
                    (metric.name === 'Risk/Reward Ratio' && scenario.id === bestScenario.id) ||
                    (metric.name === 'Potential Profit' && value === Math.max(...sortedScenarios.map(s => metric.getValue(s)))) ||
                    (metric.name === 'Risk Amount' && value === Math.min(...sortedScenarios.map(s => metric.getValue(s))));
                  
                  return (
                    <td 
                      key={scenario.id} 
                      className={`py-2 px-4 ${
                        isBest ? 'text-dark-accent font-medium' : 'text-dark-text-primary'
                      }`}
                    >
                      {value ? `${metric.format(value)}${metric.unit ? ' ' + metric.unit : ''}` : 'N/A'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-dark-surface rounded-md text-dark-text-secondary text-sm">
        <p>
          <span className="font-medium text-dark-accent">Analysis:</span>{' '}
          Based on risk/reward ratio, {bestScenario.name} appears to be the optimal scenario.
          {bestScenario.result && bestScenario.result.riskRewardRatio > 2
            ? ' It offers a favorable risk/reward profile above the recommended 1:2 minimum ratio.'
            : ' However, consider adjusting your take profit or stop loss to achieve a better risk/reward ratio (aim for at least 1:2).'}
        </p>
      </div>
    </div>
  );
};

