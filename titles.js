const SHEET_CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQbAPklpmgpd4GyXOoyQfavDI50cYMYxNGGmrXyvLe1j4bIej0vcuZuIxzs4EWtB4LbQL6FgJI_fWj5/pub?output=csv";
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx8Bi4uYlCFbwJcx5Zro_kIFHSpnbXJxUDR3rYPiW_z7PJlwZCVuB49SJL_kd1kn4-D/exec"; // Replace with your Web App URL

// Fetch and display data from Google Sheets
function updateDisplay() {
    fetch(SHEET_CSV_URL)
        .then((response) => response.text())
        .then((csv) => {
            console.log("Fetched Google Sheets Data:");
            console.log(csv);

            // Parse CSV into rows and display
            const rows = csv.split("\n").slice(1); // Skip header
            const sections = {
                "الإدارة العليا": document.getElementById("الإدارة العليا"),
                "فرسان": document.getElementById("فرسان"),
                "محاربين": document.getElementById("محاربين"),
                "أعضاء": document.getElementById("أعضاء"),
            };

            Object.values(sections).forEach((section) => (section.innerHTML = ""));

            rows.forEach((row) => {
                if (!row.trim()) return; // Skip empty rows

                const [titleName, rank, balance, warning, phoneNumber, imageUrl] = row.split(",");
                const normalizedRank = rank.replace(/[\s\u200C-\u200F]/g, "").toLowerCase();

                const targetSection =
                    normalizedRank.includes("فارس") ? sections["فرسان"] :
                    normalizedRank.includes("محارب") ? sections["محاربين"] :
                    sections["الإدارة العليا"]; // Default to "الإدارة العليا"

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
                        <p class="warning">إنذار: ${warning}</p>
                        ${
                            phoneNumber
                                ? `<p class="phone"><a href="tel:${phoneNumber}"><i class="fas fa-phone"></i> ${phoneNumber}</a></p>`
                                : ""
                        }
                    </div>
                `;

                targetSection.appendChild(titleDiv);
            });
        })
        .catch((error) => console.error("Error fetching Google Sheets data:", error));
}

// Add a new title
function addTitle() {
    const titleName = document.getElementById("titleName").value;
    const rank = document.getElementById("rank").value;
    const balance = document.getElementById("balance").value;
    const warning = document.getElementById("warning").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const imageUrl = document.getElementById("imageUrl").value;

    if (!titleName || !rank) {
        alert("Please provide both title name and rank.");
        return;
    }

    fetch(WEB_APP_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "add",
            titleName,
            rank,
            balance,
            warning,
            phoneNumber,
            imageUrl,
        }),
    })
        .then((response) => response.text())
        .then((message) => {
            alert(message);
            updateDisplay(); // Refresh the display
        })
        .catch((error) => console.error("Error adding title:", error));
}

// Edit an existing title
function editTitle() {
    const titleName = document.getElementById("titleName").value;
    const rank = document.getElementById("rank").value;
    const balance = document.getElementById("balance").value;
    const warning = document.getElementById("warning").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const imageUrl = document.getElementById("imageUrl").value;

    if (!titleName) {
        alert("Please provide the title name to edit.");
        return;
    }

    fetch(WEB_APP_URL, {
        method: "POST",
        mode: "cors", // Enable CORS
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "add",
            titleName,
            rank,
            balance,
            warning,
            phoneNumber,
            imageUrl,
        }),
    })
        .then((response) => response.text())
        .then((message) => {
            alert(message);
            updateDisplay();
        })
        .catch((error) => console.error("Error adding title:", error));    
}

// Event listeners
document.getElementById("addButton").addEventListener("click", addTitle);
document.getElementById("editButton").addEventListener("click", editTitle);
document.getElementById("searchButton").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value.toLowerCase();
    document.querySelectorAll(".searchable").forEach((card) => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = title.includes(query) ? "block" : "none";
    });
});

// Initial load
updateDisplay();
