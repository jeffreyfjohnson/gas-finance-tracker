const props = PropertiesService.getScriptProperties()
const spreadsheet = SpreadsheetApp.openById(props.getProperty("spreadsheetId"));
let transactionSheet = spreadsheet.getSheetByName("transactions");
let incomeSheet = spreadsheet.getSheetByName("income");
let ignoredSheet = spreadsheet.getSheetByName("ignored");
let categorySheet = spreadsheet.getSheetByName("categories");
let rulesSheet = spreadsheet.getSheetByName("rules");
let metadataSheet = spreadsheet.getSheetByName("metadata");
let sankeySheet = spreadsheet.getSheetByName("sankey")
let timestampCell = metadataSheet.getRange("A2")

const daysBack = 2

const ignoreForDebug = false

const sendEmailOnError = true

const gmailLabel = "financial-transactions"
