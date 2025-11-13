import { NewAPI } from "../../../js/APIurl/api.js";

document.addEventListener("DOMContentLoaded", ()=>{
    initLogin();
})



function initLogin(){
const form = document.getElementById("admin-login-form");
const errorMsg = document.getElementById("error-msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch(NewAPI.admin.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include" // include cookies for JWT
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const result = await response.json();

    console.log(result);

    // // ✅ Check if admin role
    if (result.data.role !== "ADMIN") {
      throw new Error("Access denied: Admin only");
    }

    // Redirect to dashboard
    window.location.href = "/pages/admin/index.html";
    

  } catch (err) {
    console.error(err);
    errorMsg.textContent = err.message || "Login failed. Try again.";
  }
});

}


