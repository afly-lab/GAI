import React from "react";
import { ArrowRight, ShieldCheck, HelpCircle, CheckCircle2 } from "lucide-react";

export default function Hero() {
  const stats = [
    { number: "$0", label: "Product Markups Sourcing Agent Fee is 0%" },
    { number: "24h", label: "Ground Response Guarantee" },
    { number: "100%", label: "Pricing Transparency & Raw Invoices" },
    { number: "6+", label: "International Importer Regions" }
  ];

  return (
    <section id="hero" className="relative min-h-[90vh] flex flex-col justify-end pt-32 pb-16 overflow-hidden bg-cream">
      {/* Editorial Grid Backdrops */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-red-china/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Decorative Chinese Character (Confiding trust) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 select-none pointer-events-none font-serif text-[18rem] md:text-[30rem] text-gold/[0.04] leading-none z-0">
        信
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full z-10 relative">
        <div className="max-w-4xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 mb-6 border border-gold-dark/20 bg-gold/5 px-3 py-1 rounded-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-gold"></span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-gold-dark font-semibold">
              Your Dedicated Mainland Extension
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight text-ink mb-2 leading-[1.05]">
            Your China Office.<br />
            <span className="italic font-light text-gold">Without the Overhead.</span>
          </h1>

          <div className="font-mono text-xs sm:text-sm text-gold-dark font-bold tracking-wider uppercase mb-6 mt-1 flex items-center gap-2">
            <span className="w-2 h-[1px] bg-gold-dark" />
            On-Ground Control. Legally Binding. Zero Compromise.
          </div>

          <p className="text-lg md:text-xl text-ink-light max-w-2xl leading-relaxed mb-8 font-light">
            <strong className="text-gold font-medium">We step past the digital listing to verify reality on the physical floor</strong> - managing your factories, verifying licenses, inspecting shipments, and negotiating direct prices. No full-time employee risk, no undisclosed agent kickbacks.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <a
              href="#audit-planner"
              className="inline-flex items-center justify-center gap-2 bg-ink text-cream hover:bg-gold hover:text-ink font-mono text-sm uppercase tracking-wider font-semibold py-4 px-8 rounded-sm transition-all duration-300 shadow-xl shadow-ink/10"
            >
              Analyze Your Product Now
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 border border-ink/10 text-ink hover:border-ink font-mono text-sm uppercase tracking-wider py-4 px-8 rounded-sm transition-all duration-300"
            >
              View Pricing Plans
            </a>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-ink/10">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <div className="font-serif text-4xl md:text-5xl font-semibold text-ink">
                  {stat.number}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-faint mt-2 leading-relaxed">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
