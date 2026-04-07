"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cpu, Zap, Shield, Microscope } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const techStats = [
    { label: "Color Accuracy", value: "99.9%" },
    { label: "Resolution", value: "2400 DPI" },
    { label: "Production Speed", value: "15,000 SPH" },
];

export default function Technology() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".tech-bar", {
                width: 0,
                duration: 1.5,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                },
            });

            gsap.from(".tech-card", {
                y: 30,
                opacity: 0,
                stagger: 0.2,
                duration: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="technology" className="py-32 px-6 bg-black relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col mb-20 text-center items-center">
                    <span className="text-accent font-black tracking-[0.5em] uppercase text-sm mb-4">Precision Infrastructure</span>
                    <h2 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                        Industrial <span className="text-gradient italic">Scale</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-12">
                        <div className="tech-card">
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="text-2xl font-black uppercase tracking-tighter">High-Volume Production</h3>
                                <span className="text-accent font-mono text-sm">Industrial Precision</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="tech-bar h-full bg-accent" style={{ width: "95%" }} />
                            </div>
                            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                                Large-scale manufacturing capabilities for mass-market advertising and corporate assets. Delivering consistency at any scale.
                            </p>
                        </div>

                        <div className="tech-card">
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="text-2xl font-black uppercase tracking-tighter">Specialized Solutions</h3>
                                <span className="text-accent font-mono text-sm">Bespoke Quality</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="tech-bar h-full bg-accent" style={{ width: "92%" }} />
                            </div>
                            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                                Advanced production techniques for high-end boutique projects, ensuring every detail reflects your brand's unique identity.
                            </p>
                        </div>
                    </div>

                    <div className="relative aspect-square grid grid-cols-2 gap-4">
                        <div className="tech-card glass-card rounded-3xl p-8 flex flex-col justify-between border border-white/5">
                            <div className="p-3 bg-accent/10 rounded-xl w-fit">
                                <Zap className="text-accent w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-3xl font-black italic uppercase">Speed</div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Rapid Fulfillment</div>
                            </div>
                        </div>
                        <div className="tech-card glass-card rounded-3xl p-8 flex flex-col justify-between border border-white/5 mt-8">
                            <div className="p-3 bg-accent/10 rounded-xl w-fit">
                                <Shield className="text-accent w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-3xl font-black italic uppercase">Quality</div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Rigorous Checks</div>
                            </div>
                        </div>
                        <div className="tech-card glass-card rounded-3xl p-8 flex flex-col justify-between border border-white/5 -mt-8">
                            <div className="p-3 bg-accent/10 rounded-xl w-fit">
                                <Microscope className="text-accent w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-3xl font-black italic uppercase">Detail</div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Micro-Precision</div>
                            </div>
                        </div>
                        <div className="tech-card glass-card rounded-3xl p-8 flex flex-col justify-between border border-white/5">
                            <div className="p-3 bg-accent/10 rounded-xl w-fit">
                                <Cpu className="text-accent w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-3xl font-black italic uppercase">System</div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Integrated Workflow</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
