import { TradeSetup, CalculationResult } from '../types/trading';

export class TradingCalculator {
  static calculatePosition(setup: TradeSetup): CalculationResult {
    const {
      accountBalance,
      riskPerTrade,
      entryPrice,
      stopLossPrice,
      takeProfitPrice,
      leverage
    } = setup;

    // Calculate risk amount in dollars
    const riskAmount = (accountBalance * riskPerTrade) / 100;

    // Calculate price difference for stop loss
    const stopLossDifference = Math.abs(entryPrice - stopLossPrice);
    
    // Calculate position size based on risk
    const positionSize = riskAmount / stopLossDifference;

    // Calculate margin required
    const marginRequired = (positionSize * entryPrice) / leverage;

    // Calculate potential profit if take profit is set
    const potentialProfit = takeProfitPrice 
      ? Math.abs(takeProfitPrice - entryPrice) * positionSize
      : 0;

    // Calculate potential loss
    const potentialLoss = stopLossDifference * positionSize;

    // Calculate risk/reward ratio
    const riskRewardRatio = takeProfitPrice 
      ? (Math.abs(takeProfitPrice - entryPrice) / stopLossDifference)
      : 0;

    // Calculate capital at risk percentage
    const capitalAtRisk = (riskAmount / accountBalance) * 100;

    return {
      positionSize,
      marginRequired,
      riskRewardRatio,
      capitalAtRisk,
      potentialProfit,
      potentialLoss,
      riskAmount
    };
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  static formatNumber(number: number, decimals: number = 2): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(number);
  }

  static formatPercentage(percentage: number): string {
    return `${percentage.toFixed(2)}%`;
  }
}