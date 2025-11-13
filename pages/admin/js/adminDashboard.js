import { NewAPI } from "../../../js/APIurl/api.js";
import { adminDashboard } from "../../../js/SPAJS/HtmlPages.js";
import { showCategoriesPage } from "./cat.js";
import { showMenuPage } from "./menu.js";
import { showSetMenusPage } from "./set-menu.js";
const API_BASE = "http://localhost:8080"; // your backend
const WS_BASE  = "http://localhost:8080/ws"; // STOMP handshake endpoint

document.addEventListener("DOMContentLoaded", () => {
  connectStomp();
  initSideBar();
});

function initSideBar() {
  const sidebar = document.querySelector(".sidebar-menu");
  const pages = document.querySelectorAll(".sidebar-menu li");
  const spans = document.querySelectorAll(".font-nav");

  sidebar.addEventListener("click", (e) => {
    const clicked = e.target.closest("li");
    if (!clicked) return;

    pages.forEach(item => item.classList.remove("active"));
    spans.forEach(item => item.classList.remove("active"));

    clicked.classList.add("active");
    clicked.querySelector(".font-nav").classList.add("active");

    const page = clicked.dataset.page;

    goToPage(page);
  });
}

function markSidebar(pageName){
    const lists = document.querySelectorAll(".sidebar-menu li");
    lists.forEach((li)=>{
        const name = li.dataset.page;
        li.classList.remove("active");
        if(name === pageName){
            li.classList.add("active");
        }
    });

    goToPage(pageName);
}

function goToPage(page){
    switch (page) {
      case "dashboard":
        break;
      case "customers":
        showCustomersPage();
        break;
      case "reservations":
        console.log("reservations")
        showReservationsPage();
        break;  
      case "menu":
        console.log("menu");
        showMenuPage();
        break;
      case "cat/sub":
        console.log("cat/sub");
        showCategoriesPage();
        break;
       case "set-menu":
        console.log("set-menu");
        showSetMenusPage()
        break;
    }
}

// ======================= CUSTOMERS PAGE =======================
function showCustomersPage() {
  const content = document.querySelector(".content");
  content.innerHTML = adminDashboard.customers;

  const tbody = document.getElementById("customer-table-body");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const pageLbl = document.getElementById("pageIndicator");

  let page = 0;
  const size = 6;

  // Normalize JSON format
  function extractListAndPages(json) {
    if (json && Array.isArray(json.content)) {
      return { list: json.content, totalPages: json.totalPages ?? 1 };
    }
    if (Array.isArray(json)) return { list: json, totalPages: 1 };
    return { list: [], totalPages: 1 };
  }

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function toRow(u) {
    const phone = u.phone || "—";
    const role = u.role || "USER";
    const status = u.status || (u.emailVerified ? "ACTIVE" : "PENDING");
    return `
      <tr>
        <td>${esc(u.id)}</td>
        <td>${esc(u.name)}</td>
        <td>${esc(u.email)}</td>
        <td>${esc(phone)}</td>
        <td>${esc(role)}</td>
        <td>${esc(status)}</td>
        <td>
          <button class="view-btn"
            data-id="${u.id}"
            data-name="${u.name}"
            data-email="${u.email}"
            data-phone="${u.phone}"
            data-role="${u.role}"
            data-status="${u.status}"
            data-verified="${u.emailVerified}">
            View
          </button>
        </td>
      </tr>
    `;
  }

  async function load() {
    tbody.innerHTML = `<tr><td colspan="7" style="padding:14px;">Loading...</td></tr>`;
    try {
      const res = await fetch(`${NewAPI.admin.fetchCustomers}?page=${page}&size=${size}`, { credentials: "include" });
      if (!res.ok) throw new Error("Fetch failed");
      const json = await res.json();
      const { list, totalPages } = extractListAndPages(json);

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="padding:14px;">No customers found.</td></tr>`;
      } else {
        tbody.innerHTML = list.map(toRow).join("");
      }

      // 🔹 Hook the view buttons each time table updates
      hookViewButtons();

      pageLbl.textContent = String(page + 1);
      prevBtn.disabled = page <= 0;
      nextBtn.disabled = page >= totalPages - 1;
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="7" style="padding:14px;color:#b91c1c;">${esc(e.message)}</td></tr>`;
      prevBtn.disabled = true;
      nextBtn.disabled = true;
    }
  }

  prevBtn.onclick = () => { if (page > 0) { page--; load(); } };
  nextBtn.onclick = () => { page++; load(); };

  load();
}

