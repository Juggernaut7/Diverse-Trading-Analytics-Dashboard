"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { useDeriverse } from './useDeriverse';
import { useWallet } from '@solana/wallet-adapter-react';
import { Trade } from '@/lib/types';
import { parseInstrumentPrice, getSymbolForInstrumentId } from '@/lib/parsers';
import {
    convertPerpPositionToTrade,
    mergeTrades
} from '@/lib/deriverse-adapters';
import { DEFAULT_PROGRAM_ID } from '@/lib/deriverse-client';

// System program ID - SDK sometimes exposes this when misconfigured; we skip updateRoot to avoid RPC errors
const SYSTEM_PROGRAM_ID = '11111111111111111111111111111111';

export function useDeriverseData() {
    const { engine, isInitializing } = useDeriverse();
    const { publicKey } = useWallet();

    const [marketPrices, setMarketPrices] = useState<Record<string, number>>({});
    const [activePositions, setActivePositions] = useState<Trade[]>([]);
    const [closedTrades, setClosedTrades] = useState<Trade[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [dataError, setDataError] = useState<string | null>(null);
    const pollInterval = useRef<NodeJS.Timeout | null>(null);
    const updateRootFailureCount = useRef(0);

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
        if (!engine) {
            console.log('[Deriverse] Skipping fetchData: engine not initialized');
            return;
        }

        try {
            setDataError(null);

            // 1. Update Engine State (Global Markets)
            const programIdStr = typeof engine.programId === 'string'
                ? engine.programId
                : (engine.programId?.toBase58?.() ?? String(engine.programId ?? ''));
            const isProgramIdInvalid = !programIdStr || programIdStr === SYSTEM_PROGRAM_ID;

            if (isProgramIdInvalid) {
                console.warn('[Deriverse] Skipping updateRoot: invalid or system programId', programIdStr);
                // Don't set dataError so UI stays clean when using cached/mock data
            } else {
                try {
                    await engine.updateRoot();
                    console.log('[Deriverse] updateRoot successful');
                    updateRootFailureCount.current = 0;
                    setDataError(null);
                } catch (err) {
                    const msg = err instanceof Error ? err.message : String(err);
                    const isRpcParamError = /invalid type: null|expected a string/i.test(msg);
                    updateRootFailureCount.current += 1;
                    console.error('[Deriverse] updateRoot failed:', err);
                    if (isRpcParamError) {
                        // Don't set dataError so UI stays clean when using cached/mock data
                    } else {
                        throw err;
                    }
                }
            }

            // 2. Extract Market Prices
            const prices: Record<string, number> = {};
            const symbolMap = buildSymbolMap();

            if (engine.instruments) {
                console.log(`[Deriverse] Processing ${engine.instruments.size} instruments`);
                engine.instruments.forEach((instrument, id) => {
                    const price = parseInstrumentPrice(instrument);
                    prices[id.toString()] = price;
                    prices[symbolMap[id] || id.toString()] = price;
                });
            } else {
                console.warn('[Deriverse] No instruments found in engine after updateRoot');
            }
            setMarketPrices(prices);

            // 3. Fetch User Positions and Trade History
            if (publicKey) {
                const walletAddr = publicKey.toBase58();
                console.log(`[Deriverse] Fetching data for wallet: ${walletAddr}`);

                try {
                    // Deriverse V6: Must ensure the client is loaded on the engine instance
                    // If the clientLutAddress is not yet set, or it doesn't match the current publicKey, load it.
                    // Note: engine.clientAddress is the internal tracked address in V6
                    const currentClientAddr = (engine as any).clientAddress;

                    if (!engine.clientLutAddress || currentClientAddr !== walletAddr) {
                        console.log(`[Deriverse] Loading client state for ${walletAddr}...`);

                        // Defensive check for loadClient/setClient
                        if (typeof (engine as any).loadClient === 'function') {
                            await (engine as any).loadClient(walletAddr);
                            console.log('[Deriverse] loadClient completed');
                        } else if (typeof (engine as any).setClient === 'function') {
                            await (engine as any).setClient(walletAddr);
                            console.log('[Deriverse] setClient completed');
                        } else {
                            console.warn('[Deriverse] Neither loadClient nor setClient found on engine');
                        }
                    }

                    console.log('[Deriverse] SDK state:', {
                        clientLutAddress: engine.clientLutAddress,
                        clientAddress: (engine as any).clientAddress
                    });

                    // Only proceed if LUT is now available
                    if (engine.clientLutAddress) {
                        console.log('[Deriverse] Calling getClientData...');
                        // Fetch client data (positions, etc)
                        const clientData = await engine.getClientData();
                        console.log('[Deriverse] getClientData result:', clientData ? 'Data received' : 'Null result');

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
                        console.log(`[Deriverse] Found ${positions.length} active positions`);
                        setActivePositions(positions);
                    } else {
                        console.warn('[Deriverse] Skipping getClientData: clientLutAddress is still null after loading');
                        setActivePositions([]);
                    }

                    // Fetch trade history (if available in the SDK)
                    setClosedTrades([]);

                } catch (e) {
                    console.error("[Deriverse] Client data fetch error:", e);
                    // Don't set global dataError if only client-specific fetch fails, 
                    // unless it's a critical RPC error
                    if (e instanceof Error && e.message.includes('JSON-RPC error')) {
                        setDataError(`RPC Error: ${e.message}`);
                    }
                }
            } else {
                // Not connected or no client data available
                setActivePositions([]);
                setClosedTrades([]);
            }

        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error';
            console.error('[Deriverse] Global fetchData error:', err);
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
