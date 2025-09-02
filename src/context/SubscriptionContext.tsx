import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { 
  SUBSCRIPTION_PLANS, 
  createCheckoutSession, 
  createPortalSession, 
  getUserSubscription, 
  cancelSubscription as cancelStripeSubscription,
  updateSubscription as updateStripeSubscription
} from '../lib/stripe';
import { SubscriptionContextType, SubscriptionState, Subscription } from '../types/subscription';

// Create the subscription context
const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Initial subscription state
const initialState: SubscriptionState = {
  subscription: null,
  plans: SUBSCRIPTION_PLANS,
  loading: true,
  error: null,
};

// Subscription provider component
export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, setState] = useState<SubscriptionState>(initialState);

  // Fetch user subscription when user changes
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setState({
          ...initialState,
          loading: false,
        });
        return;
      }

      setState(prev => ({ ...prev, loading: true }));

      try {
        const { data, error } = await getUserSubscription(user.id);
        
        if (error) throw error;
        
        setState({
          ...state,
          subscription: data as Subscription,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          ...state,
          loading: false,
          error: error as Error,
        });
      }
    };

    fetchSubscription();
  }, [user]);

  // Create subscription
  const createSubscription = async (priceId: string) => {
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    setState({ ...state, loading: true });

    try {
      const { data, error } = await createCheckoutSession(priceId, user.id);
      
      if (error) throw error;
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
      
      return { data, error: null };
    } catch (error) {
      setState({ ...state, loading: false, error: error as Error });
      return { data: null, error: error as Error };
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    if (!user || !state.subscription) {
      return { data: null, error: new Error('No active subscription') };
    }

    setState({ ...state, loading: true });

    try {
      const { data, error } = await cancelStripeSubscription(state.subscription.id);
      
      if (error) throw error;
      
      setState({
        ...state,
        subscription: {
          ...state.subscription,
          cancelAtPeriodEnd: true,
        } as Subscription,
        loading: false,
        error: null,
      });
      
      return { data, error: null };
    } catch (error) {
      setState({ ...state, loading: false, error: error as Error });
      return { data: null, error: error as Error };
    }
  };

  // Update subscription
  const updateSubscription = async (priceId: string) => {
    if (!user || !state.subscription) {
      return { data: null, error: new Error('No active subscription') };
    }

    setState({ ...state, loading: true });

    try {
      const { data, error } = await updateStripeSubscription(state.subscription.id, priceId);
      
      if (error) throw error;
      
      // Refresh subscription data
      const { data: subscriptionData, error: subscriptionError } = await getUserSubscription(user.id);
      
      if (subscriptionError) throw subscriptionError;
      
      setState({
        ...state,
        subscription: subscriptionData as Subscription,
        loading: false,
        error: null,
      });
      
      return { data, error: null };
    } catch (error) {
      setState({ ...state, loading: false, error: error as Error });
      return { data: null, error: error as Error };
    }
  };

  // Subscription context value
  const value = {
    ...state,
    createSubscription,
    cancelSubscription,
    updateSubscription,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

// Custom hook to use subscription context
export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  
  return context;
};

