
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface CumulativeFeeChartProps {
  data: Array<{
    date: string;
    cumulativeFees: number;
  }>;
}

export function CumulativeFeeChart({ data }: CumulativeFeeChartProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
          <XAxis dataKey="date" tick={{ fill: '#fff', fontWeight: 700, fontSize: 12 }} />
          <YAxis tick={{ fill: '#fff', fontSize: 12 }} />
          <Tooltip
            contentStyle={{ background: '#18181b', borderRadius: 8, color: '#fff', border: '1px solid #333' }}
            labelStyle={{ color: '#fff' }}
            formatter={(value: any) => [`$${value}`, 'Cumulative Fees']}
          />
          <Area
            type="monotone"
            dataKey="cumulativeFees"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.15}
            strokeWidth={3}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-center mt-2 text-xs text-neutral-400">
        {data.length > 0 && (
          <div className={data[data.length - 1].cumulativeFees >= 0 ? 'text-green-400' : 'text-red-400'}>
            Cumulative: ${data[data.length - 1].cumulativeFees}
          </div>
        )}
      </div>
    </div>
  );
}
