import { MarketDataAsset, MarketPrice } from '../types/marketData';

// This would typically be an environment variable in a production app
const BITQUERY_API_KEY = import.meta.env.VITE_BITQUERY_API_KEY || 'your-bitquery-api-key';
const BITQUERY_API_URL = 'https://graphql.bitquery.io';

// Sample crypto assets for demo purposes
export const SAMPLE_ASSETS: MarketDataAsset[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'crypto',
    icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'crypto',
    icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    type: 'crypto',
    icon: 'https://assets.coingecko.com/coins/images/4128/small/solana.png'
  },
  {
    id: 'eurusd',
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    type: 'forex'
  },
  {
    id: 'gbpusd',
    symbol: 'GBP/USD',
    name: 'British Pound / US Dollar',
    type: 'forex'
  },
  {
    id: 'usdjpy',
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    type: 'forex'
  }
];

// Sample price data for demo purposes
const SAMPLE_PRICES: Record<string, MarketPrice> = {
  'bitcoin': {
    asset: SAMPLE_ASSETS[0],
    price: 50000,
    change24h: 1500,
    changePercent24h: 3.1,
    high24h: 51200,
    low24h: 48500,
    volume24h: 28500000000,
    updatedAt: new Date().toISOString()
  },
  'ethereum': {
    asset: SAMPLE_ASSETS[1],
    price: 3200,
    change24h: 120,
    changePercent24h: 3.9,
    high24h: 3300,
    low24h: 3050,
    volume24h: 15700000000,
    updatedAt: new Date().toISOString()
  },
  'solana': {
    asset: SAMPLE_ASSETS[2],
    price: 105,
    change24h: -3.5,
    changePercent24h: -3.2,
    high24h: 110,
    low24h: 102,
    volume24h: 2800000000,
    updatedAt: new Date().toISOString()
  },
  'eurusd': {
    asset: SAMPLE_ASSETS[3],
    price: 1.08,
    change24h: 0.002,
    changePercent24h: 0.19,
    high24h: 1.085,
    low24h: 1.078,
    volume24h: 0,
    updatedAt: new Date().toISOString()
  },
  'gbpusd': {
    asset: SAMPLE_ASSETS[4],
    price: 1.27,
    change24h: -0.003,
    changePercent24h: -0.24,
    high24h: 1.275,
    low24h: 1.267,
    volume24h: 0,
    updatedAt: new Date().toISOString()
  },
  'usdjpy': {
    asset: SAMPLE_ASSETS[5],
    price: 149.2,
    change24h: 0.35,
    changePercent24h: 0.23,
    high24h: 149.5,
    low24h: 148.8,
    volume24h: 0,
    updatedAt: new Date().toISOString()
  }
};

// Fetch all available assets
export const fetchAssets = async (): Promise<MarketDataAsset[]> => {
  // In a real implementation, this would fetch from the Bitquery API
  // For demo purposes, we'll return the sample assets
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(SAMPLE_ASSETS);
    }, 500);
  });
};

// Fetch price data for a specific asset
export const fetchPrice = async (assetId: string): Promise<MarketPrice | null> => {
  // In a real implementation, this would fetch from the Bitquery API
  // For demo purposes, we'll return the sample price data
  return new Promise((resolve) => {
    setTimeout(() => {
      const price = SAMPLE_PRICES[assetId];
      if (price) {
        // Add some random variation to simulate real-time price changes
        const variation = (Math.random() - 0.5) * 0.02; // +/- 1%
        const newPrice = price.price * (1 + variation);
        const newChange = price.change24h + (newPrice - price.price);
        const newChangePercent = (newChange / (price.price - newChange)) * 100;
        
        resolve({
          ...price,
          price: newPrice,
          change24h: newChange,
          changePercent24h: newChangePercent,
          updatedAt: new Date().toISOString()
        });
      } else {
        resolve(null);
      }
    }, 300);
  });
};

// Search assets by query
export const searchAssets = (query: string, assets: MarketDataAsset[]): MarketDataAsset[] => {
  if (!query) return assets;
  
  const lowerQuery = query.toLowerCase();
  return assets.filter(
    asset => 
      asset.name.toLowerCase().includes(lowerQuery) || 
      asset.symbol.toLowerCase().includes(lowerQuery)
  );
};

// In a real implementation, this would be the actual Bitquery GraphQL query
const PRICE_QUERY = `
  query ($network: BitcoinNetwork!, $dateFormat: String!, $from: ISO8601DateTime, $till: ISO8601DateTime, $interval: Int!, $currency: String!) {
    bitcoin(network: $network) {
      dexTrades(
        options: {desc: ["block.timestamp.time"], limit: 1, offset: 0}
        date: {since: $from, till: $till}
        exchangeName: {in: ["Uniswap", "Uniswap v2", "Uniswap v3"]}
        baseCurrency: {is: $currency}
        quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}
      ) {
        block {
          timestamp {
            time(format: $dateFormat)
          }
        }
        tradeAmount(in: USD)
        trades: count
        quotePrice
        maximum_price: quotePrice(calculate: maximum)
        minimum_price: quotePrice(calculate: minimum)
        open_price: minimum(of: block, get: quote_price)
        close_price: maximum(of: block, get: quote_price)
      }
    }
  }
`;

