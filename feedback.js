(() => {
    const KEY = "mangasite_feedback_v4";

    function load() {
        const raw = localStorage.getItem(KEY);
        const data = raw ? JSON.parse(raw) : [];
        return Array.isArray(data) ? data : [];
    }

    function save(items) {
        localStorage.setItem(KEY, JSON.stringify(items));
    }

    function uid() {
        return (`${Date.now()}_${Math.random().toString(16).slice(2)}`);
    }

    function setEmpty(list, empty) {
        empty.hidden = list.children.length > 0;
    }

    function makeNode(template, item) {
        const frag = template.content.cloneNode(true);
        const li = frag.querySelector(".feedback__item");
        li.dataset.id = item.id;

        frag.querySelector(".feedback__title").textContent = item.name;
        frag.querySelector(".feedback__email").textContent = item.email;
        frag.querySelector(".feedback__text").textContent = item.text;

        const editForm = frag.querySelector("[data-edit-form]");
        const textarea = editForm.querySelector("textarea");
        const errEl = editForm.querySelector(".feedback-edit__error");

        function openEdit() {
            errEl.textContent = "";
            textarea.value = li.querySelector(".feedback__text").textContent;
            editForm.hidden = false;
            textarea.focus();
        }

        function closeEdit() {
            errEl.textContent = "";
            editForm.hidden = true;
        }

        li.addEventListener("click", (e) => {
            const btn = e.target.closest("button[data-action]");
            if (!btn) return;

            const action = btn.dataset.action;

            if (action === "edit") openEdit();
            if (action === "cancel") closeEdit();

            if (action === "delete") {
                li.dispatchEvent(new CustomEvent("fb:delete", { bubbles: true, detail: { id: item.id } }));
            }
        });

        editForm.addEventListener("submit", (e) => {
            e.preventDefault();
            errEl.textContent = "";

            if (!editForm.checkValidity()) {
                editForm.reportValidity();
                return;
            }

            const newText = textarea.value.trim();
            li.dispatchEvent(new CustomEvent("fb:update", { bubbles: true, detail: { id: item.id, text: newText } }));
            closeEdit();
        });

        return frag;
    }

    function init() {
        const form = document.getElementById("feedbackForm");
        const list = document.getElementById("feedbackList");
        const empty = document.getElementById("emptyState");
        const template = document.getElementById("feedbackItemTemplate");
        const formError = document.getElementById("formError");

        const nameInput = document.getElementById("nameInput");
        const emailInput = document.getElementById("emailInput");
        const textInput = document.getElementById("textInput");

        let items = load();

        function setFormError(msg) {
            formError.textContent = msg || "";
        }

        function render() {
            list.innerHTML = "";
            for (const it of items) list.appendChild(makeNode(template, it));
            setEmpty(list, empty);
        }

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            setFormError("");

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const item = {
                id: uid(),
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                text: textInput.value.trim()
            };

            items.unshift(item);
            save(items);

            list.prepend(makeNode(template, item));
            setEmpty(list, empty);

            form.reset();
            nameInput.focus();
        });

        form.addEventListener("reset", () => setFormError(""));

        list.addEventListener("fb:delete", (e) => {
            const id = e.detail.id;
            items = items.filter((x) => x.id !== id);
            save(items);

            const node = list.querySelector(`.feedback__item[data-id="${CSS.escape(id)}"]`);
            if (node) node.remove();
            setEmpty(list, empty);
        });

        list.addEventListener("fb:update", (e) => {
            const { id, text } = e.detail;
            const idx = items.findIndex((x) => x.id === id);
            if (idx === -1) return;

            items[idx] = { ...items[idx], text };
            save(items);

            const node = list.querySelector(`.feedback__item[data-id="${CSS.escape(id)}"]`);
            if (!node) return;
            const textEl = node.querySelector(".feedback__text");
            if (textEl) textEl.textContent = text;
        });

        render();
    }

    window.addEventListener("DOMContentLoaded", init);
})();
