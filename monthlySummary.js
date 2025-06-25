function sendMonthlySummaryOnFirstDayOfMonth() {
  const today = new Date();

  if (today.getDate() === 1) {
    sendMonthlySummary()  
  }
}

function sendMonthlySummary() {
  let overviewSheet = tempSpreadsheet()
  let now = new Date()
  let readableMonth = Utilities.formatDate(new Date(now.getFullYear(), now.getMonth(), 0), Session.getScriptTimeZone(), "MMMM yyyy")
  let subject = `Financial Tracker Monthly Summary (${readableMonth})`

  let categoryChart = overviewSheet.getCharts()[0].getAs("image/png").setName("chart.png")
  MailApp.sendEmail({
    to: props.getProperty("myEmail"),
    subject: subject,
    htmlBody: createEmailHtml(subject, overviewSheet),
    inlineImages: {chart: categoryChart}
  })

  spreadsheet.deleteSheet(overviewSheet)
}

function createEmailHtml(subject, overviewSheet) {
  let categoryDataRange = overviewSheet.getRange("D5:G23")
  const displayValues = categoryDataRange.getDisplayValues()
  const backgrounds = categoryDataRange.getBackgrounds()
  let categoryChartHtml = ""

  for (let row = 0; row < displayValues.length; row++) {
    let tableRowHtml = "<tr>" 
    for (let col = 0; col < displayValues[row].length; col++) {
      if (col == 2) continue
      const cellValue = displayValues[row][col]
      const background = backgrounds[row][col]
      tableRowHtml += `<td style=\"padding: 10px; background-color: ${background}\">${cellValue}</td>`
    }
    tableRowHtml += "</tr>\n"
    categoryChartHtml += tableRowHtml
  }

  let html = `
    <h1>${subject}</h1>
    <p>${getIncompleteRowText() ?? ""}</p>

    <h3>Overview</h3>
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
      <tr>
        <th> </th>
        <th style="padding: 10px;">Amount</th>
        <th style="padding: 10px;" >Percentage Change from Previous</th>
      </tr>
      <tr>
        <th style="padding: 10px;">Spending</th>
        <td style="padding: 10px; ">${overviewSheet.getRange("A5").getDisplayValue()}</td>
        <td style="padding: 10px; background-color: ${overviewSheet.getRange("B5").getBackground()} ">${overviewSheet.getRange("B5").getDisplayValue()}</td>
      </tr>
      <tr>
        <th style="padding: 10px;">Net Earnings</th>
        <td style="padding: 10px; ">${overviewSheet.getRange("A9").getDisplayValue()}</td>
        <td style="padding: 10px; background-color: ${overviewSheet.getRange("B9").getBackground()} ">${overviewSheet.getRange("B9").getDisplayValue()}</td>
      </tr>
      <tr>
        <th style="padding: 10px;">Savings rate</th>
        <td style="padding: 10px; ">${overviewSheet.getRange("A12").getDisplayValue()}</td>
        <td style="padding: 10px; background-color: ${overviewSheet.getRange("B12").getBackground()} ">${overviewSheet.getRange("B12").getDisplayValue()}</td>
      </tr>
    </table>

    <h3>By category</h3>
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
      <tr>
        <th style="padding: 10px;">Category</th>
        <th style="padding: 10px;">Amount</th>
        <th style="padding: 10px;">Percentage Change from Previous</th>
      </tr>
      ${categoryChartHtml}
    </table>
    <img src="cid:chart">
  `

  return html
}

function tempSpreadsheet() {
  let timeframeSheet = spreadsheet.getSheetByName("overview-timeframe")
  let tempSheet = timeframeSheet.copyTo(spreadsheet)
  tempSheet.setName("TEMP-monthly-summary")
  tempSheet.getRange("A2").setValue(getFirstDayOfPreviousMonth())
  tempSheet.getRange("B2").setValue(getLastDayOfPreviousMonth())
  return tempSheet
}

function getFirstDayOfPreviousMonth() {
  const now = new Date();
  const firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  return formatDateToOverviewFormat(firstDayPrevMonth)
}

function getLastDayOfPreviousMonth() {
  const now = new Date();
  // Day 0 of the current month gives you the last day of the previous month
  const lastDayPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  return formatDateToOverviewFormat(lastDayPrevMonth)
}

function formatDateToOverviewFormat(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  const formatted = `${month}/${day}/${year}`;
  return formatted;
}