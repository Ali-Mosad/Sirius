// Centralized data object
const data = {
    "إيرين": { "rank": "عضو", "balance": 100, "item": "لا يوجد" },
    "كين": { "rank": "مدير", "balance": 500, "item": "كتاب" },
};

// Navigate to a specific city's page
function navigate(city) {
    if (city) {
        window.location.href = `city.html?city=${encodeURIComponent(city)}`;
    } else {
        console.error("City parameter is missing.");
    }
}

// Display the city name dynamically on the city page
function displayCityName() {
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get('city');
    const cityNameElement = document.getElementById('city-name');

    if (cityNameElement) {
        cityNameElement.textContent = city ? city : "مدينة غير معروفة";
    } else {
        console.error("City name element not found in the DOM.");
    }
}

// Search for a person's details
function searchPerson() {
    const query = document.getElementById('search').value.trim();
    const resultDiv = document.getElementById('result');

    if (!resultDiv) {
        console.error("Result container not found in the DOM.");
        return;
    }

    if (data[query]) {
        const details = data[query];
        resultDiv.innerHTML = `
            <p><strong>اللقب:</strong> ${query}</p>
            <p><strong>الرتبة:</strong> ${details.rank}</p>
            <p><strong>الرصيد:</strong> ${details.balance}</p>
            <p><strong>السلعة:</strong> ${details.item}</p>
            <button onclick="viewDetails('${encodeURIComponent(query)}')">عرض التفاصيل</button>
        `;
    } else {
        resultDiv.innerHTML = "<p>لا توجد بيانات لهذا اللقب.</p>";
    }
}

// Navigate to the details page for a specific person
function viewDetails(name) {
    if (name) {
        window.location.href = `details.html?name=${encodeURIComponent(name)}`;
    } else {
        console.error("Name parameter is missing.");
    }
}

// Display person details dynamically on the details page
function displayPersonDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const personDetailsDiv = document.getElementById('person-details');

    if (!personDetailsDiv) {
        console.error("Person details container not found in the DOM.");
        return;
    }

    if (data[name]) {
        const details = data[name];
        personDetailsDiv.innerHTML = `
            <p><strong>اللقب:</strong> ${name}</p>
            <p><strong>الرتبة:</strong> ${details.rank}</p>
            <p><strong>الرصيد:</strong> ${details.balance}</p>
            <p><strong>السلعة:</strong> ${details.item}</p>
        `;
    } else {
        personDetailsDiv.innerHTML = "<p>اللقب غير موجود.</p>";
    }
}
