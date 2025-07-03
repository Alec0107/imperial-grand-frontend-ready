import { checkLockStatus } from "./reservationController.js";
import { loadStep1 } from "./step-modals/step1.js";
import { loadStep2 } from "./step-modals/step2.js";


export let currentStep;



window.addEventListener("popstate", (event) =>{
    const step = event.state?.step || 1;
    console.log("Popstate: " + step)
    history.replaceState({ step: step }, "", "?step=" + step);
    showStep(step, false);
});

document.addEventListener("DOMContentLoaded", ()=>{
    const stepFromURL = new URLSearchParams(window.location.search).get("step");
    const reservationLockJson = JSON.parse(localStorage.getItem("reservation-lock"));

    if(stepFromURL === "2" && reservationLockJson){
        history.replaceState({step: 2}, "", "?step=2");
        checkLocalStorage(reservationLockJson); // fallback
    }else{
        history.replaceState({step: 1}, "", "?step=1");
        showStep(1, false);
    }
   
});


function checkLocalStorage(reservationLockJson){
        console.log(reservationLockJson);
        /* TODO: 
            send a get request to the server to recheck the lock status of the current reservation
        */
        console.log("Rendering step 2 modal...");

        const lockStatusDTO = {
            tableId: reservationLockJson.tableId,
            date: reservationLockJson.reservationDTO.date,
            time: reservationLockJson.reservationDTO.time
        }
        checkLockStatus(lockStatusDTO);


    // }else{
    //     /* TODO: 
    //         Show the default modal ui (step 1)
    //     */
    //    console.log("Rendering step 1 modal...");
    //    showStep(1, false);
    // }
}



export function showStep(step, push = true){
    if(push){
        history.pushState({step}, "", `/pages/reservation/reservation.html?step=${step}`);
    }
  
    document.querySelectorAll(".reservation-step").forEach(div => {
        div.classList.remove("show");
    });

    if(step === 1){
        console.log("loading step 1..")
        loadStep1();
    }else if(step === 2){
        console.log("loading step 2..")
        loadStep2();
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



