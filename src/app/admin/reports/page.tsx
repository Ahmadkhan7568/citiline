"use client";

import { motion } from "framer-motion";
import {
    BarChart3,
    PieChart,
    LineChart,
    TrendingUp,
    TrendingDown,
    Target,
    Zap,
    Download,
    Filter,
    Calendar
} from "lucide-react";
import { formatPKR } from "@/lib/ledger";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Agency <span className="text-accent italic">Intelligence</span></h1>
                    <p className="text-muted-foreground text-sm font-medium">Data-driven performance insights and fiscal analytics.</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border border-white/10 flex items-center gap-2">
                        <Download size={18} /> Export BI Report
                    </button>
                    <button className="bg-foreground text-background hover:bg-accent hover:text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-2 shadow-xl">
                        <Calendar size={18} /> FY 2026-27
                    </button>
                </div>
            </div>

            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Annual Projected", value: "PKR 28.5M", sub: "+18% Target", color: "text-accent" },
                    { label: "Tax Liability", value: "PKR 5.1M", sub: "Q3 Collection", color: "text-amber-400" },
                    { label: "Customer LTV", value: "PKR 450K", sub: "Avg per Account", color: "text-emerald-400" },
                ].map((kpi, i) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-8 rounded-[2.5rem] border border-white/5"
                    >
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2">{kpi.label}</p>
                        <p className={cn("text-3xl font-black tracking-tighter mb-2", kpi.color)}>{kpi.value}</p>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{kpi.sub}</p>
                    </motion.div>
                ))}
            </div>

            {/* Visual Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Streams */}
                <div className="glass-card rounded-[3rem] border border-white/5 p-10 flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-3">
                            <TrendingUp className="text-accent" /> Revenue Distribution
                        </h3>
                        <div className="flex gap-2">
                            <button className="p-2 bg-white/5 rounded-lg border border-white/10"><BarChart3 size={14} /></button>
                            <button className="p-2 bg-accent/20 rounded-lg border border-accent/20 text-accent"><PieChart size={14} /></button>
                        </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
                        {/* Custom SVG Donut Mock */}
                        <svg className="w-64 h-64 -rotate-90">
                            <circle cx="50%" cy="50%" r="45%" className="fill-none stroke-white/5 stroke-[20]" />
                            <circle cx="50%" cy="50%" r="45%" className="fill-none stroke-accent stroke-[20]" style={{ strokeDasharray: "283", strokeDashoffset: "70" }} />
                            <circle cx="50%" cy="50%" r="45%" className="fill-none stroke-emerald-400 stroke-[20]" style={{ strokeDasharray: "283", strokeDashoffset: "220" }} />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-3xl font-black tracking-tighter">100%</span>
                            <span className="text-[10px] font-black text-muted-foreground uppercase opacity-70">Total Allocation</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-10">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-accent" />
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Printing (65%)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Creative Services (25%)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-white/10" />
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Other (10%)</span>
                        </div>
                    </div>
                </div>

                {/* Efficiency Index */}
                <div className="glass-card rounded-[3rem] border border-white/5 p-10 flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-3">
                            <Target className="text-emerald-400" /> Collection Efficiency
                        </h3>
                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20 uppercase tracking-widest">A+ Rating</span>
                    </div>

                    <div className="space-y-8">
                        {[
                            { label: "Invoice Liquidation", value: 92, color: "bg-emerald-400", sub: "Avg. 14 Days" },
                            { label: "Bad Debt Ratio", value: 1.5, color: "bg-rose-400", sub: "Historical Low" },
                            { label: "Tax Compliance", value: 100, color: "bg-accent", sub: "PRAL Verified" },
                        ].map((stat) => (
                            <div key={stat.label} className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-black uppercase tracking-widest text-zinc-300">{stat.label}</span>
                                    <span className="text-sm font-black tracking-tighter">{stat.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stat.value}%` }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                        className={cn("h-full rounded-full", stat.color)}
                                    />
                                </div>
                                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{stat.sub}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3">
                            <Zap className="text-accent" size={16} />
                            <p className="text-xs font-medium text-zinc-400 leading-relaxed italic">
                                Collections are operating at peak efficiency. Current liquidity supports all upcoming capital expenditures.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
