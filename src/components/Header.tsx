import React from 'react';
import { Calculator, TrendingUp, Settings, User } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-dark-surface border-b border-dark-border px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Calculator className="w-6 h-6 text-dark-accent" />
            <span className="text-xl font-bold text-dark-text-primary">LeverageCalc Pro</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <button className="flex items-center space-x-2 text-dark-text-secondary hover:text-dark-text-primary transition-colors">
            <TrendingUp className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button className="flex items-center space-x-2 text-dark-text-secondary hover:text-dark-text-primary transition-colors">
            <Calculator className="w-4 h-4" />
            <span>Calculator</span>
          </button>
        </nav>

        <div className="flex items-center space-x-3">
          <button className="p-2 text-dark-text-secondary hover:text-dark-text-primary transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button className="flex items-center space-x-2 bg-dark-card px-3 py-1.5 rounded-lg border border-dark-border">
            <User className="w-4 h-4 text-dark-text-secondary" />
            <span className="text-sm text-dark-text-primary hidden sm:inline">Pro Plan</span>
          </button>
        </div>
      </div>
    </header>
  );
};