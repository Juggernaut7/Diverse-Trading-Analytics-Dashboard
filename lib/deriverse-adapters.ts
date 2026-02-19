/**
 * Adapters to convert Deriverse SDK data structures into dashboard Trade format
 * This layer handles the transformation from on-chain structures to UI-friendly formats
 */

import { Trade, OrderType } from './types';
import { getSymbolForInstrumentId } from './parsers';

/**
 * Maps Deriverse order types to dashboard order types
 * Adjust based on actual Deriverse SDK order type values
 */
function mapOrderType(sdkOrderType?: string | number): OrderType {
  const typeMap: Record<string | number, OrderType> = {
    'market': 'market',
    'limit': 'limit',
    'stop': 'stop-loss',
    'stop-loss': 'stop-loss',
    'take-profit': 'take-profit',
    0: 'market',
    1: 'limit',
    2: 'stop-loss',
  };

  if (sdkOrderType === undefined || sdkOrderType === null) {
    return 'market';
  }

  return typeMap[sdkOrderType] || 'market';
}

/**
 * Converts a Deriverse perpetual position to a Trade object (open position)
 * 
 * @param position - The perpetual position from SDK
 * @param marketPrice - Current market price for the instrument
 * @param symbol - The trading pair symbol (e.g., 'SOL/USDC')
 * @returns Trade object representing the open position
 */
export function convertPerpPositionToTrade(
  position: any,
  marketPrice: number,
  symbol: string,
  instrumentId?: number
): Trade | null {
  try {
    if (!position || marketPrice <= 0) return null;

    // Extract position data from SDK structure
    const basePrice = position.entryPrice || position.openPrice || 0;
    const size = position.size || position.quantity || 0;
    const isLong = position.isLong || position.side === 'long';

    if (size === 0 || basePrice === 0) return null;

    // Calculate P&L
    const priceDiff = marketPrice - basePrice;
    const unrealizedPnl = isLong ? priceDiff * size : -priceDiff * size;
    const pnlPercent = (priceDiff / basePrice) * 100 * (isLong ? 1 : -1);

    const trade: Trade = {
      id: position.id || `perp-${instrumentId}-${Date.now()}`,
      symbol: symbol.split('/')[0],
      pair: symbol,
      type: isLong ? 'long' : 'short',
      entryPrice: basePrice,
      quantity: size,
      entryTime: position.openTime || Date.now(),
      currentPrice: marketPrice,
      unrealizedPnl,
      pnlPercent,
      orderType: mapOrderType(position.orderType),
      fee: position.fee || 0,
      notes: position.notes || '',
      tags: position.tags || [],
      status: 'open',
    };

    return trade;
  } catch (error) {
    console.error('Error converting perp position to trade:', error, position);
    return null;
  }
}

/**
 * Converts a closed Deriverse order/trade to a Trade object
 * 
 * @param order - The closed order from SDK history
 * @param symbol - The trading pair symbol
 * @returns Trade object representing the closed trade
 */
export function convertClosedOrderToTrade(
  order: any,
  symbol: string,
  instrumentId?: number
): Trade | null {
  try {
    if (!order || !order.entryPrice || !order.exitPrice) return null;

    const isLong = order.isLong || order.side === 'long' || order.type === 'long';
    const entryPrice = order.entryPrice;
    const exitPrice = order.exitPrice;
    const quantity = order.size || order.quantity || 0;

    if (quantity === 0) return null;

    // Calculate realized P&L
    const priceDiff = exitPrice - entryPrice;
    const realizedPnl = isLong ? priceDiff * quantity : -priceDiff * quantity;
    const pnlPercent = (priceDiff / entryPrice) * 100 * (isLong ? 1 : -1);

    const entryTime = order.openTime || order.entryTime || Date.now();
    const exitTime = order.closeTime || order.exitTime || Date.now();
    const durationMinutes = Math.round((exitTime - entryTime) / (1000 * 60));

    const trade: Trade = {
      id: order.id || `order-${instrumentId}-${entryTime}`,
      symbol: symbol.split('/')[0],
      pair: symbol,
      type: isLong ? 'long' : 'short',
      entryPrice,
      exitPrice,
      quantity,
      pnl: realizedPnl,
      pnlPercent,
      entryTime,
      exitTime,
      durationMinutes: Math.max(durationMinutes, 1),
      orderType: mapOrderType(order.orderType),
      fee: order.fee || 0,
      notes: order.notes || '',
      tags: order.tags || [],
      status: 'closed',
    };

    return trade;
  } catch (error) {
    console.error('Error converting closed order to trade:', error, order);
    return null;
  }
}

/**
 * Batch converts multiple positions to trades
 */
export function convertPositionsToTrades(
  positions: any[],
  marketPrices: Record<string, number>,
  instrumentSymbolMap: Record<number, string>
): Trade[] {
  return positions
    .map((pos) => {
      const instrumentId = pos.instrumentId || pos.id;
      const symbol = instrumentSymbolMap[instrumentId] || `INSTR-${instrumentId}`;
      const price = marketPrices[instrumentId.toString()] || marketPrices[symbol] || 0;
      return convertPerpPositionToTrade(pos, price, symbol, instrumentId);
    })
    .filter((trade): trade is Trade => trade !== null);
}

/**
 * Batch converts multiple closed orders to trades
 */
export function convertOrdersToTrades(
  orders: any[],
  instrumentSymbolMap: Record<number, string>
): Trade[] {
  return orders
    .map((order) => {
      const instrumentId = order.instrumentId || order.id;
      const symbol = instrumentSymbolMap[instrumentId] || `INSTR-${instrumentId}`;
      return convertClosedOrderToTrade(order, symbol, instrumentId);
    })
    .filter((trade): trade is Trade => trade !== null);
}

/**
 * Filters trades by date range (for dashboard filtering)
 */
export function filterTradesByDateRange(
  trades: Trade[],
  dateRange: '1d' | '7d' | '30d' | '90d' | 'all'
): Trade[] {
  if (dateRange === 'all') return trades;

  const now = Date.now();
  const periods: Record<string, number> = {
    '1d': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
    '90d': 90 * 24 * 60 * 60 * 1000,
  };

  const periodMs = periods[dateRange];
  return trades.filter((t) => t.entryTime >= now - periodMs);
}

/**
 * Merges mock trades with SDK trades, deduplicating based on ID
 * SDK trades take precedence if both exist with same ID
 */
export function mergeTrades(mockTrades: Trade[], sdkTrades: Trade[]): Trade[] {
  const tradeMap = new Map<string, Trade>();

  // Add mock trades first
  mockTrades.forEach((trade) => {
    tradeMap.set(trade.id, trade);
  });

  // Add SDK trades (overwrite if duplicate)
  sdkTrades.forEach((trade) => {
    tradeMap.set(trade.id, trade);
  });

  return Array.from(tradeMap.values());
}
