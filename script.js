const data = {
    "إيرين": { "rank": "عضو", "balance": 100, "item": "لا يوجد" },
    "كين": { "rank": "مدير", "balance": 500, "item": "كتاب" },
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

function viewDetails(name) {
    if (name) {
        window.location.href = `details.html?name=${encodeURIComponent(name)}`;
    } else {
        console.error("Name parameter is missing.");
    }
}

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

// Get the menu elements
const menuButton = document.getElementById("menuButton");
const menu = document.getElementById("menu");

// Add event listener to toggle the menu
menuButton.addEventListener("click", () => {
  menu.classList.toggle("show");
});

// Optional: Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && e.target !== menuButton) {
    menu.classList.remove("show");
  }
});

