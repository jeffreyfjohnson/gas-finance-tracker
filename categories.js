function categorize(description) {
  let desc = description.toLowerCase()
  for (const [sheetDesc, sheetCategory] of getSheetCategories().entries()) {
    if (desc.includes(sheetDesc)) return sheetCategory
  }
  return null
}

function checkContains(options, desc) {
  return options.some(opt => desc.includes(opt))
}

function getSheetCategories() {
  let lastCategoryRow = categorySheet.getLastRow()
  let categories = new Map()
  for (let i = 1; i <= lastCategoryRow; i++) {
    let desc = categorySheet.getRange(i, 1).getValue().toString()
    let category = categorySheet.getRange(i, 2).getValue().toString()
    categories.set(desc.toLowerCase(), category)
  }
  return categories
}

function testCategorize() {
  console.log(categorize("safeway"))
}