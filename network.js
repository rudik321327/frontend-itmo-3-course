const API = "https://api.jikan.moe/v4/anime";
const LIMIT = 6;

const GENRES = [
    { id: 1, name: "Action" },
    { id: 4, name: "Comedy" },
    { id: 8, name: "Drama" },
    { id: 10, name: "Fantasy" },
    { id: 14, name: "Horror" },
    { id: 22, name: "Romance" },
    { id: 24, name: "Sci-Fi" },
    { id: 30, name: "Sports" }
];

const $ = (id) => document.getElementById(id);
const rnd = (n) => Math.floor(Math.random() * n);

function show(el, display) {
    el.hidden = false;
    el.style.display = display;
}

function hide(el) {
    el.hidden = true;
    el.style.display = "none";
}

function render(items, label) {
    const content = $("live-content");
    const tpl = $("tpl-news");

    content.textContent = "";

    const info = document.createElement("p");
    info.className = "hint";
    info.textContent = label;
    content.appendChild(info);

    for (const it of items) {
        const frag = tpl.content.cloneNode(true);

        frag.querySelector(".post__title").textContent = it.title || "Без названия";

        const s = it.synopsis || "Описание недоступно.";
        frag.querySelector(".post__body").textContent = s.length > 220 ? s.slice(0, 220) + "…" : s;

        frag.querySelector(".news__link").href = it.url || "#";

        content.appendChild(frag);
    }
}

async function load() {
    const loader = $("live-loader");
    const error = $("live-error");
    const content = $("live-content");
    const btn = $("reload-live");

    hide(error);
    hide(content);
    show(loader, "flex");
    btn.disabled = true;

    const g = GENRES[rnd(GENRES.length)];
    const page = 1 + rnd(3);
    const url = `${API}?genres=${g.id}&order_by=popularity&sort=desc&page=${page}&limit=${LIMIT}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();

        render(Array.isArray(data.data) ? data.data : [], `Фильтр: жанр ${g.name}`);
        show(content, "grid");
    } catch (e) {
        error.textContent = `Ошибка загрузки.`;
        show(error, "block");
    } finally {
        hide(loader);
        btn.disabled = false;
    }
}

addEventListener("DOMContentLoaded", () => {
    $("reload-live").onclick = load;
    load();
});