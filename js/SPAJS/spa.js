import { API, NewAPI, getDeviceIdFromCookie} from "../APIurl/api.js";
import { saveSessionStorage, getSessionStorage } from "../sessionStorage.js";
import { validateName, validateEmail, validatePassword} from "../SPAJS/validation.js";
import { login, signup } from "./AuthController.js";
import { AuthPages, userDashboard } from "./HtmlPages.js";
import { mountAccountPage } from "./UserAccountService.js";
import { fetchUserUpcomingReservations, initUpcomingAndPastBtn, initPaginationButton } from "./UserReservationService.js";

let app;
let signUpForm;
let submitSignUpBtn;
let submitSigninBtn;

let loginForm;

let otpForm;
let otpResult;

// OTP PAGE
let resendOtpBtn;
let verifyOtpBtn;
let verifyTimer;

document.addEventListener("DOMContentLoaded", ()=>{
    app = document.getElementById("app")

    // 1) Listen first
    window.addEventListener("hashchange", renderUiPage);

    // 2) Ensure we have a default hash
    if (!location.hash) {
        location.hash = "#signup";   // will trigger hashchange for next loads,
    }
    // 3) Always render once on first load (covers the case where the listener missed an earlier change)
    renderUiPage();
});

function goTo(path){
    location.hash = path;
}

function renderUiPage(){
    const path = (location.hash || "#signup");

    if(path === "#signup"){
        showRegister();
        initEyeTogglePassword();
        removeErrorOnFocus(signUpForm.querySelectorAll(".input"));
    }else if(path === "#otp"){
        showOtpPage();
    }else if(path === "#login"){
        showLoginPage();
        initEyeTogglePassword();
        removeErrorOnFocus(loginForm.querySelectorAll(".input"));
    }else if(path === "#email-verified"){
        showEmailVerified();
    }else if(path === "#my_account"){
        showUserDashboard();
        goToPage("account");
    }else if(path === "#my_reservations"){
        showUserDashboard();
        goToPage("reservations");
    }else if(path === "#my_rewards"){

    }

}



async function showRegister(){
    console.log("Register..");
    app.innerHTML = AuthPages.signup;

    signUpForm = document.getElementById("signup-form");
    submitSignUpBtn = signUpForm.querySelector('button[type="submit"]');

    const phoneInput = document.querySelector("#phone");
    const iti = window.intlTelInput(phoneInput, {
        initialCountry: "sg", // or "auto" if you want to auto-detect
        separateDialCode: true,
    });

    document.querySelector(".iti__flag-container").addEventListener("click", ()=>{
        phoneInput.focus();
        console.log("focus");
    });

    signUpForm.addEventListener("submit", async (e)=>{
        e.preventDefault();
        let valid = true;

        // 1. Gather all data from the input fields and validate 
        const form = e.currentTarget;
        const name = form.name.value.trim();
        let phone = "";
        const email = form.email.value.trim();
        const password = form.password.value.trim();


        // 2. Reset any old error styles/messages
        // clean any previous state e.g., backend server error div
        cleanBackendError();

        // 3. Validate each input and show red border and error placeholder otherwise let it pass and send the data to backend
        const nameValidation = validateName(name);
        if(!nameValidation.valid){
            showError(form.name, nameValidation.message);
            valid = false;
        }
       
        if(!iti.isValidNumber()){
            console.log("Phone invalid");
            showError(form.phone, "Phone number is invalid.")
        }else{
            console.log("PHONE NUMBER: VALID")
            phone = iti.getNumber().trim();
        }

        const emailValidation = validateEmail(email);
        if(!emailValidation.valid){
            showError(form.email, emailValidation.message);
            valid = false;
        }

        const passwordValidation = validatePassword(password);
        if(!passwordValidation.valid){
            showError(form.password, passwordValidation.message);
            valid = false;
        }

        // If not valid return and stop executing the rest of the code
        if(!valid) return;
        
        // If valid, send data to backend
        console.log("Validation: Passed");


        try{
            
            changeButtonToState("Creating account...", submitSignUpBtn);
            const result = await signup(name, email, phone, password, NewAPI.auth.signup);

            if(result.success && result.message === "Request Success."){
                saveSessionStorage("otp-meta", result); // save signup response in session stoage
                goTo("#otp"); // change page to otp
            }

        }catch(err){
            // show error in div error box
            console.log("Caught Error:")
            console.log(err.message)
            console.log(err.code);
            console.log(err.status);
            showBackendError(err.message);
        }finally{
            setTimeout(()=>{ // The short delay (setTimeout) lets the user see the result before it reverts.
                changeButtonToState('Create Account', submitSignUpBtn, 'Clear'); 
            }, 2000)
        }
    });
}

