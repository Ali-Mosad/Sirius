document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const closeButton = document.querySelector(".close-button");
    const requestButtons = document.querySelectorAll(".request-button");
    const submitButton = document.getElementById("submit-button");
    const titleInput = document.getElementById("title-input");
  
    // Open Modal
    requestButtons.forEach(button => {
      button.addEventListener("click", () => {
        modal.style.display = "flex";
      });
    });
  
    // Close Modal
    closeButton.addEventListener("click", () => {
      modal.style.display = "none";
    });
  
    // Submit Title
    submitButton.addEventListener("click", async () => {
      const title = titleInput.value.trim();
  
      if (!title) {
        alert("يرجى إدخال العنوان.");
        return;
      }
  
      // Verify with Google Sheets
      const sheetUrl = "https://sheets.googleapis.com/v4/spreadsheets/1_01SeG5p8YV0ihDiMIo7COl69RzIV4oHghgl2AuEtN0/values/Sheet1!A1:C10?key=d7bb7f14ee2fd25055b77cf533eb8ea7d45291ad"; // Replace with actual API endpoint
      const response = await fetch(sheetUrl);
      const data = await response.json();
  
      const titleRow = data.find(row => row.title === title);
      if (!titleRow) {
        alert("العنوان غير موجود.");
        return;
      }
  
      const balance = parseInt(titleRow.balance, 10);
      const cost = 50; // Example cost
  
      if (balance < cost) {
        alert("رصيدك غير كافٍ.");
      } else {
        alert("تم الخصم بنجاح. صور الشاشة وارسلها لاحد المشرفين.");
        // Update balance on the server
        // Post the updated balance to your Google Sheets API
        await fetch(sheetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            newBalance: balance - cost,
          }),
        });
      }
      modal.style.display = "none";
    });
  });
  