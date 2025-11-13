// success.js
let modal, overlay, okBtn, descEl, cardEl;

function initSuccessModal() {
  modal   = document.getElementById('reservation-success');
  overlay = document.getElementById('success-overlay');
  okBtn   = document.getElementById('success-ok');
  descEl  = document.getElementById('success-desc');
  cardEl  = modal ? (modal.querySelector('.success-card') || modal) : null;

  // If markup isn't on this page, stop—prevents null addEventListener errors
  if (!modal || !overlay || !okBtn) return false;

  // Attach close handlers once
  overlay.addEventListener('click', closeSuccess, { once: false });
  okBtn.addEventListener('click', closeSuccess, { once: false });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSuccess(); });

  return true;
}

export function openSuccess({ message, ref } = {}) {
  // Ensure elements are available (works even if called before DOMContentLoaded)
  if (!modal || !overlay || !okBtn) {
    const ready = document.readyState === 'loading'
      ? new Promise(r => document.addEventListener('DOMContentLoaded', () => r(initSuccessModal()), { once: true }))
      : Promise.resolve(initSuccessModal());

    // If we had to wait for DOM, continue after it's ready
    return ready.then((ok) => {
      if (!ok) {
        console.warn('[success modal] Markup not found on this page.');
        return;
      }
      openSuccess({ message, ref }); // re-enter now that we're initialized
    });
  }

  if (message && descEl) descEl.textContent = message;

  // add / update tiny ref line just above the OK button
  let refEl = modal.querySelector('.success-ref');
  if (ref) {
    if (!refEl) {
      refEl = document.createElement('p');
      refEl.className = 'success-ref';
      cardEl.insertBefore(refEl, okBtn);
    }
    refEl.textContent = `Ref: #${ref}`;
  } else if (refEl) {
    refEl.remove();
  }

  modal.classList.add('show');
  overlay.classList.add('show');
  okBtn.focus();
}

function closeSuccess() {
  if (!modal || !overlay) return;
  modal.classList.remove('show');
  overlay.classList.remove('show');
}

// Optional: init when DOM is ready (safe no-op on pages without markup)
document.addEventListener('DOMContentLoaded', () => { initSuccessModal(); });
