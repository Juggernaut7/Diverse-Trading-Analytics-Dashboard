'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card } from '@/components/ui/card';
import { Wallet, Zap } from 'lucide-react';

export function WalletConnectSection() {
  const { publicKey, connected } = useWallet();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <Card className="p-4 sm:p-6 bg-neutral-900 border-neutral-800 w-full">
      <div className="flex flex-col gap-4">
        {connected ? (
          <>
            {/* Connected State */}
            {/* Trust/connection status now in nav/sidebar, not here */}
            <div className="flex gap-2">
              {mounted && (
                <WalletMultiButton className="!bg-emerald-600 hover:!bg-emerald-700 !rounded-lg !h-9 !text-xs !font-medium flex-1" />
              )}
            </div>
          </>
        ) : (
          <>
            {/* Disconnected State */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
              <span className="text-sm font-semibold text-amber-400">Demo Mode</span>
            </div>
            <div className="text-xs text-neutral-400 leading-relaxed">
              Connect your wallet to see your real positions and trade data from Deriverse.
            </div>
            <div className="flex gap-2 pt-2">
              <Wallet className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-neutral-300 leading-relaxed">
                Open positions and market prices update every 10 seconds when connected.
              </p>
            </div>
            {mounted && (
              <WalletMultiButton className="!bg-emerald-600 hover:!bg-emerald-700 !rounded-lg !h-10 !text-sm !font-semibold w-full !justify-center mt-2" />
            )}
          </>
        )}
      </div>
    </Card>
  );
}
