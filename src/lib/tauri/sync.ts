import Database from "@tauri-apps/plugin-sql";

// Database initialization and sync service
export class SyncService {
    private db: Database | null = null;

    async init() {
        if (!this.db) {
            this.db = await Database.load("sqlite:citiline.db");
            await this.runMigrations();
        }
        return this.db;
    }

    private async runMigrations() {
        if (!this.db) return;

        // Simplified schema creation for local SQLite
        // In a real app, we'd use Drizzle-kit or a shared migration tool
        await this.db.execute(`
            CREATE TABLE IF NOT EXISTS customers (
                id TEXT PRIMARY KEY,
                company_name TEXT NOT NULL,
                ntn TEXT,
                contact_person TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                address TEXT,
                opening_balance DECIMAL(15,2) DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS invoices (
                id TEXT PRIMARY KEY,
                invoice_number TEXT NOT NULL UNIQUE,
                customer_id TEXT NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP,
                due_date DATETIME,
                subtotal DECIMAL(15,2) NOT NULL,
                tax_rate DECIMAL(5,2) DEFAULT 18,
                tax_amount DECIMAL(15,2) NOT NULL,
                discount DECIMAL(15,2) DEFAULT 0,
                total DECIMAL(15,2) NOT NULL,
                status TEXT DEFAULT 'PENDING',
                fbr_status TEXT DEFAULT 'Pending',
                fbr_irn TEXT,
                fbr_qr_data TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS invoice_items (
                id TEXT PRIMARY KEY,
                invoice_id TEXT NOT NULL,
                description TEXT NOT NULL,
                quantity DECIMAL(10,2) NOT NULL,
                unit_price DECIMAL(15,2) NOT NULL,
                tax_amount DECIMAL(15,2) NOT NULL,
                total DECIMAL(15,2) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS ledger_entries (
                id TEXT PRIMARY KEY,
                customer_id TEXT NOT NULL,
                invoice_id TEXT,
                date DATETIME DEFAULT CURRENT_TIMESTAMP,
                type TEXT NOT NULL,
                amount DECIMAL(15,2) NOT NULL,
                description TEXT NOT NULL,
                running_balance DECIMAL(15,2) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS employees (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                designation TEXT NOT NULL,
                email TEXT,
                phone TEXT,
                joining_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                salary DECIMAL(15,2) NOT NULL,
                is_active BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS payroll (
                id TEXT PRIMARY KEY,
                employee_id TEXT NOT NULL,
                month TEXT NOT NULL,
                year INTEGER NOT NULL,
                basic_salary DECIMAL(15,2) NOT NULL,
                bonuses DECIMAL(15,2) DEFAULT 0,
                deductions DECIMAL(15,2) DEFAULT 0,
                net_salary DECIMAL(15,2) NOT NULL,
                payment_status TEXT DEFAULT 'PENDING',
                payment_date DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS expense_categories (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                description TEXT
            );

            CREATE TABLE IF NOT EXISTS expenses (
                id TEXT PRIMARY KEY,
                category_id TEXT NOT NULL,
                amount DECIMAL(15,2) NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP,
                description TEXT NOT NULL,
                receipt_url TEXT,
                paid_to TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS company_settings (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                ntn TEXT NOT NULL,
                bearer_token TEXT,
                environment TEXT DEFAULT 'Sandbox',
                address TEXT,
                phone TEXT,
                email TEXT,
                gst TEXT,
                logo_url TEXT,
                currency TEXT DEFAULT 'PKR',
                financial_year_start TEXT DEFAULT 'July',
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS services (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                category TEXT NOT NULL,
                base_price DECIMAL(15,2) NOT NULL,
                tax_rate DECIMAL(5,2) DEFAULT 18,
                is_active BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Local SQLite Migrations expanded.");
    }

    async syncDown(table: string, data: any[]) {
        if (!this.db) await this.init();
        // Upsert logic for sync from Web to Local
        for (const row of data) {
            const keys = Object.keys(row).join(",");
            const placeholders = Object.keys(row).map(() => "?").join(",");
            const values = Object.values(row);
            
            await this.db!.execute(`
                INSERT OR REPLACE INTO ${table} (${keys})
                VALUES (${placeholders})
            `, values);
        }
    }

    async getLocalData(table: string) {
        if (!this.db) await this.init();
        return await this.db!.select(`SELECT * FROM ${table}`);
    }
}

export const syncService = new SyncService();
