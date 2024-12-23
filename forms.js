// Function to fetch and display data from Google Sheets
function updateDisplay() {
    const sheetURL =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vRjjGXiKyN8BogrMo4qrs3-sRuwuei9Osf1MVmsnGCRojXniVZ2LzZXSYbmfhBXUJ-MvffiZ8lsG1Bv/pub?output=csv";

    // Fetch and parse the CSV using PapaParse
    fetch(sheetURL)
        .then(response => response.text())
        .then(csv => {
            // Parse CSV data with PapaParse
            const parsedData = Papa.parse(csv, {
                header: true, // Use the first row as the header
                skipEmptyLines: true, // Skip empty rows
            });

            // Target HTML section to display the data
            const dynamicSection = document.getElementById("dynamicSection");

            // Clear existing content
            dynamicSection.innerHTML = "";

            // Process and display each row
            parsedData.data.forEach((row, index) => {
                const title = row['Title'] || "Unknown Title";
                const content = row['Content'] || "No Data Available";

                // Create row element
                const rowDiv = document.createElement("div");
                rowDiv.className = "row";

                // Title Column
                const titleDiv = document.createElement("div");
                titleDiv.className = "column title-column";
                titleDiv.textContent = title;

                // Content Column
                const contentDiv = document.createElement("div");
                contentDiv.className = "column content-column";

                const textarea = document.createElement("textarea");
                textarea.className = "content-text";
                textarea.value = content;
                textarea.readOnly = true;

                const copyButton = document.createElement("button");
                copyButton.className = "copy-button";
                copyButton.textContent = "Copy";
                copyButton.onclick = () => {
                    navigator.clipboard.writeText(content).then(() => {
                        alert("Text copied to clipboard!");
                    }).catch(() => {
                        alert("Failed to copy text.");
                    });
                };

                contentDiv.appendChild(textarea);
                contentDiv.appendChild(copyButton);

                rowDiv.appendChild(titleDiv);
                rowDiv.appendChild(contentDiv);

                dynamicSection.appendChild(rowDiv);
            });
        })
        .catch(error => {
            console.error("Error loading Google Sheets data:", error);
        });
}

// Initial data display
updateDisplay();
