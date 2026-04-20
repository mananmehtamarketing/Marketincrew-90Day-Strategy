// =============================================================
// Google Apps Script - Lead Qualification Webhook
// =============================================================
// SETUP INSTRUCTIONS:
// 1. Go to https://script.google.com and create a new project
// 2. Paste this entire code into Code.gs
// 3. Click "Deploy" > "New deployment"
// 4. Select type: "Web app"
// 5. Set "Execute as": Me
// 6. Set "Who has access": Anyone
// 7. Click "Deploy" and copy the Web App URL
// 8. Add that URL as GOOGLE_SCRIPT_URL env var in Vercel
// =============================================================

const NOTIFICATION_EMAIL = "manan.mehta@marketincrew.com";
const SHEET_NAME = "Lead Submissions";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // 1. Log to Google Sheet
    logToSheet(data);

    // 2. Send email notification
    sendNotification(data);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "ok" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function logToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  // Create sheet with headers if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Timestamp",
      "Name",
      "Email",
      "WhatsApp",
      "Website/Description",
      "Industry",
      "Services",
      "Goals",
      "Challenges",
      "Budget",
      "Timeline",
      "Current Setup",
      "AI Score",
      "AI Priority",
      "AI Summary",
      "Recommended Services",
      "Talking Points",
    ]);
    // Bold the header row
    sheet.getRange(1, 1, 1, 17).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name || "",
    data.email || "",
    data.whatsapp || "",
    data.websiteOrDescription || "",
    data.industry || "",
    data.services || "",
    data.goals || "",
    data.challenges || "",
    data.budget || "",
    data.timeline || "",
    data.currentSetup || "",
    data.aiScore || "",
    data.aiPriority || "",
    data.aiSummary || "",
    data.recommendedServices || "",
    data.talkingPoints || "",
  ]);
}

function sendNotification(data) {
  const priority = data.aiPriority || "UNKNOWN";
  const score = data.aiScore || "N/A";
  const name = data.name || "Unknown";
  const industry = data.industry || "Not specified";

  const subject = "[" + priority + "] New Lead: " + name + " - " + industry;

  const body =
    "NEW LEAD SUBMISSION\n" +
    "==================\n\n" +
    "Priority: " + priority + "\n" +
    "AI Score: " + score + "/10\n" +
    "Summary: " + (data.aiSummary || "N/A") + "\n\n" +
    "CONTACT INFO\n" +
    "------------\n" +
    "Name: " + name + "\n" +
    "Email: " + (data.email || "N/A") + "\n" +
    "WhatsApp: " + (data.whatsapp || "N/A") + "\n" +
    "Website/Desc: " + (data.websiteOrDescription || "N/A") + "\n\n" +
    "BUSINESS DETAILS\n" +
    "----------------\n" +
    "Industry: " + industry + "\n" +
    "Services: " + (data.services || "N/A") + "\n" +
    "Goals: " + (data.goals || "N/A") + "\n" +
    "Challenges: " + (data.challenges || "N/A") + "\n" +
    "Budget: " + (data.budget || "N/A") + "\n" +
    "Timeline: " + (data.timeline || "N/A") + "\n" +
    "Current Setup: " + (data.currentSetup || "N/A") + "\n\n" +
    "AI RECOMMENDATIONS\n" +
    "------------------\n" +
    "Recommended Services: " + (data.recommendedServices || "N/A") + "\n" +
    "Talking Points: " + (data.talkingPoints || "N/A") + "\n";

  GmailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
}

// Test function - run this manually to verify setup
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        name: "Test Lead",
        email: "test@example.com",
        whatsapp: "+91 9876543210",
        websiteOrDescription: "Test business",
        industry: "SaaS & Technology",
        services: "SEO, Social Media",
        goals: "Generate More Leads",
        challenges: "Low engagement",
        budget: "50,000 - 1,00,000 / month",
        timeline: "Within 2 weeks",
        currentSetup: "Have a website",
        aiScore: "7",
        aiPriority: "HOT",
        aiSummary: "High-intent SaaS lead with solid budget",
        recommendedServices: "SEO, Social Media Management",
        talkingPoints: "Focus on lead gen; Discuss content strategy",
      }),
    },
  };
  doPost(testData);
}
