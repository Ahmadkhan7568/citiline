"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function TermsPage() {
    return (
        <main className="bg-black min-h-screen text-white">
            <Navbar />
            <section className="pt-40 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-20"
                    >
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-8">
                            Terms of <span className="text-gradient italic">Service</span>
                        </h1>
                        <p className="text-muted-foreground mb-12">Last Updated: April 7, 2026</p>
                    </motion.div>

                    <div className="prose prose-invert max-w-none flex flex-col gap-10 text-lg text-zinc-400">
                        <section>
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-4">1. Acceptance of Terms</h2>
                            <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-4">2. Intellectual Property</h2>
                            <p>All content included on this site, such as text, graphics, logos, and images, is the property of Citiline Agency and protected by international copyright laws.</p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-4">3. Limitation of Liability</h2>
                            <p>Citiline Agency shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services.</p>
                        </section>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
