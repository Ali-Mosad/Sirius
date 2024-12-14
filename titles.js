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
function updateDisplay(city = 'kyoto') {
    const cityData = document.getElementById("cityData");
    cityData.innerHTML = ""; // Clear previous data

    if (Object.keys(defaultCityData[city]).length === 0) {
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
document.getElementById("searchButton").addEventListener("click", function() {
    var searchQuery = document.getElementById("searchInput").value.toLowerCase();
    var titles = document.querySelectorAll(".title");

    titles.forEach(function(title) {
        var titleText = title.textContent.toLowerCase();
        if (titleText.includes(searchQuery)) {
            title.style.display = "block"; // Show matching titles
        } else {
            title.style.display = "none"; // Hide non-matching titles
        }
    });
});

// Display titles on page load (initially for kyoto city)
updateDisplay();

// Optionally, add a listener to switch between cities, if needed:
// Example for switching cities (not in the original code but helpful)
document.getElementById("citySelector").addEventListener("change", function() {
    const selectedCity = this.value;
    updateDisplay(selectedCity);
});
