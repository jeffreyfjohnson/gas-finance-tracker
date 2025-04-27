var loadedRules = null

function applyRuleAndWriteRow(email, date, description, extraData, amt, src, emailId) {
  let rules = getSheetRules()
  
  for (let rule of rules) {
    // if the rule written in the spreadsheet has an email, and the email doesn't match it, then move past this rule
    if (rule.email && !email.toLowerCase().includes(rule.email)) continue
    if (rule.desc && !description.toLowerCase().includes(rule.desc)) continue
    if (extraData && (rule.extraData && !extraData.toLowerCase().includes(rule.extraData))) continue

    console.log(rule)

    switch (rule.action) {
      case "ignored":
        writeIgnoredRow(
          date,
          description,
          amt,
          rule.ignoreReason,
          src,
          emailId,
        )
        return
      case "income":
        writeIncomeRow(
          date,
          description,
          amt,
          src,
          email,
        )
        return
      default: 
        writeExpenseRow(
          date,
          description,
          amt * (rule.multiplier ?? 1.0),
          amt * (rule.sharedMultiplier ?? 1.0),
          categorize(description),
          src,
          emailId,
        ) 
        return
    }
  }

  // if no rule matches, default to expense
  writeExpenseRow(
    date,
    description,
    amt,
    amt,
    categorize(description),
    src,
    emailId,
  ) 
}

function getSheetRules() {
  if (loadedRules == null) {
    let lastRulesRow = rulesSheet.getLastRow()
    let rules = []
    for (let i = 2; i <= lastRulesRow; i++) {
      let email = rulesSheet.getRange(i, 1).getValue().toString().toLowerCase()
      let desc = rulesSheet.getRange(i, 2).getValue().toString().toLowerCase()
      let extraData = rulesSheet.getRange(i, 3).getValue().toString().toLowerCase()
      let action = rulesSheet.getRange(i, 4).getValue().toString().toLowerCase()
      let rawMultiplier = parseFloat(rulesSheet.getRange(i, 5).getValue())
      let multiplier = isNaN(rawMultiplier) ? null : rawMultiplier
      let rawSharedMultiplier = parseFloat(rulesSheet.getRange(i, 6).getValue())
      let sharedMultiplier = isNaN(rawSharedMultiplier) ? null : rawSharedMultiplier
      let ignoreReason = rulesSheet.getRange(i, 7).getValue().toString().toLowerCase()
      rules.push(
        { 
          email : email, 
          desc : desc, 
          extraData : extraData, 
          action : action, 
          multiplier : multiplier, 
          sharedMultiplier : sharedMultiplier,
          ignoreReason : ignoreReason
        }
      )
    }
    
    loadedRules = rules
  }
    
  return loadedRules
  
}

function writeExpenseRow(date, description, amt, sharedAmount, category, src, emailId) {
  if (ignoreForDebug) {
    console.log(`Write expense: ${date} | ${description} | ${amt} | ${sharedAmount} | ${category} | ${src} | ${emailId}`)
  } else {
    transactionSheet.appendRow([date, description, amt, sharedAmount, category, src, emailId])
  }
  
}

function writeIncomeRow(date, description, amt, src, emailId) {
  if (ignoreForDebug) {
    console.log(`Write income: ${date} | ${description} | ${amt} | ${src} | ${emailId}`)
  } else {
    incomeSheet.appendRow([date, description, amt, src, emailId]);
  }
}

function writeIgnoredRow(date, description, amt, reason, src, emailId) {
  if (ignoreForDebug) {
    console.log(`Write ignored: ${date} | ${description} | ${amt} | ${reason} | ${src} | ${emailId}`)
  } else {
    ignoredSheet.appendRow([date, description, amt, reason, src, emailId]);
  }
}

function testRule() {
  console.log(
    applyRuleAndWriteRow(
      "venmo",
      "test date",
      "credit card bill",
      "9876",
      20.56,
      "test source",
      "email id"
    )
  )
}