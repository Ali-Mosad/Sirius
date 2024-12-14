// Default data
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

// Function to update display based on city data
function updateDisplay(city = "kyoto") {
    const cityData = document.getElementById("cityData");
    cityData.innerHTML = ""; // Clear previous data

    if (!defaultCityData[city] || Object.keys(defaultCityData[city]).length === 0) {
        cityData.innerHTML = "<p>لا توجد ألقاب مضافة.</p>";
        return;
    }

    // Loop through titles in the selected city and display them
    for (const [title, info] of Object.entries(defaultCityData[city])) {
        const entry = document.createElement("div");
        entry.className = "title-item title"; // Add class 'title' for search filtering
        entry.innerHTML = `
            <h3>${title}</h3>
            <p>رتبة: ${info.rank}</p>
            <p>رصيد: ${info.balance}</p>
            <p>أداة: ${info.item || "لا يوجد"}</p>
        `;
        cityData.appendChild(entry);
    }
}

// Search functionality
document.getElementById("searchButton").addEventListener("click", function () {
    const searchQuery = document.getElementById("searchInput").value.toLowerCase();
    const titles = document.querySelectorAll(".title");

    titles.forEach((title) => {
        const titleText = title.textContent.toLowerCase();
        title.style.display = titleText.includes(searchQuery) ? "block" : "none";
    });
});

// Prevent form submission default behavior
document.getElementById("searchForm").addEventListener("submit", function (event) {
    event.preventDefault();
});

// Display titles on page load (initially for kyoto city)
updateDisplay();
