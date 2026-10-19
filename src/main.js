// Shared site behavior: mobile nav, header state, scroll reveal, hero typing, project filters.
(function () {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Mobile nav
    var toggle = document.querySelector(".nav-toggle");
    if (toggle) {
        toggle.addEventListener("click", function () {
            var open = document.body.classList.toggle("nav-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
        document.querySelectorAll(".nav-links a").forEach(function (link) {
            link.addEventListener("click", function () {
                document.body.classList.remove("nav-open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
                document.body.classList.remove("nav-open");
                toggle.setAttribute("aria-expanded", "false");
                toggle.focus();
            }
        });
    }

    // Header border once the page scrolls
    var header = document.querySelector(".site-header");
    if (header) {
        var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
    }

    // Reveal on scroll
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && !reduceMotion) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in");
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add("in"); });
    }

    // Hero typing effect
    var typed = document.querySelector("[data-typed]");
    if (typed) {
        var phrases = JSON.parse(typed.getAttribute("data-typed"));
        var target = typed.querySelector(".typed-text");
        if (reduceMotion) {
            target.textContent = phrases[0];
        } else {
            var p = 0, i = 0, deleting = false;
            var tick = function () {
                var word = phrases[p];
                i += deleting ? -1 : 1;
                target.textContent = word.slice(0, i);
                var delay = deleting ? 35 : 70;
                if (!deleting && i === word.length) { deleting = true; delay = 2200; }
                else if (deleting && i === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 400; }
                setTimeout(tick, delay);
            };
            tick();
        }
    }

    // Project filters
    var filterBar = document.querySelector(".filter-bar");
    if (filterBar) {
        var buttons = filterBar.querySelectorAll("button");
        var items = document.querySelectorAll("[data-tags]");
        buttons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                var f = btn.getAttribute("data-filter");
                buttons.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
                items.forEach(function (item) {
                    var tags = item.getAttribute("data-tags").split(" ");
                    item.hidden = !(f === "all" || tags.indexOf(f) !== -1);
                });
                document.querySelectorAll("[data-group]").forEach(function (group) {
                    group.hidden = !group.querySelector("[data-tags]:not([hidden])");
                });
            });
        });
    }

    // Footer year
    document.querySelectorAll("[data-year]").forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });
})();
