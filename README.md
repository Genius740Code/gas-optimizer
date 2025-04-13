# Crypto Fee Optimizer

A React application that visualizes transaction fees for Ethereum, Bitcoin, and Solana blockchains, helping users find the optimal time to transact and save money on network fees.

## Features

- **Multiple Blockchain Support**: 
  - Ethereum gas fee tracking
  - Bitcoin transaction fee monitoring
  - Solana transaction fee monitoring
- **Real-time Fee Data**: Shows current fees for low, standard, and fast transactions
- **Historical Fee Charts**: Visualizes fee trends over different time periods (24 hours, 7 days, 14 days)
- **Transaction Time Recommendations**: Suggests the best hours and days to transact based on historical data
- **Fee Saving Tips**: Network-specific advice for minimizing transaction costs

## Demo

Access the live demo at [https://genius740code.github.io/gas-optimizer](https://genius740code.github.io/gas-optimizer)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone this repository:
```
git clone https://github.com/Genius740Code/gas-optimizer.git
```

2. Navigate to the project directory:
```
cd gas-optimizer
```

3. Install dependencies:
```
npm install
```

4. Create a `.env` file with your API keys:
```
REACT_APP_ETHERSCAN_API_KEY=YourEtherscanAPIKey
REACT_APP_SOLSCAN_API_KEY=YourSolscanAPIKey
```

5. Get API keys from:
   - [Etherscan](https://etherscan.io/apis) for Ethereum data
   - [Solscan](https://public-api.solscan.io/) for Solana data (optional)
   - Bitcoin data uses the public mempool.space API (no key required)

### Running the Application

In Windows PowerShell:
```
cd gas-optimizer
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Technical Details

- Built with React and TypeScript
- Uses Recharts for data visualization
- Connects to blockchain APIs for fee data:
  - Etherscan API for Ethereum gas fees
  - mempool.space API for Bitcoin transaction fees
  - Solana blockchain API for transaction fees
- Implements responsive design for all device sizes

## API Usage Notes

This application uses the free tier of blockchain APIs, with historical data simulated based on known fee patterns to avoid API rate limits. For production use with real historical data, consider upgrading to paid API services or implementing server-side caching.

## How It Works

- **Network Selection**: Switch between Ethereum, Bitcoin, and Solana networks
- **TimeFrame Selection**: View fee data over different time periods
- **Fee Analysis**: Automatic calculation of optimal transaction times
- **Recommendations**: Network-specific advice for cost optimization

## Customization

You can modify the following aspects:

- **API Keys**: Replace the placeholders in `.env` with your actual API keys
- **Refresh Rate**: Change the data refresh interval in `App.tsx` (default is 5 minutes)
- **Time Frames**: Add or modify time periods in `TimeFrameSelector.tsx`
- **Add More Networks**: Extend the application to support additional blockchains

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
