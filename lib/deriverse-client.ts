import { Connection, PublicKey } from '@solana/web3.js';
import { Engine } from '@deriverse/kit';
import { createSolanaRpc } from '@solana/rpc';

// Addresses for Deriverse
const PROGRAM_ID = new PublicKey('CDESjex4EDBKLwx9ZPzVbjiHEHatasb5fhSJZMzNfvw2');
const VERSION = 6;

let engineInstance: Engine | null = null;

export const getDeriverseEngine = (connection: Connection) => {
    if (engineInstance) return engineInstance;

    // Use the connection endpoint to create the RPC client expected by Deriverse SDK
    // The SDK uses the new @solana/rpc interface
    const rpc = createSolanaRpc('https://api.devnet.solana.com');

    // Initialize the Engine
    // @ts-ignore - Ignoring strict type check on RPC for now as we transition between web3.js versions
    engineInstance = new Engine(rpc, {
        programId: PROGRAM_ID as any, // Cast to compatible Address type if needed
        version: VERSION,
        // Add other config if needed
    });

    return engineInstance;
};
