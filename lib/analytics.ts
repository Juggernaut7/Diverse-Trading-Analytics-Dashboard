/**
 * Calculate session performance (Asian, European, US)
 */
export const calculateSessionPerformance = (trades: Trade[]) => {
  const sessions = [
    { name: 'Asian', start: 0, end: 8 },
    { name: 'European', start: 8, end: 16 },
    { name: 'US', start: 16, end: 24 },
  ];
  return sessions.map((session) => {
    const sessionTrades = trades.filter((t) => {
      const hour = new Date(t.entryTime).getUTCHours();
      return hour >= session.start && hour < session.end;
    });
    const pnl = sessionTrades.reduce((sum, t) => sum + t.pnl, 0);
    const winRate = sessionTrades.length > 0 ? Math.round((sessionTrades.filter((t) => t.pnl > 0).length / sessionTrades.length) * 100) : 0;
    return {
      session: session.name,
      trades: sessionTrades.length,
      pnl: Math.round(pnl * 100) / 100,
      winRate,
    };
  });
};

/**
 * Calculate Sharpe ratio (annualized, using daily PnL)
 */
export const calculateSharpeRatio = (trades: Trade[]): number => {
  if (trades.length < 2) return 0;
  // Group by day
  const dailyPnls = new Map<string, number>();
  trades.forEach((t) => {
    const day = new Date(t.exitTime || t.entryTime).toISOString().slice(0, 10);
    dailyPnls.set(day, (dailyPnls.get(day) || 0) + t.pnl);
  });
  const returns = Array.from(dailyPnls.values());
  if (returns.length < 2) return 0;
  const mean = returns.reduce((s, r) => s + r, 0) / returns.length;
  const stddev = Math.sqrt(returns.reduce((s, r) => s + Math.pow(r - mean, 2), 0) / (returns.length - 1));
  if (stddev === 0) return 0;
  return Math.round((mean / stddev * Math.sqrt(252)) * 100) / 100;
};

/**
 * Calculate profit factor (gross profit / gross loss)
 */
export const calculateProfitFactor = (trades: Trade[]): number => {
  const grossProfit = trades.filter((t) => t.pnl > 0).reduce((s, t) => s + t.pnl, 0);
  const grossLoss = Math.abs(trades.filter((t) => t.pnl < 0).reduce((s, t) => s + t.pnl, 0));
  if (grossLoss === 0) return grossProfit > 0 ? Infinity : 0;
  return Math.round((grossProfit / grossLoss) * 100) / 100;
};

/**
 * Calculate cumulative fees over time (for area chart)
 */
export const calculateCumulativeFees = (trades: Trade[]): Array<{ date: string; cumulativeFees: number }> => {
  // Sort trades by entry time
  const sorted = [...trades].sort((a, b) => a.entryTime - b.entryTime);
  let cumulative = 0;
  return sorted.map((t) => {
    cumulative += t.fee;
    return {
      date: new Date(t.entryTime).toISOString().slice(0, 10),
      cumulativeFees: Math.round(cumulative * 100) / 100,
    };
  });
};
import { Trade, DailyMetrics, TimeOfDayMetrics, BiasInsight } from './types';

/**
 * Calculate total PnL across all trades
 */
export const calculateTotalPnL = (trades: Trade[]): number => {
  return trades.reduce((sum, trade) => sum + trade.pnl, 0);
};

/**
 * Calculate win rate (percentage of winning trades)
 */
export const calculateWinRate = (trades: Trade[]): number => {
  if (trades.length === 0) return 0;
  const wins = trades.filter((t) => t.pnl > 0).length;
  return Math.round((wins / trades.length) * 100);
};

/**
 * Calculate total trading volume (entry price * quantity for all trades)
 */
export const calculateTotalVolume = (trades: Trade[]): number => {
  return trades.reduce((sum, trade) => sum + trade.entryPrice * trade.quantity, 0);
};

/**
 * Calculate total fees paid
 */
export const calculateTotalFees = (trades: Trade[]): number => {
  return trades.reduce((sum, trade) => sum + trade.fee, 0);
};

/**
 * Calculate average trade duration in minutes
 */
export const calculateAvgDuration = (trades: Trade[]): number => {
  if (trades.length === 0) return 0;
  const totalDuration = trades.reduce((sum, trade) => sum + trade.durationMinutes, 0);
  return Math.round(totalDuration / trades.length);
};

/**
 * Calculate long vs short ratio
 */
