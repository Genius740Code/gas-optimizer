import React from 'react';
import moment from 'moment';

interface OptimalTimesProps {
  bestHours: { hour: number; avgGas: number }[];
  bestDays: { day: number; dayName: string; avgGas: number }[];
  currentGas?: {
    SafeGasPrice: string;
    ProposeGasPrice: string;
    FastGasPrice: string;
  };
  network: string;
}

const OptimalTimes: React.FC<OptimalTimesProps> = ({ 
  bestHours, 
  bestDays, 
  currentGas
}) => {
  // Format hour to display in 12-hour format
  const formatHour = (hour: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    return `${h}:00 ${ampm}`;
  };

  // Format gas price
  const formatGasPrice = (price: number) => {
    return `${price.toFixed(2)} Gwei`;
  };

  // Calculate the next optimal time for transactions
  const getNextOptimalTime = () => {
    if (!bestHours || bestHours.length === 0) return null;
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0-6, 0 is Sunday
    
    // Sort best hours by their fee (ascending)
    const sortedHours = [...bestHours].sort((a, b) => a.avgGas - b.avgGas);
    
    // Find the next optimal hour that is later than the current hour
    let nextOptimalHour = sortedHours.find(h => h.hour > currentHour);
    
    // If no optimal hour found later today, get the earliest optimal hour tomorrow
    if (!nextOptimalHour && sortedHours.length > 0) {
      nextOptimalHour = sortedHours[0];
      
      // Get the next day
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Calculate next optimal day
      let daysToAdd = 1;
      
      // If we have best days info, find the next best day
      if (bestDays && bestDays.length > 0) {
        const sortedDays = [...bestDays].sort((a, b) => a.avgGas - b.avgGas);
        const nextBestDay = sortedDays.find(d => d.day > currentDay) || sortedDays[0];
        
        // Calculate how many days until the next best day
        daysToAdd = (nextBestDay.day - currentDay + 7) % 7;
        if (daysToAdd === 0) daysToAdd = 7; // If it's the same day, move to next week
      }
      
      // Create the date for optimal time
      const optimalDate = new Date(now);
      optimalDate.setDate(optimalDate.getDate() + daysToAdd);
      optimalDate.setHours(nextOptimalHour.hour, 0, 0, 0);
      
      return {
        hour: nextOptimalHour.hour,
        dayName: moment(optimalDate).format('dddd'),
        fee: nextOptimalHour.avgGas,
        fullDate: optimalDate,
        daysFromNow: daysToAdd
      };
    } else if (nextOptimalHour) {
      // The optimal hour is still today
      const optimalDate = new Date(now);
      optimalDate.setHours(nextOptimalHour.hour, 0, 0, 0);
      
      return {
        hour: nextOptimalHour.hour,
        dayName: 'Today',
        fee: nextOptimalHour.avgGas,
        fullDate: optimalDate,
        daysFromNow: 0
      };
    }
    
    return null;
  };
  
  const nextOptimal = getNextOptimalTime();

  return (
    <div className="optimal-times">
      <div className="current-gas">
        <h2>Current Gas Prices</h2>
        {currentGas ? (
          <div className="gas-prices-cards">
            <div className="gas-card safe">
              <h3>Low Priority</h3>
              <div className="gas-value">{currentGas.SafeGasPrice} <span>Gwei</span></div>
              <div className="gas-description">Save on gas, longer wait time</div>
            </div>
            <div className="gas-card standard">
              <h3>Standard</h3>
              <div className="gas-value">{currentGas.ProposeGasPrice} <span>Gwei</span></div>
              <div className="gas-description">Standard transaction speed</div>
            </div>
            <div className="gas-card fast">
              <h3>Fast</h3>
              <div className="gas-value">{currentGas.FastGasPrice} <span>Gwei</span></div>
              <div className="gas-description">Fast transaction processing</div>
            </div>
          </div>
        ) : (
          <p>Loading current gas prices...</p>
        )}
      </div>

      <div className="recommended-times">
        <h2>Recommended Transaction Times</h2>
        
        {nextOptimal && (
          <div className="next-optimal-time">
            <h3>Next Optimal Time</h3>
            <div className="optimal-time-card">
              <div className="optimal-time-content">
                <div className="optimal-time-day">
                  {nextOptimal.dayName}
                </div>
                <div className="optimal-time-hour">
                  {formatHour(nextOptimal.hour)}
                </div>
                <div className="optimal-time-fee">
                  <span>Expected Gas:</span> {formatGasPrice(nextOptimal.fee)}
                </div>
                {nextOptimal.daysFromNow > 0 && (
                  <div className="optimal-time-eta">
                    {nextOptimal.daysFromNow === 1 ? 'Tomorrow' : `In ${nextOptimal.daysFromNow} days`}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="time-sections">
          <div className="best-hours">
            <h3>Best Hours (Lowest Gas Fees)</h3>
            {bestHours.length > 0 ? (
              <ul>
                {bestHours.map((hourData, index) => (
                  <li key={index}>
                    <span className="time">{formatHour(hourData.hour)}</span>
                    <span className="gas">{formatGasPrice(hourData.avgGas)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Loading best hours data...</p>
            )}
          </div>
          
          <div className="best-days">
            <h3>Best Days of the Week</h3>
            {bestDays.length > 0 ? (
              <ul>
                {bestDays.map((dayData, index) => (
                  <li key={index}>
                    <span className="day">{dayData.dayName}</span>
                    <span className="gas">{formatGasPrice(dayData.avgGas)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Loading best days data...</p>
            )}
          </div>
        </div>
        
        <div className="transaction-tips">
          <h3>Gas Saving Tips</h3>
          <ul>
            <li>Weekend transactions typically have lower gas fees</li>
            <li>Late night/early morning hours (1AM-5AM UTC) usually have reduced network congestion</li>
            <li>Avoid peak hours during weekdays (9AM-5PM UTC)</li>
            <li>Consider batching multiple transactions together when gas is low</li>
            <li>Use Layer 2 solutions like Optimism or Arbitrum for lower fees</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OptimalTimes; 