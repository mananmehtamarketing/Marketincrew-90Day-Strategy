/**
 * GOOGLE APPS SCRIPT CODE
 * 
 * Instructions:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Paste this code
 * 4. Deploy as a Web App (Set "Execute as: Me" and "Who has access: Anyone")
 * 5. Update your environment variables or server code with the provided Web App URL
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var formData = data.formData;
    var qualification = data.qualificationResult || {};
    
    // 1. Log to Google Sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      new Date(),
      formData.name,
      formData.email,
      formData.whatsapp,
      formData.website || formData.businessDescription,
      formData.industry,
      formData.services.join(", "),
      formData.goals.join(", "),
      formData.challenges.join(", "),
      formData.budget,
      formData.timeline,
      formData.currentSetup.join(", "),
      qualification.score || "N/A",
      qualification.priority || "N/A",
      qualification.summary || "N/A",
      formData.bookingStatus
    ]);
    
    // 2. Send Email Notification
    var recipient = "manan.mehta@marketincrew.com";
    var subject = "[" + (qualification.priority || "NEW") + "] New Lead: " + formData.name + " -- " + formData.industry;
    
    var body = "You have a new lead from the Qualification App!\n\n" +
               "--- LEAD DETAILS ---\n" +
               "Name: " + formData.name + "\n" +
               "Email: " + formData.email + "\n" +
               "WhatsApp: " + formData.whatsapp + "\n" +
               "Website/Description: " + (formData.website || formData.businessDescription) + "\n" +
               "Industry: " + formData.industry + "\n" +
               "Services: " + formData.services.join(", ") + "\n" +
               "Budget: " + formData.budget + "\n" +
               "Timeline: " + formData.timeline + "\n\n" +
               "--- AI QUALIFICATION ---\n" +
               "Score: " + (qualification.score || "N/A") + "/10\n" +
               "Priority: " + (qualification.priority || "N/A") + "\n" +
               "Summary: " + (qualification.summary || "N/A") + "\n" +
               "Talking Points: " + (qualification.talkingPoints ? qualification.talkingPoints.join(". ") : "N/A") + "\n\n" +
               "--- STATUS ---\n" +
               "Calendar Link Clicked: " + (formData.bookingStatus === 'clicked' ? "YES" : "NO") + "\n";
    
    MailApp.sendEmail(recipient, subject, body);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
