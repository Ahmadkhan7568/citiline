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
    Calculator,
    Loader2,
    Edit
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPKR } from "@/lib/ledger";
import { getInvoices, submitToFBR, getCustomers, createInvoice, getInvoiceItems } from "@/lib/actions";
import InvoiceEditor from "@/components/admin/InvoiceEditor";

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
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
    const [editingInvoice, setEditingInvoice] = useState<any>(null);
    const [isFetchingItems, setIsFetchingItems] = useState(false);

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

    const handleEdit = async (inv: Invoice) => {
        setIsFetchingItems(true);
        const items = await getInvoiceItems(inv.id);
        setEditingInvoice({ ...inv, items });
        setIsFetchingItems(false);
        setIsEditorOpen(true);
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
                        onClick={() => {
                            setEditingInvoice(null);
                            setIsEditorOpen(true);
                        }}
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
                                                <button 
                                                    disabled={isFetchingItems}
                                                    onClick={() => handleEdit(inv)} 
                                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-emerald-400 group-hover:border-emerald-400/30"
                                                >
                                                    {isFetchingItems ? <Loader2 size={16} className="animate-spin" /> : <Edit size={16} />}
                                                </button>
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

            {/* Live Invoice Editor */}
            {isEditorOpen && (
                <InvoiceEditor 
                    customers={customers} 
                    initialInvoice={editingInvoice}
                    onClose={() => {
                        setIsEditorOpen(false);
                        setEditingInvoice(null);
                    }} 
                    onSaved={() => {
                        setIsEditorOpen(false);
                        setEditingInvoice(null);
                        loadData();
                    }}
                />
            )}
        </div>
    );
}
