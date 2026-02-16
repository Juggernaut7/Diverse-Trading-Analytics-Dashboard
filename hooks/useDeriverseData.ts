"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { useDeriverse } from './useDeriverse';
import { useWallet } from '@solana/wallet-adapter-react';
import { Trade } from '@/lib/types';
import { PublicKey } from '@solana/web3.js';
import { parseInstrumentPrice, getSymbolForInstrumentId } from '@/lib/parsers';

export function useDeriverseData() {
    const { engine, isInitializing } = useDeriverse();
    const { publicKey } = useWallet();
    
    const [marketPrices, setMarketPrices] = useState<Record<string, number>>({});
    const [activePositions, setActivePositions] = useState<Trade[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const pollInterval = useRef<NodeJS.Timeout | null>(null);

    const fetchData = useCallback(async () => {
        if (!engine) return;

        try {
            // 1. Update Engine State (Markets)
            await engine.updateRoot();

            // 2. Extract Prices
            // 2. Extract Prices
            const prices: Record<string, number> = {};
            engine.instruments.forEach((instrument, id) => {
                const price = parseInstrumentPrice(instrument);
                // Use symbol as key if possible, fallback to ID string
                // For UI consistency, we might want to map this to our mock symbols
                // But for now, let's use the ID or symbol from parser
                prices[id.toString()] = price;
            });
            // console.log('Fetched derivative prices:', prices);
            setMarketPrices(prices);

            // 3. Fetch User Positions
            if (publicKey && engine.clientLutAddress) {
                try {
                    // We use getClientData to get a summary
                    const clientData = await engine.getClientData();

                    // In a real scenario, we would parse clientData.perp
                    // and potentially fetch more details. 
                    // For now, returning empty array as we don't have active positions in this dev environment
                    setActivePositions([]);
                } catch (e) {
                    console.error("Failed to fetch client data", e);
                }
            }

        } catch (err) {
            console.error('Error fetching Deriverse data:', err);
        }
    }, [engine, publicKey]);

    // Polling effect
    useEffect(() => {
        if (!engine || isInitializing) return;

        setIsLoadingData(true);
        fetchData().finally(() => setIsLoadingData(false));

        pollInterval.current = setInterval(fetchData, 10000); // Poll every 10s

        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, [engine, isInitializing, fetchData]);

    return {
        marketPrices,
        activePositions,
        isLoadingData,
        isConnected: !!publicKey,
    };
}
