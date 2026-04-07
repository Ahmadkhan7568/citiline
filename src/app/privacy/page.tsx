"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function PrivacyPage() {
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
                            Privacy <span className="text-gradient italic">Policy</span>
                        </h1>
                        <p className="text-muted-foreground mb-12">Last Updated: April 7, 2026</p>
                    </motion.div>

                    <div className="prose prose-invert max-w-none flex flex-col gap-10 text-lg text-zinc-400">
                        <section>
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-4">1. Data Collection</h2>
                            <p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or communicate with us through our contact forms.</p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-4">2. Use of Information</h2>
                            <p>The information we collect is used to provide, maintain, and improve our services, as well as to communicate with you about updates and marketing offers.</p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-4">3. Data Security</h2>
                            <p>We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
                        </section>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
