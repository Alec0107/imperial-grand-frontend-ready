import { API } from "../APIurl/api";


let dropdownBtn;
let subjectOption;
let sendMsgBtn;
let dropdownArrow;
let phoneInput;
let iti;

let inputs;
let messageBox;

// modals
let successModal;
let loadingModal;


const contactUs = {
    valid: false,
    ContactUs:{
        name: "",
        email: "",
        subject: "",
        message: "",
    }
}

let isOpen = false; // to toggle dropdown button open/close

window.addEventListener("include-loaded", ()=>{
    
})

document.addEventListener("DOMContentLoaded", ()=>{
    initGlobalVar();
    initSubjectDropdown();
    initSendMessageBtn();
    initPhoneNumber();
    inputCleanUp();

});


function initGlobalVar(){
    dropdownBtn = document.getElementById("subject-btn");
    subjectOption = document.querySelector(".subject-options");
    phoneInput = document.querySelector("#phone-input");
    sendMsgBtn = document.getElementById("send-msg-btn");
    dropdownArrow = document.querySelector(".dropdown-arrow");
    inputs = document.querySelectorAll(".border");
    messageBox = document.getElementById("message-input");
    successModal = document.getElementById("success");
    loadingModal = document.getElementById("loading");
}


function openDropDown(){
    subjectOption.classList.add("open");
    dropdownArrow.classList.add("rotated");
    isOpen = true;
}

function closeDropDown(){
    subjectOption.classList.remove("open");
    dropdownArrow.classList.remove("rotated")
    isOpen = false;
}

function initSubjectDropdown(){
    // Close dropdown if clicked button 
    dropdownBtn.addEventListener("click", (e) => {
        e.preventDefault();
       if(!isOpen){
        openDropDown();
       }else{
        closeDropDown();
       }
    });

    // Close dropdown if user clicks any <li> item
    subjectOption.querySelectorAll("li").forEach((li) => {
        li.addEventListener("click", () =>{
            // save the option to the obejct 
            contactUs.ContactUs.subject = li.textContent;
             document.getElementById("subject-input").value = li.textContent; // ✅ keep hidden input updated
            // change text of the button based on the clicked option
            const labelSpan = dropdownBtn.querySelector("span");
            labelSpan.textContent = li.textContent;
            console.log(contactUs.ContactUs.subject);
            closeDropDown();
        });
    });

    // Close dropdown if clicked outside the button or dropdown list
    document.addEventListener("click", (e) =>{
        if(!subjectOption.contains(e.target) && !dropdownBtn.contains(e.target)){
            closeDropDown();
        }
    });
}



function initSendMessageBtn(){
    sendMsgBtn.addEventListener("click", (e) => {
        e.preventDefault();
        let isValid = true;

        /** 
         * TODO:  
         *       -  Sanitize / Validate tex input fields before sending to backend
         *       -  Do the same on the backend
         * 
         */
        const name = document.getElementById("name-input").value;
        const email = document.getElementById("email-input").value;
        const message = document.getElementById("message-input").value;

        // input validation before submitting to backend
        const nameValidation = validateFirstName(name);
        const emailValidation = validateEmail(email);
        const messageValidation = validateMessageBox(message);

        if(!nameValidation.valid){
            showError(inputs[0], nameValidation.message)
            isValid = false;
        }

        if(phoneInput.value && iti && !iti.isValidNumber()){
            showError(inputs[1], "Invalid phone number");
            isValid = false;
        }

        if(!emailValidation.valid){
            showError(inputs[2], emailValidation.message);
            isValid = false;
        }

        if(!contactUs.ContactUs.subject){
            showError(dropdownBtn, "Please select a subject or category.");
            isValid = false;
        }

        if(!messageValidation.valid){
            showError(messageBox, messageValidation.message);
            isValid = false;
        }



        if(!isValid) return;

        // All good, update object
        contactUs.ContactUs.name = name;
        contactUs.ContactUs.email = email;
        contactUs.ContactUs.message = message;

        console.log("sending..")
        console.log(`Phone Number: ${iti.getNumber()}`);

        sendContactMessage();
    });
}


async function sendContactMessage() {
    openLoading();
    try {
        // Update phone number if exists
        if (iti && phoneInput.value) {
            phoneInput.value = iti.getNumber();
        }
        // Set the reply-to email
        document.querySelector('[name="_replyto"]').value = document.getElementById("email-input").value;

        const formEl = document.getElementById("contact-form");
        const formData = new FormData(formEl);

        const res = await fetch(formEl.action, {
            method: "POST",
            body: formData
        });

        if (res.ok) {
            formEl.reset();
            hideLoading();
            showSuccess();
            
            // Reset dropdown
            const labelSpan = dropdownBtn.querySelector("span");
            labelSpan.textContent = "Subject/Category";
            contactUs.ContactUs.subject = "";
        } else {
            console.error("Web3Forms error:", await res.text());
            hideLoading();
            alert("Something went wrong. Please try again.");
        }
    } catch (err) {
        console.error("Error:", err);
        hideLoading();
        alert("Network error. Please try again.");
    }
}



function validateFirstName(fName){
  const firstNamePattern = /^[A-Za-z]+([ '-][A-Za-z]+)*$/;

  if(fName === ""){
    return { valid : false, message: "First name is required." };
  }

  if(fName.length < 3 || fName.length > 30){
    return { valid: false, message: "First name must be between 3 and 30 characters." };
  }

  if(!firstNamePattern.test(fName)){
    return { valid: false, message: "Please enter a valid First name" };
  }

  console.log("FIRST NAME: VALID")
  return { valid:true }
}

function validateEmail(email){
  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if(email === ""){
    return { valid : false, message: "Email is required." };
  }

  if(!emailPattern.test(email)){
    return { valid: false, message: "Please enter a valid Email format" };
  }

  console.log("EMAIL: VALID")
  return { valid: true }
}


function validateMessageBox(message){
    if(!message.trim()){
        return { valid : false, message: "Message is required." };
    }

    if(message.trim().length < 10){
        return { valid : false, message: "Message should be at least 10 characters long."};
    }

    if(message.trim().length > 1000){
        return { valid : false, message: "Message cannot exceed 1000 characters."};
    }

    console.log("MESSAGE: VALID");
    return { valid: true };
}

function initPhoneNumber(){
    iti = window.intlTelInput(phoneInput, {
    initialCountry: "sg", // default to Singapore for you
    separateDialCode: true, // show +65 outside input
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
  });
}


function showError(input, errMsg){
   console.log(errMsg);
   input.style.border = "2px solid var(--border-3)";

}

function clearError(input){
  input.style.border = ""; // fallback to CSS default
}

function inputCleanUp(){
    inputs.forEach(el => {
       el.addEventListener("click", () =>{
        clearError(el);
       })
    })
}



function openLoading(){
    loadingModal.classList.remove("hidden");
    lockScroll()
}

function hideLoading(){
    loadingModal.classList.add("hidden");
    unlockScroll();
}

function showSuccess(){
    successModal.classList.remove("hidden");
    document.getElementById("close-btn").addEventListener("click", ()=>{
        hideSuccess();
    })
    lockScroll();
}

function hideSuccess(){
    successModal.classList.add("hidden");
    unlockScroll();
}



function lockScroll() {
  document.body.style.overflow = "hidden";  // stop background scroll
}

function unlockScroll() {
  document.body.style.overflow = "";        // restore default scroll
}


