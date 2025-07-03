import { API } from '../APIurl/api.js';
import { showStep } from '../reservation/reservation.js'

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
       showStep(2);

    }catch(error){
     //** TODO: show an error modal */
     console.log(error);
    }

}


function saveDataInLocalStorage(key, value){
    localStorage.setItem(key, value);
}



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


