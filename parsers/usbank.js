function parseUsBank(messageBody, emailId) {
  // console.log(messageBody)
  let amountDescRegex = /charged \$(\d{0,3}\,?\d{0,3}\.\d{2})\s*at (.*)\.\s+A/; 

  let amountDescMatches = messageBody.match(amountDescRegex);
  let fullAmt = parseFloat(amountDescMatches[1].replace(/,/g, ''))
  let desc = amountDescMatches[2]

  applyRuleAndWriteRow(
    "usbank",
    formatToday(),
    desc,
    null,
    fullAmt,
    "US Bank CC",
    emailId,
  )
  
}

function testUsBank() {
  parseUsBank("", "fake email")
}
