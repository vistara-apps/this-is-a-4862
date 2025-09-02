import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calculator, User, CreditCard, HelpCircle, FileText } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: 'Calculator',
      path: '/calculator',
      icon: <Calculator className="w-5 h-5" />,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: <User className="w-5 h-5" />,
    },
    {
      name: 'Subscription',
      path: '/subscription',
      icon: <CreditCard className="w-5 h-5" />,
    },
  ];

  return (
    <div className="hidden md:flex md:flex-col md:w-64 md:bg-dark-card md:border-r md:border-dark-border">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex-shrink-0 px-4 flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-dark-accent">LeverageCalc</span>
            <span className="text-xl font-bold text-dark-text-primary ml-1">Pro</span>
          </Link>
        </div>
        
        <nav className="mt-8 flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center px-3 py-2 rounded-md ${
                isActive(item.path)
                  ? 'bg-dark-accent/10 text-dark-accent'
                  : 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="mt-auto px-4 pb-6">
          <div className="space-y-1">
            <a
              href="#"
              className="group flex items-center px-3 py-2 rounded-md text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface"
            >
              <HelpCircle className="w-5 h-5" />
              <span className="ml-3">Help & Support</span>
            </a>
            
            <a
              href="#"
              className="group flex items-center px-3 py-2 rounded-md text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface"
            >
              <FileText className="w-5 h-5" />
              <span className="ml-3">Documentation</span>
            </a>
          </div>
          
          <div className="mt-6 px-3 py-3 bg-dark-surface rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="w-5 h-5 text-dark-accent" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-dark-text-primary">Upgrade to Pro</p>
                <p className="text-xs text-dark-text-secondary">Get advanced features</p>
              </div>
            </div>
            <Link
              to="/subscription"
              className="mt-2 block text-center px-3 py-1.5 text-sm font-medium text-white bg-dark-accent rounded-md hover:bg-dark-accent/90"
            >
              View Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

