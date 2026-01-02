import { API, getDeviceIdFromCookie, authApi, NewAPI} from '../APIurl/api.js';
import { showStep } from '../reservation/reservation.js'
import { showLoadingUiStep1, removeLoadingUiStep1} from '../reservation/step-modals/step1.js';
import { showLoadingUiStep2,removeLoadingUiStep2 } from '../reservation/step-modals/step2.js';
import { showLoadingUiStep3, removeLoadingUiStep3 } from './step-modals/step3.js';
import { openSuccess } from './step-modals/success.js';
import { initReservationSummary, showReservationHeader, removeReservationHeader } from "./utils/reservation-header.js";




// first step fetch request 
export async function sendFirstStepReservation(ReservationFirstStep){
    console.log(`Date: ${ReservationFirstStep.date}\nTime: ${ReservationFirstStep.time}\nGuests: ${ReservationFirstStep.guestCount}`)
    
    const APIUrl = NewAPI.reservations.searchRequest;
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
        console.log(response);

        if(!response.ok){
            throw new Error(result.message);
        }

        const result   = await response.json();
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

       //save the reservation lock data in localstorage
       saveDataInLocalStorage("reservation-lock", JSON.stringify(result));
       //if user succeeded to get a reservation lock proceed to step 2

       initReservationSummary(); // show
       showStep(2); // show step2

    }catch(error){
     //** TODO: show an error modal */
     console.log(error);
    }finally{
        removeLoadingUiStep1();
    }

}

// function to save reservation lock object json in localstorage after the step1 request
function saveDataInLocalStorage(key, value){
    localStorage.setItem(key, value);
}

// function to check the lock status in redis (user refreshes the step2 page)
export async function checkLockStatus(tableId, start){

    const APIUrl = NewAPI.reservations.status;
    const option = {
        method: "GET",
        headers: {
            "Content-Type" : "application/json"
        }
    }
    try{

        // const response = await fetch(`${APIUrl}?tableId=${lockStatusDTO.tableId}&date=${lockStatusDTO.date}&time=${lockStatusDTO.time}`, option);
        const response = await fetch(`${APIUrl}?tableId=${tableId}&start=${start}`, option);
        //const result = await response.json();
        console.log(response);
        const result = await response.text();
         console.log(result)

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

export async function submitGuestConfirmation(reservationDto, guestInfo){
    let payload = {
        reservationDetails: reservationDto,
        guestInfo: guestInfo
    };
    const guestConfirmationUrl = NewAPI.reservations.submitAsGuest;

    try{
        showLoadingUiStep3("Almost there! We’re processing your reservation as a guest.");
        const response = await fetch(guestConfirmationUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const result = await response.json();

    console.log(response);
    console.log(result);

    }catch(error){

    }finally{
        removeLoadingUiStep3();
    }
}


export async function submitConfirmation(reservationDto, guestInfo = null){
    // Base payload (for logged-in users or default case)
    let payload = {
        reservationDetails: reservationDto,
        guestInfo: guestInfo ?? null
    };

    const deviceId = getDeviceIdFromCookie()
    const API = {
        me: NewAPI.auth.me,
        refresh: NewAPI.auth.refresh,
        confirm: NewAPI.reservations.submitSecondStep
    }

    // show loading ui step2
    showLoadingUiStep2("Submitting...");
    console.log("Submitting...")

    // 1. Preflight auth check
    console.log("Auth Pre-flight check")
    let isLoggedIn = false;
    let meResp = await fetch(API.me, {method: "GET", credentials: "include", headers: { "Content-Type" : "application/json"}});

    if(!meResp.ok){
        // try refresh once
        showLoadingUiStep2("Hold on...");
        console.log("Hold on...")
        console.log("Access token expired. Sending Refresh...")
        const refreshResp = await fetch(API.refresh, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type" : "application/json",
                "x-device-id": deviceId
            }
        });

        isLoggedIn = refreshResp.ok;
    }else{
        isLoggedIn = true;
    }

    // if user is logged in no need for guest object
    const doConfirm = async () => fetch(API.confirm,{
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })


    showLoadingUiStep2("Finalizing your reservation...");
    console.log("Finalizing your reservation...")
    let confirmResp = await doConfirm();

    if(confirmResp.status === 401){
         const r = await fetch(API.refresh, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type" : "application/json",
                "x-device-id": deviceId
            }
        });

        showLoadingUiStep2("In a few moments..");
         console.log("In a few moments..")
        if(r.ok) {
            await doConfirm();
        }
    }

    if(confirmResp.status === 404){
        showStep(1); // your UI
    }

    //handle any failure *after* the single retry
    if(!confirmResp.ok){
        const err = await safeJson(confirmResp);
        // show login modal if unauth; otherwise show error toast
        if (confirmResp.status === 401 || confirmResp.status === 403) {
        showStep(3); // your UI
        } else {
        //showError(err?.message || 'Failed to confirm reservation.');
        console.log(err?.message || 'Failed to confirm reservation.')
        }
        return;
    }

     // 4) Success
    removeLoadingUiStep2();
    const ok = await confirmResp.text();
    console.log(confirmResp)
    //clearReservationLockUI(); // stop timer + localStorage remove
    //showSuccess(ok); // render confirmation
    localStorage.removeItem("pendingReservation");
    localStorage.removeItem("reservation-lock");
    sessionStorage.removeItem("resumeReservation");

    openSuccess({
        message: "We’ve sent your reservation details to your email.",
        ref: "IG-45892"
    });
}

async function safeJson(res) { 
    try { 
        return await res.json(); 
    } catch { 
        return null;
    }
}

export async function submitSecondStepReservation(ReservationDetailsDTO, authIntent = "user"){
    const APIUrl = NewAPI.reservations.submitSecondStep;
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
                    const refreshResponse = await fetch(NewAPI.auth.refresh, {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                            "x-device-id": getDeviceIdFromCookie()
                        }
                    });

                    if(!refreshResponse.ok){
                        console.warn("🚫 Refresh failed. Redirecting to login...");
                        //window.location.replace("../../pages/authentication/auth.html?authType=login");
                        showStep(3);
                        return;
                    }

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