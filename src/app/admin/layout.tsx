"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    FileText,
    BarChart3,
    Settings,
    LogOut,
    Bell,
    Search,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight,
    CreditCard,
    Zap,
    Menu,
    X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const sidebarLinks = [
    { name: "Overview", icon: LayoutDashboard, href: "/admin" },
    { name: "CRM / Customers", icon: Users, href: "/admin/customers" },
    { name: "Invoicing (FBR)", icon: FileText, href: "/admin/invoices" },
    { name: "Ledgers", icon: BarChart3, href: "/admin/ledger" },
    { name: "Intelligence", icon: BarChart3, href: "/admin/reports" },
    { name: "Config", icon: Settings, href: "/admin/settings" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [mounted, setMounted] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Close menu on route change
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const SidebarContent = () => (
        <>
            <div className="flex items-center gap-3 mb-12 px-2">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                    <Zap className="text-white w-6 h-6" fill="currentColor" />
                </div>
                <div>
                    <h1 className="font-black tracking-tighter text-xl uppercase leading-none">CITILINE</h1>
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-accent">Control Panel</span>
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
                                    layoutId="sidebar-active"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-6 border-t border-white/5">
                <button className="flex items-center gap-4 px-4 py-3 w-full text-muted-foreground hover:text-red-400 transition-colors">
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Terminate Session</span>
                </button>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-72 border-r border-white/5 bg-black/40 backdrop-blur-xl flex-col p-6">
                <SidebarContent />
            </aside>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-[60] w-80 bg-zinc-950 border-r border-white/5 p-6 flex flex-col lg:hidden shadow-2xl"
                        >
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="absolute right-6 top-7 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"
                            >
                                <X size={20} />
                            </button>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className="h-20 border-b border-white/5 lg:px-8 px-4 flex items-center justify-between bg-black/20 backdrop-blur-md z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="hidden md:flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/5 lg:w-96">
                            <Search size={18} className="text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search orders, customers..."
                                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-600"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-6">
                        <button className="relative w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white/10 transition-colors group">
                            <Bell size={18} className="group-hover:text-accent" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-[#050505]" />
                        </button>
                        <div className="flex items-center gap-3 lg:pl-4 lg:border-l border-white/10">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold uppercase">Administrator</p>
                                <p className="text-[10px] text-accent font-black tracking-widest uppercase opacity-80">Full Access</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/20 overflow-hidden relative">
                                <Image
                                    src="https://ui-avatars.com/api/?name=Admin&background=00BCD4&color=fff"
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Scroll Area */}
                <div className="flex-1 overflow-y-auto lg:p-8 p-4 pt-10 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
