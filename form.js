// Replace with your published Google Sheet URL
const sheetID = "1_01SeG5p8YV0ihDiMIo7COl69RzIV4oHghgl2AuEtN0";
const sheetName = "Sheet2"; // Sheet name

// Construct the URL for the published sheet
const apiURL = `https://docs.google.com/spreadsheets/d/1_01SeG5p8YV0ihDiMIo7COl69RzIV4oHghgl2AuEtN0/edit?usp=drivesdk`;

async function fetchSheetData() {
    try {
        // Fetch data from the published sheet
        const response = await fetch(apiURL);
        const text = await response.text();

        // Parse the JSON from the response (remove Google Sheet wrapper)
        const json = JSON.parse(text.slice(47, -2));
        const rows = json.table.rows;

        const tableBody = document.querySelector("#data-table tbody");
        const columnTitlesRow = document.querySelector("#column-titles");

        tableBody.innerHTML = ""; // Clear existing rows
        columnTitlesRow.innerHTML = ""; // Clear column titles

        // Get column titles from the first row
        const columnTitles = json.table.cols.map((col) => col.label || ""); // Fetch column titles
        columnTitles.forEach((title) => {
            const th = document.createElement("th");
            th.textContent = title;
            columnTitlesRow.appendChild(th);
        });

        // Populate table with rows
        rows.forEach((row) => {
    const tr = document.createElement("tr");

    row.c.forEach((cell, colIndex) => {
        const cellContent = cell?.v || ""; // Get cell content

        const td = document.createElement("td");
        td.textContent = cellContent;

        // Only add نسخ button for the "Description" column (e.g., column index 1)
        if (colIndex === 1) { // Adjust the index based on your column order
            const copyButton = document.createElement("button");
            copyButton.textContent = "نسخ";
            copyButton.onclick = () => {
                navigator.clipboard.writeText(cellContent).then(() => {
                    alert(`تم نسخ: ${cellContent}`);
                });
            };
            td.appendChild(copyButton);
        }

        // Append cell to the row
        tr.appendChild(td);
    });

    // Append row to the table body
    tableBody.appendChild(tr);
});

    } catch (error) {
        console.error("Error fetching sheet data:", error);
    }
}

// Fetch data on page load
fetchSheetData();
