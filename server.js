import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, aiConfigured: Boolean(client) });
});

app.post("/api/generate", async (req, res) => {
  try {
    if (!client) {
      return res.status(503).json({
        error: "AI API key configure nahi hai. Server par OPENAI_API_KEY set karo."
      });
    }

    const { category, format, language, topic, style, output } = req.body || {};
    if (!category || !format || !language || !topic) {
      return res.status(400).json({ error: "Category, format, language aur topic zaroori hain." });
    }

    const prompt = `You are the content strategist and scriptwriter for the Hindi YouTube channel Shakti Prerna5.
Create a practical, original YouTube video package.
Channel focus: Hindu mythology, temple mysteries, devotional stories.
Category: ${category}
Format: ${format}
Language: ${language}
Topic: ${topic}
Visual style: ${style || "Cinematic photorealistic, warm gold and teal"}
Requested output: ${output || "complete package"}

Rules:
- Do not claim that the video will go viral or invent live trend statistics.
- Separate verified historical/scriptural facts from beliefs and legends. Mark uncertain claims as "मान्यता है" or "कथा के अनुसार".
- Never invent citations, sources, dates, archaeological findings, or quotes. Add a "Sources to verify" section with source types/names to check, and say when a claim needs verification.
- Make the hook compelling but truthful.
- For Shorts, aim for 35–45 seconds with a hook in the first 2 seconds and a loop-friendly ending.
- For long-form, provide a clear narrative structure and AI video scene prompts of exactly 10 seconds each.
- Include title, hook, voiceover script, scene-by-scene visual prompts, thumbnail prompt, SEO description, relevant tags, pinned comment, and fact-check notes.
- Use clear headings and output in the requested language.
- Avoid keyword stuffing and irrelevant trending tags.`;

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      input: prompt
    });

    res.json({ text: response.output_text || "No text returned." });
  } catch (err) {
    console.error("AI generation error:", err?.message || err);
    res.status(500).json({ error: "AI generation failed. Server logs check karo aur API configuration verify karo." });
  }
});


app.post("/api/trends", async (req, res) => {
  try {
    if (!client) {
      return res.status(503).json({ error: "Server par OPENAI_API_KEY configure karo." });
    }
    const category = String(req.body?.category || "Hindu mythology").slice(0, 120);
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      tools: [{ type: "web_search" }],
      input: `Search the web for current YouTube content opportunities in India related to "${category}" for a Hindi devotional/mythology channel. Give 8 topic ideas based on recent public signals you can actually verify. For each: topic, why it may be timely, a suggested hook, and sources/links with dates where available. Clearly distinguish verified current events/search signals from evergreen ideas. Do not claim YouTube view counts or trend rankings unless the source explicitly supports them. Respond in Hindi.`
    });
    res.json({ text: response.output_text || "No research text returned." });
  } catch (err) {
    console.error("Trend research error:", err?.message || err);
    res.status(500).json({ error: "Trend research failed. API model/tools access check karo." });
  }
});

app.listen(port, () => console.log(`Shakti Prerna AI Studio running on http://localhost:${port}`));
