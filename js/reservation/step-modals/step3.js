
// global vars
let iti; // for phone number

export function loadStep3(){
    showStep3();
    initIntTelPhone();
    initButtons();
}

//************************************ PHONE NUMBER (INTTELPHONE RELATED) *******************************/
function initIntTelPhone() {
  const phoneInput = document.getElementById("phoneNo");

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
    window.location.href = "../authentication/auth.html?authType=login&redirect=reservation-step3";
  });
}



function showStep3(){
    document.getElementById("step3").classList.add("show");
}

function removeStep3(){
    document.getElementById("step2").classList.add("show");
}



