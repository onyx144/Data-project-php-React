import React, { useState, useEffect, useRef } from 'react';
import Statistics from './components/statistics';
import { calculate } from './components/calculate';
import axios from 'axios';

const SOCKET_URL = "wss://trade.termplat.com:8800/?password=1234";
let worker = new Worker(new URL('./components/worker.js', import.meta.url));

function App() {
  const [quoteCount, setQuoteCount] = useState(100000);
  const [isRunning, setIsRunning] = useState(false);
  const [quotesProcessed, setQuotesProcessed] = useState(0);
  const [statistics, setStatistics] = useState(null);
  
  const statsRef = useRef({
    totalQuotes: 0,
    sum: 0,
    sumOfSquares: 0,
    min: Number.POSITIVE_INFINITY,
    max: Number.NEGATIVE_INFINITY,
    modeMap: {},
    mode: null
  });

  useEffect(() => {
    if (isRunning) {
      const socket = new WebSocket(SOCKET_URL);
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data && Array.isArray(data.values)) {
          worker.postMessage({
            quotes: data.values,
            stats: statsRef.current
          });
        }
      };

      worker.onmessage = (e) => {
        const { totalQuotes, sum, sumOfSquares, min, max, modeMap } = e.data;
        statsRef.current.totalQuotes = totalQuotes;
        statsRef.current.sum = sum;
        statsRef.current.sumOfSquares = sumOfSquares;
        statsRef.current.min = min;
        statsRef.current.max = max;
        statsRef.current.modeMap = modeMap;

        setQuotesProcessed(totalQuotes);
      };

      return () => socket.close();
    }
  }, [isRunning]);

  return (
    <div>
      <h1>Stock Quote Statistics</h1>
      <button onClick={() => setIsRunning(true)}>Start Processing</button>
    </div>
  );
}

export default App;

