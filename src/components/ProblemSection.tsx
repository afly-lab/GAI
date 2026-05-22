import React, { useState, useEffect } from "react";
import { AlertOctagon, HelpCircle, Sparkles, ShieldCheck, ShieldAlert, Award } from "lucide-react";

export default function ProblemSection() {
  // Simulator State
  const [channel, setChannel] = useState<"alibaba" | "agent" | "direct">("alibaba");
  const [verification, setVerification] = useState<"none" | "video" | "physical">("none");
  const [cert, setCert] = useState<"none" | "manufacturer" | "verified">("none");
  const [budget, setBudget] = useState<number>(30000); // Sourcing order size ($)

  const [leakage, setLeakage] = useState(0);
  const [defectRisk, setDefectRisk] = useState(0);
  const [safetyRating, setSafetyRating] = useState(0);

  useEffect(() => {
    // Hidden commission / leakage calculation:
    // Alibaba general leakage is 10% (trading companies acting as factories).
    // Traditional agents inflate factory prices by 15-20% through undisclosed rebates.
    // Direct with no background check has ~5% overhead but higher overall scam chances.
    let leakPct = 0;
    if (channel === "alibaba") leakPct = 0.12; 
    else if (channel === "agent") leakPct = 0.18;
    else leakPct = 0.04;

    // Adjust on verification: physical inspections cut kickback opportunities
    if (verification === "physical") leakPct -= 0.03;
    if (leakPct < 0) leakPct = 0.01;

    let computedLeakage = Math.round(budget * leakPct);

    // Defect risk calculates based on verification, channels and certs
    let baseDefect = 28; // Default 28% defect risk
    if (channel === "alibaba") baseDefect += 10; // high trading company risk
    if (channel === "agent") baseDefect -= 5;

    if (verification === "video") baseDefect -= 15;
    else if (verification === "physical") baseDefect -= 25;

    if (cert === "manufacturer") baseDefect -= 3;
    else if (cert === "verified") baseDefect -= 8;

    if (baseDefect < 1) baseDefect = 1.2;

    // Safety Score out of 100
    let score = 30; // base score
    if (channel === "direct") score += 10;
    else if (channel === "alibaba") score += 5;
    else score += 15;

    if (verification === "video") score += 20;
    else if (verification === "physical") score += 40;

    if (cert === "manufacturer") score += 10;
    else if (cert === "verified") score += 20;

    if (score > 98) score = 98;

    setLeakage(computedLeakage);
    setDefectRisk(Math.round(baseDefect * 10) / 10);
    setSafetyRating(score);

  }, [channel, verification, cert, budget]);

  const cards = [
    {
      title: "Undisclosed Factory Marks",
      text: "Most traditional sourcing agents inflate the raw factory costs by 10-25% without disclosing it, presenting themselves as 'fixed 5% agencies'. You lose margin silently.",
      icon: "💸"
    },
    {
      title: "Trading Companies as Manufacturers",
      text: "Beautiful Alibaba profiles often mask regional trading companies pretending to be factories. They outsource production, diluting accountability and increasing safety risks.",
      icon: "🏭"
    },
    {
      title: "Extreme Flight & Visual Overhead",
      text: "A single commercial travel to direct industrial zones or Canton Fair costs upwards of $5,000 in visa expenses, hotels, and interpreters merely to exchange greeting letters.",
      icon: "✈️"
    },
    {
      title: "Communication Gaps & Delays",
      text: "Communicating overseas through translation tools results in severe material misunderstandings. Faults are often only noticed when port custom container arrives.",
      icon: "📵"
    },
    {
      title: "No In-Country Legal Safeguards",
      text: "Operating as an overseas entity renders enforcing standard purchase contracts nearly impossible once transactions are settled through private channels.",
      icon: "⚖️"
    },
    {
      title: "Supplier Fatigue & Deadlines",
      text: "Without consistent physical local presence checking on your project schedules, production queues are prioritised for larger nearby local business operations.",
      icon: "🕐"
    }
  ];

  return (
    <section id="problem" className="py-24 md:py-32 lg:py-40 relative bg-cream-dark border-y border-ink/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-gold font-semibold mb-3 block">
            Sourcing Vulnerabilities
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink leading-tight">
            Why Most Traditional China<br />
            <span className="italic font-light text-ink-faint">Sourcing Models Fail</span>
          </h2>
          <p className="text-ink-light text-base leading-relaxed mt-4">
            Hidden kickbacks, unverified subcontractors, and timezone breakdowns cost importers thousands. We map these structural faults, so you can build with safe partners.
          </p>
        </div>

        {/* 6 problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-cream border border-ink/5 p-8 rounded-sm hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="absolute left-0 bottom-0 w-full h-[3px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <div className="text-3xl mb-4">{card.icon}</div>
              <h3 className="font-sans font-semibold text-lg text-ink mb-3">{card.title}</h3>
              <p className="text-ink-faint text-sm leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>

        {/* SUPPLY CHAIN RISK CALCULATOR */}
        <div id="risk-simulator" className="bg-cream rounded border border-gold-dark/20 p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-ink/5">
          <div className="absolute top-0 right-0 p-4 font-serif text-8xl text-gold/5 leading-none select-none pointer-events-none">
            RISK
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Simulator Controls */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-gold/10 px-3 py-1 rounded-sm mb-4">
                <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-gold-dark font-semibold">
                  Interactive Sourcing Safety Calculator
                </span>
              </div>
              
              <h3 className="font-serif text-3xl text-ink mb-6">
                Audit Your Sourcing Architecture
              </h3>

              <div className="space-y-6">
                {/* Channel Option */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-ink-light mb-3">
                    1. Supplier Discovery Channel
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["alibaba", "agent", "direct"].map((val) => (
                      <button
                        key={val}
                        onClick={() => setChannel(val as any)}
                        className={`py-2 px-3 text-xs tracking-wider uppercase font-mono border rounded-sm transition-all ${
                          channel === val
                            ? "bg-ink text-cream border-ink"
                            : "bg-cream-dark text-ink-faint border-ink/10 hover:border-ink/50"
                        }`}
                      >
                        {val === "alibaba" ? "Alibaba / Directory" : val === "agent" ? "Commission Agent" : "Factory Direct"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* On-Ground Audit verification Option */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-ink-light mb-3">
                    2. Physical Verification level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["none", "video", "physical"].map((val) => (
                      <button
                        key={val}
                        onClick={() => setVerification(val as any)}
                        className={`py-2 px-3 text-xs tracking-wider uppercase font-mono border rounded-sm transition-all ${
                          verification === val
                            ? "bg-ink text-cream border-ink"
                            : "bg-cream-dark text-ink-faint border-ink/10 hover:border-ink/50"
                        }`}
                      >
                        {val === "none" ? "None (Remote)" : val === "video" ? "Video Audit" : "Physical Audit"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Certificate Verification Option */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-ink-light mb-3">
                    3. Certificate Authentication
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["none", "manufacturer", "verified"].map((val) => (
                      <button
                        key={val}
                        onClick={() => setCert(val as any)}
                        className={`py-2 px-3 text-xs tracking-wider uppercase font-mono border rounded-sm transition-all ${
                          cert === val
                            ? "bg-ink text-cream border-ink"
                            : "bg-cream-dark text-ink-faint border-ink/10 hover:border-ink/50"
                        }`}
                      >
                        {val === "none" ? "Unverified PDF" : val === "manufacturer" ? "Factory claim" : "Independent Lab verification"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sourcing size slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-ink-light">
                      4. Total Annual Sourcing Volume ($)
                    </label>
                    <span className="font-mono text-xs font-semibold text-ink">
                      ${budget.toLocaleString()} USD
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="500000"
                    step="5000"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-1 bg-cream-dark border-none appearance-none rounded-lg accent-gold outline-none cursor-ew-resize"
                  />
                </div>
              </div>
            </div>

            {/* Simulator Feedback Scorecard */}
            <div className="lg:col-span-5 bg-cream hover:bg-cream-dark border border-gold-dark/20 p-8 rounded flex flex-col justify-between transition-all duration-300">
              <div className="space-y-6">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-ink-faint">
                    Est. Sourcing Efficiency / Leakage
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-serif text-3xl font-semibold text-red-700">
                      ${leakage.toLocaleString()}
                    </span>
                    <span className="font-mono text-[10px] text-ink-faint">USD lost/year</span>
                  </div>
                  <p className="text-[11px] text-ink-faint leading-relaxed mt-1">
                    Undisclosed intermediary charges and trading agency margins built secretly into unit costs.
                  </p>
                </div>

                <div className="h-[1px] bg-ink/10"></div>

                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-ink-faint">
                    Batch Defect Risk Rate
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-serif text-3xl font-semibold text-amber-700">
                      {defectRisk}%
                    </span>
                    <span className="font-mono text-[10px] text-ink-faint">prob. variance</span>
                  </div>
                  <p className="text-[11px] text-ink-faint leading-relaxed mt-1">
                    Likeliness of receiving batch failures, broken certifications, or non-compliant shipping markings.
                  </p>
                </div>

                <div className="h-[1px] bg-ink/10"></div>

                <div className="flex items-center gap-4 justify-between">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-ink-faint">
                      Sourcing Safety Rating
                    </span>
                    <p className="font-serif text-2xl font-medium text-ink mt-1">
                      {safetyRating < 50
                        ? "Vulnerable"
                        : safetyRating < 80
                        ? "Sub-Optimal"
                        : "Highly Shielded"}
                    </p>
                  </div>

                  <div className="flex items-center justify-center p-3 rounded-full bg-cream-dark">
                    {safetyRating < 50 ? (
                      <ShieldAlert className="w-8 h-8 text-red-600" />
                    ) : safetyRating < 80 ? (
                      <AlertOctagon className="w-8 h-8 text-amber-500" />
                    ) : (
                      <Award className="w-8 h-8 text-gold" />
                    )}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-8">
                <a
                  href="#contact"
                  className="w-full text-center bg-gold hover:bg-ink text-ink hover:text-cream font-mono text-[10px] uppercase tracking-widest font-bold py-3 px-4 rounded-sm transition-all duration-300 block"
                >
                  Request Ground Sourcing Audit
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
