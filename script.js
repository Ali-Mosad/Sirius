// Default data
const defaultCityData = {
    kyoto: {
        "إيرين": { rank: "عضو", balance: 100, item: "لا يوجد" },
        "ماساكو": { rank: "مدير", balance: 200, item: "سيف" },
    },
    osaka: {
        "كين": { rank: "مدير", balance: 500, item: "كتاب" },
        "هانا": { rank: "عضو", balance: 150, item: "قوس" },
    },
};

// Load data from localStorage or use default data
const cityData = JSON.parse(localStorage.getItem("cityData")) || defaultCityData;

// Function to save data to localStorage
function saveCityData() {
    localStorage.setItem("cityData", JSON.stringify(cityData));
}

// DOM Elements
const titleForm = document.getElementById("titleForm");
const kyotoData = document.getElementById("kyotoData");
const message = document.getElementById("message");

// Render Kyoto Data
function updateDisplay() {
    kyotoData.innerHTML = ""; // Clear previous data

    if (Object.keys(cityData.kyoto).length === 0) {
        kyotoData.innerHTML = "<p>لا توجد ألقاب مضافة.</p>";
        return;
    }

    for (const [title, info] of Object.entries(cityData.kyoto)) {
        const entry = document.createElement("div");
        entry.className = "title-item";
        entry.innerHTML = `
            <h3>${title}</h3>
            <p>رتبة: ${info.rank}</p>
            <p>رصيد: ${info.balance}</p>
            <p>أداة: ${info.item || "لا يوجد"}</p>
            <button class="edit-button" data-title="${title}">تعديل</button>
            <button class="delete-button" data-title="${title}">حذف</button>
        `;
        kyotoData.appendChild(entry);
    }

    // Add event listeners for edit and delete buttons
    document.querySelectorAll(".edit-button").forEach((button) => {
        button.addEventListener("click", handleEdit);
    });
    document.querySelectorAll(".delete-button").forEach((button) => {
        button.addEventListener("click", handleDelete);
    });
}

// Handle form submission
titleForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const rank = document.getElementById("rank").value.trim();
    const balance = parseFloat(document.getElementById("balance").value);
    const item = document.getElementById("item").value.trim();

    if (title) {
        // Add or update the title in kyoto data
        cityData.kyoto[title] = { rank, balance, item };

        // Show success message
        showMessage("تم تحديث البيانات بنجاح!", "success");

        // Save to localStorage and update display
        saveCityData();
        updateDisplay();

        // Clear the form
        titleForm.reset();
    } else {
        showMessage("يرجى إدخال لقب صحيح!", "error");
    }
});

// Show message
function showMessage(text, type) {
    message.textContent = text;
    message.className = type === "success" ? "message success" : "message error";

    setTimeout(() => {
        message.textContent = "";
        message.className = "";
    }, 3000);
}

// Initial data display
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

