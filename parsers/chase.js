function parseChase(messageBody, emailId) {
  let amountRegex = /(?:Amount \$)(.*)/; 
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

function testChase() {
  parseChase(``, "fake email id")
}
