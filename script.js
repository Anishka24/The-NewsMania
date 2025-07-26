const API_KEY = "640d325d76716270957947d124c71a80";
const BASE_URL = "https://gnews.io/api/v4/search?q=";

const categories = {
    international: ["Politics", "Business", "Sports", "Technology", "Entertainment", "Education", "Local", "Health", "Opinion"],
    national: ["Politics", "Business", "Sports", "Technology", "Entertainment", "Education", "Local", "Health", "Opinion"],
    localized: ["Politics", "Business", "Sports", "Technology", "Entertainment", "Education", "Local", "Health", "Opinion"]
};

let currentLang = "en";
let curSelectedButton = null;

window.addEventListener("load", () => {
    renderCategories();
    fetchNews("India");
});

// Fetch News
async function fetchNews(query) {
    try {
        const res = await fetch(`${BASE_URL}${query}&lang=${currentLang}&token=${API_KEY}`);
        const data = await res.json();
        bindData(data.articles);
    } catch (err) {
        console.error("Error fetching news:", err);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    if (!articles || articles.length === 0) {
        cardsContainer.innerHTML = "<p>No news found for this category.</p>";
        return;
    }

    articles.forEach((article) => {
        if (!article.image) return;

        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.image;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description || "No description available";

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// Render Categories
function renderCategories() {
    const sectionNames = Object.keys(categories);

    sectionNames.forEach((section) => {
        const container = document.getElementById(`${section}-subtopics`);
        container.innerHTML = "";

        categories[section].forEach((topic) => {
            const button = document.createElement("button");
            button.textContent = topic;
            button.classList.add("subtopic-button");
            button.addEventListener("click", () => {
                fetchNews(`${section} ${topic}`);
                highlightButton(button);
            });
            container.appendChild(button);
        });
    });
}

function highlightButton(button) {
    if (curSelectedButton) curSelectedButton.classList.remove("active");
    curSelectedButton = button;
    curSelectedButton.classList.add("active");
}

// Search functionality
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim();
    if (!query) return;
    fetchNews(query);
    if (curSelectedButton) curSelectedButton.classList.remove("active");
    curSelectedButton = null;
});

// Notes functionality
document.getElementById("save-note").addEventListener("click", () => {
    localStorage.setItem("userNote", document.getElementById("notes").value);
    alert("Note saved!");
});

document.getElementById("download-note").addEventListener("click", () => {
    const content = document.getElementById("notes").value;
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "my_note.txt";
    a.click();
});

document.getElementById("clear-note").addEventListener("click", () => {
    document.getElementById("notes").value = "";
    localStorage.removeItem("userNote");
});

// Load saved notes
document.getElementById("notes").value = localStorage.getItem("userNote") || "";

// Theme toggle
document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Language toggle
document.getElementById("lang-toggle").addEventListener("click", () => {
    currentLang = currentLang === "en" ? "hi" : "en";
    fetchNews("India");
});


