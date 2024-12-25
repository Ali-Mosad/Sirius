document.addEventListener("DOMContentLoaded", () => {
    // Sheet URL
    const sheetURL =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vQbAPklpmgpd4GyXOoyQfavDI50cYMYxNGGmrXyvLe1j4bIej0vcuZuIxzs4EWtB4LbQL6FgJI_fWj5/pub?output=csv";

    // Popup and Confirmation Elements
    const popup = document.getElementById("popup");
    const nicknameInput = document.getElementById("nicknameInput");
    const balanceDisplay = document.getElementById("balanceDisplay");
    const confirmationMessage = document.getElementById("confirmationMessage");
    const confirmPurchaseButton = document.getElementById("confirmPurchaseButton");
    const cancelButton = document.getElementById("cancelButton");

    const purchaseConfirmation = document.getElementById("purchaseConfirmation");
    const itemName = document.getElementById("itemName");
    const purchaseMessage = document.getElementById("purchaseMessage");
    const screenshotMessage = document.getElementById("screenshotMessage");
    const closeConfirmationButton = document.getElementById("closeConfirmationButton");

    let selectedPrice = 0;
    let selectedItem = "";

    // Normalize nickname by removing spaces, emojis, and special characters
    function normalizeNickname(nickname) {
        return nickname
            .replace(/[\s\u200C-\u200F]/g, "") // Remove spaces and invisible characters
            .replace(/[\uD800-\uDFFF]/g, "")  // Remove emojis
            .replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, "") // Remove special characters (Arabic and English safe)
            .toLowerCase(); // Convert to lowercase for case-insensitivity
    }

    // Show popup on buy button click
    document.querySelectorAll(".buy-button").forEach((button) => {
        button.addEventListener("click", (event) => {
            selectedPrice = parseInt(event.target.closest(".item-card").dataset.price, 10);
            selectedItem = event.target.closest(".item-card").querySelector("h3").textContent.trim();
            nicknameInput.value = "";
            balanceDisplay.textContent = "";
            confirmationMessage.style.display = "none";
            confirmPurchaseButton.style.display = "none";
            popup.style.display = "flex";
        });
    });

    // Cancel button to close the popup
    cancelButton.addEventListener("click", () => {
        popup.style.display = "none";
    });

    // Confirm button logic
    nicknameInput.addEventListener("input", () => {
        const nickname = normalizeNickname(nicknameInput.value.trim());
        if (!nickname) {
            balanceDisplay.textContent = "";
            confirmationMessage.style.display = "none";
            confirmPurchaseButton.style.display = "none";
            return;
        }

        // Fetch data from Google Sheets
        fetch(sheetURL)
            .then((response) => response.text())
            .then((csv) => {
                const rows = csv.split("\n").slice(1); // Skip header row
                let balance = null;

                rows.forEach((row) => {
                    const [name, rank, bal] = row.split(",");
                    if (normalizeNickname(name.trim()) === nickname) {
                        balance = parseInt(bal.trim(), 10);
                    }
                });

                if (balance === null) {
                    balanceDisplay.textContent = "لم يتم العثور على اللقب.";
                    confirmationMessage.style.display = "none";
                    confirmPurchaseButton.style.display = "none";
                } else if (balance >= selectedPrice) {
                    balanceDisplay.textContent = `رصيدك: ${balance}`;
                    confirmationMessage.textContent = "هل تريد تأكيد عملية الشراء؟";
                    confirmationMessage.style.display = "block";
                    confirmPurchaseButton.style.display = "block";
                } else {
                    balanceDisplay.textContent = "رصيدك: " + balance;
                    confirmationMessage.textContent = "ليس لديك رصيد كافٍ.";
                    confirmationMessage.style.display = "block";
                    confirmPurchaseButton.style.display = "none";
                }
            })
            .catch((error) => {
                console.error("Error fetching Google Sheets data:", error);
                balanceDisplay.textContent = "حدث خطأ أثناء التحقق من الرصيد.";
            });
    });

    // Confirm purchase
    confirmPurchaseButton.addEventListener("click", () => {
        const nickname = nicknameInput.value.trim();
        itemName.textContent = selectedItem;
        purchaseMessage.textContent = `تم شراء السلعة بلقب "${nickname}"`;
        popup.style.display = "none";
        purchaseConfirmation.style.display = "flex";
    });

    // Close confirmation screen
    closeConfirmationButton.addEventListener("click", () => {
        purchaseConfirmation.style.display = "none";
    });
});
