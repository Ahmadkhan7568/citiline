import { pgTable, text, timestamp, integer, boolean, decimal, pgEnum, uuid } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["ADMIN", "STAFF", "CLIENT"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["DEBIT", "CREDIT"]);
export const invoiceStatusEnum = pgEnum("invoice_status", ["PENDING", "VERIFIED", "FAILED", "PAID"]);

// Users - Authentication & Profile linkage
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    role: roleEnum("role").default("CLIENT").notNull(),
    customerId: uuid("customer_id").references(() => customers.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Customers - CRM Core
export const customers = pgTable("customers", {
    id: uuid("id").defaultRandom().primaryKey(),
    companyName: text("company_name").notNull(),
    ntn: text("ntn"),
    contactPerson: text("contact_person").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    address: text("address"),
    openingBalance: decimal("opening_balance", { precision: 15, scale: 2 }).default("0").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Invoices - Sales Record (FBR Compliant)
export const invoices = pgTable("invoices", {
    id: uuid("id").defaultRandom().primaryKey(),
    invoiceNumber: text("invoice_number").notNull().unique(), // CIT-XXXX
    customerId: uuid("customer_id").references(() => customers.id).notNull(),
    date: timestamp("date").defaultNow().notNull(),
    dueDate: timestamp("due_date"),
    subtotal: decimal("subtotal", { precision: 15, scale: 2 }).notNull(),
    taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("18").notNull(),
    taxAmount: decimal("tax_amount", { precision: 15, scale: 2 }).notNull(),
    discount: decimal("discount", { precision: 15, scale: 2 }).default("0").notNull(),
    total: decimal("total", { precision: 15, scale: 2 }).notNull(),
    status: invoiceStatusEnum("status").default("PENDING").notNull(),
    fbrIrn: text("fbr_irn"),
    fbrQrPath: text("fbr_qr_path"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// LedgerEntries - Double-Entry Financials
export const ledgerEntries = pgTable("ledger_entries", {
    id: uuid("id").defaultRandom().primaryKey(),
    customerId: uuid("customer_id").references(() => customers.id).notNull(),
    invoiceId: uuid("invoice_id").references(() => invoices.id),
    date: timestamp("date").defaultNow().notNull(),
    type: transactionTypeEnum("type").notNull(), // DEBIT (+) or CREDIT (-)
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
    description: text("description").notNull(),
    runningBalance: decimal("running_balance", { precision: 15, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
