export type SubscriptionTier = 'free' | 'pro' | 'premium';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  tier: SubscriptionTier;
  popular?: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionState {
  subscription: Subscription | null;
  plans: SubscriptionPlan[];
  loading: boolean;
  error: Error | null;
}

export interface SubscriptionContextType extends SubscriptionState {
  createSubscription: (priceId: string) => Promise<{ data: any; error: Error | null }>;
  cancelSubscription: () => Promise<{ data: any; error: Error | null }>;
  updateSubscription: (priceId: string) => Promise<{ data: any; error: Error | null }>;
}

