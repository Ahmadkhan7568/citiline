"use client";

import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight, Building2, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="glass-card rounded-[3rem] p-10 md:p-12 border border-white/5 shadow-2xl shadow-accent/5 backdrop-blur-2xl">
                    <div className="flex flex-col items-center mb-10">
                        <Link href="/" className="mb-8">
                            <Image
                                src="/logo.png"
                                alt="Citiline Logo"
                                width={240}
                                height={60}
                                className="h-12 w-auto object-contain"
                            />
                        </Link>
                        <h1 className="text-3xl font-black tracking-tighter uppercase text-center leading-none">
                            Client <span className="text-accent italic">Registration</span>
                        </h1>
                        <p className="text-muted-foreground text-sm font-medium mt-2 uppercase tracking-widest text-[10px]">Create your secure billing account</p>
                    </div>

                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-accent/50 transition-all font-medium placeholder:text-zinc-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4">Company Name</label>
                            <div className="relative group">
                                <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Agency Ltd."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-accent/50 transition-all font-medium placeholder:text-zinc-600"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4">Official Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                                <input
                                    type="email"
                                    placeholder="corp@example.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-accent/50 transition-all font-medium placeholder:text-zinc-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4">Credentials</label>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-accent/50 transition-all font-medium placeholder:text-zinc-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4">Confirm</label>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                                <input
                                    type="password"
                                    placeholder="Repeat"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-accent/50 transition-all font-medium placeholder:text-zinc-600"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <button className="w-full py-5 bg-accent text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                                Create Brand Account <ArrowRight size={18} />
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs font-bold text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="text-accent underline underline-offset-4 hover:text-white transition-colors">
                                Access Gateway
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
