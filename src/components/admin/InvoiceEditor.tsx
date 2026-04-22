"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save, Printer, Send, X, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { formatPKR } from "@/lib/ledger";
import { createInvoice, submitToFBR } from "@/lib/actions";

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
}

export default function InvoiceEditor({ customers, onClose, onSaved }: InvoiceEditorProps) {
    const [selectedCustomerId, setSelectedCustomerId] = useState("");
    const [items, setItems] = useState<LineItem[]>([
        { id: "1", description: "", quantity: 1, unitPrice: 0, taxAmount: 0, total: 0 }
    ]);
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmittingToFBR, setIsSubmittingToFBR] = useState(false);
    const [invoiceId, setInvoiceId] = useState<string | null>(null);
    const [fbrData, setFbrData] = useState<{ irn: string, qrData: string } | null>(null);

    const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const totalTax = items.reduce((acc, item) => acc + item.taxAmount, 0);
    const grandTotal = subtotal + totalTax;

    const addItem = () => {
        setItems([...items, { id: Math.random().toString(), description: "", quantity: 1, unitPrice: 0, taxAmount: 0, total: 0 }]);
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
                if (field === 'quantity' || field === 'unitPrice') {
                    const price = field === 'unitPrice' ? Number(value) : item.unitPrice;
                    const qty = field === 'quantity' ? Number(value) : item.quantity;
                    updated.taxAmount = (price * qty) * 0.18;
                    updated.total = (price * qty) * 1.18;
                }
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
            invoiceNumber: `CIT-${Date.now().toString().slice(-4)}`,
            customerId: selectedCustomerId,
            subtotal,
            taxAmount: totalTax,
            total: grandTotal,
        };
        const itemsData = items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxAmount: item.taxAmount,
            total: item.total
        }));

        const result = await createInvoice(invoiceData, itemsData);
        setIsSaving(false);
        if (result.success && result.invoice) {
            setInvoiceId(result.invoice.id);
            alert("Invoice saved to ledger!");
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
        <div className="fixed inset-0 z-[200] bg-zinc-950/95 backdrop-blur-2xl overflow-y-auto custom-scrollbar pb-20">
            <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Actions Toolbar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5 backdrop-blur-xl sticky top-4 z-50 print:hidden">
                    <button onClick={onClose} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft size={18} /> Exit Editor
                    </button>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleSave} 
                            disabled={isSaving || !!invoiceId}
                            className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 border border-white/10 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} 
                            {invoiceId ? "Draft Saved" : "Save to Ledger"}
                        </button>
                        <button 
                            onClick={() => window.print()} 
                            className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 border border-white/10"
                        >
                            <Printer size={14} /> Print
                        </button>
                        <button 
                            onClick={handleSubmitToFBR}
                            disabled={!invoiceId || isSubmittingToFBR || !!fbrData}
                            className="bg-accent hover:bg-accent/80 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 shadow-lg shadow-accent/20 disabled:opacity-30"
                        >
                            {isSubmittingToFBR ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />} 
                            {fbrData ? "Fiscalized" : "Submit to FBR"}
                        </button>
                    </div>
                </div>

                {/* Main Paper Invoice */}
                <div className="bg-white text-black p-8 md:p-12 shadow-2xl relative min-h-[1100px] font-sans print:p-0 print:shadow-none">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div className="w-64">
                            <img src="/logo.png" alt="Citiline Advertising" className="w-full h-auto" />
                        </div>
                        <div className="text-right text-[11px] leading-tight space-y-1">
                            <p>Office No. 10/B, Black Horse Plaza, Fazal-e-</p>
                            <p>Haq Road, Blue Area, Islamabad</p>
                            <p>Tel: 051-2605859. E-Mail:</p>
                            <p>citilineadv@gmail.com</p>
                            <div className="flex justify-end gap-2 mt-2 font-bold">
                                <span>NTN No.</span>
                                <span>1958264-1</span>
                            </div>
                            <div className="flex justify-end gap-2 font-bold">
                                <span>GST No.</span>
                                <span>26-00-8442-250-73</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mb-4">
                        <div className="flex justify-between items-end">
                            <h2 className="text-lg font-bold">SALES TAX INVOICE</h2>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold">INVOICE NO.</span>
                                    <div className="border-2 border-black px-4 py-1 min-w-[80px] text-sm font-bold h-8 flex items-center justify-center">
                                       {invoiceId?.slice(-6) || ""}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold">Date:</span>
                                    <div className="border-2 border-black px-4 py-1 min-w-[120px] text-sm font-bold h-8 flex items-center justify-center">
                                        {new Date().toLocaleDateString('en-GB')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <span className="text-xl font-bold italic mt-2">TO:</span>
                            <div className="flex-grow border-2 border-black p-4 min-h-[50px] relative">
                                <select 
                                    className="w-full border-none outline-none font-bold text-lg p-0 bg-transparent appearance-none disabled:opacity-100"
                                    value={selectedCustomerId}
                                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                                    disabled={!!invoiceId}
                                >
                                    <option value="">SELECT CUSTOMER</option>
                                    {customers.map(c => (
                                        <option key={c.id} value={c.id}>{c.companyName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <table className="w-full border-2 border-black mb-2 text-xs">
                        <thead>
                            <tr className="bg-white border-b-2 border-black font-bold">
                                <th className="border-r-2 border-black p-2 w-12 text-center uppercase">Qty</th>
                                <th className="border-r-2 border-black p-2 text-center uppercase">DESCRIPTION</th>
                                <th className="border-r-2 border-black p-2 w-24 text-center uppercase">Unit Price</th>
                                <th className="border-r-2 border-black p-2 w-24 text-center uppercase">Total</th>
                                <th className="border-r-2 border-black p-2 w-20 text-center uppercase">GST 18%</th>
                                <th className="p-2 w-24 text-center uppercase">Total with GST</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={item.id} className={idx % 2 === 0 ? "bg-[#e2efd9]" : "bg-white"}>
                                    <td className="border-r-2 border-black p-2">
                                        <input 
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                                            className="w-full bg-transparent border-none outline-none text-center font-medium"
                                            disabled={!!invoiceId}
                                        />
                                    </td>
                                    <td className="border-r-2 border-black p-2 relative group">
                                        <input 
                                            value={item.description}
                                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                            className="w-full bg-transparent border-none outline-none font-medium px-1"
                                            placeholder="..."
                                            disabled={!!invoiceId}
                                        />
                                        {!invoiceId && (
                                            <button 
                                                onClick={() => removeItem(item.id)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity print:hidden"
                                            >
                                                <Trash2 size={10} />
                                            </button>
                                        )}
                                    </td>
                                    <td className="border-r-2 border-black p-2">
                                        <input 
                                            type="number"
                                            value={item.unitPrice}
                                            onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                                            className="w-full bg-transparent border-none outline-none text-right font-medium"
                                            disabled={!!invoiceId}
                                        />
                                    </td>
                                    <td className="border-r-2 border-black p-2 text-right font-medium">
                                        {(item.quantity * item.unitPrice).toFixed(2)}
                                    </td>
                                    <td className="border-r-2 border-black p-2 text-right font-medium">
                                        {item.taxAmount.toFixed(2)}
                                    </td>
                                    <td className="p-2 text-right font-medium">
                                        {item.total.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                            {/* Empty rows to fill space matching the image */}
                            {[...Array(Math.max(0, 10 - items.length))].map((_, i) => (
                                <tr key={`empty-${i}`} className={(items.length + i) % 2 === 0 ? "bg-[#e2efd9] h-8" : "bg-white h-8"}>
                                    <td className="border-r-2 border-black p-2"></td>
                                    <td className="border-r-2 border-black p-2"></td>
                                    <td className="border-r-2 border-black p-2"></td>
                                    <td className="border-r-2 border-black p-2 text-right">-</td>
                                    <td className="border-r-2 border-black p-2 text-right">-</td>
                                    <td className="p-2 text-right">-</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex flex-col items-end gap-2 mb-8">
                        {!invoiceId && (
                            <button onClick={addItem} className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-1 print:hidden">
                                <Plus size={10} /> Add Line
                            </button>
                        )}
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold">Payment within 7 days.</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold">Total Payable</span>
                                <div className="border-2 border-black px-4 py-2 min-w-[120px] text-center font-bold text-lg">
                                    {grandTotal.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center space-y-2 mt-12">
                        <p className="text-[10px] italic font-medium">please issue cheque in favour of <span className="font-bold">"CITILINE ADVERTISING"</span> only.</p>
                        <p className="text-xs font-bold">Bank Al Falah A/C No. 5504 5000 284450</p>
                    </div>

                    <div className="mt-20 flex flex-col items-end mr-10 relative">
                        <div className="text-center">
                            <p className="text-lg font-bold">for Citiline Advertising</p>
                        </div>
                        {/* QR Code repositioned to be visible but not obstructive */}
                        {fbrData && (
                            <div className="absolute top-[-100px] left-0 text-center">
                                <img 
                                    src={`https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=${encodeURIComponent(fbrData.qrData)}&choe=UTF-8`}
                                    alt="FBR QR"
                                    className="w-20 h-20 mx-auto border border-zinc-200"
                                />
                                <p className="text-[7px] font-bold font-mono mt-1">IRN: {fbrData.irn}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
