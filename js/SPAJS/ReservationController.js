import { getDeviceIdFromCookie, NewAPI,} from "../APIurl/api.js";
import { throwError } from "./AuthController.js";


export async function fetchPastApi(page){
    const url = NewAPI.userDashboard.pastReservations;

    const object = {
        method: "GET",
        credentials: "include",
        header: {
            "Content-type" : "application/json",
            "x-device-id" : getDeviceIdFromCookie()
        }
    }

    const response = await fetch(`${url}?page=${page}&size=8`, object);
    const result = await response.json();
    console.log(response);
    console.log(result);

    throwError(response, result);

    return result.data;
}

export async function fetchUpcomingApi(page){
    const url = NewAPI.userDashboard.upcomingReservations;

    const object = {
        method: "GET",
        credentials: "include",
        header: {
            "Content-type" : "application/json",
            "x-device-id" : getDeviceIdFromCookie()
        }
    }


    const response = await fetch(`${url}?page=${page}&size=8`, object);
    const result = await response.json();
    console.log(response);
    console.log(result);

    throwError(response, result);

    return result.data;
}


export async function cancelReservation(reservationId){

    const url = NewAPI.userDashboard.cancelReservation;

    const object = {
        method: "POST",
        credentials: "include",
        header: {
            "Content-type" : "application/json",
            "x-device-id" : getDeviceIdFromCookie()
        }
    }

    const response = await fetch(`${url}?id=${reservationId}`, object);
    const result = await response.json();
    console.log(response);
    console.log(result);

    throwError(response, result);

    return result.data;

}

export async function viewDetailsReservation(reservationId){
    const url = NewAPI.userDashboard.viewDetails;

    const object = {
        method: "GET",
        credentials: "include",
        header: {
            "Content-type" : "application/json",
        }
    }

    const response = await fetch(`${url}?id=${reservationId}`, object);
    const result = await response.json();
    console.log(response);
    console.log(result);

    throwError(response, result);

    return result.data;
}