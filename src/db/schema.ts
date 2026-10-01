import { pgTable, text, timestamp, integer, boolean, decimal, pgEnum, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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
    fbrStatus: text("fbr_status").default("Pending").notNull(), // Pending, Submitted, Failed
    fbrIrn: text("fbr_irn"),
    fbrQrData: text("fbr_qr_data"), // Stores the PRAL pipe-separated string
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Invoice Items - Detail breakdown
export const invoiceItems = pgTable("invoice_items", {
    id: uuid("id").defaultRandom().primaryKey(),
    invoiceId: uuid("invoice_id").references(() => invoices.id, { onDelete: "cascade" }).notNull(),
    description: text("description").notNull(),
    quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
    unitPrice: decimal("unit_price", { precision: 15, scale: 2 }).notNull(),
    taxAmount: decimal("tax_amount", { precision: 15, scale: 2 }).notNull(),
    total: decimal("total", { precision: 15, scale: 2 }).notNull(),
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

// --- ERP & HR MODULES ---

// Employees
export const employees = pgTable("employees", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    designation: text("designation").notNull(),
    email: text("email").unique(),
    phone: text("phone"),
    joiningDate: timestamp("joining_date").defaultNow().notNull(),
    salary: decimal("salary", { precision: 15, scale: 2 }).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Payroll Records
export const payroll = pgTable("payroll", {
    id: uuid("id").defaultRandom().primaryKey(),
    employeeId: uuid("employee_id").references(() => employees.id).notNull(),
    month: text("month").notNull(), // e.g., "April"
    year: integer("year").notNull(), // e.g., 2024
    basicSalary: decimal("basic_salary", { precision: 15, scale: 2 }).notNull(),
    bonuses: decimal("bonuses", { precision: 15, scale: 2 }).default("0").notNull(),
    deductions: decimal("deductions", { precision: 15, scale: 2 }).default("0").notNull(),
    netSalary: decimal("net_salary", { precision: 15, scale: 2 }).notNull(),
    paymentStatus: text("payment_status").default("PENDING").notNull(), // PENDING, PAID
    paymentDate: timestamp("payment_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Expenses
export const expenseCategories = pgTable("expense_categories", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(), // Rent, Utilities, Marketing, etc.
    description: text("description"),
});

export const expenses = pgTable("expenses", {
    id: uuid("id").defaultRandom().primaryKey(),
    categoryId: uuid("category_id").references(() => expenseCategories.id).notNull(),
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
    date: timestamp("date").defaultNow().notNull(),
    description: text("description").notNull(),
    receiptUrl: text("receipt_url"),
    paidTo: text("paid_to"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Services/Products for Sales
export const services = pgTable("services", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    category: text("category").notNull(),
    basePrice: decimal("base_price", { precision: 15, scale: 2 }).notNull(),
    taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("18").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Company Settings - FBR Configuration (Updated)
export const companySettings = pgTable("company_settings", {
    id: integer("id").primaryKey(),
    name: text("name").default("Citiline Advertising").notNull(),
    ntn: text("ntn").default("1958264-1").notNull(),
    bearerToken: text("bearer_token"),
    environment: text("environment").default("Sandbox").notNull(), // Sandbox, Production
    address: text("address"),
    phone: text("phone"),
    email: text("email"),
    gst: text("gst"),
    logoUrl: text("logo_url"),
    currency: text("currency").default("PKR").notNull(),
    financialYearStart: text("financial_year_start").default("July"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
    customer: one(customers, {
        fields: [users.customerId],
        references: [customers.id],
    }),
}));

export const customersRelations = relations(customers, ({ many }) => ({
    invoices: many(invoices),
    ledgerEntries: many(ledgerEntries),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
    customer: one(customers, {
        fields: [invoices.customerId],
        references: [customers.id],
    }),
    items: many(invoiceItems),
    ledgerEntries: many(ledgerEntries),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
    invoice: one(invoices, {
        fields: [invoiceItems.invoiceId],
        references: [invoices.id],
    }),
}));

export const ledgerEntriesRelations = relations(ledgerEntries, ({ one }) => ({
    customer: one(customers, {
        fields: [ledgerEntries.customerId],
        references: [customers.id],
    }),
    invoice: one(invoices, {
        fields: [ledgerEntries.invoiceId],
        references: [invoices.id],
    }),
}));

export const employeesRelations = relations(employees, ({ many }) => ({
    payrolls: many(payroll),
}));

export const payrollRelations = relations(payroll, ({ one }) => ({
    employee: one(employees, {
        fields: [payroll.employeeId],
        references: [employees.id],
    }),
}));

export const expenseCategoriesRelations = relations(expenseCategories, ({ many }) => ({
    expenses: many(expenses),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
    category: one(expenseCategories, {
        fields: [expenses.categoryId],
        references: [expenseCategories.id],
    }),
}));

