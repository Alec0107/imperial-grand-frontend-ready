// pages/admin/js/setMenus.js
import { NewAPI } from "../../../js/APIurl/api.js";
import { adminDashboard } from "../../../js/SPAJS/HtmlPages.js";

// ========= helpers =========
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

async function jfetch(url, opts = {}) {
  const res = await fetch(url, { credentials: "include", ...opts });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${opts.method || "GET"} ${url} → ${res.status} ${text}`);
  }
  return res.status === 204 ? null : res.json();
}

// adjust these paths to match your backend mapping
const SetMenuAPI = {
  list:   (page, size) => jfetch(`${NewAPI.admin.setMenus}?page=${page}&size=${size}`),

  getOne: (id)         => jfetch(`${NewAPI.admin.setMenus}/${id}`),

  create: (body)       => jfetch(`${NewAPI.admin.setMenus}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }),

  update: (id, body)   => jfetch(`${NewAPI.admin.setMenus}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }),

  remove: (id)         => jfetch(`${NewAPI.admin.setMenus}/${id}`, {
    method: "DELETE",
  }),
};

// ========= drawer element refs (set inside showSetMenusPage) =========
let smOverlay, smDrawer;
let smTitle, smName, smPrice, smPax, smOrder, smActive, smDesc;
let smDishes, smAddDish, smSaveBtn;

// ========= main entry (called from goToPage("setMenus")) =========
export async function showSetMenusPage() {
  const content = document.querySelector(".content");
  content.innerHTML = adminDashboard.setMenus;

  // table + pager elements
  const tbody   = document.getElementById("setmenu-table-body");
  const prevBtn = document.getElementById("sm-prev");
  const nextBtn = document.getElementById("sm-next");
  const pageLbl = document.getElementById("sm-page");
  const btnAdd  = document.getElementById("btn-add-setmenu");

  // drawer elements (now they exist in DOM)
  smOverlay = document.getElementById("setmenu-overlay");
  smDrawer  = document.getElementById("setmenu-drawer");

  smTitle   = document.getElementById("setmenu-title");
  smName    = document.getElementById("sm-name");
  smPax     = document.getElementById("sm-pax");
  smPrice   = document.getElementById("sm-price");
  smOrder   = document.getElementById("sm-order");
  smActive  = document.getElementById("sm-active");
  smDesc    = document.getElementById("sm-desc");
  smDishes  = document.getElementById("sm-dishes-container");
  smAddDish = document.getElementById("sm-add-dish");
  smSaveBtn = document.getElementById("sm-save-btn");

  let page = 0;
  const size = 10;
  let totalPages = 1;

  function toRow(m) {
    const price = (m.priceCents != null)
      ? `S$ ${(m.priceCents / 100).toFixed(2)}`
      : "—";

    return `
      <tr data-id="${m.id}">
        <td>${esc(m.id)}</td>
        <td>${esc(m.nameEn)}</td>
        <td>${price}</td>
        <td>${m.isActive ? "Active" : "Inactive"}</td>
        <td>${m.displayOrder ?? "—"}</td>
        <td style="display:flex;gap:6px;">
          <button class="page-btn" data-act="edit">Edit</button>
          <button class="page-btn light" data-act="delete">Delete</button>
        </td>
      </tr>
    `;
  }

  async function load() {
    tbody.innerHTML = `<tr><td colspan="6" style="padding:14px;">Loading...</td></tr>`;
    try {
      const json = await SetMenuAPI.list(page, size);
      const list = Array.isArray(json?.content)
        ? json.content
        : (Array.isArray(json) ? json : []);
      totalPages = json?.totalPages ?? 1;

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="padding:14px;">No set menus found.</td></tr>`;
      } else {
        tbody.innerHTML = list.map(toRow).join("");
      }

      pageLbl.textContent = String(page + 1);
      prevBtn.disabled = page <= 0;
      nextBtn.disabled = page >= totalPages - 1;
    } catch (e) {
      console.error(e);
      tbody.innerHTML = `<tr><td colspan="6" style="padding:14px;color:#b91c1c;">${esc(e.message)}</td></tr>`;
      prevBtn.disabled = true;
      nextBtn.disabled = true;
    }
  }

  // pager
  prevBtn.onclick = () => {
    if (page > 0) {
      page--;
      load();
    }
  };
  nextBtn.onclick = () => {
    if (page < totalPages - 1) {
      page++;
      load();
    }
  };

  // add new
  btnAdd.onclick = () => openSetMenuDrawer("create", null);

  // edit/delete
  tbody.onclick = async (e) => {
    const tr = e.target.closest("tr[data-id]");
    if (!tr) return;

    const id = Number(tr.dataset.id);
    const act = e.target.closest("button")?.dataset?.act;

    if (act === "edit") {
      const data = await SetMenuAPI.getOne(id);
      openSetMenuDrawer("edit", data);
    } else if (act === "delete") {
      if (!confirm("Delete this set menu?")) return;
      await SetMenuAPI.remove(id);
      await load();
    }
  };

  // drawer events (use .onclick so re-render doesn’t stack listeners)
  if (smOverlay) smOverlay.onclick = closeSetMenuDrawer;
  document.querySelectorAll("[data-close='setmenu']").forEach(btn => {
    btn.onclick = closeSetMenuDrawer;
  });

  if (smAddDish) smAddDish.onclick = () => addDishRow();

  if (smDishes) {
    smDishes.onclick = (e) => {
      if (!e.target.classList.contains("dish-remove-btn")) return;

      const rows = smDishes.querySelectorAll(".dish-row");
      if (rows.length <= 1) {
        // keep one empty row
        const nameInput = rows[0].querySelector(".dish-name");
        const qtyInput  = rows[0].querySelector(".dish-qty");
        if (nameInput) nameInput.value = "";
        if (qtyInput)  qtyInput.value = 1;
        return;
      }
      e.target.closest(".dish-row").remove();
    };
  }

  if (smSaveBtn) smSaveBtn.onclick = onSaveSetMenu;

  await load();
}

