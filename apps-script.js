/**
 * This script is intended to be used with Google Apps Script to log data from a web app to a Google Sheet.
 */

function ensureSheetExists(sheetName, type) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);

  // If sheet doesn't exist, create it and add headers
  if (!sheet) {
    if (type === "feedback") {
      sheet = ss.insertSheet(sheetName);

      // Set headers
      sheet.getRange("A1").setValue("TIMESTAMP");
      sheet.getRange("B1").setValue("TEXT");

      // Format headers
      const headerRange = sheet.getRange("A1:B1");
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#E8E8E8");

      // Freeze the header row
      sheet.setFrozenRows(1);

      // Adjust column widths
      sheet.setColumnWidth(1, 150); // Timestamp
      sheet.setColumnWidth(2, 300); // Text
    } else {
      sheet = ss.insertSheet(sheetName);

      // Set headers
      sheet.getRange("A1").setValue("TIMESTAMP");
      sheet.getRange("B1").setValue("TEXT");
      sheet.getRange("C1").setValue("SENTIMENT");
      sheet.getRange("D1").setValue("RATING");

      // Format headers
      const headerRange = sheet.getRange("A1:D1");
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#E8E8E8");

      // Freeze the header row
      sheet.setFrozenRows(1);

      // Adjust column widths
      sheet.setColumnWidth(1, 150); // Timestamp
      sheet.setColumnWidth(2, 300); // Text
      sheet.setColumnWidth(3, 100); // Sentiment
      sheet.setColumnWidth(4, 100); // Rating
    }

    Logger.log(`Created new sheet: ${sheetName} with headers`);
  }

  return sheet;
}

function doPost(e) {
  // Get the active spreadsheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    // Parse the incoming data
    const data = e.parameter;
    // const sheet = ss.getSheetByName(data.sheetName);
    const sheet = ensureSheetExists(data.sheetName || "Sheet1", data.type);

    // Add timestamp
    const timestamp = new Date();

    // Prepare the row data
    const rowData = [timestamp, data.textInput, data.sentiment, data.rating];

    // Append the row
    sheet.appendRow(rowData);

    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "Data logged successfully",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "success",
      message: "Service is running",
    })
  ).setMimeType(ContentService.MimeType.JSON);
}
