import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { formData, qualificationResult } = req.body;
  const SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

  console.log("New Lead Notification:", formData?.name);

  if (SCRIPT_URL) {
    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, qualificationResult }),
      });
    } catch (err) {
      console.error("Google Script notification failed:", err);
    }
  }

  return res.json({ success: true, message: "Notification processed" });
}
