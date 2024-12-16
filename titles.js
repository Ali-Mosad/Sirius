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
                if (columns.length < 4) {
                    console.warn(`Skipping invalid row ${index + 1}: ${row}`);
                    return; // Skip rows that don't have enough columns
                }

                // Log each row's content to check if it is parsed correctly
                console.log("Parsed Row:", columns);

                // Create a div for each title using the container style
                const titleDiv = document.createElement("div");
                titleDiv.className = "container"; // Use the same container class from CSS

                titleDiv.innerHTML = `
                    <h3>${columns[0]}</h3>
                    <p>رتبة: ${columns[1]}</p>
                    <p>رصيد: ${columns[2]}</p>
                    <p>أداة: ${columns[3] || "لا يوجد"}</p>
                `;
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
updateDisplay(); // Show local default data

document.getElementById('addTitleForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Get form data
    const title = document.getElementById('title').value;
    const rank = document.getElementById('rank').value;
    const balance = document.getElementById('balance').value;
    const tool = document.getElementById('tool').value;

    console.log({ title, rank, balance, tool });

    // The Google Apps Script URL
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbzvOmCC7yzHZ3xLqzgdK4R669V_KKr-o3NjTK8mt3Gr8YNxj0vSxCjbOWY6-eNWkSYI/exec'; // Replace with your Apps Script URL

    // Send data to the Google Apps Script
    const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, rank, balance, tool })
    });

    if (response.ok) {
        alert('تم إضافة اللقب بنجاح');
        updateDisplay(); // Refresh the data display after successful submission
    } else {
        alert('حدث خطأ أثناء إضافة اللقب');
    }
});
