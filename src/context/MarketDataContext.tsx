import React, { createContext, useContext, useEffect, useState } from 'react';
import { MarketDataContextType, MarketDataState, MarketPrice, MarketDataAsset } from '../types/marketData';
import { fetchAssets, fetchPrice, searchAssets as searchAssetsUtil } from '../lib/bitquery';
import { useSubscription } from './SubscriptionContext';

// Create the market data context
const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

// Initial market data state
const initialState: MarketDataState = {
  assets: [],
  prices: {},
  loading: true,
  error: null,
};

// Market data provider component
export const MarketDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<MarketDataState>(initialState);
  const { subscription } = useSubscription();

  // Fetch assets on mount
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const assets = await fetchAssets();
        setState(prev => ({
          ...prev,
          assets,
          loading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error as Error,
          loading: false,
        }));
      }
    };

    loadAssets();
  }, []);

  // Fetch price data for an asset
  const fetchPriceData = async (assetId: string): Promise<MarketPrice | null> => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const price = await fetchPrice(assetId);
      
      if (price) {
        setState(prev => ({
          ...prev,
          prices: {
            ...prev.prices,
            [assetId]: price,
          },
          loading: false,
        }));
      }
      
      return price;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error,
        loading: false,
      }));
      return null;
    }
  };

  // Search assets by query
  const searchAssets = (query: string): MarketDataAsset[] => {
    return searchAssetsUtil(query, state.assets);
  };

  // Market data context value
  const value: MarketDataContextType = {
    ...state,
    fetchAssets: async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));
        const assets = await fetchAssets();
        setState(prev => ({
          ...prev,
          assets,
          loading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error as Error,
          loading: false,
        }));
      }
    },
    fetchPrice: fetchPriceData,
    searchAssets,
  };

  return <MarketDataContext.Provider value={value}>{children}</MarketDataContext.Provider>;
};

// Custom hook to use market data context
export const useMarketData = (): MarketDataContextType => {
  const context = useContext(MarketDataContext);
  
  if (context === undefined) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  
  return context;
};

