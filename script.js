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

// DOM Elements
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("search");
const searchResult = document.getElementById("searchResult");

// Handle Search Functionality
searchButton.addEventListener("click", function () {
    const query = searchInput.value.trim();
    updateSearchResult(query);
});

function updateSearchResult(query) {
    searchResult.innerHTML = ""; // Clear previous results
    searchResult.style.display = "block"; // Ensure the container is visible

    // Search in defaultCityData
    const kyotoData = defaultCityData.kyoto[query];
    const osakaData = defaultCityData.osaka[query];

    if (kyotoData) {
        renderResult(query, kyotoData);
    } else if (osakaData) {
        renderResult(query, osakaData);
    } else {
        searchResult.innerHTML = `<p>لا توجد بيانات لهذا اللقب.</p>`;
    }
}

/**
 * Renders the search result for a given title and data.
 * @param {string} title - The title being searched.
 * @param {Object} data - The data associated with the title.
 */
function renderResult(title, data) {
    const { rank, balance, item } = data;
    searchResult.innerHTML = `
        <div class="result-wrapper">
            <div class="id-card">
                <div class="id-photo">
                    <img src="default-photo.gif" alt="Photo">
                </div>
                <div class="id-details">
                    <p><strong>اللقب:</strong> ${title}</p>
                    <p><strong>الرتبة:</strong> ${rank}</p>
                    <p><strong>الرصيد:</strong> ${balance}</p>
                    <p><strong>الأداة:</strong> ${item || "لا يوجد"}</p>
                </div>
            </div>
        </div>
    `;
}

/**
 * Utility function to extract the city from the URL.
 * @returns {string} The city name from the URL query parameters.
 */
function getCityFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("city");
}

// Additional Enhancements
document.addEventListener("DOMContentLoaded", () => {
    // Display city name when the page loads
    displayCityName();

    // Menu toggle functionality for mobile
    const menuButton = document.getElementById("menuButton");
    const menu = document.getElementById("menu");
    if (menuButton && menu) {
        menuButton.addEventListener("click", () => {
            menu.classList.toggle("menu-open");
        });
    }
});

/**
 * Displays the current city name on the page.
 */
function displayCityName() {
    const city = getCityFromURL();
    const cityNameElement = document.getElementById("city-name");

    if (cityNameElement) {
        cityNameElement.textContent = city ? city : "مدينة غير معروفة";
    } else {
        console.error("City name element not found in the DOM.");
    }
}

setInterval(function() {
    fetch('/version.txt')  // URL to a file or endpoint that changes when the website is updated
        .then(response => response.text())
        .then(currentVersion => {
            if (localStorage.getItem('version') !== currentVersion) {
                localStorage.setItem('version', currentVersion);
                location.reload(true); // Force refresh if the version has changed
            }
        })
        .catch(error => console.error('Error checking for updates:', error));
}, 5000); // Check every 5 seconds
