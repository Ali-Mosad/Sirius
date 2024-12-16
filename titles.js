// Default Local Data
const defaultCityData = {
    kyoto: {
        "إيرين": { rank: "عضو", balance: 100, item: "لا يوجد" },
        "سمايل": { rank: "باكا", balance: 1, item: "مدري" },
        "ماساكو": { rank: "مدير", balance: 200, item: "سيف" },
    },
    osaka: {
        "كين": { rank: "مدير", balance: 500, item: "كتاب" },
        "هانا": { rank: "عضو", balance: 150, item: "قوس" },
    },
};

// Display Local Data Function
function updateDisplay(city = "kyoto") {
    const cityData = document.getElementById("cityData");
    cityData.innerHTML = ""; // Clear previous data

    if (!defaultCityData[city] || Object.keys(defaultCityData[city]).length === 0) {
        cityData.innerHTML = "<p>لا توجد ألقاب مضافة.</p>";
        return;
    }

    for (const [title, info] of Object.entries(defaultCityData[city])) {
        const container = document.createElement("div");
        container.className = "container searchable";

        container.innerHTML = `
            <h3>${title}</h3>
            <p>رتبة: ${info.rank}</p>
            <p>رصيد: ${info.balance}</p>
            <p>أداة: ${info.item || "لا يوجد"}</p>
        `;

        cityData.appendChild(container);
    }
}

// Google Sheets Fetch Function
function fetchGoogleSheetsData() {
    const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQbAPklpmgpd4GyXOoyQfavDI50cYMYxNGGmrXyvLe1j4bIej0vcuZuIxzs4EWtB4LbQL6FgJI_fWj5/pub?output=csv";

    fetch(sheetURL)
        .then((response) => response.text())
        .then((csv) => {
            const rows = csv.split("\n").slice(1); // Skip the header row
            const dynamicContainer = document.getElementById("dynamic-titles");
            dynamicContainer.innerHTML = ""; // Clear any existing content

            rows.forEach((row) => {
                const columns = row.split(","); // Split row into columns
                if (columns.length < 2) return; // Skip invalid rows

                const titleDiv = document.createElement("div");
                titleDiv.className = "title-item searchable";
                titleDiv.innerHTML = `
                    <h3>${columns[0]}</h3>
                    <p>${columns[1]}</p>
                `;
                dynamicContainer.appendChild(titleDiv);
            });
        })
        .catch((error) => console.error("Error loading Google Sheets data:", error));
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
updateDisplay(); // Show local default data
fetchGoogleSheetsData(); // Fetch and display data from Google Sheets
