import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TimeOfDayHeatmapProps {
  data: Array<{
    hour: number;
    pnl: number;
    trades: number;
    winRate: number;
  }>;
}

const GREEN = '#22c55e';
const RED = '#ef4444';

export function TimeOfDayHeatmap({ data }: TimeOfDayHeatmapProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
          <XAxis dataKey="hour" tick={{ fill: '#fff', fontWeight: 700 }} />
          <YAxis tick={{ fill: '#fff' }} />
          <Tooltip
            contentStyle={{ background: '#18181b', borderRadius: 8, color: '#fff', border: '1px solid #333' }}
            labelStyle={{ color: '#fff' }}
            formatter={(value: any, name: string) => [value, name === 'pnl' ? 'PNL' : name.charAt(0).toUpperCase() + name.slice(1)]}
          />
          <Bar dataKey="pnl" radius={[8, 8, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.hour} fill={entry.pnl >= 0 ? GREEN : RED} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center mt-2 text-xs text-neutral-400">
        {data.map((d) => (
          <div key={d.hour} className="mx-2 text-center">
            <div className="font-bold text-white">{d.hour}:00</div>
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
