// of type "Sep 20, 2024"
function formatDate(dateString) {
  const [month, day, year] = dateString.replace(/,/g, '').split(' ');

  // Map month names to numbers
  const monthMap = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04',
      May: '05', Jun: '06', Jul: '07', Aug: '08',
      Sep: '09', Oct: '10', Nov: '11', Dec: '12'
  };

  return`${year}/${monthMap[month]}/${day.padStart(2, '0')}`;
}

// of type "September 20, 2024"
function formatFullDate(dateString) {
  const [month, day, year] = dateString.replace(/,/g, '').split(' ');

  // Map month names to numbers
  const monthMap = {
      January: '01', February: '02', March: '03', April: '04',
      May: '05', June: '06', July: '07', August: '08',
      September: '09', October: '10', November: '11', December: '12'
  };

  return`${year}/${monthMap[month]}/${day.padStart(2, '0')}`;
}

function formatToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
}

function formatGmailDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}/${month}/${day}T${hours}:${minutes}:${seconds}`;
}
