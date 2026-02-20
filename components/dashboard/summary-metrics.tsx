'use client';

import { Trade } from '@/lib/types';
import {
  calculateTotalPnL,
  calculateWinRate,
  calculateTotalVolume,
  calculateTotalFees,
  calculateAvgDuration,
} from '@/lib/analytics';
import { Card } from '@/components/ui/card';

interface SummaryMetricsProps {
  trades: Trade[];
}

export function SummaryMetrics({ trades }: SummaryMetricsProps) {
  const totalPnL = calculateTotalPnL(trades);
  const winRate = calculateWinRate(trades);
  const volume = calculateTotalVolume(trades);
  const fees = calculateTotalFees(trades);
  const avgDuration = calculateAvgDuration(trades);

  const isPositive = totalPnL >= 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
      {/* Total PnL - Primary Metric */}
      <Card className="p-3 sm:p-6 bg-neutral-900 border-neutral-800">
        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-medium text-neutral-400">Total PnL</h3>
            <div
              className={`px-2 py-1 rounded text-xs font-semibold ${
                isPositive ? 'bg-emerald-900 text-emerald-200' : 'bg-red-900 text-red-200'
              }`}
            >
              {isPositive ? '↑' : '↓'}
            </div>
          </div>
          <div className={`text-lg sm:text-2xl font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            ${totalPnL.toFixed(2)}
          </div>
          <div className="text-xs text-neutral-500">
            {trades.length} trades
          </div>
        </div>
      </Card>

      {/* Win Rate */}
      <Card className="p-3 sm:p-6 bg-neutral-900 border-neutral-800">
        <div className="flex flex-col gap-2 sm:gap-3">
          <h3 className="text-xs sm:text-sm font-medium text-neutral-400">Win Rate</h3>
          <div className="text-lg sm:text-2xl font-bold text-white">{winRate}%</div>
          <div className="w-full bg-neutral-800 rounded-full h-1.5">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all"
              style={{ width: `${winRate}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Trading Volume */}
      <Card className="p-3 sm:p-6 bg-neutral-900 border-neutral-800">
        <div className="flex flex-col gap-2 sm:gap-3">
          <h3 className="text-xs sm:text-sm font-medium text-neutral-400">Volume</h3>
          <div className="text-lg sm:text-2xl font-bold text-white">${(volume / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 })}K</div>
          <div className="text-xs text-neutral-500">Notional</div>
        </div>
      </Card>

      {/* Average Duration */}
      <Card className="p-3 sm:p-6 bg-neutral-900 border-neutral-800">
        <div className="flex flex-col gap-2 sm:gap-3">
          <h3 className="text-xs sm:text-sm font-medium text-neutral-400">Avg Time</h3>
          <div className="text-lg sm:text-2xl font-bold text-white">{avgDuration}m</div>
          <div className="text-xs text-neutral-500">Per trade</div>
        </div>
      </Card>

      {/* Fees Paid */}
      <Card className="p-3 sm:p-6 bg-neutral-900 border-neutral-800">
        <div className="flex flex-col gap-2 sm:gap-3">
          <h3 className="text-xs sm:text-sm font-medium text-neutral-400">Fees</h3>
          <div className="text-lg sm:text-2xl font-bold text-white">${fees.toFixed(2)}</div>
          <div className="text-xs text-neutral-500">{trades.length > 0 ? ((fees / volume) * 100).toFixed(2) : '0'}%</div>
        </div>
      </Card>
    </div>
  );
}
