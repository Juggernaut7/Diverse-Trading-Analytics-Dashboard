'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card } from '@/components/ui/card';
import { Wallet, Zap } from 'lucide-react';

export function WalletConnectSection() {
  const { publicKey, connected } = useWallet();

  return (
    <Card className="p-6 bg-neutral-900 border-neutral-800">
      <div className="flex flex-col gap-4">
        {connected ? (
          <>
            {/* Connected State */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-semibold text-emerald-400">Live Data Connected</span>
            </div>
            <div className="text-xs text-neutral-400 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Using on-chain data from Deriverse
            </div>
            <div className="mt-2 p-3 bg-emerald-500/10 border border-emerald-700/30 rounded text-xs text-emerald-300">
              <p className="font-mono break-all">
                {publicKey?.toString()}
              </p>
            </div>
            <div className="flex gap-2">
              <WalletMultiButton className="!bg-emerald-600 hover:!bg-emerald-700 !rounded-lg !h-9 !text-xs !font-medium flex-1" />
            </div>
          </>
        ) : (
          <>
            {/* Disconnected State */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-sm font-semibold text-amber-400">Demo Mode</span>
            </div>
            <div className="text-xs text-neutral-400">
              Connect your wallet to see your real positions and trade data from Deriverse.
            </div>
            <div className="flex gap-2 pt-2">
              <Wallet className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-neutral-300">
                Open positions and market prices update every 10 seconds when connected.
              </p>
            </div>
            <WalletMultiButton className="!bg-emerald-600 hover:!bg-emerald-700 !rounded-lg !h-10 !text-sm !font-semibold w-full !justify-center mt-2" />
          </>
        )}
      </div>
    </Card>
  );
}
