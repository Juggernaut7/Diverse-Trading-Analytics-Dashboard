'use client';

import { Trade } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface OpenPositionsProps {
    trades: Trade[];
}

export function OpenPositions({ trades }: OpenPositionsProps) {
    const openTrades = trades.filter((t) => t.status === 'open');

    if (openTrades.length === 0) return null;

    return (
        <Card className="p-6 bg-[#0A0A0A] border-[#1F1F1F]">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <h3 className="text-sm font-semibold text-white">Open Positions</h3>
                    </div>
                    <span className="text-xs text-neutral-400">{openTrades.length} Active</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-[#1F1F1F] text-neutral-500">
                                <th className="pb-3 font-medium">Symbol</th>
                                <th className="pb-3 font-medium">Side</th>
                                <th className="pb-3 font-medium">Entry</th>
                                <th className="pb-3 font-medium">Mark</th>
                                <th className="pb-3 font-medium text-right">Size</th>
                                <th className="pb-3 font-medium text-right">PnL</th>
                                <th className="pb-3 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1F1F1F]">
                            {openTrades.map((trade) => (
                                <tr key={trade.id} className="group hover:bg-neutral-900/50 transition-colors">
                                    <td className="py-3 font-semibold text-white">{trade.pair}</td>
                                    <td className="py-3">
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded ${trade.type === 'long'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                }`}
                                        >
                                            {trade.type.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-3 text-neutral-300">${trade.entryPrice.toLocaleString()}</td>
                                    <td className="py-3 text-neutral-300">
                                        ${trade.currentPrice?.toLocaleString()}
                                    </td>
                                    <td className="py-3 text-right text-neutral-300">
                                        {trade.quantity} {trade.symbol}
                                    </td>
                                    <td className="py-3 text-right">
                                        <div
                                            className={`font-semibold ${(trade.unrealizedPnl || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                                                }`}
                                        >
                                            {(trade.unrealizedPnl || 0) >= 0 ? '+' : ''}$
                                            {trade.unrealizedPnl?.toFixed(2)}
                                        </div>
                                        <div className="text-xs text-neutral-500">
                                            {(trade.pnlPercent || 0) >= 0 ? '+' : ''}
                                            {trade.pnlPercent?.toFixed(2)}%
                                        </div>
                                    </td>
                                    <td className="py-3 text-right">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 text-xs border-neutral-700 hover:bg-neutral-800 hover:text-white"
                                        >
                                            Close
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    );
}
