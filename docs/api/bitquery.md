# Bitquery API Documentation

LeverageCalc Pro uses Bitquery's Multi-chain Price Index Streams API to fetch real-time cryptocurrency price data. This document provides detailed information about the Bitquery API integration.

## Overview

Bitquery provides blockchain data through a GraphQL API. LeverageCalc Pro uses this API to fetch current and historical price data for cryptocurrencies.

## Authentication

All requests to the Bitquery API require an API key. The API key is passed in the `X-API-KEY` header:

```javascript
const headers = {
  'X-API-KEY': 'YOUR_BITQUERY_API_KEY',
  'Content-Type': 'application/json'
};
```

## Endpoints

### GraphQL Endpoint

```
https://graphql.bitquery.io
```

## API Requests

### Fetch Current Price

This query fetches the current price of a cryptocurrency:

```graphql
query ($network: BitcoinNetwork!, $dateFormat: String!, $from: ISO8601DateTime, $till: ISO8601DateTime, $interval: Int!, $currency: String!) {
  bitcoin(network: $network) {
    dexTrades(
      options: {desc: ["block.timestamp.time"], limit: 1, offset: 0}
      date: {since: $from, till: $till}
      exchangeName: {in: ["Uniswap", "Uniswap v2", "Uniswap v3"]}
      baseCurrency: {is: $currency}
      quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}
    ) {
      block {
        timestamp {
          time(format: $dateFormat)
        }
      }
      tradeAmount(in: USD)
      trades: count
      quotePrice
      maximum_price: quotePrice(calculate: maximum)
      minimum_price: quotePrice(calculate: minimum)
      open_price: minimum(of: block, get: quote_price)
      close_price: maximum(of: block, get: quote_price)
    }
  }
}
```

**Variables:**

```json
{
  "network": "ethereum",
  "dateFormat": "%Y-%m-%d",
  "from": "2023-01-01T00:00:00Z",
  "till": "2023-01-02T00:00:00Z",
  "interval": 86400,
  "currency": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
}
```

**Example Response:**

```json
{
  "data": {
    "bitcoin": {
      "dexTrades": [
        {
          "block": {
            "timestamp": {
              "time": "2023-01-01"
            }
          },
          "tradeAmount": 1250000,
          "trades": 1500,
          "quotePrice": 16500.25,
          "maximum_price": 16800.75,
          "minimum_price": 16300.50,
          "open_price": 16400.00,
          "close_price": 16600.50
        }
      ]
    }
  }
}
```

### Fetch Historical Price Data

This query fetches historical price data for a cryptocurrency over a specified time period:

```graphql
query ($network: BitcoinNetwork!, $dateFormat: String!, $from: ISO8601DateTime, $till: ISO8601DateTime, $interval: Int!, $currency: String!) {
  bitcoin(network: $network) {
    dexTrades(
      options: {asc: "timeInterval.day"}
      date: {since: $from, till: $till}
      exchangeName: {in: ["Uniswap", "Uniswap v2", "Uniswap v3"]}
      baseCurrency: {is: $currency}
      quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}
    ) {
      timeInterval {
        day(format: $dateFormat)
      }
      volume: tradeAmount(in: USD)
      trades: count
      high: quotePrice(calculate: maximum)
      low: quotePrice(calculate: minimum)
      open: minimum(of: block, get: quote_price)
      close: maximum(of: block, get: quote_price)
    }
  }
}
```

**Variables:**

```json
{
  "network": "ethereum",
  "dateFormat": "%Y-%m-%d",
  "from": "2023-01-01T00:00:00Z",
  "till": "2023-01-07T00:00:00Z",
  "interval": 86400,
  "currency": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
}
```

**Example Response:**

```json
{
  "data": {
    "bitcoin": {
      "dexTrades": [
        {
          "timeInterval": {
            "day": "2023-01-01"
          },
          "volume": 1250000,
          "trades": 1500,
          "high": 16800.75,
          "low": 16300.50,
          "open": 16400.00,
          "close": 16600.50
        },
        {
          "timeInterval": {
            "day": "2023-01-02"
          },
          "volume": 1350000,
          "trades": 1600,
          "high": 16900.25,
          "low": 16500.75,
          "open": 16600.50,
          "close": 16850.00
        },
        // Additional days...
      ]
    }
  }
}
```

