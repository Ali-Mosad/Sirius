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

function searchPerson() {
    const query = document.getElementById("search").value.trim();
    const resultDiv = document.getElementById("result");

    if (!resultDiv) {
        console.error("Result container not found in the DOM.");
        return;
    }

    // Clear previous results
    resultDiv.classList.remove('show');
    
    if (query) {
        const dbRef = firebase.database().ref('titles/' + query);  // Search for the nickname

        dbRef.once('value').then(snapshot => {
            const data = snapshot.val();

            if (data) {
                resultDiv.innerHTML = `
                    <div class="id-card">
                        <div class="id-photo">
                            <img src="default-photo.png" alt="Photo">
                        </div>
                        <div class="id-details">
                            <p><strong>اللقب:</strong> ${query}</p>
                            <p><strong>الرتبة:</strong> ${data.rank}</p>
                            <p><strong>الرصيد:</strong> ${data.balance}</p>
                            <p><strong>الانذار:</strong> ${data.item}</p>
                        </div>
                    </div>
                `;
                setTimeout(() => {
                    resultDiv.classList.add('show');
                }, 10);
            } else {
                resultDiv.innerHTML = "<p>لا توجد بيانات لهذا اللقب.</p>";
                setTimeout(() => {
                    resultDiv.classList.add('show');
                }, 10);
            }
        }).catch(error => {
            console.error("Error fetching data: ", error);
        });
    }
}

    // Function to display all titles from Firebase
    function displayAllTitles() {
        const dbRef = firebase.database().ref('titles');
        
        dbRef.once('value').then(snapshot => {
            const data = snapshot.val();
            const titlesList = document.getElementById('titlesList');
            
            if (data) {
                titlesList.innerHTML = ''; // Clear existing titles
                for (const nickname in data) {
                    const titleData = data[nickname];
                    titlesList.innerHTML += `
                        <div class="title-item">
                            <h3>${nickname}</h3>
                            <p>الرتبة: ${titleData.rank}</p>
                            <p>الرصيد: ${titleData.balance}</p>
                            <p>الانذار: ${titleData.item}</p>
                        </div>
                    `;
                }
            } else {
                titlesList.innerHTML = "<p>لا توجد ألقاب.</p>";
            }
        }).catch(error => {
            console.error("Error fetching titles: ", error);
        });
    }

    // Call this function on page load to display all titles
    document.addEventListener('DOMContentLoaded', displayAllTitles);

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

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD1IS98TdEYjWncrSKwbWWyLgCkPyjmWu4",
    authDomain: "sirius-b68de.firebaseapp.com",
    databaseURL: "https://sirius-b68de-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "sirius-b68de",
    storageBucket: "sirius-b68de.firebasestorage.app",
    messagingSenderId: "404062048289",
    appId: "1:404062048289:web:c7f5749e785c1e9b571360"
};

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);

function addOrEditPerson() {
    console.log("Button clicked");  // Debugging line to check if the function is called

    const nickname = document.getElementById("nickname").value.trim();
    const rank = document.getElementById("rank").value.trim();
    const balance = document.getElementById("balance").value.trim();
    const item = document.getElementById("item").value.trim();

    // Log the form values to ensure they are captured correctly
    console.log('Adding/Editing Person:', nickname, rank, balance, item);

    if (nickname && rank && balance && item) {
        console.log("Attempting to save data to Firebase...");

        const dbRef = firebase.database().ref('titles/' + nickname); // Use nickname as key
        dbRef.set({
            rank: rank,
            balance: balance,
            item: item
        }).then(() => {
            console.log("Data saved successfully");
            alert("تمت إضافة أو تعديل اللقب بنجاح!");
            document.getElementById("editForm").reset();  // Reset the form after saving
        }).catch(error => {
            console.error("Error saving data: ", error);
            alert("حدث خطأ أثناء حفظ البيانات.");
        });
    } else {
        alert("جميع الحقول مطلوبة.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const saveButton = document.querySelector('button[type="button"]');
    saveButton.addEventListener("click", addOrEditPerson);
});
