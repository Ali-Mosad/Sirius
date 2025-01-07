// Google API configuration
const CLIENT_ID = "404062048289-52l1rue0600ckktsc3hr3jsqt6k03epe.apps.googleusercontent.com"; // Replace with your OAuth 2.0 Client ID
const API_KEY = "AIzaSyD1IS98TdEYjWncrSKwbWWyLgCkPyjmWu4"; // Replace with your API Key
const SPREADSHEET_ID = "1_01SeG5p8YV0ihDiMIo7COl69RzIV4oHghgl2AuEtN0"; // Replace with your Google Sheet ID
const SHEET_NAME = "Sheet1"; // Replace with your sheet name
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

// Initialize the Google API client
function handleClientLoad() {
    gapi.load("client:auth2", initClient);
}

function initClient() {
    gapi.client
        .init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
        })
        .then(() => {
            const authorizeButton = document.getElementById("authorizeButton");
            const signoutButton = document.getElementById("signoutButton");

            // Update UI based on sign-in status
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

            // Add click event listeners
            authorizeButton.onclick = () => gapi.auth2.getAuthInstance().signIn();
            signoutButton.onclick = () => gapi.auth2.getAuthInstance().signOut();
        })
        .catch((error) => {
            console.error("Error initializing Google API client:", error);
        });
}

// Update the UI based on the sign-in status
function updateSigninStatus(isSignedIn) {
    const authorizeButton = document.getElementById("authorizeButton");
    const signoutButton = document.getElementById("signoutButton");
    const addEditSection = document.getElementById("addEditSection");

    if (isSignedIn) {
        authorizeButton.style.display = "none";
        signoutButton.style.display = "block";
        addEditSection.style.display = "block";
    } else {
        authorizeButton.style.display = "block";
        signoutButton.style.display = "none";
        addEditSection.style.display = "none";
    }
}

// Add or edit title in the Google Sheet
function addOrEditTitle(data) {
    const range = `${SHEET_NAME}!A:F`; // Adjust based on your sheet columns (A to F)
    gapi.client.sheets.spreadsheets.values
        .append({
            spreadsheetId: SPREADSHEET_ID,
            range: range,
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            resource: {
                values: [
                    [
                        data.titleName,
                        data.rank,
                        data.balance,
                        data.warning,
                        data.phoneNumber,
                        data.imageUrl,
                    ],
                ],
            },
        })
        .then((response) => {
            console.log("Row added:", response);
            document.getElementById("addEditStatus").innerHTML = `<p>تم الإرسال بنجاح!</p>`;
            updateDisplay(); // Refresh the displayed data
        })
        .catch((error) => {
            console.error("Error adding row:", error);
            document.getElementById("addEditStatus").innerHTML = `<p>حدث خطأ أثناء الإرسال.</p>`;
        });
}

// Fetch and display data from Google Sheets
function updateDisplay() {
    const range = `${SHEET_NAME}!A:F`; // Adjust based on your sheet columns
    gapi.client.sheets.spreadsheets.values
        .get({
            spreadsheetId: SPREADSHEET_ID,
            range: range,
        })
        .then((response) => {
            const rows = response.result.values;
            if (!rows || rows.length === 0) {
                console.log("No data found.");
                return;
            }

            // Clear existing content
            const sections = {
                "الإدارة العليا": document.getElementById("الإدارة العليا"),
                "فرسان": document.getElementById("فرسان"),
                "محاربين": document.getElementById("محاربين"),
                "أعضاء": document.getElementById("أعضاء"),
            };
            Object.values(sections).forEach((section) => (section.innerHTML = ""));

            // Display rows
            rows.forEach((row, index) => {
                if (index === 0) return; // Skip the header row
                const [titleName, rank, balance, warning, phoneNumber, imageUrl] = row;

                // Normalize rank and determine section
                const normalizedRank = rank
                    ?.replace(/[\s\u200C-\u200F]/g, "")
                    .replace(/[\uD800-\uDFFF]/g, "")
                    .toLowerCase();
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

                // Create a title card
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
            console.error("Error fetching data:", error);
        });
}

// Form submission handler
document.getElementById("addEditForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        titleName: formData.get("titleName"),
        rank: formData.get("rank"),
        balance: formData.get("balance"),
        warning: formData.get("warning"),
        phoneNumber: formData.get("phoneNumber"),
        imageUrl: formData.get("imageUrl"),
    };
    addOrEditTitle(data);
});

// Load the API client and auth library
handleClientLoad();
