import { checkLockStatus, submitConfirmation } from "./reservationController.js";
import { loadStep1 } from "./step-modals/step1.js";
import { loadStep2, cleanUpStep2 } from "./step-modals/step2.js";
import { loadStep3 } from "./step-modals/step3.js";
import { initReservationSummary, showReservationHeader, removeReservationHeader } from "./utils/reservation-header.js";
import { cleanUpTimer } from "./utils/reservation-header.js";

// === guard: only run on the reservation page ===
const onReservationPage =
  window.location.pathname.includes("/pages/reservation/") ||
  window.location.pathname.endsWith("reservation.html") ||
  document.querySelector(".reservation") !== null;


export let currentStep;

if (onReservationPage) {
  document.addEventListener("DOMContentLoaded", () => {

    const stepFromURL = new URLSearchParams(window.location.search).get("step");
    const reservationLockJson = JSON.parse(localStorage.getItem("reservation-lock"));

    if (stepFromURL === "2" && reservationLockJson) {
      history.replaceState({ step: 2 }, "", "?step=2");
      checkLocalStorage(reservationLockJson);
      showStep(2, false);
    } else if (stepFromURL === "3") {
      history.replaceState({ step: 3 }, "", "?step=3");
      showStep(3, false);
    } else {
      history.replaceState({ step: 1 }, "", "?step=1");
      showStep(1, false);
    }
  });

  window.addEventListener("popstate", (event) => {
    const step = event.state?.step || 1;
    console.log("Popstate:", step);
    showStep(step, false);
  });
}

// async function checkIfComingFromLogin(){
//     if(sessionStorage.getItem("resumeReservation") === "true"){
//         const pr = localStorage.getItem("pendingReservation");
//         if (pr) {
//             const dto = JSON.parse(pr);
//             try {
//                 console.log("sendingggggg")
//             //await submitConfirmation(dto);
//             } finally {

//             }
//         } else {
//           sessionStorage.removeItem("resumeReservation");
//         }
//     }
// }

function checkLocalStorage(reservationLockJson){
        console.log(reservationLockJson);
        /* TODO: 
            send a get request to the server to recheck the lock status of the current reservation
        */
        console.log("Rendering step 2 modal...");
        checkLockStatus(reservationLockJson.data.tableId, reservationLockJson.data.reservationStart);

    // }else{
    //     /* TODO: 
    //         Show the default modal ui (step 1)
    //     */
    //    console.log("Rendering step 1 modal...");
    //    showStep(1, false);
    // }
}



export function showStep(step, push = true){
    if (!onReservationPage) return;   // ⬅️ THIS stops ?step=1 on SPA.html
    if(push){
        history.pushState({step}, "", `/pages/reservation/reservation.html?step=${step}`);
    }
  
    document.querySelectorAll(".reservation-step").forEach(div => {
        div.classList.remove("show");
    });

    if(step === 1){
        console.log("loading step 1..")
        removeReservationHeader();
        // clear interval timer in step2 to avoid running in the background
        //cleanUpStep2();
        //cleanUpTimer();

        // 💥 FIX: Reset the broken DOM before reloading
        const old = document.getElementById("step1");
        if (!old) return;      
        const fresh = old.cloneNode(true); // clone fresh
        old.replaceWith(fresh);            // replace

        loadStep1(); // now the event listeners bind cleanly
    }else if(step === 2){
        console.log("loading step 2..")
    

        // 💥 FIX: Reset the broken DOM before reloading
        const old = document.getElementById("step2");
        if (!old) return;  
        const fresh = old.cloneNode(true); // clone fresh
        old.replaceWith(fresh);            // replace

        // show reservation timer, summary, back navigation
      
        loadStep2(); // now the event listeners bind cleanly
        initReservationSummary(); // show
    }else if(step === 3){
        loadStep3();
        initReservationSummary(); // show
    }




}


function closeDropDownOnDocument(){
    document.addEventListener("click", (e) => {
        if(!guestOptions.contains(e.target) && !guestDropdown.contains(e.target)){
            closeGuestDropdown();
            console.log("clicked outside!")
        }else{
            console.log("clicked inside")
        }
    });
}






function removeStep2(){

}

function removeStep3(){
    
}