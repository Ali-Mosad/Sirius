// Google Sheets URL (CSV format)
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQbAPklpmgpd4GyXOoyQfavDI50cYMYxNGGmrXyvLe1j4bIej0vcuZuIxzs4EWtB4LbQL6FgJI_fWj5/pub?output=csv";

// DOM Elements
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");
const searchResult = document.getElementById("searchResult");

// Store fetched data
let sheetData = {};

/**
 * Utility function to normalize text by removing emojis and special characters, and trimming whitespace
 * @param {string} text
 * @returns {string} - Normalized text
 */
function normalizeText(text) {
    return text
        .replace(/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+/gu, "") // Remove emojis
        .replace(/[\u2000-\u206F\u2E00-\u2E7F\\!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~༺༻]+/g, "") // Remove special characters like ༺༻
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
