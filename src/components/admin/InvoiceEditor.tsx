"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save, Printer, Send, X, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { formatPKR } from "@/lib/ledger";
import { createInvoice, updateInvoice, submitToFBR, getSettings } from "@/lib/actions";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxAmount: number;
  total: number;
}

interface InvoiceEditorProps {
  customers: any[];
  onClose: () => void;
  onSaved: () => void;
  initialInvoice?: any;
}

export default function InvoiceEditor({ customers, onClose, onSaved, initialInvoice }: InvoiceEditorProps) {
    const [settings, setSettings] = useState<any>(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState(initialInvoice?.customerId || "");
    const [taxRate, setTaxRate] = useState(parseFloat(initialInvoice?.taxRate) || 18);
    const [invoiceNumber, setInvoiceNumber] = useState(initialInvoice?.invoiceNumber || `CIT-${Date.now().toString().slice(-4)}`);
    const [invoiceDate, setInvoiceDate] = useState(
        initialInvoice?.date ? (typeof initialInvoice.date === 'string' ? initialInvoice.date.split('T')[0] : initialInvoice.date.toISOString().split('T')[0]) 
        : new Date().toISOString().split('T')[0]
    );
    const [items, setItems] = useState<LineItem[]>(initialInvoice?.items || [
        { id: "1", description: "", quantity: 1, unitPrice: 0, taxAmount: 0, total: 0 }
    ]);
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmittingToFBR, setIsSubmittingToFBR] = useState(false);
    const [invoiceId, setInvoiceId] = useState<string | null>(initialInvoice?.id || null);
    const [fbrData, setFbrData] = useState<{ irn: string, qrData: string } | null>(
        initialInvoice?.fbrIrn ? { irn: initialInvoice.fbrIrn, qrData: initialInvoice.fbrQrData || "" } : null
    );
    
    // Editable Header info (fallbacks to settings)
    const [headerInfo, setHeaderInfo] = useState({
        name: "Citiline Advertising",
        address: "Office No. 10/B, Black Horse Plaza, Fazal-e-Haq Road, Blue Area, Islamabad",
        tel: "051-2605859",
        email: "citilineadv@gmail.com",
        ntn: "1958264-1",
        gst: "26-00-8442-250-73",
        bank: "Bank Al Falah A/C No. 5504 5000 284450",
        logoUrl: "/logo.png"
    });

    useEffect(() => {
        getSettings().then(data => {
            if (data) {
                setSettings(data);
                setHeaderInfo({
                    name: data.name || headerInfo.name,
                    address: data.address || headerInfo.address,
                    tel: data.phone || headerInfo.tel,
                    email: data.email || headerInfo.email,
                    ntn: data.ntn || headerInfo.ntn,
                    gst: data.gst || headerInfo.gst,
                    bank: data.phone || headerInfo.bank, // Reusing phone for bank or update settings
                    logoUrl: data.logoUrl || headerInfo.logoUrl
                });
            }
        });
    }, []);

    const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const totalTax = items.reduce((acc, item) => acc + item.taxAmount, 0);
    const grandTotal = subtotal + totalTax;

    const addItem = () => {
        const newItem = { id: Math.random().toString(), description: "", quantity: 1, unitPrice: 0, taxAmount: 0, total: 0 };
        setItems([...items, newItem]);
    };

    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const updateItem = (id: string, field: string, value: any) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const updated = { ...item, [field]: value };
                const price = field === 'unitPrice' ? Number(value) : item.unitPrice;
                const qty = field === 'quantity' ? Number(value) : item.quantity;
                updated.taxAmount = (price * qty) * (taxRate / 100);
                updated.total = (price * qty) * (1 + taxRate / 100);
                return updated;
            }
            return item;
        }));
    };

    const handleSave = async () => {
        if (!selectedCustomerId) {
            alert("Please select a customer");
            return;
        }
        setIsSaving(true);
        const invoiceData = {
            invoiceNumber,
            customerId: selectedCustomerId,
            subtotal,
            taxAmount: totalTax,
            total: grandTotal,
            date: new Date(invoiceDate),
            taxRate: taxRate.toString()
        };
        const itemsData = items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxAmount: item.taxAmount,
            total: item.total
        }));

        let result;
        if (initialInvoice?.id) {
            result = await updateInvoice(initialInvoice.id, invoiceData, itemsData);
        } else {
            result = await createInvoice(invoiceData, itemsData);
        }

        setIsSaving(false);
        if (result.success && result.invoice) {
            setInvoiceId(result.invoice.id);
            alert(initialInvoice?.id ? "Invoice updated!" : "Invoice saved to ledger!");
        } else {
            alert(`Error: ${result.error}`);
        }
    };

    const handleSubmitToFBR = async () => {
        if (!invoiceId) {
            alert("Please save the invoice first");
            return;
        }
        setIsSubmittingToFBR(true);
        const result = await submitToFBR(invoiceId);
        setIsSubmittingToFBR(false);
        if (result.success) {
            alert("Successfully submitted to FBR!");
            setFbrData({ irn: result.irn, qrData: (result as any).qrData || "" });
        } else {
            alert(`FBR Submission Failed: ${result.error}`);
        }
    };

    return (
        <div className="fixed inset-0 z-[500] bg-zinc-950/95 backdrop-blur-3xl overflow-y-auto overflow-x-hidden custom-scrollbar">
            {/* Global Print Isolation Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body * { visibility: hidden; overflow: visible !important; }
                    #print-section, #print-section * { visibility: visible; }
                    #print-section { position: absolute; left: 0; top: 0; width: 100%; height: auto; }
                    .print-hidden { display: none !important; }
                }
            `}} />

            <div className="min-h-screen py-10 px-4 flex flex-col items-center gap-8">
                {/* Actions Toolbar */}
                <div className="w-full max-w-4xl flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/80 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-xl sticky top-4 z-50 print:hidden shadow-2xl">
                    <button onClick={onClose} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-bold uppercase tracking-widest text-[10px]">
                        <ArrowLeft size={16} /> Close Editor
                    </button>
                    <div className="flex flex-wrap items-center gap-3">
                        <button 
                            onClick={handleSave} 
                            disabled={isSaving || (!!invoiceId && !initialInvoice?.id)}
                            className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 border border-white/10 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} 
                            {initialInvoice?.id ? "Update Ledger" : (invoiceId ? "Database Entry Active" : "Save to Ledger")}
                        </button>
                        <button 
                            onClick={() => window.print()} 
                            className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 border border-white/10"
                        >
                            <Printer size={14} /> Print A4
                        </button>
                        <button 
                            onClick={handleSubmitToFBR}
                            disabled={!invoiceId || isSubmittingToFBR || !!fbrData}
                            className="bg-accent hover:bg-accent/80 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 shadow-lg shadow-accent/20 disabled:opacity-30"
                        >
                            {isSubmittingToFBR ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />} 
                            {fbrData ? "Fiscal Records Active" : "FBR Submission"}
                        </button>
                    </div>
                </div>

                {/* Main Paper Invoice Container */}
                <div id="print-section" className="w-full max-w-4xl scale-[0.6] sm:scale-[0.8] md:scale-100 origin-top transition-transform duration-500">
                    <div className="bg-white text-black p-8 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative min-h-[1100px] font-sans">
                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-10">
                            <div className="w-64 group relative">
                                <img src={headerInfo.logoUrl} alt="Logo" className="w-full h-auto" />
                                <div className="absolute inset-x-0 bottom-0 p-1 bg-accent/10 border border-accent/20 text-[6px] font-bold text-accent uppercase opacity-0 group-hover:opacity-100 transition-opacity">Editable in Settings</div>
                            </div>
                            <div className="text-right text-[11px] leading-relaxed space-y-1 sm:w-80">
                                <textarea 
                                    className="w-full bg-transparent border-none outline-none resize-none text-right font-medium p-0"
                                    value={headerInfo.address}
                                    onChange={(e) => setHeaderInfo({...headerInfo, address: e.target.value})}
                                    rows={2}
                                />
                                <div className="flex justify-end items-center gap-2">
                                    <span>Tel:</span>
                                    <input 
                                        className="bg-transparent border-none outline-none text-right font-medium p-0"
                                        value={headerInfo.tel}
                                        onChange={(e) => setHeaderInfo({...headerInfo, tel: e.target.value})}
                                    />
                                    <span>E-Mail:</span>
                                    <input 
                                        className="bg-transparent border-none outline-none text-right font-medium p-0"
                                        value={headerInfo.email}
                                        onChange={(e) => setHeaderInfo({...headerInfo, email: e.target.value})}
                                    />
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <span className="font-bold uppercase tracking-wider">NTN No.</span>
                                    <input 
                                        className="bg-transparent border-none outline-none text-right font-bold p-0 w-32"
                                        value={headerInfo.ntn}
                                        onChange={(e) => setHeaderInfo({...headerInfo, ntn: e.target.value})}
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <span className="font-bold uppercase tracking-wider">GST No.</span>
                                    <input 
                                        className="bg-transparent border-none outline-none text-right font-bold p-0 w-64"
                                        value={headerInfo.gst}
                                        onChange={(e) => setHeaderInfo({...headerInfo, gst: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Invoice Metadata */}
                        <div className="space-y-6 mb-8 border-b-2 border-zinc-100 pb-8">
                            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6">
                                <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Sales Tax <span className="italic opacity-30">Invoice</span></h2>
                                <div className="flex gap-6">
                                    <div className="flex flex-col gap-1 items-center">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Invoice No.</span>
                                        <input 
                                            className="border-2 border-black px-4 py-1 w-28 text-sm font-bold text-center h-10 outline-none"
                                            value={invoiceNumber}
                                            onChange={(e) => setInvoiceNumber(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1 items-center">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Date Logged</span>
                                        <input 
                                            type="date"
                                            className="border-2 border-black px-4 py-1 w-40 text-sm font-bold text-center h-10 outline-none"
                                            value={invoiceDate}
                                            onChange={(e) => setInvoiceDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <span className="text-2xl font-black italic mt-3 opacity-20">TO:</span>
                                <div className="flex-grow border-2 border-black p-6 relative bg-zinc-50/50">
                                    <select 
                                        className="w-full border-none outline-none font-black text-2xl p-0 bg-transparent appearance-none disabled:opacity-100 uppercase tracking-tighter"
                                        value={selectedCustomerId}
                                        onChange={(e) => setSelectedCustomerId(e.target.value)}
                                        disabled={!!invoiceId}
                                    >
                                        <option value="">SELECT CUSTOMER FROM CRM</option>
                                        {customers.map(c => (
                                            <option key={c.id} value={c.id}>{c.companyName}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[8px] font-black text-zinc-300 tracking-widest print:hidden">ACTIVE DATABASE SELECTION</div>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full border-2 border-black mb-4 text-[11px] min-w-[700px]">
                                <thead>
                                    <tr className="bg-white border-b-2 border-black font-black">
                                        <th className="border-r-2 border-black p-3 w-16 text-center uppercase">Qty</th>
                                        <th className="border-r-2 border-black p-3 text-center uppercase">DESCRIPTION</th>
                                        <th className="border-r-2 border-black p-3 w-32 text-center uppercase">Unit Price</th>
                                        <th className="border-r-2 border-black p-3 w-32 text-center uppercase">Subtotal</th>
                                        <th className="border-r-2 border-black p-3 w-32 text-center uppercase">
                                           Sales Tax 
                                           <div className="flex items-center justify-center gap-1 mt-1">
                                                <input 
                                                    type="number"
                                                    value={taxRate}
                                                    onChange={(e) => setTaxRate(Number(e.target.value))}
                                                    className="w-8 bg-zinc-100 text-center rounded border-none outline-none font-bold text-[10px]"
                                                />
                                                <span className="text-[10px]">%</span>
                                           </div>
                                        </th>
                                        <th className="p-3 w-32 text-center uppercase">Grand Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, idx) => (
                                        <tr key={item.id} className={idx % 2 === 0 ? "bg-[#f4f9f1]" : "bg-white"}>
                                            <td className="border-r-2 border-black p-3 text-center font-bold">
                                                <input 
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                                                    className="w-full bg-transparent border-none outline-none text-center font-bold"
                                                    disabled={!!invoiceId}
                                                />
                                            </td>
                                            <td className="border-r-2 border-black p-3 relative group font-medium italic">
                                                <input 
                                                    value={item.description}
                                                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                    className="w-full bg-transparent border-none outline-none font-medium px-1"
                                                    placeholder="Enter services code or description..."
                                                    disabled={!!invoiceId}
                                                />
                                                {!invoiceId && (
                                                    <button 
                                                        onClick={() => removeItem(item.id)}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity print:hidden"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                )}
                                            </td>
                                            <td className="border-r-2 border-black p-3 text-right font-bold">
                                                <input 
                                                    type="number"
                                                    value={item.unitPrice}
                                                    onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                                                    className="w-full bg-transparent border-none outline-none text-right font-bold"
                                                    disabled={!!invoiceId}
                                                />
                                            </td>
                                            <td className="border-r-2 border-black p-3 text-right font-black">
                                                {(item.quantity * item.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="border-r-2 border-black p-3 text-right font-bold text-zinc-500">
                                                {item.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-3 text-right font-black bg-zinc-50/10">
                                                {item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                    {[...Array(Math.max(0, 12 - items.length))].map((_, i) => (
                                        <tr key={`empty-${i}`} className={(items.length + i) % 2 === 0 ? "bg-[#f4f9f1] h-10" : "bg-white h-10"}>
                                            <td className="border-r-2 border-black"></td>
                                            <td className="border-r-2 border-black"></td>
                                            <td className="border-r-2 border-black"></td>
                                            <td className="border-r-2 border-black"></td>
                                            <td className="border-r-2 border-black"></td>
                                            <td></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary Footer */}
                        <div className="flex flex-col items-end gap-6 mb-12">
                            {!invoiceId && (
                                <button onClick={addItem} className="text-xs font-black text-accent uppercase tracking-[0.2em] flex items-center gap-2 print:hidden hover:opacity-70 transition-opacity">
                                    <Plus size={14} /> Expand Line Items
                                </button>
                            )}
                            <div className="flex flex-col gap-2 w-full max-w-sm">
                                <div className="flex justify-between items-center text-[11px] font-bold text-zinc-500 px-2 uppercase tracking-widest">
                                    <span>Net Services Value</span>
                                    <span>{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] font-bold text-zinc-400 px-2 uppercase tracking-widest mb-4">
                                    <span>Total Sales Tax ({taxRate}%)</span>
                                    <span>{totalTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center bg-black text-white p-4 rounded-lg">
                                    <span className="text-xs font-black uppercase tracking-widest">Total Payable</span>
                                    <span className="text-2xl font-black tracking-tighter">
                                        PKR {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Disclaimers */}
                        <div className="pt-8 border-t-2 border-zinc-100 flex flex-col items-center gap-6">
                            <div className="text-center space-y-2">
                                <p className="text-[10px] italic font-medium opacity-60">please issue cheque in favour of <span className="font-bold uppercase tracking-tight">"{headerInfo.name}"</span> only.</p>
                                <textarea 
                                    className="w-full max-w-lg bg-transparent border-none outline-none text-center font-black text-xs p-0 resize-none"
                                    value={headerInfo.bank}
                                    onChange={(e) => setHeaderInfo({...headerInfo, bank: e.target.value})}
                                    rows={1}
                                />
                            </div>

                            <div className="w-full flex justify-between items-end px-12">
                                <div className="relative">
                                    {fbrData && (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-2 border-2 border-black bg-white">
                                                <img 
                                                    src={`https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=${encodeURIComponent(fbrData.qrData)}&choe=UTF-8`}
                                                    alt="FBR QR"
                                                    className="w-20 h-20"
                                                />
                                            </div>
                                            <div className="bg-black text-white px-3 py-1 rounded text-[8px] font-black font-mono">IRN: {fbrData.irn}</div>
                                        </div>
                                    )}
                                </div>
                                <div className="text-center pb-4">
                                    <div className="w-64 h-[1px] bg-black mb-3" />
                                    <p className="text-xl font-black uppercase tracking-tighter">for {headerInfo.name}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mt-1">Authorized Signature</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Watermark Section */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 pointer-events-none opacity-[0.03]">
                            <h3 className="text-[12rem] font-black uppercase">{headerInfo.name.split(' ')[0]}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
