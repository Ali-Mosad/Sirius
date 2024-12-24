// URL of the published Google Sheet
const sheetURL = 'https://sheets.googleapis.com/v4/spreadsheets/1_01SeG5p8YV0ihDiMIo7COl69RzIV4oHghgl2AuEtN0/values/Sheet1?key=d7bb7f14ee2fd25055b77cf533eb8ea7d45291ad';

// Fetch data from Google Sheets
async function fetchData() {
  const response = await fetch(sheetURL);
  const data = await response.json();
  
  // Parse the sheet data and create a balance object
  const usersBalance = {};
  const rows = data.values; // Array of rows from the sheet
  
  rows.forEach(row => {
    const title = row[0];  // Assuming title is in the first column
    const balance = parseInt(row[2], 10);  // Assuming balance is in the second column
    if (title && balance) {
      usersBalance[title] = balance;
    }
  });

  return usersBalance;
}

// Call the fetchData function and use it when a user tries to buy an item
async function buyItem(productName) {
  // Show the modal and prompt for the title
  document.getElementById('titleModal').style.display = 'block';
  
  // Store the product name for use after the modal interaction
  window.selectedProduct = productName;
}

async function checkBalance() {
  const title = document.getElementById('titleInput').value;
  const balanceMessage = document.getElementById('balanceMessage');
  
  const usersBalance = await fetchData();  // Get the users balance from the Google Sheet
  
  if (usersBalance[title]) {
    const balance = usersBalance[title];
    const price = getProductPrice(window.selectedProduct);

    if (balance >= price) {
      balanceMessage.innerHTML = `تم شراء السلعة: ${window.selectedProduct}<br><small>صور الشاشة وابعتها لمشرف البنك (شانكس)</small>`;
      
      // Deduct the balance
      usersBalance[title] -= price;
    } else {
      balanceMessage.innerHTML = "ليس لديك الرصيد الكافي.";
    }
  } else {
    balanceMessage.innerHTML = "اللقب غير موجود.";
  }
}

function closeModal() {
  document.getElementById('titleModal').style.display = 'none';
}

function getProductPrice(productName) {
  // Return the price based on the product name
  const prices = {
    "حماية من كل شيء": 750000,
    "كسر الحماية": 850000,
    // Add more products and their prices here
  };
  
  return prices[productName] || 0;
}
