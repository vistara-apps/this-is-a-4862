import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { TradeSetup } from '../types/trading';
import { TradingCalculator } from '../utils/calculations';
import { useTradeSetups } from '../hooks/useTradeSetups';

interface SetupHistoryProps {
  onLoadSetup: (setup: TradeSetup) => void;
}

export const SetupHistory: React.FC<SetupHistoryProps> = ({ onLoadSetup }) => {
  const { setups, savedResults, loading } = useTradeSetups();
  const [filter, setFilter] = useState<'all' | 'profitable' | 'unprofitable'>('all');
  const [timeRange, setTimeRange] = useState<'all' | 'week' | 'month'>('all');

  // Filter setups based on current filter settings
  const filteredSetups = setups.filter(setup => {
    // Time range filter
    if (timeRange !== 'all') {
      const setupDate = new Date(setup.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - setupDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (timeRange === 'week' && diffDays > 7) return false;
      if (timeRange === 'month' && diffDays > 30) return false;
    }
    
    // Profitability filter
    if (filter !== 'all') {
      const result = savedResults[setup.id];
      if (!result || !setup.take_profit_price) return false;
      
      const isProfitable = result.risk_reward_ratio >= 1;
      if (filter === 'profitable' && !isProfitable) return false;
      if (filter === 'unprofitable' && isProfitable) return false;
    }
    
    return true;
  });

  // Sort setups by date (newest first)
  const sortedSetups = [...filteredSetups].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Group setups by date
  const groupedSetups: Record<string, TradeSetup[]> = {};
  
  sortedSetups.forEach(setup => {
    const date = new Date(setup.created_at).toLocaleDateString();
    if (!groupedSetups[date]) {
      groupedSetups[date] = [];
    }
    groupedSetups[date].push(setup);
  });

  if (loading) {
    return (
      <div className="card p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-dark-surface rounded w-1/3"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-dark-surface rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (setups.length === 0) {
    return (
      <div className="card p-6 text-center">
        <Clock className="w-12 h-12 text-dark-text-secondary mx-auto mb-3" />
        <h3 className="text-lg font-medium text-dark-text-primary">No Setup History</h3>
        <p className="text-dark-text-secondary mt-1">
          Your trade setup history will appear here once you start saving setups.
        </p>
      </div>
    );
  }

  if (sortedSetups.length === 0) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark-text-primary">Setup History</h3>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-dark-text-secondary" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-dark-surface border border-dark-border rounded-md text-dark-text-primary text-sm p-1"
            >
              <option value="all">All</option>
              <option value="profitable">Profitable</option>
              <option value="unprofitable">Unprofitable</option>
            </select>
            
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-dark-surface border border-dark-border rounded-md text-dark-text-primary text-sm p-1"
            >
              <option value="all">All time</option>
              <option value="week">Last week</option>
              <option value="month">Last month</option>
            </select>
          </div>
        </div>
        
        <div className="text-center py-8">
          <p className="text-dark-text-secondary">No setups match your filter criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-dark-text-primary">Setup History</h3>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-dark-text-secondary" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-dark-surface border border-dark-border rounded-md text-dark-text-primary text-sm p-1"
          >
            <option value="all">All</option>
            <option value="profitable">Profitable</option>
            <option value="unprofitable">Unprofitable</option>
          </select>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="bg-dark-surface border border-dark-border rounded-md text-dark-text-primary text-sm p-1"
          >
            <option value="all">All time</option>
            <option value="week">Last week</option>
            <option value="month">Last month</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedSetups).map(([date, dateSetups]) => (
          <div key={date}>
            <h4 className="text-sm font-medium text-dark-text-secondary mb-2">{date}</h4>
            
            <div className="space-y-2">
              {dateSetups.map((setup) => {
                const result = savedResults[setup.id];
                const isProfitable = result && setup.take_profit_price && result.risk_reward_ratio >= 1;
                
                return (
                  <div 
                    key={setup.id} 
                    className="p-3 bg-dark-surface rounded-lg border border-dark-border flex items-center justify-between cursor-pointer hover:bg-dark-card"
                    onClick={() => onLoadSetup(setup)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        isProfitable === undefined
                          ? 'bg-dark-card text-dark-text-secondary'
                          : isProfitable
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {isProfitable === undefined ? (
                          <Clock className="w-4 h-4" />
                        ) : isProfitable ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-dark-text-primary">{setup.instrument}</span>
                          <span className="text-xs px-2 py-0.5 bg-dark-card rounded-full text-dark-text-secondary">
                            {setup.leverage}x
                          </span>
                        </div>
                        
                        <div className="text-xs text-dark-text-secondary mt-0.5">
                          Entry: {TradingCalculator.formatCurrency(setup.entry_price)} | 
                          SL: {TradingCalculator.formatCurrency(setup.stop_loss_price)} | 
                          Risk: {setup.risk_per_trade}%
                        </div>
                      </div>
                    </div>
                    
                    {result && (
                      <div className="text-right">
                        <div className="font-medium text-dark-text-primary">
                          {TradingCalculator.formatNumber(result.position_size, 4)} units
                        </div>
                        
                        <div className="text-xs text-dark-text-secondary mt-0.5">
                          {setup.take_profit_price
                            ? `R/R: 1:${TradingCalculator.formatNumber(result.risk_reward_ratio, 2)}`
                            : 'No take profit set'}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

