let amountRegex = /(?:Amount \$)(.*)/;

function parseChase(messageBody, emailId) {
  let body = messageBody.toLowerCase()
  if (body.includes("transaction alert")) {
    parseChaseCC(messageBody, emailId)
  } else if (body.includes("transfer alert")) {
    parseChaseBankSent(messageBody, emailId)
  } else if (body.includes("deposit posted")) {
    parseChaseBankDeposit(messageBody, emailId)
  }
}

function parseChaseCC(messageBody, emailId) { 
  let last4Regex = /(\d{4})\)/;
  let dateRegex = /Date (.*) at/;
  let descriptionRegex = /Merchant (.*)/;

  let amountMatches = messageBody.match(amountRegex);
  let last4Matches = messageBody.match(last4Regex)
  let dateMatches = messageBody.match(dateRegex)
  let descriptionMatches = messageBody.match(descriptionRegex)

  let fullAmt = parseFloat(amountMatches[1].replace(/,/g, ''))
  let desc = descriptionMatches[1]
  let last4 = last4Matches[1]

  applyRuleAndWriteRow(
    "chase",
    formatDate(dateMatches[1]),
    desc,
    last4,
    fullAmt,
    `Chase ${last4}`,
    emailId,
  )
}

function parseChaseBankSent(messageBody, emailId) {
  let dateRegex = /Sent on (.*) at/;
  let descriptionRegex = /Recipient (.*)/;

  let amountMatches = messageBody.match(amountRegex);
  let dateMatches = messageBody.match(dateRegex)
  let descriptionMatches = messageBody.match(descriptionRegex)

  let fullAmt = parseFloat(amountMatches[1].replace(/,/g, ''))
  let desc = descriptionMatches[1]
  
  applyRuleAndWriteRow(
    "chase",
    formatDate(dateMatches[1]),
    desc,
    "sent",
    fullAmt,
    "Chase bank funds sent",
    emailId,
  )
}

function parseChaseBankDeposit(messageBody, emailId) {
  let dateRegex = /Posted (.*) at/;

  let amountMatches = messageBody.match(amountRegex);
  let dateMatches = messageBody.match(dateRegex)

  let fullAmt = parseFloat(amountMatches[1].replace(/,/g, ''))
  
  applyRuleAndWriteRow(
    "chase",
    formatDate(dateMatches[1]),
    "???",
    "deposit",
    fullAmt,
    "Chase bank funds deposit",
    emailId,
  )
}

function testChase() {
  parseChase(``, "fake email id")
}
