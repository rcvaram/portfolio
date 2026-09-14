document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {

        hamburger.addEventListener("click", function () {

            const isOpen = document.body.classList.toggle("menu-open");

            hamburger.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            hamburger.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );
        });

        navLinks.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                document.body.classList.remove("menu-open");

                hamburger.setAttribute(
                    "aria-expanded",
                    "false"
                );

                hamburger.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );
            });

        });

        document.addEventListener("keydown", function (event) {

            if (
                event.key === "Escape" &&
                document.body.classList.contains("menu-open")
            ) {

                document.body.classList.remove("menu-open");

                hamburger.setAttribute(
                    "aria-expanded",
                    "false"
                );

                hamburger.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

                hamburger.focus();
            }
        });
    }


    /* =====================================================
       HEADER SCROLL
    ===================================================== */

    const header = document.querySelector(".site-header");

    if (header) {

        function updateHeader() {

            if (window.scrollY > 20) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }

        updateHeader();

        window.addEventListener(
            "scroll",
            updateHeader,
            { passive: true }
        );
    }


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const sections = document.querySelectorAll("main section");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("animate");

                        observer.unobserve(entry.target);
                    }
                });

            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        sections.forEach(function (section) {
            observer.observe(section);
        });

    } else {

        sections.forEach(function (section) {
            section.classList.add("animate");
        });
    }


    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });


    /* =====================================================
       CONTACT FORM
    ===================================================== */

    const contactForm =
        document.getElementById("contact-form");

    if (contactForm) {

        contactForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const formStatus =
                document.getElementById("form-status");

            if (formStatus) {

                formStatus.textContent =
                    "Please contact me directly by email.";
            }
        });
    }


    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    const yearElement =
        document.querySelector(".site-footer .current-year");

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }

});


/* =====================================================
   MEDIUM ARTICLE LIBRARY
   ===================================================== */

(function () {
    const articles = Array.isArray(window.MEDIUM_ARTICLES)
        ? window.MEDIUM_ARTICLES
        : [];

    const results = document.getElementById("article-results");
    const filters = document.getElementById("article-tags");
    const search = document.getElementById("article-search");
    const empty = document.getElementById("article-empty");
    const prev = document.getElementById("article-prev");
    const next = document.getElementById("article-next");
    const pageLabel = document.getElementById("article-page");
    const count = document.getElementById("article-count");
    const topicCount = document.getElementById("topic-count");
    const latestDate = document.getElementById("latest-article-date");

    if (!results || !filters || !search) return;

    const pageSize = 12;
    let currentPage = 1;
    let activeTag = "All";

    const allTags = [...new Set(
        articles.flatMap(article => article.tags || [])
    )].sort((a, b) => a.localeCompare(b));

    if (count) count.textContent = articles.length;
    if (topicCount) topicCount.textContent = allTags.length;
    if (latestDate && articles[0]?.date) latestDate.textContent = articles[0].date.slice(0, 4);

    allTags.forEach(tag => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "article-filter";
        button.dataset.tag = tag;
        button.textContent = tag;
        filters.appendChild(button);
    });

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function getFilteredArticles() {
        const query = search.value.trim().toLowerCase();

        return articles.filter(article => {
            const matchesTag =
                activeTag === "All" ||
                (article.tags || []).includes(activeTag);

            const haystack = [
                article.title,
                article.excerpt,
                ...(article.tags || [])
            ].join(" ").toLowerCase();

            return matchesTag && (!query || haystack.includes(query));
        });
    }

    function render() {
        const filtered = getFilteredArticles();
        const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

        if (currentPage > totalPages) currentPage = totalPages;

        const start = (currentPage - 1) * pageSize;
        const visible = filtered.slice(start, start + pageSize);

        results.innerHTML = visible.map(article => `
            <article class="article-card article-card-library">
                <div class="article-content">
                    <div class="article-card-topline">
                        <time datetime="${escapeHtml(article.date)}">
                            ${escapeHtml(article.date)}
                        </time>
                        <span>Medium</span>
                    </div>

                    <h3>${escapeHtml(article.title)}</h3>

                    <p>${escapeHtml(article.excerpt)}</p>

                    <div class="article-card-tags">
                        ${(article.tags || []).map(tag =>
                            `<span>${escapeHtml(tag)}</span>`
                        ).join("")}
                    </div>

                    <a
                        href="${escapeHtml(article.url)}"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Read ${escapeHtml(article.title)} on Medium"
                    >
                        Read article →
                    </a>
                </div>
            </article>
        `).join("");

        empty.hidden = visible.length !== 0;
        pageLabel.textContent = `Page ${currentPage} of ${totalPages}`;
        prev.disabled = currentPage === 1;
        next.disabled = currentPage === totalPages || filtered.length === 0;
    }

    filters.addEventListener("click", function (event) {
        const button = event.target.closest(".article-filter");
        if (!button) return;

        activeTag = button.dataset.tag;
        currentPage = 1;

        filters.querySelectorAll(".article-filter").forEach(item => {
            item.classList.toggle("is-active", item === button);
        });

        render();
    });

    search.addEventListener("input", function () {
        currentPage = 1;
        render();
    });

    prev.addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage -= 1;
            render();
            results.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });

    next.addEventListener("click", function () {
        const totalPages = Math.ceil(getFilteredArticles().length / pageSize);
        if (currentPage < totalPages) {
            currentPage += 1;
            render();
            results.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });

    render();
})();
