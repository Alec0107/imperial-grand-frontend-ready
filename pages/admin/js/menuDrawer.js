// ../admin/js/menuDrawer.js
import { NewAPI } from "../../../js/APIurl/api.js";

/* ========== DOM REFS ========== */
const overlay = document.getElementById("menu-overlay");
const drawer  = document.getElementById("menu-drawer");

const el = {
  id:            document.getElementById("mi-id"),
  // view mode
  vNameEn:       document.getElementById("mi-name-en-view"),
  vNameCn:       document.getElementById("mi-name-cn-view"),
  vBlurb:        document.getElementById("mi-blurb-view"),
  vCat:          document.getElementById("mi-cat-view"),
  vSubcat:       document.getElementById("mi-subcat-view"),
  vPrice:        document.getElementById("mi-price-view"),
  vPriceSuffix:  document.getElementById("mi-price-suffix-view"),
  vActive:       document.getElementById("mi-active-view"),
  vSignature:    document.getElementById("mi-signature-view"),
  vSpicy:        document.getElementById("mi-spicy-view"),
  vImg:          document.getElementById("mi-img-view"),
  vOrder:        document.getElementById("mi-order-view"),
  vSlug:         document.getElementById("mi-slug-view"),
  // edit mode
  nameEn:        document.getElementById("mi-name-en"),
  nameCn:        document.getElementById("mi-name-cn"),
  blurb:         document.getElementById("mi-blurb"),
  cat:           document.getElementById("mi-cat"),
  subcat:        document.getElementById("mi-subcat"),
  price:         document.getElementById("mi-price"),
  priceSuffix:   document.getElementById("mi-price-suffix"),
  active:        document.getElementById("mi-active"),
  signature:     document.getElementById("mi-signature"),
  spicy:         document.getElementById("mi-spicy"),
  img:           document.getElementById("mi-img"),
  order:         document.getElementById("mi-order"),
  slug:          document.getElementById("mi-slug"),
  // buttons
  btnEdit:       document.getElementById("mi-edit-btn"),
  btnSave:       document.getElementById("mi-save-btn"),
  btnCancel:     document.getElementById("mi-cancel-btn"),
};

let currentItem = null;
let subcatsByCat = {}; // { [catId]: [{id,name}, ...] }

/* ========== HELPERS ========== */
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => (
  {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]
));
const centsToMoney = (c) => (Number.isFinite(+c) ? `$${(+c/100).toFixed(2)}` : "—");
const moneyToCents = (s) => Math.round(Number(s || 0) * 100);

function showDrawer() {
  drawer.style.display = "block";
  overlay.style.display = "block";
  requestAnimationFrame(() => drawer.classList.add("show"));
}
function hideDrawer() {
  drawer.classList.remove("show");
  overlay.style.display = "none";
  setTimeout(() => { drawer.style.display = "none"; }, 180);
}
overlay?.addEventListener("click", hideDrawer);
document.querySelectorAll("[data-close='menu']").forEach(b => b.addEventListener("click", hideDrawer));

function setViewMode() {
  drawer.dataset.editing = "false";
  document.querySelectorAll(".mi-view").forEach(n => n.style.display = "");
  document.querySelectorAll(".mi-edit").forEach(n => n.style.display = "none");
  el.btnEdit.style.display = "";
  el.btnSave.style.display = "none";
  el.btnCancel.style.display = "none";
}
function setEditMode() {
  drawer.dataset.editing = "true";
  document.querySelectorAll(".mi-view").forEach(n => n.style.display = "none");
  document.querySelectorAll(".mi-edit").forEach(n => n.style.display = "");
  el.btnEdit.style.display = "none";
  el.btnSave.style.display = "";
  el.btnCancel.style.display = "";
}

