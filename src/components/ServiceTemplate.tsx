"use client";

import { useEffect, useRef } from "react";
import { services } from "@/constants/services";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

interface ServiceTemplateProps {
    slug: string;
}

export default function ServiceTemplate({ slug }: ServiceTemplateProps) {
    const service = services.find((s) => s.slug === slug);
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!service) return;

        const ctx = gsap.context(() => {
            gsap.from(".service-title", {
                y: 100,
                opacity: 0,
                duration: 1.5,
                ease: "expo.out",
            });

            gsap.from(".service-hero-img", {
                scale: 1.2,
                opacity: 0,
                duration: 2,
                ease: "expo.out",
            });

            gsap.from(".feature-card", {
                y: 50,
                opacity: 0,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: ".features-section",
                    start: "top 80%",
                },
            });

            gsap.to(".bg-floating-text", {
                xPercent: -20,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, [service]);

    if (!service) {
        return notFound();
    }

    return (
        <main ref={containerRef} className="bg-black min-h-screen text-white overflow-hidden">
            <Navbar />

            {/* Hero Section */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 px-6">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="service-hero-img object-cover opacity-40 mix-blend-luminosity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <span className="text-accent font-black tracking-[1em] uppercase text-sm mb-8 block opacity-80 animate-fade-in">
                        Capabilities / {service.slug.replace("-", " ")}
                    </span>
                    <h1 className="service-title text-5xl sm:text-7xl md:text-[12vw] font-black tracking-tighter leading-none mb-12 uppercase">
                        {service.title.split(" ").map((word, i) => (
                            <span key={i} className={i % 2 === 1 ? "text-gradient italic block" : "block"}>
                                {word}
                            </span>
                        ))}
                    </h1>
                    <p className="text-xl md:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
                        {service.shortDesc}
                    </p>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
                    <ArrowRight className="rotate-90 w-10 h-10" />
                </div>
            </section>

            {/* Deep Dive Section */}
            <section className="py-32 px-6 relative">
                <div className="bg-floating-text absolute top-1/2 left-0 text-[30vw] font-black text-white/[0.02] whitespace-nowrap pointer-events-none uppercase">
                    {service.title} • {service.title} • {service.title}
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-tight">
                            Industrial Grade <br />
                            <span className="text-accent italic">Excellence.</span>
                        </h2>
                        <p className="text-xl text-muted-foreground leading-relaxed mb-12">
                            {service.longDesc}
                        </p>
                    </div>

                    <div className="features-section grid grid-cols-1 md:grid-cols-2 gap-6">
                        {service.features.map((feature, idx) => (
                            <div key={idx} className="feature-card glass-card p-10 rounded-[2rem] border border-white/5 hover:border-accent/30 transition-colors group">
                                <CheckCircle2 className="w-10 h-10 text-accent mb-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">{feature}</h3>
                                <div className="h-0.5 w-12 bg-accent/20 group-hover:w-full transition-all duration-700" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Related / Next Service CTA */}
            <section className="py-20 px-6 border-y border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div>
                        <h4 className="text-accent font-bold uppercase tracking-widest text-sm mb-4">Next Step</h4>
                        <h3 className="text-4xl font-black uppercase tracking-tighter">Ready to start a project?</h3>
                    </div>
                    <Link href="/contact" className="group flex items-center gap-6 px-10 py-6 bg-accent text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all">
                        Contact General Inquiry
                        <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
