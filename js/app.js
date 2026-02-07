(() => {
    function normalizePath(pathname) {
        let p = pathname || "/";

        try {
            p = decodeURIComponent(p);
        } catch (_) {}

        if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
        if (p === "/") p = "/index.html";
        return p;
    }

    function setActiveNavLink() {
        const currentPath = normalizePath(document.location.pathname);
        const links = Array.from(document.querySelectorAll(".nav__link[href]"));

        links.forEach((a) => a.classList.remove("nav__link--active"));

        for (const a of links) {
            let linkPath = "";
            try {
                const url = new URL(a.getAttribute("href"), document.location.href);
                linkPath = normalizePath(url.pathname);
            } catch (_) {
                continue;
            }

            if (linkPath === currentPath) {
                a.classList.add("nav__link--active");
            }
        }
    }

    function getLoadDurationMs() {
        // 1) Современный способ: Navigation Timing Level 2
        try {
            const entries = performance.getEntriesByType?.("navigation");
            const nav = entries && entries.length ? entries[0] : null;

            if (nav) {
                const d = Number(nav.duration);
                if (Number.isFinite(d) && d > 0) return d;

                const end = Number(nav.loadEventEnd);
                const start = Number(nav.startTime);
                if (Number.isFinite(end) && end > 0 && Number.isFinite(start)) {
                    const calc = end - start;
                    if (calc > 0) return calc;
                }
            }
        } catch (_) {}

        return null;
    }

    function setFooterLoadTime() {
        const el = document.querySelector("[data-load-time]");
        if (!el) return;

        const ms = getLoadDurationMs();
        if (ms !== null) {
            el.textContent = `Время загрузки: ${ms.toFixed(0)} ms`;
        } else {
            el.textContent = "Время загрузки: недоступно";
        }
    }

    window.addEventListener("DOMContentLoaded", () => {
        setActiveNavLink();
    });

    window.addEventListener("load", () => {
        setFooterLoadTime();
    });

    window.addEventListener("pageshow", () => {
        setFooterLoadTime();
    });
})();
