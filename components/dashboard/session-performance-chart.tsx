import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SessionPerformanceProps {
  data: Array<{
    session: string;
    trades: number;
    pnl: number;
    winRate: number;
  }>;
}

const SESSION_COLORS: Record<string, string> = {
  Asian: '#22c55e', // green
  European: '#ef4444', // red
  US: '#22c55e', // green
};

export function SessionPerformanceChart({ data }: SessionPerformanceProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
          <XAxis dataKey="session" tick={{ fill: '#fff', fontWeight: 700 }} />
          <YAxis tick={{ fill: '#fff' }} />
          <Tooltip
            contentStyle={{ background: '#18181b', borderRadius: 8, color: '#fff', border: '1px solid #333' }}
            labelStyle={{ color: '#fff' }}
          />
          <Bar dataKey="pnl" radius={[8, 8, 0, 0]}>
            {data.map((entry, idx) => (
              <Cell key={entry.session} fill={SESSION_COLORS[entry.session] || '#818cf8'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-around mt-2 text-xs text-neutral-400">
        {data.map((d) => (
          <div key={d.session} className="text-center">
            <div className="font-bold text-white">{d.session}</div>
            <div>Trades: {d.trades}</div>
            <div>Win Rate: {d.winRate}%</div>
            <div className={d.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
              PNL: ${d.pnl}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
