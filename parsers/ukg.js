function parsePaystub(pdfString, emailId) {
  console.log(pdfString)
  let dateRegex = /Pay Date\s*(\d{2})\/(\d{2})\/(\d{4})/;
  let checkingDepositRegex = /Net Pay\s\$(\d{0,3}.?\d{1,3}\.\d{2})/;
  let afterTaxRetirementRegex = /401[kK] After Tax No \$(\d{0,3}.?\d{1,3}\.\d{2})/;
  let preTaxRetirementRegex = /401[kK] Pretax Yes \$(\d{0,3}.?\d{1,3}\.\d{2})/;
  let esppRegex = /ESPP.*?No \$(\d{0,3}.?\d{1,3}\.\d{2})/;
  let wellnessAllowRegex = /WellLife Allow \$(\d{0,3}.?\d{1,3}\.\d{2})/;
  let companyMatchRegex = /401[kK] Co Match Yes \$0\.00 \$0\.00 \$(\d{0,3}.?\d{1,3}\.\d{2}).*Health/;

  let checkingDeposit = parseFloat(pdfString.match(checkingDepositRegex)?.[1]?.replace(/,/g, '')) || 0
  let afterTaxRetirement = parseFloat(pdfString.match(afterTaxRetirementRegex)?.[1]?.replace(/,/g, '')) || 0
  let preTaxRetirement = parseFloat(pdfString.match(preTaxRetirementRegex)[1].replace(/,/g, ''))
  let companyMatch = parseFloat(pdfString.match(companyMatchRegex)[1].replace(/,/g, ''))
  let espp = parseFloat(pdfString.match(esppRegex)[1].replace(/,/g, ''))
  let wellness = parseFloat(pdfString.match(wellnessAllowRegex)?.[1]?.replace(/,/g, '')) || 0
  let dateMatch = pdfString.match(dateRegex)

  console.log(`checking ${checkingDeposit}`)
  console.log(`afterTax ${afterTaxRetirement}`)
  console.log(`preTax ${preTaxRetirement}`)
  console.log(`companyMatch ${companyMatch}`)
  console.log(`espp ${espp}`)
  console.log(`wellness ${wellness}`)

  let total = checkingDeposit +
    afterTaxRetirement +
    preTaxRetirement +
    companyMatch +
    espp +
    wellness

  let year = dateMatch[3]
  let month = dateMatch[1]
  let day = dateMatch[2]
  writeIncomeRow(
    `${year}/${month}/${day}`,
    "bimonthly paycheck",
    total,
    "ukg",
    emailId,
  )
}

function testUkg() {
  parsePaystub("")
}