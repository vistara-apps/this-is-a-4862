export interface MarketDataAsset {
  id: string;
  symbol: string;
  name: string;
  type: 'crypto' | 'forex' | 'stock' | 'commodity';
  icon?: string;
}

export interface MarketPrice {
  asset: MarketDataAsset;
  price: number;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  updatedAt: string;
}

export interface MarketDataState {
  assets: MarketDataAsset[];
  prices: Record<string, MarketPrice>;
  loading: boolean;
  error: Error | null;
}

export interface MarketDataContextType extends MarketDataState {
  fetchAssets: () => Promise<void>;
  fetchPrice: (assetId: string) => Promise<MarketPrice | null>;
  searchAssets: (query: string) => MarketDataAsset[];
}