// ======================= DRAWER LOGIC =======================
const drawer = document.getElementById("cust-drawer");
const overlay = document.getElementById("cust-overlay");

function openDrawer(user) {
  document.getElementById("cust-id").textContent = user.id;
  document.getElementById("f-id").value = user.id;
  document.getElementById("f-name").value = user.name || "";
  document.getElementById("f-email").value = user.email || "";
  document.getElementById("f-phone").value = user.phone || "";
  document.getElementById("f-role").value = user.role || "USER";
  document.getElementById("f-status").value = user.status || "ACTIVE";
  document.getElementById("f-verified").value = user.emailVerified ? "true" : "false";

  drawer.style.display = "block";
  overlay.style.display = "block";
  setTimeout(() => drawer.classList.add("show"), 10);
}

function closeDrawer() {
  drawer.classList.remove("show");
  overlay.style.display = "none";
  setTimeout(() => drawer.style.display = "none", 200);
}

overlay.addEventListener("click", closeDrawer);
document.querySelectorAll("[data-close='1']").forEach(btn => btn.addEventListener("click", closeDrawer));

function hookViewButtons() {
  document.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const user = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        email: btn.dataset.email,
        phone: btn.dataset.phone,
        role: btn.dataset.role,
        status: btn.dataset.status,
        emailVerified: btn.dataset.verified === "true"
      };
      openDrawer(user);
    });
  });
}


// ---------------- STOMP CONNECTION ----------------
function connectStomp() {
  const socket = new SockJS(WS_BASE);     // must match backend endpoint
  const stomp = Stomp.over(socket);

  stomp.connect({}, (frame) => {
    console.log("✅ Connected:", frame);

    // Subscribe to admin notifications
    stomp.subscribe("/topic/admin/reservations", (message) => {
      const event = JSON.parse(message.body);
      console.log(event);
      showToast(event);
    });
  }, (error) => {
    console.error("❌ WebSocket error:", error);
  });
}


// Ensure toast container exists (creates one if missing)
function ensureToastContainer() {
  let box = document.getElementById("toast-container");
  if (!box) {
    box = document.createElement("div");
    box.id = "toast-container";
    box.className = "toast-container";
    document.getElementById("app")?.appendChild(box); // fallback to body if needed
  }
  return box;
}

// Format helpers
const fmt = {
  when: (d, t) => {
    if (!d && !t) return "";
    return [d, t].filter(Boolean).join(" • ");
  },
  text: (v, fallback = "—") => (v == null || String(v).trim() === "" ? fallback : String(v)),
};

