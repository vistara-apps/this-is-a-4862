import { supabase } from './supabase';
import { SubscriptionPlan } from '../types/subscription';

// These would typically be environment variables in a production app
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'your-stripe-public-key';

// Subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'price_free',
    name: 'Free',
    description: 'Basic calculations for casual traders',
    price: 0,
    interval: 'month',
    features: [
      'Limited calculations',
      'Basic risk metrics',
      'Single device access',
      'No data storage'
    ],
    tier: 'free'
  },
  {
    id: 'price_pro_monthly',
    name: 'Pro',
    description: 'Advanced tools for serious traders',
    price: 15,
    interval: 'month',
    features: [
      'Unlimited calculations',
      'Advanced risk metrics',
      'Multi-device access',
      'Trade setup storage',
      'Scenario planning'
    ],
    tier: 'pro',
    popular: true
  },
  {
    id: 'price_premium_monthly',
    name: 'Premium',
    description: 'Enterprise-grade trading tools',
    price: 30,
    interval: 'month',
    features: [
      'Everything in Pro',
      'API access',
      'Custom integrations',
      'Priority support',
      'Advanced analytics'
    ],
    tier: 'premium'
  }
];

// Create a checkout session
export const createCheckoutSession = async (priceId: string, userId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { priceId, userId }
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return { data: null, error: error as Error };
  }
};

// Create a portal session for managing subscriptions
export const createPortalSession = async (userId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: { userId }
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating portal session:', error);
    return { data: null, error: error as Error };
  }
};

// Get user subscription
export const getUserSubscription = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return { data: null, error: error as Error };
  }
};

// Cancel subscription
export const cancelSubscription = async (subscriptionId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('cancel-subscription', {
      body: { subscriptionId }
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return { data: null, error: error as Error };
  }
};

// Update subscription
export const updateSubscription = async (subscriptionId: string, priceId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('update-subscription', {
      body: { subscriptionId, priceId }
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating subscription:', error);
    return { data: null, error: error as Error };
  }
};

