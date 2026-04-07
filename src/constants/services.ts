import { Zap, Layers, Calendar, Camera, Megaphone, Palette, LineChart, BookOpen, LucideIcon } from "lucide-react";

export interface ServiceData {
    slug: string;
    title: string;
    shortDesc: string;
    longDesc: string;
    iconName: string;
    image: string;
    features: string[];
}

export const services: ServiceData[] = [
    {
        slug: "brand-storytelling",
        title: "Brand Storytelling",
        shortDesc: "Compelling narratives that resonate with your audience and build lasting connections.",
        longDesc: "We craft immersive brand experiences that go beyond visuals. Our storytelling approach integrates your brand's heritage with future-facing narratives, ensuring a profound connection with your target audience across every touchpoint.",
        iconName: "Palette",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2074",
        features: ["Narrative Strategy", "Brand Voice Development", "Visual Identity", "Content Frameworks"],
    },
    {
        slug: "premium-printing",
        title: "Premium Printing",
        shortDesc: "High-end print solutions from large-scale branding to bespoke corporate stationery.",
        longDesc: "Using industrial-grade infrastructure, we deliver printing solutions that redefine precision. From artisanal luxury finishes to massive high-volume runs, our output is characterized by uncompromising color accuracy and tactile quality.",
        iconName: "BookOpen",
        image: "https://images.unsplash.com/photo-1512418490979-92798ccc13a0?auto=format&fit=crop&q=80&w=2070",
        features: ["Industrial Offset", "High-Def Digital", "Large Format", "Bespoke Finishing"],
    },
    {
        slug: "digital-growth",
        title: "Digital Growth",
        shortDesc: "Data-driven strategies that accelerate your brand's presence in the digital landscape.",
        longDesc: "We engineer digital ecosystems designed for performance. By merging technical SEO, performance marketing, and ecosystem-wide analytics, we ensure your brand doesn't just exist online—it dominates.",
        iconName: "Zap",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070",
        features: ["Performance Marketing", "SEO Infrastructure", "Data Analytics", "Ecosystem Strategy"],
    },
    {
        slug: "design-systems",
        title: "Design Systems",
        shortDesc: "Scalable, consistent, and beautiful design frameworks that empower your product teams.",
        longDesc: "We build the architectural foundation of your digital and physical presence. Our design systems provide the scalability and consistency needed for modern global brands to move faster without sacrificing quality.",
        iconName: "Layers",
        image: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?auto=format&fit=crop&q=80&w=2070",
        features: ["Atomic Components", "Documentation", "Governance Tools", "Cross-Platform Scaling"],
    },
    {
        slug: "event-management",
        title: "Event Management",
        shortDesc: "Corporate event planning, executive summits, and property launches with seamless execution.",
        longDesc: "Our production team operates at the highest level of logistical precision. We handle everything from high-stakes corporate summits to immersive property launches, ensuring every second is a 'wow' moment.",
        iconName: "Calendar",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=2070",
        features: ["Executive Summits", "Property Launches", "Logistical Management", "Stage Production"],
    },
    {
        slug: "marketing-strategy",
        title: "Marketing Strategy",
        shortDesc: "Data-driven growth frameworks and market analysis to position your brand for success.",
        longDesc: "Strategy is the blueprint for victory. We conduct deep-market analysis and apply behavioral science to develop marketing frameworks that predict trends rather than just following them.",
        iconName: "LineChart",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015",
        features: ["Market Analysis", "Competitive Audits", "Growth Hacking", "Retention Models"],
    },
    {
        slug: "advertisements",
        title: "Advertisements",
        shortDesc: "Full-scale advertising campaigns across print and digital media for maximum visibility.",
        longDesc: "We create campaigns that are impossible to ignore. By blending high-impact visuals with strategic placement, we ensure your message reaches the right audience at the right time with maximum weight.",
        iconName: "Megaphone",
        image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80&w=2000",
        features: ["Campaign Concept", "Media Planning", "Production", "Placement Strategy"],
    },
    {
        slug: "signboards",
        title: "Signboards",
        shortDesc: "High-impact outdoor and indoor signage solutions, including 3D letters and neon.",
        longDesc: "Your physical location is your first impression. We manufacture high-fidelity signboards, from 3D channel letters to bespoke neon displays, using the most durable architectural materials available.",
        iconName: "Camera", // Using Camera for now or any relevant icon
        image: "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&q=80&w=2070",
        features: ["3D Letters", "Backlit Displays", "Pylon Signage", "Wayfinding Systems"],
    },
];
