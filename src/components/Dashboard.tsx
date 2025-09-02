import React from 'react';
import { MetricCard } from './MetricCard';
import { TrendingUp, TrendingDown, DollarSign, Target, BarChart3, PieChart } from 'lucide-react';

export const Dashboard: React.FC = () => {
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
          value="$10,000.00"
          subtitle="+2.5% this week"
          color="success"
          icon={<DollarSign className="w-5 h-5" />}
        />
        
        <MetricCard
          title="Available Margin"
          value="$8,500.00"
          subtitle="85% available"
          icon={<BarChart3 className="w-5 h-5" />}
        />
        
        <MetricCard
          title="Daily P&L"
          value="+$125.50"
          subtitle="+1.25%"
          color="success"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        
        <MetricCard
          title="Win Rate"
          value="68%"
          subtitle="Last 30 trades"
          color="success"
          icon={<Target className="w-5 h-5" />}
        />
      </div>

      {/* Recent Calculations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-dark-text-primary mb-4">Recent Calculations</h2>
          <div className="space-y-3">
            {[
              { instrument: 'BTC/USD', positionSize: '0.025', margin: '$1,250', risk: '2%', time: '5 min ago' },
              { instrument: 'ETH/USD', positionSize: '1.5', margin: '$750', risk: '1.5%', time: '1 hour ago' },
              { instrument: 'EUR/USD', positionSize: '10000', margin: '$1,000', risk: '2%', time: '2 hours ago' },
            ].map((calc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-dark-surface rounded-lg border border-dark-border">
                <div>
                  <p className="font-medium text-dark-text-primary">{calc.instrument}</p>
                  <p className="text-sm text-dark-text-secondary">Size: {calc.positionSize} | Risk: {calc.risk}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-dark-text-primary">{calc.margin}</p>
                  <p className="text-xs text-dark-text-secondary">{calc.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-dark-text-primary mb-4">Risk Distribution</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-dark-text-secondary">Crypto</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-dark-surface rounded-full h-2">
                  <div className="bg-dark-accent h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-sm text-dark-text-primary w-12">60%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark-text-secondary">Forex</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-dark-surface rounded-full h-2">
                  <div className="bg-dark-purple h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <span className="text-sm text-dark-text-primary w-12">30%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark-text-secondary">Commodities</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-dark-surface rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
                <span className="text-sm text-dark-text-primary w-12">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};