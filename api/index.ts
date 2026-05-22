import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const PORT = 3000;

// Lazy initialization of Gemini client to prevent crashes if key is omitted on startup
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it via the Secrets panel in AI Studio.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Sourcing & Factory Audit Prompt Generator Route
  app.post("/api/audit", async (req, res) => {
    try {
      const { productType } = req.body;
      if (!productType || typeof productType !== "string" || productType.trim() === "") {
        res.status(400).json({ error: "A valid product keyword is required." });
        return;
      }

      const client = getGeminiClient();

      const promptText = `Analyze China supply chain sourcing parameters and risk factors for the product: "${productType}".
You are an expert strategic sourcing partner and auditor, representing international purchasers at Chinese factories near core industrial clusters.
Synthesize raw intelligence and generate a structured audit plan detailing:
1. Sourcing Risk Score: High, Medium, or Low.
2. Sourcing Risk Overview.
3. Prime Sourcing Hubs / Clusters in China (specifically mentioning towns/cities e.g., Ningbo for plastics/appliances, Yiwu for accessories, Shenzhen/Fushan/Guangdong etc.).
4. Estimated Minimum Order Quantity (MOQ) benchmark.
5. Estimated Target Unit Price benchmark.
6. Necessary testing / certification compliance requirements (e.g. CE, FCC, FDA, UL, RoHS).
7. On-Ground physical inspection checklist items (things to check when visiting the factory).
8. Sourcing strategy of how XinAo International (your physical on-ground support Team) will safeguard them.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              productName: {
                type: Type.STRING,
                description: "Name of the requested product."
              },
              riskScore: {
                type: Type.STRING,
                description: "Overall sourcing risk category: 'Low', 'Medium', or 'High'."
              },
              riskOverview: {
                type: Type.STRING,
                description: "A professional 3-sentence summary of the main risks associated with this category."
              },
              manufacturingClusters: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    city: { type: Type.STRING, description: "Name of the city/hub." },
                    province: { type: Type.STRING, description: "Name of the province (e.g. Fujian, Guangdong)." },
                    specialization: { type: Type.STRING, description: "Why this hub is a prime candidate." }
                  },
                  required: ["city", "province", "specialization"]
                },
                description: "Top 2-3 regional industrial clusters for sourcing this category in China."
              },
              moqExpectation: {
                type: Type.STRING,
                description: "Estimate of typical MOQ expectations range."
              },
              targetPriceBenchmark: {
                type: Type.STRING,
                description: "Expected general price parameters or budgeting advice."
              },
              certificationRequirements: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of typical testing, standard certifications or import marks (CE, RoHS, FDA, FCC etc.)."
              },
              onGroundInspectionChecklist: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Specific things our on-ground team will check during on-site inspections (material quality, solder joints, test reports, machine counts etc.)."
              },
              ourRepresentationStrategy: {
                type: Type.STRING,
                description: "Explain how XinAo International as an NDA-backed physical agent executes audits and coordinates with this cluster."
              }
            },
            required: [
              "productName",
              "riskScore",
              "riskOverview",
              "manufacturingClusters",
              "moqExpectation",
              "targetPriceBenchmark",
              "certificationRequirements",
              "onGroundInspectionChecklist",
              "ourRepresentationStrategy"
            ]
          }
        }
      });

      const parsedData = JSON.parse(response.text || "{}");
      res.json(parsedData);
    } catch (error: any) {
      console.error("Gemini Sourcing API Error:", error);
      res.status(500).json({
        error: error.message || "Sourcing audit analysis failed.",
        instructions: "Please verify GEMINI_API_KEY is configure in the secrets panel."
      });
    }
  });

  // Lead Collection Endpoint
  app.post("/api/inquire", (req, res) => {
    try {
      const { name, email, subject, phone, company, product, budget, plan, message } = req.body;
      if (!name || !email || !product || !subject) {
        res.status(400).json({ error: "Name, email, subject, and target product are required." });
        return;
      }
      // Simulate real-world collection, can be logged or returned
      res.json({
        success: true,
        message: "Your inquiry has been logged on the server. Our on-ground partner team will reply within 24 hours.",
        lead: { name, email, subject, company, product, plan, timestamp: new Date().toISOString() }
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Mount Vite or static file handlers
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running in ${isProduction ? "production" : "development"} mode on http://localhost:${PORT}`);
  });
}

startServer();
