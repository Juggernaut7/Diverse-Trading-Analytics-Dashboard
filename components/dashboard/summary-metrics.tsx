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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Total PnL - Primary Metric */}
      <Card className="p-6 bg-neutral-900 border-neutral-800">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-400">Total PnL</h3>
            <div
              className={`px-2 py-1 rounded text-xs font-semibold ${
                isPositive ? 'bg-emerald-900 text-emerald-200' : 'bg-red-900 text-red-200'
              }`}
            >
              {isPositive ? '↑' : '↓'}
            </div>
          </div>
          <div className={`text-2xl font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            ${totalPnL.toFixed(2)}
          </div>
          <div className="text-xs text-neutral-500">
            {trades.length} trades • {fees.toFixed(2)} fees
          </div>
        </div>
      </Card>

      {/* Win Rate */}
      <Card className="p-6 bg-neutral-900 border-neutral-800">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-neutral-400">Win Rate</h3>
          <div className="text-2xl font-bold text-white">{winRate}%</div>
          <div className="w-full bg-neutral-800 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all"
              style={{ width: `${winRate}%` }}
            />
          </div>
          <div className="text-xs text-neutral-500">{trades.length > 0 ? 'Above average' : 'No data'}</div>
        </div>
      </Card>

      {/* Trading Volume */}
      <Card className="p-6 bg-neutral-900 border-neutral-800">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-neutral-400">Trading Volume</h3>
          <div className="text-2xl font-bold text-white">${volume.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
          <div className="text-xs text-neutral-500">Total notional value</div>
        </div>
      </Card>

      {/* Average Duration */}
      <Card className="p-6 bg-neutral-900 border-neutral-800">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-neutral-400">Avg Duration</h3>
          <div className="text-2xl font-bold text-white">{avgDuration}m</div>
          <div className="text-xs text-neutral-500">Minutes per trade</div>
        </div>
      </Card>

      {/* Fees Paid */}
      <Card className="p-6 bg-neutral-900 border-neutral-800">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-neutral-400">Fees Paid</h3>
          <div className="text-2xl font-bold text-white">${fees.toFixed(2)}</div>
          <div className="text-xs text-neutral-500">{trades.length > 0 ? ((fees / volume) * 100).toFixed(3) : '0'}% of volume</div>
        </div>
      </Card>
    </div>
  );
}
