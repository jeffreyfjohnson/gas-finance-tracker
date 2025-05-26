function _setup() {
    createGmailFilters()
    let createdSpreadsheet = copySpreadsheet()
    createScriptProject(createdSpreadsheet.url, createdSpreadsheet.id)
  }
  
  const filtersToCreate = [
    {email: "no.reply.alerts@chase.com", subject: "transaction OR sent OR deposit"},
    {email: "venmo@venmo.com", subject: "paid"},
    {email: "no-reply@mail.safe.bcu.org", subject: "alert"},
    {email: "capitalone@notification.capitalone.com", subject: "transaction OR reward"},
    {email: "usbank@notifications.usbank.com", subject: "transaction"},
    {email: "onlinebanking@ealerts.bankofamerica.com", subject: "transaction"},
  ]
  
  function createGmailFilters() {
    const userId = 'me'; // "me" refers to the authenticated user
  
    const labelName = "financial-transactions"
  
    let labelId
    // First check if it exists
    const labels = Gmail.Users.Labels.list(userId).labels;
    const existing = labels.find(label => label.name === labelName);
    if (existing) {
      labelId = existing.id;
    } else {
      // If not, create it
      const newLabel = Gmail.Users.Labels.create({
        name: labelName,
        labelListVisibility: 'labelShow',
        messageListVisibility: 'show'
      }, userId);
  
      labelId = newLabel.id;
    }
  
    filtersToCreate.forEach(filterToCreate => {
        const filter = {
          criteria: {
            from: filterToCreate.email,
            subject: filterToCreate.subject
          },
          action: {
            removeLabelIds: ['INBOX', 'UNREAD'],
            addLabelIds: [labelId]
          }
        };
  
        Gmail.Users.Settings.Filters.create(filter, userId);
      }
    )
  }
  
  function copySpreadsheet() {
    const sourceFileId = '1Ulgv1zPzWj1FWTZlDs9SJcp0W7NUl14BVisanfR8qKs';
    const newName = 'Financial Transactions';
  
    const sourceFile = DriveApp.getFileById(sourceFileId);
    const copiedFile = sourceFile.makeCopy(newName);
  
    return {id: copiedFile.getId(), url: copiedFile.getUrl()}
  }
  
  function createScriptProject(spreadsheetUrl, spreadsheetId) {
      const githubUrl = 'https://github.com/jeffreyfjohnson/gas-finance-tracker/releases/latest/download/combined.js'; // URL to your GitHub file
      const myEmail = Session.getActiveUser().getEmail()
      
      // Fetch content from GitHub URL
      const response = UrlFetchApp.fetch(githubUrl);
      const fileContent = response.getContentText();
      const attachmentName = "combined.txt"
  
      const blob = Utilities.newBlob(fileContent, "text/plain", attachmentName)
  
      GmailApp.sendEmail(
        myEmail,
        "Finance Tracker Setup",
        `
        Your financial transaction tracking spreadsheet has been created here:
  
        ${spreadsheetUrl}
  
        Copy the entire contents of the attached "${attachmentName}" file into the Code.gs file of your Google Apps Script, completely replacing the previous content
  
        `,
        {
          attachments: [blob]
        }
      )
  
      const scriptProperties = PropertiesService.getScriptProperties();
  
      // Set some example properties
      scriptProperties.setProperties({
        'myEmail': myEmail,
        'spreadsheetId': spreadsheetId,
      });
  }
  
  