// Prevent Form Default Submission
document.getElementById("searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
});

// Button Click to Scroll to Specific Section
document.getElementById("goToمحاربين").addEventListener("click", () => {
    const targetSection = document.getElementById("محاربين");
    targetSection.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("goToفرسان").addEventListener("click", () => {
    const targetSection = document.getElementById("فرسان");
    targetSection.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("goToالإدارةعليا").addEventListener("click", () => {
    const targetSection = document.getElementById("الإدارة العليا");
    targetSection.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("goToأعضاء").addEventListener("click", () => {
    const targetSection = document.getElementById("أعضاء");
    targetSection.scrollIntoView({ behavior: "smooth" });
});
