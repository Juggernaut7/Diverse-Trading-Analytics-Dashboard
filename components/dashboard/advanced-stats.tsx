import React from 'react';

interface AdvancedStatsProps {
  sharpeRatio: number;
  profitFactor: number;
  maxDrawdown: number;
}

export function AdvancedStats({ sharpeRatio, profitFactor, maxDrawdown }: AdvancedStatsProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 text-center min-w-[180px] flex-1 max-w-xs mx-auto">
          <div className="text-xs text-neutral-400 mb-1">Sharpe Ratio</div>
          <div className={`text-2xl font-bold ${sharpeRatio >= 0 ? 'text-green-400' : 'text-red-400'}`}>{sharpeRatio}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 text-center min-w-[180px] flex-1 max-w-xs mx-auto">
          <div className="text-xs text-neutral-400 mb-1">Profit Factor</div>
          <div className={`text-2xl font-bold ${profitFactor >= 1 ? 'text-green-400' : 'text-red-400'}`}>{profitFactor}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 text-center min-w-[180px] flex-1 max-w-xs mx-auto">
          <div className="text-xs text-neutral-400 mb-1">Max Drawdown</div>
          <div className={`text-2xl font-bold ${maxDrawdown <= 0 ? 'text-green-400' : 'text-red-400'}`}>${maxDrawdown}</div>
        </div>
      </div>
    </div>
  );
}
