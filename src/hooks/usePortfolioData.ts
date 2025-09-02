import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTradeSetups } from './useTradeSetups';
import { Portfolio } from '../types/trading';

export const usePortfolioData = () => {
  const { user } = useAuth();
  const { setups, savedResults } = useTradeSetups();
  const [portfolio, setPortfolio] = useState<Portfolio>({
    totalBalance: 10000,
    availableMargin: 8500,
    usedMargin: 1500,
    equity: 10125.5,
    pnl: 125.5,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Calculate risk distribution by asset type
  const calculateRiskDistribution = () => {
    const distribution: Record<string, number> = {
      crypto: 0,
      forex: 0,
      stock: 0,
      commodity: 0,
    };
    
    let totalRisk = 0;
    
    setups.forEach(setup => {
      const result = savedResults[setup.id];
      if (!result) return;
      
      const riskAmount = result.risk_amount;
      totalRisk += riskAmount;
      
      // Determine asset type based on instrument name
      let assetType = 'other';
      
      if (setup.instrument.includes('/USD') || setup.instrument.includes('BTC') || setup.instrument.includes('ETH')) {
        assetType = 'crypto';
      } else if (setup.instrument.includes('USD/') || setup.instrument.includes('EUR/') || setup.instrument.includes('GBP/')) {
        assetType = 'forex';
      } else if (setup.instrument.includes('GOLD') || setup.instrument.includes('OIL')) {
        assetType = 'commodity';
      } else {
        assetType = 'stock';
      }
      
      distribution[assetType] = (distribution[assetType] || 0) + riskAmount;
    });
    
    // Convert to percentages
    if (totalRisk > 0) {
      Object.keys(distribution).forEach(key => {
        distribution[key] = (distribution[key] / totalRisk) * 100;
      });
    }
    
    return distribution;
  };

  // Calculate win rate
  const calculateWinRate = () => {
    if (setups.length === 0) return 0;
    
    let wins = 0;
    let total = 0;
    
    setups.forEach(setup => {
      const result = savedResults[setup.id];
      if (!result || !setup.take_profit_price) return;
      
      total++;
      if (result.risk_reward_ratio >= 1) {
        wins++;
      }
    });
    
    return total > 0 ? (wins / total) * 100 : 0;
  };

  // Calculate average risk per trade
  const calculateAverageRisk = () => {
    if (setups.length === 0) return 0;
    
    let totalRiskPercent = 0;
    let count = 0;
    
    setups.forEach(setup => {
      totalRiskPercent += setup.risk_per_trade;
      count++;
    });
    
    return count > 0 ? totalRiskPercent / count : 0;
  };

  // Calculate average risk/reward ratio
  const calculateAverageRiskReward = () => {
    if (setups.length === 0) return 0;
    
    let totalRR = 0;
    let count = 0;
    
    setups.forEach(setup => {
      const result = savedResults[setup.id];
      if (!result || !setup.take_profit_price) return;
      
      totalRR += result.risk_reward_ratio;
      count++;
    });
    
    return count > 0 ? totalRR / count : 0;
  };

  // Update portfolio data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    try {
      // In a real implementation, this would fetch from the API
      // For demo purposes, we'll calculate based on saved setups
      
      const usedMargin = setups.reduce((total, setup) => {
        const result = savedResults[setup.id];
        return total + (result ? result.margin_required : 0);
      }, 0);
      
      const totalBalance = 10000; // Mock value
      const availableMargin = Math.max(0, totalBalance - usedMargin);
      const pnl = 125.5; // Mock value
      const equity = totalBalance + pnl;
      
      setPortfolio({
        totalBalance,
        availableMargin,
        usedMargin,
        equity,
        pnl,
      });
      
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, [user, setups, savedResults]);

  return {
    portfolio,
    loading,
    error,
    riskDistribution: calculateRiskDistribution(),
    winRate: calculateWinRate(),
    averageRisk: calculateAverageRisk(),
    averageRiskReward: calculateAverageRiskReward(),
  };
};

