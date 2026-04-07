/**
 * Core logic for the Double-Entry Financial Ledger.
 * Ensures that every transaction maintains a consistent running balance.
 */

export interface LedgerTransaction {
    type: "DEBIT" | "CREDIT";
    amount: number;
}

/**
 * Calculates the new running balance for a customer.
 * - DEBIT: Increases what the customer owes (receivable).
 * - CREDIT: Decreases what the customer owes (payment received).
 */
export function calculateNewBalance(currentBalance: number, transaction: LedgerTransaction): number {
    const amount = Number(transaction.amount);
    if (transaction.type === "DEBIT") {
        return currentBalance + amount;
    } else {
        return currentBalance - amount;
    }
}

/**
 * Formats PKR currency in a premium fashion.
 */
export function formatPKR(amount: number | string): string {
    const value = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}