export const calculateRatios = (
  trades: Trade[]
): {
  longCount: number;
  shortCount: number;
  longWinRate: number;
  shortWinRate: number;
  longAvgPnl: number;
  shortAvgPnl: number;
} => {
  const longTrades = trades.filter((t) => t.type === 'long');
  const shortTrades = trades.filter((t) => t.type === 'short');

  const longWins = longTrades.filter((t) => t.pnl > 0).length;
  const shortWins = shortTrades.filter((t) => t.pnl > 0).length;

  const longPnL = longTrades.reduce((sum, t) => sum + t.pnl, 0);
  const shortPnL = shortTrades.reduce((sum, t) => sum + t.pnl, 0);

  return {
    longCount: longTrades.length,
    shortCount: shortTrades.length,
    longWinRate: longTrades.length > 0 ? Math.round((longWins / longTrades.length) * 100) : 0,
    shortWinRate: shortTrades.length > 0 ? Math.round((shortWins / shortTrades.length) * 100) : 0,
    longAvgPnl: longTrades.length > 0 ? Math.round((longPnL / longTrades.length) * 100) / 100 : 0,
    shortAvgPnl: shortTrades.length > 0 ? Math.round((shortPnL / shortTrades.length) * 100) / 100 : 0,
  };
};

/**
 * Find largest gain and loss
 */
export const calculateLargestTrades = (
  trades: Trade[]
): {
  largestGain: Trade | null;
  largestLoss: Trade | null;
} => {
  const largestGain = trades.reduce((max, trade) => (trade.pnl > (max?.pnl || -Infinity) ? trade : max), null as Trade | null);
  const largestLoss = trades.reduce((min, trade) => (trade.pnl < (min?.pnl || Infinity) ? trade : min), null as Trade | null);

  return { largestGain, largestLoss };
};

/**
 * Calculate average win and loss amounts
 */
export const calculateAvgWinLoss = (
  trades: Trade[]
): {
  avgWin: number;
  avgLoss: number;
} => {
  const wins = trades.filter((t) => t.pnl > 0);
  const losses = trades.filter((t) => t.pnl < 0);

  const avgWin = wins.length > 0 ? Math.round((wins.reduce((sum, t) => sum + t.pnl, 0) / wins.length) * 100) / 100 : 0;
  const avgLoss = losses.length > 0 ? Math.round((losses.reduce((sum, t) => sum + t.pnl, 0) / losses.length) * 100) / 100 : 0;

  return { avgWin, avgLoss };
};

/**
 * Calculate daily metrics for charts
 */
