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

                    // Get the target section
                    const dynamicSection = document.getElementById("dynamicSection");

                    // Clear existing content
                    dynamicSection.innerHTML = "";

                    rows.forEach((row, index) => {
                        if (row.trim() === "") return; // Skip empty rows

                        const columns = row.split(","); // Split row into columns
                        if (columns.length < 2) {
                            console.warn(`Skipping invalid row ${index + 1}: ${row}`);
                            return; // Skip rows that don't have at least two columns
                        }

                        // Extract data for each row
                        const titleName = columns[0] || "اسم غير معروف";
                        const contentText = columns[1] || "لا توجد بيانات";

                        // Create a row with two columns
                        const rowDiv = document.createElement("div");
                        rowDiv.className = "row";

                        // Column 1: Title
                        const titleColumn = document.createElement("div");
                        titleColumn.className = "column title-column";
                        titleColumn.textContent = titleName;

                        // Column 2: Content and Copy Button
                        const contentColumn = document.createElement("div");
                        contentColumn.className = "column content-column";

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

                        // Append the row to the dynamic section
                        dynamicSection.appendChild(rowDiv);
                    });
                })
                .catch((error) => {
                    console.error("Error loading Google Sheets data:", error);
                });
        }

        // Initial Data Display
        updateDisplay(); // Show data from Google Sheets
 