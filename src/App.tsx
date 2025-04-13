import React, { useState, useEffect } from 'react';
import './App.css';
import GasChart from './components/GasChart';
import OptimalTimes from './components/OptimalTimes';
import TimeFrameSelector from './components/TimeFrameSelector';
import { 
  fetchCurrentGasPrice, 
  fetchHistoricalGasPrices, 
  getOptimalTransactionTimes
} from './services/api';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentGas, setCurrentGas] = useState<any>(null);
  const [gasData, setGasData] = useState<any[]>([]);
  const [timeFrame, setTimeFrame] = useState<string>('24h');
  const [optimalTimes, setOptimalTimes] = useState<{
    bestHours: any[];
    bestDays: any[];
  }>({ bestHours: [], bestDays: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current gas price for Ethereum
        const currentGasData = await fetchCurrentGasPrice();
        setCurrentGas(currentGasData);

        // Get historical gas prices for Ethereum (14 days of data)
        const historicalEthData = await fetchHistoricalGasPrices(14);
        setGasData(historicalEthData);

        // Calculate optimal times
        const optimal = getOptimalTransactionTimes(historicalEthData);
        setOptimalTimes(optimal);

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchData();

    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleTimeFrameChange = (newTimeFrame: string) => {
    setTimeFrame(newTimeFrame);
  };

  // Filter data based on the selected time frame
  const getFilteredData = () => {
    if (!gasData.length) return [];

    const now = new Date().getTime();
    let cutoffTime = now;

    switch (timeFrame) {
      case '24h':
        cutoffTime = now - 24 * 60 * 60 * 1000;
        break;
      case '7d':
        cutoffTime = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case '14d':
        cutoffTime = now - 14 * 24 * 60 * 60 * 1000;
        break;
      default:
        cutoffTime = now - 24 * 60 * 60 * 1000;
    }

    return gasData.filter(entry => entry.timestamp >= cutoffTime);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ethereum Gas Optimizer</h1>
        <p>Track gas prices and find the optimal time to make transactions</p>
      </header>

      <main className="App-main">
        {loading && gasData.length === 0 ? (
          <div className="loading">Loading data...</div>
        ) : error ? (
          <div className="error">Error: {error}</div>
        ) : (
          <>
            <div className="chart-container">
              <div className="chart-header">
                <h2>Gas Price Trends</h2>
                <TimeFrameSelector 
                  selectedTimeFrame={timeFrame} 
                  onTimeFrameChange={handleTimeFrameChange} 
                />
              </div>
              <GasChart 
                data={getFilteredData()} 
                timeFrame={timeFrame} 
                network="ethereum"
              />
            </div>

            <OptimalTimes 
              bestHours={optimalTimes.bestHours} 
              bestDays={optimalTimes.bestDays}
              currentGas={currentGas}
              network="ethereum"
            />
          </>
        )}
      </main>

      <footer className="App-footer">
        <p>
          Data sourced from Ethereum API (Etherscan).
          Refresh interval: 5 minutes.
        </p>
      </footer>
    </div>
  );
}

export default App;
