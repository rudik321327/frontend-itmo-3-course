import { marked } from "https://cdn.jsdelivr.net/npm/marked/+esm";
import hljs from "https://cdn.jsdelivr.net/npm/highlight.js/+esm";

const $ = (id) => document.getElementById(id);

function exampleText() {
    return `# Пост на форуме

Привет! Ниже пример кода:

\`\`\`js
const titles = ["Naruto", "Bleach", "One Piece"];
console.log(titles.join(", "));
\`\`\`

- **жирный**
- *курсив*
- [ссылка](https://myanimelist.net)

> Цитата из обсуждения.
`;
}

function setPreview(html) {
    const preview = $("md-preview");
    if (!preview) return;
    preview.innerHTML = html;
}

function highlightAll() {
    const preview = $("md-preview");
    if (!preview) return;
    preview.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block);
    });
}

function renderMarkdown(md) {
    marked.setOptions({ gfm: true, breaks: true });
    const html = marked.parse(md || "");
    setPreview(html);
    highlightAll();
}

function init() {
    const input = $("md-input");
    const btnRender = $("md-render");
    const btnExample = $("md-example");
    const preview = $("md-preview");

    input.value = exampleText();
    renderMarkdown(input.value);

    btnRender.addEventListener("click", () => renderMarkdown(input.value));
    btnExample.addEventListener("click", () => {
        input.value = exampleText();
        renderMarkdown(input.value);
    });

    input.addEventListener("input", () => renderMarkdown(input.value));
}

window.addEventListener("DOMContentLoaded", init);