"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Zap,
    Layers,
    Calendar,
    Camera,
    Megaphone,
    Palette,
    LineChart,
    BookOpen
} from "lucide-react";

const iconMap = {
    Zap,
    Layers,
    Calendar,
    Camera,
    Megaphone,
    Palette,
    LineChart,
    BookOpen
};

gsap.registerPlugin(ScrollTrigger);

import { services } from "@/constants/services";
import Link from "next/link";

export default function Services() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils.toArray<HTMLElement>(".service-card").forEach((card) => {
                gsap.from(card, {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                });
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="services" className="py-32 px-6 bg-zinc-950 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div>
                        <span className="text-accent font-black tracking-[0.5em] uppercase text-sm mb-4 block">Our Expertise</span>
                        <h2 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8]">
                            Capabili<span className="text-gradient italic text-glow">ties</span>
                        </h2>
                    </div>
                    <div className="text-right">
                        <span className="text-white/20 text-8xl font-black leading-none">/ 01</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <Link key={index} href={`/services/${service.slug}`} className="service-card group glass-card p-10 rounded-[2.5rem] border border-white/5 hover:border-accent/30 transition-all duration-500 flex flex-col cursor-pointer">
                            <div className="mb-10 p-4 bg-white/5 rounded-2xl w-fit group-hover:bg-accent/20 transition-colors">
                                {(() => {
                                    const Icon = iconMap[service.iconName as keyof typeof iconMap] || Zap;
                                    return <Icon className="w-8 h-8 text-accent" />;
                                })()}
                            </div>

                            <h3 className="text-3xl font-black mb-6 uppercase tracking-tighter group-hover:text-accent transition-colors leading-tight">
                                {service.title}
                            </h3>

                            <p className="text-muted-foreground mb-10 leading-relaxed font-medium">
                                {service.shortDesc}
                            </p>

                            <div className="mt-auto pt-6 flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-accent transition-colors">
                                Learn More
                                <div className="h-px w-8 bg-white/10 group-hover:bg-accent group-hover:w-16 transition-all duration-700" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
