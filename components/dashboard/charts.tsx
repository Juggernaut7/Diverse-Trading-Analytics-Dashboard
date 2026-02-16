'use client';

import { Trade, DailyMetrics } from '@/lib/types';
import {
  calculateDailyMetrics,
  calculateRatios,
  calculateTimeOfDayMetrics,
  calculateMaxDrawdown,
  calculateOrderTypePerformance,
} from '@/lib/analytics';
import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface ChartsProps {
  trades: Trade[];
}

const COLORS = {
  positive: '#10b981', // emerald-500
  negative: '#ef4444', // red-500
  neutral: '#6b7280', // gray-500
  accent: '#3b82f6', // blue-500
};

export function Charts({ trades }: ChartsProps) {
  const dailyMetrics = calculateDailyMetrics(trades);
  const ratios = calculateRatios(trades);
  const timeOfDay = calculateTimeOfDayMetrics(trades);
  const orderTypePerf = calculateOrderTypePerformance(trades);
  const maxDrawdown = calculateMaxDrawdown(trades);

  // Prepare data for drawdown visualization
  const drawdownData = calculateDrawdownCurve(trades);

  // Long/Short ratio data
  const ratioData = [
    { name: 'Long', value: ratios.longCount, color: COLORS.positive },
    { name: 'Short', value: ratios.shortCount, color: COLORS.negative },
  ];

  // Order type data
  const orderTypeData = orderTypePerf.slice(0, 5).map((item) => ({
    name: item.type.charAt(0).toUpperCase() + item.type.slice(1),
    avgPnl: item.avgPnl,
    trades: item.trades,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Historical PnL with Drawdown */}
      <Card className="p-6 bg-neutral-900 border-neutral-800 lg:col-span-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Historical PnL & Drawdown</h3>
            <span className="text-xs text-red-400">Max Drawdown: ${maxDrawdown.toFixed(2)}</span>
          </div>

          {dailyMetrics.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={drawdownData}>
                <defs>
                  <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.positive} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.positive} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.negative} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.negative} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1b1e',
                    border: '1px solid #404040',
                    borderRadius: '6px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="cumulativePnl"
                  stroke={COLORS.positive}
                  fillOpacity={1}
                  fill="url(#colorPnl)"
                  name="Cumulative PnL"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="drawdown"
                  stroke={COLORS.negative}
                  fillOpacity={1}
                  fill="url(#colorDrawdown)"
                  name="Drawdown"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-neutral-500">No data available</div>
          )}
        </div>
      </Card>

      {/* Long vs Short Ratio */}
      <Card className="p-6 bg-neutral-900 border-neutral-800">
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white">Long vs Short Ratio</h3>
          {ratioData.some((item) => item.value > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={ratioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {ratioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1b1e',
                    border: '1px solid #404040',
                    borderRadius: '6px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-neutral-500">No data available</div>
          )}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="bg-neutral-800 p-3 rounded-lg">
              <div className="text-xs text-neutral-400">Long Trades</div>
              <div className="text-lg font-bold text-white">{ratios.longCount}</div>
              <div className="text-xs text-emerald-400">{ratios.longWinRate}% Win</div>
            </div>
            <div className="bg-neutral-800 p-3 rounded-lg">
              <div className="text-xs text-neutral-400">Short Trades</div>
              <div className="text-lg font-bold text-white">{ratios.shortCount}</div>
              <div className="text-xs text-red-400">{ratios.shortWinRate}% Win</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Time of Day Performance */}
      <Card className="p-6 bg-neutral-900 border-neutral-800">
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white">Time of Day Performance</h3>
          {timeOfDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={timeOfDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="hour" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1b1e',
                    border: '1px solid #404040',
                    borderRadius: '6px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="pnl" fill={COLORS.accent} radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-neutral-500">No data available</div>
          )}
        </div>
      </Card>

      {/* Order Type Performance */}
      <Card className="p-6 bg-neutral-900 border-neutral-800">
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white">Order Type Performance</h3>
          {orderTypeData.length > 0 ? (
            <div className="space-y-3">
              {orderTypeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{item.name}</div>
                    <div className="text-xs text-neutral-400">{item.trades} trades</div>
                  </div>
                  <div
                    className={`text-sm font-bold ${item.avgPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                  >
                    ${item.avgPnl.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-neutral-500">No data available</div>
          )}
        </div>
      </Card>

      {/* Daily PnL Bar Chart */}
      <Card className="p-6 bg-neutral-900 border-neutral-800 lg:col-span-2">
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white">Daily PnL</h3>
          {dailyMetrics.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1b1e',
                    border: '1px solid #404040',
                    borderRadius: '6px',
                  }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'PnL']}
                />
                <Bar
                  dataKey="pnl"
                  fill={COLORS.positive}
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                  shape={<CustomBar />}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-neutral-500">No data available</div>
          )}
        </div>
      </Card>
    </div>
  );
}

/**
 * Custom bar to color positive/negative differently
 */
function CustomBar(props: any) {
  const { fill, x, y, width, height, payload } = props;
  const color = payload.pnl >= 0 ? COLORS.positive : COLORS.negative;

  return (
    <rect x={x} y={y} width={width} height={height} fill={color} rx={4} />
  );
}

/**
 * Calculate drawdown curve from trades
 */
function calculateDrawdownCurve(
  trades: Trade[]
): Array<{
  date: string;
  cumulativePnl: number;
  drawdown: number;
}> {
  if (trades.length === 0) return [];

  const dailyMetrics = calculateDailyMetrics(trades);
  let peak = 0;
  let cumulativePnL = 0;

  return dailyMetrics.map((day) => {
    cumulativePnL += day.pnl;
    if (cumulativePnL > peak) {
      peak = cumulativePnL;
    }
    const drawdown = peak - cumulativePnL;

    return {
      date: day.date.split('/').slice(0, 2).join('/'),
      cumulativePnl: Math.max(0, cumulativePnL),
      drawdown: Math.max(0, drawdown * -1),
    };
  });
}
