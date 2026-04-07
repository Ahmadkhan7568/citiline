"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function BackgroundElements() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Floating blobs
            gsap.to(".bg-blob", {
                x: "random(-100, 100)",
                y: "random(-100, 100)",
                duration: "random(10, 20)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: {
                    each: 2,
                    from: "random",
                },
            });

            // Rotating tech lines
            gsap.to(".bg-line", {
                rotation: 360,
                duration: 100,
                repeat: -1,
                ease: "none",
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Mesh Gradients */}
            <div className="bg-blob absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-accent/10 blur-[150px] rounded-full" />
            <div className="bg-blob absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/5 blur-[120px] rounded-full" />
            <div className="bg-blob absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-accent/5 blur-[100px] rounded-full" />

            {/* Creative Technical Elements */}
            <svg className="bg-line absolute top-20 left-20 w-96 h-96 opacity-10 stroke-white/20" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" strokeDasharray="1 4" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="30" fill="none" strokeWidth="0.2" />
                <line x1="0" y1="50" x2="100" y2="50" strokeWidth="0.1" />
                <line x1="50" y1="0" x2="50" y2="100" strokeWidth="0.1" />
            </svg>

            <svg className="bg-line absolute bottom-20 right-20 w-[30rem] h-[30rem] opacity-[0.03] stroke-white" viewBox="0 0 100 100">
                <rect x="10" y="10" width="80" height="80" fill="none" strokeWidth="0.1" />
                <path d="M 0,50 L 100,50 M 50,0 L 50,100" strokeWidth="0.05" />
                <circle cx="50" cy="50" r="45" fill="none" strokeWidth="0.05" />
            </svg>

            {/* Section Indicators / Margins */}
            <div className="absolute top-0 left-12 h-full w-px bg-white/5" />
            <div className="absolute top-0 right-12 h-full w-px bg-white/5" />
        </div>
    );
}
