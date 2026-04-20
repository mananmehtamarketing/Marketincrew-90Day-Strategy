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
      const payload = JSON.stringify({ formData, qualificationResult });

      // Google Apps Script returns a 302 redirect.
      // fetch converts POST to GET on 302, so doPost never fires.
      // Fix: follow the redirect manually with POST.
      const initial = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        redirect: "manual",
      });

      // If we get a redirect, re-POST to the new location
      if (initial.status >= 300 && initial.status < 400) {
        const redirectUrl = initial.headers.get("location");
        if (redirectUrl) {
          const result = await fetch(redirectUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
          });
          console.log("Apps Script response:", result.status);
        }
      } else {
        console.log("Apps Script response:", initial.status);
      }
    } catch (err) {
      console.error("Google Script notification failed:", err);
    }
  } else {
    console.log("GOOGLE_SCRIPT_URL not set");
  }

  return res.json({ success: true, message: "Notification processed" });
}
