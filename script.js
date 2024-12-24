// Google Sheets URL (CSV format)
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQbAPklpmgpd4GyXOoyQfavDI50cYMYxNGGmrXyvLe1j4bIej0vcuZuIxzs4EWtB4LbQL6FgJI_fWj5/pub?output=csv";

// DOM Elements
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");
const searchResult = document.getElementById("searchResult");

// Store fetched data
let sheetData = {};

/**
 * Utility function to normalize text by removing emojis, special characters, and unwanted symbols, and trimming whitespace
 * @param {string} text
 * @returns {string} - Normalized text
 */
function normalizeText(text) {
    return text
        // Remove emojis (including many symbols and characters from Unicode emoji ranges)
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B06}\u{2194}-\u{21AA}\u{25AA}-\u{25AB}]+/gu, "")
        // Remove special symbols, punctuation, and other unwanted characters (like from different language symbols)
        .replace(/[\u2000-\u206F\u2E00-\u2E7F\!\@\#\$\%\^\&\*\(\)\_\+\=\{\}\[\]\|\\\/\:\;\"\'\<\>\,\.\?\~\^·\u00A0\u201C\u201D\u2018\u2019\u2022\u2026]+/g, "")
        // Remove non-letter and non-number characters like `ʕ•` or `༺`, etc.
        .replace(/[^a-zA-Z0-9ء-ي\u0600-\u06FF]/g, "") // Arabic letters and basic Latin
        .trim()
        .toLowerCase(); // Normalize to lowercase
}

/**
 * Fetch data from Google Sheets and store it in sheetData.
 */
function fetchSheetData() {
    fetch(sheetURL)
        .then((response) => response.text())
        .then((csv) => {
            // Parse CSV data
            const rows = csv.split("\n").slice(1); // Skip the header row
            rows.forEach((row) => {
                const columns = row.split(","); // Split row into columns
                if (columns.length >= 4) {
                    const [title, rank, balance, tool] = columns.map((col) => col.trim());
                    sheetData[title] = { rank, balance, tool };
                }
            });
        })
        .catch((error) => {
            console.error("Error fetching Google Sheets data:", error);
        });
}

/**
 * Updates the search results based on the search query.
 * @param {string} query - The search query (title).
 */
function updateSearchResult(query) {
    searchResult.innerHTML = ""; // Clear previous results
    searchResult.style.display = "block"; // Ensure the container is visible

    const normalizedQuery = normalizeText(query); // Normalize the search query
    let found = false;

    // Search through the sheetData
    for (const title in sheetData) {
        const normalizedTitle = normalizeText(title); // Normalize the title
        if (normalizedTitle === normalizedQuery) {
            renderResult(title, sheetData[title]); // Use the original title for display
            found = true;
            break;
        }
    }

    if (!found) {
        searchResult.innerHTML = `<p>لا توجد بيانات لهذا اللقب.</p>`;
    }
}

/**
 * Renders the search result for a given title and its data.
 * @param {string} title - The title being searched.
 * @param {Object} data - The data associated with the title.
 */
function renderResult(title, data) {
    const { rank, balance, tool } = data;
    searchResult.innerHTML = `
        <div class="result-wrapper">
            <div class="id-card">
                <div class="id-photo">
                    <img src="default-photo.png" alt="Photo">
                </div>
                <div class="id-details">
                    <p><strong>اللقب:</strong> ${title}</p>
                    <p><strong>الرتبة:</strong> ${rank}</p>
                    <p><strong>الرصيد:</strong> ${balance}</p>
                    <p><strong>الإنذار:</strong> ${tool || "لا يوجد"}</p>
                </div>
            </div>
        </div>
    `;
}

// Fetch Google Sheets data on page load
document.addEventListener("DOMContentLoaded", () => {
    fetchSheetData(); // Load data from Google Sheets
});

// Add event listener for the search button
searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    updateSearchResult(query);
});

// Wait for the DOM to be fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function () {
    const menuButton = document.getElementById('menuButton');
    const menu = document.getElementById('menu');

    // Toggle menu visibility when the menu button is clicked
    menuButton.addEventListener('click', function () {
        menu.classList.toggle('active');
    });

    // Close the menu if any menu item is clicked
    const menuLinks = document.querySelectorAll('.menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function () {
            menu.classList.remove('active');  // Close menu after clicking a link
        });
    });
});

// Replace 'your_password' with your desired password
const correctPassword = 'your_password';

function checkPassword() {
    const enteredPassword = document.getElementById('password').value;
    if (enteredPassword === correctPassword) {
        document.getElementById('password-overlay').style.display = 'none';
        document.getElementById('protected-content').style.display = 'block';
    } else {
        alert('كلمة المرور غير صحيحة');
    }
}
