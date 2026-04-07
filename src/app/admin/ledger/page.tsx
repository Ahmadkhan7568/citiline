"use client";

import { motion } from "framer-motion";
import {
    Search,
    Filter,
    Download,
    TrendingUp,
    TrendingDown,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    SearchX
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPKR } from "@/lib/ledger";

const transactions = [
    { id: "TX-9021", date: "Oct 26, 2026", description: "Payment against INV-1020", type: "CREDIT", amount: 50000, balance: 42500 },
    { id: "INV-1025", date: "Oct 25, 2026", description: "Service Tax Invoice - Social Media Ads", type: "DEBIT", amount: 42500, balance: 92500 },
    { id: "INV-1024", date: "Oct 24, 2026", description: "Service Tax Invoice - Print Media", type: "DEBIT", amount: 125000, balance: 50000 },
    { id: "OB-0000", date: "Oct 01, 2026", description: "Opening Balance Migration", type: "DEBIT", amount: 0, balance: 0 },
];

export default function LedgerPage() {
    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Financial <span className="text-accent italic">Ledger</span></h1>
                    <p className="text-muted-foreground text-sm font-medium italic">Double-entry audit trail for all customer transactions.</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 border border-white/10 shadow-xl">
                        <Download size={18} /> Export Full PDF
                    </button>
                </div>
            </div>

            {/* Selection & Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Select Customer Account..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-6 text-white outline-none focus:border-accent/30 transition-all font-medium"
                    />
                </div>
                <div className="relative group">
                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                    <input
                        type="date"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-6 text-white outline-none focus:border-accent/30 transition-all font-medium appearance-none"
                    />
                </div>
                <button className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all uppercase tracking-widest text-xs">
                    <Filter size={18} /> Advanced
                </button>
            </div>

            {/* Live Ledger Table */}
            <div className="glass-card rounded-[2.5rem] border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground border-b border-white/5 bg-white/[0.01]">
                                <th className="p-8">Date</th>
                                <th className="p-8">Reference / Description</th>
                                <th className="p-8 text-right">Debit (+)</th>
                                <th className="p-8 text-right">Credit (-)</th>
                                <th className="p-8 text-right">Running Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-8 align-middle">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold">{tx.date}</span>
                                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">{tx.id}</span>
                                        </div>
                                    </td>
                                    <td className="p-8 align-middle">
                                        <p className="text-sm font-medium tracking-tight text-zinc-300 group-hover:text-white transition-colors">{tx.description}</p>
                                    </td>
                                    <td className="p-8 text-right align-middle">
                                        {tx.type === "DEBIT" ? (
                                            <span className="text-sm font-black text-rose-400">{formatPKR(tx.amount)}</span>
                                        ) : (
                                            <span className="text-sm text-zinc-700">—</span>
                                        )}
                                    </td>
                                    <td className="p-8 text-right align-middle">
                                        {tx.type === "CREDIT" ? (
                                            <span className="text-sm font-black text-emerald-400">{formatPKR(tx.amount)}</span>
                                        ) : (
                                            <span className="text-sm text-zinc-700">—</span>
                                        )}
                                    </td>
                                    <td className="p-8 text-right align-middle">
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-black tracking-tighter text-accent group-hover:scale-105 transition-transform">{formatPKR(tx.balance)}</span>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Dr</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Zero State Placeholder (Commented out in logic but built) */}
            {/* <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                <SearchX size={48} className="text-zinc-700 mb-4" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No transactions found for this period.</p>
            </div> */}

            {/* Ledger Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 rounded-[3rem] bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/10 group">
                    <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <TrendingUp size={14} /> Global Receivables
                    </p>
                    <h4 className="text-4xl font-black tracking-tighter">PKR 12.45M</h4>
                    <p className="text-[10px] text-muted-foreground mt-4 opacity-70 leading-relaxed uppercase tracking-widest font-bold font-mono">
                        Total uncollected debits across all customer registries.
                    </p>
                </div>
                <div className="p-10 rounded-[3rem] bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/10 group">
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <TrendingDown size={14} /> Monthly Collections
                    </p>
                    <h4 className="text-4xl font-black tracking-tighter">PKR 4.20M</h4>
                    <p className="text-[10px] text-muted-foreground mt-4 opacity-70 leading-relaxed uppercase tracking-widest font-bold font-mono">
                        Total credits recorded in the current fiscal month.
                    </p>
                </div>
            </div>
        </div>
    );
}
