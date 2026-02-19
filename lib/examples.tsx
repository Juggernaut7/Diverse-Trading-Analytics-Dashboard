/**
 * EXAMPLES: How to Use Live Data in Your Components
 * 
 * This file shows common patterns for consuming and displaying
 * live Deriverse data in your components.
 */

// ============================================================================
// EXAMPLE 1: Display Connected Status
// ============================================================================

import { useDeriverseData } from '@/hooks/useDeriverseData';

export function ConnectionStatus() {
  const { isConnected, isLoadingData, dataError } = useDeriverseData();

  if (dataError) {
    return (
      <div className="bg-red-900/20 border border-red-700 text-red-200 p-3 rounded">
        <p className="font-semibold">⚠️ Connection Error</p>
        <p className="text-sm">{dataError}</p>
      </div>
    );
  }

  if (isLoadingData) {
    return (
      <div className="bg-blue-900/20 border border-blue-700 text-blue-200 p-3 rounded">
        <p className="font-semibold">Loading data...</p>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="bg-emerald-900/20 border border-emerald-700 text-emerald-200 p-3 rounded">
        <p className="font-semibold">✓ Live Data Connected</p>
        <p className="text-sm">Using on-chain data from Deriverse</p>
      </div>
    );
  }

  return (
    <div className="bg-amber-900/20 border border-amber-700 text-amber-200 p-3 rounded">
      <p className="font-semibold">Demo Mode</p>
      <p className="text-sm">Connect your wallet to see live positions</p>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Display Market Prices
// ============================================================================

export function MarketPrices() {
  const { marketPrices } = useDeriverseData();

  return (
    <div className="grid grid-cols-3 gap-4">
      {Object.entries(marketPrices).map(([symbol, price]) => (
        <div key={symbol} className="bg-[#1F1F1F] p-4 rounded">
          <p className="text-xs text-neutral-500">{symbol}</p>
          <p className="text-lg font-bold text-white">
            ${price.toFixed(2)}
          </p>
          <p className="text-xs text-neutral-400">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: List Active Positions with Real-Time Updates
// ============================================================================

export function PositionsList() {
  const { activePositions, marketPrices } = useDeriverseData();

  if (activePositions.length === 0) {
    return (
      <p className="text-neutral-500 text-sm">
        No open positions. Connect wallet to see your trades.
      </p>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-[#1F1F1F]">
          <th className="text-left text-xs font-semibold text-neutral-400 py-2">
            Symbol
          </th>
          <th className="text-right text-xs font-semibold text-neutral-400 py-2">
            Entry
          </th>
          <th className="text-right text-xs font-semibold text-neutral-400 py-2">
            Current
          </th>
          <th className="text-right text-xs font-semibold text-neutral-400 py-2">
            P&L
          </th>
        </tr>
      </thead>
      <tbody>
        {activePositions.map((position) => {
          const pnlColor = (position.unrealizedPnl || 0) > 0 
            ? 'text-emerald-400' 
            : 'text-red-400';

          return (
            <tr key={position.id} className="border-b border-[#1F1F1F]">
              <td className="py-3 font-medium">
                {position.symbol}
                <span className="ml-2 text-xs text-neutral-500">
                  {position.type === 'long' ? '📈 LONG' : '📉 SHORT'}
                </span>
              </td>
              <td className="text-right text-sm">
                ${position.entryPrice.toFixed(2)}
              </td>
              <td className="text-right text-sm font-medium">
                ${(position.currentPrice || 0).toFixed(2)}
              </td>
              <td className={`text-right font-bold ${pnlColor}`}>
                ${(position.unrealizedPnl || 0).toFixed(2)}
                <span className="text-xs ml-1">
                  ({(position.pnlPercent || 0).toFixed(2)}%)
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ============================================================================
// EXAMPLE 4: Calculate Total Open P&L
// ============================================================================

export function TotalOpenPnL() {
  const { activePositions } = useDeriverseData();

  const totalPnL = activePositions.reduce((sum, pos) => {
    return sum + (pos.unrealizedPnl || 0);
  }, 0);

  const totalValue = totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400';

  return (
    <div className={`text-3xl font-bold ${totalValue}`}>
      ${totalPnL.toFixed(2)}
      <p className="text-xs text-neutral-400 mt-1">
        {activePositions.length} open position{activePositions.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Show Data Fetch Status
// ============================================================================

export function DataFetchStatus() {
  const { isLoadingData, isConnected } = useDeriverseData();

  return (
    <div className="flex items-center gap-2 text-xs text-neutral-400">
      <span className={`w-2 h-2 rounded-full ${
        isLoadingData ? 'bg-yellow-500 animate-pulse' : 
        isConnected ? 'bg-emerald-500' : 'bg-neutral-500'
      }`} />
      <span>
        {isLoadingData ? 'Fetching data...' :
         isConnected ? 'Connected (updates every 10s)' :
         'Demo mode'}
      </span>
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Format Position for Display
// ============================================================================

import { Trade } from '@/lib/types';

export function formatPosition(position: Trade): string {
  const direction = position.type === 'long' ? 'LONG' : 'SHORT';
  const pnl = (position.unrealizedPnl || 0).toFixed(2);
  const pnlPercent = (position.pnlPercent || 0).toFixed(2);
  
  return `${position.symbol} ${direction} - P&L: $${pnl} (${pnlPercent}%)`;
}

// ============================================================================
// EXAMPLE 7: Use in Custom Hook
// ============================================================================

export function useTotalPnL() {
  const { activePositions, closedTrades } = useDeriverseData();

  const openPnL = activePositions.reduce((sum, pos) => {
    return sum + (pos.unrealizedPnl || 0);
  }, 0);

  const closedPnL = closedTrades.reduce((sum, trade) => {
    return sum + (trade.pnl || 0);
  }, 0);

  return {
    openPnL,
    closedPnL,
    totalPnL: openPnL + closedPnL,
  };
}

// Usage:
// const { totalPnL } = useTotalPnL();
// console.log(`Total P&L: $${totalPnL}`);

// ============================================================================
// EXAMPLE 8: Filter Positions by Symbol
// ============================================================================

export function usePositionsBySymbol(symbol?: string) {
  const { activePositions } = useDeriverseData();

  if (!symbol) return activePositions;

  return activePositions.filter(pos => pos.symbol === symbol);
}

// Usage:
// const btcPositions = usePositionsBySymbol('BTC');

// ============================================================================
// EXAMPLE 9: Monitor Position Changes
// ============================================================================

import { useEffect, useRef } from 'react';

export function usePositionChange() {
  const { activePositions } = useDeriverseData();
  const prevPositionsRef = useRef<Trade[]>([]);

  useEffect(() => {
    const prevPositions = prevPositionsRef.current;

    // Check for new positions
    const newPositions = activePositions.filter(
      curr => !prevPositions.find(prev => prev.id === curr.id)
    );

    if (newPositions.length > 0) {
      console.log('New positions opened:', newPositions);
      // Could trigger toast notification, sound, etc.
    }

    // Check for closed positions
    const closedPositions = prevPositions.filter(
      prev => !activePositions.find(curr => curr.id === prev.id)
    );

    if (closedPositions.length > 0) {
      console.log('Positions closed:', closedPositions);
    }

    prevPositionsRef.current = activePositions;
  }, [activePositions]);
}

// ============================================================================
// EXAMPLE 10: Conditional Rendering Based on Connection
// ============================================================================

export function PositionsSection() {
  const { isConnected, activePositions, isLoadingData } = useDeriverseData();

  if (isLoadingData) {
    return <div>Loading positions...</div>;
  }

  if (!isConnected) {
    return <div>Connect your wallet to see your positions</div>;
  }

  if (activePositions.length === 0) {
    return <div>No open positions</div>;
  }

  return <PositionsList />;
}

// ============================================================================
// EXAMPLE 11: Accessing Deriverse Engine Directly
// ============================================================================

import { useDeriverse } from '@/hooks/useDeriverse';

export function DirectEngineAccess() {
  const { engine, isInitializing } = useDeriverse();

  useEffect(() => {
    if (!engine || isInitializing) return;

    // You can access the engine directly for custom operations
    console.log('Instruments:', engine.instruments);
    
    // Custom SDK operations
    engine.updateRoot().then(() => {
      console.log('Markets updated');
    });
  }, [engine, isInitializing]);

  return null;
}

// ============================================================================
// EXPORT ALL EXAMPLES
// ============================================================================

/*
 * Use these components in your dashboard:
 * 
 * import {
 *   ConnectionStatus,
 *   MarketPrices,
 *   PositionsList,
 *   TotalOpenPnL,
 *   DataFetchStatus,
 *   PositionsSection,
 * } from '@/lib/examples';
 * 
 * // In your component:
 * <ConnectionStatus />
 * <TotalOpenPnL />
 * <PositionsList />
 * <DataFetchStatus />
 */
