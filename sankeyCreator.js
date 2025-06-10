function createSankey() {
  let startDate = new Date(sankeySheet.getRange(1,2).getValue().toString())
  let incomeLabels = getIncomeLabels()

  let incomeBlock = aggregateIncomeLabels(startDate, incomeLabels)

  let incomeSum = 0
  for (const income of incomeBlock.values()) {
    incomeSum += income
  }

  let spendingBlock = aggregateSpending(startDate)

  let spendingSum = 0
  for (const spending of spendingBlock.values()) {
    spendingSum += spending
  }

  let spendingCategories = getSpendingParentCategories()

  let sankeyInputText = createSankeyInputText(incomeSum, spendingSum, incomeBlock, spendingBlock, spendingCategories, false)

  console.log(sankeyInputText)
}

function getIncomeLabels() {
  let lastRow = sankeySheet.getLastRow()
  let labels = new Map()
  for (let i = 5; i <= lastRow; i++) {
    let tag = sankeySheet.getRange(i,1).getValue().toString().toLowerCase()
    let label = sankeySheet.getRange(i, 2).getValue().toString()
    if (!tag || !label) break

    labels.set(tag, label)
  }
  return labels
}

function getSpendingParentCategories() {
  let lastRow = sankeySheet.getLastRow()
  let categories = new Map()
  for (let i = 5; i <= lastRow; i++) {
    let category = sankeySheet.getRange(i,4).getValue().toString()
    let parentCategory = sankeySheet.getRange(i, 5).getValue().toString()
    if (!category || !parentCategory) break
    
    categories.set(category, parentCategory)
  }
  return categories
}

function aggregateIncomeLabels(startDate, incomeLabels) {
  let lastRow = incomeSheet.getLastRow()

  let incomeBlock = new Map(
    [["Other", 0]]
  )

  outerloop:
  for (let i = 2; i <= lastRow; i++) {
    let date = new Date(incomeSheet.getRange(i, 1).getValue().toString())
    if (date < startDate) continue

    let amount = parseFloat(incomeSheet.getRange(i, 3).getValue().toString())
    let tags = incomeSheet.getRange(i, 7).getValue().toString()
    for (let [tag, label] of incomeLabels) {
      if (containsTag(tag, tags)) {
        addOrSet(incomeBlock, label, amount)
        continue outerloop
      }
    }
    addOrSet(incomeBlock, "Other", amount)
  }

  return incomeBlock
}

function aggregateSpending(startDate) {
  let lastRow = transactionSheet.getLastRow()

  let spendingBlock = new Map()

  for (let i = 2; i <= lastRow; i++) {
    let date = new Date(transactionSheet.getRange(i, 1).getValue().toString())
    if (date < startDate) continue

    let amount = parseFloat(transactionSheet.getRange(i, 3).getValue().toString())
    let category = transactionSheet.getRange(i, 5).getValue().toString()
    
    addOrSet(spendingBlock, category, amount)
  }

  return spendingBlock
}

function createSankeyInputText(
  totalIncome,
  totalSpending,
  incomeBlock,
  spendingBlock,
  spendingCategories,
  usePercentages
) {
  let divisor = 1
  
  if (usePercentages) {
    divisor = totalIncome/100
  }

  let sb = []
  for (const [category, amount] of incomeBlock) {
    sb.push(`${category} [${(amount/divisor).toFixed(2)}] Income`)
  }

  sb.push(`Income [${(totalSpending/divisor).toFixed(2)}] Spending`)
  sb.push(`Income [${((totalIncome - totalSpending)/divisor).toFixed(2)}] Investable`)

  let childSpending = new Map()
  let parentSpending = new Map()
  for (const [category, parentCategory] of spendingCategories) {
    let categoryAmt = spendingBlock.get(category) ?? 0
    spendingBlock.delete(category)
    childSpending.set(category, {parent: parentCategory, amount: categoryAmt})
    addOrSet(parentSpending, parentCategory, categoryAmt)
  }

  for (const [category, amount] of parentSpending) {
    sb.push(`Spending [${(amount/divisor).toFixed(2)}] ${category}`)
  }

  for (const [category, amount] of spendingBlock) {
    sb.push(`Spending [${(amount/divisor).toFixed(2)}] ${category}`)
  }

  for (const [category, parentAndAmount] of childSpending) {
    sb.push(`${parentAndAmount.parent} [${(parentAndAmount.amount/divisor).toFixed(2)}] ${category}`)
  }

  return sb.join("\n")
}

function containsTag(tag, tags) {
  return tags.toLowerCase().split(",").map(t => t.trim()).includes(tag.toLowerCase())
}

function addOrSet(map, key, value) {
  if (map.has(key)) {
    let current = map.get(key)
    map.set(key, current + value)
  } else {
    map.set(key, value)
  }
}
