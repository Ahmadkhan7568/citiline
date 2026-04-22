"use server";

import { db } from "@/db";
import { invoices, customers, invoiceItems, companySettings, ledgerEntries } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import axios from "axios";
import { revalidatePath } from "next/cache";

// --- CUSTOMERS ---

export async function getCustomers() {
  try {
    return await db.query.customers.findMany({
      orderBy: [desc(customers.createdAt)]
    });
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return [];
  }
}

export async function createCustomer(data: any) {
  try {
    const [newCustomer] = await db.insert(customers).values({
      companyName: data.companyName,
      ntn: data.ntn,
      contactPerson: data.contactPerson || data.companyName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      openingBalance: data.openingBalance?.toString() || "0",
    }).returning();
    revalidatePath("/admin/customers");
    return { success: true, customer: newCustomer };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getInvoiceItems(invoiceId: string) {
  try {
    return await db.query.invoiceItems.findMany({
      where: eq(invoiceItems.invoiceId, invoiceId)
    });
  } catch (error) {
    console.error("Failed to fetch invoice items:", error);
    return [];
  }
}

export async function getInvoices() {
  try {
    return await db.query.invoices.findMany({
      with: {
        customer: true
      },
      orderBy: [desc(invoices.date)]
    });
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
    return [];
  }
}

export async function createInvoice(invoiceData: any, itemsData: any[]) {
  try {
    const result = await db.transaction(async (tx) => {
      // 1. Create Invoice
      const [newInvoice] = await tx.insert(invoices).values({
        invoiceNumber: invoiceData.invoiceNumber,
        customerId: invoiceData.customerId,
        subtotal: invoiceData.subtotal.toString(),
        taxAmount: invoiceData.taxAmount.toString(),
        total: invoiceData.total.toString(),
        discount: invoiceData.discount?.toString() || "0",
        status: "PENDING",
        fbrStatus: "Pending"
      }).returning();

      // 2. Create Items
      for (const item of itemsData) {
        await tx.insert(invoiceItems).values({
          invoiceId: newInvoice.id,
          description: item.description,
          quantity: item.quantity.toString(),
          unitPrice: item.unitPrice.toString(),
          taxAmount: item.taxAmount.toString(),
          total: item.total.toString(),
        });
      }

      // 3. Create Ledger Entry
      await tx.insert(ledgerEntries).values({
        customerId: invoiceData.customerId,
        invoiceId: newInvoice.id,
        type: "DEBIT",
        amount: invoiceData.total.toString(),
        description: `Invoice ${newInvoice.invoiceNumber}`,
        runningBalance: "0" // In a real system, you'd calculate this based on previous balance
      });

      return newInvoice;
    });

    revalidatePath("/admin/invoices");
    revalidatePath("/admin/ledger");
    return { success: true, invoice: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateInvoice(invoiceId: string, invoiceData: any, itemsData: any[]) {
  try {
    const result = await db.transaction(async (tx) => {
      // 1. Update Invoice
      await tx.update(invoices).set({
        customerId: invoiceData.customerId,
        subtotal: invoiceData.subtotal.toString(),
        taxAmount: invoiceData.taxAmount.toString(),
        total: invoiceData.total.toString(),
        discount: invoiceData.discount?.toString() || "0",
      }).where(eq(invoices.id, invoiceId));

      // 2. Refresh Items
      await tx.delete(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId));
      
      for (const item of itemsData) {
        await tx.insert(invoiceItems).values({
          invoiceId: invoiceId,
          description: item.description,
          quantity: item.quantity.toString(),
          unitPrice: item.unitPrice.toString(),
          taxAmount: item.taxAmount.toString(),
          total: item.total.toString(),
        });
      }

      // 3. Update Ledger Entry
      await tx.update(ledgerEntries).set({
        customerId: invoiceData.customerId,
        amount: invoiceData.total.toString(),
        description: `Invoice ${invoiceData.invoiceNumber} (Updated)`,
      }).where(eq(ledgerEntries.invoiceId, invoiceId));

      return { id: invoiceId };
    });

    revalidatePath("/admin/invoices");
    revalidatePath("/admin/ledger");
    return { success: true, invoice: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- FBR INTEGRATION ---

export async function submitToFBR(invoiceId: string) {
  try {
    const inv = await db.query.invoices.findFirst({
      where: eq(invoices.id, invoiceId),
      with: {
        customer: true,
      }
    }) as any;

    if (!inv) throw new Error("Invoice not found");

    const items = await db.query.invoiceItems.findMany({
      where: eq(invoiceItems.invoiceId, invoiceId)
    });

    const settings = await db.query.companySettings.findFirst() as any;
    if (!settings || !settings.bearerToken) {
      throw new Error("FBR Bearer Token not configured in Settings");
    }

    const payload = {
      invoiceType: "Sale Invoice",
      invoiceDate: inv.date instanceof Date ? inv.date.toISOString().split('T')[0] : (inv.date as string).split('T')[0],
      sellerNTNCNIC: settings.ntn,
      sellerBusinessName: settings.name,
      sellerProvince: "Islamabad",
      sellerAddress: settings.address || "",
      buyerNTNCNIC: inv.customer?.ntn || "",
      buyerBusinessName: inv.customer?.companyName || inv.customer?.contactPerson || "",
      buyerProvince: "Islamabad",
      buyerAddress: inv.customer?.address || "",
      buyerRegistrationType: inv.customer?.ntn ? "Registered" : "Unregistered",
      invoiceRefNo: "",
      items: items.map(item => ({
        hsCode: "9813.0000",
        productDescription: item.description,
        rate: "18%",
        uoM: "Numbers",
        quantity: parseFloat(item.quantity.toString()),
        totalValues: parseFloat(item.total.toString()),
        valueSalesExcludingST: parseFloat(item.unitPrice.toString()) * parseFloat(item.quantity.toString()),
        fixedNotifiedValueOrRetailPrice: 0,
        salesTaxApplicable: parseFloat(item.taxAmount.toString()),
        salesTaxWithheldAtSource: 0,
        extraTax: 0,
        furtherTax: 0,
        sroScheduleNo: "",
        fedPayable: 0,
        discount: 0,
        saleType: "Services at standard rate",
        sroItemSerialNo: ""
      }))
    };

    const apiUrl = settings.environment === 'Production' 
        ? 'https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata'
        : 'https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata_sb';

    const fbrRes = await axios.post(apiUrl, payload, {
      headers: { 'Authorization': `Bearer ${settings.bearerToken}`, 'Content-Type': 'application/json' }
    });

    if (fbrRes.data.code === "100") {
      const irn = fbrRes.data.irn;
      const totalQty = items.reduce((acc, item) => acc + parseFloat(item.quantity.toString()), 0);
      const invoiceDateStr = inv.date instanceof Date ? inv.date.toISOString().split('T')[0] : (inv.date as string).split('T')[0];
      
      // PRAL v1.12 QR String Format: SellerNTN|BuyerNTN|InvoiceNumber|InvoiceDate|TotalAmount|TotalSalesTax|TotalQuantity|IRN
      const qrData = `${settings.ntn}|${inv.customer?.ntn || ''}|${inv.invoiceNumber}|${invoiceDateStr}|${inv.total}|${inv.taxAmount}|${totalQty}|${irn}`;
      
      await db.update(invoices).set({
        fbrStatus: 'Submitted',
        fbrIrn: irn,
        fbrQrData: qrData,
        status: 'VERIFIED'
      }).where(eq(invoices.id, invoiceId));

      revalidatePath("/admin/invoices");
      return { success: true, irn, qrData };
    } else {
      throw new Error(fbrRes.data.message || "FBR rejected the invoice");
    }
  } catch (error: any) {
    console.error("FBR error:", error);
    return { success: false, error: error.message };
  }
}

// --- SETTINGS ---

export async function getSettings() {
    try {
        let settings = await db.query.companySettings.findFirst();
        if (!settings) {
            // Create default settings if first time
            const [newSettings] = await db.insert(companySettings).values({
                id: 1,
                name: "Citiline Advertising",
                ntn: "1958264-1",
                environment: "Sandbox",
                logoUrl: "/invoicelogo.png"
            }).returning();
            settings = newSettings;
        }
        return settings;
    } catch (error) {
        console.error("getSettings error:", error);
        return null;
    }
}

export async function updateSettings(data: any) {
    try {
        await db.update(companySettings).set({
            ...data,
            updatedAt: new Date()
        }).where(eq(companySettings.id, 1));
        revalidatePath("/admin/settings");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
// --- DASHBOARD ---

export async function getDashboardStats() {
    try {
        const totalInvoices = await db.select({ count: sql<number>`count(*)` }).from(invoices);
        const totalRevenue = await db.select({ sum: sql<string>`sum(total)` }).from(invoices);
        const activeCustomers = await db.select({ count: sql<number>`count(*)` }).from(customers);
        const fbrSuccess = await db.select({ count: sql<number>`count(*)` }).from(invoices).where(eq(invoices.fbrStatus, 'Submitted'));

        return {
            totalRevenue: totalRevenue[0]?.sum || "0",
            activeCustomers: activeCustomers[0]?.count || 0,
            fbrSuccess: fbrSuccess[0]?.count || 0,
            totalInvoices: totalInvoices[0]?.count || 0
        };
    } catch (error) {
        console.error("Dashboard stats error:", error);
        return { totalRevenue: "0", activeCustomers: 0, fbrSuccess: 0, totalInvoices: 0 };
    }
}

export async function getDashboardInvoices() {
    try {
        return await db.query.invoices.findMany({
            with: { customer: true },
            limit: 5,
            orderBy: [desc(invoices.date)]
        });
    } catch (error) {
        return [];
    }
}
