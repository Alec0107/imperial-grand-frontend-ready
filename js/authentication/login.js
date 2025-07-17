import { API, authApi, getDeviceIdFromCookie } from "../APIurl/api.js";
import { userObjectLogin, resetUserObjectLogin } from "../userDetailsRelated/userData.js";
import { submitResendVerification } from "./resendverification.js";
import { clearServerError, 
         clearErrorOnInput, 
         showErrorOnInput, 
         disableButton, 
         enableButton, 
         changeTextAndDisplay, 
         checkStatusCode, 
         showServerErrorResponseLogin, 
         showServerErrorEmailNotVerified,} from "../utils/authCommon.js";
import { validateEmail, validatePassword} from "../authentication/signup.js"
import { getLockReservationStorage } from "../reservation/dto/reservationDTO.js";


let spinLoader;
let buttonText;
let emailInput;
let passwordInput;
let loginBtn;

let emailSvgErr;
let emailSpanErr;
let passSvgErr;
let passSpanErr;

function initLoginJs(){
    initLoginClassAndId();
    setupLoginBtn();
    fetchProfile();
}

function initLoginClassAndId(){
    spinLoader = document.querySelector(".spin-loader");
    buttonText = document.querySelector(".btn-text");
    emailInput = document.getElementById("login-email");
    passwordInput = document.getElementById("login-password");
    loginBtn = document.getElementById("login-btn");

    // errors (svg, span)
    emailSvgErr = document.getElementById("email-error-icon-login");
    emailSpanErr = document.getElementById("email-error-span-login");
    passSvgErr = document.getElementById("password-error-icon-login");
    passSpanErr = document.getElementById("password-error-span-login");
}

function setupLoginBtn(){
    loginBtn.addEventListener("click", function(e){
        e.preventDefault();
        console.log("Loging in...");

       // showLoadingUi(); // show user loading circle inside the button
        clearServerError();
    
        //  validate email and pass and set the userobject valid to either true/false
        validateFieldTextLogin(emailInput, emailSvgErr, emailSpanErr, validateEmail, "email");
        validateFieldTextLogin(passwordInput, passSvgErr, passSpanErr, validatePassword, "password");
        // get rememeberMe value
        const rememberMe = document.getElementById("rememberMe").checked;
        userObjectLogin.userAccount.rememberMe = rememberMe; // either true or false
        console.log("Remember Me checked?", rememberMe); // true or false

        if(!userObjectLogin.allValid){
            console.log("Input Fields Login Error! Unable to send to the backend server");
            return;
        }
        
        console.log(userObjectLogin.userAccount);
        // calling controller (backendAPI.js file)
        // fn: submitLogin
        submitLogin();
    });
}

//************************************ LOGIN FETCH INITIALIZATION ************************************/

// SUBMIT LOG IN
async function submitLogin(){
  const rawDeviceId = getDeviceIdFromCookie();
  const loginUrl = API.authentication.login; // Backend URL for login endpoint
  const headers = { 
     "Content-Type" :  "application/json",
  }

  if(rawDeviceId && rawDeviceId.trim() !== "" && rawDeviceId.trim().toLowerCase !== "null"){
    headers["x-device-id"] = rawDeviceId.trim();
  }

  const requestObject = {
    method: "POST", // 👈 now it's correct
    headers: headers,
    credentials: "include", // REQUIRED to receive/set HttpOnly cookie
    body: JSON.stringify(userObjectLogin.userAccount)
  };

  const loginButton = document.getElementById("login-btn");
  const textButton = loginButton.querySelector(".btn-text");
  const loaderButton = loginButton.querySelector(".spin-loader");

  // show the spin-loader from authCommon.js
  //setButtonStatus(loginButton, true);
  disableButton(loaderButton);
  changeTextAndDisplay(textButton, loaderButton, false, "Loggin in...");

  try{
    const urlParams = new URLSearchParams(window.location.search);

    const response = await fetch(loginUrl, requestObject);
    const result = await response.json();
    
    if(!response.ok){
      checkStatusCode(result.statusCode, result.message);
    }

    enableButton(loginButton);
    changeTextAndDisplay(textButton, loaderButton, true, "Log in");
    console.log("Successful login...");

    /** if url redirect is from  reservation-step3. user decides to login via email/pass. 
     * If log in is success redirect the user back in reservation page to execute sending the 
     * reservation final submission to the server backend*/ 
    if(urlParams.get("redirect") === "reservation-step3"){
      console.log("Navigating back to reservation page 2");
      window.location.href = "../reservation/reservation.html?step=2";
    }

    console.log(response);
    console.log(result);
    const rememberMe = (userObjectLogin.userAccount.rememberMe) ?  "User wanted to be remembered!" : "User doesn't wanted to be remembered!";
    console.log(rememberMe);
  

  }catch(err){
    console.error("Error message:", err.message);

    if (err instanceof TypeError && err.message === "Failed to fetch") {
      showServerErrorResponseLogin("Cannot connect to the server. Please ensure the backend is running.");
      resetUserObjectLogin(); // Reset Clean up

    } else if(err.message.toLowerCase().includes("email is not verified")){
      // show serverErrorResponse but wiht inner html
      console.log("Executing innerHTML");
      // show click here to resend email verif UI
      showServerErrorEmailNotVerified(userObjectLogin.userAccount.email);
      submitResendVerification(userObjectLogin.userAccount.email);

    }else {
      showServerErrorResponseLogin(err.message); // You missed this!
      resetUserObjectLogin(); // Reset Clean up 
    }
  }finally{
    enableButton(loginButton);
    changeTextAndDisplay(textButton, loaderButton, true, "Log in");
  }
}


//************************************ VALIDATION ******************************************************/
function validateFieldTextLogin(input, svg, span, validatorFn, userKey){
    const result = validatorFn(input.value);
    if(!result.valid){
        showErrorOnInput(input, svg, span, result.message);
        userObjectLogin.allValid = false;
    }else{
        userObjectLogin.userAccount[userKey] = input.value;
    }
    clearErrorOnInput(input, svg, span);
}









//******************* FOR SENDING COOKIE JWT TESTS *******************
// async function sendTestCookie(){
//     console.log("Sending test...")

//     const response = await fetch("http://localhost:8080/api/v1/auth/detailsTest", {
//         method: "GET",
//         credentials: "include"
//     });

//     const result = await response.text();
//     console.log("TEST COOKIE: \n" + "Response: " + response + "\n" + "Result: " + result);
// }




function fetchProfile(){
  document.getElementById("test1").addEventListener("click", async ()=>{
    
    const response = await authApi(API.user.profile, {
      headers:{
        "Content-type" : "application/json"
      },
    });
    console.log("original request...")
    console.log(response);

    const result = await response.json();
    console.log(result);

  });
}






export {
    initLoginJs
}

