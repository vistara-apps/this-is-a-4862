import React from 'react';
import { Calculator, TrendingUp, PieChart, Settings, HelpCircle } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: Calculator, label: 'Calculator', active: true },
    { icon: TrendingUp, label: 'Portfolio', active: false },
    { icon: PieChart, label: 'Analytics', active: false },
    { icon: Settings, label: 'Settings', active: false },
    { icon: HelpCircle, label: 'Help', active: false },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed md:static top-0 left-0 h-full w-64 bg-dark-surface border-r border-dark-border z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4">
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                  ${item.active 
                    ? 'bg-dark-accent text-white' 
                    : 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-card'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Portfolio Summary */}
        <div className="p-4 border-t border-dark-border mt-6">
          <h3 className="text-sm font-medium text-dark-text-secondary mb-3">Portfolio Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-dark-text-secondary">Total Balance</span>
              <span className="text-sm text-dark-text-primary font-medium">$10,000.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-dark-text-secondary">Available Margin</span>
              <span className="text-sm text-dark-accent font-medium">$8,500.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-dark-text-secondary">P&L Today</span>
              <span className="text-sm text-green-400 font-medium">+$125.50</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};