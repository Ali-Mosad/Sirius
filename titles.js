// Function to fetch and display data from Google Sheets
function updateDisplay() {
    const sheetURL =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vQbAPklpmgpd4GyXOoyQfavDI50cYMYxNGGmrXyvLe1j4bIej0vcuZuIxzs4EWtB4LbQL6FgJI_fWj5/pub?output=csv";

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

                // Create a div for each title
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

    containers.forEach((container) => {
        const titleText = container.querySelector("h3").textContent.toLowerCase();
        container.style.display = titleText.includes(searchQuery) ? "block" : "none";
    });
});

// Prevent Form Default Submission
document.getElementById("searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
});

// **API for Adding Titles**
const API_URL = 'https://script.google.com/macros/s/AKfycbwpO5Kf1WphT7rtH6NSrCep58aiD1foLP3YwRk94Ud2a5GInSlDEhLbwMfktJ1zSrdC/exec'; // Replace with your Google Apps Script URL

// Fetch Titles from Google Sheets
async function fetchTitles() {
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log("Fetched Titles:", data); // Debugging
    updateDisplay();
}

// Add Title to Google Sheets
async function addTitle(title) {
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
    });
    fetchTitles();
}

// Handle Title Form Submission
document.getElementById("titleForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const titleInput = document.getElementById("titleInput").value.trim();
    if (titleInput) {
        await addTitle({ title: titleInput });
        document.getElementById("titleInput").value = ""; // Clear input
    }
});

// Initial Fetch
updateDisplay();
fetchTitles();

// Ensure the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    const API_URL = 'https://script.google.com/macros/s/AKfycbyJQiyutYO-gBpRCTal3JXXDzzRTVCr1LgZi13medhYvHIaDs0OceYtpxQNJiQCp--9/exec';
    const titleForm = document.getElementById("titleForm");
    const titleInput = document.getElementById("titleInput");

    // Add Title to Google Sheets
    async function addTitle(title) {
        console.log("Sending title to Google Sheets:", title); // Debugging
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
        });
        console.log("Title added successfully!"); // Debugging
    }

    // Handle Form Submission
    titleForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent page refresh
        const titleValue = titleInput.value.trim();

        if (titleValue) {
            console.log("Form submitted with value:", titleValue); // Debugging
            await addTitle({ title: titleValue });
            titleInput.value = ""; // Clear the input field
        } else {
            console.log("Input field is empty"); // Debugging
        }
    });
});
