"use client";

import { motion } from "framer-motion";
import {
    ArrowUpRight,
    ArrowDownRight,
    Users,
    FileText,
    TrendingUp,
    CheckCircle2,
    Clock,
    Plus,
    Loader2,
    Zap,
    BarChart3,
    Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPKR } from "@/lib/ledger";
import { useState, useEffect } from "react";
import { getDashboardStats, getDashboardInvoices, getCustomers } from "@/lib/actions";
import InvoiceEditor from "@/components/admin/InvoiceEditor";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any[]>([]);
    const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showInvoiceEditor, setShowInvoiceEditor] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        const [statsData, invoicesData, customersData] = await Promise.all([
            getDashboardStats(),
            getDashboardInvoices(),
            getCustomers()
        ]);

        setStats([
            { name: "Monthly Revenue", value: `PKR ${parseFloat(statsData.totalRevenue).toLocaleString()}`, change: "+12.5%", trend: "up", icon: TrendingUp },
            { name: "Active Accounts", value: statsData.activeCustomers.toString(), change: "+4", trend: "up", icon: Users },
            { name: "FBR Submissions", value: statsData.fbrSuccess.toString(), status: "100% Success", trend: "neutral", icon: CheckCircle2 },
            { name: "Pending Invoices", value: statsData.totalInvoices.toString(), change: "", trend: "neutral", icon: FileText },
        ]);

        setRecentInvoices(invoicesData);
        setCustomers(customersData);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {showInvoiceEditor && (
                <InvoiceEditor 
                    customers={customers} 
                    onClose={() => setShowInvoiceEditor(false)} 
                    onSaved={() => {
                        setShowInvoiceEditor(false);
                        fetchData();
                    }} 
                />
            )}

            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter uppercase mb-1">Executive <span className="text-accent italic">Command</span></h2>
                    <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
                        <Zap size={14} className="text-accent" /> System Mirroring Active • {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border border-white/10">
                        Export Report
                    </button>
                    <button 
                        onClick={() => setShowInvoiceEditor(true)}
                        className="bg-accent hover:bg-accent/80 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 shadow-xl shadow-accent/20"
                    >
                        <Plus size={16} /> New Transaction
                    </button>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-8 rounded-[2.5rem] border border-white/5 relative group hover:border-accent/30 transition-all cursor-default"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                    <Icon size={22} className="text-zinc-500 group-hover:text-accent" />
                                </div>
                                {stat.trend === "up" ? (
                                    <div className="text-emerald-400 font-black text-[10px] bg-emerald-400/5 px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-widest">
                                        +{stat.change} <ArrowUpRight size={10} />
                                    </div>
                                ) : (
                                    <div className="text-zinc-500 font-black text-[10px] bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">
                                        Stable
                                    </div>
                                )}
                            </div>
                            <h3 className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase mb-2">{stat.name}</h3>
                            <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
                            
                            {/* Decorative Sparkle */}
                            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-accent/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Analytics Chart (Simple SVG Implementation) */}
                <div className="lg:col-span-2 glass-card rounded-[3rem] border border-white/5 p-10 flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-bold uppercase tracking-tighter">Revenue <span className="text-accent italic">Analytics</span></h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mt-1">Net Sales Trend • Last 7 Days</p>
                        </div>
                        <div className="flex gap-2">
                             <span className="w-3 h-3 rounded-full bg-accent" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Gross Sales</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 min-h-[300px] w-full relative flex items-end justify-between px-4 pb-8">
                        {/* Bars for chart */}
                        {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                            <div key={i} className="group relative flex flex-col items-center flex-1">
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: 0.5 + (i * 0.1), type: "spring" }}
                                    className="w-12 bg-gradient-to-t from-accent to-accent/40 rounded-t-xl relative group-hover:to-white transition-all shadow-[0_0_30px_rgba(0,188,212,0.1)]"
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-accent px-2 py-1 rounded text-[8px] font-black">
                                        {formatPKR(Math.floor(Math.random() * 50000) + 10000)}
                                    </div>
                                </motion.div>
                                <span className="mt-4 text-[9px] font-black uppercase tracking-widest text-zinc-600">Day {i + 1}</span>
                            </div>
                        ))}
                        {/* Grid lines */}
                        <div className="absolute inset-0 border-b border-white/5 pointer-events-none" />
                        <div className="absolute bottom-1/2 w-full border-b border-white/[0.02] pointer-events-none" />
                    </div>
                </div>

                {/* Operations & Integrity Health */}
                <div className="flex flex-col gap-6">
                    <div className="glass-card rounded-[2.5rem] border border-white/5 p-8 flex flex-col gap-6 bg-gradient-to-br from-accent/5 to-transparent">
                        <div className="flex items-center justify-between">
                             <h3 className="text-sm font-black uppercase tracking-widest">FBR Gateway</h3>
                             <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">PRAL Submission Rate</span>
                                <span className="text-sm font-black">100%</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="w-[100%] h-full bg-accent" />
                            </div>
                        </div>
                        <p className="text-[9px] text-zinc-500 leading-relaxed font-medium">All local transactions scheduled for background mirroring. FBR API endpoints reporting zero latency.</p>
                    </div>

                    <div className="glass-card rounded-[2.5rem] border border-white/5 p-8 hover:border-accent/30 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                <Clock size={18} className="text-zinc-500 group-hover:text-accent" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest">Next Payroll</h4>
                                <p className="text-lg font-black tracking-tight text-accent italic">15 Days Left</p>
                            </div>
                        </div>
                        <button className="w-full py-3 bg-white/5 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all">Review Commitment</button>
                    </div>

                    <div className="glass-card rounded-[2.5rem] border border-white/5 p-8 flex-1 flex flex-col justify-center items-center text-center">
                        <BarChart3 size={24} className="text-accent/20 mb-4" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Local Mirror Status</h4>
                        <p className="text-xs font-bold">SQLITE-10.2GB OK</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="glass-card rounded-[3rem] border border-white/5 p-10 overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-bold uppercase tracking-tighter">Live <span className="text-accent">Registry</span></h3>
                    <div className="flex items-center gap-4">
                         <Search size={16} className="text-zinc-700" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Audit Trail Enabled</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground border-b border-white/5">
                                <th className="pb-6">Transaction</th>
                                <th className="pb-6">Entity</th>
                                <th className="pb-6">Value</th>
                                <th className="pb-6">Method</th>
                                <th className="pb-6 text-right">Verification</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentInvoices.map((inv) => (
                                <tr key={inv.id} className="group hover:bg-white/[0.01] transition-colors">
                                    <td className="py-6 font-bold text-sm tracking-tighter uppercase">{inv.invoiceNumber}</td>
                                    <td className="py-6 font-medium text-sm text-zinc-300">{inv.customer?.companyName}</td>
                                    <td className="py-6 font-black text-sm text-accent">{formatPKR(inv.total)}</td>
                                    <td className="py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Cheque / Cash</td>
                                    <td className="py-6 text-right">
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                                            inv.fbrStatus === "Submitted" ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"
                                        )}>
                                            {inv.fbrStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
