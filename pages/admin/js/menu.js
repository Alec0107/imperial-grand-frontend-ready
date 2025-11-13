import { NewAPI } from "../../../js/APIurl/api.js";
import { adminDashboard } from "../../../js/SPAJS/HtmlPages.js";
import { openMenuDrawerById, openCreateMenuDrawer} from "./menuDrawer.js";

export function showMenuPage() {
  const content = document.querySelector(".content");
  content.innerHTML = adminDashboard.menuItems;
  wireMenuList();
}

function wireMenuList() {
  const tbody = document.getElementById("menu-table-body");
  const prev  = document.getElementById("mi-prev");
  const next  = document.getElementById("mi-next");
  const pageLbl = document.getElementById("mi-page");

  let page = 0;
  const size = 10;
  let totalPages = 1;

  prev.onclick = () => { if (page > 0) { page--; load(); } };
  next.onclick = () => { if (page < totalPages - 1) { page++; load(); } };

  load();

  async function load() {
    tbody.innerHTML = `<tr><td colspan="7" style="padding:14px;">Loading…</td></tr>`;
    try {
      const url = `${NewAPI.admin.menu.menuItems}?page=${page}&size=${size}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      const list = Array.isArray(json?.content) ? json.content : (Array.isArray(json) ? json : []);
      totalPages = json?.totalPages ?? 1;

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="padding:14px;">No menu items found.</td></tr>`;
      } else {
        tbody.innerHTML = list.map(toRow).join("");
        hookRowButtons();
      }

      pageLbl.textContent = String(page + 1);
      prev.disabled = page <= 0;
      next.disabled = page >= totalPages - 1;

    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="7" style="padding:14px;color:#b91c1c;">${esc(e.message)}</td></tr>`;
      prev.disabled = true;
      next.disabled = true;
    }
  }
}

// One row in the table
function toRow(m) {
  // Expecting fields from your DTO / query
  // id, nameEn, priceCents, isActive, categoryId, categoryName, subcategoryId, subcategoryName
  const name   = m.nameEn || m.name || "—";
  const cat    = m.categoryName ?? (m.categoryId ?? "—");
  const subcat = m.subcategoryName ?? (m.subcategoryId ?? "—");
  const price  = cents(m.priceCents);
  const active = bool(m.isActive);

  return `
    <tr data-id="${escAttr(m.id)}">
      <td>${esc(m.id)}</td>
      <td>${esc(name)}</td>
      <td>${esc(cat)}</td>
      <td>${esc(subcat)}</td>
      <td>${price}</td>
      <td><span class="pill ${active ? "on":"off"}">${active ? "yes":"no"}</span></td>
      <td>
        <button class="page-btn btn-view" aria-label="View">View</button>
      </td>
    </tr>
  `;
}

function hookRowButtons() {
  document.querySelectorAll(".btn-view").forEach(btn => {
    btn.addEventListener("click", () => {
      const tr = btn.closest("tr");
      const id = tr?.dataset.id;
      if (id) openMenuItemModal(id);
    });
  });
}

// (Modal fetch later; stub for now)
async function openMenuItemModal(id) {
  console.log("open item", id);
  // Later: GET /api/menu/items/{id} and fill a modal
  await openMenuDrawerById(id);
}

/* helpers */
function cents(v){ const n = Number(v); return Number.isFinite(n) ? `$${(n/100).toFixed(2)}` : "—"; }
function bool(v){ return v === true || v === "true" || v === 1; }
function esc(s){ return String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function escAttr(s){ return String(s ?? "").replace(/"/g, "&quot;"); }





// Listen for drawer saves and patch the row inline
document.addEventListener("menuItem:updated", (e) => {
  const { id, item } = e.detail;
  const tr = document.querySelector(`tr[data-id="${CSS.escape(String(id))}"]`);
  if (!tr) return;

  // Assuming your columns: 0 ID, 1 Name, 2 Category, 3 Subcategory, 4 Price, 5 Active, 6 Actions
  const tds = tr.querySelectorAll("td");
  if (tds.length < 6) return;

  tds[1].textContent = item.nameEn || item.name || "—";
  tds[2].textContent = item.categoryName ?? item.categoryId ?? "—";
  tds[3].textContent = item.subcategoryName ?? item.subcategoryId ?? "—";
  tds[4].textContent = Number.isFinite(+item.priceCents) ? `$${(+item.priceCents/100).toFixed(2)}` : "—";

  const pill = tds[5].querySelector(".pill");
  if (pill) {
    const on = item.isActive === true;
    pill.classList.toggle("on", on);
    pill.classList.toggle("off", !on);
    pill.textContent = on ? "yes" : "no";
  }
});



document.addEventListener("click", (e) => {
  if (e.target.id === "btn-add-menu") {
    openCreateMenuDrawer(); // open empty drawer in edit mode
  }
});