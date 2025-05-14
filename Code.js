const authorToParseFunc = {
  "no.reply.alerts@chase.com": parseChase,
  "venmo@venmo.com": parseVenmo,
  "no-reply@mail.safe.bcu.org": parseBcu,
  "capitalone@notification.capitalone.com": parseCapitalOne,
  "usbank@notifications.usbank.com": parseUsBank,
  "onlinebanking@ealerts.bankofamerica.com": parseBankAmerica
};

function getTransactionsForDay() {
  let myEmail = props.getProperty("myEmail")
  try {
    let gmailQuery = `label:${gmailLabel} newer_than:${daysBack}d older_than:0d`;
    let threads = GmailApp.search(gmailQuery);

    let floorTimestamp = timestampCell.getValue()
    let newMaxTimestamp = floorTimestamp
    
    for (let thread of threads) {
      let messages = thread.getMessages()
      for (let message of messages) {
        
        let timestamp = formatGmailDate(message.getDate())
        let id = message.getId()

        // console.log(message.getFrom())
        // console.log(timestamp)
        // console.log(floorTimestamp)
        // console.log("------------------------")

        // ignore older messages
        if (timestamp <= floorTimestamp) {
          continue;
        }

        if (timestamp > newMaxTimestamp) {
          newMaxTimestamp = timestamp;
        }

        let email = stripEmail(message.getFrom())

        if (email == myEmail && message.getSubject().toLowerCase().includes("ukg")) {
          let attachment = message.getAttachments()[0]
          parsePaystub(convertPDFToText(attachment.getName(), attachment), id)
        } else {
          console.log(email)
          let parseFunc = authorToParseFunc[email]
          if (!parseFunc) continue;
          let messageBody = message.getPlainBody()
          try {
            authorToParseFunc[email](messageBody, id)
          } catch (err) {
            console.log(err.stack)
            if (sendEmailOnError) {
              GmailApp.sendEmail(myEmail, "Expense Tracking Sheet Parse Error", err.stack)
            }
            writeErrorRowsToAllSheets(messageBody, err)
          }
        }
      }
    } 

    if(!ignoreForDebug) timestampCell.setValue(newMaxTimestamp)
  } catch (err) {
    console.log(err.stack)
    if (sendEmailOnError) {
      GmailApp.sendEmail(myEmail, "Expense Tracking Sheet Error", err.stack)
    }
  }
}

function stripEmail(pretty) {
  if (!pretty.includes('<')) return pretty
  let emailRegex = /<(.*)>/;
  return pretty.match(emailRegex)[1]
}

function writeErrorRowsToAllSheets(message, err) {
  const delimiter = "xxxxxxxxxxxxxx"
  const messageTxt = `Error parsing message: ${message}`
  const row = [delimiter, messageTxt, err.stack]
  incomeSheet.appendRow(row),
  transactionSheet.appendRow(row)
}