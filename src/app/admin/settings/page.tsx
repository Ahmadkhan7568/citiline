"use client";

import { motion } from "framer-motion";
import {
    Settings,
    Globe,
    ShieldCheck,
    Zap,
    Key,
    Smartphone,
    Building,
    Save,
    RefreshCw,
    Database
} from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-10 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">System <span className="text-accent italic">Config</span></h1>
                    <p className="text-muted-foreground text-sm font-medium">Global platform parameters and security protocols.</p>
                </div>
                <button className="bg-accent hover:bg-accent/80 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-xl shadow-accent/20">
                    <Save size={18} /> Commit Changes
                </button>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
                {/* Company Profile */}
                <section className="glass-card rounded-[2.5rem] border border-white/5 p-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-accent/10 rounded-2xl border border-accent/20">
                            <Building className="text-accent" size={24} />
                        </div>
                        <h3 className="text-xl font-bold uppercase tracking-tight">Agency Identity</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Business Name</label>
                            <input
                                type="text"
                                defaultValue="Citiline Advertising Agency"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-accent/30 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Official NTN</label>
                            <input
                                type="text"
                                defaultValue="7261152-7"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-accent/30 transition-all font-medium"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Address Hub</label>
                            <textarea
                                rows={3}
                                defaultValue="Office No. 10/B, Black Horse Plaza, Fazal-e Haq Road, Blue Area, Islamabad"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-accent/30 transition-all font-medium resize-none"
                            />
                        </div>
                    </div>
                </section>

                {/* FBR PRAL Configuration */}
                <section className="glass-card rounded-[2.5rem] border border-white/5 p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-400/10 rounded-2xl border border-amber-400/20">
                                <ShieldCheck className="text-amber-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold uppercase tracking-tight text-white">FBR PRAL Gateway</h3>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-400/10 rounded-full border border-emerald-400/20">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Connected</span>
                        </div>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Bearer Token (v1.12)</label>
                            <div className="relative group/key">
                                <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/key:text-accent transition-colors" size={18} />
                                <input
                                    type="password"
                                    defaultValue="••••••••••••••••••••••••••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-accent/30 transition-all font-medium"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                                <RefreshCw size={14} /> Rotate Auth Key
                            </button>
                            <button className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                                <Globe size={14} /> Toggle Sandbox
                            </button>
                        </div>
                    </div>
                </section>

                {/* Database & Performance */}
                <section className="glass-card rounded-[2.5rem] border border-white/5 p-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-emerald-400/10 rounded-2xl border border-emerald-400/20">
                            <Database className="text-emerald-400" size={24} />
                        </div>
                        <h3 className="text-xl font-bold uppercase tracking-tight">Persistence Layer</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Supabase Engine</p>
                            <p className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                                <Zap size={14} /> Production Cluster: ap-south-1
                            </p>
                        </div>
                        <div className="flex items-center justify-end">
                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/10">v4.12 Stable</span>
                        </div>
                    </div>
                </section>
            </div>

            <div className="text-center pt-10">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">Citiline Agency | Security Operations Center</p>
            </div>
        </div>
    );
}
