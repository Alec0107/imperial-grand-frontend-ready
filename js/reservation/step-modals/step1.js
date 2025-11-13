import { sendFirstStepReservation } from '../../reservation/reservationController.js'
import { calendarDateFormatter } from '../../reservation/utils/formatter.js';
import { ReservationFirstStep } from '../../reservation/dto/reservationDTO.js';

// loading screen & darker background
let overlayStep1;
let screenLoadingUiStep1;
let loadingMessage;

// calendar global vars
let daysContainer;
let prevMonthSelector;
let nextMonthSelector;
let currentYear;
let currentMonth;
let yearMonthTag;
let currentDay;

// dropdown global vars
let isGuestDropDownOpen = false;
let isTimeDropDownOpen = false;

let guestDropdown;
let timeDropdown;

let guestOptions;
let timeOptions;


// to set the span of users preferred li from the dropdown
let guestSpan;
let timeSpan;

let sendFirstStepBtn;

export function loadStep1(){
    document.getElementById("step1").classList.add("show");

    initGlobalVars();
    initCurrentCalendarDate();
    initMonthSelector();

    initNumberOfGuestSelector();
    initTimeSelector();

    initSendFirstStep();
}

function initGlobalVars(){
    daysContainer = document.getElementById("calendar-days");
    prevMonthSelector  = document.querySelector(".prev-month");
    nextMonthSelector  = document.querySelector(".next-month");
    yearMonthTag = document.querySelector(".year-month");

    guestDropdown = document.getElementById("guest-dropdown");
    timeDropdown = document.getElementById("time-dropdown");
    guestOptions = document.querySelectorAll(".options")[0]; // first options which is the guest number options
    timeOptions = document.querySelectorAll(".options")[1]; // second options which is the time options

    // span to show the users preffered choices from the dropdown
    guestSpan = guestDropdown.querySelector("span"); 
    timeSpan  = timeDropdown.querySelector("span");

    // button to send the first step of the reservation (date, time, number of guest) and backend process and check table and slots availability
    sendFirstStepBtn = document.getElementById("SendFirstStep-btn");

    // overlay (darker bg, screen loader, message) for step1
    overlayStep1 = document.querySelectorAll(".overlay-bg")[0];
    screenLoadingUiStep1 = document.querySelectorAll(".loading-modal")[0];
    loadingMessage = screenLoadingUiStep1.querySelector("p");
}

function initCurrentCalendarDate(){
    const date = new Date();
    currentYear = date.getFullYear();
    currentMonth = date.getMonth();
    renderCalendar(currentYear, currentMonth);
    setMonthYearString(currentYear, currentMonth);
}

function initMonthSelector(){
    prevMonth();
    nextMonth();
}


function renderCalendar(year, month){
    const date = new Date();
    const dateNow = date.getDate();
    const monthNow = date.getMonth();
    const yearNow = date.getFullYear();

    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();

    daysContainer.innerHTML = "";

    for(let i = 0; i < firstDay; i++){
        const empty = document.createElement("div");
        empty.classList.add("day", "empty");
        daysContainer.appendChild(empty);
    }

    for(let i = 1; i <= lastDay; i++){
        const day = document.createElement('div');
        day.innerText = i;
        day.classList.add("day", "font");

        if(i < dateNow && (currentMonth === monthNow && currentYear === yearNow)){
            day.classList.add("past-days")
        }else if(i === dateNow && currentMonth === monthNow){
            day.classList.add("selected-day", "active-days");
            day.setAttribute("data-number", i); 
            ReservationFirstStep.date = calendarDateFormatter(i, currentMonth, currentYear); // initally set the Reservation date to the current date
            addListenerToFutureDays(day);
        }else{
           day.classList.add("future-days", "active-days");
           day.setAttribute("data-number", i); 
           addListenerToFutureDays(day);
        }

        daysContainer.appendChild(day);
    }

}


function addListenerToFutureDays(day){
    day.addEventListener("click", function() {

       document.querySelectorAll(".active-days").forEach((dayEl) => {
         dayEl.classList.remove("selected-day");
       });

       this.classList.add("selected-day");

       currentDay = this.dataset.number;
       ReservationFirstStep.date = calendarDateFormatter(currentDay, currentMonth, currentYear);
       console.log(ReservationFirstStep.date);
    });
}



