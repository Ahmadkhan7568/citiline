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
    Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
    { name: "Monthly Revenue", value: "PKR 2.4M", change: "+12.5%", trend: "up", icon: TrendingUp },
    { name: "Active Accounts", value: "142", change: "+4", trend: "up", icon: Users },
    { name: "FBR Submissions", value: "89", status: "100% Success", trend: "neutral", icon: CheckCircle2 },
    { name: "Pending Ledger", value: "PKR 450k", change: "-PKR 20k", trend: "down", icon: FileText },
];

const recentInvoices = [
    { id: "CIT-1024", customer: "Dynamic Corp", date: "Oct 24, 2026", amount: "PKR 125,000", status: "Verifed" },
    { id: "CIT-1025", customer: "Global Solutions", date: "Oct 25, 2026", amount: "PKR 42,500", status: "Pending" },
    { id: "CIT-1026", customer: "Nexus Media", date: "Oct 25, 2026", amount: "PKR 88,000", status: "Verifed" },
    { id: "CIT-1027", customer: "The Brand Lab", date: "Oct 26, 2026", amount: "PKR 12,000", status: "Failed" },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-10">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase mb-1">Live <span className="text-accent italic">Overview</span></h2>
                    <p className="text-muted-foreground text-sm font-medium">Real-time performance and financial KPIs.</p>
                </div>
                <button className="bg-accent hover:bg-accent/80 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 text-sm shadow-xl shadow-accent/20">
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
                        <button className="text-xs font-bold uppercase tracking-widest text-accent hover:opacity-70 transition-opacity">View All</button>
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
                                {recentInvoices.map((inv) => (
                                    <tr key={inv.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="py-4 font-bold text-sm">{inv.id}</td>
                                        <td className="py-4 font-medium text-sm">{inv.customer}</td>
                                        <td className="py-4 text-xs text-muted-foreground">{inv.date}</td>
                                        <td className="py-4 font-black text-sm">{inv.amount}</td>
                                        <td className="py-4 text-right">
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                                                inv.status === "Verifed" ? "bg-emerald-400/10 text-emerald-400" :
                                                    inv.status === "Pending" ? "bg-amber-400/10 text-amber-400" :
                                                        "bg-rose-400/10 text-rose-400"
                                            )}>
                                                {inv.status}
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
