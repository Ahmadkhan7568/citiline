"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Send, FileText, Clock, BarChart, Settings } from "lucide-react";

export default function QuotePage() {
    return (
        <main className="bg-black min-h-screen text-white">
            <Navbar />
            <section className="pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-20"
                    >
                        <span className="text-accent font-black tracking-[0.5em] uppercase text-sm mb-4 block">Project Initiation</span>
                        <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-12">
                            Get a <span className="text-gradient italic">Quote</span>
                        </h1>
                        <p className="text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
                            Provide your project specifications below, and our production team will prepare a detailed industrial-grade estimation.
                        </p>
                    </motion.div>

                    <div className="glass-card p-8 md:p-16 rounded-[3rem] border border-white/5">
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Contact Details Section */}
                            <div className="space-y-8">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <FileText className="text-accent w-6 h-6" />
                                    Company Information
                                </h2>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contact Person</label>
                                        <input type="text" className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-accent transition-colors text-white" placeholder="Name" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Official Email</label>
                                        <input type="email" className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-accent transition-colors text-white" placeholder="corp@company.com" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone Number</label>
                                        <input type="tel" className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-accent transition-colors text-white" placeholder="+92 000 0000000" />
                                    </div>
                                </div>
                            </div>

                            {/* Project Specs Section */}
                            <div className="space-y-8">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <Settings className="text-accent w-6 h-6" />
                                    Project Scope
                                </h2>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Service Required</label>
                                        <select className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-accent transition-colors text-white appearance-none [&>option]:bg-zinc-900">
                                            <option className="bg-zinc-900">Large Format Printing</option>
                                            <option className="bg-zinc-900">Corporate Stationery</option>
                                            <option className="bg-zinc-900">Digital Marketing</option>
                                            <option className="bg-zinc-900">Event Production</option>
                                            <option className="bg-zinc-900">Indoor/Outdoor Signage</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Production Volume</label>
                                        <input type="text" className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-accent transition-colors text-white" placeholder="e.g. 500 units" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Timeline Expectations</label>
                                        <select className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-accent transition-colors text-white appearance-none [&>option]:bg-zinc-900">
                                            <option className="bg-zinc-900">Urgent (48 Hours)</option>
                                            <option className="bg-zinc-900">Standard (1-2 Weeks)</option>
                                            <option className="bg-zinc-900">Extended (1 Month+)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="md:col-span-2 space-y-8 pt-8 border-t border-white/5">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <BarChart className="text-accent w-6 h-6" />
                                    Additional Specifications
                                </h2>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Technical Details / Materials</label>
                                    <textarea rows={6} className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-accent transition-colors text-white resize-none" placeholder="Dimensions, material types, finishing requirements..." />
                                </div>
                                <div className="flex flex-col md:flex-row gap-8 items-center justify-between pt-8">
                                    <p className="text-muted-foreground text-sm max-w-md italic">
                                        By submitting this request, you agree to our terms of production and data privacy policies.
                                    </p>
                                    <button className="w-full md:w-auto px-16 py-6 bg-accent text-white rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-accent/20">
                                        Submit Quote Request <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
