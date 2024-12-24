// URL of the published Google Sheet
const sheetURL = 'https://sheets.googleapis.com/v4/spreadsheets/1_01SeG5p8YV0ihDiMIo7COl69RzIV4oHghgl2AuEtN0/values/Sheet1?key=AIzaSyD1IS98TdEYjWncrSKwbWWyLgCkPyjmWu4';

// Fetch data from Google Sheets API and return it as a dictionary
async function fetchData() {
    try {
      const response = await fetch(sheetURL);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      
      if (!data.values) {
        throw new Error('Data is not in the expected format');
      }
      
      const usersBalance = {};
      const rows = data.values;
  
      rows.forEach(row => {
        // Normalize the title (trim extra spaces and normalize characters)
        const title = row[0].trim();  // Trim any spaces or unwanted characters
        const balance = parseInt(row[1], 10);  // Ensure balance is an integer
        if (title && balance) {
          // Store the title and balance in the dictionary
          usersBalance[title] = balance;
        }
      });
      
      return usersBalance;
    } catch (error) {
      console.error(error);
      alert('An error occurred while fetching the data. Please try again later.');
      return {};  // Return an empty object in case of error
    }
  }
  
  // Function to check the balance for the title entered by the user
  async function checkBalance() {
    const title = document.getElementById('titleInput').value.trim();  // Get the title input and trim spaces
    const balanceMessage = document.getElementById('balanceMessage');
    
    const usersBalance = await fetchData();  // Fetch the balance data from the sheet
    
    // Check if the title exists in the data
    if (usersBalance[title]) {
      const balance = usersBalance[title];
      const price = getProductPrice(window.selectedProduct);  // Assuming a function to get product price
  
      // Check if the user has enough balance to purchase the product
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
  
  // Sample function to get product price (you will need to define this based on your product prices)
  function getProductPrice(product) {
    // Assuming a price map for products
    const productPrices = {
      "حماية من كل شيء لمدة 3 ايام": 750000,
      "كسر الحماية": 850000,
      "الغاء انذار": 200000,
      // Add more products and prices as needed
    };
  
    return productPrices[product] || 0;
  }
  