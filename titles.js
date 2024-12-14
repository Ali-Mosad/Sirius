// Update titles page
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

function updateDisplay() {
    const kyotoData = document.getElementById("kyotoData");
    kyotoData.innerHTML = ""; // Clear previous data

    if (Object.keys(defaultCityData.kyoto).length === 0) {
        kyotoData.innerHTML = "<p>لا توجد ألقاب مضافة.</p>";
        return;
    }

    for (const [title, info] of Object.entries(defaultCityData.kyoto)) {
        const entry = document.createElement("div");
        entry.className = "title-item";
        entry.innerHTML = `
            <h3>${title}</h3>
            <p>رتبة: ${info.rank}</p>
            <p>رصيد: ${info.balance}</p>
            <p>أداة: ${info.item || "لا يوجد"}</p>
        `;
        kyotoData.appendChild(entry);
    }
}

// Display titles on load
updateDisplay();