// ========= drawer logic =========
function openSetMenuDrawer(mode, data) {
  if (!smDrawer) return;

  smDrawer.dataset.mode = mode;
  smDrawer.dataset.id   = data?.id ?? "";

  if (mode === "create") {
    smTitle.textContent   = "New Set Menu";
    smName.value          = "";
    smPrice.value         = "";
    smPax.value           = "";        
    smOrder.value         = "";
    smActive.checked      = true;
    smDesc.value          = "";
    smDishes.innerHTML    = "";
    addDishRow(); // start with one empty row
  } else {
    smTitle.textContent   = "Edit Set Menu";
    smName.value          = data?.nameEn ?? "";
    smPrice.value         = data?.priceCents != null
                              ? (data.priceCents / 100).toFixed(2)
                              : "";
    smPax.value           = data?.pax ?? "";    
    smOrder.value         = data?.displayOrder ?? "";
    smActive.checked      = !!data?.isActive;
    smDesc.value          = data?.description ?? "";

    smDishes.innerHTML = "";
    const dishes = data?.dishes
      || (data?.dishesJson ? JSON.parse(data.dishesJson) : []);

    if (Array.isArray(dishes) && dishes.length > 0) {
      dishes.forEach(d => addDishRow(d.name, d.qty));
    } else {
      addDishRow();
    }
  }

  smOverlay.style.display = "block";
  smDrawer.style.display  = "block";
  requestAnimationFrame(() => smDrawer.classList.add("show"));
}

function closeSetMenuDrawer() {
  if (!smDrawer) return;
  smDrawer.classList.remove("show");
  smOverlay.style.display = "none";
  setTimeout(() => { smDrawer.style.display = "none"; }, 180);
}

// add one dish row
function addDishRow(name = "") {
  if (!smDishes) return;

  const row = document.createElement("div");
  row.className = "dish-row";
  row.innerHTML = `
    <input type="text" class="dish-name" placeholder="Dish name (中文 / English)" value="${esc(name)}">
    <button type="button" class="dish-remove-btn">✕</button>
  `;
  smDishes.appendChild(row);
}

// collect dishes as array of STRING (NOT {name, qty})
function collectDishes() {
  const rows = smDishes?.querySelectorAll(".dish-row") ?? [];
  const arr = [];
  rows.forEach(row => {
    const name = row.querySelector(".dish-name")?.value.trim() || "";
    if (name) arr.push(name);   // 👈 ONLY SEND STRING
  });
  return arr;
}

// save (create or update)
async function onSaveSetMenu() {
  const mode = smDrawer.dataset.mode;
  const id   = smDrawer.dataset.id;

  const nameEn  = smName.value.trim();
  const price = Number(smPrice.value || 0);
  const pax     = smPax.value ? Number(smPax.value) : null;   // 👈 NEW
  const order = smOrder.value ? Number(smOrder.value) : null;
  const active = smActive.checked;
  const desc   = smDesc.value.trim();
  const dishes = collectDishes();

  if (!nameEn) {
    alert("Please enter a set menu name.");
    return;
  }
  if (!Number.isFinite(price) || price < 0) {
    alert("Please enter a valid price.");
    return;
  }

  if (!Number.isInteger(pax) || pax <= 0) {
    alert("Please enter pax (number of people).");
    return;
  }

  if (dishes.length === 0) {
    alert("Please add at least one dish.");
    return;
  }

  const body = {
    nameEn,
    pax,
    priceCents: Math.round(price * 100),
    isActive: active,
    displayOrder: order,
    description: desc,
    dishes,          // backend will serialise this to JSON column
  };

  try {
    if (mode === "create") {
        console.log(body);
      await SetMenuAPI.create(body);
    } else {
      await SetMenuAPI.update(id, body);
    }
    closeSetMenuDrawer();
    // reload page to refresh table after save
    await showSetMenusPage();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}