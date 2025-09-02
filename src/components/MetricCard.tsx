import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'default' | 'success' | 'warning' | 'danger';
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  color = 'default',
  icon
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'border-green-500/20 bg-green-500/5';
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/5';
      case 'danger':
        return 'border-red-500/20 bg-red-500/5';
      default:
        return 'border-dark-border bg-dark-surface';
    }
  };

  const getValueColor = () => {
    switch (color) {
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'danger':
        return 'text-red-400';
      default:
        return 'text-dark-text-primary';
    }
  };

  return (
    <div className={`metric-card ${getColorClasses()}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-dark-text-secondary font-medium">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${getValueColor()}`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-dark-text-secondary mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="ml-3 text-dark-text-secondary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};