import { minusSVG,
         plusSVG
} from '../../../components/svgs/svg.js'

let reservationLockJson;


export function loadStep2(){
    initGlobalVars();
    initReservationSummary();
    initUserPreferences();
    document.getElementById("step2").classList.add("show");
}

function initGlobalVars(){
    reservationLockJson = JSON.parse(localStorage.getItem("reservation-lock"));
}


function initReservationSummary(){
  
    if(reservationLockJson){
        const reservation = {
            date: reservationLockJson.reservationDTO.date,
            time: reservationLockJson.reservationDTO.time,
            guests: reservationLockJson.reservationDTO.guestCount
        }

        const dateTimeString = `${reservation.date}T${reservation.time}`;
        const dateObj = new Date(dateTimeString);

        // e.g Wed, 2 Jul
        const formattedDate = formatDate(dateObj);
        // e.g 11:00 AM
        const formattedTime = formatTime(dateObj);
        // init the reservation info (date, time, guest count)
        initReservationInfo(formattedDate, formattedTime, reservation.guests);

        // init reservation lock timer
        initTimer();


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



function initTimer(){
    const expiresAt = reservationLockJson.expiresAt;
    const time = 5 * 1000;
    //const expiration = new Date(Date.now()+ time);
    const expiration = new Date(expiresAt);   

    const interval = setInterval(() =>{
        const now = new Date();
        const diff = expiration - now;

        const totalSeconds = Math.max(0, Math.floor(diff / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);

        if (totalSeconds <= 0) {
            clearInterval(interval);
            console.log("⏰ Timer expired");
            // TODO: 
            //  1. show a message or unlock the UI here
            //  2. remove data form the localstorage
            //  3. nagvigate user back to step 1  
            localStorage.removeItem("reservation-lock");

        }

        displayTimer(minutes, seconds);

    },1000)

}

function displayTimer(minutes, seconds){
    console.log(`${minutes}:${seconds}`);
    const timerDiv = document.querySelector(".timer");
    timerDiv.classList.add("show");

    const spanTimer = timerDiv.querySelector("span");
    spanTimer.textContent = "";

    spanTimer.textContent = `${minutes}:${String(seconds).padStart(2,"0")}`;

    timerDiv.appendChild(spanTimer);
}

function initUserPreferences(){
    const isShowingPlus = [];
    const iconWrappers = document.querySelectorAll(".icon-wrapper");
    const occasion = document.querySelector(".occasion-options");
    const dieatary = document.querySelector(".dietary-options");
    const txtBox = document.querySelector(".text-input");

    iconWrappers.forEach((wrapper, index) => {
       isShowingPlus.push(true); // flag
       wrapper.addEventListener("click", ()=>{

        // show the user preferences choices
        [occasion, dieatary, txtBox][index].classList.toggle("show");

        // change the svg(plus/minus) and keep the background circle
        
        wrapper.innerHTML = `
            <div class="circle-bg"></div>
            ${isShowingPlus[index] ? minusSVG : plusSVG}`;
    
        isShowingPlus[index] = !isShowingPlus[index];
       })
    })



}