function initEyeTogglePassword(){

    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');

    togglePassword.addEventListener('click', ()=>{

        togglePassword.classList.add('fade-out');

        const isHidden = password.getAttribute('type') === 'password';
        togglePassword.src = isHidden ? '../../icons/show.png' : '../../icons/hide.png'
        password.setAttribute("type", isHidden? 'text' : 'password');
        

        togglePassword.classList.remove('fade-out');
    });
}

function removeErrorOnFocus(inputs){
    inputs.forEach(input =>{
       input.addEventListener("focus", ()=>{
          removeError(input);
        });
    });
}

function showError(input, message){
    console.log(message);
    const errorBox = getErrorBox(input);
    if(errorBox) errorBox.textContent = message

    errorBox.classList.add("show");
    input.style.border = '1px solid var(--border-3)'
 
}

function removeError(input){
    const errorBox = getErrorBox(input);
    if(errorBox){ 
        errorBox.textContent = "";
        errorBox.classList.remove("show");
    }
    input.style.border = '1px solid #D2D0D0';
    input.placeholder = "";
}

function getErrorBox(input){
    const g = getGroup(input);
    return g ? g.querySelector('.error-div') : null;
}

function getGroup(el){
 return el.closest('.form-group');
}




function showBackendError(message){
    const errorDiv = document.querySelector(".error-div-server");
    const errorMsg = document.getElementById("serverErrMessage");

    errorDiv.classList.add("show");
    errorMsg.textContent = message;
}

function cleanBackendError(){
    document.querySelector(".error-div-server").classList.remove("show");
    document.getElementById("serverErrMessage").textContent = "";
}

function changeButtonToState(text, btn, state="Change"){
     console.log("Changing button state.");
    if(state === 'Clear'){
        btn.disabled = false;
        btn.style.background = "#DBB741";
    }else{        
        btn.disabled = true;
        btn.style.background = "#e9d8af";
    }
    btn.textContent = text;
}







/* OTP PAGE */
function showOtpPage(){
    console.log("Rendering OTP page...")
    app.innerHTML = AuthPages.otp;

    otpForm = document.getElementById("otp-form");
    verifyOtpBtn = otpForm.querySelector('button[type="submit"]');

    initInput();
    initResendOtp(); // init resend button for resending otp
    initOTPContainerListener();

   
    otpForm.addEventListener("submit", (e) => {
        e.preventDefault();
        verifyAccount();
    });

}

function initInput(){
    const inputs = document.querySelectorAll(".otp-input");

    const setActive = (idx) => {
        inputs.forEach((el, i) => {
            console.log(i)
            el.classList.toggle("active", idx === i);
        });
    }

    inputs.forEach((input, index) => {

        input.addEventListener("focus", () => setActive(index));

        input.addEventListener("input", (e) => {
            const value = e.target.value;
            if(value && index < inputs.length - 1){
                inputs[index + 1].focus();
                inputs[index + 1].classList.add("active");
            }
        });

        input.addEventListener("keydown", (e) => {
            if(e.key === "Backspace" && !input.value && index > 0){
                inputs[index - 1].focus();
                inputs[index - 1].classList.remove("active");
            }
        });

    });
}

