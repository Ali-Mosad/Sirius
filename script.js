// City-specific data
const kyotoData = {
    "إيرين": { "rank": "عضو", "balance": 100, "item": "لا يوجد" },
    "ماساكو": { "rank": "مدير", "balance": 200, "item": "سيف" },
};

const osakaData = {
    "كين": { "rank": "مدير", "balance": 500, "item": "كتاب" },
    "هانا": { "rank": "عضو", "balance": 150, "item": "قوس" },
};

function navigate(city) {
    if (city) {
        // Navigate to the corresponding city's page with the city parameter
        window.location.href = `${city}.html?city=${encodeURIComponent(city)}`;
    } else {
        console.error("City parameter is missing.");
    }
}

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

function searchPerson(city) {
    const query = document.getElementById('search').value.trim();
    const resultDiv = document.getElementById('result');
    const data = city === 'kyoto' ? kyotoData : osakaData;

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
            <button onclick="viewDetails('${encodeURIComponent(query)}', '${city}')">عرض التفاصيل</button>
        `;
    } else {
        resultDiv.innerHTML = "<p>لا توجد بيانات لهذا اللقب.</p>";
    }
}

function viewDetails(name, city) {
    if (name && city) {
        window.location.href = `details.html?name=${encodeURIComponent(name)}&city=${encodeURIComponent(city)}`;
    } else {
        console.error("Name or city parameter is missing.");
    }
}

function displayPersonDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const city = urlParams.get('city');
    const personDetailsDiv = document.getElementById('person-details');
    const data = city === 'kyoto' ? kyotoData : osakaData;

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

document.addEventListener("DOMContentLoaded", () => {
    const lazyImages = document.querySelectorAll(".lazy-load");
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const image = entry.target;
                image.src = image.dataset.src;
                observer.unobserve(image);
            }
        });
    }, { threshold: 0.1 });

    lazyImages.forEach(image => {
        observer.observe(image);
    });
});
