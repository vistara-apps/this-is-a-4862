import React, { useState } from 'react';
import { MetricCard } from './MetricCard';
import { SavedSetups } from './SavedSetups';
import { SetupHistory } from './SetupHistory';
import { PortfolioChart } from './charts/PortfolioChart';
import { RiskDistributionChart } from './charts/RiskDistributionChart';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { useTradeSetups } from '../hooks/useTradeSetups';
import { TradingCalculator } from '../utils/calculations';
import { TradeSetup } from '../types/trading';
import { TrendingUp, TrendingDown, DollarSign, Target, BarChart3, PieChart, Clock, AlertTriangle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { portfolio, loading: portfolioLoading, riskDistribution, winRate, averageRisk, averageRiskReward } = usePortfolioData();
  const { setups, loading: setupsLoading } = useTradeSetups();
  const [activeTab, setActiveTab] = useState<'saved' | 'history'>('saved');

  const handleLoadSetup = (setup: TradeSetup) => {
    // This would typically navigate to the calculator with the selected setup
    console.log('Load setup:', setup);
  };

  const isLoading = portfolioLoading || setupsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dark-text-primary">Trading Dashboard</h1>
        <p className="text-dark-text-secondary">Overview of your trading performance and risk metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Balance"
          value={TradingCalculator.formatCurrency(portfolio.totalBalance)}
          subtitle={portfolio.pnl >= 0 ? `+${TradingCalculator.formatPercentage((portfolio.pnl / portfolio.totalBalance) * 100)} this week` : `${TradingCalculator.formatPercentage((portfolio.pnl / portfolio.totalBalance) * 100)} this week`}
          color={portfolio.pnl >= 0 ? 'success' : 'danger'}
          icon={<DollarSign className="w-5 h-5" />}
        />
        
        <MetricCard
          title="Available Margin"
          value={TradingCalculator.formatCurrency(portfolio.availableMargin)}
          subtitle={`${TradingCalculator.formatPercentage((portfolio.availableMargin / portfolio.totalBalance) * 100)} available`}
          icon={<BarChart3 className="w-5 h-5" />}
        />
        
        <MetricCard
          title="Win Rate"
          value={`${Math.round(winRate)}%`}
          subtitle="Last 30 trades"
          color={winRate >= 50 ? 'success' : 'warning'}
          icon={<Target className="w-5 h-5" />}
        />
        
        <MetricCard
          title="Avg Risk/Reward"
          value={`1:${TradingCalculator.formatNumber(averageRiskReward, 2)}`}
          subtitle={`Avg risk: ${TradingCalculator.formatPercentage(averageRisk)}`}
          color={averageRiskReward >= 2 ? 'success' : 'warning'}
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Portfolio and Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-dark-text-primary mb-4">Portfolio Overview</h2>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-dark-surface rounded"></div>
              <div className="h-6 bg-dark-surface rounded"></div>
            </div>
          ) : (
            <PortfolioChart portfolio={portfolio} />
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-dark-text-primary mb-4">Risk Distribution</h2>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 bg-dark-surface rounded w-20"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-dark-surface rounded-full h-2"></div>
                    <div className="h-4 bg-dark-surface rounded w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <RiskDistributionChart distribution={riskDistribution} />
          )}
        </div>
      </div>

      {/* Trade Setups Tabs */}
      <div className="card">
        <div className="border-b border-dark-border mb-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-4 py-2 font-medium text-sm border-b-2 ${
                activeTab === 'saved'
                  ? 'border-dark-accent text-dark-accent'
                  : 'border-transparent text-dark-text-secondary hover:text-dark-text-primary'
              }`}
            >
              Saved Setups
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 font-medium text-sm border-b-2 ${
                activeTab === 'history'
                  ? 'border-dark-accent text-dark-accent'
                  : 'border-transparent text-dark-text-secondary hover:text-dark-text-primary'
              }`}
            >
              Setup History
            </button>
          </div>
        </div>
        
        {activeTab === 'saved' ? (
          <SavedSetups onLoadSetup={handleLoadSetup} />
        ) : (
          <SetupHistory onLoadSetup={handleLoadSetup} />
        )}
      </div>

      {/* Risk Warnings */}
      {portfolio.usedMargin > portfolio.totalBalance * 0.7 && (
        <div className="card bg-yellow-500/10 border-yellow-500/20">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-400">High Margin Usage</h3>
              <p className="text-sm text-dark-text-secondary mt-1">
                Your current margin usage is {TradingCalculator.formatPercentage((portfolio.usedMargin / portfolio.totalBalance) * 100)} of your total balance.
                Consider reducing your position sizes or closing some positions to lower your risk.
              </p>
            </div>
          </div>
        </div>
      )}

      {averageRisk > 3 && (
        <div className="card bg-yellow-500/10 border-yellow-500/20">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-400">High Average Risk</h3>
              <p className="text-sm text-dark-text-secondary mt-1">
                Your average risk per trade is {TradingCalculator.formatPercentage(averageRisk)}.
                Professional traders typically risk 1-2% per trade to ensure account longevity.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

