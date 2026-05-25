import React, { useState, useEffect } from "react";
import { 
  ArrowRight, ShieldCheck, MapPin, Sparkles, CheckCircle2, 
  ChevronDown, HelpCircle, PhoneCall, Mail, AlertTriangle, 
  Loader2, BadgeHelp, Check, X, FileText, Verified, Compass,
  Linkedin, Phone, MessageSquare
} from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProblemSection from "./components/ProblemSection";
import { AuditResult, InquireForm } from "./types";

export default function App() {
  // Free Sourcing Audit generator state
  const [productKeyword, setProductKeyword] = useState("");
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState("");

  const samplePopularSearches = ["Consumer Electronics", "Precision Molding", "Hardware & Machinery", "Textiles & Garments"];

  // Custom Lead Inquiry Form
  const [inquireForm, setInquireForm] = useState<InquireForm>({
    name: "",
    email: "",
    subject: "",
    phone: "",
    company: "",
    product: "",
    budget: "$10,000 - $50,000",
    plan: "Growth Plan — $1,199/mo",
    message: ""
  });
  const [emailValidationError, setEmailValidationError] = useState("");
  const [inquireStatus, setInquireStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [inquireMsg, setInquireMsg] = useState("");
  const [wechatCopied, setWechatCopied] = useState(false);

  // Accordion active indexes
  const [faqOpen, setFaqOpen] = useState<{ [key: number]: boolean }>({});
  const [serviceOpen, setServiceOpen] = useState<{ [key: number]: boolean }>({ 0: true });

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleService = (index: number) => {
    setServiceOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handlePopularSearch = (word: string) => {
    setProductKeyword(word);
    generateSourcingAudit(word);
  };

  const generateSourcingAudit = async (keywordOverride?: string) => {
    const query = keywordOverride || productKeyword;
    if (!query || query.trim() === "") {
      setAuditError("Please enter a valid product keyword first.");
      return;
    }
    setAuditLoading(true);
    setAuditError("");
    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productType: query })
      });
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      const data = await response.json();
      setAuditResult(data);
      // Auto scroll to results smoothly
      setTimeout(() => {
        document.getElementById("audit-result-view")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (e: any) {
      console.error(e);
      setAuditError("Failed to fetch custom AI Sourcing report. Please ensure your prompt is valid and your server is listening with valid secrets configured.");
    } finally {
      setAuditLoading(false);
    }
  };

  const handleInquireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check email with precise email format pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inquireForm.email)) {
      setEmailValidationError("Please enter a valid business email address (e.g. name@company.com)");
      return;
    }
    
    // Clear validation error and proceed
    setEmailValidationError("");
    setInquireStatus("submitting");
    try {
      const response = await fetch("/api/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquireForm)
      });
      const data = await response.json();
      if (data.success) {
        setInquireStatus("success");
        setInquireMsg(data.message || "Your inquiry is officially registered. Our team will follow up shortly.");
      } else {
        setInquireStatus("error");
        setInquireMsg(data.error || "Inquiry submission failed. Please verify fields are entered.");
      }
    } catch (err: any) {
      setInquireStatus("error");
      setInquireMsg("Network connection error. Please try again.");
    }
  };

  const serviceCategories = [
    {
      title: "Supplier Sourcing & Factory Verification",
      num: "01",
      tags: ["Direct factory license check", "On-site video walkthroughs", "Production capability audits", "Reference checking with raw material sources"],
      details: "We don't search directories. We leverage native Chinese wholesale channels, speak direct to factory directors, verify physical operations in person, and deliver transparent background documentation."
    },
    {
      title: "Transparent Negotiation & Strategic Sourcing",
      num: "02",
      tags: ["Open-book policy", "Raw direct-from-factory quotes", "Direct contract execution", "Zero referral markups"],
      details: "Unlike traditional agencies that hide their 10-25% margin in inflated product costs, we charge a flat fee. We share every supplier contact directly so you can build real trust with the manufacturer."
    },
    {
      title: "Quality Control, IP Safeguarding & Verification",
      num: "03",
      tags: ["Your On-Ground Guardian for Total Manufacturing Accountability", "On-site batch inspections", "Pre-shipment photo & video log", "Lab certificate verification"],
      details: "Your On-Ground Guardian for Total Manufacturing Accountability. We sign legally-binding bilingual NDAs / NNNs in China, secure ownership certificate of customized injection molds, complete precise product diagnostics, and verify testing paperwork before loading."
    },
    {
      title: "Continuous Field Operations & Sourcing Partnership",
      num: "04",
      tags: ["Strategic Sourcing representation", "Trade Fair attendance", "Logistics coordination", "Custom dispute resolution"],
      details: "Think of us as your primary partner on the ground. We manage deadlines, expedite shipping documents, escalate errors, and keep your production queue optimal."
    }
  ];

  return (
    <div className="relative min-h-screen bg-cream selection:bg-gold/30 selection:text-ink pb-0">
      {/* Sensory Paper Texture */}
      <div className="grain-overlay" />

      {/* Nav */}
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* SOURCING GENERATOR WIDGET (A premium generative tool) */}
      <section id="audit-planner" className="py-24 md:py-32 bg-cream border-t border-ink/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left side info */}
            <div className="lg:col-span-5">
              <span className="font-mono text-xs uppercase tracking-widest text-gold font-semibold mb-3 block">
                Generative Sourcing Tool
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-ink leading-tight">
                Run an In-Market <br />
                <span className="italic font-light text-ink-faint">China Factory Pre-Audit</span>
              </h2>
              <p className="text-ink-light text-base mt-4 leading-relaxed">
                Enter your product keyword below. Our system queries native regional databases to draft a live sourcing assessment, detailing primary manufacturing hubs, expected defect parameters, MOQs, testing parameters, and verified direct risk management strategies.
              </p>
            </div>

            {/* Sourcing Generator Input Card */}
            <div className="lg:col-span-12 xl:col-span-7 bg-cream border border-gold-dark/20 p-8 rounded-sm shadow-xl shadow-ink/5">
              <div className="space-y-6">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-3">
                    Target Product or Custom Specifications
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Enter target product name..."
                      value={productKeyword}
                      onChange={(e) => setProductKeyword(e.target.value)}
                      className="flex-1 bg-cream-dark border border-ink/10 rounded-sm py-4 px-6 text-sm text-ink outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                    />
                    <button
                      onClick={() => generateSourcingAudit()}
                      disabled={auditLoading}
                      className="bg-ink hover:bg-gold text-cream hover:text-ink py-4 px-8 font-mono text-xs uppercase tracking-widest font-bold rounded-sm transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {auditLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyzing Clusters...
                        </>
                      ) : (
                        <>
                          Generate Free Pre-Audit
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {auditError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded p-4 flex gap-2 items-start">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Sourcing Engine offline</p>
                      <p className="text-xs opacity-90">{auditError}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* AUDIT RENDER MODULE */}
              {auditResult && (
                <div id="audit-result-view" className="mt-12 pt-12 border-t border-ink/10 space-y-8 animate-fade-up">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-ink-faint">Target parameters for</span>
                      <h3 className="font-serif text-3xl font-semibold text-ink italic mt-1">{auditResult.productName}</h3>
                    </div>
                    {/* Risk indicator */}
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Risk index:</span>
                      <span className={`px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-widest font-bold ${
                        auditResult.riskScore === "Low" 
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                          : auditResult.riskScore === "Medium"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}>
                        {auditResult.riskScore} Risk
                      </span>
                    </div>
                  </div>

                  {/* Sourcing Risk Overview */}
                  <div className="p-6 bg-cream-dark/40 border-l-2 border-gold rounded-sm">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-gold-dark font-bold block mb-1">
                      On-Ground Regional Sourcing Risk Overview:
                    </span>
                    <p className="text-sm text-ink-light leading-relaxed font-light italic">
                      "{auditResult.riskOverview}"
                    </p>
                  </div>

                  {/* Verified industrial clusters of this product */}
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-ink-faint mb-3 block">
                      Verified Industrial Manufacturing Clusters in China
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(auditResult?.manufacturingClusters || []).map((cluster, i) => (
                        <div key={i} className="flex gap-4 p-5 bg-cream border border-ink/5 rounded-sm hover:border-gold/50 transition-all">
                          <div className="flex items-center justify-center p-3 rounded bg-cream-dark text-gold">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-serif text-lg font-medium text-ink">
                              {cluster.city}, {cluster.province}
                            </h4>
                            <p className="text-xs text-ink-faint leading-relaxed mt-1">
                              {cluster.specialization}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benchmarks grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="p-6 bg-cream-dark/30 rounded border border-ink/5">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-ink-faint">Est. Sourcing MOQ Range</span>
                      <p className="font-serif text-xl font-medium text-ink mt-1 italic">{auditResult.moqExpectation}</p>
                    </div>
                    <div className="p-6 bg-cream-dark/30 rounded border border-ink/5">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-ink-faint">Est. Target Unit Budget Parameters</span>
                      <p className="font-serif text-xl font-medium text-ink mt-1 italic">{auditResult.targetPriceBenchmark}</p>
                    </div>
                  </div>

                  {/* Standards & Certifications */}
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-ink-faint block mb-3">
                      Required Import testing & certifications marks
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(auditResult?.certificationRequirements || []).map((cert) => (
                        <span key={cert} className="inline-flex items-center gap-1.5 bg-ink text-cream font-mono text-[10px] tracking-wider uppercase py-1.5 px-3 rounded-full">
                          <Check className="w-3 h-3 text-gold" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* On ground factory checklist */}
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-ink-faint block mb-3">
                      Our Physical On-Site Inspection Points
                    </span>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-none">
                      {(auditResult?.onGroundInspectionChecklist || []).map((point, index) => (
                        <li key={index} className="flex gap-2 text-sm text-ink-light">
                          <span className="font-serif font-semibold text-gold-dark">—</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* XinAo Representation Action */}
                  <div className="p-6 bg-ink text-cream rounded-sm border border-gold/20">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="w-4 h-4 text-gold" />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-gold">XinAo On-Ground Defense Strategy</span>
                    </div>
                    <p className="text-xs text-cream/85 leading-relaxed font-light">
                      {auditResult.ourRepresentationStrategy}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* WHY SOURCING FAILS SECTION */}
      <ProblemSection />

      {/* DETAILED SERVICES ACCORDIONS - A highly styled typographic grid */}
      <section id="services" className="py-24 md:py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Sticky Intro header */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              <span className="font-mono text-xs uppercase tracking-widest text-gold font-semibold block">
                Field Operations
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-ink leading-tight">
                Our On-Ground <br />
                <span className="italic font-light text-ink-faint">Infrastructure</span>
              </h2>
              <p className="text-ink-light leading-relaxed text-base font-light">
                Think of XinAo as your dedicated On-Ground Execution Arm directly in the center of China’s e-commerce and export core. We serve importers globally with legally accountable, NDA-backed local oversight.
              </p>
              
              <div className="border-t border-ink/10 pt-6 space-y-3">
                <div className="flex gap-2 text-xs text-ink-light">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Direct supplier communications (No Chinese gatekeepers)</span>
                </div>
                <div className="flex gap-2 text-xs text-ink-light">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>NDAs signed before any product details are processed</span>
                </div>
                <div className="flex gap-2 text-xs text-ink-light">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Raw real invoices are direct and transparent</span>
                </div>
              </div>

              <div>
                <a
                  href="#contact"
                  className="bg-ink hover:bg-gold text-cream hover:text-ink font-mono text-[11px] uppercase tracking-widest py-4 px-8 rounded-sm inline-block transition-all duration-300 font-bold"
                >
                  Book On-Ground Operations Consultation
                </a>
              </div>
            </div>

            {/* Styled Services list */}
            <div className="lg:col-span-1"></div>
            <div className="lg:col-span-6 space-y-4">
              {serviceCategories.map((service, index) => (
                <div
                  key={index}
                  className="border-b border-ink/10 py-6 transition-all duration-300"
                >
                  <button
                    onClick={() => toggleService(index)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-gold-dark font-semibold">
                        {service.num}
                      </span>
                      <h3 className="font-serif text-lg md:text-xl font-medium text-ink group-hover:text-gold transition-colors duration-200">
                        {service.title}
                      </h3>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-ink-faint group-hover:text-ink transition-transform duration-300 ${
                      serviceOpen[index] ? "rotate-180" : ""
                    }`} />
                  </button>

                  <div className={`overflow-hidden transition-all duration-500 ${
                    serviceOpen[index] ? "max-h-[300px] mt-4 opacity-100" : "max-h-0 opacity-0"
                  }`}>
                    <p className="text-sm text-ink-light leading-relaxed font-light pl-8">
                      {service.details}
                    </p>
                    <div className="flex flex-wrap gap-2 pl-8 mt-4">
                      {service.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-mono tracking-wide uppercase bg-cream-dark text-ink-light py-1 px-3 border border-ink/5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* COMPARISON - THE OUTSOURCING MODEL COMPARATIVE */}
      <section id="compare" className="py-24 bg-ink text-cream border-t border-ink/10 select-none">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="max-w-3xl mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-gold font-semibold mb-3 block">
              Architectural Transparency
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-cream leading-tight">
              A Direct Comparison of<br />
              <span className="italic font-light text-gold-light">China Sourcing Partnerships</span>
            </h2>
            <p className="text-cream/70 text-sm mt-4 font-light max-w-xl">
              Understand the clear financial and legal implications of different product sourcing strategies inside China.
            </p>
          </div>

          <div className="overflow-x-auto border border-cream/10 rounded-sm">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-cream/10">
                  <th className="p-6 text-cream/40 font-normal uppercase tracking-wider">Strategic Sourcing Metrics</th>
                  <th className="p-6 text-cream/60 font-normal uppercase tracking-wider">Trading Agencies</th>
                  <th className="p-6 text-cream/60 font-normal uppercase tracking-wider">Full In-house Hire</th>
                  <th className="p-6 text-gold-light font-bold uppercase tracking-widest bg-cream/5 border-x border-gold-dark/40 relative">
                    XinAo Dedicated Mainland Infrastructure
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-ink text-[10px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                      Highly recommended
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream/5">
                <tr>
                  <td className="p-6 font-semibold text-cream/80">Monthly Retainer & Fees</td>
                  <td className="p-6 text-cream/60">Undefined kickbacks added per unit costs</td>
                  <td className="p-6 text-cream/60">$7,000+ Salaried Base + Visas + Logistics</td>
                  <td className="p-6 text-gold bg-cream/5 font-bold border-x border-gold-dark/40">From $499 Flat/Month | $0 Sourcing Fee</td>
                </tr>
                <tr>
                  <td className="p-6 font-semibold text-cream/80">Pricing Open-Book Policy</td>
                  <td className="p-6 text-red-400">Locked (Hidden 10-25% markups)</td>
                  <td className="p-6 text-emerald-400">Open-Book</td>
                  <td className="p-6 text-emerald-400 bg-cream/5 font-bold border-x border-gold-dark/40">100% Raw Direct Factory Quotes</td>
                </tr>
                <tr>
                  <td className="p-6 font-semibold text-cream/80">Supplier Contacts Access</td>
                  <td className="p-6 text-red-400">Restricted (Agent brokers communication)</td>
                  <td className="p-6 text-emerald-400">Direct Access</td>
                  <td className="p-6 text-emerald-400 bg-cream/5 font-bold border-x border-gold-dark/40">100% Unfiltered Direct Relationships</td>
                </tr>
                <tr>
                  <td className="p-6 font-semibold text-cream/80">Physical On-ground Verification</td>
                  <td className="p-6 text-cream/40">Rarely or self-verified photos only</td>
                  <td className="p-6 text-emerald-400">In-person visits</td>
                  <td className="p-6 text-emerald-400 bg-cream/5 font-bold border-x border-gold-dark/40">Continuous Live On-Site audits & walkthroughs</td>
                </tr>
                <tr>
                  <td className="p-6 font-semibold text-cream/80">On-Ground Legal Accountability</td>
                  <td className="p-6 text-cream/40">Unaccountable Freelancers</td>
                  <td className="p-6 text-emerald-400">Company Liability</td>
                  <td className="p-6 text-emerald-400 bg-cream/5 font-bold border-x border-gold-dark/40">NDA legally enforceable with resident representatives</td>
                </tr>
                <tr>
                  <td className="p-6 font-semibold text-cream/80">Strategic Commitments</td>
                  <td className="p-6 text-cream/40">Often require massive MOQ orders</td>
                  <td className="p-6 text-red-400">Strict local employment laws</td>
                  <td className="p-6 text-emerald-400 bg-cream/5 font-bold border-x border-gold-dark/40">Flexible Subscription | Pause or Cancel anytime</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* PRICING PLANS */}
      <section id="pricing" className="py-24 md:py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-gold font-semibold mb-3 block">
              Transparent Frameworks
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-ink leading-tight">
              Your China Fiduciary Ally
            </h2>
            <p className="text-ink-faint text-sm mt-4 font-light">
              Choose your appropriate field operational level. Completely predictable flat-rate. No hidden factory commissions. Stop or cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Tier 1: Managed Launch */}
            <div className="bg-cream border border-ink/15 hover:border-gold/60 p-8 rounded-sm flex flex-col justify-between hover:shadow-xl hover:shadow-ink/5 transition-all duration-300 relative">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-gold-dark font-bold">Volume: Up to 3 Active Evaluations</span>
                <h3 className="font-serif text-2xl text-ink mt-2">Managed Launch</h3>
                <p className="text-xs text-ink-faint mt-1 leading-relaxed">Secure, comprehensive starting point for product launch representation and direct negotiation in China.</p>
                
                <div className="flex items-baseline gap-1 my-6">
                  <span className="font-serif text-5xl font-semibold text-ink">$499</span>
                  <span className="font-mono text-xs text-ink-faint">/ month</span>
                </div>

                <div className="border-t border-ink/10 pt-6">
                  <span className="font-mono text-[8px] uppercase tracking-wider text-gold-dark font-semibold block mb-2">Included Deliverables</span>
                  <ul className="space-y-3 font-mono text-[11px] uppercase tracking-wider text-ink-light">
                    <li className="flex items-start gap-2.5">
                      <span className="text-gold font-bold shrink-0">✓</span>
                      <span>Up to 3 Active Supplier Evaluations</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-gold font-bold shrink-0">✓</span>
                      <span>Direct Factory-Floor Strategic Negotiation</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-gold font-bold shrink-0">✓</span>
                      <span>Video Factory Audits</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-gold font-bold shrink-0">✓</span>
                      <span>Pre-Shipment Batch QC Inspections</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-gold font-bold shrink-0">✓</span>
                      <span>Full Logistics/Customs Paperwork</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-gold font-bold shrink-0">✓</span>
                      <span>Sample Coordination</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="#contact"
                  className="w-full text-center border border-ink text-ink hover:bg-ink hover:text-cream font-mono text-[10px] uppercase tracking-widest font-bold py-3 px-4 rounded-sm transition-all duration-300 block"
                >
                  Select Managed Launch
                </a>
              </div>
            </div>

            {/* Tier 2: Scale & Acceleration */}
            <div className="bg-cream border border-gold hover:border-gold-dark p-8 rounded-sm flex flex-col justify-between hover:shadow-xl hover:shadow-gold/5 transition-all duration-300 relative shadow-md shadow-gold/[0.02]">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-ink text-[8px] font-mono font-bold uppercase tracking-[0.14em] py-1 px-4 rounded-sm shadow-sm">
                Recommended For Scaling Brands
              </span>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-gold-dark font-bold block mt-1">Volume: Up to 8 Active Evaluations</span>
                <h3 className="font-serif text-2xl text-ink mt-2">Scale & Acceleration</h3>
                <p className="text-xs text-ink-faint mt-1 leading-relaxed font-light">
                  Continuous pipeline expansion with advanced supply-chain mitigations and logistics performance.
                </p>
                
                <div className="flex items-baseline gap-1 my-6">
                  <span className="font-serif text-5xl font-semibold text-ink">$1,199</span>
                  <span className="font-mono text-xs text-ink-faint">/ month</span>
                </div>

                <div className="border-t border-ink/10 pt-6">
                  <span className="font-mono text-[8px] uppercase tracking-wider text-gold-dark font-bold block mb-2">High-Value Scale Additions</span>
                  <ul className="space-y-2.5 font-mono text-[10.5px] uppercase tracking-wider text-ink bg-gold/[0.04] p-3 rounded-sm border border-gold/15 mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-bold shrink-0">★</span>
                      <span className="text-ink font-semibold">Mid-Production Quality Audits (DUPRO)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-bold shrink-0">★</span>
                      <span className="text-ink font-semibold">Multi-Factory Freight Consolidation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-bold shrink-0">★</span>
                      <span className="text-ink font-semibold">Strict Penalty Clause Enforcement</span>
                    </li>
                  </ul>

                  <span className="font-mono text-[8px] uppercase tracking-wider text-gold-dark/60 font-semibold block mb-2">Includes All Tier 1 Features:</span>
                  <ul className="space-y-2 font-mono text-[10px] uppercase tracking-wider text-ink-light/80">
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-medium shrink-0">✓</span>
                      <span>Up to 8 Active Supplier Evaluations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-medium shrink-0">✓</span>
                      <span>Direct Factory-Floor Strategic Negotiation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-medium shrink-0">✓</span>
                      <span>Video Factory Audits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-medium shrink-0">✓</span>
                      <span>Pre-Shipment batch QC inspections</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-medium shrink-0">✓</span>
                      <span>Full logistics/customs paperwork</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-medium shrink-0">✓</span>
                      <span>Sample Coordination</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="#contact"
                  className="w-full text-center bg-ink text-cream hover:bg-gold hover:text-ink font-mono text-[10px] uppercase tracking-widest font-bold py-3.5 px-4 rounded-sm transition-all duration-300 block"
                >
                  Select Scale & Acceleration
                </a>
              </div>
            </div>

            {/* Tier 3: Your In-House China Office */}
            <div className="bg-ink border-2 border-gold p-8 rounded-sm flex flex-col justify-between shadow-2xl shadow-ink/15 relative lg:-translate-y-2">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold text-ink text-[8.5px] font-mono font-bold uppercase tracking-[0.15em] py-1 px-4 rounded-full shadow-lg">
                Literal mainland Office Infrastructure
              </span>
              
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-gold-light font-bold block mt-1">Volume: Unlimited Active Evaluations</span>
                <h3 className="font-serif text-2xl text-cream mt-2">Your In-House China Office</h3>
                <p className="text-xs text-cream/70 mt-1 leading-relaxed font-light">
                  Establish a permanent, local physical operational footprint. Frame your enterprise operations with dedicated personnel and resident legal protections inside China.
                </p>
                
                <div className="flex items-baseline gap-1 my-6">
                  <span className="font-serif text-5xl font-semibold text-gold-light">$2,499</span>
                  <span className="font-mono text-xs text-cream/50">/ month</span>
                </div>

                <div className="border-t border-cream/15 pt-6">
                  <span className="font-mono text-[8px] uppercase tracking-wider text-gold-light font-semibold block mb-2">Full On-Site Office Deliverables</span>
                  <ul className="space-y-3 font-mono text-[11px] uppercase tracking-wider text-cream/85">
                    <li className="flex items-start gap-2.5">
                      <span className="text-gold-light font-bold shrink-0">✓</span>
                      <span className="text-white font-semibold">Unlimited Active Supplier Evaluations</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-gold-light font-bold shrink-0">✓</span>
                      <span>Dedicated Full Account Representative</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-gold-light font-bold shrink-0">✓</span>
                      <span>Official legal representation/corporate shield</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-gold-light font-bold shrink-0">✓</span>
                      <span>Trade show presence & live reporting</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-gold-light font-bold shrink-0">✓</span>
                      <span>Raw material trace reports & compliance</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="#contact"
                  className="w-full text-center bg-gold hover:bg-cream text-ink font-mono text-[10px] uppercase tracking-widest font-bold py-3.5 px-4 rounded-sm transition-all duration-300 block"
                >
                  Acquire China Office
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ABOUT - MANAGING DIRECTOR ABDUL RAHMAN'S BIO */}
      <section id="about" className="py-24 bg-cream-dark/40 border-y border-ink/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* MD Graphic Card - Styled to elegant slightly smaller size */}
            <div className="lg:col-span-4 flex justify-center w-full">
              <div className="relative border border-gold-dark/20 w-48 aspect-[3/4] bg-cream-dark p-3 rounded-sm shadow-xl shadow-ink/5 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent z-10"></div>
                <img
                  src="https://lh3.googleusercontent.com/d/1pBIw5y4YiSdP4oY5dA6yE7fyK0uTAm4X"
                  alt="Abdul Rahman - Managing Director of XinAo International Trade Co., Ltd."
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-sm"
                  referrerPolicy="no-referrer"
                />
                
                {/* Float Overlap Card */}
                <div className="absolute bottom-3 left-3 right-3 bg-cream p-2 z-20 rounded-sm border border-gold-dark/20 shadow-lg">
                  <span className="font-mono text-[7px] uppercase tracking-widest text-gold-dark font-bold block mb-0.5">
                    XinAo International
                  </span>
                  <p className="font-serif text-xs font-semibold text-ink leading-tight">
                    Abdul Rahman
                  </p>
                  <p className="text-[8px] font-mono text-ink-faint mt-0.5 uppercase tracking-wider">
                    Managing Director
                  </p>
                </div>
              </div>
            </div>

            {/* MD Context */}
            <div className="lg:col-span-8 space-y-6">
              <h2 className="font-serif text-4xl md:text-5xl text-ink leading-tight">
                Your Dedicated <br />
                <span className="italic font-light text-ink-faint">Mainland Extension.</span>
              </h2>

              <blockquote className="border-l-3 border-gold pl-6 text-lg italic text-ink-light font-serif">
               "For 4 years, I ran Havens Commerce Partners — a China Representative Office coordinating sourcing and export logistics for buyers across the US, Europe, Canada, Australia, the Middle East, and India.

I watched the same failures repeat in every market: hidden markups, trading companies presented as manufacturers, certificates that nobody verified, and buyers overseas with no one on the ground who worked exclusively for them.

I founded XinAo to be the operation I never found as an exporter — flat fee, zero commission, physically present, working only for the buyer."
              </blockquote className="border-l-3 border-gold pl-6 text-lg italic text-ink-light font-serif">
— Abdul Rahman, Founder & MD
XinAo International Trade Co., Ltd.
Wholly Foreign-Owned Enterprise (WFOE) · Registered in Hangzhou, China
            </div>
          </div>

        </div>
      </section>

      {/* VERIFIED PROOF BLOCK */}
      <section id="proof" className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center max-w-4xl">
          
          <span className="font-mono text-xs uppercase tracking-widest text-gold font-semibold mb-3 block">
            Verifiable Traceability
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-ink leading-snug">
            Examine Our On-Ground Verification & Order Management <br />
            <span className="italic font-light text-ink-faint">Standard Templates Before Commitment</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 text-left">
            <div className="p-8 bg-cream border border-ink/10 hover:border-gold/50 rounded-sm space-y-4">
              <FileText className="w-8 h-8 text-gold-dark" />
              <h3 className="font-serif text-xl font-medium text-ink">Sample Manufacturer Audit Report</h3>
              <p className="text-xs text-ink-faint leading-relaxed">
                Review an authentic on-site industrial supplier vetting. Includes detailed pictures of business license validation, machine floor diagnostics, testing machinery logs, and staff verification metrics.
              </p>
              <a
                href="https://wa.me/8618718924056?text=Hi%2C%20I'd%20like%20to%20see%20a%20sample%20manufacturer%20audit%20report"
                target="_blank"
                className="font-mono text-[10px] uppercase tracking-widest text-gold-dark font-bold hover:text-ink block"
              >
                Request Sample Audit PDF →
              </a>
            </div>

            <div className="p-8 bg-cream border border-ink/10 hover:border-gold/50 rounded-sm space-y-4">
              <Compass className="w-8 h-8 text-gold-dark" />
              <h3 className="font-serif text-xl font-medium text-ink">Sample Quality Control Video Log</h3>
              <p className="text-xs text-ink-faint leading-relaxed">
                See exactly how our on-ground representatives check tolerances for a finished batch. Watch detailed measurements, solder joint testing, functional performance checks, and container seals validation.
              </p>
              <a
                href="https://wa.me/8618718924056?text=Hi%2C%20I'd%20like%20to%20see%20a%20sample%20quality%20control%20video%20log"
                target="_blank"
                className="font-mono text-[10px] uppercase tracking-widest text-gold-dark font-bold hover:text-ink block"
              >
                Request Sample Video Link →
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="py-24 bg-cream border-t border-ink/5">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-gold font-semibold mb-3 block">
              Sourcing Answers
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-ink leading-tight">
              A Transparent Explanation <br />
              <span className="italic font-light text-ink-faint">of Chinese Operations</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Do you sign NDAs before accessing our product designs?",
                a: "Yes. A legally binding NDA is signed with our established company entity before you share specs or manufacturer details. Under our open relations policy, we are fully accountable for safeguarding your designs and IP with direct on-ground protections."
              },
              {
                q: "Why do you refuse standard supplier commission commission model?",
                a: "Traditional agencies make money by negotiating kickbacks from the factory, hiding these costs inside inflated unit prices. This model creates a conflict of interest, where the agent prioritizes the highest-paying factory over quality. Our flat monthly retainer aligns us entirely with your budget and standards."
              },
              {
                q: "Do you share the raw verified supplier contacts directly?",
                a: "Absolutely. XinAo does not gatekeep. We share all supplier accounts, email registers, WeChat threads, and raw direct-from-factory invoices so you have complete visibility of your supply architecture."
              },
              {
                q: "My order volume is small. Will the factory still prioritize my production?",
                a: "Yes. We leverage our institutional presence to command factory floor attention. To the manufacturer, you are not a solo buyer; you are protected by our established local infrastructure."
              },
              {
                q: "Can we cancel our monthly representative subscription anytime?",
                a: "Yes. All flat retainers are billed monthly on a rolling basis. You can pause or cancel the contract with a 30-day notice without any penalty."
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-ink/10 pb-4">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center text-left py-4 focus:outline-none group text-ink font-serif text-lg font-medium"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-ink-faint group-hover:text-ink transition-transform duration-300 ${
                    faqOpen[index] ? "rotate-180" : ""
                  }`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${
                  faqOpen[index] ? "max-h-[200px] mt-2 opacity-100" : "max-h-0 opacity-0"
                }`}>
                  <p className="text-sm font-sans text-ink-light pl-4 leading-relaxed font-light">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* LEAD INQUIRY ENQUIRY FORM */}
      <section id="contact" className="py-24 bg-cream border-t border-ink/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left side context */}
            <div className="lg:col-span-5 space-y-6">
              <span className="font-mono text-xs uppercase tracking-widest text-gold font-semibold block">
                Direct Enquiries
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-ink leading-tight">
                Deploy Your On-Ground <br />
                <span className="italic font-light text-ink-faint">Execution Arm</span>
              </h2>
              <p className="text-ink-light leading-relaxed text-sm font-light">
                Submit your product specifications or outline the exact difficulties you are experiencing with your existing manufacturers. Our on-ground representatives will verify factory operations, analyze your requirements, and deliver a comprehensive roadmap within 24 hours.
              </p>
            </div>

            {/* Enquiry Form Card */}
            <div className="lg:col-span-7 bg-cream border border-gold-dark/20 p-8 rounded-sm shadow-xl shadow-ink/5">
              
              {inquireStatus === "success" ? (
                <div className="text-center py-12 space-y-4 animate-fade-up">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                  <h3 className="font-serif text-3xl font-medium text-ink italic">Inquiry Received</h3>
                  <p className="text-sm text-ink-light max-w-md mx-auto leading-relaxed">
                    {inquireMsg}
                  </p>
                  <button
                    onClick={() => setInquireStatus("idle")}
                    className="font-mono text-xs uppercase tracking-widest text-gold-dark hover:text-ink font-semibold mt-4 block mx-auto underline underline-offset-4"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquireSubmit} className="space-y-6">
                  {inquireStatus === "error" && (
                    <div className="bg-red-50 border border-red-200 text-red-800 text-xs rounded p-4 flex gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <span>{inquireMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[9px] uppercase tracking-widest text-ink-faint mb-2">Your Name</label>
                      <input
                        type="text"
                        required
                        value={inquireForm.name}
                        onChange={(e) => setInquireForm({ ...inquireForm, name: e.target.value })}
                        placeholder="John Miller"
                        className="w-full bg-cream-dark border border-ink/10 rounded-sm py-3 px-4 text-sm text-ink outline-none focus:border-gold transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[9px] uppercase tracking-widest text-ink-faint mb-2">Email Address (Business or Personal)</label>
                      <input
                        type="email"
                        required
                        value={inquireForm.email}
                        onChange={(e) => {
                          const emailVal = e.target.value;
                          setInquireForm({ ...inquireForm, email: emailVal });
                          if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal) || emailVal === "") {
                            setEmailValidationError("");
                          }
                        }}
                        placeholder="john@importhub.com or john.miller@gmail.com"
                        className={`w-full bg-cream-dark border rounded-sm py-3 px-4 text-sm text-ink outline-none transition-all ${
                          emailValidationError ? "border-red-500 focus:border-red-500 ring-1 ring-red-500" : "border-ink/10 focus:border-gold"
                        }`}
                      />
                      {emailValidationError && (
                        <p className="text-red-600 font-mono text-[10px] mt-1 uppercase tracking-wider">{emailValidationError}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[9px] uppercase tracking-widest text-ink-faint mb-2">Inquiry Subject</label>
                      <input
                        type="text"
                        required
                        value={inquireForm.subject}
                        onChange={(e) => setInquireForm({ ...inquireForm, subject: e.target.value })}
                        placeholder="e.g. Supplier Audit Request"
                        className="w-full bg-cream-dark border border-ink/10 rounded-sm py-3 px-4 text-sm text-ink outline-none focus:border-gold transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[9px] uppercase tracking-widest text-ink-faint mb-2">Phone Number / WhatsApp</label>
                      <input
                        type="text"
                        value={inquireForm.phone}
                        onChange={(e) => setInquireForm({ ...inquireForm, phone: e.target.value })}
                        placeholder="+61 412 345 678"
                        className="w-full bg-cream-dark border border-ink/10 rounded-sm py-3 px-4 text-sm text-ink outline-none focus:border-gold transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[9px] uppercase tracking-widest text-ink-faint mb-2">Company / Individual Name</label>
                      <input
                        type="text"
                        value={inquireForm.company}
                        onChange={(e) => setInquireForm({ ...inquireForm, company: e.target.value })}
                        placeholder="e.g., Import Hub Ltd or Individual"
                        className="w-full bg-cream-dark border border-ink/10 rounded-sm py-3 px-4 text-sm text-ink outline-none focus:border-gold transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[9px] uppercase tracking-widest text-ink-faint mb-2">Target Product to Sourcing</label>
                      <input
                        type="text"
                        required
                        value={inquireForm.product}
                        onChange={(e) => setInquireForm({ ...inquireForm, product: e.target.value })}
                        placeholder="e.g. Ergonomic Chairs"
                        className="w-full bg-cream-dark border border-ink/10 rounded-sm py-3 px-4 text-sm text-ink outline-none focus:border-gold transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[9px] uppercase tracking-widest text-ink-faint mb-2">Target Sourcing budget</label>
                      <select
                        value={inquireForm.budget}
                        onChange={(e) => setInquireForm({ ...inquireForm, budget: e.target.value })}
                        className="w-full bg-cream-dark border border-ink/10 rounded-sm py-3.5 px-4 text-sm text-ink outline-none focus:border-gold transition-all"
                      >
                        <option value="Under $10,000">Under $10,000</option>
                        <option value="$10,000 - $50,000">$10,000 - $50,000</option>
                        <option value="$50,000 - $200,000">$50,000 - $200,000</option>
                        <option value="$200,000+">$200,000+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-mono text-[9px] uppercase tracking-widest text-ink-faint mb-2">Selected subscription tier</label>
                      <select
                        value={inquireForm.plan}
                        onChange={(e) => setInquireForm({ ...inquireForm, plan: e.target.value })}
                        className="w-full bg-cream-dark border border-ink/10 rounded-sm py-3.5 px-4 text-sm text-ink outline-none focus:border-gold transition-all"
                      >
                        <option value="Starter Plan — $499/mo">Starter Plan — $499/mo</option>
                        <option value="Growth Plan — $1,199/mo">Growth Plan — $1,199/mo</option>
                        <option value="Enterprise Plan — $2,499/mo">Enterprise Plan — $2,499/mo</option>
                        <option value="Custom consultation">Custom consultation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-ink-faint mb-2">Vendor difficulties / Sourcing specifications</label>
                    <textarea
                      rows={4}
                      value={inquireForm.message}
                      onChange={(e) => setInquireForm({ ...inquireForm, message: e.target.value })}
                      placeholder="My current manufacturer is delaying shipments. I need a ground representative to visit the factory and review batch quality..."
                      className="w-full bg-cream-dark border border-ink/10 rounded-sm py-3 px-4 text-sm text-ink outline-none focus:border-gold transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={inquireStatus === "submitting"}
                    className="w-full bg-ink hover:bg-gold text-cream hover:text-ink py-4 font-mono text-xs uppercase tracking-widest font-bold rounded-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-ink/15"
                  >
                    {inquireStatus === "submitting" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Logging Inquiry...
                      </>
                    ) : (
                      <>
                        Book Free Supply Chain Audit
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ink text-cream border-t border-cream/10 pt-24 pb-12 select-none">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 pb-16 border-b border-cream/10">
            {/* Brand */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-sm bg-gold flex items-center justify-center text-ink font-serif text-lg font-bold">
                  XA
                </div>
                <span className="font-serif text-2xl font-bold tracking-tight text-cream">
                  XinAo International Trade Co., Ltd.<span className="text-gold">.</span>
                </span>
              </div>
              <p className="text-xs text-cream/60 max-w-xl leading-relaxed font-light">
                XinAo International Trade Co., Ltd. ensures that the End-to-End Factory Sourcing & Strict On-Ground Governance workflow is seamless, legally bulletproof, and executed without intermediaries.
              </p>
              
              <div className="space-y-1 pt-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-gold block">
                  Registered Office
                </span>
                <p className="text-xs text-cream/75 leading-relaxed font-mono">
                  XinAo International Trade Co., Ltd.<br />
                  804-5, Building 1, No.188, Jinbaihua North Road,<br />
                  Xihu District, Hangzhou, People's Republic of China
                </p>
              </div>
            </div>

            {/* Support info */}
            <div className="lg:col-span-6 space-y-6 lg:text-right">
              <span className="font-mono text-[9px] uppercase tracking-widest text-gold block">
                Direct Contact Channels
              </span>

              <div className="flex flex-wrap gap-x-4 gap-y-3 justify-start lg:justify-end">
                {/* Voice Call Badge */}
                <a 
                  href="tel:+8618718924056"
                  className="group flex items-center gap-2.5 bg-cream-dark/5 px-4 py-2.5 rounded-sm border border-cream/10 hover:border-gold hover:bg-cream-dark/10 transition-all duration-300 cursor-pointer text-left"
                >
                  <Phone className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-cream/80 group-hover:text-gold transition-colors">Connect</span>
                </a>

                {/* WhatsApp Badge */}
                <a 
                  href="https://wa.me/8618718924056?text=Hi%2C%20I'd%20like%20to%20discuss%20sourcing%20coordination."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 bg-cream-dark/5 px-4 py-2.5 rounded-sm border border-cream/10 hover:border-gold hover:bg-cream-dark/10 transition-all duration-300 cursor-pointer text-left"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-cream/80 group-hover:text-gold transition-colors">WhatsApp</span>
                </a>

                {/* WeChat Badge */}
                <div 
                  onClick={() => {
                    navigator.clipboard.writeText("8618718924056");
                    setWechatCopied(true);
                    setTimeout(() => setWechatCopied(false), 3000);
                  }}
                  className="group flex items-center gap-2.5 bg-cream-dark/5 px-4 py-2.5 rounded-sm border border-cream/10 hover:border-gold hover:bg-cream-dark/10 transition-all duration-300 cursor-pointer text-left"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-cream/80 group-hover:text-gold transition-colors">
                    {wechatCopied ? "WeChat ID Copied!" : "WeChat"}
                  </span>
                </div>

                {/* Email Badge */}
                <a 
                  href="mailto:abdu@xinaointernational.com"
                  className="group flex items-center gap-2.5 bg-cream-dark/5 px-4 py-2.5 rounded-sm border border-cream/10 hover:border-gold hover:bg-cream-dark/10 transition-all duration-300 cursor-pointer text-left py-2.5"
                >
                  <Mail className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-cream/80 group-hover:text-gold transition-colors">Email</span>
                </a>

                {/* LinkedIn Badge */}
                <a 
                  href="https://www.linkedin.com/in/abdul-rahman-thakidiyil-muhamed-ismail-7b743a40b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 bg-cream-dark/5 px-4 py-2.5 rounded-sm border border-cream/10 hover:border-gold hover:bg-cream-dark/10 transition-all duration-300 cursor-pointer text-left"
                >
                  <Linkedin className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-cream/80 group-hover:text-gold transition-colors">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 font-mono text-[9px] text-cream/40 uppercase tracking-widest pt-8 border-t border-cream/5">
            <p>© 2026 XinAo International Trade Co., Ltd. All rights reserved.</p>
            <div className="flex items-center gap-3 font-mono text-[9px] tracking-[0.2em] select-none">
              <span className="text-cream/40 uppercase">Enabling Direct Trade</span>
              <span className="text-cream/20">|</span>
              <span className="text-gold font-semibold uppercase">Hangzhou, PRC</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating Active WhatsApp button */}
      <a
        href="https://wa.me/8618718924056?text=Hi%2C%20I'd%20like%20to%20schedule%20a%20free%20China%20Sourcing%20Audit."
        target="_blank"
        className="fixed bottom-6 right-6 p-4 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition-all duration-300 z-40 flex items-center justify-center"
        aria-label="Direct WhatsApp Contact"
      >
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.557-5.34 11.894-11.953 11.894-2.007-.001-3.977-.51-5.713-1.488L0 24zm6.59-3.791c1.558.924 3.1 1.411 4.717 1.411 5.309 0 9.632-4.321 9.635-9.63.001-2.572-1.002-4.99-2.824-6.812S13.918 2.378 12.011 2.377c-5.311 0-9.633 4.32-9.636 9.63-.001 1.702.457 3.361 1.32 4.868l-.872 3.19 3.226-.856zM17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
        </svg>
      </a>
    </div>
  );
}