## Implementation in LeverageCalc Pro

In LeverageCalc Pro, the Bitquery API is used to fetch real-time price data for cryptocurrencies. This data is used to populate the entry price field in the calculator and to provide market data for the dashboard.

### Fetch Price Function

```typescript
export const fetchPrice = async (assetId: string): Promise<MarketPrice | null> => {
  try {
    // Prepare the GraphQL query
    const query = `
      query ($network: BitcoinNetwork!, $dateFormat: String!, $from: ISO8601DateTime, $till: ISO8601DateTime, $interval: Int!, $currency: String!) {
        bitcoin(network: $network) {
          dexTrades(
            options: {desc: ["block.timestamp.time"], limit: 1, offset: 0}
            date: {since: $from, till: $till}
            exchangeName: {in: ["Uniswap", "Uniswap v2", "Uniswap v3"]}
            baseCurrency: {is: $currency}
            quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}
          ) {
            block {
              timestamp {
                time(format: $dateFormat)
              }
            }
            tradeAmount(in: USD)
            trades: count
            quotePrice
            maximum_price: quotePrice(calculate: maximum)
            minimum_price: quotePrice(calculate: minimum)
            open_price: minimum(of: block, get: quote_price)
            close_price: maximum(of: block, get: quote_price)
          }
        }
      }
    `;

    // Prepare variables
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const variables = {
      network: "ethereum",
      dateFormat: "%Y-%m-%d",
      from: yesterday.toISOString(),
      till: now.toISOString(),
      interval: 86400,
      currency: getCurrencyAddress(assetId) // Helper function to get token address
    };

    // Make the API request
    const response = await fetch('https://graphql.bitquery.io', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': BITQUERY_API_KEY
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    const tradeData = result.data.bitcoin.dexTrades[0];
    
    if (!tradeData) {
      return null;
    }

    // Find the asset in our list
    const asset = SAMPLE_ASSETS.find(a => a.id === assetId);
    
    if (!asset) {
      return null;
    }

    // Return the market price data
    return {
      asset,
      price: tradeData.quotePrice,
      change24h: tradeData.close_price - tradeData.open_price,
      changePercent24h: ((tradeData.close_price - tradeData.open_price) / tradeData.open_price) * 100,
      high24h: tradeData.maximum_price,
      low24h: tradeData.minimum_price,
      volume24h: tradeData.tradeAmount,
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching price from Bitquery:', error);
    return null;
  }
};
```

## Rate Limits

Bitquery API has rate limits based on the subscription plan:

- **Free Plan**: 100 requests per day
- **Basic Plan**: 1,000 requests per day
- **Professional Plan**: 10,000 requests per day
- **Enterprise Plan**: Custom limits

When a rate limit is exceeded, the API will return a 429 Too Many Requests status code.

## Error Handling

The Bitquery API returns errors in the following format:

```json
{
  "errors": [
    {
      "message": "Error message",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "bitcoin",
        "dexTrades"
      ],
      "extensions": {
        "code": "ERROR_CODE"
      }
    }
  ]
}
```

Common error codes:
- `AUTHENTICATION_ERROR`: Invalid or missing API key
- `VALIDATION_ERROR`: Invalid query syntax or parameters
- `RATE_LIMIT_EXCEEDED`: API rate limit exceeded
- `INTERNAL_SERVER_ERROR`: Server-side error

## Best Practices

1. **Cache Results**: To minimize API calls, cache results for a short period (e.g., 5 minutes for price data).
2. **Implement Retry Logic**: Add retry logic with exponential backoff for failed requests.
3. **Handle Rate Limits**: Monitor rate limit headers and adjust request frequency accordingly.
4. **Error Handling**: Implement robust error handling to gracefully handle API failures.
5. **Fallback Mechanism**: Have a fallback data source in case the Bitquery API is unavailable.

