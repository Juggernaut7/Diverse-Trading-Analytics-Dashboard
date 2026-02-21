import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface OrderTypePerformanceProps {
  data: Array<{
    type: string;
    avgPnl: number;
    trades: number;
    winRate: number;
  }>;
}

const GREEN = '#22c55e';
const RED = '#ef4444';

export function OrderTypePerformanceChart({ data }: OrderTypePerformanceProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
          <XAxis dataKey="type" tick={{ fill: '#fff', fontWeight: 700 }} />
          <YAxis tick={{ fill: '#fff' }} />
          <Tooltip
            contentStyle={{ background: '#18181b', borderRadius: 8, color: '#fff', border: '1px solid #333' }}
            labelStyle={{ color: '#fff' }}
          />
          <Bar dataKey="avgPnl" radius={[8, 8, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.type} fill={entry.avgPnl >= 0 ? GREEN : RED} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-around mt-2 text-xs text-neutral-400">
        {data.map((d) => (
          <div key={d.type} className="text-center">
            <div className="font-bold text-white">{d.type}</div>
            <div>Trades: {d.trades}</div>
            <div>Win Rate: {d.winRate}%</div>
            <div className={d.avgPnl >= 0 ? 'text-green-400' : 'text-red-400'}>
              Avg PNL: ${d.avgPnl}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
