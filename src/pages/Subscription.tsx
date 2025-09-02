import React from 'react';
import { PricingPlans } from '../components/subscription/PricingPlans';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Calendar, AlertTriangle } from 'lucide-react';

export const Subscription: React.FC = () => {
  const { subscription, loading } = useSubscription();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-dark-surface rounded mx-auto"></div>
            <div className="h-4 w-48 bg-dark-surface rounded mx-auto mt-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-dark-text-primary">Subscription</h1>
          <p className="text-dark-text-secondary">Manage your subscription plan</p>
        </div>

        {user && subscription && subscription.tier !== 'free' && (
          <div className="card">
            <h2 className="text-lg font-semibold text-dark-text-primary mb-4">Current Subscription</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-dark-text-secondary" />
                  <div>
                    <p className="text-sm text-dark-text-secondary">Plan</p>
                    <p className="font-medium text-dark-text-primary">
                      {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-dark-text-secondary" />
                  <div>
                    <p className="text-sm text-dark-text-secondary">Renewal Date</p>
                    <p className="font-medium text-dark-text-primary">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    subscription.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <p className="text-sm text-dark-text-secondary">Status</p>
                    <p className="font-medium text-dark-text-primary">
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </p>
                  </div>
                </div>
                
                {subscription.cancelAtPeriodEnd && (
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-medium text-dark-text-primary">Subscription Ending</p>
                      <p className="text-sm text-dark-text-secondary">
                        Your subscription will end on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-dark-border flex justify-end space-x-4">
              <button className="btn-secondary">
                Manage Payment Methods
              </button>
              
              {subscription.cancelAtPeriodEnd ? (
                <button className="btn-primary">
                  Renew Subscription
                </button>
              ) : (
                <button className="btn-secondary text-red-400 hover:text-red-500 hover:border-red-500">
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
        )}

        <PricingPlans />
      </div>
    </div>
  );
};

