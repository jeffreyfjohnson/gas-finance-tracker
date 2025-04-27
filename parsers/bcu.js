function parseBcu(messageBody, emailId) {
  if (messageBody.includes("Pending charge")) {
    parseCC(messageBody, emailId)
  } else {
    parseChecking(messageBody, emailId)
  }
}

function parseChecking(messageBody, emailId) {
  let expectedTransactionCount = parseInt(messageBody.match(/(\d+) transaction\(s\)/)[1])
  let allTransactions = messageBody.split('\n').filter(line => line[0] === '$')

  if (allTransactions.length != expectedTransactionCount) {
    throw new Error(`expected ${allTransactions} (size ${allTransactions.length}) to be of size ${expectedTransactionCount}`)
  }

  let amountRegex = /\$(\d{0,3}\,?\d{0,3}\.\d{2})/
  let descriptionRegex = /(Deposit Dividend|Withdrawal|Draft|Deposit) (ACH|POS)?(.*)/
  let today = formatToday()

  for (let transaction of allTransactions) {
    let amount = parseFloat(transaction.match(amountRegex)[1].replace(/,/g, ""))
    let descriptionMatches = transaction.match(descriptionRegex)
    let extraData = descriptionMatches[1]
    let description = descriptionMatches[3].trim()
    applyRuleAndWriteRow(
      "bcu",
      today,
      description,
      extraData,
      amount,
      "bcu checking",
      emailId
    )
  }
}

function parseCC(messageBody, emailId) {
  let amountRegex = /charge for \$(\d{0,3}\,?\d{0,3}\.\d{2})/; 
  let dateRegex = /on (\d{2})\/(\d{2})\/(\d{4})/;
  let descriptionRegex = /at (.*) on/;

  let amountMatches = messageBody.match(amountRegex);
  let dateMatches = messageBody.match(dateRegex)
  let descriptionMatches = messageBody.match(descriptionRegex)

  let fullAmt = parseFloat(amountMatches[1].replace(/,/g, ''))
  let desc = descriptionMatches[1]
  applyRuleAndWriteRow(
    "bcu",
    `${dateMatches[3]}/${dateMatches[1]}/${dateMatches[2]}`,
    desc,
    null,
    fullAmt,
    "bcu cc expense",
    emailId
  )
}

function testBcu() {
  parseBcu("", "fake email ID")
}