function initResendOtp(){
resendOtpBtn = document.getElementById("resend-otp-btn");

    resendOtpBtn.addEventListener("click", async ()=>{
        if(resendOtpBtn.disabled) return;
        resendOtpBtn.classList.add("disabled");

        console.log("Resending......")

            const resendUrl = NewAPI.auth.resend_otp;
            const otpObject = getSessionStorage("otp-meta");
            const requestBody = {
                verifyId: otpObject.data.verifyId,
                email: otpObject.data.email,
                resendCooldownMs: otpObject.data.resendCooldownMs
            }

            try{
                const response = await fetch(resendUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify(requestBody)
                })
                const result = await response.json();
                if(!response.ok || !result.success){
                    const err = new Error(result.message || "Something went wrong");
                    err.status = result.statusCode;
                    err.code = result.error;
                    throw err;
                }

                console.log(response);
                console.log(result);
                saveSessionStorage("otp-meta", result); // save signup response in session stoage
                startResendTimer(result.data.resendCooldownMs);

            }catch(err){
                console.log(err.message);
            }finally{
                clearInterval(verifyTimer);
                changeButtonToState("Verify", verifyOtpBtn, "Clear");
            }

    });

}

async function verifyAccount(){
        let otp = ""

         const inputs = document.querySelectorAll(".otp-input");
         inputs.forEach(input => {
            otp += input.value.trim();
         })

        const otpObject = getSessionStorage("otp-meta");
        const verifyUrl = NewAPI.auth.verify;
        const requestBody = {
            verifyId: otpObject.data.verifyId,
            otp: otp,
            email: otpObject.data.email
        }

        console.log(requestBody);

        try{
        changeButtonToState("Sending...", verifyOtpBtn);
        const response = await fetch(verifyUrl, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(requestBody)
        })
        const result = await response.json();
        console.log(response);
        console.log(result)

        // check if the response is not successfull
        if(!response.ok || !result.success){
            const err = new Error(result.message || 'Something went wrong'); // e.g., A user with this email already exists.
            err.statusCode = result.statusCode; // e.g., 409
            err.status = result.error; //  e.g., USER_ALREADY_EXISTS
            err.cooldown = result.retryAt;
            throw err;
        }

        console.log("OTP BACKEND RESPONSE!!!");
        console.log(response)
        console.log(result);
        location.replace("#email-verified");

        }catch(err){
            // show error in div error box
            console.log("Caught Error:")
            console.log(err.message)
            console.log(err.code);
            console.log(err.status);
        

            if(err.statusCode === 429) { // TOO MANY REQUESTS ATTEMPT
                let expiry = new Date(err.cooldown);

                verifyTimer = setInterval(()=>{
                    let diff = expiry.getTime() - Date.now(); // milliseconds
                    console.log(diff)
                    if(diff <= 0){
                        console.log("Cleaning...")
                        clearInterval(verifyTimer);
                        changeButtonToState("Verify", verifyOtpBtn, "Clear");
                        return;
                    }

                    const totalSecs = Math.floor(diff / 1000);
                    const minute = Math.floor(totalSecs / 60);
                    const seconds = totalSecs % 60;
                    
                    changeButtonToState(`Retry again in ${minute}:${seconds}s`, verifyOtpBtn)

                }, 1000);

                return;
            }else{
                 showBackendError(err.message);
            }
        }finally{
            // cleanup
            setTimeout(()=>{ // The short delay (setTimeout) lets the user see the result before it reverts.
                changeButtonToState("Verify", verifyOtpBtn, "Clear");
            }, 2000)           
        }

}

function startResendTimer(millisec){
    let remaining = millisec;
    let diff = remaining - Date.now();
    
    resendOtpBtn.textContent = `Resend in ${Math.floor((diff / 1000) % 60)}s`;

    let timer = setInterval(()=>{
    let diff = remaining - Date.now();
        if(diff <= 0){
            clearInterval(timer);
            // do a cleanup
            resendOtpBtn.classList.remove("disabled");
            resendOtpBtn.textContent = "Resend";
            return;
        }
        resendOtpBtn.textContent = `Resend in ${Math.floor((diff / 1000) % 60)}s`;
    },1000)

}



