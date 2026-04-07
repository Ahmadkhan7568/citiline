"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, PenTool, Printer, CheckCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        title: "Insight",
        desc: "We analyze your brand needs and audience behavior to define the perfect strategy.",
        icon: <Search className="w-10 h-10" />,
    },
    {
        title: "Blueprint",
        desc: "Creative concepts and technical specs come together in a production-ready design.",
        icon: <PenTool className="w-10 h-10" />,
    },
    {
        title: "Production",
        desc: "Utilizing world-class machinery for vibrant advertising and sharp precision prints.",
        icon: <Printer className="w-10 h-10" />,
    },
    {
        title: "Delivery",
        desc: "Rigorous quality checks ensure the final product exceeds your creative expectations.",
        icon: <CheckCircle className="w-10 h-10" />,
    },
];

export default function Process() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".step-item", {
                opacity: 0,
                x: -50,
                stagger: 0.2,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                },
            });

            // Animated line connecting steps
            gsap.fromTo(".progress-line",
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 2,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 60%",
                        end: "bottom 80%",
                        scrub: 1,
                    }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="how-we-work" className="py-32 px-6 bg-black relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-24">
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter uppercase mb-6 italic text-gradient">How We Work</h2>
                    <p className="text-muted-foreground text-xl max-w-2xl mx-auto">From the first spark of an idea to the final high-speed print run.</p>
                </div>

                <div className="relative">
                    {/* Progress Line */}
                    <div className="hidden lg:block absolute top-16 left-0 w-full h-px bg-white/10 origin-left">
                        <div className="progress-line w-full h-full bg-accent origin-left" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                        {steps.map((step, i) => (
                            <div key={i} className="step-item flex flex-col items-center text-center group">
                                <div className="w-32 h-32 rounded-full glass border-white/10 flex items-center justify-center mb-8 bg-zinc-900 group-hover:bg-accent group-hover:scale-110 transition-all duration-500 relative z-20">
                                    <div className="text-foreground group-hover:text-white transition-colors">
                                        {step.icon}
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg border-4 border-black">
                                        {i + 1}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold mb-4 uppercase tracking-wider">{step.title}</h3>
                                <p className="text-muted-foreground leading-relaxed px-4">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Background text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/5 pointer-events-none select-none uppercase">
                Process
            </div>
        </section>
    );
}
