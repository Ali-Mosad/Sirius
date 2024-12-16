// Function to fetch and display data from Google Sheets
function updateDisplay() {
    const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQbAPklpmgpd4GyXOoyQfavDI50cYMYxNGGmrXyvLe1j4bIej0vcuZuIxzs4EWtB4LbQL6FgJI_fWj5/pub?output=csv";

    // Fetch and process the data from Google Sheets
    fetch(sheetURL)
        .then((response) => response.text())
        .then((csv) => {
            console.log("Fetched Google Sheets Data:");
            console.log(csv); // Debugging: Log the CSV data

            // Split CSV into rows and parse
            const rows = csv.split("\n").slice(1); // Skip the header row
            const dynamicContainer = document.getElementById("dynamic-titles");
            dynamicContainer.innerHTML = ""; // Clear any existing content

            if (rows.length === 0) {
                console.error("No data found in the Google Sheets CSV.");
            }

            rows.forEach((row, index) => {
                if (row.trim() === "") return; // Skip empty rows

                const columns = row.split(","); // Split row into columns
                if (columns.length < 6) {
                    console.warn(`Skipping invalid row ${index + 1}: ${row}`);
                    return; // Skip rows that don't have enough columns
                }

                // Log each row's content to check if it is parsed correctly
                console.log("Parsed Row:", columns);

                // Create a div for each title using the container style
                const titleDiv = document.createElement("div");
                titleDiv.className = "container searchable card"; // Use the 'card' class for modern design

                // Set the background image dynamically using column[5] for the image URL
                const imageUrl = columns[5] || ""; // Assuming column[5] contains the image URL
                if (imageUrl) {
                    titleDiv.style.backgroundImage = `url(${imageUrl})`;
                }

                // Extract phone number from the 6th column
                const phoneNumber = columns[4] || ""; // Assuming column[4] contains the phone number

                // Add the content inside the titleDiv
                titleDiv.innerHTML = `
                    <div class="card-content">
                        <h3>${columns[0]}</h3>
                        <p class="rank">رتبة: ${columns[1]}</p>
                        <p class="balance">رصيد: ${columns[2]}</p>
                        <p class="warning">انذار: ${columns[3] || "لا يوجد"}</p>
                        ${
                            phoneNumber
                                ? `<p class="phone"><a href="tel:${phoneNumber}"><i class="fas fa-phone"></i> ${phoneNumber}</a></p>`
                                : ""
                        }
                    </div>
                `;

                // Append to the dynamic container
                dynamicContainer.appendChild(titleDiv);
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

// Initial Data Display
updateDisplay(); // Show data from Google Sheets
