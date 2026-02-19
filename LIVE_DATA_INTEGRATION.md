# Live Data Integration Guide - Deriverse Trading Dashboard

## Overview

This document explains how the trading dashboard integrates live data from the Deriverse SDK and handles the transition from mock data to real on-chain data.

## Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Dashboard (page.tsx)                      │
│  - Manages filters, notes, and overall state                │
│  - Conditionally displays SDK or mock data                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
┌───────▼──────────────┐       ┌────────▼──────────────┐
│ useDeriverseData()   │       │  Mock Data (fallback) │
│ - Fetches SDK data   │       │  - MOCK_TRADES       │
│ - Polls every 10s    │       │  - Demo purposes     │
└───────┬──────────────┘       └──────────────────────┘
        │
        ├──→ useDeriverse() hook
        │    └─→ Engine initialization
        │
        └──→ deriverse-adapters.ts
             └─→ Conversion functions
```

### Key Components

#### 1. **useDeriverseData Hook** (`hooks/useDeriverseData.ts`)
- Initializes the Deriverse SDK Engine
- Fetches market prices and user positions every 10 seconds
- Converts SDK data to dashboard Trade format
- Returns:
  - `marketPrices`: Current prices for all instruments
  - `activePositions`: Open perpetual positions
  - `closedTrades`: Closed trades (currently mock)
  - `isConnected`: Whether wallet is connected
  - `isLoadingData`: Loading state
  - `dataError`: Any errors during fetching

#### 2. **Deriverse Adapters** (`lib/deriverse-adapters.ts`)
Conversion functions that transform Deriverse SDK data structures into dashboard Trade objects:

- `convertPerpPositionToTrade()` - Converts open positions
- `convertClosedOrderToTrade()` - Converts closed orders
- `mergeTrades()` - Deduplicates and merges mock + SDK trades
- `filterTradesByDateRange()` - Date filtering helper

#### 3. **Dashboard Page** (`app/page.tsx`)
- Subscribes to useDeriverseData hook
- Merges SDK and mock data
- Shows connection status to user
- Fallback to mock data when not connected

## Live Data Sources

### Currently Implemented ✅

**Market Prices:**
- Real-time instrument prices from Deriverse SDK
- Updated every 10 seconds via polling
- Used in open position P&L calculations

**Active Positions:**
- Fetched from `engine.getClientData()` 
- Perpetual positions with real-time unrealized P&L
- Updates every 10 seconds

### TODO (Awaiting Indexer/API)

**Closed Trade History:**
- Requires trade history API from Deriverse
- Currently uses mock data as fallback
- Once API available, implement similar to position fetching

## How to Use Live Data

### 1. Connect Your Wallet

Users must connect their Solana wallet to see live data:

```tsx
// Automatic: The dashboard uses WalletContext
// Users see a status indicator:
// ✓ Live Data Connected (when wallet is connected)
// Demo Mode (when wallet is not connected)
```

### 2. Monitor Connection Status

The dashboard shows real-time connection feedback:

```tsx
{isConnected && (
  <div className="bg-emerald-900/20">
    ✓ Live Data Connected - Using on-chain data
  </div>
)}

{dataError && (
  <div className="bg-red-900/20">
    Data Error: {dataError}
  </div>
)}
```

### 3. Handle SDK Data Gracefully

The adapters handle missing or malformed data:

```typescript
// Example: Converting a position with error handling
const trade = convertPerpPositionToTrade(position, price, symbol);
if (trade) {
  // Successfully converted
  setActivePositions([...positions, trade]);
} else {
  // Position was invalid or skipped
  console.warn('Could not convert position');
}
```

## Environment Setup

### Required SDK Version

```json
{
  "dependencies": {
    "@deriverse/kit": "^1.0.41",
    "@solana/rpc": "^6.1.0",
    "@solana/web3.js": "^1.98.4",
    "@solana/wallet-adapter-react": "^0.15.35"
  }
}
```

### Solana RPC Configuration

The dashboard uses Devnet by default. To change:

1. **Update `lib/deriverse-client.ts`:**

```typescript
// Current (Devnet)
const rpc = createSolanaRpc('https://api.devnet.solana.com');

// For Mainnet
const rpc = createSolanaRpc('https://api.mainnet-beta.solana.com');

// For custom RPC
const rpc = createSolanaRpc(process.env.NEXT_PUBLIC_RPC_URL);
```

2. **Add environment variable (optional):**

```env
# .env.local
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_DERIVERSE_PROGRAM_ID=CDESjex4EDBKLwx9ZPzVbjiHEHatasb5fhSJZMzNfvw2
```

3. **Update deriverse-client.ts to use env:**

```typescript
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com';
const rpc = createSolanaRpc(RPC_URL);
```

## Data Integration Patterns

### Pattern 1: Real Data with Mock Fallback

```typescript
// app/page.tsx
const openTrades = isConnected && activePositions.length > 0 
  ? activePositions 
  : filteredTrades.filter(t => t.status === 'open');
