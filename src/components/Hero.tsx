"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        // Letter-by-letter reveal for CITILINE
        tl.fromTo(
            ".char",
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, stagger: 0.05, delay: 0.5 }
        )
            .fromTo(
                ".hero-sub, .hero-adv",
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.1 },
                "-=0.8"
            )
            .fromTo(
                ".hero-cta",
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)" },
                "-=0.5"
            );

        // Parallax background
        gsap.to(".hero-bg-visual", {
            yPercent: 30,
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            }
        });

    }, []);

    const splitText = (text: string) => {
        return text.split("").map((char, i) => (
            <span key={i} className="char inline-block whitespace-pre">
                {char}
            </span>
        ));
    };

    return (
        <section
            ref={containerRef}
            className="relative min-h-[95vh] flex flex-col items-center justify-center pt-24 px-6 overflow-hidden bg-black"
        >
            {/* Killer Background Visual */}
            <div className="hero-bg-visual absolute inset-0 opacity-20 pointer-events-none scale-110">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--accent)_0%,_transparent_70%)] opacity-30" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>

            <div className="relative z-10 max-w-7xl text-center">
                <div className="inline-block px-6 py-2 rounded-full border border-accent/30 bg-accent/5 backdrop-blur-xl text-sm font-black tracking-[0.3em] uppercase mb-12 animate-fade-in text-white/80">
                    Uncompromising Quality • Global Standards
                </div>

                <h1
                    ref={titleRef}
                    className="text-4xl sm:text-6xl lg:text-[10vw] font-black tracking-tight leading-[0.9] mb-8 sm:mb-12 flex flex-col items-center"
                >
                    <div className="overflow-hidden flex">
                        {splitText("CITILINE")}
                    </div>
                    <div className="hero-adv overflow-hidden text-gradient italic mt-2">
                        ADVERTISING
                    </div>

                    <div className="text-lg sm:text-2xl md:text-4xl lg:text-6xl font-light tracking-[0.1em] sm:tracking-[0.2em] md:tracking-[0.4em] text-muted-foreground mt-6 sm:mt-8 flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-8 uppercase">
                        <span className="hero-sub opacity-60">Printing</span>
                        <span className="w-1.5 h-1.5 bg-accent rounded-full hidden sm:block" />
                        <span className="hero-sub text-white font-black">Events</span>
                        <span className="w-1.5 h-1.5 bg-accent rounded-full hidden sm:block" />
                        <span className="hero-sub opacity-60">Agency</span>
                    </div>
                </h1>

                <p className="hero-sub text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-16 font-medium leading-relaxed opacity-0">
                    We operate at the intersection of large-scale advertising, industrial-grade printing, and seamless corporate event production. High-precision execution for global brands.
                </p>

                <div className="hero-cta flex flex-col sm:flex-row gap-6 items-center justify-center opacity-0">
                    <button className="group relative px-12 py-6 bg-accent text-white rounded-full font-black text-xl overflow-hidden shadow-2xl shadow-accent/40 transition-all active:scale-95">
                        <span className="relative z-10">Start Project</span>
                        <div className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>
                    <button className="px-10 py-6 glass border-white/20 text-foreground rounded-full font-bold text-xl hover:bg-white/10 transition-all duration-300 active:scale-95">
                        Our Portfolio
                    </button>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-12 left-12 flex flex-col gap-4 items-start opacity-30 hidden md:flex">
                <div className="w-40 h-px bg-white/20" />
                <span className="text-[10px] font-bold tracking-[1em] uppercase text-accent">Advertising • Printing • Events</span>
            </div>
        </section>
    );
}
