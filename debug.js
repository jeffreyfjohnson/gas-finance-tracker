const debugEmailId = "19266fbf2abcfd2d"

function getEmailById() {
  let message = GmailApp.getMessageById(debugEmailId)
  console.log(`${message.getSubject()} - from ${message.getFrom()}`)
  console.log(message.getPlainBody())
}

function getEmails() {
  let threads = GmailApp.search(`label:${gmailLabel} from:chase newer_than:20d older_than:0d`)
  for (var i = 0; i < threads.length; i++) {
      let messages = threads[i].getMessages()
      for (var j = 0; j < messages.length; j++) {
         let message = messages[j]
         console.log(message.getPlainBody())
      }
  }
}