```

This ensures users see mock data for demo purposes until they connect.

### Pattern 2: SDK Data Takes Precedence

```typescript
// When merging trades
const allTrades = mergeTrades(MOCK_TRADES, sdkClosedTrades);
// SDK trades overwrite mock trades with same ID
```

### Pattern 3: Polling Updates

```typescript
// Every 10 seconds, re-fetch SDK data
useEffect(() => {
  pollInterval.current = setInterval(fetchData, 10000);
}, []);
```

## Common Issues & Solutions

### Issue 1: "Can't resolve '@solana/rpc'"

**Solution:** Install the package:
```bash
pnpm add @solana/rpc
```

### Issue 2: Wallet Context Not Available During SSR

**Solution:** The adapters handle this gracefully. During build time, activePositions is empty, and mock data is shown.

**Workaround if needed:** Mark the page as client-only:
```tsx
'use client'; // Already added to page.tsx
```

### Issue 3: No Positions Showing

**Possible causes:**
1. Wallet not connected - connect your wallet first
2. No open positions on the connected account - this is normal
3. Wrong RPC endpoint - verify in browser console
4. SDK Engine not initialized - check browser console for errors

**Debug:**
```typescript
// In browser console:
// Check if SDK is initialized
console.log('Engine:', engine);
console.log('Market Prices:', marketPrices);
console.log('Active Positions:', activePositions);
console.log('Is Connected:', isConnected);
```

## Extending with More Data

### Adding Trade History (When API Available)

```typescript
// In useDeriverseData.ts
const fetchTradeHistory = useCallback(async () => {
  // Once Deriverse provides a trade history endpoint:
  const history = await engine.getTradeHistory({
    user: publicKey,
    limit: 100,
  });
  
  const trades = history.map(order => 
    convertClosedOrderToTrade(order, symbolMap)
  );
  
  setClosedTrades(trades);
}, [engine, publicKey]);
```

### Adding More Instrument Mappings

```typescript
// In lib/parsers.ts
export function getSymbolForInstrumentId(id: number): string {
  const mapping: Record<number, string> = {
    0: 'BTC-PERP',
    1: 'ETH-PERP',
    2: 'SOL-PERP',
    3: 'SUI-PERP',  // Add more
    4: 'APT-PERP',
  };
  return mapping[id] || `INSTR-${id}`;
}
```

## Performance Considerations

### Polling Frequency
- **Current:** 10 seconds (good balance for demo)
- **Recommendation for production:** 5-30 seconds depending on requirements
- **Adjust in `useDeriverseData.ts`:** Change `setInterval(fetchData, 10000)`

### Data Caching
- Market prices are cached in state
- Reduces redundant calculations
- Consider `useMemo` for expensive computations

### Network Optimization
- Only fetch positions if wallet is connected
- Use conditional polling in useEffect
- Batch multiple SDK calls if possible

## Testing

### Test with Mock Data
```bash
pnpm dev
# Visit dashboard without connecting wallet
# Should show MOCK_TRADES data
```

### Test with SDK (Devnet)
1. Get Devnet SOL: `solana airdrop 2 --url devnet`
2. Connect wallet to dashboard
3. Check browser console for SDK errors
4. Positions should update every 10 seconds

### Debug in Console
```javascript
// Access hook values via React DevTools
// Or add console logs in useDeriverseData.ts
```

## Next Steps

1. **Get Deriverse Whitelisting** (if required)
   - Visit Deriverse Discord
   - Follow whitelisting instructions

2. **Implement Trade History API**
   - Wait for Deriverse trade history endpoint
   - Use same adapter pattern as positions

3. **Add More Analytics**
   - P&L calculations use live prices
   - Fee tracking per trade
   - Performance metrics by symbol

4. **User Preferences**
   - Store notes/tags in localStorage
   - Eventually: backend storage

## Support

For issues with:
- **Dashboard code:** Check [components/](../components/) and [hooks/](../hooks/)
- **SDK integration:** See Deriverse docs at deriverse.com/docs
- **Solana RPC:** Visit Solana documentation
- **Wallet connection:** Check @solana/wallet-adapter docs

## Key Files

| File | Purpose |
|------|---------|
| `hooks/useDeriverseData.ts` | SDK data fetching & polling |
| `lib/deriverse-adapters.ts` | Data transformation |
| `lib/deriverse-client.ts` | SDK initialization |
| `lib/mock-trades.ts` | Mock data for demo/fallback |
| `app/page.tsx` | Main dashboard component |

---

Last Updated: February 19, 2026  
Status: Live Data Integration Complete (Positions Only, Awaiting Trade History API)
