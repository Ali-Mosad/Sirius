document.addEventListener("DOMContentLoaded", () => {
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

    const sheetURL =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vQbAPklpmgpd4GyXOoyQfavDI50cYMYxNGGmrXyvLe1j4bIej0vcuZuIxzs4EWtB4LbQL6FgJI_fWj5/pub?output=csv";

    // Function to normalize and extract the balance
    function extractBalance(balanceString) {
        const match = balanceString.match(/\((\d+)k\)/);
        return match ? parseInt(match[1], 10) * 1000 : 0; // Convert 'k' to thousands
    }

    // Function to format balance back to `k` format
    function formatBalance(balance) {
        return `${balance / 1000}k`;
    }

    // Enhanced search to match nicknames more flexibly
    function searchNickname(nickname, rows) {
        const normalizedNickname = nickname.replace(/[\s\u200C-\u200F]/g, "").toLowerCase();
        let result = null;

        rows.forEach((row) => {
            const [name, , bal] = row.split(",");
            const normalizedName = name.replace(/[\s\u200C-\u200F]/g, "").toLowerCase();

            if (normalizedName.includes(normalizedNickname)) {
                result = { name: name.trim(), balance: extractBalance(bal.trim()) };
            }
        });

        return result;
    }

    document.querySelectorAll(".buy-button").forEach((button) => {
        button.addEventListener("click", (event) => {
            // Get the price and item name
            const itemCard = event.target.closest(".item-card");
            if (!itemCard) return; // Ensure item-card exists
            selectedPrice = parseInt(itemCard.dataset.price, 10);
            selectedItem = itemCard.querySelector("h3").textContent.trim();
    
            // Reset popup inputs and messages
            nicknameInput.value = "";
            balanceDisplay.textContent = "";
            confirmationMessage.textContent = "";
            confirmPurchaseButton.style.display = "none";
    
            // Display the popup
            popup.classList.remove("hidden");
        });
    });    

    cancelButton.addEventListener("click", () => {
        popup.classList.add("hidden");
    });

    nicknameInput.addEventListener("input", () => {
        const nickname = nicknameInput.value.trim();
        if (!nickname) {
            balanceDisplay.textContent = "";
            confirmationMessage.style.display = "none";
            confirmPurchaseButton.style.display = "none";
            return;
        }

        fetch(sheetURL)
            .then((response) => response.text())
            .then((csv) => {
                const rows = csv.split("\n").slice(1);
                const result = searchNickname(nickname, rows);

                if (!result) {
                    balanceDisplay.textContent = "لم يتم العثور على اللقب.";
                    confirmationMessage.style.display = "none";
                    confirmPurchaseButton.style.display = "none";
                } else if (result.balance >= selectedPrice) {
                    balanceDisplay.textContent = `رصيدك: ${formatBalance(result.balance)}`;
                    confirmationMessage.textContent = "هل تريد تأكيد عملية الشراء؟";
                    confirmationMessage.style.display = "block";
                    confirmPurchaseButton.style.display = "block";
                } else {
                    balanceDisplay.textContent = `رصيدك: ${formatBalance(result.balance)}`;
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

    confirmPurchaseButton.addEventListener("click", () => {
    const nickname = nicknameInput.value.trim();
    itemName.textContent = selectedItem; // Display the item name
    purchaseMessage.textContent = `تم شراء السلعة بلقب "${nickname}"`; // Purchase message
    screenshotMessage.textContent = "قم بتصوير الشاشة وإرسالها للمسؤول عن المتجر"; // Add screenshot message
    popup.classList.add("hidden"); // Hide the popup
    purchaseConfirmation.classList.remove("hidden"); // Show the confirmation
});
});
