# Stripe API Documentation

LeverageCalc Pro uses Stripe for subscription management and payment processing. This document provides detailed information about the Stripe API integration.

## Overview

Stripe is a payment processing platform that allows LeverageCalc Pro to offer subscription plans to users. The integration includes:

- Subscription management
- Payment processing
- Customer portal for self-service subscription management
- Webhooks for event handling

## Authentication

All requests to the Stripe API require authentication using API keys. There are two types of API keys:

- **Publishable Key**: Used for client-side requests
- **Secret Key**: Used for server-side requests

```javascript
// Client-side
const stripe = Stripe('pk_test_your_publishable_key');

// Server-side
const stripe = require('stripe')('sk_test_your_secret_key');
```

## Subscription Plans

LeverageCalc Pro offers three subscription tiers:

1. **Free**: Basic calculations for casual traders
2. **Pro** ($15/month): Advanced tools for serious traders
3. **Premium** ($30/month): Enterprise-grade trading tools with API access

These plans are configured in Stripe as Products with recurring Price objects.

## API Endpoints

### Create Checkout Session

Creates a Stripe Checkout session for subscription purchase.

```javascript
// Server-side code
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [
    {
      price: 'price_pro_monthly', // Stripe Price ID
      quantity: 1,
    },
  ],
  mode: 'subscription',
  success_url: 'https://leveragecalc.pro/success?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://leveragecalc.pro/cancel',
  customer_email: 'user@example.com', // Optional, pre-fills customer email
});
```

**Response:**

```json
{
  "id": "cs_test_a1b2c3d4e5f6g7h8i9j0",
  "object": "checkout.session",
  "livemode": false,
  "payment_status": "unpaid",
  "url": "https://checkout.stripe.com/pay/cs_test_a1b2c3d4e5f6g7h8i9j0",
  "subscription": null,
  "customer": null,
  "payment_intent": null,
  "mode": "subscription",
  "status": "open",
  "created": 1672531200
}
```

### Create Customer Portal Session

Creates a Stripe Customer Portal session for subscription management.

```javascript
// Server-side code
const session = await stripe.billingPortal.sessions.create({
  customer: 'cus_customer_id',
  return_url: 'https://leveragecalc.pro/account',
});
```

**Response:**

```json
{
  "id": "bps_1N2O3P4Q5R6S7T8U9V0W",
  "object": "billing_portal.session",
  "created": 1672531200,
  "customer": "cus_customer_id",
  "livemode": false,
  "return_url": "https://leveragecalc.pro/account",
  "url": "https://billing.stripe.com/session/bps_1N2O3P4Q5R6S7T8U9V0W"
}
```

### Retrieve Subscription

Retrieves a subscription by ID.

```javascript
// Server-side code
const subscription = await stripe.subscriptions.retrieve('sub_subscription_id');
```

**Response:**

```json
{
  "id": "sub_subscription_id",
  "object": "subscription",
  "current_period_end": 1675209600,
  "current_period_start": 1672531200,
  "customer": "cus_customer_id",
  "items": {
    "object": "list",
    "data": [
      {
        "id": "si_subscription_item_id",
        "object": "subscription_item",
        "price": {
          "id": "price_pro_monthly",
          "object": "price",
          "active": true,
          "currency": "usd",
          "product": "prod_product_id",
          "recurring": {
            "interval": "month",
            "interval_count": 1
          },
          "unit_amount": 1500
        },
        "quantity": 1
      }
    ]
  },
  "status": "active"
}
```

### Update Subscription

Updates a subscription.

```javascript
// Server-side code
const subscription = await stripe.subscriptions.update('sub_subscription_id', {
  items: [
    {
      id: 'si_subscription_item_id',
      price: 'price_premium_monthly', // New price ID
    },
  ],
});
```

### Cancel Subscription

Cancels a subscription at the end of the current billing period.

```javascript
// Server-side code
const subscription = await stripe.subscriptions.update('sub_subscription_id', {
  cancel_at_period_end: true,
});
```

To cancel immediately:

```javascript
// Server-side code
const subscription = await stripe.subscriptions.cancel('sub_subscription_id');
```

## Webhooks

Stripe webhooks are used to handle asynchronous events, such as successful payments or subscription updates.

### Webhook Endpoints

LeverageCalc Pro listens for the following webhook events:

- `checkout.session.completed`: Triggered when a checkout is completed
- `customer.subscription.created`: Triggered when a subscription is created
- `customer.subscription.updated`: Triggered when a subscription is updated
- `customer.subscription.deleted`: Triggered when a subscription is canceled
- `invoice.payment_succeeded`: Triggered when an invoice is paid
- `invoice.payment_failed`: Triggered when an invoice payment fails

### Webhook Handler

