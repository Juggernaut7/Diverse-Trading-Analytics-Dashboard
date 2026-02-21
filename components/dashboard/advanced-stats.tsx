import React from 'react';

interface AdvancedStatsProps {
  sharpeRatio: number;
  profitFactor: number;
  maxDrawdown: number;
  layout?: 'horizontal' | 'vertical';
}

export function AdvancedStats({
  sharpeRatio,
  profitFactor,
  maxDrawdown,
  layout = 'horizontal'
}: AdvancedStatsProps) {
  const isVertical = layout === 'vertical';

  return (
    <div className="w-full">
      <div className={`grid gap-4 ${isVertical ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
        <div className={`bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-center flex-1 max-w-xs mx-auto w-full ${!isVertical ? 'min-w-[180px]' : ''}`}>
          <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Sharpe Ratio</div>
          <div className={`text-xl font-bold ${sharpeRatio >= 0 ? 'text-green-400' : 'text-red-400'}`}>{sharpeRatio.toFixed(2)}</div>
        </div>
        <div className={`bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-center flex-1 max-w-xs mx-auto w-full ${!isVertical ? 'min-w-[180px]' : ''}`}>
          <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Profit Factor</div>
          <div className={`text-xl font-bold ${profitFactor >= 1 ? 'text-green-400' : 'text-red-400'}`}>{profitFactor.toFixed(2)}</div>
        </div>
        <div className={`bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-center flex-1 max-w-xs mx-auto w-full ${!isVertical ? 'min-w-[180px]' : ''}`}>
          <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Max Drawdown</div>
          <div className={`text-xl font-bold ${maxDrawdown <= 0 ? 'text-green-400' : 'text-red-400'}`}>${Math.abs(maxDrawdown).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