export const calculateDailyMetrics = (trades: Trade[]): DailyMetrics[] => {
  const metricsMap = new Map<string, { pnl: number; trades: number; volume: number; fees: number }>();

  trades.forEach((trade) => {
    const date = new Date(trade.entryTime).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const existing = metricsMap.get(date) || { pnl: 0, trades: 0, volume: 0, fees: 0 };
    existing.pnl += trade.pnl;
    existing.trades += 1;
    existing.volume += trade.entryPrice * trade.quantity;
    existing.fees += trade.fee;

    metricsMap.set(date, existing);
  });

  return Array.from(metricsMap.entries())
    .map(([date, metrics]) => ({
      date,
      pnl: Math.round(metrics.pnl * 100) / 100,
      trades: metrics.trades,
      volume: Math.round(metrics.volume * 100) / 100,
      fees: Math.round(metrics.fees * 100) / 100,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Calculate metrics by time of day
 */
export const calculateTimeOfDayMetrics = (trades: Trade[]): TimeOfDayMetrics[] => {
  const metricsMap = new Map<number, { pnl: number; trades: number; wins: number }>();

  trades.forEach((trade) => {
    const hour = new Date(trade.entryTime).getHours();
    const existing = metricsMap.get(hour) || { pnl: 0, trades: 0, wins: 0 };
    existing.pnl += trade.pnl;
    existing.trades += 1;
    if (trade.pnl > 0) existing.wins += 1;
    metricsMap.set(hour, existing);
  });

  const result: TimeOfDayMetrics[] = [];
  for (let hour = 0; hour < 24; hour++) {
    const metrics = metricsMap.get(hour);
    if (metrics) {
      result.push({
        hour,
        pnl: Math.round(metrics.pnl * 100) / 100,
        trades: metrics.trades,
        winRate: Math.round((metrics.wins / metrics.trades) * 100),
      });
    }
  }
  return result;
};

/**
 * Calculate fee breakdown by symbol
 */
export const calculateFeeBySymbol = (
  trades: Trade[]
): Array<{
  symbol: string;
  fees: number;
  trades: number;
}> => {
  const feeMap = new Map<string, { fees: number; trades: number }>();

  trades.forEach((trade) => {
    const existing = feeMap.get(trade.symbol) || { fees: 0, trades: 0 };
    existing.fees += trade.fee;
    existing.trades += 1;
    feeMap.set(trade.symbol, existing);
  });

  return Array.from(feeMap.entries())
    .map(([symbol, data]) => ({
      symbol,
      fees: Math.round(data.fees * 100) / 100,
      trades: data.trades,
    }))
    .sort((a, b) => b.fees - a.fees);
};

/**
 * Calculate order type performance
 */
export const calculateOrderTypePerformance = (
  trades: Trade[]
): Array<{
  type: string;
  avgPnl: number;
  trades: number;
  winRate: number;
}> => {
  const typeMap = new Map<string, { pnl: number; trades: number; wins: number }>();

  trades.forEach((trade) => {
    const existing = typeMap.get(trade.orderType) || { pnl: 0, trades: 0, wins: 0 };
    existing.pnl += trade.pnl;
    existing.trades += 1;
    if (trade.pnl > 0) existing.wins += 1;
    typeMap.set(trade.orderType, existing);
  });

  return Array.from(typeMap.entries())
    .map(([type, data]) => ({
      type,
      avgPnl: Math.round((data.pnl / data.trades) * 100) / 100,
      trades: data.trades,
      winRate: Math.round((data.wins / data.trades) * 100),
    }))
    .sort((a, b) => b.avgPnl - a.avgPnl);
};

/**
 * Generate AI-like bias insights
 */
export const generateBiasInsights = (trades: Trade[]): BiasInsight[] => {
  const { longCount, shortCount, longWinRate, shortWinRate, longAvgPnl, shortAvgPnl } = calculateRatios(trades);

  const insights: BiasInsight[] = [];

  if (longCount > 0) {
    insights.push({
      type: 'long',
      winRate: longWinRate,
      trades: longCount,
      avgPnl: longAvgPnl,
      recommendation: 
        longWinRate >= 55
          ? 'Your long trades are strong—consider scaling position size when setups align.'
          : longWinRate < 40
            ? 'Long trades underperform—focus on entry quality or consider reducing size.'
            : 'Long bias is balanced—maintain current approach.',
    });
  }

  if (shortCount > 0) {
    insights.push({
      type: 'short',
      winRate: shortWinRate,
      trades: shortCount,
      avgPnl: shortAvgPnl,
      recommendation:
        shortWinRate >= 55
          ? 'Short trades excel—this is your strength; prioritize short setups.'
          : shortWinRate < 40
            ? 'Short trades lag—consider taking only high-conviction setups.'
            : 'Short bias is neutral—diversify with mixed directional setups.',
    });
  }

  return insights;
};

/**
 * Calculate maximum drawdown
 */
export const calculateMaxDrawdown = (trades: Trade[]): number => {
  if (trades.length === 0) return 0;

  let peak = 0;
  let maxDrawdown = 0;
  let runningPnL = 0;

  trades.forEach((trade) => {
    runningPnL += trade.pnl;
    if (runningPnL > peak) {
      peak = runningPnL;
    }
    const drawdown = peak - runningPnL;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });

  return Math.round(maxDrawdown * 100) / 100;
};

/**
 * Filter trades by symbol and date range
 */
export const filterTrades = (
  trades: Trade[],
  options?: {
    symbol?: string;
    startDate?: number;
    endDate?: number;
  }
): Trade[] => {
  let filtered = trades;

  if (options?.symbol) {
    filtered = filtered.filter((t) => t.symbol === options.symbol);
  }

  if (options?.startDate) {
    filtered = filtered.filter((t) => t.entryTime >= options.startDate!);
  }

  if (options?.endDate) {
    filtered = filtered.filter((t) => t.entryTime <= options.endDate!);
  }

  return filtered;
};

/**
 * Export trades to CSV format
 */
export const exportTradesCSV = (trades: Trade[]): string => {
  const headers = [
    'ID',
    'Symbol',
    'Pair',
    'Type',
    'Entry Price',
    'Exit Price',
    'Quantity',
    'PnL',
    'PnL %',
    'Duration (min)',
    'Order Type',
    'Fee',
    'Entry Time',
    'Exit Time',
    'Notes',
  ];

  const rows = trades.map((trade) => [
    trade.id,
    trade.symbol,
    trade.pair,
    trade.type,
    trade.entryPrice,
    trade.exitPrice,
    trade.quantity,
    trade.pnl,
    trade.pnlPercent,
    trade.durationMinutes,
    trade.orderType,
    trade.fee,
    new Date(trade.entryTime).toISOString(),
    new Date(trade.exitTime).toISOString(),
    trade.notes || '',
  ]);

  const csv = [headers, ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');

  return csv;
};
