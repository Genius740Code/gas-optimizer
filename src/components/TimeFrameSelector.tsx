import React from 'react';

interface TimeFrameSelectorProps {
  selectedTimeFrame: string;
  onTimeFrameChange: (timeFrame: string) => void;
}

const TimeFrameSelector: React.FC<TimeFrameSelectorProps> = ({
  selectedTimeFrame,
  onTimeFrameChange,
}) => {
  const timeFrames = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '14d', label: 'Last 14 Days' },
  ];

  return (
    <div className="timeframe-selector">
      <h3>Select Time Frame</h3>
      <div className="button-group">
        {timeFrames.map((timeFrame) => (
          <button
            key={timeFrame.value}
            className={`timeframe-btn ${selectedTimeFrame === timeFrame.value ? 'active' : ''}`}
            onClick={() => onTimeFrameChange(timeFrame.value)}
          >
            {timeFrame.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeFrameSelector; 