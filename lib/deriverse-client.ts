import { Connection } from '@solana/web3.js';
import { Engine } from '@deriverse/kit';
import { createSolanaRpc } from '@solana/rpc';

// Deriverse configuration
export const DEFAULT_PROGRAM_ID = 'CDESjex4EDBKLwx9ZPzVbjiHEHatasb5fhSJZMzNfvw2';
const VERSION = 6;

// Resolve program ID - Hardcoded as primary source of truth for Devnet
const PROGRAM_ID: string = DEFAULT_PROGRAM_ID;

// Fallback RPC URL so we never pass null/undefined to createSolanaRpc (fixes "invalid type: null, expected a string")
const DEFAULT_RPC_URL = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SOLANA_RPC
    ? process.env.NEXT_PUBLIC_SOLANA_RPC
    : 'https://api.devnet.solana.com';

let engineInstance: Engine | null = null;

function getRpcEndpoint(connection: Connection): string {
    const fromConnection = (connection as { rpcEndpoint?: string }).rpcEndpoint;
    if (typeof fromConnection === 'string' && fromConnection.length > 0) return fromConnection;
    return DEFAULT_RPC_URL;
}

export const getDeriverseEngine = (connection: Connection) => {
    if (engineInstance) return engineInstance;

    const endpoint = getRpcEndpoint(connection);
    console.log('[Deriverse] Initializing Engine with Program ID:', PROGRAM_ID, 'endpoint:', endpoint);

    // Ensure we never pass null/undefined (Solana JSON-RPC requires string)
    const rpc = createSolanaRpc(endpoint);

    // Initialize the Engine
    // @ts-ignore - The SDK types might lag behind the @solana/rpc version
    engineInstance = new Engine(rpc, {
        programId: PROGRAM_ID as any,
        version: VERSION,
    });

    return engineInstance;
};