/* LOGIN PAGE */
function showLoginPage(){
    console.log("Rendering Login page...")
    app.innerHTML = AuthPages.login;

    loginForm = document.getElementById("login-form");
    submitSigninBtn = loginForm.querySelector('button[type="submit"]');

    loginForm.addEventListener("submit", async (e)=>{
        e.preventDefault();

        let valid = true;
                
        // 1. Gather all data from the input fields and validate 
        const form = e.currentTarget;
        const email = form.email.value.trim();
        const password = form.password.value.trim();


        // 2. Reset any old error styles/messages
        // clean any previous state e.g., backend server error div
        cleanBackendError();

        const emailValidation = validateEmail(email);
        if(!emailValidation.valid){
            showError(form.email, emailValidation.message);
            valid = false;
        }

        const passwordValidation = validatePassword(password);
        if(!passwordValidation.valid){
            showError(form.password, passwordValidation.message);
            valid = false;
        }

        // If not valid return and stop executing the rest of the code
        if(!valid) return;
        
        // If valid, send data to backend
        console.log("Validation: Passed");


        try{
            changeButtonToState("Signing in...", submitSigninBtn);
            const result = await login(email, password, NewAPI.auth.login, getDeviceIdFromCookie());
                    // check if the response is not successfull
            if(result.success){

            }


        }catch(err){
            // show error in div error box
            console.log("Caught Error:")
            console.log(err.message)
            console.log(err.code);
            console.log(err.status);
            showBackendError(err.message);
        }finally{
             // cleanup
            setTimeout(()=>{ // The short delay (setTimeout) lets the user see the result before it reverts.
                changeButtonToState("Sign in", submitSigninBtn, "Clear");
            }, 2000)         
        }
    });


}


function initOTPContainerListener(){
    const inputs = document.querySelectorAll(".otp-input");

    document.querySelector(".OTP-container").addEventListener("click", (event)=>{

        const otpContainer = event.target.classList.contains("otp-input");

        if(!otpContainer){
            // clear and change back to original state if clicked outside
            console.log("Clicked outside. Clearing...")
            inputs.forEach((input, index) => {
                input.classList.remove("active");
            });
        }

    });
}


function showEmailVerified(){
    console.log("Rendering email verified page...")
    app.innerHTML = AuthPages.emailVerified;
    document.getElementById("loginBtn").addEventListener("click", ()=>{
        location.replace("#login")
    });
}



















function showUserDashboard(){
    console.log("Register..");
    app.innerHTML = AuthPages.dashboard;
    document.getElementById("app").style.padding = "0px";
    initSideBar();
}



function initSideBar(){
    const sidebar = document.querySelector(".sidebar-menu")
    const pages = document.querySelectorAll(".sidebar-menu li");
    const spans = document.querySelectorAll(".font-nav");
    
    sidebar.addEventListener("click", (e)=> {
        const clicked = e.target.closest("li");
        if(!clicked) return;


        pages.forEach(item => item.classList.remove("active"))
        spans.forEach(item=> item.classList.remove("active"))

        clicked.classList.add("active")
        clicked.querySelector(".font-nav").classList.add("active")

        const page = clicked.dataset.page;

        console.log(page)
        goToPage(page);

    });

}

function goToPage(pageName){
    switch(pageName){
            case "reservations":{
                loadReservations();
                fetchUserUpcomingReservations();
                initUpcomingAndPastBtn();
                initPaginationButton();
                break;
            }
            case "account":{
                loadAccount();
                mountAccountPage();
                break;
            }
        }

}

function loadReservations(){
   const content =  document.querySelector(".content");
    content.innerHTML = ""
   content.innerHTML = userDashboard.reservations;

}

function loadAccount(){
   const content =  document.querySelector(".content");
   content.innerHTML = ""
   content.innerHTML = userDashboard.myAccount;
}