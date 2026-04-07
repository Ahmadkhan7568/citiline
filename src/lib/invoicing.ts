/**
 * Core business logic for FBR-compliant Sales Tax Invoices.
 */
import { nanoid } from "nanoid";

export interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number; // Default 18% if not provided
}

export interface InvoicingResult {
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
    taxRate: number;
}

/**
 * Calculates the full financial breakdown for an invoice.
 */
export function calculateInvoiceTotals(
    items: InvoiceItem[],
    discountPercent: number = 0,
    flatTaxRate: number = 18
): InvoicingResult {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const discountAmount = (subtotal * discountPercent) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * flatTaxRate) / 100;
    const total = taxableAmount + taxAmount;

    return {
        subtotal,
        taxAmount,
        discountAmount,
        total,
        taxRate: flatTaxRate
    };
}

/**
 * Mocks the FBR PRAL v1.12 Integration.
 * In production, this would call the RESTful FBR API and return an IRN and QR code.
 */
export async function submitToFBR(invoiceData: Record<string, unknown>) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const isSuccess = Math.random() > 0.05; // 95% success rate for simulation

    if (!isSuccess) {
        throw new Error("FBR Gateway Timeout: Please retry or check PRAL status.");
    }

    return {
        irn: `FBR-${Math.floor(Math.random() * 90000000) + 10000000}`,
        qrContent: `https://fbr.gov.pk/verify/${nanoid()}`,
        submittedAt: new Date().toISOString()
    };
}

