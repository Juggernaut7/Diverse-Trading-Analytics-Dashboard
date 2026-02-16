'use client';

import { Trade } from '@/lib/types';
import {
  calculateLargestTrades,
  calculateAvgWinLoss,
  calculateMaxDrawdown,
  calculateFeeBySymbol,
  generateBiasInsights,
} from '@/lib/analytics';
import { Card } from '@/components/ui/card';

interface StatsAndInsightsProps {
  trades: Trade[];
}

export function StatsAndInsights({ trades }: StatsAndInsightsProps) {
  const { largestGain, largestLoss } = calculateLargestTrades(trades);
  const { avgWin, avgLoss } = calculateAvgWinLoss(trades);
  const maxDrawdown = calculateMaxDrawdown(trades);
  const feeBySymbol = calculateFeeBySymbol(trades);
  const biasInsights = generateBiasInsights(trades);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Largest Trades */}
      <Card className="p-6 bg-neutral-900 border-neutral-800">
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white">Largest Trades</h3>

          {largestGain ? (
            <div className="space-y-3">
              <div className="bg-neutral-800 p-4 rounded-lg border-l-4 border-emerald-500">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-xs text-neutral-400">Largest Gain</div>
                    <div className="text-lg font-bold text-emerald-400">
                      +${largestGain.pnl.toFixed(2)}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      {largestGain.symbol} • {largestGain.type} • {largestGain.pnlPercent.toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-neutral-400">Duration</div>
                    <div className="text-sm font-semibold text-white">{largestGain.durationMinutes}m</div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {largestLoss ? (
            <div className="space-y-3">
              <div className="bg-neutral-800 p-4 rounded-lg border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-xs text-neutral-400">Largest Loss</div>
                    <div className="text-lg font-bold text-red-400">
                      ${largestLoss.pnl.toFixed(2)}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      {largestLoss.symbol} • {largestLoss.type} • {largestLoss.pnlPercent.toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-neutral-400">Duration</div>
                    <div className="text-sm font-semibold text-white">{largestLoss.durationMinutes}m</div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {!largestGain && !largestLoss && (
            <div className="text-neutral-500 text-sm">No trades found</div>
          )}
        </div>
      </Card>

      {/* Risk Metrics */}
      <Card className="p-6 bg-neutral-900 border-neutral-800">
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white">Risk Metrics</h3>

          <div className="space-y-3">
            <div className="bg-neutral-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-400">Average Win</span>
                <span className="text-lg font-bold text-emerald-400">${avgWin.toFixed(2)}</span>
              </div>
              <div className="w-full bg-neutral-700 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (avgWin / Math.max(avgWin, Math.abs(avgLoss))) * 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-neutral-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-400">Average Loss</span>
                <span className="text-lg font-bold text-red-400">${avgLoss.toFixed(2)}</span>
              </div>
              <div className="w-full bg-neutral-700 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (Math.abs(avgLoss) / Math.max(avgWin, Math.abs(avgLoss))) * 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-neutral-800 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Max Drawdown</span>
                <span className="text-lg font-bold text-red-400">-${maxDrawdown.toFixed(2)}</span>
              </div>
              <div className="text-xs text-neutral-500 mt-2">Largest peak-to-trough decline</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Fee Breakdown */}
      <Card className="p-6 bg-neutral-900 border-neutral-800">
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white">Fee Breakdown by Symbol</h3>

          {feeBySymbol.length > 0 ? (
            <div className="space-y-2">
              {feeBySymbol.map((item) => (
                <div key={item.symbol} className="bg-neutral-800 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{item.symbol}</span>
                    <span className="text-sm text-neutral-400">{item.trades} trades</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-neutral-500">Total fees</div>
                    <div className="text-sm font-bold text-white">${item.fees.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-neutral-500 text-sm">No fee data</div>
          )}
        </div>
      </Card>

      {/* AI-Powered Bias Insights */}
      <Card className="p-6 bg-neutral-900 border-neutral-800">
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white">Bias Insights</h3>

          {biasInsights.length > 0 ? (
            <div className="space-y-3">
              {biasInsights.map((insight) => (
                <div
                  key={insight.type}
                  className="bg-neutral-800 p-4 rounded-lg border-l-4"
                  style={{
                    borderLeftColor: insight.type === 'long' ? '#10b981' : '#ef4444',
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-sm font-semibold text-white capitalize">
                        {insight.type === 'long' ? 'Long' : 'Short'} Bias
                      </div>
                      <div className="text-xs text-neutral-400 mt-1">{insight.trades} trades</div>
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        insight.type === 'long' ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {insight.winRate}%
                    </div>
                  </div>
                  <div className="text-xs text-neutral-300 italic mt-3">
                    "{insight.recommendation}"
                  </div>
                  <div className="text-xs text-neutral-500 mt-2">
                    Avg PnL: ${insight.avgPnl.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-neutral-500 text-sm">No trading data to analyze</div>
          )}
        </div>
      </Card>
    </div>
  );
}
