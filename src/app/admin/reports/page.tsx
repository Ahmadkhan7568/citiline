"use client";

import React, { useState } from "react";
import { 
    BarChart3, 
    PieChart, 
    TrendingUp, 
    TrendingDown, 
    Download, 
    Calendar, 
    Filter,
    FileText,
    ArrowUpRight,
    Search,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPKR } from "@/lib/ledger";

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState("sales");

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Business <span className="text-accent italic">Intelligence</span></h1>
                    <p className="text-muted-foreground text-sm font-medium italic">Advanced reporting for Sales Tax, P&L, and Audit Compliance.</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 border border-white/10 shadow-xl">
                        <Download size={18} /> Export All (XLSX)
                    </button>
                    <button className="bg-accent hover:bg-accent/80 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-xl shadow-accent/20">
                        <FileText size={18} /> FBR Annual Audit
                    </button>
                </div>
            </div>

            {/* View Tabs */}
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-3xl border border-white/5 w-fit">
                {["sales", "tax", "payroll", "ledger"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                            activeTab === tab ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-zinc-500 hover:text-white"
                        )}
                    >
                        {tab} Report
                    </button>
                ))}
            </div>

            {/* Performance Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Net Margin</p>
                    <h3 className="text-3xl font-black tracking-tighter text-emerald-400">22.4%</h3>
                    <div className="mt-4 flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                        <ArrowUpRight size={12} /> +2.1% Growth
                    </div>
                </div>
                <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Total Receivables</p>
                    <h3 className="text-3xl font-black tracking-tighter">{formatPKR(14250000)}</h3>
                    <div className="mt-4 flex items-center gap-2 text-amber-400 text-[10px] font-bold uppercase tracking-widest italic font-medium">
                        60% Past Due
                    </div>
                </div>
                <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Tax Liability</p>
                    <h3 className="text-3xl font-black tracking-tighter text-rose-400">{formatPKR(2840900)}</h3>
                    <div className="mt-4 flex items-center gap-2 text-rose-400 text-[10px] font-bold uppercase tracking-widest">
                        <TrendingUp size={12} /> Filing Due in 4d
                    </div>
                </div>
                <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-accent/5 to-transparent">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Audit Health</p>
                    <h3 className="text-3xl font-black tracking-tighter">SECURE</h3>
                    <div className="mt-4 flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                        <ShieldCheck size={12} /> 100% PRAL Verify
                    </div>
                </div>
            </div>

            {/* Chart Area Example */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card rounded-[3rem] border border-white/5 p-10 flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-bold uppercase tracking-tighter">Growth <span className="text-accent italic">Trajectory</span></h3>
                        <Filter size={18} className="text-zinc-600" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center items-center text-center">
                         <BarChart3 size={48} className="text-accent/10 mb-4" />
                         <p className="text-xs font-black uppercase tracking-widest text-zinc-600">Advanced Visualizations Loading...</p>
                    </div>
                </div>
                <div className="glass-card rounded-[3rem] border border-white/5 p-10 flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-bold uppercase tracking-tighter">Top <span className="text-accent">Accounts</span></h3>
                        <Calendar size={18} className="text-zinc-600" />
                    </div>
                    <div className="space-y-6">
                        {[
                            { name: "Global Advertising Inc", value: 4500000, trend: "+12%" },
                            { name: "Citiline Marketing", value: 3200000, trend: "+5%" },
                            { name: "Apex Media House", value: 2100000, trend: "-2%" }
                        ].map((acc, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-accent/20 transition-all">
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-tight">{acc.name}</h4>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Strategic Client</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-md font-black">{formatPKR(acc.value)}</p>
                                    <p className={cn("text-[9px] font-black tracking-widest", acc.trend.startsWith('+') ? "text-emerald-400" : "text-rose-400")}>{acc.trend}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Audit Trail Table */}
            <div className="glass-card rounded-[3rem] border border-white/5 p-10">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-bold uppercase tracking-tighter">System <span className="text-accent">Audit Trail</span></h3>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                        <input 
                            placeholder="Filter audit logs..." 
                            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-accent/30 transition-all w-64"
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 px-8 bg-zinc-900/40 rounded-2xl border-l-[4px] border-accent">
                            <div className="flex items-center gap-6">
                                <span className="text-[10px] font-black text-zinc-600 uppercase tabular-nums">12:45:{i * 12}</span>
                                <p className="text-xs font-bold tracking-tight">Financial record <span className="text-accent">#INV-10{i}</span> successfully mirrored to Local Mirror.</p>
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Verified System Event</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
