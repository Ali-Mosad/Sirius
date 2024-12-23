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
                if (columns.length < 1) {
                    console.warn(`Skipping invalid row ${index + 1}: ${row}`);
                    return; // Skip rows that don't have at least one column
                }

                // Extract data for each row
                const titleName = columns[0] || "اسم غير معروف";

                // Determine the target section (optional if you're grouping titles)
                let targetSection = sections["أعضاء"]; // Default section

                // Create a row with two columns
                const rowDiv = document.createElement("div");
                rowDiv.className = "row";

                // Column 1: Title
                const titleColumn = document.createElement("div");
                titleColumn.className = "column title-column";
                titleColumn.textContent = titleName;

                // Column 2: Template Content and Copy Button
                const contentColumn = document.createElement("div");
                contentColumn.className = "column content-column";

                // Define the fixed template content
                const contentText = `⋆﴿نورتنا 🤍﴾⋆
✩‏━━━━─ ─ *⋆｡˚*❪ ⚜️ ❫ *˚｡⋆*─ ─━━━━✩
*◞✦┆الرجاء ملئ الإستمارة◜*

*⋆☾ اللقب : ❰ ❱˚* 
> *لقب : تختار شخصية من انميات - مسلسلات - افلام - ألعاب + تختار شخصية حسب جنسك.*

*⋆☾ الطرف: ❰ ❱˚*
> من وين دخلت الرابط + وش كان اسم الحساب او لقبه.

✰ ملاحظة: أرسل صورة للشخصية الي اخترت لقبها.
✩‏━━━━─ ─ *⋆｡˚*❪ ⚜️ ❫ *˚｡⋆*─ ─━━━━✩`;

                const contentDiv = document.createElement("pre"); // Use <pre> to preserve line breaks
                contentDiv.textContent = contentText;

                const copyButton = document.createElement("button");
                copyButton.className = "copy-button";
                copyButton.textContent = "Copy";
                copyButton.onclick = () => {
                    navigator.clipboard.writeText(contentText);
                    alert("تم نسخ النص!");
                };

                contentColumn.appendChild(contentDiv);
                contentColumn.appendChild(copyButton);

                // Append columns to the row
                rowDiv.appendChild(titleColumn);
                rowDiv.appendChild(contentColumn);

                // Append the row to the target section
                targetSection.appendChild(rowDiv);
            });
        })
        .catch((error) => {
            console.error("Error loading Google Sheets data:", error);
        });
}

// Prevent Form Default Submission
document.getElementById("searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
});

// Initial Data Display
updateDisplay(); // Show data from Google Sheets
