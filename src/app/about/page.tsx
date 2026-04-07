"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function AboutPage() {
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
                        <span className="text-accent font-black tracking-[0.5em] uppercase text-sm mb-4 block">The Agency</span>
                        <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-12">
                            Our <span className="text-gradient italic">Story</span>
                        </h1>
                        <p className="text-xl md:text-3xl text-muted-foreground max-w-4xl leading-relaxed font-medium">
                            Citiline is a multi-disciplinary agency where creativity meets industrial precision.
                            We don't just build brands; we engineer experiences that define industries.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start mb-32">
                        <div className="aspect-[4/5] bg-zinc-900 rounded-[3rem] overflow-hidden relative">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069')] bg-cover bg-center mix-blend-luminosity opacity-50" />
                        </div>
                        <div className="flex flex-col gap-12">
                            <div>
                                <h2 className="text-4xl font-bold tracking-tighter uppercase mb-6">Our Mission</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    To provide uncompromising quality in advertising, printing, and event management.
                                    We believe that every touchpoint a customer has with your brand should be a masterpiece of design and execution.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-4xl font-bold tracking-tighter uppercase mb-6">Our Vision</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    To be the global benchmark for creative production, where technology and human artistry
                                    collaborate to create the future of brand communication.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/5">
                                <div>
                                    <span className="text-5xl font-black text-accent block mb-2">10+</span>
                                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Years Excellence</span>
                                </div>
                                <div>
                                    <span className="text-5xl font-black text-accent block mb-2">500+</span>
                                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Projects Delivered</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