/* ========== FILL VIEW / EDIT ========== */
function fillView(m) {
  el.id.textContent         = m.id ?? "—";
  el.vNameEn.innerHTML      = esc(m.nameEn ?? m.name ?? "—");
  el.vNameCn.innerHTML      = esc(m.nameCn ?? "");
  el.vBlurb.innerHTML       = esc(m.blurbEn ?? m.description ?? "");
  el.vCat.innerHTML         = esc(m.categoryName ?? m.categoryId ?? "—");
  el.vSubcat.innerHTML      = esc(m.subcategoryName ?? (m.subcategoryId ?? "—"));
  el.vPrice.innerHTML       = centsToMoney(m.priceCents);
  el.vPriceSuffix.innerHTML = esc(m.priceSuffix ?? "");
  el.vActive.innerHTML      = m.isActive ? "yes" : "no";
  el.vSignature.innerHTML   = m.isSignature ? "yes" : "no";
  el.vSpicy.innerHTML       = m.isSpicy ? "yes" : "no";
  el.vImg.innerHTML         = esc(m.imageUrl ?? "—");
  el.vOrder.innerHTML       = (m.displayOrder ?? "—");
  el.vSlug.innerHTML        = esc(m.slug ?? "—");
}

function fillEdit(m) {
  el.nameEn.value     = m.nameEn ?? m.name ?? "";
  el.nameCn.value     = m.nameCn ?? "";
  el.blurb.value      = m.blurbEn ?? m.description ?? "";
  el.price.value      = Number.isFinite(+m.priceCents) ? (+m.priceCents/100).toFixed(2) : "";
  el.priceSuffix.value= m.priceSuffix ?? "";
  el.active.checked   = !!m.isActive;
  el.signature.checked= !!m.isSignature;
  el.spicy.checked    = !!m.isSpicy;
  el.img.value        = m.imageUrl ?? "";
  el.order.value      = Number.isFinite(+m.displayOrder) ? m.displayOrder : "";
  el.slug.value       = m.slug ?? "";
}

/* ========== CATS / SUBCATS ========== */
async function loadCategoriesAndMaybeSubcats(selectedCatId, selectedSubId) {
  const catUrl = NewAPI.admin.menu.categories;
  const res = await fetch(catUrl, { credentials: "include" });
  if (!res.ok) throw new Error(`Load categories failed (${res.status})`);
  const cats = await res.json(); // [{id,name}, ...]

  el.cat.innerHTML = cats.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join("");
  if (selectedCatId) el.cat.value = String(selectedCatId);

  await fillSubcatsFor(el.cat.value, selectedSubId);

  el.cat.onchange = async () => {
    await fillSubcatsFor(el.cat.value, null);
  };
}

async function fillSubcatsFor(catId, selectedSubId) {
  const idNum = Number(catId);
  if (!idNum) {
    el.subcat.innerHTML = `<option value="">— None —</option>`;
    return;
  }
  if (!subcatsByCat[idNum]) {
    const base = NewAPI.admin.menu.subcategoriesByCat;
    const url  = `${base}?cat=${idNum}`;
    const res  = await fetch(url, { credentials: "include" });
    if (!res.ok) throw new Error(`Load subcategories failed (${res.status})`);
    subcatsByCat[idNum] = await res.json(); // [{id,name}, ...]
  }

  const list = subcatsByCat[idNum];
  const opts = [`<option value="">— None —</option>`]
    .concat(list.map(s => `<option value="${s.id}">${esc(s.name)}</option>`));
  el.subcat.innerHTML = opts.join("");
  if (selectedSubId) el.subcat.value = String(selectedSubId);
}

/* ========== BUTTONS ========== */
el?.btnEdit?.addEventListener("click", () => {
  if (!currentItem) return;
  setEditMode();
});
el?.btnCancel?.addEventListener("click", () => {
  if (!currentItem) return;
  // restore from currentItem
  fillEdit(currentItem);
  setViewMode();
});
el?.btnSave?.addEventListener("click", onSave);



