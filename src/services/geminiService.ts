import { GoogleGenAI, Type } from "@google/genai";
import { FormState } from "../types";

const GENAI_MODEL = "gemini-3-flash-preview";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. AI features may not work.");
      return null;
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function researchBusiness(name: string, website: string): Promise<{ summary: string; industry: string; country: string; currency: string }> {
  const ai = getAI();
  if (!ai) return { summary: "", industry: "", country: "", currency: "₹" };

  const prompt = `Research this business: "${name}". Website: ${website}. 
Find out their core products/services, target audience, industry, and location.
Provide:
1. A concise 2-3 sentence summary.
2. The primary industry (e.g., Fitness, Tech, Healthcare).
3. The country they are based in.
4. The likely currency for their budget (e.g., ₹ for India, $ for US, AED for UAE).`;

  try {
    const response = await ai.models.generateContent({
      model: GENAI_MODEL,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      tools: [{ googleSearch: {} }] as any,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            industry: { type: Type.STRING },
            country: { type: Type.STRING },
            currency: { type: Type.STRING }
          },
          required: ["summary", "industry", "country", "currency"]
        }
      }
    } as any);

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error researching business:", error);
    return { summary: "", industry: "", country: "", currency: "₹" };
  }
}

export async function generateAdaptiveOptions(
  type: "challenges" | "currentSetup", 
  context: string,
  research: string = ""
): Promise<string[]> {
  const ai = getAI();
  if (!ai) return [];

  const systemInstruction = `You are an assistant for MarketinCrew. 
Generate exactly 8 simple, straightforward multiple-choice options.
Use plain, everyday English. Each option MUST be under 7 words.
Avoid complex industry jargon or overly detailed scenarios.
Ensure they are relevant to the business but easy to read and select quickly.
Return ONLY a JSON array of strings.`;

  const prompt = type === "challenges" 
    ? `Business Research Background: ${research}
User's Industry/Context: ${context}
Generate 8 simple marketing challenges this business likely has. (e.g., "Need more clients", "Struggling with social media", "Ads are too expensive")`
    : `Business Research Background: ${research}
User's Interested Services: ${context}
Generate 8 simple things they might already have. (e.g., "Basic website", "Instagram page", "Running some Meta ads")`;

  try {
    const response = await ai.models.generateContent({
      model: GENAI_MODEL,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const result = JSON.parse(response.text);
    return Array.isArray(result) ? result.slice(0, 8) : [];
  } catch (error) {
    console.error("Error generating adaptive options:", error);
    return [];
  }
}

export async function scoreLead(formData: FormState) {
  const ai = getAI();
  if (!ai) return null;

  const systemInstruction = `You are a lead qualification AI for MarketinCrew, a premium digital marketing agency.
Based on the provided lead information, provide a qualification score and summary.
Return ONLY a JSON object.`;

  const prompt = `
Lead Information:
Name: ${formData.name}
Email: ${formData.email}
Industry: ${formData.industry} ${formData.otherIndustry ? `(${formData.otherIndustry})` : ''}
Services Interested: ${formData.services.join(", ")} ${formData.otherService ? `+ Other: ${formData.otherService}` : ''}
Goals: ${formData.goals.join(", ")} ${formData.otherGoal ? `+ Other: ${formData.otherGoal}` : ''}
Challenges: ${formData.challenges.join(", ")} ${formData.otherChallenge ? `+ Other: ${formData.otherChallenge}` : ''}
Budget: ${formData.budget}
Current Setup: ${formData.currentSetup.join(", ")} ${formData.otherSetup ? `+ Other: ${formData.otherSetup}` : ''}

Scoring heuristics:
- Budget "₹1,50,000+" or "₹7,50,000+" = higher score
- Timeline "Immediately" or "Within 2 weeks" = higher score
- Multiple services selected = higher score
- Having existing setup (website, social, ads) = higher score

Return as JSON:
{
  "score": number (1-10),
  "summary": string (one-line),
  "priority": "HOT" | "WARM" | "COLD",
  "recommendedServices": string[],
  "talkingPoints": string[]
}`;

  try {
    const response = await ai.models.generateContent({
      model: GENAI_MODEL,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            priority: { type: Type.STRING, enum: ["HOT", "WARM", "COLD"] },
            recommendedServices: { type: Type.ARRAY, items: { type: Type.STRING } },
            talkingPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "summary", "priority", "recommendedServices", "talkingPoints"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error scoring lead:", error);
    return null;
  }
}

