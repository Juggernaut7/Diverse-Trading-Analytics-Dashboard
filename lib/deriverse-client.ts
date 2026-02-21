
import { Connection } from '@solana/web3.js';
import { Engine } from '@deriverse/kit';
import { createSolanaRpc } from '@solana/rpc';


// Deriverse configuration
const DEFAULT_PROGRAM_ID = '11111111111111111111111111111111';
const VERSION = 6;

// Resolve program ID as a plain base58 string (the Engine SDK validates via Zod)
const PROGRAM_ID: string = (() => {
    const envId = process.env.NEXT_PUBLIC_DERIVERSE_PROGRAM_ID;
    if (envId && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(envId)) {
        return envId;
    }
    console.warn('[Deriverse] Invalid or missing NEXT_PUBLIC_DERIVERSE_PROGRAM_ID, using System Program as fallback.');
    return DEFAULT_PROGRAM_ID;
})();

let engineInstance: Engine | null = null;

export const getDeriverseEngine = (connection: Connection) => {
    if (engineInstance) return engineInstance;

    // Use the connection endpoint to create the RPC client expected by Deriverse SDK
    // The SDK uses the new @solana/rpc interface
    const rpc = createSolanaRpc('https://api.devnet.solana.com');

    // Initialize the Engine
    // @ts-ignore - Ignoring strict type check on RPC for now as we transition between web3.js versions
    engineInstance = new Engine(rpc, {
        programId: PROGRAM_ID as any,
        version: VERSION,
    });

    return engineInstance;
};
