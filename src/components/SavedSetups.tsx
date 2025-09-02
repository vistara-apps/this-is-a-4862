import React, { useState } from 'react';
import { Trash2, Edit, Copy, Clock, ArrowUpDown } from 'lucide-react';
import { TradeSetup, CalculationResult } from '../types/trading';
import { TradingCalculator } from '../utils/calculations';
import { useTradeSetups } from '../hooks/useTradeSetups';

interface SavedSetupsProps {
  onLoadSetup: (setup: TradeSetup) => void;
}

export const SavedSetups: React.FC<SavedSetupsProps> = ({ onLoadSetup }) => {
  const { setups, savedResults, loading, deleteSetup } = useTradeSetups();
  const [sortBy, setSortBy] = useState<'date' | 'instrument' | 'risk'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sort setups based on current sort settings
  const sortedSetups = [...setups].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc'
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortBy === 'instrument') {
      return sortOrder === 'asc'
        ? a.instrument.localeCompare(b.instrument)
        : b.instrument.localeCompare(a.instrument);
    } else if (sortBy === 'risk') {
      const aRisk = a.risk_per_trade;
      const bRisk = b.risk_per_trade;
      return sortOrder === 'asc' ? aRisk - bRisk : bRisk - aRisk;
    }
    return 0;
  });

  // Handle sort change
  const handleSort = (newSortBy: 'date' | 'instrument' | 'risk') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
        <h3 className="text-lg font-medium text-dark-text-primary">No Saved Setups</h3>
        <p className="text-dark-text-secondary mt-1">
          Your saved trade setups will appear here. Save a setup from the calculator to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-dark-text-primary">Saved Setups</h3>
        
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-dark-text-secondary">Sort by:</span>
          
          <button
            onClick={() => handleSort('date')}
            className={`px-2 py-1 rounded ${
              sortBy === 'date' ? 'bg-dark-surface text-dark-accent' : 'text-dark-text-secondary'
            }`}
          >
            Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          
          <button
            onClick={() => handleSort('instrument')}
            className={`px-2 py-1 rounded ${
              sortBy === 'instrument' ? 'bg-dark-surface text-dark-accent' : 'text-dark-text-secondary'
            }`}
          >
            Instrument {sortBy === 'instrument' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          
          <button
            onClick={() => handleSort('risk')}
            className={`px-2 py-1 rounded ${
              sortBy === 'risk' ? 'bg-dark-surface text-dark-accent' : 'text-dark-text-secondary'
            }`}
          >
            Risk {sortBy === 'risk' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {sortedSetups.map((setup) => {
          const result = savedResults[setup.id];
          
          return (
            <div key={setup.id} className="p-4 bg-dark-surface rounded-lg border border-dark-border">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-dark-text-primary">{setup.instrument}</h4>
                    <span className="text-xs px-2 py-0.5 bg-dark-card rounded-full text-dark-text-secondary">
                      {setup.leverage}x
                    </span>
                  </div>
                  
                  <div className="mt-1 grid grid-cols-2 gap-x-6 text-sm">
                    <div className="text-dark-text-secondary">Entry: {TradingCalculator.formatCurrency(setup.entry_price)}</div>
                    <div className="text-dark-text-secondary">Stop: {TradingCalculator.formatCurrency(setup.stop_loss_price)}</div>
                    
                    <div className="text-dark-text-secondary">Risk: {setup.risk_per_trade}%</div>
                    <div className="text-dark-text-secondary">
                      TP: {setup.take_profit_price ? TradingCalculator.formatCurrency(setup.take_profit_price) : 'N/A'}
                    </div>
                  </div>
                  
                  {result && (
                    <div className="mt-2 flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <span className="text-dark-text-secondary">Size:</span>
                        <span className="text-dark-text-primary font-medium">
                          {TradingCalculator.formatNumber(result.position_size, 4)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <span className="text-dark-text-secondary">R/R:</span>
                        <span className="text-dark-text-primary font-medium">
                          {setup.take_profit_price
                            ? `1:${TradingCalculator.formatNumber(result.risk_reward_ratio, 2)}`
                            : 'N/A'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <span className="text-dark-text-secondary">Risk:</span>
                        <span className="text-dark-text-primary font-medium">
                          {TradingCalculator.formatCurrency(result.risk_amount)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-1 text-xs text-dark-text-secondary">
                    {formatDate(setup.created_at)}
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => onLoadSetup(setup)}
                    className="p-1.5 text-dark-text-secondary hover:text-dark-text-primary"
                    title="Load setup"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => deleteSetup(setup.id)}
                    className="p-1.5 text-dark-text-secondary hover:text-red-400"
                    title="Delete setup"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

