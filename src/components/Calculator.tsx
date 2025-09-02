import React, { useState, useMemo, useEffect } from 'react';
import { InputField } from './InputField';
import { MetricCard } from './MetricCard';
import { MarketDataSelector } from './MarketDataSelector';
import { ScenarioManager } from './ScenarioManager';
import { ScenarioComparison } from './ScenarioComparison';
import { TradingCalculator } from '../utils/calculations';
import { TradeSetup } from '../types/trading';
import { useScenarios } from '../hooks/useScenarios';
import { useMarketData } from '../context/MarketDataContext';
import { Calculator as CalculatorIcon, TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, Save, RefreshCw } from 'lucide-react';

export const Calculator: React.FC = () => {
  const [setup, setSetup] = useState<TradeSetup>({
    accountBalance: 10000,
    riskPerTrade: 2,
    entryPrice: 50000,
    stopLossPrice: 48000,
    takeProfitPrice: 55000,
    leverage: 10,
    instrument: 'BTC/USD'
  });

  const { 
    scenarios, 
    activeScenarioId, 
    createScenario, 
    updateScenario, 
    deleteScenario, 
    setActiveScenario,
    getScenario,
    compareScenarios
  } = useScenarios();

  const { fetchPrice } = useMarketData();
  const [isComparing, setIsComparing] = useState(false);
  const [scenariosToCompare, setScenarioToCompare] = useState<string[]>([]);
  const [isRefreshingPrice, setIsRefreshingPrice] = useState(false);

  const results = useMemo(() => {
    try {
      return TradingCalculator.calculatePosition(setup);
    } catch (error) {
      return null;
    }
  }, [setup]);

  const updateSetup = (field: keyof TradeSetup, value: string) => {
    setSetup(prev => ({
      ...prev,
      [field]: field === 'instrument' ? value : parseFloat(value) || 0
    }));
  };

  const handleInstrumentChange = (value: string) => {
    updateSetup('instrument', value);
    refreshPrice(value);
  };

  const refreshPrice = async (symbol: string) => {
    setIsRefreshingPrice(true);
    try {
      // In a real implementation, this would fetch the current price from the API
      // For now, we'll just simulate a price update
      const assetId = symbol.toLowerCase().replace('/', '');
      const price = await fetchPrice(assetId);
      
      if (price) {
        setSetup(prev => ({
          ...prev,
          entryPrice: price.price
        }));
      }
    } catch (error) {
      console.error('Error fetching price:', error);
    } finally {
      setIsRefreshingPrice(false);
    }
  };

  const handleCreateScenario = (name: string, setupData: TradeSetup) => {
    createScenario(name, setupData);
  };

  const handleSelectScenario = (id: string) => {
    const scenario = getScenario(id);
    if (scenario) {
      setSetup(scenario.setup);
      setActiveScenario(id);
    }
  };

  const handleCompareScenarios = (ids: string[]) => {
    setScenarioToCompare(ids);
    setIsComparing(true);
  };

  const isValidSetup = setup.accountBalance > 0 && 
                     setup.riskPerTrade > 0 && 
                     setup.entryPrice > 0 && 
                     setup.stopLossPrice > 0 && 
                     setup.leverage > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <CalculatorIcon className="w-6 h-6 text-dark-accent" />
        <h1 className="text-2xl font-bold text-dark-text-primary">Position Calculator</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-5">
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold text-dark-text-primary mb-4">Trade Setup</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-dark-text-primary mb-1">
                  Instrument
                </label>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <MarketDataSelector
                      value={setup.instrument}
                      onChange={handleInstrumentChange}
                    />
                  </div>
                  <button
                    onClick={() => refreshPrice(setup.instrument)}
                    className="btn-secondary flex items-center space-x-1 px-3"
                    disabled={isRefreshingPrice}
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshingPrice ? 'animate-spin' : ''}`} />
                    <span className="sr-only">Refresh Price</span>
                  </button>
                </div>
              </div>
              
              <InputField
                label="Account Balance"
                value={setup.accountBalance}
                onChange={(value) => updateSetup('accountBalance', value)}
                type="number"
                prefix="$"
                placeholder="10000"
              />
              
              <InputField
                label="Risk per Trade"
                value={setup.riskPerTrade}
                onChange={(value) => updateSetup('riskPerTrade', value)}
                type="number"
                suffix="%"
                placeholder="2"
              />
              
              <InputField
                label="Entry Price"
                value={setup.entryPrice}
                onChange={(value) => updateSetup('entryPrice', value)}
                type="number"
                prefix="$"
                placeholder="50000"
              />
              
              <InputField
                label="Stop Loss"
                value={setup.stopLossPrice}
                onChange={(value) => updateSetup('stopLossPrice', value)}
                type="number"
                prefix="$"
                placeholder="48000"
              />
              
              <InputField
                label="Take Profit"
                value={setup.takeProfitPrice || ''}
                onChange={(value) => updateSetup('takeProfitPrice', value)}
                type="number"
                prefix="$"
                placeholder="55000"
              />
              
              <InputField
                label="Leverage"
                value={setup.leverage}
                onChange={(value) => updateSetup('leverage', value)}
                type="number"
                suffix="x"
                placeholder="10"
                className="sm:col-span-2"
              />
            </div>

            {results && (
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => handleCreateScenario(`${setup.instrument} Setup`, setup)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save as Scenario</span>
                </button>
              </div>
            )}
          </div>

          {/* Scenario Manager */}
          <div className="mt-6">
            <ScenarioManager
              scenarios={scenarios}
              activeScenarioId={activeScenarioId}
              currentSetup={setup}
              onCreateScenario={handleCreateScenario}
              onUpdateScenario={updateScenario}
              onDeleteScenario={deleteScenario}
              onSelectScenario={handleSelectScenario}
              onCompareScenarios={handleCompareScenarios}
            />
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7">
          <div className="space-y-6">
            {/* Scenario Comparison */}
            {isComparing && (
              <ScenarioComparison
                scenarios={scenarios.filter(s => scenariosToCompare.includes(s.id))}
                onClose={() => {
                  setIsComparing(false);
                  setScenarioToCompare([]);
                }}
              />
            )}

            {/* Calculation Results */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-dark-text-primary">Calculation Results</h2>
              
              {!isValidSetup ? (
                <div className="card">
                  <div className="flex items-center space-x-3 text-yellow-400">
                    <AlertTriangle className="w-5 h-5" />
                    <p>Please fill in all required fields to see calculations</p>
                  </div>
                </div>
              ) : results ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <MetricCard
                    title="Position Size"
                    value={TradingCalculator.formatNumber(results.positionSize, 4)}
                    subtitle={`${setup.instrument.split('/')[0]} units`}
                    icon={<TrendingUp className="w-5 h-5" />}
                  />
                  
                  <MetricCard
                    title="Margin Required"
                    value={TradingCalculator.formatCurrency(results.marginRequired)}
                    subtitle={`${TradingCalculator.formatPercentage((results.marginRequired / setup.accountBalance) * 100)} of balance`}
                    color={results.marginRequired > setup.accountBalance * 0.8 ? 'warning' : 'default'}
                    icon={<DollarSign className="w-5 h-5" />}
                  />
                  
                  <MetricCard
                    title="Risk Amount"
                    value={TradingCalculator.formatCurrency(results.riskAmount)}
                    subtitle={`${TradingCalculator.formatPercentage(results.capitalAtRisk)} of balance`}
                    color="danger"
                    icon={<AlertTriangle className="w-5 h-5" />}
                  />
                  
                  <MetricCard
                    title="Potential Loss"
                    value={TradingCalculator.formatCurrency(results.potentialLoss)}
                    subtitle="At stop loss"
                    color="danger"
                    icon={<TrendingDown className="w-5 h-5" />}
                  />
                  
                  <MetricCard
                    title="Potential Profit"
                    value={setup.takeProfitPrice ? TradingCalculator.formatCurrency(results.potentialProfit) : 'N/A'}
                    subtitle={setup.takeProfitPrice ? "At take profit" : "Set take profit"}
                    color={setup.takeProfitPrice ? 'success' : 'default'}
                    icon={<TrendingUp className="w-5 h-5" />}
                  />
                  
                  <MetricCard
                    title="Risk/Reward"
                    value={setup.takeProfitPrice ? `1:${TradingCalculator.formatNumber(results.riskRewardRatio, 2)}` : 'N/A'}
                    subtitle={setup.takeProfitPrice ? (results.riskRewardRatio >= 2 ? "Good ratio" : "Consider better R:R") : "Set take profit"}
                    color={setup.takeProfitPrice ? (results.riskRewardRatio >= 2 ? 'success' : 'warning') : 'default'}
                    icon={<Target className="w-5 h-5" />}
                  />
                </div>
              ) : (
                <div className="card">
                  <div className="flex items-center space-x-3 text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                    <p>Error in calculation. Please check your inputs.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Risk Analysis */}
            {isValidSetup && results && (
              <div className="card">
                <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Risk Analysis</h3>
                
                <div className="space-y-4">
                  {/* Risk Level Indicator */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-dark-text-secondary">Risk Level</span>
                      <span className="text-sm font-medium text-dark-text-primary">
                        {results.capitalAtRisk <= 1 ? 'Low' : results.capitalAtRisk <= 3 ? 'Moderate' : 'High'}
                      </span>
                    </div>
                    <div className="w-full bg-dark-surface rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          results.capitalAtRisk <= 1 
                            ? 'bg-green-500' 
                            : results.capitalAtRisk <= 3 
                            ? 'bg-yellow-500' 
                            : 'bg-red-500'
                        }`} 
                        style={{ width: `${Math.min(results.capitalAtRisk * 10, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Risk Warnings */}
                  {results.marginRequired > setup.accountBalance * 0.8 && (
                    <div className="flex items-start space-x-3 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                      <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-400">High Margin Risk</h4>
                        <p className="text-sm text-dark-text-secondary mt-1">
                          This position requires {TradingCalculator.formatPercentage((results.marginRequired / setup.accountBalance) * 100)} of your account balance as margin. 
                          Consider reducing leverage or position size to manage risk.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {results.capitalAtRisk > 3 && (
                    <div className="flex items-start space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-400">High Capital Risk</h4>
                        <p className="text-sm text-dark-text-secondary mt-1">
                          You're risking {TradingCalculator.formatPercentage(results.capitalAtRisk)} of your account on this trade.
                          Professional traders typically risk 1-2% per trade to ensure account longevity.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {setup.takeProfitPrice && results.riskRewardRatio < 2 && (
                    <div className="flex items-start space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-400">Low Risk/Reward Ratio</h4>
                        <p className="text-sm text-dark-text-secondary mt-1">
                          Your risk/reward ratio is 1:{TradingCalculator.formatNumber(results.riskRewardRatio, 2)}.
                          Consider adjusting your take profit or stop loss to achieve at least a 1:2 ratio.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {!setup.takeProfitPrice && (
                    <div className="flex items-start space-x-3 p-3 bg-dark-surface border border-dark-border rounded-md">
                      <Target className="w-5 h-5 text-dark-text-secondary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-dark-text-primary">No Take Profit Set</h4>
                        <p className="text-sm text-dark-text-secondary mt-1">
                          Setting a take profit level helps define your risk/reward ratio and ensures
                          you have a clear exit strategy for profitable trades.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

