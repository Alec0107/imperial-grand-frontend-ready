import { API,getDeviceIdFromCookie, authApi} from '../APIurl/api.js';
import { showStep } from '../reservation/reservation.js'
import { showLoadingUiStep1, removeLoadingUiStep1} from '../reservation/step-modals/step1.js';
import { showLoadingUiStep2,removeLoadingUiStep2 } from '../reservation/step-modals/step2.js';
import { initReservationSummary, showReservationHeader, removeReservationHeader } from "./utils/reservation-header.js";




// first step fetch request 
export async function sendFirstStepReservation(ReservationFirstStep){
    console.log(`Date: ${ReservationFirstStep.date}\nTime: ${ReservationFirstStep.time}\nGuests: ${ReservationFirstStep.guestCount}`)
    
    const APIUrl = API.reservations.checkAvailability;
    const options = {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(ReservationFirstStep)
    }

    try{
        // show the loading ui
        showLoadingUiStep1();

        await new Promise((resolve => setTimeout(resolve, 2000))); // simulate a 2secs delay 

        const response = await fetch(APIUrl, options);
        const result   = await response.json();

        if(!response.ok){
            throw new Error(result.message);
        }

        console.log(response);
        console.log(result);

        /* TODO:  
                - save expiresAT, TableID in localstorage
        */
    //     const reservationDate = `${result.reservationDTO.date}:${result.reservationDTO.time}`;
    //     const reservationLockData = {
    //         expiresAt : result.expiresAt,
    //         reservationDate : reservationDate,
    //         tableId: result.tableId
    //    }

       // save the reservation lock data in localstorage
       saveDataInLocalStorage("reservation-lock", JSON.stringify(result));
       // if user succeeded to get a reservation lock proceed to step 2

       initReservationSummary(); // show
       showStep(2); // show step2

    }catch(error){
     //** TODO: show an error modal */
     console.log(error);
    }finally{
        removeLoadingUiStep1();
    }

}

// function ot save reservation lock object json in localstorage after the step1 request
function saveDataInLocalStorage(key, value){
    localStorage.setItem(key, value);
}











// function to check the lock status in redis (user refreshes the step2 page)
export async function checkLockStatus(lockStatusDTO){
    const APIUrl = API.reservations.checkLockStatus;
    const option = {
        method: "GET",
        headers: {
            "Content-Type" : "application/json"
        }
    }
    try{

        const response = await fetch(`${APIUrl}?tableId=${lockStatusDTO.tableId}&date=${lockStatusDTO.date}&time=${lockStatusDTO.time}`, option);
        //const result = await response.json();

        console.log(response);
        // console.log(result)

        if(!response.ok){
            showStep(1);
            return;
        }

        // ✅ Update the URL bar without pushing new history
        showStep(2, false);

    }catch(error){
        console.log(error);
    }


}

// 
export async function submitSecondStepReservation(ReservationDetailsDTO, authIntent = "user"){
    const APIUrl = API.reservations.submitReservation;
    console.log("2ND STEP RESERVATION:")
   

    const submissionPayload = {
        reservationDetails: ReservationDetailsDTO
    }
     console.log(submissionPayload);

    if(authIntent === "guest"){
        submissionPayload.guestInfo = {

        }
    }

    try{

        // show loading ui step2
        showLoadingUiStep2();

        // simulate 2 secs delay
        await new Promise((resolve => setTimeout(resolve, 2000)));

        let response = await fetch(APIUrl, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "x-auth-intent": `${authIntent}`
            },
            body: JSON.stringify(submissionPayload)
        })

        let result;

        if(!response.ok){
                // Check if access token is missing or expired
                result = await response.json();
                console.log("🛑 AT expired or missing. Trying refresh...");
                console.log(result)

                if(result.message === "Access token is missing or expired." && result.status === 401){
                    console.log("🛑 AT expired or missing. Trying refresh...");
                    showLoadingUiStep2("Almost there..."); // show reauthenticating so user have an idea that access token is expired

                     // simulate 2 secs delay
                     await new Promise((resolve => setTimeout(resolve, 2000)));


                    // Try refresh
                    const refreshResponse = await fetch(API.authentication.refreshToken, {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                            "x-device-id": getDeviceIdFromCookie()
                        }
                    });

                    if(refreshResponse.ok){
                        console.log("🔁 Refresh success. Retrying original request...");

                        // Retry reservation submission
                        response = await fetch(APIUrl, {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                "Content-type" : "application/json",
                                "x-device-id" : getDeviceIdFromCookie()
                            },
                            body: JSON.stringify(submissionPayload)
                        });
                    }else{
                        console.warn("🚫 Refresh failed. Redirecting to login...");
                        //window.location.replace("../../pages/authentication/auth.html?authType=login");
                        showStep(3);
                        return;
                    }
                }
        }else{
            result = await response.json();
            console.log(result);
        }


    }catch(error){
        console.log(error);
    }finally{
        removeLoadingUiStep2();
    }
   





}

// export async function submitReservation(finalReservationSubmission){
//     const APIUrl = API.reservations.submitReservation;
//     console.log("test")
//     console.log(finalReservationSubmission);

//     const response = await authApi(APIUrl, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(finalReservationSubmission)
//     })

//     const result = await response.json();
   
//     // if(!response.ok){
//     //     const result = await response.json();
        
//     //     if(result.status === 401 && result.message === "Access token is missing or expired."){
//     //         // means no rt, at, device id inside the http only cookie = show login page
//     //         window.location.replace("../../pages/authentication/auth.html?authType=login");
//     //     }
//     // }

//     console.log(response);
//     console.log(result)


   



// }