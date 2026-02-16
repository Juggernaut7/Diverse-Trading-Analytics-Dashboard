"use client";

import { useEffect, useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { Engine } from '@deriverse/kit';
import { getDeriverseEngine } from '@/lib/deriverse-client';

export function useDeriverse() {
    const { connection } = useConnection();
    const [engine, setEngine] = useState<Engine | null>(null);
    const [isInitializing, setIsInitializing] = useState(false);

    useEffect(() => {
        async function init() {
            if (!connection) return;

            try {
                setIsInitializing(true);
                const engineInstance = getDeriverseEngine(connection);

                // We might want to call engine.initialize() here if needed
                // await engineInstance.initialize();

                setEngine(engineInstance);
            } catch (err) {
                console.error('Failed to initialize Deriverse Engine:', err);
            } finally {
                setIsInitializing(false);
            }
        }

        init();
    }, [connection]);

    return {
        engine,
        isInitializing,
    };
}
