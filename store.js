document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("order-modal");
  const closeModal = document.querySelector(".close-modal");
  const orderButtons = document.querySelectorAll(".order-button");
  const confirmOrder = document.getElementById("confirm-order");
  const titleInput = document.getElementById("title-input");

  let selectedProduct = null;
  let selectedPrice = 0;

  // Open modal and set product info
  orderButtons.forEach(button => {
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
      // Call Google Sheets API to verify title and balance
      // const sheetUrl = "https://sheets.googleapis.com/v4/spreadsheets/1_01SeG5p8YV0ihDiMIo7COl69RzIV4oHghgl2AuEtN0/values/Sheet1?key=AIzaSyD1IS98TdEYjWncrSKwbWWyLgCkPyjmWu4";
      const response = await fetch(sheetUrl);
      if (!response.ok) throw new Error("Failed to fetch sheet data.");
      const data = await response.json();

      // Validate title
      const titleRow = data.values.find(row => row[0] === title);
      if (!titleRow) {
        alert("اللقب غير موجود.");
        return;
      }

      // Check balance
      const balance = parseInt(titleRow[2], 10); // Assuming balance is in column C
      if (balance < selectedPrice) {
        alert("رصيدك غير كافٍ.");
      } else {
        alert(`تم شراء المنتج: ${selectedProduct} بنجاح. صور الشاشة وارسلها لاحد المشرفين.`);
        // Optionally deduct balance in the backend
      }
    } catch (error) {
      console.error("Error:", error);
      alert("حدث خطأ أثناء التحقق.");
    } finally {
      modal.style.display = "none";
    }
  });
});
