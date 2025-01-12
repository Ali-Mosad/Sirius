// Function to fetch and display data from Google Sheets
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

            rows.forEach((row, index) => {
                if (row.trim() === "") return;

                const columns = row.split(","); // Split row into columns
                if (columns.length < 7) {
                    console.warn(`Skipping invalid row ${index + 1}: ${row}`);
                    return;
                }

                // Extract data for each row
                const titleName = columns[0] || "اسم غير معروف";
                const rank = columns[1] || "غير محدد";
                const balance = columns[2] || "0";
                const warning = columns[3] || "لا يوجد";
                const phoneNumber = columns[4] || "";
                const imageUrl = columns[5] || "";
                const details = columns[6] || "لا توجد تفاصيل"; // New details column

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
                        <button class="details-button" onclick="showDetails('${details}')">تفاصيل اللقب</button>
                    </div>
                `;

                targetSection.appendChild(titleDiv);
            });
        })
        .catch((error) => {
            console.error("Error loading Google Sheets data:", error);
        });
}

// Function to display details in the popup modal
function showDetails(details) {
    const popupDetails = document.getElementById("popupDetails");
    const modal = document.getElementById("popupModal");

    popupDetails.innerHTML = `<p>${details}</p>`;
    modal.style.display = "block";
}

// Search functionality
document.getElementById("searchButton").addEventListener("click", () => {
    const searchQuery = document.getElementById("searchInput").value.toLowerCase();
    const containers = document.querySelectorAll(".searchable");
    const searchResults = document.getElementById("searchResults");

    searchResults.innerHTML = "";

    let hasResults = false;

    containers.forEach((container) => {
        const titleText = container.querySelector("h3").textContent.toLowerCase();
        if (titleText.includes(searchQuery)) {
            hasResults = true;
            const clonedContainer = container.cloneNode(true);
            searchResults.appendChild(clonedContainer);
        }
    });

    if (!hasResults) {
        searchResults.innerHTML = `<p>لا توجد نتائج مطابقة.</p>`;
    }
});

document.getElementById("searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
});

updateDisplay();
