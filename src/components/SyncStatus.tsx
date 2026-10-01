"use client";

import React from "react";
import { useTauri } from "./TauriProvider";
import { RefreshCw, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SyncStatus() {
    const { isTauri, syncStatus, lastSync, syncError, triggerSync } = useTauri();

    if (!isTauri) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-md transition-all duration-300 shadow-lg",
                syncStatus === "syncing" ? "bg-primary/10 border-primary/20 text-primary" : 
                syncStatus === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                syncStatus === "error" ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
                "bg-zinc-900/50 border-white/5 text-zinc-400"
            )}>
                <div className="relative">
                    {syncStatus === "syncing" ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : syncStatus === "success" ? (
                        <CheckCircle2 className="w-4 h-4" />
                    ) : syncStatus === "error" ? (
                        <AlertCircle className="w-4 h-4" />
                    ) : (
                        <Clock className="w-4 h-4" />
                    )}
                </div>

                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider font-bold leading-none mb-0.5">
                        {syncStatus === "syncing" ? "Mirroring Database" : 
                         syncStatus === "success" ? "All Systems Local" :
                         syncStatus === "error" ? "Sync Failed" : "Local Standby"}
                    </span>
                    <span className="text-[9px] opacity-70 leading-none">
                        {syncStatus === "syncing" ? "Syncing with cloud..." :
                         syncError ? syncError :
                         lastSync ? `Last: ${lastSync.toLocaleTimeString()}` : "Waiting for initial sync"}
                    </span>
                </div>

                {syncStatus !== "syncing" && (
                    <button 
                        onClick={() => triggerSync()}
                        className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors"
                        title="Force Sync"
                    >
                        <RefreshCw className="w-3 h-3" />
                    </button>
                )}
            </div>
        </div>
    );
}
