import React from 'react';
import { Portfolio } from '../../types/trading';
import { TradingCalculator } from '../../utils/calculations';

interface PortfolioChartProps {
  portfolio: Portfolio;
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ portfolio }) => {
  const { totalBalance, availableMargin, usedMargin, equity, pnl } = portfolio;
  
  // Calculate margin usage percentage
  const marginUsagePercent = (usedMargin / totalBalance) * 100;
  
  // Calculate PnL percentage
  const pnlPercent = (pnl / totalBalance) * 100;

  return (
    <div className="space-y-6">
      {/* Balance and Equity */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm text-dark-text-secondary mb-1">Total Balance</h4>
          <p className="text-2xl font-bold text-dark-text-primary">
            {TradingCalculator.formatCurrency(totalBalance)}
          </p>
        </div>
        
        <div>
          <h4 className="text-sm text-dark-text-secondary mb-1">Equity</h4>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-dark-text-primary">
              {TradingCalculator.formatCurrency(equity)}
            </p>
            <span className={`text-sm ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {pnl >= 0 ? '+' : ''}{TradingCalculator.formatCurrency(pnl)} ({pnlPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Margin Usage */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm text-dark-text-secondary">Margin Usage</h4>
          <span className="text-sm text-dark-text-primary">
            {marginUsagePercent.toFixed(1)}%
          </span>
        </div>
        
        <div className="w-full bg-dark-surface rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              marginUsagePercent < 50 
                ? 'bg-green-500' 
                : marginUsagePercent < 80 
                ? 'bg-yellow-500' 
                : 'bg-red-500'
            }`} 
            style={{ width: `${Math.min(marginUsagePercent, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between mt-1 text-xs text-dark-text-secondary">
          <span>Used: {TradingCalculator.formatCurrency(usedMargin)}</span>
          <span>Available: {TradingCalculator.formatCurrency(availableMargin)}</span>
        </div>
      </div>
    </div>
  );
};

