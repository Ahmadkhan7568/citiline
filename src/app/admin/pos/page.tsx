"use client";

import React, { useState, useEffect } from "react";
import { 
    Calculator, 
    Printer, 
    Save, 
    Plus, 
    Trash2, 
    Search, 
    User, 
    Package, 
    LayoutGrid, 
    Clock,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPKR } from "@/lib/ledger";
import { syncService } from "@/lib/tauri/sync";

export default function POSPage() {
    const [cart, setCart] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [isFiscal, setIsFiscal] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSynced, setIsSynced] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadLocalData();
    }, []);

    const loadLocalData = async () => {
        try {
            const customerData = await syncService.getLocalData("customers") as any[];
            const serviceData = await syncService.getLocalData("services") as any[];
            setCustomers(customerData);
            setServices(serviceData);
        } catch (e) {
            console.error("Failed to load local data:", e);
        }
    };

    const addToCart = (service: any) => {
        const id = Math.random().toString(36).substr(2, 9);
        const price = parseFloat(service.base_price || service.basePrice || 0);
        const taxRate = parseFloat(service.tax_rate || service.taxRate || 18);
        const taxAmount = (price * taxRate) / 100;
        
        setCart([...cart, { 
            id, 
            serviceId: service.id,
            name: service.name, 
            price, 
            quantity: 1, 
            taxAmount, 
            total: price + taxAmount 
        }]);
    };

    const removeFromCart = (id: string) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const handleSave = async () => {
        if (!selectedCustomer) {
            alert("Please select a customer first.");
            return;
        }

        setIsSaving(true);
        try {
            const db = await syncService.init();
            const invoiceId = crypto.randomUUID();
            const invoiceNumber = `CIT-POS-${Date.now().toString().slice(-6)}`;
            
            // 1. Save Invoice
            await db.execute(`
                INSERT INTO invoices (id, invoice_number, customer_id, subtotal, tax_amount, total, status, fbr_status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [invoiceId, invoiceNumber, selectedCustomer.id, subtotal, tax, total, 'PAID', isFiscal ? 'Pending' : 'N/A']);

            // 2. Save Items
            for (const item of cart) {
                await db.execute(`
                    INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price, tax_amount, total)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [crypto.randomUUID(), invoiceId, item.name, item.quantity, item.price, item.taxAmount, item.total]);
            }

            // 3. Save Ledger Entry
            await db.execute(`
                INSERT INTO ledger_entries (id, customer_id, invoice_id, type, amount, description, running_balance)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [crypto.randomUUID(), selectedCustomer.id, invoiceId, 'DEBIT', total, `POS Invoice ${invoiceNumber}`, 0]);

            setIsSaving(false);
            setCart([]);
            setSelectedCustomer(null);
            alert(`Invoice ${invoiceNumber} Saved Locally!`);
        } catch (e: any) {
            console.error("Save failed:", e);
            alert("Error saving invoice: " + e.message);
            setIsSaving(false);
        }
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = cart.reduce((acc, item) => acc + item.taxAmount, 0);
    const total = subtotal + tax;

    const filteredServices = services.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-screen flex flex-col bg-[#080808] text-white p-6 overflow-hidden">
            {/* POS Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                        <Calculator className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter">Citiline <span className="text-accent italic">POS Terminal</span></h1>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <span className={cn("w-2 h-2 rounded-full", isSynced ? "bg-emerald-500" : "bg-amber-500 animate-pulse")}></span>
                            {isSynced ? "Engine Online" : "Syncing to Cloud..."} • FBR PRAL v1.12 Active
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                        <Clock size={16} /> History
                    </button>
                    <button className="px-6 py-3 rounded-xl bg-accent text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                        <Plus size={16} /> New Session
                    </button>
                </div>
            </div>

            <div className="flex-1 flex gap-8 min-h-0">
                {/* Left Side: Product Selection & Search */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="relative mb-6">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                        <input 
                            placeholder="Search by Product Name or Scan Barcode..." 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-8 text-sm outline-none focus:border-accent transition-all font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 grid grid-cols-3 gap-4 overflow-y-auto pr-2 custom-scrollbar">
                        {filteredServices.map((prod, i) => (
                            <button 
                                key={i}
                                onClick={() => addToCart(prod)}
                                className="glass-card p-6 rounded-[2rem] text-left border border-white/5 hover:border-accent/40 transition-all group flex flex-col justify-between"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                        <Package className="text-zinc-500 group-hover:text-accent" size={18} />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{prod.category}</span>
                                </div>
                                <div>
                                    <h3 className="font-black text-sm mb-1">{prod.name}</h3>
                                    <p className="text-accent font-black text-lg">{formatPKR(prod.base_price || prod.basePrice)}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Side: Cart, Summary & Actions */}
                <div className="w-[450px] flex flex-col gap-6 min-h-0">
                    {/* Customer Selection */}
                    <div className="glass-card p-6 rounded-[2rem] border border-white/5 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Customer</h3>
                            <button className="text-accent font-black text-[10px] uppercase tracking-widest hover:underline">+ New Client</button>
                        </div>
                        <div className="relative">
                            <select 
                                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-black italic outline-none appearance-none cursor-pointer"
                                onChange={(e) => {
                                    const cust = customers.find(c => c.id === e.target.value);
                                    setSelectedCustomer(cust);
                                }}
                                value={selectedCustomer?.id || ""}
                            >
                                <option value="" className="bg-zinc-900">Select Customer...</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id} className="bg-zinc-900">
                                        {c.company_name || c.companyName}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <User className="text-accent" size={18} />
                            </div>
                        </div>
                        {selectedCustomer && (
                            <p className="mt-2 text-[10px] text-zinc-500 uppercase tracking-widest">
                                NTN: {selectedCustomer.ntn || 'Unregistered'}
                            </p>
                        )}
                    </div>

                    {/* Cart Items */}
                    <div className="glass-card flex-1 rounded-[2rem] border border-white/5 flex flex-col min-h-0">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Items List ({cart.length})</h3>
                            <button onClick={() => setCart([])} className="text-zinc-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-700 opacity-50">
                                    <LayoutGrid size={48} className="mb-4" />
                                    <p className="font-black uppercase tracking-widest text-xs">Cart is Empty</p>
                                </div>
                            ) : cart.map((item) => (
                                <div key={item.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center justify-between group">
                                    <div>
                                        <p className="text-sm font-bold truncate max-w-[150px]">{item.name}</p>
                                        <p className="text-[10px] text-zinc-500 font-mono">1 x {formatPKR(item.price)}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="text-sm font-black">{formatPKR(item.total)}</p>
                                        <button onClick={() => removeFromCart(item.id)} className="text-zinc-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals & Quick Actions */}
                    <div className="glass-card p-8 rounded-[2rem] bg-accent/5 border border-accent/20">
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-zinc-400">
                                <span className="text-[10px] font-black uppercase tracking-widest">Subtotal</span>
                                <span className="font-mono text-sm">{formatPKR(subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-400">
                                <span className="text-[10px] font-black uppercase tracking-widest">Sales Tax (18%)</span>
                                <span className="font-mono text-sm">{formatPKR(tax)}</span>
                            </div>
                            <div className="h-[1px] bg-white/5"></div>
                            <div className="flex justify-between items-center text-white">
                                <span className="text-xs font-black uppercase tracking-[0.2em] italic">Total Payable</span>
                                <span className="text-3xl font-black text-accent">{formatPKR(total)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={handleSave}
                                disabled={cart.length === 0 || isSaving}
                                className="col-span-2 h-20 rounded-[1.5rem] bg-accent hover:bg-accent/80 text-white font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-accent/30 flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:scale-100 hover:scale-[1.02] active:scale-95"
                            >
                                {isSaving ? <Clock className="animate-spin" /> : <Save />} 
                                {isSaving ? "Completing Transaction..." : "Save & Print Invoice"}
                            </button>
                            <button 
                                onClick={() => setIsFiscal(!isFiscal)}
                                className={cn(
                                    "h-14 rounded-2xl font-black uppercase tracking-widest text-[9px] border transition-all flex items-center justify-center gap-2",
                                    isFiscal ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-white/5 border-white/10 text-zinc-500"
                                )}
                            >
                                {isFiscal ? <CheckCircle2 size={14} /> : null} Fiscal (FBR)
                            </button>
                            <button className="h-14 rounded-2xl bg-white/5 border border-white/10 text-zinc-500 font-black uppercase tracking-widest text-[9px] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                <Printer size={14} /> Thermal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
