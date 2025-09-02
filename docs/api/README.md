# LeverageCalc Pro API Documentation

This documentation provides comprehensive information about the APIs used in LeverageCalc Pro, a professional-grade leverage trading calculator for crypto and forex traders.

## Table of Contents

1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
   - [Supabase API](#supabase-api)
   - [Bitquery API](#bitquery-api)
   - [Stripe API](#stripe-api)
4. [Error Handling](#error-handling)
5. [Rate Limits](#rate-limits)
6. [Webhooks](#webhooks)

## Introduction

LeverageCalc Pro uses several APIs to provide its functionality:

- **Supabase API**: For authentication, database operations, and storage
- **Bitquery API**: For real-time cryptocurrency price data
- **Stripe API**: For subscription management and payment processing

## Authentication

All API requests require authentication. LeverageCalc Pro uses Supabase Auth for user authentication.

### User Authentication Flow

1. **Sign Up**: Users create an account with email and password
2. **Sign In**: Users authenticate with their credentials
3. **Session Management**: Authenticated sessions are managed via JWT tokens
4. **Access Control**: Different subscription tiers have different API access levels

## API Endpoints

### Supabase API

Supabase provides a PostgreSQL database with a RESTful API interface. The following tables are used:

#### Users Table

```
users
- id (UUID, primary key)
- email (string)
- subscription_tier (enum: 'free', 'pro', 'premium')
- created_at (timestamp)
- updated_at (timestamp)
```

#### Trade Setups Table

```
trade_setups
- id (UUID, primary key)
- user_id (UUID, foreign key to users.id)
- instrument (string)
- account_balance (float)
- risk_per_trade (float)
- entry_price (float)
- stop_loss_price (float)
- take_profit_price (float, optional)
- leverage (integer)
- created_at (timestamp)
```

#### Calculation Results Table

```
calculation_results
- id (UUID, primary key)
- trade_setup_id (UUID, foreign key to trade_setups.id)
- position_size (float)
- margin_required (float)
- risk_reward_ratio (float)
- capital_at_risk (float)
- created_at (timestamp)
```

#### Subscriptions Table

```
subscriptions
- id (UUID, primary key)
- user_id (UUID, foreign key to users.id)
- tier (enum: 'free', 'pro', 'premium')
- status (enum: 'active', 'canceled', 'past_due', 'trialing')
- current_period_start (timestamp)
- current_period_end (timestamp)
- created_at (timestamp)
- updated_at (timestamp)
```

For detailed Supabase API documentation, see [supabase.md](./supabase.md).

### Bitquery API

Bitquery provides real-time cryptocurrency price data through a GraphQL API.

#### Price Index Streams Endpoint

```
GET /v1/price-index-streams
```

Parameters:
- `network`: The blockchain network (e.g., 'ethereum', 'bitcoin')
- `dateFormat`: The format for date fields
- `from`: Start date for data range
- `till`: End date for data range
- `interval`: Time interval for data points
- `currency`: The cryptocurrency to get price data for

For detailed Bitquery API documentation, see [bitquery.md](./bitquery.md).

### Stripe API

Stripe is used for subscription management and payment processing.

#### Create Checkout Session

```
POST /v1/checkout/sessions
```

Parameters:
- `customer_email`: The customer's email address
- `line_items`: Array of items to purchase
- `mode`: 'subscription' for recurring billing
- `success_url`: URL to redirect after successful payment
- `cancel_url`: URL to redirect if checkout is canceled

#### Create Portal Session

```
POST /v1/billing_portal/sessions
```

Parameters:
- `customer`: The Stripe customer ID
- `return_url`: URL to redirect after the customer leaves the portal

For detailed Stripe API documentation, see [stripe.md](./stripe.md).

## Error Handling

All API responses include appropriate HTTP status codes and error messages. Common error codes:

- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server-side error

Error responses follow this format:

```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

## Rate Limits

API rate limits vary by subscription tier:

- **Free**: 100 requests per day
- **Pro**: 1,000 requests per day
- **Premium**: 10,000 requests per day

Rate limit headers are included in all API responses:

- `X-RateLimit-Limit`: Total requests allowed in the period
- `X-RateLimit-Remaining`: Requests remaining in the period
- `X-RateLimit-Reset`: Time when the rate limit resets (Unix timestamp)

## Webhooks

LeverageCalc Pro uses webhooks to handle asynchronous events:

### Stripe Webhooks

- `checkout.session.completed`: Triggered when a checkout is completed
- `customer.subscription.updated`: Triggered when a subscription is updated
- `customer.subscription.deleted`: Triggered when a subscription is canceled

For detailed webhook documentation, see the respective API documentation files.

