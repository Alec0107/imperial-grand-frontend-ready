// js/admin/cat.js
import { NewAPI } from "../../../js/APIurl/api.js";
import { adminDashboard } from "../../../js/SPAJS/HtmlPages.js";

/* ---------------- helpers ---------------- */
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

const jfetch = async (url, opts = {}) => {
  const res = await fetch(url, { credentials: "include", ...opts });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`${opts.method || "GET"} ${url} → ${res.status} ${txt}`);
  }
  return res.status === 204 ? null : res.json();
};

const mustInt = (val) => {
  const n = Number.parseInt(String(val ?? "").trim(), 10);
  return Number.isFinite(n) ? n : NaN;
};

const API = {
  listCats:  () => jfetch(NewAPI.admin.catsub.categories),
  createCat: (body) => jfetch(NewAPI.admin.catsub.categories, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  }),
  updateCat: (id, body) => jfetch(`${NewAPI.admin.catsub.categories}/${id}`, {
    method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  }),
  deleteCat: (id) => jfetch(`${NewAPI.admin.catsub.categories}/${id}`, { method: "DELETE" }),

  listSubcats:  (catId) => jfetch(`${NewAPI.admin.catsub.subcategoriesByCat}?categoryId=${encodeURIComponent(catId)}`),
  createSubcat: (catId, body) => jfetch(`${NewAPI.admin.catsub.subcategoriesByCat}?categoryId=${encodeURIComponent(catId)}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  }),
  updateSubcat: (subId, body) => jfetch(`${NewAPI.admin.catsub.subcategoriesByCat}/${subId}`, {
    method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  }),
  deleteSubcat: (subId) => jfetch(`${NewAPI.admin.catsub.subcategoriesByCat}/${subId}`, { method: "DELETE" }),
};

let selectedCatId = null;

export async function showCategoriesPage() {
  const content = document.querySelector(".content");
  content.innerHTML = adminDashboard.categories;

  // --- grab all refs and loudly warn if any are missing
  const need = (id) => {
    const el = document.getElementById(id);
    if (!el) console.error(`[cat.js] Missing #${id} in HTML`);
    return el;
  };

  // left table / controls
  const catBody        = need("cat-table-body");
  const btnAddCat      = need("btn-add-category");

  // category drawer
  const catOverlay     = need("cat-overlay");
  const catDrawer      = need("cat-drawer");
  const catTitle       = need("cat-drawer-title");
  const catNameInput   = need("cat-name");
  const catOrderInput  = need("cat-order");
  const catSaveBtn     = need("cat-save-btn");

  // right panel / subcats
  const btnAddSub      = need("btn-add-subcat");
  const subHint        = need("subcat-empty-hint");
  const subTable       = need("subcat-table");
  const subBody        = need("subcat-table-body");

  // subcat drawer
  const subOverlay     = need("sub-overlay");
  const subDrawer      = need("sub-drawer");
  const subTitle       = need("sub-drawer-title");
  const subNameInput   = need("sub-name");
  const subOrderInput  = need("sub-order");
  const subSaveBtn     = need("sub-save-btn");

  /* ---------- render: categories ---------- */
  async function renderCats() {
    const cats = await API.listCats();

    catBody.innerHTML = (cats ?? []).map(c => `
      <tr data-id="${c.id}">
        <td style="width:80px;">${c.id}</td>
        <td>${esc(c.name)}</td>
        <td style="width:140px;">${c.displayOrder ?? "—"}</td>
        <td style="width:180px; display:flex; gap:6px;">
          <button class="page-btn light" data-act="view">View</button>
          <button class="page-btn" data-act="edit">Edit</button>
          <button class="page-btn" data-act="delete">Delete</button>
        </td>
      </tr>
    `).join("") || `<tr><td colspan="4" style="padding:14px;opacity:.7;">No categories yet.</td></tr>`;

    // maintain selection
    catBody.querySelectorAll("tr").forEach(r => r.classList.remove("row-selected"));
    if (!selectedCatId && (cats?.length ?? 0) > 0) selectedCatId = cats[0].id;
    if (selectedCatId) {
      const tr = catBody.querySelector(`tr[data-id="${selectedCatId}"]`);
      if (tr) tr.classList.add("row-selected");
    }

    // auto load subcats when we have a selection
    if (selectedCatId) {
      btnAddSub.disabled = false;
      await renderSubcats(selectedCatId);
    } else {
      btnAddSub.disabled = true;
      subHint.style.display = "";
      subTable.style.display = "none";
      subBody.innerHTML = "";
    }

    // row actions
    catBody.onclick = async (e) => {
      const tr = e.target.closest("tr[data-id]");
      if (!tr) return;
      const id  = Number(tr.dataset.id);
      const act = e.target.closest("button")?.dataset?.act;

      if (!act || act === "view") {
        selectedCatId = id;
        catBody.querySelectorAll("tr").forEach(r => r.classList.remove("row-selected"));
        tr.classList.add("row-selected");
        btnAddSub.disabled = false;
        await renderSubcats(id);
        return;
      }
      if (act === "edit") {
        openCatDrawer("edit", {
          id,
          name: tr.children[1].textContent.trim(),
          displayOrder: tr.children[2].textContent.trim() === "—" ? "" : tr.children[2].textContent.trim(),
        });
        return;
      }
      if (act === "delete") {
        if (!confirm("Delete this category (and all its subcategories)?")) return;
        await API.deleteCat(id);
        if (selectedCatId === id) selectedCatId = null;
        await renderCats();
      }
    };
  }

  /* ---------- render: subcategories ---------- */
  async function renderSubcats(catId) {
    const list = await API.listSubcats(catId);
    const hasAny = (list ?? []).length > 0;

    subHint.style.display  = hasAny ? "none" : "";
    subTable.style.display = hasAny ? "" : "none";

    subBody.innerHTML = hasAny ? list.map(s => `
      <tr data-id="${s.id}">
        <td style="width:80px;">${s.id}</td>
        <td>${esc(s.name)}</td>
        <td style="width:140px;">${s.displayOrder ?? "—"}</td>
        <td style="width:180px; display:flex; gap:6px;">
          <button class="page-btn" data-act="edit">Edit</button>
          <button class="page-btn" data-act="delete">Delete</button>
        </td>
      </tr>
    `).join("") : "";

    subBody.onclick = async (e) => {
      const tr = e.target.closest("tr[data-id]");
      if (!tr) return;
      const subId = Number(tr.dataset.id);
      const act = e.target.closest("button")?.dataset?.act;

      if (act === "edit") {
        openSubDrawer("edit", {
          id: subId,
          name: tr.children[1].textContent.trim(),
          displayOrder: tr.children[2].textContent.trim() === "—" ? "" : tr.children[2].textContent.trim(),
        });
        return;
      }
      if (act === "delete") {
        if (!confirm("Delete this subcategory?")) return;
        await API.deleteSubcat(subId);
        await renderSubcats(selectedCatId);
      }
    };
  }

  /* ---------- drawers: category ---------- */
  function openCatDrawer(mode, payload) {
    catDrawer.dataset.mode = mode;
    catTitle.textContent = mode === "create" ? "New Category" : "Edit Category";
    catNameInput.value = mode === "create" ? "" : (payload?.name ?? "");
    catOrderInput.value = mode === "create" ? "" : (payload?.displayOrder ?? "");
    catSaveBtn.dataset.id = mode === "create" ? "" : String(payload?.id ?? "");
    catOverlay.style.display = "block";
    catDrawer.style.display  = "block";
    requestAnimationFrame(() => catDrawer.classList.add("show"));
  }
  function closeCatDrawer() {
    catDrawer.classList.remove("show");
    catOverlay.style.display = "none";
    setTimeout(() => { catDrawer.style.display = "none"; }, 180);
  }
  catOverlay?.addEventListener("click", closeCatDrawer);
  document.querySelectorAll("[data-close='cat']").forEach(b => b.addEventListener("click", closeCatDrawer));

  /* ---------- drawers: subcategory ---------- */
  function openSubDrawer(mode, payload) {
    if (!selectedCatId) return alert("Select a category first.");
    subDrawer.dataset.mode = mode;
    subTitle.textContent = mode === "create" ? "New Subcategory" : "Edit Subcategory";
    subNameInput.value   = mode === "create" ? "" : (payload?.name ?? "");
    subOrderInput.value  = mode === "create" ? "" : (payload?.displayOrder ?? "");
    subSaveBtn.dataset.id = mode === "create" ? "" : String(payload?.id ?? "");
    subOverlay.style.display = "block";
    subDrawer.style.display  = "block";
    requestAnimationFrame(() => subDrawer.classList.add("show"));
  }
  function closeSubDrawer() {
    subDrawer.classList.remove("show");
    subOverlay.style.display = "none";
    setTimeout(() => { subDrawer.style.display = "none"; }, 180);
  }
  subOverlay?.addEventListener("click", closeSubDrawer);
  document.querySelectorAll("[data-close='sub']").forEach(b => b.addEventListener("click", closeSubDrawer));

  /* ---------- buttons ---------- */
  btnAddCat?.addEventListener("click", () => openCatDrawer("create"));
  btnAddSub?.addEventListener("click", () => openSubDrawer("create"));

  catSaveBtn?.addEventListener("click", async () => {
    const mode = catDrawer.dataset.mode;
    const id   = Number(catSaveBtn.dataset.id || 0);
    const name = (catNameInput.value ?? "").trim();
    const orderInt = mustInt(catOrderInput.value);

    if (!name) { alert("Please enter a category name."); return; }
    const body = Number.isNaN(orderInt) ? { name, displayOrder: null } : { name, displayOrder: orderInt };

    try {
      if (mode === "create") await API.createCat(body);
      else await API.updateCat(id, body);
      await renderCats();
      if (selectedCatId) await renderSubcats(selectedCatId);
      closeCatDrawer();
    } catch (e) {
      alert(e.message);
    }
  });

  subSaveBtn?.addEventListener("click", async () => {
    if (!selectedCatId) { alert("No category selected."); return; }

    const mode = subDrawer.dataset.mode;
    const subId = Number(subSaveBtn.dataset.id || 0);
    const name = (subNameInput.value ?? "").trim();
    const orderInt = mustInt(subOrderInput.value);

    // STRICT: subcategory displayOrder is NOT NULL in DB → require an integer
    if (!name) { alert("Please enter a subcategory name."); return; }
    if (Number.isNaN(orderInt)) { alert("Please enter a whole number for Display Order."); return; }

    const body = { name, displayOrder: orderInt };

    try {
      if (mode === "create") await API.createSubcat(selectedCatId, body);
      else await API.updateSubcat(subId, body);
      await renderSubcats(selectedCatId);
      closeSubDrawer();
    } catch (e) {
      alert(e.message);
    }
  });

  /* ---------- first paint ---------- */
  btnAddSub.disabled = true;
  subHint.style.display = "";
  subTable.style.display = "none";
  await renderCats();
}