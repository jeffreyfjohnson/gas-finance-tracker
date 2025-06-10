function parseCapitalOne(messageBody, emailId) {
  let amountRegex = /amount of \$(\d{0,3}\,?\d{0,3}\.\d{2})/; 
  let dateRegex = /on (.*\d{1,2}\, \d{4}), at/;
  let descriptionRegex = /, at (.*)\,/;

  let amountMatches = messageBody.match(amountRegex);
  let dateMatches = messageBody.match(dateRegex)
  let descriptionMatches = messageBody.match(descriptionRegex)

  let fullAmt = parseFloat(amountMatches[1].replace(/,/g, ''))
  let desc = descriptionMatches[1]

  applyRuleAndWriteRow(
    "capitalone",
    formatFullDate(dateMatches[1]),
    desc,
    null,
    fullAmt,
    "Cap1 CC",
    emailId
  )
}

function testCap1() {
  parseCapitalOne("")
}