import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { useMarketData } from '../context/MarketDataContext';
import { MarketDataAsset } from '../types/marketData';

interface MarketDataSelectorProps {
  value: string;
  onChange: (value: string) => void;
  onAssetSelect?: (asset: MarketDataAsset) => void;
}

export const MarketDataSelector: React.FC<MarketDataSelectorProps> = ({
  value,
  onChange,
  onAssetSelect
}) => {
  const { assets, searchAssets, loading } = useMarketData();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAssets, setFilteredAssets] = useState<MarketDataAsset[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter assets based on search query
  useEffect(() => {
    setFilteredAssets(searchAssets(searchQuery));
  }, [searchQuery, assets, searchAssets]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Find the selected asset
  const selectedAsset = assets.find(asset => asset.symbol === value);

  // Handle asset selection
  const handleAssetSelect = (asset: MarketDataAsset) => {
    onChange(asset.symbol);
    if (onAssetSelect) {
      onAssetSelect(asset);
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="input-field flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {selectedAsset?.icon && (
            <img
              src={selectedAsset.icon}
              alt={selectedAsset.name}
              className="w-5 h-5 mr-2 rounded-full"
            />
          )}
          <span>{selectedAsset ? `${selectedAsset.symbol} - ${selectedAsset.name}` : 'Select an asset'}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-dark-text-secondary" />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-dark-card border border-dark-border rounded-md shadow-lg">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-secondary w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assets..."
                className="input-field pl-9 pr-8 py-2"
                autoFocus
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-text-secondary"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-dark-text-secondary">
                Loading assets...
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="p-4 text-center text-dark-text-secondary">
                No assets found
              </div>
            ) : (
              <div className="py-1">
                {filteredAssets.map((asset) => (
                  <button
                    key={asset.id}
                    className={`w-full text-left px-4 py-2 flex items-center hover:bg-dark-surface ${
                      asset.symbol === value ? 'bg-dark-surface' : ''
                    }`}
                    onClick={() => handleAssetSelect(asset)}
                  >
                    {asset.icon && (
                      <img
                        src={asset.icon}
                        alt={asset.name}
                        className="w-5 h-5 mr-2 rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-medium text-dark-text-primary">{asset.symbol}</div>
                      <div className="text-xs text-dark-text-secondary">{asset.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

