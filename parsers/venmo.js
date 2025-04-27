function parseVenmo(messageBody, emailId) {
  let toFromRegex = /image\]\s+(.*)\n/;
  let amtDescriptionRegex = /\$\s+(\d{0,3},?\d{0,3}\s+\.\s+\d{2})\s+(.*)\n/;
  
  let toFromMatches = messageBody.match(toFromRegex);
  let amtDescriptionMatches = messageBody.match(amtDescriptionRegex);

  let toFrom = toFromMatches[1]
  let description = amtDescriptionMatches[2];
  let writeDescription = `${description} - ${toFrom}`;
  let date = formatToday();
  let extraData;
  if (toFrom.toLowerCase().includes("paid you")) {
    extraData = "income"
  } else {
    extraData = "spending"
  }
  let amount = parseFloat(amtDescriptionMatches[1].replace(/[\s]/g, ''));

  applyRuleAndWriteRow(
    "venmo",
    date,
    writeDescription,
    extraData,
    amount,
    "venmo",
    emailId
  )
}

function testVenmo() {
  parseVenmo("", "fake email id")
}