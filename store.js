document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("order-modal");
  const closeModal = document.querySelector(".close-modal");
  const orderButtons = document.querySelectorAll(".order-button");
  const confirmOrder = document.getElementById("confirm-order");
  const titleInput = document.getElementById("title-input");

  const CLIENT_ID = "404062048289-52l1rue0600ckktsc3hr3jsqt6k03epe.apps.googleusercontent.com";
  const API_KEY = "AIzaSyD1IS98TdEYjWncrSKwbWWyLgCkPyjmWu4";
  const SPREADSHEET_ID = "1_01SeG5p8YV0ihDiMIo7COl69RzIV4oHghgl2AuEtN0";
  const DISCOVERY_DOCS = [
    "https://sheets.googleapis.com/$discovery/rest?version=v4",
  ];
  const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

  let selectedProduct = null;
  let selectedPrice = 0;

  // Load gapi and initialize
  gapi.load("client:auth2", async () => {
    await gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    });

    // Sign in the user
    gapi.auth2.getAuthInstance().signIn();
  });

  // Open modal and set product info
  orderButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedProduct = button.getAttribute("data-product");
      selectedPrice = parseInt(button.getAttribute("data-price"), 10);
      modal.style.display = "flex";
    });
  });

  // Close modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Confirm order
  confirmOrder.addEventListener("click", async () => {
    const title = titleInput.value.trim();
    if (!title) {
      alert("يرجى إدخال لقبك.");
      return;
    }

    try {
      // Fetch sheet data
      const sheetData = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: "Sheet1",
      });

      const rows = sheetData.result.values;
      const titleRowIndex = rows.findIndex((row) => row[0] === title);

      if (titleRowIndex === -1) {
        alert("اللقب غير موجود.");
        return;
      }

      // Check balance
      const balance = parseInt(rows[titleRowIndex][2], 10); // Assuming balance is in column C
      if (balance < selectedPrice) {
        alert("رصيدك غير كافٍ.");
        return;
      }

      // Deduct price and update balance
      const newBalance = balance - selectedPrice;

      await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Sheet1!C${titleRowIndex + 1}`, // Column C, row index (1-based)
        valueInputOption: "RAW",
        resource: {
          values: [[newBalance]],
        },
      });

      alert(
        `تم شراء المنتج: ${selectedProduct} بنجاح. صور الشاشة وارسلها لاحد المشرفين.`
      );
    } catch (error) {
      console.error("Error:", error);
      alert("حدث خطأ أثناء التحقق.");
    } finally {
      modal.style.display = "none";
    }
  });
});
