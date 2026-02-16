# Deriverse Trading Analytics Dashboard

A comprehensive, on-chain trading analytics dashboard for the Deriverse protocol. Built with Next.js, React, Tailwind CSS, and Recharts for real-time performance tracking, detailed trade analysis, and actionable insights.

## Features

### Core Metrics
- **Total PnL Tracking** - Real-time profit/loss with visual indicators (green/red badges)
- **Win Rate Analysis** - Percentage of winning trades with visual progress bar
- **Trading Volume** - Total notional value across all trades
- **Fee Analysis** - Cumulative fees paid and fee breakdown by symbol
- **Average Trade Duration** - Time spent per trade in minutes

### Advanced Analytics
- **Long vs Short Ratio** - Visual pie chart showing directional bias with win rate breakdown
- **Largest Gain/Loss** - Identify best and worst performing trades
- **Average Win/Loss** - Track risk metrics and R:R ratios
- **Maximum Drawdown** - Peak-to-trough decline measurement
- **Time of Day Performance** - Hourly PnL heatmap for session analysis
- **Order Type Performance** - Compare market, limit, stop-loss, and take-profit execution

### Visualizations
- **Historical PnL Chart** - Area chart with cumulative P&L and drawdown overlay
- **Daily PnL Bar Chart** - Colored bars for daily performance tracking
- **Long/Short Ratio Pie Chart** - Visual trade type distribution
- **Order Type Performance Cards** - Quick comparison of order type profitability

### Data Management
- **Trade History Table** - Sortable columns with inline note annotations
- **Symbol Filters** - Filter by trading pair (SOL/USDC, BTC/USDC, ETH/USDC)
- **Date Range Filters** - 1D, 7D, 30D, 90D, and All Time views
- **CSV Export** - Export trade data for external analysis
- **JSON Export** - Export full trade data with all metadata

### Insights & Intelligence
- **AI-Powered Bias Detection** - Rule-based insights on trading patterns
  - Long vs Short bias analysis with win rate comparison
  - Personalized recommendations based on performance
  - Avg PnL tracking by direction

## Technical Stack

- **Frontend Framework**: Next.js 16 with App Router
- **UI Library**: React 19.2 with Shadcn/UI components
- **Styling**: Tailwind CSS with custom dark theme
- **Charts**: Recharts for data visualization
- **Data State**: React hooks (useState, useMemo) for client-side state
- **Utilities**: TypeScript for type safety

## Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Main dashboard page
│   └── globals.css          # Global styles and dark theme
├── components/
│   └── dashboard/
│       ├── summary-metrics.tsx      # Top KPI cards
│       ├── filters.tsx              # Symbol and date filters
│       ├── charts.tsx               # All visualization components
│       ├── trade-history.tsx        # Sortable trade table
│       ├── stats-and-insights.tsx   # Risk metrics & AI insights
│       └── export-import.tsx        # CSV/JSON export
├── lib/
│   ├── types.ts             # TypeScript interfaces
│   ├── mock-trades.ts       # Sample trade data (12 trades)
│   └── analytics.ts         # 15+ utility functions for calculations
└── package.json
```

## Analytics Functions

The `lib/analytics.ts` file includes:

- `calculateTotalPnL()` - Sum of all trades
- `calculateWinRate()` - Win percentage
- `calculateTotalVolume()` - Total notional value
- `calculateTotalFees()` - Cumulative fees
- `calculateAvgDuration()` - Average trade duration
- `calculateRatios()` - Long/short breakdown
- `calculateLargestTrades()` - Best and worst trades
- `calculateAvgWinLoss()` - Risk metrics
- `calculateMaxDrawdown()` - Drawdown calculation
- `calculateDailyMetrics()` - Daily PnL aggregation
- `calculateTimeOfDayMetrics()` - Hourly performance
- `calculateFeeBySymbol()` - Fee breakdown
- `calculateOrderTypePerformance()` - Order type analysis
- `generateBiasInsights()` - AI pattern detection
- `filterTrades()` - Filter by symbol/date
- `exportTradesCSV()` - CSV export utility

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Mock Data

The dashboard includes 12 mock trades across SOL, BTC, and ETH pairs. Each trade contains:
- Entry/exit prices and quantities
- P&L and percentage returns
- Order type (market, limit, stop-loss, take-profit)
- Duration and fee information
- Optional trader notes

## Customization

### Adding Real On-Chain Data

To integrate with the Deriverse SDK:

1. **Connect Wallet** - Implement Solana wallet adapter
2. **Fetch Trades** - Replace mock data with SDK queries
3. **Real-Time Updates** - Set up listeners for new trades

```typescript
// Example integration point in app/page.tsx
const [trades, setTrades] = useState<Trade[]>(MOCK_TRADES);

// Replace with:
const [trades, setTrades] = useState<Trade[]>([]);

useEffect(() => {
  // Fetch from Deriverse SDK
  const fetchTrades = async () => {
    // const data = await deriverseSdk.getTradeHistory(...);
    // setTrades(data);
  };
}, []);
```

### Color Scheme

Dark theme configured in `app/globals.css`:
- **Background**: `#1a1b1e` (neutral-950)
- **Card**: `#262729` (neutral-900)
- **Positive (Green)**: `#10b981` (emerald-500)
- **Negative (Red)**: `#ef4444` (red-500)
- **Accent (Blue)**: `#3b82f6` (blue-500)

Modify CSS variables in the `:root` section to customize colors.

## Performance Metrics

Sample dashboard shows:
- Total P&L: `$387.65` (12 trades analyzed)
- Win Rate: `67%`
- Trading Volume: `$1.2M+`
- Max Drawdown: `-$66.00`

## Security Considerations

- **No Key Storage**: Read-only data queries only
- **Client-Side Processing**: All calculations run in browser
- **No Backend Required**: Data aggregation via Solana RPC
- **User Annotations**: Trade notes stored in component state (client-side)

## Future Enhancements

- Real-time WebSocket updates for live P&L
- Machine learning for trade prediction
- Advanced heatmaps for market microstructure analysis
- PDF report generation
- Multi-wallet portfolio aggregation
- Strategy backtesting engine

## License

MIT - Built for the Deriverse hackathon

## Support

For issues or questions, open a GitHub issue or check the Deriverse Discord community.
