export const ReservationFirstStep = {
    date: "",
    time: "",
    partySize: 0
}

export const UserPreferencesObject = {
    occasion: [],
    dietary: [],
    message: ``
}

export const ReservationDetailsDTO = {
    date: "",               // from reservationDTO.date
    time: "",               // from reservationDTO.time
    guestCount: 0,          // from reservationDTO.guestCount
    tableId: null,          // from Redis lock response
    tableName: "",          // optional: for frontend display
    occasion: [],           // from step 2
    dietary: [],            // from step 2
    message: "",            // from step 2
}


export function getLockReservationStorage(){
    return JSON.parse(localStorage.getItem("reservation-lock"));
}