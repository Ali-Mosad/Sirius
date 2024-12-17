// Function to fetch and display data from Google Sheets
function updateDisplay() {
    const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQbAPklpmgpd4GyXOoyQfavDI50cYMYxNGGmrXyvLe1j4bIej0vcuZuIxzs4EWtB4LbQL6FgJI_fWj5/pub?output=csv";

    // Define rank categories and their sections
    const rankCategories = {
        "الإدارة العليا": ["لورد", "نائبة اللورد", "مستشار", "المحارب الراكون", "قائد الفرسان", "اجدع عضو", "وزير البنك"],
        "فرسان": [],
        "محاربين": [],
        "أعضاء": []
    };

    // Fetch and process the data from Google Sheets
    fetch(sheetURL)
        .then((response) => response.text())
        .then((csv) => {
            console.log("Fetched Google Sheets Data:");
            console.log(csv);

            // Split CSV into rows and parse
            const rows = csv.split("\n").slice(1); // Skip the header row
            
            // Clear the existing content in each section
            Object.keys(rankCategories).forEach((sectionId) => {
                document.getElementById(sectionId).innerHTML = ""; // Clear the sections
            });

            if (rows.length === 0) {
                console.error("No data found in the Google Sheets CSV.");
            }

            rows.forEach((row, index) => {
                if (row.trim() === "") return; // Skip empty rows

                const columns = row.split(","); // Split row into columns
                if (columns.length < 6) {
                    console.warn(`Skipping invalid row ${index + 1}: ${row}`);
                    return; // Skip rows that don't have enough columns
                }

                // Log parsed data
                console.log("Parsed Row:", columns);

                const titleName = columns[0];
                const rank = columns[1];
                const balance = columns[2];
                const warning = columns[3] || "لا يوجد";
                const phoneNumber = columns[4] || "";
                const imageUrl = columns[5] || "";

                // Create a div for the title
                const titleDiv = document.createElement("div");
                titleDiv.className = "container searchable card"; // Use the 'card' class for modern design

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
                    </div>
                `;

                // Append the title to the appropriate section
                if (rankCategories["الإدارة العليا"].includes(rank)) {
                    document.getElementById("الإدارة العليا").appendChild(titleDiv);
                } else if (rank === "فارس") {
                    document.getElementById("فرسان").appendChild(titleDiv);
                } else if (rank === "محارب") {
                    document.getElementById("محاربين").appendChild(titleDiv);
                } else {
                    document.getElementById("أعضاء").appendChild(titleDiv);
                }
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

    containers.forEach((container) => {
        const titleText = container.querySelector("h3").textContent.toLowerCase();
        container.style.display = titleText.includes(searchQuery) ? "block" : "none";
    });
});

// Prevent Form Default Submission
document.getElementById("searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
});

// Initial Data Display
updateDisplay(); // Show data from Google Sheets
