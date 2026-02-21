# Deriverse Trading Analytics Dashboard

A comprehensive on-chain trading analytics platform built for the Deriverse Protocol on Solana. The dashboard provides real-time position tracking, trade analytics, and performance insights for active traders.

## Overview

The Deriverse Trading Analytics Dashboard is a Next.js 16 application that integrates with the Deriverse SDK to deliver live market data and position information. The platform supports both live trading data (when wallet is connected) and demo mode with mock data for UI evaluation.


### Key Features

- Real-Time Position Tracking: Live updates from Deriverse perpetual positions
- Market Prices: Real-time instrument prices updated every 10 seconds
- Comprehensive Analytics: Sharpe ratio, profit factor, drawdown, win rate, cumulative fees, and more
- Trading Journal: Modal for annotation, strategy tagging, and sentiment tracking per trade
- Export Functionality: Download trade history as CSV or JSON
- Responsive Design: Mobile-optimized, professional UI/UX
- AI Assistant: Integrated chat for analytics, journaling, and trading insights
- Graceful Fallback: Demo mode when wallet is disconnected

## Data Modes

### Live Mode (Wallet Connected)
- Fetches real on-chain positions from Deriverse via SDK
- Updates every 10 seconds
- Calculates real P&L and analytics
- Market prices streamed from Solana RPC
- Requires wallet connection (Phantom, Solflare, etc.)

### Demo Mode (No Wallet)
- Uses comprehensive mock historical trade data
- Allows full UI and analytics exploration
- Perfect for feature evaluation without wallet setup
- All dashboard features fully functional
- Designed for reviewers to test comprehensive analytics

**Note:** Historical trade APIs are not currently exposed by the protocol, so demo data is used to simulate full journal analytics. Live positions appear automatically when wallet is connected.

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    User Interface Layer                          │
│  (Next.js 16, React 19, Tailwind CSS)                           │
│  - Dashboard Page                                                │
│  - Components (Charts, Tables, Metrics)                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼────────────┐   │   ┌───────────▼──────────┐
│  Hooks Layer       │   │   │  Adapter Layer       │
│                    │   │   │                      │
│ useDeriverseData() ├───┤   │ deriverse-adapters   │
│ useDeriverse()     │   │   │ - Convert SDK data   │
│ useWallet()        │   │   │ - Transform formats  │
└────────┬───────────┘   │   └──────────┬───────────┘
         │               │               │
         │     ┌─────────▼──────────┐   │
         │     │   SDK Integration  │   │
         │     │                    │   │
         │     │ @deriverse/kit     │   │
         │     │ @solana/rpc        │   │
         └─────┤ Engine Instance    ├───┘
               │ Position Fetching  │
               └──────────┬─────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
┌───────▼────────┐  ┌─────▼────────┐  ┌────▼──────────┐
│ Solana RPC     │  │ Wallet        │  │ Wallet        │
│ Connection     │  │ Adapter       │  │ Modal         │
│ (Devnet/Mainnet)  │ (Phantom,     │  │ Provider      │
│                │  │  Solflare)    │  │               │
└────────────────┘  └────────────────┘  └───────────────┘
```

### Data Flow Architecture

```
DISCONNECTED STATE (Demo Mode)
─────────────────────────────────────────────────────────────

User Visits Dashboard
        │
        ├─► Load Mock Trades (MOCK_TRADES)
        │   │
        │   ├─► Display in Trade History
        │   ├─► Calculate Mock Analytics
        │   └─► Show Sample Open Positions
        │
        └─► Show "Demo Mode" Status
            └─► Display "Connect Wallet" Button


CONNECTED STATE (Live Mode)
─────────────────────────────────────────────────────────────

User Connects Wallet
        │
        ├─► Initialize Deriverse Engine
        │   │
        │   ├─► Create SDK Instance
        │   ├─► Connect to Solana RPC
        │   └─► Ready for Data Fetching
        │
        └─► Poll Every 10 Seconds
            │
            ├─► Update Market Prices
            │   │
            │   ├─► engine.instruments
            │   ├─► Parse instrument prices
            │   └─► Cache in state
            │
            └─► Fetch User Positions
                │
                ├─► engine.getClientData()
                ├─► Extract perpetual positions
                ├─► Convert to Trade format
                │   │
                │   └─► convertPerpPositionToTrade()
                │       ├─ Calculate unrealized P&L
                │       ├─ Determine trade direction
                │       └─ Format for UI
                │
                └─► Update Dashboard in Real-Time
                    │
                    ├─► Open Positions Panel
                    ├─► Summary Metrics
                    ├─► Charts & Analytics
                    └─► Connection Status Indicator
