import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const PORT = 3000;

// Setup Namecheap Email Transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is required.");
    aiClient = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });
  }
  return aiClient;
}

const app = express();
app.use(express.json());

// Audit API
app.post("/api/audit", async (req, res) => {
  try {
    const { productType } = req.body;
    if (!productType) {
      res.status(400).json({ error: "A valid product keyword is required." });
      return;
    }

    const client = getGeminiClient();

    const promptText = `Analyze China supply chain sourcing parameters and risk factors for the product: "${productType}".
You are an expert strategic sourcing partner and auditor, representing international purchasers at Chinese factories near core industrial clusters.
Synthesize raw intelligence and generate a structured audit plan detailing:
1. Sourcing Risk Score: High, Medium, or Low.
2. Sourcing Risk Overview.
3. Prime Sourcing Hubs / Clusters in China.
4. Estimated Minimum Order Quantity (MOQ) benchmark.
5. Estimated Target Unit Price benchmark.
6. Necessary testing / certification compliance requirements.
7. On-Ground physical inspection checklist items.
8. Sourcing strategy of how XinAo International will safeguard them.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            riskScore: { type: Type.STRING },
            riskOverview: { type: Type.STRING },
            manufacturingClusters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  city: { type: Type.STRING },
                  province: { type: Type.STRING },
                  specialization: { type: Type.STRING }
                }
              }
            },
            moqExpectation: { type: Type.STRING },
            targetPriceBenchmark: { type: Type.STRING },
            certificationRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
            onGroundInspectionChecklist: { type: Type.ARRAY, items: { type: Type.STRING } },
            ourRepresentationStrategy: { type: Type.STRING }
          }
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Inquiry API
app.post("/api/inquire", async (req, res) => {
  try {
    const { name, email, subject, product, message } = req.body;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Lead: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nProduct: ${product}\nMessage: ${message}`
    });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Vite/Static Setup
if (!isProduction) {
  (async () => {
    const secretVite = "vi" + "te";
    const { createServer } = await import(secretVite);
    const vite = await createServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  })();
} else {
  app.use(express.static(path.join(process.cwd(), "dist")));
  app.get("*", (req, res) => res.sendFile(path.join(process.cwd(), "dist", "index.html")));
}

export default app;
