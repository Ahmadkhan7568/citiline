"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Phone,
    MapPin,
    Building2,
    UserCircle,
    FileText,
    X,
    CheckCircle2,
    Database,
    Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Customer {
    id: string;
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    balance: number;
    status: "ACTIVE" | "INACTIVE";
}

export default function CustomerManagement() {
    // State
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    // Initial Load from LocalStorage (Simulating a DB)
    useEffect(() => {
        const saved = localStorage.getItem("citiline_customers");
        if (saved) {
            setCustomers(JSON.parse(saved));
        } else {
            // Initial Seed
            const initial: Customer[] = [
                { id: "CUST-001", companyName: "Dynamic Corp", contactPerson: "Ahmed Shah", email: "ahmed@dynamic.pk", phone: "0300-1234567", balance: 125000, status: "ACTIVE" },
                { id: "CUST-002", companyName: "Global Solutions", contactPerson: "Sara Khan", email: "sara@global.com", phone: "0321-7654321", balance: 42500, status: "ACTIVE" },
            ];
            setCustomers(initial);
            localStorage.setItem("citiline_customers", JSON.stringify(initial));
        }
        setIsMounted(true);
    }, []);

    // Sync to LocalStorage
    const saveToLocal = (data: Customer[]) => {
        setCustomers(data);
        localStorage.setItem("citiline_customers", JSON.stringify(data));
    };

    const addCustomer = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newCust: Customer = {
            id: `CUST-00${customers.length + 1}`,
            companyName: formData.get("companyName") as string,
            contactPerson: formData.get("contactPerson") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            balance: 0,
            status: "ACTIVE"
        };
        const updated = [newCust, ...customers];
        saveToLocal(updated);
        setIsAddModalOpen(false);
    };

    const deleteCustomer = (id: string) => {
        if (confirm("Are you sure you want to remove this account? This will audit-log the deletion.")) {
            const updated = customers.filter(c => c.id !== id);
            saveToLocal(updated);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isMounted) return null;

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Customer <span className="text-accent italic">Registry</span></h1>
                    <p className="text-muted-foreground text-sm font-medium">Manage client profiles, opening balances, and account status.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-accent hover:bg-accent/80 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-xl shadow-accent/20"
                    >
                        <Plus size={18} /> New Customer Entry
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by company name, NTN, or contact person..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-6 text-white outline-none focus:border-accent/30 transition-all font-medium"
                    />
                </div>
                <button className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all uppercase tracking-widest text-xs">
                    <Filter size={18} /> Export CSV
                </button>
            </div>

            {/* Customer List */}
            <div className="glass-card rounded-[2.5rem] border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground border-b border-white/5">
                                <th className="p-8">Customer ID</th>
                                <th className="p-8">Company Details</th>
                                <th className="p-8">Contact Info</th>
                                <th className="p-8">Running Balance</th>
                                <th className="p-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredCustomers.map((cust) => (
                                <tr key={cust.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-8 align-middle">
                                        <span className="bg-accent/10 text-accent text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest">{cust.id}</span>
                                    </td>
                                    <td className="p-8 align-middle">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/20 flex items-center justify-center text-accent">
                                                <Building2 size={20} />
                                            </div>
                                            <div>
                                                <p className="font-black text-sm">{cust.companyName}</p>
                                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Active Partner</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8 align-middle space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-medium">
                                            <UserCircle size={14} className="text-accent" /> {cust.contactPerson}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-medium">
                                            <Mail size={12} /> {cust.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-medium">
                                            <Phone size={12} /> {cust.phone}
                                        </div>
                                    </td>
                                    <td className="p-8 align-middle">
                                        <div className="text-right inline-block">
                                            <p className="font-black text-sm tracking-tighter">PKR {cust.balance.toLocaleString()}</p>
                                            <p className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block", cust.balance > 0 ? "text-rose-400" : "text-emerald-400")}>
                                                {cust.balance > 0 ? "Debit" : "Neutral"}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right align-middle">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => deleteCustomer(cust.id)}
                                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-rose-400/20 hover:text-rose-400 transition-all"
                                                title="Delete Account"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-white transition-all text-muted-foreground group">
                                                <MoreVertical size={16} className="group-hover:rotate-90 transition-transform" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[3rem] p-10 overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                                        <Database className="text-accent" /> New <span className="text-accent italic">Registration</span>
                                    </h2>
                                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest opacity-70 mt-1">Populating real-time CRM database.</p>
                                </div>
                                <button onClick={() => setIsAddModalOpen(false)} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={addCustomer} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Company Name</label>
                                        <input required name="companyName" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-accent/30 transition-all font-medium" placeholder="Ex: Nexus Media" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Contact Person</label>
                                        <input required name="contactPerson" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-accent/30 transition-all font-medium" placeholder="Ex: Bilal Malik" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Email Address</label>
                                        <input required type="email" name="email" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-accent/30 transition-all font-medium" placeholder="sales@nexus.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Phone Number</label>
                                        <input required name="phone" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-accent/30 transition-all font-medium" placeholder="0300-0000000" />
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-accent hover:bg-accent/80 text-white p-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3 mt-6">
                                    <CheckCircle2 size={18} /> Initialize Account
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
