function convertPDFToText(filename, blob) {
  // Use OCR to convert PDF to a temporary Google Document
  // Restrict the response to include file Id and Title fields only
  const fileMetadata = {
      name: filename.replace(/\.pdf$/, ''),
      mimeType: 'application/vnd.google-apps.document' // Ensuring the target MIME type is Google Docs
    };

  const options = {
      ocr: true,
      ocrLanguage: "en",
      fields: 'id, name'
    };


  var textContent = ""
  var fileId
  try {
    const response = Drive.Files.create(fileMetadata, blob, options);
    const { id, name } = response;
    fileId = id

    Utilities.sleep(3000); // 3 seconds
    // Use the Document API to extract text from the Google Document
    textContent = DocumentApp.openById(fileId).getBody().getText()
  } finally {
    // Delete the temporary Google Document since it is no longer needed
    Drive.Files.remove(fileId);
  }

  return textContent;
};
