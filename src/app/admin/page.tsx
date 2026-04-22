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
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
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
                    <h2 className="text-3xl font-black tracking-tighter uppercase mb-1">Live <span className="text-accent italic">Overview</span></h2>
                    <p className="text-muted-foreground text-sm font-medium">Real-time performance and financial KPIs.</p>
                </div>
                <button 
                    onClick={() => setShowInvoiceEditor(true)}
                    className="bg-accent hover:bg-accent/80 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 text-sm shadow-xl shadow-accent/20"
                >
                    <Plus size={18} /> New Invoice
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 rounded-3xl border border-white/5 relative group hover:border-accent/30 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-accent/20 transition-colors">
                                    <Icon size={20} className="text-accent" />
                                </div>
                                {stat.trend === "up" && (
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-widest">
                                        <ArrowUpRight size={10} /> {stat.change}
                                    </span>
                                )}
                                {stat.trend === "down" && (
                                    <span className="text-[10px] font-bold text-rose-400 bg-rose-400/10 px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-widest">
                                        <ArrowDownRight size={10} /> {stat.change}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-xs font-black tracking-[0.2em] text-muted-foreground uppercase mb-1">{stat.name}</h3>
                            <p className="text-2xl font-black tracking-tighter">{stat.value}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Content Mid Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Invoices */}
                <div className="lg:col-span-2 glass-card rounded-[2.5rem] border border-white/5 p-8 overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold uppercase tracking-tighter">Recent Invoices</h3>
                        <a href="/admin/invoices" className="text-xs font-bold uppercase tracking-widest text-accent hover:opacity-70 transition-opacity">View All</a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground border-b border-white/5">
                                    <th className="pb-4">No.</th>
                                    <th className="pb-4">Customer</th>
                                    <th className="pb-4">Date</th>
                                    <th className="pb-4">Amount</th>
                                    <th className="pb-4 text-right">FBR Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {recentInvoices.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-10 text-center text-muted-foreground text-xs uppercase font-bold tracking-widest">No Invoices Found</td>
                                    </tr>
                                ) : recentInvoices.map((inv) => (
                                    <tr key={inv.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="py-4 font-bold text-sm uppercase tracking-tighter">{inv.invoiceNumber}</td>
                                        <td className="py-4 font-medium text-sm">{inv.customer?.companyName || "N/A"}</td>
                                        <td className="py-4 text-xs text-muted-foreground">{new Date(inv.date).toLocaleDateString()}</td>
                                        <td className="py-4 font-black text-sm">PKR {parseFloat(inv.total).toLocaleString()}</td>
                                        <td className="py-4 text-right">
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                                                inv.fbrStatus === "Submitted" ? "bg-emerald-400/10 text-emerald-400" :
                                                    inv.fbrStatus === "Pending" ? "bg-amber-400/10 text-amber-400" :
                                                        "bg-rose-400/10 text-rose-400"
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

                {/* Quick Actions / Activity */}
                <div className="glass-card rounded-[2.5rem] border border-white/5 p-8 flex flex-col gap-6">
                    <h3 className="text-xl font-bold uppercase tracking-tighter">Key Actions</h3>
                    <div className="space-y-3">
                        {["FBR PRAL Sync", "Verify IRN Logs", "Generate Ledger", "Export Sales Tax"].map((action) => (
                            <button key={action} className="w-full p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-accent/10 hover:border-accent/20 transition-all group">
                                <span className="text-sm font-bold tracking-tight">{action}</span>
                                <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-accent" />
                            </button>
                        ))}
                    </div>
                    <div className="flex-1" />
                    <div className="p-6 bg-accent/10 rounded-3xl border border-accent/20">
                        <p className="text-xs font-bold text-accent uppercase tracking-widest mb-2">System Health</p>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-sm font-bold">FBR Gateway Online</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="w-[98%] h-full bg-accent" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
