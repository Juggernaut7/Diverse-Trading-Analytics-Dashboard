'use client';

import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface CumulativeFeeChartProps {
  data: Array<{
    date: string;
    cumulativeFees: number;
  }>;
}

const EMPTY_DATA: Array<{ date: string; cumulativeFees: number }> = [];

function CumulativeFeeChartInner({ data }: CumulativeFeeChartProps) {
  const safeData = useMemo(() => {
    if (!data || !Array.isArray(data)) return EMPTY_DATA;
    return data.length > 0 ? data : EMPTY_DATA;
  }, [data]);

  if (safeData.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center rounded-lg bg-neutral-900/50 border border-neutral-800">
        <p className="text-sm text-neutral-500">No fee data yet</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 min-h-[16rem]" style={{ contain: 'layout' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={safeData}
          margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
          syncId="cumulative-fee-chart"
        >
          <XAxis dataKey="date" tick={{ fill: '#fff', fontWeight: 700, fontSize: 12 }} />
          <YAxis tick={{ fill: '#fff', fontSize: 12 }} />
          <Tooltip
            contentStyle={{ background: '#18181b', borderRadius: 8, color: '#fff', border: '1px solid #333' }}
            labelStyle={{ color: '#fff' }}
            formatter={(value: unknown) => [`$${Number(value)}`, 'Cumulative Fees']}
          />
          <Area
            type="monotone"
            dataKey="cumulativeFees"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.15}
            strokeWidth={3}
            isAnimationActive={false}
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-center mt-2 text-xs text-neutral-400">
        <div className={safeData[safeData.length - 1].cumulativeFees >= 0 ? 'text-green-400' : 'text-red-400'}>
          Cumulative: ${safeData[safeData.length - 1].cumulativeFees.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export const CumulativeFeeChart = React.memo(CumulativeFeeChartInner);