```

## Technical Stack

### Frontend Framework
- Next.js 16.1.6 - React framework with Turbopack
- React 19.2.3 - UI library
- TypeScript 5.7.3 - Type safety
- Tailwind CSS 3.4.17 - Utility-first styling

### Blockchain Integration
- @deriverse/kit ^1.0.41 - Deriverse SDK
- @solana/web3.js ^1.98.4 - Solana blockchain client
- @solana/rpc ^6.1.0 - Solana RPC client
- @solana/wallet-adapter-react - Wallet connection

### UI Components & Libraries
- Radix UI - Accessible component primitives
- Recharts 2.15.0 - Interactive charts
- Lucide React 0.544.0 - Icon library
- Sonner 1.7.1 - Toast notifications
- Vaul 1.1.2 - Drawer component

## Project Structure

```
trading-dashboard/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with Providers
│   ├── page.tsx                 # Main dashboard page
│   ├── globals.css              # Global styles
│   └── loading.tsx              # Loading skeleton
│
├── components/
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── charts.tsx           # Performance visualizations
│   │   ├── open-positions.tsx   # Active positions table
│   │   ├── trade-history.tsx    # Trade log with journal
│   │   ├── summary-metrics.tsx  # KPI cards
│   │   ├── stats-and-insights.tsx # Analytics insights
│   │   ├── filters.tsx          # Symbol and date filters
│   │   ├── export-import.tsx    # CSV/JSON export
│   │   └── wallet-connect-section.tsx # Wallet connection UI
│   │
│   ├── layout/
│   │   └── sidebar.tsx          # Main navigation sidebar
│   │
│   ├── providers/
│   │   └── wallet-provider.tsx  # Wallet adapter setup
│   │
│   └── ui/                      # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── table.tsx
│       ├── dialog.tsx
│       └── [30+ more components]
│
├── hooks/                        # Custom React hooks
│   ├── useDeriverse.ts          # SDK initialization
│   ├── useDeriverseData.ts      # Data fetching & polling
│   ├── use-mobile.tsx           # Responsive utilities
│   └── use-toast.ts             # Toast notifications
│
├── lib/                          # Utilities and helpers
│   ├── deriverse-client.ts      # SDK engine setup
│   ├── deriverse-adapters.ts    # Data transformation layer
│   ├── parsers.ts               # SDK data parsing
│   ├── mock-trades.ts           # Demo data
│   ├── types.ts                 # TypeScript interfaces
│   ├── utils.ts                 # General utilities
│   ├── analytics.ts             # Analytics calculations
│   └── examples.tsx             # Usage examples
│
├── public/                       # Static assets
├── styles/                       # CSS modules
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind configuration
├── next.config.mjs              # Next.js configuration
│
├── LIVE_DATA_INTEGRATION.md     # Integration documentation
├── QUICKSTART.md                # Quick start guide
└── README.md                    # This file
```

## Integration Points

### 1. Wallet Connection Flow

```
┌──────────────────────────────────────────────────┐
│         Wallet Provider (app/layout.tsx)         │
│                                                  │
│  ConnectionProvider                              │
│  └─ WalletProvider                               │
│     └─ WalletModalProvider                       │
│        └─ Application                            │
└──────────────────────────────────────────────────┘
                      │
                      ├─ Phantom Wallet
                      ├─ Solflare Wallet
                      └─ Other adapters
                      
        User clicks "Select Wallet"
                      │
                      ├─ Modal appears
                      ├─ User selects wallet
                      ├─ Wallet signs transaction
                      └─ publicKey available in hooks
```

### 2. SDK Data Integration

```
┌──────────────────────────────────────────┐
│    useDeriverse() Hook                   │
│                                          │
│  Initializes Engine                      │
│  - Creates RPC connection                │
│  - Instantiates SDK                      │
│  - Caches engine instance                │
└─────────────┬────────────────────────────┘
              │
              ├─────► useDeriverseData()
              │       │
              │       ├─ Calls engine.updateRoot()
              │       ├─ Iterates engine.instruments
              │       ├─ Calls engine.getClientData()
              │       │
              │       └─► deriverse-adapters.ts
              │           │
              │           ├─ convertPerpPositionToTrade()
              │           ├─ convertClosedOrderToTrade()
              │           ├─ mergeTrades()
              │           └─ filterTradesByDateRange()
              │
              └─► Returns to component
                  ├─ marketPrices
                  ├─ activePositions
                  ├─ closedTrades
                  ├─ isConnected
                  ├─ isLoadingData
                  └─ dataError
