# Supabase API Documentation

LeverageCalc Pro uses Supabase as its backend service for authentication, database, and storage. This document provides detailed information about the Supabase API integration.

## Authentication

### Sign Up

Creates a new user account.

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securepassword',
});
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "created_at": "2023-01-01T00:00:00.000Z"
    },
    "session": { ... }
  },
  "error": null
}
```

### Sign In

Authenticates a user with email and password.

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securepassword',
});
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "created_at": "2023-01-01T00:00:00.000Z"
    },
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "refresh-token",
      "expires_at": 1672531200
    }
  },
  "error": null
}
```

### Sign Out

Signs out the current user.

```typescript
const { error } = await supabase.auth.signOut();
```

### Get Current User

Retrieves the currently authenticated user.

```typescript
const { data, error } = await supabase.auth.getUser();
```

## Database Operations

### Trade Setups

#### Save Trade Setup

Saves a new trade setup for the user.

```typescript
const { data, error } = await supabase
  .from('trade_setups')
  .insert([{
    user_id: 'user-uuid',
    instrument: 'BTC/USD',
    account_balance: 10000,
    risk_per_trade: 2,
    entry_price: 50000,
    stop_loss_price: 48000,
    take_profit_price: 55000,
    leverage: 10
  }])
  .select();
```

#### Get Trade Setups

Retrieves all trade setups for a user.

```typescript
const { data, error } = await supabase
  .from('trade_setups')
  .select('*')
  .eq('user_id', 'user-uuid')
  .order('created_at', { ascending: false });
```

#### Get Trade Setup

Retrieves a specific trade setup by ID.

```typescript
const { data, error } = await supabase
  .from('trade_setups')
  .select('*')
  .eq('id', 'setup-uuid')
  .single();
```

#### Update Trade Setup

Updates an existing trade setup.

```typescript
const { data, error } = await supabase
  .from('trade_setups')
  .update({
    take_profit_price: 56000,
    leverage: 5
  })
  .eq('id', 'setup-uuid')
  .select();
```

#### Delete Trade Setup

Deletes a trade setup.

```typescript
const { error } = await supabase
  .from('trade_setups')
  .delete()
  .eq('id', 'setup-uuid');
```

### Calculation Results

#### Save Calculation Result

Saves a calculation result for a trade setup.

```typescript
const { data, error } = await supabase
  .from('calculation_results')
  .insert([{
    trade_setup_id: 'setup-uuid',
    position_size: 0.4,
    margin_required: 2000,
    risk_reward_ratio: 2.5,
    capital_at_risk: 2
  }])
  .select();
```

#### Get Calculation Results

Retrieves calculation results for a trade setup.

```typescript
const { data, error } = await supabase
  .from('calculation_results')
  .select('*')
  .eq('trade_setup_id', 'setup-uuid')
  .order('created_at', { ascending: false });
```

### Subscriptions

#### Get User Subscription

Retrieves the subscription information for a user.

```typescript
const { data, error } = await supabase
  .from('subscriptions')
  .select('*')
  .eq('user_id', 'user-uuid')
  .single();
```

#### Update User Subscription

Updates a user's subscription information.

```typescript
const { data, error } = await supabase
  .from('subscriptions')
  .upsert({
    user_id: 'user-uuid',
    tier: 'pro',
    status: 'active',
    current_period_start: '2023-01-01T00:00:00.000Z',
    current_period_end: '2023-02-01T00:00:00.000Z'
  })
  .select();
```

## Supabase Functions

### Create Checkout Session

Creates a Stripe checkout session for subscription purchase.

```typescript
const { data, error } = await supabase.functions.invoke('create-checkout-session', {
  body: { 
    priceId: 'price_pro_monthly',
    userId: 'user-uuid'
  }
});
```

### Create Portal Session

Creates a Stripe customer portal session for subscription management.

```typescript
const { data, error } = await supabase.functions.invoke('create-portal-session', {
  body: { 
    userId: 'user-uuid'
  }
});
```

### Cancel Subscription

Cancels a user's subscription.

```typescript
const { data, error } = await supabase.functions.invoke('cancel-subscription', {
  body: { 
    subscriptionId: 'subscription-id'
  }
});
```

### Update Subscription

Updates a user's subscription plan.

```typescript
const { data, error } = await supabase.functions.invoke('update-subscription', {
  body: { 
    subscriptionId: 'subscription-id',
    priceId: 'price_premium_monthly'
  }
});
```

## Error Handling

All Supabase operations return an `error` object if something goes wrong. Always check for errors before proceeding:

```typescript
const { data, error } = await supabase.from('trade_setups').select('*');

if (error) {
  console.error('Error fetching trade setups:', error);
  // Handle the error appropriately
  return;
}

// Process the data
console.log('Trade setups:', data);
```

## Real-time Subscriptions

Supabase supports real-time updates through subscriptions:

```typescript
const subscription = supabase
  .from('trade_setups')
  .on('INSERT', payload => {
    console.log('New trade setup:', payload.new);
  })
  .on('UPDATE', payload => {
    console.log('Updated trade setup:', payload.new);
  })
  .on('DELETE', payload => {
    console.log('Deleted trade setup:', payload.old);
  })
  .subscribe();

// Unsubscribe when done
subscription.unsubscribe();
```

## Security Rules

Supabase Row Level Security (RLS) ensures that users can only access their own data:

```sql
-- Example RLS policy for trade_setups table
CREATE POLICY "Users can only access their own trade setups"
ON trade_setups
FOR ALL
USING (auth.uid() = user_id);
```

This ensures that even if a user tries to access another user's data, the database will deny the request.

