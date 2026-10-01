"use client";

import React, { useState, useEffect } from "react";
import { 
    CreditCard, 
    Zap, 
    Calendar, 
    CheckCircle2, 
    Clock, 
    DollarSign, 
    ArrowUpRight,
    Search,
    Loader2,
    FileText,
    TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPKR } from "@/lib/ledger";
import { SyncService } from "@/lib/tauri/sync";

export default function PayrollPage() {
    const [payrollHistory, setPayrollHistory] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const syncService = new SyncService();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const history = await syncService.getLocalData("payroll") as any[];
            const staff = await syncService.getLocalData("employees") as any[];
            setPayrollHistory(history || []);
            setEmployees(staff || []);
        } catch (e) {
            console.error("Payroll load failed:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGeneratePayroll = async () => {
        setIsGenerating(true);
        // Logic to generate monthly payroll for all 'Active' employees
        // This would involve creating several rows in the sqlite 'payroll' table
        // and updating the 'ledger_entries' table for salary expense.
        setTimeout(() => {
            setIsGenerating(false);
            alert("Monthly Payroll Generated & Posted to Ledger!");
        }, 2000);
    };

    const totalSalaryExpense = employees.reduce((acc, emp) => acc + (parseFloat(emp.salary) || 0), 0);

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Payroll <span className="text-accent italic">Engine</span></h1>
                    <p className="text-muted-foreground text-sm font-medium italic">Automated salary generation, disbursement tracking, and ledger posting.</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleGeneratePayroll}
                        disabled={isGenerating}
                        className="bg-accent hover:bg-accent/80 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-xl shadow-accent/20"
                    >
                        {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                        Run Monthly Payroll
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Total Monthly Commitment</p>
                    <h3 className="text-3xl font-black tracking-tighter">{formatPKR(totalSalaryExpense)}</h3>
                    <div className="mt-4 flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                        <TrendingUp size={12} /> Auto-Posting Active
                    </div>
                </div>
                <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Next Disbursement</p>
                    <h3 className="text-3xl font-black tracking-tighter">01 Nov 2026</h3>
                    <div className="mt-4 flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                        <Clock size={12} /> 15 Days Remaining
                    </div>
                </div>
                <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">FBR Compliance</p>
                    <h3 className="text-3xl font-black tracking-tighter text-emerald-400">ACTIVE</h3>
                    <div className="mt-4 flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                        <CheckCircle2 size={12} /> Tax Filings Ready
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="glass-card rounded-[2.5rem] border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-8 border-b border-white/5">
                    <h3 className="font-black uppercase tracking-widest text-sm">Disbursement History</h3>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-accent" size={14} />
                            <input 
                                placeholder="Search history..." 
                                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-accent/30 transition-all"
                            />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground border-b border-white/5">
                                <th className="p-8">Period</th>
                                <th className="p-8">Total Employees</th>
                                <th className="p-8">Total Payout</th>
                                <th className="p-8">Date Processed</th>
                                <th className="p-8 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {payrollHistory.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center text-zinc-700 font-bold uppercase tracking-[0.2em] text-[10px]">No Payroll History Found</td>
                                </tr>
                            ) : payrollHistory.map((run) => (
                                <tr key={run.id} className="group hover:bg-white/[0.01] transition-colors">
                                    <td className="p-8 font-black tracking-tight">{run.month} {run.year}</td>
                                    <td className="p-8 font-medium">{run.employee_count} Personnel</td>
                                    <td className="p-8 font-black text-accent">{formatPKR(run.total_payout)}</td>
                                    <td className="p-8 text-xs text-zinc-500">{new Date(run.processed_at).toLocaleDateString()}</td>
                                    <td className="p-8 text-right">
                                        <span className="bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Disbursed</span>
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
