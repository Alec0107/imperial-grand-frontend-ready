import { submitConfirmation, submitGuestConfirmation } from "../reservationController.js";

// global vars
let iti; // for phone number

let overlayStep3;
let screenLoadingUiStep3;
let loadingMessage;

export function loadStep3(){
    showStep3();
    initButtons();
    initInputs();
    initIntTelPhone();
    initGlobalVars()
}


function initGlobalVars(){
    // overlay (darker bg, screen loader, message) for step3
    overlayStep3 = document.querySelectorAll(".overlay-bg")[2];
    screenLoadingUiStep3 = document.querySelectorAll(".loading-modal")[2];
    loadingMessage = screenLoadingUiStep3.querySelector("p");
}

//************************************ PHONE NUMBER (INTTELPHONE RELATED) *******************************/
function initIntTelPhone() {
  const phoneInput = document.getElementById("guest-phoneNo");
    if (!phoneInput) return; // prevent null crash

  iti = window.intlTelInput(phoneInput, {
    initialCountry: "sg", // or auto
    separateDialCode: true,
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
  });

}


function initButtons(){
  document.getElementById("email-login-btn").addEventListener("click", (e)=>{
    e.preventDefault();
    console.log("test")
    window.location.href = "/pages/SPA/SPA.html#login";
  });
}


function initInputs(){
  const form = document.getElementById("reservation-form-step3");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // 💡 Stops the default page reload

    // 1. Collect data (guest info OR logged-in user info)
    const firstName = document.getElementById("guest-firstName").value;
    const lastName = document.getElementById("guest-lastName").value;
    const email = document.getElementById("guest-email").value;
    const phoneNumber = iti.getNumber(); // if you're using intl-tel-input

    // 2. Validate manually if needed
    if (!firstName || !lastName || !email || !phoneNumber) {
      console.log("Missing fields");
      return;
    }

    // 3. Prepare reservation submission
      const reservationDetails = JSON.parse(localStorage.getItem("pendingReservation"))
 

    // 4. Send to backend
    submitGuestConfirmation(reservationDetails, { firstName, lastName, email, phoneNumber });
  });
}


function showStep3(){
    document.getElementById("step3").classList.add("show");
}

function removeStep3(){
    document.getElementById("step2").classList.add("show");
}


export function showLoadingUiStep3(message = "Finalizing your reservation..."){
    overlayStep3.classList.add("show");
    screenLoadingUiStep3.classList.add("show");
    loadingMessage.textContent = message;
}

export function removeLoadingUiStep3(){
    overlayStep3.classList.remove("show");
    screenLoadingUiStep3.classList.remove("show");
    loadingMessage.textContent = ""; // Reset text
}
