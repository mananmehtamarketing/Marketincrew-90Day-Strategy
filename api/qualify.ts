import type { VercelRequest, VercelResponse } from "@vercel/node";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.0-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

function parseJsonArray(text: string): string[] {
  // Try to extract JSON array from response (Gemini sometimes wraps in markdown)
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    // Try to find array in text
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch {
        // fallback
      }
    }
  }
  return [];
}

function parseJsonObject(text: string): Record<string, unknown> {
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        // fallback
      }
    }
  }
  return {};
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
  }

  const { type } = req.body;

  try {
    if (type === "challenges") {
      const { industry } = req.body;

      const systemPrompt = `You are a marketing consultant for MarketinCrew, a digital marketing agency.
Generate exactly 8 multiple-choice options representing common marketing challenges for businesses in the given industry.
Return ONLY a JSON array of strings. No markdown code fences, no explanation.
Each option should be concise (under 12 words).
Make them highly specific to the industry provided.`;

      const userPrompt = `Generate 8 marketing challenges for a business in the "${industry}" industry.`;

      const raw = await callGemini(systemPrompt, userPrompt);
      const options = parseJsonArray(raw);

      if (options.length === 0) {
        return res.status(200).json({
          options: [
            "Not getting enough leads",
            "Low social media engagement",
            "No clear marketing strategy",
            "Limited budget for marketing",
            "Don't know what's working and what's not",
            "Team bandwidth is stretched thin",
            "Poor website performance",
            "Inconsistent branding",
          ],
        });
      }

      return res.status(200).json({ options });
    }

    if (type === "currentSetup") {
      const { services } = req.body;

      const systemPrompt = `You are a marketing consultant for MarketinCrew, a digital marketing agency.
Generate exactly 8 multiple-choice options representing things a business might already have in place, based on the marketing services they're interested in.
Return ONLY a JSON array of strings. No markdown code fences, no explanation.
Each option should be concise (under 12 words).
Make them relevant to the specific services listed.`;

      const userPrompt = `The client is interested in these services: ${(services as string[]).join(", ")}. What marketing assets or tools might they already have in place? Generate 8 options.`;

      const raw = await callGemini(systemPrompt, userPrompt);
      const options = parseJsonArray(raw);

      if (options.length === 0) {
        return res.status(200).json({
          options: [
            "Active social media accounts",
            "Running paid ads",
            "Have a website",
            "Have a blog",
            "Use email marketing",
            "Have a CRM",
            "Use analytics tools",
            "None of the above",
          ],
        });
      }

      return res.status(200).json({ options });
    }

    if (type === "score") {
      const { formData } = req.body;

      const systemPrompt = `You are a lead qualification AI for MarketinCrew, a premium digital marketing agency.
Based on the following lead information, provide a qualification assessment.

Scoring guidelines:
- Budget of 1,00,000+ or 2,50,000+ per month = higher score (7-10)
- Timeline "Immediately" or "Within 2 weeks" = add 1-2 points
- Multiple services selected (3+) = add 1 point
- "Just Exploring" budget + "Just researching" timeline = lower score (2-4)
- Having existing marketing setup = higher score (more sophisticated client)
- Project-based budget with immediate timeline = moderate-high (6-8)

Return ONLY a JSON object (no markdown, no code fences) with this exact shape:
{
  "score": <number 1-10>,
  "summary": "<one line summary>",
  "priority": "<HOT or WARM or COLD>",
  "recommendedServices": ["<service1>", "<service2>"],
  "talkingPoints": ["<point1>", "<point2>", "<point3>"]
}`;

      const userPrompt = `Qualify this lead:
Name: ${formData.name}
Email: ${formData.email}
Industry: ${formData.industry}
Services interested: ${formData.services?.join(", ")}
Goals: ${formData.goals?.join(", ")}
Challenges: ${formData.challenges?.join(", ")}
Budget: ${formData.budget}
Timeline: ${formData.timeline}
Current setup: ${formData.currentSetup?.join(", ")}
Website/Description: ${formData.websiteOrDescription || "Not provided"}`;

      const raw = await callGemini(systemPrompt, userPrompt);
      const score = parseJsonObject(raw);

      // Ensure required fields exist
      const result = {
        score: typeof score.score === "number" ? score.score : 5,
        summary: typeof score.summary === "string" ? score.summary : "Lead requires manual review",
        priority: ["HOT", "WARM", "COLD"].includes(score.priority as string)
          ? score.priority
          : "WARM",
        recommendedServices: Array.isArray(score.recommendedServices)
          ? score.recommendedServices
          : formData.services || [],
        talkingPoints: Array.isArray(score.talkingPoints)
          ? score.talkingPoints
          : ["Review client goals", "Discuss budget alignment", "Propose 90-day plan"],
      };

      return res.status(200).json(result);
    }

    return res.status(400).json({ error: "Invalid request type" });
  } catch (error) {
    console.error("Qualify API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
