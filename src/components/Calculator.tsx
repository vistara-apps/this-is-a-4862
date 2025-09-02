import React, { useState, useMemo } from 'react';
import { InputField } from './InputField';
import { MetricCard } from './MetricCard';
import { TradingCalculator } from '../utils/calculations';
import { TradeSetup } from '../types/trading';
import { Calculator as CalculatorIcon, TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle } from 'lucide-react';

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
              <InputField
                label="Instrument"
                value={setup.instrument}
                onChange={(value) => updateSetup('instrument', value)}
                placeholder="BTC/USD"
                className="sm:col-span-2"
              />
              
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
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7">
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
        </div>
      </div>

      {/* Risk Warning */}
      {isValidSetup && results && results.marginRequired > setup.accountBalance * 0.8 && (
        <div className="card bg-red-500/10 border-red-500/20">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-400">High Margin Risk</h3>
              <p className="text-sm text-dark-text-secondary mt-1">
                This position requires {TradingCalculator.formatPercentage((results.marginRequired / setup.accountBalance) * 100)} of your account balance as margin. 
                Consider reducing leverage or position size to manage risk.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};