  // Sheet URL
        const sheetURL =
            "https://docs.google.com/spreadsheets/d/e/2PACX-1vQbAPklpmgpd4GyXOoyQfavDI50cYMYxNGGmrXyvLe1j4bIej0vcuZuIxzs4EWtB4LbQL6FgJI_fWj5/pub?output=csv";

        // Popup Elements
        const popup = document.getElementById("popup");
        const confirmButton = document.getElementById("confirmButton");
        const cancelButton = document.getElementById("cancelButton");
        const nicknameInput = document.getElementById("nicknameInput");

        let selectedPrice = 0;

        // Show popup on buy button click
        document.querySelectorAll(".buy-button").forEach((button) => {
            button.addEventListener("click", (event) => {
                selectedPrice = event.target.closest(".item-card").dataset.price;
                popup.style.display = "flex";
            });
        });

        // Cancel button to close the popup
        cancelButton.addEventListener("click", () => {
            popup.style.display = "none";
        });

        // Confirm button logic
        confirmButton.addEventListener("click", () => {
            const nickname = nicknameInput.value.trim();
            if (!nickname) {
                alert("الرجاء إدخال اللقب");
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
                        if (name.trim() === nickname) {
                            balance = parseInt(bal.trim(), 10);
                        }
                    });

                    if (balance === null) {
                        alert("لم يتم العثور على اللقب.");
                    } else if (balance >= selectedPrice) {
                        alert("تمت العملية بنجاح!");
                    } else {
                        alert("الرصيد غير كافٍ.");
                    }
                    popup.style.display = "none";
                })
                .catch((error) => {
                    console.error("Error fetching Google Sheets data:", error);
                    alert("حدث خطأ أثناء التحقق من الرصيد.");
                    popup.style.display = "none";
                });
        });