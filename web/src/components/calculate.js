import { mean, std, mode, min, max } from 'mathjs';

export const calculate = (newValue, stats) => {
    stats.totalQuotes += 1;
    stats.sum += newValue;
    stats.sumOfSquares += newValue * newValue;
    
    // Минимум и максимум
    stats.min = Math.min(stats.min, newValue);
    stats.max = Math.max(stats.max, newValue);
    
    // Мода (используем Map для отслеживания частоты)
    stats.modeMap[newValue] = (stats.modeMap[newValue] || 0) + 1;
    if (!stats.mode || stats.modeMap[newValue] > stats.modeMap[stats.mode]) {
      stats.mode = newValue;
    }
  };