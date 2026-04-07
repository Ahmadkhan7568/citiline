"use client";

import { motion } from "framer-motion";
import {
    CreditCard,
    FileText,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

const cards = [
    { name: "Total Outstanding", value: "PKR 42,500", type: "debit", label: "Due Oct 31" },
    { name: "Paid this Month", value: "PKR 110,000", type: "success", label: "3 Invoices" },
    { name: "Available Credit", value: "PKR 0", type: "neutral", label: "Standard Terms" },
];

const invoices = [
    { id: "CIT-1025", type: "Service Tax Invoice", date: "Oct 25, 2026", amount: "PKR 42,500", status: "Unpaid" },
    { id: "CIT-1020", type: "Payment Receipt", date: "Oct 20, 2026", amount: "PKR 50,000", status: "Paid" },
    { id: "CIT-1018", type: "Service Tax Invoice", date: "Oct 18, 2026", amount: "PKR 60,000", status: "Paid" },
];

export default function UserDashboard() {
    return (
        <div className="space-y-10">
            {/* Page Title */}
            <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase mb-1">Accounts <span className="text-accent italic">Summary</span></h2>
                <p className="text-muted-foreground text-sm font-medium italic">Your financial real-time transparent ledger with Citiline Agency.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-8 rounded-[2rem] border border-white/5"
                    >
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2">{card.name}</p>
                        <p className="text-2xl font-black tracking-tighter mb-4">{card.value}</p>
                        <div className={cn(
                            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                            card.type === "debit" ? "bg-rose-400/10 text-rose-400" :
                                card.type === "success" ? "bg-emerald-400/10 text-emerald-400" :
                                    "bg-white/5 text-muted-foreground"
                        )}>
                            {card.label}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Billing */}
            <div className="glass-card rounded-[2.5rem] border border-white/5 p-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold uppercase tracking-tighter">Recent Billing Activity</h3>
                    <button className="bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all border border-white/10">Request Ledger</button>
                </div>
                <div className="space-y-4">
                    {invoices.map((inv) => (
                        <div key={inv.id} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-accent/30 transition-all group">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-accent/10 transition-colors">
                                    <FileText size={24} className="group-hover:text-accent" />
                                </div>
                                <div>
                                    <p className="text-sm font-black tracking-tight">{inv.type}</p>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{inv.id} • {inv.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className="text-lg font-black tracking-tighter">{inv.amount}</p>
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-[0.2em]",
                                        inv.status === "Paid" ? "text-emerald-400" : "text-rose-400"
                                    )}>{inv.status}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-white transition-all">
                                        <Download size={16} />
                                    </button>
                                    <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-white transition-all">
                                        <Eye size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Support Call-to-action */}
            <div className="p-10 rounded-[3rem] bg-gradient-to-br from-accent/20 to-transparent border border-accent/10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-md">
                    <h4 className="text-2xl font-black uppercase tracking-tighter mb-2">Need Financial <span className="text-accent italic">Support?</span></h4>
                    <p className="text-muted-foreground text-sm font-medium">Connect with our accounts department for custom credit terms or billing inquiries.</p>
                </div>
                <Link href="/contact" className="px-8 py-4 bg-accent text-white rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/20">
                    Contact Billing
                </Link>
            </div>
        </div>
    );
}
