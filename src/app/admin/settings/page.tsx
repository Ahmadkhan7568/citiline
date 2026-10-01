"use client";

import React, { useState, useEffect } from "react";
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
    Database,
    Loader2,
    Download,
    Upload
} from "lucide-react";
import { getSettings, updateSettings } from "@/lib/actions";
import { BackupService } from "@/lib/tauri/backup";

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    async function loadSettings() {
        setIsLoading(true);
        const data = await getSettings();
        setSettings(data);
        setIsLoading(false);
    }

    useEffect(() => {
        loadSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const result = await updateSettings(settings);
        setIsSaving(false);
        if (result.success) {
            alert("Settings saved successfully!");
        } else {
            alert(`Error saving settings: ${result.error}`);
        }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="animate-spin text-accent" size={40} />
        </div>
    );

    return (
        <form onSubmit={handleSave} className="space-y-10 max-w-4xl pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">System <span className="text-accent italic">Config</span></h1>
                    <p className="text-muted-foreground text-sm font-medium">Global platform parameters and security protocols.</p>
                </div>
                <button 
                    disabled={isSaving}
                    type="submit"
                    className="bg-accent hover:bg-accent/80 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-xl shadow-accent/20 disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Commit Changes
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
                                value={settings?.name || ""}
                                onChange={(e) => setSettings({...settings, name: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-accent/30 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Logo Preview</label>
                            <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 flex items-center justify-center min-h-[150px] relative overflow-hidden group">
                                {settings?.logoUrl ? (
                                    <img 
                                        src={settings.logoUrl} 
                                        alt="Logo Preview" 
                                        className="max-h-24 w-auto object-contain relative z-10 transition-transform group-hover:scale-105"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x100?text=Invalid+Logo+URL';
                                        }}
                                    />
                                ) : (
                                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">No Logo Configured</div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Logo URL (Remote or Base64)</label>
                            <input
                                type="text"
                                value={settings?.logoUrl || ""}
                                onChange={(e) => setSettings({...settings, logoUrl: e.target.value})}
                                placeholder="https://..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-accent/30 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Official NTN</label>
                            <input
                                type="text"
                                value={settings?.ntn || ""}
                                onChange={(e) => setSettings({...settings, ntn: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-accent/30 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Sales Tax Reg (GST)</label>
                            <input
                                type="text"
                                value={settings?.gst || ""}
                                onChange={(e) => setSettings({...settings, gst: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-accent/30 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Bank Details (A/C #...)</label>
                            <input
                                type="text"
                                value={settings?.phone || ""}
                                onChange={(e) => setSettings({...settings, phone: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-accent/30 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Official Email</label>
                            <input
                                type="text"
                                value={settings?.email || ""}
                                onChange={(e) => setSettings({...settings, email: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-accent/30 transition-all font-medium"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Address Hub</label>
                            <textarea
                                rows={3}
                                value={settings?.address || ""}
                                onChange={(e) => setSettings({...settings, address: e.target.value})}
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
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Environment: {settings?.environment}</span>
                        </div>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Bearer Token (v1.12)</label>
                            <div className="relative group/key">
                                <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/key:text-accent transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={settings?.bearerToken || ""}
                                    onChange={(e) => setSettings({...settings, bearerToken: e.target.value})}
                                    placeholder="Paste FBR Bearer Token here..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-accent/30 transition-all font-medium"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button 
                                type="button"
                                onClick={() => setSettings({...settings, environment: settings.environment === 'Production' ? 'Sandbox' : 'Production'})}
                                className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                                <Globe size={14} /> Switch to {settings?.environment === 'Production' ? 'Sandbox' : 'Production'}
                            </button>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
                                Gateway v1.12 Compliant
                            </div>
                        </div>
                    </div>
                </section>

                {/* Data Portability & Persistence */}
                <section className="glass-card rounded-[2.5rem] border border-white/5 p-10 relative overflow-hidden group">
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl -ml-32 -mb-32" />
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-400/10 rounded-2xl border border-emerald-400/20">
                                <Database className="text-emerald-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold uppercase tracking-tight text-white">Data Portability</h3>
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">SQLite v3 Mirror</div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] space-y-4">
                            <div className="flex items-center gap-3">
                                <Download className="text-accent" size={18} />
                                <h4 className="text-sm font-bold uppercase tracking-tight">Manual Backup</h4>
                            </div>
                            <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">Export all invoices, ledger, and PRAL data to a local `.db` file for safe-keeping.</p>
                            <button 
                                type="button"
                                onClick={() => new BackupService().exportDatabase()}
                                className="w-full py-3 bg-accent/10 border border-accent/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-accent hover:bg-accent hover:text-white transition-all shadow-lg shadow-accent/5"
                            >
                                Download Database
                            </button>
                        </div>

                        <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] space-y-4">
                            <div className="flex items-center gap-3">
                                <Upload className="text-rose-400" size={18} />
                                <h4 className="text-sm font-bold uppercase tracking-tight">Restore Data</h4>
                            </div>
                            <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">Upload a previously exported backup file to restore your entire ERP state. <b>Warning: Overwrites current data.</b></p>
                            <button 
                                type="button"
                                onClick={() => new BackupService().importDatabase()}
                                className="w-full py-3 bg-rose-400/5 border border-rose-400/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                            >
                                Restore from File
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                             <Zap className="text-emerald-400" size={14} />
                             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Local Mirror: aws-mir-1 • Production Stable</span>
                        </div>
                        <div className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/10 text-zinc-500">v4.12 Mirror Schema</div>
                    </div>
                </section>
            </div>

            <div className="text-center pt-10">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">Citiline Agency | Security Operations Center</p>
            </div>
        </form>
    );
}
