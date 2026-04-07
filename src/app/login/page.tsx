"use client";

import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md relative z-10"
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
                            Secure <span className="text-accent italic">Access</span>
                        </h1>
                        <p className="text-muted-foreground text-sm font-medium mt-2 uppercase tracking-widest text-[10px]">Staff & Client Gateway</p>
                    </div>

                    <form className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4">Credentials</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-accent/50 transition-all font-medium placeholder:text-zinc-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4">Secret</label>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-accent/50 transition-all font-medium placeholder:text-zinc-600"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 accent-accent" />
                                <span className="text-xs font-bold text-muted-foreground group-hover:text-white transition-colors">Remember Session</span>
                            </label>
                            <button type="button" className="text-xs font-bold text-accent hover:opacity-70 transition-opacity">Reset Key</button>
                        </div>

                        <button className="w-full py-5 bg-accent text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                            Authenticate <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Secured by Citiline Engineering</p>
                        <div className="flex items-center justify-center gap-2 text-accent">
                            <Zap size={12} fill="currentColor" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Enterprise Shield Active</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/" className="text-xs font-bold text-muted-foreground hover:text-white transition-colors">
                        ← Documented Home
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
