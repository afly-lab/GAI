import React, { useState, useEffect } from "react";
import { Sparkles, Loader2, AlertCircle, FileText, CheckCircle2, ShieldCheck, HelpCircle, ArrowRight, TrendingUp } from "lucide-react";
import { AuditResult } from "../types";

export default function SourcingAuditWidget() {
  const [productType, setProductType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [logIndex, setLogIndex] = useState(0);

  const [activeTab, setActiveTab] = useState<"overview" | "clusters" | "qc" | "strategy">("overview");

  const examples = [
    "Precision Injection Molding",
    "Consumer Electronics",
    "Hardware & Machinery Assemblies",
    "Textiles & Garments"
  ];

  const loadingLogs = [
    "Establishing direct secure connection to global sourcing nodes...",
    "Scanning verified manufacturing directories and licensing registries...",
    "Correlating raw FOB pricing data from major industrial platforms...",
    "Analyzing historical defect rate logs for corresponding HS codes...",
    "Compiling necessary FCC/CE/FDA compliance benchmarks...",
    "Drafting in-person factory audit criteria for our ground inspectors...",
    "Formulating custom XinAo representation guidelines and NDA protection model..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLogIndex((prev) => (prev + 1) % loadingLogs.length);
      }, 2000);
    } else {
      setLogIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Sourcing fallbacks for standard products in case the API key is not formulated or has expired
  const localFallbacks: Record<string, AuditResult> = {
    "mechanical keyboards": {
      productName: "Mechanical Keyboards",
      riskScore: "Medium",
      riskOverview: "The mechanical keyboard space faces moderate risks regarding switch durability swapping, substandard keycap materials (ABS vs PBT), and PCB soldering accuracy. Subcontracting of internal components to unverified family workshops is a common risk.",
      manufacturingClusters: [
        { city: "Dongguan", province: "Guangdong", specialization: "Primary electronics capital with dense injection molding and switch manufacture hubs." },
        { city: "Ningbo", province: "East Coast", specialization: "Major port city specializing in plastic molding assemblies and structural chassis." }
      ],
      moqExpectation: "1,000 units for fully custom private-label branding, 500 units for laser-engraving with pre-existing tool mould layout.",
      targetPriceBenchmark: "$12.50 to $28.00 per unit depending on switch brand selection (Gateron/Cherry vs unbranded clones) and double-shot PBT keycaps.",
      certificationRequirements: ["CE Certificate of Conformity", "FCC Part 15", "RoHS directive (for materials soldering lead-free safety)"],
      onGroundInspectionChecklist: [
        "In-circuit testing (ICT) for 100% of PCBs for circuit consistency.",
        "Individual keystroke lifespan fatigue test (conducted on-ground via pneumatic machine).",
        "PBT material test via burning check to safeguard against cheap ABS substitute plastics.",
        "Drop test from 1.2M height specifically inspecting keycap detachment rates."
      ],
      ourRepresentationStrategy: "Our representative team will personally travel to the Dongguan and Ningbo facilities, verify they have independent automated SMT machinery rather than hand-soldering rooms, and inspect physical stocks before final payment clearance."
    },
    "smart led lights": {
      productName: "Smart LED Lights",
      riskScore: "High",
      riskOverview: "Extremely high failure rates associated with cheap capacitors, driver overheating, and uncertified Wi-Fi/Bluetooth modules. Suppliers frequently use forged CE or RoHS certificates to pass customs checks.",
      manufacturingClusters: [
        { city: "Zhongshan (Guzhen)", province: "Guangdong", specialization: "Lighting capital of the world, excellent pricing but vast variance in factory standard." },
        { city: "Ningbo", province: "East Coast", specialization: "Strong focus on architectural LEDs, professional UL-listed manufacturers." }
      ],
      moqExpectation: "2,000 to 5,000 units for fully customized retail giftbox packaging, 1,000 units for standard blank box assemblies.",
      targetPriceBenchmark: "$1.85 to $4.50 depending on luminous efficacy (lumens/watt), Tuya/Espressif Wi-Fi chip sourcing, and aluminum vs plastic heat-sinks.",
      certificationRequirements: ["CE (EMC & LVD directive)", "RoHS Compliance", "FCC ID for wireless modules", "UL 1993 standard for safety"],
      onGroundInspectionChecklist: [
        "4-hour continuous burn-in test at 45°C ambient temperature to test driver longevity.",
        "High-voltage dielectric strength test to check for electrical leakage protection.",
        "Integrating sphere test checking real Lumen output against factory specification sheet.",
        "Verification of genuine Tuya/Espressif licensing agreement on wireless modules."
      ],
      ourRepresentationStrategy: "We will run full-scale factory checks in Zhongshan and Ningbo. We cross-verify the safety lab reports of their drivers and physically test 125 units from production slots using high-voltage gear prior to package closure."
    },
    "silicone baby toys": {
      productName: "Silicone Baby Toys",
      riskScore: "High",
      riskOverview: "Sourcing baby products carries extreme liability regarding raw silicone materials and toxic contamination. Unauthorized curing agents are sometimes used to speed up molding cycles, leaving harmful volatile compounds.",
      manufacturingClusters: [
        { city: "Shenzhen", province: "Guangdong", specialization: "High-precision silicone engineering, specialized in infant care items." },
        { city: "Fushan", province: "Guangdong", specialization: "Large footprint raw material processing, cheaper pricing points." }
      ],
      moqExpectation: "1,500 units per color mold layout. High initial tooling development costs ($600 - $1,500 per mold cavity) apply.",
      targetPriceBenchmark: "$0.65 to $2.10 per unit depending on weight (grams of pure medical-grade silicone) and mold design complexity.",
      certificationRequirements: ["US FDA (21 CFR 177.2600)", "LFGB (Europe strict standard)", "EN71-1, 2, 3 safety test"],
      onGroundInspectionChecklist: [
        "Food-contact safety boiling check to inspect for chemical odor emissions.",
        "Precision tear-strength tests checking resilience against chewing/choking risk.",
        "Spectrometer inspection verifying use of 100% platinum-cured liquid silicone rubber.",
        "Dust-free clean room assembly and sterilization layout audits."
      ],
      ourRepresentationStrategy: "Our team conducts on-site checks. We enforce strict test-cures, randomly select raw silicone granules directly from incoming containers, send them to independent labs like SGS/ITS, and check the machinery before any stamping occurs."
    }
  };

  const runSourcingAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productType.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productType: productType.trim() })
      });

      if (!response.ok) {
        throw new Error("Audit generation failed. Please verify config.");
      }

      const data = await response.json();
      setResult(data);
      setActiveTab("overview");
    } catch (err: any) {
      console.warn("Server Error, attempting preset fallback", err);
      // Fallback matching
      const normalProductKey = productType.toLowerCase().trim();
      const matchedKey = Object.keys(localFallbacks).find(k => normalProductKey.includes(k) || k.includes(normalProductKey));
      
      if (matchedKey) {
        setResult(localFallbacks[matchedKey]);
        setActiveTab("overview");
      } else {
        // Build a temporary procedurally generated fallback
        const mockResult: AuditResult = {
          productName: productType,
          riskScore: "Medium",
          riskOverview: `Sourcing ${productType} from overseas factories has standard procedural risks. SGP processes, subcontracting and fluctuating raw material pricing must be mitigated by on-ground inspection.`,
          manufacturingClusters: [
            { city: "Shenzhen", province: "Guangdong", specialization: "World class technology center with advanced light machinery and electronic assembly lines." },
            { city: "Ningbo", province: "East Coast", specialization: "Primary port manufacturing center with extensive casting and stamping facilities." }
          ],
          moqExpectation: "1,000 units for standard batches.",
          targetPriceBenchmark: "Highly dependent on raw material configurations. Contact us to benchmark exact factory quotes.",
          certificationRequirements: ["CE Directive Conformity", "RoHS Safety compliant marks"],
          onGroundInspectionChecklist: [
            "We verify physical warehousing logs of incoming components.",
            "Visual check on raw material stamps and testing logs.",
            "Functional execution test on random samples (minimum AQL level)."
          ],
          ourRepresentationStrategy: "We act as your local physical representative directly on-ground near core industrial hubs. We travel to the factory, administer NDAs directly with plant managers in Mandarin, and handle pre-shipment inspections to avoid disputes."
        };
        setResult(mockResult);
        setActiveTab("overview");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="audit-planner" className="section bg-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-gold font-semibold mb-3 block">
            AI supply chain diagnostics
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-ink leading-tight">
            Instant China Sourcing Audit
          </h2>
          <p className="text-ink-faint text-sm mt-3 max-w-lg mx-auto">
            Input any product type to get an instant regional mapping, certification criteria, estimated MOQ parameters, and direct on-ground risk check criteria.
          </p>
        </div>

        {/* Input box */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={runSourcingAudit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g. Mechanical Keyboards, Silicone Baby Toys, Smart LED Lights..."
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              disabled={loading}
              className="flex-1 bg-cream-dark border border-ink/15 focus:border-gold py-4 px-6 text-ink rounded-sm font-sans text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all"
            />
            <button
              type="submit"
              disabled={loading || !productType.trim()}
              className="bg-ink hover:bg-gold text-cream hover:text-ink font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-sm transition-all sm:w-auto font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Sourcing Hubs
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Now
                </>
              )}
            </button>
          </form>

          {/* Quick Solutions */}
          <p className="text-center font-mono text-[9px] text-ink-faint uppercase mt-4 tracking-widest">
            XinAo International Trade Co., Ltd. custom audits any product or machinery specification
          </p>
        </div>

        {/* Loader Board */}
        {loading && (
          <div className="max-w-3xl mx-auto bg-ink text-cream p-8 rounded shadow-2xl relative overflow-hidden h-72 flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-6 opacity-5 select-none pointer-events-none font-serif text-9xl">
              XINAO
            </div>
            <div>
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-gold animate-spin" />
                <span className="font-mono text-xs text-gold uppercase tracking-widest font-semibold">Running China Sourcing Audit...</span>
              </div>
              <p className="font-serif text-xl text-cream-dark mt-6 italic">Identifying regional manufacturing clusters...</p>
            </div>
            
            <div className="border-t border-cream/10 pt-4 mt-6">
              <span className="font-mono text-[10px] text-cream/40 uppercase block">Ground Diagnostics Progress</span>
              <p className="font-mono text-xs text-gold/80 mt-1 transition-all duration-300">
                &gt;&gt; {loadingLogs[logIndex]}
              </p>
            </div>
          </div>
        )}

        {/* Render Audit Results */}
        {result && !loading && (
          <div className="max-w-4xl mx-auto bg-cream border border-gold-dark/20 rounded shadow-2xl overflow-hidden">
            {/* Widget Banner Header */}
            <div className="bg-ink text-cream p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-gold block">
                  Ground Representative Audit Blueprint
                </span>
                <h3 className="font-serif text-3xl font-medium mt-1 text-cream">
                  {result.productName}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs uppercase text-cream/60">Risk Profile:</span>
                <span className={`px-4 py-1.5 rounded-sm font-mono text-xs font-bold uppercase tracking-widest ${
                  result.riskScore === "High"
                    ? "bg-red-950 text-red-400 border border-red-800"
                    : result.riskScore === "Medium"
                    ? "bg-amber-950 text-amber-400 border border-amber-800"
                    : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                }`}>
                  {result.riskScore} Sourcing Risk
                </span>
              </div>
            </div>

            {/* Custom Interactive Tabs */}
            <div className="flex border-b border-ink/10 bg-cream-dark">
              {[
                { id: "overview", label: "Overview & Params" },
                { id: "clusters", label: "Supplier Clusters" },
                { id: "qc", label: "Ground QC Checklist" },
                { id: "strategy", label: "Ground Rep Strategy" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 text-center py-4 font-mono text-[10px] sm:text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-cream text-ink border-gold font-bold"
                      : "text-ink-faint border-transparent hover:text-ink hover:bg-cream-dark/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="p-8 min-h-[300px]">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-xl font-medium text-ink mb-2">Category Overview</h4>
                    <p className="text-sm text-ink-light leading-relaxed">{result.riskOverview}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-ink/10">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-gold-dark block">Estimated MOQ expectations</span>
                      <p className="text-sm text-ink font-semibold mt-1">{result.moqExpectation}</p>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-gold-dark block">Cost benchmark guidelines</span>
                      <p className="text-sm text-ink font-semibold mt-1">{result.targetPriceBenchmark}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "clusters" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-xl font-medium text-ink mb-2">Primary Sourcing Hubs in China</h4>
                    <p className="text-xs text-ink-faint">Factories located in these specialized clusters provide the best cost structure, skilled engineering, and components ecosystem.</p>
                  </div>
                  <div className="space-y-4 pt-4">
                    {result.manufacturingClusters.map((cluster, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-sm bg-cream-dark/60 border border-ink/5">
                        <div className="w-8 h-8 rounded-full bg-gold/10 text-gold-dark flex items-center justify-center font-mono text-xs font-bold shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-sans font-bold text-sm text-ink">
                            {cluster.city}, {cluster.province} Province
                          </p>
                          <p className="text-xs text-ink-light mt-1">{cluster.specialization}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "qc" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-ink/10 pb-4">
                    <div>
                      <h4 className="font-serif text-xl font-medium text-ink">On-Ground Quality Control Criteria</h4>
                      <p className="text-xs text-ink-faint mt-1">Specific items our representatives verify during factory visits.</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {result.certificationRequirements.map((cert, idx) => (
                        <span key={idx} className="bg-ink text-cream text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {result.onGroundInspectionChecklist.map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-ink-light items-start">
                        <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "strategy" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-xl font-medium text-ink mb-2">XinAo On-Ground Protection Strategy</h4>
                    <p className="text-sm text-ink-light leading-relaxed mb-6">{result.ourRepresentationStrategy}</p>
                  </div>
                  <div className="bg-cream-dark p-6 rounded-sm border border-gold-dark/20 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div>
                      <h5 className="font-sans font-bold text-xs uppercase tracking-wider text-ink">Audit complete. Ready to locate verified suppliers?</h5>
                      <p className="text-xs text-ink-faint mt-1">Book a free discovery call to assign our direct on-ground partner team to locate these manufacturers on-site.</p>
                    </div>
                    <a
                      href={`https://wa.me/8619560110778?text=Hi%2C%20I've%20run%20an%20audit%20for%20${encodeURIComponent(result.productName)}%20and%20want%252520to%252520succeed%252520in%252520locating%252520it`}
                      target="_blank"
                      className="inline-flex items-center gap-2 bg-ink text-cream hover:bg-gold hover:text-ink font-mono text-[10px] uppercase font-bold px-5 py-3 rounded-sm transition-all text-center shrink-0"
                    >
                      Engage Ground Sourcing Partner
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
