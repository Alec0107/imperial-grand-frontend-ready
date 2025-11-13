import { fetchMyAccount, updateBirthday } from "./AccountController.js";

const $ = (id) => document.getElementById(id);
const today = () => new Date().toISOString().slice(0,10);

export async function mountAccountPage(){
  try {
    // prevent future date selection
    $('accBirthday').max = today();

    // 1. Fetch user details
    const data = await fetchMyAccount();

    // 2. Fill the UI
    $('accName').textContent  = data.name  ?? '—';
    $('accEmail').textContent = data.email ?? '—';
    $('accPhone').textContent = data.phone ?? '—';
    $('accBirthday').value    = data.birthday || '';

  } catch (err) {
    console.error(err);
  }

  // 3. Save button
  $('saveAccountBtn').addEventListener('click', saveBirthday);
}

async function saveBirthday(){
  try {
    const birthday = $('accBirthday').value || null;

    // Guard against future birthday
    if (birthday && birthday > today()) {
      alert('Birthday cannot be in the future.');
      return;
    }

    const res = await updateBirthday(birthday);

    // if (!res.ok) throw new Error('Failed to save');

    alert('Changes saved!');
  } catch (err) {
    console.error(err);
    alert('Something went wrong!');
  }
}
