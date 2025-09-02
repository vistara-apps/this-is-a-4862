import React from 'react';

interface RiskDistributionChartProps {
  distribution: Record<string, number>;
}

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ distribution }) => {
  const categories = Object.keys(distribution).filter(key => distribution[key] > 0);
  
  // Colors for different asset types
  const colors: Record<string, string> = {
    crypto: 'bg-dark-accent',
    forex: 'bg-dark-purple',
    stock: 'bg-blue-500',
    commodity: 'bg-yellow-500',
    other: 'bg-gray-500',
  };

  return (
    <div className="space-y-4">
      {categories.map(category => (
        <div key={category} className="flex items-center justify-between">
          <span className="text-dark-text-secondary capitalize">{category}</span>
          <div className="flex items-center space-x-2">
            <div className="w-32 bg-dark-surface rounded-full h-2">
              <div 
                className={`${colors[category] || 'bg-gray-500'} h-2 rounded-full`} 
                style={{ width: `${Math.min(distribution[category], 100)}%` }}
              ></div>
            </div>
            <span className="text-sm text-dark-text-primary w-12">
              {Math.round(distribution[category])}%
            </span>
          </div>
        </div>
      ))}

      {categories.length === 0 && (
        <div className="text-center py-4 text-dark-text-secondary">
          No risk distribution data available
        </div>
      )}
    </div>
  );
};

