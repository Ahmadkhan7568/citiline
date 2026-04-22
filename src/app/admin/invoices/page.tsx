"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    FileText,
    Download,
    Printer,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    X,
    Hash,
    Receipt,
    Calculator,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPKR } from "@/lib/ledger";
import { getInvoices, submitToFBR, getCustomers, createInvoice } from "@/lib/actions";

interface Invoice {
    id: string;
    invoiceNumber: string;
    customer: { companyName: string } | null;
    date: string | Date;
    total: string | number;
    status: string;
    fbrStatus: string;
    fbrIrn: string | null;
    fbrQrData: string | null;
}

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

    async function loadData() {
        setIsLoading(true);
        const [invData, custData] = await Promise.all([getInvoices(), getCustomers()]);
        setInvoices(invData as any);
        setCustomers(custData as any);
        setIsLoading(false);
    }

    useEffect(() => {
        loadData();
        setIsMounted(true);
    }, []);

    const handleFBRSubmit = async (invoiceId: string) => {
        setIsSubmitting(invoiceId);
        const result = await submitToFBR(invoiceId);
        setIsSubmitting(null);
        if (result.success) {
            alert(`Successfully submitted to FBR! IRN: ${result.irn}`);
            loadData();
        } else {
            alert(`FBR Submission Failed: ${result.error}`);
        }
    };

    const handleAddInvoice = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const customerId = formData.get("customerId") as string;
        const total = parseFloat(formData.get("total") as string);
        
        const invoiceData = {
            invoiceNumber: `CIT-${Date.now().toString().slice(-4)}`,
            customerId,
            subtotal: total / 1.18,
            taxAmount: total - (total / 1.18),
            total,
        };
        
        const itemsData = [{
            description: "Advertising Services",
            quantity: 1,
            unitPrice: total / 1.18,
            taxAmount: total - (total / 1.18),
            total,
        }];

        const result = await createInvoice(invoiceData, itemsData);
        if (result.success) {
            setIsAddModalOpen(false);
            loadData();
        } else {
            alert(`Error: ${result.error}`);
        }
    };

    if (!isMounted) return null;

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Sales Tax <span className="text-accent italic">Invoices</span></h1>
                    <p className="text-muted-foreground text-sm font-medium font-mono">FBR PRAL Gateway Active - System v1.12</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => loadData()} className="bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 border border-white/10">
                        <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} /> Refresh
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-accent hover:bg-accent/80 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-xl shadow-accent/20"
                    >
                        <Plus size={18} /> New Invoice
                    </button>
                </div>
            </div>

            {/* Invoices List */}
            <div className="glass-card rounded-[2.5rem] border border-white/5">
                <div className="overflow-x-auto custom-scrollbar">
                    <div className="min-w-[1000px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground border-b border-white/5">
                                    <th className="p-8">Inv No.</th>
                                    <th className="p-8">Customer</th>
                                    <th className="p-8">Date</th>
                                    <th className="p-8">Total Amount</th>
                                    <th className="p-8">FBR / PRAL Status</th>
                                    <th className="p-8 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="p-20 text-center">
                                            <Loader2 className="animate-spin inline-block mr-2" /> Loading data...
                                        </td>
                                    </tr>
                                ) : invoices.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-20 text-center text-muted-foreground font-black uppercase tracking-widest opacity-20">
                                            No Invoices Found
                                        </td>
                                    </tr>
                                ) : invoices.map((inv) => (
                                    <tr key={inv.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="p-8 align-middle font-black text-sm">{inv.invoiceNumber}</td>
                                        <td className="p-8 align-middle">
                                            <div className="flex items-center gap-3 text-sm font-black italic">{inv.customer?.companyName || "Unknown"}</div>
                                        </td>
                                        <td className="p-8 align-middle text-xs text-muted-foreground font-medium">
                                            {typeof inv.date === 'string' ? inv.date : inv.date.toLocaleDateString()}
                                        </td>
                                        <td className="p-8 align-middle font-black text-sm">{formatPKR(inv.total)}</td>
                                        <td className="p-8 align-middle">
                                            {inv.fbrStatus === "Submitted" ? (
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-emerald-400">
                                                        <CheckCircle2 size={12} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Submitted</span>
                                                    </div>
                                                    <span className="text-[10px] text-zinc-500 font-mono">{inv.fbrIrn}</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-amber-400">
                                                        <AlertCircle size={12} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{inv.fbrStatus}</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleFBRSubmit(inv.id)}
                                                        disabled={isSubmitting === inv.id}
                                                        className="text-[9px] text-accent font-black uppercase tracking-widest hover:underline text-left disabled:opacity-50"
                                                    >
                                                        {isSubmitting === inv.id ? "Submitting..." : "Submit to PRAL"}
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-8 text-right align-middle">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => window.print()} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"><Printer size={16} /></button>
                                                <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-white transition-all"><Download size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[3rem] p-10 overflow-hidden">
                            <form onSubmit={handleAddInvoice} className="space-y-6">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                                            <Receipt className="text-accent" /> Draft <span className="text-accent italic">Invoice</span>
                                        </h2>
                                        <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] opacity-40 mt-1">Tax Calculation Engine Active</p>
                                    </div>
                                    <button onClick={() => setIsAddModalOpen(false)} type="button" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center"><X size={20} /></button>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Customer Account</label>
                                    <select required name="customerId" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-accent/30 transition-all font-medium appearance-none">
                                        <option value="" className="bg-zinc-900">Select Customer</option>
                                        {customers.map(c => (
                                            <option key={c.id} value={c.id} className="bg-zinc-900">{c.companyName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Billable Amount (PKR)</label>
                                    <div className="relative group/val">
                                        <Calculator className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/val:text-accent transition-colors" size={18} />
                                        <input required name="total" type="number" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-6 text-white outline-none focus:border-accent/30 transition-all font-black text-xl tracking-tighter" placeholder="0.00" />
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-accent hover:bg-accent/80 text-white p-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3 mt-6">
                                    <CheckCircle2 size={18} /> Generate Tax Invoice
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
