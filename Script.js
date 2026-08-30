const apiKey = "YOUR_API_KEY";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const newsContainer = document.getElementById("newsContainer");
const error = document.getElementById("error");


async function getNews(query) {

    if (query.trim() === "") {
        error.textContent = "Please enter a topic.";
        return;
    }

    error.textContent = "";
    newsContainer.innerHTML = "Loading news...";

    const url =
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`;

    try {

        const response = await fetch(url);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        newsContainer.innerHTML = "";

        if (data.articles.length === 0) {
            error.textContent = "No news found.";
            return;
        }

        data.articles.forEach(article => {

            const card = document.createElement("div");
            card.classList.add("news-card");

            card.innerHTML = `
                <img
                    src="${article.urlToImage || "https://via.placeholder.com/400x200?text=No+Image"}"
                    alt="News image"
                >

                <div class="news-content">

                    <h2>${article.title}</h2>

                    <p>
                        ${article.description || "No description available."}
                    </p>

                    <div class="news-source">
                        Source: ${article.source.name}
                    </div>

                    <div class="news-date">
                        Published: ${new Date(article.publishedAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        })}
                    </div>

                    <a
                        href="${article.url}"
                        target="_blank"
                        class="read-more"
                    >
                        Read More
                    </a>

                </div>
            `;

            newsContainer.appendChild(card);
        });

    } catch (err) {

        newsContainer.innerHTML = "";

        error.textContent = err.message;
    }
}


searchBtn.addEventListener("click", () => {

    const query = searchInput.value;

    getNews(query);

});


searchInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        getNews(searchInput.value);

    }

});