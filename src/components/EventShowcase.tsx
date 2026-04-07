"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const events = [
    {
        name: "Corporate Summit",
        detail: "Global Leadership Conferences",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=2070",
    },
    {
        name: "Real Estate Launch",
        detail: "Property Unveiling & Sales Events",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2073",
    },
    {
        name: "Tech Exhibition",
        detail: "Innovation Showcases & Booth Design",
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2070",
    },
    {
        name: "Executive Gala",
        detail: "VIP Dinners & Awards Ceremonies",
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=2074",
    },
];

export default function EventShowcase() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".event-panel", {
                scale: 0.9,
                opacity: 0,
                y: 50,
                stagger: 0.2,
                duration: 1.5,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                },
            });

            gsap.to(".event-img", {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="event-production" className="py-32 px-6 bg-zinc-950 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col mb-20">
                    <span className="text-accent font-black tracking-[0.5em] uppercase text-sm mb-4">Event Management</span>
                    <h2 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                        Exceptional <span className="text-gradient italic">Production</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {events.map((event, index) => (
                        <div key={index} className="event-panel group relative aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-muted border border-white/5">
                            <Image
                                src={event.image}
                                alt={event.name}
                                fill
                                className="event-img object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 scale-110 group-hover:scale-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                            <div className="absolute inset-0 p-10 flex flex-col justify-end">
                                <h3 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tighter">{event.name}</h3>
                                <p className="text-accent font-bold text-sm tracking-widest uppercase">{event.detail}</p>

                                <div className="h-px w-0 group-hover:w-full bg-accent mt-6 transition-all duration-700" />
                            </div>

                            <div className="absolute top-8 right-8 w-20 h-20 rounded-full border border-white/20 flex flex-col items-center justify-center glass backdrop-blur-md scale-0 group-hover:scale-100 transition-transform duration-500">
                                <span className="text-[8px] font-bold tracking-widest text-accent uppercase">Live</span>
                                <span className="text-xl font-black text-white italic">EXEC</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