```

### 3. Data Transformation Pipeline

```
Raw SDK Data                  Adapter Layer                Dashboard Format
──────────────────────────────────────────────────────────────────────

Perpetual Position  ──────► convertPerpPositionToTrade() ──► Trade Object
├─ id                       ├─ Parse prices                  ├─ id
├─ entryPrice              ├─ Calculate P&L                 ├─ symbol
├─ size                    ├─ Determine direction           ├─ type
├─ openTime               ├─ Format timestamps             ├─ pnl
└─ ...                     └─ Validate data                 └─ ...


Engine Instruments  ────────► parseInstrumentPrice()  ──────► Market Prices
├─ instrument[0]           ├─ Extract bid/ask              Record<string, number>
├─ instrument[1]           ├─ Calculate midpoint
└─ ...                      └─ Handle edge cases


User's Account Data ───────► getClientData()         ──────► Positions Array
├─ perp positions          ├─ Filter active                Trade[]
├─ balances                ├─ Transform format
└─ metadata                └─ Merge with mock
```

## Data Flow: Live vs Demo Mode

### Live Mode (Wallet Connected)

```
Solana RPC -|
            ├─► Deriverse Engine ──► useDeriverse() Hook
            |                            |
            |                            ├─ Fetch Every 10s
            |                            |
Wallet ─────├─► User Positions ────────► useDeriverseData()
            |    (on-chain)               |
            |                             ├─ Transform Data
            |                             |
            ├─► Market Prices ──────────► Adapters Layer
            |                             |
            |                             ├─ Convert Format
            |
            └────────────────────────────► Dashboard Components
                                          |
                                          ├─ Summary Metrics
                                          ├─ Open Positions
                                          ├─ Charts
                                          └─ Status: "Live Connected"
```

### Demo Mode (No Wallet)

```
Mock Data (MOCK_TRADES)
        |
        ├─► Load from lib/mock-trades.ts
        |
        ├─► Filter & Process
        |   ├─ Apply date range filters
        |   ├─ Apply symbol filters
        |   └─ Separate open/closed trades
        |
        ├─► Display in Components
        |   ├─ Summary Metrics
        |   ├─ Open Positions (mock)
        |   ├─ Charts
        |   └─ Status: "Demo Mode"
        |
        └─► Allow Filter Testing
            └─ User can explore features
```

## Component Communication

```
page.tsx (State Management)
│
├─► WalletConnectSection
│   │   Shows connection status
│   │   Provides connect/disconnect UI
│   └─ Imports: useWallet()
│
├─► Filters
│   │   Manages symbol & date filters
│   │   Emits onFilterChange events
│   └─ Receives: symbols array
│
├─► OpenPositions
│   │   Displays active trades
│   │   Updates in real-time from SDK
│   └─ Receives: activePositions array
│
├─► SummaryMetrics
│   │   Shows KPIs
│   │   Calculates from trade data
│   └─ Receives: trades array
│
├─► Charts
│   │   Renders PnL, performance charts
│   │   Uses Recharts library
│   └─ Receives: trades array
│
├─► StatsAndInsights
│   │   Win rates, risk metrics
│   │   Bias analysis
│   └─ Receives: trades array
│
└─► TradeHistory
    │   Detailed trade log
    │   Journaling capabilities
    └─ Receives: trades array, onNotesUpdate callback
```

## Polling and Real-Time Updates

```
useDeriverseData Hook Lifecycle
──────────────────────────────────

Mount Component
    │
    ├─► Check dependencies (engine, publicKey)
    │
    ├─► Call fetchData() immediately
    │   │
    │   ├─► engine.updateRoot()
    │   ├─► Fetch market prices
    │   ├─► Fetch positions (if connected)
    │   ├─► Transform to Trade format
    │   └─► Update state
    │
    ├─► Set polling interval (10 seconds)
    │   │
    │   └─► Repeat fetchData() every 10s
    │       ├─ Latest prices
    │       ├─ Latest positions
    │       ├─ Updated unrealized P&L
    │       └─ Fresh state
    │
    └─► Cleanup on unmount
        └─► Clear interval


State Updates → UI Re-renders
    │
    ├─► OpenPositions table updates
    ├─► Charts refresh with new data
    ├─► Metrics recalculate
    └─► Real-time P&L displays
