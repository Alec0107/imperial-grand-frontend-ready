
import { API } from "../APIurl/api.js";

let dropdownBtn;
let subjectOption;
let sendMsgBtn;
let dropdownArrow;

const contactUs = {
    valid: false,
    contactUsObject:{
        name: "",
        email: "",
        subject: "",
        message: "",
        toString: function(){
            return (`${this.name}\n${this.email}\n${this.subject}\n${this.message}`);
        }
    }
}

let isOpen = false; // to toggle dropdown button open/close

window.addEventListener("include-loaded", ()=>{
    
})

document.addEventListener("DOMContentLoaded", ()=>{
    initGlobalVar();
    initSubjectDropdown();
    initSendMessageBtn();
});


function initGlobalVar(){
    dropdownBtn = document.getElementById("subject-btn");
    subjectOption = document.querySelector(".subject-options");
    sendMsgBtn = document.getElementById("send-msg-btn");
    dropdownArrow = document.querySelector(".dropdown-arrow");
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
            contactUs.contactUsObject.subject = li.textContent;
            // change text of the button based on the clicked option
            const labelSpan = dropdownBtn.querySelector("span");
            labelSpan.textContent = li.textContent;
            console.log(contactUs.contactUsObject.subject);
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

        if(!nameValidation.valid){
            console.log(nameValidation.message);
            isValid = false;
        }

        if(!emailValidation.valid){
            console.log(emailValidation.message);
            isValid = false;
        }

        if(!isValid) return;

        // All good, update object
        contactUs.contactUsObject.name = name;
        contactUs.contactUsObject.email = email;
        contactUs.contactUsObject.message = message;

        console.log("sending..")
        console.log(contactUs.contactUsObject.toString());

        sendContactMessage();
    });
}


async function sendContactMessage(){

    const sendMessageUrl = API.contactUs.sendMsg;
    const options = {
        headers: {
        "Content-Type" : "application/json",
        },
        body: JSON.stringify(contactUs.contactUsObject)
    }

    const response = await fetch(sendMessageUrl, {
        method : "POST",
        ...options
    });

    if(!response.ok){
        console.log("Error");
        return;
    }

    const result = await response.text();

    console.log(result);



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