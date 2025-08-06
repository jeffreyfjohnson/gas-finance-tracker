function remind() {
  let emailText = getIncompleteRowText()

  if (emailText) sendReminderEmail(emailText)
}

function getIncompleteRowText() {
  let lastTransactionRow = transactionSheet.getLastRow()
  let noCategoryRows = []
  for (let i = 1; i <= lastTransactionRow; i++) {
    let cell = transactionSheet.getRange(i, 5)
    if (cell.isBlank()) {
      noCategoryRows.push(`Row ${i}`)
    }
  }

  let lastIncomeRow = incomeSheet.getLastRow()
  let noIncomeDescRows = []
  for (let i = 1; i <= lastIncomeRow; i++) {
    let cell = incomeSheet.getRange(i, 2)
    if (!/[a-zA-Z]/.test(cell.getValue().toString())) {
      noIncomeDescRows.push(`Row ${i}`)
    }
  }

  if (noCategoryRows.length <= 0 && noIncomeDescRows.length <= 0) return null

  let emailText = `
  You have ${noCategoryRows.length} expenses without categories, and ${noIncomeDescRows.length} income rows without descriptions.

  Expenses: 
  ${noCategoryRows}

  Income:
  ${noIncomeDescRows}

  Click the link below to fix

  ${spreadsheet.getUrl()}
  `

  return emailText
}

function sendReminderEmail(text) {
  const myEmail = props.getProperty("myEmail")
  GmailApp.sendEmail(myEmail, "Expense Tracking Sheet Needs Attention", text)
}