```

## Setup and Installation

### Prerequisites

- Node.js 18+ or 20+
- pnpm 8+
- Solana wallet (Phantom, Solflare, etc.)
- Solana Devnet SOL (for testing)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd trading-dashboard

# Install dependencies
pnpm install

# Install missing @solana/rpc package
pnpm add @solana/rpc
```

### Environment Configuration

Create `.env.local`:

```env
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_DERIVERSE_PROGRAM_ID=CDESjex4EDBKLwx9ZPzVbjiHEHatasb5fhSJZMzNfvw2
```

### Running the Application

```bash
# Development server
pnpm dev
# Visit http://localhost:3000

# Production build
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## Usage

### Connect Your Wallet

1. Click "Select Wallet" button in sidebar
2. Choose wallet provider (Phantom/Solflare)
3. Approve connection in wallet
4. Dashboard switches to "Live Data Connected" mode

### View Live Positions

- Open positions display in "Open Positions" panel
- Updates every 10 seconds from Deriverse
- Real-time P&L calculations based on market prices

### Analyze Trades

- Use filters to narrow by symbol or date range
- View comprehensive metrics (win rate, volume, fees)
- Export data for external analysis
- Add notes and tags to trades

### Monitor Performance

- Historical P&L charts with drawdown visualization
- Win/loss analysis by trade type
- Fee breakdown by symbol
- Time-of-day performance metrics

## API Integration Details

### Deriverse SDK Methods Used

```typescript
// Engine initialization
const engine = new Engine(rpc, {
  programId: PROGRAM_ID,
  version: VERSION
});

// Update market state
await engine.updateRoot();

// Access current prices
engine.instruments.forEach((instrument, id) => {
  const price = parseInstrumentPrice(instrument);
  // Use price
});

// Fetch user positions
const clientData = await engine.getClientData();
// clientData.perp contains perpetual positions
```

### Data Structures

```typescript
// Trade Object
interface Trade {
  id: string;
  symbol: string;
  pair: string;
  type: 'long' | 'short';
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  pnl?: number;
  pnlPercent?: number;
  entryTime: number;
  exitTime?: number;
  durationMinutes?: number;
  orderType: 'market' | 'limit' | 'stop-loss' | 'take-profit';
  fee: number;
  notes?: string;
  tags?: string[];
  status: 'open' | 'closed';
  currentPrice?: number;
  unrealizedPnl?: number;
}

