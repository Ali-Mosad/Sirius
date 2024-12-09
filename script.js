// City-specific data
const cityData = {
    kyoto: {
        "إيرين": { rank: "عضو", balance: 100, item: "لا يوجد" },
        "ماساكو": { rank: "مدير", balance: 200, item: "سيف" },
    },
    osaka: {
        "كين": { rank: "مدير", balance: 500, item: "كتاب" },
        "هانا": { rank: "عضو", balance: 150, item: "قوس" },
    },
};

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
 * @param {string} city - The city whose data is being searched.
 */
function searchPerson(city) {
    const query = document.getElementById("search").value.trim();
    const resultDiv = document.getElementById("result");
    const data = cityData[city];

    if (!resultDiv) {
        console.error("Result container not found in the DOM.");
        return;
    }

    if (data && data[query]) {
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

/**
 * Navigates to the person's details page.
 * @param {string} name - The name of the person.
 * @param {string} city - The city the person belongs to.
 */
function viewDetails(name, city) {
    if (name && city) {
        window.location.href = `details.html?name=${encodeURIComponent(name)}&city=${encodeURIComponent(city)}`;
    } else {
        console.error("Name or city parameter is missing.");
    }
}

/**
 * Displays the details of a person on their details page.
 */
function displayPersonDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get("name");
    const city = urlParams.get("city");
    const personDetailsDiv = document.getElementById("person-details");
    const data = cityData[city];

    if (!personDetailsDiv) {
        console.error("Person details container not found in the DOM.");
        return;
    }

    if (data && data[name]) {
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

/**
 * Lazy loads images when they are about to appear in the viewport.
 */
document.addEventListener("DOMContentLoaded", () => {
    const lazyImages = document.querySelectorAll(".lazy-load");
    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    observer.unobserve(image);
                }
            });
        },
        { threshold: 0.1 }
    );

    lazyImages.forEach((image) => observer.observe(image));
});

/**
 * Handles the menu toggle functionality for mobile view.
 */
document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menuButton");
    const menu = document.getElementById("menu");

    if (menuButton && menu) {
        menuButton.addEventListener("click", () => {
            menu.classList.toggle("show");
        });

        document.addEventListener("click", (e) => {
            if (!menu.contains(e.target) && e.target !== menuButton) {
                menu.classList.remove("show");
            }
        });
    }
});
// script.js
document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menuButton");
    const menu = document.getElementById("menu");

    menuButton.addEventListener("click", () => {
        menu.classList.toggle("menu-open");
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menuButton");
    const menu = document.getElementById("menu");

    menuButton.addEventListener("click", () => {
        menu.classList.toggle("menu-visible");
    });
});

// JavaScript function to add the clicked class to the city card
document.querySelectorAll('.city-card').forEach(card => {
    card.addEventListener('click', function() {
        // Remove the class from all city cards to ensure only one is animated at a time
        document.querySelectorAll('.city-card').forEach(el => el.classList.remove('clicked'));
        
        // Add the class to the clicked card
        this.classList.add('clicked');
        
        // Optionally, trigger navigation or other actions here
        navigate('kyoto');
    });
});


