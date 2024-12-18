const SHEET_ID = "1_01SeG5p8YV0ihDiMIo7COl69RzIV4oHghgl2AuEtN0"; // Replace with your sheet's ID
const API_KEY = "d7bb7f14ee2fd25055b77cf533eb8ea7d45291ad"; // Replace with your API key
const RANGE = "Sheet1"; // Name of the sheet to read/write

// Fetch and display titles
async function fetchTitles() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.values) {
            displayTitles(data.values);
        }
    } catch (error) {
        console.error("Error fetching titles:", error);
    }
}

// Display titles in the HTML
function displayTitles(rows) {
    const highAdminDiv = document.getElementById("الإدارة العليا");
    const knightsDiv = document.getElementById("فرسان");
    const warriorsDiv = document.getElementById("محاربين");
    const membersDiv = document.getElementById("أعضاء");

    // Clear existing content
    highAdminDiv.innerHTML = "";
    knightsDiv.innerHTML = "";
    warriorsDiv.innerHTML = "";
    membersDiv.innerHTML = "";

    rows.forEach(row => {
        const [rank, name, info] = row; // Assuming each row has Rank, Name, Info
        const titleDiv = document.createElement("div");
        titleDiv.textContent = `${name}: ${info}`;
        if (rank === "الإدارة العليا") highAdminDiv.appendChild(titleDiv);
        else if (rank === "فرسان") knightsDiv.appendChild(titleDiv);
        else if (rank === "محاربين") warriorsDiv.appendChild(titleDiv);
        else if (rank === "أعضاء") membersDiv.appendChild(titleDiv);
    });
}

// Add a new title
async function addTitle() {
    const titleName = document.getElementById("titleName").value;
    const titleInfo = document.getElementById("titleInfo").value;

    if (!titleName || !titleInfo) {
        alert("Please fill out both fields.");
        return;
    }

    const newRow = [["الإدارة العليا", titleName, titleInfo]]; // Adjust rank as needed

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ values: newRow })
        });
        if (response.ok) {
            alert("Title added successfully!");
            fetchTitles(); // Refresh the list
        }
    } catch (error) {
        console.error("Error adding title:", error);
    }
}

// Edit an existing title
async function editTitle() {
    // Editing logic is more complex and requires a custom Apps Script or a full row update
    alert("Editing titles requires a more advanced implementation.");
}

// Event listeners
document.getElementById("addButton").addEventListener("click", addTitle);
document.getElementById("editButton").addEventListener("click", editTitle);
document.getElementById("searchButton").addEventListener("click", fetchTitles);

// Initial load
fetchTitles();