// Market Prices
Record<string, number> = {
  'BTC-PERP': 45230.50,
  'ETH-PERP': 2850.25,
  'SOL-PERP': 198.75
}
```

## Performance Considerations

### Polling Optimization

- Default interval: 10 seconds (adjustable)
- Only fetches when wallet connected
- Batch updates to minimize re-renders
- Efficient state management with memoization

### Data Caching

- Market prices cached in state
- Positions cached between polls
- Deduplication on merge operations
- Lazy evaluation of filtered arrays

### Component Optimization

- Memoized calculations via useMemo
- Conditional rendering based on state
- Separate concerns (filters, positions, charts)
- Lazy loading of chart components

## Error Handling

### Connection Errors

```
Try to fetch data
    │
    ├─ Success ───► Update state, render data
    │
    └─ Error
        ├─ Log error to console
        ├─ Set dataError state
        ├─ Display error message to user
        ├─ Keep last known state (don't lose data)
        └─ Continue polling for recovery
```

### Validation and Fallbacks

- Positions with zero size are filtered
- Invalid prices default to 0
- Missing P&L calculations handled
- Safe navigation of SDK data structures
- Graceful degradation to demo mode

## Testing

### Build Verification

```bash
pnpm build
# Ensures no TypeScript or compilation errors
# Produces optimized production bundle
```

### Development Testing

```bash
pnpm dev
# Start with hot-reload
# Test without wallet (demo mode)
# Test with wallet connected (live mode)
```

### Testing Checklist

- Build completes without errors
- Dashboard loads in browser
- Wallet connection flow works
- Status indicator updates correctly
- Live data appears when connected
- Demo data shows when disconnected
- No console errors (except expected wallet context)
- Filters apply correctly
- Charts render without errors
- Export functionality works

## Key Implementation Details

### Wallet Provider Integration (app/layout.tsx)

```typescript
// Wrapped entire app with Providers
<Providers>
  <Sidebar />
  <main>{children}</main>
</Providers>
```

This enables:
- Wallet connection modal
- useWallet() hook access
- WalletMultiButton component usage

### Real-Time Data Fetching (hooks/useDeriverseData.ts)

```typescript
// Poll every 10 seconds for live data
useEffect(() => {
  if (!engine || isInitializing) return;
  
  setIsLoadingData(true);
  fetchData().finally(() => setIsLoadingData(false));
  
  pollInterval.current = setInterval(fetchData, 10000);
  
  return () => {
    if (pollInterval.current) clearInterval(pollInterval.current);
  };
}, [engine, isInitializing, fetchData]);
```

### Data Transformation (lib/deriverse-adapters.ts)

```typescript
// Convert SDK position to Trade format
export function convertPerpPositionToTrade(
  position: any,
  marketPrice: number,
  symbol: string
): Trade | null {
  // Safely extract and validate data
  // Calculate P&L based on current price
  // Format timestamps consistently
  // Return standardized Trade object
}
```


## Features Implemented

### Core Dashboard Features

- Persistent green/red palette for all analytics
- Advanced analytics: Sharpe ratio, profit factor, drawdown, win rate, cumulative fees
- Trade journal modal with annotation, strategy, sentiment
- Portfolio/session performance, time-of-day heatmap, order type analytics, cumulative fee chart
- Wallet connect, demo mode, and on-chain data integration
- Export/import trade data (CSV/JSON)
- Mobile-optimized, responsive UI/UX
- Integrated AI assistant for analytics, journaling, and trading insights

### Live Data Integration

- Real-time connection status indicator
- Active position fetching from blockchain
- Market price updates every 10 seconds
- Unrealized P&L calculations
- Wallet connection management
- Graceful demo mode fallback

## Future Enhancements

### Planned Features

1. Trade History from Blockchain: Integrate Deriverse trade history API
2. Advanced Charting: Real-time candle charts, technical indicators
3. Risk Management: Stop-loss alerts, position sizing recommendations
4. Backtesting: Historical performance analysis
5. Social Features: Share trades, compare with other traders
6. Mobile App: React Native companion app
7. Webhooks: Custom alerts and notifications

### Technical Debt

1. Implement trade history API integration
2. Add end-to-end tests
3. Optimize bundle size
4. Add service worker for offline support
5. Implement data persistence layer

## Troubleshooting

### Port Already in Use

```bash
# Kill existing Node processes
taskkill /IM node.exe /F

# Or use specific port
pnpm dev -- -p 3001
```

### Module Not Found Errors

```bash
# Reinstall dependencies
rm -r node_modules pnpm-lock.yaml
pnpm install
```

### Wallet Connection Not Working

- Ensure @solana/wallet-adapter-react-ui/styles.css is imported
- Check Providers wrapper is enabled in layout.tsx
- Clear browser cache and cookies
- Refresh page

### Build Failures

- Check TypeScript errors: pnpm tsc --noEmit
- Verify all imports are correct
- Ensure environment variables are set
- Check Node.js and pnpm versions

## Contributing

When contributing to this project:

1. Follow TypeScript best practices
2. Keep components focused and reusable
3. Document complex logic
4. Test before committing
5. Update relevant documentation


## Documentation & Submission

- [LIVE_DATA_INTEGRATION.md](./LIVE_DATA_INTEGRATION.md) - Detailed integration guide
- [QUICKSTART.md](./QUICKSTART.md) - Quick start instructions
- [lib/examples.tsx](./lib/examples.tsx) - Code usage examples

### Final Checklist
- [x] Persistent green/red palette for all analytics
- [x] Trade journal modal with annotation, strategy, sentiment
- [x] Mobile and desktop UI/UX polish
- [x] AI assistant widget (bottom right)
- [x] Codebase cleaned, dead code removed
- [x] Documentation updated

**Ready for hackathon submission.**

## Changelog

### Version 1.0.0 (February 19, 2026)

- Initial release with live SDK integration
- Real-time position tracking
- Comprehensive analytics dashboard
- Wallet connection system
- Export functionality
- Trading journal with notes
- Demo mode with mock data
- Polling architecture for live updates
- Data transformation layer for SDK integration
- Professional UI with responsive design

## License

Specify your license

## Support

For issues or questions:

1. Check LIVE_DATA_INTEGRATION.md for troubleshooting
2. Review lib/examples.tsx for usage patterns
3. Check browser console for error messages
4. Verify environment configuration

---

Last Updated: February 19, 2026
Status: Production Ready (Trade History API Pending)
