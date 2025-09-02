# LeverageCalc Pro

A professional-grade leverage trading calculator that helps crypto and forex traders calculate optimal position sizes and risk parameters.

## Overview

LeverageCalc Pro is a comprehensive tool designed for traders who want to manage their risk effectively. It provides real-time position sizing, margin requirement analysis, automated risk metric calculation, and scenario planning.

![LeverageCalc Pro Screenshot](public/screenshot.png)

## Features

### Real-time Position Sizing
Instantly calculate optimal position sizes based on user-defined risk tolerance (e.g., % of capital to risk per trade), account balance, and stop-loss price. Ensures traders don't over-leverage or under-position.

### Margin Requirement Analysis
Calculate the exact margin needed for a given trade, considering the chosen leverage and position size. Helps traders stay within their available capital and avoid margin calls.

### Automated Risk Metric Calculation
Automatically compute key risk metrics for any trade, including Risk/Reward Ratio, maximum potential loss (based on stop-loss), and percentage of capital at risk. Provides a quick, quantitative assessment of trade viability.

### Scenario Planning & Simulation
Allow users to input different stop-loss and take-profit levels to see how position sizing and potential outcomes change. This helps in backtesting strategies mentally before execution.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Storage)
- **APIs**: 
  - Bitquery API for real-time cryptocurrency price data
  - Stripe API for subscription management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account
- Bitquery API key
- Stripe account (for subscription features)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/leveragecalc-pro.git
   cd leveragecalc-pro
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_BITQUERY_API_KEY=your_bitquery_api_key
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
leveragecalc-pro/
├── docs/               # Documentation
│   └── api/            # API documentation
├── public/             # Public assets
├── src/                # Source code
│   ├── components/     # React components
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility libraries
│   ├── pages/          # Page components
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main App component
│   └── main.tsx        # Entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Subscription Plans

LeverageCalc Pro offers three subscription tiers:

1. **Free**: Limited calculations and basic risk metrics
2. **Pro** ($15/month): Unlimited calculations, advanced risk metrics, and trade setup storage
3. **Premium** ($30/month): Everything in Pro, plus API access and custom integrations

## API Documentation

For detailed API documentation, see the [API Documentation](docs/api/README.md).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Supabase](https://supabase.io/) for backend services
- [Bitquery](https://bitquery.io/) for cryptocurrency data
- [Stripe](https://stripe.com/) for payment processing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide Icons](https://lucide.dev/) for icons

