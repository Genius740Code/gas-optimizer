import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import moment from 'moment';

// Change the import to get the curve type for recharts
import { curveMonotoneX } from 'd3-shape';

interface GasChartProps {
  data: any[];
  timeFrame: string;
  network: string;
}

const GasChart: React.FC<GasChartProps> = ({ data, timeFrame }) => {
  if (!data || data.length === 0) {
    return <div>Loading data...</div>;
  }

  // Format the x-axis based on the selected timeframe
  const formatXAxis = (timestamp: number) => {
    if (timeFrame === '24h') {
      return moment(timestamp).format('HH:00');
    } else if (timeFrame === '7d') {
      return moment(timestamp).format('ddd HH:00');
    } else {
      return moment(timestamp).format('MM/DD');
    }
  };
  
  // Format value for tooltip display
  const formatValue = (value: number) => {
    return `${value} Gwei`;
  };

  // Custom tooltip to display detailed information
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{ 
          backgroundColor: '#fff', 
          padding: '10px', 
          border: '1px solid #ccc',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0 }}><strong>Time: {moment(data.timestamp).format('YYYY-MM-DD HH:00')}</strong></p>
          <p style={{ margin: 0 }}>Day: {moment(data.timestamp).format('dddd')}</p>
          <p style={{ margin: 0, color: '#8884d8' }}>
            Median Gas Fee: {formatValue(data.avgGas)}
          </p>
          <p style={{ margin: 0, color: '#82ca9d' }}>
            Low Gas Fee: {formatValue(data.lowGas)}
          </p>
          <p style={{ margin: 0, color: '#ff8042' }}>
            High Gas Fee: {formatValue(data.highGas)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Function to smooth data points to reduce noise
  const smoothData = (originalData: any[]): any[] => {
    // If fewer than 5 data points, don't smooth
    if (originalData.length < 5) return originalData;

    // Create a copy of the data to work with
    const data = [...originalData];
    const result = [];

    // Use a moving average algorithm to smooth the data
    const windowSize = Math.min(5, Math.floor(data.length / 4));
    
    for (let i = 0; i < data.length; i++) {
      const item = {...data[i]};
      
      // For each data point, calculate the average of surrounding points
      if (i >= windowSize && i < data.length - windowSize) {
        let lowSum = 0;
        let avgSum = 0;
        let highSum = 0;
        
        for (let j = i - windowSize; j <= i + windowSize; j++) {
          lowSum += data[j].lowGas;
          avgSum += data[j].avgGas;
          highSum += data[j].highGas;
        }
        
        const totalPoints = windowSize * 2 + 1;
        item.lowGas = Math.round((lowSum / totalPoints) * 10) / 10;
        item.avgGas = Math.round((avgSum / totalPoints) * 10) / 10;
        item.highGas = Math.round((highSum / totalPoints) * 10) / 10;
      }
      
      result.push(item);
    }
    
    return result;
  };

  // Apply smoothing to the data
  const smoothedData = smoothData(data);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart
          data={smoothedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatXAxis} 
            type="number"
            domain={['dataMin', 'dataMax']}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotoneX"
            dataKey="lowGas"
            name="Lowest Gas Fee"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
            strokeWidth={2}
            dot={false}
            connectNulls={true}
          />
          <Line
            type="monotoneX"
            dataKey="avgGas"
            name="Median Gas Fee"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            strokeWidth={2}
            dot={false}
            connectNulls={true}
          />
          <Line
            type="monotoneX"
            dataKey="highGas"
            name="Highest Gas Fee"
            stroke="#ff8042"
            activeDot={{ r: 8 }}
            strokeWidth={2}
            dot={false}
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GasChart; 