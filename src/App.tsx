import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Calculator } from './components/Calculator';
import { Dashboard } from './components/Dashboard';
import { Menu } from 'lucide-react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'calculator'>('calculator');

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 min-h-screen">
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-dark-border">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-dark-text-secondary hover:text-dark-text-primary"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activeView === 'dashboard'
                    ? 'bg-dark-accent text-white'
                    : 'text-dark-text-secondary hover:text-dark-text-primary'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('calculator')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activeView === 'calculator'
                    ? 'bg-dark-accent text-white'
                    : 'text-dark-text-secondary hover:text-dark-text-primary'
                }`}
              >
                Calculator
              </button>
            </div>
          </div>

          {/* Desktop view tabs */}
          <div className="hidden md:flex border-b border-dark-border">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeView === 'dashboard'
                  ? 'border-dark-accent text-dark-accent'
                  : 'border-transparent text-dark-text-secondary hover:text-dark-text-primary'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveView('calculator')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeView === 'calculator'
                  ? 'border-dark-accent text-dark-accent'
                  : 'border-transparent text-dark-text-secondary hover:text-dark-text-primary'
              }`}
            >
              Calculator
            </button>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {activeView === 'dashboard' ? <Dashboard /> : <Calculator />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;