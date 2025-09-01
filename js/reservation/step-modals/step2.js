
import { minusSVG, plusSVG } from '../../../components/svgs/svg.js'
import { ReservationDetailsDTO, UserPreferencesObject } from '../dto/reservationDTO.js';
import { submitSecondStepReservation } from '../reservationController.js';
import { getLockReservationStorage } from '../dto/reservationDTO.js';

// loading screen & darker background
let overlayStep2;
let screenLoadingUiStep2;
let loadingMessage;


function showStep2(){
    document.getElementById("step2").classList.add("show");
}

function removeStep2(){
    document.getElementById("step2").classList.remove("show");
}



export function loadStep2(){
    showStep2();
    initGlobalVars();
    initUserPreferences();
    initSubmitBtn();
}

function initGlobalVars(){


    // overlay (darker bg, screen loader, message) for step2
    overlayStep2 = document.querySelectorAll(".overlay-bg")[1];
    screenLoadingUiStep2 = document.querySelectorAll(".loading-modal")[1];
    loadingMessage = screenLoadingUiStep2.querySelector("p");
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


    // make the button persistent wehn it is clicked
    const [occasionButtons, dietaryButtons] = [
        occasion.querySelectorAll("button"),
        dieatary.querySelectorAll("button")
    ]

    occasionButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.toggle("active");
            /**
             * TODO: add to the object the selected buttons for users preferences
             * **/
            saveButtonPreferences(UserPreferencesObject.occasion, btn.textContent.trim());
            console.log(btn.textContent);

        });
    })

    dietaryButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.toggle("active");
            /**
             * TODO: add to the object the selected buttons for users preferences
             * **/
            saveButtonPreferences(UserPreferencesObject.dietary, btn.textContent.trim());
            console.log(btn.textContent);
        });
    })

}


function saveButtonPreferences(arrayObject, buttonTxt){
    const index = arrayObject.indexOf(buttonTxt);

    if(index === -1){
        arrayObject.push(buttonTxt);
    }else{
        arrayObject.splice(index, 1);
    }
}

function initSubmitBtn(){
    const submitSecondStepBtn = document.getElementById("Send-second-tep-btn");
    submitSecondStepBtn.addEventListener("click", () => {

        // save the message 
        const messageEL = document.getElementById("message-input");

        const messageInput = messageEL.value?.trim() || "";


        UserPreferencesObject.message = messageInput;


        if(messageInput.length > 0){
            console.log("Message provided: ", messageInput);
            UserPreferencesObject.message = messageInput
        }else{
            console.log("No message was written by the user.");
            UserPreferencesObject.message = "";
        }
     
        const occasions = UserPreferencesObject.occasion;
        const dietary = UserPreferencesObject.dietary;
        const message = UserPreferencesObject.message;

        if(occasions.length === 0){
            console.log("User didn't click any occasion preferences.")
        }
        if(dietary.length === 0){
            console.log("User didn't click any dietary preferences.")
        }

        for (let index = 0; index < occasions.length; index++) {
            console.log(`Special Occasion: ${occasions[index]}`);
        }

        for (let index = 0; index < dietary.length; index++) {
            console.log(`Dietary Restriction: ${dietary[index]}`);
        }



        // get the reservation lock object
        const reservationLock = getLockReservationStorage();

        /**
         * TODO:
         *      - add check validation  for reservationLock
         *      - if timer stopped 0:00 means reservation lock is expired button shoudl be disabled and
         *        tell user reservation lock is no longer held and please make a new one  
         *          
         * **/

        //console.log(reservationLock);
        ReservationDetailsDTO.date = reservationLock.reservationDTO.date;
        ReservationDetailsDTO.time = reservationLock.reservationDTO.time;
        ReservationDetailsDTO.guestCount = reservationLock.reservationDTO.guestCount;
        ReservationDetailsDTO.tableId = reservationLock.tableId;
        ReservationDetailsDTO.tableName = reservationLock.tableName;
        ReservationDetailsDTO.occasion = [...UserPreferencesObject.occasion];
        ReservationDetailsDTO.dietary = [...UserPreferencesObject.dietary];
        ReservationDetailsDTO.message = UserPreferencesObject.message;


        submitSecondStepReservation(ReservationDetailsDTO);

    });
}


export function cleanUpStep2(){


    // // (Optional) Clear selected preferences or reset UI if needed
    // UserPreferencesObject.occasion = [];
    // UserPreferencesObject.dietary = [];
    // UserPreferencesObject.message = "";
}

export function showLoadingUiStep2(message = "Finalizing your reservation..."){
    overlayStep2.classList.add("show");
    screenLoadingUiStep2.classList.add("show");
    loadingMessage.textContent = message;
}

export function removeLoadingUiStep2(){
    overlayStep2.classList.remove("show");
    screenLoadingUiStep2.classList.remove("show");
    loadingMessage.textContent = ""; // Reset text
}