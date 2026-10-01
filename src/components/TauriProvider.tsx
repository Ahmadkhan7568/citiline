"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { syncManager, SyncStatus } from "@/lib/tauri/SyncManager";

interface TauriContextType {
    isTauri: boolean;
    syncStatus: SyncStatus;
    lastSync: Date | null;
    syncError: string | null;
    triggerSync: () => Promise<void>;
}

const TauriContext = createContext<TauriContextType | undefined>(undefined);

export function TauriProvider({ children }: { children: React.ReactNode }) {
    const [isTauri, setIsTauri] = useState(false);
    const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
    const [lastSync, setLastSync] = useState<Date | null>(null);
    const [syncError, setSyncError] = useState<string | null>(null);

    useEffect(() => {
        // Detect if running in Tauri
        const runningInTauri = typeof window !== "undefined" && (window as any).__TAURI_INTERNALS__ !== undefined;
        setIsTauri(runningInTauri);

        if (runningInTauri) {
            console.log("Tauri environment detected. Initializing sync...");
            
            // Start auto sync
            syncManager.startAutoSync();

            // Setup a polling interval to update the context state from the manager
            const interval = setInterval(() => {
                const state = syncManager.getStatus();
                setSyncStatus(state.status);
                setLastSync(state.lastSync);
                setSyncError(state.error);
            }, 1000);

            return () => {
                clearInterval(interval);
                syncManager.stopAutoSync();
            };
        }
    }, []);

    const triggerSync = async () => {
        if (isTauri) {
            await syncManager.performSync();
        }
    };

    return (
        <TauriContext.Provider value={{ isTauri, syncStatus, lastSync, syncError, triggerSync }}>
            {children}
        </TauriContext.Provider>
    );
}

export function useTauri() {
    const context = useContext(TauriContext);
    if (context === undefined) {
        throw new Error("useTauri must be used within a TauriProvider");
    }
    return context;
}