async function onSave() {
  // 1) mode + id
  const isCreate = drawer.dataset.mode === "create";
  const id = currentItem?.id;

  // 2) build payload from form
  const payload = {
    nameEn:        el.nameEn.value.trim(),
    nameCn:        el.nameCn.value.trim(),
    blurbEn:       el.blurb.value.trim(),
    categoryId:    el.cat.value ? Number(el.cat.value) : null,
    subcategoryId: el.subcat.value ? Number(el.subcat.value) : null,
    priceCents:    moneyToCents(el.price.value),
    priceSuffix:   el.priceSuffix.value.trim(),
    isActive:      !!el.active.checked,
    isSignature:   !!el.signature.checked,
    isSpicy:       !!el.spicy.checked,
    imageUrl:      el.img.value.trim() || null,
    displayOrder:  el.order.value ? Number(el.order.value) : null,
    slug:          el.slug.value.trim() || null // backend will regen if blank
  };

  console.log(isCreate)

  // 3) choose URL + method
  const createUrl = NewAPI.admin.menu.createMenuItem;
  const updateUrl = NewAPI.admin.menu.updateMenuItem + `/${id}`;
  const url       = isCreate ? createUrl : updateUrl;
  const method    = isCreate ? "POST" : "PUT";

  // 4) optimistic UI: disable buttons
  el.btnSave.disabled = true;
  el.btnCancel.disabled = true;

  try {
    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 401 || res.status === 403) {
      alert("Unauthorized — please log in as admin.");
      return;
    }
    if (!res.ok) {
      console.error("Save failed:", await safeText(res));
      alert("Save failed.");
      return;
    }

    // 5) success → refresh drawer + notify table
    const saved = await res.json();
    currentItem = saved;

    fillView(saved);
    fillEdit(saved);
    await loadCategoriesAndMaybeSubcats(saved.categoryId, saved.subcategoryId);
    setViewMode();

    document.dispatchEvent(new CustomEvent(isCreate ? "menuItem:created" : "menuItem:updated", {
      detail: { id: saved.id, item: saved }
    }));

    drawer.dataset.mode = "view";
  } catch (err) {
    console.error(err);
    alert("Network error. Try again.");
  } finally {
    el.btnSave.disabled = false;
    el.btnCancel.disabled = false;
  }
}

/* ========== MAIN ENTRY ========== */
export async function openMenuDrawerById(id) {
  const baseItems = NewAPI?.admin?.menu?.menuItems ?? "/api/auth/admin/menu-items";
  const url = `${baseItems}/${id}`;
  const res = await fetch(url, { credentials: "include" });

  if (res.status === 401 || res.status === 403) {
    console.error("Fetch item auth error", res.status);
    alert("Failed to load item. Please log in as admin.");
    return;
  }
  if (!res.ok) {
    console.error("Fetch item failed", res.status);
    alert("Failed to load item.");
    return;
  }

  const m = await res.json();
  currentItem = m;

  fillView(m);
  fillEdit(m);
  await loadCategoriesAndMaybeSubcats(m.categoryId, m.subcategoryId);

  setViewMode();
  showDrawer();
}

/* ========== UTIL ========== */
async function safeText(res) { try { return await res.text(); } catch { return ""; } }




export async function openCreateMenuDrawer() {
  // mark mode
  drawer.dataset.mode = "create";
  currentItem = null;

  // header id
  el.id.textContent = "—";

  // clear edit inputs
  el.nameEn.value = "";
  el.nameCn.value = "";
  el.blurb.value = "";
  el.price.value = "";
  el.priceSuffix.value = "";
  el.active.checked = true;        // new items default active? adjust if you prefer
  el.signature.checked = false;
  el.spicy.checked = false;
  el.img.value = "";
  el.order.value = "";
  el.slug.value = "";

  // load dropdowns empty-first
  await loadCategoriesAndMaybeSubcats(null, null);

  // hide all “view” spans, show inputs and buttons
  setEditMode();
  showDrawer();
}