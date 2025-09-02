import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { Bell, User, Settings, LogOut, Menu, X, CreditCard } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { subscription } = useSubscription();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsProfileMenuOpen(false);
  };

  return (
    <header className="bg-dark-card border-b border-dark-border">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md text-dark-text-secondary hover:text-dark-text-primary"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-dark-accent">LeverageCalc</span>
            <span className="text-xl font-bold text-dark-text-primary ml-1">Pro</span>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Subscription badge */}
          {subscription && (
            <div className="hidden md:flex items-center">
              <Link
                to="/subscription"
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  subscription.tier === 'premium'
                    ? 'bg-dark-accent/10 text-dark-accent'
                    : subscription.tier === 'pro'
                    ? 'bg-blue-500/10 text-blue-500'
                    : 'bg-dark-surface text-dark-text-secondary'
                }`}
              >
                {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} Plan
              </Link>
            </div>
          )}

          {/* Notifications */}
          <button className="p-2 rounded-full text-dark-text-secondary hover:text-dark-text-primary">
            <Bell className="w-5 h-5" />
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 p-2 rounded-full text-dark-text-secondary hover:text-dark-text-primary"
              onClick={toggleProfileMenu}
            >
              <div className="w-8 h-8 rounded-full bg-dark-accent flex items-center justify-center text-white">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-md shadow-lg z-10">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-dark-border">
                    <p className="text-sm font-medium text-dark-text-primary truncate">
                      {user?.email}
                    </p>
                    <p className="text-xs text-dark-text-secondary mt-1">
                      {subscription
                        ? `${subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} Plan`
                        : 'Free Plan'}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-dark-text-secondary hover:bg-dark-surface hover:text-dark-text-primary"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>

                  <Link
                    to="/subscription"
                    className="flex items-center px-4 py-2 text-sm text-dark-text-secondary hover:bg-dark-surface hover:text-dark-text-primary"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Subscription
                  </Link>

                  <Link
                    to="/profile?tab=preferences"
                    className="flex items-center px-4 py-2 text-sm text-dark-text-secondary hover:bg-dark-surface hover:text-dark-text-primary"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>

                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-dark-surface"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-dark-card border-t border-dark-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-dark-text-primary hover:bg-dark-surface"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/calculator"
              className="block px-3 py-2 rounded-md text-base font-medium text-dark-text-primary hover:bg-dark-surface"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Calculator
            </Link>
            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-dark-text-primary hover:bg-dark-surface"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/subscription"
              className="block px-3 py-2 rounded-md text-base font-medium text-dark-text-primary hover:bg-dark-surface"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Subscription
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

