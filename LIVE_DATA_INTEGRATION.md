# Live Data Integration Guide - Deriverse Trading Dashboard

## Overview

This guide explains how the dashboard integrates live data from the Deriverse SDK.

## Architecture

### Data Sources

**Live Mode** (Wallet Connected)
- Real-time market prices from Deriverse SDK
- Live perpetual positions from blockchain
- Updates every 10 seconds

**Demo Mode** (No Wallet)
- Mock historical trades for testing
- All features fully functional
- Perfect for feature evaluation

## Integration Points

### 1. SDK Initialization

```typescript
// lib/deriverse-client.ts
const engine = new Engine(rpc, {
  programId: PROGRAM_ID,
  version: VERSION
});
```

### 2. Data Fetching

```typescript
// hooks/useDeriverseData.ts
// Every 10 seconds:
await engine.updateRoot();
engine.instruments.forEach(instrument => {
  const price = parseInstrumentPrice(instrument);
});

const clientData = await engine.getClientData();
// Extract perpetual positions
```

### 3. Data Transformation

```typescript
// lib/deriverse-adapters.ts
convertPerpPositionToTrade() // SDK to Trade format
convertClosedOrderToTrade()  // Order to Trade format
mergeTrades()                // Deduplicate SDK + mock
```

## Performance

- Poll interval: 10 seconds (adjustable)
- Batch updates to minimize re-renders
- Efficient state management
- Market prices cached between polls

## Error Handling

- Try-catch on all async operations
- User-friendly error messages
- Graceful fallback to mock data
- Logging for debugging

## Setup

### Prerequisites
- Node.js 18+
- pnpm 8+
- Solana wallet (Phantom, Solflare)

### Installation

```bash
pnpm install
pnpm add @solana/rpc
pnpm dev
```

### Environment

```env
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_DERIVERSE_PROGRAM_ID=CDESjex4EDBKLwx9ZPzVbjiHEHatasb5fhSJZMzNfvw2
```

## Using Live Data

### Connect Wallet
1. Click "Select Wallet" in sidebar
2. Choose wallet provider
3. Approve connection
4. Dashboard shows "Live Data Connected"

### View Live Positions
- Open positions update every 10 seconds
- Real-time P&L calculations
- Market prices streamed from Solana

### Monitor Analytics
- All metrics calculated from live data
- Charts update automatically
- Historical data supplements closed trades

## Troubleshooting

### No positions showing
- Wallet must be connected
- Need open positions on Devnet
- Check SDK initialization in console

### Data not updating
- Verify Solana RPC is accessible
- Check polling is active (10s interval)
- Clear browser cache if needed

### Build errors
- Run `pnpm install` to update dependencies
- Check TypeScript errors: `pnpm tsc --noEmit`
- Verify Node.js version (18+)

## Future Enhancements

1. Trade history API integration
2. Advanced charting with indicators
3. Risk management alerts
4. Backtesting features
5. Social sharing

---

**Version**: 1.0.0
**Last Updated**: February 19, 2026