```javascript
// Server-side code
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_your_webhook_secret');
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Create a new subscription record in your database
      await createSubscription(session.customer, session.subscription);
      break;
    case 'customer.subscription.updated':
      const subscription = event.data.object;
      // Update the subscription record in your database
      await updateSubscription(subscription.id, subscription.status, subscription.current_period_end);
      break;
    case 'customer.subscription.deleted':
      const canceledSubscription = event.data.object;
      // Update the subscription record in your database
      await cancelSubscription(canceledSubscription.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});
```

## Client-Side Integration

### Redirect to Checkout

```javascript
// Client-side code
const handleSubscribe = async (priceId) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
      }),
    });
    
    const { url } = await response.json();
    
    // Redirect to Stripe Checkout
    window.location.href = url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
  }
};
```

### Redirect to Customer Portal

```javascript
// Client-side code
const handleManageSubscription = async () => {
  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
    });
    
    const { url } = await response.json();
    
    // Redirect to Stripe Customer Portal
    window.location.href = url;
  } catch (error) {
    console.error('Error creating portal session:', error);
  }
};
```

## Implementation in LeverageCalc Pro

In LeverageCalc Pro, Stripe is integrated through Supabase Edge Functions to keep API keys secure.

### Create Checkout Session Function

```typescript
// Supabase Edge Function
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const { priceId, userId } = await req.json();
    
    // Get user from database
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('email, stripe_customer_id')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;
    
    let customerId = userData.stripe_customer_id;
    
    // If user doesn't have a Stripe customer ID, create one
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData.email,
        metadata: {
          userId,
        },
      });
      
      customerId = customer.id;
      
      // Save Stripe customer ID to user record
      await supabaseAdmin
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${Deno.env.get('SITE_URL')}/account?checkout=success`,
      cancel_url: `${Deno.env.get('SITE_URL')}/account?checkout=canceled`,
      subscription_data: {
        metadata: {
          userId,
        },
      },
    });
    
    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
```

### Webhook Handler Function

```typescript
// Supabase Edge Function
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  httpClient: Stripe.createFetchHttpClient(),
});

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') as string;

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  
  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }
  
  const body = await req.text();
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }
  
  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        await handleSubscriptionUpdated(subscription);
        break;
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        await handleSubscriptionDeleted(deletedSubscription);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(`Webhook handler failed: ${error.message}`, { status: 500 });
  }
});

async function handleCheckoutSessionCompleted(session) {
  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(session.subscription);
  
  // Get user ID from subscription metadata
  const userId = subscription.metadata.userId;
  
  // Determine subscription tier based on price ID
  const priceId = subscription.items.data[0].price.id;
  let tier = 'free';
  
  if (priceId === 'price_pro_monthly' || priceId === 'price_pro_yearly') {
    tier = 'pro';
  } else if (priceId === 'price_premium_monthly' || priceId === 'price_premium_yearly') {
    tier = 'premium';
  }
  
  // Update user's subscription in database
  await supabaseAdmin
    .from('subscriptions')
    .upsert({
      id: subscription.id,
      user_id: userId,
      tier,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
}

async function handleSubscriptionUpdated(subscription) {
  // Determine subscription tier based on price ID
  const priceId = subscription.items.data[0].price.id;
  let tier = 'free';
  
  if (priceId === 'price_pro_monthly' || priceId === 'price_pro_yearly') {
    tier = 'pro';
  } else if (priceId === 'price_premium_monthly' || priceId === 'price_premium_yearly') {
    tier = 'premium';
  }
  
  // Update subscription in database
  await supabaseAdmin
    .from('subscriptions')
    .update({
      tier,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq('id', subscription.id);
}

async function handleSubscriptionDeleted(subscription) {
  // Update subscription status in database
  await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'canceled',
      cancel_at_period_end: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', subscription.id);
}
```

## Best Practices

1. **Keep API Keys Secure**: Never expose your Stripe secret key in client-side code.
2. **Verify Webhook Signatures**: Always verify webhook signatures to prevent fraudulent requests.
3. **Handle Errors Gracefully**: Implement robust error handling for all Stripe API calls.
4. **Test with Stripe CLI**: Use the Stripe CLI to test webhooks locally during development.
5. **Use Idempotency Keys**: For important API calls, use idempotency keys to prevent duplicate operations.
6. **Monitor Events**: Set up monitoring for important Stripe events to detect issues early.
7. **Implement Proper Logging**: Log all Stripe API interactions for debugging and auditing purposes.

## Testing

Stripe provides test API keys and test card numbers for development and testing:

- Test Card Number: `4242 4242 4242 4242`
- Expiration Date: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

For testing specific scenarios, Stripe provides additional test card numbers:

- `4000 0000 0000 0341`: Card declined
- `4000 0000 0000 3220`: 3D Secure authentication required
- `4000 0000 0000 9995`: Insufficient funds

## Resources

- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Customer Portal Documentation](https://stripe.com/docs/billing/subscriptions/customer-portal)
- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)

