"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    FileText,
    CreditCard,
    History,
    Settings,
    LogOut,
    Bell,
    Download,
    Zap
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const sidebarLinks = [
    { name: "My Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Statements", icon: FileText, href: "/dashboard/statements" },
    { name: "Invoices", icon: CreditCard, href: "/dashboard/invoices" },
    { name: "History", icon: History, href: "/dashboard/history" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col p-6">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                        <Zap className="text-white w-6 h-6" fill="currentColor" />
                    </div>
                    <div>
                        <h1 className="font-black tracking-tighter text-xl uppercase leading-none">CITILINE</h1>
                        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-accent">Client Hub</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const active = mounted && pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                                    active
                                        ? "bg-accent/10 text-accent font-bold"
                                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <Icon size={20} className={cn("transition-colors", active ? "text-accent" : "group-hover:text-accent")} />
                                <span className="text-sm tracking-wide">{link.name}</span>
                                {active && (
                                    <motion.div
                                        layoutId="sidebar-active-user"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 mb-6">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Current Balance</p>
                    <p className="text-xl font-black text-accent tracking-tighter">PKR 42,500 <span className="text-[10px] font-bold text-muted-foreground ml-1 uppercase">Debit</span></p>
                </div>

                <div className="pt-6 border-t border-white/5">
                    <button className="flex items-center gap-4 px-4 py-3 w-full text-muted-foreground hover:text-red-400 transition-colors">
                        <LogOut size={20} />
                        <span className="text-sm font-medium">Safe Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Welcome back, <span className="text-white">Global Solutions</span></h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white/10 transition-colors group">
                            <Bell size={18} className="group-hover:text-accent" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-[#050505]" />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/20 overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=Global+Solutions&background=00BCD4&color=fff" alt="Avatar" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Scroll Area */}
                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
