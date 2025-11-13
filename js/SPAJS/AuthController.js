import { submitConfirmation } from "../reservation/reservationController.js";

export async function signup(name, email, phone, password, signupUrl){

        const response = await fetch(signupUrl, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                phoneNumber: phone 
            })
        })

        const result = await response.json();

        // check if the response is not successfull
        throwError(response, result);

        // proceed if reponses and results are good
        console.log(`Result ${result}`);
        return result;
}
/*
    "success": false,
    "statusCode": 409,
    "error": "USER_ALREADY_EXISTS",
    "message": "A user with this email already exists.",
    "timestamp": "2025-10-17T14:18:34.927186"
*/
export async function login(email, password, loginUrl, deviceId){

    const response = await fetch(loginUrl, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type" : "application/json",
            "x-device-id": deviceId
        },
        body: JSON.stringify({
            email: email,
            password: password
        }),
        
    })

    const result = await response.json();

    // check if the response is not successfull
    throwError(response, result);

    // proceed if reponses and results are good
    console.log(response)
    console.log(result);

    const pendingReservation = localStorage.getItem("pendingReservation");
    if(pendingReservation){
        sessionStorage.setItem("resumeReservation", "true");
        window.location.href = "/pages/reservation/reservation.html?step=2";
        console.log("afjaf")
        return result;
    }

    return result;
}

export function throwError(response, result){
    if(!response.ok || !result.success){
        const err = new Error(result.message || 'Something went wrong'); // e.g., A user with this email already exists.
        err.status = result.statusCode; // e.g., 409
        err.code = result.error; //  e.g., USER_ALREADY_EXISTS
        throw err;
    }
}

export async function getAuthStatus(AuthMeUrl,refreshTokenUrl, deviceId){

    let result;

    const response = await fetch(AuthMeUrl, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type" : "application/json"
        }
    });
    console.log(response);

    if(!response.ok){
        console.log("Access token expired. Sending refresh to rotate")

        const response = await fetch(refreshTokenUrl, {
           method: "POST",
           credentials: "include",
           headers: {
            "Content-Type" : "application/json",
            "x-device-id": deviceId
           }
        });

        if(!response.ok){
            console.log(response);
            result = await response.json();
            return result;
        }

        result = await getAuthStatus(AuthMeUrl, refreshTokenUrl, deviceId);
        return result;
    }


    result = await response.json();
   


    return result;
}