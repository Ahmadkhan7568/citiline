"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    Key,
    Zap,
    Smartphone,
    Building,
    Mail,
    CheckCircle2,
    X,
    UserPlus,
    Activity,
    Lock,
    Eye,
    EyeOff
} from "lucide-react";
import { generateSecureCredentials } from "@/lib/actions/auth";

export default function UserManagement() {
    const [staff, setStaff] = useState<any[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [generatedKey, setGeneratedKey] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("citiline_staff");
        if (saved) {
            setStaff(JSON.parse(saved));
        } else {
            const initial = [
                { id: "S-101", name: "Ahmed Khan", email: "admin@citiline.pk", role: "ADMIN", status: "Active" },
                { id: "S-102", name: "Sara Malik", email: "sara@citiline.pk", role: "STAFF", status: "Active" },
            ];
            setStaff(initial);
            localStorage.setItem("citiline_staff", JSON.stringify(initial));
        }
        setIsMounted(true);
    }, []);

    const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const role = formData.get("role") as "STAFF" | "CLIENT";

        const res = await generateSecureCredentials(role, email);
        if (res.success) {
            setGeneratedKey(res.credentials);
            const newStaff = {
                id: `S-${100 + staff.length + 1}`,
                name: email.split("@")[0].toUpperCase(),
                email,
                role: role.toUpperCase(),
                status: "Pending"
            };
            const updated = [newStaff, ...staff];
            setStaff(updated);
            localStorage.setItem("citiline_staff", JSON.stringify(updated));
        }
    };

    if (!isMounted) return null;

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Staff <span className="text-accent italic">Governance</span></h1>
                    <p className="text-muted-foreground text-sm font-medium">Provision accounts and manage administrative access keys.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-accent hover:bg-accent/80 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-xl shadow-accent/20"
                >
                    <UserPlus size={18} /> Provision New Access
                </button>
            </div>

            {/* List */}
            <div className="glass-card rounded-[2.5rem] border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground border-b border-white/5">
                            <th className="p-8">Staff Member</th>
                            <th className="p-8">Email</th>
                            <th className="p-8">Level</th>
                            <th className="p-8">Security Status</th>
                            <th className="p-8 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {staff.map((s) => (
                            <tr key={s.id} className="group hover:bg-white/[0.02]">
                                <td className="p-8 align-middle">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-black text-xs border border-white/10">{s.name[0]}</div>
                                        <span className="font-black text-sm">{s.name}</span>
                                    </div>
                                </td>
                                <td className="p-8 align-middle font-medium text-xs text-muted-foreground">{s.email}</td>
                                <td className="p-8 align-middle">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/10 px-2 py-1 rounded-md">{s.role}</span>
                                </td>
                                <td className="p-8 align-middle">
                                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest">
                                        <ShieldCheck size={14} /> {s.status}
                                    </div>
                                </td>
                                <td className="p-8 text-right align-middle">
                                    <button className="text-zinc-600 hover:text-white transition-colors">Manage Access</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsAddModalOpen(false); setGeneratedKey(null); }} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[3rem] p-10 overflow-hidden">
                            {!generatedKey ? (
                                <>
                                    <div className="flex items-center justify-between mb-10">
                                        <div>
                                            <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                                                <Lock className="text-accent" /> Secure <span className="text-accent italic">Provisioning</span>
                                            </h2>
                                            <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] opacity-40 mt-1">Generating RSA-encrypted access keys.</p>
                                        </div>
                                        <button onClick={() => setIsAddModalOpen(false)} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"><X size={20} /></button>
                                    </div>

                                    <form onSubmit={handleGenerate} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Official Email</label>
                                            <div className="relative group/mail">
                                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/mail:text-accent" size={18} />
                                                <input required name="email" type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-6 text-white outline-none focus:border-accent/30 transition-all font-medium" placeholder="Ex: staff@citiline.pk" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Clearance Level</label>
                                            <select name="role" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-accent/30 transition-all font-black uppercase tracking-widest text-[10px]">
                                                <option value="STAFF">Administrative Staff</option>
                                                <option value="CLIENT">Client Access</option>
                                            </select>
                                        </div>

                                        <button type="submit" className="w-full bg-accent hover:bg-accent/80 text-white p-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3 mt-6">
                                            <Activity size={18} /> Generate Access Key
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
                                    <div className="w-20 h-20 bg-emerald-400/10 border border-emerald-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 size={40} className="text-emerald-400" />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter">Access Key Generated</h2>
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4 text-left">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Temporary Password</p>
                                            <p className="text-xl font-mono font-black text-accent tracking-widest">{generatedKey.tempPassword}</p>
                                        </div>
                                        <div className="pt-4 border-t border-white/5">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Login Gateway</p>
                                            <p className="text-xs font-medium text-white underline">{window.location.origin}/login</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setIsAddModalOpen(false); setGeneratedKey(null); }}
                                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white p-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
                                    >
                                        Close & Revoke Visibility
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
