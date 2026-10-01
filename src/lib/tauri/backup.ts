import { save, open, message, ask } from "@tauri-apps/plugin-dialog";
import { appConfigDir, join } from "@tauri-apps/api/path";
import { copyFile, remove, exists } from "@tauri-apps/plugin-fs";
import { relaunch } from "@tauri-apps/plugin-process";

export class BackupService {
    private dbName = "citiline.db";

    /**
     * Finds the absolute path to the local citiline.db file
     */
    async getDbPath(): Promise<string> {
        const configDir = await appConfigDir();
        return await join(configDir, this.dbName);
    }

    /**
     * Exports the current database to a user-selected location
     */
    async exportDatabase(): Promise<boolean> {
        try {
            const dbPath = await this.getDbPath();
            
            // Check if source exists
            if (!(await exists(dbPath))) {
                await message("No database found to backup. Have you synced yet?", { title: "Error", kind: "error" });
                return false;
            }

            // Pick destination
            const selectedPath = await save({
                title: "Save Citiline Backup",
                defaultPath: `citiline_backup_${new Date().toISOString().split('T')[0]}.db`,
                filters: [{ name: "SQLite Database", extensions: ["db"] }]
            });

            if (!selectedPath) return false;

            // Copy file
            await copyFile(dbPath, selectedPath);
            await message("Backup successfully saved to your device.", { title: "Success" });
            return true;
        } catch (e) {
            console.error("Backup failed:", e);
            await message(`Backup failed: ${e}`, { title: "System Error", kind: "error" });
            return false;
        }
    }

    /**
     * Restores the database from a user-selected file
     * WARNING: This overwrites current data
     */
    async importDatabase(): Promise<void> {
        try {
            // Confirm with user
            const confirmed = await ask(
                "This will OVERWRITE all your current invoices, ledger, and customer data with the backup file. This cannot be undone. Proceed?",
                { title: "Critical: Database Restore", kind: "warning" }
            );

            if (!confirmed) return;

            // Pick source
            const selectedPath = await open({
                title: "Select Citiline Backup to Restore",
                multiple: false,
                filters: [{ name: "SQLite Database", extensions: ["db"] }]
            });

            if (!selectedPath || Array.isArray(selectedPath)) return;

            const dbPath = await this.getDbPath();

            // Perform Overwrite
            // 1. Remove current (if exists)
            if (await exists(dbPath)) {
                await remove(dbPath);
            }
            
            // 2. Copy new
            await copyFile(selectedPath, dbPath);

            await message("Database successfully restored. The application will now relaunch to apply changes.", { title: "Restore Complete" });
            
            // 3. Relaunch to ensure SQL plugin reloads the new file
            await relaunch();
        } catch (e) {
            console.error("Restore failed:", e);
            await message(`Restore failed: ${e}`, { title: "System Error", kind: "error" });
        }
    }
}
