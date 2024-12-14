// Default data
const defaultCityData = {
    kyoto: {
        "إيرين": { rank: "عضو", balance: 100, item: "لا يوجد" },  
        "سمايل": { rank: "باكا", balance: 1, item: "مدري" },
        "ماساكو": { rank: "مدير", balance: 200, item: "سيف" },
    },
    osaka: {
        "كين": { rank: "مدير", balance: 500, item: "كتاب" },
        "هانا": { rank: "عضو", balance: 150, item: "قوس" },
    },
};

// Search functionality when the button is clicked
document.getElementById("searchButton").addEventListener("click", function() {
    const query = document.getElementById("search").value.trim();
    const searchResult = document.getElementById("searchResult");
    
    searchResult.innerHTML = ""; // Clear previous results

    // Search in the kyoto data
    if (defaultCityData.kyoto[query]) {
        const { rank, balance, item } = defaultCityData.kyoto[query];
        searchResult.innerHTML = `
            <h3>${query}</h3>
            <p>رتبة: ${rank}</p>
            <p>رصيد: ${balance}</p>
            <p>أداة: ${item || "لا يوجد"}</p>
        `;
    } else {
        searchResult.innerHTML = "<p>لا توجد بيانات لهذا اللقب.</p>";
    }
});

// Handle search functionality
const searchForm = document.getElementById("searchForm");
const searchResult = document.getElementById("searchResult");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const query = document.getElementById("search").value.trim();
    searchResult.innerHTML = ""; // Clear previous results
    
    if (defaultCityData.kyoto[query]) {
        const { rank, balance, item } = defaultCityData.kyoto[query];
        searchResult.innerHTML = `
            <h3>${query}</h3>
            <p>رتبة: ${rank}</p>
            <p>رصيد: ${balance}</p>
            <p>أداة: ${item || "لا يوجد"}</p>
        `;
    } else {
        searchResult.innerHTML = "<p>لا توجد بيانات لهذا اللقب.</p>";
    }
});

// Initial render
updateDisplay();

/**
 * Navigates to the corresponding city's page.
 * @param {string} city - The city to navigate to.
 */
function navigate(city) {
    if (city) {
        window.location.href = `${city}.html?city=${encodeURIComponent(city)}`;
    } else {
        console.error("City parameter is missing.");
    }
}

/**
 * Displays the current city name on the page.
 */
function displayCityName() {
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get("city");
    const cityNameElement = document.getElementById("city-name");

    if (cityNameElement) {
        cityNameElement.textContent = city ? city : "مدينة غير معروفة";
    } else {
        console.error("City name element not found in the DOM.");
    }
}

/**
 * Searches for a person in the city's data and displays their details.
 */
function searchPerson() {
    const query = document.getElementById("search").value.trim();
    const resultDiv = document.getElementById("result");
    const city = getCityFromURL(); // Function to get city from URL query
    const data = cityData[city];

    if (!resultDiv) {
        console.error("Result container not found in the DOM.");
        return;
    }

    // Clear previous results and remove the animation class before applying the new one
    resultDiv.classList.remove('show');

    if (data && data[query]) {
        const details = data[query];
        resultDiv.innerHTML = `
            <div class="id-card">
                <div class="id-photo">
                    <img src="default-photo.png" alt="Photo">
                </div>
                <div class="id-details">
                    <p><strong>اللقب:</strong> ${query}</p>
                    <p><strong>الرتبة:</strong> ${details.rank}</p>
                    <p><strong>الرصيد:</strong> ${details.balance}</p>
                    <p><strong>الانذار:</strong> ${details.item}</p>
                </div>
            </div>
        `;
        // Add the animation class after updating the content
        setTimeout(() => {
            resultDiv.classList.add('show');
        }, 10);
    } else {
        resultDiv.innerHTML = "<p>لا توجد بيانات لهذا اللقب.</p>";
        // Add the animation class after updating the content
        setTimeout(() => {
            resultDiv.classList.add('show');
        }, 10);
    }
}

/**
 * Utility function to extract the city from the current URL.
 */
function getCityFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("city");
}

/**
 * Toggles the menu's visibility on mobile.
 */
document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menuButton");
    const menu = document.getElementById("menu");

    if (menuButton && menu) {
        menuButton.addEventListener("click", () => {
            menu.classList.toggle("menu-open");
        });
    }

    // Display city name when the page loads
    displayCityName();
});

// Default Admin Password (Change this for security)
const adminPassword = "secureAdmin123";

// Admin Section DOM
const adminSection = document.getElementById("adminSection");
const adminAccessButton = document.getElementById("adminAccessButton");

// Function to Check Admin Access
function checkAdminAccess() {
    const userPassword = prompt("أدخل كلمة المرور للوصول إلى الإدارة:");

    if (userPassword === adminPassword) {
        adminSection.style.display = "block"; // Show admin section
        alert("تم منح الوصول إلى الإدارة.");
        adminAccessButton.style.display = "none"; // Hide the button once access is granted
    } else {
        alert("كلمة المرور غير صحيحة. لا يمكنك الوصول إلى الإدارة.");
    }
}

// Event Listener for Admin Access Button
adminAccessButton.addEventListener("click", checkAdminAccess);

// Handling Title Form Submission (Everyone Can Add Titles)
document.getElementById("titleForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();

    if (title) {
        cityData.kyoto[title] = { rank: "", balance: 0, item: "" }; // Only title is added
        document.getElementById("message").textContent = "تمت إضافة اللقب بنجاح!";
        saveCityData(); // Save to localStorage
        updateDisplay();
    }
});

// Handling Admin Form Submission (Only Admins Can Edit Extra Fields)
document.getElementById("adminForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const rank = document.getElementById("rank").value.trim();
    const balance = parseFloat(document.getElementById("balance").value);
    const item = document.getElementById("item").value.trim();

    if (title && cityData.kyoto[title]) {
        cityData.kyoto[title] = { rank, balance, item }; // Update the title's details
        document.getElementById("message").textContent = "تم تحديث بيانات اللقب بنجاح!";
        saveCityData(); // Save to localStorage
        updateDisplay();
    } else {
        alert("اللقب غير موجود. أضف اللقب أولاً.");
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var typedText = document.querySelector('.typing-text');
    var text = typedText.textContent;
    typedText.textContent = '';
    var i = 0;
    function typeWriter() {
        if (i < text.length) {
            typedText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    typeWriter();
});



