```javascript
document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       MOBILE NAVIGATION
    ========================================================= */

    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const navigationLinks = document.querySelectorAll(".nav-links a");

    if (hamburger && navLinks) {

        hamburger.addEventListener("click", () => {

            const isOpen = document.body.classList.toggle("menu-open");

            hamburger.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            hamburger.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );
        });


        /*
         * Close mobile navigation after selecting
         * a navigation item.
         */

        navigationLinks.forEach((link) => {

            link.addEventListener("click", () => {

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


        /*
         * Close menu when pressing Escape.
         */

        document.addEventListener("keydown", (event) => {

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


    /* =========================================================
       HEADER SCROLL STATE
    ========================================================= */

    const header = document.querySelector(".site-header");

    if (header) {

        const updateHeader = () => {

            if (window.scrollY > 20) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }

        };

        updateHeader();

        window.addEventListener(
            "scroll",
            updateHeader,
            { passive: true }
        );

    }


    /* =========================================================
       SCROLL REVEAL
    ========================================================= */

    const sections = document.querySelectorAll("main section");

    /*
     * If the browser does not support IntersectionObserver,
     * show everything instead of hiding content.
     */

    if (!("IntersectionObserver" in window)) {

        sections.forEach((section) => {
            section.classList.add("animate");
        });

    } else {

        const observer = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("animate");

                    /*
                     * Each section only needs to be
                     * observed until it appears once.
                     */

                    observer.unobserve(entry.target);

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );


        sections.forEach((section) => {
            observer.observe(section);
        });

    }


    /* =========================================================
       SMOOTH SCROLLING
    ========================================================= */

    const internalLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    internalLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            /*
             * Ignore empty "#".
             */

            if (
                !targetId ||
                targetId === "#"
            ) {
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


    /* =========================================================
       CONTACT FORM
    ========================================================= */

    const contactForm =
        document.getElementById("contact-form");

    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                /*
                 * The portfolio currently does not have
                 * a backend/email service connected.
                 *
                 * Do not pretend that the message was sent.
                 */

                const formStatus =
                    document.getElementById("form-status");

                if (formStatus) {

                    formStatus.textContent =
                        "Please contact me directly by email.";

                }

            }
        );

    }


    /* =========================================================
       CURRENT YEAR
    ========================================================= */

    const yearElement =
        document.querySelector(".site-footer .current-year");

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }

});
```
