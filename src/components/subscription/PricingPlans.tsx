import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/AuthContext';
import { SubscriptionPlan } from '../../types/subscription';

export const PricingPlans: React.FC = () => {
  const { plans, subscription, createSubscription, loading } = useSubscription();
  const { user } = useAuth();

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!user) {
      // Show auth modal or redirect to login
      return;
    }

    if (plan.tier === 'free') {
      // Free plan doesn't require payment
      return;
    }

    await createSubscription(plan.id);
  };

  const isCurrentPlan = (plan: SubscriptionPlan) => {
    if (!subscription) return plan.tier === 'free';
    return subscription.tier === plan.tier;
  };

  const getButtonText = (plan: SubscriptionPlan) => {
    if (isCurrentPlan(plan)) {
      return 'Current Plan';
    }
    
    if (plan.tier === 'free') {
      return 'Use Free Plan';
    }
    
    return `Subscribe for $${plan.price}/mo`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-dark-text-primary">Choose Your Plan</h2>
        <p className="mt-2 text-dark-text-secondary">
          Select the plan that best fits your trading needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`card relative ${
              plan.popular ? 'border-dark-accent' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <span className="bg-dark-accent text-white text-xs px-2 py-1 rounded-full">
                  Popular
                </span>
              </div>
            )}
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-dark-text-primary">{plan.name}</h3>
              <p className="text-dark-text-secondary">{plan.description}</p>
              
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-dark-text-primary">
                  ${plan.price}
                </span>
                <span className="ml-1 text-dark-text-secondary">
                  /{plan.interval}
                </span>
              </div>
              
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-dark-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={isCurrentPlan(plan) || loading}
                className={`w-full py-2 px-4 rounded-md font-medium ${
                  isCurrentPlan(plan)
                    ? 'bg-dark-surface border border-dark-accent text-dark-accent cursor-default'
                    : plan.popular
                    ? 'bg-dark-accent text-white hover:bg-opacity-90'
                    : 'bg-dark-surface border border-dark-border text-dark-text-primary hover:bg-dark-card'
                }`}
              >
                {loading ? 'Processing...' : getButtonText(plan)}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-dark-surface border-dark-border">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-dark-text-secondary mt-0.5" />
          <div>
            <h3 className="font-medium text-dark-text-primary">Need a custom plan?</h3>
            <p className="text-sm text-dark-text-secondary mt-1">
              Contact us for custom enterprise solutions with dedicated support and tailored features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

