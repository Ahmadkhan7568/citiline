"use client";

import { Camera, Layers, Zap, Printer, Layout, Component, Share2, Palette } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/#services" },
    { name: "Products", href: "/#what-we-print" },
    { name: "Get a Quote", href: "/quote" },
    { name: "Contact", href: "/contact" },
];

export default function Footer() {
    return (
        <footer id="contact" className="bg-zinc-950 pt-32 pb-10 px-6 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
                    <div>
                        <div className="mb-12 flex justify-center">
                            <Image
                                src="/logo.png"
                                alt="Citiline Logo Watermark"
                                width={600}
                                height={150}
                                className="w-full max-w-[600px] h-auto object-contain"
                            />
                        </div>
                        <div className="text-center">
                            <h2 className="text-3xl md:text-6xl font-black tracking-tighter leading-none mb-12 uppercase">
                                Let's Create <br />
                                <span className="text-gradient italic">Excellence</span>
                            </h2>
                            <div className="hero-cta flex flex-wrap items-center justify-center gap-12 mb-20">
                                <a href="mailto:hello@citiline.agency" className="text-3xl md:text-5xl font-light hover:text-accent transition-colors underline underline-offset-8 decoration-1 decoration-white/20 hover:decoration-accent">
                                    hello@citiline.agency
                                </a>
                            </div>
                        </div>
                        <p className="text-muted-foreground text-lg mb-2">Office No. 10/B, Black Horse Plaza, Fazal-e Haq Road, Blue Area, Islamabad</p>
                        <p className="text-muted-foreground text-lg">Tel: 051-2605859, 0321-5173980</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-12 pt-8 lg:pt-0">
                        <div className="flex flex-col gap-6">
                            <span className="text-xs font-bold uppercase tracking-widest text-accent">Navigation</span>
                            {navLinks.map(link => (
                                <Link key={link.name} href={link.href} className="text-lg hover:text-accent transition-colors font-medium">
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        <div className="flex flex-col gap-6">
                            <span className="text-xs font-bold uppercase tracking-widest text-accent">Services</span>
                            <Link href="/services/premium-printing" className="text-lg hover:text-accent transition-colors font-medium">Premium Printing</Link>
                            <Link href="/services/digital-growth" className="text-lg hover:text-accent transition-colors font-medium">Digital Growth</Link>
                            <Link href="/services/advertisements" className="text-lg hover:text-accent transition-colors font-medium">Advertisements</Link>
                            <Link href="/services/brand-storytelling" className="text-lg hover:text-accent transition-colors font-medium">Branding</Link>
                        </div>
                        <div className="flex flex-col gap-6">
                            <span className="text-xs font-bold uppercase tracking-widest text-accent">Socials</span>
                            <a href="#" className="text-lg hover:text-accent transition-colors">Instagram</a>
                            <a href="#" className="text-lg hover:text-accent transition-colors">LinkedIn</a>
                            <a href="#" className="text-lg hover:text-accent transition-colors">Behance</a>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center py-10 border-t border-white/5 gap-8">
                    <div className="flex items-center">
                        <Image
                            src="/logo.png"
                            alt="Citiline Logo"
                            width={320}
                            height={80}
                            className="h-24 w-auto object-contain transition-opacity"
                        />
                    </div>
                    <div className="flex gap-12 text-xs font-bold tracking-widest uppercase text-muted-foreground">
                        <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link>
                        <span className="text-white">© 2026 Citiline Agency</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
