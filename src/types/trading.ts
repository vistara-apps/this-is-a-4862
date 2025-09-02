export interface TradeSetup {
  accountBalance: number;
  riskPerTrade: number; // percentage
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice?: number;
  leverage: number;
  instrument: string;
}

export interface CalculationResult {
  positionSize: number;
  marginRequired: number;
  riskRewardRatio: number;
  capitalAtRisk: number;
  potentialProfit: number;
  potentialLoss: number;
  riskAmount: number;
}

export interface Portfolio {
  totalBalance: number;
  availableMargin: number;
  usedMargin: number;
  equity: number;
  pnl: number;
}