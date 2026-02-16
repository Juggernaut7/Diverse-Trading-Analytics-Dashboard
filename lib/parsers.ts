import { Instrument } from '@deriverse/kit';

/**
 * Parses a Deriverse Instrument to extract the current mid-price.
 * @param instrument The instrument object from the SDK
 * @returns The calculated mid-price or last traded price
 */
export function parseInstrumentPrice(instrument: Instrument): number {
    if (!instrument || !instrument.header) return 0;

    const bestBid = instrument.header.perpBestBid;
    const bestAsk = instrument.header.perpBestAsk;

    // Basic validation to avoid using uninitialized values
    // Max safe integer check is a proxy for "max value" often used as sentinel
    if (bestBid > 0 && bestAsk > 0 && bestAsk < Number.MAX_SAFE_INTEGER) {
        return (bestBid + bestAsk) / 2;
    }

    if (instrument.header.perpLastPx > 0) {
        return instrument.header.perpLastPx;
    }

    return 0;
}

/**
 * Maps an Instrument ID to a display symbol.
 * @param id The instrument ID
 * @returns A string representation of the symbol (e.g., "BTC-PERP")
 */
export function getSymbolForInstrumentId(id: number): string {
    // In a real app, this would query on-chain metadata or a static config
    // For now, we return a placeholder that matches our mock data if possible
    const mapping: Record<number, string> = {
        0: 'BTC-PERP',
        1: 'ETH-PERP',
        2: 'SOL-PERP',
    };
    return mapping[id] || `INSTR-${id}`;
}
