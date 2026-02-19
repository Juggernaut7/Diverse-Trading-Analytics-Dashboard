# Quick Start: Live Data Integration

## 1. How It Works

The dashboard now supports **two modes**:

### 🔴 **Demo Mode** (No Wallet Connected)
- Shows mock trade data
- No real positions or prices
- Great for UI/UX testing

### 🟢 **Live Mode** (Wallet Connected)
- Shows **real open positions** from Deriverse
- Real-time market prices
- Updates every 10 seconds
- Mock data used as fallback for closed trade history

## 2. Running the Dashboard

```bash
# Install dependencies (if not done)
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

Visit: `http://localhost:3000`

## 3. See Live Data

### Step 1: Connect Your Wallet
1. Click **"Select Wallet"** button in the header
2. Choose a wallet (Phantom, Solflare, etc.)
3. Approve connection

### Step 2: Check Connection Status
Look for the status indicator in the left sidebar:
- ✅ **"✓ Live Data Connected"** = Using on-chain data
- ⚠️ **"Demo Mode"** = No wallet, showing mock data

### Step 3: View Your Positions
Your real open positions from Deriverse appear in the **"Open Positions"** section:
- Entry price, size, current P&L update every 10 seconds
- Unrealized P&L calculated in real-time

## 4. Code Structure

### New Files Added

| File | Purpose |
|------|---------|
| `lib/deriverse-adapters.ts` | Converts SDK data to Trade format |
| `LIVE_DATA_INTEGRATION.md` | Full technical documentation |

### Modified Files

| File | What Changed |
|------|--------------|
| `hooks/useDeriverseData.ts` | Now fetches real positions from SDK |
| `app/page.tsx` | Shows connection status, uses SDK data |
| `package.json` | Added @solana/rpc dependency |

## 5. Troubleshooting

### ❌ "No positions showing after connecting wallet?"
- **Reason:** You might not have open positions on Devnet
- **Solution:** Open a position on Deriverse first, then refresh dashboard

### ❌ "Error in console about WalletContext?"
- **Reason:** Expected during build (SSR phase)
- **Solution:** This doesn't affect the app - wallet loads at runtime ✓

### ❌ "Getting data errors?"
- Check browser console (F12 → Console tab)
- Verify you're connected to the correct network
- Try reconnecting wallet

## 6. Key Features

### ✅ Currently Working
- Market prices (real-time)
- Open perpetual positions (real-time)
- Unrealized P&L (calculated from live prices)
- Auto-refresh every 10 seconds
- Mock data fallback
- Connection status indicator

### 🚀 Coming Soon (Awaiting Deriverse API)
- Complete trade history with live data
- Historical P&L charts from on-chain data
- More instrument types (spot, options)

## 7. Live Data Sources

Your data comes from:

```
Solana RPC → Deriverse SDK → Your Dashboard
                   ↓
         Updates every 10 seconds
         for prices & positions
```

- **RPC Endpoint:** Solana Devnet
- **SDK:** @deriverse/kit v1.0.41
- **Update Interval:** 10 seconds (adjustable)

## 8. Quick Config Changes

### Change polling interval (currently 10s)

Edit `hooks/useDeriverseData.ts`:
```typescript
// Change this line:
pollInterval.current = setInterval(fetchData, 10000);

// To (e.g., 5 seconds):
pollInterval.current = setInterval(fetchData, 5000);
```

### Change RPC endpoint

Edit `lib/deriverse-client.ts`:
```typescript
// Change this:
const rpc = createSolanaRpc('https://api.devnet.solana.com');

// To (e.g., Mainnet):
const rpc = createSolanaRpc('https://api.mainnet-beta.solana.com');
```

## 9. Testing Checklist

- [ ] Build completes successfully
- [ ] Dashboard loads without errors
- [ ] Wallet connection works
- [ ] Status indicator shows correct state
- [ ] Positions update when connected
- [ ] Mock data shows when disconnected
- [ ] No console errors (except expected WalletContext at build)

## 10. Next Steps

1. **Get Devnet SOL:** `solana airdrop 2 --url devnet`
2. **Open a position** on Deriverse
3. **Connect wallet** to dashboard
4. **Watch live updates** of your position

---

**Questions?** See [LIVE_DATA_INTEGRATION.md](./LIVE_DATA_INTEGRATION.md) for detailed docs.

**Last Updated:** February 19, 2026
