function updateDisplay() {
    const sheetURL =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vQbAPklpmgpd4GyXOoyQfavDI50cYMYxNGGmrXyvLe1j4bIej0vcuZuIxzs4EWtB4LbQL6FgJI_fWj5/pub?output=csv";

    fetch(sheetURL)
        .then((response) => response.text())
        .then((csv) => {
            const rows = csv.split("\n").slice(1); // Skip the header row
            const sections = {
                "الإدارة العليا": document.getElementById("الإدارة العليا"),
                "فرسان": document.getElementById("فرسان"),
                "محاربين": document.getElementById("محاربين"),
                "أعضاء": document.getElementById("أعضاء"),
            };

            Object.values(sections).forEach((section) => (section.innerHTML = ""));

            rows.forEach((row) => {
                if (row.trim() === "") return;
                const columns = row.split(",");
                if (columns.length < 6) return;

                const titleName = columns[0] || "اسم غير معروف";
                const rank = columns[1] || "غير محدد";
                const balance = columns[2] || "0";
                const warning = columns[3] || "لا يوجد";
                const phoneNumber = columns[4] || "";
                const imageUrl = columns[5] || "";

                const normalizedRank = rank.replace(/[\s\u200C-\u200F]/g, "").toLowerCase();
                let targetSection;

                const adminRanks = [
                    "لورد",
                    "نائبةاللورد",
                    "مستشار",
                    "المحاربالراكون",
                    "قائدالفرسان",
                    "اجدععضو",
                    "وزيرالبنك",
                ];

                if (adminRanks.some((adminRank) => normalizedRank.includes(adminRank))) {
                    targetSection = sections["الإدارة العليا"];
                } else if (normalizedRank.includes("فارس")) {
                    targetSection = sections["فرسان"];
                } else if (normalizedRank.includes("محارب")) {
                    targetSection = sections["محاربين"];
                } else {
                    targetSection = sections["أعضاء"];
                }

                const titleDiv = document.createElement("div");
                titleDiv.className = "container searchable card";
                if (imageUrl) {
                    titleDiv.style.backgroundImage = `url(${imageUrl})`;
                }

                titleDiv.innerHTML = `
                    <div class="card-content">
                        <h3>${titleName}</h3>
                        <p class="rank">رتبة: ${rank}</p>
                        <p class="balance">رصيد: ${balance}</p>
                        <p class="warning">انذار: ${warning}</p>
                        ${
                            phoneNumber
                                ? `<p class="phone"><a href="tel:${phoneNumber}"><i class="fas fa-phone"></i> ${phoneNumber}</a></p>`
                                : ""
                        }
                        <button class="details-button">تفاصيل اللقب</button>
                    </div>
                `;

                const detailsButton = titleDiv.querySelector(".details-button");
                detailsButton.addEventListener("click", () => {
                    openPopup({
                        titleName,
                        rank,
                        balance,
                        warning,
                        phoneNumber,
                        imageUrl,
                    });
                });

                targetSection.appendChild(titleDiv);
            });
        })
        .catch((error) => {
            console.error("Error loading Google Sheets data:", error);
        });
}

// Function to open and populate the popup
function openPopup(details) {
    const popupDetails = document.getElementById("popupDetails");
    popupDetails.innerHTML = `
        <h2>${details.titleName}</h2>
        <p>رتبة: ${details.rank}</p>
        <p>رصيد: ${details.balance}</p>
        <p>انذار: ${details.warning}</p>
        ${
            details.phoneNumber
                ? `<p><a href="tel:${details.phoneNumber}"><i class="fas fa-phone"></i> ${details.phoneNumber}</a></p>`
                : ""
        }
        ${
            details.imageUrl
                ? `<img src="${details.imageUrl}" alt="${details.titleName}" style="width: 100%; border-radius: 8px; margin-top: 10px;">`
                : ""
        }
    `;
    const modal = document.getElementById("popupModal");
    modal.style.display = "block";

    // Close modal on click
    const closeModal = document.getElementById("closeModal");
    closeModal.onclick = () => (modal.style.display = "none");

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

// Initial Data Display
updateDisplay();
