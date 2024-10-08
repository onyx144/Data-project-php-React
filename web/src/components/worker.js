onmessage = function (e) {
    const { quotes, stats } = e.data;
    
    let sum = stats.sum;
    let sumOfSquares = stats.sumOfSquares;
    let totalQuotes = stats.totalQuotes;
    let min = stats.min;
    let max = stats.max;
    let modeMap = stats.modeMap;
  
    for (let i = 0; i < quotes.length; i++) {
      const newValue = quotes[i];
      totalQuotes += 1;
      sum += newValue;
      sumOfSquares += newValue * newValue;
  
      min = Math.min(min, newValue);
      max = Math.max(max, newValue);
  
      modeMap[newValue] = (modeMap[newValue] || 0) + 1;
      if (!stats.mode || modeMap[newValue] > modeMap[stats.mode]) {
        stats.mode = newValue;
      }
    }
  
    postMessage({
      totalQuotes, sum, sumOfSquares, min, max, modeMap
    });
  };
  