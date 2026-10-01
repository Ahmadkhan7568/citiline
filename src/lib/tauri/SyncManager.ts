import { getAllSyncData } from "@/lib/actions";
import { syncService } from "./sync";

export type SyncStatus = "idle" | "syncing" | "success" | "error";

export class SyncManager {
    private interval: number | null = null;
    private status: SyncStatus = "idle";
    private lastSync: Date | null = null;
    private error: string | null = null;

    constructor(private syncIntervalMs: number = 300000) {} // Default 5 minutes

    getStatus() {
        return {
            status: this.status,
            lastSync: this.lastSync,
            error: this.error
        };
    }

    async startAutoSync() {
        if (this.interval) return;
        
        // Initial sync
        await this.performSync();

        this.interval = window.setInterval(() => {
            this.performSync();
        }, this.syncIntervalMs);
    }

    stopAutoSync() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    async performSync() {
        if (this.status === "syncing") return;

        console.log("Starting background sync...");
        this.status = "syncing";
        this.error = null;

        try {
            const result = await getAllSyncData();
            if (!result.success || !result.data) {
                throw new Error(result.error || "Failed to fetch sync data");
            }

            const tables = Object.keys(result.data);
            for (const table of tables) {
                const data = (result.data as any)[table];
                if (data && Array.isArray(data)) {
                    console.log(`Syncing table: ${table} (${data.length} rows)`);
                    await syncService.syncDown(table, data);
                }
            }

            this.lastSync = new Date();
            this.status = "success";
            console.log("Sync completed successfully at", this.lastSync.toLocaleTimeString());
        } catch (err: any) {
            this.status = "error";
            this.error = err.message;
            console.error("Sync failed:", err);
        } finally {
            // After a short delay, return to idle if successful
            if (this.status === "success") {
                setTimeout(() => {
                    if (this.status === "success") this.status = "idle";
                }, 5000);
            }
        }
    }
}

export const syncManager = new SyncManager();
