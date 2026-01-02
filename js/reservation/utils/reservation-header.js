
// reservation lock object in localstorage and timer

let timeInterval = null;



export function initReservationSummary(){
showReservationHeader();
const reservationLockJson = JSON.parse(localStorage.getItem("reservation-lock"));

console.log(reservationLockJson.data)

    if(reservationLockJson){
        // const reservation = {
        //     date: reservationLockJson.reservationDTO.date,
        //     time: reservationLockJson.reservationDTO.time,
        //     guests: reservationLockJson.reservationDTO.guestCount
        // }
        const dateObj = new Date(reservationLockJson.data.reservationStart);

        // e.g Wed, 2 Jul
        // e.g 11:00 AM
        // e.g 2 guests
        const formattedDate = formatDate(dateObj);
        // e.g 11:00 AM
        const formattedTime = formatTime(dateObj);
        // init the reservation info (date, time, guest count)
        initReservationInfo(formattedDate, formattedTime, reservationLockJson.data.partySize);

        // init reservation lock timer
        //initTimer(reservationLockJson);
      
        console.log(formattedDate);
        console.log(formattedTime);
    }else{
       console.log("Reservation localstorage is empty.")
    }
}

function initReservationInfo(formattedDate, formattedTime, guestCount){
   const reservationInfoContainer = document.querySelector(".reservation-info");

     // Clear existing children (optional but helpful for re-rendering)
  reservationInfoContainer.innerHTML = '';

   const date = document.createElement("span");
   date.textContent = formattedDate;

   const circle1 = document.createElement("div");
   circle1.classList.add('circle');

   const time = document.createElement("span");
   time.textContent = formattedTime;

   const circle2 = document.createElement("div");
   circle2.classList.add('circle');

   const guest = document.createElement("span");
   let guestCountString;
   if(guestCount > 1){
    guestCountString = `${guestCount} guests`;
   }else{
      guestCountString = `${guestCount} guest`;
   }
   guest.textContent = guestCountString;


   [date, circle1, time, circle2, guest].forEach(el => {
    reservationInfoContainer.appendChild(el);
   })

}

function formatDate(dateObj){
    return new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    }).format(dateObj);
}

function formatTime(dateObj){
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(dateObj);
}


// // Format for UI:
// const date = new Date(lock.reservationStart);
// const formattedDate = date.toLocaleDateString('en-US', {
//   weekday: 'short', day: 'numeric', month: 'short'
// });
// const formattedTime = date.toLocaleTimeString('en-US', {
//   hour: 'numeric', minute: '2-digit', hour12: true
// });


function initTimer(reservationLockJson){

    const expiresAt = reservationLockJson.expiresAt;
    const time = 5 * 1000;
    //const expiration = new Date(Date.now()+ time);
    const expiration = new Date(expiresAt);   

    timeInterval = setInterval(() =>{
        const now = new Date();
        const diff = expiration - now;

        const totalSeconds = Math.max(0, Math.floor(diff / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);

        if (totalSeconds <= 0) {
            // TODO: 
            //  1. show a message or unlock the UI here
            //  2. remove data form the localstorage
            //  3. nagvigate user back to step 1  
            
            cleanUpTimer();
            localStorage.removeItem("reservation-lock");
        }

        displayTimer(minutes, seconds);

    },1000)

}

function displayTimer(minutes, seconds){
    //console.log(`${minutes}:${seconds}`);
    const timerDiv = document.querySelector(".timer");
    timerDiv.classList.add("show");

    const spanTimer = timerDiv.querySelector("span");
    spanTimer.textContent = "";

    spanTimer.textContent = `${minutes}:${String(seconds).padStart(2,"0")}`;

    timerDiv.appendChild(spanTimer);
}


export function showReservationHeader(){
cleanUpTimer();
  document.getElementById("reservation-header").classList.add("show");
}

export function removeReservationHeader(){
  cleanUpTimer();
  document.getElementById("reservation-header").classList.remove("show");
}

export function cleanUpTimer(){
    if (timeInterval !== null) {
        clearInterval(timeInterval);
        timeInterval = null;
        console.log("⏰ Timer expired");
        console.log("🧹 Step 2 timer cleared.");
    }
}



