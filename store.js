document.querySelectorAll('.buy-button').forEach(button => {
  button.addEventListener('click', function() {
      const itemName = this.getAttribute('data-item');
      const itemPrice = parseInt(this.getAttribute('data-price'));
      showPopup(itemName, itemPrice);
  });
});

function showPopup(itemName, itemPrice) {
  const popup = document.getElementById('popup');
  popup.style.display = 'block';

  // Store item details for later use
  window.currentItem = { itemName, itemPrice };
}

function checkBalance() {
  const لقب = document.getElementById('لقب').value;
  if (لقب.trim() === "") {
      alert("الرجاء إدخال لقبك");
      return;
  }

  // Use Google Sheets API to check balance (you will need to set up the Sheets API)
  const sheetUrl = "https://sheets.googleapis.com/v4/spreadsheets/1_01SeG5p8YV0ihDiMIo7COl69RzIV4oHghgl2AuEtN0/values/Sheet1!A:B"; // Example URL
  fetch(sheetUrl)
      .then(response => response.json())
      .then(data => {
          let userBalance = 0;
          let userFound = false;

          // Search for the user by لقب in the sheet
          data.values.forEach(row => {
              if (row[0] === لقب) { // Column A is the title (لقب)
                  userBalance = parseInt(row[1]); // Column B is the balance
                  userFound = true;
              }
          });

          if (!userFound) {
              alert("لم يتم العثور على اللقب في السجلات");
              return;
          }

          if (userBalance >= window.currentItem.itemPrice) {
              // Deduct price and show confirmation
              userBalance -= window.currentItem.itemPrice;

              // Update balance in Google Sheets (Google Sheets API)
              updateBalance(لقب, userBalance);

              const resultMessage = `تم شراء السلعة بلقب "${لقب}"`;
              document.getElementById('result-message').innerHTML = `
                  <p>${resultMessage}</p>
                  <p style="font-size: small;">قم بتصوير الشاشة وارسالها لمسؤول البنك (شانكس)</p>
              `;
              document.getElementById('result-message').style.display = 'block';
          } else {
              alert("ليس لديك رصيد كافي");
          }

          document.getElementById('popup').style.display = 'none';
      });
}

function updateBalance(لقب, newBalance) {
  // Use Google Sheets API to update the balance
  const sheetUrl = "https://sheets.googleapis.com/v4/spreadsheets/1_01SeG5p8YV0ihDiMIo7COl69RzIV4oHghgl2AuEtN0/values/Sheet1!B:B";
  const updateData = {
      values: [
          [لقب, newBalance]
      ]
  };
  fetch(sheetUrl, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_API_KEY`
      },
      body: JSON.stringify(updateData)
  });
}
