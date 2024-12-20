// Sheet ID from the Google Spreadsheet URL
const sheetID = "1_01SeG5p8YV0ihDiMIo7COl69RzIV4oHghgl2AuEtN0"; 
const sheetName = "Sheet2"; // Name of the sheet

// Construct the API URL for published sheets
const apiURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

async function fetchSheetData() {
    try {
        const response = await fetch(apiURL);
        const text = await response.text();

        // Extract JSON data from the response
        const json = JSON.parse(text.slice(47, -2));
        const rows = json.table.rows;

        const tableBody = document.querySelector("#data-table tbody");
        tableBody.innerHTML = ""; // Clear existing rows

        rows.forEach((row) => {
            const cellContent = row.c[0]?.v || ""; // First column value
            const noteContent = row.c[0]?.p?.note || ""; // Note of the cell

            // Create table row
            const tr = document.createElement("tr");

            // Add cell content
            const tdContent = document.createElement("td");
            tdContent.textContent = cellContent;

            // Add note content
            const tdNote = document.createElement("td");
            tdNote.textContent = noteContent;

            // Add نسخ button
            const tdCopy = document.createElement("td");
            const copyButton = document.createElement("button");
            copyButton.textContent = "نسخ";
            copyButton.onclick = () => {
                navigator.clipboard.writeText(noteContent).then(() => {
                    alert("تم نسخ المحتوى!");
                });
            };
            tdCopy.appendChild(copyButton);

            // Append all cells to the row
            tr.appendChild(tdContent);
            tr.appendChild(tdNote);
            tr.appendChild(tdCopy);

            // Append the row to the table body
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error fetching sheet data:", error);
    }
}

// Fetch data on page load
fetchSheetData();
