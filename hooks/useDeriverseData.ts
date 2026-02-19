"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { useDeriverse } from './useDeriverse';
import { useWallet } from '@solana/wallet-adapter-react';
import { Trade } from '@/lib/types';
import { PublicKey } from '@solana/web3.js';
import { parseInstrumentPrice, getSymbolForInstrumentId } from '@/lib/parsers';
import { 
    convertPerpPositionToTrade, 
    convertClosedOrderToTrade,
    mergeTrades 
} from '@/lib/deriverse-adapters';

export function useDeriverseData() {
    const { engine, isInitializing } = useDeriverse();
    const { publicKey } = useWallet();
    
    const [marketPrices, setMarketPrices] = useState<Record<string, number>>({});
    const [activePositions, setActivePositions] = useState<Trade[]>([]);
    const [closedTrades, setClosedTrades] = useState<Trade[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [dataError, setDataError] = useState<string | null>(null);
    const pollInterval = useRef<NodeJS.Timeout | null>(null);

    // Build symbol map from instruments
    const buildSymbolMap = useCallback((): Record<number, string> => {
        if (!engine) return {};
        
        const symbolMap: Record<number, string> = {};
        engine.instruments?.forEach((instrument, id) => {
            // Try to get symbol from instrument metadata, fallback to generic mapping
            const symbol = getSymbolForInstrumentId(id);
            symbolMap[id] = symbol;
        });
        return symbolMap;
    }, [engine]);

    const fetchData = useCallback(async () => {
        if (!engine) return;

        try {
            setDataError(null);

            // 1. Update Engine State (Markets)
            await engine.updateRoot();

            // 2. Extract Market Prices
            const prices: Record<string, number> = {};
            const symbolMap = buildSymbolMap();
            
            engine.instruments?.forEach((instrument, id) => {
                const price = parseInstrumentPrice(instrument);
                prices[id.toString()] = price;
                prices[symbolMap[id] || id.toString()] = price;
            });
            setMarketPrices(prices);

            // 3. Fetch User Positions and Trade History
            if (publicKey && engine.clientLutAddress) {
                try {
                    // Fetch client data
                    const clientData = await engine.getClientData();
                    
                    // Extract active perpetual positions
                    const positions: Trade[] = [];
                    if (clientData?.perp && Array.isArray(clientData.perp)) {
                        clientData.perp.forEach((position: any, instrumentId: number) => {
                            if (position && position.size > 0) {
                                const price = prices[instrumentId.toString()] || 0;
                                const symbol = symbolMap[instrumentId] || `INSTR-${instrumentId}`;
                                const trade = convertPerpPositionToTrade(
                                    position,
                                    price,
                                    symbol,
                                    instrumentId
                                );
                                if (trade) positions.push(trade);
                            }
                        });
                    }
                    setActivePositions(positions);

                    // Fetch trade history (if available in the SDK)
                    // This depends on whether Deriverse provides a trade history API
                    // For now, we'll leave this as empty and let the app fall back to mock data
                    setClosedTrades([]);

                } catch (e) {
                    console.error("Failed to fetch client data:", e);
                    setDataError(`Failed to fetch positions: ${e instanceof Error ? e.message : 'Unknown error'}`);
                }
            } else {
                // Not connected or no client data available
                setActivePositions([]);
                setClosedTrades([]);
            }

        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error';
            console.error('Error fetching Deriverse data:', err);
            setDataError(errorMsg);
        } finally {
            setIsLoadingData(false);
        }
    }, [engine, publicKey, buildSymbolMap]);

    // Polling effect
    useEffect(() => {
        if (!engine || isInitializing) return;

        setIsLoadingData(true);
        fetchData().finally(() => setIsLoadingData(false));

        // Poll every 10 seconds for updated prices and positions
        pollInterval.current = setInterval(fetchData, 10000);

        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, [engine, isInitializing, fetchData]);

    return {
        marketPrices,
        activePositions,
        closedTrades,
        isLoadingData,
        dataError,
        isConnected: !!publicKey,
    };
}
