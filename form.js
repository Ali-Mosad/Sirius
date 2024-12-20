async function fetchSheetData() {
      const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQbAPklpmgpd4GyXOoyQfavDI50cYMYxNGGmrXyvLe1j4bIej0vcuZuIxzs4EWtB4LbQL6FgJI_fWj5/pub?gid=1760418669&single=true&output=csv';
      try {
        const response = await fetch(sheetUrl);
        const csvText = await response.text();
        const rows = csvText.split('\n').map(row => row.split(','));
        
        // Remove the first row (headers) if needed
        rows.shift();

        const contentDiv = document.getElementById('content');
        
        // Iterate through rows and create content
        rows.forEach(row => {
          if (row[0] && row[1]) { // Ensure both title and content exist
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';

            const titleDiv = document.createElement('div');
            titleDiv.className = 'title';
            titleDiv.textContent = row[0]; // First column (Title)
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'content';
            contentDiv.textContent = row[1]; // Second column (Content)
            
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.textContent = 'Copy Content';
            copyButton.onclick = () => {
              navigator.clipboard.writeText(row[1]).then(() => {
                alert('Content copied to clipboard!');
              });
            };

            // Append elements
            itemDiv.appendChild(titleDiv);
            itemDiv.appendChild(contentDiv);
            itemDiv.appendChild(copyButton);
            document.getElementById('content').appendChild(itemDiv);
          }
        });
      } catch (error) {
        console.error('Error fetching sheet data:', error);
      }
    }

    // Fetch and display data when the page loads
    window.onload = fetchSheetData;