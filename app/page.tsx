'use client';

import { useState, useMemo, useEffect } from 'react';
import { SummaryMetrics } from '@/components/dashboard/summary-metrics';
import { Filters, FilterState } from '@/components/dashboard/filters';
import { Charts } from '@/components/dashboard/charts';
import { TradeHistory } from '@/components/dashboard/trade-history';
import { StatsAndInsights } from '@/components/dashboard/stats-and-insights';
import { ExportImport } from '@/components/dashboard/export-import';
import { OpenPositions } from '@/components/dashboard/open-positions';
import { WalletConnectSection } from '@/components/dashboard/wallet-connect-section';
import { SessionPerformanceChart } from '@/components/dashboard/session-performance-chart';
import { TimeOfDayHeatmap } from '@/components/dashboard/time-of-day-heatmap';
import { OrderTypePerformanceChart } from '@/components/dashboard/order-type-performance-chart';
import { CumulativeFeeChart } from '@/components/dashboard/cumulative-fee-chart';
import { AdvancedStats } from '@/components/dashboard/advanced-stats';
import {
  calculateSessionPerformance,
  calculateTimeOfDayMetrics,
  calculateOrderTypePerformance,
  calculateCumulativeFees,
  calculateSharpeRatio,
  calculateProfitFactor,
  calculateMaxDrawdown
} from '@/lib/analytics';
import { MOCK_TRADES, MOCK_SYMBOLS } from '@/lib/mock-trades';
import { Trade } from '@/lib/types';
import { useDeriverseData } from '@/hooks/useDeriverseData';
import { mergeTrades } from '@/lib/deriverse-adapters';

import { AssistantWidget } from '@/components/assistant-widget';

export default function Dashboard() {
  const { activePositions, closedTrades: sdkClosedTrades, marketPrices, isConnected, isLoadingData, dataError } = useDeriverseData();
  const [filters, setFilters] = useState<FilterState>({});
  const [trades, setTrades] = useState<Trade[]>(MOCK_TRADES);
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});

  // Strategy: 
  // 1. Use SDK data when connected, fallback to mock for closed trades (until we have an indexer)
  // 2. Always prefer real open positions from SDK when available
  // 3. For closed trades, merge SDK data with mock data (SDK data takes precedence)

  useEffect(() => {
    // Merge mock trades with SDK trades
    // SDK trades take precedence over mock trades with same ID
    const allTrades = mergeTrades(MOCK_TRADES, sdkClosedTrades);
    setTrades(allTrades);
  }, [sdkClosedTrades]);

  // Apply filters
  const filteredTrades = useMemo(() => {
    let result = trades;

    if (filters.symbol) {
      result = result.filter((t) => t.symbol === filters.symbol);
    }

    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = Date.now();
      const periods: Record<string, number> = {
        '1d': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '90d': 90 * 24 * 60 * 60 * 1000,
      };

      const periodMs = periods[filters.dateRange];
      if (periodMs) {
        result = result.filter((t) => t.entryTime >= now - periodMs);
      }
    }

    return result;
  }, [trades, filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleNotesUpdate = (tradeId: string, notes: string) => {
    // Update notes in memory map
    setNotesMap((prev) => ({
      ...prev,
      [tradeId]: notes,
    }));

    // Also update in trades array for persistence
    setTrades((prevTrades) =>
      prevTrades.map((trade) => (trade.id === tradeId ? { ...trade, notes } : trade))
    );
  };

  // Separate open and closed trades for different sections
  // Use SDK active positions when connected, fallback to mock
  const openTrades = isConnected && activePositions.length > 0
    ? activePositions
    : filteredTrades.filter(t => t.status === 'open');

  const closedTrades = filteredTrades.filter(t => t.status !== 'open');

  // Add notes from notesMap to trades
  const tradesWithNotes = closedTrades.map(trade => ({
    ...trade,
    notes: notesMap[trade.id] || trade.notes || '',
  }));

  // Handle journal modal save (annotation, strategy, sentiment)
  const handleJournalUpdate = (entry) => {
    setTrades((prevTrades) => prevTrades.map((trade) =>
      trade.id === entry.id ? { ...trade, ...entry } : trade
    ));
    // If notes changed, update notesMap for consistency
    if (entry.notes) {
      setNotesMap((prev) => ({ ...prev, [entry.id]: entry.notes }));
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-[#1F1F1F] bg-[#0A0A0A]/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent truncate">
                Trading Dashboard
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Deriverse Protocol Analytics
              </p>
            </div>
            <div className="hidden sm:block text-right flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-lg sm:text-2xl font-bold text-emerald-400 neon-text-green">
                    ${closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0).toFixed(2)}
                  </div>
                  <p className="text-xs text-neutral-400">Realized P&L</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="space-y-6">
          {/* Wallet Section - Full Width */}
          <div className="w-full">
            <WalletConnectSection />
          </div>

          {/* Data Error Alert - Full Width */}
          {dataError && (
            <div className="w-full bg-red-900/20 border border-red-700 text-red-200 p-3 rounded text-xs">
              <p className="font-semibold">⚠️ Data Error</p>
              <p>{dataError}</p>
            </div>
          )}

          {/* Filters and Export Side by Side - Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="w-full">
              <Filters
                symbols={MOCK_SYMBOLS}
                onFilterChange={handleFilterChange}
                selectedSymbol={filters.symbol}
                selectedDateRange={filters.dateRange}
              />
            </div>
            <div className="w-full">
              <ExportImport trades={filteredTrades} />
            </div>
          </div>

          {/* Open Positions - Full Width */}
          <div className="w-full">
            <OpenPositions trades={openTrades} />
          </div>


          {/* Key Metrics */}
          <SummaryMetrics trades={tradesWithNotes} />

          {/* Advanced Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <SessionPerformanceChart data={calculateSessionPerformance(tradesWithNotes)} />
              <OrderTypePerformanceChart data={calculateOrderTypePerformance(tradesWithNotes)} />
              <CumulativeFeeChart data={calculateCumulativeFees(tradesWithNotes)} />
            </div>
            <div className="space-y-6">
              <TimeOfDayHeatmap data={calculateTimeOfDayMetrics(tradesWithNotes)} />
            </div>
          </div>

          {/* Advanced Stats - Always below heatmap, never overlapping */}
          <div className="mt-6">
            <AdvancedStats
              sharpeRatio={calculateSharpeRatio(tradesWithNotes)}
              profitFactor={calculateProfitFactor(tradesWithNotes)}
              maxDrawdown={calculateMaxDrawdown(tradesWithNotes)}
            />
          </div>

          {/* Charts Section */}
          <Charts trades={tradesWithNotes} />

          {/* Stats and Insights */}
          <StatsAndInsights trades={tradesWithNotes} />

          {/* Trade History - Only Closed Trades */}
          <TradeHistory
            trades={tradesWithNotes}
            onNotesUpdate={handleNotesUpdate}
            onJournalUpdate={handleJournalUpdate}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1F1F1F] bg-[#0A0A0A] mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-neutral-600">
            Deriverse Trading Analytics Dashboard • On-Chain Data • Powered by Solana
          </p>
        </div>
      </footer>
      <AssistantWidget />
    </div>
  );
}