function prevMonth(){
    prevMonthSelector.addEventListener("click", () =>{
        const date = new Date();
        const todayMonth = date.getMonth();
        const todayYear= date.getFullYear();

        const canGoBack = currentYear > todayYear || (currentYear === todayYear && currentMonth > todayMonth);

        if(canGoBack){
            currentMonth--;
            if(currentMonth < 0){
                currentMonth = 11;
                currentYear--;
             }
        }
    
        renderCalendar(currentYear, currentMonth);
        setMonthYearString(currentYear, currentMonth);
    });
}

function nextMonth(){
    nextMonthSelector.addEventListener("click",() =>{
        const date = new Date();
        const todayMonth = date.getMonth();
        const todayYear= date.getFullYear();

        let maxMonth = todayMonth + 2;
        let maxYear = todayYear;

        if(maxMonth > 11){
            maxMonth = maxMonth % 12
            maxYear += 1;
        }

        const canGoNext = currentYear < maxYear || (currentYear === maxYear && currentMonth < maxMonth);

        if(canGoNext){
            currentMonth++;
            if(currentMonth > 11){
                currentMonth = 0;
                currentYear++;
            }
        }
     
        renderCalendar(currentYear, currentMonth);
        setMonthYearString(currentYear, currentMonth);
    });
}


function setMonthYearString(year, month){
    const monthString = new Date(year, month).toLocaleDateString("default", {
        month: "short"
    })

    yearMonthTag.textContent = `${monthString} ${currentYear}`;
}

// function for dropdowns (number of guest, time)
// function for guest rop down
function initNumberOfGuestSelector(){
    guestDropdown.addEventListener("click", ()=>{
        if(!isGuestDropDownOpen){
            openGuestDropdown();
        }else{
            closeGuestDropdown();
        }
    });
}


function openGuestDropdown(){
    guestDropdown.querySelector(".dropdown-arrow").classList.add("rotate");
    const ulOptionsGuest = guestDropdown.querySelector(".options");
    ulOptionsGuest.classList.add("open");
    iterateListOfGuestNumber();
    isGuestDropDownOpen = true;
}

function closeGuestDropdown(){
    guestDropdown.querySelector(".dropdown-arrow").classList.remove("rotate");
    const ulOptionsGuest = guestDropdown.querySelector(".options");
    ulOptionsGuest.classList.remove("open");
    isGuestDropDownOpen = false;
}

function iterateListOfGuestNumber(){
    guestOptions.querySelectorAll("li").forEach((liEl) => {
        liEl.addEventListener("click", function(){
            const guest = this.getAttribute("data-value");
            ReservationFirstStep.partySize = guest; 
            guestSpan.textContent = liEl.textContent;
            console.log(`Guest: ${guest}`);
        })
    });
}



// function for time drop down
function initTimeSelector(){    
    timeDropdown.addEventListener("click", ()=>{
        if(!isTimeDropDownOpen){
            openTimeDropdown();
        }else{
            closeTimeDropdown();
        }
    });
}


function openTimeDropdown(){
    timeDropdown.querySelector(".dropdown-arrow").classList.add("rotate");
    const ulOptionsGuest = timeDropdown.querySelector(".options");
    ulOptionsGuest.classList.add("open");
    iterateListOfTime();
    isTimeDropDownOpen = true;
}

function closeTimeDropdown(){
     timeDropdown.querySelector(".dropdown-arrow").classList.remove("rotate");
    const ulOptionsGuest = timeDropdown.querySelector(".options");
    ulOptionsGuest.classList.remove("open");
    isTimeDropDownOpen = false;
}

// a fucntion that adds listerner to ecah li elements in the time dropdown and set ReservationFirstSte time to user's preffered time
function iterateListOfTime(){
    timeOptions.querySelectorAll("li").forEach((liEl) => {
        liEl.addEventListener("click", function(){
            const time = this.getAttribute("data-value");
            ReservationFirstStep.time = time;
            timeSpan.textContent = timeFormatter(time);
            console.log(`Time: ${time}`);
        })
    });
}


function timeFormatter(time){
    const [h, m] = time.split(":")
    const hour = parseInt(h);
    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = ((hour + 11) % 12 + 1);
    return `${formattedHour}:${m} ${suffix}`;
}


function initSendFirstStep(){
    sendFirstStepBtn.addEventListener("click", ()=>{
        sendFirstStepReservation(ReservationFirstStep);
    })
}



export function showLoadingUiStep1(message = "Securing your reservation..."){
    overlayStep1.classList.add("show");
    screenLoadingUiStep1.classList.add("show");
    loadingMessage.textContent = message;
}

export function removeLoadingUiStep1(){
    overlayStep1.classList.remove("show");
    screenLoadingUiStep1.classList.remove("show");
    loadingMessage.textContent = ""; // Reset text
}

