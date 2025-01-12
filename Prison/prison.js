// Function to fetch and display data from Google Sheets
function updateDisplay() {
    const sheetURL =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vQBbprQnuRkPL4W1ToCWKYOt8UObw1sk7p9i-GN2x85teRpIiLgDFZPW1w3gqEuJFVBdqX0PnbtXFl_/pub?output=csv";

    // Fetch and process the data from Google Sheets
    fetch(sheetURL)
        .then((response) => response.text())
        .then((csv) => {
            console.log("Fetched Google Sheets Data:");
            console.log(csv); // Debugging: Log the CSV data

            // Split CSV into rows and parse
            const rows = csv.split("\n").slice(1); // Skip the header row

            // Clear any existing content in the sections
            const sections = {
                "الإدارة العليا": document.getElementById("الإدارة العليا"),
                "فرسان": document.getElementById("فرسان"),
                "محاربين": document.getElementById("محاربين"),
                "أعضاء": document.getElementById("أعضاء"),
            };

            Object.values(sections).forEach((section) => (section.innerHTML = ""));

            rows.forEach((row, index) => {
                if (row.trim() === "") return; // Skip empty rows

                const columns = row.split(","); // Split row into columns
                if (columns.length < 6) {
                    console.warn(`Skipping invalid row ${index + 1}: ${row}`);
                    return; // Skip rows that don't have enough columns
                }

                // Extract data for each row
                const titleName = columns[0] || "اسم غير معروف";
                const rank = columns[1] || "غير محدد";
                const balance = columns[2] || "0";
                const warning = columns[3] || "لا يوجد";
                const phoneNumber = columns[4] || "";
                const imageUrl = columns[5] || "";

                // Normalize rank for comparison: remove spaces, invisible characters, and emojis
                const normalizedRank = rank
                    .replace(/[\s\u200C-\u200F]/g, "") // Remove spaces and invisible characters
                    .replace(/[\uD800-\uDFFF]/g, "") // Remove emojis
                    .toLowerCase();

                // Determine the target section
                let targetSection;

                const adminRanks = [
                    "مؤبد",
                ];

                if (adminRanks.some((adminRank) => normalizedRank.includes(adminRank))) {
                    targetSection = sections["الإدارة العليا"];
                } else if (normalizedRank.includes("تأديبي")) {
                    targetSection = sections["فرسان"];
                } else if (normalizedRank.includes("انذار")) {
                    targetSection = sections["محاربين"];
                } 

                // Create a div for each title
                const titleDiv = document.createElement("div");
                titleDiv.className = "container searchable card";
                if (imageUrl) {
                    titleDiv.style.backgroundImage = `url(${imageUrl})`;
                }

                titleDiv.innerHTML = `
                    <div class="card-content">
                        <h3>${titleName}</h3>
                        <p class="rank">المخالفة: ${rank}</p>
                        <p class="balance">السبب: ${balance}</p>
                        <p class="warning">السوابق: ${warning}</p>
                        ${
                            phoneNumber
                                ? `<p class="phone"><a href="tel:${phoneNumber}"><i class="fas fa-phone"></i> ${phoneNumber}</a></p>`
                                : ""
                        }
                    </div>
                `;

                // Append the title card to the correct section
                targetSection.appendChild(titleDiv);
            });
        })
        .catch((error) => {
            console.error("Error loading Google Sheets data:", error);
        });
}

// Search Functionality for Both Sections
document.getElementById("searchButton").addEventListener("click", () => {
    const searchQuery = document.getElementById("searchInput").value.toLowerCase();
    const containers = document.querySelectorAll(".searchable");
    const searchResults = document.getElementById("searchResults");

    // Clear previous search results
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

    // Display a message if no results are found
    if (!hasResults) {
        searchResults.innerHTML = `<p>لا توجد نتائج مطابقة.</p>`;
    }
});

// Prevent Form Default Submission
document.getElementById("searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
});

// Initial Data Display
updateDisplay(); // Show data from Google Sheets