// MAIN: show a toast
function showToast(event) {
  const box = ensureToastContainer();

  // Cap to 4 on screen: remove the oldest if needed
  const MAX = 4;
  while (box.children.length >= MAX) box.removeChild(box.firstChild);

  const type = event.type || "NEW_RESERVATION";
  const title = type === "NEW_RESERVATION" ? "🟢 New reservation" : "🔔 Update";
  const who   = fmt.text(event.customerName ?? event.name ?? "Guest");
  const pax   = fmt.text(event.guestCount, "?");
  const when  = fmt.when(event.date, event.time);
  const table = [fmt.text(event.tableCode, ""), fmt.text(event.zone, "")]
                  .filter(Boolean).join(" • ");

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
      <div style="font-weight:600;">${title}</div>
      <button aria-label="Close" class="toast-close" style="border:none;background:transparent;font-size:16px;cursor:pointer;">✕</button>
    </div>
    <div style="margin-top:4px;"><strong>${who}</strong> • ${pax} pax</div>
    ${when ? `<div style="opacity:.8;margin-top:2px;">${when}</div>` : ""}
    ${table ? `<div style="opacity:.8;margin-top:2px;">${table}</div>` : ""}
  `;

  // click to dismiss
  toast.querySelector(".toast-close").addEventListener("click", () => toast.remove());
  toast.addEventListener("click", (e) => {
    // Don’t close if the user clicked inside selectable text
    if (!e.target.closest(".toast-close")) toast.remove();
    //openReservationFromToast(event.id);
   markSidebar("reservations");
  });

    box.appendChild(toast);

    let timeoutId;

    // start the 5-second countdown
    function startTimer() {
    timeoutId = setTimeout(() => toast.remove(), 5000);
    }

    // stop countdown when hovered
    toast.addEventListener("mouseenter", () => clearTimeout(timeoutId));
    // resume countdown when hover leaves
    toast.addEventListener("mouseleave", startTimer);

    // kick it off
    startTimer();
}






// 2) Minimal loader we can call from showReservationsPage()
async function loadReservations(status = "UPCOMING", page = 0, size = 10) {
  const url = `${NewAPI.admin.fetchReservations}?status=${status}&page=${page}&size=${size}`;
  try {
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    console.log("[RESERVATIONS]", json); // ← for now just log
    // (Next step we’ll render cards)
    renderReservations(json);
  } catch (e) {
    console.error("Fetch reservations failed:", e);
  }
}



// ===== Reservations page (inject shell + first load) =====
function showReservationsPage() {
  const content = document.querySelector(".content");

  // If your adminDashboard.reservations has the shell, use it
  if (adminDashboard?.reservations) {
    content.innerHTML = adminDashboard.reservations;
  } else {
    // Fallback minimal shell if not provided
    content.innerHTML = `
      <div class="res-toolbar"></div>
      <div id="res-list"></div>
    `;
  }

  // Ensure the list container exists
  if (!document.getElementById("res-list")) {
    const div = document.createElement("div");
    div.id = "res-list";
    content.appendChild(div);
  }

  // First load (adjust status/page/size as you like)
  loadReservations("CONFIRMED", 0, 10);
}


// Tiny escape (only define once in your whole file)
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])
  );

function reservationCard(r) {
  const name  = esc(r.customerName ?? 'Guest');
  const pax   = esc(r.guestCount ?? '');
  const date  = esc(r.date ?? '');
  const time  = esc(r.time ?? '');
  const table = esc(r.tableCode ?? '');
  const zone  = esc(r.zone ?? '');
  const status = esc(r.status ?? '');
  const notes  = esc(r.notes ?? '');

  return `
    <div class="res-card" data-id="${r.id}">
      <div class="res-card__top">
        <div class="res-card__title"><strong>${name}</strong> • ${pax} pax</div>
        <span class="res-badge">${status}</span>
      </div>
      <div class="res-card__row">📅 ${date} • ⏰ ${time}</div>
      ${table ? `<div class="res-card__row">🪑 ${table} • ${zone}</div>` : ''}
      <div class="res-card__actions">
        <button
          class="btn-view"
          data-id="${r.id}"
          data-name="${name}"
          data-date="${date}"
          data-time="${time}"
          data-guestcount="${pax}"
          data-tablecode="${table}"
          data-zone="${zone}"
          data-status="${status}"
          data-notes="${notes}"
        >View</button>
        <button class="btn-cancel" data-id="${r.id}">Cancel</button>
      </div>
    </div>
  `;
}



function renderReservations(json) {
  const box = document.getElementById('res-list');
  if (!box) return;

  const list = Array.isArray(json?.content) ? json.content : (Array.isArray(json) ? json : []);
  if (list.length === 0) {
    box.innerHTML = `<div class="empty">No reservations found.</div>`;
    return;
  }

  // group by date
  const byDate = list.reduce((acc, r) => {
    (acc[r.date] ||= []).push(r);
    return acc;
  }, {});

  // sort dates ascending
  const orderedDates = Object.keys(byDate).sort((a,b) => a.localeCompare(b));

  // build sections
  box.innerHTML = orderedDates.map(d => {
    const label = formatDateLabel(d);
    const cards = byDate[d].map(reservationCard).join('');
    return `
      <section class="res-day">
        <header class="res-day__title">${label}</header>
        <div class="res-day__grid">
          ${cards}
        </div>
      </section>
    `;
  }).join('');

  // Delegate button clicks
  box.onclick = async (e) => {
    const viewBtn = e.target.closest('.btn-view');
    const cancelBtn = e.target.closest('.btn-cancel');

    if (viewBtn) {
      const id = viewBtn.dataset.id;
      await openReservationModalById(viewBtn.dataset.id);
    }
    if (cancelBtn) {
      const id = cancelBtn.dataset.id;
      await cancelReservation(id);
    }
  };
}

// helpers for date labels
function formatDateLabel(isoDate) {
  const d = new Date(`${isoDate}T00:00:00`);
  const today = new Date(); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

  if (sameDay(d, today)) return "Today";
  if (sameDay(d, tomorrow)) return "Tomorrow";

  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long', day: 'numeric', month: 'long'
  }).format(d);
}
function sameDay(a,b){
  return a.getFullYear()===b.getFullYear() &&
         a.getMonth()===b.getMonth() &&
         a.getDate()===b.getDate();
}





// Cancel + refresh
async function cancelReservation(id) {
  try {
    const res = await fetch(`${NewAPI.admin.cancelReservation}/${id}`, {
      method: "POST", // or DELETE/PATCH per your backend
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "Admin cancelled" })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    hideResDrawer();
    try { showToast({ type: "UPDATE", name: "Reservation cancelled" }); } catch {}

    // Reload current tab data
    await loadReservations("CONFIRMED", 0, 10);
  } catch (err) {
    console.error(err);
    try { showToast({ type: "ERROR", name: "Cancel failed" }); } catch {}
  }
}
// ======================= RESERVATION MODAL LOGIC =======================
async function openReservationModalById(id) {
  const modal = document.getElementById("res-modal");
  const overlay = document.getElementById("res-modal-overlay");
  const body = document.getElementById("res-detail-body");
  const resIdLabel = document.getElementById("res-id");

  if (!modal || !overlay || !body || !resIdLabel) {
    console.error("❌ Modal elements missing in DOM.");
    return;
  }

  // 🧭 Step 1: Show placeholder immediately
  const btn = document.querySelector(`.btn-view[data-id="${id}"]`);
  body.innerHTML = btn
    ? `
      <div><strong>Name:</strong> ${btn.dataset.name ?? "—"}</div>
      <div><strong>Date:</strong> ${btn.dataset.date ?? "—"}</div>
      <div><strong>Time:</strong> ${btn.dataset.time ?? "—"}</div>
      <div><strong>Guests:</strong> ${btn.dataset.guestcount ?? "—"}</div>
      <div><strong>Table:</strong> ${btn.dataset.tablecode ?? "—"} (${btn.dataset.zone ?? "—"})</div>
      <div><strong>Status:</strong> ${btn.dataset.status ?? "—"}</div>
      <div><strong>Notes:</strong> ${btn.dataset.notes ?? "—"}</div>
      <div style="margin-top:8px;opacity:.7;">Loading live details...</div>
    `
    : `<div style="color:#b91c1c;">Loading...</div>`;

  resIdLabel.textContent = id;
  overlay.style.display = "block";
  modal.style.display = "block";


}

// ======================= CLOSE MODAL EVENTS =======================
document.addEventListener("click", (e) => {
  if (e.target.matches("[data-close='res']") || e.target.id === "res-modal-overlay") {
    closeReservationModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeReservationModal();
});

function closeReservationModal() {
  document.getElementById("res-modal").style.display = "none";
  document.getElementById("res-modal-overlay").style.display = "none";
}
