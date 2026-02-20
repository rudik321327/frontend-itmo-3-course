function normalizePath(p) {
    if (!p) p = "/";
    try { p = decodeURIComponent(p); } catch (_) {}
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    if (p === "/") p = "/index.html";
    return p;
}

function setActiveNavLink() {
    const current = normalizePath(location.pathname);
    document.querySelectorAll(".nav__link[href]").forEach(a => {
        const url = new URL(a.getAttribute("href"), location.href);
        a.classList.toggle("nav__link--active", normalizePath(url.pathname) === current);
    });
}

function setFooterLoadTime() {
    const el = document.querySelector("[data-load-time]");
    if (!el) return;
    const nav = performance.getEntriesByType("navigation")[0];
    el.textContent = nav
        ? `Время загрузки: ${Math.round(nav.duration)} ms`
        : "Время загрузки: недоступно";
}

window.addEventListener("DOMContentLoaded", setActiveNavLink);
window.addEventListener("load", setFooterLoadTime);
window.addEventListener("pageshow", setFooterLoadTime);