import { initLoginJs } from "./authentication/login.js";
import { initSignUpJs } from "./authentication/signup.js";


document.addEventListener("DOMContentLoaded", function () {

  call();

});





function call(){
 authModalInit(); // initialize what type of auth modal is shown (sign up/ login)
 
 // eye toggle related
 initPasswordToggle();
 initConfirmPassToggle();

 // input type listeners
 liveEventPassword();
 liveEventConfirmPass();
 liveEventPhoneNumber();

 // initialize the submit button for login and sign up
 initSignUpJs();
 initLoginJs();

}

// ************************  PASSWORD EYE TOGGLE RELATED ********************* 
function initPasswordToggle() {
  const toggle = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  const eyeOpen = document.getElementById("eye-open-pass");
  const eyeSlash = document.getElementById("eye-slash-pass");

  initializeEyeToggle(toggle, passwordInput, eyeOpen, eyeSlash);
}

function initConfirmPassToggle(){
  const toggle = document.getElementById("toggleConfirmPassword");
  const confirmPasswordInput = document.getElementById("confirm-pass");
  const eyeOpen = document.getElementById("eye-open-confirm");
  const eyeSlash = document.getElementById("eye-slash-confirm");

  initializeEyeToggle(toggle, confirmPasswordInput, eyeOpen, eyeSlash);
}

// helper function for initPasswordToggle and initConfirmPassToggle
function initializeEyeToggle(toggle, input, eyeOpen, eyeSlash){
  toggle.addEventListener("click", function(){
    const isHidden = input.type === "password";

    input.type = isHidden? "text" : "password";
    eyeOpen.classList.toggle("visible", !isHidden);
    eyeSlash.classList.toggle("visible", isHidden);
  });
}

// ************************  PASSWORD EYE TOGGLE RELATED ********************* 

function liveEventPassword(){
  const eyeSlash = document.getElementById("eye-slash-pass");
  const eyeOpen = document.getElementById("eye-open-pass");

  document.getElementById("password").addEventListener("input", function (){
    this.type = "password";
    const passInputValLength = this.value.trim().length;
    const confirmPassInput = document.getElementById("confirm-pass");
    const confirmErrorSpan = document.getElementById("confirm-pass-error-span");


    // eye toggle
    eyeSlash.classList.remove("visible");
    eyeOpen.classList.add("visible");

    // confirm pass btn enable / disable

    if(passInputValLength > 8){
      confirmPassInput.disabled = false;
    }else{
      confirmPassInput.disabled = true;
      confirmPassInput.value = ""; // reset confirm input if user clears main pass
      confirmPassInput.classList.remove("invalid");
      confirmErrorSpan.textContent = "";
    }


  });
}

function liveEventConfirmPass(){
  const confirmPass = document.getElementById("confirm-pass");
  const span = document.getElementById("confirm-pass-error-span");

  const eyeOpen = document.getElementById("eye-open-confirm");
  const eyeSlash = document.getElementById("eye-slash-confirm");

  confirmPass.addEventListener("input",function(){
    const password = document.getElementById("password").value;
    if(password !== confirmPass.value){
      //removeEyeToggle(eyeOpen, eyeSlash);
      //showErrorOnInput(confirmPass, svg, span, "Passwords do not match.");
      confirmPass.classList.add("invalid");
      span.textContent = "Passwords do not match.";
    }else{
      span.textContent = "";
      confirmPass.classList.remove("invalid");
      eyeOpen.classList.remove("visible");
      eyeSlash.classList.add("visible");
    }
  });

}

function liveEventPhoneNumber(){
  document.getElementById("phoneNo").addEventListener("input", function (){

    const svg = document.getElementById("phoneNo-icon");
    const span = document.getElementById("phoneNo-error");

    this.classList.remove("invalid");
    if (svg) svg.style.display = "none";
    span.textContent = "";
  });
}

// ************************  AUTH MODAL TO SHOW (LOGIN / SIGNUP) *********************  

function authModalInit(){
  const params = new URLSearchParams(window.location.search);
  const authType = params.get("authType");
  console.log(authType);
 
  if(authType === "login"){
    document.getElementById("login").classList.add("show");
  }

  if(authType === "signup"){
    document.getElementById("sign-up").classList.add("show"); 
  }

}