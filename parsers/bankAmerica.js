function parseBankAmerica(messageBody, emailId) {
  let amountRegex = /Amount: \*\$(.*)\*/; 
  let dateRegex = /Date: \*(.*)\*/;
  let descriptionRegex = /Where: \*(.*)\*/;

  let amountMatches = messageBody.match(amountRegex);
  let dateMatches = messageBody.match(dateRegex)
  let descriptionMatches = messageBody.match(descriptionRegex)

  let fullAmt = parseFloat(amountMatches[1].replace(/,/g, ''))
  let desc = descriptionMatches[1]

  applyRuleAndWriteRow(
    "bankofamerica",
    formatFullDate(dateMatches[1]),
    desc,
    null,
    fullAmt,
    "B of A cc",
    emailId
  )
}

function testBankAmerica() {
  parseBankAmerica("")
}
