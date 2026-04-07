"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const products = [
    {
        title: "Large Format",
        category: "Banners & Billboards",
        image: "/print/billboard.webp",
        size: "col-span-2 row-span-2",
    },
    {
        title: "Digital Print",
        category: "Books & Magazines",
        image: "/print/print.webp",
        size: "col-span-1 row-span-1",
    },
    {
        title: "Corporate",
        category: "Stationery & Cards",
        image: "/print/stationary.webp",
        size: "col-span-1 row-span-1",
    },
    {
        title: "Packaging",
        category: "Custom Boxes",
        image: "/print/customboxes.webp",
        size: "col-span-2 row-span-1",
    },
    {
        title: "Retail Signage",
        category: "Point of Sale",
        image: "/print/retail%20signage.webp",
        size: "col-span-1 row-span-1",
    },
    {
        title: "Bespoke Stationery",
        category: "Luxury Finishing",
        image: "/print/custom.webp",
        size: "col-span-1 row-span-1",
    },
    {
        title: "Promotional",
        category: "Brand Merchandise",
        image: "/print/brand.webp",
        size: "col-span-2 row-span-1",
    },
];

export default function PrintProducts() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".product-card", {
                y: 100,
                opacity: 0,
                stagger: 0.1,
                duration: 1.2,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                },
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="what-we-print" className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <div>
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-4 uppercase">What We Print</h2>
                        <div className="w-48 h-1 bg-accent" />
                    </div>
                    <p className="text-muted-foreground max-w-sm mt-8 md:mt-0 text-lg">
                        From massive outdoor displays to delicate corporate stationery. Precision is our signature.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                    {products.map((product, index) => (
                        <div
                            key={index}
                            className={`product-card group relative overflow-hidden rounded-3xl bg-muted ${product.size}`}
                        >
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110 opacity-60 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-6 left-8 p-4">
                                <span className="text-xs font-bold tracking-widest text-accent uppercase mb-2 block">{product.category}</span>
                                <h3 className="text-3xl font-bold text-white">{product.title}</h3>
                            </div>
                            <div className="absolute top-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="w-12 h-12 rounded-full glass flex items-center justify-center">
                                    <div className="w-2 h-2 bg-accent rounded-full animate-ping" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
