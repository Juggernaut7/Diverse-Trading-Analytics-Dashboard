export type TradeType = 'long' | 'short';
export type OrderType = 'market' | 'limit' | 'stop-loss' | 'take-profit';

export interface Trade {
  id: string;
  symbol: string;
  type: TradeType;
  entryPrice: number;
  exitPrice?: number; // Optional for open trades
  quantity: number;
  pnl?: number;      // Realized PnL
  pnlPercent?: number;
  entryTime: number; // Unix timestamp
  exitTime?: number; // Unix timestamp
  durationMinutes?: number;
  orderType: OrderType;
  fee: number;
  notes?: string;
  tags?: string[];   // New: for journaling
  pair: string;
  status: 'open' | 'closed';
  currentPrice?: number; // For open positions
  unrealizedPnl?: number; // For open positions
}

export interface DailyMetrics {
  date: string;
  pnl: number;
  trades: number;
  volume: number;
  fees: number;
}

export interface TimeOfDayMetrics {
  hour: number;
  pnl: number;
  trades: number;
  winRate: number;
}

export interface BiasInsight {
  type: 'long' | 'short';
  winRate: number;
  trades: number;
  avgPnl: number;
  recommendation: string;
}
