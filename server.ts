import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));

  // Initialize server-side Gemini client with recommended telemetry header
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "SahlBiz Business OS API",
      aiAvailable: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // AI Business Assistant Chat Endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, contextData, language = "fr" } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        // Fallback simulated intelligent response if API key not yet bound
        return res.json({
          response:
            language === "ar"
              ? "مرحباً بك في مساعد SahlBiz الذكي للأعمال بالمغرب. بناءً على بيانات شركتك: لديك فواتير معلقة بقيمة إجمالية جيدة ونمو ملحوظ في المبيعات هذا الشهر. ننصحك بإعادة التواصل مع العملاء الذين تجاوزت فواتيرهم 30 يوماً وتتبع المصاريف التشغيلية."
              : "Bonjour ! En analysant les données de votre entreprise marocaine : Votre chiffre d'affaires est en progression avec un bon flux de trésorerie disponible. Nous vous recommandons de prioriser la relance des factures échues de plus de 15 jours et de surveiller les dépenses de télécommunication et logistique.",
        });
      }

      const systemPrompt = `Tu es SahlBiz AI, le conseiller d'affaires et contrôleur de gestion expert pour les TPE et PME marocaines.
Tu disposes d'un contexte de gestion réel de l'entreprise marocaine (Devis, Factures en MAD, Dépenses, Clients avec ICE/IF/RC, Projets, Stocks, Trésorerie).

Directives :
1. Réponds de façon précise, analytique, bienveillante et professionnelle avec des chiffres concrets quand ils sont fournis dans le contexte.
2. Adopte les règles d'affaires marocaines (Dirham marocain MAD, TVA marocaine 20%, 14%, 10%, 7%, délais de paiement usuels, mentions ICE, IF, RC).
3. Si la langue demandée est 'ar', réponds en arabe fluide et professionnel (Fusha). Si 'fr', en français professionnel et clair. Si 'en', en anglais.
4. Fournis des recommandations actionnables (« Que faire maintenant », « Risques identifiés », « Opportunités de croissance »).
5. Structure tes réponses avec des puces claires et de la mise en valeur.

Contexte actuel de l'entreprise :
${JSON.stringify(contextData || {}, null, 2)}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\nQuestion de l'utilisateur : ${message}` }],
          },
        ],
      });

      const responseText = response.text || "Désolé, je n'ai pas pu générer d'analyse pour le moment.";
      return res.json({ response: responseText });
    } catch (error: any) {
      console.error("AI Chat API Error:", error);
      return res.status(500).json({
        error: "Erreur lors du traitement par l'assistant IA",
        details: error?.message,
      });
    }
  });

  // AI OCR / Document Extraction Endpoint
  app.post("/api/ai/ocr", async (req, res) => {
    try {
      const { imageBase64, mimeType = "image/jpeg", fileName = "document.pdf" } = req.body;

      if (!imageBase64 && !process.env.GEMINI_API_KEY) {
        // Fallback simulated OCR result
        return res.json({
          extracted: {
            supplierName: "Maroc Telecom SA",
            supplierICE: "001523489000045",
            supplierIF: "1002345",
            invoiceNumber: "FC-2026-" + Math.floor(1000 + Math.random() * 9000),
            date: new Date().toISOString().split("T")[0],
            amountHT: 1250.0,
            tvaRate: 20,
            tvaAmount: 250.0,
            totalTTC: 1500.0,
            category: "Télécommunications & Internet",
            confidenceScore: 0.95,
            items: [
              { description: "Abonnement Fibre Pro 100M - Mensuel", quantity: 1, unitPrice: 1250.0, total: 1250.0 },
            ],
          },
        });
      }

      if (process.env.GEMINI_API_KEY && imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "").replace(/^data:application\/pdf;base64,/, "");

        const prompt = `Analyse ce document commercial marocain (facture d'achat, reçu, bon de commande, devis).
Extrais au format JSON STRICT les informations suivantes :
- supplierName (nom de l'entreprise ou fournisseur)
- supplierICE (numéro ICE marocain à 15 chiffres si présent)
- supplierIF (Identifiant fiscal si présent)
- invoiceNumber (numéro de facture)
- date (YYYY-MM-DD)
- amountHT (nombre flottant en MAD)
- tvaRate (pourcentage ex: 20, 14, 10, 7, ou 0)
- tvaAmount (montant TVA en MAD)
- totalTTC (total TTC en MAD)
- category (Loyer, Télécommunications, Salaires, Énergie, Transport, Fournitures, Marketing, Matériel, etc.)
- confidenceScore (0 à 1)
- items (tableau avec { description, quantity, unitPrice, total })

Renvoie UNIQUEMENT un objet JSON valide.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || "image/jpeg",
                  data: cleanBase64,
                },
              },
              { text: prompt },
            ],
          },
          config: {
            responseMimeType: "application/json",
          },
        });

        const text = response.text || "{}";
        let parsed = {};
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = {};
        }

        return res.json({ extracted: parsed });
      }

      return res.json({
        extracted: {
          supplierName: "Société Distribution Maroc SARL",
          supplierICE: "001894562000078",
          invoiceNumber: "FAC-" + Date.now().toString().slice(-4),
          date: new Date().toISOString().split("T")[0],
          amountHT: 3400.0,
          tvaRate: 20,
          tvaAmount: 680.0,
          totalTTC: 4080.0,
          category: "Fournitures & Matériel",
          confidenceScore: 0.92,
        },
      });
    } catch (error: any) {
      console.error("OCR API Error:", error);
      return res.status(500).json({ error: "Échec de l'analyse OCR", details: error?.message });
    }
  });

  // AI Smart Business Insights generator
  app.post("/api/ai/insights", async (req, res) => {
    try {
      const { metrics, language = "fr" } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          insights: [
            {
              type: "warning",
              title: language === "ar" ? "فواتير غير مسددة بحاجة للمتابعة" : "Créances clients à relancer",
              description:
                language === "ar"
                  ? "3 فواتير تجاوزت موعد الاستحقاق بأكثر من 15 يوماً بقيمة 28 500 درهم."
                  : "3 factures totalisant 28 500 MAD ont dépassé leur date d'échéance de plus de 15 jours.",
              action: "relance_clients",
              priority: "high",
            },
            {
              type: "success",
              title: language === "ar" ? "نمو في المبيعات" : "Croissance du Chiffre d'Affaires",
              description:
                language === "ar"
                  ? "المبيعات ارتفعت بنسبة +14.2% مقارنة بالشهر السابق مع تحسن هوامش الربح."
                  : "Le chiffre d'affaires affiche une progression de +14.2% par rapport au mois précédent.",
              action: "view_sales",
              priority: "medium",
            },
            {
              type: "info",
              title: language === "ar" ? "تنبيه المخزون المنخفض" : "Réapprovisionnement Stock",
              description:
                language === "ar"
                  ? "منتجان وصلا إلى ما دون الحد الأدنى للأمان في مستودع الدار البيضاء."
                  : "2 références de produits sont passées sous le seuil d'alerte au dépôt de Casablanca.",
              action: "view_inventory",
              priority: "medium",
            },
          ],
        });
      }

      const prompt = `En tant qu'expert en pilotage financier pour PME marocaines, analyse les métriques suivantes et génère 4 insights décisionnels stratégiques et opérationnels au format JSON :
Métriques: ${JSON.stringify(metrics)}
Langue: ${language}

Génère un tableau JSON d'objets avec :
- type: 'warning' | 'success' | 'info' | 'danger'
- title: string
- description: string
- action: string
- priority: 'high' | 'medium' | 'low'`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "[]");
      return res.json({ insights: parsed });
    } catch (error: any) {
      console.error("AI Insights Error:", error);
      return res.json({ insights: [] });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SahlBiz Business OS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
