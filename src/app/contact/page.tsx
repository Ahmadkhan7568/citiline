"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
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
                        <span className="text-accent font-black tracking-[0.5em] uppercase text-sm mb-4 block">Get in Touch</span>
                        <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-12">
                            Let's <span className="text-gradient italic">Connect</span>
                        </h1>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        <div>
                            <p className="text-2xl text-muted-foreground mb-12 max-w-lg font-medium leading-relaxed">
                                Whether you have a specific project in mind or just want to explore the possibilities,
                                we're here to talk.
                            </p>

                            <div className="flex flex-col gap-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-accent/50 transition-colors">
                                        <Mail className="text-accent w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1">Email Us</span>
                                        <a href="mailto:hello@citiline.agency" className="text-xl font-bold hover:text-accent transition-colors">hello@citiline.agency</a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-accent/50 transition-colors">
                                        <Phone className="text-accent w-6 h-6" />
                                    </div>
                                    <div>
                                        <a href="tel:0512605859" className="text-xl font-bold hover:text-accent transition-colors block">051-2605859</a>
                                        <a href="tel:03215173980" className="text-xl font-bold hover:text-accent transition-colors block">0321-5173980</a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-accent/50 transition-colors">
                                        <MapPin className="text-accent w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1">Visit Us</span>
                                        <p className="text-xl font-bold leading-tight">
                                            Office No. 10/B, Black Horse Plaza, <br />
                                            Fazal-e Haq Road, Blue Area, Islamabad
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-12 rounded-[3rem] border border-white/5">
                            <form className="flex flex-col gap-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                                        <input type="text" className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-accent transition-colors text-white" placeholder="John Doe" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                                        <input type="email" className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-accent transition-colors text-white" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Service Interested In</label>
                                    <select className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-accent transition-colors text-white appearance-none [&>option]:bg-zinc-900">
                                        <option className="bg-zinc-900">Brand Storytelling</option>
                                        <option className="bg-zinc-900">Premium Printing</option>
                                        <option className="bg-zinc-900">Digital Growth</option>
                                        <option className="bg-zinc-900">Other</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Project Details</label>
                                    <textarea rows={4} className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-accent transition-colors text-white resize-none" placeholder="Tell us about your venture..." />
                                </div>
                                <button className="px-10 py-6 bg-accent text-white rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-all flex items-center justify-center gap-3">
                                    Send Message <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
