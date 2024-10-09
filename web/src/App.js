import React, { useState, useEffect, useRef } from 'react';
import Statistics from './components/statistics';
import { calculate } from './components/calculate';
import axios from 'axios';

const SOCKET_URL = "wss://trade.termplat.com:8800/?password=1234";

function App() {
  const [quoteCount, setQuoteCount] = useState(10); 
  const [statistics, setStatistics] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [quotesProcessed, setQuotesProcessed] = useState(0); 
  const statsRef = useRef({
    totalQuotes: 0,
    sum: 0,
    sumOfSquares: 0,
    min: Number.POSITIVE_INFINITY,
    max: Number.NEGATIVE_INFINITY,
    modeMap: {},
    mode: null
  });
  const socketRef = useRef(null);

  const handleQuote = (value) => {
    calculate(value, statsRef.current);
    setQuotesProcessed((prev) => prev + 1);
  };

  useEffect(() => {
    if (isRunning) {
      socketRef.current = new WebSocket(SOCKET_URL);
      console.log('Socket:' , SOCKET_URL);
      console.log('socket Ref:' , socketRef.current);
      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data && data.value) {
          handleQuote(data.value);
        }
      };

      return () => {
        socketRef.current.close();
      };
    }
  }, [isRunning]);

  useEffect(() => {
    if (quotesProcessed >= quoteCount) {

      const stats = {
        average: statsRef.current.sum / statsRef.current.totalQuotes,
        deviation: Math.sqrt((statsRef.current.sumOfSquares / statsRef.current.totalQuotes) - Math.pow(statsRef.current.sum / statsRef.current.totalQuotes, 2)),
        mode: statsRef.current.mode,
        min: statsRef.current.min,
        max: statsRef.current.max,
        totalQuotes: statsRef.current.totalQuotes,
        timestamp: new Date().toISOString()
      };

      setStatistics(stats);

      /*axios.post('https://your-backend-url.com/save-stats', stats)
        .then(response => console.log('Data saved:', response.data))
        .catch(error => console.error('Error saving data:', error));*/
    }
  }, [quotesProcessed, quoteCount]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleShowStatistics = () => {
    console.log(statistics);
   /* axios.get('https://your-backend-url.com/get-stats')
      .then(response => setStatistics(response.data))
      .catch(error => console.error('Error fetching statistics:', error));*/
  };

  return (
    <div>
  <h1>Stock Quote Statistics</h1>
  <div>
    <label>
      Number of quotes:
      <input 
        type="number" 
        value={quoteCount} 
        onChange={(e) => setQuoteCount(Number(e.target.value))} 
      />
    </label>
    <button onClick={handleStart}>Start</button>
    <button onClick={handleShowStatistics}>Statistics</button>
   </div>
  {statistics && <Statistics stats={statistics} />}
</div>
  );
}

export default App;

