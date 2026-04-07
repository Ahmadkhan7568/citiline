import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import PrintProducts from "@/components/PrintProducts";
import Technology from "@/components/Technology";
import EventShowcase from "@/components/EventShowcase";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Services />
      <Process />
      <PrintProducts />
      <Technology />
      <EventShowcase />

      {/* Portfolio Placeholder / Work Section */}
      <section id="work" className="py-32 px-6 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight uppercase">
              SELECTED WORK <span className="text-muted-foreground text-2xl md:text-3xl font-light">/ 02</span>
            </h2>
            <p className="max-w-md text-muted-foreground text-lg italic">
              A curated collection of digital and physical experiences that challenge the status quo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-zinc-300">
            {[
              { id: "01", title: "Project 01", image: "/work/work%201.webp" },
              { id: "02", title: "Project 02", image: "/work/work%202.webp" }
            ].map((project) => (
              <div key={project.id} className="group cursor-pointer">
                <div className="aspect-[16/10] bg-muted overflow-hidden rounded-[2rem] relative mb-8 border border-white/5">
                  <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                  <div className="absolute inset-0 scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out bg-cover bg-center" style={{ backgroundImage: `url(${project.image})` }} />
                </div>
                <div className="flex justify-between items-center px-4">
                  <div>
                    <h3 className="text-3xl font-bold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm text-accent">Branding • Print • Strategy</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <span className="text-xl">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
